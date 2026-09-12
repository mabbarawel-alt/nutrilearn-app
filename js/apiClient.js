// ==============================================================================
// NUTRILEARN - UNIFIED REST API CLIENT (Backend on Render & Local)
// Offline-first bridge between UI and FastAPI Backend
// ==============================================================================

(function() {
  'use strict';

  // Base API URL detection (relative in production/Render, or localhost during local dev)
  const isLocalStatic = window.location.protocol === 'file:' || (window.location.port === '8085' && !window.location.pathname.startsWith('/api'));
  const API_BASE = window.NUTRI_API_BASE || (window.location.origin.includes('localhost:8085') ? 'http://localhost:8085/api' : '/api');

  window.NutriApi = {
    baseUrl: API_BASE,
    isAvailable: false,

    async checkHealth() {
      try {
        const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          this.isAvailable = true;
          console.log('🚀 [NutriApi] Backend API is ONLINE:', this.baseUrl);
          return true;
        }
      } catch (e) {
        this.isAvailable = false;
        console.info('ℹ️ [NutriApi] Backend API not reachable, falling back to local/client storage.');
      }
      return false;
    },

    // --------------------------------------------------------------------------
    // Children Registry API
    // --------------------------------------------------------------------------
    async getChildren(barangay = null) {
      if (this.isAvailable) {
        try {
          let url = `${this.baseUrl}/children`;
          if (barangay && barangay !== 'All Barangays') {
            url += `?barangay=${encodeURIComponent(barangay)}`;
          }
          const res = await fetch(url);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getChildren failed, falling back to local cache:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getChildren() : [];
    },

    async saveChild(childData) {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/children`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
          if (res.ok) {
            const data = await res.json();
            console.log('✅ [NutriApi] Child saved via backend API:', data);
            return data;
          }
        } catch (e) {
          console.warn('API saveChild error, saving locally:', e);
        }
      }
      return childData;
    },

    async updateChild(childData) {
      if (this.isAvailable && childData.id) {
        try {
          const res = await fetch(`${this.baseUrl}/children/${childData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API updateChild error:', e);
        }
      }
      return childData;
    },

    // --------------------------------------------------------------------------
    // Monthly Reports API
    // --------------------------------------------------------------------------
    async getReports() {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/reports`);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getReports error:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getReports() : [];
    },

    async submitReport(reportData) {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
          });
          if (res.ok) {
            const data = await res.json();
            console.log('✅ [NutriApi] Report submitted via backend API:', data);
            return data;
          }
        } catch (e) {
          console.warn('API submitReport error:', e);
        }
      }
      return reportData;
    },

    // --------------------------------------------------------------------------
    // Announcements API
    // --------------------------------------------------------------------------
    async getAnnouncements() {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/announcements`);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getAnnouncements error:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getAnnouncements() : [];
    },

    async createAnnouncement(annData) {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(annData)
          });
          if (res.ok) {
            const data = await res.json();
            console.log('✅ [NutriApi] Announcement created via backend API:', data);
            return data;
          }
        } catch (e) {
          console.warn('API createAnnouncement error:', e);
        }
      }
      return annData;
    },

    async deleteAnnouncement(annId) {
      if (this.isAvailable && annId) {
        try {
          const res = await fetch(`${this.baseUrl}/announcements/${annId}`, {
            method: 'DELETE'
          });
          if (res.ok) return true;
        } catch (e) {
          console.warn('API deleteAnnouncement error:', e);
        }
      }
      return true;
    }
  };

  // Perform initial health check
  NutriApi.checkHealth();

})();
