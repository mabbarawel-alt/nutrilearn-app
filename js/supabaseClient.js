// ==============================================================================
// NUTRILEARN - SUPABASE DATABASE CLIENT & SYNC BRIDGE
// Aligned with .env & js/config.js
// ==============================================================================

(function() {
  'use strict';

  let client = null;
  let isConfigured = false;

  const isKeyValid = (key) => 
    typeof key === 'string' && 
    key.trim().length > 0 && 
    !key.includes('YOUR_PROJECT_ID') && 
    !key.includes('YOUR_SUPABASE_ANON_KEY');

  // Normalization Helpers to bridge Supabase (snake_case) & NutriLearn UI (camelCase)
  function normalizeChild(c) {
    if (!c) return null;
    const name = c.name || (`${c.first_name || ''} ${c.last_name || ''}`).trim() || 'Child';
    return {
      ...c,
      id: c.id ? String(c.id) : ('ch-' + Date.now()),
      name: name,
      first_name: c.first_name || name.split(' ')[0] || 'Child',
      last_name: c.last_name || name.split(' ').slice(1).join(' ') || '',
      ageMonths: Number(c.ageMonths ?? c.age_months ?? 0),
      age_months: Number(c.age_months ?? c.ageMonths ?? 0),
      sex: c.sex || 'Male',
      parentName: c.parentName || c.parent_name || 'Guardian',
      parent_name: c.parent_name || c.parentName || 'Guardian',
      parentPhone: c.parentPhone || c.parent_phone || '',
      parent_phone: c.parent_phone || c.parentPhone || '',
      barangay: c.barangay || 'Barangay San Jose',
      heightCm: Number(c.heightCm ?? c.height_cm ?? 0),
      height_cm: Number(c.height_cm ?? c.heightCm ?? 0),
      weightKg: Number(c.weightKg ?? c.weight_kg ?? 0),
      weight_kg: Number(c.weight_kg ?? c.weightKg ?? 0),
      muacMm: Number(c.muacMm ?? c.muac_mm ?? 0),
      muac_mm: Number(c.muac_mm ?? c.muacMm ?? 0),
      status: c.status || 'Normal',
      hfaStatus: c.hfaStatus || c.hfa_status || 'Normal',
      hfa_status: c.hfa_status || c.hfaStatus || 'Normal',
      wfaStatus: c.wfaStatus || c.wfa_status || 'Normal',
      wfa_status: c.wfa_status || c.wfaStatus || 'Normal',
      wfhStatus: c.wfhStatus || c.wfh_status || 'Normal',
      wfh_status: c.wfh_status || c.wfhStatus || 'Normal',
      muacStatus: c.muacStatus || c.muac_status || 'Normal',
      muac_status: c.muac_status || c.muacStatus || 'Normal',
      improved: Boolean(c.improved),
      lastAssessed: c.lastAssessed || c.last_assessed || new Date().toISOString().split('T')[0],
      last_assessed: c.last_assessed || c.lastAssessed || new Date().toISOString().split('T')[0],
      notes: c.notes || '',
      completedModules: c.completedModules || [],
      quizScore: c.quizScore || 0
    };
  }

  function normalizeReport(r) {
    if (!r) return null;
    return {
      ...r,
      id: r.id ? String(r.id) : ('REP-' + Date.now()),
      reportId: r.reportId || r.report_code || `REP-${Date.now()}`,
      report_code: r.report_code || r.reportId || `REP-${Date.now()}`,
      barangay: r.barangay || 'Barangay San Jose',
      chwName: r.chwName || r.chw_name || 'BHW Lead',
      chw_name: r.chw_name || r.chwName || 'BHW Lead',
      submittedDate: r.submittedDate || r.submitted_date || new Date().toISOString().split('T')[0],
      submitted_date: r.submitted_date || r.submittedDate || new Date().toISOString().split('T')[0],
      totalChildren: Number(r.totalChildren ?? r.total_children ?? 0),
      total_children: Number(r.total_children ?? r.totalChildren ?? 0),
      stuntedCount: Number(r.stuntedCount ?? r.stunted_count ?? 0),
      stunted_count: Number(r.stunted_count ?? r.stuntedCount ?? 0),
      wastedCount: Number(r.wastedCount ?? r.wasted_count ?? 0),
      wasted_count: Number(r.wasted_count ?? r.wastedCount ?? 0),
      underweightCount: Number(r.underweightCount ?? r.underweight_count ?? 0),
      underweight_count: Number(r.underweight_count ?? r.underweightCount ?? 0),
      improvedCount: Number(r.improvedCount ?? r.improved_count ?? 0),
      improved_count: Number(r.improved_count ?? r.improvedCount ?? 0),
      stuntingRate: r.stuntingRate || r.stunting_rate || '0.0%',
      stunting_rate: r.stunting_rate || r.stuntingRate || '0.0%',
      stuntingReductionAchieved: r.stuntingReductionAchieved || r.stunting_reduction_achieved || '0.0%',
      stunting_reduction_achieved: r.stunting_reduction_achieved || r.stuntingReductionAchieved || '0.0%',
      status: r.status || 'Pending Review',
      notes: r.notes || ''
    };
  }

  function normalizeAnnouncement(a) {
    if (!a) return null;
    return {
      ...a,
      id: a.id ? String(a.id) : ('ann-' + Date.now()),
      title: a.title || 'Notice',
      content: a.content || '',
      category: a.category || 'General Notice',
      priority: a.priority || 'normal',
      authorName: a.authorName || a.author_name || 'Health Official',
      author_name: a.author_name || a.authorName || 'Health Official',
      authorRole: a.authorRole || a.author_role || 'mho',
      author_role: a.author_role || a.authorRole || 'mho',
      authorDesignation: a.authorDesignation || a.author_designation || 'Staff',
      author_designation: a.author_designation || a.authorDesignation || 'Staff',
      targetAudience: a.targetAudience || a.target_audience || 'both',
      target_audience: a.target_audience || a.targetAudience || 'both',
      targetBarangays: Array.isArray(a.targetBarangays) ? a.targetBarangays : (Array.isArray(a.target_barangays) ? a.target_barangays : []),
      target_barangays: Array.isArray(a.target_barangays) ? a.target_barangays : (Array.isArray(a.targetBarangays) ? a.targetBarangays : []),
      barangay: a.barangay || 'All Barangays',
      pinned: Boolean(a.pinned),
      createdAt: a.createdAt || a.created_at || new Date().toISOString(),
      created_at: a.created_at || a.createdAt || new Date().toISOString()
    };
  }

  // Visual UI Status Indicator Bridge
  function updateDatabaseStatusUI(status, label, detail = '') {
    const startupBadge = document.getElementById('startup-db-status');
    const startupText = document.getElementById('startup-db-status-text');
    const headerBadge = document.getElementById('header-db-status');
    const headerText = document.getElementById('header-db-status-text');

    let dotColor = '#16A34A';
    let headerDotColor = '#4ADE80';
    let bg = '#DCFCE7';
    let border = '#BBF7D0';
    let text = '#15803D';

    if (status === 'connecting') {
      dotColor = '#F59E0B';
      headerDotColor = '#FDE047';
      bg = '#FEF3C7';
      border = '#FDE68A';
      text = '#92400E';
    } else if (status === 'warning') {
      dotColor = '#F59E0B';
      headerDotColor = '#FBBF24';
      bg = '#FFFBEB';
      border = '#FDE68A';
      text = '#B45309';
    } else if (status === 'error') {
      dotColor = '#EF4444';
      headerDotColor = '#F87171';
      bg = '#FEE2E2';
      border = '#FECACA';
      text = '#B91C1C';
    } else if (status === 'offline') {
      dotColor = '#94A3B8';
      headerDotColor = '#CBD5E1';
      bg = '#F1F5F9';
      border = '#E2E8F0';
      text = '#475569';
    }

    if (startupBadge) {
      startupBadge.style.background = bg;
      startupBadge.style.borderColor = border;
      startupBadge.style.color = text;
      if (detail) startupBadge.title = detail;
      const dot = startupBadge.querySelector('.db-dot');
      if (dot) dot.style.background = dotColor;
    }
    if (startupText) startupText.textContent = label;

    if (headerBadge) {
      if (detail) headerBadge.title = detail;
      const dot = headerBadge.querySelector('.db-dot');
      if (dot) {
        dot.style.background = headerDotColor;
        dot.style.boxShadow = `0 0 6px ${headerDotColor}`;
      }
    }
    if (headerText) headerText.textContent = label;
  }

  async function testCloudConnection() {
    if (!client) return;
    try {
      const { data, error } = await client.from('children').select('id').limit(1);
      if (error) {
        if (error.code === '42501' || (error.message && error.message.includes('policy'))) {
          updateDatabaseStatusUI('warning', 'Cloud DB: RLS Protected', 'Supabase connected! Run SQL in Supabase Editor to allow public anon access.');
        } else {
          updateDatabaseStatusUI('error', 'Cloud DB: Error', error.message);
        }
      } else {
        updateDatabaseStatusUI('connected', 'Cloud DB: Connected', 'Supabase Cloud Database connected and ready.');
      }
    } catch (err) {
      updateDatabaseStatusUI('error', 'Cloud DB: Error', err.message);
    }
  }

  function initClient(forcedConfig = null) {
    const config = forcedConfig || window.NUTRI_CONFIG || {};

    const customUrl = localStorage.getItem('nutrilearn_custom_supabase_url');
    const customKey = localStorage.getItem('nutrilearn_custom_supabase_anon_key');

    const supabaseUrl = (isKeyValid(customUrl) ? customUrl : config.SUPABASE_URL) || '';
    const supabaseAnonKey = (isKeyValid(customKey) ? customKey : config.SUPABASE_ANON_KEY) || '';

    isConfigured = isKeyValid(supabaseUrl) && isKeyValid(supabaseAnonKey);

    if (isConfigured && window.supabase) {
      try {
        client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        if (window.NutriDb) {
          window.NutriDb.client = client;
        }
        console.log('✅ [Supabase] Connected to live cloud database via .env / config:', supabaseUrl);
        updateDatabaseStatusUI('connecting', 'Cloud DB: Connecting...');

        // Test live connection & update UI badge
        testCloudConnection();

        // Trigger initial sync with cloud
        if (typeof NutriStorage !== 'undefined' && typeof NutriStorage.syncWithSupabase === 'function') {
          NutriStorage.syncWithSupabase();
        }
      } catch (err) {
        console.error('❌ [Supabase] Initialization error:', err);
        updateDatabaseStatusUI('error', 'Cloud DB: Config Error', err.message);
      }
    } else {
      console.info('ℹ️ [Supabase] Running in local offline storage mode until .env / config keys are set.');
      updateDatabaseStatusUI('offline', 'Local Offline Mode', 'Operating in browser storage mode.');
    }
  }

  // Initial attempt
  initClient();

  // Listen for auto-load event from config.js (when .env is read asynchronously)
  window.addEventListener('nutriConfigReady', (e) => {
    initClient(e.detail);
  });

  // High-level Database Bridge for NutriLearn
  window.NutriDb = {
    // Raw Supabase client instance
    client: client,

    // Status helpers
    isConfigured: () => isConfigured && client !== null,
    isOnline: () => navigator.onLine,

    // Reconfigure keys dynamically at runtime
    setCredentials(url, anonKey) {
      if (!isKeyValid(url) || !isKeyValid(anonKey)) {
        throw new Error('Invalid Supabase URL or Anon Key provided.');
      }
      localStorage.setItem('nutrilearn_custom_supabase_url', url.trim());
      localStorage.setItem('nutrilearn_custom_supabase_anon_key', anonKey.trim());
      window.location.reload();
    },

    // Clear custom credentials
    clearCredentials() {
      localStorage.removeItem('nutrilearn_custom_supabase_url');
      localStorage.removeItem('nutrilearn_custom_supabase_anon_key');
      window.location.reload();
    },

    // ========================================================================
    // CHILDREN REGISTRY OPERATIONS
    // ========================================================================
    async getChildren(barangay = null) {
      if (!this.isConfigured() || !this.isOnline()) {
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getChildren() : [];
      }

      try {
        let query = client.from('children').select('*').order('last_assessed', { ascending: false });
        if (barangay && barangay !== 'All Barangays') {
          query = query.eq('barangay', barangay);
        }

        const { data, error } = await query;
        if (error) throw error;

        const normalized = (data || []).map(normalizeChild);
        return normalized;
      } catch (err) {
        console.warn('⚠️ [Supabase] Failed to fetch children, falling back to local cache:', err.message);
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getChildren() : [];
      }
    },

    async saveChild(childData) {
      if (!this.isConfigured() || !this.isOnline()) {
        return childData;
      }

      try {
        const payload = {
          first_name: childData.name ? childData.name.split(' ')[0] : (childData.first_name || 'Child'),
          last_name: childData.name ? childData.name.split(' ').slice(1).join(' ') : (childData.last_name || ''),
          age_months: Number(childData.ageMonths || childData.age_months || 0),
          sex: childData.sex || 'Male',
          parent_name: childData.parentName || childData.parent_name || 'Guardian',
          parent_phone: childData.parentPhone || childData.parent_phone || '',
          barangay: childData.barangay || 'Barangay San Jose',
          height_cm: Number(childData.heightCm || childData.height_cm || 0),
          weight_kg: Number(childData.weightKg || childData.weight_kg || 0),
          muac_mm: Number(childData.muacMm || childData.muac_mm || 0),
          status: childData.status || 'Normal',
          hfa_status: childData.hfaStatus || childData.hfa_status || 'Normal',
          wfh_status: childData.wfhStatus || childData.wfh_status || 'Normal',
          wfa_status: childData.wfaStatus || childData.wfa_status || 'Normal',
          muac_status: childData.muacStatus || childData.muac_status || 'Normal',
          improved: Boolean(childData.improved),
          last_assessed: childData.lastAssessed || new Date().toISOString().split('T')[0],
          notes: childData.notes || ''
        };

        const { data, error } = await client.from('children').insert([payload]).select();
        if (error) throw error;
        console.log('✅ [Supabase] Child saved to cloud database:', data[0]);
        return normalizeChild(data[0]);
      } catch (err) {
        console.warn('⚠️ [Supabase] Cloud save error:', err.message);
        return childData;
      }
    },

    async updateChild(childData) {
      if (!this.isConfigured() || !this.isOnline()) {
        return childData;
      }

      try {
        const payload = {
          age_months: Number(childData.ageMonths || childData.age_months || 0),
          height_cm: Number(childData.heightCm || childData.height_cm || 0),
          weight_kg: Number(childData.weightKg || childData.weight_kg || 0),
          muac_mm: Number(childData.muacMm || childData.muac_mm || 0),
          status: childData.status || 'Normal',
          hfa_status: childData.hfaStatus || childData.hfa_status || 'Normal',
          wfh_status: childData.wfhStatus || childData.wfh_status || 'Normal',
          wfa_status: childData.wfaStatus || childData.wfa_status || 'Normal',
          muac_status: childData.muacStatus || childData.muac_status || 'Normal',
          improved: Boolean(childData.improved),
          last_assessed: childData.lastAssessed || new Date().toISOString().split('T')[0],
          notes: childData.notes || ''
        };

        let query = client.from('children').update(payload);
        if (childData.id && !isNaN(childData.id)) {
          query = query.eq('id', Number(childData.id));
        } else {
          query = query.eq('first_name', childData.first_name || childData.name?.split(' ')[0]).eq('parent_name', childData.parentName || childData.parent_name);
        }

        const { data, error } = await query.select();
        if (error) throw error;
        console.log('✅ [Supabase] Child updated in cloud database:', data);
        return data && data[0] ? normalizeChild(data[0]) : childData;
      } catch (err) {
        console.warn('⚠️ [Supabase] Cloud update error:', err.message);
        return childData;
      }
    },

    // ========================================================================
    // MONTHLY REPORTS OPERATIONS
    // ========================================================================
    async getReports() {
      if (!this.isConfigured() || !this.isOnline()) {
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getReports() : [];
      }

      try {
        const { data, error } = await client
          .from('monthly_reports')
          .select('*')
          .order('submitted_date', { ascending: false });

        if (error) throw error;

        const normalized = (data || []).map(normalizeReport);
        return normalized;
      } catch (err) {
        console.warn('⚠️ [Supabase] Failed to fetch reports, falling back to local cache:', err.message);
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getReports() : [];
      }
    },

    async submitReport(reportData) {
      if (!this.isConfigured() || !this.isOnline()) {
        return reportData;
      }

      try {
        const payload = {
          report_code: reportData.reportId || reportData.report_code || `REP-${Date.now()}`,
          barangay: reportData.barangay,
          chw_name: reportData.chwName || reportData.chw_name || 'BHW Lead',
          submitted_date: reportData.submittedDate || new Date().toISOString().split('T')[0],
          total_children: Number(reportData.totalChildren || 0),
          stunted_count: Number(reportData.stuntedCount || 0),
          wasted_count: Number(reportData.wastedCount || 0),
          underweight_count: Number(reportData.underweightCount || 0),
          improved_count: Number(reportData.improvedCount || 0),
          stunting_rate: String(reportData.stuntingRate || '0%'),
          stunting_reduction_achieved: String(reportData.stuntingReductionAchieved || '0%'),
          status: reportData.status || 'Pending Review',
          notes: reportData.notes || ''
        };

        const { data, error } = await client.from('monthly_reports').insert([payload]).select();
        if (error) throw error;
        console.log('✅ [Supabase] Monthly report submitted to cloud:', data[0]);
        return normalizeReport(data[0]);
      } catch (err) {
        console.warn('⚠️ [Supabase] Cloud report submission error:', err.message);
        return reportData;
      }
    },

    // ========================================================================
    // ANNOUNCEMENTS OPERATIONS
    // ========================================================================
    async getAnnouncements() {
      if (!this.isConfigured() || !this.isOnline()) {
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getAnnouncements() : [];
      }

      try {
        const { data, error } = await client
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const normalized = (data || []).map(normalizeAnnouncement);
        return normalized;
      } catch (err) {
        console.warn('⚠️ [Supabase] Failed to fetch announcements, falling back to local cache:', err.message);
        return typeof NutriStorage !== 'undefined' ? NutriStorage.getAnnouncements() : [];
      }
    },

    async createAnnouncement(announcementData) {
      if (!this.isConfigured() || !this.isOnline()) {
        return announcementData;
      }

      try {
        const payload = {
          title: announcementData.title,
          content: announcementData.content,
          category: announcementData.category || 'General Notice',
          priority: announcementData.priority || 'normal',
          author_name: announcementData.authorName || announcementData.author_name || 'Health Official',
          author_role: announcementData.authorRole || announcementData.author_role || 'chw',
          author_designation: announcementData.authorDesignation || announcementData.author_designation || 'Nutrition Worker',
          target_audience: announcementData.targetAudience || announcementData.target_audience || 'both',
          target_barangays: announcementData.targetBarangays || announcementData.target_barangays || [],
          barangay: announcementData.barangay || 'All Barangays',
          pinned: Boolean(announcementData.pinned)
        };

        const { data, error } = await client.from('announcements').insert([payload]).select();
        if (error) throw error;
        console.log('✅ [Supabase] Announcement broadcasted to cloud:', data[0]);
        return normalizeAnnouncement(data[0]);
      } catch (err) {
        console.warn('⚠️ [Supabase] Cloud announcement broadcast error:', err.message);
        return announcementData;
      }
    },

    // ========================================================================
    // REAL-TIME LISTENERS (Live Updates for MHO & BHW)
    // ========================================================================
    subscribeToTable(table, onEventCallback) {
      if (!this.isConfigured()) return null;

      return client
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: table }, (payload) => {
          console.log(`⚡ [Supabase Realtime] Event on ${table}:`, payload);
          if (typeof onEventCallback === 'function') {
            onEventCallback(payload);
          }
        })
        .subscribe();
    }
  };

})();
