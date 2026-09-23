/* AIRSPACE STANDOFF: Settings, Rebinding & Safe Zone Configuration */

class SettingsManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentTab = 'keybinds';
    this.keybinds = Object.assign({}, window.DEFAULT_KEYBINDS || {});
    this.safeZone = false;
    this.recordingAction = null;
    this.isRecordingKey = false;
    this.loadFromStorage();
    this.initUI();
  }

  loadFromStorage() {
    try {
      let saved = localStorage.getItem('AIRSPACE_STANDOFF_SETTINGS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.keybinds) this.keybinds = Object.assign(this.keybinds, parsed.keybinds);
        if (parsed.volumes && typeof AudioSys !== 'undefined') {
          AudioSys.setVolumes(parsed.volumes.master, parsed.volumes.rwr, parsed.volumes.fx);
        }
        this.safeZone = Boolean(parsed.safeZone);
      }
    } catch (e) {
      console.warn('Could not load settings:', e);
    }
    this.applySafeZone();
  }

  saveToStorage() {
    try {
      localStorage.setItem('AIRSPACE_STANDOFF_SETTINGS', JSON.stringify({
        keybinds: this.keybinds,
        safeZone: Boolean(this.safeZone),
        volumes: { master: AudioSys.masterVolume, rwr: AudioSys.rwrVolume, fx: AudioSys.fxVolume }
      }));
    } catch (e) {}
  }

  applySafeZone() {
    const active = Boolean(this.safeZone);
    if (document.documentElement) document.documentElement.classList.toggle('safe-zone-on', active);
    if (document.body) document.body.classList.toggle('safe-zone-on', active);
    window.dispatchEvent(new Event('resize'));
    if (this.game && this.game.radar && typeof this.game.radar.resize === 'function') {
      this.game.radar.resize();
    }
  }

  initUI() {
    const modal = document.getElementById('settings-modal');
    const handleOpen = () => {
      this.renderTabContent();
      if (modal) modal.classList.add('active');
      if (this.game.controls) this.game.controls.autoPauseOnDialogOpen();
    };

    ['btn-open-settings', 'btn-proc-settings'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = handleOpen;
    });

    const closeBtn = document.getElementById('btn-close-settings');
    if (closeBtn) closeBtn.onclick = () => {
      if (modal) modal.classList.remove('active');
      this.cancelRecording();
      if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
    };

    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) saveBtn.onclick = () => {
      this.saveToStorage();
      if (modal) modal.classList.remove('active');
      this.cancelRecording();
      if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
    };

    const resetBtn = document.getElementById('btn-reset-keybinds');
    if (resetBtn) resetBtn.onclick = () => {
      this.keybinds = Object.assign({}, window.DEFAULT_KEYBINDS || {});
      this.safeZone = false;
      this.applySafeZone();
      this.saveToStorage();
      this.renderTabContent();
    };

    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.stab;
        this.renderTabContent();
      };
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isRecordingKey || !this.recordingAction) return;
      e.preventDefault(); e.stopPropagation();
      if (e.key !== 'Escape') this.keybinds[this.recordingAction] = e.code || e.key;
      this.cancelRecording();
      this.renderTabContent();
    }, true);
  }

  cancelRecording() {
    this.isRecordingKey = false;
    this.recordingAction = null;
  }

  renderTabContent() {
    const container = document.getElementById('settings-tab-content');
    if (!container) return;
    container.innerHTML = '';
    if (this.currentTab === 'keybinds') this.renderKeybindsTab(container);
    else if (this.currentTab === 'audio') this.renderAudioTab(container);
    else if (this.currentTab === 'radar') this.renderRadarTab(container);
  }

  renderKeybindsTab(container) {
    const descriptions = {
      'STEER_LEFT': 'Continuous Aerodynamic Bank Left', 'STEER_RIGHT': 'Continuous Aerodynamic Bank Right',
      'NEXT_UNIT': 'Select Next Aircraft in Squadron', 'PREV_UNIT': 'Select Previous Aircraft in Squadron',
      'CYCLE_TARGET': 'Cycle Next Detected Threat [T] or [Tab]', 'AUTO_LOCK': 'Instant-Lock Nearest Threat [Space]',
      'FIRE_GUN': 'Fire Manual Autocannon Burst [G]', 'FIRE_PYLON_1': 'Discharge Station 1 Ordnance',
      'FIRE_PYLON_2': 'Discharge Station 2 Ordnance', 'FIRE_PYLON_3': 'Discharge Station 3 Ordnance',
      'FIRE_PYLON_4': 'Discharge Station 4 Ordnance', 'FIRE_PYLON_5': 'Discharge Station 5 Ordnance',
      'FIRE_PYLON_6': 'Discharge Station 6 Ordnance', 'FIRE_PYLON_7': 'Discharge Station 7 Ordnance',
      'FIRE_PYLON_8': 'Discharge Station 8 Ordnance', 'FIRE_PYLON_9': 'Discharge Station 9 Ordnance',
      'COUNTERMEASURES': 'Deploy Chaff Countermeasure Decoys', 'DIVE': 'Kinetic Altitude-to-Speed Dive',
      'ZOOM': 'Zoom Climb High-Altitude Perch', 'RTB': 'Toggle Return to Base & Re-Arm',
      'TOGGLE_DECLUTTER': 'Toggle Radar Declutter Mode [V]', 'TOGGLE_GROUND': 'Toggle Ground Targets [B]',
      'THROTTLE_UP': 'Advance Engine Power (+10%)', 'THROTTLE_DOWN': 'Reduce Engine Power (-10%)',
      'PAUSE_TIME': 'Pause / Resume Simulation [P]', 'TIME_WARP_1X': 'Simulation Speed 1X',
      'TIME_WARP_2X': 'Simulation Speed 2X', 'TIME_WARP_4X': 'Simulation Speed 4X',
      'CAMERA_TRACK': 'Center & Track Active Aircraft', 'CAMERA_RESET': 'Reset Panoramic Radar View',
      'OPEN_SETTINGS': 'Open Settings Modal', 'OPEN_MANUAL': 'Open Flight Manual'
    };

    const table = document.createElement('table');
    table.className = 'keybinds-table';
    table.innerHTML = `<thead><tr><th style="width:26%;">ACTION</th><th style="width:48%;">FUNCTION</th><th style="width:26%;text-align:right;">KEY</th></tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');

    Object.keys(this.keybinds).forEach(actionKey => {
      const row = document.createElement('tr');
      const isRec = this.recordingAction === actionKey;
      row.innerHTML = `
        <td class="kb-action-cell">${actionKey.replace(/_/g, ' ')}</td>
        <td class="kb-desc-cell">${descriptions[actionKey] || actionKey}</td>
        <td style="text-align:right;">
          <button type="button" class="btn-rebind ${isRec ? 'recording' : ''}" data-action="${actionKey}">
            ${isRec ? 'PRESS KEY...' : this.formatKeyLabel(this.keybinds[actionKey])}
          </button>
        </td>`;
      row.querySelector('.btn-rebind').onclick = () => {
        this.isRecordingKey = true; this.recordingAction = actionKey; this.renderTabContent();
      };
      tbody.appendChild(row);
    });
    container.appendChild(table);
  }

  formatKeyLabel(code) {
    if (!code) return 'NONE';
    return code.replace('Key', '').replace('Digit', '')
      .replace('ArrowLeft', '<img src="icons/arrowleft.svg" width="10" height="10" alt="Left" class="btn-vector-ico"> LEFT')
      .replace('ArrowRight', 'RIGHT <img src="icons/arrowright.svg" width="10" height="10" alt="Right" class="btn-vector-ico">')
      .replace('ArrowUp', '<img src="icons/arrowup.svg" width="10" height="10" alt="Up" class="btn-vector-ico"> UP')
      .replace('ArrowDown', '<img src="icons/arrowdown.svg" width="10" height="10" alt="Down" class="btn-vector-ico"> DOWN')
      .replace('Space', 'SPACE').replace('BracketLeft', '[').replace('BracketRight', ']');
  }

  renderAudioTab(container) {
    const m = Math.round(AudioSys.masterVolume * 100);
    const r = Math.round(AudioSys.rwrVolume * 100);
    const f = Math.round(AudioSys.fxVolume * 100);
    container.innerHTML = `
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>MASTER AUDIO BUS</label>
          <span class="settings-hint">Primary audio output volume level</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-master" min="0" max="100" value="${m}" class="settings-slider">
          <b id="val-master" class="slider-num">${m}%</b>
        </div>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>RWR THREAT TONES</label>
          <span class="settings-hint">Radar sweep and lock warning audio buzzers</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-rwr" min="0" max="100" value="${r}" class="settings-slider">
          <b id="val-rwr" class="slider-num">${r}%</b>
        </div>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>COMBAT SFX</label>
          <span class="settings-hint">Missile launches, autocannon fire, and detonations</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-fx" min="0" max="100" value="${f}" class="settings-slider">
          <b id="val-fx" class="slider-num">${f}%</b>
        </div>
      </div>`;

    const bindSlider = (id, valId, setter) => {
      const sl = container.querySelector(id);
      const vl = container.querySelector(valId);
      if (sl) sl.oninput = (e) => { setter(e.target.value / 100); if (vl) vl.textContent = e.target.value + '%'; };
    };
    bindSlider('#vol-master', '#val-master', v => AudioSys.setVolumes(v, undefined, undefined));
    bindSlider('#vol-rwr', '#val-rwr', v => AudioSys.setVolumes(undefined, v, undefined));
    bindSlider('#vol-fx', '#val-fx', v => AudioSys.setVolumes(undefined, v, undefined));
  }

  renderRadarTab(container) {
    const curZoom = (this.game.radar ? this.game.radar.zoom.toFixed(2) : '1.00');
    const isFullscreenActive = this.game.controls && this.game.controls.fullscreen ? this.game.controls.fullscreen.isActive() : false;

    container.innerHTML = `
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>FULLSCREEN DISPLAY</label>
          <span class="settings-hint">Toggle full screen immersion across mobile, tablet or desktop</span>
        </div>
        <button type="button" id="btn-cfg-fullscreen" class="hud-btn ${isFullscreenActive ? 'highlight' : ''}">
          ${isFullscreenActive ? 'EXIT FULL' : 'FULLSCREEN'}
        </button>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>CAMERA CUTOUT &amp; SAFE ZONE</label>
          <span class="settings-hint">Pad viewport inwards to prevent phone camera notch overlap</span>
        </div>
        <button type="button" id="btn-toggle-safe-zone" class="hud-btn ${this.safeZone ? 'highlight' : ''}">
          ${this.safeZone ? 'SAFE ZONE: ON' : 'SAFE ZONE: OFF'}
        </button>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>VIEWPORT ZOOM</label>
          <span class="settings-hint">Current tactical radar magnification scale</span>
        </div>
        <span class="slider-num" style="color:#38bdf8;">${curZoom}x</span>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>CENTER ACTIVE AIRCRAFT</label>
          <span class="settings-hint">Lock camera tracking directly onto selected fighter</span>
        </div>
        <button type="button" id="btn-cfg-center" class="hud-btn small">TRACK [C]</button>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>RESET VIEWPORT</label>
          <span class="settings-hint">Restore default panoramic 150km &times; 100km theater view</span>
        </div>
        <button type="button" id="btn-cfg-reset-cam" class="hud-btn small">RESET [0]</button>
      </div>`;

    const fsBtn = container.querySelector('#btn-cfg-fullscreen');
    if (fsBtn && this.game.controls && this.game.controls.fullscreen) {
      fsBtn.onclick = () => {
        this.game.controls.fullscreen.toggle();
      };
    }

    const szBtn = container.querySelector('#btn-toggle-safe-zone');
    if (szBtn) szBtn.onclick = () => {
      this.safeZone = !this.safeZone;
      this.applySafeZone();
      this.saveToStorage();
      szBtn.className = 'hud-btn ' + (this.safeZone ? 'highlight' : '');
      szBtn.textContent = this.safeZone ? 'SAFE ZONE: ON' : 'SAFE ZONE: OFF';
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };

    const cBtn = container.querySelector('#btn-cfg-center');
    const rBtn = container.querySelector('#btn-cfg-reset-cam');
    if (cBtn && this.game.radar) cBtn.onclick = () => this.game.radar.trackActiveCraft();
    if (rBtn && this.game.radar) rBtn.onclick = () => this.game.radar.resetCamera();
  }
}

window.formatKeyLabel = (code) => SettingsManager.prototype.formatKeyLabel(code);
window.SettingsManager = SettingsManager;