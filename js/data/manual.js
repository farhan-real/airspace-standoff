/**
 * AIRSPACE STANDOFF: Master Flight Manual Orchestrator & Stable Search Engine
 */

window.TACTICAL_FLIGHT_MANUAL = [
  ...(window.MANUAL_BASICS || []),
  ...(window.MANUAL_SENSORS || []),
  ...(window.MANUAL_COMBAT || []),
  ...(window.MANUAL_THEATER || []),
  ...(window.MANUAL_OPERATIONS || []),
  ...(window.MANUAL_CONTROLS || [])
];

window.initTacticalManual = function() {
  const container = document.getElementById('glossary-modal-content');
  const navContainer = document.getElementById('manual-quick-nav-bar');
  const searchInput = document.getElementById('manual-search-filter');
  const modal = document.getElementById('glossary-modal');
  const searchActions = document.getElementById('manual-search-actions');
  const countEl = document.getElementById('manual-search-count');
  const prevBtn = document.getElementById('btn-manual-search-prev');
  const nextBtn = document.getElementById('btn-manual-search-next');
  const clearBtn = document.getElementById('btn-manual-search-clear');
  const navPrevBtn = document.getElementById('btn-manual-nav-prev');
  const navNextBtn = document.getElementById('btn-manual-nav-next');

  const chapters = [
    { id: 'ch1_quickstart', label: '01: DOCTRINE & ROE' },
    { id: 'ch2_kinematics', label: '02: KINEMATICS & POWER' },
    { id: 'ch3_stress_coffin', label: '03: G-STRESS & COFFIN' },
    { id: 'ch4_radar_physics', label: '04: RADAR & STEALTH RCS' },
    { id: 'ch5_classification_uplink', label: '05: DATALINK & SATELLITE' },
    { id: 'ch6_weapons_salvos', label: '06: MISSILES & SALVOS' },
    { id: 'ch7_defense_ew', label: '07: EW & NOTCH DEFENSE' },
    { id: 'ch8_aces_difficulties', label: '08: ACES & THREAT TIERS' },
    { id: 'ch9_logistics_scoring', label: '09: THEATER IADS & SCORING' },
    { id: 'ch10_mission_editor', label: '10: MISSION EDITOR' },
    { id: 'ch11_inspection', label: '11: INSPECTION MODE' },
    { id: 'ch12_debrief_replay', label: '12: DEBRIEF & REPLAY' },
    { id: 'ref_controls', label: 'CONTROLS & KEYBINDS', isSpecial: true }
  ];

  let currentMatches = [];
  let currentMatchIndex = 0;
  let lastQuery = null;

  const scrollToTarget = (targetEl) => {
    if (!targetEl || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();
    const topOffset = tRect.top - cRect.top + container.scrollTop - 10;
    container.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  };

  const renderNavButtons = (matchingChapterIds = null) => {
    if (!navContainer) return;
    navContainer.innerHTML = chapters.map(ch => {
      const isMatch = matchingChapterIds ? matchingChapterIds.has(ch.id) : true;
      const matchClass = matchingChapterIds ? (isMatch ? 'has-match' : 'no-match') : '';
      return `<button type="button" class="manual-nav-btn ${ch.isSpecial ? 'special' : ''} ${matchClass}" data-target="${ch.id}">${ch.label}</button>`;
    }).join('');

    navContainer.querySelectorAll('.manual-nav-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const el = document.getElementById(targetId);
        if (el) {
          scrollToTarget(el);
          navContainer.querySelectorAll('.manual-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const nRect = navContainer.getBoundingClientRect();
          const bRect = btn.getBoundingClientRect();
          const bOffset = bRect.left - nRect.left + navContainer.scrollLeft - (navContainer.clientWidth - btn.clientWidth) / 2;
          navContainer.scrollTo({ left: Math.max(0, bOffset), behavior: 'smooth' });
        }
      };
    });
  };

  const jumpToMatch = (index) => {
    if (!currentMatches.length) return;
    currentMatches.forEach(m => m.classList.remove('current'));
    currentMatchIndex = ((index % currentMatches.length) + currentMatches.length) % currentMatches.length;
    const targetMatch = currentMatches[currentMatchIndex];
    if (targetMatch) {
      targetMatch.classList.add('current');
      scrollToTarget(targetMatch);
    }
    if (countEl) countEl.textContent = `${currentMatchIndex + 1}/${currentMatches.length}`;
  };

  const highlightMatches = (query, shouldScroll = false) => {
    currentMatches = [];
    currentMatchIndex = 0;
    if (!query || query.length < 2 || !container) return;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentNode;
      if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.classList.contains('manual-search-hl'))) continue;
      textNodes.push(walker.currentNode);
    }

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');

    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      const text = node.nodeValue;
      if (regex.test(text)) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, '<mark class="manual-search-hl">$1</mark>');
        span.querySelectorAll('mark.manual-search-hl').forEach(m => currentMatches.push(m));
        if (node.parentNode) node.parentNode.replaceChild(span, node);
      }
    }

    if (currentMatches.length > 0) {
      if (searchActions) searchActions.classList.add('active');
      if (shouldScroll) jumpToMatch(0);
      else {
        currentMatches[0].classList.add('current');
        if (countEl) countEl.textContent = `1/${currentMatches.length}`;
      }
    } else if (searchActions) {
      searchActions.classList.add('active');
      if (countEl) countEl.textContent = '0 matches';
    }
  };

  const renderChapters = (filterQuery = '', shouldScrollToMatch = false) => {
    if (!container) return;
    const q = filterQuery.trim().toLowerCase();
    if (lastQuery === q && container.children.length > 0) return;
    lastQuery = q;

    const sourceData = window.TACTICAL_FLIGHT_MANUAL;
    const matchingIds = new Set();
    const filtered = sourceData.filter(ch => {
      const descContent = typeof ch.getDesc === 'function' ? ch.getDesc() : ch.desc;
      if (!q) return true;
      const haystack = (ch.title + ' ' + descContent).replace(/<[^>]*>/g, '').toLowerCase();
      const isMatch = haystack.includes(q);
      if (isMatch) matchingIds.add(ch.id);
      return isMatch;
    });

    if (filtered.length === 0) {
      renderNavButtons(matchingIds);
      if (searchActions) searchActions.classList.add('active');
      if (countEl) countEl.textContent = '0 matches';
      container.innerHTML = `
        <div style="text-align:center;padding:40px;color:#8494ab;font-family:var(--font-mono);font-size:0.80rem;">
          <b style="color:var(--theme-accent);">NO OPERATIONAL PROCEDURES MATCH "${filterQuery.toUpperCase()}"</b>
          <p style="margin-top:6px;font-size:0.72rem;">Try "Mission Editor", "Random", "Inspection", "Replay", "Debrief", "Callsign", "Notch", "RCS", or "Controls".</p>
        </div>`;
      return;
    }

    renderNavButtons(q ? matchingIds : null);

    container.innerHTML = filtered.map(ch => {
      const descContent = typeof ch.getDesc === 'function' ? ch.getDesc() : ch.desc;
      const badgeHtml = ch.isSpecial
        ? '<span class="manual-ref-badge"><img src="icons/settings.svg" width="10" height="10" alt="Ref" class="manual-inline-ico"> FLIGHT SYSTEMS REFERENCE</span>'
        : '<span class="manual-classified-badge">CLASSIFIED</span>';

      return `
        <div class="glossary-entry" id="${ch.id}">
          <div class="ge-title">
            <span>${ch.title}</span>
            ${badgeHtml}
          </div>
          <div class="ge-content">${descContent}</div>
        </div>`;
    }).join('');

    if (q.length >= 2) {
      highlightMatches(q, shouldScrollToMatch);
    } else {
      if (searchActions) searchActions.classList.remove('active');
      if (countEl) countEl.textContent = '';
      currentMatches = [];
    }
  };

  renderChapters();

  if (searchInput) {
    let debounceTimer = null;
    searchInput.oninput = (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderChapters(e.target.value || '', false);
      }, 150);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) jumpToMatch(currentMatchIndex - 1);
        else jumpToMatch(currentMatchIndex + 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        searchInput.value = '';
        renderChapters('', false);
      }
    };
  }

  if (prevBtn) prevBtn.onclick = () => jumpToMatch(currentMatchIndex - 1);
  if (nextBtn) nextBtn.onclick = () => jumpToMatch(currentMatchIndex + 1);
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (searchInput) {
        searchInput.value = '';
        renderChapters('', false);
        searchInput.focus();
      }
    };
  }

  if (navContainer) {
    navContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        navContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    let isDown = false, startX = 0, scrollStart = 0;
    navContainer.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDown = true;
      startX = e.pageX - navContainer.offsetLeft;
      scrollStart = navContainer.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    navContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navContainer.offsetLeft;
      navContainer.scrollLeft = scrollStart - (x - startX) * 1.4;
    });
  }

  if (navPrevBtn && navContainer) {
    navPrevBtn.onclick = () => navContainer.scrollBy({ left: -180, behavior: 'smooth' });
  }
  if (navNextBtn && navContainer) {
    navNextBtn.onclick = () => navContainer.scrollBy({ left: 180, behavior: 'smooth' });
  }

  const openHangarBtn = document.getElementById('btn-open-glossary');
  const openHudBtn = document.getElementById('btn-hud-glossary');
  const closeBtn = document.getElementById('btn-close-glossary');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (searchInput && searchInput.value) renderChapters(searchInput.value, false);
    else if (container.children.length === 0) renderChapters('', false);
    if (modal) modal.classList.add('active');
    if (window.Game && window.Game.controls) window.Game.controls.autoPauseOnDialogOpen();
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    if (modal) modal.classList.remove('active');
    if (window.Game && window.Game.controls) window.Game.controls.autoUnpauseOnDialogClose();
  };

  if (openHangarBtn) openHangarBtn.onclick = openModal;
  if (openHudBtn) openHudBtn.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;
  if (modal) modal.onclick = (e) => { if (e.target === modal) closeModal(e); };
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initTacticalManual);
} else {
  window.initTacticalManual();
}
