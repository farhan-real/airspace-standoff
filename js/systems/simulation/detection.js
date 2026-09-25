/**
 * AIRSPACE STANDOFF: Radar Signal Intelligence, Target Detection & Satellite Reveal Pipeline
 * All active aircraft are immediately tracked on radar as Phase 1: BOGEY [?].
 * Progressive NCTR and sensor tracking resolve positive identification into Phase 2: IDENTIFIED.
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

    const liveHostiles = this.game.hostileAircraft.filter(h => h.hp > 0);
    const isUplinkActive = (liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold);

    for (const h of this.game.hostileAircraft) {
      if (!h || h.hp <= 0) continue;
      this.game.detectedByBlue.add(h.id);

      let inSensorRange = false;
      let highestProgressRate = 0.0;
      let isImmediateBurnThrough = false;

      for (const sensor of blueSensors) {
        const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.sim.weatherClouds);
        if (maxDist <= 0.0) continue;
        const dist = Math.hypot(h.x - sensor.x, h.y - sensor.y);

        if (dist <= maxDist) {
          inSensorRange = true;
          const cloudHits = Physics.countIntersectingClouds(sensor.x, sensor.y, h.x, h.y, this.sim.weatherClouds);
          const irstOptical = sensor.hasIRST && (dist <= (cloudHits > 0 ? 20.0 : 28.0));
          if (dist <= 18.0 || irstOptical) isImmediateBurnThrough = true;

          if (dist <= maxDist * 0.85) {
            const rangeFactor = Math.max(0.25, 1.0 - (dist / maxDist));
            let rate = (sensor.radarIdentifySpeed || 1.0) * rangeFactor;
            if (cloudHits > 0) rate *= Math.pow(0.85, cloudHits);
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
        h.trackDurationBlue = Math.max(0.0, (h.trackDurationBlue || 0.0) - dt * 0.25);
        if (h.trackDurationBlue <= 0.0 && !isUplinkActive) {
          h.identifiedByBlue = false;
          h.isIdentified = false;
        }
      }
    }

    if (isUplinkActive) {
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
      if (!a || a.hp <= 0) continue;
      this.game.detectedByRed.add(a.id);
      let inRedSensor = false;
      for (const sensor of redSensors) {
        if (Physics.canRadarDetect(sensor, a, this.sim.weatherClouds)) { inRedSensor = true; break; }
      }
      if (inRedSensor) {
        a.trackDurationRed = (a.trackDurationRed || 0) + dt;
        if (a.trackDurationRed >= baseAirIdTime) a.identifiedByRed = true;
      } else {
        a.trackDurationRed = Math.max(0.0, (a.trackDurationRed || 0.0) - dt * 0.25);
        if (a.trackDurationRed <= 0.0) a.identifiedByRed = false;
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
      this.game.detectedByBlue.add(civ.id);
      this.game.detectedByRed.add(civ.id);

      if (is2P) {
        civ.identifiedByBlue = true;
        civ.identifiedByRed = true;
        civ.isIdentified = true;
        continue;
      }

      let closestBlueDist = 999.0;
      let highestBlueRate = 0.0;
      let hasBlueDirectTrack = false;

      for (const sensor of blueSensors) {
        const maxDist = Physics.getRadarMaxDetectionRange(sensor, civ, this.sim.weatherClouds);
        if (maxDist <= 0.0) continue;
        const d = Math.hypot(civ.x - sensor.x, civ.y - sensor.y);
        if (d < closestBlueDist) closestBlueDist = d;

        if (d <= maxDist) {
          hasBlueDirectTrack = true;
          let sensorRate = Math.max(0.20, 1.0 - (d / Math.max(maxDist, 100.0)));
          if (sensor.hasGaNAESA) sensorRate *= 1.4;
          if (sensor.hasIRST && d <= 32.0) sensorRate *= 1.5;
          if (sensorRate > highestBlueRate) highestBlueRate = sensorRate;
        }
      }

      const isEnemySide = (civ.x > 75.0);
      let requiredTimeBlue = (closestBlueDist > 95.0 || (isEnemySide && closestBlueDist > 65.0)) ? 20.0 : ((closestBlueDist > 65.0 || isEnemySide) ? 14.0 : (closestBlueDist > 35.0 ? 8.5 : 4.5));

      if (hasBlueDirectTrack) {
        civ.trackDurationBlue = (civ.trackDurationBlue || 0.0) + dt * Math.max(0.25, highestBlueRate);
        if (civ.trackDurationBlue >= requiredTimeBlue) civ.identifiedByBlue = true;
      } else {
        civ.trackDurationBlue = Math.max(0.0, (civ.trackDurationBlue || 0.0) - dt * 0.15);
      }

      let closestRedDist = 999.0;
      let hasRedTrack = false;
      for (const sensor of redSensors) {
        const d = Math.hypot(civ.x - sensor.x, civ.y - sensor.y);
        if (d < closestRedDist) closestRedDist = d;
        if (Physics.canRadarDetect(sensor, civ, this.sim.weatherClouds)) hasRedTrack = true;
      }
      const requiredTimeRed = (closestRedDist < 50.0 || civ.x > 75.0) ? 5.0 : 14.0;
      if (hasRedTrack) {
        civ.trackDurationRed = (civ.trackDurationRed || 0.0) + dt;
        if (civ.trackDurationRed >= requiredTimeRed) civ.identifiedByRed = true;
      }
    }
  }
}

window.SimulationDetectionSystem = SimulationDetectionSystem;