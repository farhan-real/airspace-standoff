/**
 * AIRSPACE STANDOFF: Tactical AI Evasion & Ace Formation Maneuver Subsystem
 */

class AIEvasionHandler {
  static handleDefensiveBehavior(hostile, profile, diffKey, dt, missiles, isFocused = true) {
    if (!hostile || !missiles || hostile.hp <= 0) return;
    const incoming = missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);
    const isStealth = Boolean(nearestMsl.isStealthMissile || (nearestMsl.rcs <= 0.005));
    const isVeryHighDiff = (diffKey === 'MASTER' || diffKey === 'LEGEND');

    const defTiers = {
      CADET:   { reactDist: 5.5, stealthDist: 3.5, blunderChance: 0.58, cmChance: 0.18, turnMult: 0.52, bonus: 0.28 },
      VETERAN: { reactDist: 6.8, stealthDist: 4.2, blunderChance: 0.46, cmChance: 0.26, turnMult: 0.62, bonus: 0.35 },
      ELITE:   { reactDist: 8.0, stealthDist: 5.0, blunderChance: 0.35, cmChance: 0.36, turnMult: 0.72, bonus: 0.40 },
      ACE:     { reactDist: 9.2, stealthDist: 5.8, blunderChance: 0.26, cmChance: 0.45, turnMult: 0.80, bonus: 0.45 },
      MASTER:  { reactDist: 10.0, stealthDist: 6.2, blunderChance: 0.18, cmChance: 0.52, turnMult: 0.86, bonus: 0.48 },
      LEGEND:  { reactDist: 10.8, stealthDist: 6.8, blunderChance: 0.12, cmChance: 0.60, turnMult: 0.92, bonus: 0.52 }
    };

    const tier = defTiers[diffKey] || defTiers.VETERAN;
    const isExperiencedTier = ['ACE', 'MASTER', 'LEGEND'].includes(diffKey);
    const focusDistanceFactor = isFocused ? 1.0 : (isExperiencedTier ? 0.80 : 0.60);
    const reactDistance = (isStealth ? tier.stealthDist : tier.reactDist) * focusDistanceFactor;
    if (nearestMsl.distanceToTarget > reactDistance) return;

    const effAgi = (typeof hostile.getEffectiveAgility === 'function')
      ? hostile.getEffectiveAgility()
      : ((hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85);
    const agiFactor = Math.max(0.40, Math.min(1.60, effAgi / 0.85));

    const sOpt = (typeof hostile.getOptimalCornerSpeed === 'function') ? hostile.getOptimalCornerSpeed() : 0.75;
    const turnOptEff = hostile.isCoffin ? 1.0 : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(hostile.speed || 0.8, sOpt) : 0.85);
    const turnOptFactor = Math.max(0.40, Math.min(1.25, 0.50 + 0.50 * turnOptEff));

    const penalty = isExperiencedTier ? 1.3 : 1.6;
    const effectiveBlunderChance = isFocused
      ? (tier.blunderChance / agiFactor)
      : Math.min(0.85, (tier.blunderChance * penalty) / agiFactor);

    if (Math.random() < effectiveBlunderChance) return;

    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
    const cmChance = isFocused ? (tier.cmChance * agiFactor) : (tier.cmChance * (isExperiencedTier ? 0.65 : 0.45));
    if (nearestMsl.distanceToTarget < 5.0 && hasCm && hostile.cmTimer <= 0) {
      if (Math.random() < cmChance) hostile.deployCountermeasures();
    }

    if (!isFocused || !isVeryHighDiff || !profile.usesDopplerNotch) {
      const awayHeading = nearestMsl.heading + (Math.random() < 0.5 ? 0.75 : -0.75);
      let diff = awayHeading - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      const turnCap = effAgi * tier.turnMult * (isFocused ? 1.0 : (isExperiencedTier ? 0.80 : 0.65));
      hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
      hostile.activeManeuverTimer = isFocused ? 5.0 : 3.0;
      hostile.activeManeuverBonus = tier.bonus * agiFactor * turnOptFactor * (isFocused ? 1.0 : 0.65);
      hostile.activeManeuverId = 'BREAK_TURN';
      hostile.isNotching = false;
      return;
    }

    if (isVeryHighDiff && profile.usesDopplerNotch && nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR')) {
      const desiredPerp = nearestMsl.heading + Math.PI / 2;
      let diff = desiredPerp - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      hostile.heading += Math.max(-effAgi * tier.turnMult * dt, Math.min(effAgi * tier.turnMult * dt, diff));
      if (Math.abs(diff) < 0.20) {
        hostile.isNotching = true;
        hostile.activeManeuverTimer = 6.0;
        hostile.activeManeuverBonus = tier.bonus * agiFactor * turnOptFactor;
        hostile.activeManeuverId = 'DOPPLER_NOTCH';
      }
    }
  }

  static coordinateAceTactics(aiCommander, aces, candidateTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt) {
    if (!aces || aces.length === 0) return;
    const game = aiCommander.game;

    const aceBlunders = { CADET: 0.65, VETERAN: 0.50, ELITE: 0.38, ACE: 0.28, MASTER: 0.20, LEGEND: 0.15 };
    const aceBlunderChance = aceBlunders[diffKey] !== undefined ? aceBlunders[diffKey] : 0.40;
    const isVeryHighDiff = (diffKey === 'MASTER' || diffKey === 'LEGEND');

    for (const ace of aces) {
      if (ace.hp <= 0) continue;
      const isFocused = aiCommander.isUnitFocused(ace.id);

      const hasUsableAmmo = ace.equippedWeapons && ace.equippedWeapons.some(p => p && p.ammo > 0 && p.weapon && !p.weapon.isJammerPod && !p.weapon.isDecoy && !p.weapon.isDecoyDrone);
      if (!hasUsableAmmo && !ace.isRTB) {
        if (!ace.gunAmmo || ace.gunAmmo <= 0) {
          ace.orderRTB();
          if (game.radar) game.radar.spawnCombatText(ace.x, ace.y, 'ACE BINGO AMMO: WITHDRAWING', '#f59e0b');
          continue;
        }
      }

      const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === ace.id);
      if (incoming.length > 0) {
        const nearest = incoming.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, incoming[0]);
        const isRadar = Boolean(nearest.weapon && (nearest.weapon.seeker === 'ARH' || nearest.weapon.seeker === 'PASSIVE_RADAR'));
        const isOptical = Boolean(nearest.weapon && (nearest.weapon.seeker === 'IIR' || nearest.weapon.seeker === 'EO' || nearest.weapon.seeker === 'OPT'));
        const isStealth = Boolean(nearest.isStealthMissile || (nearest.rcs <= 0.005));

        const blunderedDefense = Math.random() < (isFocused ? aceBlunderChance : Math.min(0.60, aceBlunderChance * 1.35));
        const triggerDist = isStealth ? (blunderedDefense ? 4.5 : 6.5) : (blunderedDefense ? 7.5 : 11.0);

        if (nearest.distanceToTarget < triggerDist * (isFocused ? 1.0 : 0.80)) {
          const aceAgi = (typeof ace.getEffectiveAgility === 'function') ? ace.getEffectiveAgility() : (ace.spec ? ace.spec.AGI_0 : 1.15);
          const sOpt = (typeof ace.getOptimalCornerSpeed === 'function') ? ace.getOptimalCornerSpeed() : 0.90;
          const turnOptEff = ace.isCoffin ? 1.0 : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(ace.speed || 0.8, sOpt) : 0.85);

          if (isOptical && !blunderedDefense) {
            ace.engineAlpha = 0.20;
            let targetHeading = nearest.heading + (Math.random() < 0.5 ? 1.2 : -1.2);
            if (clouds && clouds.length > 0) {
              const nearestCloud = clouds.reduce((best, c) => {
                const d = Math.hypot(c.x - ace.x, c.y - ace.y);
                return d < best.d ? { cloud: c, d } : best;
              }, { cloud: clouds[0], d: 999 });

              if (nearestCloud.cloud && nearestCloud.d <= 25.0) {
                targetHeading = Math.atan2(nearestCloud.cloud.y - ace.y, nearestCloud.cloud.x - ace.x);
              }
            }

            let dAngle = targetHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            const turnRateCap = aceAgi * (diffKey === 'CADET' ? 0.85 : 1.35) * (isFocused ? 1.0 : 0.80);
            ace.heading += Math.max(-turnRateCap * dt, Math.min(turnRateCap * dt, dAngle));

            ace.isNotching = false;
            ace.activeManeuverId = 'BARREL_ROLL';
            ace.activeManeuverTimer = 6.0;
            ace.activeManeuverBonus = 0.45 * (aceAgi / 0.85) * Math.max(0.50, 0.50 + 0.50 * turnOptEff) * (isFocused ? 1.0 : 0.80);
            if (ace.chaff > 0 && ace.cmTimer <= 0 && Math.random() < 0.60) ace.deployCountermeasures();
          } else if (isVeryHighDiff && isRadar && !blunderedDefense && isFocused) {
            if (ace.speed > sOpt * 1.15) ace.engineAlpha = 0.35;
            else if (ace.speed < sOpt * 0.85) ace.engineAlpha = 0.85;
            else ace.engineAlpha = 0.65;

            const perpHeading = nearest.heading + Math.PI / 2;
            let dAngle = perpHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            ace.heading += Math.max(-aceAgi * 1.2 * dt, Math.min(aceAgi * 1.2 * dt, dAngle));
            if (Math.abs(dAngle) < 0.18) {
              ace.isNotching = true;
              ace.activeManeuverId = 'DOPPLER_NOTCH';
              ace.activeManeuverTimer = 6.0;
              ace.activeManeuverBonus = 0.48 * (aceAgi / 0.85) * Math.max(0.50, 0.50 + 0.50 * turnOptEff);
              if (ace.chaff > 0 && ace.cmTimer <= 0) ace.deployCountermeasures();
            }
          } else {
            if (ace.speed > sOpt * 1.15) ace.engineAlpha = 0.35;
            else if (ace.speed < sOpt * 0.85) ace.engineAlpha = 0.85;
            else ace.engineAlpha = 0.65;

            const awayHeading = nearest.heading + (Math.random() < 0.5 ? 0.75 : -0.75);
            let dAngle = awayHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            const turnRateCap = aceAgi * (diffKey === 'CADET' ? 0.80 : (diffKey === 'VETERAN' ? 1.0 : 1.35)) * (isFocused ? 1.0 : 0.75);
            ace.heading += Math.max(-turnRateCap * dt, Math.min(turnRateCap * dt, dAngle));
            ace.isNotching = false;
            ace.activeManeuverId = 'BREAK_TURN';
            ace.activeManeuverTimer = 5.0;
            ace.activeManeuverBonus = 0.38 * (aceAgi / 0.85) * Math.max(0.50, 0.50 + 0.50 * turnOptEff) * (isFocused ? 1.0 : 0.75);
            if (ace.chaff > 0 && ace.cmTimer <= 0 && Math.random() < 0.45) ace.deployCountermeasures();
          }
        }
      }

      if (!isFocused) continue;

      if (typeof AIMissileTactics !== 'undefined') {
        const isStrikeAce = Boolean(ace.spec && ace.spec.role && (ace.spec.role.includes('Strike') || ace.spec.role.includes('Bomber')));
        const targetsForAce = (isStrikeAce && visibleBunkers.length > 0) ? visibleBunkers.concat(candidateTargets) : candidateTargets;
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, targetsForAce, clouds, allMissiles, diffKey);
        if (acePlan && acePlan.target) {
          const tgt = acePlan.target;
          ace.radarLockedTarget = tgt;
          const interceptAngle = Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0);
          let diff = interceptAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const aceAgi = (typeof ace.getEffectiveAgility === 'function') ? ace.getEffectiveAgility() : (ace.spec ? ace.spec.AGI_0 : 1.15);
          const turnRateCap = aceAgi * (diffKey === 'CADET' ? 0.75 : (diffKey === 'VETERAN' ? 0.95 : 1.30));
          ace.heading += Math.max(-turnRateCap * dt, Math.min(turnRateCap * dt, diff));

          if (aiCommander.aceSalvoTimer <= 0 && game.tokenBucketRed >= 0.70 && !ace.isRTB) {
            let canFireSalvo = true;
            for (const pylon of acePlan.pylonsToFire) {
              const isHOBS = (pylon.weapon.trait === 'HOBS_VANE' || pylon.weapon.trait === 'ALL_ASPECT_BURST' || pylon.weapon.trait === 'REAR_ENGAGE' || pylon.weapon.id === 'IRIS-T');
              if (!isHOBS && Math.abs(diff) > 0.65) {
                canFireSalvo = false;
                break;
              }
            }

            if (canFireSalvo) {
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
              aiCommander.aceSalvoTimer = isVeryHighDiff ? 2.4 : 4.0;
            }
          }
        }
      }
    }
  }
}

window.AIEvasionHandler = AIEvasionHandler;
window.AIDefenseHandler = AIEvasionHandler;