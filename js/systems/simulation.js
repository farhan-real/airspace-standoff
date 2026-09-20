/**
 * AIRSPACE STANDOFF // Simulation System Orchestrator (150km x 100km Theater)
 * Real-time time warp, weather cloud generation, combat physics loop, win evaluations.
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
    this.ghostContacts = [];
    this.decoyDrones = [];
    this.civilianSpawnTimer = 0.0;
    this.waveSpawnTimer = 0.0;
    this.ghostSpawnTimer = 0.0;
    this.currentWave = 1;
    this._satelliteUplinkAnnouncedBlue = false;
    this.initWeatherClouds();
  }

  get scoreLog() { return this.scoring.scoreLog; }
  set scoreLog(v) { this.scoring.scoreLog = v; }
  get timelineEvents() { return this.scoring.timelineEvents; }
  set timelineEvents(v) { this.scoring.timelineEvents = v; }

  logScoreEvent(team, pts, reason) { this.scoring.logScoreEvent(team, pts, reason); }
  recordKillEvent(team, tgt, src, details) { this.scoring.recordKillEvent(team, tgt, src, details); }
  recordCivilianShootdown(team, civ) { this.scoring.recordCivilianShootdown(team, civ); }
  getElapsedTimeString() { return this.scoring.getElapsedTimeString(); }

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
    this.weatherClouds = [];
    let s = (Date.now() ^ ((performance.now() * 1000) | 0)) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const count = rng() < 0.15 ? 2 : (rng() < 0.70 ? 3 : (rng() < 0.92 ? 4 : 5));
    const sizeProfiles = [{ rxMin: 25, rxMax: 32, ryMin: 16, ryMax: 22 }, { rxMin: 24, rxMax: 32, ryMin: 12, ryMax: 16 }, { rxMin: 18, rxMax: 25, ryMin: 13, ryMax: 18 }];
    const sectors = [
      { minX: 25, maxX: 65, minY: 18, maxY: 45 }, { minX: 85, maxX: 125, minY: 18, maxY: 45 },
      { minX: 55, maxX: 95, minY: 35, maxY: 65 }, { minX: 25, maxX: 65, minY: 55, maxY: 82 }, { minX: 85, maxX: 125, minY: 55, maxY: 82 }
    ].sort(() => rng() - 0.5);

    for (let i = 0; i < count; i++) {
      const sec = sectors[i % sectors.length];
      const p = sizeProfiles[i % sizeProfiles.length];
      const cx = sec.minX + rng() * (sec.maxX - sec.minX);
      const cy = sec.minY + rng() * (sec.maxY - sec.minY);
      const rx = p.rxMin + rng() * (p.rxMax - p.rxMin);
      const ry = p.ryMin + rng() * (p.ryMax - p.ryMin);
      const angle = rng() * Math.PI * 2;
      const spd = 0.15 + rng() * 0.25;
      this.weatherClouds.push(new WeatherCloud(cx, cy, rx, ry, Math.cos(angle) * spd, Math.sin(angle) * spd * 0.6));
    }
  }

  initGhostContacts() {
    this.ghostContacts = [];
    if (!this.weatherClouds || this.weatherClouds.length === 0) return;
    const targetCloud = this.weatherClouds[Math.floor(Math.random() * this.weatherClouds.length)];
    const gx = targetCloud.x + (Math.random() * targetCloud.rx * 0.8 - targetCloud.rx * 0.4);
    const gy = targetCloud.y + (Math.random() * targetCloud.ry * 0.8 - targetCloud.ry * 0.4);
    this.ghostContacts.push(new GhostContact(gx, gy, Math.PI + (Math.random() * 0.4 - 0.2), 0.80, 24000));
  }

  spawnCivilianFlight() {
    const pool = window.CIVILIAN_FLIGHTS || [{ code: 'CIV-401', name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 }];
    const data = pool[Math.floor(Math.random() * pool.length)];
    const fromLeft = Math.random() < 0.5;
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    this.civilianTraffic.push(new CivilianAirliner(data, fromLeft ? -5 : (w + 5), 20 + Math.random() * (h - 40), fromLeft ? 0.05 : (Math.PI - 0.05)));
  }

  step(realDt) {
    if (this.isPaused || this.game.isGameOver) return;
    const dt = realDt * this.timeWarp;

    const clockEl = document.getElementById('mission-clock');
    if (clockEl) clockEl.textContent = this.getElapsedTimeString();

    for (const c of this.weatherClouds) c.update(dt);

    this.civilianSpawnTimer += dt;
    if (this.civilianSpawnTimer >= 45.0 && this.civilianTraffic.length < 2) {
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
        this.game.hostileAircraft.push(...FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'hostile', mapW, mapH, this.game.aiDifficulty));
        this.game.alliedAircraft.push(...FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'friendly', mapW, mapH, this.game.aiDifficulty));
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
    const regenRed = baseRegen + perAcRegen * liveHostiles.length;
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

    const allAlliesDead = this.game.alliedAircraft.length > 0 && this.game.alliedAircraft.every(a => a.hp <= 0);
    const allHostilesDead = this.game.hostileAircraft.length > 0 && this.game.hostileAircraft.every(h => h.hp <= 0);
    const friendlyBunkerDestroyed = this.game.surfaceUnits.some(s => s.type === 'BUNKER' && s.team === 'friendly' && s.hp <= 0);
    const hostileBunkerDestroyed = this.game.surfaceUnits.some(s => s.type === 'BUNKER' && s.team === 'hostile' && s.hp <= 0);
    const winThreshold = (window.CONFIG && window.CONFIG.VP_WIN_THRESHOLD) || 3000;

    if (this.game.vpAlly >= winThreshold || allHostilesDead || hostileBunkerDestroyed) {
      this.game.triggerGameOver(true, hostileBunkerDestroyed ? 'HOSTILE COMMAND BUNKER DESTROYED' : 'BLUE FORCES SECURED AIR SUPERIORITY');
    } else if (this.game.vpHostile >= winThreshold || allAlliesDead || friendlyBunkerDestroyed) {
      this.game.triggerGameOver(false, friendlyBunkerDestroyed ? 'FRIENDLY COMMAND BUNKER DESTROYED' : 'ALL ALLIED AIR ASSETS NEUTRALIZED');
    }
  }
}

window.SimulationSystem = SimulationSystem;