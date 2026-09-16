/**
 * APEX VECTOR // Shelf Airframes Sub-Renderer
 * Manages category filters, live searching, and grid cards for the Airframes Armory catalog
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
      inputEl.oninput = (e) => {
        shelfInstance.pm.searchQuery = (e.target.value || '').toLowerCase();
        ShelfAirframesRenderer.renderFilteredAirframesGrid(shelfInstance, container, shelfInstance.pm.currentAirframeCategory, shelfInstance.pm.searchQuery);
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

    all.forEach(spec => {
      const card = document.createElement('div');
      card.className = 'airframe-dense-card';

      const rSpeed = rate('speed', spec.S_0 || 0.90);
      const rAgi = rate('agility', spec.AGI_0 || 0.85);
      const rRadar = rate('radar_range', spec.R_0 || 75.0);
      const rRcs = rate('rcs', spec.sigma_0 || 1.0);
      const rHp = rate('hp', spec.hp || 4);
      const rSlots = rate('pylon_slots', spec.totalSlots || 6);
      const rCost = rate('cost_airframe', spec.cost || 20.0);

      const category = spec.category || 'MULTIROLE';
      const rcsVal = spec.sigma_0 || 1.0;
      const rcsTag = (rcsVal <= 0.0005) ? `VLO (${rcsVal}m²)` : ((rcsVal < 0.1) ? `LO (${rcsVal}m²)` : `${rcsVal}m²`);

      let tvcLabel = 'AERO';
      if (spec.thrustVector) tvcLabel = '3D TVC';
      else if (spec.isCoffin) tvcLabel = 'COFFIN';

      card.innerHTML = `
        <div class="adc-header">
          <div>
            <div class="adc-name">${spec.name}</div>
            <div class="adc-role">${spec.role}</div>
          </div>
          <div class="adc-cost ${rCost.colorClass}">$${Number(spec.cost || 0).toFixed(1)}M</div>
        </div>
        <div class="adc-badges-row">
          <span class="adc-badge badge-cat-${category.toLowerCase()}">${category}</span>
          <span class="adc-badge adc-feat">${spec.badge || 'READY'}</span>
          <span class="adc-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;">${tvcLabel}</span>
          <span class="adc-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;">CLUTTER: +${Math.round((spec.lookDownBonus || 0.2)*100)}%</span>
        </div>
        <div class="adc-metrics-grid">
          <div class="adc-metric-cell"><span>SPEED:</span><b class="${rSpeed.colorClass}">M ${(spec.S_0 || 0.9).toFixed(2)}</b></div>
          <div class="adc-metric-cell"><span>AGILITY:</span><b class="${rAgi.colorClass}">${(spec.AGI_0 || 0.85).toFixed(2)} (${spec.G_limit || 9}G)</b></div>
          <div class="adc-metric-cell"><span>RADAR:</span><b class="${rRadar.colorClass}">${spec.R_0 || 75}km (±${Math.round((spec.radarConeDeg || 120)/2)}°)</b></div>
          <div class="adc-metric-cell"><span>RCS:</span><b class="${rRcs.colorClass}">${rcsTag}</b></div>
          <div class="adc-metric-cell"><span>ARMOR:</span><b class="${rHp.colorClass}">${spec.hp || 4} HP</b></div>
          <div class="adc-metric-cell"><span>STATIONS:</span><b class="${rSlots.colorClass}">${spec.totalSlots || 6} Pylons</b></div>
        </div>
        <div class="adc-desc">${spec.desc || ''}</div>
        <div class="adc-footer">
          <button type="button" class="spec-inspect-btn" data-inspect-type="airframe" data-inspect-id="${spec.id}">[SPECS]</button>
          <button type="button" class="adc-btn-add">+ ADD</button>
        </div>`;

      card.onclick = (e) => {
        if (!e.target || !e.target.closest || !e.target.closest('.spec-inspect-btn')) {
          shelfInstance.pm.addAirframe(spec.id);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
      };
      grid.appendChild(card);
    });
  }
}

window.ShelfAirframesRenderer = ShelfAirframesRenderer;
