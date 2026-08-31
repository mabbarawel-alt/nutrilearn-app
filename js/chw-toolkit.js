/**
 * NutriLearn Calabanga - Barangay Health Worker (BHW) Toolkit
 * Kagamitan ng BHW para sa Bayan ng Calabanga at Barangay Paolbo
 */

class CHWToolkit {
  constructor() {
    this.container = document.getElementById('chw-view');
    this.activeView = 'dashboard'; // 'dashboard', 'caseload', or 'parents'
    this.activeFilter = 'ALL';
    this.searchQuery = '';
    this.parentSearchQuery = '';
  }

  init() {
    this.render();
  }

  switchView(view) {
    this.activeView = view;
    if (window.app && window.app.renderBottomNav) {
      window.app.renderBottomNav();
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    const children = window.storageService.getChildren();
    const parents = window.storageService.getParentUsers ? window.storageService.getParentUsers() : [];
    const currentUser = window.storageService.getCurrentUser() || { name: 'Barangay Health Worker', title: 'BHW' };

    if (this.activeView === 'dashboard') {
      this.container.innerHTML = this.renderDashboard(children, currentUser, parents);
    } else if (this.activeView === 'parents') {
      this.container.innerHTML = this.renderParentsDirectory(parents, currentUser, children);
    } else {
      this.container.innerHTML = this.renderCaseload(children, currentUser, parents);
    }
  }

  // 1. Dedicated BHW Dashboard View
  renderDashboard(children, currentUser, parents = []) {
    const samChildren = children.filter(c => c.status === 'SAM');
    const mamChildren = children.filter(c => c.status === 'MAM' || c.status === 'IMPROVING');
    const recoveredChildren = children.filter(c => c.status === 'RECOVERED');
    const unreadCount = window.storageService.getUnreadParentMessagesCount ? window.storageService.getUnreadParentMessagesCount() : 0;
    const announcements = window.storageService.getAnnouncements ? window.storageService.getAnnouncements() : [];

    // Upcoming scheduled checkups
    const scheduledChildren = children.filter(c => c.nextSchedule && c.nextSchedule.date);

    // Urgent high priority children (SAM or MAM)
    const priorityChildren = children.filter(c => c.status === 'SAM' || c.status === 'MAM').slice(0, 3);

    // Recent activity (sorted by last visit date)
    const recentActivity = [...children].sort((a, b) => (b.lastVisitDate || '').localeCompare(a.lastVisitDate || '')).slice(0, 3);

    return `
      <!-- Sub-Navigation Pill Header (3 Views) -->
      <div class="auth-tab-bar" style="margin-bottom:12px; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:4px;">
        <button class="auth-tab-btn active" onclick="window.chwToolkit.switchView('dashboard')">
          Dashboard
        </button>
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('caseload')">
          Mga Bata (${children.length})
        </button>
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('parents')">
          Magulang (${parents.length})
        </button>
      </div>

      <!-- Welcome Profile & Shift Overview Card -->
      <div class="card" style="background:linear-gradient(135deg, #0f766e 0%, #115e59 100%); color:#ffffff; border:none; padding:16px 14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.5px; opacity:0.85; font-weight:700;">
              Dashboard ng Barangay Health Worker
            </div>
            <h2 style="font-family:var(--font-display); font-size:1.22rem; font-weight:800; color:#ffffff; margin:2px 0;">
              ${currentUser.name || 'Barangay Health Worker'}
            </h2>
            <div style="font-size:0.75rem; color:#ccfbf1; font-weight:600;">
              ${currentUser.title || 'BHW #16'} • Barangay Paolbo, Calabanga
            </div>
          </div>
          <span style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); font-size:0.65rem; font-weight:800; padding:3px 8px; border-radius:12px; color:#ffffff;">
            Aktibo
          </span>
        </div>
      </div>

      <!-- Quick Action Shortcuts -->
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-bottom:14px;">
        <button class="btn btn-primary" style="padding:10px 8px; font-size:0.78rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.chwToolkit.openRegisterChildModal()">
          <span>+ Magrehistro ng Bata</span>
        </button>
        <button class="btn btn-secondary" style="padding:10px 8px; font-size:0.78rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px; color:var(--primary);" onclick="window.chwToolkit.switchView('parents')">
          <span>👨‍👩‍👧 Mga Magulang (${parents.length})</span>
        </button>
        <button class="btn btn-secondary" style="padding:9px 8px; font-size:0.76rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.chwToolkit.openAnnouncementModal()">
          <span>📢 Mag-post ng Anunsyo</span>
        </button>
        <button class="btn btn-secondary" style="padding:9px 8px; font-size:0.76rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px; position:relative;" onclick="window.chwToolkit.openBhwInboxModal()">
          <span>Inbox ng Magulang</span>
          ${unreadCount > 0 ? `<span style="background:#ef4444; color:#fff; font-size:0.65rem; font-weight:800; padding:1px 6px; border-radius:10px; margin-left:4px;">${unreadCount}</span>` : ''}
        </button>
      </div>

      <!-- Opisyal na Anunsyo para sa mga Magulang Card -->
      <div class="card" style="margin-bottom:14px; border-left:4px solid #16a34a; background:#f0fdf4;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1rem;">📢</span>
            <h3 style="font-size:0.85rem; font-weight:800; color:#15803d; margin:0;">Mga Anunsyo sa Magulang (${announcements.length})</h3>
          </div>
          <button class="btn btn-sm btn-primary" style="font-size:0.7rem; padding:3px 8px;" onclick="window.chwToolkit.openAnnouncementModal()">
            + Mag-post
          </button>
        </div>

        ${announcements.length === 0 ? `
          <div style="font-size:0.76rem; color:#166534; text-align:center; padding:8px;">
            Wala pang nai-post na anunsyo. Pindutin ang "+ Mag-post" upang magpadala ng anunsyo sa mga magulang.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${announcements.slice(0, 2).map(ann => `
              <div style="background:#ffffff; border:1px solid #bbf7d0; border-radius:var(--radius-xs); padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div>
                    <span style="font-size:0.62rem; font-weight:800; color:#15803d; background:#dcfce7; padding:1px 5px; border-radius:3px;">
                      ${ann.category || 'Paunawa'}
                    </span>
                    <div style="font-weight:800; font-size:0.82rem; color:#14532d; margin-top:2px;">
                      ${ann.title}
                    </div>
                  </div>
                  <span style="font-size:0.65rem; color:#166534;">${ann.date}</span>
                </div>
                <div style="font-size:0.73rem; color:#334155; margin-top:3px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                  ${ann.message}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- KPI Overview Grid (4 Key Indicators) -->
      <div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <h3 style="font-size:0.85rem; font-weight:800; color:var(--text-main); text-transform:uppercase; letter-spacing:0.3px;">
            Katayuan sa Nutrisyon (Paolbo)
          </h3>
          <span style="font-size:0.7rem; color:var(--primary); font-weight:700; cursor:pointer;" onclick="window.chwToolkit.switchView('caseload')">
            Tingnan Lahat →
          </span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px;">
          <!-- 1. Total Caseload -->
          <div class="card" style="margin:0; padding:12px; border-left:4px solid var(--primary); cursor:pointer;" onclick="window.chwToolkit.setFilter('ALL'); window.chwToolkit.switchView('caseload');">
            <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Kabuuang Caseload</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--text-main); margin:2px 0;">${children.length}</div>
            <div style="font-size:0.68rem; color:var(--primary); font-weight:600;">Mga Rehistradong Bata</div>
          </div>

          <!-- 2. SAM (Severe) -->
          <div class="card" style="margin:0; padding:12px; border-left:4px solid var(--danger-sam); background:var(--danger-sam-soft); cursor:pointer;" onclick="window.chwToolkit.setFilter('SAM'); window.chwToolkit.switchView('caseload');">
            <div style="font-size:0.7rem; font-weight:800; color:#991b1b; text-transform:uppercase;">SAM (Malubha)</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--danger-sam); margin:2px 0;">${samChildren.length}</div>
            <div style="font-size:0.68rem; color:#b91c1c; font-weight:700;">< 115 mm (Kagyat)</div>
          </div>

          <!-- 3. MAM (Moderate) -->
          <div class="card" style="margin:0; padding:12px; border-left:4px solid var(--warning-mam); background:var(--warning-mam-soft); cursor:pointer;" onclick="window.chwToolkit.setFilter('MAM'); window.chwToolkit.switchView('caseload');">
            <div style="font-size:0.7rem; font-weight:800; color:#9a3412; text-transform:uppercase;">MAM (Katamtaman)</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--warning-mam); margin:2px 0;">${mamChildren.length}</div>
            <div style="font-size:0.68rem; color:#c2410c; font-weight:700;">115 - 124 mm</div>
          </div>

          <!-- 4. Recovered / Improving -->
          <div class="card" style="margin:0; padding:12px; border-left:4px solid var(--secondary); background:var(--secondary-soft); cursor:pointer;" onclick="window.chwToolkit.setFilter('RECOVERED'); window.chwToolkit.switchView('caseload');">
            <div style="font-size:0.7rem; font-weight:800; color:#166534; text-transform:uppercase;">Nakabawi</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--secondary-dark); margin:2px 0;">${recoveredChildren.length}</div>
            <div style="font-size:0.68rem; color:#15803d; font-weight:700;">≥ 125 mm (Normal)</div>
          </div>
        </div>
      </div>

      <!-- Urgent Attention / High Priority Alerts -->
      <div class="card" style="margin-bottom:14px; border:1.5px solid ${samChildren.length > 0 ? '#fca5a5' : '#e2e8f0'};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.95rem;">🚨</span>
            <h3 style="font-size:0.85rem; font-weight:800; color:var(--text-main);">Mga Batang Kailangan ng Agarang Aksyon</h3>
          </div>
          <span style="font-size:0.68rem; font-weight:700; color:${samChildren.length > 0 ? 'var(--danger-sam)' : 'var(--text-muted)'};">
            ${priorityChildren.length} bata
          </span>
        </div>

        ${priorityChildren.length === 0 ? `
          <div style="font-size:0.76rem; color:#15803d; text-align:center; padding:10px; background:#f0fdf4; border-radius:6px;">
            Walang batang nasa malubhang panganib sa kasalukuyan.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${priorityChildren.map(child => `
              <div style="background:#fff5f5; border:1px solid #fed7d7; border-radius:var(--radius-xs); padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:800; font-size:0.84rem; color:var(--text-main);">${child.name}</div>
                    <div style="font-size:0.72rem; color:var(--text-muted);">
                      Magulang: <strong>${child.parentName}</strong> • ${child.community || 'Zone 1'}
                    </div>
                  </div>
                  <span class="badge-status ${child.status === 'SAM' ? 'badge-sam' : 'badge-mam'}">
                    ${child.status === 'SAM' ? 'SAM (Pula)' : 'MAM (Dilaw)'}
                  </span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.7rem; color:#7f1d1d;">
                  <span>MUAC: <strong>${child.currentMuac} mm</strong> (${child.currentWeight} kg)</span>
                  <div style="display:flex; gap:4px;">
                    <button class="btn btn-sm btn-outline-primary" style="padding:2px 6px; font-size:0.68rem;" onclick="window.chwToolkit.openMessagingModal('${child.id}')">Mensahe</button>
                    <button class="btn btn-sm btn-primary" style="padding:2px 6px; font-size:0.68rem;" onclick="window.chwToolkit.openVisitLoggerModal('${child.id}')">Bisita</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Upcoming Scheduled Consultations -->
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.95rem;">📅</span>
            <h3 style="font-size:0.85rem; font-weight:800; color:var(--text-main);">Nakatakdang Konsultasyon at Check-up</h3>
          </div>
          <span style="font-size:0.68rem; font-weight:700; color:var(--primary);">
            ${scheduledChildren.length} naka-iskedyul
          </span>
        </div>

        ${scheduledChildren.length === 0 ? `
          <div style="text-align:center; padding:12px 8px; font-size:0.76rem; color:var(--text-muted);">
            Walang nakatakdang konsultasyon sa ngayon.<br>
            <button class="btn btn-sm btn-secondary" style="margin-top:6px;" onclick="window.chwToolkit.switchView('caseload')">
              Pumili ng Bata para Magtakda ng Iskedyul
            </button>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${scheduledChildren.map(child => `
              <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-xs); padding:8px 10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:800; font-size:0.82rem; color:#1e40af;">${child.name}</div>
                  <div style="font-size:0.7rem; color:#3b82f6;">
                    Magulang: ${child.parentName}
                  </div>
                  <div style="font-size:0.68rem; color:#1d4ed8; font-weight:700; margin-top:2px;">
                    📅 ${child.nextSchedule.date} (${child.nextSchedule.time}) • ${child.nextSchedule.location}
                  </div>
                </div>
                <button class="btn btn-sm btn-secondary" style="font-size:0.68rem; padding:3px 6px;" onclick="window.chwToolkit.openScheduleModal('${child.id}')">
                  Palitan
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Recent Visits / Screenings Log -->
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="font-size:0.85rem; font-weight:800; color:var(--text-main);">Kamakailang Pagsusuri at Bisita</h3>
          <span style="font-size:0.7rem; color:var(--primary); font-weight:700; cursor:pointer;" onclick="window.chwToolkit.switchView('caseload')">
            Lahat ng Tala →
          </span>
        </div>

        ${recentActivity.length === 0 ? `
          <div style="text-align:center; padding:12px; font-size:0.76rem; color:var(--text-muted);">
            Walang naitalang pagsusuri kamakailan.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${recentActivity.map(child => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-light);">
                <div>
                  <div style="font-weight:700; font-size:0.82rem; color:var(--text-main);">${child.name}</div>
                  <div style="font-size:0.68rem; color:var(--text-muted);">
                    Huling Bisita: ${child.lastVisitDate || 'Kamakailan'} • Timbang: ${child.currentWeight} kg
                  </div>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:0.75rem; font-weight:800; color:${child.currentMuac < 115 ? 'var(--danger-sam)' : (child.currentMuac < 125 ? 'var(--warning-mam)' : 'var(--secondary)')};">
                    ${child.currentMuac} mm
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Full Caseload Switcher Banner -->
      <button class="btn btn-primary btn-block" style="min-height:46px; font-size:0.88rem; font-weight:700; margin-bottom:14px;" onclick="window.chwToolkit.switchView('caseload')">
        Tingnan ang Kumpletong Caseload (${children.length} Bata) →
      </button>
    `;
  }

  // 2. Dedicated BHW Caseload View
  renderCaseload(children, currentUser, parents = []) {
    const filtered = children.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.parentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            (c.community || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      if (this.activeFilter === 'ALL') return matchesSearch;
      return matchesSearch && c.status === this.activeFilter;
    });

    const samCount = children.filter(c => c.status === 'SAM').length;
    const mamCount = children.filter(c => c.status === 'MAM' || c.status === 'IMPROVING').length;
    const recoveredCount = children.filter(c => c.status === 'RECOVERED').length;

    return `
      <!-- Sub-Navigation Pill Header (3 Views) -->
      <div class="auth-tab-bar" style="margin-bottom:12px; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:4px;">
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('dashboard')">
          Dashboard
        </button>
        <button class="auth-tab-btn active" onclick="window.chwToolkit.switchView('caseload')">
          Mga Bata (${children.length})
        </button>
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('parents')">
          Magulang (${parents ? parents.length : 0})
        </button>
      </div>

      <!-- Pangkalahatang Buod ng BHW Caseload para sa Barangay Paolbo, Calabanga -->
      <div class="card" style="border-left: 4px solid var(--primary);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Barangay Paolbo • BHW Caseload</div>
            <h2 style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:var(--text-main);">Lahat ng Rehistradong Bata (${children.length})</h2>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.chwToolkit.openAnnouncementModal()">
            📢 Mag-post ng Anunsyo
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; text-align:center;">
          <div style="background:var(--danger-sam-soft); border:1px solid var(--danger-sam-border); border-radius:var(--radius-xs); padding:6px 4px;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--danger-sam);">${samCount}</div>
            <div style="font-size:0.65rem; color:#991b1b; font-weight:700;">SAM (Pula)</div>
          </div>
          <div style="background:var(--warning-mam-soft); border:1px solid var(--warning-mam-border); border-radius:var(--radius-xs); padding:6px 4px;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--warning-mam);">${mamCount}</div>
            <div style="font-size:0.65rem; color:#9a3412; font-weight:700;">MAM (Dilaw)</div>
          </div>
          <div style="background:var(--secondary-soft); border:1px solid var(--secondary-border); border-radius:var(--radius-xs); padding:6px 4px;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--secondary-dark);">${recoveredCount}</div>
            <div style="font-size:0.65rem; color:#15803d; font-weight:700;">Nakabawi</div>
          </div>
        </div>
      </div>

      <!-- Mabilis na Aksyon ng BHW: Gabay sa Pagpapayo at Anunsyo -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;">
        <button class="btn btn-secondary" style="padding:8px 6px; font-size:0.78rem;" onclick="window.chwToolkit.openCounselingGuide()">
          Gabay sa Pagpapayo
        </button>
        <button class="btn btn-primary" style="padding:8px 6px; font-size:0.78rem;" onclick="window.chwToolkit.openAnnouncementModal()">
          📢 Mag-post ng Anunsyo
        </button>
      </div>

      <!-- Filter Tabs para sa Caseload ng BHW -->
      <div class="category-pills" style="margin-bottom:12px;">
        <button class="category-pill ${this.activeFilter === 'ALL' ? 'active' : ''}" onclick="window.chwToolkit.setFilter('ALL')">Lahat (${children.length})</button>
        <button class="category-pill ${this.activeFilter === 'SAM' ? 'active' : ''}" onclick="window.chwToolkit.setFilter('SAM')" style="${this.activeFilter === 'SAM' ? 'background:var(--danger-sam); color:#fff;' : ''}">SAM Pula (${samCount})</button>
        <button class="category-pill ${this.activeFilter === 'MAM' ? 'active' : ''}" onclick="window.chwToolkit.setFilter('MAM')" style="${this.activeFilter === 'MAM' ? 'background:var(--warning-mam); color:#fff;' : ''}">MAM Dilaw (${mamCount})</button>
        <button class="category-pill ${this.activeFilter === 'RECOVERED' ? 'active' : ''}" onclick="window.chwToolkit.setFilter('RECOVERED')" style="${this.activeFilter === 'RECOVERED' ? 'background:var(--secondary); color:#fff;' : ''}">Nakabawi (${recoveredCount})</button>
      </div>

      <!-- Search Input -->
      <div class="search-bar">
        <input type="text" id="chw-search-input" class="search-input" placeholder="Maghanap ng pangalan ng bata o magulang..." value="${this.searchQuery}" oninput="window.chwToolkit.handleSearch(this.value)">
      </div>

      <!-- Listahan ng mga Bata sa Caseload ng BHW (Barangay Paolbo) -->
      <div class="caseload-list">
        ${filtered.length === 0 ? `
          <div class="card" style="text-align:center; padding:32px 16px;">
            <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
            <div style="font-weight:700; color:var(--text-main); margin-bottom:4px;">Walang nahanap na tala</div>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Subukang baguhin ang salita sa paghahanap o magdagdag ng bagong pagsusuri.</p>
            <button class="btn btn-primary btn-sm" onclick="window.chwToolkit.openRegisterChildModal()">
              + Magrehistro ng Bata
            </button>
          </div>
        ` : filtered.map(child => {
          const statusBadge = {
            'SAM': 'badge-sam',
            'MAM': 'badge-mam',
            'IMPROVING': 'badge-improving',
            'RECOVERED': 'badge-recovered'
          }[child.status] || 'badge-mam';

          const statusText = {
            'SAM': 'SAM (Malubha)',
            'MAM': 'MAM (Katamtaman)',
            'IMPROVING': 'Bumubuti',
            'RECOVERED': 'Nakabawi'
          }[child.status] || child.status;

          return `
            <div class="card card-caseload" style="${child.status === 'SAM' ? 'border-left: 4px solid var(--danger-sam);' : (child.status === 'RECOVERED' ? 'border-left: 4px solid var(--secondary);' : 'border-left: 4px solid var(--warning-mam);')}">
              <!-- Pangalan at Status ng Bata -->
              <div class="caseload-header">
                <div>
                  <div class="caseload-name">${child.name}</div>
                  <div class="caseload-meta">
                    Edad: <strong>${window.formatChildAge ? window.formatChildAge(child.ageMonths) : child.ageMonths + ' Buwan'}</strong> (${child.ageMonths} buwan) • ${child.gender}
                  </div>
                  <div style="font-size:0.72rem; color:var(--text-muted); margin-top:1px;">
                    Magulang: <strong>${child.parentName}</strong> • ${child.community || 'Barangay Paolbo, Calabanga'}
                  </div>
                  <div style="font-size:0.7rem; color:var(--primary); font-weight:600; margin-top:2px;">
                    Nakatalaga: ${child.chwAssigned}
                  </div>
                </div>
                <span class="badge-status ${statusBadge}">${statusText}</span>
              </div>

              <!-- MUAC at Timbang Stats -->
              <div class="caseload-details">
                <div>
                  <div class="caseload-detail-label">Timbang</div>
                  <div class="caseload-detail-val">${child.currentWeight} kg</div>
                </div>
                <div>
                  <div class="caseload-detail-label">MUAC (Braso)</div>
                  <div class="caseload-detail-val" style="${child.currentMuac < 115 ? 'color:var(--danger-sam);' : (child.currentMuac < 125 ? 'color:var(--warning-mam);' : 'color:var(--secondary);')}">
                    ${child.currentMuac} mm
                  </div>
                </div>
                <div>
                  <div class="caseload-detail-label">Huling Bisita</div>
                  <div class="caseload-detail-val">${child.lastVisitDate ? child.lastVisitDate.slice(5) : 'Wala'}</div>
                </div>
              </div>

              <!-- Nakatakdang Konsultasyon / Follow-up kung mayroon -->
              ${child.nextSchedule ? `
                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:4px; padding:4px 8px; font-size:0.72rem; color:#1e40af; margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
                  <span>📅 Iskedyul: <strong>${child.nextSchedule.date} (${child.nextSchedule.time})</strong></span>
                  <span style="font-size:0.68rem; color:#2563eb; font-weight:600;">${child.nextSchedule.location.split(' ')[0]}</span>
                </div>
              ` : ''}

              <!-- Aksyon ng BHW: Impormasyon/Paggamit, Mensahe, Iskedyul, at Bisita -->
              <div class="caseload-actions" style="display:grid; grid-template-columns: repeat(4, 1fr) auto; gap:4px; margin-top:8px;">
                <button class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:4px 2px;" onclick="window.chwToolkit.openChildDetailModal('${child.id}')" title="Tingnan ang Profile at Paggamit ng Magulang">
                  Paggamit
                </button>
                <button class="btn btn-outline-primary btn-sm" style="font-size:0.72rem; padding:4px 2px;" onclick="window.chwToolkit.openMessagingModal('${child.id}')" title="Magpadala ng Mensahe sa Magulang">
                  Mensahe
                </button>
                <button class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:4px 2px; color:var(--primary); font-weight:700;" onclick="window.chwToolkit.openScheduleModal('${child.id}')" title="Magtakda ng Iskedyul ng Konsultasyon">
                  Iskedyul
                </button>
                <button class="btn btn-primary btn-sm" style="font-size:0.72rem; padding:4px 2px;" onclick="window.chwToolkit.openVisitLoggerModal('${child.id}')" title="Itala ang Bisita at Timbang">
                  Bisita
                </button>
                <button class="btn btn-secondary btn-sm" title="Burahin ang Record" onclick="window.chwToolkit.openDeleteChildModal('${child.id}')" style="color:#ef4444; padding:4px 6px;">
                  ✕
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 3. Dedicated BHW Parents Directory View (Access to view & manage all parent created accounts)
  renderParentsDirectory(parents, currentUser, children) {
    let filteredParents = parents;
    if (this.parentSearchQuery && this.parentSearchQuery.trim()) {
      const q = this.parentSearchQuery.toLowerCase().trim();
      filteredParents = parents.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.username && p.username.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.community && p.community.toLowerCase().includes(q)) ||
        (p.linkedChildren && p.linkedChildren.some(c => c.name.toLowerCase().includes(q)))
      );
    }

    return `
      <!-- Sub-Navigation Pill Header (3 Views) -->
      <div class="auth-tab-bar" style="margin-bottom:12px; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:4px;">
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('dashboard')">
          Dashboard
        </button>
        <button class="auth-tab-btn" onclick="window.chwToolkit.switchView('caseload')">
          Mga Bata (${children.length})
        </button>
        <button class="auth-tab-btn active" onclick="window.chwToolkit.switchView('parents')">
          Magulang (${parents.length})
        </button>
      </div>

      <!-- Header Card -->
      <div class="card" style="border-left: 4px solid var(--primary); margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">
              Direktoryo ng Barangay Paolbo
            </div>
            <h2 style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:var(--text-main); margin:0;">
              Mga Account ng Magulang (${parents.length})
            </h2>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.chwToolkit.openRegisterChildModal()">
            + Magrehistro
          </button>
        </div>
        <p style="font-size:0.76rem; color:var(--text-muted); margin:0;">
          Lahat ng mga nagawang account ng magulang at ang kanilang mga nakatalagang anak sa NutriLearn.
        </p>
      </div>

      <!-- Search Bar para sa Magulang -->
      <div style="margin-bottom:12px;">
        <input type="text" class="form-input" placeholder="Maghanap ayon sa pangalan, username, telepono, o bata..." value="${this.parentSearchQuery || ''}" oninput="window.chwToolkit.handleParentSearch(this.value)" />
      </div>

      <!-- Talaan ng mga Account ng Magulang -->
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
        ${filteredParents.length === 0 ? `
          <div class="card" style="text-align:center; padding:28px 12px;">
            <div style="font-size:2rem; margin-bottom:6px;">👨‍👩‍👧</div>
            <div style="font-size:0.9rem; font-weight:800; color:var(--text-main); margin-bottom:4px;">
              ${this.parentSearchQuery ? 'Walang nahanap na magulang sa paghahanap.' : 'Wala pang nagagawang account ng magulang.'}
            </div>
            <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
              Kapag nagrehistro ka ng bagong bata, awtomatikong gagawa ng account para sa magulang.
            </p>
            <button class="btn btn-primary" onclick="window.chwToolkit.openRegisterChildModal()">
              + Magrehistro ng Bata at Magulang
            </button>
          </div>
        ` : filteredParents.map(parent => {
          const linked = parent.linkedChildren || [];
          return `
            <div class="card" style="margin-bottom:0; padding:14px; border:1px solid var(--border-light); border-radius:var(--radius-sm);">
              <!-- Top Row: Avatar + Info -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <div style="width:40px; height:40px; border-radius:50%; background:var(--primary-soft); color:var(--primary-dark); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.95rem; border:1.5px solid var(--primary-border);">
                    ${parent.avatar || 'MG'}
                  </div>
                  <div>
                    <h3 style="font-size:0.92rem; font-weight:800; color:var(--text-main); margin:0;">
                      ${parent.name}
                    </h3>
                    <div style="font-size:0.72rem; color:var(--text-muted); margin-top:1px;">
                      Username: <strong style="color:var(--primary);">@${parent.username}</strong> • Tel: <strong>${parent.phone || 'N/A'}</strong>
                    </div>
                    <div style="font-size:0.7rem; color:var(--text-muted); margin-top:1px;">
                      📍 ${parent.community || 'Barangay Paolbo, Calabanga'}
                    </div>
                  </div>
                </div>
                <span style="background:var(--secondary-soft); color:var(--secondary-dark); border:1px solid var(--secondary-border); font-size:0.65rem; font-weight:800; padding:2px 7px; border-radius:10px;">
                  Magulang
                </span>
              </div>

              <!-- Linked Children Section -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; margin:8px 0;">
                <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">
                  Konektadong Anak (${linked.length}):
                </div>
                ${linked.length === 0 ? `
                  <div style="font-size:0.74rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
                    <span>Wala pang nakatalagang profile ng bata.</span>
                    <button class="btn btn-sm btn-outline-primary" style="font-size:0.68rem; padding:2px 6px;" onclick="window.chwToolkit.openRegisterChildModal('${parent.id}')">
                      + Ikonekta ang Bata
                    </button>
                  </div>
                ` : `
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${linked.map(c => `
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; background:#fff; padding:4px 8px; border-radius:4px; border:1px solid #e2e8f0;">
                        <div>
                          <strong style="color:var(--text-main);">${c.name}</strong> 
                          <span style="color:var(--text-muted); font-size:0.7rem;">(${c.currentWeight}kg • ${c.currentMuac}mm)</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:4px;">
                          <span class="badge-status ${c.status === 'SAM' ? 'badge-sam' : (c.status === 'RECOVERED' ? 'badge-recovered' : 'badge-mam')}" style="font-size:0.62rem; padding:1px 5px;">
                            ${c.status}
                          </span>
                          <button class="btn btn-sm btn-secondary" style="font-size:0.65rem; padding:1px 5px;" onclick="window.chwToolkit.openChildDetailModal('${c.id}')">
                            Detalye
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

              <!-- Action Buttons for Parent Account -->
              <div style="display:grid; grid-template-columns: 1.2fr 1fr 1fr auto; gap:4px; margin-top:8px;">
                <button class="btn btn-outline-primary btn-sm" style="font-size:0.72rem; padding:5px 4px;" onclick="window.chwToolkit.openMessagingModal('${linked.length > 0 ? linked[0].id : ''}')" ${linked.length === 0 ? 'disabled title="Kailangan munang magrehistro ng bata"' : ''}>
                  💬 Mensahe
                </button>
                <button class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:5px 4px;" onclick="window.chwToolkit.openRegisterChildModal('${parent.id}')">
                  ➕ Anak
                </button>
                <button class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:5px 4px;" onclick="window.chwToolkit.openEditParentModal('${parent.id}')">
                  ✏️ I-edit
                </button>
                <button class="btn btn-secondary btn-sm" style="font-size:0.72rem; color:#ef4444; padding:5px 8px;" onclick="window.chwToolkit.openDeleteParentModal('${parent.id}')" title="Burahin ang account ng magulang">
                  ✕
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  handleParentSearch(val) {
    this.parentSearchQuery = val;
    this.render();
  }

  handleSearch(val) {
    this.searchQuery = val;
    this.render();
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.render();
  }

  openRecoveryConfirmationModal(childId) {
    const child = window.storageService.getChildById(childId);
    const currentUser = window.storageService.getCurrentUser() || { name: 'BHW Maria Santos', title: 'BHW #12 - Paolbo' };
    if (!child) return;

    window.app.showModal(`
      <div style="text-align:center; margin-bottom:12px;">
        <h2 style="font-size:1.15rem; font-weight:800;">Opisyal na Pagpapalabas at Sertipiko ng Pagbuti</h2>
        <div style="font-size:0.78rem; color:var(--text-muted);">
          Pagtatapos ni <strong>${child.name}</strong> (Magulang: ${child.parentName} • Barangay Paolbo)
        </div>
      </div>

      <form onsubmit="window.chwToolkit.handleConfirmRecovery(event, '${child.id}')">
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px; margin-bottom:12px; font-size:0.78rem; color:#166534;">
          <strong>Tungkulin ng BHW:</strong> Ang rehistradong Barangay Health Worker (BHW) lamang ang maaaring magpatibay ng paggaling ng bata at magkaloob ng Katibayan ng Ganap na Pagbuti sa Bayan ng Calabanga.
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Huling Timbang sa Paglabas (kg) *</label>
            <input type="number" step="0.1" id="rec-final-weight" class="form-input" required value="${child.currentWeight}" />
            <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">Target: ${child.targetWeight} kg</div>
          </div>
          <div class="form-group">
            <label class="form-label">Huling Sukat ng Braso MUAC (mm) *</label>
            <input type="number" id="rec-final-muac" class="form-input" required value="${Math.max(child.currentMuac, 126)}" />
            <div style="font-size:0.68rem; color:#047857; margin-top:2px;">Dapat ay ≥125mm (Normal)</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Mga Tala at Puna ng BHW sa Pag-discharge</label>
          <textarea id="rec-final-notes" class="form-textarea" rows="2" placeholder="Naabot ng bata ang normal na timbang at sukat ng braso; masigla, maganda ang gana sa pagkain, walang pamamaga sa paa. Natapos ng ina ang 4-star diet edukasyon."></textarea>
        </div>

        <div style="background:#f8fafc; padding:6px 8px; border-radius:6px; font-size:0.74rem; color:var(--text-muted); margin-bottom:12px;">
          Dumadalong BHW: <strong>${currentUser.name}</strong> (${currentUser.title || 'Barangay Health Worker - Paolbo'})
        </div>

        <div style="display:flex; gap:8px;">
          <button type="button" class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button type="submit" class="btn btn-success btn-block">
            Kumpirmahin ang Pagbuti at Ibigay ang Sertipiko
          </button>
        </div>
      </form>
    `);
  }

  handleConfirmRecovery(e, childId) {
    e.preventDefault();
    const currentUser = window.storageService.getCurrentUser() || { name: 'Maria Santos', title: 'BHW #12 - Paolbo' };
    const weight = parseFloat(document.getElementById('rec-final-weight').value);
    const muac = parseFloat(document.getElementById('rec-final-muac').value);
    const notes = document.getElementById('rec-final-notes').value || 'Matagumpay na nakatapos at naka-recover sa ilalim ng BHW monitoring.';

    const child = window.storageService.graduateChild(childId, {
      weight,
      muac,
      notes,
      date: new Date().toISOString().split('T')[0]
    });

    if (child) {
      child.chwAssigned = `${currentUser.name} (${currentUser.title || 'BHW'})`;
      window.storageService.saveChild(child);
    }

    window.app.closeModal();
    this.render();
    window.app.showToast(`Ganap nang nakabawi si ${child.name}. Nagawa ang Sertipiko.`, 'success');
    
    setTimeout(() => {
      window.app.openCertificateModal(childId);
    }, 400);
  }

  openChildDetailModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    const ageFormatted = window.formatChildAge ? window.formatChildAge(child.ageMonths) : `${child.ageMonths} Buwan`;
    const summary = window.storageService.getParentActivitySummary(child.id) || {
      totalLoggedDays: 0,
      totalMealsChecked: 0,
      fourStarDays: 0,
      completedModulesCount: 0,
      lastActiveDate: child.lastVisitDate,
      recentLogs: []
    };

    window.app.showModal(`
      <span class="badge-status ${child.status === 'RECOVERED' ? 'badge-recovered' : (child.status === 'SAM' ? 'badge-sam' : 'badge-mam')}" style="margin-bottom:6px; display:inline-block;">${child.status}</span>
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">${child.name}</h2>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
        Edad: <strong>${ageFormatted}</strong> (${child.ageMonths} buwan) • Kasarian: ${child.gender} • ${child.community || 'Barangay Paolbo, Calabanga'}
      </div>

      <!-- Klinikal na Talaan -->
      <div style="background:#f8fafc; padding:8px 10px; border-radius:6px; font-size:0.78rem; margin-bottom:10px; display:flex; flex-direction:column; gap:3px;">
        <div><strong>Petsa ng Kapanganakan (DOB):</strong> ${child.birthDate ? child.birthDate : 'Hindi nakatala'}</div>
        <div><strong>Magulang / Tagapag-alaga:</strong> ${child.parentName} (${child.parentContact})</div>
        <div><strong>Nakatalagang BHW:</strong> ${child.chwAssigned}</div>
        <div><strong>Petsa ng Pagpasok:</strong> ${child.admissionDate} • <strong>Huling Pagsusuri:</strong> ${child.lastVisitDate}</div>
        <div><strong>Target na Timbang sa Pagbawi:</strong> ${child.targetWeight} kg (Kasalukuyan: ${child.currentWeight} kg)</div>
      </div>

      <!-- Pagsubaybay sa Paggamit ng Magulang sa App (Parent App Usage & Engagement) -->
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:10px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="font-size:0.82rem; color:#166534;">Paggamit ng Magulang sa App (Aktibidad)</strong>
          <span style="font-size:0.7rem; color:#15803d; font-weight:600;">Huling Aktibo: ${summary.lastActiveDate}</span>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:6px; text-align:center; font-size:0.75rem; margin-bottom:8px;">
          <div style="background:#fff; padding:6px 4px; border-radius:4px; border:1px solid #86efac;">
            <div style="font-weight:800; font-size:0.95rem; color:#166534;">${summary.totalLoggedDays}</div>
            <div style="font-size:0.68rem; color:#15803d;">Araw ng Pag-log</div>
          </div>
          <div style="background:#fff; padding:6px 4px; border-radius:4px; border:1px solid #86efac;">
            <div style="font-weight:800; font-size:0.95rem; color:#166534;">${summary.completedModulesCount}/5</div>
            <div style="font-size:0.68rem; color:#15803d;">Aralin na Nabasa</div>
          </div>
          <div style="background:#fff; padding:6px 4px; border-radius:4px; border:1px solid #86efac;">
            <div style="font-weight:800; font-size:0.95rem; color:#059669;">${summary.fourStarDays}</div>
            <div style="font-size:0.68rem; color:#15803d;">4-Star Kumpleto</div>
          </div>
        </div>

        ${summary.recentLogs.length > 0 ? `
          <div style="font-size:0.72rem; color:#166534; border-top:1px dashed #86efac; padding-top:6px;">
            <strong>Huling Naitalang Pagkain (${summary.recentLogs[0].date}):</strong><br>
            ${summary.recentLogs[0].logs.breakfast ? '✓ Almusal ' : ''}
            ${summary.recentLogs[0].logs.lunch ? '✓ Tanghalian ' : ''}
            ${summary.recentLogs[0].logs.dinner ? '✓ Hapunan ' : ''}
            ${summary.recentLogs[0].logs.morningSnack || summary.recentLogs[0].logs.afternoonSnack ? '✓ Meryenda ' : ''}
            ${summary.recentLogs[0].logs.vitamins ? '✓ Bitamina ' : ''}
            ${(() => {
              const notes = [];
              if (summary.recentLogs[0].logs.breakfastNote) notes.push(`Almusal: "${summary.recentLogs[0].logs.breakfastNote}"`);
              if (summary.recentLogs[0].logs.morningSnackNote) notes.push(`Meryenda (U): "${summary.recentLogs[0].logs.morningSnackNote}"`);
              if (summary.recentLogs[0].logs.lunchNote) notes.push(`Tanghalian: "${summary.recentLogs[0].logs.lunchNote}"`);
              if (summary.recentLogs[0].logs.afternoonSnackNote) notes.push(`Meryenda (H): "${summary.recentLogs[0].logs.afternoonSnackNote}"`);
              if (summary.recentLogs[0].logs.dinnerNote) notes.push(`Hapunan: "${summary.recentLogs[0].logs.dinnerNote}"`);
              if (summary.recentLogs[0].logs.generalNote) notes.push(`Mensahe: "${summary.recentLogs[0].logs.generalNote}"`);
              return notes.length > 0 ? `<div style="margin-top:4px; font-size:0.7rem; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:3px 6px; border-radius:4px; line-height:1.35;"><strong>🍽️ Tala ng Magulang sa Kinain:</strong> ${notes.join(' • ')}</div>` : '';
            })()}
          </div>
        ` : `
          <div style="font-size:0.72rem; color:#15803d; font-style:italic;">
            Wala pang naitalang feeding checklist ang magulang. Mag-iwan ng paalala sa pamamagitan ng Mensahe.
          </div>
        `}
      </div>

      <!-- Nakatakdang Konsultasyon / Check-up -->
      ${child.nextSchedule ? `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:10px; margin-bottom:10px; font-size:0.78rem; color:#1e40af;">
          <div style="font-weight:800; margin-bottom:2px;">📅 Nakatakdang Konsultasyon / Check-up:</div>
          <div>Petsa: <strong>${child.nextSchedule.date} (${child.nextSchedule.time})</strong></div>
          <div>Lugar: <strong>${child.nextSchedule.location}</strong></div>
          <div>Layunin: ${child.nextSchedule.purpose}</div>
          ${child.nextSchedule.notes ? `<div style="margin-top:2px; font-style:italic;">Tagubilin: "${child.nextSchedule.notes}"</div>` : ''}
        </div>
      ` : ''}

      <!-- Iniresetang Plano sa Pagkain -->
      <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:8px 10px; border-radius:6px; font-size:0.78rem; margin-bottom:12px; color:#115e59;">
        <strong>Iniresetang Plano sa Pagkain:</strong>
        <p style="margin-top:2px;">${child.prescribedDiet}</p>
        ${child.notes ? `<p style="margin-top:4px; font-style:italic;">Mga Tala: "${child.notes}"</p>` : ''}
      </div>

      <!-- Aksyon ng BHW -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:6px;">
        <button class="btn btn-outline-primary" style="font-size:0.78rem; padding:8px 6px;" onclick="window.app.closeModal(); window.chwToolkit.openMessagingModal('${child.id}');">
          Mensahe sa Magulang
        </button>
        <button class="btn btn-secondary" style="font-size:0.78rem; padding:8px 6px; color:var(--primary); font-weight:700;" onclick="window.app.closeModal(); window.chwToolkit.openScheduleModal('${child.id}');">
          Itakda ang Iskedyul
        </button>
      </div>

      <div style="display:flex; gap:6px;">
        ${child.status === 'RECOVERED' ? `
          <button class="btn btn-success btn-block" onclick="window.app.closeModal(); window.app.openCertificateModal('${child.id}');">
            Tingnan ang Sertipiko
          </button>
        ` : `
          <button class="btn btn-outline-success btn-block" onclick="window.app.closeModal(); window.chwToolkit.openRecoveryConfirmationModal('${child.id}');">
            I-discharge
          </button>
          <button class="btn btn-primary btn-block" onclick="window.app.closeModal(); window.chwToolkit.openVisitLoggerModal('${child.id}');">
            Itala ang Bisita
          </button>
        `}
        <button class="btn btn-danger" onclick="window.chwToolkit.openDeleteChildModal('${child.id}')">
          Burahin
        </button>
      </div>
    `);
  }

  openDeleteChildModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    window.app.showModal(`
      <div style="text-align:center; padding:10px 0;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:6px 0;">Burahin ang Record ng Bata?</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
          Sigurado ka bang nais mong alisin si <strong>${child.name}</strong> mula sa caseload ng Barangay Paolbo?
        </p>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button class="btn btn-danger btn-block" onclick="window.chwToolkit.handleConfirmDelete('${child.id}')">
            Oo, Burahin ang Record
          </button>
        </div>
      </div>
    `);
  }

  handleConfirmDelete(childId) {
    window.storageService.deleteChild(childId);
    window.app.closeModal();
    this.render();
    window.app.showToast('Naalis ang record ng bata mula sa caseload.', 'info');
  }

  openScreeningModal() {
    this.openRegisterChildModal();
  }

  openRegisterChildModal() {
    const parents = window.storageService.getUsers().filter(u => u.role === 'parent');

    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">Magrehistro ng Bata at Account ng Magulang</h2>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">
        BHW Registration & Parent Account Creation • Barangay Paolbo
      </p>
      
      <form id="screening-form" onsubmit="window.chwToolkit.handleSaveScreening(event)">
        
        <!-- 1. Paggawa / Pagpili ng Account ng Magulang -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-sm); padding:10px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="font-size:0.82rem; font-weight:800; color:var(--primary); margin:0;">
              1. Impormasyon at Account ng Magulang
            </h4>
            <span id="parent-mode-badge" style="font-size:0.7rem; color:var(--primary); font-weight:700;">Bagong Account</span>
          </div>

          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label">Opsyon sa Magulang *</label>
            <select id="screen-parent-select" class="form-select" onchange="window.chwToolkit.handleParentSelectChange(this.value)">
              <option value="NEW">+ Gumawa ng Bagong Account ng Magulang</option>
              ${parents.map(p => `
                <option value="${p.id}" data-name="${p.name}" data-phone="${p.phone || ''}" data-username="${p.username || ''}" data-password="${p.password || 'magulang123'}" data-community="${p.community || 'Zone 1, Barangay Paolbo'}">
                  ${p.name} (${p.phone || p.username || 'Paolbo'})
                </option>
              `).join('')}
            </select>

            <!-- Mga Aksyon para sa Napiling Magulang: Edit at Remove -->
            <div id="selected-parent-actions" style="display:none; justify-content:flex-end; gap:6px; margin-top:6px;">
              <button type="button" id="btn-edit-parent" class="btn btn-sm btn-outline-primary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.chwToolkit.toggleEditSelectedParent()">
                I-edit ang Magulang
              </button>
              <button type="button" class="btn btn-sm btn-danger" style="font-size:0.75rem; padding:3px 8px;" onclick="window.chwToolkit.handleRemoveSelectedParent()">
                Burahin ang Magulang
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Buong Pangalan ng Magulang / Tagapag-alaga *</label>
            <input type="text" id="screen-parent-name" class="form-input" required placeholder="Pangalan ng Magulang" oninput="window.chwToolkit.autoSuggestUsername(this.value)" />
          </div>

          <div class="form-group">
            <label class="form-label">Numero ng Telepono *</label>
            <input type="text" id="screen-parent-phone" class="form-input" required placeholder="0917-000-0000" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone / Purok *</label>
              <input type="text" id="screen-parent-zone" class="form-input" required placeholder="hal. Zone 1" value="Zone 1" />
            </div>
            <div class="form-group">
              <label class="form-label">Barangay *</label>
              <input type="text" id="screen-parent-barangay" class="form-input" required value="Barangay Paolbo" />
            </div>
          </div>

          <div class="form-row" id="parent-creds-row">
            <div class="form-group">
              <label class="form-label">Username ng Magulang *</label>
              <input type="text" id="screen-parent-username" class="form-input" required placeholder="Username" />
            </div>
            <div class="form-group">
              <label class="form-label">Password ng Magulang *</label>
              <input type="text" id="screen-parent-password" class="form-input" required value="magulang123" />
            </div>
          </div>

          <button type="button" id="btn-save-parent-edit" class="btn btn-sm btn-success btn-block" style="display:none; margin-top:8px;" onclick="window.chwToolkit.handleSaveParentEdit()">
            I-save ang Pagbabago sa Account ng Magulang
          </button>

          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:6px;">
            Ang username at password na ito ang gagamitin ng magulang upang mag-sign in at makita ang datos ng kanyang anak.
          </div>
        </div>

        <!-- 2. Profile at Pagsusuri ng Bata -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-sm); padding:10px; margin-bottom:12px;">
          <h4 style="font-size:0.82rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
            2. Profile at Pagsusuri ng Bata (Clinical Assessment)
          </h4>

          <div class="form-group">
            <label class="form-label">Buong Pangalan ng Bata *</label>
            <input type="text" id="screen-name" class="form-input" required placeholder="Pangalan ng Bata" />
          </div>

          <div class="form-group">
            <label class="form-label">Petsa ng Kapanganakan (Date of Birth) *</label>
            <input type="date" id="screen-dob" class="form-input" required value="${new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}" max="${new Date().toISOString().split('T')[0]}" onchange="window.chwToolkit.handleDobChange(this.value)" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Edad: Taon (Year) *</label>
              <input type="number" id="screen-age-years" class="form-input" required min="0" max="5" value="1" placeholder="Taon" oninput="window.chwToolkit.updateAgeDisplay(true)" />
            </div>
            <div class="form-group">
              <label class="form-label">Edad: Buwan (Month) *</label>
              <input type="number" id="screen-age-months" class="form-input" required min="0" max="11" value="0" placeholder="Buwan" oninput="window.chwToolkit.updateAgeDisplay(true)" />
            </div>
            <div class="form-group">
              <label class="form-label">Kasarian ng Bata *</label>
              <select id="screen-gender" class="form-select">
                <option value="Babae">Babae</option>
                <option value="Lalaki">Lalaki</option>
              </select>
            </div>
          </div>
          <div id="screen-age-calc-text" style="font-size:0.72rem; color:var(--primary); font-weight:700; margin-top:-4px; margin-bottom:8px;">
            Kabuuang Edad: 1 Taon (12 buwan)
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Timbang (kg) *</label>
              <input type="number" step="0.1" id="screen-weight" class="form-input" required placeholder="7.0" oninput="window.chwToolkit.updateTriagePreview()" />
            </div>
            <div class="form-group">
              <label class="form-label">Haba / Taas (cm)</label>
              <input type="number" step="0.5" id="screen-height" class="form-input" placeholder="72.0" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Sukat ng Braso (MUAC sa mm) *</label>
            <input type="number" id="screen-muac" class="form-input" required value="118" min="80" max="180" oninput="window.chwToolkit.updateTriagePreview()" />
            
            <div class="muac-scale">
              <div class="muac-segment-red"></div>
              <div class="muac-segment-yellow"></div>
              <div class="muac-segment-green"></div>
            </div>
            <div class="muac-labels">
              <span style="color:#ef4444;">&lt;115mm (SAM - Pula)</span>
              <span style="color:#f59e0b;">115-124mm (MAM - Dilaw)</span>
              <span style="color:#10b981;">≥125mm (Normal - Berde)</span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label style="display:flex; align-items:center; gap:6px; font-size:0.78rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="screen-edema" onchange="window.chwToolkit.updateTriagePreview()" />
              May Manas ba sa Dalawang Paa (Bilateral Edema)?
            </label>
          </div>
        </div>

        <div id="triage-feedback-card" style="background:#ffedd5; border:1px solid #fed7aa; border-radius:6px; padding:8px 10px; font-size:0.78rem; color:#9a3412; margin-bottom:12px; font-weight:600;">
          Klasipikasyon: Katamtamang Malnutrisyon (MAM) • Magtakda ng 4-Star Diet at Lingguhang Pagsubaybay ng BHW
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          Irehistro ang Bata at Account ng Magulang
        </button>
      </form>
    `);
    this.updateTriagePreview();
  }

  autoSuggestUsername(name) {
    const usernameInput = document.getElementById('screen-parent-username');
    const select = document.getElementById('screen-parent-select');
    if (select && select.value === 'NEW' && usernameInput && name) {
      usernameInput.value = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    }
  }

  handleParentSelectChange(parentId) {
    const select = document.getElementById('screen-parent-select');
    const selectedOption = select.options[select.selectedIndex];
    const nameInput = document.getElementById('screen-parent-name');
    const phoneInput = document.getElementById('screen-parent-phone');
    const userRow = document.getElementById('parent-creds-row');
    const userInput = document.getElementById('screen-parent-username');
    const passInput = document.getElementById('screen-parent-password');
    const zoneInput = document.getElementById('screen-parent-zone');
    const brgyInput = document.getElementById('screen-parent-barangay');
    const actionsBox = document.getElementById('selected-parent-actions');
    const modeBadge = document.getElementById('parent-mode-badge');
    const editBtn = document.getElementById('btn-edit-parent');
    const saveParentBtn = document.getElementById('btn-save-parent-edit');

    this.isEditingParent = false;
    if (saveParentBtn) saveParentBtn.style.display = 'none';

    if (parentId && parentId !== 'NEW') {
      if (actionsBox) actionsBox.style.display = 'flex';
      if (modeBadge) {
        modeBadge.textContent = 'Napiling Umiiral na Magulang';
        modeBadge.style.color = 'var(--secondary-dark)';
      }
      if (editBtn) editBtn.textContent = 'I-edit ang Magulang';

      const name = selectedOption.getAttribute('data-name') || '';
      const phone = selectedOption.getAttribute('data-phone') || '';
      const username = selectedOption.getAttribute('data-username') || '';
      const password = selectedOption.getAttribute('data-password') || 'magulang123';
      const community = selectedOption.getAttribute('data-community') || 'Zone 1, Barangay Paolbo';

      if (nameInput) { nameInput.value = name; nameInput.readOnly = true; }
      if (phoneInput) { phoneInput.value = phone; phoneInput.readOnly = true; }
      if (userInput) { userInput.value = username; userInput.readOnly = true; }
      if (passInput) { passInput.value = password; passInput.readOnly = true; }
      if (userRow) userRow.style.display = 'grid';

      if (zoneInput && brgyInput) {
        if (community.includes(',')) {
          const parts = community.split(',');
          zoneInput.value = parts[0].trim();
          brgyInput.value = parts[1].trim();
        } else {
          brgyInput.value = community;
        }
        zoneInput.readOnly = true;
        brgyInput.readOnly = true;
      }
    } else {
      if (actionsBox) actionsBox.style.display = 'none';
      if (modeBadge) {
        modeBadge.textContent = 'Bagong Account';
        modeBadge.style.color = 'var(--primary)';
      }
      if (nameInput) { nameInput.value = ''; nameInput.readOnly = false; nameInput.focus(); }
      if (phoneInput) { phoneInput.value = ''; phoneInput.readOnly = false; }
      if (userInput) { userInput.value = ''; userInput.readOnly = false; }
      if (passInput) { passInput.value = 'magulang123'; passInput.readOnly = false; }
      if (userRow) userRow.style.display = 'grid';
      if (zoneInput) { zoneInput.value = 'Zone 1'; zoneInput.readOnly = false; }
      if (brgyInput) { brgyInput.value = 'Barangay Paolbo'; brgyInput.readOnly = false; }
    }
  }

  toggleEditSelectedParent() {
    const select = document.getElementById('screen-parent-select');
    const parentId = select ? select.value : null;
    if (!parentId || parentId === 'NEW') return;

    this.isEditingParent = !this.isEditingParent;

    const nameInput = document.getElementById('screen-parent-name');
    const phoneInput = document.getElementById('screen-parent-phone');
    const userInput = document.getElementById('screen-parent-username');
    const passInput = document.getElementById('screen-parent-password');
    const zoneInput = document.getElementById('screen-parent-zone');
    const brgyInput = document.getElementById('screen-parent-barangay');
    const editBtn = document.getElementById('btn-edit-parent');
    const saveParentBtn = document.getElementById('btn-save-parent-edit');

    const isReadOnly = !this.isEditingParent;
    if (nameInput) nameInput.readOnly = isReadOnly;
    if (phoneInput) phoneInput.readOnly = isReadOnly;
    if (userInput) userInput.readOnly = isReadOnly;
    if (passInput) passInput.readOnly = isReadOnly;
    if (zoneInput) zoneInput.readOnly = isReadOnly;
    if (brgyInput) brgyInput.readOnly = isReadOnly;

    if (this.isEditingParent) {
      if (editBtn) editBtn.textContent = 'Kanselahin';
      if (saveParentBtn) saveParentBtn.style.display = 'block';
      if (nameInput) nameInput.focus();
      window.app.showToast('Maaari nang i-edit ang mga detalye ng magulang.', 'info');
    } else {
      if (editBtn) editBtn.textContent = 'I-edit ang Magulang';
      if (saveParentBtn) saveParentBtn.style.display = 'none';
      this.handleParentSelectChange(parentId);
    }
  }

  handleSaveParentEdit() {
    const select = document.getElementById('screen-parent-select');
    const parentId = select ? select.value : null;
    if (!parentId || parentId === 'NEW') return;

    const name = document.getElementById('screen-parent-name').value.trim();
    const phone = document.getElementById('screen-parent-phone').value.trim();
    const username = document.getElementById('screen-parent-username').value.trim();
    const password = document.getElementById('screen-parent-password').value.trim();
    const zone = document.getElementById('screen-parent-zone') ? document.getElementById('screen-parent-zone').value.trim() : '';
    const barangay = document.getElementById('screen-parent-barangay') ? document.getElementById('screen-parent-barangay').value.trim() : 'Barangay Paolbo';
    const community = `${zone ? zone + ', ' : ''}${barangay}`;

    if (!name || !phone || !username || !password) {
      window.app.showToast('Punan ang lahat ng kinakailangang impormasyon ng magulang.', 'danger');
      return;
    }

    const updated = window.storageService.updateUser(parentId, {
      name,
      phone,
      username,
      password,
      community
    });

    if (updated) {
      this.isEditingParent = false;
      this.openRegisterChildModal();
      setTimeout(() => {
        const newSelect = document.getElementById('screen-parent-select');
        if (newSelect) {
          newSelect.value = parentId;
          this.handleParentSelectChange(parentId);
        }
      }, 50);
      window.app.showToast(`Matagumpay na na-update ang account para kay ${name}.`, 'success');
    }
  }

  handleRemoveSelectedParent() {
    const select = document.getElementById('screen-parent-select');
    const parentId = select ? select.value : null;
    if (!parentId || parentId === 'NEW') return;

    const selectedOption = select.options[select.selectedIndex];
    const parentName = selectedOption.getAttribute('data-name') || 'ang magulang';

    if (confirm(`Sigurado ka bang nais mong tuluyang burahin ang account ng magulang na si "${parentName}"?`)) {
      window.storageService.deleteUser(parentId);
      this.openRegisterChildModal();
      window.app.showToast(`Nabura ang account para kay ${parentName}.`, 'info');
    }
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
      feedback.innerHTML = '<strong>Severe Acute Malnutrition (SAM):</strong> Agaran! I-refer para sa therapeutic feeding (RUTF) sa RHU Calabanga at mahigpit na bantayan ng BHW.';
    } else if (muac >= 115 && muac < 125) {
      feedback.style.background = '#ffedd5';
      feedback.style.borderColor = '#fed7aa';
      feedback.style.color = '#9a3412';
      feedback.innerHTML = '<strong>Moderate Acute Malnutrition (MAM):</strong> I-enroll sa NutriLearn 4-Star Diet counseling at lingguhang pagtimbang ng BHW sa Barangay Paolbo.';
    } else {
      feedback.style.background = '#dcfce7';
      feedback.style.borderColor = '#86efac';
      feedback.style.color = '#166534';
      feedback.innerHTML = '<strong>Normal na Katayuan ng Nutrisyon:</strong> Malusog na paglaki. Magbigay ng karaniwang gabay sa pagpapakain ng bata.';
    }
  }

  handleDobChange(dobStr) {
    if (!dobStr) return;
    const birthDate = new Date(dobStr);
    const today = new Date();

    if (birthDate > today) {
      window.app.showToast('Hindi maaaring sa hinaharap ang petsa ng kapanganakan.', 'danger');
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 0) {
      years = 0;
      months = 0;
    }

    const yrsInput = document.getElementById('screen-age-years');
    const mosInput = document.getElementById('screen-age-months');
    if (yrsInput) yrsInput.value = years;
    if (mosInput) mosInput.value = months;

    this.updateAgeDisplay(false);
  }

  updateAgeDisplay(syncDob = false) {
    const yrsInput = document.getElementById('screen-age-years');
    const mosInput = document.getElementById('screen-age-months');
    const calcText = document.getElementById('screen-age-calc-text');
    const dobInput = document.getElementById('screen-dob');
    if (!yrsInput || !mosInput || !calcText) return;

    const years = parseInt(yrsInput.value) || 0;
    const months = parseInt(mosInput.value) || 0;
    const totalMonths = (years * 12) + months;

    let displayStr = '';
    if (years > 0 && months > 0) {
      displayStr = `${years} Taon at ${months} Buwan (${totalMonths} buwan)`;
    } else if (years > 0) {
      displayStr = `${years} Taon (${totalMonths} buwan)`;
    } else {
      displayStr = `${months} Buwan`;
    }

    calcText.textContent = `Kabuuang Edad: ${displayStr}`;

    if (syncDob && dobInput) {
      const approxDate = new Date();
      approxDate.setFullYear(approxDate.getFullYear() - years);
      approxDate.setMonth(approxDate.getMonth() - months);
      dobInput.value = approxDate.toISOString().split('T')[0];
    }
  }

  handleSaveScreening(e) {
    e.preventDefault();
    const currentUser = window.storageService.getCurrentUser() || { name: 'Maria Santos', title: 'BHW #12 - Paolbo' };
    const chwAssigned = `${currentUser.name} (${currentUser.title || 'BHW - Paolbo'})`;

    const name = document.getElementById('screen-name').value;
    const birthDate = document.getElementById('screen-dob') ? document.getElementById('screen-dob').value : '';
    const years = parseInt(document.getElementById('screen-age-years') ? document.getElementById('screen-age-years').value : 0) || 0;
    const months = parseInt(document.getElementById('screen-age-months') ? document.getElementById('screen-age-months').value : 0) || 0;
    const ageMonths = (years * 12) + months || 12;

    const gender = document.getElementById('screen-gender').value;
    const parentSelectVal = document.getElementById('screen-parent-select').value;
    const parentName = document.getElementById('screen-parent-name').value;
    const parentZone = document.getElementById('screen-parent-zone') ? document.getElementById('screen-parent-zone').value.trim() : '';
    const parentBarangay = document.getElementById('screen-parent-barangay') ? document.getElementById('screen-parent-barangay').value.trim() : 'Barangay Paolbo';
    const community = `${parentZone ? parentZone + ', ' : ''}${parentBarangay}`;
    const parentContact = document.getElementById('screen-parent-phone').value || '0900-000-0000';
    const parentUsername = document.getElementById('screen-parent-username') ? document.getElementById('screen-parent-username').value : '';
    const parentPassword = document.getElementById('screen-parent-password') ? document.getElementById('screen-parent-password').value : 'magulang123';

    const weight = parseFloat(document.getElementById('screen-weight').value);
    const height = parseFloat(document.getElementById('screen-height').value) || (70 + (ageMonths * 0.5));
    const muac = parseFloat(document.getElementById('screen-muac').value);
    const edema = document.getElementById('screen-edema').checked;

    const result = window.storageService.registerChildAndParent({
      parentData: {
        id: parentSelectVal,
        name: parentName,
        phone: parentContact,
        username: parentUsername,
        password: parentPassword,
        community: community
      },
      childData: {
        name,
        birthDate,
        ageMonths,
        gender,
        weight,
        height,
        muac,
        edema,
        chwAssigned
      }
    });

    this.render();

    // Ipakita ang kumpirmasyon kasama ang login details ng magulang
    window.app.showModal(`
      <div style="text-align:center; padding:10px 4px;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--primary); margin-bottom:4px;">
          Matagumpay na Narehistro at Naikabit!
        </h3>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
          Ang profile ni <strong>${result.child.name}</strong> ay opisyal nang nakatala at nakakabit sa account ng kanyang magulang.
        </p>

        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:var(--radius-sm); padding:12px; text-align:left; margin-bottom:14px; font-size:0.8rem;">
          <div style="font-weight:800; color:#166534; margin-bottom:6px;">
            Ibigay ang Login Credentials sa Magulang:
          </div>
          <div style="color:#15803d; line-height:1.6;">
            <strong>Magulang:</strong> ${result.parent.name}<br>
            <strong>Username:</strong> <code style="background:#fff; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; font-weight:700;">${result.parent.username}</code><br>
            <strong>Password:</strong> <code style="background:#fff; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; font-weight:700;">${result.parent.password}</code>
          </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="window.app.closeModal()">
          Tapos Na
        </button>
      </div>
    `);

    window.app.showToast(`Narehistro si ${name} at naikabit kay ${result.parent.name}.`, 'success');
  }

  openVisitLoggerModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">Itala ang Pagbisita at Kalusugan ng Bata</h2>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">Bata: <strong>${child.name}</strong> • ${child.community || 'Barangay Paolbo, Calabanga'}</div>

      <form id="visit-form" onsubmit="window.chwToolkit.handleSaveVisit(event, '${child.id}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Bagong Timbang (kg) *</label>
            <input type="number" step="0.1" id="visit-weight" class="form-input" required value="${child.currentWeight}" />
            <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">Dati: ${child.currentWeight} kg (Target: ${child.targetWeight}kg)</div>
          </div>
          <div class="form-group">
            <label class="form-label">Bagong Sukat ng Braso (MUAC sa mm) *</label>
            <input type="number" id="visit-muac" class="form-input" required value="${child.currentMuac}" />
            <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">Dati: ${child.currentMuac} mm (Normal: ≥125mm)</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Katayuan sa Nutrisyon *</label>
          <select id="visit-status" class="form-select" onchange="window.chwToolkit.handleVisitStatusChange(this.value)">
            <option value="SAM" ${child.status === 'SAM' ? 'selected' : ''}>SAM (Malubhang Malnutrisyon)</option>
            <option value="MAM" ${child.status === 'MAM' ? 'selected' : ''}>MAM (Katamtamang Malnutrisyon)</option>
            <option value="IMPROVING" ${child.status === 'IMPROVING' ? 'selected' : ''}>Bumubuti (Tumataas ang Timbang)</option>
            <option value="RECOVERED" ${child.status === 'RECOVERED' ? 'selected' : ''}>Nakabawi (Nagtapos at Bibigyan ng Sertipiko)</option>
          </select>
        </div>

        <div id="recovered-alert-note" style="${child.status === 'RECOVERED' ? 'display:block;' : 'display:none;'} background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:8px 10px; font-size:0.78rem; color:#065f46; margin-bottom:10px; font-weight:600;">
          <strong>Pagtatapos:</strong> Ang pagmamarka bilang Nakabawi ay bubuo ng Katibayan ng Ganap na Pagbuti para sa bata.
        </div>

        <div class="form-group">
          <label class="form-label">Mga Tala sa Pagpapakain at Kalusugan ng Bata</label>
          <textarea id="visit-notes" class="form-textarea" rows="2" placeholder="Regular na nagpapakain ng 4-star diet ang ina; masigla ang bata; maganda ang gana sa pagkain."></textarea>
        </div>

        <button type="submit" class="btn btn-success btn-block">
          I-save ang Pagbisita
        </button>
      </form>
    `);
  }

  handleVisitStatusChange(val) {
    const alert = document.getElementById('recovered-alert-note');
    if (alert) {
      alert.style.display = val === 'RECOVERED' ? 'block' : 'none';
    }
  }

  handleSaveVisit(e, childId) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('visit-weight').value);
    const muac = parseFloat(document.getElementById('visit-muac').value);
    const status = document.getElementById('visit-status').value;
    const notes = document.getElementById('visit-notes').value;

    let updatedChild;
    if (status === 'RECOVERED') {
      updatedChild = window.storageService.graduateChild(childId, { weight, muac, notes });
      window.app.closeModal();
      this.render();
      window.app.showToast(`Ganap nang nakabawi si ${updatedChild.name}.`, 'success');
      setTimeout(() => {
        window.app.openCertificateModal(childId);
      }, 400);
    } else {
      updatedChild = window.storageService.recordVisit(childId, {
        weight,
        muac,
        status,
        notes,
        date: new Date().toISOString().split('T')[0]
      });
      window.app.closeModal();
      this.render();
      window.app.showToast(`Na-update ang pagbisita para kay ${updatedChild.name}.`, 'success');
    }
  }

  openCounselingGuide() {
    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:6px;">Gabay sa Pagpapayo sa Bahay ng BHW</h2>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">Mahahalagang puntong dapat ituro sa mga magulang sa Barangay Paolbo:</p>

      <div style="display:flex; flex-direction:column; gap:8px; font-size:0.82rem; color:#334155;">
        <div style="background:#f8fafc; padding:8px 10px; border-radius:6px; border-left:3px solid var(--primary);">
          <strong>1. Masigla at Matiyagang Pagpapakain:</strong>
          <p style="margin-top:2px;">Tabihan ang bata habang kumakain. Hikayatin nang may ngiti at huwag puwersahin. Magbigay ng maliliit ngunit masustansyang subo nang madalas.</p>
        </div>

        <div style="background:#f8fafc; padding:8px 10px; border-radius:6px; border-left:3px solid var(--accent-warm);">
          <strong>2. Ang Pagsubok sa Lapot ng Kutsara:</strong>
          <p style="margin-top:2px;">Ipakita sa ina na ang pagdaragdag ng 1 kutsaritang mantika o dinurog na itlog ay nagpapadoble sa enerhiya ng lugaw nang hindi lumalaki ang dami ng kinakain.</p>
        </div>

        <div style="background:#f8fafc; padding:8px 10px; border-radius:6px; border-left:3px solid var(--secondary);">
          <strong>3. Kalinisan at Pag-iwas sa Pagtatae:</strong>
          <p style="margin-top:2px;">Suriin ang pinagkukunan ng inuming tubig ng pamilya. Ipaalala ang paghuhugas ng kamay gamit ang sabon bago magpakain ng bata.</p>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-top:12px;" onclick="window.app.closeModal();">
        Bumalik sa Caseload
      </button>
    `);
  }

  // 1. Mensahe sa Magulang (BHW <-> Parent Direct Messaging)
  openMessagingModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    // Mark as read by BHW and update taskbar badge
    window.storageService.markMessagesAsRead(childId, 'chw');
    if (window.app && window.app.renderBottomNav) {
      window.app.renderBottomNav();
    }

    const messages = window.storageService.getMessages(childId);

    window.app.showModal(`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:0;">Mensahe at Gabay sa Magulang</h2>
        <span class="badge-status badge-improving" style="font-size:0.7rem;">Konektado</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
        Kausap: <strong>${child.parentName}</strong> (Bata: <strong>${child.name}</strong> • ${child.community || 'Barangay Paolbo'})
      </div>

      <!-- Talaan ng mga Mensahe (Message Timeline) -->
      <div id="messages-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; min-height:180px; max-height:240px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; margin-bottom:10px;">
        ${messages.length === 0 ? `
          <div style="text-align:center; color:var(--text-muted); font-size:0.78rem; margin:auto; padding:20px 0;">
            Wala pang mensahe. Magpadala ng paalala o payo sa magulang tungkol sa pagpapakain at kalusugan ng bata.
          </div>
        ` : messages.map(m => {
          const isBHW = m.senderRole === 'chw';
          return `
            <div style="display:flex; flex-direction:column; align-items:${isBHW ? 'flex-end' : 'flex-start'};">
              <div style="font-size:0.68rem; color:var(--text-muted); margin-bottom:2px;">
                <strong>${m.senderName}</strong> • ${m.dateFormatted} ${m.timeFormatted}
              </div>
              <div style="background:${isBHW ? 'var(--primary)' : '#fff'}; color:${isBHW ? '#fff' : 'var(--text-main)'}; border:${isBHW ? 'none' : '1px solid #cbd5e1'}; padding:8px 12px; border-radius:12px; font-size:0.8rem; max-width:85%; line-height:1.4; word-break:break-word; white-space:pre-wrap;">
                ${m.text}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Message Templates -->
      <div style="margin-bottom:8px;">
        <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Mabilisang Paalala:</div>
        <div style="display:flex; gap:4px; overflow-x:auto; padding-bottom:4px;">
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.chwToolkit.fillMessageTemplate('Paalala po sa 4-Star Diet para sa pagkain ni ${child.name.split(' ')[0]}. Siguraduhing may kanin, itlog/isda, gulay, at mantika.')">
            4-Star Diet Paalala
          </button>
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.chwToolkit.fillMessageTemplate('Kamusta po ang gana kumain at sigla ni ${child.name.split(' ')[0]} ngayong araw?')">
            Kumusta ang Gana?
          </button>
          <button type="button" class="btn btn-sm btn-secondary" style="font-size:0.7rem; white-space:nowrap;" onclick="window.chwToolkit.fillMessageTemplate('Maghanda po para sa regular na pagtimbang at pagsukat sa darating na check-up.')">
            Paalala sa Check-up
          </button>
        </div>
      </div>

      <!-- Message Composer -->
      <form onsubmit="window.chwToolkit.handleSendBhwMessage(event, '${child.id}')">
        <div style="display:flex; gap:6px;">
          <input type="text" id="bhw-msg-input" class="form-input" required placeholder="I-type ang mensahe o payo sa magulang..." style="flex:1;" />
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
      const container = document.getElementById('messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  fillMessageTemplate(text) {
    const input = document.getElementById('bhw-msg-input');
    if (input) {
      input.value = text;
      input.focus();
    }
  }

  handleSendBhwMessage(e, childId) {
    e.preventDefault();
    const input = document.getElementById('bhw-msg-input');
    if (!input || !input.value.trim()) return;

    const currentUser = window.storageService.getCurrentUser() || { name: 'Maria Santos', title: 'BHW #12 - Paolbo' };
    const senderName = `${currentUser.name} (${currentUser.title || 'BHW'})`;

    window.storageService.sendMessage({
      childId,
      senderRole: 'chw',
      senderName,
      text: input.value.trim()
    });

    window.app.showToast('Naipadala ang mensahe sa magulang.', 'success');
    this.openMessagingModal(childId);
  }

  // 2. Magtakda ng Iskedyul ng Konsultasyon / Follow-up Check-up
  openScheduleModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDateStr = nextWeek.toISOString().split('T')[0];

    window.app.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">Magtakda ng Iskedyul ng Konsultasyon</h2>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
        Bata: <strong>${child.name}</strong> • Magulang: <strong>${child.parentName}</strong>
      </div>

      <form onsubmit="window.chwToolkit.handleSaveSchedule(event, '${child.id}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Petsa ng Konsultasyon / Check-up *</label>
            <input type="date" id="sched-date" class="form-input" required value="${child.nextSchedule ? child.nextSchedule.date : defaultDateStr}" min="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group">
            <label class="form-label">Oras *</label>
            <input type="time" id="sched-time" class="form-input" required value="${child.nextSchedule ? child.nextSchedule.time : '08:30'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Lugar ng Konsultasyon *</label>
          <select id="sched-location" class="form-select">
            <option value="Barangay Paolbo Health Center" ${child.nextSchedule && child.nextSchedule.location.includes('Health Center') ? 'selected' : ''}>Barangay Paolbo Health Center</option>
            <option value="Pagbisita sa Bahay (Home Visit)" ${child.nextSchedule && child.nextSchedule.location.includes('Home Visit') ? 'selected' : ''}>Pagbisita sa Bahay (Home Visit sa Purok)</option>
            <option value="Rural Health Unit (RHU) Calabanga" ${child.nextSchedule && child.nextSchedule.location.includes('RHU') ? 'selected' : ''}>Rural Health Unit (RHU) Calabanga</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Layunin ng Konsultasyon *</label>
          <select id="sched-purpose" class="form-select">
            <option value="Lingguhang Pagtimbang at Pagsusukat ng MUAC">Lingguhang Pagtimbang at Pagsusukat ng MUAC</option>
            <option value="4-Star Diet Counseling at Pagsubaybay sa Pagkain">4-Star Diet Counseling at Pagsubaybay sa Pagkain</option>
            <option value="Pamamahagi ng RUTF at Suplementong Bitamina">Pamamahagi ng RUTF at Suplementong Bitamina</option>
            <option value="Pagsusuri bago ang Opisyal na Graduation / Paglabas">Pagsusuri bago ang Opisyal na Graduation / Paglabas</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Mga Karagdagang Tagubilin / Paalala</label>
          <textarea id="sched-notes" class="form-textarea" rows="2" placeholder="hal. Dalhin ang immunization card, ihanda ang talaan ng kinain, atbp.">${child.nextSchedule ? (child.nextSchedule.notes || '') : ''}</textarea>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:8px 10px; font-size:0.75rem; color:#166534; margin-bottom:12px;">
          Awtomatikong makikita ng magulang ang nakatakdang petsa at makatatanggap ng mensahe sa kanyang NutriLearn portal.
        </div>

        <div style="display:flex; gap:8px;">
          <button type="button" class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button type="submit" class="btn btn-primary btn-block">
            I-save ang Iskedyul
          </button>
        </div>
      </form>
    `);
  }

  handleSaveSchedule(e, childId) {
    e.preventDefault();
    const date = document.getElementById('sched-date').value;
    const time = document.getElementById('sched-time').value;
    const location = document.getElementById('sched-location').value;
    const purpose = document.getElementById('sched-purpose').value;
    const notes = document.getElementById('sched-notes').value;

    const currentUser = window.storageService.getCurrentUser() || { name: 'Maria Santos', title: 'BHW #12 - Paolbo' };
    const createdBy = `${currentUser.name} (${currentUser.title || 'BHW'})`;

    const updatedChild = window.storageService.setSchedule(childId, {
      date,
      time,
      location,
      purpose,
      notes,
      createdBy
    });

    window.app.closeModal();
    this.render();
    window.app.showToast(`Naitakda ang konsultasyon para kay ${updatedChild.name} sa ${date}.`, 'success');
  }

  // 3. INBOX para sa Lahat ng Mensahe mula sa Magulang
  openBhwInboxModal(searchQuery = '') {
    const allThreads = window.storageService.getAllMessageThreads();
    const children = window.storageService.getChildren();
    const totalUnread = window.storageService.getUnreadParentMessagesCount ? window.storageService.getUnreadParentMessagesCount() : 0;

    let filteredThreads = allThreads;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filteredThreads = allThreads.filter(t => 
        (t.parentName && t.parentName.toLowerCase().includes(q)) ||
        (t.childName && t.childName.toLowerCase().includes(q)) ||
        (t.lastMessage && t.lastMessage.text.toLowerCase().includes(q)) ||
        (t.community && t.community.toLowerCase().includes(q))
      );
    }

    window.app.showModal(`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:0;">Inbox ng mga Mensahe (BHW)</h2>
        <span class="badge-status badge-improving" style="font-size:0.7rem;">${allThreads.length} Usapan</span>
      </div>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
        Lahat ng palitan ng mensahe at payo sa mga magulang sa Barangay Paolbo.
      </p>

      <!-- Notipikasyon / Paalala Alert Banner -->
      ${totalUnread > 0 ? `
        <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:8px; padding:10px 12px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="font-size:0.84rem; color:#991b1b;">🔔 Paalala: May ${totalUnread} bagong mensahe mula sa magulang!</strong>
            <div style="font-size:0.72rem; color:#b91c1c; margin-top:2px;">Nangangailangan ng tugon sa pagpapakain o follow-up check-up.</div>
          </div>
          <span class="nav-badge-pill" style="position:static; padding:4px 8px; font-size:0.7rem;">${totalUnread} BAGO</span>
        </div>
      ` : `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:8px 10px; font-size:0.75rem; color:#166534; margin-bottom:12px;">
          ✓ Handa at nasagot ang lahat ng mensahe ng mga magulang sa Barangay Paolbo.
        </div>
      `}

      <!-- Search Bar -->
      <div style="margin-bottom:12px;">
        <input type="text" id="inbox-search-input" class="form-input" placeholder="Maghanap ng magulang, bata, o mensahe..." value="${searchQuery}" oninput="window.chwToolkit.openBhwInboxModal(this.value)" />
      </div>

      <!-- Talaan ng mga Inbox Conversation -->
      <div style="display:flex; flex-direction:column; gap:8px; max-height:360px; overflow-y:auto; padding-right:2px; margin-bottom:14px;">
        ${filteredThreads.length > 0 ? filteredThreads.map(thread => {
          const isFromParent = thread.lastMessage.senderRole === 'parent';
          const hasUnread = thread.hasUnread || isFromParent;

          return `
            <div style="background:${hasUnread ? '#fff5f5' : '#f8fafc'}; border:1px solid ${hasUnread ? '#fca5a5' : '#e2e8f0'}; border-left:${hasUnread ? '4px solid var(--danger-sam)' : '1px solid #e2e8f0'}; border-radius:8px; padding:10px 12px; cursor:pointer; transition:all 0.2s ease;" onclick="window.chwToolkit.openMessagingModal('${thread.childId}')" onmouseover="this.style.borderColor='var(--primary)'; this.style.background='#f0fdfa';" onmouseout="this.style.borderColor='${hasUnread ? '#fca5a5' : '#e2e8f0'}'; this.style.background='${hasUnread ? '#fff5f5' : '#f8fafc'}';">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                <div>
                  <strong style="font-size:0.85rem; color:var(--text-main);">${thread.parentName}</strong>
                  <div style="font-size:0.72rem; color:var(--primary); font-weight:600;">
                    Bata: ${thread.childName} • ${thread.community || 'Barangay Paolbo'}
                  </div>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:0.68rem; color:var(--text-muted); font-weight:600; display:block;">
                    ${thread.lastMessage.dateFormatted} ${thread.lastMessage.timeFormatted}
                  </span>
                  ${hasUnread ? `
                    <span style="background:#fee2e2; color:#991b1b; font-size:0.62rem; font-weight:800; padding:1px 5px; border-radius:4px; border:1px solid #fecaca; display:inline-block; margin-top:2px;">
                      BAGONG MENSAHE
                    </span>
                  ` : `
                    <span style="background:#f1f5f9; color:#475569; font-size:0.62rem; font-weight:600; padding:1px 5px; border-radius:4px; display:inline-block; margin-top:2px;">
                      NASAGOT NA
                    </span>
                  `}
                </div>
              </div>

              <div style="font-size:0.78rem; color:#475569; margin:6px 0; background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 8px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                <strong>${isFromParent ? 'Magulang' : 'BHW'}:</strong> ${thread.lastMessage.text}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-muted);">
                <span>Kabuuang palitan: <strong>${thread.messageCount}</strong></span>
                <span style="color:var(--primary); font-weight:700;">Buksan ang Usapan →</span>
              </div>
            </div>
          `;
        }).join('') : `
          <div style="text-align:center; padding:24px 10px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">
              ${searchQuery ? 'Walang nahanap na usapan sa iyong paghahanap.' : 'Wala pang aktibong mensahe sa Inbox.'}
            </div>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">
              Maaari kang magsimula ng mensahe sa sinumang magulang mula sa iyong listahan ng mga bata.
            </p>
            ${children.length > 0 ? `
              <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); margin-bottom:6px;">Pumili ng magulang na susulatan:</div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center;">
                ${children.slice(0, 5).map(c => `
                  <button class="btn btn-sm btn-secondary" style="font-size:0.7rem;" onclick="window.chwToolkit.openMessagingModal('${c.id}')">
                    ${c.parentName} (${c.name})
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <button type="button" class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
        Isara
      </button>
    `);

    if (searchQuery) {
      setTimeout(() => {
        const input = document.getElementById('inbox-search-input');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }, 50);
    }
  }

  // Pamamahala ng mga Opisyal na Anunsyo para sa mga Magulang (Tanging BHW lamang ang makakapag-post)
  openAnnouncementModal() {
    const announcements = window.storageService.getAnnouncements();
    const currentUser = window.storageService.getCurrentUser() || { name: 'BHW Maria Santos', title: 'Barangay Health Worker' };

    window.app.showModal(`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h2 style="font-size:1.15rem; font-weight:800; margin:0;">📢 Mga Opisyal na Anunsyo ng BHW</h2>
        <span class="badge-status badge-improving" style="font-size:0.7rem;">Para sa Lahat ng Magulang</span>
      </div>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
        Tanging mga miyembro ng BHW ang may pahintulot na mag-post ng anunsyo para sa Barangay Paolbo, Calabanga.
      </p>

      <!-- Form para sa Bagong Anunsyo -->
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:var(--radius-sm); padding:14px; margin-bottom:14px;">
        <div style="font-weight:800; font-size:0.88rem; color:#166534; margin-bottom:8px;">
          + Mag-post ng Bagong Anunsyo
        </div>

        <form onsubmit="window.chwToolkit.handlePostAnnouncement(event)">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:0.75rem; color:#14532d;">Pamagat ng Anunsyo *</label>
            <input type="text" id="ann-title" class="form-input" required placeholder="hal. Libreng Pagtimbang at Bakuna sa Barangay Hall" style="background:#ffffff;" />
          </div>

          <div class="form-row" style="margin-bottom:8px;">
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem; color:#14532d;">Kategorya *</label>
              <select id="ann-category" class="form-select" style="background:#ffffff;">
                <option value="Paalala sa Nutrisyon">Paalala sa Nutrisyon</option>
                <option value="Bitamina & Suplemento">Bitamina & Suplemento</option>
                <option value="Feeding & Demo">Feeding Program & Demo</option>
                <option value="Bakuna & Timbang">Bakuna & Timbang Check-up</option>
                <option value="Pangkalahatang Paunawa">Pangkalahatang Paunawa</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem; color:#14532d;">Priyoridad</label>
              <select id="ann-priority" class="form-select" style="background:#ffffff;">
                <option value="normal">Normal</option>
                <option value="high">Mataas / Urgent (Pula)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:10px;">
            <label class="form-label" style="font-size:0.75rem; color:#14532d;">Mensahe / Nilalaman ng Anunsyo *</label>
            <textarea id="ann-message" class="form-textarea" rows="3" required placeholder="Isulat dito ang buong detalye ng anunsyo para sa mga magulang sa Barangay Paolbo..." style="background:#ffffff;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="min-height:42px; font-size:0.85rem; font-weight:700;">
            I-post ang Anunsyo para sa Magulang
          </button>
        </form>
      </div>

      <!-- Talaan ng mga Kasalukuyang Anunsyo -->
      <div style="margin-bottom:12px;">
        <h3 style="font-size:0.88rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
          Mga Aktibong Anunsyo (${announcements.length})
        </h3>

        <div style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;">
          ${announcements.length === 0 ? `
            <div style="text-align:center; padding:16px; color:var(--text-muted); font-size:0.78rem;">
              Walang aktibong anunsyo sa kasalukuyan.
            </div>
          ` : announcements.map(ann => `
            <div style="background:#ffffff; border:1px solid ${ann.priority === 'high' ? '#fca5a5' : '#e2e8f0'}; border-left:4px solid ${ann.priority === 'high' ? 'var(--danger-sam)' : 'var(--primary)'}; border-radius:var(--radius-xs); padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                <div>
                  <span style="font-size:0.65rem; font-weight:800; color:${ann.priority === 'high' ? 'var(--danger-sam)' : 'var(--primary)'}; background:${ann.priority === 'high' ? '#fee2e2' : 'var(--primary-soft)'}; padding:2px 6px; border-radius:4px;">
                    ${ann.category || 'Paunawa'}
                  </span>
                  <div style="font-weight:800; font-size:0.85rem; color:var(--text-main); margin-top:2px;">
                    ${ann.title}
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-secondary" style="color:#ef4444; font-size:0.68rem; padding:2px 6px;" onclick="window.chwToolkit.deleteAnnouncement('${ann.id}')" title="Burahin ang anunsyo">
                  ✕ Burahin
                </button>
              </div>

              <p style="font-size:0.75rem; color:#475569; line-height:1.4; margin:4px 0 6px 0;">
                ${ann.message}
              </p>

              <div style="font-size:0.68rem; color:var(--text-muted); display:flex; justify-content:space-between;">
                <span>Inilathala ni: <strong>${ann.authorName}</strong></span>
                <span>📅 ${ann.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <button type="button" class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
        Isara
      </button>
    `);
  }

  handlePostAnnouncement(event) {
    event.preventDefault();
    const title = document.getElementById('ann-title').value.trim();
    const category = document.getElementById('ann-category').value;
    const priority = document.getElementById('ann-priority').value;
    const message = document.getElementById('ann-message').value.trim();

    if (!title || !message) {
      window.app.showToast('Mangyaring punan ang pamagat at mensahe ng anunsyo.', 'error');
      return;
    }

    window.storageService.saveAnnouncement({
      title,
      category,
      priority,
      message,
      date: new Date().toISOString().split('T')[0]
    });

    window.app.showToast('📢 Matagumpay na na-post ang anunsyo para sa lahat ng magulang!', 'success');
    this.render();
    this.openAnnouncementModal();
  }

  deleteAnnouncement(id) {
    if (confirm('Sigurado ka bang nais mong burahin ang anunsyong ito?')) {
      window.storageService.deleteAnnouncement(id);
      window.app.showToast('Naalis na ang anunsyo.', 'info');
      this.render();
      this.openAnnouncementModal();
    }
  }

  // Pamamahala ng mga Account ng Magulang
  openEditParentModal(parentId) {
    const parent = window.storageService.getUserById(parentId);
    if (!parent) return;

    window.app.showModal(`
      <div style="margin-bottom:12px;">
        <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:2px;">✏️ I-edit ang Account ng Magulang</h2>
        <div style="font-size:0.78rem; color:var(--text-muted);">
          Pamamahala ng Account para kay <strong>${parent.name}</strong> • Barangay Paolbo
        </div>
      </div>

      <form onsubmit="window.chwToolkit.handleSaveEditParent(event, '${parent.id}')">
        <div class="form-group" style="margin-bottom:10px;">
          <label class="form-label" style="font-size:0.78rem;">Buong Pangalan ng Magulang *</label>
          <input type="text" id="edit-p-name" class="form-input" required value="${parent.name}" />
        </div>

        <div class="form-row" style="margin-bottom:10px;">
          <div class="form-group">
            <label class="form-label" style="font-size:0.78rem;">Numero ng Telepono *</label>
            <input type="text" id="edit-p-phone" class="form-input" required value="${parent.phone || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:0.78rem;">Username *</label>
            <input type="text" id="edit-p-username" class="form-input" required value="${parent.username || ''}" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:10px;">
          <label class="form-label" style="font-size:0.78rem;">Password *</label>
          <input type="text" id="edit-p-password" class="form-input" required value="${parent.password || 'password123'}" />
        </div>

        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label" style="font-size:0.78rem;">Zone / Purok & Barangay *</label>
          <input type="text" id="edit-p-community" class="form-input" required value="${parent.community || 'Zone 1, Barangay Paolbo, Calabanga'}" />
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">
            Kanselahin
          </button>
          <button type="submit" class="btn btn-primary">
            I-save ang Pagbabago
          </button>
        </div>
      </form>
    `);
  }

  handleSaveEditParent(event, parentId) {
    event.preventDefault();
    const name = document.getElementById('edit-p-name').value.trim();
    const phone = document.getElementById('edit-p-phone').value.trim();
    const username = document.getElementById('edit-p-username').value.trim();
    const password = document.getElementById('edit-p-password').value.trim();
    const community = document.getElementById('edit-p-community').value.trim();

    if (!name || !username || !password) {
      window.app.showToast('Mangyaring punan ang lahat ng kinakailangang field.', 'error');
      return;
    }

    window.storageService.updateParentUser(parentId, {
      name,
      phone,
      username,
      password,
      community
    });

    window.app.showToast(`Matagumpay na na-update ang account ni ${name}!`, 'success');
    window.app.closeModal();
    this.render();
  }

  openDeleteParentModal(parentId) {
    const parent = window.storageService.getUserById(parentId);
    if (!parent) return;

    window.app.showModal(`
      <div style="text-align:center; padding:10px 4px;">
        <div style="font-size:2.5rem; margin-bottom:8px;">⚠️</div>
        <h2 style="font-size:1.15rem; font-weight:800; color:#b91c1c; margin-bottom:6px;">Burahin ang Account ng Magulang?</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.45; margin-bottom:14px;">
          Sigurado ka bang nais mong burahin ang account ni <strong>${parent.name}</strong> (@${parent.username})?
        </p>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">
            Huwag Burahin
          </button>
          <button type="button" class="btn btn-danger" onclick="window.chwToolkit.confirmDeleteParent('${parent.id}')">
            Oo, Burahin
          </button>
        </div>
      </div>
    `);
  }

  confirmDeleteParent(parentId) {
    window.storageService.deleteParentUser(parentId);
    window.app.showToast('Matagumpay na nabura ang account ng magulang.', 'info');
    window.app.closeModal();
    this.render();
  }
}

window.chwToolkit = new CHWToolkit();
