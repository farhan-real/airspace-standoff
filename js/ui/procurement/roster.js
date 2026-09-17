/**
 * AIRSPACE STANDOFF // Squadron Loadout Bay Roster
 * Supports custom cyber-military autocannon picker menus and Flight Lead command buffs.
 */

class ProcurementRoster {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.lastRenderKey = '';
  }

  render(container, squadron, budgetCounterEl, fleetCountEl, scrambleBtnEl) {
    if (!container) return;
    squadron = squadron || [];

    const aircraftMap = window.AIRCRAFT_CATALOG || {};
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const upgradesMap = window.UPGRADES_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};

    let spent = 0;
    squadron.forEach(item => {
      if (!item) return;
      if (aircraftMap[item.specId]) spent += Number(aircraftMap[item.specId].cost || 0);

      (item.weapons || []).forEach(wItem => {
        const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
        if (weaponsMap[wId]) spent += Number(weaponsMap[wId].cost || 0);
      });

      (item.upgrades || []).forEach(uItem => {
        const uId = (typeof uItem === 'object' && uItem !== null) ? (uItem.id || uItem.specId) : uItem;
        if (upgradesMap[uId]) spent += Number(upgradesMap[uId].cost || 0);
      });
    });

    const budgetMax = (this.pm && this.pm.game && this.pm.game.budgetMax) || (window.CONFIG && window.CONFIG.BUDGET_MAX_MILLIONS) || 400.0;
    if (this.pm && this.pm.game) this.pm.game.budgetRemaining = budgetMax - spent;

    if (budgetCounterEl) {
      const isOver = spent > budgetMax;
      const remVal = Math.abs(budgetMax - spent).toFixed(1);
      const remStatus = isOver ? `$${remVal}M DEFICIT` : `$${remVal}M LEFT`;
      budgetCounterEl.innerHTML = `
        <span class="spent-val ${isOver ? 'overbudget' : ''}">$${spent.toFixed(1)}M</span>
        <span style="color:#64748b;">/ $${budgetMax.toFixed(1)}M</span>
        <span class="rem-val" style="color:${isOver ? '#ff3366' : '#00f5a0'};">(${remStatus})</span>
      `;
      budgetCounterEl.classList.toggle('overbudget', isOver);
    }

    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (fleetCountEl) fleetCountEl.textContent = `${squadron.length} / ${maxUnits} UNITS`;

    const mobRosterCount = document.getElementById('mob-roster-count');
    if (mobRosterCount) mobRosterCount.textContent = squadron.length;

    const quickStatEl = document.getElementById('roster-quick-stat');
    if (quickStatEl) quickStatEl.textContent = `${squadron.length} CRAFT OPERATIONAL`;

    if (scrambleBtnEl) {
      const canScramble = (squadron.length > 0 && spent <= budgetMax);
      scrambleBtnEl.disabled = !canScramble;
      scrambleBtnEl.textContent = canScramble ? 'ENGAGE THEATER (SCRAMBLE)' : (squadron.length === 0 ? 'ADD AIRCRAFT FIRST' : 'BUDGET EXCEEDED');
    }

    if (squadron.length === 0) {
      this.lastRenderKey = 'EMPTY';
      container.innerHTML = `
        <div class="empty-roster-prompt" style="text-align:center;padding:32px 14px;color:#8494ab;font-family:var(--font-mono);font-size:0.72rem;">
          <div style="color:#00f0ff;font-weight:800;font-size:0.88rem;margin-bottom:6px;">SQUADRON HANGAR BAYS VACANT</div>
          <p>Choose airframes from the catalog on the left, tap "+ EQUIP" to arm, or select a doctrine preset above.</p>
        </div>`;
      return;
    }

    if (!squadron.some(it => it && it.isLead)) {
      if (squadron[0]) squadron[0].isLead = true;
    }

    const renderKey = squadron.map((it, idx) => `${idx}:${it.specId}:${it.chosenGunId}:${it.weapons.join(',')}:${it.upgrades.join(',')}:${it.callsign}:${Boolean(it.isLead)}`).join('|');
    if (this.lastRenderKey === renderKey && container.children.length === squadron.length) return;
    this.lastRenderKey = renderKey;
    container.innerHTML = '';

    squadron.forEach((item, sIdx) => {
      if (!item) return;
      const spec = aircraftMap[item.specId];
      if (!spec) return;

      const card = document.createElement('div');
      card.className = 'squad-unit-card' + (item.isLead ? ' lead-bay-card' : '');
      card.dataset.sidx = sIdx;

      if (!item.weapons) item.weapons = [];
      if (!item.upgrades) item.upgrades = [];
      if (!item.chosenGunId) item.chosenGunId = spec.builtInGun || 'M61A2';
      if (!item.callsign) {
        const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher'];
        item.callsign = pool[(sIdx * 3) % pool.length] || `Wardog ${sIdx + 1}`;
      }

      let totalMass = 100;
      const totalSlots = spec.totalSlots || 6;
      let usedSlots = 0;
      let totalCost = Number(spec.cost || 0);

      const activeGun = gunsMap[item.chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];
      if (activeGun) totalMass += activeGun.mass || 0;

      item.weapons.forEach(wItem => {
        const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
        const w = weaponsMap[wId];
        if (w) { totalMass += w.mass || 0; usedSlots += w.slots || 1; totalCost += Number(w.cost || 0); }
      });

      item.upgrades.forEach(uItem => {
        const uId = (typeof uItem === 'object' && uItem !== null) ? (uItem.id || uItem.specId) : uItem;
        const u = upgradesMap[uId];
        if (u) { totalMass += u.mass || 0; totalCost += Number(u.cost || 0); }
      });

      const maxMass = spec.M_max || 5000;
      const wrPercent = Math.round(Math.min(1.0, totalMass / maxMass) * 100);

      const allowed = spec.allowedGuns || [spec.builtInGun || 'M61A2'];
      const gunOptsList = Object.values(gunsMap).map(g => {
        const isComp = allowed.includes(g.id);
        const isSelected = item.chosenGunId === g.id;
        return `<button type="button" class="custom-dropdown-opt ${isSelected ? 'active' : ''}" data-gun-id="${g.id}" ${isComp ? '' : 'disabled'}>
          ${isComp ? g.name + ' (' + (g.damagePerSec || 2.5) + ' HP/s)' : '[LOCKED] ' + g.name}
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
              <span>[${upg.category || 'MOD'}] ${upg.name || upgId}</span>
              <button type="button" class="spec-inspect-btn small" data-inspect-type="upgrade" data-inspect-id="${upg.id}">SPECS</button>
              <button class="btn-socket-dismount" data-sidx="${sIdx}" data-uidx="${u}" title="Remove component">[X]</button>
            </div>`;
        } else {
          upgradesHtml += `<div class="upgrade-socket empty" data-sidx="${sIdx}"><span>+ [EMPTY SOCKET]</span></div>`;
        }
      }

      const weaponsHtml = (item.weapons.length === 0)
        ? `<div class="empty-bay-indicator" data-sidx="${sIdx}">EMPTY HARDPOINTS &bull; TAP ITEM IN CATALOG TO EQUIP</div>`
        : item.weapons.map((wItem, wIdx) => {
          const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
          const w = weaponsMap[wId];
          const damageHP = w ? (w.damage !== undefined ? w.damage : 2) : 2;
          return `
            <div class="installed-item-card">
              <div class="iic-info">
                <span class="iic-title">${w ? w.name : wId}</span>
                <span class="iic-sub">${w ? w.slots : 1} SLOTS &bull; <b style="color:#ffb830;">${damageHP} HP DMG</b> &bull; ${w ? (w.seeker || 'GUIDED') : 'ARH'}</span>
              </div>
              <div style="display:flex;align-items:center;gap:4px;">
                <button type="button" class="spec-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w ? w.id : wId}">SPECS</button>
                <button class="btn-dismount-item" data-sidx="${sIdx}" data-widx="${wIdx}" title="Dismount weapon">[X]</button>
              </div>
            </div>`;
        }).join('');

      const category = spec.category || 'MULTIROLE';
      const activeGunDmg = activeGun ? (activeGun.damagePerSec || 2.5) : 2.5;

      const leadButtonHtml = item.isLead
        ? `<button type="button" class="hud-btn small btn-toggle-lead active-lead" data-sidx="${sIdx}" data-inspect-type="lead" data-inspect-id="${spec.id}">★ FLIGHT LEAD</button>`
        : `<button type="button" class="hud-btn small btn-toggle-lead" data-sidx="${sIdx}" data-inspect-type="lead" data-inspect-id="${spec.id}">SET LEAD</button>`;

      card.innerHTML = `
        <div class="squad-unit-header">
          <div class="suh-title-group">
            <span class="squad-callsign-tag" data-sidx="${sIdx}" title="Tap to customize callsign">${item.callsign}</span>
            <span class="squad-unit-name">${spec.name}</span>
            <span class="squad-unit-badge badge-cat-${category.toLowerCase()}">${category}</span>
            <span class="squad-unit-cost">$${totalCost.toFixed(1)}M</span>
            <button type="button" class="spec-inspect-btn small" data-inspect-type="airframe" data-inspect-id="${spec.id}">[SPECS]</button>
          </div>
          <div class="squad-unit-actions">
            ${leadButtonHtml}
            <button class="hud-btn small btn-clone-jet" data-sidx="${sIdx}">CLONE</button>
            <button class="hud-btn small btn-equip-selected" data-sidx="${sIdx}">+ EQUIP</button>
            <button class="hud-btn small alert btn-remove-airframe" data-sidx="${sIdx}">REMOVE</button>
          </div>
        </div>
        <div class="su-gun-selector-row">
          <label class="gun-sel-label">AUTOCANNON:</label>
          <div class="custom-dropdown su-gun-dropdown" id="cdd-gun-${sIdx}">
            <button type="button" class="custom-dropdown-trigger gun-sel-trigger">
              <span class="cdd-val">${activeGun ? activeGun.name : 'Autocannon'}</span>
              <span class="cdd-arrow">▾</span>
            </button>
            <div class="custom-dropdown-menu gun-menu">
              ${gunOptsList}
            </div>
          </div>
          <span class="gun-dmg-badge" style="color:#ffb830;font-size:0.64rem;font-weight:800;font-family:var(--font-mono);">${activeGunDmg} HP/s DMG</span>
          <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${activeGun ? activeGun.id : 'M61A2'}">[SPECS]</button>
        </div>
        <div class="unit-metric-strip">
          <div class="metric-block">
            <div class="metric-meta"><span>HARDPOINTS:</span><span>${usedSlots}/${totalSlots} SLOTS</span></div>
            <div class="capacity-pips-bar">${pipsHtml}</div>
          </div>
          <div class="metric-block">
            <div class="metric-meta"><span>LOAD RATIO (Wr):</span><span>${wrPercent}% (${totalMass}kg)</span></div>
            <div class="weight-bar-bg"><div class="weight-bar-fill ${wrPercent > 80 ? 'overload' : (wrPercent > 50 ? 'heavy' : '')}" style="width:${wrPercent}%;"></div></div>
          </div>
        </div>
        <div class="upgrades-socket-row">
          <div class="upgrades-label-row">COMPONENTS (${item.upgrades.length}/${socketCount}):</div>
          <div class="upgrade-slots-container">${upgradesHtml}</div>
        </div>
        <div class="installed-weapons-grid">${weaponsHtml}</div>`;

      card.querySelector('.squad-callsign-tag').onclick = () => this.pm.openCallsignPickerModal(sIdx);
      card.querySelector('.btn-toggle-lead').onclick = () => this.pm.setLeadAirframe(sIdx);
      card.querySelector('.btn-clone-jet').onclick = () => this.pm.cloneAirframe(sIdx);
      card.querySelector('.btn-equip-selected').onclick = () => this.pm.equipSelectedToSquadron(sIdx);
      card.querySelector('.btn-remove-airframe').onclick = () => { squadron.splice(sIdx, 1); this.pm.updateUI(); };

      // Custom Gun Dropdown Trigger
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
            const gunId = opt.getAttribute('data-gun-id');
            if (gunId && allowed.includes(gunId)) {
              item.chosenGunId = gunId;
              gunCdd.classList.remove('open');
              this.pm.updateUI();
            }
          };
        });
      }

      const emptyBay = card.querySelector('.empty-bay-indicator');
      if (emptyBay) {
        emptyBay.onclick = () => {
          this.pm.currentTab = 'a2a';
          document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'a2a'));
          this.pm.renderCatalog();
          const btnShelf = document.getElementById('btn-tab-hanger-shelf');
          if (btnShelf && window.innerWidth <= 1024) btnShelf.click();
        };
      }

      card.querySelectorAll('.upgrade-socket.empty').forEach(el => {
        el.onclick = () => {
          this.pm.currentTab = 'upgrades';
          document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'upgrades'));
          this.pm.renderCatalog();
          const btnShelf = document.getElementById('btn-tab-hanger-shelf');
          if (btnShelf && window.innerWidth <= 1024) btnShelf.click();
        };
      });

      card.querySelectorAll('.btn-dismount-item').forEach(b => {
        b.onclick = () => { item.weapons.splice(parseInt(b.dataset.widx, 10), 1); this.pm.updateUI(); };
      });

      card.querySelectorAll('.btn-socket-dismount').forEach(b => {
        b.onclick = () => { item.upgrades.splice(parseInt(b.dataset.uidx, 10), 1); this.pm.updateUI(); };
      });

      container.appendChild(card);
    });
  }
}

window.ProcurementRoster = ProcurementRoster;