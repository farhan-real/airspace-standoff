/**
 * AIRSPACE STANDOFF: Squadron Roster Display Coordinator
 * Efficient DOM batching with DocumentFragment to eliminate mobile layout recalculation latency.
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
      const remStatus = isOver ? `$${remVal}M OVER` : `$${remVal}M REMAINING`;
      budgetCounterEl.innerHTML = `
        <span class="spent-val ${isOver ? 'overbudget' : ''}">$${spent.toFixed(1)}M</span>
        <span style="color:#64748b;">/ $${budgetMax.toFixed(1)}M</span>
        <span class="rem-val" style="color:${isOver ? '#ff3366' : '#00f5a0'};">(${remStatus})</span>`;
      budgetCounterEl.classList.toggle('overbudget', isOver);
    }

    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (fleetCountEl) fleetCountEl.textContent = `${squadron.length} / ${maxUnits} AIRCRAFT`;
    const mobRosterCount = document.getElementById('mob-roster-count');
    if (mobRosterCount) mobRosterCount.textContent = squadron.length;
    const quickStatEl = document.getElementById('roster-quick-stat');
    if (quickStatEl) quickStatEl.textContent = `${squadron.length} AIRCRAFT ASSIGNED`;

    if (scrambleBtnEl) {
      const editorRandomRoster = window.MissionEditor
        && window.MissionEditor.canProvideRandomSquadron(this.pm.game);
      const canScramble = editorRandomRoster || (squadron.length > 0 && spent <= budgetMax);
      scrambleBtnEl.disabled = !canScramble;
      scrambleBtnEl.textContent = editorRandomRoster ? 'LAUNCH EDITOR MISSION'
        : (canScramble ? 'LAUNCH MISSION' : (squadron.length === 0 ? 'ASSIGN AIRCRAFT' : 'BUDGET EXCEEDED'));
    }

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

    const renderKey = squadron.map((it, idx) => {
      if (!it) return `${idx}:EMPTY`;
      return `${idx}:${it.specId}:${it.chosenGunId}:${JSON.stringify(it.weapons || [])}:${JSON.stringify(it.upgrades || [])}:${it.callsign}:${Boolean(it.isLead)}:${this.pm.activeBayIndex === idx}`;
    }).join('|');
    const renderableAircraftCount = squadron.filter(Boolean).length;
    if (this.lastRenderKey === renderKey && container.children.length === renderableAircraftCount) return;
    this.lastRenderKey = renderKey;
    container.innerHTML = '';

    if (typeof RosterCardBuilder !== 'undefined') {
      const fragment = document.createDocumentFragment();
      squadron.forEach((item, sIdx) => {
        if (!item) return;
        const card = RosterCardBuilder.build(this.pm, item, sIdx);
        if (card) fragment.appendChild(card);
      });
      container.appendChild(fragment);
    }
  }
}

window.ProcurementRoster = ProcurementRoster;
