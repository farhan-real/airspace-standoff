/**
 * js/systems/combat/ai/tactics.js - Tactical AI Missile Decision Engine
 * Integrates AIR_DOCTRINES firing thresholds, target priorities, decoy releases, and RTB discipline.
 */

class AIMissileTactics {
  static selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey, profile, airDoctrine) {
    return AISalvoPlanner.selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey, profile, airDoctrine);
  }

  static evaluateShooterWeapons(shooter, rawAirTargets, bunkers, profile, clouds, diffKey, allMissiles, airDoctrine) {
    if (!shooter || !shooter.equippedWeapons || shooter.equippedWeapons.length === 0) return { isBingo: true, plan: null };

    const availablePylons = [];
    for (let i = 0; i < shooter.equippedWeapons.length; i++) {
      const item = shooter.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isTargetingPod &&
          !item.weapon.isDecoy && !item.weapon.isDecoyDrone && !item.weapon.isGunpod && item.weapon.category !== 'GUN') {
        availablePylons.push({ index: i, item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return { isBingo: true, plan: null };

    const airTargets = AISalvoPlanner.filterCandidateTargets(shooter, rawAirTargets, profile, diffKey);
    const fireTiers = {
      CADET:     { minPk: 28, reservePkBoost: 4,  rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.45, maxOffAngle: Math.PI / 8.0 },
      BUFFER:    { minPk: 36, reservePkBoost: 6,  rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.38, maxOffAngle: Math.PI / 7.5 },
      VETERAN:   { minPk: 44, reservePkBoost: 8,  rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.30, maxOffAngle: Math.PI / 7.0 },
      ESCALATED: { minPk: 50, reservePkBoost: 9,  rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.25, maxOffAngle: Math.PI / 6.5 },
      ELITE:     { minPk: 54, reservePkBoost: 10, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.20, maxOffAngle: Math.PI / 6.0 },
      FORWARD:   { minPk: 58, reservePkBoost: 11, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.16, maxOffAngle: Math.PI / 5.5 },
      ACE:       { minPk: 61, reservePkBoost: 12, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.12, maxOffAngle: Math.PI / 5.0 },
      FORTIFIED: { minPk: 64, reservePkBoost: 12, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.10, maxOffAngle: Math.PI / 4.8 },
      MASTER:    { minPk: 67, reservePkBoost: 13, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.08, maxOffAngle: Math.PI / 4.5 },
      LEGEND:    { minPk: 70, reservePkBoost: 14, rangeRatio: profile.engagementRangeRatio, hesitateChance: 0.04, maxOffAngle: Math.PI / 4.0 }
    };
    const tier = fireTiers[diffKey];
    if (!shooter.isAce && Math.random() < tier.hesitateChance) return { isBingo: false, plan: null };

    const { totalAmmoLeft, ammoFraction } = AISalvoPlanner.getAmmoReserveInfo(shooter, availablePylons);
    const reserveRatio = Math.max(0.05, Math.min(0.65, (profile.reserveRatio || 0.30) + (airDoctrine ? (airDoctrine.reserveBias || 0) : 0)));
    const hostileFleet = (window.Game && window.Game.hostileAircraft) || [];
    const dyn = AISalvoPlanner.computeDynamicFireModifiers(shooter, totalAmmoLeft, ammoFraction, allMissiles, airTargets, hostileFleet, diffKey, airDoctrine);
    const inReserve = (totalAmmoLeft <= 2 || (ammoFraction <= reserveRatio && !dyn.inDanger && !dyn.isLastStand));

    const docId = airDoctrine ? airDoctrine.id : 'BALANCED';
    const role = shooter.tacticalRole || (shooter.spec && shooter.spec.category === 'EW' ? 'SEAD' : 'SWEEP');
    let possibleTargets = [];

    if (role === 'SEAD' || docId === 'RADAR_JAMMING') {
      const seadEmitters = bunkers.filter(s => s.type === 'RADAR_ARRAY' || s.type === 'EW_JAMMER' || s.type === 'S-400' || s.type === 'PANTSIR' || s.type === 'RADAR_VAN');
      const ewAir = airTargets.filter(t => t.jamEfficiency > 0 || (t.spec && t.spec.category === 'EW'));
      possibleTargets = ewAir.concat(seadEmitters).concat(airTargets.filter(t => !ewAir.includes(t))).concat(bunkers.filter(s => !seadEmitters.includes(s)));
    } else if (role === 'STRIKE') {
      const primaryBunkers = bunkers.filter(s => s.type === 'BUNKER' || s.type === 'FUEL_DEPOT');
      possibleTargets = primaryBunkers.concat(bunkers.filter(s => !primaryBunkers.includes(s))).concat(airTargets);
    } else {
      possibleTargets = airTargets.concat(bunkers);
    }
    if (possibleTargets.length === 0) return { isBingo: false, plan: null };

    const reservePkAdd = inReserve ? tier.reservePkBoost : 0;
    const requiredPk = Math.max(24, Math.min(86, tier.minPk + reservePkAdd + dyn.pkDelta + (airDoctrine ? airDoctrine.minPkOffset : 0)));
    const reserveRangeMult = inReserve ? 0.84 : 1.0;
    const rangeRatio = Math.max(0.45, Math.min(0.95, tier.rangeRatio * reserveRangeMult * (airDoctrine ? airDoctrine.engageRangeMult : 1.0)));
    const maxInboundCap = Math.max(1, Math.min(4, (profile.maxInboundPerTarget || 2) + (airDoctrine ? (airDoctrine.inboundCapBias || 0) : 0)));
    let bestScore = -999, bestMatch = null;

    for (const pylon of availablePylons) {
      const w = pylon.weapon;
      const isA2G = Boolean(w.category === 'A2G' || w.isBunkerCracker);

      for (const tgt of possibleTargets) {
        if (!tgt || tgt.hp <= 0.05 || tgt.isCivilian) continue;
        const isSurface = Boolean(tgt.type && !tgt.spec && !tgt.isCivilian);
        if (isA2G !== isSurface) continue;

        const inboundsCount = AISalvoPlanner.countActiveInbounds(tgt, allMissiles, shooter.team);
        if (inboundsCount >= maxInboundCap) continue;

        const effectiveHp = AISalvoPlanner.estimateTargetEffectiveHp(tgt, allMissiles, shooter.team, diffKey, profile);
        if (effectiveHp <= 0.05 && diffKey !== 'CADET') continue;

        const dist = Math.hypot(tgt.x - shooter.x, tgt.y - shooter.y);
        const effRangeRatio = shooter.isAce ? 0.70 : rangeRatio;
        const maxRange = w.rangeKm * effRangeRatio;
        if (dist > maxRange || dist < (w.minRangeKm || 1.0)) continue;

        const angleToTarget = Math.atan2(tgt.y - shooter.y, tgt.x - shooter.x);
        let offBoresight = Math.abs(shooter.heading - angleToTarget);
        while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

        const isHOBS = (w.trait === 'HOBS_VANE' || w.trait === 'ALL_ASPECT_BURST' || w.trait === 'REAR_ENGAGE' || w.id === 'IRIS-T');
        const maxAngle = shooter.isAce ? (Math.PI / 3.0) : tier.maxOffAngle;
        if (!isSurface && !isHOBS && offBoresight > maxAngle) continue;

        const pkResult = Physics.calcPk(w, shooter, tgt, clouds);
        const pk = pkResult.pk || 0;
        const distPkGate = (dist > w.rangeKm * 0.78 && !['CADET', 'BUFFER'].includes(diffKey)) ? (requiredPk + 10) : requiredPk;
        if (pk < distPkGate) continue;

        let score = pk - (inboundsCount * 16);
        const sweetMin = w.sweetSpotMin || (w.rangeKm * 0.20);
        const sweetMax = w.sweetSpotMax || (w.rangeKm * 0.65);
        if (dist >= sweetMin && dist <= sweetMax) score += 20;
        if (dist <= 22.0 && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT')) score += 20;
        else if (dist >= 30.0 && w.seeker === 'ARH') score += 18;

        if (docId === 'STANDOFF' && dist >= 32.0 && w.rangeKm >= 75.0) score += 20;
        if (docId === 'AGGRESSIVE' && dist <= 32.0) score += 18;
        if (docId === 'STEALTH_AMBUSH' && (w.isStealthMissile || w.seeker === 'IIR' || w.seeker === 'EO')) score += 22;
        if (docId === 'RADAR_JAMMING' && (tgt.jamEfficiency > 0 || (tgt.spec && tgt.spec.category === 'EW') || tgt.isEmitter)) score += 25;

        if (role === 'DOGFIGHT' && (w.seeker === 'IIR' || w.seeker === 'EO' || w.trait === 'HOBS_VANE')) score += 22;
        if (role === 'INTERCEPT' && dist >= 25.0 && w.speedMach >= 3.5) score += 20;
        if (role === 'SWARM' && w.trait === 'SWARM_RIPPLE') score += 20;
        if (role === 'ESCORT' && tgt.radarLockedTarget && tgt.radarLockedTarget.team === shooter.team) score += 28;
        if (dyn.inDanger) {
          if (tgt.radarLockedTarget && tgt.radarLockedTarget.id === shooter.id) score += 24;
          if (dist <= 22.0) score += 20;
        }
        if (tgt.isFlightLead) score += 18;
        if (tgt.hp <= 2) score += 16;
        if (diffKey === 'CADET' || diffKey === 'BUFFER') score += (Math.random() * 20 - 10);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { pylon, weapon: w, target: tgt, pk, score, effectiveHp, dist, offBoresight, rangeRatio: effRangeRatio, maxAngle, dyn };
        }
      }
    }

    if (!bestMatch) return { isBingo: false, plan: null };
    const salvoPlan = AISalvoPlanner.calculateSalvoComposition(bestMatch, availablePylons, diffKey, shooter, profile, airDoctrine);
    salvoPlan.dyn = dyn;
    return { isBingo: false, plan: salvoPlan };
  }

  static executeEngagements(commander, shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles, airDoctrine) {
    if (airDoctrine && airDoctrine.id === 'DRONE_SWARM' && shooter.hasMaldDecoy && shooter.maldDecoyCharges > 0 && airTargets.length > 0) {
      const nearestDist = Math.min(...airTargets.map(t => Math.hypot(t.x - shooter.x, t.y - shooter.y)));
      if (nearestDist <= 68.0) shooter.deployDecoyDrone();
    }

    const res = this.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles, airDoctrine);
    if (res.isBingo && !shooter.isRTB) {
      if (shooter.gunAmmo && shooter.gunAmmo > 0) return false;
      const rtbChances = { CADET: 0.15, BUFFER: 0.22, VETERAN: 0.30, ESCALATED: 0.40, ELITE: 0.50, FORWARD: 0.58, ACE: 0.65, FORTIFIED: 0.72, MASTER: 0.80, LEGEND: 0.90 };
      const rtbProb = Math.max(0, Math.min(0.98, rtbChances[diffKey] + (airDoctrine ? airDoctrine.rtbThresholdBias : 0)));
      if (Math.random() < rtbProb) shooter.orderRTB();
      return false;
    }

    if (!res.plan || !res.plan.pylonsToFire || res.plan.pylonsToFire.length === 0) return false;
    const tgt = res.plan.target;
    let anyFired = false;

    for (const pylon of res.plan.pylonsToFire) {
      if (commander.game.tokenBucketRed < tokenCost || pylon.item.ammo <= 0) break;
      pylon.item.ammo--;
      commander.game.tokenBucketRed = Math.max(0, commander.game.tokenBucketRed - tokenCost);
      anyFired = true;

      if (pylon.weapon.isLaser) {
        if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
        const wasAlive = tgt.hp > 0.05;
        if (tgt.isGhost || tgt.isDecoyDrone) tgt.takeDamage(pylon.weapon.damage);
        else if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) tgt.takeDamage(pylon.weapon.damage, false);
        else if (tgt.isCivilian && typeof tgt.takeDamage === 'function') tgt.takeDamage(pylon.weapon.damage, shooter, pylon.weapon, true);
        else {
          tgt.hp = Math.max(0, tgt.hp - pylon.weapon.damage);
          if (tgt.hp <= 0.05) tgt.hp = 0;
          if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.20);
        }
        if (commander.game.radar) {
          commander.game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
          commander.game.radar.spawnCombatText(tgt.x, tgt.y, `LASER -${pylon.weapon.damage}HP`, '#f43f5e');
        }
        if (wasAlive && tgt.hp <= 0.05 && commander.game.simulation && !tgt.isCivilian) {
          tgt.hp = 0;
          commander.game.simulation.recordKillEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, isSalvo: false, salvoCount: 1 });
        } else if (wasAlive && tgt.hp > 0.05 && commander.game.simulation && commander.game.simulation.scoring && !tgt.isCivilian && !tgt.isIndestructible) {
          commander.game.simulation.scoring.recordHitEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, damage: pylon.weapon.damage });
        }
      } else if (!pylon.weapon.isGunpod && pylon.weapon.category !== 'GUN') {
        commander.game.missiles.push(new MissileEntity(pylon.weapon, shooter, tgt));
        if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
      }
    }
    if (anyFired) {
      const cdMult = (res.plan && res.plan.dyn) ? res.plan.dyn.cooldownMult : 1.0;
      const docCdMult = (airDoctrine && typeof airDoctrine.cooldownMult === 'number') ? airDoctrine.cooldownMult : 1.0;
      shooter._aiFireCooldown = Math.max(1.2, (profile.shotCooldownSec || 3.5) * docCdMult * cdMult);
    }
    shooter.recalculateWeight();
    return anyFired;
  }
}

window.AIMissileTactics = AIMissileTactics;
