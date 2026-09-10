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

  // Initialize storage with seed data if empty
  init() {
    if (!localStorage.getItem(this.CHILDREN_KEY)) {
      localStorage.setItem(this.CHILDREN_KEY, JSON.stringify(NUTRI_DATA.initialChildren));
    }
    if (!localStorage.getItem(this.REPORTS_KEY)) {
      localStorage.setItem(this.REPORTS_KEY, JSON.stringify(NUTRI_DATA.initialReports));
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

    // Default Demo Users
    if (!localStorage.getItem(this.USERS_KEY)) {
      const demoUsers = [
        {
          id: 'usr-parent-1',
          name: 'Maria Ramos',
          email: 'maria.parent@nutrilearn.ph',
          password: 'password123',
          role: 'parent',
          childName: 'Ethan Kyle Ramos',
          childAge: 18,
          barangay: 'Barangay San Jose'
        },
        {
          id: 'usr-bhw-1',
          name: 'Sister Teresa Lim, BNS',
          email: 'teresa.bhw@nutrilearn.ph',
          password: 'password123',
          role: 'chw',
          bhwId: 'BHW-SJ-2024',
          barangay: 'Barangay San Jose'
        },
        {
          id: 'usr-admin-1',
          name: 'Dr. Elena Cruz, MHO',
          email: 'admin.mho@nutrilearn.ph',
          password: 'password123',
          role: 'mho',
          department: 'Municipal Health Office',
          designation: 'Municipal Health Officer'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
    }
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
    users.push(userData);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(userData);
    return userData;
  },

  loginUser(emailOrName, password, role) {
    const users = this.getUsers();
    const query = (emailOrName || '').trim().toLowerCase();
    
    // Find matching user by email or name, optionally matching role
    const found = users.find(u => 
      (u.email.toLowerCase() === query || u.name.toLowerCase() === query) &&
      u.password === password &&
      (!role || u.role === role)
    );

    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }

    return { success: false, message: 'Invalid credentials. Please check your username/email and password.' };
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
    child.id = 'ch-' + Date.now();
    child.lastAssessed = new Date().toISOString().split('T')[0];
    children.unshift(child);
    this.saveChildren(children);
    return child;
  },

  updateChild(updatedChild) {
    const children = this.getChildren();
    const index = children.findIndex(c => c.id === updatedChild.id);
    if (index !== -1) {
      children[index] = { ...children[index], ...updatedChild, lastAssessed: new Date().toISOString().split('T')[0] };
      this.saveChildren(children);
      return true;
    }
    return false;
  },

  deleteChild(childId) {
    let children = this.getChildren();
    children = children.filter(c => c.id !== childId);
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
    report.reportId = 'REP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    report.submittedDate = new Date().toISOString().split('T')[0];
    report.status = 'Pending Review';
    reports.unshift(report);
    this.saveReports(reports);
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
    post.id = 'ann-' + Date.now();
    post.createdAt = new Date().toISOString();
    list.unshift(post);
    this.saveAnnouncements(list);
    return post;
  },

  deleteAnnouncement(id) {
    let list = this.getAnnouncements();
    list = list.filter(a => a.id !== id);
    this.saveAnnouncements(list);
    return true;
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

  // Trigger browser print for official health reports
  printOfficialSummary() {
    window.print();
  }
};
