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

    if (elTotal) elTotal.textContent = total;
    if (elStuntingRate) elStuntingRate.textContent = `${currentStuntingRate}%`;
    if (elTargetProgress) elTargetProgress.textContent = `${actualReduction}% pts / 10% Goal (${reductionProgressPct}%)`;
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
    if (elDashTargetProgress) elDashTargetProgress.textContent = `${actualReduction}% pts / 10% Goal (${reductionProgressPct}%)`;
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
  }
};
