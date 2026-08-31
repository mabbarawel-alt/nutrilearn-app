/**
 * NutriLearn Calabanga - Parent & Caregiver Portal Logic
 * Portal ng Magulang para sa Bayan ng Calabanga at Barangay Paolbo
 */

class ParentPortal {
  constructor() {
    this.container = document.getElementById('parent-view');
    this.selectedChild = null;
    this.currentDate = new Date().toISOString().split('T')[0];
    this.activeView = 'dashboard'; // 'dashboard' | 'child' | 'food' | 'lessons'
  }

  init() {
    this.loadChildData();
    this.render();
  }

  switchView(view) {
    this.activeView = view;
    this.render();
    if (window.app && window.app.renderBottomNav) {
      window.app.renderBottomNav();
    }
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
    const currentUser = window.storageService.getCurrentUser() || { name: 'Magulang', phone: 'N/A' };
    const myChildren = window.storageService.getChildrenForCurrentUser();

    if (!child) {
      this.container.innerHTML = `
        <div class="card" style="text-align:center; padding:28px 16px;">
          <h2 style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; margin-bottom:4px;">Maligayang Pagdating, ${currentUser.name}</h2>
          <div style="font-size:0.78rem; color:var(--primary); font-weight:700; margin-bottom:14px;">
            ${currentUser.community || 'Barangay Paolbo, Calabanga'} • Rehistradong Magulang
          </div>
          
          <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:var(--radius-sm); padding:14px 12px; margin-bottom:16px; font-size:0.82rem; color:#166534; line-height:1.5; text-align:left;">
            <strong>Pag-sync ng Profile ng Bata mula sa BHW:</strong><br>
            Ang inyong <strong>Barangay Health Worker (BHW)</strong> sa Barangay Paolbo ang may opisyal na tungkulin na magsagawa ng pagsusuri (timbang, taas, at sukat ng braso MUAC) at magpasok ng profile ng inyong anak.
            <div style="margin-top:8px; font-size:0.76rem; color:#15803d;">
              Kapag naitala na ng BHW ang pagsusuri para kay <strong>${currentUser.name}</strong>, awtomatiko itong lalabas dito kasama ang araw-araw na checklist sa pagpapakain at 4-Star diet plan.
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn btn-primary btn-block" onclick="window.app.openLessonsModal()">
              Magbasa ng mga Aralin sa Nutrisyon
            </button>
            <button class="btn btn-danger btn-block" onclick="window.parentPortal.openDeleteParentAccountModal()">
              Burahin ang Aking Account
            </button>
          </div>
        </div>
      `;
      return;
    }

    const dailyLogs = window.storageService.getDailyLogs(child.id, this.currentDate);
    const modules = window.storageService.getModules();
    const recipes = window.storageService.getRecipes();

    const weightGain = (child.currentWeight - child.initialWeight).toFixed(1);
    const totalNeeded = (child.targetWeight - child.initialWeight) || 1;
    const currentProgress = Math.min(100, Math.max(0, Math.round(((child.currentWeight - child.initialWeight) / totalNeeded) * 100)));

    const completedMealsCount = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'vitamins'].filter(m => dailyLogs[m]).length;
    const completedModulesCount = child.completedModules ? child.completedModules.length : 0;

    const statusBadgeClass = {
      'SAM': 'badge-sam',
      'MAM': 'badge-mam',
      'IMPROVING': 'badge-improving',
      'RECOVERED': 'badge-recovered'
    }[child.status] || 'badge-mam';

    const statusTextTagalog = {
      'SAM': 'Malubha (SAM)',
      'MAM': 'Katamtaman (MAM)',
      'IMPROVING': 'Bumubuti',
      'RECOVERED': 'Nakabawi Na'
    }[child.status] || child.status;

    // Child Switcher HTML
    const childSwitcherHtml = myChildren.length > 1 ? `
      <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; margin-bottom:10px;">
        ${myChildren.map(c => `
          <button class="btn btn-sm ${c.id === child.id ? 'btn-primary' : 'btn-secondary'}" onclick="window.parentPortal.selectMyChild('${c.id}')" style="white-space:nowrap; font-size:0.75rem;">
            ${c.name} (${c.ageMonths} buwan)
          </button>
        `).join('')}
      </div>
    ` : '';

    // Hero Profile Card HTML (Recent Clean High Contrast Design)
    const heroCardHtml = `
      <div class="hero-profile-card">
        <div class="profile-top">
          <div class="profile-main-info">
            <h2 class="profile-child-name">${child.name}</h2>
            <div class="profile-details">
              Edad: <strong>${window.formatChildAge ? window.formatChildAge(child.ageMonths) : child.ageMonths + ' Buwan'}</strong> (${child.ageMonths} buwan) • Kasarian: <strong>${child.gender}</strong>
            </div>
            <div class="profile-parent-info">
              Magulang: <strong>${child.parentName}</strong> • ${child.community || 'Zone 1, Barangay Paolbo'}
            </div>
          </div>
          <span class="badge-status ${statusBadgeClass}">${statusTextTagalog}</span>
        </div>

        <!-- 2-Row, 2-Column Health Metrics Grid with Adjustable Spacing -->
        <div class="metrics-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0 12px 0;">
          <!-- Row 1, Col 1: Kasalukuyang Timbang -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3.5px solid #10b981; border-radius:12px; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:left; display:flex; flex-direction:column; justify-content:space-between; min-height:74px; box-sizing:border-box;">
            <div style="font-size:0.68rem; color:#64748b; font-weight:700; line-height:1.2; margin-bottom:2px;">Kasalukuyang Timbang</div>
            <div style="font-size:1.2rem; font-weight:800; color:#0f172a; line-height:1.2; margin:2px 0;">
              ${child.currentWeight} <span style="font-size:0.75rem; color:#64748b; font-weight:600;">kg</span>
            </div>
            <div style="font-size:0.68rem; color:#059669; font-weight:700; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              +${weightGain >= 0 ? weightGain : 0} kg dagdag
            </div>
          </div>

          <!-- Row 1, Col 2: Target na Timbang -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3.5px solid #0284c7; border-radius:12px; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:left; display:flex; flex-direction:column; justify-content:space-between; min-height:74px; box-sizing:border-box;">
            <div style="font-size:0.68rem; color:#64748b; font-weight:700; line-height:1.2; margin-bottom:2px;">Target na Timbang</div>
            <div style="font-size:1.2rem; font-weight:800; color:#0f172a; line-height:1.2; margin:2px 0;">
              ${child.targetWeight} <span style="font-size:0.75rem; color:#64748b; font-weight:600;">kg</span>
            </div>
            <div style="font-size:0.68rem; color:#0284c7; font-weight:700; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${(child.targetWeight - child.currentWeight) > 0 ? (child.targetWeight - child.currentWeight).toFixed(1) + ' kg pa kailangan' : 'Naabot na ang target'}
            </div>
          </div>

          <!-- Row 2, Col 1: Sukat ng Braso (MUAC) -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3.5px solid ${child.currentMuac >= 125 ? '#10b981' : (child.currentMuac >= 115 ? '#f59e0b' : '#ef4444')}; border-radius:12px; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:left; display:flex; flex-direction:column; justify-content:space-between; min-height:74px; box-sizing:border-box;">
            <div style="font-size:0.68rem; color:#64748b; font-weight:700; line-height:1.2; margin-bottom:2px;">Sukat ng Braso (MUAC)</div>
            <div style="font-size:1.2rem; font-weight:800; color:#0f172a; line-height:1.2; margin:2px 0;">
              ${child.currentMuac} <span style="font-size:0.75rem; color:#64748b; font-weight:600;">mm</span>
            </div>
            <div style="font-size:0.68rem; color:${child.currentMuac >= 125 ? '#059669' : (child.currentMuac >= 115 ? '#d97706' : '#dc2626')}; font-weight:700; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${child.currentMuac >= 125 ? 'Normal (Berde)' : (child.currentMuac >= 115 ? 'Dilaw (MAM)' : 'Pula (SAM)')}
            </div>
          </div>

          <!-- Row 2, Col 2: Layunin sa Edad / Katayuan -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3.5px solid #8b5cf6; border-radius:12px; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:left; display:flex; flex-direction:column; justify-content:space-between; min-height:74px; box-sizing:border-box;">
            <div style="font-size:0.68rem; color:#64748b; font-weight:700; line-height:1.2; margin-bottom:2px;">Layunin sa Edad</div>
            <div style="font-size:1.05rem; font-weight:800; color:#0f172a; line-height:1.2; margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${window.formatChildAge ? window.formatChildAge(child.ageMonths) : child.ageMonths + ' Buwan'}
            </div>
            <div style="font-size:0.68rem; color:#7c3aed; font-weight:700; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              Katayuan: ${statusTextTagalog}
            </div>
          </div>
        </div>

        <div class="recovery-progress-box">
          <div class="progress-labels">
            <span class="progress-title">Pag-usad ng Paggaling</span>
            <span class="progress-percent">${currentProgress}% Natamo</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${currentProgress}%;"></div>
          </div>
        </div>
      </div>
    `;

    // 1. DASHBOARD VIEW (Pangkalahatang Dashboard ng Magulang)
    if (this.activeView === 'dashboard') {
      const announcements = window.storageService.getAnnouncements ? window.storageService.getAnnouncements() : [];
      const topAnn = announcements.length > 0 ? announcements[0] : null;

      this.container.innerHTML = `
        ${childSwitcherHtml}

        <!-- Welcome Greeting Card ng Magulang -->
        <div class="card" style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid #16a34a; padding:12px 14px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="font-size:1.05rem; font-weight:800; color:#14532d; margin:0 0 2px 0;">
                Magandang Araw, ${currentUser.name}!
              </h3>
              <div style="font-size:0.75rem; color:#166534; font-weight:600;">
                ${currentUser.community || 'Barangay Paolbo, Calabanga'} • Opisyal na Dashboard ng Magulang
              </div>
            </div>
            <span style="font-size:0.72rem; background:#dcfce7; color:#15803d; font-weight:700; padding:4px 8px; border-radius:12px; border:1px solid #86efac;">
              ${child.name.split(' ')[0]}
            </span>
          </div>
        </div>

        <!-- Hero Profile Card ng Bata -->
        ${heroCardHtml}

        <!-- 4 Quick KPI Summary Cards ng Magulang -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
          <!-- KPI 1: Checklist ng Pagpapakain -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3px solid var(--primary); cursor:pointer;" onclick="window.parentPortal.switchView('child')">
            <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">Checklist Ngayon</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:2px 0;">
              ${completedMealsCount}/6 <span style="font-size:0.7rem; color:var(--text-muted);">Kainan</span>
            </div>
            <div style="font-size:0.68rem; color:${completedMealsCount >= 5 ? '#059669' : 'var(--primary)'}; font-weight:700;">
              ${completedMealsCount >= 5 ? 'Kumpleto ang pagkain' : 'I-tsek ang natitira →'}
            </div>
          </div>

          <!-- KPI 2: Susunod na Check-up -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3px solid #2563eb; cursor:pointer;" onclick="window.parentPortal.switchView('child')">
            <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">Susunod na Check-up</div>
            <div style="font-size:0.95rem; font-weight:800; color:#1e40af; margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${child.nextSchedule ? child.nextSchedule.date : 'Wala pang petsa'}
            </div>
            <div style="font-size:0.68rem; color:#2563eb; font-weight:700;">
              ${child.nextSchedule ? child.nextSchedule.time : 'Tingnan ang detalye →'}
            </div>
          </div>

          <!-- KPI 3: Natapos na Aralin -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3px solid #d97706; cursor:pointer;" onclick="window.parentPortal.switchView('lessons')">
            <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">Aralin sa Nutrisyon</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:2px 0;">
              ${completedModulesCount}/${modules.length} <span style="font-size:0.7rem; color:var(--text-muted);">Aralin</span>
            </div>
            <div style="font-size:0.68rem; color:#d97706; font-weight:700;">
              Mag-aral ng Nutrisyon →
            </div>
          </div>

          <!-- KPI 4: Nakatalagang BHW -->
          <div class="card" style="margin:0; padding:10px 12px; border-left:3px solid #0f766e; cursor:pointer;" onclick="window.parentPortal.openParentMessagingModal('${child.id}')">
            <div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">Nakatalagang BHW</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${child.chwAssigned || 'BHW Paolbo'}
            </div>
            <div style="font-size:0.68rem; color:var(--primary); font-weight:700;">
              Magpadala ng Mensahe →
            </div>
          </div>
        </div>

        <!-- Opisyal na Anunsyo ng BHW -->
        ${topAnn ? `
          <div class="card" style="background:#f0fdf4; border:1.5px solid #86efac; border-left:5px solid #16a34a; padding:12px 14px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:0.95rem;">📢</span>
                <span style="font-size:0.72rem; font-weight:800; color:#15803d; text-transform:uppercase; letter-spacing:0.4px;">
                  Opisyal na Anunsyo ng BHW
                </span>
              </div>
              <span style="font-size:0.65rem; color:#166534; font-weight:600;">${topAnn.date}</span>
            </div>
            <div style="font-weight:800; font-size:0.86rem; color:#14532d; margin-bottom:4px;">
              ${topAnn.title}
            </div>
            <p style="font-size:0.76rem; color:#166534; line-height:1.45; margin:0;">
              ${topAnn.message}
            </p>
            <div style="margin-top:6px; font-size:0.68rem; color:#15803d; font-weight:700;">
              Inilathala ni: ${topAnn.authorName || 'BHW Paolbo'} • Barangay Paolbo, Calabanga
            </div>
          </div>
        ` : ''}

        <!-- Mabilisang Aksyon sa Dashboard (Quick Action Buttons) -->
        <div class="card" style="margin-bottom:12px;">
          <div class="card-header" style="margin-bottom:8px;">
            <h3 class="card-title">Mabilisang Aksyon para sa Magulang</h3>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button class="btn btn-primary" style="padding:10px 8px; font-size:0.76rem; font-weight:700;" onclick="window.parentPortal.switchView('child')">
              📋 Checklist ng Pagkain
            </button>
            <button class="btn btn-secondary" style="padding:10px 8px; font-size:0.76rem; font-weight:700;" onclick="window.parentPortal.switchView('food')">
              🥗 Inirerekomendang Pagkain
            </button>
            <button class="btn btn-secondary" style="padding:10px 8px; font-size:0.76rem; font-weight:700;" onclick="window.parentPortal.switchView('lessons')">
              📖 Mga Aralin sa Nutrisyon
            </button>
            <button class="btn btn-outline-primary" style="padding:10px 8px; font-size:0.76rem; font-weight:700;" onclick="window.parentPortal.openParentMessagingModal('${child.id}')">
              💬 Mensahe sa BHW
            </button>
          </div>
        </div>
      `;
      return;
    }

    // 2. AKING BATA VIEW (Detailed Monitoring & Checklist)
    if (this.activeView === 'child') {
      this.container.innerHTML = `
        ${childSwitcherHtml}
        ${heroCardHtml}

        <!-- Nakatakdang Konsultasyon / Follow-up Check-up mula sa BHW -->
        ${child.nextSchedule ? `
          <div class="card" style="background:#eff6ff; border:1.5px solid #93c5fd; border-left:4px solid #2563eb;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
              <strong style="font-size:0.85rem; color:#1e40af;">📅 Nakatakdang Konsultasyon / Check-up</strong>
              <span class="badge-status badge-improving" style="font-size:0.68rem; background:#dbeafe; color:#1e40af;">Nakatakda</span>
            </div>
            <div style="font-size:0.8rem; color:#1e3a8a; line-height:1.5;">
              <div>Petsa at Oras: <strong>${child.nextSchedule.date} (${child.nextSchedule.time})</strong></div>
              <div>Lugar: <strong>${child.nextSchedule.location}</strong></div>
              <div>Layunin: <strong>${child.nextSchedule.purpose}</strong></div>
              ${child.nextSchedule.notes ? `<div style="margin-top:2px; font-style:italic; font-size:0.75rem; color:#3b82f6;">Tagubilin: "${child.nextSchedule.notes}"</div>` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Mensahe mula sa Nakatalagang BHW -->
        <div class="card" style="background:#f8fafc; border:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="font-size:0.85rem; color:var(--text-main);">Mensahe mula sa BHW</strong>
              <div style="font-size:0.72rem; color:var(--text-muted);">${child.chwAssigned}</div>
            </div>
            <button class="btn btn-outline-primary btn-sm" onclick="window.parentPortal.openParentMessagingModal('${child.id}')">
              Buksan ang Mensahe
            </button>
          </div>
        </div>

        <!-- Pang-araw-araw na Checklist sa Pagpapakain ng Bata (na may Opsyonal na Tala ng Kinain) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pang-araw-araw na Checklist ng Pagpapakain</h3>
            <span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">${new Date().toLocaleDateString('fil-PH', { month: 'short', day: 'numeric' })}</span>
          </div>
          <p class="card-subtitle">I-tsek ang mga pagkain na naibigay. Kung hindi nasunod ang inirerekomendang pagkain, pindutin ang <strong>"+ Iba ang Kinain?"</strong> upang isulat ang kinain ni ${child.name.split(' ')[0]}:</p>
          
          <div class="checklist" id="daily-checklist">
            <!-- 1. Almusal -->
            <div class="check-item ${dailyLogs.breakfast ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'breakfast')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.breakfast ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Almusal: Pinayamang Super Lugaw na may Itlog</div>
                    <div class="check-time">Umaga • Simula na may mataas na enerhiya</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.breakfastNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'breakfast', 'Almusal')" title="Isulat kung may ibang kinain sa almusal">
                  ${dailyLogs.breakfastNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.breakfastNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Kinain:</strong> ${dailyLogs.breakfastNote}
                </div>
              ` : ''}
            </div>

            <!-- 2. Meryenda sa Umaga -->
            <div class="check-item ${dailyLogs.morningSnack ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'morningSnack')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.morningSnack ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Meryenda sa Umaga: Saging at Mani Mash / Prutas</div>
                    <div class="check-time">10:00 AM • Malusog na calories at bitamina</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.morningSnackNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'morningSnack', 'Meryenda sa Umaga')" title="Isulat kung may ibang kinain sa meryenda">
                  ${dailyLogs.morningSnackNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.morningSnackNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Kinain:</strong> ${dailyLogs.morningSnackNote}
                </div>
              ` : ''}
            </div>

            <!-- 3. Tanghalian -->
            <div class="check-item ${dailyLogs.lunch ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'lunch')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.lunch ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Tanghalian: 4-Star Kumpletong Pagkain</div>
                    <div class="check-time">12:30 PM • Monggo, malunggay, at isda o manok</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.lunchNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'lunch', 'Tanghalian')" title="Isulat kung may ibang kinain sa tanghalian">
                  ${dailyLogs.lunchNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.lunchNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Kinain:</strong> ${dailyLogs.lunchNote}
                </div>
              ` : ''}
            </div>

            <!-- 4. Meryenda sa Hapon -->
            <div class="check-item ${dailyLogs.afternoonSnack ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'afternoonSnack')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.afternoonSnack ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Meryenda sa Hapon: Nilagang Kamote / Papaya</div>
                    <div class="check-time">3:30 PM • Dagdag na lakas at sustansya</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.afternoonSnackNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'afternoonSnack', 'Meryenda sa Hapon')" title="Isulat kung may ibang kinain sa meryenda">
                  ${dailyLogs.afternoonSnackNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.afternoonSnackNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Kinain:</strong> ${dailyLogs.afternoonSnackNote}
                </div>
              ` : ''}
            </div>

            <!-- 5. Hapunan -->
            <div class="check-item ${dailyLogs.dinner ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'dinner')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.dinner ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Hapunan: Malapot na Kanin na may Malunggay at Sabaw</div>
                    <div class="check-time">6:30 PM • Madaling matunaw at pampalakas</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.dinnerNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'dinner', 'Hapunan')" title="Isulat kung may ibang kinain sa hapunan">
                  ${dailyLogs.dinnerNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.dinnerNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Kinain:</strong> ${dailyLogs.dinnerNote}
                </div>
              ` : ''}
            </div>

            <!-- 6. Bitamina / Suplemento -->
            <div class="check-item ${dailyLogs.vitamins ? 'completed' : ''}" style="display:flex; flex-direction:column; align-items:stretch; gap:6px; cursor:pointer;" onclick="window.parentPortal.toggleCheck('${child.id}', 'vitamins')">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px;">
                <div class="check-left" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                  <div class="check-box">${dailyLogs.vitamins ? '✓' : ''}</div>
                  <div style="min-width:0; flex:1;">
                    <div class="check-label">Bitamina / MNP Sachet / RUTF (Ayon sa Reseta ng BHW)</div>
                    <div class="check-time">Araw-araw • Mahalagang Iron at Vitamin A</div>
                  </div>
                </div>
                <button class="btn btn-sm ${dailyLogs.vitaminsNote ? 'btn-outline-primary' : 'btn-secondary'}" style="font-size:0.68rem; padding:4px 8px; border-radius:8px; white-space:nowrap; flex-shrink:0;" onclick="event.stopPropagation(); window.parentPortal.openMealNoteModal('${child.id}', 'vitamins', 'Bitamina/Suplemento')" title="Isulat kung may ibang suplementong naibigay">
                  ${dailyLogs.vitaminsNote ? '✏️ Tala ng Kinain' : '+ Iba ang Kinain?'}
                </button>
              </div>
              ${dailyLogs.vitaminsNote ? `
                <div style="margin-left:32px; font-size:0.73rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:4px 8px; border-radius:6px; line-height:1.35;">
                  <strong>🍽️ Aktwal na Naibigay:</strong> ${dailyLogs.vitaminsNote}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Opsyonal na Pangkalahatang Mensahe / Tala sa Pagpapakain -->
          <div style="margin-top:14px; padding-top:12px; border-top:1px dashed #cbd5e1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label style="font-size:0.76rem; font-weight:700; color:var(--text-main);">
                📝 Karagdagang Mensahe / Tala sa Pagpapakain (Opsyonal):
              </label>
              <span style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">Ipadala sa BHW</span>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:8px; line-height:1.4;">
              Kung hindi nasunod ang inirerekomendang pagkain o may partikular na kinain ang inyong anak, isulat dito upang makita ng BHW:
            </div>
            <div style="display:flex; gap:6px;">
              <input type="text" id="daily-general-note-input" class="form-input" style="font-size:0.78rem; padding:8px 10px; flex:1;" placeholder="Hal. Kumain ng saging at kaunting lugaw dahil walang gana..." value="${dailyLogs.generalNote || ''}" onkeydown="if(event.key==='Enter') window.parentPortal.saveGeneralFeedingNote('${child.id}', this.value)">
              <button class="btn btn-sm btn-primary" onclick="window.parentPortal.saveGeneralFeedingNote('${child.id}', document.getElementById('daily-general-note-input').value)" style="white-space:nowrap; font-size:0.75rem; padding:6px 12px;">
                I-save
              </button>
            </div>
            ${dailyLogs.generalNote ? `
              <div style="margin-top:6px; font-size:0.72rem; color:#15803d; font-weight:600; background:#f0fdf4; border:1px solid #bbf7d0; padding:4px 8px; border-radius:6px;">
                ✓ Naitalang Mensahe sa BHW: "${dailyLogs.generalNote}"
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Tsart ng Paglaki at Pagbawi ng Timbang -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Tsart ng Pagbawi at Paglaki</h3>
          </div>
          <p class="card-subtitle">Paghahambing ng pagtaas ng timbang sa target ayon sa edad:</p>

          <div class="chart-box">
            ${this.renderGrowthSvg(child)}
          </div>

          <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; margin-top:8px;">
            <span>Target na Guhit (${child.targetWeight}kg)</span>
            <span>Kasalukuyang Timbang (${child.currentWeight}kg)</span>
          </div>
        </div>

        <!-- Babala sa Panganib ng Malnutrisyon -->
        <div class="warning-box">
          <div class="warning-box-title">
            Mahalagang Paalala: Mga Sintomas ng Panganib
          </div>
          <div>Kung ang inyong anak ay may manas sa dalawang paa, hindi makasuso/makainom, o paulit-ulit na nagsusuka, agad makipag-ugnayan kay <strong>${child.chwAssigned}</strong> o dalhin sa Barangay Paolbo Health Center / RHU Calabanga.</div>
        </div>
      `;
      return;
    }

    // 3. PAGKAIN VIEW (Food Recommended Every Day & 4-Star Diet Plate)
    if (this.activeView === 'food') {
      this.container.innerHTML = `
        ${childSwitcherHtml}

        <!-- Mga Inirerekomendang Pagkain Araw-araw (Food Recommended Every Day) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Mga Inirerekomendang Pagkain Araw-araw</h3>
          </div>
          <p class="card-subtitle">Masustansyang gabay sa pagkain sa bawat oras ng araw para sa malusog na paglaki ni ${child.name.split(' ')[0]}:</p>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${recipes.map(rec => `
              <div class="recipe-card" onclick="window.parentPortal.openRecipe('${rec.id}')">
                <div class="recipe-header-bar">
                  <span class="recipe-name">${rec.mealTime || rec.title}</span>
                  <span class="recipe-density-badge">${rec.category || (rec.tags ? rec.tags[0] : '4-Star Meal')}</span>
                </div>
                <div class="recipe-body">
                  <div style="font-weight:700; font-size:0.85rem; color:var(--text-main); margin-bottom:4px;">
                    ${rec.title}
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px; line-height:1.4;">
                    <strong>Inirerekomendang ihain:</strong> ${(rec.recommendedFoods || []).slice(0, 2).join(' • ')}...
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.73rem; color:var(--text-muted);">
                    <span style="color:var(--primary); font-weight:600;">Sukat: ${rec.portion || '1 mangkok'}</span>
                    <span style="color:var(--primary); font-weight:700;">Tingnan ang Gabay →</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Interactive 4-Star Diet Plate -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Interactive 4-Star Diet Plato</h3>
          </div>
          <p class="card-subtitle">Pindutin ang bawat grupo ng pagkain upang bumuo ng kumpletong plato:</p>

          <div class="diet-plate-container">
            <div class="diet-plate-segment active" id="plate-star1" onclick="window.parentPortal.togglePlateStar('star1')">
              <div style="font-size:0.85rem; font-weight:800; color:var(--primary); margin-bottom:2px;">1. Go Foods</div>
              <div class="food-title">Lakas at Enerhiya</div>
              <div class="food-subtitle">Kanin, Mais, Kamote, Gabi</div>
            </div>

            <div class="diet-plate-segment active" id="plate-star2" onclick="window.parentPortal.togglePlateStar('star2')">
              <div style="font-size:0.85rem; font-weight:800; color:var(--primary); margin-bottom:2px;">2. Grow Foods</div>
              <div class="food-title">Protina sa Hayop</div>
              <div class="food-subtitle">Itlog, Isda, Atay, Karne</div>
            </div>

            <div class="diet-plate-segment active" id="plate-star3" onclick="window.parentPortal.togglePlateStar('star3')">
              <div style="font-size:0.85rem; font-weight:800; color:var(--primary); margin-bottom:2px;">3. Monggo at Buto</div>
              <div class="food-title">Protinang Halaman</div>
              <div class="food-subtitle">Monggo, Mani, Tokwa, Sitaw</div>
            </div>

            <div class="diet-plate-segment active" id="plate-star4" onclick="window.parentPortal.togglePlateStar('star4')">
              <div style="font-size:0.85rem; font-weight:800; color:var(--primary); margin-bottom:2px;">4. Glow Foods</div>
              <div class="food-title">Panlaban sa Sakit</div>
              <div class="food-subtitle">Malunggay, Kalabasa, Papaya</div>
            </div>
          </div>

          <div id="plate-feedback" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 10px; font-size:0.78rem; color:#15803d; text-align:center; font-weight:600;">
            Kumpletong 4-Star Diet: May sapat na lakas, protina, iron, at panlaban sa sakit.
          </div>
        </div>
      `;
      return;
    }

    // 4. ARALIN VIEW (E-Learning Lessons sa Nutrisyon)
    if (this.activeView === 'lessons') {
      this.container.innerHTML = `
        ${childSwitcherHtml}

        <!-- E-Learning Lessons para sa mga Magulang -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Mga Aralin sa Nutrisyon</h3>
            <span style="font-size:0.72rem; color:var(--primary); font-weight:700;">${completedModulesCount} sa ${modules.length} Natapos</span>
          </div>
          <p class="card-subtitle">Praktikal na gabay sa nutrisyon para sa pagpapakain sa bahay:</p>

          <div class="module-grid">
            ${modules.map(mod => {
              const isCompleted = child.completedModules && child.completedModules.includes(mod.id);
              return `
                <div class="module-card" onclick="window.parentPortal.openModule('${mod.id}')">
                  <div class="module-icon-box" style="font-weight:800; font-size:0.9rem; color:var(--primary);">${mod.icon}</div>
                  <div class="module-info">
                    <div class="module-tag">${mod.category}</div>
                    <h4 class="module-title">${mod.title}</h4>
                    <div class="module-meta">
                      <span>${mod.duration}</span>
                      <span style="color:${isCompleted ? 'var(--secondary)' : 'var(--accent-warm)'}; font-weight:700;">
                        ${isCompleted ? 'Natapos Na' : 'Basahin'}
                      </span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      return;
    }
  }

  selectMyChild(childId) {
    window.storageService.setSelectedChildId(childId);
    this.loadChildData();
    this.render();
    if (this.selectedChild) {
      window.app.showToast(`Lumipat sa profile para kay ${this.selectedChild.name}.`, 'info');
    }
  }

  openDeleteChildModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    window.app.showModal(`
      <div style="text-align:center; padding:10px 0;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:6px 0;">Burahin ang Profile ng Bata?</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
          Sigurado ka bang nais mong burahin ang record ni <strong>${child.name}</strong>? Hindi na ito maibabalik.
        </p>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button class="btn btn-danger btn-block" onclick="window.parentPortal.handleConfirmDeleteChild('${child.id}')">
            Oo, Burahin
          </button>
        </div>
      </div>
    `);
  }

  handleConfirmDeleteChild(childId) {
    window.storageService.deleteChild(childId);
    window.app.closeModal();
    this.init();
    window.app.updateHeaderProfile();
    window.app.showToast('Nabura ang record ng bata.', 'info');
  }

  openDeleteParentAccountModal() {
    const currentUser = window.storageService.getCurrentUser();
    if (!currentUser) return;

    window.app.showModal(`
      <div style="text-align:center; padding:10px 0;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:6px 0;">Burahin ang Account ng Magulang?</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
          Sigurado ka bang nais mong burahin ang account para kay <strong>${currentUser.name}</strong>? Lahat ng nakaugnay na data ng bata ay mabubura rin.
        </p>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button class="btn btn-danger btn-block" onclick="window.parentPortal.handleConfirmDeleteAccount('${currentUser.id}')">
            Oo, Burahin ang Account
          </button>
        </div>
      </div>
    `);
  }

  handleConfirmDeleteAccount(userId) {
    window.storageService.deleteUser(userId);
    window.app.closeModal();
    window.app.checkAuthState();
    window.app.showToast('Nabura ang account.', 'info');
  }

  renderGrowthSvg(child) {
    const history = child.growthHistory || [
      { date: 'Panimula', weight: child.initialWeight },
      { date: 'Kasalukuyan', weight: child.currentWeight }
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
      window.app.showToast('Naitala ang pagkain.', 'success');
    }
  }

  openMealNoteModal(childId, mealKey, mealTitle) {
    const child = window.storageService.getChildById(childId);
    const logs = window.storageService.getDailyLogs(childId, this.currentDate);
    const currentNote = logs[mealKey + 'Note'] || '';

    window.app.showModal(`
      <div style="padding:4px 0;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">
          Pang-araw-araw na Tala ng Pagkain
        </span>
        <h2 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:4px 0 8px 0;">
          Tala para sa ${mealTitle}
        </h2>
        <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.45; margin-bottom:14px;">
          Kung hindi nasunod ang inirerekomendang pagkain, isulat sa ibaba kung ano ang aktwal na kinain ni <strong>${child ? child.name : 'inyong anak'}</strong> upang maipabatid sa nakatalagang BHW:
        </p>

        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label" style="font-size:0.76rem; font-weight:700;">Aktwal na Kinain ng Bata (Opsyonal):</label>
          <textarea id="meal-custom-note-input" class="form-input" rows="3" style="font-size:0.82rem; padding:8px 10px; width:100%; box-sizing:border-box;" placeholder="Halimbawa: Nilagang itlog na may kaunting kanin, biskwit at gatas, sabaw ng manok...">${currentNote}</textarea>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button class="btn btn-primary btn-block" onclick="window.parentPortal.saveMealNote('${childId}', '${mealKey}', document.getElementById('meal-custom-note-input').value)">
            I-save ang Tala
          </button>
        </div>
      </div>
    `);
  }

  saveMealNote(childId, mealKey, noteText) {
    const logs = window.storageService.getDailyLogs(childId, this.currentDate);
    logs[mealKey + 'Note'] = (noteText || '').trim();
    if (logs[mealKey + 'Note']) {
      logs[mealKey] = true; // Auto-check the meal item if parent logged a custom meal
    }
    window.storageService.saveDailyLog(childId, this.currentDate, logs);
    window.app.closeModal();
    this.render();
    window.app.showToast('Matagumpay na naitala ang kinain ng bata.', 'success');
  }

  saveGeneralFeedingNote(childId, noteText) {
    const logs = window.storageService.getDailyLogs(childId, this.currentDate);
    logs.generalNote = (noteText || '').trim();
    window.storageService.saveDailyLog(childId, this.currentDate, logs);
    this.render();
    window.app.showToast('Nai-save ang mensahe sa pagpapakain.', 'success');
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
        feedback.style.borderColor = '#bbf7d0';
        feedback.style.color = '#15803d';
        feedback.innerHTML = '<strong>Kumpletong 4-Star:</strong> May buong lakas, protina, iron, at panlaban sa sakit.';
      } else if (count >= 2) {
        feedback.style.background = '#fefce8';
        feedback.style.borderColor = '#fef08a';
        feedback.style.color = '#854d0e';
        feedback.innerHTML = `<strong>${count} Bituin ang Napili:</strong> Magandang simula. Subukang magdagdag ng itlog o gulay.`;
      } else {
        feedback.style.background = '#fef2f2';
        feedback.style.borderColor = '#fecaca';
        feedback.style.color = '#991b1b';
        feedback.innerHTML = `<strong>Kulang sa Sustansya:</strong> Hindi sapat ang iisang grupo ng pagkain. Pumili ng 3 hanggang 4 na bituin.`;
      }
    }
  }

  openModule(moduleId) {
    const modules = window.storageService.getModules();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    window.app.showModal(`
      <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${mod.category}</span>
      <h2 style="font-size:1.15rem; font-weight:800; margin:2px 0 10px 0;">${mod.title}</h2>
      
      <div style="font-size:0.85rem; color:#334155; line-height:1.55; margin-bottom:14px;">
        ${mod.content}
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:14px;">
        <div style="font-weight:700; font-size:0.82rem; margin-bottom:8px; color:var(--text-main);">
          Pagsusuri ng Kaalaman: ${mod.quiz.question}
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${mod.quiz.options.map((opt, idx) => `
            <button class="btn btn-secondary btn-sm" style="text-align:left; justify-content:flex-start;" onclick="window.parentPortal.answerQuiz('${mod.id}', ${idx}, ${mod.quiz.correctIndex}, '${encodeURIComponent(mod.quiz.explanation)}')">
              ${String.fromCharCode(65 + idx)}) ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-box" style="margin-top:8px; font-size:0.78rem; font-weight:600; display:none;"></div>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-block" onclick="window.app.speakText('${mod.title}. ${mod.summary}')">
          Basahin nang Malakas
        </button>
        <button class="btn btn-primary btn-block" onclick="window.parentPortal.completeModule('${mod.id}')">
          Markahang Natapos
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
      feedback.style.padding = '6px 8px';
      feedback.style.borderRadius = '6px';
      feedback.innerHTML = `<strong>Tama!</strong> ${explanation}`;
    } else {
      feedback.style.color = '#b91c1c';
      feedback.style.background = '#fee2e2';
      feedback.style.padding = '6px 8px';
      feedback.style.borderRadius = '6px';
      feedback.innerHTML = `<strong>Subukang muli:</strong> ${explanation}`;
    }
  }

  completeModule(moduleId) {
    if (!this.selectedChild) return;
    window.storageService.markModuleComplete(this.selectedChild.id, moduleId);
    window.app.closeModal();
    this.render();
    window.app.showToast('Natapos ang aralin sa nutrisyon.', 'success');
  }

  openRecipe(recipeId) {
    const recipes = window.storageService.getRecipes();
    const rec = recipes.find(r => r.id === recipeId);
    if (!rec) return;

    window.app.showModal(`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="recipe-density-badge">${rec.category || '4-Star Meal'}</span>
        <span style="font-size:0.72rem; color:var(--primary); font-weight:700;">${rec.mealTime || 'Kainan'}</span>
      </div>

      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:6px;">${rec.title}</h2>
      
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:12px; background:#f8fafc; padding:8px 10px; border-radius:6px; border:1px solid #e2e8f0;">
        <span><strong>Edad:</strong> ${rec.ageGroup || '6-59 Buwan'}</span>
        <span><strong>Bahagi:</strong> ${rec.portion || '1 mangkok'}</span>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">
          Mga Inirerekomendang Masustansyang Pagkain:
        </h4>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:10px 12px;">
          <ul style="padding-left:16px; font-size:0.82rem; color:#166534; margin:0; display:flex; flex-direction:column; gap:6px;">
            ${(rec.recommendedFoods || []).map(f => `<li><strong>${f}</strong></li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">Bakit Ito Mahalaga para sa Bata?</h4>
        <p style="font-size:0.8rem; color:#334155; line-height:1.45; margin:0; background:#f8fafc; padding:8px 10px; border-radius:6px; border:1px solid #e2e8f0;">
          ${rec.benefits || 'Nagbibigay ng sapat na lakas, protina, at bitamina para sa mas mabilis na pagbawi ng timbang at resistensya.'}
        </p>
      </div>

      ${rec.tips ? `
        <div style="margin-bottom:14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:8px 10px;">
          <div style="font-size:0.75rem; color:#1e40af; font-weight:700; margin-bottom:2px;">💡 Paalala mula sa BHW:</div>
          <div style="font-size:0.78rem; color:#1d4ed8; line-height:1.4;">
            ${rec.tips}
          </div>
        </div>
      ` : ''}

      <button class="btn btn-primary btn-block" onclick="window.app.closeModal();">
        Nakuha Ko, Isara
      </button>
    `);
  }

  openParentMessagingModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    const messages = window.storageService.getMessages(childId);
    const currentUser = window.storageService.getCurrentUser() || { name: child.parentName || 'Magulang' };

    window.app.showModal(`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:0;">Mensahe sa Nakatalagang BHW</h2>
        <span class="badge-status badge-improving" style="font-size:0.7rem;">Konektado</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
        BHW: <strong>${child.chwAssigned}</strong> (Bata: <strong>${child.name}</strong>)
      </div>

      <!-- Message History Timeline -->
      <div id="parent-messages-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; min-height:180px; max-height:240px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; margin-bottom:10px;">
        ${messages.length === 0 ? `
          <div style="text-align:center; color:var(--text-muted); font-size:0.78rem; margin:auto; padding:20px 0;">
            Wala pang mensahe. Maaari kang mag-iwan ng tanong o impormasyon para sa iyong BHW.
          </div>
        ` : messages.map(m => {
          const isParent = m.senderRole === 'parent';
          return `
            <div style="display:flex; flex-direction:column; align-items:${isParent ? 'flex-end' : 'flex-start'};">
              <div style="font-size:0.68rem; color:var(--text-muted); margin-bottom:2px;">
                <strong>${m.senderName}</strong> • ${m.dateFormatted} ${m.timeFormatted}
              </div>
              <div style="background:${isParent ? 'var(--primary)' : '#fff'}; color:${isParent ? '#fff' : 'var(--text-main)'}; border:${isParent ? 'none' : '1px solid #cbd5e1'}; padding:8px 12px; border-radius:12px; font-size:0.8rem; max-width:85%; line-height:1.4; word-break:break-word; white-space:pre-wrap;">
                ${m.text}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Message Templates for Parents -->
      <div style="margin-bottom:8px;">
        <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Mabilisang Mensahe:</div>
        <div style="display:flex; gap:4px; overflow-x:auto; padding-bottom:4px;">
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.parentPortal.fillParentMessageTemplate('Kumpleto po ang kinain ni ${child.name.split(' ')[0]} sa 4-Star Diet ngayong araw.')">
            Kumpleto ang Pagkain
          </button>
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.parentPortal.fillParentMessageTemplate('Medyo matamlay po at mahina ang gana kumain ni ${child.name.split(' ')[0]}. Ano po ang magandang ihanda?')">
            Hina ang Gana
          </button>
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.parentPortal.fillParentMessageTemplate('Makakarating po kami sa nakatakdang timbang at check-up.')">
            Dadalo sa Check-up
          </button>
        </div>
      </div>

      <!-- Message Composer Form -->
      <form onsubmit="window.parentPortal.handleSendParentMessage(event, '${child.id}')">
        <div style="display:flex; gap:6px;">
          <input type="text" id="parent-msg-input" class="form-input" required placeholder="I-type ang mensahe para sa iyong BHW..." style="flex:1;" />
          <button type="submit" class="btn btn-primary" style="padding:0 14px; font-size:0.82rem; font-weight:700;">
            Ipadala
          </button>
        </div>
      </form>

      <button type="button" class="btn btn-secondary btn-block" style="margin-top:10px;" onclick="window.app.closeModal()">
        Isara
      </button>
    `);

    setTimeout(() => {
      const container = document.getElementById('parent-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  fillParentMessageTemplate(text) {
    const input = document.getElementById('parent-msg-input');
    if (input) {
      input.value = text;
      input.focus();
    }
  }

  handleSendParentMessage(e, childId) {
    e.preventDefault();
    const input = document.getElementById('parent-msg-input');
    if (!input || !input.value.trim()) return;

    const child = window.storageService.getChildById(childId);
    const currentUser = window.storageService.getCurrentUser() || { name: (child ? child.parentName : 'Magulang') };

    window.storageService.sendMessage({
      childId,
      senderRole: 'parent',
      senderName: `${currentUser.name} (Magulang)`,
      text: input.value.trim()
    });

    window.app.showToast('Naipadala ang mensahe sa BHW.', 'success');
    this.openParentMessagingModal(childId);
  }
}

window.parentPortal = new ParentPortal();
