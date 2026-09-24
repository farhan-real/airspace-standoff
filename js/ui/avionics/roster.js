/**
 * AIRSPACE STANDOFF: Avionics Flight Roster Submodule
 * Differential DOM rendering of `#flight-units-list` with zero mobile flickering
 */

class AvionicsRosterDisplay {
  constructor(avionicsUI) {
    this.ui = avionicsUI;
    this.game = avionicsUI.game;
    this.cachedRosterIds = '';
  }

  renderFlightRoster() {
    const listEl = document.getElementById('flight-units-list');
    if (!listEl) return;
    const roster = (this.game.currentPvpCommander === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;

    const currentIds = roster.map(a => `${a.id}:${Math.round(a.hp)}`).join(',');

    if (this.cachedRosterIds !== currentIds || listEl.children.length !== roster.length) {
      this.cachedRosterIds = currentIds;
      listEl.innerHTML = '';

      roster.forEach((a) => {
        const card = document.createElement('div');
        card.id = 'flight-card-' + a.id;
        card.className = 'flight-card' + (a.team === 'hostile' ? ' team-red' : '');

        const rawCallsign = a.callsign || 'PILOT';
        const callsignText = String(rawCallsign).replace(/<[^>]*>/g, '');
        const specText = a.spec ? (a.spec.name || a.spec.id || 'JET') : 'JET';
        const isBlue = (a.team === 'friendly');

        const machNum = (a.speed || 0.85);
        const sOpt = (a.effectiveMaxSpeed || 0.95) * 0.65;
        const spdColor = this.ui.getSpeedColor(machNum, sOpt, a.effectiveMaxSpeed || 1.0);
        const altColor = this.ui.getAltColor(a.altFt || 30000);
        const loadColor = this.ui.getLoadColor(a.Wr || 0);
        const displayHp = a.hp > 0.05 ? Math.max(1, Math.round(a.hp)) : 0;
        const hpColor = displayHp <= 1 ? '#ff3366' : (displayHp <= 2 ? '#f97316' : '#00f5a0');
        const payloadPercent = Math.round((a.Wr || 0) * 100);
        const teamColor = a.isAce ? '#ffd700' : (isBlue ? '#00f0ff' : '#ff3366');

        card.innerHTML = `
          <div class="tcard-top">
            <span class="tcard-callsign" style="color:${teamColor};">${callsignText} <i class="tcard-model">[${specText}]</i></span>
            <span class="tcard-hp">${displayHp} / ${a.maxHp} HP</span>
          </div>
          <div class="tcard-hp-bar"><div class="tcard-hp-fill" style="width:${((a.hp / a.maxHp) * 100)}%;background:${hpColor};"></div></div>
          <div class="tcard-metrics">
            <div class="tcard-metric-cell"><span>SPD:</span><b class="tcard-spd" style="color:${spdColor};">M ${machNum.toFixed(2)}</b></div>
            <div class="tcard-metric-cell"><span>ALT:</span><b class="tcard-alt" style="color:${altColor};">FL${Math.round((a.altFt || 30000) / 100)}</b></div>
            <div class="tcard-metric-cell"><span>PAYLOAD:</span><b class="tcard-load" style="color:${loadColor};">${payloadPercent}%</b></div>
            <div class="tcard-metric-cell"><span>STATUS:</span><b class="tcard-status" style="color:#38bdf8;">COMBAT</b></div>
          </div>`;

        card.onclick = () => {
          if (a.hp > 0.05) {
            this.game.activeUnit = a;
            if (this.game.radar && this.game.radar.cam && this.game.radar.trackingUnit) {
              this.game.radar.cam.trackActiveCraft(a);
            }
            this.renderFlightRoster();
            this.ui.updateActiveUnitMFD();
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
            const fleetPane = document.getElementById('pane-fleet');
            if (fleetPane) fleetPane.classList.remove('drawer-open');
          }
        };

        listEl.appendChild(card);
      });
    }

    roster.forEach((a) => {
      const card = document.getElementById('flight-card-' + a.id);
      if (!card) return;

      const isSelected = this.game.activeUnit && this.game.activeUnit.id === a.id;
      card.classList.toggle('selected', isSelected);
      card.classList.toggle('destroyed', a.hp <= 0.05);

      const machNum = a.speed || 0.85;
      const sOpt = (a.effectiveMaxSpeed || 0.95) * 0.65;
      const spdColor = this.ui.getSpeedColor(machNum, sOpt, a.effectiveMaxSpeed || 1.0);
      const altColor = this.ui.getAltColor(a.altFt || 30000);
      const loadColor = this.ui.getLoadColor(a.Wr || 0);
      const payloadPercent = Math.round((a.Wr || 0) * 100);
      const displayHp = a.hp > 0.05 ? Math.max(1, Math.round(a.hp)) : 0;

      const hpEl = card.querySelector('.tcard-hp');
      const hpFill = card.querySelector('.tcard-hp-fill');
      const spdEl = card.querySelector('.tcard-spd');
      const altEl = card.querySelector('.tcard-alt');
      const loadEl = card.querySelector('.tcard-load');
      const statusEl = card.querySelector('.tcard-status');
      const csEl = card.querySelector('.tcard-callsign');

      if (csEl) {
        csEl.style.color = a.isAce ? '#ffd700' : ((a.team === 'friendly') ? '#00f0ff' : '#ff3366');
      }
      if (hpEl) {
        hpEl.textContent = `${displayHp} / ${a.maxHp} HP`;
        hpEl.style.color = displayHp <= 1 ? '#ff3366' : (displayHp <= 2 ? '#f97316' : '#00f5a0');
      }
      if (hpFill) {
        hpFill.style.width = `${((a.hp / a.maxHp) * 100)}%`;
        hpFill.style.background = displayHp <= 1 ? '#ff3366' : (displayHp <= 2 ? '#f97316' : '#00f5a0');
      }
      if (spdEl) { spdEl.textContent = `M ${machNum.toFixed(2)}`; spdEl.style.color = spdColor; }
      if (altEl) { altEl.textContent = `FL${Math.round((a.altFt || 30000) / 100)}`; altEl.style.color = altColor; }
      if (loadEl) { loadEl.textContent = `${payloadPercent}%`; loadEl.style.color = loadColor; }
      if (statusEl) {
        statusEl.textContent = a.isRTB ? 'RTB' : (a.activeManeuverTimer > 0 ? 'EVADE' : 'COMBAT');
        statusEl.style.color = a.isRTB ? '#00f5a0' : (a.activeManeuverTimer > 0 ? '#ff3366' : '#38bdf8');
      }
    });
  }
}

window.AvionicsRosterDisplay = AvionicsRosterDisplay;
