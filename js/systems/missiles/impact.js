/**
 * js/systems/missiles/impact.js - Missile impact evaluation, ground strike hit modeling, and cluster splash.
 */

class MissileImpactSystem {
  static triggerLostTrack(missile, reason) {
    if (missile.state === 'LOST_TRACK') return;
    const stageBeforeLoss = missile.stage;
    missile.state = 'LOST_TRACK';
    missile.active = false;
    missile.lostReason = reason;
    missile.stage = 'COAST';
    missile.heading += (Math.random() * 0.2 - 0.1);

    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) {
      inspection.recordEvent('TRACK TERMINATED', `${missile.weapon.name || missile.weapon.id} terminal track defeated (${reason})`, missile.source, missile.target, {
        missileId: missile.id, reason, stageBeforeLoss, distanceToTargetKm: missile.distanceToTarget,
        distanceTraveledKm: missile.distanceTraveled, ageSec: missile.age
      }, missile);
    }

    const isLiveTarget = missile.target && missile.target.hp > 0.05 && !missile.target.isCivilian && !missile.target.isGhost && !missile.target.isDecoyDrone;
    const isGenuineEvade = isLiveTarget && (
      reason === 'KINETIC OVERSHOOT' || reason.includes('DOPPLER NOTCH') || reason.includes('COBRA') ||
      reason.includes('BARREL ROLL') || reason.includes('SPLIT-S') || reason.includes('CHAFF') ||
      reason.includes('CLIMB') || reason.includes('ENERGY') || reason.includes('BREAK') || reason.includes('DODGE') || reason === 'OBSCURED IN CLOUDS'
    );

    if (isGenuineEvade && missile.target.missilesEvadedCount !== undefined) {
      const isSwarm = (missile.weapon && (missile.weapon.trait === 'SWARM_RIPPLE' || missile.weapon.trait === 'ALL_ASPECT_BURST'));
      if (isSwarm) {
        missile.target._swarmEvadeAccum = (missile.target._swarmEvadeAccum || 0) + 1;
        if (missile.target._swarmEvadeAccum >= 4) {
          missile.target.missilesEvadedCount++;
          missile.target._swarmEvadeAccum = 0;
        }
      } else {
        missile.target.missilesEvadedCount++;
      }
      if (missile.target.energy !== undefined) {
        missile.target.energy = Math.max(0.20, missile.target.energy - 0.15);
      }
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playMissileLost();
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(missile.x, missile.y, `${reason}`, '#f97316');
  }

  static calcSurfaceHitChance(missile, tgt, weatherClouds) {
    const w = missile.weapon;
    const normDist = Math.max(0.0, Math.min(1.0, missile.launchDistKm / Math.max(1.0, missile.maxRangeKm)));
    const rangeScore = Math.max(0.20, 1.0 - w.lambda * Math.pow(normDist, w.p));

    const targetInCloud = weatherClouds && weatherClouds.some(c => c.containsPoint(tgt.x, tgt.y)) ? 1 : 0;
    const cloudHits = Math.max(missile.launchCloudHits, targetInCloud);
    const laserWeatherPen = (w.seeker === 'LASER') ? (cloudHits * 0.20 * (1.0 - missile.launchCloudMitigation)) : 0.0;
    const altDispersionPen = (w.seeker === 'UNGUIDED' && !w.isRocketPod && missile.launchAltFt > 26000 && missile.launchCcipBonus <= 0)
      ? (missile.launchTgpBonus > 0 ? 0.08 : 0.18) : 0.0;
    const jamImpact = (w.seeker !== 'UNGUIDED' && missile.source)
      ? Physics.getGroundJammingImpact(tgt, missile.source) : 0.0;
    const jamPen = (jamImpact > 0) ? 0.10 * (1.0 - missile.launchEccmBonus) : 0.0;

    const rawA2g = (w.T_0 * rangeScore) + missile.launchTgpBonus + missile.launchCcipBonus + missile.launchArmPkBonus + missile.launchMitlBonus - laserWeatherPen - altDispersionPen - jamPen;
    return Math.max(0.25, Math.min(0.96, rawA2g));
  }

  static applyGroundPhaseClusterHits(missile, w) {
    const game = window.Game;
    if (!game || !w || !w.isCluster) return;
    const radius = w.clusterRadiusKm;
    const dmg = w.clusterDamage;

    for (const ac of game.hostileAircraft) {
      if (!ac || ac.hp <= 0.05 || !ac.groundPhase) continue;
      if (Math.hypot(ac.x - missile.x, ac.y - missile.y) <= radius) {
        const wasAlive = ac.hp > 0.05;
        ac.takeDamage(dmg);
        if (game.radar) game.radar.spawnCombatText(ac.x, ac.y, `GROUNDED JET -${dmg.toFixed(1)}HP`, '#fbbf24');
        if (wasAlive && ac.hp <= 0.05 && game.simulation) {
          game.simulation.recordKillEvent(missile.team, ac, missile.source, { weapon: w, isSalvo: false, salvoCount: 1 });
        }
      }
    }
  }

  static resolveTerminalEngagement(missile, weatherClouds) {
    if (!missile || !missile.weapon) throw new Error('MissileImpactSystem.resolveTerminalEngagement requires missile with weapon.');
    if (typeof MissileKinetics === 'undefined') throw new Error('MissileKinetics is not loaded.');

    const tgt = missile.target;
    const w = missile.weapon;
    if (!tgt || tgt.hp <= 0.05) {
      if (tgt) tgt.hp = 0;
      missile.active = false;
      missile.isDead = true;
      return;
    }

    let concurrent = 1;
    let salvoDetails = '';
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => (m.active || m.id === missile.id) && m.target && m.target.id === tgt.id);
      concurrent = Math.max(1, inbounds.length);
      if (concurrent > 1) {
        const counts = {};
        for (const m of inbounds) {
          const rawName = (m.weapon && (m.weapon.name || m.weapon.id)) ? (m.weapon.name || m.weapon.id) : 'Missile';
          const clean = rawName.replace(/\s*\(\d+x\)/gi, '').replace(/\s*\(pack of \d+\)/gi, '').trim();
          counts[clean] = (counts[clean] || 0) + 1;
        }
        salvoDetails = Object.entries(counts).map(([name, count]) => `${name} x${count}`).join(', ');
      }
    }
    const isSalvo = (concurrent > 1);
    missile.active = false;

    if (tgt.isGhost) {
      missile.isDead = true;
      tgt.takeDamage();
      MissileImpactSystem.triggerLostTrack(missile, 'FALSE CONTACT DISSIPATED');
      return;
    }

    if (tgt.isDecoyDrone) {
      missile.isDead = true;
      tgt.takeDamage(w.damage);
      if (window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(missile.team, tgt, missile.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, 'DECOY DESTROYED', '#c084fc');
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(false);
      return;
    }

    if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) {
      if (w.isAntiRadiation && tgt.emconTimer > 0 && !w.antiEmcon) {
        MissileImpactSystem.triggerLostTrack(missile, 'RADAR EMCON SHUTDOWN');
        return;
      }

      const hitChance = this.calcSurfaceHitChance(missile, tgt, weatherClouds);
      if (Math.random() > hitChance) {
        const missReason = (w.seeker === 'LASER') ? 'LASER SCATTER MISS' : 'BALLISTIC DISPERSION MISS';
        MissileImpactSystem.triggerLostTrack(missile, missReason);
        return;
      }

      let armMult = 1;
      if (w.trait === 'EMITTER_KILLER' && tgt.isEmitter) {
        armMult = (tgt.emconTimer > 0) ? 1.5 : 3;
      }
      const dmg = w.damage * armMult;
      const wasDead = tgt.hp <= 0.05;
      tgt.takeDamage(dmg, Boolean(w.isBunkerCracker), w);
      missile.isDead = true;

      if (w.isCluster) {
        MissileKinetics.applyClusterAoE(missile, tgt, window.Game);
        this.applyGroundPhaseClusterHits(missile, w);
      }

      if (!wasDead && tgt.hp <= 0.05 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(missile.team, tgt, missile.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (!wasDead && tgt.hp > 0.05 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(missile.team, tgt, missile.source, { weapon: w, damage: dmg, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, dmg >= 5 || w.isCluster);
        if (tgt.isGroundDecoy) {
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, 'DECOY HIT (WASTED)', '#fbbf24');
        } else if (w.isAntiRunway && tgt.isAirbaseRunway) {
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, `RUNWAY CRATERED -${(dmg * 2).toFixed(1)} HP`, '#00f5a0');
        } else {
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, `-${dmg.toFixed(1)} HP`, '#ff3366');
        }
      }
      return;
    }

    if (tgt.isCivilian) {
      tgt.takeDamage(w.damage, missile.source, w, true);
      missile.isDead = true;
      if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(true);
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, true);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, `CIVILIAN HIT -${w.damage}HP`, '#f43f5e');
      }
      return;
    }

    const impactModel = MissileKinetics.explainHitProbability(missile, tgt, weatherClouds, concurrent);
    const hit = Math.random() <= impactModel.probability;

    if (hit) {
      missile.isDead = true;
      let finalDamage = w.damage;
      if (tgt.isFlightLead && tgt.missileDamageReduction) finalDamage = Math.max(1, finalDamage - tgt.missileDamageReduction);
      tgt.hp = Math.max(0, tgt.hp - finalDamage);
      if (tgt.hp <= 0.05) tgt.hp = 0;
      if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.35);

      if (tgt.hp <= 0.05 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(missile.team, tgt, missile.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (tgt.hp > 0.05 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(missile.team, tgt, missile.source, { weapon: w, damage: finalDamage, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }

      if (w.trait === 'SHOCKWAVE_DETONATION') {
        MissileKinetics.applyThermobaricAoE(missile, tgt, finalDamage, window.Game);
      } else {
        if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(finalDamage >= 4);
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, finalDamage >= 4);
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, isSalvo ? `SALVO HIT -${finalDamage}HP` : `HIT -${finalDamage}HP`, '#ff3366');
        }
      }
    } else {
      let reason = 'DEFENSIVE BREAK TURN';
      const isOptical = Boolean(w && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT'));
      const targetInCloud = weatherClouds && weatherClouds.some(c => c.containsPoint(tgt.x, tgt.y));

      if (isOptical && targetInCloud) reason = 'OBSCURED IN CLOUDS';
      else if (tgt.activeManeuverId === 'DOPPLER_NOTCH' || tgt.isNotching) reason = 'DOPPLER NOTCH (GATE LOSS)';
      else if (tgt.activeManeuverId === 'PUSH_COBRA') reason = 'COBRA BRAKE (OVERSHOOT)';
      else if (tgt.activeManeuverId === 'BARREL_ROLL') reason = 'BARREL ROLL (LEAD LOSS)';
      else if (tgt.activeManeuverId === 'SPLIT_S') reason = 'SPLIT-S (KINETIC ESCAPE)';
      else if (tgt.activeManeuverId === 'EMERGENCY_CM' || tgt.cmTimer > 0) reason = 'CHAFF DECOY DIVERSION';
      else if (tgt.activeManeuverId === 'ZOOM_CLIMB') reason = 'HIGH-ALTITUDE CLIMB (ENERGY DEFICIT)';
      else if (tgt.isCoffin) reason = 'COFFIN EVASIVE RESPONSE';
      else if (tgt.isAce) reason = 'ACE DEFENSIVE BREAK';
      MissileImpactSystem.triggerLostTrack(missile, reason);
    }
  }
}

window.MissileImpactSystem = MissileImpactSystem;
