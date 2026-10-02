/**
 * AIRSPACE STANDOFF: Radar Signal Intelligence, Target Detection & Satellite Reveal Pipeline
 * Progressive sensor tracking with high-performance 10Hz scan throttling.
 */

class SimulationDetectionSystem {
  constructor(simulationSystem) {
    this.sim = simulationSystem;
    this.game = simulationSystem.game;
    this.scanInterval = 0.10;
    this.scanTimer = 0.0;
  }

  update(dt) {
    const cfg = window.CONFIG || {};
    const baseAirIdTime = cfg.RADAR_IDENTIFY_BASE_SEC || 5.5;
    const baseMslIdTime = cfg.MISSILE_IDENTIFY_BASE_SEC || 3.2;
    const stealthMult = cfg.STEALTH_IDENTIFY_PENALTY_MULT || 2.0;
    const uplinkThreshold = cfg.UPLINK_THRESHOLD_FIGHTERS !== undefined ? cfg.UPLINK_THRESHOLD_FIGHTERS : 3;

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

    const blueSensors = this.game.alliedAircraft.filter(a => a.hp > 0).concat(
      this.game.surfaceUnits.filter(s => s.team === 'friendly' && s.hp > 0)
    );

    const liveHostiles = this.game.hostileAircraft.filter(h => h.hp > 0);
    const isUplinkActive = (liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold);

    for (let i = 0; i < this.game.hostileAircraft.length; i++) {
      const h = this.game.hostileAircraft[i];
      if (!h || h.hp <= 0) continue;
      this.game.detectedByBlue.add(h.id);

      if (runFullScan) {
        let inSensorRange = false;
        let highestProgressRate = 0.0;
        let isImmediateBurnThrough = false;

        for (let j = 0; j < blueSensors.length; j++) {
          const sensor = blueSensors[j];
          const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.sim.weatherClouds);
          if (maxDist <= 0.0) continue;
          const dist = Math.hypot(h.x - sensor.x, h.y - sensor.y);

          if (dist <= maxDist) {
            inSensorRange = true;
            if (dist <= 18.0 || (sensor.hasIRST && dist <= 28.0)) isImmediateBurnThrough = true;
            const rangeFactor = Math.max(0.20, 1.0 - (dist / maxDist));
            let rate = (sensor.radarIdentifySpeed || 1.0) * rangeFactor;
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

        if (h._burnThrough) h.trackDurationBlue += dt * 3.0;
        else h.trackDurationBlue += dt * Math.max(0.25, h._identifyRate || 1.0);

        if (h.trackDurationBlue >= requiredTime || (h._burnThrough && h.trackDurationBlue >= 1.5)) {
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
      for (let i = 0; i < liveHostiles.length; i++) {
        const h = liveHostiles[i];
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

    for (let i = 0; i < this.game.alliedAircraft.length; i++) {
      const a = this.game.alliedAircraft[i];
      if (!a || a.hp <= 0) continue;
      this.game.detectedByRed.add(a.id);

      if (runFullScan) {
        let inRedSensor = false;
        for (let j = 0; j < redSensors.length; j++) {
          if (Physics.canRadarDetect(redSensors[j], a, this.sim.weatherClouds)) { inRedSensor = true; break; }
        }
        a._inRedSensor = inRedSensor;
      }

      if (a._inRedSensor) {
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
    for (let i = 0; i < this.game.hostileAircraft.length; i++) {
      const h = this.game.hostileAircraft[i];
      if (h.hp > 0) {
        this.game.detectedByBlue.add(h.id); this.game.detectedByRed.add(h.id);
        h.identifiedByBlue = true; h.identifiedByRed = true; h.isIdentified = true;
      }
    }
    for (let i = 0; i < this.game.alliedAircraft.length; i++) {
      const a = this.game.alliedAircraft[i];
      if (a.hp > 0) {
        this.game.detectedByBlue.add(a.id); this.game.detectedByRed.add(a.id);
        a.identifiedByBlue = true; a.identifiedByRed = true; a.isIdentified = true;
      }
    }
  }

  processAuxiliaryContacts(baseAirIdTime, baseMslIdTime, dt, blueSensors, redSensors, is2P) {
    for (let i = 0; i < this.sim.ghostContacts.length; i++) {
      const ghost = this.sim.ghostContacts[i];
      if (ghost.hp <= 0 || ghost.isDissolved) continue;
      this.game.detectedByBlue.add(ghost.id);
      ghost.trackDurationBlue += dt * 0.30;
      if (ghost.trackDurationBlue >= (baseAirIdTime * 1.5)) {
        ghost.identifiedByBlue = true;
        ghost.triggerDissolve('RESOLVED: ATMOSPHERIC CLUTTER');
      }
    }

    for (let i = 0; i < this.sim.decoyDrones.length; i++) {
      const decoy = this.sim.decoyDrones[i];
      if (decoy.hp <= 0) continue;
      this.game.detectedByBlue.add(decoy.id);
      this.game.detectedByRed.add(decoy.id);
      if (decoy.team === 'friendly' || is2P) decoy.identifiedByBlue = true;
      if (decoy.team === 'hostile' || is2P) decoy.identifiedByRed = true;
    }

    for (let i = 0; i < this.game.missiles.length; i++) {
      const m = this.game.missiles[i];
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
        const isConcealed = m.isPassiveRadar && (m.age < (m.launchStealthDuration || 3.2)) && (m.distanceToTarget > (m.pathRevealDistance || 20.0));
        if (!isConcealed) {
          let detected = false;
          for (let s = 0; s < blueSensors.length; s++) {
            const sensor = blueSensors[s];
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
      }
    }

    for (let i = 0; i < this.game.surfaceUnits.length; i++) {
      const s = this.game.surfaceUnits[i];
      this.game.detectedByBlue.add(s.id); this.game.detectedByRed.add(s.id);
      s.identifiedByBlue = true; s.identifiedByRed = true;
    }

    for (let i = 0; i < this.sim.civilianTraffic.length; i++) {
      const civ = this.sim.civilianTraffic[i];
      if (civ.hp <= 0) continue;
      this.game.detectedByBlue.add(civ.id);
      this.game.detectedByRed.add(civ.id);
      if (is2P) {
        civ.identifiedByBlue = true; civ.identifiedByRed = true; civ.isIdentified = true;
        continue;
      }
      civ.trackDurationBlue = (civ.trackDurationBlue || 0.0) + dt * 0.4;
      if (civ.trackDurationBlue >= 6.0) civ.identifiedByBlue = true;
    }
  }
}

window.SimulationDetectionSystem = SimulationDetectionSystem;