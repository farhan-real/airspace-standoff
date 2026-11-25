/**
 * js/ui/procurement/catalog/shelf.js - Armory catalog shelf with unified search and separated category pills.
 */

class ProcurementShelf {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.pm.currentA2ACategory = 'ALL';
    this.pm.currentGunCategory = 'ALL';
    this.pm.currentPodCategory = 'ALL';
    this.pm.currentUpgradeCategory = 'ALL';
    this.pm.currentA2GCategory = 'ALL';
    this.initSearchBar();
  }

  initSearchBar() {
    const input = document.getElementById('armory-search-input');
    const clearBtn = document.getElementById('btn-armory-search-clear');
    if (!input || input._armorySearchBound) return;
    input._armorySearchBound = true;

    let timer = null;
    const applyQuery = (val) => {
      this.pm.searchQuery = val.toLowerCase();
      if (clearBtn) clearBtn.classList.toggle('hidden', this.pm.searchQuery.trim().length === 0);
      this.pm.renderCatalog();
    };

    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      const val = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('hidden', val.trim().length === 0);
      timer = setTimeout(() => applyQuery(val), 90);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && input.value.length > 0) {
        e.preventDefault();
        input.value = '';
        applyQuery('');
      }
    });

    if (clearBtn) {
      clearBtn.onclick = () => {
        input.value = '';
        applyQuery('');
        input.focus();
      };
    }
  }

  updateSearchPlaceholder(tab) {
    const input = document.getElementById('armory-search-input');
    const clearBtn = document.getElementById('btn-armory-search-clear');
    if (!input) return;
    const placeholders = {
      airframes: 'Search aircraft by name, radar, or role...',
      a2a: 'Search A2A missiles (e.g. Meteor, R-27ET, Sparrow, HOJ, CUDA)...',
      a2g: 'Search A2G bombs, rockets, ATGMs, ARMs, cruise, or loitering...',
      guns: 'Search internal cannons, gunpods, and lasers by caliber or name...',
      utility: 'Search EW jammers, targeting pods, IRST, ELINT, and decoys...',
      upgrades: 'Search strike, SEAD, avionics, armor, and propulsion systems...'
    };
    input.placeholder = placeholders[tab] || 'Search armory items...';
    if (clearBtn) clearBtn.classList.toggle('hidden', this.pm.searchQuery.trim().length === 0);
  }

  buildEmptySearchNode(query) {
    const empty = document.createElement('div');
    empty.className = 'catalog-empty-state';
    const safeQ = String(query || '').trim().replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    empty.innerHTML = `<b style="color:var(--theme-accent);">NO ITEMS MATCH "${safeQ.toUpperCase()}"</b><span>Try another keyword or clear the search filter.</span>`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hud-btn small';
    btn.textContent = 'CLEAR SEARCH';
    btn.onclick = () => {
      const input = document.getElementById('armory-search-input');
      if (input) input.value = '';
      this.pm.searchQuery = '';
      this.pm.renderCatalog();
    };
    empty.appendChild(btn);
    return empty;
  }

  render(catalogEl, tab, category, query) {
    if (!catalogEl) return;
    const sameTab = (this._lastRenderedTab === tab);
    const prevScroll = sameTab ? catalogEl.scrollTop : 0;
    this._lastRenderedTab = tab;

    this.initSearchBar();
    this.updateSearchPlaceholder(tab);
    if (this.pm) this.pm._suppressHeaderScroll = true;
    try {
      catalogEl.innerHTML = '';
      this.updateInstructionHeader(tab);

      if (tab === 'airframes') {
        ShelfAirframesRenderer.renderAirframesTab(this, catalogEl, category, query);
      } else if (tab === 'guns') {
        this.renderGunsTab(catalogEl, query);
      } else if (tab === 'upgrades') {
        this.renderUpgradesTab(catalogEl, query);
      } else {
        const catFilterMap = { a2a: 'A2A', a2g: 'A2G', utility: 'UTILITY' };
        this.renderWeaponsTab(catalogEl, catFilterMap[tab] || 'ALL', query);
      }

      catalogEl.scrollTop = prevScroll;
      requestAnimationFrame(() => {
        if (catalogEl) catalogEl.scrollTop = prevScroll;
        if (this.pm) this.pm._suppressHeaderScroll = false;
      });
    } catch (err) {
      if (this.pm) this.pm._suppressHeaderScroll = false;
      throw err;
    }
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
      index: sIdx + 1, sIdx, callsign: item.callsign || 'Pilot', model: spec.name, specId: item.specId,
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
    const maxUnits = this.pm.game.getMaxSquadronSize();
    if (tab === 'airframes') {
      el.innerHTML = `CLICK "ADD TO SQUADRON" OR DRAG AIRFRAME TO SQUADRON (${(this.pm.game.procurementSquadron || []).length}/${maxUnits}) &bull; TAP TAGS FOR SPEC DETAILS`;
      return;
    }
    if (!active) { el.innerHTML = `<span style="color:#f97316;">NO ACTIVE AIRCRAFT SELECTED &bull; ADD AN AIRFRAME FIRST</span>`; return; }
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

  renderGunsTab(container, query) {
    const gunGroups = [
      { id: 'ALL', label: 'ALL GUNS' }, { id: 'INTERNAL', label: 'INTERNAL CANNONS' },
      { id: 'A2A_POD', label: 'A2A GUNPODS' }, { id: 'A2G_POD', label: 'A2G STRAFE PODS' },
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
    const q = (query || '').trim().toLowerCase();
    let count = 0;

    Object.values(window.AUTOCANNONS_CATALOG).forEach(g => {
      if (curGroup !== 'ALL' && g.gunGroup !== curGroup) return;
      if (q && !`${g.id} ${g.name} ${g.caliber} ${g.badge} ${g.desc}`.toLowerCase().includes(q)) return;
      grid.appendChild(ShelfCardBuilders.buildGunCard(this.pm, g, active, activeSpec));
      count++;
    });

    Object.values(window.WEAPONS_CATALOG).filter(w => w.category === 'GUN').forEach(wpn => {
      if (curGroup !== 'ALL' && wpn.gunGroup !== curGroup) return;
      if (q && !`${wpn.id} ${wpn.name} ${wpn.seeker} ${wpn.traitBadge} ${wpn.behaviorDesc} ${wpn.desc}`.toLowerCase().includes(q)) return;
      grid.appendChild(ShelfCardBuilders.buildWeaponCard(this.pm, wpn, active, activeSpec));
      count++;
    });

    if (count === 0) grid.appendChild(this.buildEmptySearchNode(query));
    container.appendChild(grid);
  }

  renderUpgradesTab(container, query) {
    const upgGroups = [
      { id: 'ALL', label: 'ALL SYSTEMS' }, { id: 'STRIKE', label: 'STRIKE' }, { id: 'SEAD', label: 'SEAD' },
      { id: 'AVIONICS', label: 'AVIONICS' }, { id: 'ENGINE', label: 'ENGINE' },
      { id: 'ARMOR', label: 'ARMOR' }, { id: 'STEALTH', label: 'STEALTH' }, { id: 'DATALINK', label: 'DATALINK' }
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
    const q = (query || '').trim().toLowerCase();
    let count = 0;

    Object.values(window.UPGRADES_CATALOG).forEach(upg => {
      if (curCat !== 'ALL' && upg.category !== curCat) return;
      if (q && !`${upg.id} ${upg.name} ${upg.category} ${upg.desc}`.toLowerCase().includes(q)) return;
      grid.appendChild(ShelfCardBuilders.buildUpgradeCard(this.pm, upg, active, activeSpec));
      count++;
    });

    if (count === 0) grid.appendChild(this.buildEmptySearchNode(query));
    container.appendChild(grid);
  }

  renderWeaponsTab(container, filterCat, query) {
    if (filterCat === 'A2A') {
      this.renderFilterPills(container, [
        { id: 'ALL', label: 'ALL A2A' }, { id: 'WVR', label: 'WVR / DOGFIGHT' }, { id: 'PASSIVE_IR', label: 'SILENT IR BVR' },
        { id: 'LEGACY_SARH', label: 'LEGACY BVR' }, { id: 'MR_BVR', label: 'MEDIUM BVR' }, { id: 'LR_BVR', label: 'LONG-RANGE BVR' },
        { id: 'RAMJET_BVR', label: 'RAMJET' }, { id: 'HOJ_A2A', label: 'HOME-ON-JAM' }, { id: 'ULR_BVR', label: 'ULTRA-LONG' },
        { id: 'SWARM_MICRO', label: 'MICRO & SWARM' }, { id: 'AOE_SPECIAL', label: 'AREA BURST' }
      ], this.pm.currentA2ACategory, (id) => { this.pm.currentA2ACategory = id; this.pm.renderCatalog(); });
    } else if (filterCat === 'A2G') {
      this.renderFilterPills(container, [
        { id: 'ALL', label: 'ALL A2G' }, { id: 'DUMB_BOMBS', label: 'DUMB BOMBS' }, { id: 'CLUSTER', label: 'CLUSTER' },
        { id: 'GLIDE_SDB', label: 'GLIDE & SDB' }, { id: 'LASER_BOMBS', label: 'LASER BOMBS' }, { id: 'BUNKER_RUNWAY', label: 'BUNKER & RUNWAY' },
        { id: 'ROCKETS', label: 'ROCKETS' }, { id: 'ATGM', label: 'ATGMS' }, { id: 'ARM', label: 'ARM (SEAD)' },
        { id: 'CRUISE', label: 'CRUISE' }, { id: 'LOITERING', label: 'LOITERING' }
      ], this.pm.currentA2GCategory, (id) => { this.pm.currentA2GCategory = id; this.pm.renderCatalog(); });
    } else if (filterCat === 'UTILITY') {
      this.renderFilterPills(container, [
        { id: 'ALL', label: 'ALL PODS' }, { id: 'AIR_COMBAT', label: 'A2A SENSOR PODS' }, { id: 'ECM', label: 'ECM JAMMERS' },
        { id: 'TARGETING', label: 'TARGETING PODS' }, { id: 'RECON_IRST', label: 'RECON & ELINT' }, { id: 'DECOY', label: 'DECOY SYSTEMS' }
      ], this.pm.currentPodCategory, (id) => { this.pm.currentPodCategory = id; this.pm.renderCatalog(); });
    }

    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();
    const activeSpec = active ? window.AIRCRAFT_CATALOG[active.specId] : null;
    const q = (query || '').trim().toLowerCase();
    let count = 0;

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

      if (q && !`${wpn.id} ${wpn.name} ${wpn.seeker || ''} ${wpn.traitBadge} ${wpn.behaviorDesc || ''} ${wpn.desc} ${wpn.slotType}`.toLowerCase().includes(q)) return;
      grid.appendChild(ShelfCardBuilders.buildWeaponCard(this.pm, wpn, active, activeSpec));
      count++;
    });

    if (count === 0) grid.appendChild(this.buildEmptySearchNode(query));
    container.appendChild(grid);
  }
}

window.ProcurementShelf = ProcurementShelf;
