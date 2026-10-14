/**
 * Perzo Trial Widget - Persona-Based Content Personalization
 * Split-Screen Modal with Right-Side Floating Button
 */

(function() {
  'use strict';

  // Configuration
  const PERSONAS = [
    {
      id: 'it-leadership',
      title: 'IT Leadership',
      subtitle: 'CIO • Platform Director • VP of Technology',
      description: 'Drive faster AEM delivery, reduce staffing bottlenecks, and scale your platform confidently. Get actionable strategies for platform modernization without the ramp-up delays.',
      color: '#4f46e5'
    },
    {
      id: 'architect',
      title: 'Solution Architect',
      subtitle: 'AEM Architect • Technical Lead • Engineering Lead',
      description: 'Make smarter technical decisions with proven implementation patterns, governance frameworks, and delivery strategies. Build robust architectures with confidence.',
      color: '#0B8FA3'
    },
    {
      id: 'digital-executive',
      title: 'Digital Executive',
      subtitle: 'Chief Digital Officer • VP of Marketing • Experience Lead',
      description: 'Unlock higher engagement, reduce friction, and drive measurable business impact. Discover how personalization and data-driven insights elevate your digital experiences.',
      color: '#d97706'
    }
  ];

  const STORAGE_KEY = 'perzo_trial_dismissed';
  const STORAGE_PERSONA = 'perzo_selected_persona';

  // Check if widget should be shown
  function shouldShowWidget() {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return false;
    }
    return true;
  }

  // Create floating button HTML
  function createButton() {
    const button = document.createElement('button');
    button.id = 'perzo-floating-btn';
    button.textContent = 'This site adapts to your Role. Let it';
    return button;
  }

  // Create initial choice modal (Path selection) - same layout as consulting modal
  function createChoiceModal() {
    const modal = document.createElement('div');
    modal.id = 'perzo-choice-modal';
    modal.innerHTML = `
      <div class="perzo-modal-backdrop"></div>
      <div class="perzo-modal-inner">
        <div class="perzo-modal-header">
          <div>
            <h2 class="perzo-modal-header-title">Choose your focus</h2>
            <p class="perzo-modal-header-subtitle">Personalize content to your role</p>
          </div>
          <button class="perzo-modal-close" aria-label="Close" id="perzo-choice-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="perzo-modal-left">
          <div class="perzo-modal-list">
            <div class="perzo-modal-list-item selected" data-path-id="consulting">
              <div class="perzo-modal-list-color" style="background-color: #4f46e5;"></div>
              <div class="perzo-modal-list-info">
                <div class="perzo-modal-list-title">Optimize Your AEM Platform</div>
                <div class="perzo-modal-list-subtitle">Consulting & Architecture</div>
              </div>
            </div>
            <div class="perzo-modal-list-item" data-path-id="staffing">
              <div class="perzo-modal-list-color" style="background-color: #0B8FA3;"></div>
              <div class="perzo-modal-list-info">
                <div class="perzo-modal-list-title">Hire AEM Talent</div>
                <div class="perzo-modal-list-subtitle">Staffing & Placements</div>
              </div>
            </div>
          </div>
        </div>
        <div class="perzo-modal-right">
          <div class="perzo-modal-right-content" id="perzo-choice-detail-pane"></div>
          <div class="perzo-modal-right-footer">
            <div class="perzo-modal-action-zone">
              <button class="perzo-modal-button perzo-modal-button-primary" id="perzo-choice-confirm-btn">Continue</button>
              <button class="perzo-modal-button-link" id="perzo-choice-skip-btn">Skip for now</button>
            </div>
            <div class="perzo-modal-info-zone">
              <p class="perzo-modal-privacy-notice">Your choices stay on this device and are never shared.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  // Create consulting personas modal HTML
  function createConsultingModal() {
    const modal = document.createElement('div');
    modal.id = 'perzo-selection-modal';

    const personasHTML = PERSONAS.map((persona, index) => `
      <div class="perzo-modal-list-item ${index === 0 ? 'selected' : ''}" data-persona-id="${persona.id}">
        <div class="perzo-modal-list-color" style="background-color: ${persona.color};"></div>
        <div class="perzo-modal-list-info">
          <div class="perzo-modal-list-title">${persona.title}</div>
          <div class="perzo-modal-list-subtitle">${persona.subtitle}</div>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="perzo-modal-backdrop"></div>
      <div class="perzo-modal-inner">
        <div class="perzo-modal-header">
          <div>
            <h2 class="perzo-modal-header-title">What brings you here today?</h2>
            <p class="perzo-modal-header-subtitle">Select the option that best describes your focus</p>
          </div>
          <div class="perzo-modal-header-actions">
            <button class="perzo-modal-back" aria-label="Back" id="perzo-consulting-back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button class="perzo-modal-close" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="perzo-modal-left">
          <div class="perzo-modal-list">
            ${personasHTML}
          </div>
        </div>
        <div class="perzo-modal-right">
          <div class="perzo-modal-right-content" id="perzo-detail-pane"></div>
          <div class="perzo-modal-right-footer">
            <div class="perzo-modal-action-zone">
              <button class="perzo-modal-button perzo-modal-button-primary" id="perzo-confirm-btn">Let's get started</button>
              <button class="perzo-modal-button-link" id="perzo-skip-btn">Skip personalization. I'll try later.</button>
            </div>
            <div class="perzo-modal-info-zone">
              <p class="perzo-modal-privacy-notice">Your choices stay on this device and are never shared.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  // Create and inject styles
  function injectStyles() {
    const styleId = 'perzo-button-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

      /* Floating Button */
      #perzo-floating-btn {
        position: fixed;
        bottom: 85px;
        right: 40px;
        z-index: 9998;
        background: #0B8FA3;
        color: white;
        border: none;
        padding: 14px 20px;
        border-radius: 8px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(11, 143, 163, 0.35);
        transition: all 0.3s ease-out;
        max-width: 200px;
        text-align: left;
        line-height: 1.4;
        animation: perzo-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both;
      }

      @keyframes perzo-slide-in {
        from {
          transform: translateX(100px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      #perzo-floating-btn:hover {
        background: #066d7e;
        box-shadow: 0 16px 48px rgba(11, 143, 163, 0.5);
        transform: scale(1.12);
      }

      @media (max-width: 768px) {
        #perzo-floating-btn {
          bottom: 75px;
          right: 24px;
          max-width: 160px;
          font-size: 12px;
          padding: 12px 16px;
        }
      }

      /* Modal */
      #perzo-selection-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      #perzo-selection-modal.active {
        display: flex;
      }

      .perzo-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0);
        backdrop-filter: blur(0px);
        transition: all 0.4s ease-out;
      }

      #perzo-selection-modal.active .perzo-modal-backdrop,
      #perzo-choice-modal.active .perzo-modal-backdrop {
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(8px);
      }

      .perzo-modal-inner {
        position: relative;
        background: white;
        width: 100%;
        max-width: 900px;
        height: 480px;
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 300px 1fr;
        overflow: hidden;
        box-shadow: 0 25px 100px rgba(0, 0, 0, 0.2);
        animation: perzo-modal-zoom 0.4s cubic-bezier(0.25, 0, 0, 1);
        z-index: 2;
      }

      @keyframes perzo-modal-zoom {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Modal Left Pane - List */
      .perzo-modal-left {
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e5e7eb;
        background: #f9fafb;
        overflow: hidden;
        grid-row: 2;
        grid-column: 1;
      }

      /* Modal Header - Full Width */
      .perzo-modal-header {
        grid-column: 1 / -1;
        padding: 28px 32px;
        border-bottom: 1px solid #e5e7eb;
        background: white;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .perzo-modal-header-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px 0;
      }

      .perzo-modal-header-subtitle {
        font-size: 13px;
        color: #6b7280;
        margin: 0;
        font-weight: 500;
      }

      .perzo-modal-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .perzo-modal-list-item {
        padding: 16px 20px;
        cursor: pointer;
        border-left: 4px solid transparent;
        transition: background-color 0.2s ease-out;
        display: flex;
        align-items: center;
        gap: 12px;
        background: transparent;
        border: none;
        text-align: left;
      }

      .perzo-modal-list-item:hover {
        background: #f3f4f6;
      }

      .perzo-modal-list-item.selected {
        background: white;
        border-left-color: currentColor;
      }

      .perzo-modal-list-color {
        width: 4px;
        height: 40px;
        flex-shrink: 0;
      }

      .perzo-modal-list-info {
        flex: 1;
      }

      .perzo-modal-list-title {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .perzo-modal-list-subtitle {
        font-size: 11px;
        color: #9ca3af;
        margin: 4px 0 0 0;
      }

      /* Modal Right Pane - Detail */
      .perzo-modal-right {
        display: flex;
        flex-direction: column;
        position: relative;
        background: white;
        grid-row: 2;
        grid-column: 2;
      }

      .perzo-modal-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .perzo-modal-back,
      .perzo-modal-close {
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .perzo-modal-back:hover,
      .perzo-modal-close:hover {
        background: #f3f4f6;
        color: #111827;
      }

      .perzo-modal-right-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px 32px 0 32px;
        opacity: 1;
        transition: opacity 0.3s ease-out;
      }

      .perzo-modal-right-content.fade-out {
        opacity: 0;
      }

      .perzo-modal-detail-title {
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .perzo-modal-detail-subtitle {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #9ca3af;
        margin: 0 0 14px 0;
      }

      .perzo-modal-detail-description {
        font-size: 13px;
        line-height: 1.7;
        color: #4b5563;
        margin: 0;
      }

      /* Modal Right Footer */
      .perzo-modal-right-footer {
        margin-top: auto;
        display: flex;
        flex-direction: column;
      }

      /* Action Zone - Buttons */
      .perzo-modal-action-zone {
        padding: 28px 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: flex-end;
      }

      .perzo-modal-button {
        padding: 12px 40px;
        border: none;
        border-radius: 6px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .perzo-modal-button-primary {
        background: #4f46e5;
        color: white;
        min-width: 160px;
        text-align: center;
      }

      .perzo-modal-button-primary:hover {
        background: #4338ca;
        transform: translateY(-2px);
      }

      .perzo-modal-button-link {
        background: transparent;
        border: none;
        color: #6b7280;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        padding: 6px 0;
        transition: all 0.2s;
        line-height: 1.4;
      }

      .perzo-modal-button-link:hover {
        color: #111827;
      }

      /* Info Zone - Privacy Notice */
      .perzo-modal-info-zone {
        padding: 20px 32px;
        background: #fafbfc;
        border-top: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .perzo-modal-privacy-notice {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 12px;
        color: #9ca3af;
        margin: 0;
        text-align: center;
        font-weight: 400;
        line-height: 1.6;
      }

      /* Scrollbar */
      .perzo-modal-list::-webkit-scrollbar,
      .perzo-modal-right-content::-webkit-scrollbar {
        width: 6px;
      }

      .perzo-modal-list::-webkit-scrollbar-track,
      .perzo-modal-right-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .perzo-modal-list::-webkit-scrollbar-thumb,
      .perzo-modal-right-content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }

      .perzo-modal-list::-webkit-scrollbar-thumb:hover,
      .perzo-modal-right-content::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .perzo-modal-inner {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto 1fr;
          height: auto;
          max-height: 80vh;
        }

        .perzo-modal-left {
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          max-height: 200px;
          grid-column: 1;
          grid-row: 2;
        }

        .perzo-modal-right {
          grid-column: 1;
          grid-row: 3;
        }

        .perzo-modal-right-content {
          padding: 24px 24px 0 24px;
        }

        .perzo-modal-right-footer {
          padding: 16px 24px 20px 24px;
        }

        .perzo-modal-detail-title {
          font-size: 20px;
        }
      }

      /* Accessibility */
      .perzo-modal-list-item:focus-visible {
        outline: 2px solid #4f46e5;
        outline-offset: -2px;
      }

      /* Choice Modal */
      #perzo-choice-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      #perzo-choice-modal.active {
        display: flex;
      }

    `;
    document.head.appendChild(style);
  }

  // Update detail pane with smooth fade transition
  function updateDetailPane(persona) {
    const detailPane = document.getElementById('perzo-detail-pane');
    detailPane.classList.add('fade-out');

    setTimeout(() => {
      detailPane.innerHTML = `
        <h3 class="perzo-modal-detail-title" style="color: ${persona.color};">${persona.title}</h3>
        <p class="perzo-modal-detail-subtitle">${persona.subtitle}</p>
        <p class="perzo-modal-detail-description">${persona.description}</p>
      `;
      detailPane.classList.remove('fade-out');
    }, 150);
  }

  // Create sticky persona bar with dropdown
  function createStickyPersonaBar(personaTitle, personaId) {
    const bar = document.createElement('div');
    bar.id = 'perzo-sticky-persona-bar';
    bar.innerHTML = `
      <div class="perzo-sticky-bar-inner">
        <div class="perzo-sticky-bar-content">
          <div class="perzo-sticky-bar-main">
            <span class="perzo-sticky-bar-text">Viewing Personalized Content as <strong>${personaTitle}</strong></span>
            <span class="perzo-sticky-bar-divider"></span>
            <div class="perzo-dropdown-wrapper">
              <button class="perzo-sticky-bar-link perzo-dropdown-trigger" id="perzo-recommended-trigger">
                Recommended Reading <span class="perzo-dropdown-icon">▼</span>
              </button>
              <div class="perzo-dropdown-menu perzo-recommended-menu" id="perzo-recommended-menu">
                <div class="perzo-dropdown-loading">Loading resources...</div>
              </div>
            </div>
            <span class="perzo-sticky-bar-divider"></span>
            <a href="#" class="perzo-sticky-bar-link" id="perzo-reset-content">Show default content</a>
          </div>
        </div>
      </div>
    `;
    return bar;
  }

  // Show staffing flow
  function showStaffingFlow() {
    // Remove existing persona bar if any
    const existingBar = document.getElementById('perzo-sticky-persona-bar');
    if (existingBar) {
      existingBar.remove();
    }

    // Switch page content to staffing persona
    if (window.ContentManager) {
      ContentManager.updateDOMContentWithShimmer('staffing');
    }

    // Create staffing bar with dropdown
    const staffingBar = document.createElement('div');
    staffingBar.id = 'perzo-sticky-persona-bar';
    staffingBar.innerHTML = `
      <div class="perzo-sticky-bar-inner">
        <div class="perzo-sticky-bar-content">
          <div class="perzo-sticky-bar-main">
            <span class="perzo-sticky-bar-text">Viewing <strong>Hiring AEM Talent</strong></span>
            <span class="perzo-sticky-bar-divider"></span>
            <div class="perzo-dropdown-wrapper">
              <button class="perzo-sticky-bar-link perzo-dropdown-trigger" id="perzo-staffing-roles-trigger">
                Browse Talent <span class="perzo-dropdown-icon">▼</span>
              </button>
              <div class="perzo-dropdown-menu perzo-staffing-menu" id="perzo-staffing-menu">
                <div class="perzo-dropdown-loading">Loading roles...</div>
              </div>
            </div>
            <span class="perzo-sticky-bar-divider"></span>
            <a href="#" class="perzo-sticky-bar-link" id="perzo-back-to-choice">View other options</a>
          </div>
        </div>
      </div>
    `;

    // Insert after nav
    const nav = document.querySelector('nav');
    if (nav && nav.nextSibling) {
      nav.parentNode.insertBefore(staffingBar, nav.nextSibling);
    } else if (nav) {
      nav.parentNode.appendChild(staffingBar);
    }

    // Setup dropdown functionality for staffing roles
    const dropdownTrigger = document.getElementById('perzo-staffing-roles-trigger');
    const dropdownMenu = document.getElementById('perzo-staffing-menu');

    if (dropdownTrigger && dropdownMenu) {
      // Toggle dropdown visibility
      dropdownTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownTrigger.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownTrigger.classList.remove('active');
          dropdownMenu.classList.remove('active');
        }
      });

      // Populate dropdown with staffing roles
      populateStaffingRoles(dropdownMenu);
    }

    // Handle back button - return to choice modal
    const backBtn = document.getElementById('perzo-back-to-choice');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove staffing bar
        const existingBar = document.getElementById('perzo-sticky-persona-bar');
        if (existingBar) {
          existingBar.remove();
        }

        // Reset content to default
        if (window.ContentManager) {
          ContentManager.updateDOMContentWithShimmer(ContentManager.PERSONAS.DEFAULT);
        }

        // Show choice modal
        const choiceModal = document.getElementById('perzo-choice-modal');
        if (choiceModal) {
          choiceModal.classList.add('active');
        }

        if (window.gtag) {
          gtag('event', 'perzo_staffing_back_to_choice');
        }
      });
    }

    // Log staffing flow view
    if (window.gtag) {
      gtag('event', 'perzo_staffing_flow_opened', {
        flow: 'staffing'
      });
    }

    sessionStorage.setItem(STORAGE_PERSONA, 'staffing');
    console.log('User viewing staffing flow');
  }

  // Populate staffing roles dropdown with role information
  function populateStaffingRoles(dropdownMenu) {
    // Get content for staffing persona from ContentManager
    if (!window.ContentManager) {
      dropdownMenu.innerHTML = '<div class="perzo-dropdown-loading">Roles unavailable</div>';
      return;
    }

    const content = window.ContentManager.getContent('staffing');

    // Build dropdown items from AEM Staffing section content
    const roles = [
      {
        title: content.asp_role_1_title,
        body: content.asp_role_1_body
      },
      {
        title: content.asp_role_2_title,
        body: content.asp_role_2_body
      },
      {
        title: content.asp_role_3_title,
        body: content.asp_role_3_body
      },
      {
        title: content.asp_role_4_title,
        body: content.asp_role_4_body
      },
      {
        title: content.asp_role_5_title,
        body: content.asp_role_5_body
      }
    ];

    // Clear loading state and build items HTML
    dropdownMenu.innerHTML = roles.map((role, index) => `
      <button class="perzo-dropdown-item" data-role-index="${index}">
        <p class="perzo-dropdown-item-type">Open Role</p>
        <p class="perzo-dropdown-item-title">${role.title}</p>
      </button>
    `).join('');

    // Add click handlers to jump to staffing section
    dropdownMenu.querySelectorAll('.perzo-dropdown-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        // Close dropdown
        const trigger = document.getElementById('perzo-staffing-roles-trigger');
        if (trigger) {
          trigger.classList.remove('active');
          dropdownMenu.classList.remove('active');
        }

        // Scroll to AEM Staffing section
        const staffingSection = document.querySelector('[data-content="asp_heading"]');
        if (staffingSection) {
          staffingSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Fire analytics event
        if (window.gtag) {
          gtag('event', 'perzo_staffing_role_clicked', {
            role_index: index,
            role_title: roles[index].title
          });
        }

        console.log(`User clicked role: ${roles[index].title}`);
      });
    });
  }

  // Inject sticky bar styles
  function injectStickyBarStyles() {
    const styleId = 'perzo-sticky-bar-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #perzo-sticky-persona-bar {
        position: sticky;
        top: 75px;
        left: 0;
        right: 0;
        z-index: 999;
        background: linear-gradient(135deg, #ecf9fb 0%, #f5fbfc 100%);
        border-bottom: 1px solid #bfe5ed;
        padding: 14px 0;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 2px 8px rgba(11, 143, 163, 0.08);
        box-shadow: 0 2px 8px rgba(11, 143, 163, 0.08);
      }

      .perzo-sticky-bar-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 40px;
      }

      .perzo-sticky-bar-content {
        display: flex;
        align-items: center;
      }

      .perzo-sticky-bar-main {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .perzo-sticky-bar-text {
        font-size: 13px;
        color: #4b5563;
        font-weight: 500;
      }

      .perzo-sticky-bar-text strong {
        font-weight: 700;
        color: #111827;
      }

      .perzo-sticky-bar-divider {
        width: 1px;
        height: 16px;
        background: #d1d5db;
      }

      .perzo-sticky-bar-link {
        font-size: 12px;
        color: #0B8FA3;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.2s;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .perzo-sticky-bar-link:hover {
        color: #066d7e;
        text-decoration: underline;
      }

      /* Dropdown Wrapper */
      .perzo-dropdown-wrapper {
        position: relative;
      }

      .perzo-dropdown-trigger {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .perzo-dropdown-icon {
        font-size: 10px;
        transition: transform 0.2s;
      }

      .perzo-dropdown-trigger.active .perzo-dropdown-icon {
        transform: rotate(180deg);
      }

      /* Dropdown Menu */
      .perzo-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
        min-width: 320px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1001;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: all 0.2s ease-out;
        padding: 12px 16px;
      }

      .perzo-dropdown-menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      /* Dropdown Loading State */
      .perzo-dropdown-loading {
        padding: 16px;
        text-align: center;
        color: #9ca3af;
        font-size: 13px;
      }

      /* Dropdown Items */
      .perzo-dropdown-item {
        padding: 0;
        margin: 0;
        border: none !important;
        background: none !important;
        text-align: left;
        cursor: pointer;
        transition: color 0.2s;
        display: block;
        width: 100%;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .perzo-dropdown-item:hover {
        background: none !important;
      }

      .perzo-dropdown-item:hover .perzo-dropdown-item-title {
        color: #066d7e;
        text-decoration: underline;
      }

      .perzo-dropdown-item-title {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        margin: 6px 0;
        line-height: 1.4;
        transition: color 0.2s;
      }

      .perzo-dropdown-item-type {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #0B8FA3;
        font-weight: 600;
        margin: 0 0 2px 0;
      }

      /* Scrollbar */
      .perzo-dropdown-menu::-webkit-scrollbar {
        width: 6px;
      }

      .perzo-dropdown-menu::-webkit-scrollbar-track {
        background: transparent;
      }

      .perzo-dropdown-menu::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }

      .perzo-dropdown-menu::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      @media (max-width: 768px) {
        #perzo-sticky-persona-bar {
          top: 65px;
        }

        .perzo-sticky-bar-inner {
          padding: 0 24px;
        }

        .perzo-sticky-bar-main {
          flex-wrap: wrap;
          gap: 10px;
        }

        .perzo-sticky-bar-text {
          font-size: 12px;
        }

        .perzo-sticky-bar-divider {
          display: none;
        }

        .perzo-dropdown-menu {
          min-width: 280px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Populate recommended reading dropdown with Intelligence content for persona
  function populateRecommendedReading(personaId, dropdownMenu) {
    // Get content for this persona from ContentManager
    if (!window.ContentManager) {
      dropdownMenu.innerHTML = '<div class="perzo-dropdown-loading">Intelligence content unavailable</div>';
      return;
    }

    const content = window.ContentManager.getContent(personaId);

    // Build dropdown items from Intelligence section content
    const items = [
      {
        title: content.intel_card_1_title,
        type: content.intel_card_1_type || 'Insight'
      },
      {
        title: content.intel_card_2_title,
        type: content.intel_card_2_type || 'Insight'
      },
      {
        title: content.intel_card_3_title,
        type: content.intel_card_3_type || 'Insight'
      }
    ];

    // Clear loading state and build items HTML
    dropdownMenu.innerHTML = items.map((item, index) => `
      <button class="perzo-dropdown-item" data-intel-card="${index + 1}">
        <p class="perzo-dropdown-item-type">${item.type}</p>
        <p class="perzo-dropdown-item-title">${item.title}</p>
      </button>
    `).join('');

    // Add click handlers to jump to Intelligence section
    dropdownMenu.querySelectorAll('.perzo-dropdown-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        // Close dropdown
        const trigger = document.getElementById('perzo-recommended-trigger');
        if (trigger) {
          trigger.classList.remove('active');
          dropdownMenu.classList.remove('active');
        }

        // Scroll to Intelligence section
        const intelSection = document.querySelector('[data-content="intel_headline"]');
        if (intelSection) {
          intelSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Fire analytics event
        if (window.gtag) {
          gtag('event', 'perzo_intelligence_clicked', {
            persona_id: personaId,
            card_index: index + 1
          });
        }

        console.log(`User clicked Intelligence card ${index + 1} for persona: ${personaId}`);
      });
    });
  }

  // Initialize widget
  function init() {
    injectStyles();
    injectStickyBarStyles();

    if (!shouldShowWidget()) {
      return;
    }

    // Create and append button
    const button = createButton();
    document.body.appendChild(button);

    // Create and append consulting modal
    const modal = createConsultingModal();
    document.body.appendChild(modal);

    // Get elements
    const btnEl = document.getElementById('perzo-floating-btn');
    const modalEl = document.getElementById('perzo-selection-modal');
    const backdrop = document.querySelector('.perzo-modal-backdrop');
    const closeBtn = document.querySelector('.perzo-modal-close');
    const listItems = document.querySelectorAll('.perzo-modal-list-item');
    const confirmBtn = document.getElementById('perzo-confirm-btn');
    const skipBtn = document.getElementById('perzo-skip-btn');

    let selectedPersonaId = PERSONAS[0].id;

    // Load first persona on modal open
    function loadFirstPersona() {
      const firstPersona = PERSONAS[0];
      updateDetailPane(firstPersona);
    }

    // Create choice modal
    const choiceModalEl = createChoiceModal();
    document.body.appendChild(choiceModalEl);

    // Get choice modal elements
    const choiceCloseBtn = document.getElementById('perzo-choice-close');
    const choiceConfirmBtn = document.getElementById('perzo-choice-confirm-btn');
    const choiceSkipBtn = document.getElementById('perzo-choice-skip-btn');
    const choiceDetailPane = document.getElementById('perzo-choice-detail-pane');
    const choicePathItems = choiceModalEl.querySelectorAll('.perzo-modal-list-item');
    const choiceBackdrop = choiceModalEl.querySelector('.perzo-modal-backdrop');

    let selectedPath = 'consulting';

    // Path descriptions
    const pathDescriptions = {
      consulting: {
        title: 'Platform Leadership',
        subtitle: 'For IT Leaders & Architects',
        description: 'Content and resources tailored to your role: platform strategy, technical architecture, delivery optimization, and enterprise AEM expertise. View perspectives and thinking aligned to your priorities.'
      },
      staffing: {
        title: 'Talent & Hiring',
        subtitle: 'For Hiring Managers',
        description: 'Resources and guidance for building AEM teams: role descriptions, talent evaluation frameworks, team composition strategy, and available AEM engineers and architects ready for placement.'
      }
    };

    // Update choice detail pane
    function updateChoiceDetailPane(pathId) {
      const path = pathDescriptions[pathId];
      choiceDetailPane.classList.add('fade-out');

      setTimeout(() => {
        choiceDetailPane.innerHTML = `
          <h3 class="perzo-modal-detail-title">${path.title}</h3>
          <p class="perzo-modal-detail-subtitle">${path.subtitle}</p>
          <p class="perzo-modal-detail-description">${path.description}</p>
        `;
        choiceDetailPane.classList.remove('fade-out');
      }, 150);
    }

    // Button click - open choice modal
    btnEl.addEventListener('click', () => {
      selectedPath = 'consulting';
      updateChoiceDetailPane('consulting');
      choiceModalEl.classList.add('active');
    });

    // Choice modal - Path selection
    choicePathItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove previous selection
        choicePathItems.forEach(i => i.classList.remove('selected'));

        // Set new selection
        item.classList.add('selected');
        selectedPath = item.getAttribute('data-path-id');

        // Update detail pane
        updateChoiceDetailPane(selectedPath);
      });
    });

    // Choice modal - Confirm button
    choiceConfirmBtn.addEventListener('click', () => {
      choiceModalEl.classList.remove('active');

      if (selectedPath === 'consulting') {
        modalEl.classList.add('active');
        loadFirstPersona();
      } else if (selectedPath === 'staffing') {
        showStaffingFlow();
      }
    });

    // Choice modal - Skip button
    choiceSkipBtn.addEventListener('click', () => {
      choiceModalEl.classList.remove('active');
    });

    // Choice modal - close buttons
    choiceCloseBtn.addEventListener('click', () => {
      choiceModalEl.classList.remove('active');
    });

    choiceBackdrop.addEventListener('click', () => {
      choiceModalEl.classList.remove('active');
    });

    // Back button - return to choice modal
    const backBtn = document.getElementById('perzo-consulting-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        modalEl.classList.remove('active');
        choiceModalEl.classList.add('active');
      });
    }

    // Close button - closes modal but keeps widget visible for reuse
    closeBtn.addEventListener('click', () => {
      modalEl.classList.remove('active');
    });

    // Backdrop click - close modal
    backdrop.addEventListener('click', () => {
      modalEl.classList.remove('active');
    });

    // List item selection
    listItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove previous selection
        listItems.forEach(i => i.classList.remove('selected'));

        // Set new selection
        item.classList.add('selected');
        selectedPersonaId = item.getAttribute('data-persona-id');

        // Update detail pane with fade transition
        const persona = PERSONAS.find(p => p.id === selectedPersonaId);
        updateDetailPane(persona);
      });
    });

    // Confirm selection
    confirmBtn.addEventListener('click', () => {
      const persona = PERSONAS.find(p => p.id === selectedPersonaId);

      sessionStorage.setItem(STORAGE_PERSONA, selectedPersonaId);

      // Switch page content based on selected persona with shimmer effect
      if (window.ContentManager) {
        if (selectedPersonaId === 'it-leadership') {
          ContentManager.updateDOMContentWithShimmer(ContentManager.PERSONAS.IT_LEADERSHIP);
        } else if (selectedPersonaId === 'architect') {
          ContentManager.updateDOMContentWithShimmer('architect');
        } else if (selectedPersonaId === 'digital-executive') {
          ContentManager.updateDOMContentWithShimmer('digital-executive');
        } else {
          ContentManager.updateDOMContentWithShimmer(ContentManager.PERSONAS.DEFAULT);
        }
      }

      // Show sticky persona bar if not default
      if (selectedPersonaId !== 'default') {
        // Remove existing bar if any
        const existingBar = document.getElementById('perzo-sticky-persona-bar');
        if (existingBar) {
          existingBar.remove();
        }

        const stickyBar = createStickyPersonaBar(persona.title, selectedPersonaId);
        // Insert after nav element so it appears below header
        const nav = document.querySelector('nav');
        if (nav && nav.nextSibling) {
          nav.parentNode.insertBefore(stickyBar, nav.nextSibling);
        } else if (nav) {
          nav.parentNode.appendChild(stickyBar);
        } else {
          document.body.insertBefore(stickyBar, document.body.firstChild);
        }

        // Setup dropdown functionality
        const dropdownTrigger = document.getElementById('perzo-recommended-trigger');
        const dropdownMenu = document.getElementById('perzo-recommended-menu');

        if (dropdownTrigger && dropdownMenu) {
          // Toggle dropdown visibility
          dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownTrigger.classList.toggle('active');
            dropdownMenu.classList.toggle('active');
          });

          // Close dropdown when clicking outside
          document.addEventListener('click', (e) => {
            if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
              dropdownTrigger.classList.remove('active');
              dropdownMenu.classList.remove('active');
            }
          });

          // Populate dropdown with Intelligence content for this persona
          populateRecommendedReading(selectedPersonaId, dropdownMenu);
        }

        // Handle reset to default content
        const resetLink = document.getElementById('perzo-reset-content');
        if (resetLink) {
          resetLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove sticky bar
            const existingBar = document.getElementById('perzo-sticky-persona-bar');
            if (existingBar) {
              existingBar.remove();
            }

            // Switch back to default content with shimmer
            if (window.ContentManager) {
              ContentManager.updateDOMContentWithShimmer(ContentManager.PERSONAS.DEFAULT);
            }

            // Clear persona storage
            sessionStorage.removeItem(STORAGE_PERSONA);
            selectedPersonaId = 'default';

            if (window.gtag) {
              gtag('event', 'perzo_reset_to_default', {
                previous_persona: selectedPersonaId
              });
            }

            console.log('User reset to default content');
          });
        }
      }

      if (window.gtag) {
        gtag('event', 'perzo_persona_selected', {
          persona_id: selectedPersonaId,
          persona_title: persona.title
        });
      }

      sessionStorage.setItem(STORAGE_PERSONA, selectedPersonaId);

      // Close modal but keep button and modal visible for reuse
      modalEl.classList.remove('active');

      document.dispatchEvent(new CustomEvent('perzoPersonaSelected', {
        detail: { persona: persona }
      }));

      console.log('User selected persona:', persona.title);
    });

    // Skip persona selection
    skipBtn.addEventListener('click', () => {
      if (window.gtag) {
        gtag('event', 'perzo_skipped', {
          source: 'skip_button'
        });
      }

      // Close modal but keep button visible
      modalEl.classList.remove('active');

      document.dispatchEvent(new CustomEvent('perzoSkipped', {
        detail: { skipped: true }
      }));

      console.log('User skipped persona selection');
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl.classList.contains('active')) {
        modalEl.classList.remove('active');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
