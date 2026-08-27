/**
 * NutriLearn - Community Health Worker (CHW) Toolkit
 */

class CHWToolkit {
  constructor() {
    this.container = document.getElementById('chw-view');
    this.activeFilter = 'ALL';
    this.searchQuery = '';
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const children = window.storageService.getChildren();
    const currentUser = window.storageService.getCurrentUser() || { name: 'Health Worker', title: 'CHW' };

    // Filter children
    const filtered = children.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.parentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.community.toLowerCase().includes(this.searchQuery.toLowerCase());
      if (this.activeFilter === 'ALL') return matchesSearch;
      return matchesSearch && c.status === this.activeFilter;
    });

    const samCount = children.filter(c => c.status === 'SAM').length;
    const mamCount = children.filter(c => c.status === 'MAM' || c.status === 'IMPROVING').length;
    const recoveredCount = children.filter(c => c.status === 'RECOVERED').length;

    this.container.innerHTML = `
      <!-- CHW Overview Header -->
      <div class="card" style="background: linear-gradient(135deg, #0f766e, #0d9488); color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-size:0.75rem; opacity:0.85; text-transform:uppercase; font-weight:700;">Community Caseload Overview</div>
            <h2 style="font-family:var(--font-display); font-size:1.25rem; font-weight:800;">All Registered Children (${children.length})</h2>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="window.chwToolkit.openScreeningModal()" style="color:var(--primary-dark); font-weight:800; border-radius:var(--radius-full);">
            + Screen Baby
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; background:rgba(0,0,0,0.18); padding:8px 10px; border-radius:10px; text-align:center;">
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#fca5a5;">${samCount}</div>
            <div style="font-size:0.68rem; opacity:0.9;">SAM (Red)</div>
          </div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#fed7aa;">${mamCount}</div>
            <div style="font-size:0.68rem; opacity:0.9;">MAM / Improving</div>
          </div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#bbf7d0;">${recoveredCount}</div>
            <div style="font-size:0.68rem; opacity:0.9;">Recovered 🎉</div>
          </div>
        </div>
      </div>

      <!-- Quick Action: Fast Triage & Counseling Flashcards -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <button class="btn btn-outline-primary" style="padding:10px 8px; font-size:0.78rem;" onclick="window.chwToolkit.openCounselingGuide()">
          <span>📖</span> Counseling Guide
        </button>
        <button class="btn btn-primary" style="padding:10px 8px; font-size:0.78rem;" onclick="window.chwToolkit.openScreeningModal()">
          <span>📐</span> New Intake (MUAC)
        </button>
      </div>

      <!-- Caseload Filters & Search -->
      <div class="card">
        <div class="form-group" style="margin-bottom:10px;">
          <input type="text" class="form-input" placeholder="🔍 Search child, parent, or barangay..." 
                 value="${this.searchQuery}" oninput="window.chwToolkit.handleSearch(this.value)" />
        </div>

        <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
          <button class="btn btn-sm ${this.activeFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" onclick="window.chwToolkit.setFilter('ALL')">All (${children.length})</button>
          <button class="btn btn-sm ${this.activeFilter === 'SAM' ? 'btn-danger' : 'btn-secondary'}" onclick="window.chwToolkit.setFilter('SAM')">SAM (${samCount})</button>
          <button class="btn btn-sm ${this.activeFilter === 'MAM' ? 'btn-warning' : 'btn-secondary'}" style="${this.activeFilter === 'MAM' ? 'background:var(--warning-mam); color:#fff;' : ''}" onclick="window.chwToolkit.setFilter('MAM')">MAM</button>
          <button class="btn btn-sm ${this.activeFilter === 'IMPROVING' ? 'btn-primary' : 'btn-secondary'}" onclick="window.chwToolkit.setFilter('IMPROVING')">Improving</button>
          <button class="btn btn-sm ${this.activeFilter === 'RECOVERED' ? 'btn-success' : 'btn-secondary'}" onclick="window.chwToolkit.setFilter('RECOVERED')">Recovered (${recoveredCount})</button>
        </div>
      </div>

      <!-- Caseload List -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-main);">Registered Community Caseload (${filtered.length})</h3>
        </div>

        ${filtered.length === 0 ? `
          <div class="card" style="text-align:center; padding:24px; color:var(--text-muted);">
            <div style="font-size:2rem; margin-bottom:4px;">🔍</div>
            <p>No children found matching the filter.</p>
          </div>
        ` : filtered.map(child => {
          const statusBadge = {
            'SAM': 'badge-sam',
            'MAM': 'badge-mam',
            'IMPROVING': 'badge-improving',
            'RECOVERED': 'badge-recovered'
          }[child.status] || 'badge-mam';

          return `
            <div class="caseload-item">
              <div class="caseload-top">
                <div>
                  <div class="caseload-name">${child.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">
                    Caregiver: <strong>${child.parentName}</strong> • ${child.community}
                  </div>
                  <div style="font-size:0.7rem; color:var(--primary); font-weight:600; margin-top:2px;">
                    Assigned: ${child.chwAssigned}
                  </div>
                </div>
                <span class="badge-status ${statusBadge}">${child.status}</span>
              </div>

              <!-- MUAC & Growth Quick Stats -->
              <div class="caseload-details">
                <div>
                  <div class="caseload-detail-label">Current Weight</div>
                  <div class="caseload-detail-val">${child.currentWeight} kg</div>
                </div>
                <div>
                  <div class="caseload-detail-label">MUAC</div>
                  <div class="caseload-detail-val" style="${child.currentMuac < 115 ? 'color:var(--danger-sam);' : (child.currentMuac < 125 ? 'color:var(--warning-mam);' : 'color:var(--secondary);')}">
                    ${child.currentMuac} mm
                  </div>
                </div>
                <div>
                  <div class="caseload-detail-label">Last Visit</div>
                  <div class="caseload-detail-val">${child.lastVisitDate ? child.lastVisitDate.slice(5) : 'N/A'}</div>
                </div>
              </div>

              <div class="caseload-actions">
                <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.chwToolkit.openChildDetailModal('${child.id}')">
                  👁️ Case Details
                </button>
                <button class="btn btn-primary btn-sm" style="flex:1.4;" onclick="window.chwToolkit.openVisitLoggerModal('${child.id}')">
                  📝 Log Visit / Progress
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  handleSearch(val) {
    this.searchQuery = val;
    this.render();
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.render();
  }

  openChildDetailModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    window.app.showModal(`
      <span class="badge-status ${child.status === 'RECOVERED' ? 'badge-recovered' : (child.status === 'SAM' ? 'badge-sam' : 'badge-mam')}" style="margin-bottom:8px; display:inline-block;">${child.status}</span>
      <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:4px;">${child.name}</h2>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">
        ${child.ageMonths} Months • ${child.gender} • ${child.community}
      </div>

      <div style="background:#f8fafc; padding:10px 12px; border-radius:8px; font-size:0.82rem; margin-bottom:12px; display:flex; flex-direction:column; gap:4px;">
        <div><strong>Parent / Caregiver:</strong> ${child.parentName} (${child.parentContact})</div>
        <div><strong>Assigned Health Worker:</strong> ${child.chwAssigned}</div>
        <div><strong>Admission Date:</strong> ${child.admissionDate} • <strong>Last Check:</strong> ${child.lastVisitDate}</div>
        <div><strong>Target Recovery Weight:</strong> ${child.targetWeight} kg</div>
      </div>

      <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:10px 12px; border-radius:8px; font-size:0.8rem; margin-bottom:14px; color:#115e59;">
        <strong>Prescribed Feeding Plan:</strong>
        <p style="margin-top:2px;">${child.prescribedDiet}</p>
        ${child.notes ? `<p style="margin-top:4px; font-style:italic;">Notes: "${child.notes}"</p>` : ''}
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary btn-block" onclick="window.app.closeModal(); window.chwToolkit.openVisitLoggerModal('${child.id}');">
          📝 Log Progress Visit
        </button>
        <button class="btn btn-secondary btn-block" onclick="window.app.closeModal();">
          Close
        </button>
      </div>
    `);
  }

  openScreeningModal() {
    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">📐 Child Malnutrition Screening (Intake)</h2>
      
      <form id="screening-form" onsubmit="window.chwToolkit.handleSaveScreening(event)">
        <div class="form-group">
          <label class="form-label">Child Full Name *</label>
          <input type="text" id="screen-name" class="form-input" required placeholder="e.g. Juan Dela Cruz" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Age (Months) *</label>
            <input type="number" id="screen-age" class="form-input" required min="1" max="59" value="12" />
          </div>
          <div class="form-group">
            <label class="form-label">Gender *</label>
            <select id="screen-gender" class="form-select">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Parent / Caregiver Full Name *</label>
          <input type="text" id="screen-parent" class="form-input" required placeholder="e.g. Maria Dela Cruz" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Barangay / Community *</label>
            <input type="text" id="screen-community" class="form-input" required value="Barangay San Isidro" />
          </div>
          <div class="form-group">
            <label class="form-label">Parent Contact</label>
            <input type="text" id="screen-contact" class="form-input" placeholder="0917-000-0000" />
          </div>
        </div>

        <!-- Anthropometric Measurements -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:14px;">
          <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">⚖️ Anthropometric Measurements</h4>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Weight (kg) *</label>
              <input type="number" step="0.1" id="screen-weight" class="form-input" required placeholder="7.0" oninput="window.chwToolkit.updateTriagePreview()" />
            </div>
            <div class="form-group">
              <label class="form-label">Height/Length (cm)</label>
              <input type="number" step="0.5" id="screen-height" class="form-input" placeholder="72.0" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">MUAC (Arm Circumference in mm) *</label>
            <input type="number" id="screen-muac" class="form-input" required value="118" min="80" max="180" oninput="window.chwToolkit.updateTriagePreview()" />
            
            <div class="muac-scale">
              <div class="muac-segment-red"></div>
              <div class="muac-segment-yellow"></div>
              <div class="muac-segment-green"></div>
            </div>
            <div class="muac-labels">
              <span style="color:#ef4444;">&lt;115mm (SAM)</span>
              <span style="color:#f59e0b;">115-124mm (MAM)</span>
              <span style="color:#10b981;">≥125mm (Normal)</span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="screen-edema" onchange="window.chwToolkit.updateTriagePreview()" />
              Bilateral Pitting Edema Present (+)?
            </label>
          </div>
        </div>

        <!-- Live Triage Feedback -->
        <div id="triage-feedback-card" style="background:#ffedd5; border:1px solid #fed7aa; border-radius:8px; padding:10px; font-size:0.82rem; color:#9a3412; margin-bottom:14px; font-weight:600;">
          🟡 Classification: Moderate Acute Malnutrition (MAM) • Assign 4-Star Diet & Weekly CHW Follow-up
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          💾 Register & Save Screening Record
        </button>
      </form>
    `);
    this.updateTriagePreview();
  }

  updateTriagePreview() {
    const muacInput = document.getElementById('screen-muac');
    const edemaInput = document.getElementById('screen-edema');
    const feedback = document.getElementById('triage-feedback-card');
    if (!muacInput || !feedback) return;

    const muac = parseFloat(muacInput.value) || 0;
    const hasEdema = edemaInput ? edemaInput.checked : false;

    if (hasEdema || muac < 115) {
      feedback.style.background = '#fee2e2';
      feedback.style.borderColor = '#fca5a5';
      feedback.style.color = '#991b1b';
      feedback.innerHTML = '🔴 <strong>Severe Acute Malnutrition (SAM):</strong> Urgent! Refer for therapeutic feeding (RUTF) and close clinical monitoring.';
    } else if (muac >= 115 && muac < 125) {
      feedback.style.background = '#ffedd5';
      feedback.style.borderColor = '#fed7aa';
      feedback.style.color = '#9a3412';
      feedback.innerHTML = '🟡 <strong>Moderate Acute Malnutrition (MAM):</strong> Enroll in NutriLearn 4-Star Diet counseling & weekly weight tracking.';
    } else {
      feedback.style.background = '#dcfce7';
      feedback.style.borderColor = '#86efac';
      feedback.style.color = '#166534';
      feedback.innerHTML = '🟢 <strong>Normal Nutritional Status:</strong> Healthy growth! Provide standard infant and young child feeding guidelines.';
    }
  }

  handleSaveScreening(e) {
    e.preventDefault();
    const currentUser = window.storageService.getCurrentUser() || { name: 'Maria Santos', title: 'CHW #12' };
    const chwAssigned = `${currentUser.name} (${currentUser.title || 'CHW'})`;

    const name = document.getElementById('screen-name').value;
    const ageMonths = parseInt(document.getElementById('screen-age').value);
    const gender = document.getElementById('screen-gender').value;
    const parentName = document.getElementById('screen-parent').value;
    const community = document.getElementById('screen-community').value;
    const parentContact = document.getElementById('screen-contact').value || 'N/A';
    const weight = parseFloat(document.getElementById('screen-weight').value);
    const height = parseFloat(document.getElementById('screen-height').value) || (70 + (ageMonths * 0.5));
    const muac = parseFloat(document.getElementById('screen-muac').value);
    const edema = document.getElementById('screen-edema').checked;

    let status = 'NORMAL';
    if (edema || muac < 115) {
      status = 'SAM';
    } else if (muac < 125) {
      status = 'MAM';
    }

    const childId = 'child-' + Date.now().toString().slice(-4);

    // Check or create parent user account
    const users = window.storageService.getUsers();
    let parentUser = users.find(u => u.role === 'parent' && u.name.toLowerCase().trim() === parentName.toLowerCase().trim());
    let parentId = parentUser ? parentUser.id : ('user-parent-' + Date.now().toString().slice(-4));

    if (!parentUser) {
      parentUser = {
        id: parentId,
        name: parentName,
        role: 'parent',
        phone: parentContact,
        community: community,
        childIds: [childId],
        avatar: '👩',
        bio: `Mother of ${name}`
      };
      users.push(parentUser);
      localStorage.setItem('nutrilearn_users', JSON.stringify(users));
    } else {
      if (!parentUser.childIds) parentUser.childIds = [];
      if (!parentUser.childIds.includes(childId)) {
        parentUser.childIds.push(childId);
        localStorage.setItem('nutrilearn_users', JSON.stringify(users));
      }
    }

    const newChild = {
      id: childId,
      parentId: parentId,
      name,
      ageMonths,
      gender,
      parentName,
      parentContact,
      community,
      chwAssigned,
      status,
      initialMuac: muac,
      currentMuac: muac,
      initialWeight: weight,
      currentWeight: weight,
      height,
      edema,
      admissionDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      targetWeight: (weight * 1.2).toFixed(1),
      growthHistory: [
        { date: new Date().toISOString().split('T')[0], weight, muac, status }
      ],
      completedModules: [],
      prescribedDiet: status === 'SAM' ? 'RUTF + Clinic referral' : '4-Star Fortified Porridge with Egg & Oil',
      notes: 'Initial screening recorded.'
    };

    window.storageService.saveChild(newChild);
    window.app.closeModal();
    this.render();
    window.app.showToast(`Registered ${name} as ${status}! Linked to caregiver ${parentName}. 📋`, 'success');
  }

  openVisitLoggerModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">📝 Log Follow-Up & Health Progress</h2>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Child: <strong>${child.name}</strong> • ${child.community}</div>

      <form id="visit-form" onsubmit="window.chwToolkit.handleSaveVisit(event, '${child.id}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">New Weight (kg) *</label>
            <input type="number" step="0.1" id="visit-weight" class="form-input" required value="${child.currentWeight}" />
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">Previous: ${child.currentWeight} kg</div>
          </div>
          <div class="form-group">
            <label class="form-label">New MUAC (mm) *</label>
            <input type="number" id="visit-muac" class="form-input" required value="${child.currentMuac}" />
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">Previous: ${child.currentMuac} mm</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nutritional Recovery Status *</label>
          <select id="visit-status" class="form-select">
            <option value="SAM" ${child.status === 'SAM' ? 'selected' : ''}>🔴 SAM (Severe Malnutrition)</option>
            <option value="MAM" ${child.status === 'MAM' ? 'selected' : ''}>🟡 MAM (Moderate Malnutrition)</option>
            <option value="IMPROVING" ${child.status === 'IMPROVING' ? 'selected' : ''}>⭐ IMPROVING (Gaining Weight)</option>
            <option value="RECOVERED" ${child.status === 'RECOVERED' ? 'selected' : ''}>🟢 RECOVERED (Graduated from Program)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Parent Feeding Adherence & Assessment Notes</label>
          <textarea id="visit-notes" class="form-textarea" rows="3" placeholder="Mother feeding 4-star meals regularly; child active and cheerful; appetite good."></textarea>
        </div>

        <button type="submit" class="btn btn-success btn-block">
          ✓ Save Progress & Update Growth Chart
        </button>
      </form>
    `);
  }

  handleSaveVisit(e, childId) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('visit-weight').value);
    const muac = parseFloat(document.getElementById('visit-muac').value);
    const status = document.getElementById('visit-status').value;
    const notes = document.getElementById('visit-notes').value;

    window.storageService.recordVisit(childId, {
      weight,
      muac,
      status,
      notes,
      date: new Date().toISOString().split('T')[0]
    });

    window.app.closeModal();
    this.render();
    window.app.showToast(`Health progress updated! Growth curve recalculated. 📈`, 'success');
  }

  openCounselingGuide() {
    window.app.showModal(`
      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:8px;">🗣️ CHW Home Counseling Toolkit</h2>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Evidence-based talking points for counseling parents at home:</p>

      <div style="display:flex; flex-direction:column; gap:10px; font-size:0.85rem; color:#334155;">
        <div style="background:#f8fafc; padding:10px; border-radius:8px; border-left:4px solid var(--primary);">
          <strong>1. Active & Responsive Feeding:</strong>
          <p style="margin-top:4px;">Sit with the child during meals. Encourage with smiles and patient spoon-feeding. Never force-feed, but offer small nutritious bites frequently.</p>
        </div>

        <div style="background:#f8fafc; padding:10px; border-radius:8px; border-left:4px solid var(--accent-warm);">
          <strong>2. The "Spoon Thickness" Demonstration:</strong>
          <p style="margin-top:4px;">Show the mother how adding 1 teaspoon of oil or mashed egg yolk turns watery broth into a high-energy meal.</p>
        </div>

        <div style="background:#f8fafc; padding:10px; border-radius:8px; border-left:4px solid var(--secondary);">
          <strong>3. Hygiene & Diarrhea Prevention:</strong>
          <p style="margin-top:4px;">Verify the family's drinking water source. Remind them to wash hands with soap before preparing infant bowls.</p>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="window.app.closeModal();">
        ✓ Back to Caseload
      </button>
    `);
  }
}

window.chwToolkit = new CHWToolkit();
