/**
 * NutriLearn - Global Application Controller & Orchestration
 */

class App {
  constructor() {
    this.currentRole = 'parent'; // parent, chw, supervisor
    this.authTab = 'login';      // login, register
    this.loginRole = 'parent';   // parent, chw
    this.registerRole = 'parent';// parent, chw
    this.modalOverlay = null;
    this.modalBody = null;
    this.toastContainer = null;
  }

  init() {
    this.modalOverlay = document.getElementById('app-modal');
    this.modalBody = document.getElementById('modal-content-area');
    this.toastContainer = document.getElementById('toast-container');

    this.setupEventListeners();
    this.checkAuthState();
    this.updateOnlineStatus();
  }

  setupEventListeners() {
    // Network listeners
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('open')) {
        this.closeModal();
      }
    });
  }

  updateOnlineStatus() {
    const statusText = document.getElementById('network-status-text');
    if (statusText) {
      if (navigator.onLine) {
        statusText.innerHTML = '<span class="dot-pulse"></span><span>Offline Ready • Local Database Active</span>';
      } else {
        statusText.innerHTML = '<span class="dot-pulse" style="background:#f59e0b;"></span><span>Working Offline (Local DB)</span>';
      }
    }
  }

  // Authentication State Flow
  checkAuthState() {
    const currentUser = window.storageService.getCurrentUser();
    const authView = document.getElementById('auth-view');
    const mainAppLayout = document.getElementById('main-app-layout');

    if (!currentUser) {
      // User is logged out -> Show Clean Login / Registration Screen
      if (authView) authView.style.display = 'block';
      if (mainAppLayout) mainAppLayout.style.display = 'none';
      this.renderAuthView();
    } else {
      // User is logged in -> Show Main App Layout
      if (authView) authView.style.display = 'none';
      if (mainAppLayout) mainAppLayout.style.display = 'flex';
      
      this.currentRole = currentUser.role;
      this.updateHeaderProfile();
      this.renderBottomNav();
      this.switchRole(currentUser.role, false);
    }
  }

  // Render Clean Login & Registration Screen Only
  renderAuthView() {
    const authView = document.getElementById('auth-view');
    if (!authView) return;

    authView.innerHTML = `
      <div class="auth-wrapper">
        
        <!-- App Logo & Branding Header -->
        <div class="auth-header">
          <div class="auth-logo-badge">
            <img src="assets/icon.jpg" alt="NutriLearn Logo">
          </div>
          <h1 class="auth-title">NutriLearn</h1>
          <p class="auth-subtitle">
            Childhood Nutrition & Malnutrition Surveillance Platform
          </p>
        </div>

        <!-- Segmented Tab Navigation: Sign In vs Register -->
        <div class="auth-tab-bar">
          <button class="auth-tab-btn ${this.authTab === 'login' ? 'active' : ''}" onclick="window.app.setAuthTab('login')">
            🔐 Sign In
          </button>
          <button class="auth-tab-btn ${this.authTab === 'register' ? 'active' : ''}" onclick="window.app.setAuthTab('register')">
            📝 Register
          </button>
        </div>

        <!-- Form Container -->
        <div class="auth-form-card">
          ${this.authTab === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}
        </div>

        <div style="font-size:0.72rem; color:var(--text-muted); text-align:center; margin-top:10px;">
          Evidence-based guidelines compliant with WHO & UNICEF IYCF standards.
        </div>

      </div>
    `;
  }

  setAuthTab(tab) {
    this.authTab = tab;
    this.renderAuthView();
  }

  setLoginRole(role) {
    this.loginRole = role;
    this.renderAuthView();
  }

  setRegisterRole(role) {
    this.registerRole = role;
    this.renderAuthView();
  }

  // 1. Password-Protected Login Form
  renderLoginForm() {
    const isParent = this.loginRole === 'parent';
    return `
      <!-- Role Toggle -->
      <div class="auth-role-selector">
        <button class="auth-role-pill ${isParent ? 'active' : ''}" onclick="window.app.setLoginRole('parent')">
          🥑 Parent / Caregiver
        </button>
        <button class="auth-role-pill ${!isParent ? 'active' : ''}" onclick="window.app.setLoginRole('chw')">
          🩺 Health Worker (CHW)
        </button>
      </div>

      <div style="margin-bottom:14px;">
        <h3 style="font-family:var(--font-display); font-size:1.1rem; font-weight:800; color:var(--text-main);">
          ${isParent ? '🥑 Parent Sign In' : '🩺 Health Worker Sign In'}
        </h3>
        <p style="font-size:0.78rem; color:var(--text-muted);">
          ${isParent ? 'Sign in to access your baby\'s recovery tracker & lessons.' : 'Sign in to access community screening & malnutrition caseload.'}
        </p>
      </div>

      <form id="login-form" onsubmit="window.app.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">Phone Number or Username *</label>
          <input type="text" id="login-id" class="form-input" required placeholder="${isParent ? 'e.g. elena or 0917-555-0192' : 'e.g. maria.chw or 0918-123-4567'}" autocomplete="username" />
        </div>

        <div class="form-group">
          <label class="form-label">Password *</label>
          <div class="password-input-wrapper">
            <input type="password" id="login-password" class="form-input" required placeholder="Enter your password" autocomplete="current-password" />
            <button type="button" class="password-toggle-btn" onclick="window.app.togglePasswordVisibility('login-password', this)">
              👁️
            </button>
          </div>
        </div>

        <div id="login-error-box" style="display:none; background:#fee2e2; color:#991b1b; padding:8px 10px; border-radius:6px; font-size:0.78rem; font-weight:600; margin-bottom:12px;"></div>

        <button type="submit" class="btn btn-primary btn-block">
          🔐 Sign In
        </button>
      </form>

      <div class="auth-footer-link">
        Don't have an account yet? <a onclick="window.app.setAuthTab('register')">Register here</a>
      </div>

      <!-- Discreet Helper for Demo / Testing Convenience -->
      <div class="demo-helper-box">
        <details>
          <summary class="demo-helper-summary">
            <span>💡 Demo Accounts & Passwords</span>
            <span style="font-size:0.7rem;">(Click to view)</span>
          </summary>
          <div style="margin-top:8px;">
            <div class="demo-account-item">
              <div>
                <strong>Elena Reyes (Parent)</strong>
                <div style="font-size:0.68rem;">User: <code>elena</code> • Pass: <code>password123</code></div>
              </div>
              <button onclick="window.app.fillDemoCredentials('elena', 'password123', 'parent')">Auto-fill</button>
            </div>

            <div class="demo-account-item">
              <div>
                <strong>Rosa Navarro (Parent)</strong>
                <div style="font-size:0.68rem;">User: <code>rosa</code> • Pass: <code>password123</code></div>
              </div>
              <button onclick="window.app.fillDemoCredentials('rosa', 'password123', 'parent')">Auto-fill</button>
            </div>

            <div class="demo-account-item">
              <div>
                <strong>Maria Santos (CHW #12)</strong>
                <div style="font-size:0.68rem;">User: <code>maria.chw</code> • Pass: <code>chwpassword123</code></div>
              </div>
              <button onclick="window.app.fillDemoCredentials('maria.chw', 'chwpassword123', 'chw')">Auto-fill</button>
            </div>

            <div class="demo-account-item">
              <div>
                <strong>Dr. Evelyn Morales (Supervisor)</strong>
                <div style="font-size:0.68rem;">User: <code>evelyn.mho</code> • Pass: <code>supervisor123</code></div>
              </div>
              <button onclick="window.app.fillDemoCredentials('evelyn.mho', 'supervisor123', 'chw')">Auto-fill</button>
            </div>
          </div>
        </details>
      </div>
    `;
  }

  // 2. Structured Registration Form
  renderRegisterForm() {
    const isParent = this.registerRole === 'parent';
    return `
      <!-- Role Toggle -->
      <div class="auth-role-selector">
        <button class="auth-role-pill ${isParent ? 'active' : ''}" onclick="window.app.setRegisterRole('parent')">
          🥑 Register Parent & Baby
        </button>
        <button class="auth-role-pill ${!isParent ? 'active' : ''}" onclick="window.app.setRegisterRole('chw')">
          🩺 Register Health Worker
        </button>
      </div>

      ${isParent ? `
        <!-- Parent & Baby Registration -->
        <div style="margin-bottom:12px;">
          <h3 style="font-family:var(--font-display); font-size:1.1rem; font-weight:800; color:var(--text-main);">
            🥑 Parent & Baby Registration
          </h3>
          <p style="font-size:0.78rem; color:var(--text-muted);">
            Create a secure private account to monitor your baby's nutrition and recovery.
          </p>
        </div>

        <form onsubmit="window.app.handleParentRegister(event)">
          <div class="form-group">
            <label class="form-label">Parent / Caregiver Full Name *</label>
            <input type="text" id="reg-p-name" class="form-input" required placeholder="e.g. Maria Teresa Santos" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="text" id="reg-p-phone" class="form-input" required placeholder="0917-123-4567" />
            </div>
            <div class="form-group">
              <label class="form-label">Username (Optional)</label>
              <input type="text" id="reg-p-username" class="form-input" placeholder="e.g. maria" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Password *</label>
              <div class="password-input-wrapper">
                <input type="password" id="reg-p-password" class="form-input" required minlength="4" placeholder="Min 4 chars" />
                <button type="button" class="password-toggle-btn" onclick="window.app.togglePasswordVisibility('reg-p-password', this)">👁️</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password *</label>
              <input type="password" id="reg-p-confirm" class="form-input" required placeholder="Repeat password" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Barangay / Community *</label>
            <input type="text" id="reg-p-community" class="form-input" required value="Barangay San Isidro" />
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:14px;">
            <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">👶 Baby Profile Details</h4>
            
            <div class="form-group">
              <label class="form-label">Baby's Full Name *</label>
              <input type="text" id="reg-p-baby-name" class="form-input" required placeholder="e.g. Baby Lucas Santos" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Age (Months) *</label>
                <input type="number" id="reg-p-baby-age" class="form-input" required min="1" max="59" value="12" />
              </div>
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select id="reg-p-baby-gender" class="form-select">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Current Weight (kg) *</label>
                <input type="number" step="0.1" id="reg-p-baby-weight" class="form-input" required value="7.5" />
              </div>
              <div class="form-group">
                <label class="form-label">Arm MUAC (mm)</label>
                <input type="number" id="reg-p-baby-muac" class="form-input" value="120" />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            🥑 Create Parent Account & Open Hub
          </button>
        </form>
      ` : `
        <!-- Health Worker Registration -->
        <div style="margin-bottom:12px;">
          <h3 style="font-family:var(--font-display); font-size:1.1rem; font-weight:800; color:var(--text-main);">
            🩺 Health Worker (CHW) Registration
          </h3>
          <p style="font-size:0.78rem; color:var(--text-muted);">
            Create an official health worker account to triage cases and log home visits.
          </p>
        </div>

        <form onsubmit="window.app.handleCHWRegister(event)">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="reg-c-name" class="form-input" required placeholder="e.g. Nurse Sarah Dela Cruz" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="text" id="reg-c-phone" class="form-input" required placeholder="0918-555-4321" />
            </div>
            <div class="form-group">
              <label class="form-label">Username *</label>
              <input type="text" id="reg-c-username" class="form-input" required placeholder="e.g. sarah.chw" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Password *</label>
              <div class="password-input-wrapper">
                <input type="password" id="reg-c-password" class="form-input" required minlength="4" placeholder="Min 4 chars" />
                <button type="button" class="password-toggle-btn" onclick="window.app.togglePasswordVisibility('reg-c-password', this)">👁️</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password *</label>
              <input type="password" id="reg-c-confirm" class="form-input" required placeholder="Repeat password" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Official Designation / Role *</label>
            <input type="text" id="reg-c-title" class="form-input" required value="Community Health Worker #16" />
          </div>

          <div class="form-group">
            <label class="form-label">Assigned Barangay / Catchment *</label>
            <input type="text" id="reg-c-community" class="form-input" required value="Barangay San Isidro & Malaya" />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            🩺 Create CHW Profile & Access Caseload
          </button>
        </form>
      `}

      <div class="auth-footer-link">
        Already have an account? <a onclick="window.app.setAuthTab('login')">Sign In here</a>
      </div>
    `;
  }

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.innerHTML = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.innerHTML = '👁️';
    }
  }

  fillDemoCredentials(username, password, role) {
    this.loginRole = role;
    this.renderAuthView();
    setTimeout(() => {
      const idInput = document.getElementById('login-id');
      const passInput = document.getElementById('login-password');
      if (idInput) idInput.value = username;
      if (passInput) passInput.value = password;
    }, 50);
  }

  // Handle Login Authentication
  handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error-box');

    const result = window.storageService.authenticate(id, pass, this.loginRole);

    if (!result.success) {
      if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.textContent = result.message;
      }
      this.showToast(result.message, 'danger');
      return;
    }

    if (errorBox) errorBox.style.display = 'none';
    this.checkAuthState();
    this.showToast(`Welcome, ${result.user.name}! 🌟`, 'success');
  }

  // Handle Parent & Baby Registration
  handleParentRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-p-name').value;
    const phone = document.getElementById('reg-p-phone').value;
    const username = document.getElementById('reg-p-username').value;
    const password = document.getElementById('reg-p-password').value;
    const confirm = document.getElementById('reg-p-confirm').value;
    const community = document.getElementById('reg-p-community').value;

    const babyName = document.getElementById('reg-p-baby-name').value;
    const babyAge = document.getElementById('reg-p-baby-age').value;
    const babyGender = document.getElementById('reg-p-baby-gender').value;
    const babyWeight = document.getElementById('reg-p-baby-weight').value;
    const babyMuac = document.getElementById('reg-p-baby-muac').value;

    if (password !== confirm) {
      this.showToast('Passwords do not match. Please verify.', 'danger');
      return;
    }

    const result = window.storageService.registerParent(
      { name, phone, username, password, community },
      { name: babyName, ageMonths: babyAge, gender: babyGender, weight: babyWeight, muac: babyMuac }
    );

    this.checkAuthState();
    this.showToast(`Account registered for ${name}! Logged into ${babyName}'s Hub. 🥑👶`, 'success');
  }

  // Handle Health Worker Registration
  handleCHWRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-c-name').value;
    const phone = document.getElementById('reg-c-phone').value;
    const username = document.getElementById('reg-c-username').value;
    const password = document.getElementById('reg-c-password').value;
    const confirm = document.getElementById('reg-c-confirm').value;
    const title = document.getElementById('reg-c-title').value;
    const community = document.getElementById('reg-c-community').value;

    if (password !== confirm) {
      this.showToast('Passwords do not match. Please verify.', 'danger');
      return;
    }

    const newCHW = window.storageService.registerCHW({ name, phone, username, password, title, community });

    this.checkAuthState();
    this.showToast(`Health worker account registered for ${name}! 🩺`, 'success');
  }

  logout() {
    window.storageService.logout();
    this.checkAuthState();
    this.showToast('Logged out securely.', 'info');
  }

  updateHeaderProfile() {
    const currentUser = window.storageService.getCurrentUser();
    if (!currentUser) return;

    const nameEl = document.getElementById('user-strip-name');
    const detailEl = document.getElementById('user-strip-detail');
    const avatarEl = document.getElementById('user-strip-avatar');
    const titleEl = document.getElementById('header-portal-title');
    const subtitleEl = document.getElementById('header-portal-subtitle');
    const switcherBtn = document.getElementById('btn-child-switcher');

    if (avatarEl) avatarEl.innerHTML = currentUser.avatar || (currentUser.role === 'parent' ? '👩' : '🩺');
    if (nameEl) nameEl.textContent = currentUser.name;

    if (currentUser.role === 'parent') {
      const myChildren = window.storageService.getChildrenForCurrentUser();
      const myBaby = myChildren[0];
      const babyName = myBaby ? myBaby.name : 'Baby Profile';
      
      if (titleEl) titleEl.textContent = '🥑 Parent Hub';
      if (subtitleEl) subtitleEl.textContent = `Home Feeding • ${babyName}`;
      if (detailEl) detailEl.textContent = `Mother of ${babyName} • ${currentUser.community || 'San Isidro'}`;
      
      // Show child switcher button if parent has multiple children
      if (switcherBtn) {
        switcherBtn.style.display = myChildren.length > 1 ? 'flex' : 'none';
      }
    } else {
      if (titleEl) titleEl.textContent = '🩺 CHW Toolkit';
      if (subtitleEl) subtitleEl.textContent = 'Malnutrition Surveillance & Caseload';
      if (detailEl) detailEl.textContent = `${currentUser.title || 'Community Health Worker'} • ${currentUser.community || 'District'}`;
      if (switcherBtn) switcherBtn.style.display = 'none';
    }
  }

  renderBottomNav() {
    const nav = document.getElementById('app-bottom-nav');
    if (!nav) return;

    const currentUser = window.storageService.getCurrentUser();
    if (!currentUser) {
      nav.innerHTML = '';
      return;
    }

    if (currentUser.role === 'parent') {
      nav.innerHTML = `
        <button class="nav-tab active" id="nav-parent-home" onclick="window.app.switchRole('parent')">
          <span class="nav-tab-icon">🥑</span>
          <span>My Baby</span>
        </button>
        <button class="nav-tab" id="nav-parent-lessons" onclick="window.app.openLessonsModal()">
          <span class="nav-tab-icon">📚</span>
          <span>Audio Lessons</span>
        </button>
        <button class="nav-tab" onclick="window.app.openParentProfileModal()">
          <span class="nav-tab-icon">👤</span>
          <span>My Profile</span>
        </button>
        <button class="nav-tab" onclick="window.app.logout()" style="color:var(--danger-sam);">
          <span class="nav-tab-icon">🚪</span>
          <span>Log Out</span>
        </button>
      `;
    } else {
      nav.innerHTML = `
        <button class="nav-tab active" id="nav-chw-caseload" onclick="window.app.switchRole('chw')">
          <span class="nav-tab-icon">📋</span>
          <span>All Babies</span>
        </button>
        <button class="nav-tab" onclick="window.chwToolkit.openScreeningModal()">
          <span class="nav-tab-icon">📐</span>
          <span>Screen Intake</span>
        </button>
        <button class="nav-tab" id="nav-chw-reports" onclick="window.app.switchRole('supervisor')">
          <span class="nav-tab-icon">📊</span>
          <span>Surveillance</span>
        </button>
        <button class="nav-tab" onclick="window.app.logout()" style="color:var(--danger-sam);">
          <span class="nav-tab-icon">🚪</span>
          <span>Log Out</span>
        </button>
      `;
    }
  }

  switchRole(role, notify = true) {
    this.currentRole = role;

    // Update Bottom Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });

    const activeNavTab = role === 'parent' ? document.getElementById('nav-parent-home') :
                         (role === 'chw' ? document.getElementById('nav-chw-caseload') : document.getElementById('nav-chw-reports'));
    if (activeNavTab) activeNavTab.classList.add('active');

    // Hide all view containers
    const parentView = document.getElementById('parent-view');
    const chwView = document.getElementById('chw-view');
    const supervisorView = document.getElementById('supervisor-view');

    if (parentView) parentView.style.display = role === 'parent' ? 'block' : 'none';
    if (chwView) chwView.style.display = role === 'chw' ? 'block' : 'none';
    if (supervisorView) supervisorView.style.display = role === 'supervisor' ? 'block' : 'none';

    // Render corresponding view
    if (role === 'parent') {
      window.parentPortal.init();
    } else if (role === 'chw') {
      window.chwToolkit.init();
    } else if (role === 'supervisor') {
      window.supervisorDashboard.init();
    }

    if (notify) {
      const roleTitles = {
        'parent': 'Parent / Caregiver Hub 🥑',
        'chw': 'Health Worker Caseload 🩺',
        'supervisor': 'Surveillance Telemetry 📊'
      };
      this.showToast(`Switched to ${roleTitles[role]}`, 'info');
    }
  }

  // Quick Modal for Lessons (Accessible from Parent Bottom Nav)
  openLessonsModal() {
    const modules = window.storageService.getModules();
    const myChildren = window.storageService.getChildrenForCurrentUser();
    const child = myChildren[0] || {};
    const completed = child.completedModules || [];

    this.showModal(`
      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:4px;">📚 Nutrition Micro-Lessons</h2>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Tap any module to learn and listen to audio narration:</p>

      <div class="module-grid">
        ${modules.map(mod => {
          const isDone = completed.includes(mod.id);
          return `
            <div class="module-card" onclick="window.app.closeModal(); window.parentPortal.openModule('${mod.id}');">
              <div class="module-icon-box">${mod.icon}</div>
              <div class="module-info">
                <div class="module-tag">${mod.category}</div>
                <h4 class="module-title">${mod.title}</h4>
                <div class="module-meta">
                  <span>⏱️ ${mod.duration}</span>
                  <span style="color:${isDone ? 'var(--secondary)' : 'var(--accent-warm)'}; font-weight:700;">
                    ${isDone ? '✓ Completed' : '• Start Lesson'}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn btn-secondary btn-block" style="margin-top:12px;" onclick="window.app.closeModal()">Close</button>
    `);
  }

  // Parent Profile Modal
  openParentProfileModal() {
    const currentUser = window.storageService.getCurrentUser() || { name: 'Parent', phone: 'N/A', community: 'Barangay San Isidro' };
    const myChildren = window.storageService.getChildrenForCurrentUser();

    this.showModal(`
      <div style="text-align:center; margin-bottom:14px;">
        <span style="font-size:2.5rem;">👩</span>
        <h2 style="font-size:1.25rem; font-weight:800; margin-top:4px;">${currentUser.name}</h2>
        <div style="font-size:0.8rem; color:var(--text-muted);">${currentUser.community || 'San Isidro'} • Contact: ${currentUser.phone}</div>
      </div>

      <div class="card" style="margin-bottom:12px;">
        <div class="card-header">
          <h3 class="card-title"><span>👶</span> My Registered Children</h3>
          <button class="btn btn-sm btn-secondary" onclick="window.app.closeModal(); window.parentPortal.openAddBabyModal();">+ Add Baby</button>
        </div>
        ${myChildren.map(c => `
          <div style="padding:8px 0; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>${c.name}</strong> (${c.ageMonths} mos, ${c.gender})
              <div style="font-size:0.75rem; color:var(--text-muted);">Weight: ${c.currentWeight}kg • Status: ${c.status}</div>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="window.app.selectChild('${c.id}')">View</button>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn btn-danger btn-block" onclick="window.app.closeModal(); window.app.logout();">
          🚪 Log Out
        </button>
        <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
          Close
        </button>
      </div>
    `);
  }

  // Child Switcher Modal
  openChildSwitcher() {
    const children = window.storageService.getChildrenForCurrentUser();
    const currentId = window.storageService.getSelectedChildId();

    this.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">👶 Select Child Profile</h2>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${children.map(c => `
          <div class="caseload-item" style="cursor:pointer; border-color:${c.id === currentId ? 'var(--primary)' : 'var(--border-light)'}; background:${c.id === currentId ? 'var(--primary-soft)' : '#fff'};" onclick="window.app.selectChild('${c.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${c.name}</strong> (${c.ageMonths} mos)
                <div style="font-size:0.75rem; color:var(--text-muted);">Caregiver: ${c.parentName} • ${c.community}</div>
              </div>
              <span class="badge-status ${c.status === 'RECOVERED' ? 'badge-recovered' : (c.status === 'SAM' ? 'badge-sam' : 'badge-mam')}">
                ${c.status}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-block" style="margin-top:12px;" onclick="window.app.closeModal()">Close</button>
    `);
  }

  selectChild(childId) {
    window.storageService.setSelectedChildId(childId);
    this.closeModal();
    if (this.currentRole === 'parent') {
      window.parentPortal.init();
    }
    this.updateHeaderProfile();
    const child = window.storageService.getChildById(childId);
    this.showToast(`Loaded profile for ${child.name}!`, 'success');
  }

  // Modal Management
  showModal(htmlContent) {
    if (!this.modalOverlay || !this.modalBody) return;
    this.modalBody.innerHTML = htmlContent;
    this.modalOverlay.classList.add('open');
  }

  closeModal() {
    if (!this.modalOverlay) return;
    this.modalOverlay.classList.remove('open');
  }

  // Toast Notifications
  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚨';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Text-To-Speech Narration for Caregivers
  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      this.showToast('🔊 Playing audio lesson narration...', 'info');
    } else {
      this.showToast('Speech synthesis not supported on this device.', 'warning');
    }
  }

  // Settings & About Modal
  openSettings() {
    const currentUser = window.storageService.getCurrentUser();
    this.showModal(`
      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:8px;">⚙️ NutriLearn App Settings</h2>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
        NutriLearn v1.0.0 • Logged in as <strong>${currentUser ? currentUser.name : 'Guest'}</strong> (${currentUser ? currentUser.role.toUpperCase() : 'None'}).
      </p>

      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
        <button class="btn btn-secondary btn-block" onclick="window.app.logout(); window.app.closeModal();">
          🚪 Sign Out / Switch Account
        </button>

        <button class="btn btn-outline-primary btn-block" onclick="window.supervisorDashboard.generateOfficialReport()">
          📄 View Malnutrition Surveillance Report
        </button>

        <button class="btn btn-danger btn-block" onclick="window.storageService.resetDemoData(); window.app.closeModal(); window.app.checkAuthState(); window.app.showToast('Reset data to demo defaults.', 'info');">
          🔄 Reset Demo Data
        </button>
      </div>

      <div style="font-size:0.72rem; color:var(--text-muted); text-align:center;">
        Evidence-based guidelines compliant with WHO & UNICEF Infant and Young Child Feeding (IYCF) standards.
      </div>
    `);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
