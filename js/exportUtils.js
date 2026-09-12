// ==========================================================================
// NUTRILEARN - EXPORT & PERSISTENCE UTILITIES
// LocalStorage, CSV Generation, Formal Printable Summaries
// ==========================================================================

const NutriStorage = {
  // Key names
  CHILDREN_KEY: 'nutrilearn_children_v1',
  REPORTS_KEY: 'nutrilearn_reports_v1',
  MODULES_KEY: 'nutrilearn_modules_v1',
  USER_PROGRESS_KEY: 'nutrilearn_parent_progress_v1',
  USERS_KEY: 'nutrilearn_users_v1',
  CURRENT_USER_KEY: 'nutrilearn_current_user_v1',
  ANNOUNCEMENTS_KEY: 'nutrilearn_announcements_v1',
  GROUPS_KEY: 'nutrilearn_parent_groups_v1',
  AUDIT_KEY: 'nutrilearn_audit_logs_v1',

  // Initialize storage with seed data if empty
  init() {
    if (!localStorage.getItem(this.CHILDREN_KEY)) {
      localStorage.setItem(this.CHILDREN_KEY, JSON.stringify(NUTRI_DATA.initialChildren));
    }
    if (!localStorage.getItem(this.REPORTS_KEY)) {
      localStorage.setItem(this.REPORTS_KEY, JSON.stringify(NUTRI_DATA.initialReports));
    }
    if (!localStorage.getItem(this.MODULES_KEY)) {
      localStorage.setItem(this.MODULES_KEY, JSON.stringify(NUTRI_DATA.modules));
    }
    if (!localStorage.getItem(this.AUDIT_KEY)) {
      const initialLogs = [
        {
          id: 'log-seed-1',
          timestamp: '09/10/2026, 09:00 AM',
          category: 'Account Management',
          action: 'User Account Provisioned',
          details: 'Admin provisioned Mark Reyes (Field Data Collector) for Community Nutrition Survey Unit',
          performedBy: 'Dr. Elena Cruz, MHO',
          userRole: 'mho'
        },
        {
          id: 'log-seed-2',
          timestamp: '09/10/2026, 10:30 AM',
          category: 'Content & Curricula',
          action: 'Curricula Verified',
          details: 'Standard WHO & PPAN 5-module infant nutrition learning sequence published',
          performedBy: 'Dr. Elena Cruz, MHO',
          userRole: 'mho'
        },
        {
          id: 'log-seed-3',
          timestamp: '09/11/2026, 02:15 PM',
          category: 'Group & Instruction',
          action: 'Parent Cohort Formed',
          details: 'Created "Barangay San Jose - First 1,000 Days Cohort" with 3 children enrolled',
          performedBy: 'Sister Teresa Lim, BNS',
          userRole: 'chw'
        },
        {
          id: 'log-seed-4',
          timestamp: '09/11/2026, 04:00 PM',
          category: 'Report & Endorsement',
          action: 'Official Report Endorsed',
          details: 'Verified & approved census report REP-2026-8802 for Barangay Santa Maria',
          performedBy: 'Dr. Elena Cruz, MHO',
          userRole: 'mho'
        }
      ];
      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(initialLogs));
    }
    if (!localStorage.getItem(this.GROUPS_KEY)) {
      const initialGroups = [
        {
          id: 'grp-1',
          name: 'Barangay San Jose - First 1,000 Days Cohort',
          barangay: 'Barangay San Jose',
          targetCategory: 'Infant Feeding & Complementary Foods',
          facilitator: 'Sister Teresa Lim, BNS',
          assignedModules: ['mod-1', 'mod-2', 'mod-3'],
          enrolledChildIds: ['ch-1', 'ch-2', 'ch-3'],
          adviceNotes: 'Meet every 2nd Tuesday for anthropometric tracking and Pinggang Pinoy cooking demo.',
          createdAt: '2026-09-01'
        },
        {
          id: 'grp-2',
          name: 'Barangay Santa Maria - Stunting Prevention Group',
          barangay: 'Barangay Santa Maria',
          targetCategory: 'Stunted & At-Risk Toddlers',
          facilitator: 'Nurse Anita Santos',
          assignedModules: ['mod-1', 'mod-3', 'mod-4'],
          enrolledChildIds: ['ch-4', 'ch-5'],
          adviceNotes: 'Focus on enriched Go-Grow-Glow local meals with Malunggay and Monggo.',
          createdAt: '2026-09-05'
        }
      ];
      localStorage.setItem(this.GROUPS_KEY, JSON.stringify(initialGroups));
    }
    const storedAnn = localStorage.getItem(this.ANNOUNCEMENTS_KEY);
    if (!storedAnn || !storedAnn.includes('targetBarangays')) {
      localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(NUTRI_DATA.initialAnnouncements || []));
    }
    if (!localStorage.getItem(this.USER_PROGRESS_KEY)) {
      const initialProgress = {
        currentModuleId: 'mod-1',
        completedModules: ['mod-1'],
        quizScores: { 'mod-1': 100 },
        childName: 'Ethan Kyle Ramos',
        childAge: 18
      };
      localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(initialProgress));
    }

    // Users storage (No demo accounts)
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    } else {
      // Remove any previously stored demo accounts
      try {
        const storedUsers = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        const filteredUsers = storedUsers.filter(u => 
          !['usr-parent-1', 'usr-bhw-1', 'usr-col-1', 'usr-admin-1'].includes(u.id) &&
          !['maria.parent@nutrilearn.ph', 'teresa.bhw@nutrilearn.ph', 'mark.collector@nutrilearn.ph', 'admin.mho@nutrilearn.ph', 'maria@example.com', 'ana@example.com', 'jose@example.com'].includes(u.email)
        );
        localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
      } catch (e) {}
    }

    // Reset current active session if it was a demo user
    try {
      const activeUser = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      if (activeUser && (
        ['usr-parent-1', 'usr-bhw-1', 'usr-col-1', 'usr-admin-1'].includes(activeUser.id) ||
        ['maria.parent@nutrilearn.ph', 'teresa.bhw@nutrilearn.ph', 'mark.collector@nutrilearn.ph', 'admin.mho@nutrilearn.ph'].includes(activeUser.email)
      )) {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    } catch (e) {}
  },

  // ==========================================================================
  // AUDIT AND ADMINISTRATION DATA (Data Requirements #10)
  // Account changes, content updates, report generation, and administrative actions
  // ==========================================================================
  getAuditLogs() {
    try {
      const data = localStorage.getItem(this.AUDIT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  logAudit(action, category, details, user) {
    try {
      const logs = this.getAuditLogs();
      const currentUser = user || this.getCurrentUser() || { name: 'System Administrator', role: 'mho' };
      const newLog = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        category: category || 'Administration',
        action: action,
        details: details,
        performedBy: currentUser.name || 'Admin',
        userRole: currentUser.role || 'mho'
      };
      logs.unshift(newLog);
      if (logs.length > 200) logs.pop(); // Retain up to 200 activity logs
      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(logs));
      return newLog;
    } catch (e) {
      console.warn('Audit logging failed:', e);
    }
  },

  clearAuditLogs() {
    localStorage.setItem(this.AUDIT_KEY, JSON.stringify([]));
  },

  // User Authentication & Management
  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  },

  getUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  registerUser(userData) {
    const users = this.getUsers();
    userData.id = 'usr-' + Date.now();
    userData.status = userData.status || 'Active';
    userData.registeredDate = userData.registeredDate || new Date().toISOString().split('T')[0];
    users.push(userData);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(userData);
    this.logAudit('User Account Created', 'Account Management', `Registered account for ${userData.name} (${userData.role.toUpperCase()})`);
    return userData;
  },

  updateUser(updatedUser) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedUser };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      const current = this.getCurrentUser();
      if (current && current.id === updatedUser.id) {
        this.setCurrentUser(users[idx]);
      }
      this.logAudit('User Account Updated', 'Account Management', `Updated profile/credentials for ${updatedUser.name} (${updatedUser.role})`);
      return users[idx];
    }
    return null;
  },

  deleteUser(userId) {
    let users = this.getUsers();
    const target = users.find(u => u.id === userId);
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(null);
    }
    this.logAudit('User Account Deleted', 'Account Management', `Removed account ${target ? target.name : userId} from system`);
  },

  toggleUserStatus(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'Suspended' ? 'Active' : 'Suspended';
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      this.logAudit('Access Status Changed', 'Security & Access', `Account status for ${user.name} changed to ${user.status}`);
      return user.status;
    }
    return null;
  },

  loginUser(emailOrName, password, role) {
    const users = this.getUsers();
    const query = (emailOrName || '').trim().toLowerCase();
    
    // Find matching user by email or name, optionally matching role
    const found = users.find(u => 
      (u.email.toLowerCase() === query || u.name.toLowerCase() === query) &&
      u.password === password &&
      (!role || u.role === role || (role === 'chw' && u.role === 'collector'))
    );

    if (found) {
      if (found.status === 'Suspended') {
        return { success: false, message: '⛔ Account Suspended: Your access has been temporarily restricted by the Administrator. Please contact the Municipal Health Office.' };
      }
      this.setCurrentUser(found);
      return { success: true, user: found };
    }

    return { success: false, message: 'Invalid credentials. Please check your username/email and password.' };
  },

  // ==========================================================================
  // DYNAMIC NUTRITION MODULES & CONTENT MANAGEMENT (Req #11)
  // ==========================================================================
  getModules() {
    try {
      const data = localStorage.getItem(this.MODULES_KEY);
      return data ? JSON.parse(data) : NUTRI_DATA.modules;
    } catch (e) {
      return NUTRI_DATA.modules;
    }
  },

  saveModules(modules) {
    localStorage.setItem(this.MODULES_KEY, JSON.stringify(modules));
  },

  addModule(newModule) {
    const modules = this.getModules();
    newModule.id = newModule.id || ('mod-' + Date.now());
    newModule.number = newModule.number || `Module ${modules.length + 1}`;
    modules.push(newModule);
    this.saveModules(modules);
    this.logAudit('Module Created', 'Content & Curricula', `Created curriculum "${newModule.number}: ${newModule.title}"`);
    return newModule;
  },

  updateModule(updatedModule) {
    const modules = this.getModules();
    const idx = modules.findIndex(m => m.id === updatedModule.id);
    if (idx !== -1) {
      modules[idx] = { ...modules[idx], ...updatedModule };
      this.saveModules(modules);
      this.logAudit('Module Updated', 'Content & Curricula', `Updated curriculum "${updatedModule.number}: ${updatedModule.title}"`);
      return modules[idx];
    }
    return null;
  },

  deleteModule(moduleId) {
    let modules = this.getModules();
    const target = modules.find(m => m.id === moduleId);
    modules = modules.filter(m => m.id !== moduleId);
    this.saveModules(modules);
    this.logAudit('Module Deleted', 'Content & Curricula', `Deleted curriculum "${target ? target.title : moduleId}"`);
  },

  resetModules() {
    localStorage.setItem(this.MODULES_KEY, JSON.stringify(NUTRI_DATA.modules));
    this.logAudit('Curricula Reset', 'Content & Curricula', 'Restored default WHO & PPAN 5-module standard curricula');
    return NUTRI_DATA.modules;
  },

  // ==========================================================================
  // PARENT GROUPS & COHORT MANAGEMENT (Req #8)
  // ==========================================================================
  getGroups() {
    try {
      const data = localStorage.getItem(this.GROUPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveGroups(groups) {
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
  },

  addGroup(group) {
    const groups = this.getGroups();
    group.id = group.id || ('grp-' + Date.now());
    group.createdAt = group.createdAt || new Date().toISOString().split('T')[0];
    group.enrolledChildIds = group.enrolledChildIds || [];
    group.assignedModules = group.assignedModules || ['mod-1', 'mod-3'];
    groups.unshift(group);
    this.saveGroups(groups);
    this.logAudit('Parent Group Created', 'Group & Instruction', `Organized "${group.name}" for ${group.barangay}`);
    return group;
  },

  updateGroup(updatedGroup) {
    const groups = this.getGroups();
    const idx = groups.findIndex(g => g.id === updatedGroup.id);
    if (idx !== -1) {
      groups[idx] = { ...groups[idx], ...updatedGroup };
      this.saveGroups(groups);
      this.logAudit('Parent Group Updated', 'Group & Instruction', `Updated cohort "${updatedGroup.name}" (${(updatedGroup.enrolledChildIds || []).length} children)`);
      return groups[idx];
    }
    return null;
  },

  deleteGroup(groupId) {
    let groups = this.getGroups();
    const target = groups.find(g => g.id === groupId);
    groups = groups.filter(g => g.id !== groupId);
    this.saveGroups(groups);
    this.logAudit('Parent Group Deleted', 'Group & Instruction', `Disbanded cohort "${target ? target.name : groupId}"`);
  },

  // Children Registry CRUD
  getChildren() {
    try {
      const data = localStorage.getItem(this.CHILDREN_KEY);
      return data ? JSON.parse(data) : NUTRI_DATA.initialChildren;
    } catch (e) {
      console.error('Failed to load children records', e);
      return NUTRI_DATA.initialChildren;
    }
  },

  saveChildren(children) {
    localStorage.setItem(this.CHILDREN_KEY, JSON.stringify(children));
  },

  addChild(child) {
    const children = this.getChildren();
    child.id = child.id || ('ch-' + Date.now());
    child.lastAssessed = child.lastAssessed || new Date().toISOString().split('T')[0];
    children.unshift(child);
    this.saveChildren(children);

    // Live sync to FastAPI Backend (Render/Local)
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.saveChild(child).catch(e => console.warn('NutriApi save error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.saveChild === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.saveChild(child).catch(e => console.warn('Supabase save error:', e));
    }
    return child;
  },

  updateChild(updatedChild) {
    const children = this.getChildren();
    const index = children.findIndex(c => String(c.id) === String(updatedChild.id));
    if (index !== -1) {
      children[index] = { ...children[index], ...updatedChild, lastAssessed: new Date().toISOString().split('T')[0] };
      this.saveChildren(children);

      // Live sync to FastAPI Backend
      if (window.NutriApi && window.NutriApi.isAvailable) {
        window.NutriApi.updateChild(children[index]).catch(e => console.warn('NutriApi update error:', e));
      }
      // Live sync to Supabase Cloud
      if (window.NutriDb && typeof window.NutriDb.updateChild === 'function' && window.NutriDb.isConfigured()) {
        window.NutriDb.updateChild(children[index]).catch(e => console.warn('Supabase update error:', e));
      }
      return true;
    }
    return false;
  },

  deleteChild(childId) {
    let children = this.getChildren();
    children = children.filter(c => String(c.id) !== String(childId));
    this.saveChildren(children);
    return true;
  },

  // Submitted Reports
  getReports() {
    try {
      const data = localStorage.getItem(this.REPORTS_KEY);
      return data ? JSON.parse(data) : NUTRI_DATA.initialReports;
    } catch (e) {
      return NUTRI_DATA.initialReports;
    }
  },

  saveReports(reports) {
    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
  },

  submitReport(report) {
    const reports = this.getReports();
    report.reportId = report.reportId || ('REP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
    report.submittedDate = report.submittedDate || new Date().toISOString().split('T')[0];
    report.status = report.status || 'Pending Review';
    reports.unshift(report);
    this.saveReports(reports);

    this.logAudit('Report Submitted', 'Report & Endorsement', `Submitted report ${report.reportId} for ${report.barangay} (${report.totalChildren} assessed)`);

    // Live sync to FastAPI Backend
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.submitReport(report).catch(e => console.warn('NutriApi report submit error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.submitReport === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.submitReport(report).catch(e => console.warn('Supabase report submit error:', e));
    }
    return report;
  },

  // Parent Progress
  getParentProgress() {
    try {
      const data = localStorage.getItem(this.USER_PROGRESS_KEY);
      return data ? JSON.parse(data) : { completedModules: [], quizScores: {} };
    } catch (e) {
      return { completedModules: [], quizScores: {} };
    }
  },

  saveParentProgress(progress) {
    localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(progress));
  },

  // Announcements CRUD & Role-Based Audience Filtering
  getAnnouncements() {
    try {
      const data = localStorage.getItem(this.ANNOUNCEMENTS_KEY);
      return data ? JSON.parse(data) : (NUTRI_DATA.initialAnnouncements || []);
    } catch (e) {
      return NUTRI_DATA.initialAnnouncements || [];
    }
  },

  saveAnnouncements(list) {
    localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(list));
  },

  addAnnouncement(post) {
    const list = this.getAnnouncements();
    post.id = post.id || ('ann-' + Date.now());
    post.createdAt = post.createdAt || new Date().toISOString();
    list.unshift(post);
    this.saveAnnouncements(list);

    // Live sync to FastAPI Backend
    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.createAnnouncement(post).catch(e => console.warn('NutriApi announcement submit error:', e));
    }
    // Live sync to Supabase Cloud
    if (window.NutriDb && typeof window.NutriDb.createAnnouncement === 'function' && window.NutriDb.isConfigured()) {
      window.NutriDb.createAnnouncement(post).catch(e => console.warn('Supabase announcement submit error:', e));
    }
    return post;
  },

  deleteAnnouncement(id) {
    let list = this.getAnnouncements();
    list = list.filter(a => String(a.id) !== String(id));
    this.saveAnnouncements(list);

    if (window.NutriApi && window.NutriApi.isAvailable) {
      window.NutriApi.deleteAnnouncement(id).catch(e => console.warn('NutriApi delete announcement error:', e));
    }
    return true;
  },

  // Bidirectional Cloud Synchronization
  async syncWithSupabase() {
    if (!window.NutriDb || !window.NutriDb.isConfigured()) return;

    try {
      console.log('🔄 [NutriStorage] Checking live data from Supabase...');
      const [cloudChildren, cloudReports, cloudAnnouncements] = await Promise.all([
        window.NutriDb.getChildren(),
        window.NutriDb.getReports(),
        window.NutriDb.getAnnouncements()
      ]);

      let hasNewData = false;

      if (cloudChildren && cloudChildren.length > 0) {
        this.saveChildren(cloudChildren);
        hasNewData = true;
      }
      if (cloudReports && cloudReports.length > 0) {
        this.saveReports(cloudReports);
        hasNewData = true;
      }
      if (cloudAnnouncements && cloudAnnouncements.length > 0) {
        this.saveAnnouncements(cloudAnnouncements);
        hasNewData = true;
      }

      if (hasNewData) {
        if (window.CHWModule && typeof CHWModule.renderRegistryTable === 'function') {
          CHWModule.renderRegistryTable();
          CHWModule.updateStatsBar();
        }
        if (window.MHODashboard && typeof MHODashboard.init === 'function') {
          MHODashboard.init();
        }
        if (window.AnnouncementsModule && typeof AnnouncementsModule.renderAllFeeds === 'function') {
          AnnouncementsModule.renderAllFeeds();
          AnnouncementsModule.renderDashboardWidgets();
        }
      }
      console.log('✅ [NutriStorage] Cloud data synchronized successfully!');
    } catch (err) {
      console.warn('⚠️ [NutriStorage] Cloud sync note:', err.message);
    }
  },

  // Strict Audience & Barangay Isolation Filter per Role
  getAnnouncementsForRole(role) {
    const all = this.getAnnouncements();
    const currentUser = this.getCurrentUser();
    const userBarangay = currentUser?.barangay || 'Barangay San Jose';

    if (role === 'parent') {
      // PARENTS can ONLY view announcements routed to Parents:
      // - Audience: 'both', 'admin_parent', or 'parent' (STRICTLY HIDDEN: 'bhw')
      // - Destination Barangay: must be 'All Barangays' or include user's barangay
      return all.filter(a => {
        const isAudience = (
          a.targetAudience === 'both' || 
          a.targetAudience === 'admin_parent' || 
          a.targetAudience === 'parent'
        );
        if (!isAudience) return false;

        // Barangay Destination match
        if (!a.targetBarangays || a.barangay === 'All Barangays' || a.targetBarangays.includes('ALL') || a.targetBarangays.length === 0) {
          return true;
        }
        return a.targetBarangays.includes(userBarangay) || a.barangay === userBarangay;
      });
    } else if (role === 'chw') {
      // BHWs can view all announcements where BHW is in the audience:
      // - Admin post: 'both' or 'bhw' (internal directive)
      // - BHW post: 'admin_parent' or 'parent' (their own / peer posts)
      // - Destination Barangay: must be 'All Barangays' or include BHW's assigned barangay
      return all.filter(a => {
        const isAudience = (
          a.targetAudience === 'both' || 
          a.targetAudience === 'bhw' || 
          a.targetAudience === 'admin_parent' || 
          a.targetAudience === 'parent' ||
          a.authorRole === 'chw'
        );
        if (!isAudience) return false;

        // BHW author always sees their own posts
        if (a.authorRole === 'chw') return true;

        if (!a.targetBarangays || a.barangay === 'All Barangays' || a.targetBarangays.includes('ALL') || a.targetBarangays.length === 0) {
          return true;
        }
        return a.targetBarangays.includes(userBarangay) || a.barangay === userBarangay;
      });
    } else if (role === 'mho') {
      // ADMIN can view all official Admin broadcasts and BHW broadcasts routed to Admin across all barangays
      return all.filter(a => 
        a.authorRole === 'mho' || 
        a.targetAudience === 'both' || 
        a.targetAudience === 'admin_parent' ||
        a.targetAudience === 'bhw'
      );
    }
    return all;
  }
};

// Export Utilities (CSV, Print, Downloads)
const NutriExport = {
  // Export Children Registry to CSV
  exportChildrenCSV() {
    const children = NutriStorage.getChildren();
    if (!children.length) {
      alert('No child records available to export.');
      return;
    }

    const headers = [
      'ID', 'Child Name', 'Age (Months)', 'Sex', 'Parent Name', 
      'Barangay', 'Height (cm)', 'Weight (kg)', 'MUAC (mm)', 
      'Overall Status', 'Height-for-Age', 'Weight-for-Height', 
      'MUAC Status', 'Improved Status', 'Last Assessed Date'
    ];

    const rows = children.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      c.ageMonths,
      `"${c.sex}"`,
      `"${c.parentName}"`,
      `"${c.barangay}"`,
      c.heightCm,
      c.weightKg,
      c.muacMm,
      `"${c.status}"`,
      `"${c.hfaStatus || 'N/A'}"`,
      `"${c.wfhStatus || 'N/A'}"`,
      `"${c.muacStatus || 'N/A'}"`,
      c.improved ? '"Yes (Recovered)"' : '"Under Monitoring"',
      `"${c.lastAssessed}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_Child_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export MHO Reports to CSV
  exportReportsCSV() {
    const reports = NutriStorage.getReports();
    const headers = [
      'Report ID', 'Barangay', 'Submitted By', 'Date',
      'Total Children', 'Stunted', 'Wasted', 'Underweight',
      'Improved', 'Stunting Rate', 'Status'
    ];

    const rows = reports.map(r => [
      `"${r.reportId}"`,
      `"${r.barangay}"`,
      `"${r.chwName}"`,
      `"${r.submittedDate}"`,
      r.totalChildren,
      r.stuntedCount,
      r.wastedCount,
      r.underweightCount,
      r.improvedCount,
      `"${r.stuntingRate}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_MHO_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export Audit Logs to CSV (Data Requirements #10)
  exportAuditLogsCSV() {
    const logs = NutriStorage.getAuditLogs();
    if (!logs.length) {
      alert('No audit log entries available to export.');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Category', 'Action Performed', 'Details / Scope', 'Performed By', 'User Role'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.performedBy}"`,
      `"${l.userRole}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NutriLearn_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Trigger browser print for official health reports
  printOfficialSummary() {
    window.print();
  }
};
