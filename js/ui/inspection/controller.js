/**
 * AIRSPACE STANDOFF: Inspection Mode Controller
 * Non-flickering C4ISR inspector with real-time in-place live telemetry updates.
 */

class InspectionModeController {
  constructor(game) {
    this.game = game;
    this.enabled = false;
    this.isOpen = false;
    this.selectedEntity = null;
    this.showEnemyDetails = true;
    this.selectionNotice = '';
    this.activeTab = 'OVERVIEW';
    this.events = [];
    this.focusedEvent = null;
    this.accordionStates = new Map();
    this.refreshAt = 0;
    this.resumeWarp = 1;
    this._lastEntityIdsKey = '';
    this._lastStructureSig = '';
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
        this.render(true);
      };
    });

    const handleResize = () => {
      if (this.isOpen) {
        this.resizeRadar();
        this.render(true);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));

    window.addEventListener('keydown', (e) => {
      if (!this.enabled || ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'KeyI') {
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      }
    });

    this.setAvailable(false);
  }

  beginMission(enabled) {
    this.enabled = Boolean(enabled);
    this.events = [];
    this.focusedEvent = null;
    this.selectedEntity = null;
    this.accordionStates.clear();
    this.activeTab = 'OVERVIEW';
    this._lastEntityIdsKey = '';
    this._lastStructureSig = '';
    this.setEnemyDetails(true);
    this.setAvailable(this.enabled);
    if (this.enabled) {
      this.recordEvent('SORTIE LAUNCH', 'Sortie commenced with live inspection telemetry enabled.', null, null);
      this.open();
    } else {
      this.close();
    }
  }

  setAvailable(available) {
    this.enabled = Boolean(available);
    const toggle = document.getElementById('btn-inspection-mode');
    const timeStop = document.getElementById('inspection-time-stop');
    if (toggle) {
      toggle.classList.toggle('hidden', !this.enabled);
      toggle.textContent = this.isOpen ? 'CLOSE ANALYSIS' : 'INSPECTION';
    }
    if (timeStop) timeStop.classList.toggle('hidden', !this.enabled);
  }

  open() {
    if (!this.game || !this.enabled) return;
    this.isOpen = true;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.remove('hidden');
    if (hud) hud.classList.add('inspection-layout');
    this.resizeRadar();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle) toggle.textContent = 'CLOSE ANALYSIS';
    const timeStop = document.getElementById('inspection-time-stop');
    if (timeStop && this.enabled) timeStop.classList.remove('hidden');
    if (!this.selectedEntity) this.selectedEntity = this.game.activeUnit || null;
    this.render(true);
  }

  close() {
    this.isOpen = false;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.add('hidden');
    if (hud) hud.classList.remove('inspection-layout');
    this.resizeRadar();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle && this.enabled) toggle.textContent = 'INSPECTION';
    const timeStop = document.getElementById('inspection-time-stop');
    if (timeStop) timeStop.classList.toggle('hidden', !this.enabled);
    this.updateTimeStopButton();
  }

  toggleTimeStop() {
    if (!this.enabled) return;
    const sim = this.game && this.game.simulation;
    if (!sim) return;
    if (sim.isPaused) sim.setTimeWarp(this.resumeWarp || 1);
    else {
      this.resumeWarp = sim.timeWarp || 1;
      sim.setTimeWarp(0);
    }
    this.updateTimeStopButton();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.render(true);
  }

  updateTimeStopButton() {
    const btn = document.getElementById('inspection-time-stop');
    const sim = this.game && this.game.simulation;
    if (!btn || !sim) return;
    if (!this.enabled) { btn.classList.add('hidden'); return; }
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

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    if (!this.showEnemyDetails && this.selectedEntity && this.selectedEntity.team !== commanderTeam) {
      this.selectedEntity = this.game.activeUnit || null;
    }
    this.render(true);
  }

  selectMapEntity(entity) {
    if (!entity) return;
    if (this.selectedEntity && this.selectedEntity.id === entity.id) return;

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const isEnemy = entity.team && entity.team !== commanderTeam;

    if (isEnemy && !this.showEnemyDetails) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      this.selectionNotice = `Locked ${this.getName(entity)} as combat target.`;
      this.refreshAt = performance.now() + 150;
      this.render(true);
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
    this.refreshAt = performance.now() + 150;
    this.render(true);
  }

  getEntityId(e) { return e ? (e.id || 'OBJ') : ''; }

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
    ].filter(e => e && (e.hp === undefined || e.hp > 0 || (e.active && !e.isDead)));
  }

  recordEvent(type, title, source, target, details = {}) {
    if (!this.enabled) return;
    const sim = this.game && this.game.simulation;
    const event = {
      id: `EV_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: sim && sim.getElapsedTimeString ? sim.getElapsedTimeString() : '00:00',
      type: String(type || 'TACTICAL EVENT'),
      title: String(title || type),
      sourceName: this.getName(source),
      targetName: this.getName(target),
      details
    };
    this.events.unshift(event);
    if (this.events.length > 500) this.events.pop();
    if (this.isOpen && this.activeTab === 'TRACE' && !this.focusedEvent) {
      this.render();
    }
  }

  update() {
    if (!this.enabled) return;
    this.updateTimeStopButton();
    if (!this.isOpen) return;

    if (this.selectedEntity && this.selectedEntity.isDead) {
      this.selectedEntity = this.game.activeUnit || null;
      this.render(true);
      return;
    }

    const sim = this.game && this.game.simulation;
    if (sim && sim.isPaused) return;

    const now = performance.now();
    if (now >= this.refreshAt) {
      this.refreshAt = now + 120;
      this.render(false);
    }
  }

  bindInteractions(content) {
    content.querySelectorAll('.inspection-accordion').forEach(acc => {
      const accId = acc.dataset.accordionId;
      if (accId) {
        if (this.accordionStates.has(accId)) acc.open = this.accordionStates.get(accId);
        else this.accordionStates.set(accId, acc.open);
        acc.addEventListener('toggle', () => this.accordionStates.set(accId, acc.open));
      }
    });

    content.querySelectorAll('[data-insp-action="fly"]').forEach(btn => {
      btn.onclick = () => {
        this.game.activeUnit = this.selectedEntity;
        if (this.game.avionics) {
          this.game.avionics.renderFlightRoster();
          this.game.avionics.updateActiveUnitMFD();
        }
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        this.render(true);
      };
    });

    content.querySelectorAll('[data-insp-action="target"]').forEach(btn => {
      btn.onclick = () => {
        this.game.selectedTarget = this.selectedEntity;
        if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        this.render(true);
      };
    });

    const backBtn = content.querySelector('#btn-trace-back-to-list');
    if (backBtn) {
      backBtn.onclick = () => {
        this.focusedEvent = null;
        this.render(true);
      };
    }

    content.querySelectorAll('.inspection-content .inspection-event-row').forEach(row => {
      row.onclick = () => {
        const id = row.getAttribute('data-ev-id');
        this.focusedEvent = this.events.find(e => e.id === id) || null;
        this.render(true);
      };
    });
  }

  computeStructureSignature() {
    const e = this.selectedEntity;
    if (!e) return `${this.activeTab}:none`;
    const eid = this.getEntityId(e);
    const tid = this.getEntityId(this.game.selectedTarget);

    if (this.activeTab === 'WEAPONS') {
      const inbounds = (this.game.missiles || []).filter(m => m.active && m.target && m.target.id === e.id).map(m => m.id).join(',');
      const firingUnit = e.spec ? e : this.game.activeUnit;
      const wpns = firingUnit ? (firingUnit.equippedWeapons || []).map(it => `${it.weapon ? it.weapon.id : ''}:${it.ammo}`).join(',') : '';
      return `${this.activeTab}:${eid}:${tid}:${inbounds}:${wpns}`;
    }
    if (this.activeTab === 'SENSORS') {
      const isBlue = e.team === (this.game.currentPvpCommander || 'friendly');
      const sensors = isBlue ? (this.game.hostileAircraft || []) : (this.game.alliedAircraft || []);
      const sIds = sensors.filter(s => s.hp > 0).map(s => s.id).join(',');
      return `${this.activeTab}:${eid}:${sIds}`;
    }
    if (this.activeTab === 'OVERVIEW') {
      const equipLen = (e.equippedWeapons || []).length;
      return `${this.activeTab}:${eid}:${e.maxHp || 0}:${equipLen}`;
    }
    if (this.activeTab === 'TRACE') {
      return `${this.activeTab}:${this.focusedEvent ? this.focusedEvent.id : `list:${this.events.length}`}`;
    }
    return `${this.activeTab}:${eid}`;
  }

  render(force = false) {
    if (!this.isOpen || !this.enabled) return;

    const titleEl = document.getElementById('inspection-selection-title');
    const hintEl = document.getElementById('inspection-hint');
    const content = document.getElementById('inspection-content');

    if (titleEl) titleEl.textContent = this.selectedEntity ? this.getName(this.selectedEntity) : 'SELECT AN OBJECT';
    if (hintEl) {
      hintEl.textContent = this.selectionNotice || (this.selectedEntity
        ? `Analyzing ${this.getName(this.selectedEntity)}. Tap contacts on radar to switch target.`
        : 'Select any aircraft or missile contact on the radar display.');
    }

    if (typeof CustomDropdown !== 'undefined') {
      const cdd = CustomDropdown.get('cdd-inspection-entity');
      if (cdd && !cdd.isOpen()) {
        const all = this.getAllEntities();
        const idsKey = all.map(e => e.id).join(',');
        const curId = this.getEntityId(this.selectedEntity);

        if (idsKey !== this._lastEntityIdsKey) {
          this._lastEntityIdsKey = idsKey;
          cdd.setOptions([
            { value: '', text: `CHOOSE OBJECT (${all.length})` },
            ...all.map(e => ({ value: this.getEntityId(e), text: this.getName(e) }))
          ], curId);
        } else if (curId !== cdd.getValue()) {
          cdd.setValue(curId, false);
        }
      }
    }

    document.querySelectorAll('[data-inspection-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.inspectionTab === this.activeTab);
    });

    if (content) {
      const structSig = this.computeStructureSignature();
      const needsFullRebuild = force || this._lastStructureSig !== structSig;

      if (needsFullRebuild) {
        this._lastStructureSig = structSig;
        let nextHtml = '';
        if (this.activeTab === 'SENSORS' && typeof InspectionTelemetry !== 'undefined') {
          nextHtml = InspectionTelemetry.renderRadarDashboard(this, this.selectedEntity);
        } else if (this.activeTab === 'WEAPONS' && typeof InspectionWeapons !== 'undefined') {
          nextHtml = InspectionWeapons.renderWeaponsDashboard(this, this.selectedEntity);
        } else if (this.activeTab === 'TRACE' && typeof InspectionViews !== 'undefined') {
          nextHtml = InspectionViews.renderEventTraceTab(this, this.focusedEvent);
        } else if (this.activeTab === 'RAW' && typeof InspectionViews !== 'undefined') {
          nextHtml = InspectionViews.renderRawDataTab(this, this.selectedEntity);
        } else if (typeof InspectionViews !== 'undefined') {
          nextHtml = InspectionViews.renderOverviewTab(this, this.selectedEntity);
        }
        content.innerHTML = nextHtml;
        this.bindInteractions(content);
      } else {
        if (this.activeTab === 'SENSORS' && typeof InspectionTelemetry !== 'undefined') {
          InspectionTelemetry.updateLive(this, this.selectedEntity, content);
        } else if (this.activeTab === 'WEAPONS' && typeof InspectionWeapons !== 'undefined') {
          InspectionWeapons.updateLive(this, this.selectedEntity, content);
        } else if (this.activeTab === 'OVERVIEW' && typeof InspectionViews !== 'undefined') {
          InspectionViews.updateLive(this, this.selectedEntity, content);
        } else if (this.activeTab === 'RAW' && typeof InspectionViews !== 'undefined') {
          InspectionViews.updateRawLive(this, this.selectedEntity, content);
        }
      }
    }
  }

  escape(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }
}

window.InspectionModeController = InspectionModeController;