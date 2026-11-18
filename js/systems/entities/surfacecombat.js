/**
 * js/systems/entities/surfacecombat.js - Ground IADS SAM firing, finite magazines, ECM jamming, and decoupled AAA/CIWS timers.
 */

class SurfaceCombatSystem {
  static getAttackModifiers(unit) {
    const game = window.Game;
    if (!game) throw new Error('window.Game is required by SurfaceCombatSystem.getAttackModifiers.');
    if (game.scenarioMode !== 'ATTACK') {
      return {
        hasEwCue: false, hasLowAltCue: false, isPowerActive: true,
        samCooldownMult: 1.0, ciwsCooldownMult: 1.0, aaaCooldownMult: 1.0,
        aaaHitBonus: 0.0, jamEfficiencyMult: 1.0, ambushRatio: 1.0,
        ciwsAccuracy: unit.interceptAccuracy, samReactionDelaySec: 2.5
      };
    }
    if (!window.ATTACK_DIFFICULTIES || !window.ATTACK_DIFFICULTIES[game.attackDifficulty]) {
      throw new Error(`Invalid game.attackDifficulty "${game.attackDifficulty}" in SurfaceCombatSystem.`);
    }
    if (!window.ATTACK_DOCTRINES || !window.ATTACK_DOCTRINES[game.attackDoctrine]) {
      throw new Error(`Invalid game.attackDoctrine "${game.attackDoctrine}" in SurfaceCombatSystem.`);
    }
    if (!Array.isArray(game.surfaceUnits)) throw new Error('game.surfaceUnits must be an array.');

    const diff = window.ATTACK_DIFFICULTIES[game.attackDifficulty];
    const doc = window.ATTACK_DOCTRINES[game.attackDoctrine];
    const allSurf = game.surfaceUnits;

    const hasPowerSub = allSurf.some(s => s.team === unit.team && s.isPowerNode);
    const alivePower = allSurf.some(s => s.team === unit.team && s.isPowerNode && s.hp > 0.05 && Math.hypot(s.x - unit.x, s.y - unit.y) <= 58.0);
    const isPowerActive = !hasPowerSub || alivePower;

    const hasMunitionNearby = allSurf.some(s => s.team === unit.team && s.isMunitionDepot && Math.hypot(s.x - unit.x, s.y - unit.y) <= 65.0);
    const aliveMunition = allSurf.some(s => s.team === unit.team && s.isMunitionDepot && s.hp > 0.05 && Math.hypot(s.x - unit.x, s.y - unit.y) <= 65.0);
    const munitionMult = (hasMunitionNearby && !aliveMunition) ? 1.80 : 1.0;

    const hasComms = allSurf.some(s => s.team === unit.team && s.isCommsRelay && s.hp > 0.05 && Math.hypot(s.x - unit.x, s.y - unit.y) <= 65.0);
    const hasC2 = allSurf.some(s => s.team === unit.team && s.isCommandNode && s.hp > 0.05 && Math.hypot(s.x - unit.x, s.y - unit.y) <= 75.0);
    const ewRadars = allSurf.filter(s => s.team === unit.team && s.category === 'EW_RADAR' && s.hp > 0.05 && s.emconTimer <= 0);

    let hasEwCue = false, hasLowAltCue = false;
    for (const ew of ewRadars) {
      const dist = Math.hypot(ew.x - unit.x, ew.y - unit.y);
      if (dist <= 90.0 || (hasComms && dist <= 135.0)) {
        hasEwCue = true;
        if (ew.lowAltCueBonus) hasLowAltCue = true;
      }
    }

    const baseMult = munitionMult * (hasC2 ? 1.0 : 1.40);
    const baseCiws = unit.isAaaGun ? unit.interceptAccuracy : diff.ciwsInterceptRate;

    return {
      hasEwCue, hasLowAltCue, isPowerActive,
      samCooldownMult: baseMult * doc.samCooldownMult,
      ciwsCooldownMult: baseMult * doc.ciwsCooldownMult,
      aaaCooldownMult: baseMult * doc.aaaCooldownMult,
      aaaHitBonus: doc.aaaHitBonus,
      jamEfficiencyMult: doc.jamEfficiencyMult,
      ambushRatio: Math.max(0.52, Math.min(1.0, diff.ambushHoldRatio + doc.ambushHoldOffset)),
      ciwsAccuracy: Math.max(0.15, Math.min(0.85, baseCiws + doc.ciwsAccuracyOffset)),
      samReactionDelaySec: diff.samReactionDelaySec * (hasC2 ? 1.0 : 1.40)
    };
  }

  static getActiveJammingAgainstSurface(unit, targetPlane) {
    const game = window.Game;
    let bestJam = (targetPlane && typeof targetPlane.jamEfficiency === 'number') ? targetPlane.jamEfficiency : 0.0;
    const fleet = (unit.team === 'hostile') ? game.alliedAircraft : game.hostileAircraft;
    for (let i = 0; i < fleet.length; i++) {
      const ac = fleet[i];
      if (!ac || ac.hp <= 0.05 || !ac.jamEfficiency || ac.jamEfficiency <= 0) continue;
      const jamRange = ac.maxJamRangeKm || 95.0;
      if (Math.hypot(ac.x - unit.x, ac.y - unit.y) <= jamRange || Math.hypot(ac.x - targetPlane.x, ac.y - targetPlane.y) <= jamRange) {
        bestJam = Math.max(bestJam, ac.jamEfficiency);
      }
    }
    return bestJam;
  }

  static updateUnit(unit, dt, enemyAircraftList, enemyMissilesList, spawnedMissiles, radarArrayActive) {
    if (unit.hp <= 0.05) { unit.hp = 0; return; }
    if (unit.emconTimer > 0) unit.emconTimer = Math.max(0, unit.emconTimer - dt);
    if (unit.fireCooldown > 0) unit.fireCooldown = Math.max(0, unit.fireCooldown - dt);
    if (unit.aaaCooldown > 0) unit.aaaCooldown = Math.max(0, unit.aaaCooldown - dt);
    if (unit.pdCooldown > 0) unit.pdCooldown = Math.max(0, unit.pdCooldown - dt);

    if (unit.rackReloadTimer > 0) {
      unit.rackReloadTimer = Math.max(0, unit.rackReloadTimer - dt);
      if (unit.rackReloadTimer <= 0 && unit.ammo > 0) {
        unit.readyAmmo = Math.min(unit.ammo, unit.readyRackSize);
        if (window.Game && window.Game.radar && unit.isRevealedToBlue) {
          window.Game.radar.spawnCombatText(unit.x, unit.y, `${unit.name} RACK RELOADED`, '#fbbf24');
        }
      }
    }

    const mods = this.getAttackModifiers(unit);
    if (unit.isJammerStation) {
      const rawEff = (unit.requiresPower && !mods.isPowerActive) ? unit.baseJamEfficiency * 0.45 : unit.baseJamEfficiency;
      unit.jamEfficiency = (unit.emconTimer > 0) ? 0.0 : Math.min(0.85, rawEff * mods.jamEfficiencyMult);
    }
    if (unit.emconTimer > 0) return;

    if (unit.canInterceptMissiles && unit.pdCooldown <= 0) this.handlePointDefense(unit, enemyMissilesList, mods);
    if ((unit.isAaaGun || unit.type === 'PANTSIR') && unit.aaaCooldown <= 0) this.handleAaaFire(unit, enemyAircraftList, mods);
    if (unit.canAttack && unit.missileSpec) {
      this.handleSamFire(unit, dt, enemyAircraftList, spawnedMissiles, radarArrayActive, mods);
    }
  }

  static handleSamFire(unit, dt, enemyAircraftList, spawnedMissiles, radarArrayActive, mods) {
    const game = window.Game;
    const isAttackMode = (game.scenarioMode === 'ATTACK');
    const is2P = (game.playerMode === '2P');

    if (unit.ammo <= 0 || unit.readyAmmo <= 0 || unit.rackReloadTimer > 0) {
      unit.targetAcquireTimers.clear();
      return;
    }

    let effectiveRange = unit.rangeKm;
    if (unit.requiresEwCue) {
      if (isAttackMode) { if (!mods.hasEwCue) effectiveRange *= 0.48; }
      else if (!radarArrayActive) return;
    }

    const activeFloorFt = mods.hasLowAltCue ? unit.cuedMinAltFt : unit.minAltFt;
    const engageLimit = effectiveRange * (isAttackMode ? mods.ambushRatio : 1.0);
    const activeFromBattery = spawnedMissiles.filter(m => m && m.active && m.source && m.source.id === unit.id);
    let chosen = null, chosenDist = 9999;

    for (const plane of enemyAircraftList) {
      if (!plane || plane.hp <= 0.05 || plane.isCivilian || plane.groundPhase) continue;
      if (!is2P && !isAttackMode && !plane.isDecoyDrone && !plane.isIdentifiedBy(unit.team)) continue;

      const dist = Math.hypot(plane.x - unit.x, plane.y - unit.y);
      const planeAlt = typeof plane.altFt === 'number' ? plane.altFt : 28000;
      const tfrMaskFt = (plane.hasTfrMasking && planeAlt <= 10000) ? plane.tfrFloorBonusFt : 0;
      const bestJam = (unit.isEmitter && unit.missileSpec.seeker === 'ARH') ? this.getActiveJammingAgainstSurface(unit, plane) : 0.0;
      const jamRangeMult = 1.0 - Math.min(0.45, bestJam * 0.55);
      const rcsFactor = Math.max(0.45, Math.min(1.0, Math.pow(Math.max(0.0005, plane.effectiveRcs), 0.16)));

      const inEnvelope = (planeAlt >= activeFloorFt + tfrMaskFt) && (dist <= engageLimit * rcsFactor * jamRangeMult);
      const prevTimer = unit.targetAcquireTimers.get(plane.id) || 0.0;
      const nextTimer = inEnvelope ? (prevTimer + dt) : Math.max(0, prevTimer - dt * 0.6);
      if (nextTimer > 0) unit.targetAcquireTimers.set(plane.id, nextTimer);
      else unit.targetAcquireTimers.delete(plane.id);

      const reqDelay = mods.samReactionDelaySec * (1.0 + bestJam * 0.65);
      const alreadyEngaged = activeFromBattery.some(m => m.target && m.target.id === plane.id);
      if (inEnvelope && nextTimer >= reqDelay && !alreadyEngaged && dist < chosenDist) {
        chosen = plane;
        chosenDist = dist;
      }
    }

    if (!chosen || unit.fireCooldown > 0 || activeFromBattery.length >= unit.maxActiveMissiles) return;

    spawnedMissiles.push(new MissileEntity(Object.assign({}, unit.missileSpec), unit, chosen));
    unit.ammo = Math.max(0, unit.ammo - 1);
    unit.readyAmmo = Math.max(0, unit.readyAmmo - 1);
    unit.fireCooldown = unit.cooldownMax * mods.samCooldownMult;
    unit.targetAcquireTimers.set(chosen.id, 0.0);

    if (unit.readyAmmo <= 0 && unit.ammo > 0) {
      unit.rackReloadTimer = unit.rackReloadSec * mods.samCooldownMult;
      if (game.radar && unit.isRevealedToBlue) {
        game.radar.spawnCombatText(unit.x, unit.y, `${unit.name} RELOADING RACK`, '#fbbf24');
      }
    }
    if (unit.isEmitter) { unit.hasEmitted = true; unit.isRevealedToBlue = true; }
    if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
  }

  static handleAaaFire(unit, enemyAircraftList, mods) {
    const range = unit.aaaRangeKm;
    if (range <= 0 || unit.aaaCooldown > 0) return;

    for (const plane of enemyAircraftList) {
      if (!plane || plane.hp <= 0.05 || plane.isCivilian || plane.groundPhase || plane.isDecoyDrone) continue;
      if (plane.altFt > unit.aaaMaxAltFt) continue;

      const dist = Math.hypot(plane.x - unit.x, plane.y - unit.y);
      if (dist <= range) {
        const altPenalty = plane.altFt > 9000 ? 0.65 : 1.0;
        const speedEvade = Math.max(0.25, Math.min(0.95, 0.72 / Math.max(0.55, plane.speed)));
        const hitChance = Math.min(0.78, (0.54 * altPenalty * speedEvade) + mods.aaaHitBonus);
        const didHit = Math.random() <= hitChance;
        let dmg = 0;

        if (didHit) {
          dmg = unit.aaaDamage * (plane.spec.category === 'STRIKE' ? 0.65 : 1.0) * (1.0 - plane.aaaResistance);
          const wasAlive = plane.hp > 0.05;
          plane.takeDamage(dmg);
          plane.applyActionStress(0.08);
          if (window.Game.radar) {
            window.Game.radar.spawnGunTracer(unit.x, unit.y, plane.x, plane.y, '#ef4444');
            window.Game.radar.spawnCombatText(plane.x, plane.y, `AAA FLAK -${dmg.toFixed(1)}HP`, '#f97316');
          }
          if (wasAlive && plane.hp <= 0.05 && window.Game.simulation) {
            window.Game.simulation.recordKillEvent(unit.team, plane, unit, { weapon: { name: unit.name }, isSalvo: false, salvoCount: 1 });
          }
        } else if (window.Game.radar) {
          window.Game.radar.spawnGunTracer(unit.x, unit.y, plane.x + (Math.random() - 0.5), plane.y + (Math.random() - 0.5), '#f97316');
        }

        if (window.Game.inspection && window.Game.inspection.enabled) {
          window.Game.inspection.recordEvent('AAA FLAK FIRE', `${unit.name} ${didHit ? 'hit' : 'fired at'} ${window.formatAircraftDisplayName(plane)}`, unit, plane, {
            distanceKm: dist, targetAltitudeFt: plane.altFt, hitProbability: hitChance, result: didHit ? `HIT (-${dmg.toFixed(1)} HP)` : 'MISSED', armorMitigation: plane.aaaResistance
          });
        }
        unit.isRevealedToBlue = true;
        unit.identifiedByBlue = true;
        unit.aaaCooldown = unit.aaaCooldownMax * mods.aaaCooldownMult;
        if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
        break;
      }
    }
  }

  static handlePointDefense(unit, enemyMissilesList, mods) {
    const pdRange = (unit.category === 'CIWS') ? Math.min(unit.rangeKm, 7.5) : Math.min(unit.rangeKm, 9.5);
    const incoming = enemyMissilesList.filter(m =>
      m.team !== unit.team && m.active &&
      (!m._pdTestedBy || !m._pdTestedBy.has(unit.id)) &&
      Math.hypot(m.x - unit.x, m.y - unit.y) <= pdRange
    );
    if (incoming.length === 0) return;

    const targetMsl = incoming[0];
    if (targetMsl.speed >= 5.0) return;
    if (!targetMsl._pdTestedBy) targetMsl._pdTestedBy = new Set();
    targetMsl._pdTestedBy.add(unit.id);

    let interceptProb = mods.ciwsAccuracy;
    if (targetMsl.speed >= 2.6) interceptProb *= 0.45;
    if (targetMsl.isStealthMissile) interceptProb *= 0.55;

    const basePdCycle = (unit.category === 'CIWS') ? unit.cooldownMax : 3.6;
    unit.pdCooldown = basePdCycle * mods.ciwsCooldownMult;
    unit.isRevealedToBlue = true;

    const intercepted = Math.random() <= interceptProb;
    if (window.Game.inspection && window.Game.inspection.enabled) {
      window.Game.inspection.recordEvent('POINT DEFENSE', `${unit.name} ${intercepted ? 'intercepted' : 'failed to intercept'} ${targetMsl.weapon.name}`, unit, targetMsl.target || null, {
        weapon: targetMsl.weapon.name, weaponSpeedMach: targetMsl.speed, stealthMunition: Boolean(targetMsl.isStealthMissile), interceptProbability: interceptProb, intercepted
      });
    }

    if (intercepted) {
      targetMsl.active = false; targetMsl.isDead = true;
      if (window.Game.stats) window.Game.stats.defensiveIntercepts += 1;
      if (window.Game.simulation) window.Game.simulation.logScoreEvent(unit.team, window.CONFIG.VP_MISSILE_INTERCEPT, `${unit.name} intercepted ${targetMsl.weapon.name}`);
      if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(false);
      if (window.Game.radar) {
        window.Game.radar.spawnExplosionFX(targetMsl.x, targetMsl.y, false);
        window.Game.radar.spawnCombatText(targetMsl.x, targetMsl.y, `${unit.category === 'CIWS' ? 'CIWS' : 'SHORAD'} INTERCEPT`, '#38bdf8');
        window.Game.radar.spawnShockwave(targetMsl.x, targetMsl.y, '#38bdf8', 24);
      }
    } else if (window.Game.radar) {
      window.Game.radar.spawnGunTracer(unit.x, unit.y, targetMsl.x, targetMsl.y, '#fbbf24');
    }
  }

  static triggerSecondaryExplosion(sourceUnit) {
    const game = window.Game;
    if (!game || !sourceUnit.secondaryBlastRadiusKm) return;
    const radius = sourceUnit.secondaryBlastRadiusKm, dmg = sourceUnit.secondaryBlastDamage;
    if (game.inspection && game.inspection.enabled) {
      game.inspection.recordEvent('SECONDARY BLAST', `${sourceUnit.name} detonated (${radius} km blast, ${dmg} HP)`, sourceUnit, null, { radiusKm: radius, damageHp: dmg });
    }
    if (game.radar) {
      game.radar.spawnExplosionFX(sourceUnit.x, sourceUnit.y, true);
      game.radar.spawnShockwave(sourceUnit.x, sourceUnit.y, '#f97316', 55);
      game.radar.spawnCombatText(sourceUnit.x, sourceUnit.y, 'SECONDARY DETONATION!', '#f97316');
    }
    for (const other of game.surfaceUnits) {
      if (!other || other.id === sourceUnit.id || other.hp <= 0.05 || other.isIndestructible) continue;
      if (Math.hypot(other.x - sourceUnit.x, other.y - sourceUnit.y) <= radius) {
        const wasAlive = other.hp > 0.05;
        other.hp = Math.max(0, other.hp - dmg);
        if (other.hp <= 0.05) other.hp = 0;
        if (wasAlive && other.hp <= 0 && game.simulation) game.simulation.recordKillEvent('friendly', other, sourceUnit, { weapon: { name: 'Secondary Blast' } });
      }
    }
  }
}

window.SurfaceCombatSystem = SurfaceCombatSystem;
