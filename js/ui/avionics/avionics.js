/**
 * AIRSPACE STANDOFF: Avionics UI
 * Telemetry display, corner velocity turn efficiency, and stores management.
 */

class AvionicsUI {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.rosterDisplay = new AvionicsRosterDisplay(this);
    this.lastMfdUnitId = null;
    this.initRWRInteractions();
    this.initRTBButton();
  }

  renderFlightRoster() {
    this.rosterDisplay.renderFlightRoster();
  }

  initRWRInteractions() {
    const rwrBox = document.getElementById('rwr-threat-indicator');
    if (rwrBox) {
      rwrBox.onclick = () => {
        const modal = document.getElementById('rwr-briefing-modal');
        if (modal) modal.classList.add('active');
        if (this.game.controls) this.game.controls.autoPauseOnDialogOpen();
      };
    }
    const closeRwrBtn = document.getElementById('btn-close-rwr-modal');
    if (closeRwrBtn) {
      closeRwrBtn.onclick = () => {
        const modal = document.getElementById('rwr-briefing-modal');
        if (modal) modal.classList.remove('active');
        if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
      };
    }
  }

  initRTBButton() {
    const rtbBtn = document.getElementById('btn-rtb-rearm');
    if (rtbBtn) {
      rtbBtn.onclick = () => {
        if (this.game.activeUnit && this.game.activeUnit.hp > 0) {
          const isReturning = this.game.activeUnit.toggleRTB();
          if (this.game.radar) {
            const msg = isReturning ? 'RETURN TO BASE ORDERED' : 'ENGAGING TARGETS';
            const col = isReturning ? '#00f5a0' : '#38bdf8';
            this.game.radar.spawnCombatText(this.game.activeUnit.x, this.game.activeUnit.y, msg, col);
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.updateActiveUnitMFD();
        }
      };
    }
  }

  getSpeedColor(speed, sOpt, sMax) {
    if (speed < 0.35) return '#ff3366';
    if (speed >= sMax * 0.98) return '#00f0ff';
    if (Math.abs(speed - sOpt) < 0.12) return '#00f5a0';
    return speed < sOpt ? '#f97316' : '#38bdf8';
  }

  getAltColor(altFt) {
    if (altFt >= 40000) return '#00f0ff';
    if (altFt >= 20000) return '#00f5a0';
    return altFt >= 10000 ? '#38bdf8' : '#ff3366';
  }

  getTurnColor(et, isCoffin = false) {
    if (isCoffin) return '#c7d2fe';
    return et >= 0.88 ? '#00f0ff' : (et >= 0.75 ? '#00f5a0' : (et >= 0.60 ? '#38bdf8' : '#ff3366'));
  }

  getLoadColor(wr) { return wr <= 0.35 ? '#00f0ff' : (wr <= 0.60 ? '#00f5a0' : (wr <= 0.80 ? '#f97316' : '#ff3366')); }
  getStressColor(s) { return s <= 0.30 ? '#00f5a0' : (s <= 0.65 ? '#f97316' : '#ff3366'); }

  updateActiveUnitMFD() {
    const u = this.game.activeUnit;
    const nameEl = document.getElementById('mfd-unit-name');
    const callsignValEl = document.getElementById('mfd-callsign-val');
    const coffinTag = document.getElementById('mfd-coffin-tag');
    const leadTag = document.getElementById('mfd-lead-tag');
    const aceTag = document.getElementById('mfd-ace-tag');
    const rtbBtn = document.getElementById('btn-rtb-rearm');
    const stressValEl = document.getElementById('mfd-stress-val');
    const stressFillEl = document.getElementById('mfd-stress-fill');
    const glocEl = document.getElementById('gloc-badge');
    const stressWarnEl = document.getElementById('stress-warning-badge');
    const inspectUnitBtn = document.getElementById('btn-inspect-active-unit');
    const slider = document.getElementById('engine-slider');
    const alphaLabel = document.getElementById('alpha-val');

    const hudSpdMain = document.getElementById('hud-speed-main');
    const hudSpdArrow = document.getElementById('hud-speed-arrow');
    const hudSpdSub = document.getElementById('hud-speed-sub');
    const hudAltMain = document.getElementById('hud-alt-main');
    const hudAltArrow = document.getElementById('hud-alt-arrow');
    const hudVsi = document.getElementById('hud-vsi');
    const hudCallsign = document.getElementById('hud-unit-callsign');
    const hudModel = document.getElementById('hud-unit-model');
    const hudCardinal = document.getElementById('hud-hdg-cardinal');
    const hudDeg = document.getElementById('hud-hdg-deg');
    const hudEturn = document.getElementById('hud-eturn-tag');
    const hudWr = document.getElementById('hud-wr-tag');

    if (!u || u.hp <= 0) {
      if (nameEl) nameEl.textContent = 'NO CRAFT SELECTED';
      if (callsignValEl) { callsignValEl.textContent = '--'; callsignValEl.style.color = '#8494ab'; }
      if (coffinTag) coffinTag.classList.add('hidden');
      if (leadTag) leadTag.classList.add('hidden');
      if (aceTag) aceTag.classList.add('hidden');
      if (stressValEl) { stressValEl.textContent = '0.00'; stressValEl.style.color = '#8494ab'; }
      if (stressFillEl) stressFillEl.style.width = '0%';
      if (glocEl) glocEl.classList.add('hidden');
      if (stressWarnEl) stressWarnEl.classList.add('hidden');
      if (inspectUnitBtn) inspectUnitBtn.classList.add('hidden');
      if (this.game.deckManager) {
        this.game.deckManager.renderManeuverHand(null);
        this.game.deckManager.renderPylonBay(null, null);
      }
      return;
    }

    const isFriendly = (u.team === 'friendly');
    const modelName = u.spec ? u.spec.name : 'AIRCRAFT';
    const callsignText = String(u.callsign || 'PILOT').replace(/<[^>]*>/g, '');
    const displayName = window.formatAircraftDisplayName ? window.formatAircraftDisplayName(u) : `${callsignText} - ${modelName}`;

    if (nameEl) nameEl.textContent = modelName;
    if (callsignValEl) {
      callsignValEl.textContent = displayName;
      callsignValEl.style.color = isFriendly ? '#00f0ff' : '#ff3366';
    }
    if (coffinTag) coffinTag.classList.toggle('hidden', !u.isCoffin);
    if (leadTag) leadTag.classList.toggle('hidden', !(u.isFlightLead && !u.isAce));
    if (aceTag) aceTag.classList.toggle('hidden', !u.isAce);
    if (inspectUnitBtn) {
      inspectUnitBtn.classList.remove('hidden');
      inspectUnitBtn.setAttribute('data-inspect-type', 'airframe');
      inspectUnitBtn.setAttribute('data-inspect-id', u.spec ? u.spec.id : '');
    }

    const machNum = u.speed || 0.85;
    const sOpt = (typeof u.getOptimalCornerSpeed === 'function') ? u.getOptimalCornerSpeed() : ((u.effectiveMaxSpeed || 0.95) * 0.65);
    const fpm = Math.round(u.vsiFpm || 0);

    let eturn = Physics.calcTurnEfficiency(u.speed || 0.8, sOpt);
    if (u.turnBonus) eturn = Math.min(1.0, eturn + u.turnBonus);
    if (u.stress >= 0.65 && !u.isCoffin && !u.spec.isDrone) eturn *= 0.70;

    let deg = Math.round(((u.heading || 0) * 180 / Math.PI) % 360);
    if (deg < 0) deg += 360;
    const cardStr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

    if (hudSpdMain) { hudSpdMain.textContent = 'M ' + machNum.toFixed(2); hudSpdMain.style.color = this.getSpeedColor(machNum, sOpt, u.effectiveMaxSpeed || 1.0); }
    if (hudSpdArrow) hudSpdArrow.textContent = u.speedTrend || '--';
    if (hudSpdSub) hudSpdSub.textContent = Math.round(machNum * 1225).toLocaleString() + ' km/h';

    if (hudAltMain) { hudAltMain.textContent = 'FL' + Math.round(u.altFt / 100); hudAltMain.style.color = this.getAltColor(u.altFt); }
    if (hudAltArrow) hudAltArrow.textContent = u.altTrend || '--';
    if (hudVsi) {
      hudVsi.textContent = (fpm > 0 ? '+' : '') + fpm + ' fpm ' + (fpm > 300 ? 'CLIMB' : (fpm < -300 ? 'DIVE' : 'LVL'));
      hudVsi.style.color = fpm > 300 ? '#00f5a0' : (fpm < -300 ? '#ff3366' : '#8494ab');
    }

    if (hudCallsign) {
      hudCallsign.textContent = `${callsignText.toUpperCase()}${u.isAce ? ' [ACE]' : (u.isFlightLead ? ' [LEAD]' : '')}`;
      hudCallsign.style.color = u.isAce ? '#ffd700' : (u.isFlightLead ? '#38bdf8' : (isFriendly ? '#00f0ff' : '#ff3366'));
    }
    if (hudModel) hudModel.textContent = `${modelName.toUpperCase()} - ${u.spec ? u.spec.role.toUpperCase() : 'AIRCRAFT'}`;
    if (hudCardinal) hudCardinal.textContent = cardStr;
    if (hudDeg) hudDeg.textContent = String(deg).padStart(3, '0') + '\u00B0';

    if (hudEturn) {
      if (u.isCoffin) {
        hudEturn.textContent = 'TURN: 100% LOCKED';
        hudEturn.style.color = '#c7d2fe';
      } else {
        hudEturn.textContent = 'TURN: ' + Math.round(eturn * 100) + '%' + (eturn >= 0.88 ? ' OPT' : '');
        hudEturn.style.color = this.getTurnColor(eturn, false);
      }
    }

    if (hudWr) {
      const pPct = Math.round((u.Wr || 0) * 100);
      hudWr.textContent = 'LOAD: ' + pPct + '% ' + (pPct <= 35 ? 'LIGHT' : (pPct <= 60 ? 'NORM' : (pPct <= 80 ? 'HEAVY' : 'OVERLOAD')));
      hudWr.style.color = this.getLoadColor(u.Wr || 0);
    }

    const pct = Math.round((u.engineAlpha !== undefined ? u.engineAlpha : 0.50) * 100);
    const targetMach = (typeof u.getTargetMach === 'function') ? u.getTargetMach() : (u.speed || 0.85);

    if (slider) {
      if (document.activeElement !== slider) slider.value = pct;
      slider.className = 'military-throttle-slider';
    }

    if (alphaLabel) {
      const modeText = pct > 85 ? 'AFTERBURNER' : (pct > 75 ? 'MIL POWER' : (pct > 35 ? 'CRUISE' : 'IDLE'));
      alphaLabel.textContent = `${pct}% ${modeText} [M ${targetMach.toFixed(2)}]`;
      alphaLabel.style.color = pct > 85 ? '#f97316' : '#38bdf8';
      alphaLabel.classList.toggle('burner', pct > 85);
    }

    if (rtbBtn) {
      rtbBtn.textContent = u.isRTB ? 'CANCEL RETURN TO BASE' : 'RETURN TO BASE';
      rtbBtn.style.background = u.isRTB ? '#450a0a' : '#064e3b';
      rtbBtn.style.color = u.isRTB ? '#fecdd3' : '#a7f3d0';
    }

    const stressVal = u.isCoffin ? 0.0 : (u.stress || 0);
    if (stressValEl) {
      stressValEl.textContent = u.isCoffin ? 'IMMUNE' : stressVal.toFixed(2);
      stressValEl.style.color = u.isCoffin ? '#6366f1' : this.getStressColor(stressVal);
    }
    if (stressFillEl) stressFillEl.style.width = u.isCoffin ? '0%' : Math.round(stressVal * 100) + '%';
    if (glocEl) glocEl.classList.toggle('hidden', u.isCoffin || u.glocTimer <= 0);
    if (stressWarnEl) stressWarnEl.classList.toggle('hidden', u.isCoffin || u.stress < 0.65 || u.glocTimer > 0);

    if (this.game.deckManager) {
      this.game.deckManager.renderManeuverHand(u);
      this.game.deckManager.renderPylonBay(u, this.game.selectedTarget);
    }
  }

  updateRWRState() {
    let rwrState = 'clean';
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const activeUnit = this.game.activeUnit;
    const lockingThreats = [];

    if (this.game.missiles && activeUnit && activeUnit.hp > 0) {
      for (let i = 0; i < this.game.missiles.length; i++) {
        const m = this.game.missiles[i];
        if (m.active && m.team !== commanderTeam && m.target && m.target.id === activeUnit.id) {
          lockingThreats.push(m);
        }
      }
    }

    const detailEl = document.getElementById('rwr-threat-detail');
    if (lockingThreats.length > 0) {
      const nearest = lockingThreats.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, lockingThreats[0]);
      rwrState = nearest.distanceToTarget < 30 ? 'lock' : 'sweep';
      if (detailEl) detailEl.textContent = `INBOUND MSL: ${Math.round(nearest.distanceToTarget)}km`;
    } else {
      let hasLocks = false;
      if (activeUnit && activeUnit.hp > 0) {
        const hostileFleet = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
        for (let i = 0; i < hostileFleet.length; i++) {
          const h = hostileFleet[i];
          if (h.hp > 0 && h.radarLockedTarget && h.radarLockedTarget.id === activeUnit.id) {
            hasLocks = true;
            break;
          }
        }
      }
      rwrState = hasLocks ? 'lock' : 'clean';
      if (detailEl) detailEl.textContent = hasLocks ? 'HOSTILE RADAR LOCK ON CRAFT' : 'NO EMISSIONS DETECTED';
    }

    const indicator = document.getElementById('rwr-state');
    if (indicator) {
      indicator.className = 'rwr-status ' + rwrState;
      indicator.textContent = (rwrState === 'lock') ? 'RADAR LOCK (WARNING)' :
                              (rwrState === 'sweep') ? 'RADAR SWEEP' : 'SEARCH CLEAR';
    }
    if (typeof AudioSys !== 'undefined') AudioSys.updateRWR(rwrState);
  }
}

window.AvionicsUI = AvionicsUI;