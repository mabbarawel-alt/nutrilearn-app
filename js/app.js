// ==========================================================================
// NUTRILEARN - MAIN APPLICATION CONTROLLER
// State Management, Role Navigation, Modals, PWA & APK Downloads
// ==========================================================================

const NutriApp = {
  currentRole: 'parent',
  currentAuthRole: 'parent',
  currentAuthMode: 'signin',
  portalAction: 'signin',
  deferredInstallPrompt: null,

  init() {
    console.log('🌱 Initializing NutriLearn App...');
    NutriStorage.init();

    this.registerServiceWorker();
    this.bindGlobalEvents();
    this.checkUrlParams();

    // Initialize modules
    ParentModule.init();
    CHWModule.init();
    MHODashboard.init();
    if (window.AnnouncementsModule) {
      AnnouncementsModule.init();
    }

    // The selection of User Portal and Sign In appears immediately before using the system!
    this.showStartupScreen();
  },

  // Show Startup Authentication Gateway (Hides app workspace)
  // Show Startup Authentication Gateway (Opens on Part 1: Portal Selection)
  showStartupScreen() {
    const startupScreen = document.getElementById('startup-auth-screen');
    const workspace = document.getElementById('app-workspace');
    if (startupScreen) {
      startupScreen.style.display = 'flex';
      document.body.style.overflow = 'auto';
    }
    if (workspace) {
      workspace.style.display = 'none';
    }
    this.setStartupPhase(1);
  },

  // Switch between Phase 1 (Portal Selection), Phase 2 (Sign In only), and Phase 3 (Sign Up only)
  setStartupPhase(phase) {
    const part1 = document.getElementById('startup-part-1');
    const phaseSignin = document.getElementById('startup-phase-signin');
    const phaseSignup = document.getElementById('startup-phase-signup');

    if (phase === 1 || phase === 'role-select') {
      if (part1) part1.style.display = 'block';
      if (phaseSignin) phaseSignin.style.display = 'none';
      if (phaseSignup) phaseSignup.style.display = 'none';
      this.selectStartupRoleCard(this.currentAuthRole || 'parent');
      this.portalAction = 'signin';
      this.currentAuthMode = 'signin';
      this.setPortalAction(this.portalAction);
    } else if (phase === 2 || phase === 'signin') {
      if (part1) part1.style.display = 'none';
      if (phaseSignin) phaseSignin.style.display = 'block';
      if (phaseSignup) phaseSignup.style.display = 'none';
      this.currentAuthMode = 'signin';
      this.portalAction = 'signin';
      this.updateStartupFormDisplay('signin');
    } else if (phase === 3 || phase === 'signup') {
      if (part1) part1.style.display = 'none';
      if (phaseSignin) phaseSignin.style.display = 'none';
      if (phaseSignup) phaseSignup.style.display = 'block';
      this.currentAuthMode = 'signup';
      this.portalAction = 'signup';
      this.updateStartupFormDisplay('signup');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Set Portal Action on Phase 1 (Toggle between Sign In and Sign Up)
  setPortalAction(action) {
    this.portalAction = action;
    const tabSignin = document.getElementById('tab-portal-signin');
    const tabSignup = document.getElementById('tab-portal-signup');
    const continueBtn = document.getElementById('btn-portal-continue');
    const footerLink = document.getElementById('portal-footer-link');

    if (tabSignin) tabSignin.classList.toggle('active', action === 'signin');
    if (tabSignup) tabSignup.classList.toggle('active', action === 'signup');

    if (continueBtn) {
      continueBtn.textContent = action === 'signin' ? 'Continue to Sign In' : 'Continue to Sign Up';
    }

    if (footerLink) {
      if (action === 'signin') {
        footerLink.innerHTML = `Don't have an account? <a href="javascript:void(0)" onclick="NutriApp.setPortalAction('signup')">Sign up here</a>`;
      } else {
        footerLink.innerHTML = `Already have an account? <a href="javascript:void(0)" onclick="NutriApp.setPortalAction('signin')">Sign in here</a>`;
      }
    }
  },

  // Select a role card in Part 1 (radio selection matching screenshot)
  selectStartupRoleCard(role) {
    this.currentAuthRole = role;
    
    // Update visual active state on portal cards
    const cards = document.querySelectorAll('.portal-choice-card');
    cards.forEach(card => {
      const cardRole = card.getAttribute('data-role');
      if (cardRole === role) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  },

  // User clicks "Continue" -> proceed to Sign In or Sign Up based on selected action
  proceedWithSelectedRole() {
    if (this.portalAction === 'signup') {
      this.setStartupPhase('signup');
    } else {
      this.setStartupPhase('signin');
    }
  },

  // User clicks "Register here" -> proceed directly to dedicated Sign Up phase
  proceedToRegister() {
    this.setPortalAction('signup');
    this.setStartupPhase('signup');
  },

  // Direct choice and proceed (alias)
  choosePortalAndProceed(role) {
    this.selectStartupRoleCard(role);
    this.proceedWithSelectedRole();
  },

  selectStartupRole(role) {
    this.choosePortalAndProceed(role);
  },

  // Hide Startup Authentication Gateway (Shows app workspace after successful login)
  hideStartupScreen() {
    const startupScreen = document.getElementById('startup-auth-screen');
    const workspace = document.getElementById('app-workspace');
    if (startupScreen) {
      startupScreen.style.display = 'none';
      document.body.style.overflow = '';
    }
    if (workspace) {
      workspace.style.display = 'block';
    }
  },

  // Update Startup Form Banner and Fields based on chosen portal
  updateStartupFormDisplay(mode = 'signin') {
    const titles = {
      parent: 'Parent / Guardian',
      chw: 'Health Worker',
      mho: 'Administrator'
    };
    const demoNames = {
      parent: 'Maria Ramos (Parent)',
      chw: 'Sister Teresa Lim (Health Worker)',
      mho: 'Dr. Elena Cruz (Administrator)'
    };
    const defaultEmails = {
      parent: 'maria.parent@nutrilearn.ph',
      chw: 'teresa.bhw@nutrilearn.ph',
      mho: 'admin.mho@nutrilearn.ph'
    };

    const signinTitle = document.getElementById('startup-signin-role-title');
    const signupTitle = document.getElementById('startup-signup-role-title');
    const demoBtn = document.getElementById('btn-startup-demo-login');
    const emailInput = document.getElementById('startup-login-username');
    const submitBtn = document.getElementById('btn-startup-submit-signin');

    if (signinTitle) signinTitle.textContent = titles[this.currentAuthRole] || 'User Portal';
    if (signupTitle) signupTitle.textContent = titles[this.currentAuthRole] || 'User Portal';
    if (demoBtn) demoBtn.innerHTML = `Demo Login as <strong>${demoNames[this.currentAuthRole] || 'Demo User'}</strong>`;
    if (emailInput) emailInput.value = defaultEmails[this.currentAuthRole] || '';
    if (submitBtn) submitBtn.textContent = 'Sign In';

    // Show/hide role specific registration fields in sign-up phase
    const parentFields = document.getElementById('startup-signup-parent');
    const bhwFields = document.getElementById('startup-signup-bhw');
    const mhoFields = document.getElementById('startup-signup-mho');

    if (parentFields) parentFields.style.display = this.currentAuthRole === 'parent' ? 'block' : 'none';
    if (bhwFields) bhwFields.style.display = this.currentAuthRole === 'chw' ? 'block' : 'none';
    if (mhoFields) mhoFields.style.display = this.currentAuthRole === 'mho' ? 'block' : 'none';
  },

  // Submit Startup Sign In
  submitStartupSignIn(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('startup-signin-form');
    if (!form) return;

    const emailOrName = form.elements['loginUsername'].value;
    const password = form.elements['loginPassword'].value;

    const result = NutriStorage.loginUser(emailOrName, password, this.currentAuthRole);
    if (result.success) {
      this.hideStartupScreen();
      this.switchRole(result.user.role);
      this.updateUserHeaderBadge();
      this.showToast(`👋 Welcome, ${result.user.name}! Portal unlocked.`, 'success');
    } else {
      this.showToast(result.message, 'warning');
    }
  },

  // Submit Startup Sign Up
  submitStartupSignUp(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('startup-signup-form');
    if (!form) return;

    const name = form.elements['regName'].value.trim();
    const email = form.elements['regEmail'].value.trim();
    const password = form.elements['regPassword'].value;

    if (!name || !email || !password) {
      this.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: this.currentAuthRole
    };

    if (this.currentAuthRole === 'parent') {
      userData.childName = form.elements['regChildName']?.value.trim() || '';
      userData.childAge = parseInt(form.elements['regChildAge']?.value || '12', 10);
      userData.barangay = form.elements['regBarangay']?.value || 'Barangay San Jose';
    } else if (this.currentAuthRole === 'chw') {
      userData.bhwId = form.elements['regBhwId']?.value.trim() || 'BHW-' + Math.floor(1000 + Math.random() * 9000);
      userData.barangay = form.elements['regBhwBarangay']?.value || 'Barangay San Jose';
    } else if (this.currentAuthRole === 'mho') {
      userData.department = form.elements['regMhoDept']?.value.trim() || 'Municipal Health Office';
      userData.designation = form.elements['regMhoDesignation']?.value.trim() || 'Nutrition Officer';
    }

    const newUser = NutriStorage.registerUser(userData);
    this.hideStartupScreen();
    this.switchRole(newUser.role);
    this.updateUserHeaderBadge();
    this.showToast(`🎉 Registration successful! Welcome to NutriLearn, ${newUser.name}.`, 'success');
  },

  // 1-Click Instant Demo Login on Startup Screen
  startupQuickDemoLogin() {
    const users = NutriStorage.getUsers();
    const user = users.find(u => u.role === this.currentAuthRole);
    if (user) {
      NutriStorage.setCurrentUser(user);
      this.hideStartupScreen();
      this.switchRole(user.role);
      this.updateUserHeaderBadge();
      this.showToast(`✨ Signed in as ${user.name} (${user.role.toUpperCase()})`, 'success');
    }
  },

  // Sign Out / Logout - Enforces return to Startup Gate
  logout() {
    NutriStorage.setCurrentUser(null);
    this.updateUserHeaderBadge();

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sub-nav').forEach(nav => nav.style.display = 'none');

    this.showStartupScreen();
    this.showToast('You have signed out. Please choose your portal and sign in to continue.', 'info');
  },

  // Service Worker Registration for PWA & Offline Access
  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('✓ Service Worker Registered successfully:', reg.scope))
        .catch((err) => console.warn('Service Worker registration note:', err.message));
    }
  },

  // Check URL parameters for direct role access (?role=chw or ?role=mho)
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam && ['parent', 'chw', 'mho'].includes(roleParam)) {
      this.currentRole = roleParam;
    }
  },

  // Bind Global Navigation & Modal Events
  bindGlobalEvents() {
    // Sub-nav links for parent view
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchParentSubTab(tab);
      });
    });

    // Sub-nav links for CHW view
    document.querySelectorAll('.chw-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchCHWSubTab(tab);
      });
    });

    // Sub-nav links for MHO view
    document.querySelectorAll('.mho-sub-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchMHOSubTab(tab);
      });
    });

    // Modal backdrop click to close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // PWA Install prompt capture
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBtn = document.getElementById('btn-pwa-install');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });
  },

  // Switch Stakeholder Role & Isolate Features
  switchRole(role) {
    this.currentRole = role;

    // Toggle Main View Sections: Show ONLY the active portal
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSection = document.getElementById(`view-${role}`);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Toggle Sub-Navigation Bars: Show ONLY the active portal sub-nav
    const parentSubNav = document.getElementById('parent-sub-nav');
    const chwSubNav = document.getElementById('chw-sub-nav');
    const mhoSubNav = document.getElementById('mho-sub-nav');

    if (parentSubNav) parentSubNav.style.display = role === 'parent' ? 'block' : 'none';
    if (chwSubNav) chwSubNav.style.display = role === 'chw' ? 'block' : 'none';
    if (mhoSubNav) mhoSubNav.style.display = role === 'mho' ? 'block' : 'none';

    // Update Header Active Portal Pill
    const pillIcon = document.getElementById('active-portal-icon');
    const pillTitle = document.getElementById('active-portal-title');
    const pillTag = document.getElementById('active-portal-tag');

    const portalMeta = {
      parent: { icon: '👨‍👩‍👧', title: 'Parent Portal', tag: 'Family Care' },
      chw: { icon: '🩺', title: 'BHW Tools', tag: 'Field Operations' },
      mho: { icon: '🏛️', title: 'MHO Executive Console', tag: 'Administration' }
    };

    if (pillIcon) pillIcon.textContent = portalMeta[role]?.icon || '🌱';
    if (pillTitle) pillTitle.textContent = portalMeta[role]?.title || 'NutriLearn';
    if (pillTag) pillTag.textContent = portalMeta[role]?.tag || 'Community Health';

    // Initialize or Refresh views
    if (role === 'chw') {
      CHWModule.renderRegistryTable();
      CHWModule.updateStatsBar();
      this.switchCHWSubTab('dashboard');
    } else if (role === 'mho') {
      MHODashboard.init();
      this.switchMHOSubTab('dashboard');
    } else if (role === 'parent') {
      ParentModule.renderModuleCards();
      ParentModule.updateProgressHeader();
      this.switchParentSubTab('dashboard');
    }

    if (window.AnnouncementsModule) {
      AnnouncementsModule.renderAllFeeds();
      AnnouncementsModule.renderDashboardWidgets();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Switch Sub-tabs in MHO View
  switchMHOSubTab(tabName) {
    document.querySelectorAll('.mho-sub-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    document.querySelectorAll('.mho-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },

  // Authentication: Open Modal (Phase 1: role-choice, or Phase 2: form)
  openAuthModal(phase = 'role-choice', role = null) {
    if (role) {
      this.currentAuthRole = role;
    }
    this.setAuthPhase(phase);
    this.openModal('modal-auth');
  },

  // Set Auth Phase: 'role-choice' or 'form'
  setAuthPhase(phase) {
    const choiceSection = document.getElementById('auth-phase-role-choice');
    const formSection = document.getElementById('auth-phase-form');
    
    if (phase === 'role-choice') {
      if (choiceSection) choiceSection.style.display = 'block';
      if (formSection) formSection.style.display = 'none';
      const titleElem = document.getElementById('auth-modal-title');
      if (titleElem) titleElem.textContent = 'Choose Your User Portal';
    } else {
      if (choiceSection) choiceSection.style.display = 'none';
      if (formSection) formSection.style.display = 'block';
      const titleElem = document.getElementById('auth-modal-title');
      if (titleElem) titleElem.textContent = 'Sign In / Sign Up';
      this.updateAuthFormDisplay();
    }
  },

  // Step 1: User picks one of 3 roles (Parent, BHW, Administrator)
  selectAuthRole(role) {
    this.currentAuthRole = role;
    this.setAuthPhase('form');
  },

  // Step 2: Switch between Sign In and Sign Up tabs
  switchAuthMode(mode) {
    this.currentAuthMode = mode;
    
    const signinTabBtn = document.getElementById('tab-btn-signin');
    const signupTabBtn = document.getElementById('tab-btn-signup');
    const signinForm = document.getElementById('auth-signin-form');
    const signupForm = document.getElementById('auth-signup-form');

    if (signinTabBtn) signinTabBtn.classList.toggle('active', mode === 'signin');
    if (signupTabBtn) signupTabBtn.classList.toggle('active', mode === 'signup');
    if (signinForm) signinForm.style.display = mode === 'signin' ? 'block' : 'none';
    if (signupForm) signupForm.style.display = mode === 'signup' ? 'block' : 'none';
  },

  // Update Auth Form UI based on chosen role
  updateAuthFormDisplay() {
    const roleTitles = {
      parent: 'Parent Portal',
      chw: 'BHW Portal',
      mho: 'Administrator Portal'
    };

    const roleTag = document.getElementById('auth-current-role-tag');
    const roleIcon = document.getElementById('auth-current-role-icon');
    if (roleTag) roleTag.textContent = roleTitles[this.currentAuthRole] || 'Portal';
    if (roleIcon) roleIcon.textContent = '';

    // Show/hide role specific signup fields
    const parentFields = document.getElementById('signup-fields-parent');
    const bhwFields = document.getElementById('signup-fields-bhw');
    const mhoFields = document.getElementById('signup-fields-mho');

    if (parentFields) parentFields.style.display = this.currentAuthRole === 'parent' ? 'block' : 'none';
    if (bhwFields) bhwFields.style.display = this.currentAuthRole === 'chw' ? 'block' : 'none';
    if (mhoFields) mhoFields.style.display = this.currentAuthRole === 'mho' ? 'block' : 'none';

    // Update Quick Demo Login Label
    const demoBtn = document.getElementById('btn-quick-demo-login');
    if (demoBtn) {
      const demoNames = {
        parent: 'Maria Ramos (Parent)',
        chw: 'Sister Teresa Lim (BHW)',
        mho: 'Dr. Elena Cruz (Admin)'
      };
      demoBtn.innerHTML = `Demo Login as <strong>${demoNames[this.currentAuthRole] || 'User'}</strong>`;
    }

    // Default to signin mode
    this.switchAuthMode('signin');
  },

  // Handle Sign In submission
  submitSignIn(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('auth-signin-form');
    if (!form) return;

    const emailOrName = form.elements['loginUsername'].value;
    const password = form.elements['loginPassword'].value;

    const result = NutriStorage.loginUser(emailOrName, password, this.currentAuthRole);
    if (result.success) {
      this.closeModal('modal-auth');
      this.switchRole(result.user.role);
      this.updateUserHeaderBadge();
      this.showToast(`👋 Welcome back, ${result.user.name}!`, 'success');
    } else {
      this.showToast(result.message, 'warning');
    }
  },

  // Handle Sign Up registration
  submitSignUp(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('auth-signup-form');
    if (!form) return;

    const name = form.elements['regName'].value.trim();
    const email = form.elements['regEmail'].value.trim();
    const password = form.elements['regPassword'].value;

    if (!name || !email || !password) {
      this.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: this.currentAuthRole
    };

    if (this.currentAuthRole === 'parent') {
      userData.childName = form.elements['regChildName']?.value.trim() || '';
      userData.childAge = parseInt(form.elements['regChildAge']?.value || '12', 10);
      userData.barangay = form.elements['regBarangay']?.value || 'Barangay San Jose';
    } else if (this.currentAuthRole === 'chw') {
      userData.bhwId = form.elements['regBhwId']?.value.trim() || 'BHW-' + Math.floor(1000 + Math.random() * 9000);
      userData.barangay = form.elements['regBhwBarangay']?.value || 'Barangay San Jose';
    } else if (this.currentAuthRole === 'mho') {
      userData.department = form.elements['regMhoDept']?.value.trim() || 'Municipal Health Office';
      userData.designation = form.elements['regMhoDesignation']?.value.trim() || 'Health Officer';
    }

    const newUser = NutriStorage.registerUser(userData);
    this.closeModal('modal-auth');
    this.switchRole(newUser.role);
    this.updateUserHeaderBadge();
    this.showToast(`🎉 Registration successful! Welcome to NutriLearn, ${newUser.name}.`, 'success');
  },

  // One-click demo login
  quickDemoLogin(role = null) {
    const targetRole = role || this.currentAuthRole;
    const users = NutriStorage.getUsers();
    const user = users.find(u => u.role === targetRole);
    if (user) {
      NutriStorage.setCurrentUser(user);
      this.closeModal('modal-auth');
      this.switchRole(user.role);
      this.updateUserHeaderBadge();
      this.showToast(`✨ Signed in as ${user.name} (${user.role.toUpperCase()})`, 'success');
    }
  },

  // Update Header User Profile details
  updateUserHeaderBadge() {
    const user = NutriStorage.getCurrentUser();
    const nameElem = document.getElementById('header-user-name');
    const roleElem = document.getElementById('header-user-role');
    const avatarElem = document.getElementById('header-user-avatar');

    if (!user) {
      if (nameElem) nameElem.textContent = 'Sign In';
      if (roleElem) roleElem.textContent = 'Select Role';
      if (avatarElem) avatarElem.textContent = '?';
      return;
    }

    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    const roleLabels = {
      parent: 'Parent',
      chw: 'BHW / BNS',
      mho: 'Administrator'
    };

    if (nameElem) nameElem.textContent = user.name;
    if (roleElem) roleElem.textContent = roleLabels[user.role] || user.role;
    if (avatarElem) avatarElem.textContent = initials;
  },

  // Switch Sub-tabs in Parent View
  switchParentSubTab(tabName) {
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    document.querySelectorAll('.parent-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },

  // Switch Sub-tabs in CHW View
  switchCHWSubTab(tabName) {
    document.querySelectorAll('.chw-sub-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    document.querySelectorAll('.chw-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },

  // Modal Open / Close Handlers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    let container = document.getElementById('nutri-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'nutri-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#065F46' : type === 'warning' ? '#92400E' : '#0E3D26';
    toast.style.cssText = `
      background: ${bg};
      color: #FFFFFF;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: auto;
      animation: fadeIn 0.2s ease-out;
      border: 1px solid rgba(255,255,255,0.2);
    `;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  },

  // Trigger PWA Installation
  promptPWAInstall() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('NutriLearn added to your home screen/desktop!', 'success');
        }
        this.deferredInstallPrompt = null;
      });
    } else {
      this.openModal('modal-download-app');
    }
  },

  // Trigger Android APK Download
  downloadAndroidAPK() {
    const link = document.createElement('a');
    link.href = './NutriLearn.apk';
    link.download = 'NutriLearn.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('📥 Downloading NutriLearn.apk for Android...', 'success');
  },

  // Trigger Windows App Launcher Download
  downloadWindowsApp() {
    const link = document.createElement('a');
    link.href = './NutriLearn-Windows.bat';
    link.download = 'NutriLearn-Windows.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('📥 Downloading NutriLearn-Windows.bat desktop launcher...', 'success');
  }
};

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  NutriApp.init();
});
