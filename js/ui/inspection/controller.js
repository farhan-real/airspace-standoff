/* AIRSPACE STANDOFF: Inspection Mode Controller (Liquid Glass Theme) */

class InspectionModeController {
  constructor(game) {
    this.game = game;
    this.enabled = true;
    this.isOpen = false;
    this.selectedEntity = null;
    this.showEnemyDetails = true;
    this.selectionNotice = '';
    this.activeTab = 'OVERVIEW';
    this.events = [];
    this.focusedEvent = null;
    this.refreshAt = 0;
    this.resumeWarp = 1;
    this.init();
  }

  init() {
    const toggle = document.getElementById('btn-inspection-mode');
    const close = document.getElementById('inspection-close');
    const timeStop = document.getElementById('inspection-time-stop');
    const enemyToggle = document.getElementById('inspection-enemy-toggle');
    const tabs = document.querySelectorAll('[data-inspection-tab]');

    if (toggle) toggle.onclick = () => this.isOpen ? this.close() : this.open();
    if (close) close.onclick = () => this.close();
    if (timeStop) timeStop.onclick = () => this.toggleTimeStop();
    if (enemyToggle) enemyToggle.onclick = () => this.setEnemyDetails(!this.showEnemyDetails);

    if (typeof CustomDropdown !== 'undefined') {
      CustomDropdown.setup('cdd-inspection-entity', {
        value: '',
        options: [{ value: '', text: 'CHOOSE OBJECT' }],
        onChange: (val) => {
          if (!val) return;
          const entity = this.getAllEntities().find(e => this.getEntityId(e) === val);
          if (entity) this.selectMapEntity(entity);
        }
      });
    }

    tabs.forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.inspectionTab || 'OVERVIEW';
        this.render();
      };
    });

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'KeyI') {
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      }
    });

    this.setAvailable(true);
  }

  beginMission(autoOpen) {
    this.events = [];
    this.focusedEvent = null;
    this.selectedEntity = null;
    this.activeTab = 'OVERVIEW';
    this.setEnemyDetails(true);
    this.setAvailable(true);
    if (autoOpen) {
      this.recordEvent('INSPECTION INITIALIZED', 'Full theater telemetry and causal diagnostics engaged.', null, null);
      this.open();
    } else {
      this.close();
    }
  }

  setAvailable(available) {
    this.enabled = true;
    const toggle = document.getElementById('btn-inspection-mode');
    const timeStop = document.getElementById('inspection-time-stop');
    if (toggle) {
      toggle.classList.remove('hidden');
      toggle.textContent = this.isOpen ? 'CLOSE ANALYSIS' : 'INSPECTION';
    }
    if (timeStop) timeStop.classList.toggle('hidden', !this.isOpen);
  }

  open() {
    if (!this.game) return;
    this.isOpen = true;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.remove('hidden');
    if (hud) hud.classList.add('inspection-layout');
    this.resizeRadar();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle) toggle.textContent = 'CLOSE ANALYSIS';
    const timeStop = document.getElementById('inspection-time-stop');
    if (timeStop) timeStop.classList.remove('hidden');
    if (!this.selectedEntity) this.selectedEntity = this.game.activeUnit || null;
    this.render();
  }

  close() {
    this.isOpen = false;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.add('hidden');
    if (hud) hud.classList.remove('inspection-layout');
    this.resizeRadar();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle) toggle.textContent = 'INSPECTION';
    const timeStop = document.getElementById('inspection-time-stop');
    if (timeStop) timeStop.classList.add('hidden');
  }

  toggleTimeStop() {
    const sim = this.game && this.game.simulation;
    if (!sim) return;
    if (sim.isPaused) {
      sim.setTimeWarp(this.resumeWarp || 1);
    } else {
      this.resumeWarp = sim.timeWarp || 1;
      sim.setTimeWarp(0);
    }
    this.updateTimeStopButton();
  }

  updateTimeStopButton() {
    const btn = document.getElementById('inspection-time-stop');
    const sim = this.game && this.game.simulation;
    if (!btn || !sim) return;
    const stopped = Boolean(sim.isPaused);
    btn.textContent = stopped ? 'RESUME TIME' : 'STOP TIME';
    btn.classList.toggle('inspection-resume', stopped);
  }

  resizeRadar() {
    setTimeout(() => {
      if (this.game && this.game.radar && typeof this.game.radar.resize === 'function') {
        this.game.radar.resize();
      }
    }, 50);
  }

  setEnemyDetails(enabled) {
    this.showEnemyDetails = Boolean(enabled);
    const btn = document.getElementById('inspection-enemy-toggle');
    if (btn) {
      btn.textContent = this.showEnemyDetails ? 'ENEMY: ON' : 'ENEMY: OFF';
      btn.classList.toggle('inspection-enemy-off', !this.showEnemyDetails);
    }
    this.render();
  }

  selectMapEntity(entity) {
    if (!entity) return;
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const isEnemy = entity.team && entity.team !== commanderTeam;

    if (isEnemy && !this.showEnemyDetails) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      this.selectionNotice = `Locked ${this.getName(entity)} as combat target.`;
      this.render();
      return;
    }

    if (entity.team === commanderTeam && entity.hp > 0 && typeof Aircraft !== 'undefined' && entity instanceof Aircraft) {
      this.game.activeUnit = entity;
      if (this.game.avionics) {
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      }
    } else if (entity.hp > 0) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
    }

    this.selectedEntity = entity;
    this.selectionNotice = '';
    this.focusedEvent = null;
    this.render();
  }

  getEntityId(e) {
    return e ? (e.id || 'OBJ') : '';
  }

  getName(e) {
    if (!e) return 'Unknown Object';
    if (e.spec && e.callsign && window.formatAircraftDisplayName) return window.formatAircraftDisplayName(e);
    if (e.weapon && e.target) return `${e.weapon.name || 'Missile'} (${e.id})`;
    if (e.callsign) return e.callsign;
    if (e.flightCode) return `${e.name || 'Airliner'} ${e.flightCode}`;
    if (e.name) return e.name;
    return e.id || 'Contact';
  }

  getAllEntities() {
    const sim = this.game && this.game.simulation;
    return [
      ...(this.game.alliedAircraft || []),
      ...(this.game.hostileAircraft || []),
      ...(this.game.surfaceUnits || []),
      ...(this.game.missiles || []),
      ...((sim && sim.civilianTraffic) || []),
      ...((sim && sim.ghostContacts) || []),
      ...((sim && sim.decoyDrones) || [])
    ].filter(e => e && (e.hp === undefined || e.hp > 0 || e.active));
  }

  recordEvent(type, title, source, target, details = {}) {
    const sim = this.game && this.game.simulation;
    const event = {
      id: `EV_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: sim && sim.getElapsedTimeString ? sim.getElapsedTimeString() : '00:00',
      type: String(type || 'EVENT'),
      title: String(title || type),
      sourceName: this.getName(source),
      targetName: this.getName(target),
      details: details
    };
    this.events.unshift(event);
    if (this.events.length > 500) this.events.pop();
    if (this.isOpen) this.renderEvents();
  }

  update() {
    if (!this.isOpen) return;
    this.updateTimeStopButton();
    const now = performance.now();
    if (now >= this.refreshAt) {
      this.refreshAt = now + 250;
      this.render();
    }
  }

  render() {
    if (!this.isOpen) return;
    const titleEl = document.getElementById('inspection-selection-title');
    const hintEl = document.getElementById('inspection-hint');
    const content = document.getElementById('inspection-content');

    if (titleEl) titleEl.textContent = this.selectedEntity ? this.getName(this.selectedEntity) : 'SELECT AN OBJECT';
    if (hintEl) {
      hintEl.textContent = this.selectionNotice || (this.selectedEntity
        ? `Analyzing ${this.getName(this.selectedEntity)}. Tap contacts on radar to switch inspection target.`
        : 'Select any aircraft or missile contact on the radar display.');
    }

    if (typeof CustomDropdown !== 'undefined') {
      const cdd = CustomDropdown.get('cdd-inspection-entity');
      if (cdd) {
        const all = this.getAllEntities();
        const curId = this.getEntityId(this.selectedEntity);
        const options = [
          { value: '', text: `CHOOSE OBJECT (${all.length})` },
          ...all.map(e => ({ value: this.getEntityId(e), text: this.getName(e) }))
        ];
        cdd.setOptions(options, curId);
      }
    }

    document.querySelectorAll('[data-inspection-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.inspectionTab === this.activeTab);
    });

    if (content) {
      if (this.activeTab === 'SENSORS' && typeof InspectionTelemetry !== 'undefined') {
        content.innerHTML = InspectionTelemetry.renderRadarDashboard(this, this.selectedEntity);
      } else if (this.activeTab === 'WEAPONS' && typeof InspectionTelemetry !== 'undefined') {
        content.innerHTML = InspectionTelemetry.renderWeaponsDashboard(this, this.selectedEntity);
      } else if (this.activeTab === 'TRACE' && typeof InspectionViews !== 'undefined') {
        content.innerHTML = InspectionViews.renderEventTraceTab(this, this.focusedEvent);
      } else if (this.activeTab === 'RAW' && typeof InspectionViews !== 'undefined') {
        content.innerHTML = InspectionViews.renderRawDataTab(this, this.selectedEntity);
      } else if (typeof InspectionViews !== 'undefined') {
        content.innerHTML = InspectionViews.renderOverviewTab(this, this.selectedEntity);
      }

      content.querySelectorAll('[data-insp-action="fly"]').forEach(btn => {
        btn.onclick = () => {
          this.game.activeUnit = this.selectedEntity;
          if (this.game.avionics) {
            this.game.avionics.renderFlightRoster();
            this.game.avionics.updateActiveUnitMFD();
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.render();
        };
      });

      content.querySelectorAll('[data-insp-action="target"]').forEach(btn => {
        btn.onclick = () => {
          this.game.selectedTarget = this.selectedEntity;
          if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.render();
        };
      });
    }

    this.renderEvents();
  }

  renderEvents() {
    const listEl = document.getElementById('inspection-event-list');
    const countEl = document.getElementById('inspection-event-count');
    if (!listEl) return;
    if (countEl) countEl.textContent = `${this.events.length} EVENTS`;

    listEl.innerHTML = this.events.slice(0, 25).map(ev => `
      <button type="button" class="inspection-event-row ${this.focusedEvent && this.focusedEvent.id === ev.id ? 'focused' : ''}" data-ev-id="${ev.id}">
        <span>[${ev.time}] ${ev.type}</span>
        <b>${this.escape(ev.title)}</b>
      </button>
    `).join('') || '<p class="inspection-muted" style="padding:8px 10px;">Waiting for flight events...</p>';

    listEl.querySelectorAll('.inspection-event-row').forEach(row => {
      row.onclick = () => {
        const id = row.getAttribute('data-ev-id');
        this.focusedEvent = this.events.find(e => e.id === id) || null;
        this.activeTab = 'TRACE';
        this.render();
      };
    });
  }

  escape(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }
}

window.InspectionModeController = InspectionModeController;