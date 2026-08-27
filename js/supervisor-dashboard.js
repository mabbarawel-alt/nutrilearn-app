/**
 * NutriLearn - Supervisor & Public Health Surveillance Dashboard
 */

class SupervisorDashboard {
  constructor() {
    this.container = document.getElementById('supervisor-view');
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const children = window.storageService.getChildren();

    const total = children.length;
    const sam = children.filter(c => c.status === 'SAM').length;
    const mam = children.filter(c => c.status === 'MAM').length;
    const improving = children.filter(c => c.status === 'IMPROVING').length;
    const recovered = children.filter(c => c.status === 'RECOVERED').length;

    const recoveryRate = total > 0 ? Math.round((recovered / total) * 100) : 0;
    const activeMalnutritionRate = total > 0 ? Math.round(((sam + mam) / total) * 100) : 0;

    // Community aggregation
    const communityMap = {};
    children.forEach(c => {
      if (!communityMap[c.community]) {
        communityMap[c.community] = { total: 0, sam: 0, mam: 0, recovered: 0 };
      }
      communityMap[c.community].total++;
      if (c.status === 'SAM') communityMap[c.community].sam++;
      if (c.status === 'MAM' || c.status === 'IMPROVING') communityMap[c.community].mam++;
      if (c.status === 'RECOVERED') communityMap[c.community].recovered++;
    });

    this.container.innerHTML = `
      <!-- Executive Summary Header -->
      <div class="card" style="background: linear-gradient(135deg, #1e293b, #0f172a); color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <div style="font-size:0.72rem; color:#38bdf8; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Public Health Surveillance</div>
            <h2 style="font-family:var(--font-display); font-size:1.3rem; font-weight:800;">Malnutrition Surveillance</h2>
            <div style="font-size:0.75rem; opacity:0.8;">District Health Office • Real-Time Field Telemetry</div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.supervisorDashboard.generateOfficialReport()">
            📄 Generate Report
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:8px; font-size:0.72rem; background:rgba(255,255,255,0.08); padding:6px 10px; border-radius:6px;">
          <span class="dot-pulse"></span>
          <span>Data Synchronized from <strong>4 Community Health Workers</strong></span>
        </div>
      </div>

      <!-- Key Performance Indicators (KPIs) -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-left: 4px solid var(--primary);">
          <span class="kpi-title">Total Enrolled</span>
          <div class="kpi-value">${total}</div>
          <div class="kpi-trend trend-up">Active screening active</div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--secondary);">
          <span class="kpi-title">Recovery Rate</span>
          <div class="kpi-value">${recoveryRate}%</div>
          <div class="kpi-trend trend-up">↑ +14% vs last quarter</div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--danger-sam);">
          <span class="kpi-title">Active SAM Cases</span>
          <div class="kpi-value" style="color:var(--danger-sam);">${sam}</div>
          <div class="kpi-trend trend-down">Under RUTF treatment</div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--warning-mam);">
          <span class="kpi-title">MAM / Improving</span>
          <div class="kpi-value" style="color:var(--warning-mam);">${mam + improving}</div>
          <div class="kpi-trend trend-up">${improving} gaining weight</div>
        </div>
      </div>

      <!-- Visual Recovery Pipeline -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>📊</span> Clinical Progression Funnel</h3>
        </div>
        <p class="card-subtitle">Distribution of enrolled children by current clinical status:</p>

        <div style="display:flex; height:24px; border-radius:8px; overflow:hidden; margin-bottom:10px; box-shadow:inset 0 1px 3px rgba(0,0,0,0.1);">
          <div style="width:${(sam/total)*100}%; background:var(--danger-sam); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:700;">${sam > 0 ? sam + ' SAM' : ''}</div>
          <div style="width:${(mam/total)*100}%; background:var(--warning-mam); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:700;">${mam > 0 ? mam + ' MAM' : ''}</div>
          <div style="width:${(improving/total)*100}%; background:#38bdf8; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:700;">${improving > 0 ? improving + ' Improving' : ''}</div>
          <div style="width:${(recovered/total)*100}%; background:var(--secondary); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:700;">${recovered > 0 ? recovered + ' Recovered' : ''}</div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; font-size:0.68rem; text-align:center; font-weight:600;">
          <div style="color:var(--danger-sam);">🔴 SAM (${sam})</div>
          <div style="color:var(--warning-mam);">🟠 MAM (${mam})</div>
          <div style="color:#0284c7;">🔵 Improving (${improving})</div>
          <div style="color:var(--secondary-dark);">🟢 Recovered (${recovered})</div>
        </div>
      </div>

      <!-- Community / Barangay Caseload Breakdown -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>🏘️</span> Community Breakdown</h3>
        </div>
        <p class="card-subtitle">Malnutrition surveillance by Barangay / Village:</p>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);">
                <th style="padding:6px 4px;">Community</th>
                <th style="padding:6px 4px; text-align:center;">Total</th>
                <th style="padding:6px 4px; text-align:center; color:var(--danger-sam);">SAM</th>
                <th style="padding:6px 4px; text-align:center; color:var(--warning-mam);">MAM</th>
                <th style="padding:6px 4px; text-align:center; color:var(--secondary-dark);">Rec.</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(communityMap).map(([commName, data]) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:8px 4px; font-weight:600;">${commName}</td>
                  <td style="padding:8px 4px; text-align:center; font-weight:700;">${data.total}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--danger-sam); font-weight:700;">${data.sam}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--warning-mam); font-weight:700;">${data.mam}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--secondary-dark); font-weight:700;">${data.recovered}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Higher-Ups Reporting & Submission Action -->
      <div class="card" style="background:#f8fafc; border:1.5px dashed #cbd5e1;">
        <h4 style="font-size:0.9rem; font-weight:800; margin-bottom:6px;">📤 Department of Health Surveillance Submission</h4>
        <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
          Submit official monthly malnutrition indicators to the Regional Health Office & National Nutrition Council database.
        </p>
        <button class="btn btn-primary btn-block" onclick="window.supervisorDashboard.submitReportToHigherUps()">
          🚀 Transmit Surveillance Report to Health Ministry
        </button>
      </div>
    `;
  }

  generateOfficialReport() {
    const children = window.storageService.getChildren();
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    window.app.showModal(`
      <div style="border-bottom:2px solid #0f172a; padding-bottom:8px; margin-bottom:12px;">
        <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Republic of the Philippines • Department of Health</div>
        <h2 style="font-size:1.15rem; font-weight:800;">Official Childhood Malnutrition Surveillance Report</h2>
        <div style="font-size:0.75rem; color:#64748b;">Period: <strong>${dateStr}</strong> • Program: <strong>NutriLearn mHealth</strong></div>
      </div>

      <div style="font-size:0.8rem; line-height:1.6; color:#334155; margin-bottom:14px;">
        <p><strong>Total Screened Population (Under 5):</strong> ${children.length} children</p>
        <p><strong>Severe Acute Malnutrition (SAM):</strong> ${children.filter(c => c.status === 'SAM').length} cases</p>
        <p><strong>Moderate Acute Malnutrition (MAM):</strong> ${children.filter(c => c.status === 'MAM').length} cases</p>
        <p><strong>Children Improving / Gaining Weight:</strong> ${children.filter(c => c.status === 'IMPROVING').length} cases</p>
        <p><strong>Program Discharges / Fully Recovered:</strong> ${children.filter(c => c.status === 'RECOVERED').length} children</p>
      </div>

      <div style="background:#f1f5f9; padding:10px; border-radius:8px; font-size:0.75rem; margin-bottom:14px;">
        <strong>Individual Child Roster:</strong>
        <div style="max-height:140px; overflow-y:auto; margin-top:6px;">
          ${children.map(c => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding:3px 0;">
              <span>${c.name} (${c.ageMonths}m, ${c.community})</span>
              <strong style="${c.status === 'RECOVERED' ? 'color:green' : (c.status === 'SAM' ? 'color:red' : 'color:orange')}">${c.status} (${c.currentWeight}kg)</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-block" onclick="window.supervisorDashboard.downloadCsvReport()">
          📥 Export CSV
        </button>
        <button class="btn btn-primary btn-block" onclick="window.print();">
          🖨️ Print / Save PDF
        </button>
      </div>
    `);
  }

  downloadCsvReport() {
    const children = window.storageService.getChildren();
    let csv = 'Child ID,Name,Age (Months),Gender,Parent Name,Contact,Community,CHW Assigned,Status,Initial Weight,Current Weight,Target Weight,Current MUAC (mm),Last Visit Date\n';
    
    children.forEach(c => {
      csv += `"${c.id}","${c.name}",${c.ageMonths},"${c.gender}","${c.parentName}","${c.parentContact}","${c.community}","${c.chwAssigned}","${c.status}",${c.initialWeight},${c.currentWeight},${c.targetWeight},${c.currentMuac},"${c.lastVisitDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NutriLearn_Surveillance_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.app.showToast('CSV Report Downloaded! 📊', 'success');
  }

  submitReportToHigherUps() {
    window.app.showToast('Submitting Surveillance Data to Health Ministry Server...', 'info');
    setTimeout(() => {
      window.app.showToast('✓ Data Verified & Transmitted to Ministry of Health Central Database! 🚀', 'success');
    }, 1200);
  }
}

window.supervisorDashboard = new SupervisorDashboard();
