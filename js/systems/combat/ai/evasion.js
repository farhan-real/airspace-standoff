/**
 * AIRSPACE STANDOFF: Tactical AI Evasion & Evasive Maneuver Subsystem
 * Humanized Doppler notching rates, aspect tolerances, close-range degradation, and throttle cuts.
 */

class AIEvasionHandler {
  static handleDefensiveBehavior(hostile, profile, diffKey, dt, missiles, isFocused = true) {
    if (!hostile || !missiles || hostile.hp <= 0) return;
    const incoming = missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);
    const isStealth = Boolean(nearestMsl.isStealthMissile || (nearestMsl.rcs <= 0.005));

    const defTiers = {
      CADET:   { reactDist: 5.0, stealthDist: 3.2, blunderChance: 0.60, cmChance: 0.15, turnMult: 0.50, bonus: 0.25 },
      VETERAN: { reactDist: 6.5, stealthDist: 4.0, blunderChance: 0.46, cmChance: 0.25, turnMult: 0.60, bonus: 0.32 },
      ELITE:   { reactDist: 7.8, stealthDist: 4.8, blunderChance: 0.35, cmChance: 0.35, turnMult: 0.70, bonus: 0.38 },
      ACE:     { reactDist: 9.0, stealthDist: 5.5, blunderChance: 0.25, cmChance: 0.45, turnMult: 0.78, bonus: 0.44 },
      MASTER:  { reactDist: 9.8, stealthDist: 6.0, blunderChance: 0.18, cmChance: 0.52, turnMult: 0.84, bonus: 0.48 },
      LEGEND:  { reactDist: 10.5, stealthDist: 6.5, blunderChance: 0.12, cmChance: 0.60, turnMult: 0.90, bonus: 0.52 }
    };
    const tier = defTiers[diffKey] || defTiers.VETERAN;

    const focusFactor = isFocused ? 1.0 : (['ACE', 'MASTER', 'LEGEND'].includes(diffKey) ? 0.82 : 0.60);
    const triggerDistance = (isStealth ? tier.stealthDist : tier.reactDist) * focusFactor;
    if (nearestMsl.distanceToTarget > triggerDistance) return;

    const effAgi = (typeof hostile.getEffectiveAgility === 'function')
      ? hostile.getEffectiveAgility()
      : ((hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85);
    const agiFactor = Math.max(0.40, Math.min(1.60, effAgi / 0.85));

    const sOpt = (typeof hostile.getOptimalCornerSpeed === 'function') ? hostile.getOptimalCornerSpeed() : 0.75;
    const turnOptEff = hostile.isCoffin ? 1.0 : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(hostile.speed || 0.8, sOpt) : 0.85);
    const turnOptFactor = Math.max(0.40, Math.min(1.25, 0.50 + 0.50 * turnOptEff));

    const effectiveBlunderChance = isFocused
      ? (tier.blunderChance / agiFactor)
      : Math.min(0.85, (tier.blunderChance * 1.35) / agiFactor);

    if (Math.random() < effectiveBlunderChance) return;

    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
    if (nearestMsl.distanceToTarget < 5.0 && hasCm && hostile.cmTimer <= 0) {
      if (diffKey === 'CADET' && Math.random() < 0.35) {
        hostile.deployCountermeasures();
      } else if (Math.random() < tier.cmChance * agiFactor) {
        hostile.deployCountermeasures();
      }
    }

    const isOptical = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'IIR' || nearestMsl.weapon.seeker === 'EO' || nearestMsl.weapon.seeker === 'OPT'));
    if (isOptical && ['ACE', 'MASTER', 'LEGEND'].includes(diffKey)) {
      hostile.engineAlpha = 0.20;
    }

    const isRadar = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR'));
    const baseNotchChance = profile.notchChance !== undefined ? profile.notchChance : 0.0;
    const closeRangeDegradation = (nearestMsl.distanceToTarget < 15.0) ? 0.50 : 1.0;
    const effectiveNotchChance = baseNotchChance * closeRangeDegradation;

    if (isRadar && Math.random() < effectiveNotchChance) {
      const toleranceDeg = profile.notchToleranceDeg !== undefined ? profile.notchToleranceDeg : 20;
      const angleJitterRad = ((Math.random() * 2 - 1) * toleranceDeg * Math.PI) / 180.0;
      const desiredPerp = nearestMsl.heading + (Math.PI / 2) + angleJitterRad;

      let diff = desiredPerp - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      hostile.heading += Math.max(-effAgi * tier.turnMult * dt, Math.min(effAgi * tier.turnMult * dt, diff));
      if (Math.abs(diff) < 0.25) {
        hostile.isNotching = true;
        hostile.activeManeuverTimer = 6.0;
        hostile.activeManeuverBonus = tier.bonus * agiFactor * turnOptFactor;
        hostile.activeManeuverId = 'DOPPLER_NOTCH';
        return;
      }
    }

    const awayHeading = nearestMsl.heading + (Math.random() < 0.5 ? 0.80 : -0.80);
    let diff = awayHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    const turnCap = effAgi * tier.turnMult * (isFocused ? 1.0 : 0.75);
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
    hostile.activeManeuverTimer = isFocused ? 5.0 : 3.0;
    hostile.activeManeuverBonus = tier.bonus * agiFactor * turnOptFactor * (isFocused ? 1.0 : 0.70);
    hostile.activeManeuverId = 'BREAK_TURN';
    hostile.isNotching = false;
  }

  static coordinateAceTactics(aiCommander, aces, candidateTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt) {
    if (!aces || aces.length === 0) return;
    const game = aiCommander.game;

    const aceTiers = {
      CADET:   { delay: 3.8, notchRate: 0.20, climbAlt: 28000, throttleMod: false },
      VETERAN: { delay: 3.2, notchRate: 0.30, climbAlt: 32000, throttleMod: true },
      ELITE:   { delay: 2.4, notchRate: 0.45, climbAlt: 36000, throttleMod: true },
      ACE:     { delay: 1.8, notchRate: 0.55, climbAlt: 38000, throttleMod: true },
      MASTER:  { delay: 1.4, notchRate: 0.65, climbAlt: 40000, throttleMod: true },
      LEGEND:  { delay: 1.1, notchRate: 0.70, climbAlt: 42000, throttleMod: true }
    };
    const aceTier = aceTiers[diffKey] || aceTiers.VETERAN;

    for (const ace of aces) {
      if (ace.hp <= 0) continue;
      const isFocused = aiCommander.isUnitFocused(ace.id);

      // Winchester check: Covered retreat toward surface SAM / CIWS umbrella
      const hasAmmo = ace.equippedWeapons && ace.equippedWeapons.some(p => p && p.ammo > 0 && p.weapon && !p.weapon.isJammerPod && !p.weapon.isDecoy && !p.weapon.isDecoyDrone);
      if (!hasAmmo && !ace.isRTB) {
        if (!ace.gunAmmo || ace.gunAmmo <= 0) {
          ace.orderRTB();
        }
      }

      if (ace.isRTB) {
        const coveredHeading = aiCommander.planning.getCoveredEgressHeading(ace);
        let diff = coveredHeading - ace.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        ace.heading += Math.max(-1.8 * dt, Math.min(1.8 * dt, diff));
        continue;
      }

      // 3D Altitude Staging: Ace climbs to high-altitude perch
      if (aceTier.climbAlt && Math.abs((ace.altFt || 28000) - aceTier.climbAlt) > 3500) {
        ace.targetAltFt = aceTier.climbAlt;
      }

      const aceProfile = Object.assign({}, profile, { notchChance: aceTier.notchRate });
      this.handleDefensiveBehavior(ace, aceProfile, diffKey, dt, allMissiles, isFocused);
      if (!isFocused) continue;

      if (typeof AIMissileTactics !== 'undefined') {
        const isStrikeAce = Boolean(ace.spec && ace.spec.role && (ace.spec.role.includes('Strike') || ace.spec.role.includes('Bomber')));
        const targetsForAce = (isStrikeAce && visibleBunkers.length > 0) ? visibleBunkers.concat(candidateTargets) : candidateTargets;
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, targetsForAce, clouds, allMissiles, diffKey, profile);

        if (acePlan && acePlan.target) {
          const tgt = acePlan.target;
          ace.radarLockedTarget = tgt;
          const interceptAngle = Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0);
          let diff = interceptAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          const aceAgi = (typeof ace.getEffectiveAgility === 'function') ? ace.getEffectiveAgility() : (ace.spec ? ace.spec.AGI_0 : 1.15);
          ace.heading += Math.max(-aceAgi * 1.1 * dt, Math.min(aceAgi * 1.1 * dt, diff));

          // Active Corner-Speed Throttle Control in Pursuit Turns
          if (aceTier.throttleMod && Math.abs(diff) > 0.35) {
            const sOpt = (typeof ace.getOptimalCornerSpeed === 'function') ? ace.getOptimalCornerSpeed() : 0.80;
            if (ace.speed > sOpt * 1.12) ace.engineAlpha = 0.40;
            else if (ace.speed < sOpt * 0.88) ace.engineAlpha = 0.85;
            else ace.engineAlpha = 0.65;
          }

          if (aiCommander.aceSalvoTimer <= 0 && game.tokenBucketRed >= 0.70 && !ace.isRTB) {
            let canFire = true;
            for (const pylon of acePlan.pylonsToFire) {
              const isHOBS = (pylon.weapon.trait === 'HOBS_VANE' || pylon.weapon.trait === 'ALL_ASPECT_BURST' || pylon.weapon.trait === 'REAR_ENGAGE' || pylon.weapon.id === 'IRIS-T');
              if (!isHOBS && Math.abs(diff) > 0.65) { canFire = false; break; }
            }

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
window.AIDefenseHandler = AIEvasionHandler;