/**
 * AIRSPACE STANDOFF // Avionics UI
 * Displays telemetry, compass tape, and full names (RETURN TO BASE).
 */

class AvionicsUI {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.rosterDisplay = new AvionicsRosterDisplay(this);
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
            const msg = isReturning ? 'HIGH-SPEED RETURN TO BASE ORDERED' : 'RETURN TO BASE CANCELLED - ENGAGING';
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

  getTurnColor(et) { return et >= 0.88 ? '#00f0ff' : (et >= 0.75 ? '#00f5a0' : (et >= 0.60 ? '#38bdf8' : '#ff3366')); }
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

      if (hudSpdMain) { hudSpdMain.textContent = 'M 0.00'; hudSpdMain.style.color = '#8494ab'; }
      if (hudSpdArrow) { hudSpdArrow.textContent = '--'; hudSpdArrow.className = 'rfh-arrow val-trend-flat'; }
      if (hudSpdSub) hudSpdSub.textContent = '0 km/h';
      if (hudAltMain) { hudAltMain.textContent = 'FL000'; hudAltMain.style.color = '#8494ab'; }
      if (hudAltArrow) { hudAltArrow.textContent = '--'; hudAltArrow.className = 'rfh-arrow val-trend-flat'; }
      if (hudVsi) hudVsi.textContent = '0 fpm LVL';
      if (hudCallsign) hudCallsign.textContent = 'NO CRAFT SELECTED';
      if (hudModel) hudModel.textContent = '--';
      if (hudCardinal) hudCardinal.textContent = 'N';
      if (hudDeg) hudDeg.textContent = '000°';
      if (hudEturn) hudEturn.textContent = 'TURN: --%';
      if (hudWr) hudWr.textContent = 'LOAD: --%';

      if (this.game.deckManager) {
        this.game.deckManager.renderManeuverHand(null);
        this.game.deckManager.renderPylonBay(null, null);
      }
      return;
    }

    const isFriendly = (u.team === 'friendly');
    const modelCode = u.spec ? u.spec.id : 'AIRCRAFT';
    const modelName = u.spec ? u.spec.name : 'AIRCRAFT';
    const callsignText = String(u.callsign || 'PILOT').replace(/<[^>]*>/g, '');

    if (nameEl) nameEl.textContent = modelName;
    if (callsignValEl) {
      callsignValEl.textContent = `${modelCode} (${callsignText})`;
      callsignValEl.style.color = isFriendly ? '#00f0ff' : '#ff3366';
    }

    if (coffinTag) coffinTag.classList.toggle('hidden', !u.isCoffin);
    if (leadTag) {
      const showLead = u.isFlightLead && !u.isAce;
      leadTag.classList.toggle('hidden', !showLead);
      if (showLead) {
        leadTag.setAttribute('data-inspect-type', 'lead');
        leadTag.setAttribute('data-inspect-id', u.spec ? u.spec.id : '');
      }
    }
    if (aceTag) aceTag.classList.toggle('hidden', !u.isAce);
    if (inspectUnitBtn) {
      inspectUnitBtn.classList.remove('hidden');
      inspectUnitBtn.setAttribute('data-inspect-type', 'airframe');
      inspectUnitBtn.setAttribute('data-inspect-id', u.spec ? u.spec.id : '');
    }

    const machNum = (u.speed || 0.85);
    const sOpt = (u.effectiveMaxSpeed || 0.95) * 0.65;
    const sTr = u.speedTrend || '--';
    const aTr = u.altTrend || '--';
    const fpm = Math.round(u.vsiFpm || 0);

    let eturn = (typeof Physics !== 'undefined') ? Physics.calcTurnEfficiency(u.speed || 0.8, sOpt) : 0.85;
    if (u.turnBonus) eturn = Math.min(1.0, eturn + u.turnBonus);
    if (u.stress >= 0.65 && !u.isCoffin && !u.spec.isDrone) eturn *= 0.70;

    let deg = Math.round((u.heading * 180 / Math.PI) % 360);
    if (deg < 0) deg += 360;
    const cardStr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

    if (hudSpdMain) { hudSpdMain.textContent = 'M ' + machNum.toFixed(2); hudSpdMain.style.color = this.getSpeedColor(machNum, sOpt, u.effectiveMaxSpeed || 1.0); }
    if (hudSpdArrow) { hudSpdArrow.textContent = sTr; hudSpdArrow.className = 'rfh-arrow ' + (sTr === '^' ? 'val-trend-up' : (sTr === 'v' ? 'val-trend-down' : 'val-trend-flat')); }
    if (hudSpdSub) hudSpdSub.textContent = Math.round(machNum * 1225).toLocaleString() + ' km/h';

    if (hudAltMain) { hudAltMain.textContent = 'FL' + Math.round(u.altFt / 100); hudAltMain.style.color = this.getAltColor(u.altFt); }
    if (hudAltArrow) { hudAltArrow.textContent = aTr; hudAltArrow.className = 'rfh-arrow ' + (aTr === '^' ? 'val-trend-up' : (aTr === 'v' ? 'val-trend-down' : 'val-trend-flat')); }
    if (hudVsi) {
      hudVsi.textContent = (fpm > 0 ? '+' : '') + fpm + ' fpm ' + (fpm > 300 ? 'CLIMB' : (fpm < -300 ? 'DIVE' : 'LVL'));
      hudVsi.style.color = fpm > 300 ? '#00f5a0' : (fpm < -300 ? '#ff3366' : '#8494ab');
    }

    if (hudCallsign) {
      const badge = u.isAce ? ' ACE' : (u.isFlightLead ? ' LEAD' : '');
      hudCallsign.textContent = `${modelCode}${badge}`;
      hudCallsign.style.color = u.isAce ? '#ffd700' : (u.isFlightLead ? '#38bdf8' : (isFriendly ? '#00f0ff' : '#ff3366'));
    }
    if (hudModel) hudModel.textContent = `${callsignText} - ${u.spec ? u.spec.role : ''}`;
    if (hudCardinal) { hudCardinal.textContent = cardStr; hudCardinal.style.color = (cardStr === 'E') ? '#00f0ff' : (cardStr === 'W' ? '#00f5a0' : '#f8fafc'); }
    if (hudDeg) hudDeg.textContent = String(deg).padStart(3, '0') + '°';
    if (hudEturn) { hudEturn.textContent = 'TURN: ' + Math.round(eturn * 100) + '%' + (eturn >= 0.88 ? ' OPT' : ''); hudEturn.style.color = this.getTurnColor(eturn); }
    if (hudWr) {
      const pPct = Math.round((u.Wr || 0) * 100);
      hudWr.textContent = 'LOAD: ' + pPct + '% ' + (pPct <= 35 ? 'CLEAN' : (pPct <= 60 ? 'NORM' : (pPct <= 80 ? 'HEAVY' : 'OVERLOAD')));
      hudWr.style.color = this.getLoadColor(u.Wr || 0);
    }

    const pct = Math.round((u.engineAlpha !== undefined ? u.engineAlpha : 0.60) * 100);
    if (slider) slider.value = pct;
    if (alphaLabel) {
      alphaLabel.textContent = pct + '% ' + (pct > 85 ? 'AFTERBURNER' : (pct > 75 ? 'MIL POWER' : (pct > 35 ? 'CRUISE' : 'IDLE')));
      alphaLabel.classList.toggle('burner', pct > 85);
    }

    if (rtbBtn) {
      rtbBtn.textContent = u.isRTB ? 'CANCEL RETURN TO BASE' : 'RETURN TO BASE';
      rtbBtn.style.background = u.isRTB ? '#450a0a' : '#064e3b';
      rtbBtn.style.borderColor = u.isRTB ? '#ef4444' : '#10b981';
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
    const lockingThreats = [];

    if (this.game.missiles) {
      for (let i = 0; i < this.game.missiles.length; i++) {
        const m = this.game.missiles[i];
        if (m.active && m.team !== commanderTeam && m.target && m.target.team === commanderTeam) {
          lockingThreats.push(m);
        }
      }
    }

    const detailEl = document.getElementById('rwr-threat-detail');
    if (lockingThreats.length > 0) {
      const nearest = lockingThreats.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, lockingThreats[0]);
      rwrState = nearest.distanceToTarget < 30 ? 'lock' : 'sweep';
      if (detailEl) {
        detailEl.textContent = nearest.isStealthMissile
          ? `STEALTH MSL: ${Math.round(nearest.distanceToTarget)}km`
          : `INBOUND MSL: ${Math.round(nearest.distanceToTarget)}km`;
      }
    } else {
      let hasSweeps = false;
      const hostileFleet = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
      for (const h of hostileFleet) {
        if (h.hp > 0 && h.radarLockedTarget && h.radarLockedTarget.team === commanderTeam) {
          hasSweeps = true; break;
        }
      }
      rwrState = hasSweeps ? 'sweep' : 'clean';
      if (detailEl) detailEl.textContent = hasSweeps ? 'HOSTILE RADAR SWEEP ACTIVE' : 'SECTOR SCAN CLEAR';
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