/**
 * AIRSPACE STANDOFF: Avionics UI
 * Telemetry display, corner velocity turn efficiency, and stores management.
 */

class AvionicsUI {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.rosterDisplay = new AvionicsRosterDisplay(this);
    this.lastMfdUnitId = null;
    this._cachedTexts = {};
    this._cachedStyles = {};
    this._mfdEls = null;
    this._rwrUnitId = null;
    this._rwrStableState = 'clean';
    this._rwrDowngradeCandidate = null;
    this._rwrDowngradeSince = 0;
    this.initRWRInteractions();
    this.initRTBButton();
  }

  getMfdEls() {
    if (this._mfdEls) return this._mfdEls;
    this._mfdEls = {
      nameEl: document.getElementById('mfd-unit-name'),
      callsignValEl: document.getElementById('mfd-callsign-val'),
      coffinTag: document.getElementById('mfd-coffin-tag'),
      leadTag: document.getElementById('mfd-lead-tag'),
      aceTag: document.getElementById('mfd-ace-tag'),
      rtbBtn: document.getElementById('btn-rtb-rearm'),
      stressValEl: document.getElementById('mfd-stress-val'),
      stressFillEl: document.getElementById('mfd-stress-fill'),
      glocEl: document.getElementById('gloc-badge'),
      stressWarnEl: document.getElementById('stress-warning-badge'),
      inspectUnitBtn: document.getElementById('btn-inspect-active-unit'),
      slider: document.getElementById('engine-slider'),
      alphaLabel: document.getElementById('alpha-val'),
      hudSpdMain: document.getElementById('hud-speed-main'),
      hudSpdArrow: document.getElementById('hud-speed-arrow'),
      hudSpdSub: document.getElementById('hud-speed-sub'),
      hudAltMain: document.getElementById('hud-alt-main'),
      hudAltArrow: document.getElementById('hud-alt-arrow'),
      hudVsi: document.getElementById('hud-vsi'),
      hudCallsign: document.getElementById('hud-unit-callsign'),
      hudModel: document.getElementById('hud-unit-model'),
      hudCardinal: document.getElementById('hud-hdg-cardinal'),
      hudDeg: document.getElementById('hud-hdg-deg'),
      hudEturn: document.getElementById('hud-eturn-tag'),
      hudWr: document.getElementById('hud-wr-tag')
    };
    return this._mfdEls;
  }

  setFastText(el, key, val) {
    if (!el) return;
    if (this._cachedTexts[key] !== val) {
      this._cachedTexts[key] = val;
      el.textContent = val;
    }
  }

  setFastColor(el, key, val) {
    if (!el) return;
    if (this._cachedStyles[key] !== val) {
      this._cachedStyles[key] = val;
      el.style.color = val;
    }
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
        if (this.game.activeUnit && this.game.activeUnit.hp > 0.05) {
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
    if (speed < 0.35) return '#ff3864';
    if (speed >= sMax * 0.98) return '#00e5ff';
    if (Math.abs(speed - sOpt) < 0.12) return '#00f5a0';
    return speed < sOpt ? '#fb923c' : '#38bdf8';
  }

  getAltColor(altFt) {
    if (altFt >= 40000) return '#00e5ff';
    if (altFt >= 20000) return '#00f5a0';
    return altFt >= 10000 ? '#38bdf8' : '#ff3864';
  }

  getTurnColor(et, isCoffin = false) {
    if (isCoffin) return '#c7d2fe';
    return et >= 0.88 ? '#00e5ff' : (et >= 0.75 ? '#00f5a0' : (et >= 0.60 ? '#38bdf8' : '#ff3864'));
  }

  getLoadColor(wr) { return wr <= 0.35 ? '#00e5ff' : (wr <= 0.60 ? '#00f5a0' : (wr <= 0.80 ? '#fb923c' : '#ff3864')); }
  getStressColor(s) { return s <= 0.30 ? '#00f5a0' : (s <= 0.65 ? '#fb923c' : '#ff3864'); }

  updateActiveUnitMFD() {
    const u = this.game.activeUnit;
    const {
      nameEl, callsignValEl, coffinTag, leadTag, aceTag, rtbBtn,
      stressValEl, stressFillEl, glocEl, stressWarnEl, inspectUnitBtn,
      slider, alphaLabel, hudSpdMain, hudSpdArrow, hudSpdSub,
      hudAltMain, hudAltArrow, hudVsi, hudCallsign, hudModel,
      hudCardinal, hudDeg, hudEturn, hudWr
    } = this.getMfdEls();

    if (!u || u.hp <= 0.05) {
      this.setFastText(nameEl, 'name', 'NO CRAFT SELECTED');
      this.setFastText(callsignValEl, 'cs', '--');
      if (callsignValEl) callsignValEl.style.color = '#8494ab';
      if (coffinTag) coffinTag.classList.add('hidden');
      if (leadTag) leadTag.classList.add('hidden');
      if (aceTag) aceTag.classList.add('hidden');
      this.setFastText(stressValEl, 'stress', '0.00');
      if (stressValEl) stressValEl.style.color = '#8494ab';
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

    this.setFastText(nameEl, 'name', modelName);
    this.setFastText(callsignValEl, 'cs', displayName);
    if (callsignValEl) callsignValEl.style.color = isFriendly ? '#00e5ff' : '#ff3864';

    if (coffinTag) coffinTag.classList.toggle('hidden', !u.isCoffin);
    if (leadTag) leadTag.classList.toggle('hidden', !(u.isFlightLead && !u.isAce));
    if (aceTag) aceTag.classList.toggle('hidden', !u.isAce);
    if (inspectUnitBtn) {
      inspectUnitBtn.classList.remove('hidden');
      inspectUnitBtn.setAttribute('data-inspect-type', 'airframe');
      inspectUnitBtn.setAttribute('data-inspect-id', u.spec ? u.spec.id : '');
    }

    const machNum = u.speed || 0.85;
    const sOpt = u.getOptimalCornerSpeed();
    const fpm = Math.round(u.vsiFpm || 0);

    let eturn = Physics.calcTurnEfficiency(u.speed || 0.8, sOpt);
    if (u.turnBonus) eturn = Math.min(1.0, eturn + u.turnBonus);
    if (u.stress >= 0.65 && !u.isCoffin && !u.spec.isDrone) eturn *= 0.70;

    let deg = Math.round(((u.heading || 0) * 180 / Math.PI) % 360);
    if (deg < 0) deg += 360;
    const cardStr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

    this.setFastText(hudSpdMain, 'spdM', 'M ' + machNum.toFixed(2));
    if (hudSpdMain) hudSpdMain.style.color = this.getSpeedColor(machNum, sOpt, u.effectiveMaxSpeed || 1.0);
    this.setFastText(hudSpdArrow, 'spdA', u.speedTrend || '--');
    this.setFastText(hudSpdSub, 'spdSub', Math.round(machNum * 1225).toLocaleString() + ' km/h');

    this.setFastText(hudAltMain, 'altM', 'FL' + Math.round(u.altFt / 100));
    if (hudAltMain) hudAltMain.style.color = this.getAltColor(u.altFt);
    this.setFastText(hudAltArrow, 'altA', u.altTrend || '--');
    const vsiStr = (fpm > 0 ? '+' : '') + fpm + ' fpm ' + (fpm > 300 ? 'CLIMB' : (fpm < -300 ? 'DIVE' : 'LVL'));
    this.setFastText(hudVsi, 'vsi', vsiStr);
    if (hudVsi) hudVsi.style.color = fpm > 300 ? '#00f5a0' : (fpm < -300 ? '#ff3864' : '#8494ab');

    this.setFastText(hudCallsign, 'hCs', `${callsignText.toUpperCase()}${u.isAce ? ' [ACE]' : (u.isFlightLead ? ' [LEAD]' : '')}`);
    if (hudCallsign) hudCallsign.style.color = u.isAce ? '#ffd700' : (u.isFlightLead ? '#38bdf8' : (isFriendly ? '#00e5ff' : '#ff3864'));
    this.setFastText(hudModel, 'hMod', `${modelName.toUpperCase()} - ${u.spec ? u.spec.role.toUpperCase() : 'AIRCRAFT'}`);
    this.setFastText(hudCardinal, 'hCard', cardStr);
    this.setFastText(hudDeg, 'hDeg', String(deg).padStart(3, '0') + '\u00B0');

    if (hudEturn) {
      if (u.isCoffin) {
        this.setFastText(hudEturn, 'hTurn', 'TURN: 100% LOCKED');
        hudEturn.style.color = '#c7d2fe';
      } else {
        this.setFastText(hudEturn, 'hTurn', 'TURN: ' + Math.round(eturn * 100) + '%' + (eturn >= 0.88 ? ' OPT' : ''));
        hudEturn.style.color = this.getTurnColor(eturn, false);
      }
    }

    if (hudWr) {
      const pPct = Math.round((u.Wr || 0) * 100);
      this.setFastText(hudWr, 'hWr', 'LOAD: ' + pPct + '% ' + (pPct <= 35 ? 'LIGHT' : (pPct <= 60 ? 'NORM' : (pPct <= 80 ? 'HEAVY' : 'OVERLOAD'))));
      hudWr.style.color = this.getLoadColor(u.Wr || 0);
    }

    const pct = Math.round((u.engineAlpha !== undefined ? u.engineAlpha : 0.50) * 100);
    const targetMach = u.getTargetMach();

    if (slider && document.activeElement !== slider) {
      slider.value = pct;
    }

    if (alphaLabel) {
      const modeText = pct > 85 ? 'AFTERBURNER' : (pct > 75 ? 'MIL POWER' : (pct > 35 ? 'CRUISE' : 'IDLE'));
      this.setFastText(alphaLabel, 'alphaLbl', `${pct}% ${modeText} [M ${targetMach.toFixed(2)}]`);
      alphaLabel.style.color = pct > 85 ? '#fb923c' : '#38bdf8';
      alphaLabel.classList.toggle('burner', pct > 85);
    }

    if (rtbBtn) {
      const rtbText = u.isRTB ? 'CANCEL RETURN TO BASE' : 'RETURN TO BASE';
      this.setFastText(rtbBtn, 'rtb', rtbText);
      rtbBtn.style.background = '';
      rtbBtn.style.color = '';
      rtbBtn.classList.toggle('is-rtb', Boolean(u.isRTB));
    }

    const stressVal = u.isCoffin ? 0.0 : (u.stress || 0);
    if (stressValEl) {
      this.setFastText(stressValEl, 'stressNum', u.isCoffin ? 'IMMUNE' : stressVal.toFixed(2));
      stressValEl.style.color = u.isCoffin ? '#6366f1' : this.getStressColor(stressVal);
    }
    if (stressFillEl) {
      const nextStressW = u.isCoffin ? '0%' : Math.round(stressVal * 100) + '%';
      if (this._cachedStyles.stressFillW !== nextStressW) {
        this._cachedStyles.stressFillW = nextStressW;
        stressFillEl.style.width = nextStressW;
      }
    }
    if (glocEl) glocEl.classList.toggle('hidden', u.isCoffin || u.glocTimer <= 0);
    if (stressWarnEl) stressWarnEl.classList.toggle('hidden', u.isCoffin || u.stress < 0.65 || u.glocTimer > 0);

    if (this.game.deckManager) {
      this.game.deckManager.renderManeuverHand(u);
      this.game.deckManager.renderPylonBay(u, this.game.selectedTarget);
    }
  }

  updateRWRState() {
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const activeUnit = this.game.activeUnit;
    const unitId = (activeUnit && activeUnit.hp > 0.05) ? activeUnit.id : null;

    if (unitId !== this._rwrUnitId) {
      this._rwrUnitId = unitId;
      this._rwrStableState = 'clean';
      this._rwrDowngradeCandidate = null;
      this._rwrDowngradeSince = 0;
    }

    let rawState = 'clean';
    let detailText = 'NO EMISSIONS DETECTED';
    const lockingThreats = [];

    if (this.game.missiles && unitId) {
      for (let i = 0; i < this.game.missiles.length; i++) {
        const m = this.game.missiles[i];
        if (m.active && m.team !== commanderTeam && m.target && m.target.id === unitId) {
          lockingThreats.push(m);
        }
      }
    }

    if (lockingThreats.length > 0) {
      const nearest = lockingThreats.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, lockingThreats[0]);
      const lockThresholdKm = (this._rwrStableState === 'lock') ? 33.0 : 30.0;
      rawState = nearest.distanceToTarget < lockThresholdKm ? 'lock' : 'sweep';
      detailText = `INBOUND MSL: ${Math.round(nearest.distanceToTarget)}km`;
    } else if (unitId) {
      let hasLocks = false;
      const hostileFleet = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
      for (let i = 0; i < hostileFleet.length; i++) {
        const h = hostileFleet[i];
        if (h.hp > 0.05 && !h.isRTB && h.radarLockedTarget && h.radarLockedTarget.id === unitId) {
          hasLocks = true;
          break;
        }
      }
      rawState = hasLocks ? 'lock' : 'clean';
      detailText = hasLocks ? 'HOSTILE RADAR LOCK ON CRAFT' : 'NO EMISSIONS DETECTED';
    }

    const rank = { clean: 0, sweep: 1, lock: 2 };
    const nowMs = performance.now();
    if (!unitId) {
      this._rwrStableState = 'clean';
      this._rwrDowngradeCandidate = null;
      this._rwrDowngradeSince = 0;
    } else if (rank[rawState] >= rank[this._rwrStableState]) {
      this._rwrStableState = rawState;
      this._rwrDowngradeCandidate = null;
      this._rwrDowngradeSince = 0;
    } else {
      const holdMs = (this._rwrStableState === 'lock') ? 550 : 450;
      if (this._rwrDowngradeCandidate !== rawState) {
        this._rwrDowngradeCandidate = rawState;
        this._rwrDowngradeSince = nowMs;
      } else if (nowMs - this._rwrDowngradeSince >= holdMs) {
        this._rwrStableState = rawState;
        this._rwrDowngradeCandidate = null;
        this._rwrDowngradeSince = 0;
      }
    }

    const rwrState = this._rwrStableState;
    const detailEl = document.getElementById('rwr-threat-detail');
    this.setFastText(detailEl, 'rwrDetail', detailText);

    const indicator = document.getElementById('rwr-state');
    if (indicator) {
      if (indicator.className !== 'rwr-status ' + rwrState) {
        indicator.className = 'rwr-status ' + rwrState;
      }
      const rwrLabel = (rwrState === 'lock') ? 'RADAR LOCK (WARNING)' :
                       (rwrState === 'sweep') ? 'RADAR SWEEP' : 'SEARCH CLEAR';
      this.setFastText(indicator, 'rwrStateText', rwrLabel);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.updateRWR(rwrState);
  }
}

window.AvionicsUI = AvionicsUI;
