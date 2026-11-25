/**
 * js/ui/procurement/squadron/roster.js - Squadron Roster Display Coordinator
 * In-place card replacement, preserved scroll offsets, and budget-scaled squadron limits.
 */

class ProcurementRoster {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.lastRenderKey = '';
  }

  buildRenderKey(pm, squadron) {
    return (squadron || []).map((it, idx) => {
      if (!it) return `${idx}:EMPTY`;
      return `${idx}:${it.specId}:${it.chosenGunId}:${JSON.stringify(it.weapons || [])}:${JSON.stringify(it.upgrades || [])}:${it.callsign}:${Boolean(it.isLead)}:${pm.activeBayIndex === idx}`;
    }).join('|');
  }

  setActiveBay(pm, sIdx) {
    const container = document.getElementById('squadron-list');
    if (!container) {
      pm.updateUI();
      return;
    }
    pm.activeBayIndex = sIdx;
    pm.targetEquipStation = null;

    container.querySelectorAll('.squad-unit-card').forEach(cardEl => {
      const cardIdx = parseInt(cardEl.dataset.sidx, 10);
      const isSelected = (cardIdx === sIdx);
      cardEl.classList.toggle('active-bay', isSelected);

      const header = cardEl.querySelector('.squad-unit-header');
      if (!header) return;
      let subRow = header.querySelector('.suh-preset-row');
      let badge = subRow ? subRow.querySelector('.active-bay-badge') : null;

      if (isSelected) {
        if (!subRow) {
          subRow = document.createElement('div');
          subRow.className = 'suh-preset-row';
          const topRow = header.querySelector('.suh-top-row');
          if (topRow) topRow.insertAdjacentElement('afterend', subRow);
          else header.prepend(subRow);
        }
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'active-bay-badge';
          badge.textContent = 'SELECTED';
          subRow.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
        if (subRow && subRow.children.length === 0) subRow.remove();
      }
    });

    this.lastRenderKey = this.buildRenderKey(pm, pm.game.procurementSquadron);
    if (pm.shelf) pm.shelf.syncActiveAircraft();
  }

  updateCard(pm, sIdx) {
    const item = pm.game.procurementSquadron[sIdx];
    if (!item) {
      pm.updateUI();
      return;
    }
    const container = document.getElementById('squadron-list');
    if (!container) {
      pm.updateUI();
      return;
    }

    const prevScroll = container.scrollTop;
    pm._suppressHeaderScroll = true;

    const oldCard = container.querySelector(`.squad-unit-card[data-sidx="${sIdx}"]`);
    if (oldCard && typeof RosterCardBuilder !== 'undefined') {
      const newCard = RosterCardBuilder.build(pm, item, sIdx);
      if (newCard) {
        oldCard.replaceWith(newCard);
      }
    } else {
      pm._suppressHeaderScroll = false;
      pm.updateUI();
      return;
    }

    this.lastRenderKey = this.buildRenderKey(pm, pm.game.procurementSquadron);
    container.scrollTop = prevScroll;
    requestAnimationFrame(() => {
      if (container) container.scrollTop = prevScroll;
      pm._suppressHeaderScroll = false;
    });

    this.updateSummaryHeader(pm);
    if (pm.shelf) pm.shelf.syncActiveAircraft();
    if (window.Persistence && pm.game.procurementSquadron.length > 0) {
      window.Persistence.saveLastSquadron(pm.game.procurementSquadron);
    }
  }

  updateSummaryHeader(pm) {
    const budgetCounterEl = document.getElementById('budget-counter');
    const fleetCountEl = document.getElementById('fleet-count');
    const scrambleBtnEl = document.getElementById('btn-scramble');

    const aircraftMap = window.AIRCRAFT_CATALOG || {};
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const upgradesMap = window.UPGRADES_CATALOG || {};

    let spent = 0;
    pm.game.procurementSquadron.forEach(item => {
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

    const budgetMax = pm.game.budgetMax;
    const maxUnits = pm.game.getMaxSquadronSize();
    const count = pm.game.procurementSquadron.length;
    const isOverCount = count > maxUnits;
    pm.game.budgetRemaining = budgetMax - spent;

    if (budgetCounterEl) {
      const isOver = spent > budgetMax;
      const remVal = Math.abs(budgetMax - spent).toFixed(1);
      const remStatus = isOver ? `$${remVal}M OVER` : `$${remVal}M REMAINING`;
      budgetCounterEl.innerHTML = `
        <span class="spent-val ${isOver ? 'overbudget' : ''}">$${spent.toFixed(1)}M</span>
        <span style="color:#64748b;">/ $${budgetMax.toFixed(1)}M</span>
        <span class="rem-val" style="color:${isOver ? '#ff3366' : '#00f5a0'};">(${remStatus})</span>`;
      budgetCounterEl.classList.toggle('overbudget', isOver);
    }

    if (fleetCountEl) {
      fleetCountEl.textContent = `${count} / ${maxUnits} AIRCRAFT`;
      fleetCountEl.style.color = isOverCount ? '#ff3366' : '';
      fleetCountEl.style.borderColor = isOverCount ? 'rgba(244, 63, 94, 0.55)' : '';
    }
    const mobRosterCount = document.getElementById('mob-roster-count');
    if (mobRosterCount) mobRosterCount.textContent = count;
    const quickStatEl = document.getElementById('roster-quick-stat');
    if (quickStatEl) {
      quickStatEl.textContent = `${count} / ${maxUnits} AIRCRAFT ASSIGNED`;
      quickStatEl.style.color = isOverCount ? '#ff3366' : '';
    }

    if (scrambleBtnEl) {
      const editorRandomRoster = window.MissionEditor
        && window.MissionEditor.canProvideRandomSquadron(pm.game);
      const canScramble = editorRandomRoster || (count > 0 && count <= maxUnits && spent <= budgetMax);
      scrambleBtnEl.disabled = !canScramble;
      scrambleBtnEl.textContent = editorRandomRoster ? 'NEW GAME (EDITOR)'
        : (canScramble ? 'NEW GAME'
          : (count === 0 ? 'ASSIGN AIRCRAFT'
            : (isOverCount ? 'SQUADRON LIMIT EXCEEDED' : 'BUDGET EXCEEDED')));
    }
  }

  render(container, squadron, budgetCounterEl, fleetCountEl, scrambleBtnEl) {
    if (!container) return;
    squadron = squadron || [];

    this.updateSummaryHeader(this.pm);

    if (squadron.length === 0) {
      this.lastRenderKey = 'EMPTY';
      container.innerHTML = `
        <div class="empty-roster-prompt" style="text-align:center;padding:32px 14px;color:#8494ab;font-family:var(--font-mono);font-size:0.72rem;">
          <div style="color:var(--theme-accent);font-weight:800;font-size:0.88rem;margin-bottom:6px;">NO AIRCRAFT IN SQUADRON</div>
          <p>Select aircraft from the catalog or choose a preset configuration above.</p>
        </div>`;
      return;
    }

    if (!squadron.some(it => it && it.isLead)) {
      if (squadron[0]) squadron[0].isLead = true;
    }

    if (this.pm.activeBayIndex === undefined || this.pm.activeBayIndex >= squadron.length) {
      this.pm.activeBayIndex = 0;
    }

    const renderKey = this.buildRenderKey(this.pm, squadron);
    const renderableAircraftCount = squadron.filter(Boolean).length;
    if (this.lastRenderKey === renderKey && container.children.length === renderableAircraftCount) return;

    const prevScroll = container.scrollTop;
    this.lastRenderKey = renderKey;
    this.pm._suppressHeaderScroll = true;

    if (typeof RosterCardBuilder !== 'undefined') {
      const fragment = document.createDocumentFragment();
      squadron.forEach((item, sIdx) => {
        if (!item) return;
        const card = RosterCardBuilder.build(this.pm, item, sIdx);
        if (card) fragment.appendChild(card);
      });
      container.replaceChildren(fragment);
    } else {
      container.innerHTML = '';
    }

    container.scrollTop = prevScroll;
    requestAnimationFrame(() => {
      if (container) container.scrollTop = prevScroll;
      this.pm._suppressHeaderScroll = false;
    });
  }
}

window.ProcurementRoster = ProcurementRoster;
