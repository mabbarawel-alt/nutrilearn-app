/**
 * NutriLearn Calabanga - Supervisor & Public Health Surveillance Telemetry
 * Pagsubaybay sa Malnutrisyon para sa Bayan ng Calabanga at Barangay Paolbo
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
    const samCount = children.filter(c => c.status === 'SAM').length;
    const mamCount = children.filter(c => c.status === 'MAM').length;
    const improvingCount = children.filter(c => c.status === 'IMPROVING').length;
    const recoveredCount = children.filter(c => c.status === 'RECOVERED').length;

    const recoveryRate = total > 0 ? Math.round((recoveredCount / total) * 100) : 0;
    const activeTreating = samCount + mamCount + improvingCount;

    // Barangay Breakdown
    const communityMap = {};
    children.forEach(c => {
      const commName = c.community || 'Barangay Paolbo, Calabanga';
      if (!communityMap[commName]) {
        communityMap[commName] = { total: 0, sam: 0, mam: 0, recovered: 0 };
      }
      communityMap[commName].total++;
      if (c.status === 'SAM') communityMap[commName].sam++;
      if (c.status === 'MAM' || c.status === 'IMPROVING') communityMap[commName].mam++;
      if (c.status === 'RECOVERED') communityMap[commName].recovered++;
    });

    this.container.innerHTML = `
      <!-- Header ng Pagsubaybay sa Malnutrisyon sa Bayan ng Calabanga -->
      <div class="card" style="border-left: 4px solid #0284c7;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Munisipyo ng Calabanga • RHU</div>
            <h2 style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:var(--text-main);">Pagsubaybay sa Malnutrisyon</h2>
            <div style="font-size:0.75rem; color:var(--text-muted);">Barangay Paolbo at Karatig na mga Barangay</div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.supervisorDashboard.generateOfficialReport()">
            Gumawa ng Ulat
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:6px; font-size:0.72rem; background:#f8fafc; border:1px solid var(--border-light); padding:6px 10px; border-radius:var(--radius-xs); color:var(--text-muted);">
          <span class="dot-pulse"></span>
          <span>Naka-sync ang real-time datos mula sa mga <strong>Barangay Health Workers (BHW)</strong></span>
        </div>
      </div>

      <!-- Key Performance Indicators (KPIs) sa Filipino -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-left: 4px solid var(--primary);">
          <span class="kpi-title">Kabuuang Naka-enroll</span>
          <div class="kpi-value">${total}</div>
          <span class="kpi-trend">Lahat ng aktibong kaso</span>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--secondary);">
          <span class="kpi-title">Rate ng Paggaling</span>
          <div class="kpi-value">${recoveryRate}%</div>
          <span class="kpi-trend">${recoveredCount} bata ang nakabawi</span>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--danger-sam);">
          <span class="kpi-title">Malubha (SAM - Pula)</span>
          <div class="kpi-value" style="color:var(--danger-sam);">${samCount}</div>
          <span class="kpi-trend" style="color:var(--danger-sam);">Nangangailangan ng RUTF</span>
        </div>

        <div class="kpi-card" style="border-left: 4px solid var(--warning-mam);">
          <span class="kpi-title">Katamtaman (MAM)</span>
          <div class="kpi-value" style="color:var(--warning-mam);">${mamCount + improvingCount}</div>
          <span class="kpi-trend">4-Star Diet Care</span>
        </div>
      </div>

      <!-- Daloy ng Pagbawi ng Nutrisyon (Clinical Cascade) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daloy ng Pagbawi ng Nutrisyon sa Komunidad</h3>
        </div>
        <p class="card-subtitle">Distribusyon ng katayuan ng nutrisyon sa Barangay Paolbo:</p>

        <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; margin-bottom:2px;">
              <span style="color:var(--danger-sam);">Severe Acute Malnutrition (SAM)</span>
              <span>${samCount} bata (${total > 0 ? Math.round((samCount/total)*100) : 0}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${total > 0 ? (samCount/total)*100 : 0}%; background:var(--danger-sam);"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; margin-bottom:2px;">
              <span style="color:var(--warning-mam);">Moderate Acute Malnutrition (MAM)</span>
              <span>${mamCount} bata (${total > 0 ? Math.round((mamCount/total)*100) : 0}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${total > 0 ? (mamCount/total)*100 : 0}%; background:var(--warning-mam);"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; margin-bottom:2px;">
              <span style="color:#0284c7;">Bumubuting Katayuan</span>
              <span>${improvingCount} bata (${total > 0 ? Math.round((improvingCount/total)*100) : 0}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${total > 0 ? (improvingCount/total)*100 : 0}%; background:#0284c7;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; margin-bottom:2px;">
              <span style="color:var(--secondary-dark);">Ganap na Nakabawi (Nagtapos)</span>
              <span>${recoveredCount} bata (${total > 0 ? Math.round((recoveredCount/total)*100) : 0}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${total > 0 ? (recoveredCount/total)*100 : 0}%; background:var(--secondary);"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagsubaybay Bawat Barangay sa Bayan ng Calabanga -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Datos Bawat Barangay</h3>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
          <thead>
            <tr style="border-bottom:1.5px solid var(--border-light); color:var(--text-muted);">
              <th style="padding:6px 4px;">Barangay</th>
              <th style="padding:6px 4px; text-align:center;">Kabuuan</th>
              <th style="padding:6px 4px; text-align:center;">SAM</th>
              <th style="padding:6px 4px; text-align:center;">MAM</th>
              <th style="padding:6px 4px; text-align:center;">Nakabawi</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(communityMap).length === 0 ? `
              <tr>
                <td colspan="5" style="text-align:center; padding:14px 4px; color:var(--text-muted);">
                  Walang datos ng bata sa kasalukuyan.
                </td>
              </tr>
            ` : Object.keys(communityMap).map(commName => {
              const data = communityMap[commName];
              return `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:8px 4px; font-weight:700;">${commName}</td>
                  <td style="padding:8px 4px; text-align:center; font-weight:700;">${data.total}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--danger-sam); font-weight:700;">${data.sam}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--warning-mam); font-weight:700;">${data.mam}</td>
                  <td style="padding:8px 4px; text-align:center; color:var(--secondary-dark); font-weight:700;">${data.recovered}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pag-export ng Datos -->
      <div class="card" style="text-align:center;">
        <h4 style="font-size:0.85rem; font-weight:800; margin-bottom:4px;">Pag-export ng Datos at Pag-uulat</h4>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
          I-download ang pinakabagong tala ng mga bata para sa DOH at LGU Calabanga Nutrition Action Plan:
        </p>
        <button class="btn btn-secondary btn-block" onclick="window.supervisorDashboard.exportCSV()">
          I-export bilang CSV Spreadsheet
        </button>
      </div>
    `;
  }

  generateOfficialReport() {
    const children = window.storageService.getChildren();
    const total = children.length;
    const samCount = children.filter(c => c.status === 'SAM').length;
    const mamCount = children.filter(c => c.status === 'MAM').length;
    const recoveredCount = children.filter(c => c.status === 'RECOVERED').length;

    window.app.showModal(`
      <div style="padding:6px 0;">
        <div style="font-size:0.7rem; color:var(--primary); font-weight:800; text-transform:uppercase; text-align:center;">
          Republika ng Pilipinas • Bayan ng Calabanga
        </div>
        <h2 style="font-size:1.15rem; font-weight:800; text-align:center; margin:2px 0;">Opisyal na Ulat sa Malnutrisyon sa Komunidad</h2>
        <div style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-bottom:12px;">
          Barangay Paolbo • Rural Health Unit (RHU) Calabanga • Petsa: ${new Date().toLocaleDateString('fil-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; margin-bottom:12px; font-size:0.78rem;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
            <div>Kabuuang Batang Sinubaybayan: <strong>${total}</strong></div>
            <div>Severe Acute Malnutrition (SAM): <strong style="color:var(--danger-sam);">${samCount}</strong></div>
            <div>Moderate Acute Malnutrition (MAM): <strong style="color:var(--warning-mam);">${mamCount}</strong></div>
            <div>Ganap na Nakabawi (Recovered): <strong style="color:var(--secondary-dark);">${recoveredCount}</strong></div>
          </div>
        </div>

        <div style="font-size:0.78rem; color:#334155; line-height:1.45; margin-bottom:12px;">
          <strong>Pangunahing Rekomendasyon ng RHU para sa Barangay Paolbo:</strong>
          <ul style="padding-left:16px; margin-top:4px;">
            <li>Ipagpatuloy ang lingguhang pamamahagi ng 4-Star Diet Super Lugaw counseling sa pamamagitan ng mga BHW.</li>
            <li>Siguraduhin ang sapat na imbak ng RUTF sa RHU Calabanga para sa mga kasong SAM.</li>
            <li>Magsagawa ng regular na pagtimbang at MUAC screening sa lahat ng purok ng Barangay Paolbo.</li>
          </ul>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary btn-block" onclick="window.print()">
            I-print ang Ulat
          </button>
          <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
            Isara
          </button>
        </div>
      </div>
    `);
  }

  exportCSV() {
    const children = window.storageService.getChildren();
    let csv = 'ID,Pangalan ng Bata,Edad (Buwan),Kasarian,Magulang,Telepono,Barangay,BHW Assigned,Katayuan,Panimulang Timbang (kg),Kasalukuyang Timbang (kg),Target Timbang (kg),MUAC (mm),Huling Bisita\n';

    children.forEach(c => {
      csv += `"${c.id}","${c.name}",${c.ageMonths},"${c.gender}","${c.parentName}","${c.parentContact || ''}","${c.community || 'Barangay Paolbo'}","${c.chwAssigned || ''}","${c.status}",${c.initialWeight},${c.currentWeight},${c.targetWeight},${c.currentMuac},"${c.lastVisitDate || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NutriLearn_Calabanga_Paolbo_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.app.showToast('Nai-download ang CSV spreadsheet file.', 'success');
  }
}

window.supervisorDashboard = new SupervisorDashboard();
