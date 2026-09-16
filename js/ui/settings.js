/**
 * AIRSPACE STANDOFF // Tactical Settings, Rebinding & Audio Configuration Engine
 * Includes Declutter [V] and Ground targets [B] keybinding configuration.
 */

class SettingsManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentTab = 'keybinds';
    this.keybinds = Object.assign({}, window.DEFAULT_KEYBINDS || {});
    this.recordingAction = null;
    this.isRecordingKey = false;
    this.loadFromStorage();
    this.initUI();
  }

  loadFromStorage() {
    try {
      let saved = localStorage.getItem('AIRSPACE_STANDOFF_SETTINGS');
      if (!saved) saved = localStorage.getItem('APEX_VECTOR_SETTINGS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.keybinds) this.keybinds = Object.assign(this.keybinds, parsed.keybinds);
        if (parsed.volumes && typeof AudioSys !== 'undefined') {
          AudioSys.setVolumes(parsed.volumes.master, parsed.volumes.rwr, parsed.volumes.fx);
        }
      }
    } catch (e) {
      console.warn('Could not load settings from storage:', e);
    }
  }

  saveToStorage() {
    try {
      const data = {
        keybinds: this.keybinds,
        volumes: {
          master: AudioSys.masterVolume,
          rwr: AudioSys.rwrVolume,
          fx: AudioSys.fxVolume
        }
      };
      localStorage.setItem('AIRSPACE_STANDOFF_SETTINGS', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save settings:', e);
    }
  }

  initUI() {
    const openBtn = document.getElementById('btn-open-settings');
    const closeBtn = document.getElementById('btn-close-settings');
    const saveBtn = document.getElementById('btn-save-settings');
    const resetBtn = document.getElementById('btn-reset-keybinds');
    const modal = document.getElementById('settings-modal');

    if (openBtn) {
      openBtn.onclick = () => {
        this.renderTabContent();
        if (modal) modal.classList.add('active');
        if (this.game.controls) this.game.controls.autoPauseOnDialogOpen();
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        if (modal) modal.classList.remove('active');
        this.cancelRecording();
        if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
      };
    }

    if (saveBtn) {
      saveBtn.onclick = () => {
        this.saveToStorage();
        if (modal) modal.classList.remove('active');
        this.cancelRecording();
        if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        this.keybinds = Object.assign({}, window.DEFAULT_KEYBINDS || {});
        this.renderTabContent();
      };
    }

    const tabButtons = document.querySelectorAll('.settings-tab-btn');
    tabButtons.forEach(btn => {
      btn.onclick = () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.stab;
        this.renderTabContent();
      };
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isRecordingKey || !this.recordingAction) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        this.cancelRecording();
        this.renderTabContent();
        return;
      }

      this.keybinds[this.recordingAction] = e.code || e.key;
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

    if (this.currentTab === 'keybinds') {
      this.renderKeybindsTab(container);
    } else if (this.currentTab === 'audio') {
      this.renderAudioTab(container);
    } else if (this.currentTab === 'radar') {
      this.renderRadarTab(container);
    }
  }

  renderKeybindsTab(container) {
    const descriptions = {
      'STEER_LEFT': 'Continuous Aerodynamic Bank Left',
      'STEER_RIGHT': 'Continuous Aerodynamic Bank Right',
      'NEXT_UNIT': 'Select Next Aircraft in Active Squadron',
      'PREV_UNIT': 'Select Previous Aircraft in Active Squadron',
      'CYCLE_TARGET': 'Cycle Next Detected Threat [T] / [Tab]',
      'AUTO_LOCK': 'Instant-Lock Nearest High-Threat Contact [Space]',
      'FIRE_GUN': 'Fire Manual Autocannon Burst [G]',
      'FIRE_PYLON_1': 'Discharge Station 1 Ordnance Pack',
      'FIRE_PYLON_2': 'Discharge Station 2 Ordnance Pack',
      'FIRE_PYLON_3': 'Discharge Station 3 Ordnance Pack',
      'FIRE_PYLON_4': 'Discharge Station 4 Ordnance Pack',
      'FIRE_PYLON_5': 'Discharge Station 5 Ordnance Pack',
      'FIRE_PYLON_6': 'Discharge Station 6 Ordnance Pack',
      'FIRE_PYLON_7': 'Discharge Station 7 Ordnance Pack',
      'FIRE_PYLON_8': 'Discharge Station 8 Ordnance Pack',
      'FIRE_PYLON_9': 'Discharge Station 9 Ordnance Pack',
      'COUNTERMEASURES': 'Deploy Defensive Countermeasures (Chaff Decoys)',
      'DIVE': 'Kinetic Dive (-Altitude / +Airspeed Recovery)',
      'ZOOM': 'Zoom Climb to Perch (+Altitude / -Airspeed Conversion)',
      'RTB': 'Toggle Return to Base & Munitions Reload',
      'TOGGLE_DECLUTTER': 'Toggle Radar Declutter Mode [V]',
      'TOGGLE_GROUND': 'Toggle Ground Targets Visibility [B]',
      'THROTTLE_UP': 'Advance Engine Throttle (+10% Military / Afterburner)',
      'THROTTLE_DOWN': 'Reduce Engine Throttle (-10% Cruise Economy)',
      'PAUSE_TIME': 'Pause / Resume Combat Simulation [P]',
      'CAMERA_TRACK': 'Center & Track Currently Selected Craft',
      'CAMERA_RESET': 'Reset Radar Viewport Pan & Zoom Level',
      'OPEN_SETTINGS': 'Open Tactical Settings & Configuration',
      'OPEN_MANUAL': 'Open Tactical Flight Manual & Combat Codex'
    };

    const table = document.createElement('table');
    table.className = 'keybinds-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th style="width:26%;">TACTICAL ACTION</th>
          <th style="width:48%;">COMBAT FUNCTION</th>
          <th style="width:26%; text-align:right;">ASSIGNED KEY</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    Object.keys(this.keybinds).forEach(actionKey => {
      const row = document.createElement('tr');
      const assignedKey = this.keybinds[actionKey];
      const isRecording = this.recordingAction === actionKey;
      const label = descriptions[actionKey] || actionKey.replace(/_/g, ' ');

      row.innerHTML = `
        <td class="kb-action-cell">${actionKey.replace(/_/g, ' ')}</td>
        <td class="kb-desc-cell">${label}</td>
        <td style="text-align:right;">
          <button type="button" class="btn-rebind ${isRecording ? 'recording' : ''}" data-action="${actionKey}">
            ${isRecording ? 'PRESS KEY...' : this.formatKeyLabel(assignedKey)}
          </button>
        </td>
      `;

      const btn = row.querySelector('.btn-rebind');
      btn.onclick = () => {
        this.isRecordingKey = true;
        this.recordingAction = actionKey;
        this.renderTabContent();
      };

      tbody.appendChild(row);
    });

    container.appendChild(table);
  }

  formatKeyLabel(code) {
    if (!code) return 'NONE';
    return code
      .replace('Key', '')
      .replace('Digit', '')
      .replace('ArrowLeft', '← LEFT')
      .replace('ArrowRight', 'RIGHT →')
      .replace('ArrowUp', '▲ UP')
      .replace('ArrowDown', '▼ DOWN')
      .replace('Space', 'SPACE')
      .replace('BracketLeft', '[')
      .replace('BracketRight', ']')
      .replace('Backspace', 'BKSP');
  }

  renderAudioTab(container) {
    const mPct = Math.round(AudioSys.masterVolume * 100);
    const rPct = Math.round(AudioSys.rwrVolume * 100);
    const fPct = Math.round(AudioSys.fxVolume * 100);

    container.innerHTML = `
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>MASTER AUDIO BUS</label>
          <span class="settings-hint">Primary audio output gain level</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-master" min="0" max="100" value="${mPct}" class="settings-slider">
          <b id="val-master" class="slider-num">${mPct}%</b>
        </div>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>RWR THREAT TONES</label>
          <span class="settings-hint">Pleasant mil-spec radar sweep and missile lock warning buzzers</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-rwr" min="0" max="100" value="${rPct}" class="settings-slider">
          <b id="val-rwr" class="slider-num">${rPct}%</b>
        </div>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>COMBAT SOUND EFFECTS</label>
          <span class="settings-hint">Missile flyouts, autocannon fire, and detonations</span>
        </div>
        <div class="slider-val-box">
          <input type="range" id="vol-fx" min="0" max="100" value="${fPct}" class="settings-slider">
          <b id="val-fx" class="slider-num">${fPct}%</b>
        </div>
      </div>
    `;

    const slMaster = container.querySelector('#vol-master');
    const slRwr = container.querySelector('#vol-rwr');
    const slFx = container.querySelector('#vol-fx');
    const valM = container.querySelector('#val-master');
    const valR = container.querySelector('#val-rwr');
    const valF = container.querySelector('#val-fx');

    if (slMaster) slMaster.oninput = (e) => {
      const v = e.target.value / 100;
      AudioSys.setVolumes(v, undefined, undefined);
      if (valM) valM.textContent = e.target.value + '%';
    };
    if (slRwr) slRwr.oninput = (e) => {
      const v = e.target.value / 100;
      AudioSys.setVolumes(undefined, v, undefined);
      if (valR) valR.textContent = e.target.value + '%';
    };
    if (slFx) slFx.oninput = (e) => {
      const v = e.target.value / 100;
      AudioSys.setVolumes(undefined, v, undefined);
      if (valF) valF.textContent = e.target.value + '%';
    };
  }

  renderRadarTab(container) {
    const curZoom = (this.game.radar ? this.game.radar.zoom.toFixed(2) : '1.00');

    container.innerHTML = `
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>VIEWPORT MAGNIFICATION</label>
          <span class="settings-hint">Current radar zoom level scale factor</span>
        </div>
        <span class="slider-num" style="color:#38bdf8;">${curZoom}x</span>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>CENTER ON ACTIVE UNIT</label>
          <span class="settings-hint">Lock camera tracking onto the currently piloted jet</span>
        </div>
        <button type="button" id="btn-cfg-center" class="hud-btn small">TRACK [C]</button>
      </div>
      <div class="settings-form-row">
        <div class="settings-label-group">
          <label>RESET RADAR VIEWPORT</label>
          <span class="settings-hint">Restore default panoramic 150km × 100km view</span>
        </div>
        <button type="button" id="btn-cfg-reset-cam" class="hud-btn small">RESET [0]</button>
      </div>
    `;

    const cBtn = container.querySelector('#btn-cfg-center');
    const rBtn = container.querySelector('#btn-cfg-reset-cam');

    if (cBtn && this.game.radar) cBtn.onclick = () => this.game.radar.trackActiveCraft();
    if (rBtn && this.game.radar) rBtn.onclick = () => this.game.radar.resetCamera();
  }
}

window.SettingsManager = SettingsManager;