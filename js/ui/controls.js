/**
 * APEX VECTOR // Controls System Coordinator
 * - Mobile Landscape Orientation Lock
 * - Time Warp Speed Controls (Pause, 1X, 2X, 4X)
 * - Auto-Pause when any dialog is displayed
 * - Squadron Name Customization
 */

class ControlsSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.autolock = new AutoLockController(gameEngine);
    this.keyboard = new KeyboardControlsHandler(this);
    this.pointer = new PointerControlsHandler(this);
  }

  init() {
    this.initHUDButtons();
    this.initModeSelectors();
    this.initMobileControls();
    this.initTimeWarpControls();
    this.initOrientationLockControls();
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

  initOrientationLockControls() {
    const toggleOrientation = async () => {
      try {
        if (!document.fullscreenElement) {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
          } else if (docEl.webkitRequestFullscreen) {
            await docEl.webkitRequestFullscreen();
          }
        }
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (err) {
        console.warn('Orientation lock notice:', err);
      }
      if (this.game.radar) {
        setTimeout(() => this.game.radar.resize(), 80);
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };

    const btnHUD = document.getElementById('btn-toggle-orientation');
    const btnProc = document.getElementById('btn-toggle-orientation-proc');
    if (btnHUD) btnHUD.onclick = toggleOrientation;
    if (btnProc) btnProc.onclick = toggleOrientation;
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

    const autoLockBtn = document.getElementById('btn-mobile-autolock');
    const cycleTgtBtn = document.getElementById('btn-mobile-cycle-target');
    if (autoLockBtn) autoLockBtn.onclick = () => this.autoTargetNearestEnemy();
    if (cycleTgtBtn) cycleTgtBtn.onclick = () => this.cycleTarget(1);

    const openFleetBtn = document.getElementById('btn-mobile-open-fleet');
    const closeFleetBtn = document.getElementById('btn-close-fleet-drawer');
    const craftLabelBox = document.getElementById('mob-craft-label-box');
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
    if (craftLabelBox) craftLabelBox.onclick = openDrawer;
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

    const autoTargetBtn = document.getElementById('btn-autotarget');
    if (autoTargetBtn) autoTargetBtn.onclick = () => this.autoTargetNearestEnemy();

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
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'DIVE (-ALT / +SPD)', '#00f0ff');
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
      if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'ZOOM CLIMB (+ALT / -SPD)', '#00f5a0');
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

  cycleTarget(direction = 1) {
    this.autolock.cycleTarget(direction);
  }

  firePylonByIndex(pIdx) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0) return;
    if (u.equippedWeapons && u.equippedWeapons[pIdx]) {
      this.game.firePylon(u, pIdx, this.game.selectedTarget);
    }
  }

  autoTargetNearestEnemy() {
    this.autolock.autoTargetNearestEnemy();
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
