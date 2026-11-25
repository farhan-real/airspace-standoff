/**
 * js/systems/combat/ai/navigation.js - AI Unit Navigation & Spatial Steering Handler
 * Executes separated Air Combat Doctrines and Attack CAP postures cleanly over spatial positioning.
 */

class AINavigationHandler {
  static getDoctrineSteering(game, unit, target, dist, airDoctrine, atkDoctrine) {
    const mapW = window.CONFIG.THEATER_WIDTH_KM;
    const mapH = window.CONFIG.THEATER_HEIGHT_KM;
    const isHostile = (unit.team === 'hostile');

    if (atkDoctrine) {
      if (atkDoctrine.capPosture === 'GUARD_OBJECTIVES' && (!target || dist > 62.0)) {
        const objs = (game.surfaceUnits || []).filter(s => s.team === unit.team && s.isPrimaryObjective && s.hp > 0.05);
        if (objs.length > 0) {
          const anchor = objs[0];
          const orbitAng = Math.atan2(anchor.y - unit.y, anchor.x - unit.x) + (Math.hypot(anchor.x - unit.x, anchor.y - unit.y) < 18.0 ? 1.4 : 0.0);
          return { heading: orbitAng, throttle: 0.60 };
        }
      } else if (atkDoctrine.capPosture === 'INTERCEPT_FORWARD') {
        const aimX = target ? target.x : mapW * 0.42;
        const aimY = target ? target.y : mapH * 0.50;
        return { heading: Math.atan2(aimY - unit.y, aimX - unit.x), throttle: 0.90 };
      } else if (atkDoctrine.capPosture === 'AMBUSH' && target && target.x < mapW * 0.48) {
        const edgeY = unit.y < mapH * 0.5 ? 20.0 : (mapH - 20.0);
        return { heading: Math.atan2(edgeY - unit.y, (mapW * 0.65) - unit.x), throttle: 0.52 };
      }
      return null;
    }

    if (!airDoctrine || airDoctrine.id === 'BALANCED') return null;

    if (airDoctrine.id === 'RADAR_JAMMING') {
      const isEwCraft = Boolean((unit.spec && unit.spec.category === 'EW') || unit.isEW || (unit.jamEfficiency && unit.jamEfficiency >= 0.25));
      if (isEwCraft && target) {
        const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
        if (dist < 36.0) return { heading: directAngle + Math.PI * 0.78, throttle: 0.70 };
        if (dist <= 54.0) return { heading: directAngle + (Math.PI / 2), throttle: 0.58 };
        return { heading: directAngle, throttle: 0.65 };
      }
      return null;
    }

    if (airDoctrine.id === 'STEALTH_AMBUSH' && target && dist > 38.0) {
      const corridorY = unit.y < mapH * 0.5 ? 12.0 : (mapH - 12.0);
      return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.50 };
    }

    if (airDoctrine.id === 'STANDOFF' && target) {
      const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
      if (dist < 44.0) return { heading: directAngle + Math.PI * 0.80, throttle: 0.86 };
      if (dist <= 68.0) {
        const crankSign = (unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
        return { heading: directAngle + crankSign * 1.05, throttle: 0.65 };
      }
      return { heading: directAngle, throttle: 0.82 };
    }

    if (airDoctrine.id === 'AGGRESSIVE' && target) {
      const leadAng = Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed, target.x, target.y, target.heading || 0, target.speed || 0.8);
      return { heading: leadAng, throttle: dist > 22.0 ? 0.96 : 0.82 };
    }

    if (airDoctrine.id === 'DRONE_SWARM' && target) {
      const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
      if (unit.spec && unit.spec.isDrone) {
        const spreadSign = (unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
        const offset = dist > 24.0 ? (spreadSign * 0.28) : 0.0;
        return { heading: directAngle + offset, throttle: 0.92 };
      }
      if (dist < 40.0) return { heading: directAngle + Math.PI * 0.70, throttle: 0.68 };
      return { heading: directAngle, throttle: 0.65 };
    }

    if (airDoctrine.id === 'DEFENSIVE_HOLD') {
      const defensiveAnchorX = isHostile ? (mapW * 0.76) : (mapW * 0.24);
      const enemyCrossedLine = target && (isHostile ? (target.x >= mapW * 0.56) : (target.x <= mapW * 0.44));
      if (!target || (!enemyCrossedLine && dist > 52.0)) {
        const homeDist = Math.hypot(defensiveAnchorX - unit.x, (mapH * 0.5) - unit.y);
        const patrolAngle = homeDist > 18.0
          ? Math.atan2((mapH * 0.5) - unit.y, defensiveAnchorX - unit.x)
          : ((unit.age || 0) * 0.22 + (isHostile ? Math.PI : 0));
        return { heading: patrolAngle, throttle: 0.52 };
      }
    }

    return null;
  }

  static handleNavigation(aiCommander, hostile, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused, airDoctrine, atkDoctrine, untrackedAirContacts = [], allMissiles = []) {
    if (!hostile || hostile.activeManeuverTimer > 0 || hostile.hp <= 0.05) return;

    if (hostile.isRTB) {
      hostile.radarLockedTarget = null;
      if (['FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey) || (airDoctrine && airDoctrine.id === 'DEFENSIVE_HOLD')) {
        const egressHeading = aiCommander.planning.getCoveredEgressHeading(hostile);
        let diff = egressHeading - hostile.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        hostile.heading += Math.max(-1.5 * dt, Math.min(1.5 * dt, diff));
      }
      return;
    }

    if (aiCommander.planning.isHesitating(hostile.id)) {
      hostile.engineAlpha = 0.40;
      return;
    }

    const role = hostile.tacticalRole || (hostile.spec && hostile.spec.category === 'EW' ? 'SEAD' : 'SWEEP');
    const a2gOrdnance = (hostile.equippedWeapons || []).filter(it => it && it.ammo > 0 && it.weapon && (it.weapon.category === 'A2G' || it.weapon.isBunkerCracker || it.weapon.isAntiRadiation));
    const hasA2GAmmo = a2gOrdnance.length > 0;
    const maxA2GRangeKm = a2gOrdnance.reduce((m, it) => Math.max(m, it.weapon.rangeKm || 0), 0);

    let target = null;
    if (role === 'SEAD') {
      const hostileRadars = (hasA2GAmmo ? (aiCommander.game.surfaceUnits || []) : []).filter(s =>
        s.team !== hostile.team && s.hp > 0.05 &&
        (s.isEmitter || s.type === 'EW_JAMMER' || s.category === 'EW_RADAR' || s.category === 'LR_SAM' || s.category === 'MR_SAM')
      );
      if (hostileRadars.length > 0) {
        target = hostileRadars.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), hostileRadars[0]);
      } else if (candidateAirTargets.length > 0) {
        target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
      }
    } else if (role === 'STRIKE') {
      const strikeTargets = (hasA2GAmmo ? (aiCommander.game.surfaceUnits || []) : []).filter(s => s.team !== hostile.team && s.hp > 0.05 && (s.isPrimaryObjective || s.type === 'BUNKER' || s.type === 'FUEL_DEPOT' || !s.isIndestructible));
      if (strikeTargets.length > 0) {
        target = strikeTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), strikeTargets[0]);
      } else if (candidateAirTargets.length > 0) {
        target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
      }
    } else if (candidateAirTargets.length > 0) {
      let pool = candidateAirTargets;
      let refUnit = hostile;
      if (role === 'SNIPER') {
        const priorityTargets = candidateAirTargets.filter(t => t.isFlightLead || t.isAce || (t.spec && t.spec.category === 'STRIKE'));
        if (priorityTargets.length > 0) pool = priorityTargets;
      } else if (role === 'ESCORT') {
        const friendlies = (aiCommander.game.hostileAircraft || []).filter(h => h && h.id !== hostile.id && h.hp > 0.05);
        const vip = friendlies.find(h => h.isAce || h.isFlightLead) || friendlies.find(h => h.tacticalRole === 'STRIKE' || h.tacticalRole === 'SEAD');
        if (vip) refUnit = vip;
      }
      const nearest = pool.reduce((best, cur) => (Math.hypot(cur.x - refUnit.x, cur.y - refUnit.y) < Math.hypot(best.x - refUnit.x, best.y - refUnit.y) ? cur : best), pool[0]);
      const prevLock = hostile.radarLockedTarget && pool.find(t => t.id === hostile.radarLockedTarget.id);
      if (prevLock) {
        const prevDist = Math.hypot(prevLock.x - hostile.x, prevLock.y - hostile.y);
        const nearDist = Math.hypot(nearest.x - hostile.x, nearest.y - hostile.y);
        target = (nearDist + 2.5 < prevDist) ? nearest : prevLock;
      } else {
        target = nearest;
      }
    }

    const wingmanOffset = aiCommander.planning.getWingmanOffset(hostile, profile);
    const navTiers = {
      CADET:     { turnMult: 0.45, throttle: 0.50, overshootDist: 6.5, overshootChance: 0.55 },
      BUFFER:    { turnMult: 0.50, throttle: 0.52, overshootDist: 6.2, overshootChance: 0.48 },
      VETERAN:   { turnMult: 0.55, throttle: 0.55, overshootDist: 6.0, overshootChance: 0.42 },
      ESCALATED: { turnMult: 0.60, throttle: 0.58, overshootDist: 5.6, overshootChance: 0.36 },
      ELITE:     { turnMult: 0.65, throttle: 0.62, overshootDist: 5.2, overshootChance: 0.30 },
      FORWARD:   { turnMult: 0.70, throttle: 0.66, overshootDist: 4.9, overshootChance: 0.25 },
      ACE:       { turnMult: 0.74, throttle: 0.70, overshootDist: 4.6, overshootChance: 0.20 },
      FORTIFIED: { turnMult: 0.78, throttle: 0.73, overshootDist: 4.3, overshootChance: 0.17 },
      MASTER:    { turnMult: 0.82, throttle: 0.75, overshootDist: 4.0, overshootChance: 0.14 },
      LEGEND:    { turnMult: 0.88, throttle: 0.80, overshootDist: 3.6, overshootChance: 0.08 }
    };
    const tier = navTiers[diffKey];

    if (profile.verticalCombat) {
      const targetAlt = aiCommander.planning.getPlannedAltitude(hostile, profile, diffKey, airDoctrine, target);
      if (Math.abs(hostile.altFt - targetAlt) > 3500) hostile.targetAltFt = targetAlt;
    }

    const dist = target ? Math.hypot(target.x - hostile.x, target.y - hostile.y) : 999.0;
    const docMove = this.getDoctrineSteering(aiCommander.game, hostile, target, dist, airDoctrine, atkDoctrine);
    const throttleBias = airDoctrine ? airDoctrine.throttleBias : 0.0;

    const trackOrder = aiCommander.planning.getTrackAcquisitionVector(hostile, candidateAirTargets, untrackedAirContacts, allMissiles, diffKey);
    if (!target) {
      if (trackOrder) {
        hostile.radarLockedTarget = trackOrder.target;
        let tDiff = trackOrder.heading - hostile.heading;
        while (tDiff < -Math.PI) tDiff += Math.PI * 2;
        while (tDiff > Math.PI) tDiff -= Math.PI * 2;
        const turnCapSearch = hostile.getEffectiveAgility() * tier.turnMult * (isFocused ? 1.0 : 0.72);
        hostile.heading += Math.max(-turnCapSearch * dt, Math.min(turnCapSearch * dt, tDiff));
        hostile.engineAlpha = Math.max(0.25, Math.min(1.0, trackOrder.throttle + throttleBias));
        return;
      }
      hostile.radarLockedTarget = null;
      let idleHeading = Math.PI;
      if (docMove) idleHeading = docMove.heading;
      else if (wingmanOffset) idleHeading = Math.atan2(wingmanOffset.y - hostile.y, wingmanOffset.x - hostile.x);
      let diff = idleHeading - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      hostile.heading += Math.max(-0.8 * dt, Math.min(0.8 * dt, diff));
      hostile.engineAlpha = Math.max(0.25, Math.min(1.0, (docMove ? docMove.throttle : tier.throttle) + throttleBias));
      return;
    }
    if (trackOrder && trackOrder.reason === 'F-POLE MIDCOURSE SUPPORT') {
      target = trackOrder.target;
    }

    hostile.radarLockedTarget = target;
    let desiredHeading = Math.atan2(target.y - hostile.y, target.x - hostile.x);
    let desiredThrottle = tier.throttle;

    if (trackOrder && trackOrder.reason === 'F-POLE MIDCOURSE SUPPORT') {
      desiredHeading = trackOrder.heading;
      desiredThrottle = trackOrder.throttle;
    } else if (docMove) {
      desiredHeading = docMove.heading;
      desiredThrottle = docMove.throttle;
    } else if (role === 'SNIPER') {
      const sniperMove = aiCommander.planning.getSniperVector(hostile, target, dist, diffKey);
      desiredHeading = sniperMove.heading; desiredThrottle = sniperMove.throttle;
    } else if (role === 'INTERCEPT') {
      const interceptMove = aiCommander.planning.getInterceptVector(hostile, target, dist);
      desiredHeading = interceptMove.heading; desiredThrottle = interceptMove.throttle;
    } else if (role === 'DOGFIGHT') {
      const dogfightMove = aiCommander.planning.getDogfightVector(hostile, target, dist, diffKey);
      desiredHeading = dogfightMove.heading; desiredThrottle = dogfightMove.throttle;
    } else if (role === 'SWARM') {
      const swarmMove = aiCommander.planning.getSwarmVector(hostile, target, dist);
      desiredHeading = swarmMove.heading; desiredThrottle = swarmMove.throttle;
    } else if (role === 'SEAD') {
      const seadMove = aiCommander.planning.getSeadVector(hostile, target, dist, candidateAirTargets);
      desiredHeading = seadMove.heading; desiredThrottle = seadMove.throttle;
    } else if (role === 'STRIKE' && hasA2GAmmo) {
      const strikeMove = aiCommander.planning.getStrikeVector(hostile, target, dist, maxA2GRangeKm);
      desiredHeading = strikeMove.heading; desiredThrottle = strikeMove.throttle;
    } else if (role === 'ESCORT') {
      const escortMove = aiCommander.planning.getEscortVector(hostile, target, dist);
      desiredHeading = escortMove.heading; desiredThrottle = escortMove.throttle;
    } else if (role === 'AMBUSH') {
      const ambushMove = aiCommander.planning.getAmbushVector(hostile, target, dist, diffKey);
      desiredHeading = ambushMove.heading; desiredThrottle = ambushMove.throttle;
    } else if (typeof aiCommander.planning.getStatAwareSteering === 'function') {
      const statMove = aiCommander.planning.getStatAwareSteering(hostile, target, dist, diffKey);
      if (statMove) {
        desiredHeading = statMove.heading;
        desiredThrottle = statMove.throttle;
      } else if (dist < tier.overshootDist && Math.abs(hostile.heading - target.heading) > 1.8 && Math.random() < tier.overshootChance) {
        hostile.engineAlpha = Math.max(0.25, Math.min(1.0, tier.throttle + throttleBias));
        return;
      }
    } else if (dist < tier.overshootDist) {
      if (Math.abs(hostile.heading - target.heading) > 1.8 && Math.random() < tier.overshootChance) {
        hostile.engineAlpha = Math.max(0.25, Math.min(1.0, tier.throttle + throttleBias));
        return;
      }
    } else if (wingmanOffset && dist > 20.0) {
      desiredHeading = Math.atan2(wingmanOffset.y - hostile.y, wingmanOffset.x - hostile.x);
    }

    let diff = desiredHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const effAgi = hostile.getEffectiveAgility();
    const turnCap = effAgi * tier.turnMult * (isFocused ? 1.0 : 0.55);
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));

    if (!docMove && role !== 'SNIPER' && role !== 'INTERCEPT' && typeof AIFlightProfile !== 'undefined' && Math.abs(diff) > 0.35) {
      const fpNav = AIFlightProfile.evaluate(hostile, diffKey);
      desiredThrottle = AIFlightProfile.computeCornerThrottle(hostile, fpNav.effMaxMach, fpNav.precision, desiredThrottle);
    }
    hostile.engineAlpha = Math.max(0.25, Math.min(1.0, (isFocused ? desiredThrottle : 0.50) + throttleBias));
  }
}

window.AINavigationHandler = AINavigationHandler;
