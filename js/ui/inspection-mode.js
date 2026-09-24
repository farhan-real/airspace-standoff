/* AIRSPACE STANDOFF: Mission Inspection Workspace */

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
    this.refreshAt = 0;
    this.entityPickerSignature = '';
    this.lastManeuverByUnit = new Map();
    this.entityIds = new WeakMap();
    this.nextEntityId = 1;
    this.nextEventId = 1;
    this.resumeWarp = 1;
    this.maxEvents = 3000;
    this.init();
  }

  init() {
    const toggle = document.getElementById('btn-inspection-mode');
    const close = document.getElementById('inspection-close');
    const timeStop = document.getElementById('inspection-time-stop');
    const picker = document.getElementById('inspection-entity-select');
    const enemyToggle = document.getElementById('inspection-enemy-toggle');
    const tabs = document.querySelectorAll('[data-inspection-tab]');

    if (toggle) toggle.onclick = () => this.isOpen ? this.close() : this.open();
    if (close) close.onclick = () => this.close();
    if (timeStop) timeStop.onclick = () => this.toggleTimeStop();
    if (enemyToggle) enemyToggle.onclick = () => this.setEnemyDetails(!this.showEnemyDetails);
    if (picker) picker.onchange = () => {
      const entity = this.getAllEntities().find(item => this.getEntityId(item) === picker.value);
      if (entity) this.selectPickerEntity(entity);
    };
    tabs.forEach(button => button.addEventListener('click', () => {
      this.activeTab = button.dataset.inspectionTab || 'OVERVIEW';
      this.render();
    }));

    this.setAvailable(false);
  }

  beginMission(enabled) {
    this.events = [];
    this.focusedEvent = null;
    this.lastManeuverByUnit.clear();
    this.selectedEntity = null;
    this.activeTab = 'OVERVIEW';
    this.selectionNotice = '';
    this.setEnemyDetails(true);
    this.setAvailable(Boolean(enabled));
    if (enabled) {
      this.recordEvent('INSPECTION ENABLED', 'Inspection mode is active. All contacts are visible in this unranked mission.', null, null, {
        leaderboard: 'Disabled for mission editor sorties', omniscientView: true
      });
      this.open();
    } else {
      this.close();
    }
  }

  setAvailable(enabled) {
    this.enabled = Boolean(enabled);
    const toggle = document.getElementById('btn-inspection-mode');
    const timeStop = document.getElementById('inspection-time-stop');
    if (toggle) {
      toggle.classList.toggle('hidden', !this.enabled);
      toggle.textContent = this.isOpen ? 'CLOSE ANALYSIS' : 'INSPECTION';
      toggle.setAttribute('aria-pressed', this.isOpen ? 'true' : 'false');
    }
    if (timeStop) timeStop.classList.toggle('hidden', !this.enabled);
  }

  open() {
    if (!this.enabled || !this.game) return;
    this.isOpen = true;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.remove('hidden');
    if (hud) hud.classList.add('inspection-layout');
    this.resizeRadarAfterLayout();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle) {
      toggle.textContent = 'CLOSE ANALYSIS';
      toggle.setAttribute('aria-pressed', 'true');
    }
    if (!this.selectedEntity) this.selectedEntity = this.game.activeUnit || null;
    this.render();
  }

  close() {
    this.isOpen = false;
    const pane = document.getElementById('inspection-pane');
    const hud = document.getElementById('hud-container');
    if (pane) pane.classList.add('hidden');
    if (hud) hud.classList.remove('inspection-layout');
    this.resizeRadarAfterLayout();
    const toggle = document.getElementById('btn-inspection-mode');
    if (toggle) {
      toggle.textContent = 'INSPECTION';
      toggle.setAttribute('aria-pressed', 'false');
    }
  }

  toggleTimeStop() {
    const simulation = this.game && this.game.simulation;
    if (!simulation) return;
    if (simulation.isPaused) {
      simulation.setTimeWarp(simulation.timeWarp || this.resumeWarp || 1);
    } else {
      this.resumeWarp = simulation.timeWarp || 1;
      simulation.setTimeWarp(0);
    }
    this.updateTimeStopButton();
  }

  resizeRadarAfterLayout() {
    const resize = () => {
      if (this.game && this.game.radar && typeof this.game.radar.resize === 'function') this.game.radar.resize();
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(resize);
    else setTimeout(resize, 0);
  }

  updateTimeStopButton() {
    const button = document.getElementById('inspection-time-stop');
    const simulation = this.game && this.game.simulation;
    if (!button || !simulation) return;
    const stopped = Boolean(simulation.isPaused);
    button.textContent = stopped ? 'RESUME TIME' : 'STOP TIME';
    button.setAttribute('aria-pressed', stopped ? 'true' : 'false');
    button.classList.toggle('alert', !stopped);
    button.classList.toggle('inspection-resume', stopped);
  }

  selectEntity(entity) {
    if (!entity) return;
    this.selectedEntity = entity;
    this.selectionNotice = '';
    this.focusedEvent = null;
    this.activeTab = 'OVERVIEW';
    this.render();
  }

  selectMapEntity(entity) {
    if (!entity) return;
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    if (this.isEnemyAircraft(entity) && !this.showEnemyDetails) {
      this.selectEnemyTargetWithoutDetails(entity);
      return;
    }
    if (typeof Aircraft !== 'undefined' && entity instanceof Aircraft && entity.team === commanderTeam && entity.hp > 0) {
      this.selectEntity(entity);
      this.game.activeUnit = entity;
      if (this.game.avionics) {
        this.game.avionics.renderFlightRoster();
        this.game.avionics.updateActiveUnitMFD();
      }
      return;
    }
    if (entity.team && entity.team !== commanderTeam && entity.hp > 0) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      this.selectEntity(entity);
      return;
    }
    if (entity.isCivilian && entity.hp > 0) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      this.selectEntity(entity);
      return;
    }
    this.selectEntity(entity);
  }

  selectPickerEntity(entity) {
    if (this.isEnemyAircraft(entity) && !this.showEnemyDetails) {
      this.selectEnemyTargetWithoutDetails(entity);
      return;
    }
    this.selectEntity(entity);
  }

  selectEnemyTargetWithoutDetails(entity) {
    if (entity.hp > 0) {
      this.game.selectedTarget = entity;
      if (this.game.avionics) this.game.avionics.updateActiveUnitMFD();
      this.selectionNotice = `${this.getName(entity)} is now your target. Your aircraft details stay selected.`;
    } else {
      this.selectionNotice = `${this.getName(entity)} is destroyed. Enemy aircraft details are hidden.`;
    }
    this.render();
  }

  isEnemyAircraft(entity) {
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    return typeof Aircraft !== 'undefined' && entity instanceof Aircraft && entity.team !== commanderTeam;
  }

  setEnemyDetails(enabled) {
    this.showEnemyDetails = Boolean(enabled);
    const button = document.getElementById('inspection-enemy-toggle');
    if (button) {
      button.textContent = this.showEnemyDetails ? 'ENEMY: ON' : 'ENEMY: OFF';
      button.setAttribute('aria-pressed', this.showEnemyDetails ? 'true' : 'false');
      button.setAttribute('aria-label', this.showEnemyDetails ? 'Enemy aircraft details are shown' : 'Enemy aircraft details are hidden');
      button.classList.toggle('inspection-enemy-off', !this.showEnemyDetails);
    }
    if (!this.showEnemyDetails && this.isEnemyAircraft(this.selectedEntity)) {
      const commanderTeam = this.game.currentPvpCommander || 'friendly';
      this.selectedEntity = this.game.activeUnit && this.game.activeUnit.team === commanderTeam
        ? this.game.activeUnit
        : [...(this.game.alliedAircraft || []), ...(this.game.hostileAircraft || [])]
          .find(unit => unit && unit.team === commanderTeam && unit.hp > 0) || null;
      this.activeTab = 'OVERVIEW';
      this.selectionNotice = 'Enemy aircraft details are hidden. Select an enemy to set it as your target.';
    }
    if (this.isOpen) this.render();
  }

  getEntityId(entity) {
    if (!entity) return '';
    if (entity.id) return String(entity.id);
    if (!this.entityIds.has(entity)) this.entityIds.set(entity, `INSPECT_${this.nextEntityId++}`);
    return this.entityIds.get(entity);
  }

  getAllEntities() {
    const simulation = this.game && this.game.simulation;
    const entities = [
      ...(this.game.alliedAircraft || []), ...(this.game.hostileAircraft || []),
      ...(this.game.surfaceUnits || []), ...(this.game.missiles || []),
      ...((simulation && simulation.civilianTraffic) || []), ...((simulation && simulation.ghostContacts) || []),
      ...((simulation && simulation.decoyDrones) || []), ...((simulation && simulation.weatherClouds) || [])
    ];
    return [...new Set(entities.filter(Boolean))];
  }

  getName(entity) {
    if (!entity) return 'Unknown object';
    if (entity.weapon && entity.target) return `${entity.weapon.name || entity.weapon.id || 'Missile'} · ${entity.id}`;
    if (entity.spec && (entity.callsign || entity.model) && window.formatAircraftDisplayName) return window.formatAircraftDisplayName(entity);
    if (entity.callsign) return entity.callsign;
    if (entity.flightCode) return `${entity.name || 'Civilian aircraft'} · ${entity.flightCode}`;
    if (entity.spec) return entity.spec.name || entity.spec.id;
    if (entity.isJammerStation) return entity.name || 'Electronic warfare station';
    if (entity.type) return entity.name || entity.type;
    if (entity.rx !== undefined && entity.ry !== undefined) return 'Weather cloud';
    return entity.name || entity.id || 'Contact';
  }

  getKind(entity) {
    if (!entity) return 'NO OBJECT';
    if (entity.weapon && entity.target) return 'GUIDED WEAPON';
    if (entity.spec) return entity.spec.isDrone ? 'DRONE AIRCRAFT' : 'AIRCRAFT';
    if (entity.isCivilian) return 'CIVILIAN AIRCRAFT';
    if (entity.isGhost) return 'GHOST CONTACT';
    if (entity.isDecoyDrone) return 'DECOY DRONE';
    if (entity.rx !== undefined && entity.ry !== undefined) return 'WEATHER CLOUD';
    if (entity.type) return 'SURFACE UNIT';
    return 'CONTACT';
  }

  recordEvent(type, title, source, target, details = {}, instrument = null) {
    if (!this.enabled) return null;
    const simulation = this.game && this.game.simulation;
    const event = {
      id: `EV_${this.nextEventId++}`,
      timeSec: simulation ? simulation.elapsedTimeSec : 0,
      time: simulation && simulation.getElapsedTimeString ? simulation.getElapsedTimeString() : '00:00',
      type: String(type || 'EVENT'),
      title: String(title || type || 'Mission event'),
      sourceId: source && source.id ? source.id : null,
      sourceName: this.getName(source),
      targetId: target && target.id ? target.id : null,
      targetName: this.getName(target),
      instrumentId: instrument && instrument.id ? instrument.id : null,
      instrumentName: instrument ? this.getName(instrument) : null,
      details: this.toPlain(details),
      snapshots: [source, target, instrument].filter(Boolean).map(item => this.snapshotEntity(item))
    };
    this.events.push(event);
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents);
    if (this.isOpen) this.renderEvents();
    return event;
  }

  toPlain(value, depth = 0, seen = new WeakSet()) {
    if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value === 'function') return '[function]';
    if (depth > 3) return '[nested data]';
    if (typeof value !== 'object') return String(value);
    if (seen.has(value)) return '[circular reference]';
    seen.add(value);
    if (Array.isArray(value)) return value.slice(0, 32).map(item => this.toPlain(item, depth + 1, seen));
    const out = {};
    Object.entries(value).slice(0, 48).forEach(([key, item]) => {
      if (['source', 'target', 'parentUnit', 'game', 'simulation', 'radar'].includes(key)) return;
      out[key] = this.toPlain(item, depth + 1, seen);
    });
    return out;
  }

  snapshotEntity(entity) {
    const snapshot = {
      id: entity.id || this.getEntityId(entity),
      name: this.getName(entity),
      kind: this.getKind(entity),
      team: entity.team || 'neutral',
      state: {}
    };
    Object.entries(entity).forEach(([key, value]) => {
      if (['spec', 'weapon', 'source', 'target', 'parentUnit', 'trail'].includes(key)) return;
      if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) snapshot.state[key] = value;
    });
    if (entity.spec) snapshot.spec = this.toPlain(entity.spec);
    if (entity.weapon) snapshot.weapon = this.toPlain(entity.weapon);
    return snapshot;
  }

  captureManeuverChanges() {
    for (const aircraft of [...(this.game.alliedAircraft || []), ...(this.game.hostileAircraft || [])]) {
      const current = aircraft.activeManeuverId || null;
      const previous = this.lastManeuverByUnit.get(aircraft.id) || null;
      if (current && current !== previous) {
        const incoming = (this.game.missiles || []).filter(missile => missile.active && missile.target && missile.target.id === aircraft.id);
        this.recordEvent('DEFENSIVE ACTION', `${this.getName(aircraft)} began ${current.replace(/_/g, ' ')}`, aircraft, incoming[0] || null, {
          maneuver: current,
          durationSec: aircraft.activeManeuverTimer,
          evasionBonus: aircraft.activeManeuverBonus,
          isNotching: Boolean(aircraft.isNotching),
          energy: aircraft.energy,
          stress: aircraft.stress,
          incomingMissiles: incoming.map(missile => ({ id: missile.id, weapon: missile.weapon && missile.weapon.name, distanceKm: missile.distanceToTarget, seeker: missile.weapon && missile.weapon.seeker }))
        });
      }
      this.lastManeuverByUnit.set(aircraft.id, current);
    }
  }

  update() {
    if (!this.enabled) return;
    this.captureManeuverChanges();
    this.updateTimeStopButton();
    const now = performance.now();
    if (this.isOpen && now >= this.refreshAt) {
      this.refreshAt = now + 300;
      this.render();
    }
  }

  render() {
    if (!this.isOpen) return;
    const title = document.getElementById('inspection-selection-title');
    const hint = document.getElementById('inspection-hint');
    if (title) title.textContent = this.selectedEntity ? `${this.getName(this.selectedEntity)} · ${this.getKind(this.selectedEntity)}` : 'SELECT AN OBJECT';
    if (hint) hint.textContent = this.selectionNotice || (this.selectedEntity
      ? `The map stays playable: friendly aircraft select to fly; enemy aircraft ${this.showEnemyDetails ? 'show details and become your target' : 'become your target without replacing your aircraft details'}. Stop Time stays in the top bar.`
      : 'Choose a unit on the map or in the list. Friendly aircraft select to fly; enemy aircraft can be targeted without changing the details shown.');

    const picker = document.getElementById('inspection-entity-select');
    if (picker) {
      const selectedId = this.selectedEntity ? this.getEntityId(this.selectedEntity) : '';
      const entities = this.getAllEntities();
      const signature = entities.map(entity => `${this.getEntityId(entity)}:${entity.hp === undefined ? '' : entity.hp <= 0 ? 'dead' : 'live'}:${this.getName(entity)}`).join('|');
      if (signature !== this.entityPickerSignature && picker !== document.activeElement) {
        picker.innerHTML = `<option value="">CHOOSE OBJECT</option>${entities.map(entity => {
        const state = entity.hp !== undefined ? (entity.hp <= 0 ? ' · DESTROYED' : '') : '';
        const team = entity.team ? ` · ${String(entity.team).toUpperCase()}` : '';
        return `<option value="${this.escape(this.getEntityId(entity))}">${this.escape(this.getName(entity))}${this.escape(team + state)}</option>`;
        }).join('')}`;
        this.entityPickerSignature = signature;
      }
      if (picker !== document.activeElement && picker.value !== selectedId) picker.value = selectedId;
    }

    document.querySelectorAll('[data-inspection-tab]').forEach(button => button.classList.toggle('active', button.dataset.inspectionTab === this.activeTab));
    const content = document.getElementById('inspection-content');
    if (content) {
      const scrollTop = content.scrollTop;
      const openDetails = new Set([...content.querySelectorAll('details')]
        .map((detail, index) => detail.open ? (detail.dataset.inspectionKey || String(index)) : null)
        .filter(value => value !== null));
      content.innerHTML = this.renderTabContent();
      content.querySelectorAll('details').forEach((detail, index) => {
        const key = detail.dataset.inspectionKey || String(index);
        detail.open = openDetails.has(key);
      });
      content.scrollTop = scrollTop;
      content.querySelectorAll('[data-inspection-event]').forEach(button => button.onclick = () => this.focusEvent(button.dataset.inspectionEvent));
      content.querySelectorAll('[data-inspection-action]').forEach(button => button.onclick = () => this.selectMapEntity(this.selectedEntity));
    }
    this.renderEvents();
    this.updateTimeStopButton();
  }

  renderTabContent() {
    if (this.activeTab === 'RADAR') return this.renderRadarTab();
    if (this.activeTab === 'ENGAGEMENT') return this.renderEngagementTab();
    if (this.activeTab === 'TRACE') return this.renderTraceTab();
    if (this.activeTab === 'RAW') return this.renderRawTab();
    return this.renderOverviewTab();
  }

  renderMetric(label, value, percent, note = '', tone = '') {
    const width = Math.max(0, Math.min(100, Number(percent) || 0));
    return `<div class="inspection-metric"><div class="inspection-metric-top"><span class="inspection-metric-label">${this.escape(label)}</span><b class="inspection-metric-value">${this.escape(value)}</b></div><div class="inspection-meter ${tone}"><i style="width:${width}%"></i></div>${note ? `<small class="inspection-meter-note">${this.escape(note)}</small>` : ''}</div>`;
  }

  renderDisclosure(title, key, content) {
    return `<details class="inspection-disclosure" data-inspection-key="${this.escape(key)}"><summary>${this.escape(title)}</summary><div class="inspection-disclosure-body">${content}</div></details>`;
  }

  renderOverviewTab() {
    const entity = this.selectedEntity;
    if (!entity) return this.emptyState('No object selected', 'Choose an object on the map or in the object list.');
    const status = entity.hp === undefined ? 'Active' : (entity.hp > 0 ? 'Operational' : 'Destroyed');
    const identity = [['Type', this.getKind(entity)], ['Side', entity.team || 'Neutral'], ['Status', status]];
    if (typeof entity.x === 'number' && typeof entity.y === 'number') identity.push(['Map position', `${this.n(entity.x, 1)} km east · ${this.n(entity.y, 1)} km north`]);
    if (entity.heading !== undefined) identity.push(['Facing', `${this.n(entity.heading * 180 / Math.PI, 0)}°`]);
    const sections = [this.renderTable('AT A GLANCE', identity)];
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    if (typeof Aircraft !== 'undefined' && entity instanceof Aircraft && entity.team === commanderTeam && entity.hp > 0) {
      sections.push(`<button type="button" class="inspection-command-button" data-inspection-action="active">FLY THIS AIRCRAFT</button>`);
    } else if ((entity.team && entity.team !== commanderTeam && entity.hp > 0) || (entity.isCivilian && entity.hp > 0)) {
      sections.push(`<button type="button" class="inspection-command-button target" data-inspection-action="target">SET AS WEAPON TARGET</button>`);
    }
    if (entity.spec) {
      const maxHp = Math.max(1, Number(entity.maxHp || entity.hp) || 1);
      const maxSpeed = Math.max(0.3, Number(entity.effectiveMaxSpeed || entity.spec.S_0 || 1) * 1.35);
      const agility = typeof entity.getEffectiveAgility === 'function' ? entity.getEffectiveAgility() : Number(entity.spec.AGI_0 || 0.85);
      const agilityWord = agility >= 1.15 ? 'Very agile' : (agility >= 0.95 ? 'Agile' : (agility >= 0.75 ? 'Average turn' : 'Slow turn'));
      const activeManeuver = entity.activeManeuverId ? entity.activeManeuverId.replace(/_/g, ' ').toLowerCase() : 'No defensive maneuver';
      sections.push(`<p class="inspection-intro">${entity.hp > 0 ? `${this.escape(this.getName(entity))} is ${this.escape(status.toLowerCase())}.` : `${this.escape(this.getName(entity))} is destroyed.`} ${this.escape(agilityWord)} · ${this.escape(activeManeuver)}. Select an enemy on the map to target it, then use the weapon controls beside the map or below it on a phone.</p>`);
      sections.push(`<div class="inspection-metric-grid">
        ${this.renderMetric('HEALTH', `${this.n(entity.hp, 1)} / ${this.n(maxHp, 0)}`, entity.hp / maxHp * 100, entity.hp > 0 ? 'Remaining aircraft health' : 'Aircraft lost', entity.hp / maxHp < 0.35 ? 'warning' : '')}
        ${this.renderMetric('SPEED', `Mach ${this.n(entity.speed, 2)}`, entity.speed / maxSpeed * 100, `Top sustainable speed about Mach ${this.n(maxSpeed, 2)}`)}
        ${this.renderMetric('ALTITUDE', `${this.n(entity.altFt, 0)} ft`, (entity.altFt - 5000) / 60000 * 100, 'Flight band: 5,000–65,000 ft')}
        ${this.renderMetric('ENERGY', `${this.n((entity.energy || 0) * 100, 0)}%`, (entity.energy || 0) * 100, 'Energy helps the aircraft maneuver and evade')}
      </div>`);
      sections.push(this.renderTable('PILOT & TACTICAL STATUS', [
        ['Current action', activeManeuver], ['Pilot stress', `${this.n(entity.stress * 100, 0)}%${entity.glocTimer > 0 ? ' · temporarily blacked out' : ''}`],
        ['Combat record', `${entity.kills || 0} kills · ${entity.missilesEvadedCount || 0} missiles evaded`],
        ['Return to base', entity.isRTB ? 'Returning for rearm' : 'Not returning']
      ]));
      sections.push(this.renderStores(entity));
      sections.push(this.renderDisclosure('Aircraft design and sensor specifications', 'airframe-spec', this.renderTable('AIRFRAME', this.objectRows(entity.spec))));
      sections.push(this.renderDisclosure('Detailed live flight and pilot data', 'aircraft-state', this.renderTable('CURRENT FLIGHT STATE', this.objectRows(entity, new Set(['spec', 'gun', 'equippedWeapons', 'equippedUpgrades', 'weapon', 'source', 'target', 'trail'])))));
    } else if (entity.weapon && entity.target) {
      const range = Math.max(1, Number(entity.weapon.rangeKm) || 1);
      const traveled = Math.max(0, Number(entity.distanceTraveled) || 0);
      const distanceToTarget = Math.max(0, Number(entity.distanceToTarget) || 0);
      const rangeRemaining = Math.max(0, range - traveled);
      const launchEvent = this.events.find(event => event.instrumentId === entity.id && event.type === 'WEAPON LAUNCH');
      sections.push(`<p class="inspection-intro">This ${this.escape(entity.weapon.seeker || 'guided')} missile is ${this.escape(String(entity.state || 'in flight').replace(/_/g, ' ').toLowerCase())}. The missile is trying to reach ${this.escape(this.getName(entity.target))}; its seeker and the target’s actions affect the outcome.</p>`);
      sections.push(`<div class="inspection-metric-grid">${this.renderMetric('TARGET DISTANCE', `${this.n(distanceToTarget, 1)} km`, distanceToTarget / range * 100, distanceToTarget <= rangeRemaining ? 'Within estimated remaining range' : 'Target is beyond estimated remaining range', distanceToTarget > rangeRemaining ? 'warning' : '')}${this.renderMetric('FLIGHT RANGE USED', `${this.n(traveled, 1)} km`, traveled / range * 100, `About ${this.n(rangeRemaining, 1)} km of range remains`)}</div>`);
      sections.push(this.renderTable('WHO IS INVOLVED', [
        ['Fired by', this.getName(entity.source)], ['Target', this.getName(entity.target)],
        ['Seeker', entity.weapon.seeker || 'Unguided'],
        ['Launch estimate', launchEvent && launchEvent.details.estimatedLaunchPk !== null ? `${launchEvent.details.launchAssessment} · ${launchEvent.details.estimatedLaunchPk}% estimated hit chance` : 'No launch estimate saved']
      ]));
      sections.push(this.renderEnemyTargetVisibility(entity));
      sections.push(this.renderDisclosure('Missile flight and design data', 'missile-data', `${this.renderTable('LIVE FLIGHT', this.objectRows(entity, new Set(['weapon', 'source', 'target', 'trail'])))}${this.renderTable('WEAPON SPECIFICATION', this.objectRows(entity.weapon))}`));
    } else {
      const role = entity.desc || this.getKind(entity);
      sections.push(`<p class="inspection-intro">${this.escape(this.getName(entity))}: ${this.escape(role)}. The map position and current condition are shown below; expand the detail section for system values.</p>`);
      if (entity.hp !== undefined) {
        const maxHp = Math.max(1, Number(entity.maxHp || entity.hp) || 1);
        sections.push(`<div class="inspection-metric-grid">${this.renderMetric('CONDITION', `${this.n(entity.hp, 1)} / ${this.n(maxHp, 0)} HP`, entity.hp / maxHp * 100, entity.hp > 0 ? 'Still operational' : 'Destroyed', entity.hp / maxHp < 0.35 ? 'warning' : '')}</div>`);
      }
      sections.push(this.renderDisclosure('Detailed object data', 'object-data', this.renderTable('CURRENT STATE', this.objectRows(entity, new Set(['parentUnit'])))));
    }
    return sections.join('');
  }

  renderStores(aircraft) {
    const rows = [];
    rows.push(['Gun', aircraft.gun ? `${aircraft.gun.name || aircraft.gun.id} · ${aircraft.gunAmmo} rounds` : 'None']);
    rows.push(['Installed upgrades', (aircraft.equippedUpgrades || []).join(', ') || 'None']);
    (aircraft.equippedWeapons || []).forEach((item, index) => {
      const weapon = item.weapon || {};
      rows.push([`Store ${index + 1} · ${item.station || 'Station'}`, `${weapon.name || weapon.id || item.id} · ${item.ammo}/${item.maxAmmo} · ${weapon.seeker || weapon.category || 'Store'}`]);
    });
    return this.renderTable('GUN, WEAPONS & UPGRADES', rows);
  }

  renderRadarTab() {
    const target = this.selectedEntity;
    if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') return this.emptyState('No radar target', 'Select an object with a position to inspect its radar picture.');
    const isMissile = Boolean(target.weapon && target.target);
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const enemyTeam = commanderTeam === 'friendly' ? 'hostile' : 'friendly';
    const sensorTeam = enemyTeam;
    const sensors = (sensorTeam === 'friendly' ? (this.game.alliedAircraft || []) : (this.game.hostileAircraft || []))
      .filter(sensor => sensor && sensor.id !== target.id && sensor.hp > 0);
    const records = sensors.map(sensor => this.getRadarRecord(sensor, target))
      .filter(record => record.rangeKm > 0 || record.baseRangeKm > 0)
      .sort((a, b) => Number(b.detects) - Number(a.detects)
        || (a.detects ? a.distanceKm - b.distanceKm : (a.distanceKm - a.rangeKm) - (b.distanceKm - b.rangeKm)));
    const rcs = Number(target.effectiveRcs !== undefined ? target.effectiveRcs : (target.rcs !== undefined ? target.rcs : (target.spec && target.spec.sigma_0))) || 0;
    const designRcs = target.spec ? Number(target.spec.sigma_0 || 1.0) : Number(target.rcs !== undefined ? target.rcs : rcs);
    const rcsBar = Math.max(0, Math.min(100, ((Math.log10(Math.max(0.0001, rcs)) + 4) / 6) * 100));
    const enemyDetectedSet = enemyTeam === 'friendly' ? this.game.detectedByBlue : this.game.detectedByRed;
    const enemyHasRadarContact = Boolean(enemyDetectedSet && enemyDetectedSet.has(target.id));
    const enemyHasIdentifiedTarget = typeof target.isIdentifiedBy === 'function'
      ? target.isIdentifiedBy(enemyTeam)
      : (enemyTeam === 'friendly' ? target.identifiedByBlue : target.identifiedByRed);
    const trackRows = [
      [isMissile ? 'Enemy aircraft contact on missile' : 'Enemy aircraft contact', enemyHasRadarContact ? 'Yes · current contact' : 'No current contact'],
      ['Enemy identification', enemyHasIdentifiedTarget ? 'Identified' : 'Not identified']
    ];
    const renderSensorRecord = record => {
      const rangeWidth = Math.min(100, record.rangeKm / 150 * 100);
      const distanceMark = Math.min(100, record.distanceKm / 150 * 100);
      const reading = record.detects
        ? `${this.getName(record.sensor)} can currently see this target: it is ${this.n(record.distanceKm, 1)} km away, inside a ${this.n(record.rangeKm, 1)} km range.`
        : (record.rangeKm <= 0
          ? `${this.getName(record.sensor)} cannot see this target from its current radar direction.`
          : `Out of range of ${this.getName(record.sensor)}: target is ${this.n(Math.max(0, record.distanceKm - record.rangeKm), 1)} km beyond its ${this.n(record.rangeKm, 1)} km range.`);
      return `<div class="inspection-sensor-row">
        <div class="inspection-sensor-meta"><b>${this.escape(this.getName(record.sensor))}</b><span>${this.escape(record.sensor.team || 'neutral')} · ${record.detects ? 'CAN SEE TARGET' : 'CANNOT SEE TARGET'}</span></div>
        <div class="inspection-range-track"><span class="inspection-range-fill ${record.detects ? 'detecting' : ''}" style="width:${rangeWidth}%"></span><i class="inspection-distance-marker" style="left:${distanceMark}%"></i></div>
        <p class="inspection-range-reading ${record.detects ? 'detecting' : ''}">${this.escape(reading)}</p>
        <details data-inspection-key="sensor-${this.getEntityId(record.sensor)}"><summary>Show why and how</summary>${this.renderTable('RADAR SETTINGS & RANGE FACTORS', record.factors)}</details>
      </div>`;
    };
    const primaryRecords = records.slice(0, 4);
    const additionalRecords = records.slice(4);
    const chart = records.length
      ? `${primaryRecords.map(renderSensorRecord).join('')}${additionalRecords.length ? `<details class="inspection-disclosure" data-inspection-key="all-sensors"><summary>Show ${additionalRecords.length} more sensors</summary><div class="inspection-disclosure-body">${additionalRecords.map(renderSensorRecord).join('')}</div></details>` : ''}`
      : '<p class="inspection-muted">No active radar or sensor envelopes apply to this object.</p>';
    return `${isMissile ? this.renderEnemyTargetVisibility(target) : ''}${this.renderTable(isMissile ? 'MISSILE SIGNATURE & ENEMY TRACK' : 'TARGET SIGNATURE & TRACK', [
      ['Design radar cross section', `${this.n(designRcs, 3)} m²`],
      ['Current effective RCS', `${this.n(rcs, 5)} m²`],
      ...trackRows
    ])}
    <section class="inspection-card">
      <h3>${isMissile ? 'WHO CAN SEE THIS MISSILE?' : 'WHO CAN SEE THIS TARGET?'} <span class="inspection-muted">(${records.filter(record => record.detects).length} in range)</span></h3>
      <p class="inspection-muted">Each bar shows sensor reach; the gold marker shows distance. ${isMissile ? 'Only enemy aircraft are shown.' : 'Only enemy aircraft are shown; if the marker is inside the bar, the target is in range.'}</p>
      <div class="inspection-range-legend"><span>Sensor range</span><span class="inspection-legend-distance">${isMissile ? 'Missile distance' : 'Target distance'}</span><span>Map scale: 150 km</span></div>
      <div class="inspection-rcs-bar"><span>RADAR RETURN</span><div><i style="width:${rcsBar}%"></i></div><b>${rcs < 0.1 ? 'Hard to see' : (rcs < 3 ? 'Typical' : 'Easy to see')}</b></div>
      ${chart}
    </section>
    ${target.equippedWeapons ? this.renderDisclosure('Why this aircraft reflects radar', 'signature-detail', this.renderTable('SIGNATURE FACTORS', this.getSignatureFactors(target))) : ''}`;
  }

  renderEnemyTargetVisibility(missile) {
    const intendedTarget = missile && missile.target;
    if (!intendedTarget) return '';
    const enemyTeam = missile.team === 'friendly' ? 'hostile' : 'friendly';
    const detected = enemyTeam === 'friendly' ? this.game.detectedByBlue : this.game.detectedByRed;
    const currentRadarContact = Boolean(detected && detected.has(intendedTarget.id));
    const identified = typeof intendedTarget.isIdentifiedBy === 'function'
      ? intendedTarget.isIdentifiedBy(enemyTeam)
      : (enemyTeam === 'friendly' ? intendedTarget.identifiedByBlue : intendedTarget.identifiedByRed);
    const ownedByEnemy = intendedTarget.team === enemyTeam;
    const status = currentRadarContact
      ? 'YES · CURRENT RADAR CONTACT'
      : ownedByEnemy
        ? 'YES · FRIENDLY AIRCRAFT TO THAT SIDE'
        : identified
          ? 'TRACK KNOWN · NOT CURRENTLY DETECTED'
          : 'NO · NO CURRENT RADAR CONTACT';
    const explanation = currentRadarContact
      ? `${enemyTeam.toUpperCase()} sensors currently detect ${this.getName(intendedTarget)}.`
      : ownedByEnemy
        ? `${this.getName(intendedTarget)} belongs to the opposing force, so that force knows where it is.`
        : identified
          ? `The opposing force has identified ${this.getName(intendedTarget)} before, but no sensor currently has a live contact.`
          : `No opposing sensor currently has a radar contact on ${this.getName(intendedTarget)}.`;
    return `<section class="inspection-card inspection-visibility-card">
      <h3>CAN THE ENEMY SEE THIS MISSILE’S TARGET?</h3>
      <strong class="inspection-visibility-status ${currentRadarContact || ownedByEnemy ? 'visible' : identified ? 'known' : 'hidden-contact'}">${this.escape(status)}</strong>
      <p>${this.escape(explanation)}</p>
    </section>`;
  }

  getRadarRecord(sensor, target) {
    const baseRangeKm = sensor.spec ? (sensor.spec.R_0 || 75) : (sensor.rangeKm || 48);
    let aspectMultiplier = 1;
    let targetAspect = 'nose / unknown';
    if (typeof target.heading === 'number') {
      let angle = Math.abs(target.heading - Math.atan2(sensor.y - target.y, sensor.x - target.x));
      while (angle > Math.PI) angle = Math.abs(angle - Math.PI * 2);
      targetAspect = `${this.n(angle * 180 / Math.PI, 1)}° off nose`;
      if (angle >= 1.0 && angle <= 2.1) {
        let spike = target.spec && target.spec.beamSpike !== undefined ? target.spec.beamSpike : 3.2;
        if (target.beamSpikeReduction) spike = 1 + (spike - 1) * (1 - target.beamSpikeReduction);
        aspectMultiplier = spike;
      } else if (angle > 2.1) aspectMultiplier = 1.8;
    }
    const baseRcs = Number(target.effectiveRcs !== undefined ? target.effectiveRcs : (target.rcs !== undefined ? target.rcs : 1));
    const aspectRcs = Math.max(0.0001, baseRcs * aspectMultiplier);
    let expectedRange = baseRangeKm * Math.pow(aspectRcs, 0.25);
    const factors = [['Radar reference range', `${this.n(baseRangeKm, 1)} km`], ['Target aspect', `${targetAspect} · ×${this.n(aspectMultiplier, 2)} RCS`], ['Aspect-adjusted RCS', `${this.n(aspectRcs, 5)} m²`], ['RCS range law', `${this.n(baseRangeKm, 1)} × RCS⁰·²⁵ = ${this.n(expectedRange, 1)} km`]];
    const jamImpact = Number(target.jamEfficiency || 0) * 0.35;
    if (jamImpact > 0) {
      const eccmFactor = sensor.hasECCM ? (1 - (sensor.eccmBonus || 0.60)) : 1;
      const aesafactor = sensor.hasGaNAESA ? 0.5 : 1;
      const rangeFactor = 1 - jamImpact * eccmFactor * aesafactor;
      factors.push(['Target self-protection jamming', `${this.n(target.jamEfficiency * 100, 0)}% pod efficiency · ${this.n((1 - rangeFactor) * 100, 1)}% range loss`]);
      expectedRange *= rangeFactor;
    }
    const jammers = (this.game.surfaceUnits || []).filter(unit => unit.hp > 0 && unit.team !== sensor.team && unit.isJammerStation && Math.hypot(unit.x - target.x, unit.y - target.y) <= unit.rangeKm);
    if (jammers.length) {
      const rangeLoss = 0.30 * (sensor.hasECCM ? (1 - (sensor.eccmBonus || 0.60)) : 1);
      expectedRange *= (1 - rangeLoss);
      factors.push(['Electronic jamming', `${jammers.length > 1 ? 'Multiple hostile jammers' : 'Hostile jammer support'} · ${this.n(rangeLoss * 100, 1)}% range loss`]);
    }
    const targetAlt = target.alt !== undefined ? target.alt : 0;
    const sensorAlt = sensor.alt !== undefined ? sensor.alt : 0.5;
    if (targetAlt < 0.20 && sensorAlt > 0.40) {
      const lookDown = 0.70 + (sensor.spec && sensor.spec.lookDownBonus ? sensor.spec.lookDownBonus : 0.20);
      expectedRange *= lookDown;
      factors.push(['Look-down attenuation', `×${this.n(lookDown, 2)} at low target altitude`]);
    }
    const clouds = (this.game.simulation && this.game.simulation.weatherClouds) || [];
    const cloud = clouds.find(item => item.containsPoint(target.x, target.y) || item.containsPoint(sensor.x, sensor.y));
    if (cloud) {
      const attenuation = (window.CONFIG && window.CONFIG.CLOUD_RADAR_ATTENUATION) || 0.50;
      expectedRange *= (1 - attenuation);
      factors.push(['Cloud attenuation', `×${this.n(1 - attenuation, 2)} · cloud intersects sensor or target`]);
    }
    const distanceKm = Math.hypot(target.x - sensor.x, target.y - sensor.y);
    const rangeKm = typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(sensor, target, clouds) : expectedRange;
    factors.push(['Current range result', `${this.n(rangeKm, 2)} km · ${distanceKm <= rangeKm ? 'target inside envelope' : 'target outside envelope'}`]);
    if (sensor.heading !== undefined && sensor.spec && sensor.spec.radarConeDeg < 360) {
      let sensorAngle = Math.abs(sensor.heading - Math.atan2(target.y - sensor.y, target.x - sensor.x));
      while (sensorAngle > Math.PI) sensorAngle = Math.abs(sensorAngle - Math.PI * 2);
      factors.push(['Radar scan cone', `${this.n(sensor.spec.radarConeDeg, 0)}° · target ${sensorAngle <= sensor.spec.radarConeDeg * Math.PI / 360 ? 'inside' : 'outside'} current beam`]);
    }
    return { sensor, rangeKm, baseRangeKm, distanceKm, detects: rangeKm > 0 && distanceKm <= rangeKm, factors };
  }

  getSignatureFactors(target) {
    const base = target.spec ? Number(target.spec.sigma_0 || 1.0) : Number(target.effectiveRcs || target.rcs || 0);
    const current = Number(target.effectiveRcs !== undefined ? target.effectiveRcs : target.rcs || base);
    const rows = [['Design RCS', `${this.n(base, 5)} m²`], ['Current effective RCS', `${this.n(current, 5)} m²`]];
    if (target.equippedWeapons) {
      let storeContribution = 0;
      for (const item of target.equippedWeapons) {
        if (!item || !item.weapon || item.ammo <= 0) continue;
        const weapon = item.weapon;
        const station = item.station || (weapon.slotType === 'CENTERLINE' ? 'CENTERLINE' : (weapon.slotType === 'INTERNAL' && target.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL'));
        if (station === 'CENTERLINE') storeContribution += Number(weapon.sigmaPylon || 0.50);
        else if (station !== 'INTERNAL') storeContribution += Number(weapon.sigmaPylon || 0.05);
      }
      const leadFactor = target.isFlightLead && target.spec && target.spec.category === 'STEALTH' ? 0.65 : 1;
      const ramFactor = target.equippedUpgrades && target.equippedUpgrades.includes('RAM_NANO_COATING') ? 0.55 : 1;
      rows.push(['Mounted store contribution', `${this.n(storeContribution, 5)} m²`]);
      rows.push(['Effective RCS calculation', `max(0.00005, ${this.n(base, 5)} × lead ${this.n(leadFactor, 2)} × RAM ${this.n(ramFactor, 2)} + ${this.n(storeContribution, 5)}) = ${this.n(current, 5)} m²`]);
      rows.push(['Engine / heat state', `${this.n((target.engineAlpha || 0) * 100, 0)}% throttle${target.thermalBloomTimer > 0 ? ` · IR thermal bloom ${this.n(target.thermalBloom, 2)}×` : ''} · affects IR seeker context, not this RCS calculation`]);
      rows.push(['Beam aspect shaping', `${this.n((target.beamSpikeReduction || 0) * 100, 0)}% beam-spike reduction`]);
    }
    return rows;
  }

  getIdentificationState(target) {
    const cfg = window.CONFIG || {};
    const stealth = target.spec && (target.spec.sigma_0 <= 0.01 || target.spec.category === 'STEALTH');
    const baseRequired = cfg.RADAR_IDENTIFY_BASE_SEC || 5.5;
    const inTargetCloud = (this.game.simulation.weatherClouds || []).some(cloud => cloud.containsPoint(target.x, target.y));
    const explainSide = side => {
      const identified = side === 'friendly' ? target.identifiedByBlue : target.identifiedByRed;
      const duration = Number(side === 'friendly' ? target.trackDurationBlue : target.trackDurationRed) || 0;
      if (identified) return { progress: 'Identified', cause: 'Already identified by this side' };
      if (this.game.playerMode === '2P') return { progress: 'Not tracked yet', cause: 'Opposing aircraft are mutually revealed in two-player mode' };
      if (target.team === side || target.identifiedByBlue && target.identifiedByRed) return { progress: 'Friendly / shared track', cause: 'This side has direct identification' };

      const sensors = side === 'friendly'
        ? [...(this.game.alliedAircraft || []).filter(unit => unit.hp > 0), ...(this.game.surfaceUnits || []).filter(unit => unit.team === side && unit.hp > 0)]
        : [...(this.game.hostileAircraft || []).filter(unit => unit.hp > 0), ...(this.game.surfaceUnits || []).filter(unit => unit.team === side && unit.hp > 0)];
      let direct = false;
      let highestRate = 0;
      let burnThrough = false;
      let bestSensor = null;
      let nearest = Infinity;
      for (const sensor of sensors) {
        const distance = Math.hypot(target.x - sensor.x, target.y - sensor.y);
        nearest = Math.min(nearest, distance);
        if (target.isCivilian) {
          const maxRange = Physics.getRadarMaxDetectionRange(sensor, target, this.game.simulation.weatherClouds);
          if (maxRange > 0 && distance <= maxRange) {
            direct = true;
            let rate = Math.max(0.20, 1.0 - (distance / Math.max(maxRange, 100.0)));
            if (sensor.hasGaNAESA) rate *= 1.4;
            if (sensor.hasIRST && distance <= 32.0) rate *= 1.5;
            if (rate > highestRate) { highestRate = rate; bestSensor = sensor; }
          }
          continue;
        }
        if (side === 'friendly') {
          const maxRange = Physics.getRadarMaxDetectionRange(sensor, target, this.game.simulation.weatherClouds);
          if (maxRange <= 0 || distance > maxRange) continue;
          direct = true;
          const irOptical = sensor.hasIRST && distance <= (inTargetCloud ? 12 : 28);
          if (distance <= 18 || irOptical) burnThrough = true;
          if (distance <= maxRange * 0.85) {
            let rate = (sensor.radarIdentifySpeed || 1) * Math.max(0.25, 1 - distance / maxRange);
            if (inTargetCloud) rate *= 0.60;
            if (rate > highestRate) { highestRate = rate; bestSensor = sensor; }
          }
        } else if (Physics.canRadarDetect(sensor, target, this.game.simulation.weatherClouds)) {
          direct = true;
          highestRate = 1;
          bestSensor = sensor;
        }
      }

      if (target.isCivilian) {
        const enemySide = target.x > 75.0;
        const required = side === 'friendly'
          ? (nearest > 95 || (enemySide && nearest > 65) ? 20 : (nearest > 65 || enemySide ? 14 : (nearest > 35 ? 8.5 : 4.5)))
          : ((nearest < 50 || target.x > 75) ? 5 : 14);
        const rate = side === 'friendly' ? Math.max(0.25, highestRate) : 1;
        const eta = direct ? Math.max(0, (required - duration) / rate) : null;
        return {
          progress: `${this.n(duration, 1)} / ${this.n(required, 1)} sec${direct ? ` · ${this.n(duration / required * 100, 0)}%` : ''}`,
          cause: direct ? `${this.getName(bestSensor)} · track rate ×${this.n(rate, 2)} · about ${this.n(eta, 1)} sec remaining` : `No current direct track · nearest sensor ${this.n(nearest, 1)} km away`
        };
      }

      const required = side === 'friendly' ? baseRequired * (stealth ? (cfg.STEALTH_IDENTIFY_PENALTY_MULT || 2) : 1) : baseRequired;
      const rate = burnThrough ? 3 : highestRate;
      const eta = direct && rate > 0 ? Math.max(0, (required - duration) / rate) : null;
      let cause = direct
        ? `${this.getName(bestSensor)} · progress ×${this.n(rate, 2)}${burnThrough ? ' · burn-through' : ''} · about ${this.n(eta, 1)} sec remaining`
        : `Outside every live sensor envelope · nearest sensor ${this.n(nearest, 1)} km away`;
      if (inTargetCloud && direct) cause += ' · cloud reduces track rate';
      const liveHostileCount = (this.game.hostileAircraft || []).filter(unit => unit.hp > 0).length;
      const uplink = side === 'friendly' && liveHostileCount > 0 && liveHostileCount <= (cfg.UPLINK_THRESHOLD_FIGHTERS !== undefined ? cfg.UPLINK_THRESHOLD_FIGHTERS : 3);
      if (uplink) cause = `Satellite uplink pins the remaining ${liveHostileCount} hostile contact(s)`;
      return {
        progress: `${this.n(duration, 1)} / ${this.n(required, 1)} sec${direct ? ` · ${this.n(duration / required * 100, 0)}%` : ''}`,
        cause
      };
    };
    const blue = explainSide('friendly');
    const red = explainSide('hostile');
    return { blue: blue.progress, blueCause: blue.cause, red: red.progress, redCause: red.cause };
  }

  renderEngagementTab() {
    const entity = this.selectedEntity;
    if (!entity) return this.emptyState('No object selected', 'Select an aircraft or weapon to inspect engagement calculations.');
    if (entity.weapon && entity.target) return this.renderMissileEngagement(entity);
    if (entity.spec) return this.renderAircraftEngagement(entity);
    const incoming = (this.game.missiles || []).filter(missile => missile.active && missile.target && missile.target.id === entity.id);
    if (!incoming.length) return this.emptyState('No current engagement', 'No active missile is tracking this object. Its live movement, health, and system data are in Overview and All Data.');
    return `<section class="inspection-card"><h3>INBOUND WEAPONS</h3>${incoming.map(missile => this.renderMissileSummary(missile)).join('')}</section>`;
  }

  renderProbabilityCard(percent, factors, detailRows, context = 'If fired now', detailKey = context) {
    const chance = Math.max(0, Math.min(100, Number(percent) || 0));
    const level = chance >= 70 ? 'high' : (chance >= 45 ? 'medium' : 'low');
    const helps = [];
    const hurts = [];
    const positive = (value) => Number(value) > 0.005;
    if (positive(factors.salvoBonus)) helps.push('Other missiles arriving together improve support.');
    if (factors.mixedSeekers || positive(factors.mixedSeekerBonus)) helps.push('Different seeker types make it harder for the target to fool every missile.');
    if (positive(factors.afterburnerBonus) || positive(factors.afterburnerHeatBonus)) helps.push('The target is running hot, helping heat-seeking weapons.');
    if (positive(factors.heavyBonus) || positive(factors.heavyTargetBonus)) helps.push('The target’s size makes it easier to hit.');
    if (positive(factors.energyBleedBonus) || positive(factors.targetEnergyBonus)) helps.push('The target has spent energy and has less ability to evade.');
    if (positive(factors.pkBonus)) helps.push('Shooter equipment is improving the weapon solution.');
    if (positive(factors.effectiveDefenseEstimate) || positive(factors.effectiveDefense) || positive(factors.activeEvasion) || positive(factors.combinedActiveEvasion)) hurts.push('The target can dodge or distract the seeker.');
    if (positive(factors.weatherPenalty) || positive(factors.opticalWeatherPenalty)) hurts.push('Clouds interfere with the seeker.');
    if (positive(factors.jammerPenalty)) hurts.push('Jamming is weakening the weapon solution.');
    if (positive(factors.shooterStressPenalty)) hurts.push('Shooter stress makes accurate firing harder.');
    if (positive(factors.offBoresightPenalty)) hurts.push('The target is far from the shooter’s nose.');
    if (positive(factors.excessiveTurnPenalty)) hurts.push('The missile has lost energy while turning.');
    if (positive(factors.agilityPenalty) || positive(factors.agilityDefenseBonus)) hurts.push('The target’s agility reduces its chance of being hit.');
    if (positive(factors.turnEfficiencyPenalty)) hurts.push('The target is near its best turning speed.');
    if (Object.prototype.hasOwnProperty.call(factors, 'rangeScore') && Number(factors.rangeScore) <= 0) hurts.push('The target is outside the weapon’s effective range.');
    else if (Number(factors.rangeScore) > 0 && Number(factors.rangeScore) < 0.75) hurts.push('The target is near the edge of the useful weapon range.');
    const caption = chance >= 70
      ? 'A strong shot, but a hit is never guaranteed.'
      : (chance >= 45 ? 'A fair shot: target defenses and timing still matter.' : 'An uncertain shot: check what is working against it before firing.');
    const causes = `<div class="inspection-cause-grid"><div class="inspection-cause helps"><b>Helps this shot</b><br>${this.escape(helps.join(' ') || 'No strong advantage is active right now.')}</div><div class="inspection-cause hurts"><b>Makes this shot harder</b><br>${this.escape(hurts.join(' ') || 'No strong disadvantage is active right now.')}</div></div>`;
    return `<section class="inspection-probability-card ${level}"><div class="inspection-probability-head"><b>${this.escape(context)}</b><strong class="inspection-probability-value">${this.n(chance, 0)}%</strong></div><div class="inspection-probability-bar" role="img" aria-label="Estimated chance to hit: ${this.n(chance, 0)} percent"><i style="width:${chance}%"></i></div><p class="inspection-probability-caption">${this.escape(caption)} In 100 similar situations, about ${this.n(chance, 0)} would hit.</p>${causes}<details data-inspection-key="chance-${this.escape(detailKey)}"><summary>Show the numbers behind this estimate</summary>${this.renderTable('DETAILED CALCULATION', detailRows)}</details></section>`;
  }

  renderMissileEngagement(missile) {
    const solution = missile.target && typeof MissileKinetics !== 'undefined'
      ? MissileKinetics.explainHitProbability(missile, missile.target, this.game.simulation.weatherClouds, this.inboundCount(missile.target))
      : null;
    if (!solution) return this.emptyState('No impact solution', 'The target or missile calculation is not available.');
    const factors = solution.factors;
    const rows = [
      ['Final chance after limits', `${this.n(solution.probability * 100, 1)}%`], ['Before limits', `${this.n(solution.rawProbability * 100, 1)}%`],
      ['Allowed range', `${this.n(solution.probabilityFloor * 100, 0)}% to ${this.n(solution.probabilityCeiling * 100, 0)}%`],
      ['Weapon starting chance', `${this.n(factors.baseHitProbability * 100, 1)}%`], ['Target angle effect', `${this.n(factors.aspectScore * 100, 0)}% at ${this.n(factors.aspectDifferenceRad * 180 / Math.PI, 1)}°`],
      ['Active dodge', `${this.n(factors.combinedActiveEvasion * 100, 1)}%`], ['Pilot / aircraft defense', `${this.n(factors.passiveEvasionBaseline * 100, 1)}%`],
      ['Defense after seeker response', `${this.n(factors.effectiveDefense * 100, 1)}%`], ['Group salvo support', `${this.n(factors.salvoBonus * 100, 1)}%`],
      ['Mixed seeker bonus', factors.mixedSeekers ? `${this.n(factors.mixedSeekerBonus * 100, 1)}% and less effective defense` : 'None'],
      ['Cloud penalty', `${this.n(factors.opticalWeatherPenalty * 100, 1)}%`], ['Heat bonus', `${this.n(factors.afterburnerHeatBonus * 100, 1)}%`],
      ['Target size bonus', `${this.n(factors.heavyTargetBonus * 100, 1)}%`], ['Target low-energy bonus', `${this.n(factors.targetEnergyBonus * 100, 1)}%`],
      ['Agility adjustment', `${this.n(factors.agilityPenalty * 100, 1)}%`], ['Best-turn adjustment', `${this.n(factors.turnEfficiencyPenalty * 100, 1)}%`],
      ['Missile turn-energy loss', `${this.n(factors.excessiveTurnPenalty * 100, 1)}%`]
    ];
    const lastOutcome = this.events.slice().reverse().find(event => event.instrumentId === missile.id && (event.type === 'MISSILE HIT' || event.type === 'MISSILE MISS' || event.type === 'MISSILE LOST'));
    const rangeRemaining = Math.max(0, (missile.weapon.rangeKm || 0) - (missile.distanceTraveled || 0));
    const rangeStatus = missile.distanceToTarget <= rangeRemaining
      ? `The target is within roughly ${this.n(rangeRemaining, 1)} km of the missile’s remaining range.`
      : `The missile has about ${this.n(rangeRemaining, 1)} km of range left; the target is ${this.n(missile.distanceToTarget - rangeRemaining, 1)} km farther away.`;
    return `<p class="inspection-intro">${this.escape(missile.weapon.name || missile.weapon.id)} is pursuing ${this.escape(this.getName(missile.target))}. ${this.escape(rangeStatus)} The target’s movement and defenses change the chance until impact.</p>${this.renderProbabilityCard(solution.probability * 100, factors, rows, 'Current chance this missile will hit', missile.id)}${this.renderTable('WHAT IS HAPPENING NOW', [
      ['Pursuit phase', `${missile.stage || '—'} · ${missile.state || '—'}`], ['Missile speed', `${this.n(missile.speed, 2)} Mach`],
      ['Target action', missile.target.activeManeuverId ? missile.target.activeManeuverId.replace(/_/g, ' ').toLowerCase() : 'No special maneuver'],
      ['Countermeasures', missile.target.cmTimer > 0 ? `Active for ${this.n(missile.target.cmTimer, 1)} more sec` : 'No chaff active'],
      ['Target energy', `${this.n((missile.target.energy || 0) * 100, 0)}%`]
    ])}${lastOutcome ? this.renderDisclosure('What happened to this missile', 'missile-outcome', this.renderTable('RECORDED IMPACT / LOSS', this.objectRows(lastOutcome.details))) : '<p class="inspection-muted">The exact impact roll and result appear here after the missile reaches its target.</p>'}`;
  }

  renderAircraftEngagement(aircraft) {
    const target = this.getEngagementTarget(aircraft);
    const incoming = (this.game.missiles || []).filter(missile => missile.active && missile.target && missile.target.id === aircraft.id);
    const rows = incoming.map(missile => this.renderMissileSummary(missile)).join('');
    if (!target) return `${this.renderTable('INCOMING THREATS', [['Active missiles', incoming.length]])}${rows}<p class="inspection-muted">No opposing aircraft is available to estimate a launch solution.</p>`;
    const solutions = (aircraft.equippedWeapons || []).map((item, index) => {
      const weapon = item.weapon;
      if (!weapon || item.ammo <= 0) return '';
      const result = Physics.calcPk(weapon, aircraft, target, this.game.simulation.weatherClouds);
      const breakdown = result.breakdown || {};
      const detailRows = [...this.objectRows(breakdown), ['Game assessment', result.desc || result.label]];
      const factors = { ...breakdown, hasMixedSeekers: result.hasMixedSeekers, pkBonus: aircraft.pkBonus || 0 };
      return `<section class="inspection-card"><h3>${this.escape(weapon.name || weapon.id)} · ${this.escape(weapon.seeker || weapon.category || 'weapon')}</h3><p class="inspection-muted">${this.n(item.ammo, 0)} left in this store · range ${this.n(weapon.rangeKm, 1)} km · damage ${this.n(weapon.damagePerBurst || weapon.damage || 0, 1)}</p>${this.renderProbabilityCard(result.pk, factors, detailRows, 'Estimated chance if fired now', `${aircraft.id}-${index}-${weapon.id}`)}</section>`;
    }).filter(Boolean).join('');
    const gunSolution = aircraft.gun ? Physics.calcPk(aircraft.gun, aircraft, target, this.game.simulation.weatherClouds) : null;
    const rangeKm = Math.hypot(target.x - aircraft.x, target.y - aircraft.y);
    return `<p class="inspection-intro">Your target is ${this.escape(this.getName(target))}, ${this.n(rangeKm, 1)} km away. These are estimates for firing now. Choose a weapon in the controls beside the map or below it on a phone to launch it.</p>
    ${gunSolution ? `<section class="inspection-card"><h3>${this.escape(aircraft.gun.name || aircraft.gun.id || 'GUN')}</h3>${this.renderProbabilityCard(gunSolution.pk, { ...(gunSolution.breakdown || {}), pkBonus: aircraft.pkBonus || 0 }, [...this.objectRows(gunSolution.breakdown || {}), ['Game assessment', gunSolution.desc || gunSolution.label]], 'Estimated chance if firing a burst', `${aircraft.id}-gun`)}</section>` : ''}
    ${solutions || '<p class="inspection-muted">No loaded weapons with ammunition.</p>'}
    <p class="inspection-muted">An estimate is not a promise. A missile’s chance can change after launch as it turns and the target reacts.</p>
    ${incoming.length ? `<section class="inspection-card"><h3>MISSILES COMING TOWARD THIS AIRCRAFT</h3>${rows}</section>` : ''}`;
  }

  renderMissileSummary(missile) {
    const model = missile.target && typeof MissileKinetics !== 'undefined'
      ? MissileKinetics.explainHitProbability(missile, missile.target, this.game.simulation.weatherClouds, this.inboundCount(missile.target)) : null;
    const chance = model ? Math.round(model.probability * 100) : 0;
    return `<div class="inspection-inbound"><b>${this.escape(missile.weapon.name || missile.weapon.id)}</b><span>From ${this.escape(this.getName(missile.source))} · ${this.n(missile.distanceToTarget, 1)} km away · ${this.escape(missile.stage || 'in flight')}</span><div class="inspection-meter ${chance < 35 ? 'warning' : ''}"><i style="width:${chance}%"></i></div><strong>${model ? `About ${chance} in 100 chance to hit` : 'Chance unavailable'}</strong></div>`;
  }

  inboundCount(target) {
    return Math.max(1, (this.game.missiles || []).filter(missile => (missile.active || (this.selectedEntity && missile.id === this.selectedEntity.id)) && missile.target && missile.target.id === target.id).length);
  }

  getEngagementTarget(aircraft) {
    const selected = this.game.selectedTarget;
    if (selected && selected.id !== aircraft.id && selected.hp > 0) return selected;
    const opposing = aircraft.team === 'hostile' ? (this.game.alliedAircraft || []) : (this.game.hostileAircraft || []);
    return opposing.filter(unit => unit.hp > 0).sort((a, b) =>
      Math.hypot(a.x - aircraft.x, a.y - aircraft.y) - Math.hypot(b.x - aircraft.x, b.y - aircraft.y)
    )[0] || null;
  }

  explainEvent(event) {
    const details = event.details || {};
    if (event.type === 'MISSILE HIT' || event.type === 'MISSILE MISS') {
      const chance = Number(details.hitProbability || 0);
      const roll = Number(details.impactRoll || 0);
      if (event.type === 'MISSILE HIT') return `The missile hit. Its impact roll (${this.n(roll, 3)}) was within the ${this.n(chance * 100, 1)}% hit chance. The target had ${this.n(details.targetHpBefore, 1)} HP before impact; this weapon could deal about ${this.n(details.expectedDamageAfterReduction, 1)} HP after reductions.`;
      return `The missile missed. Its impact roll (${this.n(roll, 3)}) was above the ${this.n(chance * 100, 1)}% hit chance. A maneuver, seeker limits, range, or weather may have reduced the chance; open the recorded calculation below to see which ones applied.`;
    }
    if (event.type === 'MISSILE LOST') {
      const reason = String(details.reason || event.title).toUpperCase();
      if (reason.includes('NOTCH')) return 'The target turned across the missile’s radar view and confused its tracking gate.';
      if (reason.includes('CHAFF')) return 'The missile followed chaff instead of the aircraft.';
      if (reason.includes('CLOUD')) return 'Cloud blocked the missile’s optical or heat-seeking view for too long.';
      if (reason.includes('OVERSHOOT')) return 'The missile could not turn tightly enough and passed the target.';
      if (reason.includes('EXHAUST')) return 'The missile reached the end of its flight range or usable energy.';
      if (reason.includes('TARGET DESTROYED')) return 'The target was destroyed before this missile could reach it.';
      if (reason.includes('COBRA')) return 'The target slowed sharply and the missile flew past it.';
      if (reason.includes('SPLIT-S') || reason.includes('PERCH')) return 'The target changed altitude and direction to make the missile spend its energy.';
      return `The missile lost its target because of ${String(details.reason || 'a guidance problem').replace(/_/g, ' ').toLowerCase()}.`;
    }
    if (event.type === 'WEAPON LAUNCH') return `The weapon was fired by ${event.sourceName} at ${event.targetName}. The launch estimate was ${details.estimatedLaunchPk === null || details.estimatedLaunchPk === undefined ? 'unavailable' : `${details.estimatedLaunchPk}%`}; the missile’s actual chance can change while it flies.`;
    if (event.type === 'DAMAGE') return `${event.sourceName} dealt ${this.n(details.damage, 1)} damage to ${event.targetName}${details.remainingHp === undefined ? '' : `, leaving ${this.n(details.remainingHp, 1)} health`}.`;
    if (event.type === 'GUN POD MISS' || event.type === 'DIRECTED ENERGY MISS') return `${event.title}. ${details.reason || 'No impact was recorded.'}${details.rangeKm === null || details.rangeKm === undefined ? '' : ` The target was ${this.n(details.rangeKm, 1)} km away.`}`;
    if (event.type === 'GUN BURST') return `${event.sourceName} fired at ${event.targetName} from ${this.n(details.rangeKm, 1)} km. The burst dealt ${this.n(details.finalDamage, 2)} damage; ${this.n(details.ammunitionRemaining, 0)} gun rounds remain.`;
    if (event.type === 'CIWS INTERCEPT') return `${event.sourceName} destroyed an incoming missile ${this.n(details.interceptionRangeKm, 1)} km away. Its defense radius is ${this.n(details.maximumDefenseRadiusKm, 1)} km.`;
    if (event.type === 'COUNTERMEASURE') return `Chaff was released. It can confuse radar-guided missiles briefly; ${this.n(details.remainingChaff, 0)} countermeasures remain.`;
    if (event.type === 'MANEUVER ORDER') return `${event.title}. This action costs ${this.n(details.tokenCost, 2)} command tokens and changes the aircraft’s speed, energy, or ability to evade.`;
    if (event.type === 'FLIGHT ACTION') return `${event.title}. The aircraft traded altitude and speed to change its energy and position.`;
    if (event.type === 'DECOY HIT') return 'The missile’s seeker followed a decoy instead of the aircraft.';
    if (event.type === 'FALSE CONTACT') return 'The missile followed a false radar contact; no real aircraft was hit.';
    if (event.type === 'SCORE CHANGE') return `${event.title}. This changed the ${details.team || 'team'} score by ${this.n(details.points, 0)} points.`;
    return event.title;
  }

  renderTraceTab() {
    if (!this.focusedEvent) return `<section class="inspection-card"><h3>WHAT HAPPENED?</h3><p>Choose an event below. Each event explains the result in plain language; the exact game values are available underneath it.</p></section>${this.renderEventsInline()}`;
    const event = this.focusedEvent;
    const sections = [this.renderTable(`${event.time} · ${event.type}`, [['What happened', this.explainEvent(event)], ['Source', event.sourceName], ['Target', event.targetName], ['Weapon / instrument', event.instrumentName || '—']])];
    const detailTables = [this.renderTable('RECORDED DECISION / OUTCOME VALUES', this.objectRows(event.details))];
    (event.snapshots || []).forEach((snapshot, index) => {
      detailTables.push(this.renderTable(`OBJECT ${index + 1} · ${snapshot.name}`, this.objectRows(snapshot.state || {})));
      if (snapshot.spec) detailTables.push(this.renderTable(`${snapshot.name} · AIRFRAME`, this.objectRows(snapshot.spec)));
      if (snapshot.weapon) detailTables.push(this.renderTable(`${snapshot.name} · WEAPON`, this.objectRows(snapshot.weapon)));
    });
    sections.push(this.renderDisclosure('Show the recorded values and object snapshots', `event-${event.id}`, detailTables.join('')));
    return sections.join('');
  }

  renderEventsInline() {
    return `<section class="inspection-card"><h3>EVENT TRACE</h3>${this.events.length ? this.events.slice(-20).reverse().map(event => `<button type="button" class="inspection-trace-row" data-inspection-event="${this.escape(event.id)}"><span>[${this.escape(event.time)}] ${this.escape(event.type)}</span><b>${this.escape(event.title)}</b></button>`).join('') : '<p class="inspection-muted">No events recorded yet.</p>'}</section>`;
  }

  renderRawTab() {
    const entity = this.selectedEntity;
    if (!entity) return this.emptyState('No object selected', 'Choose an object to inspect its complete state.');
    const skip = new Set(['spec', 'weapon', 'source', 'target', 'parentUnit', 'trail', 'equippedWeapons', 'equippedUpgrades', 'gun']);
    const sections = [this.renderTable('ALL CURRENT OBJECT FIELDS', this.objectRows(entity, skip, true))];
    if (entity.spec) sections.push(this.renderTable('COMPLETE AIRFRAME SPECIFICATION', this.objectRows(entity.spec, new Set(), true)));
    if (entity.weapon) sections.push(this.renderTable('COMPLETE WEAPON SPECIFICATION', this.objectRows(entity.weapon, new Set(), true)));
    if (entity.gun) sections.push(this.renderTable('GUN SPECIFICATION', this.objectRows(entity.gun, new Set(), true)));
    if (entity.equippedWeapons) entity.equippedWeapons.forEach((item, i) => sections.push(this.renderTable(`STORE ${i + 1} · ${item.station || 'PYLON'}`, this.objectRows(item.weapon || item, new Set(), true))));
    if (entity.trail) sections.push(this.renderTable('RECORDED FLIGHT PATH', entity.trail.slice(0, 32).map((point, index) => [`Trail point ${index + 1}`, `${this.n(point.x, 2)} km E · ${this.n(point.y, 2)} km N`])));
    return sections.join('');
  }

  renderEvents() {
    const list = document.getElementById('inspection-event-list');
    const count = document.getElementById('inspection-event-count');
    if (!list) return;
    const scrollTop = list.scrollTop;
    if (count) count.textContent = `${this.events.length} EVENT${this.events.length === 1 ? '' : 'S'}`;
    const recent = this.events.slice(-14).reverse();
    list.innerHTML = recent.length ? recent.map(event => `<button type="button" class="inspection-event-row ${this.focusedEvent && event.id === this.focusedEvent.id ? 'focused' : ''}" data-inspection-event="${this.escape(event.id)}"><span>${this.escape(event.time)} · ${this.escape(event.type)}</span><b>${this.escape(event.title)}</b></button>`).join('') : '<p class="inspection-muted">Waiting for mission events…</p>';
    list.querySelectorAll('[data-inspection-event]').forEach(button => button.onclick = () => {
      this.focusEvent(button.dataset.inspectionEvent);
    });
    list.scrollTop = scrollTop;
  }

  focusEvent(eventId) {
    this.focusedEvent = this.events.find(event => event.id === eventId) || null;
    this.activeTab = 'TRACE';
    this.render();
  }

  objectRows(object, skip = new Set(), includeArrays = false) {
    return Object.entries(object || {}).filter(([key, value]) => {
      if (skip.has(key) || typeof value === 'function') return false;
      return value === null || ['string', 'number', 'boolean'].includes(typeof value) || (includeArrays && Array.isArray(value)) || (includeArrays && value && typeof value === 'object');
    }).map(([key, value]) => [this.prettyKey(key), this.formatValue(key, value)]);
  }

  formatValue(key, value) {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      if (/heading/i.test(key)) return `${this.n(value, 3)} rad · ${this.n(value * 180 / Math.PI, 1)}°`;
      if (/alpha|bonus|efficiency|prob|ratio|multiplier|reduction/i.test(key) && value >= 0 && value <= 1) return `${this.n(value * 100, 1)}% (${this.n(value, 3)})`;
      return this.n(value, 5);
    }
    if (Array.isArray(value)) return value.map(item => typeof item === 'object' ? JSON.stringify(this.toPlain(item)) : String(item)).join(', ') || 'None';
    if (typeof value === 'object') return JSON.stringify(this.toPlain(value));
    return String(value);
  }

  renderTable(title, rows) {
    const validRows = (rows || []).filter(row => row && row.length >= 2);
    if (!validRows.length) return '';
    return `<section class="inspection-card"><h3>${this.escape(title)}</h3><dl>${validRows.map(([label, value]) => `<div><dt>${this.escape(label)}</dt><dd>${this.escape(value)}</dd></div>`).join('')}</dl></section>`;
  }

  emptyState(title, text) {
    return `<section class="inspection-empty"><b>${this.escape(title)}</b><span>${this.escape(text)}</span></section>`;
  }

  prettyKey(key) { return String(key).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, char => char.toUpperCase()); }
  n(value, digits = 2) { const number = Number(value); return Number.isFinite(number) ? number.toFixed(digits) : '—'; }
  escape(value) { return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
}

window.InspectionModeController = InspectionModeController;
