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
    const reacquireIdTime = window.CONFIG.RADAR_REACQUIRE_BASE_SEC;
    const trackDecayMax = window.CONFIG.RADAR_TRACK_DECAY_SEC;
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
          const dx = h.x - sensor.x, dy = h.y - sensor.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = Physics.getRadarMaxDetectionRange(sensor, h, this.sim.weatherClouds);
          let irstDetects = false;
          const sensorIrstRange = sensor.hasIRST ? (sensor.irstRangeKm || 28.0) : 0.0;
          if (sensorIrstRange > 0 && dist <= sensorIrstRange) {
            const halfCone = (((sensor.spec && sensor.spec.radarConeDeg) ? sensor.spec.radarConeDeg : 140) / 2.0) * (Math.PI / 180.0);
            let angleDiff = Math.abs((sensor.heading || 0) - Math.atan2(dy, dx));
            while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
            if (angleDiff <= Math.max(halfCone, 1.15)) irstDetects = true;
          }
          if ((maxDist > 0.0 && dist <= maxDist) || irstDetects) {
            inSensorRange = true;
            if (dist <= 18.0 || irstDetects) isImmediateBurnThrough = true;
            const idSpeed = (typeof sensor.radarIdentifySpeed === 'number') ? sensor.radarIdentifySpeed : 1.0;
            const effRange = Math.max(maxDist, sensorIrstRange, 1.0);
            const rate = idSpeed * Math.max(0.25, 1.0 - (dist / effRange) * 0.85);
            if (rate > highestProgressRate) highestProgressRate = rate;
          }
        }
        h._inSensorRange = inSensorRange;
        h._identifyRate = highestProgressRate;
        h._burnThrough = isImmediateBurnThrough;
      }

      if (h._inSensorRange) {
        h.activelyTrackedByBlue = true;
        if (!h.firstDetectedTime) h.firstDetectedTime = this.sim.getElapsedTimeString();
        const isStealth = Boolean(h.spec && (h.spec.sigma_0 <= 0.01 || h.spec.category === 'STEALTH'));
        const requiredTime = h.everIdentifiedByBlue
          ? (isStealth ? reacquireIdTime * 1.4 : reacquireIdTime)
          : (isStealth ? (baseAirIdTime * stealthMult) : baseAirIdTime);
        h.trackDurationBlue += h._burnThrough ? (dt * 3.0) : (dt * Math.max(0.25, h._identifyRate));
        if (h.identifiedByBlue) {
          h.trackDecayBlue = trackDecayMax;
        } else if (h.trackDurationBlue >= requiredTime || (h._burnThrough && h.trackDurationBlue >= (h.everIdentifiedByBlue ? 0.6 : 1.5))) {
          h.identifiedByBlue = true;
          h.everIdentifiedByBlue = true;
          h.trackDecayBlue = trackDecayMax;
        }
      } else {
        h.activelyTrackedByBlue = false;
        if (h.identifiedByBlue && !isUplinkActive) {
          h.trackDecayBlue = Math.max(0.0, (typeof h.trackDecayBlue === 'number' ? h.trackDecayBlue : trackDecayMax) - dt);
          if (h.trackDecayBlue <= 0.0) {
            h.identifiedByBlue = false;
            h.trackDurationBlue = 0.0;
          }
        } else if (!isUplinkActive) {
          h.trackDurationBlue = Math.max(0.0, h.trackDurationBlue - dt * 0.35);
        }
      }
    }

    if (isUplinkActive) {
      for (const h of liveHostiles) {
        this.game.detectedByBlue.add(h.id);
        h.trackDurationBlue = Math.max(h.trackDurationBlue, 10.0);
        h.identifiedByBlue = true;
        h.everIdentifiedByBlue = true;
        h.activelyTrackedByBlue = true;
        h.trackDecayBlue = trackDecayMax;
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
        let redIdRate = 1.0;
        let redBurnThrough = false;
        for (let j = 0; j < redSensors.length; j++) {
          const s = redSensors[j];
          const dx = a.x - s.x, dy = a.y - s.y;
          const dist = Math.hypot(dx, dy);
          if (s.isPassiveElint && (a.spec.R_0 > 0) && dist <= s.rangeKm) {
            inRedSensor = true; redIdRate = Math.max(redIdRate, 1.5); break;
          }
          const sIrstRange = s.hasIRST ? (s.irstRangeKm || 28.0) : 0.0;
          let irstHit = false;
          if (sIrstRange > 0 && dist <= sIrstRange) {
            const halfCone = (((s.spec && s.spec.radarConeDeg) ? s.spec.radarConeDeg : 140) / 2.0) * (Math.PI / 180.0);
            let angleDiff = Math.abs((s.heading || 0) - Math.atan2(dy, dx));
            while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
            if (angleDiff <= Math.max(halfCone, 1.15)) irstHit = true;
          }
          if (irstHit || Physics.canRadarDetect(s, a, this.sim.weatherClouds)) {
            inRedSensor = true;
            if (dist <= 18.0 || irstHit) redBurnThrough = true;
            const sRate = (typeof s.radarIdentifySpeed === 'number') ? s.radarIdentifySpeed : 1.0;
            if (sRate > redIdRate) redIdRate = sRate;
          }
        }
        a._inRedSensor = inRedSensor;
        a._redIdentifyRate = redIdRate;
        a._redBurnThrough = redBurnThrough;
      }

      if (a._inRedSensor) {
        a.activelyTrackedByRed = true;
        const isStealthBlue = Boolean(a.spec && (a.spec.sigma_0 <= 0.01 || a.spec.category === 'STEALTH'));
        const reqRedTime = a.everIdentifiedByRed
          ? (isStealthBlue ? reacquireIdTime * 1.4 : reacquireIdTime)
          : (isStealthBlue ? (baseAirIdTime * stealthMult) : baseAirIdTime);
        a.trackDurationRed += a._redBurnThrough ? (dt * 3.0) : (dt * Math.max(0.35, a._redIdentifyRate || 1.0));
        if (a.identifiedByRed) {
          a.trackDecayRed = trackDecayMax;
        } else if (a.trackDurationRed >= reqRedTime || (a._redBurnThrough && a.trackDurationRed >= (a.everIdentifiedByRed ? 0.6 : 1.5))) {
          a.identifiedByRed = true;
          a.everIdentifiedByRed = true;
          a.trackDecayRed = trackDecayMax;
        }
      } else {
        a.activelyTrackedByRed = false;
        if (a.identifiedByRed) {
          a.trackDecayRed = Math.max(0.0, (typeof a.trackDecayRed === 'number' ? a.trackDecayRed : trackDecayMax) - dt);
          if (a.trackDecayRed <= 0.0) {
            a.identifiedByRed = false;
            a.trackDurationRed = 0.0;
          }
        } else {
          a.trackDurationRed = Math.max(0.0, a.trackDurationRed - dt * 0.35);
        }
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
        const wasRevealed = Boolean(s.isRevealedToBlue);
        const wasId = Boolean(s.identifiedByBlue);
        let method = null;

        if (s.isEmitter && s.emconTimer <= 0 && d <= esmRange) {
          s.hasEmitted = true;
          s.isRevealedToBlue = true;
          method = ally.hasHtsPod ? 'HTS ELINT' : (ally.hasESM ? 'ESM Receiver' : 'RWR');
          if (ally.hasHtsPod && d <= 130.0) s.identifiedByBlue = true;
          this.game.detectedByBlue.add(s.id);
        }

        const tgpRange = ally.targetingSpotRangeKm || (ally.hasIRST ? 30.0 : 0.0);
        const needsAdvancedTgp = Boolean(s.spec && s.spec.requiresHighGradeTgp);
        const opticalCloseRange = needsAdvancedTgp ? 15.0 : 22.0;
        const effectiveTgpRange = (needsAdvancedTgp && tgpRange < 44.0) ? 0.0 : tgpRange;

        if (d <= Math.max(opticalCloseRange, effectiveTgpRange)) {
          s.isRevealedToBlue = true;
          s.identifiedByBlue = true;
          method = ally.targetingSpotRangeKm > 0 ? 'Targeting Pod' : (ally.hasIRST ? 'IRST Optical' : 'Visual Flyby');
          this.game.detectedByBlue.add(s.id);
        } else if (!s.isGroundDecoy && d <= (ally.spec.R_0 * 0.72)) {
          s.isRevealedToBlue = true;
          s.identifiedByBlue = true;
          method = 'SAR Ground Radar';
          this.game.detectedByBlue.add(s.id);
        }

        if (method && ((s.isRevealedToBlue && !wasRevealed) || (s.identifiedByBlue && !wasId)) && this.game.inspection && this.game.inspection.enabled) {
          const verb = s.identifiedByBlue ? (s.isGroundDecoy ? 'exposed decoy' : 'identified') : 'detected emitter';
          this.game.inspection.recordEvent('GROUND RECON', `${window.formatAircraftDisplayName(ally)} ${verb}: ${s.name}`, ally, s, {
            distanceKm: d, method, identified: s.identifiedByBlue, isDecoy: s.isGroundDecoy
          });
        }
      }
    }
  }

  revealMutuallyAllCombatants() {
    const decaySec = window.CONFIG.RADAR_TRACK_DECAY_SEC;
    for (const h of this.game.hostileAircraft) {
      if (h.hp > 0.05) {
        this.game.detectedByBlue.add(h.id); this.game.detectedByRed.add(h.id);
        h.identifiedByBlue = true; h.identifiedByRed = true;
        h.everIdentifiedByBlue = true; h.everIdentifiedByRed = true;
        h.activelyTrackedByBlue = true; h.activelyTrackedByRed = true;
        h.trackDecayBlue = decaySec; h.trackDecayRed = decaySec;
      }
    }
    for (const a of this.game.alliedAircraft) {
      if (a.hp > 0.05) {
        this.game.detectedByBlue.add(a.id); this.game.detectedByRed.add(a.id);
        a.identifiedByBlue = true; a.identifiedByRed = true;
        a.everIdentifiedByBlue = true; a.everIdentifiedByRed = true;
        a.activelyTrackedByBlue = true; a.activelyTrackedByRed = true;
        a.trackDecayBlue = decaySec; a.trackDecayRed = decaySec;
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
