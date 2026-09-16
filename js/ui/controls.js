/**
 * AIRSPACE STANDOFF // Controls System Coordinator
 * Pure manual target selection and switching. Full RTB names and no hotkeys in UI text.
 */

class ControlsSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.keyboard = new KeyboardControlsHandler(this);
    this.pointer = new PointerControlsHandler(this);
  }

  init() {
    this.initHUDButtons();
    this.initModeSelectors();
    this.initMobileControls();
    this.initTimeWarpControls();
    this.initPauseScreenModal();
  }

  initTimeWarpControls() {
    const btnPause = document.getElementById('btn-time-pause');
    const btn1x = document.getElementById('btn-time-1x');
    const btn2x = document.getElementById('btn-time-2x');
    const btn4x = document.getElementById('btn-time-4x');

    if (btnPause) btnPause.onclick = () => this.togglePause();
    if (btn1x) btn1x.onclick = () => this.setTimeWarp(1);
    if (btn2x) btn2x.onclick = () => this.setTimeWarp(2);
    if (btn4x) btn4x.onclick = () => this.setTimeWarp(4);
  }

  setTimeWarp(speed) {
    if (this.game.simulation) {
      this.game.simulation.setTimeWarp(speed);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  togglePause() {
    if (this.game.simulation) {
      this.game.simulation.togglePause();
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  autoPauseOnDialogOpen() {
    if (this.game.simulation && !this.game.simulation.isPaused) {
      this.game.simulation.setTimeWarp(0);
      this._wasAutoPaused = true;
    }
  }

  autoUnpauseOnDialogClose() {
    if (this._wasAutoPaused && this.game.simulation) {
      this.game.simulation.setTimeWarp(1);
      this._wasAutoPaused = false;
    }
  }

  initPauseScreenModal() {
    const modal = document.getElementById('pause-modal');
    const btnResume = document.getElementById('btn-resume-sortie');
    const btnSettings = document.getElementById('btn-pause-settings');
    const btnManual = document.getElementById('btn-pause-manual');
    const btnAbort = document.getElementById('btn-pause-abort');

    if (btnResume) {
      btnResume.onclick = () => {
        if (modal) modal.classList.remove('active');
        this.setTimeWarp(1);
      };
    }

    if (btnSettings) {
      btnSettings.onclick = () => {
        const sm = document.getElementById('settings-modal');
        if (sm) sm.classList.add('active');
      };
    }

    if (btnManual) {
      btnManual.onclick = () => {
        const gm = document.getElementById('glossary-modal');
        if (gm) gm.classList.add('active');
      };
    }

    if (btnAbort) {
      btnAbort.onclick = () => {
        if (modal) modal.classList.remove('active');
        this.game.abortSortie();
      };
    }
  }

  initMobileControls() {
    const prevBtn = document.getElementById('btn-mobile-prev-unit');
    const nextBtn = document.getElementById('btn-mobile-next-unit');
    if (prevBtn) prevBtn.onclick = () => this.cycleFriendlyUnit(-1);
    if (nextBtn) nextBtn.onclick = () => this.cycleFriendlyUnit(1);

    const openFleetBtn = document.getElementById('btn-mobile-open-fleet');
    const closeFleetBtn = document.getElementById('btn-close-fleet-drawer');
    const fleetPane = document.getElementById('pane-fleet');

    const openDrawer = () => {
      if (fleetPane) {
        fleetPane.classList.add('drawer-open');
        this.game.avionics.renderFlightRoster();
      }
    };
    const closeDrawer = () => {
      if (fleetPane) fleetPane.classList.remove('drawer-open');
    };

    if (openFleetBtn) openFleetBtn.onclick = openDrawer;
    if (closeFleetBtn) closeFleetBtn.onclick = closeDrawer;

    const steerLeft = document.getElementById('mobile-steer-left');
    const steerRight = document.getElementById('mobile-steer-right');
    const bindSteer = (btn, code) => {
      if (!btn) return;
      const start = (e) => { e.preventDefault(); this.keyboard.keysHeld[code] = true; };
      const end = (e) => { e.preventDefault(); this.keyboard.keysHeld[code] = false; };
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', end);
      btn.addEventListener('pointercancel', end);
      btn.addEventListener('pointerleave', end);
    };
    bindSteer(steerLeft, 'ArrowLeft');
    bindSteer(steerRight, 'ArrowRight');
  }

  initHUDButtons() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) audioBtn.onclick = () => { audioBtn.textContent = AudioSys.toggle() ? 'AUDIO: ON' : 'AUDIO: OFF'; };

    const inspectCraftBtn = document.getElementById('btn-inspect-active-unit');
    if (inspectCraftBtn) {
      inspectCraftBtn.onclick = (e) => {
        e.stopPropagation();
        if (this.game.activeUnit && this.game.activeUnit.spec && window.openSystemInspectModal) {
          window.openSystemInspectModal('airframe', this.game.activeUnit.spec.id);
        }
      };
    }

    const slider = document.getElementById('engine-slider');
    if (slider) {
      slider.oninput = (e) => {
        if (!this.game.activeUnit || this.game.activeUnit.hp <= 0) return;
        const alpha = parseInt(e.target.value, 10) / 100.0;
        this.game.activeUnit.engineAlpha = alpha;
        this.game.avionics.updateActiveUnitMFD();
      };
    }

    const diveBtn = document.getElementById('btn-pitch-dive');
    if (diveBtn) diveBtn.onclick = () => this.executeDive();

    const climbBtn = document.getElementById('btn-pitch-climb');
    if (climbBtn) climbBtn.onclick = () => this.executeZoomClimb();

    const abortBtn = document.getElementById('btn-abort-match');
    const abortModal = document.getElementById('abort-confirm-modal');
    const confirmAbort = document.getElementById('btn-confirm-abort');
    const cancelAbort = document.getElementById('btn-cancel-abort');

    if (abortBtn && abortModal) {
      abortBtn.onclick = () => {
        this.autoPauseOnDialogOpen();
        abortModal.classList.add('active');
      };
    }
    if (cancelAbort && abortModal) {
      cancelAbort.onclick = () => {
        abortModal.classList.remove('active');
        this.autoUnpauseOnDialogClose();
      };
    }
    if (confirmAbort && abortModal) {
      confirmAbort.onclick = () => {
        abortModal.classList.remove('active');
        this.game.abortSortie();
      };
    }

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.onclick = () => {
        const gameOverModal = document.getElementById('game-over-modal');
        const procModal = document.getElementById('procurement-modal');
        if (gameOverModal) gameOverModal.classList.remove('active');
        if (procModal) procModal.classList.add('active');
      };
    }

    const toggleTimelineBtn = document.getElementById('btn-toggle-aar-timeline');
    const timelineList = document.getElementById('aar-timeline-list');
    if (toggleTimelineBtn && timelineList) {
      toggleTimelineBtn.onclick = () => {
        timelineList.classList.toggle('hidden');
        toggleTimelineBtn.textContent = timelineList.classList.contains('hidden') ? 'EXPAND TIMELINE' : 'COLLAPSE TIMELINE';
      };
    }
  }

  executeDive() {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0) return;
    if (this.game.consumeCurrentCommanderTokens(0.4)) {
      u.dive();
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'DIVE', '#00f0ff');
      this.game.avionics.updateActiveUnitMFD();
    }
  }

  executeZoomClimb() {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0) return;
    if (u.speed < 0.45) {
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'TOO SLOW FOR ZOOM', '#ff3366');
      return;
    }
    if (this.game.consumeCurrentCommanderTokens(0.4)) {
      u.zoomClimb();
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'ZOOM CLIMB', '#00f5a0');
      this.game.avionics.updateActiveUnitMFD();
    }
  }

  adjustActiveThrottle(delta) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0) return;
    u.engineAlpha = Math.max(0.20, Math.min(1.0, (u.engineAlpha || 0.60) + delta));
    this.game.avionics.updateActiveUnitMFD();
  }

  cycleFriendlyUnit(direction) {
    const roster = (this.game.currentPvpCommander === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;
    const live = roster.filter(a => a.hp > 0);
    if (live.length === 0) return;
    const curIdx = live.findIndex(a => this.game.activeUnit && this.game.activeUnit.id === a.id);
    const nextIdx = (curIdx + direction + live.length) % live.length;
    this.game.activeUnit = live[nextIdx];
    if (this.game.radar && this.game.radar.trackingUnit) this.game.radar.trackingUnit = this.game.activeUnit;
    this.game.avionics.renderFlightRoster();
    this.game.avionics.updateActiveUnitMFD();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  // MANUAL TARGET CYCLING
  getDetectedTargets() {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return [];

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const detectedSet = (commanderTeam === 'friendly')
      ? (this.game.detectedByBlue || new Set())
      : (this.game.detectedByRed || new Set());
    const enemyRoster = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
    const enemyTeamTag = (commanderTeam === 'friendly') ? 'hostile' : 'friendly';

    const detected = [];

    for (const h of enemyRoster) {
      if (h && h.hp > 0 && detectedSet.has(h.id)) {
        const dist = Math.hypot(h.x - active.x, h.y - active.y);
        detected.push({ entity: h, dist: dist });
      }
    }

    const ghosts = (this.game.simulation && this.game.simulation.ghostContacts) || [];
    for (const g of ghosts) {
      if (g && g.hp > 0 && !g.isDissolved && detectedSet.has(g.id)) {
        const distG = Math.hypot(g.x - active.x, g.y - active.y);
        detected.push({ entity: g, dist: distG });
      }
    }

    const decoys = (this.game.simulation && this.game.simulation.decoyDrones) || [];
    for (const d of decoys) {
      if (d && d.hp > 0 && d.team === enemyTeamTag && detectedSet.has(d.id)) {
        const distD = Math.hypot(d.x - active.x, d.y - active.y);
        detected.push({ entity: d, dist: distD });
      }
    }

    for (const s of this.game.surfaceUnits) {
      if (s && s.team === enemyTeamTag && s.hp > 0 && detectedSet.has(s.id)) {
        const distS = Math.hypot(s.x - active.x, s.y - active.y);
        detected.push({ entity: s, dist: distS });
      }
    }

    const civilians = (this.game.simulation && this.game.simulation.civilianTraffic) || [];
    for (const c of civilians) {
      if (c && c.hp > 0 && detectedSet.has(c.id)) {
        const distC = Math.hypot(c.x - active.x, c.y - active.y);
        detected.push({ entity: c, dist: distC });
      }
    }

    detected.sort((a, b) => a.dist - b.dist);
    return detected;
  }

  cycleTarget(direction = 1) {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return;

    const targets = this.getDetectedTargets();
    if (targets.length === 0) {
      if (this.game.radar) this.game.radar.spawnCombatText(active.x, active.y, 'NO RADAR CONTACTS', '#f97316');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return;
    }

    let currentIndex = -1;
    if (this.game.selectedTarget) {
      for (let k = 0; k < targets.length; k++) {
        if (targets[k].entity.id === this.game.selectedTarget.id) {
          currentIndex = k; break;
        }
      }
    }

    const nextIndex = (currentIndex + direction + targets.length) % targets.length;
    const nextTarget = targets[nextIndex].entity;
    this.lockTargetEntity(nextTarget);
  }

  lockTargetEntity(target) {
    const active = this.game.activeUnit;
    const commanderTeam = this.game.currentPvpCommander || 'friendly';

    this.game.selectedTarget = target;

    const isKnown = (target.team === active.team) ||
      (typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified);

    if (this.game.radar) {
      const lockColor = !isKnown ? '#f97316' : ((target.isAce && isKnown) ? '#ffd700' : '#00f0ff');
      this.game.radar.spawnCombatText(target.x, target.y, isKnown ? 'TARGET SWITCHED' : 'BOGEY SWITCHED', lockColor);
      this.game.radar.spawnShockwave(target.x, target.y, lockColor, 25);
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.game.avionics.updateActiveUnitMFD();
  }

  firePylonByIndex(pIdx) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0) return;
    if (u.equippedWeapons && u.equippedWeapons[pIdx]) {
      this.game.firePylon(u, pIdx, this.game.selectedTarget);
    }
  }

  initModeSelectors() {
    const btn1p = document.getElementById('mode-btn-1p');
    const btn2p = document.getElementById('mode-btn-2p');
    const btnSkirmish = document.getElementById('scenario-btn-skirmish');
    const btnDynamic = document.getElementById('scenario-btn-dynamic');
    const aiPanel = document.getElementById('ai-config-panel');
    const pvpSwitcher = document.getElementById('pvp-switcher-bar');

    if (btn1p && btn2p) {
      btn1p.onclick = () => {
        this.game.playerMode = '1P';
        btn1p.classList.add('active');
        btn2p.classList.remove('active');
        if (aiPanel) aiPanel.style.display = 'flex';
        if (pvpSwitcher) pvpSwitcher.classList.add('hidden');
        this.game.updateModeIndicator();
      };
      btn2p.onclick = () => {
        this.game.playerMode = '2P';
        btn2p.classList.add('active');
        btn1p.classList.remove('active');
        if (aiPanel) aiPanel.style.display = 'none';
        if (pvpSwitcher) pvpSwitcher.classList.remove('hidden');
        this.game.updateModeIndicator();
      };
    }

    if (btnSkirmish && btnDynamic) {
      btnSkirmish.onclick = () => {
        this.game.scenarioMode = 'SKIRMISH';
        btnSkirmish.classList.add('active');
        btnDynamic.classList.remove('active');
        this.game.updateModeIndicator();
      };
      btnDynamic.onclick = () => {
        this.game.scenarioMode = 'DYNAMIC_THEATER';
        btnDynamic.classList.add('active');
        btnSkirmish.classList.remove('active');
        this.game.updateModeIndicator();
      };
    }

    const diffSelect = document.getElementById('ai-difficulty-select');
    const doctSelect = document.getElementById('ai-doctrine-select');
    if (diffSelect) diffSelect.onchange = (e) => { this.game.aiDifficulty = e.target.value; this.game.updateModeIndicator(); };
    if (doctSelect) doctSelect.onchange = (e) => { this.game.aiDoctrine = e.target.value; };

    const btnBlue = document.getElementById('btn-switch-blue');
    const btnRed = document.getElementById('btn-switch-red');
    if (btnBlue && btnRed) {
      btnBlue.onclick = () => {
        this.game.currentPvpCommander = 'friendly';
        btnBlue.classList.add('active'); btnRed.classList.remove('active');
        this.game.activeUnit = this.game.alliedAircraft.find(a => a.hp > 0) || null;
        this.game.selectedTarget = null;
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      };
      btnRed.onclick = () => {
        this.game.currentPvpCommander = 'hostile';
        btnRed.classList.add('active'); btnBlue.classList.remove('active');
        this.game.activeUnit = this.game.hostileAircraft.find(a => a.hp > 0) || null;
        this.game.selectedTarget = null;
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      };
    }
  }
}

window.ControlsSystem = ControlsSystem;