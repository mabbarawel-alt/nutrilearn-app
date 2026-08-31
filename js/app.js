/**
 * NutriLearn Calabanga - Global Application Controller & Orchestration
 * Pamamahala ng Sistema para sa Bayan ng Calabanga at Barangay Paolbo
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
      if (e.key === 'Escape' && this.modalOverlay && this.modalOverlay.classList.contains('open')) {
        this.closeModal();
      }
    });
  }

  updateOnlineStatus() {
    const statusText = document.getElementById('network-status-text');
    if (statusText) {
      if (navigator.onLine) {
        statusText.innerHTML = '<span class="dot-pulse"></span><span>Handa kahit Offline • Lokal na Database</span>';
      } else {
        statusText.innerHTML = '<span class="dot-pulse" style="background:#f59e0b;"></span><span>Gumagana Offline (Lokal na Database)</span>';
      }
    }
  }

  // Daloy ng Katayuan ng Pagpapatunay (Authentication State Flow)
  checkAuthState() {
    const currentUser = window.storageService.getCurrentUser();
    const authView = document.getElementById('auth-view');
    const mainAppLayout = document.getElementById('main-app-layout');

    if (!currentUser) {
      if (authView) authView.style.display = 'block';
      if (mainAppLayout) mainAppLayout.style.display = 'none';
      this.renderAuthView();
    } else {
      if (authView) authView.style.display = 'none';
      if (mainAppLayout) mainAppLayout.style.display = 'flex';
      
      this.currentRole = currentUser.role;
      this.updateHeaderProfile();
      this.renderBottomNav();
      this.switchRole(currentUser.role, false);
    }
  }

  // Pagpapakita ng Screen ng Pag-log in at Pagrehistro (Clean, Clear & Mobile-Optimized)
  renderAuthView() {
    const authView = document.getElementById('auth-view');
    if (!authView) return;

    authView.innerHTML = `
      <div class="auth-wrapper">
        
        <!-- Header para sa Calabanga at Brgy. Paolbo -->
        <div class="auth-header">
          <div class="auth-logo-badge">
            <img src="assets/icon.jpg" alt="NutriLearn Logo" />
          </div>
          <h1 class="auth-title">NutriLearn</h1>
          <p class="auth-subtitle">
            Better nutrition, one family at a time.<br>
            <span style="font-weight:700; color:var(--primary);">Bayan ng Calabanga • Barangay Paolbo</span>
          </p>
        </div>

        <!-- Segmented Tab Navigation: Mag-sign In vs Magrehistro -->
        <div class="auth-tab-bar">
          <button class="auth-tab-btn ${this.authTab === 'login' ? 'active' : ''}" onclick="window.app.setAuthTab('login')">
            Mag-sign In
          </button>
          <button class="auth-tab-btn ${this.authTab === 'register' ? 'active' : ''}" onclick="window.app.setAuthTab('register')">
            Magrehistro
          </button>
        </div>

        <!-- Form Container -->
        <div class="auth-form-card">
          ${this.authTab === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}
        </div>

        <div style="font-size:0.72rem; color:var(--text-muted); text-align:center; margin-top:12px;">
          Alinsunod sa mga pamantayan ng DOH, WHO at UNICEF Infant and Young Child Feeding (IYCF).
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
      <!-- Pagpili ng Tungkulin -->
      <div class="auth-role-selector">
        <button class="auth-role-pill ${isParent ? 'active' : ''}" onclick="window.app.setLoginRole('parent')">
          Magulang / Tagapag-alaga
        </button>
        <button class="auth-role-pill ${!isParent ? 'active' : ''}" onclick="window.app.setLoginRole('chw')">
          Barangay Health Worker (BHW)
        </button>
      </div>

      <div style="margin-bottom:14px;">
        <h3 style="font-family:var(--font-display); font-size:1.05rem; font-weight:800; color:var(--text-main);">
          ${isParent ? 'Pag-sign In ng Magulang' : 'Pag-sign In ng BHW'}
        </h3>
        <p style="font-size:0.78rem; color:var(--text-muted);">
          ${isParent ? 'Mag-sign in upang masubaybayan ang kalusugan ng inyong anak.' : 'Mag-sign in upang buksan ang screening at caseload ng mga bata sa Barangay Paolbo.'}
        </p>
      </div>

      <form id="login-form" onsubmit="window.app.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">Username *</label>
          <input type="text" id="login-id" class="form-input" required placeholder="Username" autocomplete="username" />
        </div>

        <div class="form-group">
          <label class="form-label">Password *</label>
          <div class="password-input-wrapper">
            <input type="password" id="login-password" class="form-input" required placeholder="Password" autocomplete="current-password" />
            <button type="button" class="password-toggle-btn" onclick="window.app.togglePasswordVisibility('login-password', this)">
              Ipakita
            </button>
          </div>
        </div>

        <div id="login-error-box" style="display:none; background:#fee2e2; color:#991b1b; padding:8px 10px; border-radius:6px; font-size:0.78rem; font-weight:600; margin-bottom:12px;"></div>

        <button type="submit" class="btn btn-primary btn-block" style="min-height:46px; font-size:0.92rem; font-weight:700;">
          Mag-sign In
        </button>
      </form>

      <div class="auth-footer-link">
        Wala ka pa bang account? <a onclick="window.app.setAuthTab('register')">Magrehistro rito</a>
      </div>

      <div style="margin-top:20px; padding-top:12px; border-top:1px solid #e2e8f0; text-align:center;">
        <div style="font-size:0.75rem; font-weight:800; color:var(--primary); letter-spacing:0.5px;">Binuo ng NEXORA</div>
        <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">Credits to the Owner • Developer: <strong>NEXORA</strong></div>
      </div>
    `;
  }

  // 2. Structured Registration Form
  renderRegisterForm() {
    const isParent = this.registerRole === 'parent';
    return `
      <!-- Pagpili ng Tungkulin sa Pagrehistro -->
      <div class="auth-role-selector" style="margin-bottom:12px;">
        <button class="auth-role-pill ${!isParent ? 'active' : ''}" onclick="window.app.setRegisterRole('chw')">
          Magrehistro ng BHW
        </button>
        <button class="auth-role-pill ${isParent ? 'active' : ''}" onclick="window.app.setRegisterRole('parent')">
          Impormasyon para sa Magulang
        </button>
      </div>

      ${isParent ? `
        <!-- Impormasyon para sa mga Magulang -->
        <div style="margin-bottom:12px;">
          <h3 style="font-family:var(--font-display); font-size:1rem; font-weight:800; color:var(--text-main);">
            Account ng Magulang sa Barangay Paolbo
          </h3>
          <p style="font-size:0.75rem; color:var(--text-muted);">
            Paano makakakuha ng account ang magulang?
          </p>
        </div>

        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:var(--radius-sm); padding:14px 12px; margin-bottom:12px; line-height:1.5;">
          <div style="font-weight:800; font-size:0.85rem; color:#166534; margin-bottom:4px;">
            Ginagawa ng BHW ang Account ng Magulang:
          </div>
          <p style="font-size:0.78rem; color:#15803d; margin-bottom:8px;">
            Ang inyong <strong>Barangay Health Worker (BHW)</strong> sa Barangay Paolbo ang direktang lilikha ng inyong <strong>Account ng Magulang</strong> kasabay ng opisyal na pagrehistro at pagsusuri ng inyong anak upang awtomatikong maging konektado ang profile at sukat ng bata sa inyong account.
          </p>
          <div style="background:#ffffff; border:1px solid #bbf7d0; border-radius:6px; padding:8px 10px; font-size:0.73rem; color:#166534;">
            <strong>Paano mag-sign in?</strong><br>
            Ibibigay sa inyo ng BHW ang inyong <strong>Username</strong> at <strong>Password</strong>. Pagkatapos, piliin ang <strong>Magulang / Tagapag-alaga</strong> sa Sign In.
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-block" style="min-height:44px; font-size:0.88rem; font-weight:700;" onclick="window.app.setAuthTab('login'); window.app.setLoginRole('parent');">
          Pumunta sa Sign In ng Magulang
        </button>
      ` : `
        <!-- Rehistrasyon ng Barangay Health Worker (BHW) -->
        <div style="margin-bottom:10px;">
          <h3 style="font-family:var(--font-display); font-size:1rem; font-weight:800; color:var(--text-main);">
            Rehistrasyon ng Barangay Health Worker (BHW)
          </h3>
          <p style="font-size:0.75rem; color:var(--text-muted);">
            Gumawa ng BHW account upang magsagawa ng pagsusuri at magtala ng pagbisita sa mga tahanan.
          </p>
        </div>

        <form onsubmit="window.app.handleCHWRegister(event)">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:0.75rem;">Buong Pangalan ng BHW *</label>
            <input type="text" id="reg-c-name" class="form-input" required placeholder="Pangalan ng BHW" />
          </div>

          <div class="form-row" style="margin-bottom:8px;">
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Numero ng Telepono *</label>
              <input type="text" id="reg-c-phone" class="form-input" required placeholder="Numero ng Telepono" />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Username *</label>
              <input type="text" id="reg-c-username" class="form-input" required placeholder="Username" />
            </div>
          </div>

          <div class="form-row" style="margin-bottom:8px;">
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Password *</label>
              <div class="password-input-wrapper">
                <input type="password" id="reg-c-password" class="form-input" required minlength="4" placeholder="Password" />
                <button type="button" class="password-toggle-btn" onclick="window.app.togglePasswordVisibility('reg-c-password', this)">Ipakita</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Kumpirmahin ang Password *</label>
              <input type="password" id="reg-c-confirm" class="form-input" required placeholder="Kumpirmahin ang password" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:0.75rem;">Opisyal na Posisyon *</label>
            <input type="text" id="reg-c-title" class="form-input" required value="Barangay Health Worker (BHW) #16" />
          </div>

          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Zone / Purok *</label>
              <input type="text" id="reg-c-zone" class="form-input" required placeholder="hal. Zone 1" value="Zone 1" />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Barangay *</label>
              <input type="text" id="reg-c-barangay" class="form-input" required value="Barangay Paolbo" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="min-height:44px; font-size:0.88rem; font-weight:700;">
            Gawin ang BHW Account
          </button>
        </form>
      `}

      <div class="auth-footer-link" style="margin-top:10px;">
        May account ka na ba? <a onclick="window.app.setAuthTab('login')">Mag-sign In rito</a>
      </div>

      <div style="margin-top:16px; padding-top:10px; border-top:1px solid #e2e8f0; text-align:center;">
        <div style="font-size:0.72rem; font-weight:800; color:var(--primary); letter-spacing:0.5px;">Binuo ng NEXORA</div>
        <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">Credits to the Owner • Developer: <strong>NEXORA</strong></div>
      </div>
    `;
  }

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = 'Itago';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = 'Ipakita';
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
    this.showToast(`Maligayang pagdating, ${result.user.name}!`, 'success');
  }

  handleParentRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-p-name') ? document.getElementById('reg-p-name').value : '';
    const phone = document.getElementById('reg-p-phone') ? document.getElementById('reg-p-phone').value : '';
    const username = document.getElementById('reg-p-username') ? document.getElementById('reg-p-username').value : '';
    const password = document.getElementById('reg-p-password') ? document.getElementById('reg-p-password').value : '';
    const confirm = document.getElementById('reg-p-confirm') ? document.getElementById('reg-p-confirm').value : '';
    const community = 'Barangay Paolbo';

    if (password !== confirm) {
      this.showToast('Hindi magkatugma ang password. Pakisuri muli.', 'danger');
      return;
    }

    const newParent = window.storageService.registerParent({ name, phone, username, password, community });

    this.checkAuthState();
    this.showToast(`Rehistrado ang account para kay ${name}.`, 'success');
  }

  handleCHWRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-c-name').value;
    const phone = document.getElementById('reg-c-phone').value;
    const username = document.getElementById('reg-c-username').value;
    const password = document.getElementById('reg-c-password').value;
    const confirm = document.getElementById('reg-c-confirm').value;
    const title = document.getElementById('reg-c-title').value;
    const zone = document.getElementById('reg-c-zone') ? document.getElementById('reg-c-zone').value.trim() : '';
    const barangay = document.getElementById('reg-c-barangay') ? document.getElementById('reg-c-barangay').value.trim() : 'Barangay Paolbo';
    const community = `${zone ? zone + ', ' : ''}${barangay}`;

    if (password !== confirm) {
      this.showToast('Hindi magkatugma ang password. Pakisuri muli.', 'danger');
      return;
    }

    const newCHW = window.storageService.registerCHW({ name, phone, username, password, title, community });

    this.checkAuthState();
    this.showToast(`BHW account rehistrado para kay ${name}.`, 'success');
  }

  logout() {
    window.storageService.logout();
    this.checkAuthState();
    this.showToast('Nakalabas na sa account.', 'info');
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

    const initials = currentUser.avatar || (currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US');
    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = currentUser.name;

    if (currentUser.role === 'parent') {
      const myChildren = window.storageService.getChildrenForCurrentUser();
      const myBaby = myChildren[0];
      const babyName = myBaby ? myBaby.name : 'Profile ng Bata';
      
      if (titleEl) titleEl.textContent = 'NutriLearn Magulang';
      if (subtitleEl) subtitleEl.textContent = `Pagpapakain sa Bahay • ${babyName}`;
      if (detailEl) detailEl.textContent = `Magulang ni ${babyName} • ${currentUser.community || 'Barangay Paolbo, Calabanga'}`;
      
      if (switcherBtn) {
        switcherBtn.style.display = myChildren.length > 1 ? 'inline-flex' : 'none';
      }
    } else {
      if (titleEl) titleEl.textContent = 'NutriLearn BHW';
      if (subtitleEl) subtitleEl.textContent = 'Bayan ng Calabanga • Barangay Paolbo';
      if (detailEl) detailEl.textContent = `${currentUser.title || 'Barangay Health Worker'} • ${currentUser.community || 'Barangay Paolbo'}`;
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
      const isDashboard = !window.parentPortal || window.parentPortal.activeView === 'dashboard';
      const isChild = window.parentPortal && window.parentPortal.activeView === 'child';
      const isFood = window.parentPortal && window.parentPortal.activeView === 'food';
      const isLessons = window.parentPortal && window.parentPortal.activeView === 'lessons';

      nav.innerHTML = `
        <button class="nav-tab ${isDashboard ? 'active' : ''}" id="nav-parent-dashboard" onclick="window.app.switchRole('parent'); window.parentPortal.switchView('dashboard');">
          <span>Dashboard</span>
        </button>
        <button class="nav-tab ${isChild ? 'active' : ''}" id="nav-parent-child" onclick="window.app.switchRole('parent'); window.parentPortal.switchView('child');">
          <span>Aking Bata</span>
        </button>
        <button class="nav-tab ${isFood ? 'active' : ''}" id="nav-parent-food" onclick="window.app.switchRole('parent'); window.parentPortal.switchView('food');">
          <span>Pagkain</span>
        </button>
        <button class="nav-tab ${isLessons ? 'active' : ''}" id="nav-parent-lessons" onclick="window.app.switchRole('parent'); window.parentPortal.switchView('lessons');">
          <span>Aralin</span>
        </button>
        <button class="nav-tab" onclick="window.app.logout()" style="color:var(--danger-sam);">
          <span>Lumabas</span>
        </button>
      `;
    } else {
      const unreadCount = window.storageService.getUnreadParentMessagesCount ? window.storageService.getUnreadParentMessagesCount() : 0;
      const isDashboard = !window.chwToolkit || window.chwToolkit.activeView === 'dashboard';
      const isCaseload = window.chwToolkit && window.chwToolkit.activeView === 'caseload';
      const isParents = window.chwToolkit && window.chwToolkit.activeView === 'parents';

      nav.innerHTML = `
        <button class="nav-tab ${isDashboard ? 'active' : ''}" id="nav-chw-dashboard" onclick="window.app.switchRole('chw'); window.chwToolkit.switchView('dashboard');">
          <span>Dashboard</span>
        </button>
        <button class="nav-tab ${isCaseload ? 'active' : ''}" id="nav-chw-caseload" onclick="window.app.switchRole('chw'); window.chwToolkit.switchView('caseload');">
          <span>Mga Bata</span>
        </button>
        <button class="nav-tab ${isParents ? 'active' : ''}" id="nav-chw-parents" onclick="window.app.switchRole('chw'); window.chwToolkit.switchView('parents');">
          <span>Magulang</span>
        </button>
        <button class="nav-tab" id="nav-chw-inbox" onclick="window.chwToolkit.openBhwInboxModal()">
          <span>Inbox</span>
          ${unreadCount > 0 ? `<span class="nav-badge-pill">${unreadCount}</span>` : ''}
        </button>
        <button class="nav-tab" onclick="window.app.logout()" style="color:var(--danger-sam);">
          <span>Lumabas</span>
        </button>
      `;
    }
  }

  switchRole(role, notify = true) {
    this.currentRole = role;

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });

    const activeNavTab = role === 'parent' ? document.getElementById('nav-parent-home') :
                         (role === 'chw' ? (window.chwToolkit && window.chwToolkit.activeView === 'caseload' ? document.getElementById('nav-chw-caseload') : document.getElementById('nav-chw-dashboard')) : document.getElementById('nav-chw-reports'));
    if (activeNavTab) activeNavTab.classList.add('active');

    const parentView = document.getElementById('parent-view');
    const chwView = document.getElementById('chw-view');
    const supervisorView = document.getElementById('supervisor-view');

    if (parentView) parentView.style.display = role === 'parent' ? 'block' : 'none';
    if (chwView) chwView.style.display = role === 'chw' ? 'block' : 'none';
    if (supervisorView) supervisorView.style.display = role === 'supervisor' ? 'block' : 'none';

    if (role === 'parent') {
      window.parentPortal.init();
    } else if (role === 'chw') {
      window.chwToolkit.init();
    } else if (role === 'supervisor') {
      window.supervisorDashboard.init();
    }

    if (notify) {
      const roleTitles = {
        'parent': 'Hub ng Magulang',
        'chw': 'Dashboard ng BHW',
        'supervisor': 'Pagsubaybay sa Malnutrisyon'
      };
      this.showToast(`Lumipat sa ${roleTitles[role]}`, 'info');
    }
  }

  openCertificateModal(childId) {
    const child = window.storageService.getChildById(childId);
    if (!child) return;

    const gradDate = child.graduationDate || child.lastVisitDate || new Date().toISOString().split('T')[0];
    const serial = child.certificateSerial || 'CERT-PAOLBO-' + child.id.toUpperCase();

    this.showModal(`
      <div class="certificate-card" id="printable-certificate">
        <div class="certificate-org">Republika ng Pilipinas • Kagawaran ng Kalusugan</div>
        <div style="font-size:0.7rem; color:#0d9488; font-weight:800; text-transform:uppercase; margin-top:2px;">
          Bayan ng Calabanga • Barangay Paolbo • Rural Health Unit (RHU) Calabanga
        </div>
        
        <h2 class="certificate-title">Katibayan ng Ganap na Pagbuti at Kalusugan</h2>
        <div class="certificate-subtitle">OPISYAL NA PAGTATAPOS SA PROGRAMA NG NUTRISYON</div>

        <div class="certificate-recipient-label">Ang katibayang ito ay buong karangalang iginagawad kay:</div>
        <div class="certificate-child-name">${child.name}</div>
        <div style="font-size:0.8rem; font-weight:700; color:#0f766e; margin-bottom:8px;">
          Magulang: ${child.parentName} • ${child.community || 'Barangay Paolbo, Calabanga'}
        </div>

        <p class="certificate-body-text">
          Dahil sa ipinakitang pambihirang pagbawi mula sa malnutrisyon sa pamamagitan ng masugid na pagsunod sa <strong>4-Star Balanced Diet</strong>, wastong pagpapakain, at regular na pagpapatingin sa <strong>Barangay Health Worker (BHW)</strong> ng Barangay Paolbo.
        </p>

        <div class="certificate-metrics-grid">
          <div>
            <div class="cert-metric-label">Panimulang Timbang</div>
            <div class="cert-metric-val">${child.initialWeight} kg</div>
          </div>
          <div>
            <div class="cert-metric-label">Timbang ng Pagbuti</div>
            <div class="cert-metric-val">${child.currentWeight} kg</div>
          </div>
          <div>
            <div class="cert-metric-label">Sukat ng Braso (MUAC)</div>
            <div class="cert-metric-val" style="color:#047857;">${child.currentMuac} mm (Normal)</div>
          </div>
        </div>

        <div class="certificate-footer-signatures">
          <div class="cert-sig-line">
            <div class="cert-sig-name">${child.chwAssigned}</div>
            <div class="cert-sig-title">Barangay Health Worker (BHW)</div>
          </div>
          <div class="cert-sig-line">
            <div class="cert-sig-name">Dr. Evelyn Morales, MHO</div>
            <div class="cert-sig-title">Municipal Health Officer, Calabanga</div>
          </div>
        </div>

        <div class="certificate-serial">
          Petsa: <strong>${gradDate}</strong> • Serye: <strong>${serial}</strong>
        </div>

        <div style="font-size:0.65rem; color:#94a3b8; text-align:center; margin-top:8px;">
          NutriLearn System • Credits to the Owner • Developed by <strong>NEXORA</strong>
        </div>
      </div>

      <div style="display:flex; gap:8px; margin-top:14px;">
        <button class="btn btn-primary btn-block" onclick="window.print()">
          I-print / I-save bilang PDF
        </button>
        <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">
          Isara
        </button>
      </div>
    `);
  }

  openLessonsModal() {
    const modules = window.storageService.getModules();
    const myChildren = window.storageService.getChildrenForCurrentUser();
    const child = myChildren[0] || {};
    const completed = child.completedModules || [];

    this.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:4px;">Mga Aralin sa Nutrisyon</h2>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">Pumili ng aralin upang basahin at pakinggan ang boses na gabay:</p>

      <div class="module-grid">
        ${modules.map(mod => {
          const isDone = completed.includes(mod.id);
          return `
            <div class="module-card" onclick="window.app.closeModal(); window.parentPortal.openModule('${mod.id}');">
              <div class="module-icon-box" style="font-weight:800; font-size:0.9rem; color:var(--primary);">${mod.icon}</div>
              <div class="module-info">
                <div class="module-tag">${mod.category}</div>
                <h4 class="module-title">${mod.title}</h4>
                <div class="module-meta">
                  <span>${mod.duration}</span>
                  <span style="color:${isDone ? 'var(--secondary)' : 'var(--accent-warm)'}; font-weight:700;">
                    ${isDone ? 'Natapos Na' : 'Simulan'}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn btn-secondary btn-block" style="margin-top:12px;" onclick="window.app.closeModal()">Isara</button>
    `);
  }

  openParentProfileModal() {
    const currentUser = window.storageService.getCurrentUser() || { name: 'Magulang', phone: 'N/A', community: 'Barangay Paolbo, Calabanga' };
    const myChildren = window.storageService.getChildrenForCurrentUser();

    this.showModal(`
      <div style="text-align:center; margin-bottom:14px;">
        <h2 style="font-size:1.2rem; font-weight:800;">${currentUser.name}</h2>
        <div style="font-size:0.8rem; color:var(--text-muted);">${currentUser.community || 'Barangay Paolbo, Calabanga'} • Telepono: ${currentUser.phone}</div>
      </div>

      <div class="card" style="margin-bottom:12px;">
        <div class="card-header">
          <h3 class="card-title">Aking mga Rehistradong Bata</h3>
        </div>
        ${myChildren.length === 0 ? `
          <div style="font-size:0.78rem; color:var(--text-muted); text-align:center; padding:10px;">
            Walang nakatalagang bata. Ang inyong BHW sa Barangay Paolbo ang magpapasok at mag-sync ng profile ng inyong anak.
          </div>
        ` : myChildren.map(c => `
          <div style="padding:8px 0; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>${c.name}</strong> (Edad: ${window.formatChildAge ? window.formatChildAge(c.ageMonths) : c.ageMonths + ' buwan'}, ${c.gender})
              <div style="font-size:0.75rem; color:var(--text-muted);">Timbang: ${c.currentWeight}kg • Katayuan: ${c.status}</div>
            </div>
            <div style="display:flex; gap:4px;">
              ${c.status === 'RECOVERED' ? `
                <button class="btn btn-sm btn-success" onclick="window.app.openCertificateModal('${c.id}')">Sertipiko</button>
              ` : ''}
              <button class="btn btn-sm btn-outline-primary" onclick="window.app.selectChild('${c.id}')">Tingnan</button>
              <button class="btn btn-sm btn-danger" onclick="window.parentPortal.openDeleteChildModal('${c.id}')" title="Burahin ang Profile ng Bata">Burahin</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn btn-danger btn-block" onclick="window.parentPortal.openDeleteParentAccountModal()">
          Burahin ang Aking Account
        </button>
        <button class="btn btn-secondary btn-block" onclick="window.app.closeModal(); window.app.logout();">
          Mag-sign Out
        </button>
      </div>
    `);
  }

  openAccountManagerModal() {
    const users = window.storageService.getUsers();
    const chws = users.filter(u => u.role === 'chw' || u.role === 'supervisor');
    const parents = users.filter(u => u.role === 'parent');

    this.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:6px;">Pamamahala ng mga Account</h2>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
        Burahin ang mga duplicate o lumang account sa Barangay Paolbo:
      </p>

      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.85rem; font-weight:800; color:var(--primary); margin-bottom:6px;">Barangay Health Workers (${chws.length})</h4>
        <div style="max-height:140px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
          ${chws.map(u => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:6px 10px; border-radius:6px; font-size:0.78rem; border:1px solid #e2e8f0;">
              <div>
                <strong>${u.name}</strong> (${u.title || 'BHW'})
                <div style="font-size:0.7rem; color:var(--text-muted);">User: ${u.username || u.phone}</div>
              </div>
              <button class="btn btn-sm btn-danger" onclick="window.app.handleDeleteUser('${u.id}', '${u.name}')">Burahin</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.85rem; font-weight:800; color:var(--secondary-dark); margin-bottom:6px;">Mga Magulang / Tagapag-alaga (${parents.length})</h4>
        <div style="max-height:140px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
          ${parents.map(u => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:6px 10px; border-radius:6px; font-size:0.78rem; border:1px solid #e2e8f0;">
              <div>
                <strong>${u.name}</strong>
                <div style="font-size:0.7rem; color:var(--text-muted);">${u.community} • User: ${u.username || u.phone}</div>
              </div>
              <button class="btn btn-sm btn-danger" onclick="window.app.handleDeleteUser('${u.id}', '${u.name}')">Burahin</button>
            </div>
          `).join('')}
        </div>
      </div>

      <button class="btn btn-secondary btn-block" onclick="window.app.closeModal()">Isara</button>
    `);
  }

  handleDeleteUser(userId, userName) {
    if (confirm(`Sigurado ka bang nais mong tuluyang burahin ang account para kay ${userName}?`)) {
      window.storageService.deleteUser(userId);
      this.openAccountManagerModal();
      this.showToast(`Nabura ang account para kay ${userName}.`, 'info');
    }
  }

  openChildSwitcher() {
    const children = window.storageService.getChildrenForCurrentUser();
    const currentId = window.storageService.getSelectedChildId();

    this.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">Piliin ang Profile ng Bata</h2>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${children.map(c => `
          <div class="caseload-item" style="cursor:pointer; border-color:${c.id === currentId ? 'var(--primary)' : 'var(--border-light)'}; background:${c.id === currentId ? 'var(--primary-soft)' : '#fff'};" onclick="window.app.selectChild('${c.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${c.name}</strong> (Edad: ${window.formatChildAge ? window.formatChildAge(c.ageMonths) : c.ageMonths + ' buwan'})
                <div style="font-size:0.75rem; color:var(--text-muted);">Magulang: ${c.parentName} • ${c.community}</div>
              </div>
              <span class="badge-status ${c.status === 'RECOVERED' ? 'badge-recovered' : (c.status === 'SAM' ? 'badge-sam' : 'badge-mam')}">
                ${c.status}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-block" style="margin-top:12px;" onclick="window.app.closeModal()">Isara</button>
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
    this.showToast(`Binuksan ang profile para kay ${child.name}.`, 'success');
  }

  showModal(htmlContent) {
    if (!this.modalOverlay || !this.modalBody) return;
    this.modalBody.innerHTML = htmlContent;
    this.modalOverlay.classList.add('open');
  }

  closeModal() {
    if (!this.modalOverlay) return;
    this.modalOverlay.classList.remove('open');
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fil-PH';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      this.showToast('Pinatutugtog ang boses na gabay...', 'info');
    } else {
      this.showToast('Hindi sinusuportahan ang speech synthesis sa device na ito.', 'warning');
    }
  }

  openSettings() {
    const currentUser = window.storageService.getCurrentUser();
    this.showModal(`
      <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:8px;">Mga Setting ng NutriLearn Calabanga</h2>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
        NutriLearn v1.0.0 • Naka-log in bilang <strong>${currentUser ? currentUser.name : 'Bisita'}</strong>.<br>
        <span style="color:var(--primary); font-weight:700;">Bayan ng Calabanga • Barangay Paolbo</span>
      </p>

      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
        <button class="btn btn-secondary btn-block" onclick="window.app.openAccountManagerModal()">
          Pamahalaan ang mga Account
        </button>

        <button class="btn btn-outline-primary btn-block" onclick="window.supervisorDashboard.generateOfficialReport()">
          Tingnan ang Opisyal na Ulat ng Malnutrisyon
        </button>

        <button class="btn btn-danger btn-block" onclick="window.storageService.clearAllData(); window.app.closeModal(); window.app.checkAuthState(); window.app.showToast('Nalinis ang lahat ng datos. Handa na para sa bagong rehistrasyon at sign in.', 'info');">
          Linisin ang Lahat ng Datos (Clear All Data)
        </button>
      </div>

      <!-- Developer & Owner Credits -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:12px; text-align:center;">
        <div style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:700;">Tagapaglinang ng Sistema (Developer)</div>
        <div style="font-size:1.1rem; font-weight:900; color:var(--primary); letter-spacing:1px; margin:2px 0;">NEXORA</div>
        <div style="font-size:0.75rem; color:var(--text-main); font-weight:600;">Credits to the Owner & Developer: NEXORA</div>
        <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">Binuo para sa Bayan ng Calabanga at Barangay Paolbo</div>
      </div>

      <div style="font-size:0.72rem; color:var(--text-muted); text-align:center;">
        Department of Health (DOH) • National Nutrition Council (NNC)
      </div>
    `);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
