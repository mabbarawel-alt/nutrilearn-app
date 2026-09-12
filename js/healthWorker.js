// ==========================================================================
// NUTRILEARN - COMMUNITY HEALTH WORKER (CHW) MODULE
// Child Registry, WHO Anthropometric Classification, Report Submission
// ==========================================================================

const CHWModule = {
  activeFilterStatus: 'ALL',
  activeFilterBarangay: 'ALL',
  searchQuery: '',

  init() {
    this.bindEvents();
    this.renderRegistryTable();
    this.updateStatsBar();
    this.initGrowthCalculator();
    this.initGroups();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('chw-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderRegistryTable();
      });
    }

    // Status filter
    const statusFilter = document.getElementById('chw-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.activeFilterStatus = e.target.value;
        this.renderRegistryTable();
      });
    }

    // Barangay filter
    const brgyFilter = document.getElementById('chw-filter-barangay');
    if (brgyFilter) {
      brgyFilter.addEventListener('change', (e) => {
        this.activeFilterBarangay = e.target.value;
        this.renderRegistryTable();
      });
    }

    // New Child Form Submission
    const childForm = document.getElementById('add-child-form');
    if (childForm) {
      childForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveChild(childForm);
      });
    }

    // Submit to MHO Form
    const reportForm = document.getElementById('chw-submit-report-form');
    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmitReport(reportForm);
      });
    }
  },

  // Calculate WHO Nutritional Status
  calculateNutritionalStatus(ageMonths, sex, heightCm, weightKg, muacMm) {
    const age = parseInt(ageMonths, 10);
    const height = parseFloat(heightCm);
    const weight = parseFloat(weightKg);
    const muac = parseInt(muacMm, 10);

    // Default classifications
    let hfaStatus = 'Normal';
    let wfaStatus = 'Normal';
    let wfhStatus = 'Normal';
    let muacStatus = 'Normal';
    let overallStatus = 'Normal';

    // Find nearest age bracket in WHO standards (6, 9, 12, 15, 18, 21, 24)
    const ageBrackets = [6, 9, 12, 15, 18, 21, 24];
    let closestAge = 12;
    let minDiff = 999;
    for (const b of ageBrackets) {
      const diff = Math.abs(age - b);
      if (diff < minDiff) {
        minDiff = diff;
        closestAge = b;
      }
    }

    const hfaCutoff = sex === 'Female' 
      ? WHO_STANDARDS.heightForAge[closestAge].femaleCutoff 
      : WHO_STANDARDS.heightForAge[closestAge].maleCutoff;

    const wfaCutoff = sex === 'Female' 
      ? WHO_STANDARDS.weightForAge[closestAge].femaleCutoff 
      : WHO_STANDARDS.weightForAge[closestAge].maleCutoff;

    // Height-for-Age (Stunting)
    if (height < hfaCutoff) {
      hfaStatus = 'Stunted';
    }

    // Weight-for-Age (Underweight)
    if (weight < wfaCutoff) {
      wfaStatus = 'Underweight';
    }

    // MUAC (Acute Malnutrition)
    if (muac < WHO_STANDARDS.muac.severe) {
      muacStatus = 'Severe';
      wfhStatus = 'Wasted';
    } else if (muac < WHO_STANDARDS.muac.moderate) {
      muacStatus = 'Moderate';
      wfhStatus = 'At Risk / Mild Wasting';
    } else {
      muacStatus = 'Normal';
      wfhStatus = 'Normal';
    }

    // Overall Primary Classification
    if (muacStatus === 'Severe' || wfhStatus === 'Wasted') {
      overallStatus = 'Wasted';
    } else if (hfaStatus === 'Stunted') {
      overallStatus = 'Stunted';
    } else if (wfaStatus === 'Underweight') {
      overallStatus = 'Underweight';
    } else {
      overallStatus = 'Normal';
    }

    return {
      overallStatus,
      hfaStatus,
      wfaStatus,
      wfhStatus,
      muacStatus
    };
  },

  // Interactive Anthropometric Growth Calculator
  initGrowthCalculator() {
    const ageInput = document.getElementById('calc-age');
    const sexInput = document.getElementById('calc-sex');
    const heightInput = document.getElementById('calc-height');
    const weightInput = document.getElementById('calc-weight');
    const muacInput = document.getElementById('calc-muac');

    const updateCalc = () => {
      if (!ageInput || !heightInput || !weightInput || !muacInput) return;
      
      const age = ageInput.value;
      const sex = sexInput ? sexInput.value : 'Male';
      const height = heightInput.value;
      const weight = weightInput.value;
      const muac = muacInput.value;

      if (!age || !height || !weight || !muac) return;

      const result = this.calculateNutritionalStatus(age, sex, height, weight, muac);

      const resultBox = document.getElementById('calc-result-display');
      const muacIndicator = document.getElementById('calc-muac-val');

      if (muacIndicator) {
        muacIndicator.textContent = `${muac} mm`;
      }

      if (resultBox) {
        let badgeClass = 'badge-normal';
        let alertColor = '#10B981';
        let description = 'Measurements indicate appropriate growth and nutritional adequacy for this age.';

        if (result.overallStatus === 'Stunted') {
          badgeClass = 'badge-stunted';
          alertColor = '#EF4444';
          description = 'Child shows low Height-for-Age (chronic stunting). Recommend Module 1 & 3 with daily enriched Go-Grow-Glow local meals (Malunggay, Monggo, Dilis).';
        } else if (result.overallStatus === 'Wasted') {
          badgeClass = 'badge-wasted';
          alertColor = '#C2410C';
          description = 'Low MUAC / acute wasting detected. Prioritize frequent nutrient-dense feeding (Module 4) and strict handwashing (Module 5).';
        } else if (result.overallStatus === 'Underweight') {
          badgeClass = 'badge-underweight';
          alertColor = '#F59E0B';
          description = 'Weight is below reference threshold. Recommend increasing meal frequency with healthy fats (coconut milk, peanut mash).';
        }

        resultBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
            <strong style="color: #0E3D26; font-size: 1rem;">WHO Growth Classification:</strong>
            <span class="badge ${badgeClass}" style="font-size:0.9rem; padding:0.35rem 0.85rem;">${result.overallStatus}</span>
          </div>
          <div style="font-size:0.88rem; color:#374151; line-height:1.6;">
            <div>• <strong>Height-for-Age (Stunting):</strong> ${result.hfaStatus} (${height} cm)</div>
            <div>• <strong>Weight-for-Age:</strong> ${result.wfaStatus} (${weight} kg)</div>
            <div>• <strong>MUAC (Mid-Upper Arm):</strong> ${result.muacStatus} (${muac} mm)</div>
            <p style="margin-top:0.75rem; padding:0.5rem 0.75rem; background:#FFFFFF; border-left:4px solid ${alertColor}; border-radius:4px; font-size:0.84rem;">
              <strong>Guidance:</strong> ${description}
            </p>
          </div>
        `;
      }
    };

    [ageInput, sexInput, heightInput, weightInput, muacInput].forEach(elem => {
      if (elem) elem.addEventListener('input', updateCalc);
    });
  },

  // Render Children Registry Table
  renderRegistryTable() {
    const tableBody = document.getElementById('chw-registry-tbody');
    if (!tableBody) return;

    let children = NutriStorage.getChildren();

    // Filtering
    if (this.activeFilterStatus !== 'ALL') {
      if (this.activeFilterStatus === 'IMPROVED') {
        children = children.filter(c => c.improved === true);
      } else {
        children = children.filter(c => c.status.toUpperCase() === this.activeFilterStatus.toUpperCase());
      }
    }

    if (this.activeFilterBarangay !== 'ALL') {
      children = children.filter(c => c.barangay === this.activeFilterBarangay);
    }

    // Searching
    if (this.searchQuery) {
      children = children.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery) ||
        c.parentName.toLowerCase().includes(this.searchQuery) ||
        c.barangay.toLowerCase().includes(this.searchQuery)
      );
    }

    if (children.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.5rem; opacity:0.5;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p style="font-weight:600;">No child records found matching your filters.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = children.map(c => {
      let badgeClass = 'badge-normal';
      let statusLabel = c.status;

      if (c.improved) {
        badgeClass = 'badge-improved';
        statusLabel = '🌟 Improved / Normal';
      } else if (c.status === 'Stunted') {
        badgeClass = 'badge-stunted';
      } else if (c.status === 'Wasted') {
        badgeClass = 'badge-wasted';
      } else if (c.status === 'Underweight') {
        badgeClass = 'badge-underweight';
      }

      // MUAC Color Band Indicator
      let muacColor = 'var(--muac-green)';
      if (c.muacMm < 115) muacColor = 'var(--muac-red)';
      else if (c.muacMm < 125) muacColor = 'var(--muac-yellow)';

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--color-primary-900);">${c.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${c.ageMonths} mos • ${c.sex}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${c.parentName}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${c.parentPhone || 'No phone'}</div>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${c.barangay}</span>
          </td>
          <td>
            <div style="font-weight: 600;">${c.heightCm} cm / ${c.weightKg} kg</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); display:flex; align-items:center; gap:4px;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${muacColor};"></span>
              MUAC: ${c.muacMm} mm
            </div>
          </td>
          <td>
            <span class="badge ${badgeClass}">${statusLabel}</span>
          </td>
          <td>
            <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-primary-800);">
              ${c.completedModules ? c.completedModules.length : 0} / 5 Done
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              Quiz: ${c.quizScore ? c.quizScore + '%' : 'Pending'}
            </div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${c.lastAssessed || 'Recent'}</div>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm" onclick="CHWModule.openEditModal('${c.id}')" title="Update Child Progress">
                Update
              </button>
              <button class="btn btn-sm ${c.improved ? 'btn-outline' : 'btn-accent'}" onclick="CHWModule.toggleImproved('${c.id}')" title="Mark as Improved / Normal">
                ${c.improved ? 'Active' : 'Mark Recovered'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Update CHW Dashboard Summary Cards
  updateStatsBar() {
    const children = NutriStorage.getChildren();
    const total = children.length;
    const stunted = children.filter(c => c.status === 'Stunted' && !c.improved).length;
    const wasted = children.filter(c => c.status === 'Wasted' && !c.improved).length;
    const underweight = children.filter(c => c.status === 'Underweight' && !c.improved).length;
    const improved = children.filter(c => c.improved === true).length;

    const elemTotal = document.getElementById('chw-stat-total');
    const elemStunted = document.getElementById('chw-stat-stunted');
    const elemWasted = document.getElementById('chw-stat-wasted');
    const elemImproved = document.getElementById('chw-stat-improved');

    if (elemTotal) elemTotal.textContent = total;
    if (elemStunted) elemStunted.textContent = stunted;
    if (elemWasted) elemWasted.textContent = wasted;
    if (elemImproved) elemImproved.textContent = improved;

    // Synchronize BHW Operations Dashboard stats
    const dashTotal = document.getElementById('bhw-dash-stat-total');
    const dashStunted = document.getElementById('bhw-dash-stat-stunted');
    const dashWasted = document.getElementById('bhw-dash-stat-wasted');
    const dashImproved = document.getElementById('bhw-dash-stat-improved');

    if (dashTotal) dashTotal.textContent = total;
    if (dashStunted) dashStunted.textContent = stunted;
    if (dashWasted) dashWasted.textContent = wasted;
    if (dashImproved) dashImproved.textContent = improved;
  },

  // Toggle child health improved status
  toggleImproved(childId) {
    const children = NutriStorage.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return;

    child.improved = !child.improved;
    if (child.improved) {
      child.notes = (child.notes || '') + ' [Marked Recovered on ' + new Date().toLocaleDateString() + ']';
      NutriApp.showToast(`✨ ${child.name} has been marked as Improved & Recovered!`, 'success');
    } else {
      NutriApp.showToast(`Updated status for ${child.name}.`, 'info');
    }

    NutriStorage.saveChildren(children);
    this.renderRegistryTable();
    this.updateStatsBar();
    if (window.MHODashboard) MHODashboard.init();
  },

  // Open Edit/Update Child Modal
  openEditModal(childId) {
    const children = NutriStorage.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return;

    document.getElementById('edit-child-id').value = child.id;
    document.getElementById('edit-child-name').value = child.name;
    document.getElementById('edit-child-age').value = child.ageMonths;
    document.getElementById('edit-child-height').value = child.heightCm;
    document.getElementById('edit-child-weight').value = child.weightKg;
    document.getElementById('edit-child-muac').value = child.muacMm;
    document.getElementById('edit-child-notes').value = child.notes || '';

    NutriApp.openModal('modal-edit-child');
  },

  // Save new child
  handleSaveChild(form) {
    const age = parseInt(form.elements['childAge'].value, 10);
    const sex = form.elements['childSex'].value;
    const height = parseFloat(form.elements['childHeight'].value);
    const weight = parseFloat(form.elements['childWeight'].value);
    const muac = parseInt(form.elements['childMuac'].value, 10);

    const classification = this.calculateNutritionalStatus(age, sex, height, weight, muac);

    const newChild = {
      name: form.elements['childName'].value.trim(),
      ageMonths: age,
      sex: sex,
      parentName: form.elements['parentName'].value.trim(),
      parentPhone: form.elements['parentPhone'].value.trim(),
      barangay: form.elements['childBarangay'].value,
      heightCm: height,
      weightKg: weight,
      muacMm: muac,
      status: classification.overallStatus,
      hfaStatus: classification.hfaStatus,
      wfaStatus: classification.wfaStatus,
      wfhStatus: classification.wfhStatus,
      muacStatus: classification.muacStatus,
      improved: false,
      assignedModules: ['mod-1', 'mod-3'],
      completedModules: [],
      quizScore: 0,
      notes: form.elements['childNotes'].value.trim()
    };

    NutriStorage.addChild(newChild);
    form.reset();
    NutriApp.closeModal('modal-add-child');
    NutriApp.showToast(`Child record for ${newChild.name} successfully registered.`, 'success');
    this.renderRegistryTable();
    this.updateStatsBar();
    if (window.MHODashboard) MHODashboard.init();
  },

  // Save edited child measurements
  handleSaveEditedChild() {
    const id = document.getElementById('edit-child-id').value;
    const children = NutriStorage.getChildren();
    const child = children.find(c => c.id === id);
    if (!child) return;

    const age = parseInt(document.getElementById('edit-child-age').value, 10);
    const height = parseFloat(document.getElementById('edit-child-height').value);
    const weight = parseFloat(document.getElementById('edit-child-weight').value);
    const muac = parseInt(document.getElementById('edit-child-muac').value, 10);
    const notes = document.getElementById('edit-child-notes').value;

    const classification = this.calculateNutritionalStatus(age, child.sex, height, weight, muac);

    child.ageMonths = age;
    child.heightCm = height;
    child.weightKg = weight;
    child.muacMm = muac;
    child.status = classification.overallStatus;
    child.hfaStatus = classification.hfaStatus;
    child.wfaStatus = classification.wfaStatus;
    child.wfhStatus = classification.wfhStatus;
    child.muacStatus = classification.muacStatus;
    child.notes = notes;
    child.lastAssessed = new Date().toISOString().split('T')[0];

    NutriStorage.saveChildren(children);
    NutriApp.closeModal('modal-edit-child');
    NutriApp.showToast(`Updated health measurements for ${child.name}.`, 'success');
    this.renderRegistryTable();
    this.updateStatsBar();
    if (window.MHODashboard) MHODashboard.init();
  },

  // Open Community Report Submission Modal with auto-calculated values
  openReportModal() {
    const barangaySelect = document.getElementById('report-barangay-select');
    const selectedBrgy = barangaySelect ? barangaySelect.value : 'Barangay San Jose';

    const children = NutriStorage.getChildren().filter(c => c.barangay === selectedBrgy);
    const total = children.length;
    const stunted = children.filter(c => c.status === 'Stunted' && !c.improved).length;
    const wasted = children.filter(c => c.status === 'Wasted' && !c.improved).length;
    const underweight = children.filter(c => c.status === 'Underweight' && !c.improved).length;
    const improved = children.filter(c => c.improved === true).length;
    const stuntingRate = total > 0 ? ((stunted / total) * 100).toFixed(1) + '%' : '0.0%';

    document.getElementById('rep-calc-total').textContent = total;
    document.getElementById('rep-calc-stunted').textContent = stunted;
    document.getElementById('rep-calc-wasted').textContent = wasted;
    document.getElementById('rep-calc-underweight').textContent = underweight;
    document.getElementById('rep-calc-improved').textContent = improved;
    document.getElementById('rep-calc-rate').textContent = stuntingRate;

    NutriApp.openModal('modal-submit-report');
  },

  // Submit report to Municipal Health Office (Higher-ups)
  handleSubmitReport(form) {
    const brgy = document.getElementById('report-barangay-select').value;
    const chwName = form.elements['reportChwName'].value.trim() || 'Sister Teresa Lim, BNS';
    const notes = form.elements['reportNotes'].value.trim();

    const children = NutriStorage.getChildren().filter(c => c.barangay === brgy);
    const total = children.length;
    const stunted = children.filter(c => c.status === 'Stunted' && !c.improved).length;
    const wasted = children.filter(c => c.status === 'Wasted' && !c.improved).length;
    const underweight = children.filter(c => c.status === 'Underweight' && !c.improved).length;
    const improved = children.filter(c => c.improved === true).length;
    const stuntingRate = total > 0 ? ((stunted / total) * 100).toFixed(1) + '%' : '0.0%';

    const newReport = {
      barangay: brgy,
      chwName: chwName,
      totalChildren: total,
      stuntedCount: stunted,
      wastedCount: wasted,
      underweightCount: underweight,
      improvedCount: improved,
      stuntingRate: stuntingRate,
      stuntingReductionAchieved: '-2.4%',
      notes: notes
    };

    NutriStorage.submitReport(newReport);
    NutriApp.closeModal('modal-submit-report');
    NutriApp.showToast(`✅ Malnutrition report for ${brgy} submitted to Municipal Health Office!`, 'success');
    
    // Refresh MHO if available
    if (window.MHODashboard) MHODashboard.init();
  },

  // ==========================================================================
  // PARENT GROUPS & LESSON ASSIGNMENT (Req #8 & Req #13)
  // ==========================================================================
  initGroups() {
    this.renderGroups();
  },

  renderGroups() {
    const container = document.getElementById('chw-groups-container');
    if (!container) return;

    const groups = NutriStorage.getGroups();
    const allChildren = NutriStorage.getChildren();
    const allModules = NutriStorage.getModules();

    if (groups.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; background:#FFFFFF; border:1px dashed var(--border-light); border-radius:var(--radius-lg);">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">👥</div>
          <h3 style="color:var(--color-primary-900); margin-bottom:0.5rem;">No Parent Groups Planned Yet</h3>
          <p style="color:var(--text-muted); max-width:450px; margin:0 auto 1.25rem;">
            Create community parent cohorts to assign targeted feeding lessons, share tailored advice, and monitor collective learning progress.
          </p>
          <button class="btn btn-primary" onclick="CHWModule.openCreateGroupModal()">
            + Create First Parent Group
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = groups.map(grp => {
      // Find enrolled children records
      const enrolled = allChildren.filter(c => (grp.enrolledChildIds || []).includes(c.id));
      const assignedMods = allModules.filter(m => (grp.assignedModules || []).includes(m.id));

      // Calculate cohort progress
      let totalAssigned = (grp.assignedModules || []).length * (enrolled.length || 1);
      let totalCompleted = 0;
      enrolled.forEach(c => {
        const completed = c.completedModules || [];
        (grp.assignedModules || []).forEach(modId => {
          if (completed.includes(modId)) totalCompleted++;
        });
      });
      const progressPct = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

      return `
        <div class="card" style="margin-bottom:1.5rem; border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-light);">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <h3 style="color:var(--color-primary-900); font-size:1.15rem; font-weight:700; margin:0;">${grp.name}</h3>
                <span class="badge badge-normal" style="font-size:0.75rem;">${grp.barangay}</span>
              </div>
              <div style="font-size:0.82rem; color:var(--text-muted);">
                🎯 Target Focus: <strong>${grp.targetCategory}</strong> • Facilitator: <strong>${grp.facilitator}</strong>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="CHWModule.openAssignLessonsModal('${grp.id}')" title="Assign feeding lessons">
                📚 Assign Lessons
              </button>
              <button class="btn btn-outline btn-sm" onclick="CHWModule.openEnrollChildrenModal('${grp.id}')" title="Enroll parents/children">
                👶 Manage Members (${enrolled.length})
              </button>
              <button class="btn btn-accent btn-sm" onclick="CHWModule.openGroupAdviceModal('${grp.id}')" title="Send advice to this cohort">
                📢 Send Advice
              </button>
              <button class="btn btn-outline btn-sm" style="color:#DC2626; border-color:#FCA5A5;" onclick="CHWModule.handleDeleteGroup('${grp.id}')" title="Delete Group">
                🗑️
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="margin-bottom:1.25rem; background:#F8FAFC; padding:0.85rem 1rem; border-radius:var(--radius-md);">
            <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:600; margin-bottom:0.4rem;">
              <span>Cohort Learning Completion:</span>
              <span style="color:var(--color-primary-800);">${progressPct}% (${totalCompleted}/${totalAssigned} lessons completed)</span>
            </div>
            <div style="height:8px; background:#E2E8F0; border-radius:9999px; overflow:hidden;">
              <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #16A34A, #22C55E); border-radius:9999px; transition:width 0.4s ease;"></div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
            <!-- Assigned Modules Column -->
            <div style="background:#F0FDF4; padding:0.85rem 1rem; border-radius:var(--radius-md); border-left:3px solid #16A34A;">
              <div style="font-size:0.8rem; font-weight:700; color:#14532D; margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em;">
                📖 Assigned Lessons (${assignedMods.length})
              </div>
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                ${assignedMods.length ? assignedMods.map(m => `
                  <div style="font-size:0.82rem; color:#1F2937; display:flex; align-items:center; gap:6px;">
                    <span style="color:#16A34A; font-weight:700;">✓</span>
                    <span><strong>${m.number}:</strong> ${m.title}</span>
                  </div>
                `).join('') : '<span style="font-size:0.8rem; color:var(--text-muted);">No lessons assigned yet. Click "Assign Lessons".</span>'}
              </div>
            </div>

            <!-- Tailored Advice / Group Notes -->
            <div style="background:#FFFBEB; padding:0.85rem 1rem; border-radius:var(--radius-md); border-left:3px solid #F59E0B;">
              <div style="font-size:0.8rem; font-weight:700; color:#92400E; margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em;">
                💡 Facilitator Advice & Next Steps
              </div>
              <p style="font-size:0.84rem; color:#78350F; line-height:1.45; margin:0;">
                ${grp.adviceNotes || 'No advice recorded yet. Click "Send Advice" to post tailored feeding guidance.'}
              </p>
            </div>
          </div>

          <!-- Enrolled Parents / Children Chips -->
          <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px dashed var(--border-light);">
            <div style="font-size:0.78rem; font-weight:600; color:var(--text-muted); margin-bottom:0.4rem;">
              Enrolled Children & Parents (${enrolled.length}):
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              ${enrolled.length ? enrolled.map(c => `
                <span style="background:#F1F5F9; border:1px solid #CBD5E1; padding:2px 8px; border-radius:9999px; font-size:0.75rem; color:#334155;">
                  👶 <strong>${c.name}</strong> (${c.parentName}) • <span style="color:${c.status === 'Normal' || c.improved ? '#16A34A' : '#DC2626'};">${c.improved ? 'Recovered' : c.status}</span>
                </span>
              `).join('') : '<span style="font-size:0.78rem; color:var(--text-muted);">No children enrolled yet.</span>'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openCreateGroupModal() {
    NutriApp.openModal('modal-create-group');
  },

  handleSaveGroup(form) {
    const name = form.elements['groupName'].value.trim();
    const barangay = form.elements['groupBarangay'].value;
    const targetCategory = form.elements['groupCategory'].value.trim();
    const facilitator = form.elements['groupFacilitator'].value.trim();
    const adviceNotes = form.elements['groupNotes'].value.trim();

    // Validation (Req #14)
    if (!name || !targetCategory || !facilitator) {
      NutriApp.showToast('Please fill in all required group fields before saving.', 'warning');
      return;
    }

    const newGroup = {
      name,
      barangay,
      targetCategory,
      facilitator,
      adviceNotes,
      assignedModules: ['mod-1', 'mod-3'],
      enrolledChildIds: []
    };

    NutriStorage.addGroup(newGroup);
    form.reset();
    NutriApp.closeModal('modal-create-group');
    this.renderGroups();
    NutriApp.showToast(`🎉 Parent group "${name}" successfully created!`, 'success');
  },

  handleDeleteGroup(groupId) {
    if (confirm('Are you sure you want to delete this parent group?')) {
      NutriStorage.deleteGroup(groupId);
      this.renderGroups();
      NutriApp.showToast('Parent group removed.', 'info');
    }
  },

  openAssignLessonsModal(groupId) {
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    document.getElementById('assign-group-id').value = group.id;
    document.getElementById('assign-group-title').textContent = group.name;

    const modules = NutriStorage.getModules();
    const container = document.getElementById('assign-modules-checkboxes');
    if (container) {
      container.innerHTML = modules.map(m => {
        const isChecked = (group.assignedModules || []).includes(m.id);
        return `
          <label style="display:flex; align-items:flex-start; gap:0.6rem; padding:0.6rem; background:#F8FAFC; border:1px solid var(--border-light); border-radius:6px; margin-bottom:0.4rem; cursor:pointer;">
            <input type="checkbox" name="assignedMod" value="${m.id}" ${isChecked ? 'checked' : ''} style="margin-top:3px; accent-color:var(--color-primary-600);">
            <div>
              <strong style="color:var(--color-primary-900); font-size:0.86rem;">${m.number}: ${m.title}</strong>
              <div style="font-size:0.76rem; color:var(--text-muted);">${m.summary}</div>
            </div>
          </label>
        `;
      }).join('');
    }

    NutriApp.openModal('modal-assign-lessons');
  },

  handleSaveLessonAssignment(form) {
    const groupId = document.getElementById('assign-group-id').value;
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    const checkedBoxes = form.querySelectorAll('input[name="assignedMod"]:checked');
    const assigned = Array.from(checkedBoxes).map(cb => cb.value);

    // Validation (Req #14)
    if (assigned.length === 0) {
      NutriApp.showToast('Please assign at least one learning module to the group.', 'warning');
      return;
    }

    group.assignedModules = assigned;
    NutriStorage.updateGroup(group);

    // Also update assignedModules on all enrolled child records
    const children = NutriStorage.getChildren();
    let updatedChildCount = 0;
    children.forEach(c => {
      if ((group.enrolledChildIds || []).includes(c.id)) {
        c.assignedModules = Array.from(new Set([...(c.assignedModules || []), ...assigned]));
        updatedChildCount++;
      }
    });
    NutriStorage.saveChildren(children);

    NutriApp.closeModal('modal-assign-lessons');
    this.renderGroups();
    this.renderRegistryTable();
    NutriApp.showToast(`✅ ${assigned.length} lessons assigned to "${group.name}". Enrolled children updated!`, 'success');
  },

  openEnrollChildrenModal(groupId) {
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    document.getElementById('enroll-group-id').value = group.id;
    document.getElementById('enroll-group-title').textContent = group.name;

    const children = NutriStorage.getChildren().filter(c => c.barangay === group.barangay || !group.barangay);
    const container = document.getElementById('enroll-children-checkboxes');
    if (container) {
      if (children.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); font-size:0.84rem;">No registered children in this barangay yet.</p>';
      } else {
        container.innerHTML = children.map(c => {
          const isChecked = (group.enrolledChildIds || []).includes(c.id);
          return `
            <label style="display:flex; align-items:center; gap:0.6rem; padding:0.5rem 0.75rem; background:#F8FAFC; border:1px solid var(--border-light); border-radius:6px; margin-bottom:0.35rem; cursor:pointer;">
              <input type="checkbox" name="enrolledChild" value="${c.id}" ${isChecked ? 'checked' : ''} style="accent-color:var(--color-primary-600);">
              <div style="flex:1;">
                <strong style="color:var(--color-primary-900); font-size:0.84rem;">${c.name}</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);"> • Parent: ${c.parentName} (${c.ageMonths} mos, ${c.status})</span>
              </div>
            </label>
          `;
        }).join('');
      }
    }

    NutriApp.openModal('modal-enroll-children');
  },

  handleSaveEnrolledChildren(form) {
    const groupId = document.getElementById('enroll-group-id').value;
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    const checkedBoxes = form.querySelectorAll('input[name="enrolledChild"]:checked');
    group.enrolledChildIds = Array.from(checkedBoxes).map(cb => cb.value);
    NutriStorage.updateGroup(group);

    NutriApp.closeModal('modal-enroll-children');
    this.renderGroups();
    NutriApp.showToast(`Updated members for "${group.name}" (${group.enrolledChildIds.length} enrolled).`, 'success');
  },

  openGroupAdviceModal(groupId) {
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    document.getElementById('advice-group-id').value = group.id;
    document.getElementById('advice-group-title').textContent = group.name;
    document.getElementById('advice-group-notes').value = group.adviceNotes || '';

    NutriApp.openModal('modal-group-advice');
  },

  handleSendGroupAdvice(form) {
    const groupId = document.getElementById('advice-group-id').value;
    const group = NutriStorage.getGroups().find(g => g.id === groupId);
    if (!group) return;

    const advice = form.elements['adviceText'].value.trim();
    if (!advice) {
      NutriApp.showToast('Please enter an advisory note or message.', 'warning');
      return;
    }

    group.adviceNotes = advice;
    NutriStorage.updateGroup(group);

    // Also push an announcement to the community feed targeted to this barangay
    if (window.AnnouncementsModule) {
      const newAnn = {
        id: 'ann-' + Date.now(),
        title: `📢 Advisory for ${group.name}`,
        category: 'ADVISORY',
        authorRole: 'chw',
        authorName: group.facilitator || 'Health Worker',
        authorTitle: 'Barangay Nutrition Scholar',
        date: 'Today',
        targetRole: 'parent',
        targetBarangays: [group.barangay],
        content: advice,
        badge: 'Priority'
      };
      const annList = JSON.parse(localStorage.getItem(NutriStorage.ANNOUNCEMENTS_KEY) || '[]');
      annList.unshift(newAnn);
      localStorage.setItem(NutriStorage.ANNOUNCEMENTS_KEY, JSON.stringify(annList));
      AnnouncementsModule.renderAllFeeds();
    }

    NutriApp.closeModal('modal-group-advice');
    this.renderGroups();
    NutriApp.showToast(`📢 Advice broadcasted to parents in ${group.name}!`, 'success');
  }
};

