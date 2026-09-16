/**
 * APEX VECTOR // Armory Catalog Shelf
 * Retains mobile scroll position and eliminates DOM-wiping flicker.
 */

class ProcurementShelf {
  constructor(procurementManager) {
    this.pm = procurementManager;
  }

  render(catalogEl, tab, category, query, selectedItem) {
    if (!catalogEl) return;
    catalogEl.innerHTML = '';

    if (tab === 'airframes') {
      this.renderAirframesTab(catalogEl, category, query);
      return;
    }
    if (tab === 'guns') {
      this.renderGunsTab(catalogEl, selectedItem);
      return;
    }
    if (tab === 'upgrades') {
      this.renderUpgradesTab(catalogEl, selectedItem);
      return;
    }

    const catFilterMap = { a2a: 'A2A', a2g: 'A2G', utility: 'UTILITY' };
    this.renderWeaponsTab(catalogEl, catFilterMap[tab] || 'ALL', selectedItem);
  }

  renderAirframesTab(container, currentCategory, query) {
    const categories = ['ALL', 'STEALTH', 'SUPERIORITY', 'MULTIROLE', 'STRIKE', 'EW', 'DRONES', 'EXPERIMENTAL'];
    const filterBar = document.createElement('div');
    filterBar.className = 'airframe-filter-bar';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-pill-btn ${currentCategory === cat ? 'active' : ''}`;
      btn.textContent = cat;
      btn.onclick = () => {
        this.pm.currentAirframeCategory = cat;
        this.pm.renderCatalog();
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
        this.pm.searchQuery = (e.target.value || '').toLowerCase();
        this.renderFilteredAirframesGrid(container, this.pm.currentAirframeCategory, this.pm.searchQuery);
      };
    }

    const grid = document.createElement('div');
    grid.id = 'airframe-grid-items';
    grid.className = 'airframes-dense-grid';
    container.appendChild(grid);

    this.renderFilteredAirframesGrid(container, currentCategory, query || '');
  }

  renderFilteredAirframesGrid(container, catFilter, q) {
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
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    all.forEach(spec => {
      const card = document.createElement('div');
      card.className = 'airframe-dense-card';
      card.dataset.itemId = spec.id;
      card.dataset.itemType = 'airframe';

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
      const tvcLabel = spec.thrustVector ? '3D TVC' : (spec.isCoffin ? 'COFFIN' : 'AERO');

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
          <div class="adc-metric-cell"><span>RADAR:</span><b class="${rRadar.colorClass}">${spec.R_0 || 75}km</b></div>
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
          this.pm.addAirframe(spec.id);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
      };
      grid.appendChild(card);
    });
  }

  renderGunsTab(container, selected) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const guns = Object.values(window.AUTOCANNONS_CATALOG || {});

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    guns.forEach(g => {
      const card = document.createElement('div');
      const isSel = selected && selected.type === 'gun' && selected.id === g.id;
      card.className = `catalog-item-card ${isSel ? 'selected' : ''}`;
      card.dataset.itemId = g.id;
      card.dataset.itemType = 'gun';

      const rRpm = rate('gun_rpm', g.rpm || 3000);
      const rDps = rate('gun_dps', g.damagePerSec || 2.5);
      const rMass = rate('ordnance_mass', g.mass || 100);

      card.innerHTML = `
        <div class="cic-top">
          <span class="cic-title">${g.name}</span>
          <span class="cic-cost" style="color:#7dd3fc;">${g.caliber}</span>
        </div>
        <div class="cic-type-bar">
          <span class="badge-category ${rRpm.colorClass}">${g.rpm} RPM</span>
          <span class="badge-mass ${rMass.colorClass}">+${g.mass} kg</span>
          <span class="badge-category ${rDps.colorClass}">${(g.damagePerSec || 2.5).toFixed(1)} HP/s</span>
          <span class="badge-category" style="color:#8494ab;">CAP: ${g.defaultAmmo || 3200} RDS</span>
        </div>
        <div class="cic-desc">${g.desc}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="gun" data-inspect-id="${g.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-gun" style="flex:1;">+ EQUIP</button>
        </div>`;

      card.querySelector('.btn-equip-gun').onclick = (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 1024) this.pm.openEquipToBayModal({ type: 'gun', id: g.id, name: g.name });
        else this.pm.setSelectedItem('gun', g.id, g.name);
      };

      card.onclick = (e) => {
        if (!e.target || !e.target.closest || !e.target.closest('.spec-inspect-btn, .btn-quick-equip')) {
          this.pm.setSelectedItem('gun', g.id, g.name);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  renderUpgradesTab(container, selected) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    Object.values(window.UPGRADES_CATALOG || {}).forEach(upg => {
      const card = document.createElement('div');
      const isSel = selected && selected.type === 'upgrade' && selected.id === upg.id;
      card.className = `catalog-item-card ${isSel ? 'selected' : ''}`;
      card.dataset.itemId = upg.id;
      card.dataset.itemType = 'upgrade';

      const rCost = rate('cost_upgrade', upg.cost || 1.0);
      const rMass = rate('component_mass', upg.mass || 50);

      card.innerHTML = `
        <div class="cic-top">
          <span class="cic-title">${upg.name}</span>
          <span class="cic-cost ${rCost.colorClass}">$${Number(upg.cost || 0).toFixed(1)}M</span>
        </div>
        <div class="cic-type-bar">
          <span class="badge-category">${upg.category}</span>
          <span class="badge-mass ${rMass.colorClass}">+${upg.mass} kg</span>
          <span class="badge-slots">1 SOCKET</span>
        </div>
        <div class="cic-desc">${upg.desc}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="upgrade" data-inspect-id="${upg.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-upgrade" style="flex:1;">+ EQUIP</button>
        </div>`;

      card.querySelector('.btn-equip-upgrade').onclick = (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 1024) this.pm.openEquipToBayModal({ type: 'upgrade', id: upg.id, name: upg.name });
        else this.pm.setSelectedItem('upgrade', upg.id, upg.name);
      };

      card.onclick = (e) => {
        if (!e.target || !e.target.closest || !e.target.closest('.spec-inspect-btn, .btn-quick-equip')) {
          this.pm.setSelectedItem('upgrade', upg.id, upg.name);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  renderWeaponsTab(container, filterCat, selected) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    Object.values(window.WEAPONS_CATALOG || {}).forEach(wpn => {
      if (filterCat === 'UTILITY') {
        if (wpn.category !== 'POD' && wpn.category !== 'GUN' && !wpn.isJammerPod && !wpn.isDecoy && !wpn.isLaser) return;
      } else if (filterCat && filterCat !== 'ALL' && wpn.category !== filterCat) {
        return;
      }

      const card = document.createElement('div');
      const isSel = selected && selected.type === 'weapon' && selected.id === wpn.id;
      card.className = `catalog-item-card ${isSel ? 'selected' : ''}`;
      card.dataset.itemId = wpn.id;
      card.dataset.itemType = 'weapon';

      const rRange = rate('missile_range', wpn.rangeKm || 20);
      const rDmg = rate('missile_damage', wpn.damage || 2);
      const rSpd = rate('missile_speed', wpn.speedMach || 1.0);
      const rMass = rate('ordnance_mass', wpn.mass || 100);
      const rCost = rate('cost_weapon', wpn.cost || 1.0);
      const seekerLabel = wpn.seeker || (wpn.isJammerPod ? 'JAMMER' : (wpn.isDecoy ? 'DECOY' : (wpn.isLaser ? 'LASER' : 'GUN')));

      card.innerHTML = `
        <div class="cic-top">
          <span class="cic-title">${wpn.name}</span>
          <span class="cic-cost ${rCost.colorClass}">$${Number(wpn.cost || 0).toFixed(1)}M</span>
        </div>
        <div class="cic-type-bar">
          <span class="badge-slots">${wpn.slots} SLOTS (${wpn.minRating || 'Type S'})</span>
          <span class="badge-mass ${rMass.colorClass}">+${wpn.mass} kg</span>
          <span class="badge-category" style="color:#00f0ff;">${seekerLabel}</span>
          <span class="badge-category" style="color:#00f5a0;">${wpn.ammoCount !== undefined ? wpn.ammoCount : 4}x Salvo</span>
        </div>
        <div class="cic-specs">
          <div>RNG: <b class="${rRange.colorClass}">${wpn.rangeKm || 0}km</b></div>
          <div>SPD: <b class="${rSpd.colorClass}">M ${wpn.speedMach || '1.0'}</b> &bull; DMG: <b class="${rDmg.colorClass}">${wpn.damage !== undefined ? wpn.damage : 0} HP</b></div>
        </div>
        <div class="cic-desc">${wpn.behaviorDesc || wpn.desc || ''}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="weapon" data-inspect-id="${wpn.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-wpn" style="flex:1;">+ EQUIP</button>
        </div>`;

      card.querySelector('.btn-equip-wpn').onclick = (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 1024) this.pm.openEquipToBayModal({ type: 'weapon', id: wpn.id, name: wpn.name });
        else this.pm.setSelectedItem('weapon', wpn.id, wpn.name);
      };

      card.onclick = (e) => {
        if (!e.target || !e.target.closest || !e.target.closest('.spec-inspect-btn, .btn-quick-equip')) {
          this.pm.setSelectedItem('weapon', wpn.id, wpn.name);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }
}

window.ProcurementShelf = ProcurementShelf;
