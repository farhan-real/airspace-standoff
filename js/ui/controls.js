/* AIRSPACE STANDOFF: Controls System Coordinator */

class ControlsSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.targeting = (typeof ControlsTargetingHandler !== 'undefined') ? new ControlsTargetingHandler(this) : null;
    this.keyboard = new KeyboardControlsHandler(this);
    this.pointer = new PointerControlsHandler(this);
    this.fullscreen = (typeof FullscreenHandler !== 'undefined') ? new FullscreenHandler(this) : null;
    this._wasAutoPaused = false;
  }

  init() {
    this.initHUDButtons();
    this.initModeSelectors();
    this.initMobileControls();
    this.initTimeWarpControls();
    this.initPauseScreenModal();
    this.initExitButtons();
    this.initLeaderboardModal();
    if (window.MissionEditor && typeof window.MissionEditor.init === 'function') {
      window.MissionEditor.init(this.game);
    }
    if (this.fullscreen && this.fullscreen.init) {
      this.fullscreen.init();
    }
  }

  initExitButtons() {
    const procExit = document.getElementById('btn-proc-exit');
    if (procExit) procExit.onclick = () => this.exitGame();
  }

  initLeaderboardModal() {
    if (window.LeaderboardUI && typeof window.LeaderboardUI.init === 'function') {
      window.LeaderboardUI.init();
    }
  }

  exitGame() {
    const confirmMsg = 'Are you sure you want to exit the application?';
    const doExit = () => {
      try {
        if (typeof window.AndroidAppBridge !== 'undefined' && typeof window.AndroidAppBridge.exitApp === 'function') {
          window.AndroidAppBridge.exitApp();
          return;
        }
      } catch (e) {}
      try { window.close(); } catch (e) {}

      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#03070d;color:#00f0ff;font-family:ui-monospace,monospace;text-align:center;padding:20px;">
          <h1 style="letter-spacing:1px;margin-bottom:12px;">SIMULATION ENDED</h1>
          <p style="color:#8494ab;font-size:0.9rem;">You may now close this application window or browser tab.</p>
        </div>
      `;
    };

    if (this.game.procurement && typeof this.game.procurement.showConfirmModal === 'function') {
      this.game.procurement.showConfirmModal('EXIT', confirmMsg, doExit, { confirmText: 'EXIT', isAlert: true });
    } else if (window.confirm(confirmMsg)) {
      doExit();
    }
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
    if (this.game.simulation) this.game.simulation.setTimeWarp(speed);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  togglePause() {
    if (this.game.simulation) this.game.simulation.togglePause();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  autoPauseOnDialogOpen() {
    if (this.game.simulation && !this.game.simulation.isPaused) {
      this.game.simulation.setTimeWarp(0);
      this._wasAutoPaused = true;
    }
  }

  autoUnpauseOnDialogClose() {
    const pauseModal = document.getElementById('pause-modal');
    if (pauseModal && pauseModal.classList.contains('active')) return;
    if (this._wasAutoPaused && this.game.simulation) {
      this.game.simulation.setTimeWarp(1);
      this._wasAutoPaused = false;
    }
  }

  initPauseScreenModal() {
    const pauseModal = document.getElementById('pause-modal');
    const btnResume = document.getElementById('btn-resume-sortie');
    const btnSettings = document.getElementById('btn-pause-settings');
    const btnManual = document.getElementById('btn-pause-manual');
    const btnAbort = document.getElementById('btn-pause-abort');

    if (btnResume) {
      btnResume.onclick = () => {
        if (pauseModal) pauseModal.classList.remove('active');
        this.setTimeWarp(1);
      };
    }
    if (btnSettings) {
      btnSettings.onclick = () => {
        const sm = document.getElementById('settings-modal');
        if (sm) {
          if (this.game.settings) this.game.settings.renderTabContent();
          sm.classList.add('active');
        }
      };
    }
    if (btnManual) {
      btnManual.onclick = () => {
        if (typeof window.openTacticalManual === 'function') {
          window.openTacticalManual();
        } else {
          const gm = document.getElementById('glossary-modal');
          if (gm) gm.classList.add('active');
        }
      };
    }
    if (btnAbort) {
      btnAbort.onclick = () => {
        if (pauseModal) pauseModal.classList.remove('active');
        this.game.abortSortie();
      };
    }
  }

  initMobileControls() {
    const openFleetBtn = document.getElementById('btn-mobile-open-fleet');
    const closeFleetBtn = document.getElementById('btn-close-fleet-drawer');
    const fleetPane = document.getElementById('pane-fleet');

    const toggleDrawer = () => {
      if (fleetPane) {
        fleetPane.classList.toggle('drawer-open');
        this.game.avionics.renderFlightRoster();
      }
    };
    const closeDrawer = () => {
      if (fleetPane) fleetPane.classList.remove('drawer-open');
    };

    if (openFleetBtn) openFleetBtn.onclick = toggleDrawer;
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
      slider.setAttribute('tabindex', '-1');
      slider.oninput = (e) => {
        if (!this.game.activeUnit || this.game.activeUnit.hp <= 0.05) return;
        this.game.activeUnit.engineAlpha = parseInt(e.target.value, 10) / 100.0;
        this.game.avionics.updateActiveUnitMFD();
      };

      const removeFocus = () => { try { slider.blur(); } catch (err) {} };
      slider.addEventListener('change', removeFocus);
      slider.addEventListener('pointerup', removeFocus);
      slider.addEventListener('mouseup', removeFocus);
      slider.addEventListener('touchend', removeFocus);
      slider.addEventListener('keydown', (e) => {
        if (e.key && e.key.startsWith('Arrow')) {
          e.preventDefault();
          e.stopPropagation();
          removeFocus();
        }
      });
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
        if (window.AfterActionReplay && typeof window.AfterActionReplay.stop === 'function') window.AfterActionReplay.stop();
        if (window.MissionEditor && typeof window.MissionEditor.restoreBaseSettings === 'function') {
          window.MissionEditor.restoreBaseSettings(this.game);
        }
        if (gameOverModal) gameOverModal.classList.remove('active');
        if (procModal) procModal.classList.add('active');
      };
    }
  }

  executeDive() {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05) return;
    if (this.game.consumeCurrentCommanderTokens(0.4)) {
      u.dive();
      if (this.game.inspection && this.game.inspection.enabled) this.game.inspection.recordEvent('FLIGHT ACTION', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(u) : u.callsign} executed a dive`, u, null, { altitudeFt: u.altFt, targetAltitudeFt: u.targetAltFt, speedMach: u.speed, energy: u.energy, stress: u.stress });
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'DIVE', '#00f0ff');
      this.game.avionics.updateActiveUnitMFD();
    }
  }

  executeZoomClimb() {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05) return;
    if (u.speed < 0.45) {
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'SPEED TOO LOW FOR CLIMB', '#ff3366');
      return;
    }
    if (this.game.consumeCurrentCommanderTokens(0.4)) {
      u.zoomClimb();
      if (this.game.inspection && this.game.inspection.enabled) this.game.inspection.recordEvent('FLIGHT ACTION', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(u) : u.callsign} executed a zoom climb`, u, null, { altitudeFt: u.altFt, targetAltitudeFt: u.targetAltFt, speedMach: u.speed, energy: u.energy, stress: u.stress });
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'CLIMB', '#00f5a0');
      this.game.avionics.updateActiveUnitMFD();
    }
  }

  adjustActiveThrottle(delta) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05) return;
    u.engineAlpha = Math.max(0.20, Math.min(1.0, (u.engineAlpha || 0.60) + delta));
    this.game.avionics.updateActiveUnitMFD();
  }

  cycleFriendlyUnit(direction) {
    const roster = (this.game.currentPvpCommander === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;
    const live = roster.filter(a => a.hp > 0.05);
    if (live.length === 0) return;
    const curIdx = live.findIndex(a => this.game.activeUnit && this.game.activeUnit.id === a.id);
    const nextIdx = (curIdx + direction + live.length) % live.length;
    this.game.activeUnit = live[nextIdx];
    if (this.game.radar && this.game.radar.trackingUnit) this.game.radar.trackingUnit = this.game.activeUnit;
    this.game.avionics.renderFlightRoster();
    this.game.avionics.updateActiveUnitMFD();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  getDetectedTargets() {
    return this.targeting ? this.targeting.getDetectedTargets() : [];
  }

  cycleTarget(direction = 1) {
    if (this.targeting) this.targeting.cycleTarget(direction);
  }

  lockTargetEntity(target) {
    if (this.targeting) this.targeting.lockTargetEntity(target);
  }

  firePylonByIndex(pIdx) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05) return;
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
        btn1p.classList.add('active'); btn2p.classList.remove('active');
        if (aiPanel) aiPanel.style.display = 'flex';
        if (pvpSwitcher) pvpSwitcher.classList.add('hidden');
        this.game.updateModeIndicator();
      };
      btn2p.onclick = () => {
        this.game.playerMode = '2P';
        btn2p.classList.add('active'); btn1p.classList.remove('active');
        if (aiPanel) aiPanel.style.display = 'none';
        if (pvpSwitcher) pvpSwitcher.classList.remove('hidden');
        this.game.updateModeIndicator();
      };
    }

    if (btnSkirmish && btnDynamic) {
      btnSkirmish.onclick = () => {
        this.game.scenarioMode = 'SKIRMISH';
        btnSkirmish.classList.add('active'); btnDynamic.classList.remove('active');
        this.game.updateModeIndicator();
      };
      btnDynamic.onclick = () => {
        this.game.scenarioMode = 'DYNAMIC_THEATER';
        btnDynamic.classList.add('active'); btnSkirmish.classList.remove('active');
        this.game.updateModeIndicator();
      };
    }

    const btnBlue = document.getElementById('btn-switch-blue');
    const btnRed = document.getElementById('btn-switch-red');
    if (btnBlue && btnRed) {
      btnBlue.onclick = () => {
        this.game.currentPvpCommander = 'friendly';
        btnBlue.classList.add('active'); btnRed.classList.remove('active');
        this.game.activeUnit = this.game.alliedAircraft.find(a => a.hp > 0.05) || null;
        this.game.selectedTarget = null;
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      };
      btnRed.onclick = () => {
        this.game.currentPvpCommander = 'hostile';
        btnRed.classList.add('active'); btnBlue.classList.remove('active');
        this.game.activeUnit = this.game.hostileAircraft.find(a => a.hp > 0.05) || null;
        this.game.selectedTarget = null;
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      };
    }
  }
}

window.ControlsSystem = ControlsSystem;