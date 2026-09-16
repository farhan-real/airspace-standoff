/**
 * APEX VECTOR // Simulation System Orchestrator (150km x 100km Theater)
 * - Ground targets are always visible and identified
 * - All aircraft are always visible on radar (at least as BOGEY [?])
 * - Full match data saved persistently
 * - 3.5s missile and target track hold memory prevents radar flickering/popping
 */

class SimulationSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.scoring = new SimulationScoring(gameEngine);
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
    this.initGhostContacts();
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
    if (multiplier === 0) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.timeWarp = multiplier;
    }
    const btns = document.querySelectorAll('.time-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (this.isPaused) {
      const pBtn = document.getElementById('btn-time-pause');
      if (pBtn) pBtn.classList.add('active');
    } else {
      const aBtn = document.getElementById(`btn-time-${this.timeWarp}x`);
      if (aBtn) aBtn.classList.add('active');
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.setTimeWarp(this.timeWarp || 1);
      const pModal = document.getElementById('pause-modal');
      if (pModal) pModal.classList.remove('active');
    } else {
      this.setTimeWarp(0);
      const pModal = document.getElementById('pause-modal');
      if (pModal) pModal.classList.add('active');
    }
  }

  initWeatherClouds() {
    const count = (window.CONFIG && window.CONFIG.CLOUD_COUNT) || 3;
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;

    for (let i = 0; i < count; i++) {
      const cx = 30 + Math.random() * (w - 60);
      const cy = 20 + Math.random() * (h - 40);
      const rx = 16 + Math.random() * 16;
      const ry = 12 + Math.random() * 14;
      const vx = (Math.random() * 0.6 - 0.3);
      const vy = (Math.random() * 0.4 - 0.2);
      this.weatherClouds.push(new WeatherCloud(cx, cy, rx, ry, vx, vy));
    }
  }

  initGhostContacts() {
    this.ghostContacts = [];
    // Start with 1 subtle ghost contact rather than cluttering the screen
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const gx = (w - 25.0) - Math.random() * 20.0;
    const gy = 20.0 + Math.random() * (h - 40.0);
    const gHeading = Math.PI + (Math.random() * 0.3 - 0.15);
    const gSpeed = 0.85;
    const gAlt = 28000;
    this.ghostContacts.push(new GhostContact(gx, gy, gHeading, gSpeed, gAlt));
  }

  spawnCivilianFlight() {
    const pool = window.CIVILIAN_FLIGHTS || [{ code: 'CIV-401', name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 }];
    const data = pool[Math.floor(Math.random() * pool.length)];
    const fromLeft = Math.random() < 0.5;
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const startX = fromLeft ? -5 : (w + 5);
    const startY = 20 + Math.random() * (h - 40);
    const heading = fromLeft ? 0.05 : (Math.PI - 0.05);
    this.civilianTraffic.push(new CivilianAirliner(data, startX, startY, heading));
  }

  step(realDt) {
    if (this.isPaused || this.game.isGameOver) return;
    const dt = realDt * this.timeWarp;

    const clockEl = document.getElementById('mission-clock');
    if (clockEl) clockEl.textContent = this.getElapsedTimeString();

    for (const c of this.weatherClouds) c.update(dt);

    this.civilianSpawnTimer += dt;
    if (this.civilianSpawnTimer >= 40.0 && this.civilianTraffic.length < 2) {
      this.civilianSpawnTimer = 0.0;
      this.spawnCivilianFlight();
    }
    for (const civ of this.civilianTraffic) civ.update(dt);
    this.civilianTraffic = this.civilianTraffic.filter(c => c.hp > 0);

    // Reduced ghost clutter spawn frequency (90s interval, max 1 ghost) to prevent rapid popping
    this.ghostSpawnTimer += dt;
    if (this.ghostSpawnTimer >= 90.0 && this.ghostContacts.length < 1) {
      this.ghostSpawnTimer = 0.0;
      const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
      const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
      const gx = (w - 20.0) - Math.random() * 25.0;
      const gy = 18.0 + Math.random() * (h - 36.0);
      const gHeading = Math.PI + (Math.random() * 0.3 - 0.15);
      const gSpeed = 0.85;
      const gAlt = 26000;
      this.ghostContacts.push(new GhostContact(gx, gy, gHeading, gSpeed, gAlt));
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
        const wCraftRed = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'hostile', mapW, mapH, this.game.aiDifficulty);
        this.game.hostileAircraft.push(...wCraftRed);
        const wCraftBlue = FleetGenerator.generateDynamicSquadronWave(this.currentWave, 'friendly', mapW, mapH, this.game.aiDifficulty);
        this.game.alliedAircraft.push(...wCraftBlue);
        this.logScoreEvent('friendly', 0, 'REINFORCEMENTS: Wave ' + this.currentWave + ' entered theater');
      }
    }

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

    this.updateTeamSensorTracks(dt);

    for (const ally of this.game.alliedAircraft) {
      const incoming = this.game.missiles.filter(m => m.active && m.target && m.target.id === ally.id);
      ally.update(dt, incoming);
      ally.updateAutomaticGun(dt, this.game.hostileAircraft, this.game.radar);
    }

    for (const hostile of this.game.hostileAircraft) {
      const incoming = this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
      hostile.update(dt, incoming);
      hostile.updateAutomaticGun(dt, this.game.alliedAircraft, this.game.radar);
    }

    const hostileRadarAlive = this.game.surfaceUnits.some(s => s.type === 'RADAR_ARRAY' && s.team === 'hostile' && s.hp > 0);
    const friendlyRadarAlive = this.game.surfaceUnits.some(s => s.type === 'RADAR_ARRAY' && s.team === 'friendly' && s.hp > 0);

    for (const surf of this.game.surfaceUnits) {
      if (surf.team === 'hostile') {
        surf.update(dt, this.game.alliedAircraft, this.game.missiles, this.game.missiles, hostileRadarAlive);
      } else {
        surf.update(dt, this.game.hostileAircraft, this.game.missiles, this.game.missiles, friendlyRadarAlive);
      }
    }

    for (const m of this.game.missiles) m.update(dt, this.weatherClouds);
    this.game.missiles = this.game.missiles.filter(m => !m.isDead);

    if (this.game.activeUnit && this.game.activeUnit.hp <= 0) {
      const activeRoster = (this.game.currentPvpCommander === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;
      const nextLive = activeRoster.find(a => a.hp > 0);
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

    if (this.game.ai && typeof this.game.ai.update === 'function') this.game.ai.update(dt);
    if (this.game.avionics && typeof this.game.avionics.updateRWRState === 'function') this.game.avionics.updateRWRState();

    this.checkWinConditions();
  }

  updateTeamSensorTracks(dt) {
    const cfg = window.CONFIG || {};
    const baseAirIdTime = cfg.RADAR_IDENTIFY_BASE_SEC || 6.0;
    const baseMslIdTime = cfg.MISSILE_IDENTIFY_BASE_SEC || 3.5;
    const stealthMult = cfg.STEALTH_IDENTIFY_PENALTY_MULT || 2.0;
    // Updated satellite radar uplink threshold to 3
    const uplinkThreshold = cfg.UPLINK_THRESHOLD_FIGHTERS !== undefined ? cfg.UPLINK_THRESHOLD_FIGHTERS : 3;

    const blueSensors = this.game.alliedAircraft.filter(a => a.hp > 0).concat(
      this.game.surfaceUnits.filter(s => s.team === 'friendly' && s.hp > 0)
    );

    this.game.detectedByBlue = new Set();

    // RULE: All hostile aircraft are permanently present on radar at least as BOGEY tracks
    for (const h of this.game.hostileAircraft) {
      if (h.hp <= 0) continue;
      this.game.detectedByBlue.add(h.id);

      let inSensorRange = false;
      let highestProgressRate = 0.0;
      let isImmediateBurnThrough = false;

      let inClouds = false;
      if (this.weatherClouds) {
        for (const c of this.weatherClouds) {
          if (c.containsPoint(h.x, h.y)) { inClouds = true; break; }
        }
      }

      for (const sensor of blueSensors) {
        const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.weatherClouds);
        if (maxDist <= 0.0) continue;
        const dist = Math.hypot(h.x - sensor.x, h.y - sensor.y);

        if (dist <= maxDist) {
          inSensorRange = true;
          const irstOpticalVisual = sensor.hasIRST && (dist <= (inClouds ? 12.0 : 28.0));
          if (dist <= 18.0 || irstOpticalVisual) isImmediateBurnThrough = true;

          if (dist <= maxDist * 0.85) {
            const rangeFactor = Math.max(0.25, 1.0 - (dist / maxDist));
            let rate = (sensor.radarIdentifySpeed || 1.0) * rangeFactor;
            if (inClouds) rate *= 0.60;
            if (rate > highestProgressRate) highestProgressRate = rate;
          }
        }
      }

      if (inSensorRange) {
        if (!h.firstDetectedTime) h.firstDetectedTime = this.getElapsedTimeString();
        const isStealth = (h.spec && (h.spec.sigma_0 <= 0.01 || h.spec.category === 'STEALTH'));
        const requiredTime = isStealth ? (baseAirIdTime * stealthMult) : baseAirIdTime;

        if (isImmediateBurnThrough) h.trackDurationBlue += dt * 3.0;
        else h.trackDurationBlue += dt * highestProgressRate;

        if (h.trackDurationBlue >= requiredTime || (isImmediateBurnThrough && h.trackDurationBlue >= 1.5)) {
          h.identifiedByBlue = true;
          h.isIdentified = true;
        }
      } else {
        h.trackDurationBlue = Math.max(0.0, h.trackDurationBlue - dt * 0.2);
      }
    }

    // SATELLITE RADAR UPLINK (<= 3 hostiles remain)
    const liveHostiles = this.game.hostileAircraft.filter(h => h.hp > 0);
    if (liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold) {
      for (const h of liveHostiles) {
        this.game.detectedByBlue.add(h.id);
        h.trackDurationBlue = Math.max(h.trackDurationBlue || 0, 10.0);
        h.identifiedByBlue = true;
        h.isIdentified = true;
      }
      if (!this._satelliteUplinkAnnouncedBlue) {
        this._satelliteUplinkAnnouncedBlue = true;
        if (this.game.radar) {
          this.game.radar.spawnCombatText(liveHostiles[0].x, liveHostiles[0].y, `SATELLITE UPLINK ACTIVE // ${liveHostiles.length} TARGETS PINPOINTED`, '#00f0ff');
        }
        this.logScoreEvent('friendly', 0, `SATELLITE UPLINK: ${liveHostiles.length} target(s) remaining — continuous radar broadcast active`);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      }
    } else if (liveHostiles.length > uplinkThreshold) {
      this._satelliteUplinkAnnouncedBlue = false;
    }

    // Ghost clutter reflections: calm classification without rapid popping
    for (const ghost of this.ghostContacts) {
      if (ghost.hp <= 0 || ghost.isDissolved) continue;
      this.game.detectedByBlue.add(ghost.id);
      ghost.trackDurationBlue += dt * 0.3;
      if (ghost.trackDurationBlue >= (baseAirIdTime * 1.5)) {
        ghost.identifiedByBlue = true;
        ghost.triggerDissolve('RESOLVED: ATMOSPHERIC CLUTTER');
      }
    }

    for (const decoy of this.decoyDrones) {
      if (decoy.hp <= 0) continue;
      this.game.detectedByBlue.add(decoy.id);
      if (decoy.team === 'friendly') decoy.identifiedByBlue = true;
    }

    // Missile tracking with 3.5s hysteresis track-hold to eliminate radar popping/flicker
    for (const m of this.game.missiles) {
      if (!m.active || m.team !== 'hostile') continue;
      let detected = false;
      for (const sensor of blueSensors) {
        const maxDist = Physics.getRadarMaxDetectionRange(sensor, m, this.weatherClouds);
        if (maxDist <= 0.0) continue;
        if (Math.hypot(m.x - sensor.x, m.y - sensor.y) <= maxDist) { detected = true; break; }
      }

      if (detected) {
        m.trackHoldBlue = 3.5;
        m.trackDurationBlue = (m.trackDurationBlue || 0.0) + dt;
        if (m.trackDurationBlue >= baseMslIdTime) m.identifiedByBlue = true;
      } else if (m.trackHoldBlue && m.trackHoldBlue > 0) {
        m.trackHoldBlue -= dt;
      }

      if (detected || (m.trackHoldBlue && m.trackHoldBlue > 0)) {
        this.game.detectedByBlue.add(m.id);
      }
    }

    // Surface Units ALWAYS detected and fully identified
    for (const s of this.game.surfaceUnits) {
      this.game.detectedByBlue.add(s.id);
      s.identifiedByBlue = true;
    }

    for (const civ of this.civilianTraffic) {
      if (civ.hp <= 0) continue;
      this.game.detectedByBlue.add(civ.id);
      civ.trackDuration = (civ.trackDuration || 0) + dt;
      if (civ.trackDuration >= 3.5) civ.identifiedByBlue = true;
    }

    // Red team sensors
    this.game.detectedByRed = new Set();
    const redSensors = this.game.hostileAircraft.filter(a => a.hp > 0).concat(
      this.game.surfaceUnits.filter(s => s.team === 'hostile' && s.hp > 0)
    );

    for (const a of this.game.alliedAircraft) {
      if (a.hp <= 0) continue;
      this.game.detectedByRed.add(a.id);
      let inRedSensor = false;
      for (const sensor of redSensors) {
        if (Physics.canRadarDetect(sensor, a, this.weatherClouds)) { inRedSensor = true; break; }
      }
      if (inRedSensor) {
        a.trackDurationRed = (a.trackDurationRed || 0) + dt;
        if (a.trackDurationRed >= baseAirIdTime) a.identifiedByRed = true;
      }
    }

    for (const s of this.game.surfaceUnits) {
      this.game.detectedByRed.add(s.id);
      s.identifiedByRed = true;
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

    const winThreshold = (window.CONFIG && window.CONFIG.VP_WIN_THRESHOLD) || 1600;

    if (this.game.vpAlly >= winThreshold || allHostilesDead || hostileBunkerDestroyed) {
      this.game.triggerGameOver(true, hostileBunkerDestroyed ? 'HOSTILE COMMAND BUNKER DESTROYED' : 'BLUE FORCES SECURED AIR SUPERIORITY');
    } else if (this.game.vpHostile >= winThreshold || allAlliesDead || friendlyBunkerDestroyed) {
      this.game.triggerGameOver(false, friendlyBunkerDestroyed ? 'FRIENDLY COMMAND BUNKER DESTROYED' : 'ALL ALLIED AIR ASSETS NEUTRALIZED');
    }
  }
}

window.SimulationSystem = SimulationSystem;