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
    if (window.NutriI18n) {
      NutriI18n.init();
    }

    this.registerServiceWorker();
    this.bindGlobalEvents();
    this.initSubNavScroll();
    this.checkUrlParams();

    // Initialize modules
    ParentModule.init();
    CHWModule.init();
    MHODashboard.init();
    if (window.AnnouncementsModule) {
      AnnouncementsModule.init();
    }

    // Sync cloud database with local storage if configured
    if (typeof NutriStorage.syncWithSupabase === 'function') {
      NutriStorage.syncWithSupabase();
    }

    // The selection of User Portal and Sign In appears immediately before using the system!
    this.showStartupScreen();
  },

  // Show Startup Authentication Gateway
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
    this.goToRoleSelectSignIn();
  },

  // Hide Startup Authentication Gateway
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

  // Switch between the 4 screens
  switchAuthScreen(screenId) {
    ['screen-role-signin', 'screen-role-signup', 'screen-auth-details', 'screen-auth-signin'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === screenId) ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Screen 1: Select role to continue (Sign In Flow)
  goToRoleSelectSignIn() {
    this.portalAction = 'signin';
    this.switchAuthScreen('screen-role-signin');
    this.updateRoleCardSelection('signin', this.currentAuthRole || 'parent');
  },

  // Screen 2: Create account - Who are you registering as? (Sign Up Flow)
  goToRoleSelectSignUp() {
    this.portalAction = 'signup';
    this.switchAuthScreen('screen-role-signup');
    this.updateRoleCardSelection('signup', this.currentAuthRole || 'parent');
  },

  // User clicks a role card on Screen 1 or Screen 2
  selectRole(role, context) {
    this.currentAuthRole = role;
    this.updateRoleCardSelection(context || 'signin', role);
  },

  updateRoleCardSelection(context, role) {
    const screenId = context === 'signup' ? 'screen-role-signup' : 'screen-role-signin';
    const container = document.getElementById(screenId);
    if (!container) return;

    const cards = container.querySelectorAll('.portal-choice-card');
    cards.forEach(card => {
      const cardRole = card.getAttribute('data-role');
      card.classList.toggle('selected', cardRole === role);
    });
  },

  // Screen 1 Continue clicked -> Proceed to Screen 4 (Sign In Credentials)
  proceedToSignInCredentials() {
    const role = this.currentAuthRole || 'parent';
    this.switchAuthScreen('screen-auth-signin');

    const roleNames = {
      parent: { en: 'Parent / Guardian', fil: 'Magulang / Tagapag-alaga', icon: '👩‍👧' },
      chw: { en: 'Health Worker', fil: 'Manggagawa sa Kalusugan (BHW)', icon: '🩺' },
      mho: { en: 'Administrator', fil: 'Administrator (MHO)', icon: '📊' }
    };
    const info = roleNames[role] || roleNames.parent;
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';

    const badgeIcon = document.getElementById('signin-badge-icon');
    const badgeTitle = document.getElementById('signin-badge-title');
    const badgeSub = document.getElementById('signin-badge-sub');
    const emailInput = document.getElementById('input-signin-email');
    const passInput = document.getElementById('input-signin-password');

    if (badgeIcon) badgeIcon.textContent = info.icon;
    if (badgeTitle) badgeTitle.textContent = isFil ? info.fil : info.en;
    if (badgeSub) badgeSub.textContent = isFil ? 'Pumapasok bilang' : 'Signing in as';
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
  },

  // Screen 2 Continue clicked -> Proceed to Screen 3 (Your Details Registration Form)
  proceedToSignUpDetails() {
    const role = this.currentAuthRole || 'parent';
    this.switchAuthScreen('screen-auth-details');

    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const btnSubmit = document.getElementById('btn-details-submit');
    if (btnSubmit) {
      if (role === 'parent') {
        btnSubmit.textContent = isFil ? 'Kasunod: Magdagdag ng Bata →' : 'Next: Add Children →';
      } else {
        btnSubmit.textContent = isFil ? 'Kumpletuhin ang Pagrehistro →' : 'Create Account →';
      }
    }
  },

  // Submit Sign In (Screen 4 & Modal)
  submitSignIn(event) {
    if (event) event.preventDefault();
    const screenForm = document.getElementById('form-auth-signin');
    const modalForm = document.getElementById('auth-signin-form');

    let email = '';
    let password = '';

    if (screenForm && screenForm.elements['signinEmail']) {
      email = (screenForm.elements['signinEmail'].value || '').trim();
      password = screenForm.elements['signinPassword'] ? screenForm.elements['signinPassword'].value : '';
    } else if (modalForm && modalForm.elements['loginUsername']) {
      email = (modalForm.elements['loginUsername'].value || '').trim();
      password = modalForm.elements['loginPassword'] ? modalForm.elements['loginPassword'].value : '';
    }

    if (!email || !password) {
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      this.showToast(isFil ? 'Pakilagay ang email at password.' : 'Please enter your email and password.', 'warning');
      return;
    }

    const result = NutriStorage.loginUser(email, password, this.currentAuthRole || 'parent');
    if (result.success) {
      this.hideStartupScreen();
      this.closeModal('modal-auth');
      this.switchRole(result.user.role);
      this.updateUserHeaderBadge();
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      const welcome = isFil
        ? `👋 Maligayang pagdating, ${result.user.name}! Naka-log in na.`
        : `👋 Welcome, ${result.user.name}! Portal unlocked.`;
      this.showToast(welcome, 'success');
    } else {
      this.showToast(result.message, 'warning');
    }
  },

  // Submit Registration (Screen 3)
  submitRegistration(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('form-auth-details');
    if (!form) return;

    const name = form.elements['regFullName'].value.trim();
    const barangay = form.elements['regBarangayAddress'].value.trim();
    const email = form.elements['regEmailAddress'].value.trim();
    const password = form.elements['regPassword'].value;
    const confirmPassword = form.elements['regConfirmPassword'].value;

    if (!name || !barangay || !email || !password) {
      this.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
      this.showToast(isFil ? 'Hindi magkatugma ang mga password.' : 'Passwords do not match.', 'warning');
      return;
    }

    const userData = {
      name,
      email,
      password,
      barangay,
      role: this.currentAuthRole || 'parent'
    };

    if (this.currentAuthRole === 'parent') {
      userData.childName = 'Ethan Santos';
      userData.childAge = 18;
    } else if (this.currentAuthRole === 'chw') {
      userData.bhwId = 'BHW-' + Math.floor(1000 + Math.random() * 9000);
    } else if (this.currentAuthRole === 'mho') {
      userData.department = 'Municipal Health Office';
      userData.designation = 'Nutrition Officer';
    }

    const newUser = NutriStorage.registerUser(userData);
    this.hideStartupScreen();
    this.switchRole(newUser.role);
    this.updateUserHeaderBadge();
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    const msg = isFil
      ? `🎉 Matagumpay na nakarehistro si ${newUser.name}!`
      : `🎉 Registration successful for ${newUser.name}!`;
    this.showToast(msg, 'success');
  },

  // Backward compatibility aliases
  setStartupPhase(phase) {
    if (phase === 1 || phase === 'role-select') {
      this.goToRoleSelectSignIn();
    } else if (phase === 2 || phase === 'signin') {
      this.proceedToSignInCredentials();
    } else if (phase === 3 || phase === 'signup') {
      this.proceedToSignUpDetails();
    }
  },
  proceedWithSelectedRole() {
    this.proceedToSignInCredentials();
  },
  proceedToRegister() {
    this.goToRoleSelectSignUp();
  },
  selectStartupRoleCard(role) {
    this.selectRole(role, 'signin');
  },
  setPortalAction(action) {
    if (action === 'signup') this.goToRoleSelectSignUp();
    else this.goToRoleSelectSignIn();
  },
  selectSignupRole(role) {
    this.selectRole(role, 'signup');
  },
  updateSignupRolePills() {},
  submitStartupSignIn(e) {
    this.submitSignIn(e);
  },
  submitStartupSignUp(e) {
    this.submitRegistration(e);
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
    const isFil = !window.NutriI18n || NutriI18n.currentLang === 'fil';
    
    const titles = isFil ? {
      parent: 'Magulang / Tagapag-alaga',
      chw: 'Manggagawa sa Kalusugan (BHW/BNS)',
      collector: 'Tagakolekta ng Datos sa Larangan',
      mho: 'Administrator (MHO)'
    } : {
      parent: 'Parent / Guardian',
      chw: 'Health Worker (BHW/BNS)',
      collector: 'Field Data Collector',
      mho: 'Administrator'
    };

    const signinTitle = document.getElementById('startup-signin-role-title');
    const signupTitle = document.getElementById('startup-signup-role-title');
    const emailInput = document.getElementById('startup-login-username');
    const submitBtn = document.getElementById('btn-startup-submit-signin');

    if (signinTitle) signinTitle.textContent = titles[this.currentAuthRole] || (isFil ? 'Portal ng Gumagamit' : 'User Portal');
    if (signupTitle) signupTitle.textContent = titles[this.currentAuthRole] || (isFil ? 'Portal ng Gumagamit' : 'User Portal');
    if (emailInput) emailInput.value = '';
    if (submitBtn) submitBtn.textContent = isFil ? 'Mag-sign In' : 'Sign In';

    // Show/hide role specific registration fields in sign-up phase
    const parentFields = document.getElementById('startup-signup-parent');
    const bhwFields = document.getElementById('startup-signup-bhw');
    const collectorFields = document.getElementById('startup-signup-collector');
    const mhoFields = document.getElementById('startup-signup-mho');

    if (parentFields) parentFields.style.display = this.currentAuthRole === 'parent' ? 'block' : 'none';
    if (bhwFields) bhwFields.style.display = this.currentAuthRole === 'chw' ? 'block' : 'none';
    if (collectorFields) collectorFields.style.display = this.currentAuthRole === 'collector' ? 'block' : 'none';
    if (mhoFields) mhoFields.style.display = this.currentAuthRole === 'mho' ? 'block' : 'none';

    // Synchronize role chooser pills in registration form
    this.updateSignupRolePills(this.currentAuthRole);
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
    } else if (this.currentAuthRole === 'collector') {
      userData.agency = form.elements['regCollectorAgency']?.value.trim() || 'Community Nutrition Survey Unit';
      userData.barangay = form.elements['regCollectorBarangay']?.value || 'Barangay San Jose';
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
    if ('serviceWorker' in navigator) {
      // In local development, unregister any stale service workers and clear cache
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (let reg of regs) {
            reg.unregister();
            console.log('🔄 [Dev Mode] Unregistered Service Worker to ensure fresh view');
          }
        });
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (let name of names) caches.delete(name);
          });
        }
        return;
      }

      if (window.location.protocol.startsWith('http')) {
        navigator.serviceWorker.register('./sw.js?v=2.7')
          .then((reg) => {
            reg.update();
            console.log('✓ Service Worker Registered successfully:', reg.scope);
          })
          .catch((err) => console.warn('Service Worker registration note:', err.message));
      }
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

    // Data Collector shares CHW tools with field data collector permissions
    const viewTargetId = role === 'collector' ? 'view-chw' : `view-${role}`;
    const activeSection = document.getElementById(viewTargetId);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Toggle Sub-Navigation Bars: Show ONLY the active portal sub-nav
    const parentSubNav = document.getElementById('parent-sub-nav');
    const chwSubNav = document.getElementById('chw-sub-nav');
    const mhoSubNav = document.getElementById('mho-sub-nav');

    if (parentSubNav) parentSubNav.style.display = role === 'parent' ? 'block' : 'none';
    if (chwSubNav) chwSubNav.style.display = (role === 'chw' || role === 'collector') ? 'block' : 'none';
    if (mhoSubNav) mhoSubNav.style.display = role === 'mho' ? 'block' : 'none';

    // Update Header Active Portal Pill
    const pillIcon = document.getElementById('active-portal-icon');
    const pillTitle = document.getElementById('active-portal-title');
    const pillTag = document.getElementById('active-portal-tag');

    const portalMeta = {
      parent: { icon: '👨‍👩‍👧', title: 'Parent Portal', tag: 'Family Care' },
      chw: { icon: '🩺', title: 'BHW Tools', tag: 'Field Operations' },
      collector: { icon: '📋', title: 'Data Collector Tools', tag: 'Field Survey & Registry' },
      mho: { icon: '🏛️', title: 'MHO Executive Console', tag: 'Administration' }
    };

    if (pillIcon) pillIcon.textContent = portalMeta[role]?.icon || '🌱';
    if (pillTitle) pillTitle.textContent = portalMeta[role]?.title || 'NutriLearn';
    if (pillTag) pillTag.textContent = portalMeta[role]?.tag || 'Community Health';

    // Initialize or Refresh views
    if (role === 'chw' || role === 'collector') {
      CHWModule.renderRegistryTable();
      CHWModule.updateStatsBar();
      this.switchCHWSubTab(role === 'collector' ? 'registry' : 'dashboard');
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

  // Scroll Sub-Nav Bar with Arrow buttons
  scrollSubNav(btn, delta) {
    if (!btn) return;
    const wrapper = btn.closest('.sub-nav-wrapper');
    if (!wrapper) return;
    const container = wrapper.querySelector('.sub-nav-container');
    if (container) {
      container.scrollBy({ left: delta, behavior: 'smooth' });
    }
  },

  // Initialize mouse wheel and drag-to-scroll for horizontal sub-navs on Windows desktop
  initSubNavScroll() {
    const containers = document.querySelectorAll('.sub-nav-container');
    containers.forEach(container => {
      // 1. Mouse wheel horizontal scrolling (translates deltaY to scrollLeft)
      container.addEventListener('wheel', (e) => {
        if (container.scrollWidth > container.clientWidth) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            container.scrollLeft += (e.deltaY * 1.3);
          }
        }
      }, { passive: false });

      // 2. Mouse drag-to-scroll on Windows PC / Desktop
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasDragged = false;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        container.classList.add('is-dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          container.classList.remove('is-dragging');
        }
      });

      container.addEventListener('mouseleave', () => {
        if (isDown) {
          isDown = false;
          container.classList.remove('is-dragging');
        }
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX);
        if (Math.abs(walk) > 5) {
          hasDragged = true;
        }
        container.scrollLeft = scrollLeft - walk;
      });

      // Prevent accidental tab click when dragging
      container.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      }, true);
    });
  },

  // Switch Sub-tabs in Parent View
  switchParentSubTab(tabName) {
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      const isActive = link.dataset.tab === tabName;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.parent-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });
  },

  // Switch Sub-tabs in CHW / Data Collector View
  switchCHWSubTab(tabName) {
    document.querySelectorAll('.chw-sub-link').forEach(link => {
      const isActive = link.dataset.tab === tabName;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.chw-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });

    if (tabName === 'groups' && window.CHWModule) {
      CHWModule.renderGroups();
    }
  },

  // Switch Sub-tabs in MHO View
  switchMHOSubTab(tabName) {
    document.querySelectorAll('.mho-sub-link').forEach(link => {
      const isActive = link.dataset.tab === tabName;
      link.classList.toggle('active', isActive);
      if (isActive && typeof link.scrollIntoView === 'function') {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    document.querySelectorAll('.mho-tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tab === tabName ? 'block' : 'none';
    });

    if (tabName === 'content' && window.MHODashboard) {
      MHODashboard.renderContentManagerModules();
    } else if (tabName === 'users' && window.MHODashboard) {
      MHODashboard.renderUsersTable();
    } else if (tabName === 'audit' && window.MHODashboard) {
      MHODashboard.renderAuditLogsTable();
    }
  },

  // Update Header User Profile Badge
  updateUserHeaderBadge() {
    const user = NutriStorage.getCurrentUser();
    const avatar = document.getElementById('header-user-avatar');
    const nameElem = document.getElementById('header-user-name');
    const roleElem = document.getElementById('header-user-role');

    if (user) {
      if (avatar) avatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
      if (nameElem) nameElem.textContent = user.name || 'User';
      if (roleElem) {
        const roleNames = {
          parent: 'Parent',
          chw: 'Health Worker',
          collector: 'Data Collector',
          mho: 'Administrator'
        };
        roleElem.textContent = roleNames[user.role] || user.role;
      }
    } else {
      if (avatar) avatar.textContent = 'G';
      if (nameElem) nameElem.textContent = 'Guest';
      if (roleElem) roleElem.textContent = 'Not signed in';
    }
  },

  // Account Settings / Profile Self-Management (Req #1)
  openAccountSettingsModal() {
    const user = NutriStorage.getCurrentUser();
    if (!user) {
      this.showToast('Please sign in to manage account settings.', 'warning');
      return;
    }
    const nameInput = document.getElementById('acc-settings-name');
    const emailInput = document.getElementById('acc-settings-email');
    const passInput = document.getElementById('acc-settings-pass');
    const roleBadge = document.getElementById('acc-settings-role-badge');
    const barangayInput = document.getElementById('acc-settings-barangay');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (passInput) passInput.value = user.password || '';
    if (roleBadge) roleBadge.textContent = (user.role || 'User').toUpperCase();
    if (barangayInput) barangayInput.value = user.barangay || 'Barangay San Jose';

    this.openModal('modal-account-settings');
  },

  handleSaveAccountSettings(form) {
    const user = NutriStorage.getCurrentUser();
    if (!user) return;

    const name = form.elements['accName'].value.trim();
    const email = form.elements['accEmail'].value.trim();
    const pass = form.elements['accPass'].value;
    const barangay = form.elements['accBarangay'] ? form.elements['accBarangay'].value : user.barangay;

    // Validation (Req #14)
    if (!name || !email || !pass) {
      this.showToast('Name, email, and password cannot be empty.', 'warning');
      return;
    }

    user.name = name;
    user.email = email;
    user.password = pass;
    user.barangay = barangay;

    NutriStorage.updateUser(user);
    this.updateUserHeaderBadge();
    this.closeModal('modal-account-settings');
    this.showToast('✅ Account profile updated successfully!', 'success');
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

    // Default to signin mode
    this.switchAuthMode('signin');
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
  },

  // Language Switcher Handlers
  setLanguage(lang) {
    if (window.NutriI18n) NutriI18n.setLanguage(lang);
  },

  toggleLanguage() {
    if (window.NutriI18n) NutriI18n.toggleLanguage();
  }
};

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  NutriApp.init();
});
