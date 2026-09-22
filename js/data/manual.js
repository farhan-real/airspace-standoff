/**
 * AIRSPACE STANDOFF: Master Flight Manual Orchestrator & High-Performance Search
 */

window.TACTICAL_FLIGHT_MANUAL = [
  ...(window.MANUAL_BASICS || []),
  ...(window.MANUAL_SENSORS || []),
  ...(window.MANUAL_COMBAT || []),
  ...(window.MANUAL_THEATER || []),
  ...(window.MANUAL_CONTROLS || [])
];

window.initTacticalManual = function() {
  const container = document.getElementById('glossary-modal-content');
  const navContainer = document.getElementById('manual-quick-nav-bar');
  const searchInput = document.getElementById('manual-search-filter');
  const searchRow = document.querySelector('.manual-search-row');
  const modal = document.getElementById('glossary-modal');

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
    { id: 'ref_controls', label: 'CONTROLS & KEYBINDS', isSpecial: true }
  ];

  let currentMatches = [];
  let currentMatchIndex = 0;
  let lastQuery = null;

  let searchActions = document.getElementById('manual-search-actions');
  if (!searchActions && searchRow) {
    searchActions = document.createElement('div');
    searchActions.id = 'manual-search-actions';
    searchActions.className = 'manual-search-actions';
    searchActions.innerHTML = `
      <span id="manual-search-count" class="manual-search-count"></span>
      <button type="button" id="btn-manual-search-prev" class="manual-search-nav-btn" title="Previous Match (Shift+Enter)">&lt;</button>
      <button type="button" id="btn-manual-search-next" class="manual-search-nav-btn" title="Next Match (Enter)">&gt;</button>
      <button type="button" id="btn-manual-search-clear" class="manual-search-clear-btn" title="Clear Search">&times;</button>
    `;
    searchRow.appendChild(searchActions);
  }

  const countEl = document.getElementById('manual-search-count');
  const prevBtn = document.getElementById('btn-manual-search-prev');
  const nextBtn = document.getElementById('btn-manual-search-next');
  const clearBtn = document.getElementById('btn-manual-search-clear');

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
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navContainer.querySelectorAll('.manual-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
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
      targetMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (countEl) {
      countEl.textContent = `${currentMatchIndex + 1}/${currentMatches.length}`;
    }
  };

  const highlightMatches = (query) => {
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
        if (node.parentNode) {
          node.parentNode.replaceChild(span, node);
        }
      }
    }

    if (currentMatches.length > 0) {
      if (searchActions) searchActions.classList.add('active');
      jumpToMatch(0);
    } else if (searchActions) {
      searchActions.classList.add('active');
      if (countEl) countEl.textContent = '0 matches';
    }
  };

  const renderChapters = (filterQuery = '') => {
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
          <p style="margin-top:6px;font-size:0.72rem;">Try searching for terms like "ProNav", "Notch", "RCS", "COFFIN", "Datalink", "Depots", or "Controls".</p>
        </div>
      `;
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
        </div>
      `;
    }).join('');

    if (q.length >= 2) {
      highlightMatches(q);
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
        renderChapters(e.target.value || '');
      }, 180);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) jumpToMatch(currentMatchIndex - 1);
        else jumpToMatch(currentMatchIndex + 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        searchInput.value = '';
        renderChapters('');
      }
    };
  }

  if (prevBtn) prevBtn.onclick = () => jumpToMatch(currentMatchIndex - 1);
  if (nextBtn) nextBtn.onclick = () => jumpToMatch(currentMatchIndex + 1);
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (searchInput) {
        searchInput.value = '';
        renderChapters('');
        searchInput.focus();
      }
    };
  }

  const openHangarBtn = document.getElementById('btn-open-glossary');
  const openHudBtn = document.getElementById('btn-hud-glossary');
  const closeBtn = document.getElementById('btn-close-glossary');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (searchInput && searchInput.value) {
      renderChapters(searchInput.value);
    } else if (container.children.length === 0) {
      renderChapters('');
    }
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