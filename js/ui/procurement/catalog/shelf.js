/**
 * AIRSPACE STANDOFF // Armory Catalog Shelf
 * Single-tap equipping on '+ EQUIP'; tags are clickable with tooltips.
 */

class ProcurementShelf {
  constructor(procurementManager) {
    this.pm = procurementManager;
  }

  render(catalogEl, tab, category, query) {
    if (!catalogEl) return;
    catalogEl.innerHTML = '';
    this.updateInstructionHeader(tab);

    if (tab === 'airframes') {
      ShelfAirframesRenderer.renderAirframesTab(this, catalogEl, category, query);
      return;
    }
    if (tab === 'guns') {
      this.renderGunsTab(catalogEl);
      return;
    }
    if (tab === 'upgrades') {
      this.renderUpgradesTab(catalogEl);
      return;
    }

    const catFilterMap = { a2a: 'A2A', a2g: 'A2G', utility: 'UTILITY' };
    this.renderWeaponsTab(catalogEl, catFilterMap[tab] || 'ALL');
  }

  getActiveBaySummary() {
    const squadron = this.pm.game.procurementSquadron || [];
    if (squadron.length === 0) return null;
    const sIdx = this.pm.activeBayIndex || 0;
    const item = squadron[sIdx] || squadron[0];
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    return {
      index: sIdx + 1, sIdx: sIdx,
      callsign: item.callsign || 'Pilot', model: spec.name || item.specId, specId: item.specId,
      totalSlots: spec.totalSlots || 6,
      usedSlots: (item.weapons || []).reduce((s, wId) => s + (((window.WEAPONS_CATALOG || {})[wId] || {}).slots || 1), 0),
      totalSockets: spec.upgradeSockets || 3, usedSockets: (item.upgrades || []).length
    };
  }

  updateInstructionHeader(tab) {
    const el = document.getElementById('shelf-instructions');
    if (!el) return;
    const active = this.getActiveBaySummary();

    if (tab === 'airframes') {
      el.innerHTML = `CLICK "+ ADD" TO DEPLOY AN AIRFRAME (${(this.pm.game.procurementSquadron || []).length}/16) &bull; TAP TAGS FOR SPEC DETAILS`;
      return;
    }
    if (!active) {
      el.innerHTML = `<span style="color:#f97316;">NO ACTIVE SQUADRON BAYS &bull; ADD AN AIRFRAME FIRST</span>`;
      return;
    }
    if (tab === 'upgrades') {
      el.innerHTML = `OUTFITTING BAY #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">SOCKETS: ${active.usedSockets}/${active.totalSockets}</span>`;
    } else {
      el.innerHTML = `OUTFITTING BAY #${active.index} [${active.callsign} &bull; ${active.model}] &bull; <span class="shelf-active-bay-notice">PYLONS: ${active.usedSlots}/${active.totalSlots} SLOTS</span>`;
    }
  }

  renderGunsTab(container) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const guns = Object.values(window.AUTOCANNONS_CATALOG || {});
    const active = this.getActiveBaySummary();

    guns.forEach(g => {
      const card = document.createElement('div');
      card.className = 'catalog-item-card';
      const isLocked = g.lockedTo && active && !g.lockedTo.includes(active.specId);

      card.innerHTML = `
        <div class="cic-top"><span class="cic-title">${g.name}</span><span class="cic-cost" style="color:#7dd3fc;">${g.caliber}</span></div>
        <div class="cic-type-bar">
          <span class="badge-category" data-tag-title="CYCLIC FIRE RATE" data-tag-tooltip="${g.rpm} Rounds Per Minute deliver instantaneous snapshot burst density.">${g.rpm} RPM</span>
          <span class="badge-mass" data-tag-title="MECHANISM WEIGHT" data-tag-tooltip="+${g.mass} kg deadweight added to forward airframe.">+${g.mass} kg</span>
          <span class="badge-category" style="color:#00f5a0;" data-tag-title="BURST DAMAGE" data-tag-tooltip="Inflicts ${(g.damagePerSec || 2.5).toFixed(1)} HP per second of continuous fire.">${(g.damagePerSec || 2.5).toFixed(1)} HP/s</span>
        </div>
        <div class="cic-desc">${g.desc}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="gun" data-inspect-id="${g.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-gun" style="flex:1;" ${isLocked ? 'disabled' : ''}>
            ${isLocked ? 'INCOMPATIBLE' : (active ? `+ EQUIP TO BAY #${active.index}` : '+ EQUIP')}
          </button>
        </div>`;

      card.querySelector('.btn-equip-gun').onclick = (e) => {
        e.stopPropagation();
        this.pm.equipItemDirectly({ type: 'gun', id: g.id, name: g.name });
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  renderUpgradesTab(container) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();

    Object.values(window.UPGRADES_CATALOG || {}).forEach(upg => {
      const card = document.createElement('div');
      card.className = 'catalog-item-card';
      card.innerHTML = `
        <div class="cic-top"><span class="cic-title">${upg.name}</span><span class="cic-cost">$${Number(upg.cost || 0).toFixed(1)}M</span></div>
        <div class="cic-type-bar">
          <span class="badge-category" data-tag-title="${upg.category} SUBSYSTEM" data-tag-tooltip="${upg.desc}">${upg.category}</span>
          <span class="badge-mass" data-tag-title="COMPONENT WEIGHT" data-tag-tooltip="+${upg.mass} kg payload weight added to airframe.">+${upg.mass} kg</span>
          <span class="badge-slots" data-tag-title="SOCKET REQ" data-tag-tooltip="Requires 1 open modular component socket.">1 SOCKET</span>
        </div>
        <div class="cic-desc">${upg.desc}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="upgrade" data-inspect-id="${upg.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-upgrade" style="flex:1;">
            ${active ? `+ EQUIP TO BAY #${active.index}` : '+ EQUIP'}
          </button>
        </div>`;

      card.querySelector('.btn-equip-upgrade').onclick = (e) => {
        e.stopPropagation();
        this.pm.equipItemDirectly({ type: 'upgrade', id: upg.id, name: upg.name });
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  renderWeaponsTab(container, filterCat) {
    const grid = document.createElement('div');
    grid.className = 'dense-sub-grid';
    const active = this.getActiveBaySummary();

    Object.values(window.WEAPONS_CATALOG || {}).forEach(wpn => {
      if (filterCat === 'UTILITY') {
        if (wpn.category !== 'POD' && wpn.category !== 'GUN' && !wpn.isJammerPod && !wpn.isDecoy && !wpn.isLaser) return;
      } else if (filterCat && filterCat !== 'ALL' && wpn.category !== filterCat) return;

      const card = document.createElement('div');
      card.className = 'catalog-item-card';
      const isRestricted = wpn.allowedAirframes && active && !wpn.allowedAirframes.includes(active.specId);

      card.innerHTML = `
        <div class="cic-top"><span class="cic-title">${wpn.name}</span><span class="cic-cost">$${Number(wpn.cost || 0).toFixed(1)}M</span></div>
        <div class="cic-type-bar">
          <span class="badge-slots" data-tag-title="HARDPOINT REQUIREMENT" data-tag-tooltip="Requires ${wpn.slots} open pylon stations (${wpn.minRating || 'Type S'} minimum).">${wpn.slots} SLOTS</span>
          <span class="badge-mass" data-tag-title="ORDNANCE WEIGHT" data-tag-tooltip="+${wpn.mass} kg total carriage weight.">+${wpn.mass} kg</span>
          <span class="badge-category" style="color:#00f0ff;" data-tag-title="SEEKER HOMING" data-tag-tooltip="Guidance: ${wpn.seeker || 'GUIDED'} &bull; ${wpn.behaviorDesc || wpn.desc || ''}">${wpn.seeker || 'GUIDED'}</span>
        </div>
        <div class="cic-specs">
          <div data-tag-title="EFFECTIVE RANGE" data-tag-tooltip="Maximum engagement basket: ${wpn.rangeKm || 0} km.">RNG: <b>${wpn.rangeKm || 0}km</b></div>
          <div data-tag-title="SPEED & WARHEAD" data-tag-tooltip="Speed: Mach ${wpn.speedMach || '1.0'}, Warhead Damage: ${wpn.damage || 0} HP.">SPD: <b>M ${wpn.speedMach || '1.0'}</b> &bull; DMG: <b>${wpn.damage || 0} HP</b></div>
        </div>
        <div class="cic-desc">${wpn.behaviorDesc || wpn.desc || ''}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button type="button" class="spec-inspect-btn" data-inspect-type="weapon" data-inspect-id="${wpn.id}">[SPECS]</button>
          <button type="button" class="btn-quick-equip btn-equip-wpn" style="flex:1;" ${isRestricted ? 'disabled' : ''}>
            ${isRestricted ? 'INCOMPATIBLE' : (active ? `+ EQUIP TO BAY #${active.index}` : '+ EQUIP')}
          </button>
        </div>`;

      card.querySelector('.btn-equip-wpn').onclick = (e) => {
        e.stopPropagation();
        this.pm.equipItemDirectly({ type: 'weapon', id: wpn.id, name: wpn.name });
      };
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }
}

window.ProcurementShelf = ProcurementShelf;
