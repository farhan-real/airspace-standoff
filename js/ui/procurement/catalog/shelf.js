/**
 * js/ui/procurement/catalog/shelf.js - Armory catalog shelf with separated category pills across all tabs.
 */

class ProcurementShelf {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.pm.currentA2ACategory = 'ALL';
    this.pm.currentGunCategory = 'ALL';
    this.pm.currentPodCategory = 'ALL';
    this.pm.currentUpgradeCategory = 'ALL';
    this.pm.currentA2GCategory = 'ALL';
  }

  render(catalogEl, tab, category, query) {
    if (!catalogEl) return;
    catalogEl.innerHTML = '';
    this.updateInstructionHeader(tab);

    if (tab === 'airframes') {
      ShelfAirframesRenderer.renderAirframesTab(this, catalogEl, category, query);
      return;
    }
    if (tab === 'guns') { this.renderGunsTab(catalogEl); return; }
    if (tab === 'upgrades') { this.renderUpgradesTab(catalogEl); return; }

    const catFilterMap = { a2a: 'A2A', a2g: 'A2G', utility: 'UTILITY' };
    this.renderWeaponsTab(catalogEl, catFilterMap[tab] || 'ALL');
  }

  renderFilterPills(container, groups, activeId, onSelect) {
    const bar = document.createElement('div');
    bar.className = 'airframe-filter-bar';
    groups.forEach(g => {
      const btn = document.createElement('button');
      btn.className = `cat-pill-btn ${activeId === g.id ? 'active' : ''}`;
      btn.textContent = g.label;
      btn.onclick = () => onSelect(g.id);
      bar.appendChild(btn);
    });
    container.appendChild(bar);
  }

  getActiveBaySummary() {
    const squadron = this.pm.game.procurementSquadron || [];
    if (squadron.length === 0) return null;
    const sIdx = (this.pm.activeBayIndex !== undefined && this.pm.activeBayIndex < squadron.length) ? this.pm.activeBayIndex : 0;
    const item = squadron[sIdx] || squadron[0];
    const spec = window.AIRCRAFT_CATALOG[item.specId];
    if (!spec) throw new Error(`Squadron aircraft spec "${item.specId}" not found in AIRCRAFT_CATALOG.`);
    const metrics = LoadoutMetrics.calculate(spec, item.weapons, item.upgrades, item.chosenGunId, item.isLead);

    return {
      index: sIdx + 1, sIdx,
      callsign: item.callsign || 'Pilot', model: spec.name, specId: item.specId,
      internalCapacity: metrics.internalCapacity, remainingInternal: metrics.remainingInternal,
      externalCapacity: metrics.externalCapacity, remainingExternal: metrics.remainingExternal,
      hasCenterline: metrics.hasCenterline, centerlineUsed: metrics.centerlineUsed,
      totalSockets: spec.upgradeSockets, usedSockets: (item.upgrades || []).length
    };
  }

  updateInstructionHeader(tab) {
    const el = document.getElementById('shelf-instructions');
    if (!el) return;
    const active = this.getActiveBaySummary();

    if (tab === 'airframes') {
      el.innerHTML = `CLICK "ADD TO SQUADRON" OR DRAG AIRFRAME TO SQUADRON (${(this.pm.game.procurementSquadron || []).length}/16) &bull; TAP TAGS FOR SPEC DETAILS`;
      return;
    }
    if (!active) {
      el.innerHTML = `<span style="color:#f97316;">NO ACTIVE AIRCRAFT SELECTED &bull; ADD AN AIRFRAME FIRST</span>`;
      return;
    }
    if (tab === 'upgrades') {
      const remSockets = Math.max(0, active.totalSockets - active.usedSockets);
      el.innerHTML = `OUTFITTING AIRCRAFT #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">${remSockets} ${remSockets === 1 ? 'SOCKET' : 'SOCKETS'} AVAILABLE &bull; DRAG OR CLICK TO EQUIP</span>`;
    } else if (this.pm.targetEquipStation === 'EXTERNAL' && active.externalCapacity > 0) {
      el.innerHTML = `OUTFITTING AIRCRAFT #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">EQUIPPING TO EXTERNAL PYLONS (${active.remainingExternal}/${active.externalCapacity} SLOTS)</span>`;
    } else if (this.pm.targetEquipStation === 'INTERNAL' && active.internalCapacity > 0) {
      el.innerHTML = `OUTFITTING AIRCRAFT #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">EQUIPPING TO INTERNAL BAY (${active.remainingInternal}/${active.internalCapacity} SLOTS)</span>`;
    } else {
      const intMsg = active.internalCapacity > 0 ? `INT BAY: ${active.remainingInternal}/${active.internalCapacity}` : '';
      const extMsg = active.externalCapacity > 0 ? `EXT PYLONS: ${active.remainingExternal}/${active.externalCapacity}` : '';
      const parts = [intMsg, extMsg].filter(Boolean).join(' &bull; ');
      el.innerHTML = `OUTFITTING AIRCRAFT #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">${parts ? `${parts} AVAILABLE` : 'NO WEAPON STATIONS'}</span>`;
    }
  }

  syncActiveAircraft() {
    const active = this.getActiveBaySummary();
    this.updateInstructionHeader(this.pm.currentTab);
    const catalogEl = document.getElementById('armory-catalog');
    if (!catalogEl) return;
    const activeSpec = active ? window.AIRCRAFT_CATALOG[active.specId] : null;

    catalogEl.querySelectorAll('.btn-equip-gun').forEach(btn => {
      const gun = window.AUTOCANNONS_CATALOG[btn.getAttribute('data-gun-id')];
      if (!gun) return;
      const isComp = activeSpec ? window.AircraftRegistry.isGunCompatible(activeSpec, gun) : false;
      btn.disabled = !isComp;
      btn.textContent = !isComp ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP');
    });

    catalogEl.querySelectorAll('.btn-equip-upgrade').forEach(btn => {
      const upg = window.UPGRADES_CATALOG[btn.getAttribute('data-upg-id')];
      const isDisallowed = Boolean(upg && upg.isAllowed && activeSpec && !upg.isAllowed(activeSpec));
      btn.disabled = isDisallowed;
      btn.textContent = isDisallowed ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP');
    });

    catalogEl.querySelectorAll('.btn-equip-wpn').forEach(btn => {
      const wpn = window.WEAPONS_CATALOG[btn.getAttribute('data-wpn-id')];
      if (!wpn) return;
      const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
      const mismatch = activeSpec && (ratings.indexOf(wpn.minRating) > ratings.indexOf(activeSpec.maxPylonRating));
      const isRestricted = Boolean((wpn.allowedAirframes && active && !wpn.allowedAirframes.includes(active.specId)) || mismatch);
      btn.disabled = isRestricted;
      btn.textContent = isRestricted ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP');
    });
  }

  renderGunsTab(container) {
    const gunGroups = [
      { id: 'ALL', label: 'ALL GUNS' },
      { id: 'INTERNAL', label: 'INTERNAL CANNONS' },
      { id: 'A2A_POD', label: 'A2A GUNPODS' },
      { id: 'A2G_POD', label: 'A2G STRAFE PODS' },
      { id: 'ENERGY', label: 'DIRECTED ENERGY' }
    ];
    this.renderFilterPills(container, gunGroups, this.pm.currentGunCategory, (id) => {
      this.pm.currentGunCategory = id;
      this.pm.renderCatalog();
    });

    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();
    const activeSpec = active ? window.AIRCRAFT_CATALOG[active.specId] : null;
    const curGroup = this.pm.currentGunCategory;

    Object.values(window.AUTOCANNONS_CATALOG).forEach(g => {
      if (curGroup !== 'ALL' && g.gunGroup !== curGroup) return;
      grid.appendChild(ShelfCardBuilders.buildGunCard(this.pm, g, active, activeSpec));
    });

    Object.values(window.WEAPONS_CATALOG).filter(w => w.category === 'GUN').forEach(wpn => {
      if (curGroup !== 'ALL' && wpn.gunGroup !== curGroup) return;
      grid.appendChild(ShelfCardBuilders.buildWeaponCard(this.pm, wpn, active, activeSpec));
    });
    container.appendChild(grid);
  }

  renderUpgradesTab(container) {
    const upgGroups = [
      { id: 'ALL', label: 'ALL SYSTEMS' },
      { id: 'STRIKE', label: 'STRIKE' },
      { id: 'SEAD', label: 'SEAD' },
      { id: 'AVIONICS', label: 'AVIONICS' },
      { id: 'ENGINE', label: 'ENGINE' },
      { id: 'ARMOR', label: 'ARMOR' },
      { id: 'STEALTH', label: 'STEALTH' },
      { id: 'DATALINK', label: 'DATALINK' }
    ];
    this.renderFilterPills(container, upgGroups, this.pm.currentUpgradeCategory, (id) => {
      this.pm.currentUpgradeCategory = id;
      this.pm.renderCatalog();
    });

    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();
    const activeSpec = active ? window.AIRCRAFT_CATALOG[active.specId] : null;
    const curCat = this.pm.currentUpgradeCategory;

    Object.values(window.UPGRADES_CATALOG).forEach(upg => {
      if (curCat !== 'ALL' && upg.category !== curCat) return;
      grid.appendChild(ShelfCardBuilders.buildUpgradeCard(this.pm, upg, active, activeSpec));
    });
    container.appendChild(grid);
  }

  renderWeaponsTab(container, filterCat) {
    if (filterCat === 'A2A') {
      const a2aGroups = [
        { id: 'ALL', label: 'ALL A2A' },
        { id: 'WVR', label: 'WVR / DOGFIGHT' },
        { id: 'MR_BVR', label: 'MEDIUM BVR' },
        { id: 'LR_BVR', label: 'LONG-RANGE BVR' },
        { id: 'ULR_BVR', label: 'ULTRA-LONG & AOE' },
        { id: 'SWARM_MICRO', label: 'MICRO & SWARM' }
      ];
      this.renderFilterPills(container, a2aGroups, this.pm.currentA2ACategory, (id) => {
        this.pm.currentA2ACategory = id;
        this.pm.renderCatalog();
      });
    } else if (filterCat === 'A2G') {
      const a2gGroups = [
        { id: 'ALL', label: 'ALL A2G' },
        { id: 'DUMB_BOMBS', label: 'DUMB BOMBS' },
        { id: 'CLUSTER', label: 'CLUSTER' },
        { id: 'GLIDE_SDB', label: 'GLIDE & SDB' },
        { id: 'LASER_BOMBS', label: 'LASER BOMBS' },
        { id: 'BUNKER_RUNWAY', label: 'BUNKER & RUNWAY' },
        { id: 'ROCKETS', label: 'ROCKETS' },
        { id: 'ATGM', label: 'ATGMS' },
        { id: 'ARM', label: 'ARM (SEAD)' },
        { id: 'CRUISE', label: 'CRUISE' },
        { id: 'LOITERING', label: 'LOITERING' }
      ];
      this.renderFilterPills(container, a2gGroups, this.pm.currentA2GCategory, (id) => {
        this.pm.currentA2GCategory = id;
        this.pm.renderCatalog();
      });
    } else if (filterCat === 'UTILITY') {
      const podGroups = [
        { id: 'ALL', label: 'ALL PODS' },
        { id: 'ECM', label: 'ECM JAMMERS' },
        { id: 'TARGETING', label: 'TARGETING PODS' },
        { id: 'RECON_IRST', label: 'RECON & IRST PODS' },
        { id: 'DECOY', label: 'DECOY SYSTEMS' }
      ];
      this.renderFilterPills(container, podGroups, this.pm.currentPodCategory, (id) => {
        this.pm.currentPodCategory = id;
        this.pm.renderCatalog();
      });
    }

    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();
    const activeSpec = active ? window.AIRCRAFT_CATALOG[active.specId] : null;

    Object.values(window.WEAPONS_CATALOG).forEach(wpn => {
      if (filterCat === 'UTILITY') {
        if (wpn.category !== 'POD') return;
        if (this.pm.currentPodCategory !== 'ALL' && wpn.podGroup !== this.pm.currentPodCategory) return;
      } else if (filterCat === 'A2A') {
        if (wpn.category !== 'A2A') return;
        if (this.pm.currentA2ACategory !== 'ALL' && wpn.a2aGroup !== this.pm.currentA2ACategory) return;
      } else if (filterCat === 'A2G') {
        if (wpn.category !== 'A2G') return;
        if (this.pm.currentA2GCategory !== 'ALL' && wpn.a2gGroup !== this.pm.currentA2GCategory) return;
      } else if (filterCat && filterCat !== 'ALL' && wpn.category !== filterCat) return;

      grid.appendChild(ShelfCardBuilders.buildWeaponCard(this.pm, wpn, active, activeSpec));
    });
    container.appendChild(grid);
  }
}

window.ProcurementShelf = ProcurementShelf;
