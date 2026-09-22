/**
 * AIRSPACE STANDOFF: Squadron Roster Bay Card DOM Builder
 */

class RosterCardBuilder {
  static build(pm, item, sIdx) {
    const aircraftMap = window.AIRCRAFT_CATALOG || {};
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const upgradesMap = window.UPGRADES_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};

    const spec = aircraftMap[item.specId];
    if (!spec) return null;

    const isActiveBay = (pm.activeBayIndex === sIdx);
    const card = document.createElement('div');
    card.className = 'squad-unit-card' + (item.isLead ? ' lead-bay-card' : '') + (isActiveBay ? ' active-bay' : '');
    card.dataset.sidx = sIdx;

    if (!item.weapons) item.weapons = [];
    if (!item.upgrades) item.upgrades = [];
    if (!item.chosenGunId) item.chosenGunId = spec.builtInGun || 'M61A2';
    if (!item.callsign) {
      const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher'];
      item.callsign = pool[(sIdx * 3) % pool.length] || `Wardog ${sIdx + 1}`;
    }

    const metrics = (typeof LoadoutMetrics !== 'undefined')
      ? LoadoutMetrics.calculate(spec, item.weapons, item.upgrades, item.chosenGunId, item.isLead)
      : null;

    const totalSlots = metrics ? metrics.totalSlots : (spec.totalSlots || 6);
    const usedSlots = metrics ? metrics.usedSlots : 0;
    const totalCost = metrics ? metrics.totalCost : Number(spec.cost || 0);
    const wrPercent = metrics ? metrics.wrPercent : 50;
    const weightCategory = metrics ? metrics.weightCategory : 'NORMAL';
    const weightColor = metrics ? metrics.weightColor : '#00f5a0';
    const totalMass = metrics ? metrics.totalMass : 100;
    const remainingSlots = metrics ? metrics.remainingSlots : (totalSlots - usedSlots);

    const activeGun = gunsMap[item.chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];

    const gunOptsList = Object.values(gunsMap).map(g => {
      const isComp = window.AircraftRegistry && typeof window.AircraftRegistry.isGunCompatible === 'function'
        ? window.AircraftRegistry.isGunCompatible(spec, g) : (!g.lockedTo || g.lockedTo.includes(spec.id));
      const isSelected = item.chosenGunId === g.id;
      return `<button type="button" class="custom-dropdown-opt ${isSelected ? 'active' : ''}" data-gun-id="${g.id}" ${isComp ? '' : 'disabled'}>
        ${isComp ? g.name + ' (' + (g.damagePerSec || 2.5) + ' HP/s)' : '[INCOMPATIBLE] ' + g.name}
      </button>`;
    }).join('');

    let pipsHtml = '';
    for (let p = 0; p < totalSlots; p++) {
      pipsHtml += `<div class="slot-pip ${p < usedSlots ? 'filled' : ''}"></div>`;
    }

    const socketCount = spec.upgradeSockets || 3;
    let upgradesHtml = '';
    for (let u = 0; u < socketCount; u++) {
      const rawUpg = item.upgrades[u];
      const upgId = (typeof rawUpg === 'object' && rawUpg !== null) ? (rawUpg.id || rawUpg.specId) : rawUpg;
      const upg = upgradesMap[upgId];
      if (upg) {
        upgradesHtml += `
          <div class="upgrade-socket filled">
            <span>[${upg.category || 'SYSTEM'}] ${upg.name || upgId}</span>
            <button type="button" class="spec-inspect-btn small" data-inspect-type="upgrade" data-inspect-id="${upg.id}">SPECS</button>
            <button class="btn-socket-dismount" data-sidx="${sIdx}" data-uidx="${u}" title="Remove component">
              <img src="icons/close.svg" width="8" height="8" alt="Remove">
            </button>
          </div>`;
      } else {
        upgradesHtml += `<div class="upgrade-socket empty" data-sidx="${sIdx}" title="Click to install system"><span>+ [EMPTY SLOT]</span></div>`;
      }
    }

    const remSlotLabel = remainingSlots === 1 ? 'SLOT' : 'SLOTS';
    const weaponsHtml = (item.weapons.length === 0)
      ? `<div class="empty-bay-indicator" data-sidx="${sIdx}">EMPTY HARDPOINTS (${remainingSlots} ${remSlotLabel} AVAILABLE)</div>`
      : item.weapons.map((wItem, wIdx) => {
        const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
        const w = weaponsMap[wId];
        const damageHP = w ? (w.damage !== undefined ? w.damage : 2) : 2;
        const slots = w ? (w.slots || 1) : 1;
        const itemSlotWord = slots === 1 ? 'SLOT' : 'SLOTS';
        const seeker = w ? (w.seeker || 'GUIDED') : 'ARH';
        let seekerTag = seeker;
        if (w) {
          if (w.isJammerPod) seekerTag = 'ECM';
          else if (w.isDecoyDrone) seekerTag = 'MALD';
          else if (w.isDecoy) seekerTag = 'DECOY';
          else if (w.isLaser) seekerTag = 'LASER';
          else if (seeker === 'PASSIVE_RADAR') seekerTag = 'ARM';
          else if (seeker === 'GPS_INS') seekerTag = 'GPS/INS';
          else if (seeker === 'INS' || seeker === 'INS_RADAR') seekerTag = 'INS';
          else if (seeker === 'DIRECT_FIRE') seekerTag = 'DIRECT';
        }
        return `
          <div class="installed-item-card">
            <div class="iic-title-group">
              <span class="iic-title" title="${w ? w.name : wId}">${w ? w.name : wId}</span>
            </div>
            <div class="iic-right-group">
              <span class="iic-details"><span class="iic-slots">${slots}<span class="iic-slots-word"> ${itemSlotWord}</span><span class="iic-slots-short">S</span></span> &bull; <b class="iic-hp">${damageHP} HP</b> &bull; <span class="iic-seeker">${seekerTag}</span></span>
              <button type="button" class="spec-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w ? w.id : wId}">SPECS</button>
              <button class="btn-dismount-item" data-sidx="${sIdx}" data-widx="${wIdx}" title="Dismount weapon">
                <img src="icons/close.svg" width="8" height="8" alt="Remove">
              </button>
            </div>
          </div>`;
      }).join('');

    const addWeaponSlotBtn = (remainingSlots > 0 && item.weapons.length > 0)
      ? `<button type="button" class="slot-action-btn btn-add-weapon-slot" data-sidx="${sIdx}">+ ADD WEAPONS (${remainingSlots} ${remSlotLabel} REMAINING)</button>` : '';
    const category = spec.category || 'MULTIROLE';
    const activeGunDmg = activeGun ? (activeGun.damagePerSec || 2.5) : 2.5;

    const leadButtonHtml = item.isLead
      ? `<button type="button" class="hud-btn small btn-toggle-lead active-lead" data-sidx="${sIdx}" data-inspect-type="lead" data-inspect-id="${spec.id}"><img src="icons/star.svg" width="11" height="11" alt="Lead" style="vertical-align:middle;margin-right:3px;">FLIGHT LEAD</button>`
      : `<button type="button" class="hud-btn small btn-toggle-lead" data-sidx="${sIdx}" data-inspect-type="lead" data-inspect-id="${spec.id}">SET LEAD</button>`;

    card.innerHTML = `
      <div class="squad-unit-header">
        <div class="suh-title-group">
          <span class="squad-callsign-tag" data-sidx="${sIdx}" title="Click to rename callsign">${item.callsign}</span>
          <span class="squad-unit-name">${spec.name}</span>
          <span class="squad-unit-badge badge-cat-${category.toLowerCase()}">${category}</span>
          <span class="squad-unit-cost">$${totalCost.toFixed(1)}M</span>
          ${isActiveBay ? '<span class="active-bay-badge">SELECTED</span>' : ''}
          <button type="button" class="spec-inspect-btn small" data-inspect-type="airframe" data-inspect-id="${spec.id}">SPECS</button>
        </div>
        <div class="squad-unit-actions">
          ${leadButtonHtml}
          <button type="button" class="hud-btn small btn-save-config" data-sidx="${sIdx}" title="Save as reusable preset">SAVE PRESET</button>
          <button type="button" class="hud-btn small btn-clone-jet" data-sidx="${sIdx}">CLONE</button>
          <button type="button" class="hud-btn small alert btn-remove-airframe" data-sidx="${sIdx}">REMOVE</button>
        </div>
      </div>
      <div class="su-gun-selector-row">
        <label class="gun-sel-label">GUN:</label>
        <div class="custom-dropdown su-gun-dropdown" id="cdd-gun-${sIdx}">
          <button type="button" class="custom-dropdown-trigger gun-sel-trigger">
            <span class="cdd-val">${activeGun ? activeGun.name : 'Gun'}</span>
            <span class="cdd-arrow"><img src="icons/chevron.svg" width="8" height="8" alt="v"></span>
          </button>
          <div class="custom-dropdown-menu gun-menu">${gunOptsList}</div>
        </div>
        <span class="gun-dmg-badge" style="color:#ffb830;font-size:0.64rem;font-weight:800;font-family:var(--font-mono);">${activeGunDmg} HP/s</span>
        <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${activeGun ? activeGun.id : 'M61A2'}">SPECS</button>
      </div>
      <div class="unit-metric-strip">
        <div class="metric-block">
          <div class="metric-meta">
            <span>RCS:</span>
            ${metrics ? metrics.rcsDualHtml : `<b>${spec.sigma_0 || 1.0}m²</b>`}
          </div>
        </div>
        <div class="metric-block">
          <div class="metric-meta">
            <span>SPEED:</span>
            ${metrics ? metrics.speedDualHtml : `<b>M ${(spec.S_0 || 0.9).toFixed(2)}</b>`}
          </div>
        </div>
        <div class="metric-block">
          <div class="metric-meta">
            <span>HARDPOINTS:</span>
            ${metrics ? metrics.slotsDualHtml : `<span>${usedSlots}/${totalSlots} SLOTS</span>`}
          </div>
          <div class="capacity-pips-bar">${pipsHtml}</div>
        </div>
        <div class="metric-block">
          <div class="metric-meta">
            <span>PAYLOAD:</span>
            <span><b style="color:${weightColor};">${weightCategory}</b> ${wrPercent}% (${totalMass}kg)</span>
          </div>
          <div class="weight-bar-bg"><div class="weight-bar-fill ${wrPercent > 80 ? 'overload' : (wrPercent > 60 ? 'heavy' : '')}" style="width:${Math.min(100, wrPercent)}%;"></div></div>
        </div>
      </div>
      <div class="upgrades-socket-row">
        <div class="upgrades-label-row">
          <span>SYSTEMS (${item.upgrades.length}/${socketCount}):</span>
          <span style="font-size:0.56rem;color:#7dd3fc;cursor:pointer;" class="btn-quick-to-upgrades" data-sidx="${sIdx}">+ INSTALL</span>
        </div>
        <div class="upgrade-slots-container">${upgradesHtml}</div>
      </div>
      <div class="installed-weapons-grid">
        ${weaponsHtml}
        ${addWeaponSlotBtn}
      </div>
    `;

    card.onclick = (e) => {
      if (!e.target.closest('button, input, select, .squad-callsign-tag, .custom-dropdown')) {
        pm.activeBayIndex = sIdx;
        pm.updateUI();
      }
    };

    card.querySelector('.squad-callsign-tag').onclick = (e) => { e.stopPropagation(); pm.openCallsignPickerModal(sIdx); };
    card.querySelector('.btn-toggle-lead').onclick = (e) => { e.stopPropagation(); pm.setLeadAirframe(sIdx); };
    card.querySelector('.btn-save-config').onclick = (e) => { e.stopPropagation(); pm.saveSquadronBayConfig(sIdx); };
    card.querySelector('.btn-clone-jet').onclick = (e) => { e.stopPropagation(); pm.cloneAirframe(sIdx); };
    card.querySelector('.btn-remove-airframe').onclick = (e) => {
      e.stopPropagation();
      pm.game.procurementSquadron.splice(sIdx, 1);
      if (pm.activeBayIndex >= pm.game.procurementSquadron.length) {
        pm.activeBayIndex = Math.max(0, pm.game.procurementSquadron.length - 1);
      }
      pm.updateUI();
    };

    const gunCdd = card.querySelector(`#cdd-gun-${sIdx}`);
    if (gunCdd) {
      const trigger = gunCdd.querySelector('.gun-sel-trigger');
      trigger.onclick = (e) => {
        e.stopPropagation();
        const isOpen = gunCdd.classList.contains('open');
        document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
        if (!isOpen) gunCdd.classList.add('open');
      };

      gunCdd.querySelectorAll('.custom-dropdown-opt').forEach(opt => {
        opt.onclick = (e) => {
          e.stopPropagation();
          if (opt.disabled) return;
          const gunId = opt.getAttribute('data-gun-id');
          const gun = gunsMap[gunId];
          const isComp = window.AircraftRegistry && typeof window.AircraftRegistry.isGunCompatible === 'function'
            ? window.AircraftRegistry.isGunCompatible(spec, gun) : (!gun.lockedTo || gun.lockedTo.includes(spec.id));

          if (gunId && isComp) {
            item.chosenGunId = gunId;
            gunCdd.classList.remove('open');
            pm.updateUI();
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          }
        };
      });
    }

    const goToWeapons = () => {
      pm.activeBayIndex = sIdx;
      pm.currentTab = 'a2a';
      document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'a2a'));
      pm.renderCatalog();
      const btnShelf = document.getElementById('btn-tab-hanger-shelf');
      if (btnShelf && window.innerWidth <= 1024) btnShelf.click();
    };

    const goToUpgrades = () => {
      pm.activeBayIndex = sIdx;
      pm.currentTab = 'upgrades';
      document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'upgrades'));
      pm.renderCatalog();
      const btnShelf = document.getElementById('btn-tab-hanger-shelf');
      if (btnShelf && window.innerWidth <= 1024) btnShelf.click();
    };

    const emptyBay = card.querySelector('.empty-bay-indicator');
    if (emptyBay) emptyBay.onclick = (e) => { e.stopPropagation(); goToWeapons(); };
    const addWpnSlot = card.querySelector('.btn-add-weapon-slot');
    if (addWpnSlot) addWpnSlot.onclick = (e) => { e.stopPropagation(); goToWeapons(); };
    const quickUpg = card.querySelector('.btn-quick-to-upgrades');
    if (quickUpg) quickUpg.onclick = (e) => { e.stopPropagation(); goToUpgrades(); };

    card.querySelectorAll('.upgrade-socket.empty').forEach(el => {
      el.onclick = (e) => { e.stopPropagation(); goToUpgrades(); };
    });
    card.querySelectorAll('.btn-dismount-item').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); item.weapons.splice(parseInt(b.dataset.widx, 10), 1); pm.updateUI(); };
    });
    card.querySelectorAll('.btn-socket-dismount').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); item.upgrades.splice(parseInt(b.dataset.uidx, 10), 1); pm.updateUI(); };
    });

    return card;
  }
}

window.RosterCardBuilder = RosterCardBuilder;