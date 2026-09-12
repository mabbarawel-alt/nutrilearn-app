// ==========================================================================
// NUTRILEARN - MUNICIPAL HEALTH OFFICE (MHO) & HIGHER-UPS DASHBOARD
// Stunting Analytics, 10% Reduction KPI, Barangay Trends, Report Endorsement
// ==========================================================================

const MHODashboard = {
  init() {
    this.renderKPIs();
    this.renderBarangayBreakdown();
    this.renderIncomingReports();
    this.renderNutritionGuidelines();
    this.initContentManager();
    this.initUserManager();
    this.initAuditManager();
  },

  // Calculate and Render Executive KPIs & 10% Stunting Target
  renderKPIs() {
    const children = NutriStorage.getChildren();
    const total = children.length;
    const stunted = children.filter(c => c.status === 'Stunted' && !c.improved).length;
    const wasted = children.filter(c => c.status === 'Wasted' && !c.improved).length;
    const underweight = children.filter(c => c.status === 'Underweight' && !c.improved).length;
    const improved = children.filter(c => c.improved === true).length;
    const normal = children.filter(c => c.status === 'Normal' && !c.improved).length;

    const currentStuntingRate = total > 0 ? ((stunted / total) * 100).toFixed(1) : '0.0';
    
    // 10% Stunting Reduction Progress Calculation
    // Baseline stunting in pilot area: 22.0%; Goal: 12.0% (10% percentage point reduction)
    const baselineRate = 22.0;
    const targetReduction = 10.0;
    const actualReduction = (baselineRate - parseFloat(currentStuntingRate)).toFixed(1);
    const reductionProgressPct = Math.min(100, Math.max(0, Math.round((parseFloat(actualReduction) / targetReduction) * 100)));

    // Element bindings
    const elTotal = document.getElementById('mho-kpi-total');
    const elStuntingRate = document.getElementById('mho-kpi-stunting-rate');
    const elTargetProgress = document.getElementById('mho-kpi-target-progress');
    const elTargetBar = document.getElementById('mho-kpi-target-bar');
    const elImproved = document.getElementById('mho-kpi-improved');
    const elWasted = document.getElementById('mho-kpi-wasted');

    const targetProgressHtml = `<span style="font-size: 1.25rem; font-weight: 800;">${actualReduction}% pts</span> <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">/ 10% Goal (${reductionProgressPct}%)</span>`;

    if (elTotal) elTotal.textContent = total;
    if (elStuntingRate) elStuntingRate.textContent = `${currentStuntingRate}%`;
    if (elTargetProgress) elTargetProgress.innerHTML = targetProgressHtml;
    if (elTargetBar) elTargetBar.style.width = `${reductionProgressPct}%`;
    if (elImproved) elImproved.textContent = improved;
    if (elWasted) elWasted.textContent = wasted;

    // Synchronize Executive Dashboard overview cards
    const elDashTotal = document.getElementById('admin-dash-kpi-total');
    const elDashStuntingRate = document.getElementById('admin-dash-kpi-stunting-rate');
    const elDashTargetProgress = document.getElementById('admin-dash-kpi-target-progress');
    const elDashTargetBar = document.getElementById('admin-dash-kpi-target-bar');
    const elDashImproved = document.getElementById('admin-dash-kpi-improved');

    if (elDashTotal) elDashTotal.textContent = total;
    if (elDashStuntingRate) elDashStuntingRate.textContent = `${currentStuntingRate}%`;
    if (elDashTargetProgress) elDashTargetProgress.innerHTML = targetProgressHtml;
    if (elDashTargetBar) elDashTargetBar.style.width = `${reductionProgressPct}%`;
    if (elDashImproved) elDashImproved.textContent = improved;

    // Mini Chart Distribution Bars
    const barStunted = document.getElementById('dist-bar-stunted');
    const barWasted = document.getElementById('dist-bar-wasted');
    const barUnderweight = document.getElementById('dist-bar-underweight');
    const barNormal = document.getElementById('dist-bar-normal');
    const barImproved = document.getElementById('dist-bar-improved');

    if (total > 0) {
      if (barStunted) barStunted.style.width = `${(stunted / total) * 100}%`;
      if (barWasted) barWasted.style.width = `${(wasted / total) * 100}%`;
      if (barUnderweight) barUnderweight.style.width = `${(underweight / total) * 100}%`;
      if (barNormal) barNormal.style.width = `${(normal / total) * 100}%`;
      if (barImproved) barImproved.style.width = `${(improved / total) * 100}%`;
    }
  },

  // Render Barangay Distribution Table
  renderBarangayBreakdown() {
    const tbody = document.getElementById('mho-barangay-tbody');
    if (!tbody) return;

    const children = NutriStorage.getChildren();
    const barangays = ['Barangay San Jose', 'Barangay Santa Maria', 'Barangay San Isidro', 'Barangay Poblacion'];

    tbody.innerHTML = barangays.map(b => {
      const bChildren = children.filter(c => c.barangay === b);
      const bTotal = bChildren.length;
      const bStunted = bChildren.filter(c => c.status === 'Stunted' && !c.improved).length;
      const bImproved = bChildren.filter(c => c.improved === true).length;
      const rate = bTotal > 0 ? ((bStunted / bTotal) * 100).toFixed(1) : '0.0';

      let priorityBadge = '<span class="badge badge-normal">Low Risk</span>';
      if (parseFloat(rate) >= 20) {
        priorityBadge = '<span class="badge badge-stunted">High Priority Hotspot</span>';
      } else if (parseFloat(rate) >= 10) {
        priorityBadge = '<span class="badge badge-underweight">Moderate Priority</span>';
      }

      return `
        <tr>
          <td>
            <strong style="color: var(--color-primary-900);">${b}</strong>
          </td>
          <td>${bTotal}</td>
          <td>
            <span style="font-weight: 700; color: #DC2626;">${bStunted}</span>
          </td>
          <td>
            <span style="font-weight: 700; color: #16A34A;">${bImproved}</span>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div style="flex:1; height:6px; background:#E2E8F0; border-radius:4px; overflow:hidden;">
                <div style="width:${rate}%; height:100%; background:#EF4444;"></div>
              </div>
              <span style="font-weight:600; font-size:0.82rem;">${rate}%</span>
            </div>
          </td>
          <td>${priorityBadge}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="MHODashboard.filterToCHWBarangay('${b}')">
              View CHW Data
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Render Incoming Official Reports from CHWs
  renderIncomingReports() {
    const tbody = document.getElementById('mho-reports-tbody');
    if (!tbody) return;

    const reports = NutriStorage.getReports();

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No submitted community reports yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reports.map(r => `
      <tr>
        <td>
          <span style="font-family: monospace; font-weight: 700; color: var(--color-primary-800);">${r.reportId}</span>
        </td>
        <td>
          <div style="font-weight: 600;">${r.barangay}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">By: ${r.chwName}</div>
        </td>
        <td>${r.submittedDate}</td>
        <td>
          <div style="font-size: 0.85rem;">
            <strong>${r.totalChildren}</strong> Children (${r.stuntedCount} Stunted, ${r.improvedCount} Recovered)
          </div>
        </td>
        <td>
          <span style="font-weight: 700; color: #DC2626;">${r.stuntingRate}</span>
          <span style="font-size:0.75rem; color:#16A34A; display:block;">${r.stuntingReductionAchieved || '-'}</span>
        </td>
        <td>
          <span class="badge ${r.status === 'Verified & Approved' ? 'badge-improved' : 'badge-underweight'}">
            ${r.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            ${r.status === 'Pending Review' 
              ? `<button class="btn btn-accent btn-sm" onclick="MHODashboard.endorseReport('${r.reportId}')">Approve</button>`
              : `<button class="btn btn-outline btn-sm" onclick="NutriExport.printOfficialSummary()">Print</button>`
            }
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Approve / Endorse an incoming CHW Report
  endorseReport(reportId) {
    const reports = NutriStorage.getReports();
    const report = reports.find(r => r.reportId === reportId);
    if (!report) return;

    report.status = 'Verified & Approved';
    NutriStorage.saveReports(reports);
    NutriStorage.logAudit('Report Endorsed', 'Report & Endorsement', `Officially approved census report ${reportId} for ${report.barangay}`);
    this.renderIncomingReports();
    NutriApp.showToast(`Report ${reportId} officially verified and approved by Municipal Health Office.`, 'success');
  },

  // Cross-filter: Switch view to CHW filtered to this barangay
  filterToCHWBarangay(barangay) {
    NutriApp.switchRole('chw');
    const brgySelect = document.getElementById('chw-filter-barangay');
    if (brgySelect) {
      brgySelect.value = barangay;
      CHWModule.activeFilterBarangay = barangay;
      CHWModule.renderRegistryTable();
    }
  },

  // Render WHO & SDG Guidelines Manager
  renderNutritionGuidelines() {
    const container = document.getElementById('mho-guidelines-container');
    if (!container) return;

    const guidelines = [
      {
        title: 'WHO 2025/2030 Global Nutrition Targets: 10% Stunting Reduction',
        source: 'World Health Organization & UNICEF (2025)',
        status: 'Active Community Benchmark',
        summary: 'Targeted parent education and localized complementary food interventions have been shown to reduce stunting prevalence by 10% to 15% across pilot communities within 12 months.'
      },
      {
        title: 'Philippine Plan of Action for Nutrition (PPAN): Pinggang Pinoy',
        source: 'Food and Nutrition Research Institute (FNRI-DOST)',
        status: 'Mandatory Food Standard',
        summary: 'Promotes backyard bio-intensive gardens (Malunggay, Kalabasa, Camote) to overcome micronutrient poverty at zero or minimal family expenditure.'
      },
      {
        title: 'Executive Order 51 (Philippine Milk Code) & RA 10028',
        source: 'Department of Health (DOH)',
        status: 'Statutory Health Policy',
        summary: 'Mandates exclusive breastfeeding support for infants 0 to 6 months without infant formula marketing or unnecessary water supplementation.'
      }
    ];

    container.innerHTML = guidelines.map(g => `
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:0.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.5rem;">
          <strong style="color:var(--color-primary-900); font-size:0.95rem;">${g.title}</strong>
          <span class="badge badge-normal">${g.status}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.45rem;">Authority: ${g.source}</div>
        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5;">${g.summary}</p>
      </div>
    `).join('');
  },

  // ==========================================================================
  // NUTRITION CONTENT MANAGEMENT (Req #11)
  // ==========================================================================
  initContentManager() {
    this.renderContentManagerModules();
  },

  renderContentManagerModules() {
    const container = document.getElementById('mho-content-modules-list');
    if (!container) return;

    const modules = NutriStorage.getModules();

    container.innerHTML = modules.map(m => `
      <div class="card" style="margin-bottom:1rem; border:1px solid var(--border-light); padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.65rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge badge-normal" style="font-size:0.75rem;">${m.number}</span>
              <strong style="color:var(--color-primary-900); font-size:1.05rem;">${m.title}</strong>
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.25rem;">
              ⏱️ Duration: <strong>${m.duration}</strong> • ❓ Quiz Questions: <strong>${m.quiz ? m.quiz.length : 0}</strong> • 🎯 Objectives: <strong>${m.objectives ? m.objectives.length : 0}</strong>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="MHODashboard.openEditModuleModal('${m.id}')" title="Edit this lesson module">
              ✏️ Edit Module
            </button>
            <button class="btn btn-outline btn-sm" style="color:#DC2626; border-color:#FCA5A5;" onclick="MHODashboard.handleDeleteModule('${m.id}')" title="Delete module">
              🗑️ Delete
            </button>
          </div>
        </div>
        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin:0 0 0.75rem;">
          ${m.summary}
        </p>
        <div style="font-size:0.78rem; color:var(--text-muted); background:#F8FAFC; padding:0.5rem 0.75rem; border-radius:4px;">
          <strong>Objectives:</strong> ${(m.objectives || []).join(' • ')}
        </div>
      </div>
    `).join('');
  },

  openAddModuleModal() {
    document.getElementById('modal-edit-module-title').textContent = 'Add New Nutrition Module';
    document.getElementById('edit-module-id').value = '';
    document.getElementById('edit-module-number').value = `Module ${NutriStorage.getModules().length + 1}`;
    document.getElementById('edit-module-title-input').value = '';
    document.getElementById('edit-module-duration').value = '15 mins';
    document.getElementById('edit-module-summary').value = '';
    document.getElementById('edit-module-objectives').value = '';
    document.getElementById('edit-module-content').value = '<p>Enter evidence-based feeding instructions here...</p>';

    NutriApp.openModal('modal-edit-module');
  },

  openEditModuleModal(moduleId) {
    const mod = NutriStorage.getModules().find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('modal-edit-module-title').textContent = `Edit ${mod.number}: ${mod.title}`;
    document.getElementById('edit-module-id').value = mod.id;
    document.getElementById('edit-module-number').value = mod.number || '';
    document.getElementById('edit-module-title-input').value = mod.title || '';
    document.getElementById('edit-module-duration').value = mod.duration || '15 mins';
    document.getElementById('edit-module-summary').value = mod.summary || '';
    document.getElementById('edit-module-objectives').value = (mod.objectives || []).join('\n');
    document.getElementById('edit-module-content').value = mod.content || '';

    NutriApp.openModal('modal-edit-module');
  },

  handleSaveModule(form) {
    const id = document.getElementById('edit-module-id').value;
    const number = document.getElementById('edit-module-number').value.trim();
    const title = document.getElementById('edit-module-title-input').value.trim();
    const duration = document.getElementById('edit-module-duration').value.trim();
    const summary = document.getElementById('edit-module-summary').value.trim();
    const objectivesText = document.getElementById('edit-module-objectives').value.trim();
    const content = document.getElementById('edit-module-content').value.trim();

    // Validation (Req #14)
    if (!title || !number || !summary) {
      NutriApp.showToast('Please provide a module number, title, and summary before saving.', 'warning');
      return;
    }

    const objectives = objectivesText ? objectivesText.split('\n').map(o => o.trim()).filter(Boolean) : [];

    if (id) {
      // Update existing
      const mod = NutriStorage.getModules().find(m => m.id === id);
      if (mod) {
        mod.number = number;
        mod.title = title;
        mod.duration = duration;
        mod.summary = summary;
        mod.objectives = objectives;
        mod.content = content;
        NutriStorage.updateModule(mod);
        NutriApp.showToast(`✅ ${mod.number} updated successfully!`, 'success');
      }
    } else {
      // Add new
      const newMod = {
        id: 'mod-' + Date.now(),
        number,
        title,
        duration,
        summary,
        objectives,
        content,
        quiz: [
          {
            question: `What is the primary nutritional goal discussed in ${title}?`,
            options: ['Support healthy growth and prevent child stunting', 'Skip breakfast', 'Rely purely on ultra-processed snacks', 'Avoid fresh vegetables'],
            answerIndex: 0,
            explanation: `Proper feeding practices in ${title} directly protect children from malnutrition.`
          }
        ]
      };
      NutriStorage.addModule(newMod);
      NutriApp.showToast(`🎉 New module "${title}" added to parent curricula!`, 'success');
    }

    NutriApp.closeModal('modal-edit-module');
    this.renderContentManagerModules();
    if (window.ParentModule) ParentModule.renderModuleCards();
  },

  handleDeleteModule(moduleId) {
    if (confirm('Are you sure you want to delete this educational module?')) {
      NutriStorage.deleteModule(moduleId);
      this.renderContentManagerModules();
      if (window.ParentModule) ParentModule.renderModuleCards();
      NutriApp.showToast('Module deleted from curricula.', 'info');
    }
  },

  handleResetModules() {
    if (confirm('Reset all nutrition modules to standard WHO & DOH default curricula?')) {
      NutriStorage.resetModules();
      this.renderContentManagerModules();
      if (window.ParentModule) ParentModule.renderModuleCards();
      NutriApp.showToast('Curricula restored to standard defaults.', 'success');
    }
  },

  // ==========================================================================
  // USER ACCOUNTS & ACCESS CONTROL (Req #12)
  // ==========================================================================
  userFilterRole: 'ALL',
  userSearchQuery: '',

  initUserManager() {
    this.renderUsersTable();
    
    // Bind search & filter
    const searchInput = document.getElementById('mho-user-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.userSearchQuery = e.target.value.toLowerCase();
        this.renderUsersTable();
      });
    }

    const roleFilter = document.getElementById('mho-user-role-filter');
    if (roleFilter) {
      roleFilter.addEventListener('change', (e) => {
        this.userFilterRole = e.target.value;
        this.renderUsersTable();
      });
    }
  },

  renderUsersTable() {
    const tbody = document.getElementById('mho-users-tbody');
    if (!tbody) return;

    let users = NutriStorage.getUsers();

    // Filter by role
    if (this.userFilterRole !== 'ALL') {
      users = users.filter(u => u.role === this.userFilterRole);
    }

    // Filter by search query
    if (this.userSearchQuery) {
      users = users.filter(u =>
        (u.name || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.email || '').toLowerCase().includes(this.userSearchQuery) ||
        (u.barangay || '').toLowerCase().includes(this.userSearchQuery)
      );
    }

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No user accounts found matching your query.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(u => {
      const isSuspended = u.status === 'Suspended';
      const statusBadge = isSuspended
        ? '<span class="badge badge-stunted" style="background:#FEE2E2; color:#991B1B;">⛔ Suspended</span>'
        : '<span class="badge badge-normal" style="background:#DCFCE7; color:#166534;">✓ Active</span>';

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--color-primary-900);">${u.name}</div>
            <div style="font-size:0.76rem; color:var(--text-muted);">${u.email}</div>
          </td>
          <td>
            <select onchange="MHODashboard.handleRoleChange('${u.id}', this.value)" style="padding:4px 8px; border:1px solid var(--border-light); border-radius:4px; font-size:0.8rem; background:#FFFFFF;">
              <option value="parent" ${u.role === 'parent' ? 'selected' : ''}>Parent / Guardian</option>
              <option value="chw" ${u.role === 'chw' ? 'selected' : ''}>Health Worker (BHW/BNS)</option>
              <option value="collector" ${u.role === 'collector' ? 'selected' : ''}>Field Data Collector</option>
              <option value="mho" ${u.role === 'mho' ? 'selected' : ''}>Administrator (MHO)</option>
            </select>
          </td>
          <td>
            <span style="font-size:0.82rem; color:var(--text-secondary);">${u.barangay || u.department || 'All Municipal'}</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <span style="font-size:0.78rem; color:var(--text-muted);">${u.registeredDate || 'Pre-configured'}</span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm ${isSuspended ? 'btn-accent' : 'btn-outline'}" onclick="MHODashboard.handleToggleUserStatus('${u.id}')" title="Toggle access permission">
                ${isSuspended ? 'Reactivate' : 'Suspend'}
              </button>
              <button class="btn btn-outline btn-sm" onclick="MHODashboard.handleResetUserPassword('${u.id}')" title="Reset password">
                🔑 Reset Pass
              </button>
              <button class="btn btn-outline btn-sm" style="color:#DC2626; border-color:#FCA5A5;" onclick="MHODashboard.handleDeleteUser('${u.id}')" title="Delete account">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  handleRoleChange(userId, newRole) {
    const users = NutriStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.role = newRole;
    NutriStorage.updateUser(user);
    NutriApp.showToast(`Updated role for ${user.name} to ${newRole.toUpperCase()}.`, 'success');
  },

  handleToggleUserStatus(userId) {
    const newStatus = NutriStorage.toggleUserStatus(userId);
    this.renderUsersTable();
    NutriApp.showToast(`User status updated to: ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
  },

  handleResetUserPassword(userId) {
    const newPass = prompt('Enter a new password for this user:', 'password123');
    if (!newPass) return;

    const users = NutriStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.password = newPass;
      NutriStorage.updateUser(user);
      NutriApp.showToast(`Password successfully updated for ${user.name}.`, 'success');
    }
  },

  handleDeleteUser(userId) {
    if (confirm('Permanently delete this user account and revoke system access?')) {
      NutriStorage.deleteUser(userId);
      this.renderUsersTable();
      NutriApp.showToast('User account deleted.', 'info');
    }
  },

  openAddUserModal() {
    NutriApp.openModal('modal-admin-add-user');
  },

  handleCreateUserAdmin(form) {
    const name = form.elements['adminUserName'].value.trim();
    const email = form.elements['adminUserEmail'].value.trim();
    const password = form.elements['adminUserPass'].value;
    const role = form.elements['adminUserRole'].value;
    const barangay = form.elements['adminUserBarangay'].value;

    // Validation (Req #14)
    if (!name || !email || !password) {
      NutriApp.showToast('Please fill in all required user fields before saving.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
      barangay,
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    NutriStorage.registerUser(userData);
    form.reset();
    NutriApp.closeModal('modal-admin-add-user');
    this.renderUsersTable();
    NutriApp.showToast(`🎉 User ${name} successfully created!`, 'success');
  },

  // ==========================================================================
  // AUDIT & ADMINISTRATION ACTIVITY TRAIL (Data Requirements #10)
  // ==========================================================================
  auditSearchQuery: '',
  auditFilterCategory: 'ALL',

  initAuditManager() {
    this.renderAuditLogsTable();

    const searchInput = document.getElementById('mho-audit-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.auditSearchQuery = e.target.value.toLowerCase();
        this.renderAuditLogsTable();
      });
    }

    const catFilter = document.getElementById('mho-audit-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        this.auditFilterCategory = e.target.value;
        this.renderAuditLogsTable();
      });
    }
  },

  renderAuditLogsTable() {
    const tbody = document.getElementById('mho-audit-tbody');
    if (!tbody) return;

    let logs = NutriStorage.getAuditLogs();

    if (this.auditFilterCategory !== 'ALL') {
      logs = logs.filter(l => l.category === this.auditFilterCategory);
    }

    if (this.auditSearchQuery) {
      logs = logs.filter(l =>
        (l.action || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.details || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.performedBy || '').toLowerCase().includes(this.auditSearchQuery) ||
        (l.category || '').toLowerCase().includes(this.auditSearchQuery)
      );
    }

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No audit log records found matching your filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    const catBadgeStyles = {
      'Account Management': 'background:#EFF6FF; color:#1E40AF;',
      'Content & Curricula': 'background:#FEF3C7; color:#92400E;',
      'Report & Endorsement': 'background:#DCFCE7; color:#166534;',
      'Group & Instruction': 'background:#F3E8FF; color:#6B21A8;',
      'Security & Access': 'background:#FEE2E2; color:#991B1B;'
    };

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td style="font-size:0.78rem; font-family:monospace; color:var(--text-secondary); white-space:nowrap;">
          ${l.timestamp}
        </td>
        <td>
          <span class="badge" style="${catBadgeStyles[l.category] || 'background:#F1F5F9; color:#475569;'} font-size:0.76rem;">
            ${l.category}
          </span>
        </td>
        <td>
          <strong style="color:var(--color-primary-900); font-size:0.86rem;">${l.action}</strong>
        </td>
        <td>
          <span style="font-size:0.83rem; color:var(--text-secondary); line-height:1.4; display:block;">
            ${l.details || '-'}
          </span>
        </td>
        <td>
          <span style="font-weight:600; font-size:0.82rem; color:var(--text-primary);">${l.performedBy}</span>
        </td>
        <td>
          <span class="badge badge-normal" style="font-size:0.72rem; text-transform:uppercase;">${l.userRole}</span>
        </td>
      </tr>
    `).join('');
  },

  handleClearAuditLogs() {
    if (confirm('Clear the administrative audit trail log? Note: This action is permanent and cannot be undone.')) {
      NutriStorage.clearAuditLogs();
      this.renderAuditLogsTable();
      NutriApp.showToast('Audit log history cleared.', 'info');
    }
  }
};

