/**
 * js/systems/simulation/detection.js - Radar detection, HTS emitter tracking, ground recon, and satellite reveal.
 */

class SimulationDetectionSystem {
  constructor(simulationSystem) {
    if (!simulationSystem || !simulationSystem.game) {
      throw new Error('SimulationDetectionSystem requires a valid SimulationSystem instance.');
    }
    this.sim = simulationSystem;
    this.game = simulationSystem.game;
    this.scanInterval = 0.10;
    this.scanTimer = 0.0;
  }

  update(dt) {
    const baseAirIdTime = window.CONFIG.RADAR_IDENTIFY_BASE_SEC;
    const baseMslIdTime = window.CONFIG.MISSILE_IDENTIFY_BASE_SEC;
    const stealthMult = window.CONFIG.STEALTH_IDENTIFY_PENALTY_MULT;
    const uplinkThreshold = window.CONFIG.UPLINK_THRESHOLD_FIGHTERS;

    this.scanTimer += dt;
    const runFullScan = (this.scanTimer >= this.scanInterval);
    if (runFullScan) this.scanTimer = 0.0;

    const is2P = (this.game.playerMode === '2P');
    if (is2P) {
      this.revealMutuallyAllCombatants();
      return;
    }

    this.game.detectedByBlue = new Set();
    this.game.detectedByRed = new Set();

    const blueSensors = this.game.alliedAircraft.filter(a => a.hp > 0.05).concat(
      this.game.surfaceUnits.filter(s => s.team === 'friendly' && s.hp > 0)
    );

    const liveHostiles = this.game.hostileAircraft.filter(h => h.hp > 0.05);
    const isAttackMode = (this.game.scenarioMode === 'ATTACK');
    const isUplinkActive = !isAttackMode && (liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold);

    for (let i = 0; i < this.game.hostileAircraft.length; i++) {
      const h = this.game.hostileAircraft[i];
      if (!h || h.hp <= 0.05) continue;
      this.game.detectedByBlue.add(h.id);

      if (runFullScan) {
        let inSensorRange = false, highestProgressRate = 0.0, isImmediateBurnThrough = false;
        for (let j = 0; j < blueSensors.length; j++) {
          const sensor = blueSensors[j];
          const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.sim.weatherClouds);
          if (maxDist <= 0.0) continue;
          const dist = Math.hypot(h.x - sensor.x, h.y - sensor.y);
          if (dist <= maxDist) {
            inSensorRange = true;
            if (dist <= 18.0 || (sensor.hasIRST && dist <= 28.0)) isImmediateBurnThrough = true;
            const idSpeed = (typeof sensor.radarIdentifySpeed === 'number') ? sensor.radarIdentifySpeed : 1.0;
            const rate = idSpeed * Math.max(0.20, 1.0 - (dist / maxDist));
            if (rate > highestProgressRate) highestProgressRate = rate;
          }
        }
        h._inSensorRange = inSensorRange;
        h._identifyRate = highestProgressRate;
        h._burnThrough = isImmediateBurnThrough;
      }

      if (h._inSensorRange) {
        if (!h.firstDetectedTime) h.firstDetectedTime = this.sim.getElapsedTimeString();
        const isStealth = Boolean(h.spec && (h.spec.sigma_0 <= 0.01 || h.spec.category === 'STEALTH'));
        const requiredTime = isStealth ? (baseAirIdTime * stealthMult) : baseAirIdTime;
        h.trackDurationBlue += h._burnThrough ? (dt * 3.0) : (dt * Math.max(0.25, h._identifyRate));
        if (h.trackDurationBlue >= requiredTime || (h._burnThrough && h.trackDurationBlue >= 1.5)) {
          h.identifiedByBlue = true;
          h.isIdentified = true;
        }
      } else {
        h.trackDurationBlue = Math.max(0.0, h.trackDurationBlue - dt * 0.25);
        if (h.trackDurationBlue <= 0.0 && !isUplinkActive) {
          h.identifiedByBlue = false;
          h.isIdentified = false;
        }
      }
    }

    if (isUplinkActive) {
      for (const h of liveHostiles) {
        this.game.detectedByBlue.add(h.id);
        h.trackDurationBlue = Math.max(h.trackDurationBlue, 10.0);
        h.identifiedByBlue = true;
        h.isIdentified = true;
      }
      if (!this.sim._satelliteUplinkAnnouncedBlue) {
        this.sim._satelliteUplinkAnnouncedBlue = true;
        if (this.game.radar) this.game.radar.spawnCombatText(liveHostiles[0].x, liveHostiles[0].y, `SATELLITE UPLINK ACTIVE: ${liveHostiles.length} TARGETS PINPOINTED`, '#00f0ff');
        this.sim.logScoreEvent('friendly', 0, `SATELLITE UPLINK: ${liveHostiles.length} target(s) remaining`);
      }
    } else if (liveHostiles.length > uplinkThreshold) {
      this.sim._satelliteUplinkAnnouncedBlue = false;
    }

    const redSensors = this.game.hostileAircraft.filter(a => a.hp > 0.05).concat(
      this.game.surfaceUnits.filter(s => s.team === 'hostile' && s.hp > 0)
    );

    for (let i = 0; i < this.game.alliedAircraft.length; i++) {
      const a = this.game.alliedAircraft[i];
      if (!a || a.hp <= 0.05) continue;
      this.game.detectedByRed.add(a.id);

      if (runFullScan) {
        let inRedSensor = false;
        for (let j = 0; j < redSensors.length; j++) {
          const s = redSensors[j];
          if (s.isPassiveElint && (a.spec.R_0 > 0) && Math.hypot(a.x - s.x, a.y - s.y) <= s.rangeKm) {
            inRedSensor = true; break;
          }
          if (Physics.canRadarDetect(s, a, this.sim.weatherClouds)) { inRedSensor = true; break; }
        }
        a._inRedSensor = inRedSensor;
      }

      if (a._inRedSensor) {
        a.trackDurationRed += dt;
        if (a.trackDurationRed >= baseAirIdTime) a.identifiedByRed = true;
      } else {
        a.trackDurationRed = Math.max(0.0, a.trackDurationRed - dt * 0.25);
        if (a.trackDurationRed <= 0.0) a.identifiedByRed = false;
      }
    }

    this.processGroundRecon(dt, runFullScan);
    this.processAuxiliaryContacts(baseAirIdTime, baseMslIdTime, dt, blueSensors, is2P);
  }

  processGroundRecon(dt, runFullScan) {
    const isAttack = (this.game.scenarioMode === 'ATTACK');
    const liveAllies = this.game.alliedAircraft.filter(a => a.hp > 0.05);

    for (let i = 0; i < this.game.surfaceUnits.length; i++) {
      const s = this.game.surfaceUnits[i];
      if (!s || s.hp <= 0.05) continue;

      if (!isAttack || s.team === 'friendly') {
        s.isRevealedToBlue = true;
        s.identifiedByBlue = true;
        this.game.detectedByBlue.add(s.id);
        this.game.detectedByRed.add(s.id);
        continue;
      }

      this.game.detectedByRed.add(s.id);
      if (s.isRevealedToBlue) this.game.detectedByBlue.add(s.id);
      if (!runFullScan) continue;

      for (let j = 0; j < liveAllies.length; j++) {
        const ally = liveAllies[j];
        const d = Math.hypot(s.x - ally.x, s.y - ally.y);
        const esmRange = ally.hasHtsPod ? 155.0 : (ally.hasESM ? 135.0 : 105.0);

        if (s.isEmitter && s.emconTimer <= 0 && d <= esmRange) {
          s.hasEmitted = true;
          s.isRevealedToBlue = true;
          if (ally.hasHtsPod && d <= 130.0) s.identifiedByBlue = true;
          this.game.detectedByBlue.add(s.id);
        }

        const tgpRange = ally.targetingSpotRangeKm || (ally.hasIRST ? 30.0 : 0.0);
        const opticalCloseRange = 22.0;

        if (d <= Math.max(opticalCloseRange, tgpRange)) {
          s.isRevealedToBlue = true;
          s.identifiedByBlue = true;
          this.game.detectedByBlue.add(s.id);
        } else if (!s.isGroundDecoy && d <= (ally.spec.R_0 * 0.72)) {
          s.isRevealedToBlue = true;
          s.identifiedByBlue = true;
          this.game.detectedByBlue.add(s.id);
        }
      }
    }
  }

  revealMutuallyAllCombatants() {
    for (const h of this.game.hostileAircraft) {
      if (h.hp > 0.05) {
        this.game.detectedByBlue.add(h.id); this.game.detectedByRed.add(h.id);
        h.identifiedByBlue = true; h.identifiedByRed = true; h.isIdentified = true;
      }
    }
    for (const a of this.game.alliedAircraft) {
      if (a.hp > 0.05) {
        this.game.detectedByBlue.add(a.id); this.game.detectedByRed.add(a.id);
        a.identifiedByBlue = true; a.identifiedByRed = true; a.isIdentified = true;
      }
    }
  }

  processAuxiliaryContacts(baseAirIdTime, baseMslIdTime, dt, blueSensors, is2P) {
    for (const ghost of this.sim.ghostContacts) {
      if (ghost.hp <= 0 || ghost.isDissolved) continue;
      this.game.detectedByBlue.add(ghost.id);
      ghost.trackDurationBlue += dt * 0.30;
      if (ghost.trackDurationBlue >= (baseAirIdTime * 1.5)) {
        ghost.identifiedByBlue = true;
        ghost.triggerDissolve('RESOLVED: ATMOSPHERIC CLUTTER');
      }
    }

    for (const decoy of this.sim.decoyDrones) {
      if (decoy.hp <= 0) continue;
      this.game.detectedByBlue.add(decoy.id);
      this.game.detectedByRed.add(decoy.id);
      if (decoy.team === 'friendly' || is2P) decoy.identifiedByBlue = true;
      if (decoy.team === 'hostile' || is2P) decoy.identifiedByRed = true;
    }

    for (const m of this.game.missiles) {
      if (!m.active && !m.isDead) continue;
      if (is2P) {
        this.game.detectedByBlue.add(m.id); this.game.detectedByRed.add(m.id);
        m.identifiedByBlue = true; m.identifiedByRed = true;
        continue;
      }
      if (m.team === 'friendly') {
        this.game.detectedByBlue.add(m.id);
        m.identifiedByBlue = true;
      } else {
        const isConcealed = m.isPassiveRadar && (m.age < m.launchStealthDuration) && (m.distanceToTarget > m.pathRevealDistance);
        if (!isConcealed) {
          let detected = Boolean(m.target && m.target.team === 'friendly');
          if (!detected) {
            for (let s = 0; s < blueSensors.length; s++) {
              const sensor = blueSensors[s];
              const maxDist = Physics.getRadarMaxDetectionRange(sensor, m, this.sim.weatherClouds);
              if (maxDist > 0.0 && Math.hypot(m.x - sensor.x, m.y - sensor.y) <= maxDist) { detected = true; break; }
            }
          }
          if (detected) {
            m.trackHoldBlue = 3.5;
            m.trackDurationBlue += dt;
            if (m.trackDurationBlue >= baseMslIdTime || (m.target && m.target.team === 'friendly')) m.identifiedByBlue = true;
          } else if (m.trackHoldBlue > 0) m.trackHoldBlue -= dt;
          if (detected || m.trackHoldBlue > 0) this.game.detectedByBlue.add(m.id);
        }
      }
      if (m.team === 'hostile') {
        this.game.detectedByRed.add(m.id);
        m.identifiedByRed = true;
      }
    }

    for (const civ of this.sim.civilianTraffic) {
      if (civ.hp <= 0) continue;
      this.game.detectedByBlue.add(civ.id);
      this.game.detectedByRed.add(civ.id);
      if (is2P) { civ.identifiedByBlue = true; civ.identifiedByRed = true; civ.isIdentified = true; continue; }
      civ.trackDurationBlue += dt * 0.4;
      if (civ.trackDurationBlue >= 6.0) civ.identifiedByBlue = true;
    }
  }
}

window.SimulationDetectionSystem = SimulationDetectionSystem;
