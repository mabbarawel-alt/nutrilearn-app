// ==========================================================================
// NUTRILEARN - ANNOUNCEMENT & BROADCAST MODULE
// Multi-Tiered Role Routing: Admin (Both Parent & BHW / BHW only)
// with Destination Barangay Selection (All Barangays vs Specific Barangays)
// BHW (Both Admin & Parent / Parent only), Parent (Read-only view)
// ==========================================================================

const AnnouncementsModule = {
  currentComposerRole: 'mho',
  activeParentCategoryFilter: 'ALL',
  activeBHWCategoryFilter: 'ALL',
  activeAdminCategoryFilter: 'ALL',
  activeAdminBarangayFilter: 'ALL',
  searchQueryParent: '',
  searchQueryBHW: '',
  searchQueryAdmin: '',

  init() {
    this.bindEvents();
    this.renderAllFeeds();
    this.renderDashboardWidgets();
  },

  bindEvents() {
    // Composer Form Submit
    const form = document.getElementById('announcement-composer-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePostSubmit(form);
      });
    }

    // Category Filter listeners
    const parentCatFilter = document.getElementById('parent-ann-category-filter');
    if (parentCatFilter) {
      parentCatFilter.addEventListener('change', (e) => {
        this.activeParentCategoryFilter = e.target.value;
        this.renderParentFeed();
      });
    }

    const bhwCatFilter = document.getElementById('bhw-ann-category-filter');
    if (bhwCatFilter) {
      bhwCatFilter.addEventListener('change', (e) => {
        this.activeBHWCategoryFilter = e.target.value;
        this.renderBHWFeed();
      });
    }

    const adminCatFilter = document.getElementById('admin-ann-category-filter');
    if (adminCatFilter) {
      adminCatFilter.addEventListener('change', (e) => {
        this.activeAdminCategoryFilter = e.target.value;
        this.renderAdminFeed();
      });
    }

    // Admin Barangay Filter listener
    const adminBrgyFilter = document.getElementById('admin-ann-barangay-filter');
    if (adminBrgyFilter) {
      adminBrgyFilter.addEventListener('change', (e) => {
        this.activeAdminBarangayFilter = e.target.value;
        this.renderAdminFeed();
      });
    }

    // Search listeners
    const parentSearch = document.getElementById('parent-ann-search-input');
    if (parentSearch) {
      parentSearch.addEventListener('input', (e) => {
        this.searchQueryParent = e.target.value.toLowerCase();
        this.renderParentFeed();
      });
    }

    const bhwSearch = document.getElementById('bhw-ann-search-input');
    if (bhwSearch) {
      bhwSearch.addEventListener('input', (e) => {
        this.searchQueryBHW = e.target.value.toLowerCase();
        this.renderBHWFeed();
      });
    }

    const adminSearch = document.getElementById('admin-ann-search-input');
    if (adminSearch) {
      adminSearch.addEventListener('input', (e) => {
        this.searchQueryAdmin = e.target.value.toLowerCase();
        this.renderAdminFeed();
      });
    }
  },

  // Open Composer Modal with Role-Specific Audience and Barangay Selectors
  openComposer(role = null) {
    const activeRole = role || NutriApp.currentRole || 'mho';
    this.currentComposerRole = activeRole;

    const modalTitle = document.getElementById('ann-composer-modal-title');
    const modalSubtitle = document.getElementById('ann-composer-modal-subtitle');
    const audienceContainer = document.getElementById('ann-composer-audience-options');
    const authorBadge = document.getElementById('ann-composer-author-badge');

    const currentUser = NutriStorage.getCurrentUser() || {};
    const authorName = currentUser.name || (activeRole === 'mho' ? 'Dr. Elena Cruz, MHO' : 'Sister Teresa Lim, BNS');

    if (authorBadge) {
      authorBadge.textContent = `Posting as: ${authorName} (${activeRole === 'mho' ? 'Administrator' : 'Barangay Health Worker'})`;
    }

    if (activeRole === 'mho') {
      // Administrator Audience & Barangay Destination Routing
      if (modalTitle) modalTitle.textContent = '📢 Post Official Municipal Announcement';
      if (modalSubtitle) modalSubtitle.textContent = 'Municipal Health Office • Select recipient group and destination barangay(s)';

      if (audienceContainer) {
        audienceContainer.innerHTML = `
          <!-- 1. Audience Selector -->
          <label class="form-label" style="font-weight: 700; color: var(--color-primary-900); display: block; margin-bottom: 0.5rem;">
            1. Select Target Recipient Group: <span style="color: #DC2626;">*</span>
          </label>
          <div class="audience-radio-grid">
            <label class="audience-radio-card active" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="both" checked style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">📢 Both PARENT &amp; BHW</div>
                <div class="audience-radio-desc">Broadcasts to all registered Parents/Caregivers and BHWs in the selected barangays.</div>
              </div>
            </label>

            <label class="audience-radio-card" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="bhw" style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">🔒 BHW Only (Internal Directive)</div>
                <div class="audience-radio-desc">Visible exclusively to Barangay Health Workers and BNS. Completely hidden from Parents.</div>
              </div>
            </label>
          </div>

          <!-- 2. Destination Barangay Selector with All Barangays Button -->
          <div style="margin-top: 1.25rem; padding: 1rem 1.15rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1.5px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <label class="form-label" style="font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.15rem; display: block;">
                  2. Select Destination Barangay(s): <span style="color: #DC2626;">*</span>
                </label>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">
                  Choose which barangays will receive this announcement, or click 'All Barangays' for municipality-wide broadcast.
                </div>
              </div>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <button type="button" class="btn btn-accent btn-sm" id="btn-toggle-all-barangays" onclick="AnnouncementsModule.selectAllBarangays()" title="Select all 4 barangays in municipality">
                  🌐 All Barangays
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="AnnouncementsModule.clearAllBarangays()" title="Clear selection">
                  Clear
                </button>
              </div>
            </div>

            <!-- Interactive Barangay Checkbox Grid -->
            <div class="barangay-checkbox-grid">
              <label class="barangay-checkbox-card active">
                <input type="checkbox" name="annTargetBarangay" value="Barangay San Jose" checked onchange="AnnouncementsModule.onBarangayCheckboxChange()">
                <span>Barangay San Jose</span>
              </label>
              <label class="barangay-checkbox-card active">
                <input type="checkbox" name="annTargetBarangay" value="Barangay Santa Maria" checked onchange="AnnouncementsModule.onBarangayCheckboxChange()">
                <span>Barangay Santa Maria</span>
              </label>
              <label class="barangay-checkbox-card active">
                <input type="checkbox" name="annTargetBarangay" value="Barangay San Isidro" checked onchange="AnnouncementsModule.onBarangayCheckboxChange()">
                <span>Barangay San Isidro</span>
              </label>
              <label class="barangay-checkbox-card active">
                <input type="checkbox" name="annTargetBarangay" value="Barangay Poblacion" checked onchange="AnnouncementsModule.onBarangayCheckboxChange()">
                <span>Barangay Poblacion</span>
              </label>
            </div>

            <div id="ann-barangay-selection-summary" style="font-size: 0.8rem; font-weight: 600; color: #166534; margin-top: 0.65rem;">
              📍 Target Destination: All 4 Barangays in Municipality (Everyone will receive this announcement)
            </div>
          </div>
        `;
      }
    } else if (activeRole === 'chw') {
      // BHW Audience Routing Options:
      if (modalTitle) modalTitle.textContent = '📢 Post Barangay Health Announcement';
      if (modalSubtitle) modalSubtitle.textContent = 'Barangay Health Center • Select distribution destination before publishing';

      const bhwBarangay = currentUser.barangay || 'Barangay San Jose';

      if (audienceContainer) {
        audienceContainer.innerHTML = `
          <label class="form-label" style="font-weight: 700; color: var(--color-primary-900); display: block; margin-bottom: 0.5rem;">
            1. Select Target Destination / Audience: <span style="color: #DC2626;">*</span>
          </label>
          <div class="audience-radio-grid">
            <label class="audience-radio-card active" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="admin_parent" checked style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">🌐 Both ADMIN and PARENT</div>
                <div class="audience-radio-desc">Broadcasts to your community Parents and escalates directly to Municipal Health Office supervisors.</div>
              </div>
            </label>

            <label class="audience-radio-card" onclick="AnnouncementsModule.selectRadioCard(this)">
              <input type="radio" name="annTargetAudience" value="parent" style="accent-color: var(--color-primary-700);">
              <div class="audience-radio-content">
                <div class="audience-radio-title">👨‍👩‍👧 PARENT Only</div>
                <div class="audience-radio-desc">Community bulletin intended exclusively for local Parents and Caregivers in your barangay.</div>
              </div>
            </label>
          </div>

          <div style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light); font-size: 0.82rem; color: var(--text-secondary);">
            📍 <strong>Originating Barangay:</strong> ${bhwBarangay} (Assigned Catchment Station)
          </div>
        `;
      }
    }

    NutriApp.openModal('modal-announcement-composer');
  },

  selectRadioCard(cardElem) {
    const parent = cardElem.parentElement;
    if (!parent) return;
    parent.querySelectorAll('.audience-radio-card').forEach(c => c.classList.remove('active'));
    cardElem.classList.add('active');
    const input = cardElem.querySelector('input[type="radio"]');
    if (input) input.checked = true;
  },

  // Button to Select All Barangays (Admin)
  selectAllBarangays() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      card.classList.add('active');
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
    });
    const btn = document.getElementById('btn-toggle-all-barangays');
    if (btn) {
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-accent');
    }
    this.updateBarangaySummary();
  },

  // Button to Clear Barangay Checkboxes (Admin)
  clearAllBarangays() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      card.classList.remove('active');
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
    });
    const btn = document.getElementById('btn-toggle-all-barangays');
    if (btn) {
      btn.classList.remove('btn-accent');
      btn.classList.add('btn-outline');
    }
    this.updateBarangaySummary();
  },

  // Checkbox Change Handler (Admin)
  onBarangayCheckboxChange() {
    const cards = document.querySelectorAll('.barangay-checkbox-card');
    cards.forEach(card => {
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) {
        card.classList.toggle('active', cb.checked);
      }
    });
    this.updateBarangaySummary();
  },

  // Update Visual Summary Indicator
  updateBarangaySummary() {
    const checkedBoxes = document.querySelectorAll('input[name="annTargetBarangay"]:checked');
    const summaryElem = document.getElementById('ann-barangay-selection-summary');
    const btn = document.getElementById('btn-toggle-all-barangays');

    if (!summaryElem) return;

    const total = 4;
    const count = checkedBoxes.length;

    if (count === total) {
      summaryElem.style.color = '#166534';
      summaryElem.textContent = '📍 Target Destination: All 4 Barangays in Municipality (Everyone will receive this announcement)';
      if (btn) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-accent');
      }
    } else if (count > 0) {
      const selectedNames = Array.from(checkedBoxes).map(cb => cb.value.replace('Barangay ', 'Brgy. ')).join(', ');
      summaryElem.style.color = '#1D4ED8';
      summaryElem.textContent = `📍 Target Destination: Specific (${count} of ${total}): ${selectedNames}`;
      if (btn) {
        btn.classList.remove('btn-accent');
        btn.classList.add('btn-outline');
      }
    } else {
      summaryElem.style.color = '#DC2626';
      summaryElem.textContent = '⚠️ Please select at least one barangay (or click "All Barangays" above).';
      if (btn) {
        btn.classList.remove('btn-accent');
        btn.classList.add('btn-outline');
      }
    }
  },

  // Form submission
  handlePostSubmit(form) {
    const title = form.elements['annTitle'] ? form.elements['annTitle'].value.trim() : '';
    const content = form.elements['annContent'] ? form.elements['annContent'].value.trim() : '';
    const category = form.elements['annCategory'] ? form.elements['annCategory'].value : 'General Notice';
    const priority = form.elements['annPriority'] ? form.elements['annPriority'].value : 'normal';
    
    const audienceInput = form.querySelector('input[name="annTargetAudience"]:checked');
    const targetAudience = audienceInput ? audienceInput.value : (this.currentComposerRole === 'mho' ? 'both' : 'admin_parent');

    if (!title || !content) {
      NutriApp.showToast('Please provide both an announcement title and content.', 'warning');
      return;
    }

    const currentUser = NutriStorage.getCurrentUser() || {};
    const authorName = currentUser.name || (this.currentComposerRole === 'mho' ? 'Dr. Elena Cruz, MHO' : 'Sister Teresa Lim, BNS');
    const authorDesignation = currentUser.designation || (this.currentComposerRole === 'mho' ? 'Municipal Health Officer' : 'Barangay Nutrition Scholar');

    // Extract Target Barangays
    let targetBarangays = [];
    let destinationLabel = 'All Barangays';

    if (this.currentComposerRole === 'mho') {
      const checkedBoxes = form.querySelectorAll('input[name="annTargetBarangay"]:checked');
      if (checkedBoxes.length === 0) {
        NutriApp.showToast('Please select at least one destination Barangay for this announcement.', 'warning');
        return;
      }
      checkedBoxes.forEach(cb => targetBarangays.push(cb.value));
      if (targetBarangays.length === 4) {
        destinationLabel = 'All Barangays';
      } else {
        destinationLabel = targetBarangays.join(', ');
      }
    } else {
      // BHW posts from their assigned barangay
      destinationLabel = currentUser.barangay || 'Barangay San Jose';
      targetBarangays = [destinationLabel];
    }

    const newPost = {
      title,
      content,
      category,
      priority,
      authorName,
      authorRole: this.currentComposerRole,
      authorDesignation,
      targetAudience,
      targetBarangays,
      barangay: destinationLabel,
      targetBarangaysDisplay: destinationLabel,
      pinned: priority === 'urgent'
    };

    NutriStorage.addAnnouncement(newPost);
    NutriApp.closeModal('modal-announcement-composer');
    form.reset();

    // Reset radio active class
    const firstCard = form.querySelector('.audience-radio-card');
    if (firstCard) this.selectRadioCard(firstCard);

    let audienceText = 'Both PARENT & BHW';
    if (targetAudience === 'bhw') audienceText = 'BHW Only';
    if (targetAudience === 'admin_parent') audienceText = 'Both ADMIN & PARENT';
    if (targetAudience === 'parent') audienceText = 'PARENT Only';

    NutriApp.showToast(`📢 Announcement published! Sent to: ${audienceText} • [${destinationLabel}]`, 'success');
    this.renderAllFeeds();
    this.renderDashboardWidgets();
  },

  deletePost(id) {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      NutriStorage.deleteAnnouncement(id);
      NutriApp.showToast('Announcement removed.', 'info');
      this.renderAllFeeds();
      this.renderDashboardWidgets();
    }
  },

  renderAllFeeds() {
    this.renderParentFeed();
    this.renderBHWFeed();
    this.renderAdminFeed();
  },

  // 1. Parent Feed (STRICTLY READ-ONLY, ONLY PARENT-ROUTED & RESIDENCE BARANGAY POSTS)
  renderParentFeed() {
    const container = document.getElementById('parent-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('parent');

    // Category filter
    if (this.activeParentCategoryFilter !== 'ALL') {
      posts = posts.filter(p => p.category === this.activeParentCategoryFilter);
    }

    // Search filter
    if (this.searchQueryParent) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(this.searchQueryParent) || 
        p.content.toLowerCase().includes(this.searchQueryParent) ||
        p.category.toLowerCase().includes(this.searchQueryParent) ||
        p.authorName.toLowerCase().includes(this.searchQueryParent) ||
        (p.barangay && p.barangay.toLowerCase().includes(this.searchQueryParent))
      );
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.1rem; color: var(--color-primary-900); margin-bottom: 0.25rem;">No Community Bulletins Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Check back later for feeding schedules, health center weigh-in dates, and nutrition advisories for your barangay.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildCardHtml(post, 'parent')).join('');
  },

  // 2. BHW Feed (BHW-ROUTED POSTS + COMPOSER TRIGGER)
  renderBHWFeed() {
    const container = document.getElementById('bhw-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('chw');

    // Category filter
    if (this.activeBHWCategoryFilter !== 'ALL') {
      posts = posts.filter(p => p.category === this.activeBHWCategoryFilter);
    }

    // Search filter
    if (this.searchQueryBHW) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(this.searchQueryBHW) || 
        p.content.toLowerCase().includes(this.searchQueryBHW) ||
        p.category.toLowerCase().includes(this.searchQueryBHW) ||
        p.authorName.toLowerCase().includes(this.searchQueryBHW) ||
        (p.barangay && p.barangay.toLowerCase().includes(this.searchQueryBHW))
      );
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.1rem; color: var(--color-primary-900); margin-bottom: 0.25rem;">No BHW Bulletins Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Click "+ Post Announcement" above to send notices to Parents or the Municipal Health Office.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildCardHtml(post, 'chw')).join('');
  },

  // 3. Admin Feed (ALL MUNICIPAL & ESCALATED POSTS + COMPOSER TRIGGER)
  renderAdminFeed() {
    const container = document.getElementById('admin-announcements-container');
    if (!container) return;

    let posts = NutriStorage.getAnnouncementsForRole('mho');

    // Category filter
    if (this.activeAdminCategoryFilter !== 'ALL') {
      posts = posts.filter(p => p.category === this.activeAdminCategoryFilter);
    }

    // Barangay filter
    if (this.activeAdminBarangayFilter !== 'ALL') {
      posts = posts.filter(p => 
        p.barangay === 'All Barangays' || 
        (p.targetBarangays && (p.targetBarangays.length >= 4 || p.targetBarangays.includes(this.activeAdminBarangayFilter))) ||
        (p.barangay && p.barangay.includes(this.activeAdminBarangayFilter))
      );
    }

    // Search filter
    if (this.searchQueryAdmin) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(this.searchQueryAdmin) || 
        p.content.toLowerCase().includes(this.searchQueryAdmin) ||
        p.category.toLowerCase().includes(this.searchQueryAdmin) ||
        p.authorName.toLowerCase().includes(this.searchQueryAdmin) ||
        (p.barangay && p.barangay.toLowerCase().includes(this.searchQueryAdmin))
      );
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="announcement-empty-state">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h4 style="font-size: 1.1rem; color: var(--color-primary-900); margin-bottom: 0.25rem;">No Municipal Broadcasts Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Click "+ Post Announcement" to publish official directives and distribution schedules.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.buildCardHtml(post, 'mho')).join('');
  },

  // Build Announcement Card HTML
  buildCardHtml(post, viewingRole) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Priority pill
    let priorityBadge = '';
    if (post.priority === 'urgent') {
      priorityBadge = '<span class="ann-priority-pill urgent">🚨 URGENT ACTION</span>';
    } else if (post.priority === 'high') {
      priorityBadge = '<span class="ann-priority-pill high">⚠️ IMPORTANT NOTICE</span>';
    } else {
      priorityBadge = '<span class="ann-priority-pill normal">ℹ️ GENERAL ADVISORY</span>';
    }

    // Target Audience Badge
    let audienceBadge = '';
    if (post.targetAudience === 'both') {
      audienceBadge = '<span class="ann-audience-badge badge-both">📢 Both Parent &amp; BHW</span>';
    } else if (post.targetAudience === 'bhw') {
      audienceBadge = '<span class="ann-audience-badge badge-bhw">🔒 BHW Only (Internal)</span>';
    } else if (post.targetAudience === 'admin_parent') {
      audienceBadge = '<span class="ann-audience-badge badge-admin-parent">🌐 Both Admin &amp; Parent</span>';
    } else if (post.targetAudience === 'parent') {
      audienceBadge = '<span class="ann-audience-badge badge-parent">👨‍👩‍👧 Parent Only</span>';
    }

    // Destination Barangay Badge
    let barangayBadge = '';
    const brgyText = post.barangay || (post.targetBarangays && post.targetBarangays.length >= 4 ? 'All Barangays' : post.targetBarangays?.join(', ')) || 'All Barangays';
    if (brgyText === 'All Barangays' || (post.targetBarangays && post.targetBarangays.length >= 4)) {
      barangayBadge = '<span class="ann-barangay-badge badge-all-barangays">🌐 All Barangays</span>';
    } else {
      barangayBadge = `<span class="ann-barangay-badge badge-specific-barangay">📍 ${brgyText}</span>`;
    }

    // Author Origin Badge
    const isMhoAuthor = post.authorRole === 'mho';
    const authorBadge = `
      <span class="ann-author-badge ${isMhoAuthor ? 'author-mho' : 'author-chw'}">
        ${isMhoAuthor ? '🏛️ Municipal Health Office' : '🩺 Barangay Health Worker'}
      </span>
    `;

    // Action buttons (Delete allowed for Admin or the authoring BHW, NEVER shown to Parents)
    let actionButtons = '';
    if (viewingRole === 'mho' || (viewingRole === 'chw' && post.authorRole === 'chw')) {
      actionButtons = `
        <button class="btn btn-sm btn-outline" style="color: #DC2626; border-color: #FCA5A5; font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="AnnouncementsModule.deletePost('${post.id}')" title="Delete announcement">
          🗑️ Delete
        </button>
      `;
    }

    return `
      <div class="announcement-card ${post.pinned ? 'pinned-card' : ''}">
        <div class="ann-card-header">
          <div class="ann-badges-row">
            ${priorityBadge}
            <span class="ann-category-pill">${post.category}</span>
            ${authorBadge}
            ${audienceBadge}
            ${barangayBadge}
          </div>
          <div class="ann-card-actions">
            ${actionButtons}
          </div>
        </div>

        <h3 class="ann-card-title">${post.title}</h3>
        <p class="ann-card-content">${post.content}</p>

        <div class="ann-card-footer">
          <div class="ann-author-info">
            <span class="ann-author-avatar">${isMhoAuthor ? '🏛️' : '🩺'}</span>
            <div>
              <strong style="color: var(--text-primary); font-size: 0.85rem;">${post.authorName}</strong>
              <div style="color: var(--text-muted); font-size: 0.75rem;">${post.authorDesignation || ''} • ${post.barangay || ''}</div>
            </div>
          </div>
          <div class="ann-date-text">
            📅 ${formattedDate}
          </div>
        </div>
      </div>
    `;
  },

  // Dashboard Previews (Latest 2 announcements for each portal)
  renderDashboardWidgets() {
    this.renderDashboardWidgetForRole('parent', 'parent-dash-announcements-list');
    this.renderDashboardWidgetForRole('chw', 'bhw-dash-announcements-list');
    this.renderDashboardWidgetForRole('mho', 'admin-dash-announcements-list');
  },

  renderDashboardWidgetForRole(role, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = NutriStorage.getAnnouncementsForRole(role).slice(0, 2);

    if (posts.length === 0) {
      container.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No active bulletins for your barangay at this time.
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(p => {
      let badgeClass = 'badge-normal';
      if (p.priority === 'urgent') badgeClass = 'badge-stunted';
      else if (p.priority === 'high') badgeClass = 'badge-wasted';

      const brgyBadge = p.barangay === 'All Barangays' ? '🌐 All Barangays' : `📍 ${p.barangay}`;

      return `
        <div style="padding: 0.75rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 0.6rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
            <strong style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.3;">${p.title}</strong>
            <div style="display:flex; gap:0.3rem; align-items:center;">
              <span class="badge ${badgeClass}" style="font-size: 0.7rem; white-space: nowrap;">${p.category}</span>
              <span style="font-size: 0.68rem; background: #E2E8F0; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${brgyBadge}</span>
            </div>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${p.content}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.73rem; color: var(--text-muted);">
            <span>By: ${p.authorName}</span>
            <span>📅 ${new Date(p.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.AnnouncementsModule = AnnouncementsModule;
