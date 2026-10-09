/**
 * AIRSPACE STANDOFF: AI Unit Navigation & Spatial Steering Handler
 */

class AINavigationHandler {
  static handleNavigation(aiCommander, hostile, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused) {
    if (!hostile || hostile.activeManeuverTimer > 0 || hostile.hp <= 0) return;

    if (hostile.isRTB) {
      if (['MASTER', 'LEGEND'].includes(diffKey)) {
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

    let target = null;
    if (role === 'SEAD') {
      const hostileRadars = (aiCommander.game.surfaceUnits || []).filter(s => s.team !== hostile.team && s.hp > 0 && (s.type === 'RADAR_ARRAY' || s.type === 'EW_JAMMER' || s.type === 'S-400' || s.type === 'PANTSIR' || s.type === 'RADAR_VAN'));
      if (hostileRadars.length > 0) {
        target = hostileRadars[0];
      } else if (candidateAirTargets.length > 0) {
        target = candidateAirTargets[0];
      }
    } else if (role === 'STRIKE') {
      const strikeTargets = (aiCommander.game.surfaceUnits || []).filter(s => s.team !== hostile.team && s.hp > 0 && (s.type === 'BUNKER' || s.type === 'FUEL_DEPOT' || !s.isIndestructible));
      if (strikeTargets.length > 0) {
        target = strikeTargets[0];
      } else if (candidateAirTargets.length > 0) {
        target = candidateAirTargets[0];
      }
    } else if (candidateAirTargets.length > 0) {
      if (role === 'SNIPER') {
        const priorityTargets = candidateAirTargets.filter(t => t.isFlightLead || t.isAce || (t.spec && t.spec.category === 'STRIKE'));
        const pool = priorityTargets.length > 0 ? priorityTargets : candidateAirTargets;
        target = pool.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), pool[0]);
      } else if (role === 'DOGFIGHT') {
        target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
      } else {
        target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
      }
    }

    const wingmanOffset = aiCommander.planning.getWingmanOffset(hostile, profile);
    const navTiers = {
      CADET:   { turnMult: 0.45, throttle: 0.50, overshootDist: 6.5, overshootChance: 0.55 },
      VETERAN: { turnMult: 0.55, throttle: 0.55, overshootDist: 6.0, overshootChance: 0.42 },
      ELITE:   { turnMult: 0.65, throttle: 0.62, overshootDist: 5.2, overshootChance: 0.30 },
      ACE:     { turnMult: 0.74, throttle: 0.70, overshootDist: 4.6, overshootChance: 0.20 },
      MASTER:  { turnMult: 0.82, throttle: 0.75, overshootDist: 4.0, overshootChance: 0.14 },
      LEGEND:  { turnMult: 0.88, throttle: 0.80, overshootDist: 3.6, overshootChance: 0.08 }
    };
    const tier = navTiers[diffKey];
    if (!tier) throw new Error(`Navigation tier configuration not found for difficulty: ${diffKey}`);

    if (profile.verticalCombat) {
      const targetAlt = aiCommander.planning.getPlannedAltitude(hostile, profile, diffKey);
      if (Math.abs(hostile.altFt - targetAlt) > 3500) {
        hostile.targetAltFt = targetAlt;
      }
    }

    if (!target) {
      if (wingmanOffset) {
        const offsetHeading = Math.atan2(wingmanOffset.y - hostile.y, wingmanOffset.x - hostile.x);
        let diff = offsetHeading - hostile.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        hostile.heading += Math.max(-0.8 * dt, Math.min(0.8 * dt, diff));
      } else {
        hostile.heading = Math.PI;
      }
      hostile.engineAlpha = tier.throttle;
      return;
    }

    hostile.radarLockedTarget = target;
    const dist = Math.hypot(target.x - hostile.x, target.y - hostile.y);
    let desiredHeading = Math.atan2(target.y - hostile.y, target.x - hostile.x);

    if (role === 'SNIPER' && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diffKey)) {
      const sniperMove = aiCommander.planning.getSniperVector(hostile, target, dist, diffKey);
      desiredHeading = sniperMove.heading;
      hostile.engineAlpha = sniperMove.throttle;
    } else if (role === 'INTERCEPT') {
      const interceptMove = aiCommander.planning.getInterceptVector(hostile, target, dist);
      desiredHeading = interceptMove.heading;
      hostile.engineAlpha = interceptMove.throttle;
    } else if (role === 'DOGFIGHT') {
      const dogfightMove = aiCommander.planning.getDogfightVector(hostile, target, dist);
      desiredHeading = dogfightMove.heading;
      hostile.engineAlpha = dogfightMove.throttle;
    } else if (role === 'AMBUSH' && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diffKey)) {
      const ambushMove = aiCommander.planning.getAmbushVector(hostile, target, dist, diffKey);
      desiredHeading = ambushMove.heading;
      hostile.engineAlpha = ambushMove.throttle;
    } else if (dist < tier.overshootDist) {
      const closingDiff = Math.abs(hostile.heading - target.heading);
      if (closingDiff > 1.8 && Math.random() < tier.overshootChance) {
        hostile.engineAlpha = tier.throttle;
        return;
      }
    } else if (wingmanOffset && dist > 20.0) {
      desiredHeading = Math.atan2(wingmanOffset.y - hostile.y, wingmanOffset.x - hostile.x);
    }

    let diff = desiredHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const effAgi = hostile.getEffectiveAgility();
    const focusAgiScale = isFocused ? 1.0 : 0.55;
    const turnCap = effAgi * tier.turnMult * focusAgiScale;
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));

    const sOpt = hostile.getOptimalCornerSpeed();
    if (role !== 'SNIPER' && role !== 'INTERCEPT') {
      if (['ACE', 'MASTER', 'LEGEND'].includes(diffKey) && Math.abs(diff) > 0.40) {
        if (hostile.speed > sOpt * 1.15) hostile.engineAlpha = 0.40;
        else if (hostile.speed < sOpt * 0.85) hostile.engineAlpha = 0.85;
        else hostile.engineAlpha = 0.65;
      } else {
        hostile.engineAlpha = isFocused ? tier.throttle : 0.50;
      }
    }
  }
}

window.AINavigationHandler = AINavigationHandler;