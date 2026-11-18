/**
 * AIRSPACE STANDOFF: Simulation System Orchestrator
 * Real-time time warp, weather cloud generation, combat physics loop, and Attack mode updates.
 */

class SimulationSystem {
  constructor(gameEngine) {
    if (!gameEngine) throw new Error('SimulationSystem requires gameEngine instance.');
    this.game = gameEngine;
    this.scoring = new SimulationScoring(gameEngine);
    this.detection = new SimulationDetectionSystem(this);
    this.timeWarp = 1;
    this.isPaused = false;
    this.weatherClouds = [];
    this.civilianTraffic = [];
    this.cloudCoverage = 'RANDOM';
    this.civilianTrafficEnabled = true;
    this.ghostContacts = [];
    this.decoyDrones = [];
    this.civilianSpawnTimer = 0.0;
    this.waveSpawnTimer = 0.0;
    this.ghostSpawnTimer = 0.0;
    this.currentWave = 1;
    this.elapsedTimeSec = 0;
    this.replaySnapshots = [];
    this.replayCaptureAccumulator = 0;
    this.fleetStrengthHistory = [];
    this.fleetStrengthTimer = 0;
    this._satelliteUplinkAnnouncedBlue = false;
    this.victoryDelayTimer = 0.0;
    this.pendingGameOver = null;
    this.initWeatherClouds();
  }

  get scoreLog() { return this.scoring.scoreLog; }
  set scoreLog(v) { this.scoring.scoreLog = v; }
  get timelineEvents() { return this.scoring.timelineEvents; }
  set timelineEvents(v) { this.scoring.timelineEvents = v; }

  logScoreEvent(team, pts, reason) { this.scoring.logScoreEvent(team, pts, reason); }
  recordKillEvent(team, tgt, src, details) { this.scoring.recordKillEvent(team, tgt, src, details); }
  recordCivilianHit(team, civ, src, wpn) { this.scoring.recordCivilianHit(team, civ, src, wpn); }
  recordCivilianShootdown(team, civ, src, wpn) { this.scoring.recordCivilianShootdown(team, civ, src, wpn); }
  getElapsedTimeString() { return this.scoring.getElapsedTimeString(); }

  sampleFleetStrength() {
    let bVal = 0, rVal = 0;
    for (const a of (this.game.alliedAircraft || [])) {
      if (a.hp > 0.05) bVal += (a.totalProcurementCost || 20) * (a.hp / Math.max(1, a.maxHp || 4));
    }
    for (const h of (this.game.hostileAircraft || [])) {
      if (h.hp > 0.05) rVal += (h.totalProcurementCost || 20) * (h.hp / Math.max(1, h.maxHp || 4));
    }
    if (this.game.scenarioMode === 'ATTACK') {
      for (const s of (this.game.surfaceUnits || [])) {
        if (!s || s.team !== 'hostile' || s.hp <= 0.05 || s.isIndestructible || s.isGroundDecoy) continue;
        const unitWorth = Math.max(8, (s.vpValue || 200) / 14);
        rVal += unitWorth * (s.hp / Math.max(1, s.maxHp || 6));
        if (s.isAircraftParking && Array.isArray(s.parkedAircraft) && s.parkedAircraft.length > 0) {
          rVal += s.parkedAircraft.length * 14;
        }
      }
    }
    this.fleetStrengthHistory.push({
      time: Number(this.elapsedTimeSec.toFixed(1)),
      blueCost: Number(bVal.toFixed(1)),
      redCost: Number(rVal.toFixed(1))
    });
    if (this.fleetStrengthHistory.length > 350) this.fleetStrengthHistory.shift();
  }

  resetReplay() {
    this.elapsedTimeSec = 0;
    this.replaySnapshots = [];
    this.replayCaptureAccumulator = 0;
    this.fleetStrengthHistory = [];
    this.fleetStrengthTimer = 0;
    this.victoryDelayTimer = 0.0;
    this.pendingGameOver = null;
    this.sampleFleetStrength();
  }

  captureReplayFrame(force = false) {
    if (typeof AfterActionReplayCodec === 'undefined') throw new Error('AfterActionReplayCodec is not loaded.');
    AfterActionReplayCodec.captureFrame(this, force);
  }

  setTimeWarp(multiplier) {
    this.isPaused = (multiplier === 0);
    if (!this.isPaused) this.timeWarp = multiplier;
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(this.isPaused ? 'btn-time-pause' : `btn-time-${this.timeWarp}x`);
    if (btn) btn.classList.add('active');
  }

  togglePause() {
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
      window.ModalDialogTemplates.ensure('pause-modal');
      if (this.game && this.game.controls && typeof this.game.controls.bindPauseModalEvents === 'function') {
        this.game.controls.bindPauseModalEvents();
      }
    }
    this.setTimeWarp(this.isPaused ? this.timeWarp : 0);
    const pModal = document.getElementById('pause-modal');
    if (pModal) pModal.classList.toggle('active', this.game.simulation.isPaused);
  }

  getAtmosphereSystem() {
    const sys = window.SimulationAtmosphereSystem;
    if (!sys) throw new Error('SimulationAtmosphereSystem is not loaded.');
    return sys;
  }

  initWeatherClouds() { this.weatherClouds = this.getAtmosphereSystem().createClouds(this.cloudCoverage); }

  initGhostContacts() {
    this.ghostContacts = [];
    const g = this.getAtmosphereSystem().createGhostContact(this.weatherClouds);
    if (g) this.ghostContacts.push(g);
  }

  spawnCivilianFlight() {
    if (!this.civilianTrafficEnabled) return;
    const flight = this.getAtmosphereSystem().createCivilianFlight();
    if (flight) this.civilianTraffic.push(flight);
  }

  step(realDt) {
    if (this.isPaused || this.game.isGameOver) return;
    const dt = realDt * this.timeWarp;
    this.elapsedTimeSec += dt;

    const clockEl = document.getElementById('mission-clock');
    if (clockEl) clockEl.textContent = this.getElapsedTimeString();

    for (const c of this.weatherClouds) c.update(dt);

    if (this.civilianTrafficEnabled) this.civilianSpawnTimer += dt;
    if (this.civilianTrafficEnabled && this.civilianSpawnTimer >= 45.0 && this.civilianTraffic.length < 2) {
      this.civilianSpawnTimer = 0.0;
      this.spawnCivilianFlight();
    }
    for (const civ of this.civilianTraffic) civ.update(dt);
    this.civilianTraffic = this.civilianTraffic.filter(c => c.hp > 0.05);

    this.ghostSpawnTimer += dt;
    if (this.ghostSpawnTimer >= 90.0 && this.ghostContacts.length < 1) {
      this.ghostSpawnTimer = 0.0;
      this.initGhostContacts();
    }
    for (const ghost of this.ghostContacts) ghost.update(dt);
    this.ghostContacts = this.ghostContacts.filter(g => !g.isDissolved && g.hp > 0.05);

    for (const decoy of this.decoyDrones) decoy.update(dt);
    this.decoyDrones = this.decoyDrones.filter(d => d.hp > 0.05);

    if (this.game.scenarioMode === 'DYNAMIC_THEATER' && this.game.playerMode !== '2P') {
      this.waveSpawnTimer += dt;
      if (this.waveSpawnTimer >= 80.0 && this.currentWave <= 3) {
        this.waveSpawnTimer = 0.0;
        this.currentWave++;
        const mapW = window.CONFIG.THEATER_WIDTH_KM;
        const mapH = window.CONFIG.THEATER_HEIGHT_KM;
        const redReinforcements = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'hostile', mapW, mapH, this.game.aiDifficulty, this.game.aiDoctrine);
        const blueReinforcements = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'friendly', mapW, mapH, this.game.aiDifficulty, this.game.aiDoctrine);
        const mission = this.game.activeMissionEditorConfig;
        if (mission && window.MissionEditor) {
          if (mission.redWeapons === 'RANDOM') window.MissionEditor.randomizeWeaponsForFleet(redReinforcements);
          if (mission.blueWeapons === 'RANDOM') window.MissionEditor.randomizeWeaponsForFleet(blueReinforcements);
          else if (mission.blueWeapons === 'STANDARD') blueReinforcements.forEach(unit => window.MissionEditor.applyStandardWeapons(unit, mission));
        }
        this.game.hostileAircraft.push(...redReinforcements);
        this.game.alliedAircraft.push(...blueReinforcements);
        SortieSpawner.ensureUniqueAircraftCallsigns(this.game);
        this.logScoreEvent('friendly', 0, `REINFORCEMENTS: Wave ${this.currentWave} entered theater`);
      }
    }

    if (this.game.scenarioMode === 'ATTACK') {
      if (typeof AttackDirector === 'undefined') throw new Error('AttackDirector is not loaded.');
      AttackDirector.update(this.game, dt);
    }

    if (typeof SimulationRules === 'undefined') throw new Error('SimulationRules is not loaded.');
    SimulationRules.updateCommandTokens(this, dt);
    this.detection.update(dt);

    const isAttackMode = (this.game.scenarioMode === 'ATTACK');
    const hostileSurfaceTargets = isAttackMode ? this.game.surfaceUnits.filter(s => s.team === 'hostile' && s.hp > 0.05) : null;

    for (const ally of this.game.alliedAircraft) {
      ally.update(dt, this.game.missiles.filter(m => m.active && m.target && m.target.id === ally.id));
      ally.updateAutomaticGun(dt, this.game.hostileAircraft, this.game.radar, hostileSurfaceTargets);
    }
    for (const hostile of this.game.hostileAircraft) {
      hostile.update(dt, this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id));
      hostile.updateAutomaticGun(dt, this.game.alliedAircraft, this.game.radar);
    }

    const hostileRadarAlive = this.game.surfaceUnits.some(s => (s.category === 'EW_RADAR' || s.type === 'RADAR_ARRAY') && s.team === 'hostile' && s.hp > 0.05 && s.emconTimer <= 0);
    const friendlyRadarAlive = this.game.surfaceUnits.some(s => (s.category === 'EW_RADAR' || s.type === 'RADAR_ARRAY') && s.team === 'friendly' && s.hp > 0.05 && s.emconTimer <= 0);
    for (const surf of this.game.surfaceUnits) {
      const isRed = (surf.team === 'hostile');
      surf.update(dt, isRed ? this.game.alliedAircraft : this.game.hostileAircraft, this.game.missiles, this.game.missiles, isRed ? hostileRadarAlive : friendlyRadarAlive);
    }

    for (const m of this.game.missiles) m.update(dt, this.weatherClouds);
    this.game.missiles = this.game.missiles.filter(m => !m.isDead);

    SimulationRules.resolveUnitFocus(this);
    this.game.ai.update(dt);
    this.game.avionics.updateRWRState();

    this.replayCaptureAccumulator += dt;
    if (this.replayCaptureAccumulator >= 0.40) {
      this.replayCaptureAccumulator %= 0.40;
      this.captureReplayFrame();
    }

    this.fleetStrengthTimer += dt;
    if (this.fleetStrengthTimer >= 0.50) {
      this.fleetStrengthTimer %= 0.50;
      this.sampleFleetStrength();
    }

    SimulationRules.checkWinConditions(this, dt);
  }
}

window.SimulationSystem = SimulationSystem;
