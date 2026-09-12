// ==========================================================================
// NUTRILEARN - INTERNATIONALIZATION (i18n) MODULE
// Dual Language Support: Filipino (Tagalog) & English
// ==========================================================================

const NutriI18n = {
  LANG_KEY: 'nutrilearn_lang_v1',
  currentLang: 'fil', // Default to Filipino as requested for community accessibility

  init() {
    // Load saved language preference or default to Filipino
    const saved = localStorage.getItem(this.LANG_KEY);
    if (saved && (saved === 'fil' || saved === 'en')) {
      this.currentLang = saved;
    } else {
      this.currentLang = 'fil';
    }
    this.applyLanguage(this.currentLang);
  },

  setLanguage(lang) {
    if (lang !== 'fil' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    this.applyLanguage(lang);
    if (window.NutriApp && typeof NutriApp.showToast === 'function') {
      const msg = lang === 'fil' ? '🇵🇭 Wika pinalitan sa Filipino.' : '🇺🇸 Language switched to English.';
      NutriApp.showToast(msg, 'info');
    }
  },

  toggleLanguage() {
    const nextLang = this.currentLang === 'fil' ? 'en' : 'fil';
    this.setLanguage(nextLang);
  },

  get(key) {
    const dict = this.translations[this.currentLang] || this.translations['fil'];
    return dict[key] || this.translations['en']?.[key] || key;
  },

  applyLanguage(lang) {
    const t = this.translations[lang] || this.translations['fil'];

    // 1. Update Language Selector Button States
    const syncPills = (idFil, idEn) => {
      const bFil = document.getElementById(idFil);
      const bEn = document.getElementById(idEn);
      if (bFil && bEn) {
        if (lang === 'fil') {
          bFil.style.background = '#0E3D26';
          bFil.style.color = '#FFFFFF';
          bFil.style.fontWeight = '700';
          bEn.style.background = 'transparent';
          bEn.style.color = '#475569';
          bEn.style.fontWeight = '600';
        } else {
          bEn.style.background = '#0E3D26';
          bEn.style.color = '#FFFFFF';
          bEn.style.fontWeight = '700';
          bFil.style.background = 'transparent';
          bFil.style.color = '#475569';
          bFil.style.fontWeight = '600';
        }
      }
    };

    syncPills('btn-lang-fil', 'btn-lang-en');
    syncPills('btn-lang-top-fil', 'btn-lang-top-en');

    // Header Language Toggle Button
    const headerLangLabel = document.getElementById('header-lang-label');
    if (headerLangLabel) {
      headerLangLabel.textContent = lang === 'fil' ? '🇵🇭 Filipino' : '🇺🇸 English';
    }

    // Screen 1: Select Role for Sign In
    const signinRoleSelectTitle = document.getElementById('lbl-signin-role-select-title');
    if (signinRoleSelectTitle) signinRoleSelectTitle.textContent = t.signin_role_select_title;

    const cardSigninParentTitle = document.getElementById('card-signin-parent-title');
    const cardSigninParentDesc = document.getElementById('card-signin-parent-desc');
    if (cardSigninParentTitle) cardSigninParentTitle.textContent = t.card_parent_title;
    if (cardSigninParentDesc) cardSigninParentDesc.textContent = t.card_parent_desc;

    const cardSigninChwTitle = document.getElementById('card-signin-chw-title');
    const cardSigninChwDesc = document.getElementById('card-signin-chw-desc');
    if (cardSigninChwTitle) cardSigninChwTitle.textContent = t.card_chw_title;
    if (cardSigninChwDesc) cardSigninChwDesc.textContent = t.card_chw_desc;

    const cardSigninMhoTitle = document.getElementById('card-signin-mho-title');
    const cardSigninMhoDesc = document.getElementById('card-signin-mho-desc');
    if (cardSigninMhoTitle) cardSigninMhoTitle.textContent = t.card_mho_title;
    if (cardSigninMhoDesc) cardSigninMhoDesc.textContent = t.card_mho_desc;

    const btnSigninContinue = document.getElementById('btn-signin-role-continue');
    if (btnSigninContinue) btnSigninContinue.textContent = t.btn_continue;

    const footerPromptSignin = document.getElementById('footer-prompt-signin');
    if (footerPromptSignin) {
      footerPromptSignin.innerHTML = `${t.footer_no_account_text} <a href="javascript:void(0)" onclick="NutriApp.goToRoleSelectSignUp()">${t.footer_register_link}</a>`;
    }

    // Screen 2: Create Account - Who are you registering as?
    const signupTitle = document.getElementById('lbl-signup-title');
    const signupSubtitle = document.getElementById('lbl-signup-subtitle');
    if (signupTitle) signupTitle.textContent = t.signup_heading;
    if (signupSubtitle) signupSubtitle.textContent = t.signup_role_subtitle;

    const cardSignupParentTitle = document.getElementById('card-signup-parent-title');
    const cardSignupParentDesc = document.getElementById('card-signup-parent-desc');
    if (cardSignupParentTitle) cardSignupParentTitle.textContent = t.card_parent_title;
    if (cardSignupParentDesc) cardSignupParentDesc.textContent = t.card_signup_parent_desc;

    const cardSignupChwTitle = document.getElementById('card-signup-chw-title');
    const cardSignupChwDesc = document.getElementById('card-signup-chw-desc');
    if (cardSignupChwTitle) cardSignupChwTitle.textContent = t.card_chw_title;
    if (cardSignupChwDesc) cardSignupChwDesc.textContent = t.card_signup_chw_desc;

    const cardSignupMhoTitle = document.getElementById('card-signup-mho-title');
    const cardSignupMhoDesc = document.getElementById('card-signup-mho-desc');
    if (cardSignupMhoTitle) cardSignupMhoTitle.textContent = t.card_mho_title;
    if (cardSignupMhoDesc) cardSignupMhoDesc.textContent = t.card_signup_mho_desc;

    const btnSignupContinue = document.getElementById('btn-signup-role-continue');
    if (btnSignupContinue) btnSignupContinue.textContent = t.btn_continue;

    const footerPromptSignup = document.getElementById('footer-prompt-signup');
    if (footerPromptSignup) {
      footerPromptSignup.innerHTML = `${t.footer_have_account_text} <a href="javascript:void(0)" onclick="NutriApp.goToRoleSelectSignIn()">${t.footer_signin_link}</a>`;
    }

    // Screen 3: Your Details
    const detailsTitle = document.getElementById('lbl-details-title');
    const detailsSubtitle = document.getElementById('lbl-details-subtitle');
    if (detailsTitle) detailsTitle.textContent = t.details_title;
    if (detailsSubtitle) detailsSubtitle.textContent = t.details_subtitle;

    const btnBackSignup = document.getElementById('btn-back-to-signup-roles');
    if (btnBackSignup) btnBackSignup.textContent = t.btn_back;

    const lblRegName = document.getElementById('lbl-reg-fullname');
    if (lblRegName) lblRegName.textContent = t.lbl_reg_fullname;
    const lblRegBrgy = document.getElementById('lbl-reg-barangay');
    if (lblRegBrgy) lblRegBrgy.textContent = t.lbl_reg_barangay;
    const lblRegEmail = document.getElementById('lbl-reg-email');
    if (lblRegEmail) lblRegEmail.textContent = t.lbl_reg_email;
    const lblRegPass = document.getElementById('lbl-reg-password');
    if (lblRegPass) lblRegPass.textContent = t.lbl_reg_password;
    const lblRegConfirm = document.getElementById('lbl-reg-confirm-password');
    if (lblRegConfirm) lblRegConfirm.textContent = t.lbl_reg_confirm_password;

    // Screen 4: Sign In Credentials
    const btnBackSignin = document.getElementById('btn-back-to-signin-roles');
    if (btnBackSignin) btnBackSignin.textContent = t.btn_back;

    const signinTitle = document.getElementById('lbl-signin-title');
    const signinSubtitle = document.getElementById('lbl-signin-subtitle');
    if (signinTitle) signinTitle.textContent = t.signin_heading;
    if (signinSubtitle) signinSubtitle.textContent = t.signin_subtitle;

    const signinBadgeSub = document.getElementById('signin-badge-sub');
    if (signinBadgeSub) signinBadgeSub.textContent = t.signin_badge_sub;

    const lblSigninEmail = document.getElementById('lbl-signin-email');
    if (lblSigninEmail) lblSigninEmail.textContent = t.lbl_signin_email;
    const lblSigninPassword = document.getElementById('lbl-signin-password');
    if (lblSigninPassword) lblSigninPassword.textContent = t.lbl_signin_password;

    const btnSigninSubmit = document.getElementById('btn-signin-submit');
    if (btnSigninSubmit) btnSigninSubmit.textContent = t.btn_signin;

    // Refresh active badge text if on screen 4
    const badgeTitle = document.getElementById('signin-badge-title');
    if (badgeTitle && window.NutriApp) {
      const r = NutriApp.currentAuthRole || 'parent';
      const map = { parent: t.card_parent_title, chw: t.card_chw_title, mho: t.card_mho_title };
      badgeTitle.textContent = map[r] || t.card_parent_title;
    }

    // Sub-navigation Links
    document.querySelectorAll('.parent-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_parent[tab]) link.textContent = t.nav_parent[tab];
    });

    document.querySelectorAll('.chw-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_chw[tab]) link.textContent = t.nav_chw[tab];
    });

    document.querySelectorAll('.mho-sub-link').forEach(link => {
      const tab = link.dataset.tab;
      if (t.nav_mho[tab]) link.textContent = t.nav_mho[tab];
    });

    // App Header Sign Out
    const btnSignout = document.querySelector('.btn-signout');
    if (btnSignout) {
      btnSignout.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        ${t.btn_signout}
      `;
    }

    // Refresh dynamic demo login button
    if (window.NutriApp && typeof NutriApp.updateStartupFormDisplay === 'function') {
      NutriApp.updateStartupFormDisplay(NutriApp.currentAuthMode || 'signin');
    }
  },

  translations: {
    fil: {
      lbl_select_language: 'Piliin ang Wika / Select Language:',
      signin_role_select_title: 'Piliin ang iyong role para magpatuloy',
      card_parent_title: 'Magulang / Tagapag-alaga',
      card_parent_desc: 'Makakuha ng mga aralin sa nutrisyon, mga plano sa pagkain, at subaybayan ang paglaki ng iyong anak.',
      card_chw_title: 'Manggagawa sa Kalusugan (BHW)',
      card_chw_desc: 'Pamahalaan ang mga parent group, mag-post ng mga anunsyo, at magsumite ng child records.',
      card_col_title: 'Tagakolekta ng Datos sa Larangan',
      card_col_desc: 'Mangalap ng datos sa nutrisyon, magrehistro ng bata, at magpatunay ng paglaki.',
      card_mho_title: 'Administrator (MHO)',
      card_mho_desc: 'Tingnan ang mga tala ng field, analytics, at pamahalaan ang nilalaman ng programa.',
      btn_continue: 'Magpatuloy',
      btn_continue_signin: 'Magpatuloy sa Pag-sign In',
      btn_continue_signup: 'Magpatuloy sa Pagrehistro',
      footer_no_account_text: 'Wala kang account?',
      footer_register_link: 'Magparehistro dito',
      footer_have_account_text: 'May account ka na?',
      footer_signin_link: 'Mag-sign in dito',
      signin_heading: 'Mag-sign In',
      signin_subtitle: 'Ilagay ang iyong credentials para ma-access ang NutriLearn',
      signin_badge_sub: 'Pumapasok bilang',
      lbl_signin_email: 'Email address',
      lbl_signin_password: 'Password',
      signup_heading: 'Gumawa ng Account',
      signup_role_subtitle: 'Sino ang nais mong irehistro?',
      card_signup_parent_desc: 'Subaybayan ang nutrisyon ng bata at i-access ang learning modules.',
      card_signup_chw_desc: 'Subaybayan ang mga pamilya, itala ang datos ng bata, at ipamahagi ang anunsyo.',
      card_signup_mho_desc: 'Pamahalaan ang datos ng programa, mga gumagamit, at anunsyo sa kalusugan.',
      details_title: 'Iyong mga detalye',
      details_subtitle: 'Gumawa ng iyong NutriLearn account',
      btn_back: '← Bumalik',
      lbl_reg_fullname: 'Buong Pangalan *',
      lbl_reg_barangay: 'Barangay / Tirahan *',
      lbl_reg_email: 'Email Address *',
      lbl_reg_password: 'Password *',
      lbl_reg_confirm_password: 'Kumpirmahin ang Password *',
      btn_signin: 'Mag-sign In',
      btn_create_account: 'Gumawa ng Account',
      btn_signout: 'Mag-sign Out',
      nav_parent: {
        'dashboard': '📊 Dashboard ng Magulang',
        'announcements': '📢 Mga Anunsyo sa Komunidad',
        'learning': '📚 Mga Aralin sa Nutrisyon at Pagsusulit',
        'meal-planner': '🍲 Pinggang Pinoy Plano ng Pagkain',
        'growth-tracker': '📈 Talaan ng Paglaki ng Aking Anak'
      },
      nav_chw: {
        'dashboard': '📊 BHW Dashboard',
        'announcements': '📢 Mga Pabatid at Direktiba',
        'registry': '📋 Talaan ng Malnutrisyon',
        'groups': '👥 Mga Grupo ng Magulang at Aralin',
        'calculator': '📐 WHO Sukat at MUAC Calculator',
        'reporting': '📤 Magsumite ng Ulat sa MHO'
      },
      nav_mho: {
        'dashboard': '📊 Executive Dashboard',
        'announcements': '📢 Opisyal na mga Anunsyo',
        'kpis': '🎯 10% Stunting Target at KPIs',
        'hotspots': '🗺️ Mga Hotspot na Barangay',
        'reports': '📥 Suriin at Aprubahan ang mga Ulat',
        'guidelines': '📜 Mga Patakaran ng WHO at PPAN',
        'content': '📝 Pamahalaan ang mga Aralin',
        'users': '👥 Pamahalaan ang mga Gumagamit',
        'audit': '🛡️ Audit at Talaan ng Aksyon'
      }
    },
    en: {
      lbl_select_language: 'Select Language / Piliin ang Wika:',
      signin_role_select_title: 'Select your role to continue',
      card_parent_title: 'Parent / Guardian',
      card_parent_desc: 'Access nutrition lessons, meal plans, and track your child\'s growth.',
      card_chw_title: 'Health Worker',
      card_chw_desc: 'Manage parent groups, post announcements, and submit child records.',
      card_col_title: 'Field Data Collector',
      card_col_desc: 'Collect anthropometric field surveys, register children, and verify growth.',
      card_mho_title: 'Administrator',
      card_mho_desc: 'View field records, analytics, and manage program content.',
      btn_continue: 'Continue',
      btn_continue_signin: 'Continue to Sign In',
      btn_continue_signup: 'Continue to Sign Up',
      footer_no_account_text: 'Don\'t have an account?',
      footer_register_link: 'Register here',
      footer_have_account_text: 'Already have an account?',
      footer_signin_link: 'Sign in',
      signin_heading: 'Sign in',
      signin_subtitle: 'Enter your credentials to access NutriLearn',
      signin_badge_sub: 'Signing in as',
      lbl_signin_email: 'Email address',
      lbl_signin_password: 'Password',
      signup_heading: 'Create account',
      signup_role_subtitle: 'Who are you registering as?',
      card_signup_parent_desc: 'Track your child\'s nutrition and access learning modules.',
      card_signup_chw_desc: 'Monitor families, record child data, and relay announcements.',
      card_signup_mho_desc: 'Oversee program data, users, and post health announcements.',
      details_title: 'Your details',
      details_subtitle: 'Create your NutriLearn account',
      btn_back: '← Back',
      lbl_reg_fullname: 'Full Name *',
      lbl_reg_barangay: 'Barangay / Address *',
      lbl_reg_email: 'Email Address *',
      lbl_reg_password: 'Password *',
      lbl_reg_confirm_password: 'Confirm Password *',
      btn_signin: 'Sign In',
      btn_create_account: 'Create Account',
      btn_signout: 'Sign Out',
      nav_parent: {
        'dashboard': '📊 Parent Dashboard',
        'announcements': '📢 Community Bulletins',
        'learning': '📚 Learning Modules & Quizzes',
        'meal-planner': '🍲 Pinggang Pinoy Meal Planner',
        'growth-tracker': '📈 My Child Growth Record'
      },
      nav_chw: {
        'dashboard': '📊 BHW Dashboard',
        'announcements': '📢 Bulletins & Advisories',
        'registry': '📋 Malnutrition Registry',
        'groups': '👥 Parent Groups & Lessons',
        'calculator': '📐 WHO Growth & MUAC Calculator',
        'reporting': '📤 Submit Reports to MHO'
      },
      nav_mho: {
        'dashboard': '📊 Executive Dashboard',
        'announcements': '📢 Official Announcements',
        'kpis': '🎯 10% Stunting Target & KPIs',
        'hotspots': '🗺️ Barangay Hotspots & Burden',
        'reports': '📥 Review & Endorse BHW Reports',
        'guidelines': '📜 WHO & SDG Nutrition Guidelines',
        'content': '📝 Content Manager',
        'users': '👥 User Accounts & Access',
        'audit': '🛡️ Audit & Admin Logs'
      }
    }
  }
};
