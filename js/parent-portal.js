/**
 * NutriLearn - Parent & Caregiver Portal Logic
 */

class ParentPortal {
  constructor() {
    this.container = document.getElementById('parent-view');
    this.selectedChild = null;
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  init() {
    this.loadChildData();
    this.render();
  }

  loadChildData() {
    const myChildren = window.storageService.getChildrenForCurrentUser();
    const childId = window.storageService.getSelectedChildId();
    let child = myChildren.find(c => c.id === childId);
    if (!child && myChildren.length > 0) {
      child = myChildren[0];
      window.storageService.setSelectedChildId(child.id);
    }
    this.selectedChild = child || null;
  }

  render() {
    if (!this.container) return;
    this.loadChildData();
    const child = this.selectedChild;
    const currentUser = window.storageService.getCurrentUser() || { name: 'Parent', phone: 'N/A' };
    const myChildren = window.storageService.getChildrenForCurrentUser();

    // If no child is registered yet for this parent
    if (!child) {
      this.container.innerHTML = `
        <div class="card" style="text-align:center; padding:32px 16px;">
          <div style="font-size:3rem; margin-bottom:8px;">👶</div>
          <h2 style="font-family:var(--font-display); font-size:1.25rem; font-weight:800; margin-bottom:6px;">Welcome, ${currentUser.name}!</h2>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:18px;">
            You have not registered your baby's nutrition profile yet. Register your child now to start tracking growth, meals, and learning.
          </p>
          <button class="btn btn-primary btn-block" onclick="window.parentPortal.openAddBabyModal()">
            + Register My Baby
          </button>
        </div>
      `;
      return;
    }

    const dailyLogs = window.storageService.getDailyLogs(child.id, this.currentDate);
    const modules = window.storageService.getModules();
    const recipes = window.storageService.getRecipes();

    // Calculate weight gain & progress percentage
    const weightGain = (child.currentWeight - child.initialWeight).toFixed(1);
    const totalNeeded = (child.targetWeight - child.initialWeight) || 1;
    const currentProgress = Math.min(100, Math.max(0, Math.round(((child.currentWeight - child.initialWeight) / totalNeeded) * 100)));

    const statusBadgeClass = {
      'SAM': 'badge-sam',
      'MAM': 'badge-mam',
      'IMPROVING': 'badge-improving',
      'RECOVERED': 'badge-recovered'
    }[child.status] || 'badge-mam';

    this.container.innerHTML = `
      <!-- Multiple Children Switcher (if parent has > 1 child) -->
      ${myChildren.length > 1 ? `
        <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px;">
          ${myChildren.map(c => `
            <button class="btn btn-sm ${c.id === child.id ? 'btn-primary' : 'btn-secondary'}" onclick="window.parentPortal.selectMyChild('${c.id}')" style="white-space:nowrap;">
              👶 ${c.name} (${c.ageMonths}m)
            </button>
          `).join('')}
          <button class="btn btn-sm btn-secondary" onclick="window.parentPortal.openAddBabyModal()" title="Add another child">
            + Add Child
          </button>
        </div>
      ` : ''}

      <!-- Child Profile & Hero Card -->
      <div class="hero-profile-card">
        <div class="profile-top">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h2 class="profile-child-name">${child.name}</h2>
            </div>
            <div class="profile-details">
              ${child.ageMonths} Months • ${child.gender} • ${child.community}
            </div>
            <div style="font-size:0.72rem; opacity:0.85; margin-top:2px;">
              Caregiver: <strong>${child.parentName}</strong>
            </div>
          </div>
          <span class="badge-status ${statusBadgeClass}">${child.status}</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px; margin: 12px 0 8px 0; background:rgba(0,0,0,0.15); padding:8px 10px; border-radius:10px; font-size:0.75rem;">
          <div>
            <div style="opacity:0.8;">Current Weight</div>
            <div style="font-size:1.1rem; font-weight:800;">${child.currentWeight} kg</div>
            <div style="font-size:0.68rem; color:#a7f3d0;">+${weightGain >= 0 ? weightGain : 0} kg gain</div>
          </div>
          <div>
            <div style="opacity:0.8;">Target Weight</div>
            <div style="font-size:1.1rem; font-weight:800;">${child.targetWeight} kg</div>
            <div style="font-size:0.68rem; opacity:0.85;">Goal for age</div>
          </div>
          <div>
            <div style="opacity:0.8;">Arm MUAC</div>
            <div style="font-size:1.1rem; font-weight:800;">${child.currentMuac} mm</div>
            <div style="font-size:0.68rem; ${child.currentMuac >= 125 ? 'color:#a7f3d0;' : 'color:#fde047;'}">
              ${child.currentMuac >= 125 ? 'Normal (Green)' : 'At Risk (Yellow)'}
            </div>
          </div>
        </div>

        <div class="recovery-progress-box">
          <div class="progress-labels">
            <span>Recovery Journey</span>
            <span>${currentProgress}% Completed</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${currentProgress}%;"></div>
          </div>
        </div>
      </div>

      <!-- Prescribed Diet Alert by Assigned CHW -->
      <div class="card" style="border-left: 4px solid var(--primary); background: #f0fdfa;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <span style="font-size:1.1rem;">🩺</span>
          <strong style="font-size:0.85rem; color:var(--primary-dark);">Assigned Health Worker: ${child.chwAssigned}</strong>
        </div>
        <p style="font-size:0.8rem; color:#134e4a;"><strong>Dietary Plan:</strong> ${child.prescribedDiet}</p>
        ${child.notes ? `<p style="font-size:0.75rem; color:#0f766e; margin-top:4px; font-style:italic;">"${child.notes}"</p>` : ''}
      </div>

      <!-- Daily Nutrition & Feeding Checklist -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>📋</span> Today's Feeding Checklist</h3>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <p class="card-subtitle">Check off meals and vitamins given to ${child.name.split(' ')[0]} today:</p>
        
        <div class="checklist" id="daily-checklist">
          <div class="check-item ${dailyLogs.breakfast ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'breakfast')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.breakfast ? '✓' : ''}</div>
              <div>
                <div class="check-label">Breakfast: Super Porridge + Egg</div>
                <div class="check-time">Morning • High energy start</div>
              </div>
            </div>
          </div>

          <div class="check-item ${dailyLogs.morningSnack ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'morningSnack')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.morningSnack ? '✓' : ''}</div>
              <div>
                <div class="check-label">Mid-Morning Snack: Fruit / Peanut Puree</div>
                <div class="check-time">10:00 AM • Healthy calories & vitamins</div>
              </div>
            </div>
          </div>

          <div class="check-item ${dailyLogs.lunch ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'lunch')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.lunch ? '✓' : ''}</div>
              <div>
                <div class="check-label">Lunch: 4-Star Mixed Family Meal</div>
                <div class="check-time">12:30 PM • Legumes, greens & fish/meat</div>
              </div>
            </div>
          </div>

          <div class="check-item ${dailyLogs.afternoonSnack ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'afternoonSnack')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.afternoonSnack ? '✓' : ''}</div>
              <div>
                <div class="check-label">Afternoon Snack: Banana / Boiled Camote</div>
                <div class="check-time">3:30 PM • Extra nourishment</div>
              </div>
            </div>
          </div>

          <div class="check-item ${dailyLogs.dinner ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'dinner')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.dinner ? '✓' : ''}</div>
              <div>
                <div class="check-label">Dinner: Nutrient-Dense Soft Rice & Soup</div>
                <div class="check-time">6:30 PM • Warm, easy to digest</div>
              </div>
            </div>
          </div>

          <div class="check-item ${dailyLogs.vitamins ? 'completed' : ''}" onclick="window.parentPortal.toggleCheck('${child.id}', 'vitamins')">
            <div class="check-left">
              <div class="check-box">${dailyLogs.vitamins ? '✓' : ''}</div>
              <div>
                <div class="check-label">Micronutrient Drops / MNP Sachet / RUTF</div>
                <div class="check-time">Daily • Essential Iron & Vitamin A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive 4-Star Diet Plate Builder -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>🌟</span> Interactive 4-Star Diet Plate</h3>
        </div>
        <p class="card-subtitle">Tap each food group to build a complete recovery plate:</p>

        <div class="diet-plate-container">
          <div class="diet-plate-segment active" id="plate-star1" onclick="window.parentPortal.togglePlateStar('star1')">
            <div class="food-icon">🍚</div>
            <div class="food-title">Star 1: Staples</div>
            <div class="food-subtitle">Rice, Corn, Oats, Tubers</div>
          </div>

          <div class="diet-plate-segment active" id="plate-star2" onclick="window.parentPortal.togglePlateStar('star2')">
            <div class="food-icon">🥚</div>
            <div class="food-title">Star 2: Animal Protein</div>
            <div class="food-subtitle">Eggs, Fish, Liver, Poultry</div>
          </div>

          <div class="diet-plate-segment active" id="plate-star3" onclick="window.parentPortal.togglePlateStar('star3')">
            <div class="food-icon">🥜</div>
            <div class="food-title">Star 3: Legumes/Nuts</div>
            <div class="food-subtitle">Mung Beans, Peanuts, Tofu</div>
          </div>

          <div class="diet-plate-segment active" id="plate-star4" onclick="window.parentPortal.togglePlateStar('star4')">
            <div class="food-icon">🥬</div>
            <div class="food-title">Star 4: Veggies/Fruit</div>
            <div class="food-subtitle">Malunggay, Squash, Papaya</div>
          </div>
        </div>

        <div id="plate-feedback" style="background:#f0fdf4; border-radius:8px; padding:10px; font-size:0.8rem; color:#15803d; text-align:center; font-weight:600;">
          🌟 Perfect! All 4 Stars selected. This meal ensures rapid growth and disease immunity!
        </div>
      </div>

      <!-- E-Learning Lessons for Parents -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>📚</span> Nutrition Micro-Lessons</h3>
          <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">${child.completedModules ? child.completedModules.length : 0} of ${modules.length} Done</span>
        </div>
        <p class="card-subtitle">Evidence-based practical nutrition guides for home feeding:</p>

        <div class="module-grid">
          ${modules.map(mod => {
            const isCompleted = child.completedModules && child.completedModules.includes(mod.id);
            return `
              <div class="module-card" onclick="window.parentPortal.openModule('${mod.id}')">
                <div class="module-icon-box">${mod.icon}</div>
                <div class="module-info">
                  <div class="module-tag">${mod.category}</div>
                  <h4 class="module-title">${mod.title}</h4>
                  <div class="module-meta">
                    <span>⏱️ ${mod.duration}</span>
                    <span style="color:${isCompleted ? 'var(--secondary)' : 'var(--accent-warm)'}; font-weight:700;">
                      ${isCompleted ? '✓ Completed' : '• Tap to Learn'}
                    </span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Practical High-Nutrient Recipes -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>🍲</span> Affordable Recovery Recipes</h3>
        </div>
        <p class="card-subtitle">Nutrient-dense recipes made with affordable local ingredients:</p>

        <div>
          ${recipes.map(rec => `
            <div class="recipe-card" onclick="window.parentPortal.openRecipe('${rec.id}')">
              <div class="recipe-header-bar">
                <span class="recipe-name">${rec.title}</span>
                <span class="recipe-density-badge">${rec.tags[0]}</span>
              </div>
              <div class="recipe-body">
                <div class="recipe-ingredients">
                  <strong>Key items:</strong> ${rec.ingredients.slice(0, 3).join(', ')}...
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                  <span>⏱️ ${rec.prepTime}</span>
                  <span style="color:var(--secondary-dark); font-weight:700;">${rec.cost}</span>
                  <span style="color:var(--primary); font-weight:700;">View Recipe →</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Growth Chart & History -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>📈</span> Growth Recovery Chart</h3>
        </div>
        <p class="card-subtitle">Weight gain progression compared to age target:</p>

        <div class="chart-box">
          ${this.renderGrowthSvg(child)}
        </div>

        <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; margin-top:8px;">
          <span>🟢 Target Line (${child.targetWeight}kg)</span>
          <span>🔵 Gained Progress (${child.currentWeight}kg)</span>
        </div>
      </div>

      <!-- Danger Signs Box -->
      <div class="warning-box">
        <div class="warning-box-title">
          <span>⚠️</span> Important: Malnutrition Red Flags
        </div>
        <div>If your child develops swollen feet, cannot drink, or has repeated vomiting, contact CHW <strong>${child.chwAssigned.split(' ')[0]}</strong> immediately or visit the health center.</div>
      </div>
    `;
  }

  selectMyChild(childId) {
    window.storageService.setSelectedChildId(childId);
    this.loadChildData();
    this.render();
    if (this.selectedChild) {
      window.app.showToast(`Switched to profile for ${this.selectedChild.name}!`, 'info');
    }
  }

  openAddBabyModal() {
    const currentUser = window.storageService.getCurrentUser() || { name: 'Parent', phone: '0900-000-0000', community: 'Barangay San Isidro' };
    
    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">👶 Register Baby Profile</h2>
      <form onsubmit="window.parentPortal.handleSaveNewBaby(event)">
        <div class="form-group">
          <label class="form-label">Baby Full Name *</label>
          <input type="text" id="add-baby-name" class="form-input" required placeholder="e.g. Baby Gabriel Reyes" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Age (Months) *</label>
            <input type="number" id="add-baby-age" class="form-input" required min="1" max="59" value="12" />
          </div>
          <div class="form-group">
            <label class="form-label">Gender *</label>
            <select id="add-baby-gender" class="form-select">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Current Weight (kg) *</label>
            <input type="number" step="0.1" id="add-baby-weight" class="form-input" required value="7.2" />
          </div>
          <div class="form-group">
            <label class="form-label">MUAC Arm (mm)</label>
            <input type="number" id="add-baby-muac" class="form-input" value="120" />
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          💾 Save Baby Profile
        </button>
      </form>
    `);
  }

  handleSaveNewBaby(e) {
    e.preventDefault();
    const currentUser = window.storageService.getCurrentUser();
    if (!currentUser) return;

    const name = document.getElementById('add-baby-name').value;
    const ageMonths = parseInt(document.getElementById('add-baby-age').value);
    const gender = document.getElementById('add-baby-gender').value;
    const weight = parseFloat(document.getElementById('add-baby-weight').value);
    const muac = parseFloat(document.getElementById('add-baby-muac').value) || 120;

    let status = 'MAM';
    if (muac < 115) status = 'SAM';
    else if (muac >= 125) status = 'RECOVERED';

    const childId = 'child-' + Date.now().toString().slice(-4);
    const newChild = {
      id: childId,
      parentId: currentUser.id,
      name,
      ageMonths,
      gender,
      parentName: currentUser.name,
      parentContact: currentUser.phone || '0900-000-0000',
      community: currentUser.community || 'Barangay San Isidro',
      chwAssigned: 'Maria Santos (CHW #12)',
      status,
      initialMuac: muac,
      currentMuac: muac,
      initialWeight: weight,
      currentWeight: weight,
      height: 70 + (ageMonths * 0.5),
      edema: false,
      admissionDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      targetWeight: (weight * 1.2).toFixed(1),
      growthHistory: [
        { date: new Date().toISOString().split('T')[0], weight, muac, status }
      ],
      completedModules: [],
      prescribedDiet: '4-Star high-energy porridge with egg and malunggay leaves',
      notes: 'Parent registered baby profile.'
    };

    window.storageService.saveChild(newChild);

    // Update user's childIds
    const users = window.storageService.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) {
      if (!u.childIds) u.childIds = [];
      u.childIds.push(childId);
      localStorage.setItem('nutrilearn_users', JSON.stringify(users));
      window.storageService.setCurrentUser(u);
    }

    window.storageService.setSelectedChildId(childId);
    window.app.closeModal();
    this.init();
    window.app.updateHeaderProfile();
    window.app.showToast(`Baby ${name} registered successfully! 👶`, 'success');
  }

  renderGrowthSvg(child) {
    const history = child.growthHistory || [
      { date: 'Initial', weight: child.initialWeight },
      { date: 'Current', weight: child.currentWeight }
    ];

    const minWeight = 4.0;
    const maxWeight = 12.0;
    const width = 340;
    const height = 140;
    const padding = 25;

    const points = history.map((item, idx) => {
      const x = padding + (idx / Math.max(history.length - 1, 1)) * (width - 2 * padding);
      const normalizedY = (item.weight - minWeight) / (maxWeight - minWeight);
      const y = height - padding - normalizedY * (height - 2 * padding);
      return { x, y, weight: item.weight, date: (item.date || '').slice(5) };
    });

    const targetWeightNum = parseFloat(child.targetWeight) || (child.initialWeight * 1.2);
    const targetY = height - padding - ((targetWeightNum - minWeight) / (maxWeight - minWeight)) * (height - 2 * padding);

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; overflow:visible;">
        <!-- Target Line -->
        <line x1="${padding}" y1="${targetY}" x2="${width - padding}" y2="${targetY}" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4" />
        <text x="${width - padding}" y="${targetY - 5}" fill="#047857" font-size="10" text-anchor="end" font-weight="bold">Target ${child.targetWeight}kg</text>

        <!-- Baseline -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="1" />

        <!-- History Line -->
        <path d="${pathData}" fill="none" stroke="#0d9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- History Dots -->
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff" stroke="#0d9488" stroke-width="2.5" />
          <text x="${p.x}" y="${p.y - 8}" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">${p.weight}kg</text>
          <text x="${p.x}" y="${height - 8}" fill="#64748b" font-size="9" text-anchor="middle">${p.date}</text>
        `).join('')}
      </svg>
    `;
  }

  toggleCheck(childId, key) {
    const logs = window.storageService.getDailyLogs(childId, this.currentDate);
    logs[key] = !logs[key];
    window.storageService.saveDailyLog(childId, this.currentDate, logs);
    this.render();
    if (logs[key]) {
      window.app.showToast('Meal logged! Excellent progress for today! 🌟', 'success');
    }
  }

  togglePlateStar(starKey) {
    const el = document.getElementById(`plate-${starKey}`);
    if (el) {
      el.classList.toggle('active');
    }

    const s1 = document.getElementById('plate-star1')?.classList.contains('active');
    const s2 = document.getElementById('plate-star2')?.classList.contains('active');
    const s3 = document.getElementById('plate-star3')?.classList.contains('active');
    const s4 = document.getElementById('plate-star4')?.classList.contains('active');

    const count = [s1, s2, s3, s4].filter(Boolean).length;
    const feedback = document.getElementById('plate-feedback');
    if (feedback) {
      if (count === 4) {
        feedback.style.background = '#f0fdf4';
        feedback.style.color = '#15803d';
        feedback.innerHTML = '🌟 <strong>4-Star Complete:</strong> Full energy, protein, iron, and disease protection!';
      } else if (count >= 2) {
        feedback.style.background = '#fefce8';
        feedback.style.color = '#854d0e';
        feedback.innerHTML = `⭐ <strong>${count} Stars Selected:</strong> Good start! Try adding an egg or green leafy vegetables.`;
      } else {
        feedback.style.background = '#fef2f2';
        feedback.style.color = '#991b1b';
        feedback.innerHTML = `⚠️ <strong>Incomplete:</strong> A single food group is not enough for recovery. Select at least 3-4 food groups.`;
      }
    }
  }

  openModule(moduleId) {
    const modules = window.storageService.getModules();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    window.app.showModal(`
      <div style="font-size:2rem; margin-bottom:8px;">${mod.icon}</div>
      <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${mod.category}</span>
      <h2 style="font-size:1.2rem; font-weight:800; margin:4px 0 12px 0;">${mod.title}</h2>
      
      <div style="font-size:0.85rem; color:#334155; line-height:1.6; margin-bottom:16px;">
        ${mod.content}
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:16px;">
        <div style="font-weight:700; font-size:0.85rem; margin-bottom:8px; color:var(--text-main);">
          🧠 Knowledge Check: ${mod.quiz.question}
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${mod.quiz.options.map((opt, idx) => `
            <button class="btn btn-secondary btn-sm" style="text-align:left; justify-content:flex-start;" onclick="window.parentPortal.answerQuiz('${mod.id}', ${idx}, ${mod.quiz.correctIndex}, '${encodeURIComponent(mod.quiz.explanation)}')">
              ${String.fromCharCode(65 + idx)}) ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-box" style="margin-top:10px; font-size:0.8rem; font-weight:600; display:none;"></div>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-block" onclick="window.app.speakText('${mod.title}. ${mod.summary}')">
          🔊 Read Aloud
        </button>
        <button class="btn btn-primary btn-block" onclick="window.parentPortal.completeModule('${mod.id}')">
          ✓ Mark Completed
        </button>
      </div>
    `);
  }

  answerQuiz(moduleId, selectedIdx, correctIdx, explanationEncoded) {
    const feedback = document.getElementById('quiz-feedback-box');
    const explanation = decodeURIComponent(explanationEncoded);
    if (!feedback) return;

    feedback.style.display = 'block';
    if (selectedIdx === correctIdx) {
      feedback.style.color = '#15803d';
      feedback.style.background = '#dcfce7';
      feedback.style.padding = '8px';
      feedback.style.borderRadius = '6px';
      feedback.innerHTML = `✅ <strong>Correct!</strong> ${explanation}`;
    } else {
      feedback.style.color = '#b91c1c';
      feedback.style.background = '#fee2e2';
      feedback.style.padding = '8px';
      feedback.style.borderRadius = '6px';
      feedback.innerHTML = `❌ <strong>Try again:</strong> ${explanation}`;
    }
  }

  completeModule(moduleId) {
    if (!this.selectedChild) return;
    window.storageService.markModuleComplete(this.selectedChild.id, moduleId);
    window.app.closeModal();
    this.render();
    window.app.showToast('Module Completed! Nutrition Badge Earned! 🎖️', 'success');
  }

  openRecipe(recipeId) {
    const recipes = window.storageService.getRecipes();
    const rec = recipes.find(r => r.id === recipeId);
    if (!rec) return;

    window.app.showModal(`
      <span class="recipe-density-badge" style="margin-bottom:8px; display:inline-block;">${rec.tags.join(' • ')}</span>
      <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:8px;">${rec.title}</h2>
      
      <div style="display:flex; gap:12px; font-size:0.78rem; color:var(--text-muted); margin-bottom:14px; background:#f8fafc; padding:8px 12px; border-radius:8px;">
        <span>⏱️ <strong>Prep:</strong> ${rec.prepTime}</span>
        <span>👶 <strong>Age:</strong> ${rec.ageGroup}</span>
        <span>💰 <strong>Cost:</strong> ${rec.cost}</span>
      </div>

      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">🛒 Ingredients:</h4>
        <ul style="padding-left:18px; font-size:0.85rem; color:#334155;">
          ${rec.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom:16px;">
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">👨‍🍳 Easy Step-by-Step Cooking:</h4>
        <ol style="padding-left:18px; font-size:0.85rem; color:#334155; display:flex; flex-direction:column; gap:6px;">
          ${rec.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <button class="btn btn-primary btn-block" onclick="window.app.closeModal(); window.app.showToast('Recipe saved to your meal routine! 🥣', 'success');">
        ✓ Got it! Ready to Cook
      </button>
    `);
  }
}

window.parentPortal = new ParentPortal();
