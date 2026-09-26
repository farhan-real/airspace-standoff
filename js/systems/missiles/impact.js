/**
 * AIRSPACE STANDOFF: Missile Impact & Terminal Engagement Subsystem
 * Evaluates terminal hit results, damage application, and evasion classifications.
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
        distanceTraveledKm: missile.distanceTraveled, ageSec: missile.age, cloudObscureSec: missile.cloudObscureTimer
      }, missile);
    }

    const isLiveTarget = missile.target && missile.target.hp > 0.05 && !missile.target.isCivilian && !missile.target.isGhost && !missile.target.isDecoyDrone;
    const isGenuineEvade = isLiveTarget && (
      reason === 'KINETIC OVERSHOOT' || reason.includes('DOPPLER NOTCH') || reason.includes('COBRA') ||
      reason.includes('BARREL ROLL') || reason.includes('SPLIT-S') || reason.includes('CHAFF') ||
      reason.includes('PERCH') || reason.includes('BREAK') || reason.includes('DODGE') || reason === 'OBSCURED IN CLOUDS'
    );

    if (isGenuineEvade) {
      if (missile.target.missilesEvadedCount !== undefined) {
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
      }
      if (missile.target.energy !== undefined) {
        missile.target.energy = Math.max(0.20, missile.target.energy - 0.15);
      }
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playMissileLost();
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(missile.x, missile.y, `${reason}`, '#f97316');
  }

  static resolveTerminalEngagement(missile, weatherClouds) {
    const tgt = missile.target;
    const w = missile.weapon;
    if (!tgt || tgt.hp <= 0.05) {
      missile.active = false; missile.isDead = true;
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
      tgt.takeDamage(w.damage || 1);
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
      const isEmitter = (tgt.type === 'S-400' || tgt.type === 'RADAR_ARRAY' || tgt.type === 'EW_JAMMER' || tgt.type === 'RADAR_VAN');
      const dmg = w.damage * ((w.trait === 'EMITTER_KILLER' && isEmitter) ? 3 : 1);
      const wasDead = tgt.hp <= 0;
      tgt.takeDamage(dmg, w.isBunkerCracker);
      missile.isDead = true;
      if (!wasDead && tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(missile.team, tgt, missile.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (!wasDead && tgt.hp > 0 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(missile.team, tgt, missile.source, { weapon: w, damage: dmg, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, true);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, `-${dmg} HP`, '#ff3366');
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

    const impactModel = (typeof MissileKinetics !== 'undefined')
      ? MissileKinetics.explainHitProbability(missile, tgt, weatherClouds, concurrent)
      : { probability: 0.65, rawProbability: 0.65, factors: {} };
    const hitChance = impactModel.probability;
    const impactRoll = Math.random();
    const hit = impactRoll <= hitChance;

    if (hit) {
      missile.isDead = true;
      let finalDamage = w.damage;
      if (tgt.isFlightLead && tgt.missileDamageReduction) finalDamage = Math.max(1, finalDamage - tgt.missileDamageReduction);
      tgt.hp = Math.max(0, tgt.hp - finalDamage);
      if (tgt.hp < 0.05) tgt.hp = 0;
      if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.35);

      if (tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(missile.team, tgt, missile.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (tgt.hp > 0 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(missile.team, tgt, missile.source, { weapon: w, damage: finalDamage, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }

      if (w.trait === 'SHOCKWAVE_DETONATION' && typeof MissileKinetics !== 'undefined') {
        MissileKinetics.applyThermobaricAoE(missile, tgt, finalDamage, window.Game);
      } else {
        if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(finalDamage >= 4);
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, finalDamage >= 4);
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, isSalvo ? `SALVO HIT -${finalDamage}HP` : `HIT -${finalDamage}HP`, '#ff3366');
        }
      }
    } else {
      let reason = 'KINETIC OVERSHOOT';
      if (tgt.activeManeuverId === 'DOPPLER_NOTCH' || tgt.isNotching) reason = 'DOPPLER NOTCH (GATE LOSS)';
      else if (tgt.activeManeuverId === 'PUSH_COBRA') reason = 'COBRA BRAKE (OVERSHOOT)';
      else if (tgt.activeManeuverId === 'BARREL_ROLL') reason = 'BARREL ROLL (LEAD LOSS)';
      else if (tgt.activeManeuverId === 'SPLIT_S') reason = 'SPLIT-S (KINETIC ESCAPE)';
      else if (tgt.activeManeuverId === 'EMERGENCY_CM' || tgt.cmTimer > 0) reason = 'CHAFF DECOY SEDUCTION';
      else if (tgt.activeManeuverId === 'ZOOM_CLIMB') reason = 'ENERGY PERCH (GRAVITY DEFICIT)';
      else if (tgt.activeManeuverId === 'BREAK_TURN') reason = 'DEFENSIVE BREAK TURN';
      else if (tgt.isCoffin) reason = 'COFFIN NEURAL DODGE';
      else if (tgt.isAce) reason = 'ACE DEFENSIVE BREAK';
      else if (tgt.activeManeuverBonus > 0) reason = 'DEFENSIVE BREAK TURN';
      MissileImpactSystem.triggerLostTrack(missile, reason);
    }
  }
}

window.MissileImpactSystem = MissileImpactSystem;
window.MissileTerminalSystem = MissileImpactSystem;