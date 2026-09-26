/**
 * AIRSPACE STANDOFF: Simulation System Orchestrator (150km x 100km Theater)
 * Real-time time warp, weather cloud generation, combat physics loop, victory evaluations.
 */

class SimulationSystem {
  constructor(gameEngine) {
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
    this._satelliteUplinkAnnouncedBlue = false;
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

  resetReplay() {
    this.elapsedTimeSec = 0;
    this.replaySnapshots = [];
    this.replayCaptureAccumulator = 0;
  }

  captureReplayFrame(force = false) {
    if (typeof AfterActionReplayCodec !== 'undefined') {
      AfterActionReplayCodec.captureFrame(this, force);
    }
  }

  setTimeWarp(multiplier) {
    this.isPaused = (multiplier === 0);
    if (!this.isPaused) this.timeWarp = multiplier;
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(this.isPaused ? 'btn-time-pause' : `btn-time-${this.timeWarp}x`);
    if (btn) btn.classList.add('active');
  }

  togglePause() {
    this.setTimeWarp(this.isPaused ? (this.timeWarp || 1) : 0);
    const pModal = document.getElementById('pause-modal');
    if (pModal) pModal.classList.toggle('active', this.isPaused);
  }

  initWeatherClouds() {
    if (typeof SimulationTrafficSystem !== 'undefined') {
      this.weatherClouds = SimulationTrafficSystem.createClouds(this.cloudCoverage);
    }
  }

  initGhostContacts() {
    this.ghostContacts = [];
    if (typeof SimulationTrafficSystem !== 'undefined') {
      const g = SimulationTrafficSystem.createGhostContact(this.weatherClouds);
      if (g) this.ghostContacts.push(g);
    }
  }

  spawnCivilianFlight() {
    if (!this.civilianTrafficEnabled) return;
    if (typeof SimulationTrafficSystem !== 'undefined') {
      this.civilianTraffic.push(SimulationTrafficSystem.createCivilianFlight());
    }
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
    this.civilianTraffic = this.civilianTraffic.filter(c => c.hp > 0);

    this.ghostSpawnTimer += dt;
    if (this.ghostSpawnTimer >= 90.0 && this.ghostContacts.length < 1) {
      this.ghostSpawnTimer = 0.0;
      this.initGhostContacts();
    }
    for (const ghost of this.ghostContacts) ghost.update(dt);
    this.ghostContacts = this.ghostContacts.filter(g => !g.isDissolved && g.hp > 0);

    for (const decoy of this.decoyDrones) decoy.update(dt);
    this.decoyDrones = this.decoyDrones.filter(d => d.hp > 0);

    if (this.game.scenarioMode === 'DYNAMIC_THEATER') {
      this.waveSpawnTimer += dt;
      if (this.waveSpawnTimer >= 80.0 && this.currentWave <= 3) {
        this.waveSpawnTimer = 0.0;
        this.currentWave++;
        const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
        const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
        const redReinforcements = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'hostile', mapW, mapH, this.game.aiDifficulty);
        const blueReinforcements = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'friendly', mapW, mapH, this.game.aiDifficulty);
        const mission = this.game.activeMissionEditorConfig;
        if (mission && window.MissionEditor) {
          if (mission.redWeapons === 'RANDOM') window.MissionEditor.randomizeWeaponsForFleet(redReinforcements);
          if (mission.blueWeapons === 'RANDOM') window.MissionEditor.randomizeWeaponsForFleet(blueReinforcements);
          else if (mission.blueWeapons === 'STANDARD') blueReinforcements.forEach(unit => window.MissionEditor.applyStandardWeapons(unit, mission));
        }
        this.game.hostileAircraft.push(...redReinforcements);
        this.game.alliedAircraft.push(...blueReinforcements);
        if (typeof SortieSpawner !== 'undefined') SortieSpawner.ensureUniqueAircraftCallsigns(this.game);
        this.logScoreEvent('friendly', 0, `REINFORCEMENTS: Wave ${this.currentWave} entered theater`);
      }
    }

    this.updateCommandTokens(dt);
    this.detection.update(dt);

    for (const ally of this.game.alliedAircraft) {
      ally.update(dt, this.game.missiles.filter(m => m.active && m.target && m.target.id === ally.id));
      ally.updateAutomaticGun(dt, this.game.hostileAircraft, this.game.radar);
    }
    for (const hostile of this.game.hostileAircraft) {
      hostile.update(dt, this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id));
      hostile.updateAutomaticGun(dt, this.game.alliedAircraft, this.game.radar);
    }

    const hostileRadarAlive = this.game.surfaceUnits.some(s => s.type === 'RADAR_ARRAY' && s.team === 'hostile' && s.hp > 0);
    const friendlyRadarAlive = this.game.surfaceUnits.some(s => s.type === 'RADAR_ARRAY' && s.team === 'friendly' && s.hp > 0);
    for (const surf of this.game.surfaceUnits) {
      const isRed = (surf.team === 'hostile');
      surf.update(dt, isRed ? this.game.alliedAircraft : this.game.hostileAircraft, this.game.missiles, this.game.missiles, isRed ? hostileRadarAlive : friendlyRadarAlive);
    }

    for (const m of this.game.missiles) m.update(dt, this.weatherClouds);
    this.game.missiles = this.game.missiles.filter(m => !m.isDead);

    this.resolveUnitFocus();
    if (this.game.ai && typeof this.game.ai.update === 'function') this.game.ai.update(dt);
    if (this.game.avionics && typeof this.game.avionics.updateRWRState === 'function') this.game.avionics.updateRWRState();
    this.replayCaptureAccumulator += dt;
    if (this.replayCaptureAccumulator >= 1.0) {
      this.replayCaptureAccumulator %= 1.0;
      this.captureReplayFrame();
    }
    this.checkWinConditions();
  }

  updateCommandTokens(dt) {
    const cfg = window.CONFIG || {};
    const baseRegen = cfg.TOKEN_BASE_REGEN || 2.50;
    const perAcRegen = cfg.TOKEN_PER_AIRCRAFT_REGEN || 0.25;
    const maxToken = cfg.TOKEN_MAX || 8.0;

    const liveAllies = this.game.alliedAircraft.filter(a => a.hp > 0);
    const allyDatalinkTotal = liveAllies.reduce((sum, a) => sum + (a.datalinkBonus || 0), 0);
    const regenBlue = baseRegen + perAcRegen * liveAllies.length + allyDatalinkTotal;
    this.game.tokenBucketBlue = Math.min(maxToken, this.game.tokenBucketBlue + regenBlue * dt);

    const liveHostiles = this.game.hostileAircraft.filter(a => a.hp > 0);
    const hostileDatalinkTotal = liveHostiles.reduce((sum, h) => sum + (h.datalinkBonus || 0), 0);
    const regenRed = baseRegen + perAcRegen * liveHostiles.length + hostileDatalinkTotal;
    this.game.tokenBucketRed = Math.min(maxToken, this.game.tokenBucketRed + regenRed * dt);

    const currentTokens = this.game.getCurrentCommanderTokenBucket();
    const currentRegen = (this.game.currentPvpCommander === 'friendly') ? regenBlue : regenRed;

    const tokenBar = document.getElementById('token-bar');
    const tokenVal = document.getElementById('token-value');
    const tokenRate = document.getElementById('token-regen-rate');
    if (tokenBar) tokenBar.style.width = Math.min(100, (currentTokens / maxToken) * 100) + '%';
    if (tokenVal) tokenVal.textContent = currentTokens.toFixed(1) + ' / ' + maxToken.toFixed(1);
    if (tokenRate) tokenRate.textContent = '+' + currentRegen.toFixed(1) + '/s';
  }

  resolveUnitFocus() {
    if (this.game.activeUnit && this.game.activeUnit.hp <= 0) {
      const roster = (this.game.currentPvpCommander === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;
      const nextLive = roster.find(a => a.hp > 0);
      if (nextLive) {
        this.game.activeUnit = nextLive;
        if (this.game.radar && this.game.radar.cam && this.game.radar.trackingUnit) {
          this.game.radar.cam.trackActiveCraft(nextLive);
        }
      }
    }
    if (this.game.selectedTarget && (this.game.selectedTarget.hp <= 0 || this.game.selectedTarget.isDissolved)) {
      this.game.selectedTarget = null;
      const targetInfo = document.getElementById('selected-target-info');
      if (targetInfo) targetInfo.textContent = 'TARGET: NONE';
    }
  }

  checkWinConditions() {
    const vpAllyEl = document.getElementById('vp-ally');
    const vpHostileEl = document.getElementById('vp-hostile');
    if (vpAllyEl) vpAllyEl.textContent = this.game.vpAlly;
    if (vpHostileEl) vpHostileEl.textContent = this.game.vpHostile;

    for (const h of this.game.hostileAircraft) {
      if (h && h.hp > 0 && h.hp <= 0.05) h.hp = 0;
    }
    for (const a of this.game.alliedAircraft) {
      if (a && a.hp > 0 && a.hp <= 0.05) a.hp = 0;
    }

    const allAlliesDead = this.game.alliedAircraft.length > 0 && this.game.alliedAircraft.every(a => a.hp <= 0);
    const allHostilesDead = this.game.hostileAircraft.length > 0 && this.game.hostileAircraft.every(h => h.hp <= 0);
    const hasUpcomingWaves = this.game.scenarioMode === 'DYNAMIC_THEATER' && this.currentWave <= 3;

    if (allHostilesDead && !hasUpcomingWaves) {
      const hostileBunkerDestroyed = this.game.surfaceUnits.some(s => s.type === 'BUNKER' && s.team === 'hostile' && s.hp <= 0);
      const winReason = hostileBunkerDestroyed
        ? 'ALL HOSTILE AIR ASSETS NEUTRALIZED & COMMAND BUNKER DESTROYED'
        : 'ALL HOSTILE AIR ASSETS NEUTRALIZED: AIR SUPERIORITY SECURED';
      this.game.triggerGameOver(true, winReason);
    } else if (allAlliesDead) {
      this.game.triggerGameOver(false, 'ALL ALLIED AIR ASSETS NEUTRALIZED');
    }
  }
}

window.SimulationSystem = SimulationSystem;