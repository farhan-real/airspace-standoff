/**
 * AIRSPACE STANDOFF // Master Flight Manual Orchestrator & Live Search
 */

window.TACTICAL_FLIGHT_MANUAL = [
  ...(window.MANUAL_BASICS || []),
  ...(window.MANUAL_SENSORS || []),
  ...(window.MANUAL_COMBAT || []),
  ...(window.MANUAL_THEATER || [])
];

window.initTacticalManual = function() {
  const container = document.getElementById('glossary-modal-content');
  const navContainer = document.getElementById('manual-quick-nav-bar');
  const searchInput = document.getElementById('manual-search-filter');
  const modal = document.getElementById('glossary-modal');

  window.TACTICAL_FLIGHT_MANUAL = [
    ...(window.MANUAL_BASICS || []),
    ...(window.MANUAL_SENSORS || []),
    ...(window.MANUAL_COMBAT || []),
    ...(window.MANUAL_THEATER || [])
  ];

  const chapters = [
    { id: 'ch1_quickstart', label: '01 // DOCTRINE & ROE' },
    { id: 'ch2_kinematics', label: '02 // KINEMATICS & POWER' },
    { id: 'ch3_stress_coffin', label: '03 // G-STRESS & COFFIN' },
    { id: 'ch4_radar_physics', label: '04 // RADAR & STEALTH RCS' },
    { id: 'ch5_classification_uplink', label: '05 // TRACKS & SATELLITE' },
    { id: 'ch6_weapons_salvos', label: '06 // MISSILES & SALVOS' },
    { id: 'ch7_defense_ew', label: '07 // EW & NOTCH DEFENSE' },
    { id: 'ch8_aces_difficulties', label: '08 // ACES & THREAT TIERS' },
    { id: 'ch9_logistics_scoring', label: '09 // THEATER IADS & DEPOTS' }
  ];

  if (navContainer) {
    navContainer.innerHTML = chapters.map(ch => `
      <button type="button" class="manual-nav-btn" data-target="${ch.id}">${ch.label}</button>
    `).join('');

    navContainer.querySelectorAll('.manual-nav-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navContainer.querySelectorAll('.manual-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      };
    });
  }

  const renderChapters = (filterQuery = '') => {
    if (!container) return;
    const q = filterQuery.trim().toLowerCase();

    const filtered = window.TACTICAL_FLIGHT_MANUAL.filter(ch => {
      if (!q) return true;
      const haystack = (ch.title + ' ' + ch.desc).replace(/<[^>]*>/g, '').toLowerCase();
      return haystack.includes(q);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px;color:#8494ab;font-family:var(--font-mono);font-size:0.80rem;">
          <b style="color:#00f0ff;">NO OPERATIONAL PROCEDURES MATCH "${filterQuery.toUpperCase()}"</b>
          <p style="margin-top:6px;font-size:0.72rem;">Try searching for terms like "Notch", "RCS", "COFFIN", "Salvo", or "Lead".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(ch => `
      <div class="glossary-entry" id="${ch.id}">
        <div class="ge-title">
          <span>${ch.title}</span>
          <span class="manual-classified-badge">CLASSIFIED</span>
        </div>
        <div class="ge-content">${ch.desc}</div>
      </div>
    `).join('');
  };

  renderChapters();

  if (searchInput) {
    let debounceTimer = null;
    searchInput.oninput = (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderChapters(e.target.value || '');
      }, 100);
    };
  }

  const openHangarBtn = document.getElementById('btn-open-glossary');
  const openHudBtn = document.getElementById('btn-hud-glossary');
  const closeBtn = document.getElementById('btn-close-glossary');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) modal.classList.add('active');
    if (window.Game && window.Game.controls) {
      window.Game.controls.autoPauseOnDialogOpen();
    }
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    if (modal) modal.classList.remove('active');
    if (window.Game && window.Game.controls) {
      window.Game.controls.autoUnpauseOnDialogClose();
    }
  };

  if (openHangarBtn) openHangarBtn.onclick = openModal;
  if (openHudBtn) openHudBtn.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal(e);
    };
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initTacticalManual);
} else {
  window.initTacticalManual();
}