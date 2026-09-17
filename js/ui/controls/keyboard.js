/**
 * AIRSPACE STANDOFF // Keyboard Controls
 * Removed hotkeys and slash delimiters from feedback text; RTB expanded to RETURN TO BASE.
 */

class KeyboardControlsHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys.game;
    this.keysHeld = {};
    this.initSteeringTicker();
    this.initKeyListeners();
  }

  initSteeringTicker() {
    setInterval(() => {
      if (this.game.isGameOver) return;
      if (this.game.simulation && this.game.simulation.isPaused) return;

      const u = this.game.activeUnit;
      if (!u || u.hp <= 0) return;
      const dt = 0.035;
      if (this.keysHeld['ArrowLeft'] || this.keysHeld['KeyA']) {
        u.steerLeft(dt);
        if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      }
      if (this.keysHeld['ArrowRight'] || this.keysHeld['KeyD']) {
        u.steerRight(dt);
        if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      }
    }, 35);
  }

  initKeyListeners() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (window.Settings && window.Settings.isRecordingKey) return;

      const key = e.code || e.key;
      this.keysHeld[key] = true;
      this.keysHeld[e.key] = true;

      const binds = (window.Settings && window.Settings.keybinds) ? window.Settings.keybinds : (window.DEFAULT_KEYBINDS || {});

      if (key === binds.PAUSE_TIME || key === 'KeyP') {
        e.preventDefault();
        this.sys.togglePause();
        return;
      }

      if (e.key === '1') { this.sys.setTimeWarp(1); return; }
      if (e.key === '2') { this.sys.setTimeWarp(2); return; }
      if (e.key === '3' || e.key === '4') { this.sys.setTimeWarp(4); return; }

      if (key === binds.TOGGLE_DECLUTTER || key === 'KeyV') {
        e.preventDefault();
        if (this.game.radar) {
          this.game.radar.cam.declutterMode = !this.game.radar.cam.declutterMode;
          this.game.radar.syncControlButtons();
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
        return;
      }

      if (key === binds.TOGGLE_GROUND || key === 'KeyB') {
        e.preventDefault();
        if (this.game.radar) {
          this.game.radar.cam.toggleGroundTargets();
          this.game.radar.syncControlButtons();
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        }
        return;
      }

      if (key === binds.STEER_LEFT || key === 'ArrowLeft' || key === binds.STEER_RIGHT || key === 'ArrowRight') {
        e.preventDefault(); return;
      }

      if (key === binds.NEXT_UNIT || key === 'ArrowDown') {
        e.preventDefault(); this.sys.cycleFriendlyUnit(1); return;
      }
      if (key === binds.PREV_UNIT || key === 'ArrowUp') {
        e.preventDefault(); this.sys.cycleFriendlyUnit(-1); return;
      }

      if (key === binds.CYCLE_TARGET || key === 'KeyT' || key === 'Tab' || key === 'Space') {
        e.preventDefault();
        this.sys.cycleTarget(1);
        return;
      }

      if (key === binds.FIRE_GUN || key === 'KeyG') {
        e.preventDefault();
        const u = this.game.activeUnit;
        if (u && u.hp > 0 && this.game.deckManager && this.game.deckManager.pylonBay) {
          this.game.deckManager.pylonBay.fireAutocannonManual(u, this.game.selectedTarget);
        }
        return;
      }

      if (key === binds.RTB || key === 'KeyR') {
        e.preventDefault();
        const uRtb = this.game.activeUnit;
        if (uRtb && uRtb.hp > 0) {
          const isReturning = uRtb.toggleRTB();
          if (this.game.radar) {
            const msg = isReturning ? 'HIGH-SPEED RETURN TO BASE ORDERED' : 'RETURN TO BASE CANCELLED - ENGAGING';
            const col = isReturning ? '#00f5a0' : '#38bdf8';
            this.game.radar.spawnCombatText(uRtb.x, uRtb.y, msg, col);
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.game.avionics.updateActiveUnitMFD();
        }
        return;
      }

      for (let p = 1; p <= 9; p++) {
        const bindCode = binds['FIRE_PYLON_' + p] || ('Digit' + p);
        if (key === bindCode || e.key === String(p) || key === ('Digit' + p)) {
          e.preventDefault(); this.sys.firePylonByIndex(p - 1); return;
        }
      }

      if (key === binds.COUNTERMEASURES || key === 'KeyF') {
        e.preventDefault();
        if (this.game.activeUnit && this.game.activeUnit.hp > 0) {
          this.game.activeUnit.deployCountermeasures();
          if (this.game.radar) this.game.radar.spawnCombatText(this.game.activeUnit.x, this.game.activeUnit.y, 'CHAFF DEPLOYED', '#f59e0b');
        }
        return;
      }

      if (key === binds.DIVE || key === 'KeyX') { e.preventDefault(); this.sys.executeDive(); return; }
      if (key === binds.ZOOM || key === 'KeyZ') { e.preventDefault(); this.sys.executeZoomClimb(); return; }
      if (key === binds.THROTTLE_DOWN || key === 'BracketLeft') { e.preventDefault(); this.sys.adjustActiveThrottle(-0.10); return; }
      if (key === binds.THROTTLE_UP || key === 'BracketRight') { e.preventDefault(); this.sys.adjustActiveThrottle(+0.10); return; }

      if (key === binds.CAMERA_TRACK || key === 'KeyC') { e.preventDefault(); if (this.game.radar) this.game.radar.trackActiveCraft(); return; }
      if (key === binds.CAMERA_RESET || key === 'Digit0' || key === 'Backspace') { e.preventDefault(); if (this.game.radar) this.game.radar.resetCamera(); return; }

      if (key === binds.OPEN_SETTINGS || key === 'KeyO') {
        e.preventDefault();
        const sm = document.getElementById('settings-modal');
        if (sm) {
          const isOpen = sm.classList.contains('active');
          if (isOpen) { sm.classList.remove('active'); this.sys.autoUnpauseOnDialogClose(); }
          else { sm.classList.add('active'); this.sys.autoPauseOnDialogOpen(); }
        }
        return;
      }
      if (key === binds.OPEN_MANUAL || key === 'KeyM') {
        e.preventDefault();
        const gm = document.getElementById('glossary-modal');
        if (gm) {
          const isOpen = gm.classList.contains('active');
          if (isOpen) { gm.classList.remove('active'); this.sys.autoUnpauseOnDialogClose(); }
          else { gm.classList.add('active'); this.sys.autoPauseOnDialogOpen(); }
        }
        return;
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.code || e.key;
      this.keysHeld[key] = false;
      this.keysHeld[e.key] = false;
    });
  }
}

window.KeyboardControlsHandler = KeyboardControlsHandler;