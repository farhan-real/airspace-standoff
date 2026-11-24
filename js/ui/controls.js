/* js/ui/controls.js - Controls System Coordinator */

class ControlsSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.targeting = new ControlsTargetingHandler(this);
    this.keyboard = new KeyboardControlsHandler(this);
    this.pointer = new PointerControlsHandler(this);
    this.fullscreen = new FullscreenHandler(this);
    this._wasAutoPaused = false;
  }

  init() {
    this.initHUDButtons();
    this.initModeSelectors();
    this.initMobileControls();
    this.initTimeWarpControls();
    this.initExitButtons();
    this.initLeaderboardModal();
    if (window.MissionEditor && typeof window.MissionEditor.init === 'function') window.MissionEditor.init(this.game);
    if (this.fullscreen && this.fullscreen.init) this.fullscreen.init();
  }

  initExitButtons() {
    const procExit = document.getElementById('btn-proc-exit');
    if (procExit) procExit.onclick = () => this.exitGame();
  }

  initLeaderboardModal() {
    if (window.LeaderboardUI && typeof window.LeaderboardUI.init === 'function') window.LeaderboardUI.init();
  }

  exitGame() {
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
        </div>`;
    };
    this.game.procurement.showConfirmModal('EXIT', 'Are you sure you want to exit the application?', doExit, { confirmText: 'EXIT', isAlert: true });
  }

  initTimeWarpControls() {
    const map = { 'btn-time-pause': null, 'btn-time-1x': 1, 'btn-time-2x': 2, 'btn-time-4x': 4 };
    Object.entries(map).forEach(([id, speed]) => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = () => (speed === null ? this.togglePause() : this.setTimeWarp(speed));
    });
  }

  setTimeWarp(speed) {
    if (this.game.simulation) {
      this.game.simulation.setTimeWarp(speed);
      const pModal = document.getElementById('pause-modal');
      if (pModal && speed > 0) pModal.classList.remove('active');
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  togglePause() {
    const pModal = this.ensurePauseModal();
    if (this.game.simulation) {
      this.game.simulation.togglePause();
      if (pModal) pModal.classList.toggle('active', this.game.simulation.isPaused);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  ensurePauseModal() {
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
      window.ModalDialogTemplates.ensure('pause-modal');
      this.bindPauseModalEvents();
    }
    return document.getElementById('pause-modal');
  }

  bindPauseModalEvents() {
    const pauseModal = document.getElementById('pause-modal');
    if (!pauseModal || pauseModal._boundEvents) return;
    pauseModal._boundEvents = true;

    const btnResume = document.getElementById('btn-resume-sortie');
    const btnSave = document.getElementById('btn-pause-save');
    const btnSaveQuit = document.getElementById('btn-pause-save-quit');
    const btnSettings = document.getElementById('btn-pause-settings');
    const btnManual = document.getElementById('btn-pause-manual');
    const btnAbort = document.getElementById('btn-pause-abort');

    if (btnResume) btnResume.onclick = () => { pauseModal.classList.remove('active'); this.setTimeWarp(1); };
    if (btnSettings) btnSettings.onclick = () => { if (this.game.settings && typeof this.game.settings.open === 'function') this.game.settings.open(); };
    if (btnManual) btnManual.onclick = () => { if (typeof window.openFlightManual === 'function') window.openFlightManual(); };
    if (btnSave) {
      btnSave.onclick = () => {
        this.game.saveCurrentSortie(false);
        btnSave.textContent = 'SORTIE SAVED!';
        setTimeout(() => { if (btnSave) btnSave.textContent = 'SAVE SORTIE'; }, 1400);
      };
    }
    if (btnSaveQuit) btnSaveQuit.onclick = () => this.game.saveAndQuitToHangar();
    if (btnAbort) btnAbort.onclick = () => { pauseModal.classList.remove('active'); this.game.abortSortie(); };
    pauseModal.onclick = (e) => { if (e.target === pauseModal) { pauseModal.classList.remove('active'); this.setTimeWarp(1); } };
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

  initMobileControls() {
    const openFleetBtn = document.getElementById('btn-mobile-open-fleet');
    const closeFleetBtn = document.getElementById('btn-close-fleet-drawer');
    const fleetPane = document.getElementById('pane-fleet');

    if (openFleetBtn) openFleetBtn.onclick = () => { if (fleetPane) { fleetPane.classList.toggle('drawer-open'); this.game.avionics.renderFlightRoster(); } };
    if (closeFleetBtn) closeFleetBtn.onclick = () => { if (fleetPane) fleetPane.classList.remove('drawer-open'); };

    const bindSteer = (btn, code) => {
      if (!btn) return;
      const start = (e) => { e.preventDefault(); this.keyboard.keysHeld[code] = true; };
      const end = (e) => { e.preventDefault(); this.keyboard.keysHeld[code] = false; };
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', end);
      btn.addEventListener('pointercancel', end);
      btn.addEventListener('pointerleave', end);
    };
    bindSteer(document.getElementById('mobile-steer-left'), 'ArrowLeft');
    bindSteer(document.getElementById('mobile-steer-right'), 'ArrowRight');
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
        if (e.key && e.key.startsWith('Arrow')) { e.preventDefault(); e.stopPropagation(); removeFocus(); }
      });
    }

    const diveBtn = document.getElementById('btn-pitch-dive');
    if (diveBtn) diveBtn.onclick = () => this.executeDive();
    const climbBtn = document.getElementById('btn-pitch-climb');
    if (climbBtn) climbBtn.onclick = () => this.executeZoomClimb();

    const abortBtn = document.getElementById('btn-abort-match');
    if (abortBtn) {
      abortBtn.onclick = () => {
        if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
          window.ModalDialogTemplates.ensure('abort-confirm-modal');
        }
        const abortModal = document.getElementById('abort-confirm-modal');
        const confirmAbort = document.getElementById('btn-confirm-abort');
        const cancelAbort = document.getElementById('btn-cancel-abort');
        if (cancelAbort) cancelAbort.onclick = () => { if (abortModal) abortModal.classList.remove('active'); this.autoUnpauseOnDialogClose(); };
        if (confirmAbort) confirmAbort.onclick = () => { if (abortModal) abortModal.classList.remove('active'); this.game.abortSortie(); };
        this.autoPauseOnDialogOpen();
        if (abortModal) abortModal.classList.add('active');
      };
    }
  }

  executeDive() {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05) return;
    if (this.game.consumeCurrentCommanderTokens(0.4)) {
      u.dive();
      if (this.game.inspection && this.game.inspection.enabled) {
        this.game.inspection.recordEvent('FLIGHT ACTION', `${window.formatAircraftDisplayName(u)} executed a dive`, u, null, { altitudeFt: u.altFt, targetAltitudeFt: u.targetAltFt, speedMach: u.speed, energy: u.energy, stress: u.stress });
      }
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
      if (this.game.inspection && this.game.inspection.enabled) {
        this.game.inspection.recordEvent('FLIGHT ACTION', `${window.formatAircraftDisplayName(u)} executed a zoom climb`, u, null, { altitudeFt: u.altFt, targetAltitudeFt: u.targetAltFt, speedMach: u.speed, energy: u.energy, stress: u.stress });
      }
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
    if (this.game.radar) {
      this.game.radar.trackingUnit = null;
      if (this.game.radar.cam) this.game.radar.cam.trackingUnit = null;
    }
    this.game.avionics.renderFlightRoster();
    this.game.avionics.updateActiveUnitMFD();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  getDetectedTargets() { return this.targeting ? this.targeting.getDetectedTargets() : []; }
  cycleTarget(direction = 1) { if (this.targeting) this.targeting.cycleTarget(direction); }
  lockTargetEntity(target) { if (this.targeting) this.targeting.lockTargetEntity(target); }

  firePylonByIndex(pIdx) {
    const u = this.game.activeUnit;
    if (!u || u.hp <= 0.05 || !u.equippedWeapons || !u.equippedWeapons[pIdx]) return;
    const item = u.equippedWeapons[pIdx];
    const w = item.weapon;
    if (!w) return;
    if (!w.isDecoy && !w.isDecoyDrone && !w.isGunpod && w.category !== 'GUN') {
      let tgt = this.game.selectedTarget;
      if (!tgt || tgt.hp <= 0.05) { if (this.targeting) { this.targeting.autoLock(); tgt = this.game.selectedTarget; } }
      if (!tgt || tgt.hp <= 0.05) {
        if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, 'NO TARGET SELECTED [PRESS T OR TAP RADAR]', '#f97316');
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        return;
      }
      const dist = Math.hypot(tgt.x - u.x, tgt.y - u.y);
      if (dist > (w.rangeKm || 50)) {
        if (this.game.radar) this.game.radar.spawnCombatText(u.x, u.y, `OUT OF RANGE (${dist.toFixed(0)}km > ${w.rangeKm}km)`, '#f43f5e');
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        return;
      }
    }
    this.game.firePylon(u, pIdx, this.game.selectedTarget);
  }

  initModeSelectors() {
    const aiPanel = document.getElementById('ai-config-panel');
    const pvpSwitcher = document.getElementById('pvp-switcher-bar');
    const is1p = (this.game.playerMode === '1P');
    if (aiPanel) aiPanel.style.display = is1p ? 'flex' : 'none';
    if (pvpSwitcher) pvpSwitcher.classList.toggle('hidden', is1p);

    const btnBlue = document.getElementById('btn-switch-blue'), btnRed = document.getElementById('btn-switch-red');
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
