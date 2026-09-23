/**
 * AIRSPACE STANDOFF: Shelf Airframes Sub-Renderer
 * Optimized batch DOM injection with tag-like box badges for station capacities.
 */

class ShelfAirframesRenderer {
  static renderAirframesTab(shelfInstance, container, currentCategory, query) {
    const categories = ['ALL', 'STEALTH', 'SUPERIORITY', 'MULTIROLE', 'STRIKE', 'EW', 'DRONES', 'EXPERIMENTAL'];
    const filterBar = document.createElement('div');
    filterBar.className = 'airframe-filter-bar';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-pill-btn ${currentCategory === cat ? 'active' : ''}`;
      btn.textContent = cat;
      btn.onclick = () => {
        shelfInstance.pm.currentAirframeCategory = cat;
        shelfInstance.pm.renderCatalog();
      };
      filterBar.appendChild(btn);
    });
    container.appendChild(filterBar);

    const searchBox = document.createElement('div');
    searchBox.className = 'catalog-search-row';
    searchBox.innerHTML = `<input type="text" id="ac-search-input" class="hud-search-input" placeholder="Search airframes by designation, sensor or role..." value="${query || ''}">`;
    container.appendChild(searchBox);

    const inputEl = searchBox.querySelector('#ac-search-input');
    if (inputEl) {
      let debounceTimer = null;
      inputEl.oninput = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          shelfInstance.pm.searchQuery = (e.target.value || '').toLowerCase();
          ShelfAirframesRenderer.renderFilteredAirframesGrid(shelfInstance, container, shelfInstance.pm.currentAirframeCategory, shelfInstance.pm.searchQuery);
        }, 100);
      };
    }

    const grid = document.createElement('div');
    grid.id = 'airframe-grid-items';
    grid.className = 'airframes-dense-grid';
    container.appendChild(grid);

    ShelfAirframesRenderer.renderFilteredAirframesGrid(shelfInstance, container, currentCategory, query || '');
  }

  static renderFilteredAirframesGrid(shelfInstance, container, catFilter, q) {
    const grid = container.querySelector('#airframe-grid-items');
    if (!grid) return;
    grid.innerHTML = '';

    let all = Object.values(window.AIRCRAFT_CATALOG || {});
    if (catFilter && catFilter !== 'ALL') {
      all = all.filter(a => a && (a.category || 'MULTIROLE') === catFilter);
    }
    if (q && q.trim()) {
      const lowerQ = q.trim().toLowerCase();
      all = all.filter(a => a && ((a.name || '') + ' ' + (a.role || '') + ' ' + (a.category || '') + ' ' + (a.id || '')).toLowerCase().includes(lowerQ));
    }

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const catDescriptions = {
      STEALTH: 'Very Low Observable airframe designed to evade early radar detection (RCS <= 0.005 m2).',
      SUPERIORITY: 'Air superiority fighter engineered for high-altitude BVR intercept and energy merges.',
      MULTIROLE: 'Versatile tactical fighter balancing BVR missile combat with close-in dogfight agility.',
      STRIKE: 'Armored ground-attack or strategic penetrator carrying heavy payloads against surface bases.',
      EW: 'Electronic Warfare escort projecting standoff microwave jamming and passive ESM radar geolocation.',
      DRONES: 'Unmanned Combat Air Vehicle (UCAV) executing high-G maneuvers (up to 20G) without pilot G-LOC.',
      EXPERIMENTAL: 'Advanced superfighter prototype featuring 3D TVC, directed-energy weapons, or COFFIN systems.'
    };

    const fragment = document.createDocumentFragment();

    all.forEach(spec => {
      const card = document.createElement('div');
      card.className = 'airframe-dense-card';

      card.setAttribute('draggable', 'true');
      card.dataset.dragType = 'airframe';
      card.dataset.dragId = spec.id;
      card.dataset.dragName = spec.name;

      const rSpeed = rate('speed', spec.S_0 || 0.90);
      const rAgi = rate('agility', spec.AGI_0 || 0.85);
      const rRadar = rate('radar_range', spec.R_0 || 75.0);
      const rRcs = rate('rcs', spec.sigma_0 || 1.0);
      const rHp = rate('hp', spec.hp || 4);
      const rCost = rate('cost_airframe', spec.cost || 20.0);

      const category = spec.category || 'MULTIROLE';
      const rcsVal = spec.sigma_0 || 1.0;
      const rcsTag = (rcsVal <= 0.0005) ? `VLO (${rcsVal}m2)` : ((rcsVal < 0.1) ? `LO (${rcsVal}m2)` : `${rcsVal}m2`);
      const tvcLabel = spec.thrustVector ? '3D TVC' : (spec.isCoffin ? 'COFFIN' : 'AERO');
      const tvcDesc = spec.thrustVector
        ? '3D Thrust Vectoring Nozzles provide post-stall pitch and yaw authority.'
        : (spec.isCoffin ? 'COFFIN Synthetic Vision enclosed cockpit: eliminates G-LOC blackout and grants +25% evasion.' : 'Conventional aerodynamic control surfaces.');

      const intSlots = Number(spec.internalSlots || 0);
      const extSlots = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
      const hasCtr = Boolean(spec.hasCenterline);

      let intPill = intSlots > 0 ? `<span class="station-slot-pill int-pill">${intSlots} INT</span>` : '';
      let extPill = `<span class="station-slot-pill ext-pill">${extSlots} EXT</span>`;
      let ctrPill = hasCtr ? `<span class="station-slot-pill ctr-pill">+ CTR</span>` : '';
      const stationsBadgeHtml = `<span class="station-tag-box">${intPill}${extPill}${ctrPill}</span>`;

      card.innerHTML = `
        <div class="adc-header">
          <div>
            <div class="adc-name">${spec.name}</div>
            <div class="adc-role">${spec.role}</div>
          </div>
          <div class="adc-cost ${rCost.colorClass}" data-tag-title="ACQUISITION COST" data-tag-tooltip="Deducted from squadron defense budget ($${Number(spec.cost || 0).toFixed(1)}M).">$${Number(spec.cost || 0).toFixed(1)}M</div>
        </div>
        <div class="adc-badges-row">
          <span class="adc-badge badge-cat-${category.toLowerCase()}" data-tag-title="${category} DOCTRINE" data-tag-tooltip="${catDescriptions[category] || 'Tactical airframe.'}">${category}</span>
          <span class="adc-badge adc-feat" data-tag-title="AIRFRAME TRAIT" data-tag-tooltip="${spec.desc || 'Operational fighter.'}">${spec.badge || 'READY'}</span>
          <span class="adc-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;" data-tag-title="FLIGHT DYNAMICS" data-tag-tooltip="${tvcDesc}">${tvcLabel}</span>
          <span class="adc-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;" data-tag-title="CLUTTER SUPPRESSION" data-tag-tooltip="Look-down clutter filter (+${Math.round((spec.lookDownBonus || 0.2)*100)}%) allows radar tracking of deck-skimming targets.">CLUTTER: +${Math.round((spec.lookDownBonus || 0.2)*100)}%</span>
        </div>
        <div class="adc-metrics-grid">
          <div class="adc-metric-cell" data-tag-title="SPRINT AIRSPEED" data-tag-tooltip="Maximum clean sprint speed: Mach ${(spec.S_0 || 0.9).toFixed(2)} (~${Math.round((spec.S_0 || 0.9) * 1225)} km/h)."><span>SPEED:</span><b class="${rSpeed.colorClass}">M ${(spec.S_0 || 0.9).toFixed(2)}</b></div>
          <div class="adc-metric-cell" data-tag-title="TURN AGILITY & G-LIMIT" data-tag-tooltip="Corner turn agility (${(spec.AGI_0 || 0.85).toFixed(2)}) and structural maneuvering tolerance (${spec.G_limit || 9}G)."><span>AGILITY:</span><b class="${rAgi.colorClass}">${(spec.AGI_0 || 0.85).toFixed(2)} (${spec.G_limit || 9}G)</b></div>
          <div class="adc-metric-cell" data-tag-title="RADAR ENVELOPE" data-tag-tooltip="Instrumented radar range (${spec.R_0 || 75}km) across forward cone."><span>RADAR:</span><b class="${rRadar.colorClass}">${spec.R_0 || 75}km</b></div>
          <div class="adc-metric-cell" data-tag-title="RADAR CROSS SECTION" data-tag-tooltip="Nose-on radar signature: ${rcsTag}. Lower RCS exponentially reduces enemy radar lock distance."><span>RCS:</span><b class="${rRcs.colorClass}">${rcsTag}</b></div>
          <div class="adc-metric-cell" data-tag-title="ARMOR HP" data-tag-tooltip="Fuselage damage tolerance: ${spec.hp || 4} Hit Points. Deflects close-in kinetic fire."><span>ARMOR:</span><b class="${rHp.colorClass}">${spec.hp || 4} HP</b></div>
          <div class="adc-metric-cell" data-tag-title="STATIONS BREAKDOWN" data-tag-tooltip="Internal Bay: ${intSlots} slots &bull; External Pylons: ${extSlots} slots &bull; Centerline: ${hasCtr ? 'Available' : 'None'} (Total: ${spec.totalSlots || 6} Slots)."><span>STATIONS:</span>${stationsBadgeHtml}</div>
        </div>
        <div class="adc-desc">${spec.desc || ''}</div>
        <div class="adc-footer">
          <button type="button" class="spec-inspect-btn" data-inspect-type="airframe" data-inspect-id="${spec.id}">SPECS</button>
          <button type="button" class="adc-btn-add">+ ADD</button>
        </div>`;

      const addBtn = card.querySelector('.adc-btn-add');
      if (addBtn) {
        addBtn.onclick = (e) => {
          e.stopPropagation();
          shelfInstance.pm.addAirframe(spec.id);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        };
      }

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }
}

window.ShelfAirframesRenderer = ShelfAirframesRenderer;