/**
 * AIRSPACE STANDOFF: Radar Signal Intelligence, Target Detection & Satellite Reveal Pipeline
 * Calibrated classification rates, mutual detection fairness, and passive radar launch concealment.
 */

class SimulationDetectionSystem {
  constructor(simulationSystem) {
    this.sim = simulationSystem;
    this.game = simulationSystem.game;
  }

  update(dt) {
    const cfg = window.CONFIG || {};
    const baseAirIdTime = cfg.RADAR_IDENTIFY_BASE_SEC || 5.5;
    const baseMslIdTime = cfg.MISSILE_IDENTIFY_BASE_SEC || 3.2;
    const stealthMult = cfg.STEALTH_IDENTIFY_PENALTY_MULT || 2.0;
    const uplinkThreshold = cfg.UPLINK_THRESHOLD_FIGHTERS !== undefined ? cfg.UPLINK_THRESHOLD_FIGHTERS : 3;

    const blueSensors = this.game.alliedAircraft.filter(a => a.hp > 0).concat(
      this.game.surfaceUnits.filter(s => s.team === 'friendly' && s.hp > 0)
    );

    this.game.detectedByBlue = new Set();
    this.game.detectedByRed = new Set();

    const is2P = (this.game.playerMode === '2P');
    if (is2P) {
      this.revealMutuallyAllCombatants();
      return;
    }

    for (const h of this.game.hostileAircraft) {
      if (h.hp <= 0) continue;
      this.game.detectedByBlue.add(h.id);

      let inSensorRange = false;
      let highestProgressRate = 0.0;
      let isImmediateBurnThrough = false;

      let inClouds = false;
      if (this.sim.weatherClouds) {
        for (const c of this.sim.weatherClouds) {
          if (c.containsPoint(h.x, h.y)) { inClouds = true; break; }
        }
      }

      for (const sensor of blueSensors) {
        const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.sim.weatherClouds);
        if (maxDist <= 0.0) continue;
        const dist = Math.hypot(h.x - sensor.x, h.y - sensor.y);

        if (dist <= maxDist) {
          inSensorRange = true;
          const irstOptical = sensor.hasIRST && (dist <= (inClouds ? 12.0 : 28.0));
          if (dist <= 18.0 || irstOptical) isImmediateBurnThrough = true;

          if (dist <= maxDist * 0.85) {
            const rangeFactor = Math.max(0.25, 1.0 - (dist / maxDist));
            let rate = (sensor.radarIdentifySpeed || 1.0) * rangeFactor;
            if (inClouds) rate *= 0.60;
            if (rate > highestProgressRate) highestProgressRate = rate;
          }
        }
      }

      if (inSensorRange) {
        if (!h.firstDetectedTime) h.firstDetectedTime = this.sim.getElapsedTimeString();
        const isStealth = Boolean(h.spec && (h.spec.sigma_0 <= 0.01 || h.spec.category === 'STEALTH'));
        const requiredTime = isStealth ? (baseAirIdTime * stealthMult) : baseAirIdTime;

        if (isImmediateBurnThrough) h.trackDurationBlue += dt * 3.0;
        else h.trackDurationBlue += dt * highestProgressRate;

        if (h.trackDurationBlue >= requiredTime || (isImmediateBurnThrough && h.trackDurationBlue >= 1.5)) {
          h.identifiedByBlue = true;
          h.isIdentified = true;
        }
      } else {
        h.trackDurationBlue = Math.max(0.0, h.trackDurationBlue - dt * 0.20);
      }
    }

    const liveHostiles = this.game.hostileAircraft.filter(h => h.hp > 0);
    if (liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold) {
      for (const h of liveHostiles) {
        this.game.detectedByBlue.add(h.id);
        h.trackDurationBlue = Math.max(h.trackDurationBlue || 0, 10.0);
        h.identifiedByBlue = true;
        h.isIdentified = true;
      }
      if (!this.sim._satelliteUplinkAnnouncedBlue) {
        this.sim._satelliteUplinkAnnouncedBlue = true;
        if (this.game.radar) {
          this.game.radar.spawnCombatText(liveHostiles[0].x, liveHostiles[0].y, `SATELLITE UPLINK ACTIVE: ${liveHostiles.length} TARGETS PINPOINTED`, '#00f0ff');
        }
        this.sim.logScoreEvent('friendly', 0, `SATELLITE UPLINK: ${liveHostiles.length} target(s) remaining - radar broadcast active`);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      }
    } else if (liveHostiles.length > uplinkThreshold) {
      this.sim._satelliteUplinkAnnouncedBlue = false;
    }

    const redSensors = this.game.hostileAircraft.filter(a => a.hp > 0).concat(
      this.game.surfaceUnits.filter(s => s.team === 'hostile' && s.hp > 0)
    );

    for (const a of this.game.alliedAircraft) {
      if (a.hp <= 0) continue;
      this.game.detectedByRed.add(a.id);
      let inRedSensor = false;
      for (const sensor of redSensors) {
        if (Physics.canRadarDetect(sensor, a, this.sim.weatherClouds)) { inRedSensor = true; break; }
      }
      if (inRedSensor) {
        a.trackDurationRed = (a.trackDurationRed || 0) + dt;
        if (a.trackDurationRed >= baseAirIdTime) a.identifiedByRed = true;
      }
    }

    this.processAuxiliaryContacts(baseAirIdTime, baseMslIdTime, dt, blueSensors, redSensors, is2P);
  }

  revealMutuallyAllCombatants() {
    for (const h of this.game.hostileAircraft) {
      if (h.hp > 0) {
        this.game.detectedByBlue.add(h.id); this.game.detectedByRed.add(h.id);
        h.identifiedByBlue = true; h.identifiedByRed = true; h.isIdentified = true;
      }
    }
    for (const a of this.game.alliedAircraft) {
      if (a.hp > 0) {
        this.game.detectedByBlue.add(a.id); this.game.detectedByRed.add(a.id);
        a.identifiedByBlue = true; a.identifiedByRed = true; a.isIdentified = true;
      }
    }
  }

  processAuxiliaryContacts(baseAirIdTime, baseMslIdTime, dt, blueSensors, redSensors, is2P) {
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
      if (!m.active) continue;
      if (is2P) {
        this.game.detectedByBlue.add(m.id); this.game.detectedByRed.add(m.id);
        m.identifiedByBlue = true; m.identifiedByRed = true;
        continue;
      }

      // Friendly missiles are always tracked by Blue
      if (m.team === 'friendly') {
        this.game.detectedByBlue.add(m.id);
        m.identifiedByBlue = true;
      } else {
        const isConcealedForBlue = m.isPassiveRadar && (m.age < (m.launchStealthDuration || 3.2)) && (m.distanceToTarget > (m.pathRevealDistance || 20.0));
        if (!isConcealedForBlue) {
          let detected = false;
          for (const sensor of blueSensors) {
            const maxDist = Physics.getRadarMaxDetectionRange(sensor, m, this.sim.weatherClouds);
            if (maxDist > 0.0 && Math.hypot(m.x - sensor.x, m.y - sensor.y) <= maxDist) { detected = true; break; }
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
      }

      // Hostile missiles are always tracked by Red
      if (m.team === 'hostile') {
        this.game.detectedByRed.add(m.id);
        m.identifiedByRed = true;
      } else {
        const isConcealedForRed = m.isPassiveRadar && (m.age < (m.launchStealthDuration || 3.2)) && (m.distanceToTarget > (m.pathRevealDistance || 20.0));
        if (!isConcealedForRed) {
          let detectedRed = false;
          for (const sensor of redSensors) {
            const maxDist = Physics.getRadarMaxDetectionRange(sensor, m, this.sim.weatherClouds);
            if (maxDist > 0.0 && Math.hypot(m.x - sensor.x, m.y - sensor.y) <= maxDist) { detectedRed = true; break; }
          }
          if (detectedRed) {
            this.game.detectedByRed.add(m.id);
          }
        }
      }
    }

    for (const s of this.game.surfaceUnits) {
      this.game.detectedByBlue.add(s.id); this.game.detectedByRed.add(s.id);
      s.identifiedByBlue = true; s.identifiedByRed = true;
    }

    for (const civ of this.sim.civilianTraffic) {
      if (civ.hp <= 0) continue;
      this.game.detectedByBlue.add(civ.id); this.game.detectedByRed.add(civ.id);
      civ.trackDuration = (civ.trackDuration || 0) + dt;
      if (civ.trackDuration >= 3.2 || is2P) {
        civ.identifiedByBlue = true; civ.identifiedByRed = true;
      }
    }
  }
}

window.SimulationDetectionSystem = SimulationDetectionSystem;