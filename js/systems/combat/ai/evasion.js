/**
 * AIRSPACE STANDOFF: Tactical AI Evasion & Evasive Maneuver Subsystem
 * Integrates AIR_DOCTRINES notch and countermeasure biases alongside Ace evasion profiles.
 */

class AIEvasionHandler {
  static handleDefensiveBehavior(hostile, profile, diffKey, dt, missiles, isFocused = true, airDoctrine = null) {
    if (!hostile || !missiles || hostile.hp <= 0.05) return;
    const incoming = missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const isAce = Boolean(hostile.isAce);
    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);
    const isStealth = Boolean(nearestMsl.isStealthMissile || (nearestMsl.rcs <= 0.005));

    const defTiers = {
      CADET:     { reactDist: 5.0, stealthDist: 3.2, blunderChance: 0.60, cmChance: 0.15, turnMult: 0.50, bonus: 0.25 },
      BUFFER:    { reactDist: 5.8, stealthDist: 3.6, blunderChance: 0.52, cmChance: 0.20, turnMult: 0.55, bonus: 0.28 },
      VETERAN:   { reactDist: 6.5, stealthDist: 4.0, blunderChance: 0.46, cmChance: 0.25, turnMult: 0.60, bonus: 0.32 },
      ESCALATED: { reactDist: 7.2, stealthDist: 4.4, blunderChance: 0.40, cmChance: 0.30, turnMult: 0.65, bonus: 0.35 },
      ELITE:     { reactDist: 7.8, stealthDist: 4.8, blunderChance: 0.35, cmChance: 0.35, turnMult: 0.70, bonus: 0.38 },
      FORWARD:   { reactDist: 8.4, stealthDist: 5.2, blunderChance: 0.30, cmChance: 0.40, turnMult: 0.74, bonus: 0.41 },
      ACE:       { reactDist: 9.0, stealthDist: 5.5, blunderChance: 0.25, cmChance: 0.45, turnMult: 0.78, bonus: 0.44 },
      FORTIFIED: { reactDist: 9.4, stealthDist: 5.8, blunderChance: 0.21, cmChance: 0.48, turnMult: 0.81, bonus: 0.46 },
      MASTER:    { reactDist: 9.8, stealthDist: 6.0, blunderChance: 0.18, cmChance: 0.52, turnMult: 0.84, bonus: 0.48 },
      LEGEND:    { reactDist: 10.5, stealthDist: 6.5, blunderChance: 0.12, cmChance: 0.60, turnMult: 0.90, bonus: 0.52 }
    };
    const tier = defTiers[diffKey];
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]);

    const reactDistance = isAce ? Math.max(tier.reactDist + 2.5, 9.0) : tier.reactDist;
    const stealthDistance = isAce ? Math.max(tier.stealthDist + 1.8, 5.8) : tier.stealthDist;

    const focusFactor = isFocused ? 1.0 : (['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey) ? 0.82 : 0.60);
    const triggerDistance = (isStealth ? stealthDistance : reactDistance) * focusFactor;
    if (nearestMsl.distanceToTarget > triggerDistance) return;

    const effAgi = hostile.getEffectiveAgility();
    const agiFactor = Math.max(0.40, Math.min(1.60, effAgi / 0.85));
    const sOpt = hostile.getOptimalCornerSpeed();
    const turnOptEff = hostile.isCoffin ? 1.0 : Physics.calcTurnEfficiency(hostile.speed, sOpt);
    const turnOptFactor = Math.max(0.40, Math.min(1.25, 0.50 + 0.50 * turnOptEff));

    const baseBlunder = isAce && aceProf ? aceProf.blunderChance : tier.blunderChance;
    const effectiveBlunderChance = isFocused ? (baseBlunder / agiFactor) : Math.min(0.85, (baseBlunder * 1.35) / agiFactor);
    if (Math.random() < effectiveBlunderChance) return;

    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
    const cmThreshold = isAce ? 7.5 : 5.0;
    const docCmBias = airDoctrine ? airDoctrine.cmBias : 0.0;
    const cmProbability = Math.max(0, Math.min(0.95, (isAce ? 0.75 : tier.cmChance) * agiFactor + docCmBias));
    if (nearestMsl.distanceToTarget < cmThreshold && hasCm && hostile.cmTimer <= 0 && Math.random() < cmProbability) {
      hostile.deployCountermeasures();
    }

    const isOptical = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'IIR' || nearestMsl.weapon.seeker === 'EO' || nearestMsl.weapon.seeker === 'OPT'));
    if (isOptical && (isAce || ['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey))) {
      hostile.engineAlpha = 0.20;
    }

    const isRadar = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR'));
    const baseNotchChance = isAce && aceProf ? aceProf.notchChance : profile.notchChance;
    const closeRangeDegradation = (nearestMsl.distanceToTarget < 15.0) ? (isAce ? 0.75 : 0.50) : 1.0;
    const docNotchBias = airDoctrine ? airDoctrine.notchBias : 0.0;
    const effectiveNotchChance = Math.max(0, Math.min(0.88, baseNotchChance * closeRangeDegradation + docNotchBias));

    if (isRadar && Math.random() < effectiveNotchChance) {
      const toleranceDeg = isAce ? 12 : profile.notchToleranceDeg;
      const angleJitterRad = ((Math.random() * 2 - 1) * toleranceDeg * Math.PI) / 180.0;
      const desiredPerp = nearestMsl.heading + (Math.PI / 2) + angleJitterRad;

      let diff = desiredPerp - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      hostile.heading += Math.max(-effAgi * tier.turnMult * dt, Math.min(effAgi * tier.turnMult * dt, diff));
      if (Math.abs(diff) < 0.25) {
        hostile.isNotching = true;
        hostile.activeManeuverTimer = 6.0;
        hostile.activeManeuverBonus = (tier.bonus + (isAce ? 0.15 : 0)) * agiFactor * turnOptFactor;
        hostile.activeManeuverId = 'DOPPLER_NOTCH';
        return;
      }
    }

    const awayHeading = nearestMsl.heading + (Math.random() < 0.5 ? 0.80 : -0.80);
    let diff = awayHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    const turnCap = effAgi * tier.turnMult * (isFocused ? 1.0 : 0.75) * (isAce ? 1.15 : 1.0);
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
    hostile.activeManeuverTimer = isFocused ? 5.0 : 3.0;
    hostile.activeManeuverBonus = (tier.bonus + (isAce ? 0.12 : 0)) * agiFactor * turnOptFactor * (isFocused ? 1.0 : 0.70);
    hostile.activeManeuverId = 'BREAK_TURN';
    hostile.isNotching = false;
  }

  static coordinateAceTactics(aiCommander, aces, candidateTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt, airDoctrine = null, atkDoctrine = null, untrackedContacts = []) {
    if (!aces || aces.length === 0) return;
    const game = aiCommander.game;
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]);

    const aceTiers = {
      CADET:     { delay: 3.8, notchRate: 0.25, climbAlt: 28000 },
      BUFFER:    { delay: 3.5, notchRate: 0.30, climbAlt: 30000 },
      VETERAN:   { delay: 3.2, notchRate: 0.35, climbAlt: 32000 },
      ESCALATED: { delay: 2.8, notchRate: 0.42, climbAlt: 34000 },
      ELITE:     { delay: 2.4, notchRate: 0.50, climbAlt: 36000 },
      FORWARD:   { delay: 2.1, notchRate: 0.55, climbAlt: 37000 },
      ACE:       { delay: 1.8, notchRate: 0.60, climbAlt: 38000 },
      FORTIFIED: { delay: 1.6, notchRate: 0.65, climbAlt: 39000 },
      MASTER:    { delay: 1.4, notchRate: 0.70, climbAlt: 40000 },
      LEGEND:    { delay: 1.1, notchRate: 0.75, climbAlt: 42000 }
    };
    const aceTier = aceTiers[diffKey];
    const altBias = airDoctrine ? airDoctrine.altitudeBiasFt : 0;

    for (const ace of aces) {
      if (ace.hp <= 0.05) continue;
      const isFocused = aiCommander.isUnitFocused(ace.id);

      const hasAmmo = ace.equippedWeapons && ace.equippedWeapons.some(p => p && p.ammo > 0 && p.weapon && !p.weapon.isJammerPod && !p.weapon.isTargetingPod && !p.weapon.isDecoy && !p.weapon.isDecoyDrone);
      if (!hasAmmo && !ace.isRTB && (!ace.gunAmmo || ace.gunAmmo <= 0)) ace.orderRTB();

      if (ace.isRTB) {
        const coveredHeading = aiCommander.planning.getCoveredEgressHeading(ace);
        let diff = coveredHeading - ace.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        ace.heading += Math.max(-1.8 * dt, Math.min(1.8 * dt, diff));
        continue;
      }

      const desiredAlt = Math.max(8000, Math.min(58000, aceTier.climbAlt + altBias));
      if (Math.abs((ace.altFt || 28000) - desiredAlt) > 3500) ace.targetAltFt = desiredAlt;

      const mergedAceProfile = Object.assign({}, profile, aceProf, { notchChance: aceTier.notchRate });
      this.handleDefensiveBehavior(ace, mergedAceProfile, diffKey, dt, allMissiles, isFocused, airDoctrine);
      if (!isFocused) continue;

      if (typeof AIMissileTactics !== 'undefined') {
        const isStrikeAce = Boolean(ace.spec && ace.spec.role && (ace.spec.role.includes('Strike') || ace.spec.role.includes('Bomber')));
        const targetsForAce = (isStrikeAce && visibleBunkers.length > 0) ? visibleBunkers.concat(candidateTargets) : candidateTargets;
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, targetsForAce, clouds, allMissiles, diffKey, mergedAceProfile, airDoctrine);

        if ((!acePlan || !acePlan.target) && untrackedContacts && untrackedContacts.length > 0) {
          const trackOrder = aiCommander.planning.getTrackAcquisitionVector(ace, candidateTargets, untrackedContacts, allMissiles, diffKey);
          if (trackOrder && trackOrder.target) {
            ace.radarLockedTarget = trackOrder.target;
            let tDiff = trackOrder.heading - ace.heading;
            while (tDiff < -Math.PI) tDiff += Math.PI * 2;
            while (tDiff > Math.PI) tDiff -= Math.PI * 2;
            const aceAgi = ace.getEffectiveAgility();
            ace.heading += Math.max(-aceAgi * 1.1 * dt, Math.min(aceAgi * 1.1 * dt, tDiff));
            ace.engineAlpha = Math.max(0.25, Math.min(1.0, trackOrder.throttle));
          }
        }
        if (acePlan && acePlan.target) {
          const tgt = acePlan.target;
          ace.radarLockedTarget = tgt;
          const dist = Math.hypot(tgt.x - ace.x, tgt.y - ace.y);
          const docMove = AINavigationHandler.getDoctrineSteering(game, ace, tgt, dist, airDoctrine, atkDoctrine);
          const desiredAngle = docMove ? docMove.heading : Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0);

          let diff = desiredAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          const aceAgi = ace.getEffectiveAgility();
          ace.heading += Math.max(-aceAgi * 1.1 * dt, Math.min(aceAgi * 1.1 * dt, diff));

          if (Math.abs(diff) > 0.35) {
            const sOpt = ace.getOptimalCornerSpeed();
            ace.engineAlpha = ace.speed > sOpt * 1.12 ? 0.40 : (ace.speed < sOpt * 0.88 ? 0.85 : 0.65);
          } else if (docMove) {
            ace.engineAlpha = Math.max(0.25, Math.min(1.0, docMove.throttle + (airDoctrine ? airDoctrine.throttleBias : 0)));
          }

          if (aiCommander.aceSalvoTimer <= 0 && !(ace._aiFireCooldown > 0) && game.tokenBucketRed >= 0.70 && !ace.isRTB) {
            const canFire = acePlan.pylonsToFire.every(p => {
              const isHOBS = (p.weapon.trait === 'HOBS_VANE' || p.weapon.trait === 'ALL_ASPECT_BURST' || p.weapon.trait === 'REAR_ENGAGE' || p.weapon.id === 'IRIS-T');
              return isHOBS || Math.abs(diff) <= 0.65;
            });
            if (canFire) {
              for (const pylon of acePlan.pylonsToFire) {
                if (game.tokenBucketRed < 0.70 || pylon.item.ammo <= 0) break;
                pylon.item.ammo--;
                game.tokenBucketRed = Math.max(0, game.tokenBucketRed - 0.70);
                if (!pylon.weapon.isGunpod && pylon.weapon.category !== 'GUN') {
                  game.missiles.push(new MissileEntity(pylon.weapon, ace, tgt));
                  if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
                }
              }
              const aceCdMult = (acePlan && acePlan.dyn) ? acePlan.dyn.cooldownMult : 1.0;
              const docCdMult = (airDoctrine && typeof airDoctrine.cooldownMult === 'number') ? airDoctrine.cooldownMult : 1.0;
              ace._aiFireCooldown = Math.max(1.2, ((aceProf && aceProf.shotCooldownSec) ? aceProf.shotCooldownSec : 4.2) * docCdMult * aceCdMult);
              ace.recalculateWeight();
              aiCommander.aceSalvoTimer = aceTier.delay;
            }
          }
        }
      }
    }
  }
}

window.AIEvasionHandler = AIEvasionHandler;
