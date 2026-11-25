/**
 * AIRSPACE STANDOFF: Tactical AI Evasion & Evasive Maneuver Subsystem
 * Executes committed, difficulty-scaled defensive maneuvers (Notch, Barrel Roll, Cobra, Split-S, Chaff, Zoom Climb).
 */

class AIEvasionHandler {
  static getDefTiers() {
    return {
      CADET:     { rank: 0, reactDist: 11.5, stealthDist: 7.0,  cmChance: 0.28, turnMult: 0.70, skillMult: 0.72, irIdleAlpha: null, cornerThrottle: false },
      BUFFER:    { rank: 1, reactDist: 13.0, stealthDist: 8.0,  cmChance: 0.34, turnMult: 0.75, skillMult: 0.78, irIdleAlpha: null, cornerThrottle: false },
      VETERAN:   { rank: 2, reactDist: 15.0, stealthDist: 9.2,  cmChance: 0.40, turnMult: 0.80, skillMult: 0.84, irIdleAlpha: 0.32, cornerThrottle: false },
      ESCALATED: { rank: 3, reactDist: 17.0, stealthDist: 10.5, cmChance: 0.46, turnMult: 0.85, skillMult: 0.90, irIdleAlpha: 0.30, cornerThrottle: true  },
      ELITE:     { rank: 4, reactDist: 19.0, stealthDist: 11.8, cmChance: 0.52, turnMult: 0.90, skillMult: 0.95, irIdleAlpha: 0.22, cornerThrottle: true  },
      FORWARD:   { rank: 5, reactDist: 21.0, stealthDist: 13.2, cmChance: 0.58, turnMult: 0.94, skillMult: 1.00, irIdleAlpha: 0.20, cornerThrottle: true  },
      ACE:       { rank: 6, reactDist: 23.0, stealthDist: 14.5, cmChance: 0.64, turnMult: 0.98, skillMult: 1.05, irIdleAlpha: 0.20, cornerThrottle: true  },
      FORTIFIED: { rank: 7, reactDist: 25.0, stealthDist: 16.0, cmChance: 0.70, turnMult: 1.02, skillMult: 1.09, irIdleAlpha: 0.20, cornerThrottle: true  },
      MASTER:    { rank: 8, reactDist: 27.0, stealthDist: 17.5, cmChance: 0.76, turnMult: 1.06, skillMult: 1.13, irIdleAlpha: 0.20, cornerThrottle: true  },
      LEGEND:    { rank: 9, reactDist: 30.0, stealthDist: 19.5, cmChance: 0.82, turnMult: 1.12, skillMult: 1.18, irIdleAlpha: 0.20, cornerThrottle: true  }
    };
  }

  static normalizeAngleDiff(targetHdg, curHdg) {
    let diff = targetHdg - curHdg;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    return diff;
  }

  static wrapHeading(hdg) {
    let h = hdg % (Math.PI * 2);
    if (h < 0) h += Math.PI * 2;
    return h;
  }

  static continueActiveManeuver(hostile, tier, diffKey, dt, nearestMsl, isFocused) {
    if (hostile.glocTimer > 0) return;
    const isAce = Boolean(hostile.isAce);
    const effAgi = hostile.getEffectiveAgility();
    const turnCap = effAgi * tier.turnMult * (isFocused ? 1.05 : 0.88) * (isAce ? 1.15 : 1.0);
    const simTime = (window.Game && window.Game.simulation) ? window.Game.simulation.elapsedTimeSec : (performance.now() * 0.001);

    let desiredHdg = hostile._aiManeuverTargetHdg !== undefined && hostile._aiManeuverTargetHdg !== null
      ? hostile._aiManeuverTargetHdg
      : hostile.heading;

    if (hostile.activeManeuverId === 'DOPPLER_NOTCH' && nearestMsl) {
      const isRadar = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR'));
      if (isRadar) {
        const side = hostile._aiManeuverSide || 1;
        const jitter = hostile._aiNotchJitterRad || 0;
        desiredHdg = this.wrapHeading(nearestMsl.heading + side * (Math.PI / 2) + jitter);
        hostile._aiManeuverTargetHdg = desiredHdg;
      }
    } else if (hostile.activeManeuverId === 'BARREL_ROLL') {
      const baseHdg = hostile._aiManeuverBaseHdg !== undefined ? hostile._aiManeuverBaseHdg : hostile.heading;
      desiredHdg = this.wrapHeading(baseHdg + Math.sin(simTime * 4.8) * 0.65);
    }

    const diff = this.normalizeAngleDiff(desiredHdg, hostile.heading);
    hostile.heading = this.wrapHeading(hostile.heading + Math.max(-turnCap * dt, Math.min(turnCap * dt, diff)));

    if (hostile.activeManeuverId === 'DOPPLER_NOTCH') {
      hostile.isNotching = (Math.abs(diff) < 0.48);
    }

    const isOptical = Boolean(nearestMsl && nearestMsl.weapon && (nearestMsl.weapon.seeker === 'IIR' || nearestMsl.weapon.seeker === 'EO' || nearestMsl.weapon.seeker === 'OPT'));
    const fp = (typeof AIFlightProfile !== 'undefined') ? AIFlightProfile.evaluate(hostile, diffKey) : null;
    if (isOptical && tier.irIdleAlpha !== null) {
      const vulnCut = fp ? (fp.thermalVuln * 0.14 * fp.precision) : 0;
      hostile.engineAlpha = Math.max(0.20, tier.irIdleAlpha - vulnCut);
    } else if (fp && (tier.cornerThrottle || isAce)) {
      hostile.engineAlpha = AIFlightProfile.computeCornerThrottle(hostile, fp.effMaxMach, fp.precision, 0.65);
    }
  }

  static selectManeuverId(hostile, incoming, nearestMsl, profile, tier, diffKey, effectiveNotchChance, fp = null) {
    const isAce = Boolean(hostile.isAce);
    const dist = nearestMsl.distanceToTarget;
    const isRadar = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR'));
    const isOptical = Boolean(nearestMsl.weapon && (nearestMsl.weapon.seeker === 'IIR' || nearestMsl.weapon.seeker === 'EO' || nearestMsl.weapon.seeker === 'OPT'));
    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);

    const notchBias = fp ? fp.notchMod : 0;
    const cobraChance = fp ? fp.cobraWeight : 0.45;
    const splitSChance = fp ? fp.splitSWeight : 0.35;
    const barrelChance = fp ? fp.barrelWeight : 0.50;
    const zoomChance = fp ? fp.zoomWeight : 0.22;

    const p = fp ? fp.precision : 0.50;
    const candidates = [];

    if (isRadar && hostile.speed >= 0.30) {
      candidates.push({ id: 'DOPPLER_NOTCH', weight: Math.min(0.95, effectiveNotchChance + notchBias) });
    }
    if (hostile.thrustVector === true && dist <= 15.0) {
      candidates.push({ id: 'PUSH_COBRA', weight: cobraChance * p });
    }
    if (hostile.alt >= 0.18) {
      const splitSUrgency = incoming.length >= 2 ? 1.25 : 1.0;
      candidates.push({ id: 'SPLIT_S', weight: splitSChance * splitSUrgency * p });
    }
    if (isRadar && hasCm && hostile.cmTimer <= 0 && dist <= 18.0) {
      candidates.push({ id: 'EMERGENCY_CM', weight: 0.36 + p * 0.24 });
    }
    if (hostile.speed >= 0.60 && hostile.alt < 0.50) {
      const zoomBoost = isOptical ? 0.18 : 0.0;
      candidates.push({ id: 'ZOOM_CLIMB', weight: (zoomChance + zoomBoost) * p });
    }
    if (hostile.alt >= 0.10 && dist <= 28.0) {
      candidates.push({ id: 'BARREL_ROLL', weight: barrelChance });
    }
    candidates.push({ id: 'BREAK_TURN', weight: 0.45 });

    let totalWeight = 0;
    for (let i = 0; i < candidates.length; i++) totalWeight += Math.max(0.01, candidates[i].weight);
    let roll = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i++) {
      roll -= Math.max(0.01, candidates[i].weight);
      if (roll <= 0) return candidates[i].id;
    }
    return candidates[0].id;
  }

  static handleDefensiveBehavior(hostile, profile, diffKey, dt, missiles, isFocused = true, airDoctrine = null) {
    if (!hostile || !missiles || hostile.hp <= 0.05) return;
    const incoming = missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const tiers = this.getDefTiers();
    const tier = tiers[diffKey];
    if (!tier) throw new Error(`Unknown difficulty "${diffKey}" in AIEvasionHandler.`);

    const isAce = Boolean(hostile.isAce);
    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);

    if (hostile.activeManeuverTimer > 0) {
      this.continueActiveManeuver(hostile, tier, diffKey, dt, nearestMsl, isFocused);
      return;
    }

    hostile._aiManeuverTargetHdg = null;
    hostile._aiManeuverBaseHdg = null;
    hostile._aiManeuverSide = null;
    hostile._aiNotchJitterRad = 0;

    if (hostile.glocTimer > 0 || (hostile._aiManeuverCooldown || 0) > 0) return;

    const fp = (typeof AIFlightProfile !== 'undefined') ? AIFlightProfile.evaluate(hostile, diffKey) : null;
    const isStealth = Boolean(nearestMsl.isStealthMissile || (nearestMsl.rcs <= 0.005));
    const sensorAwareBonus = fp ? (((fp.hasIrst || hostile.hasDAS || hostile.hasESM) ? 2.2 : 0.0) + fp.wr * 2.2 + fp.useCaution * 2.6) * fp.precision : 0.0;
    const reactDistance = (isAce ? Math.max(tier.reactDist + 3.5, 20.0) : tier.reactDist) + sensorAwareBonus;
    const stealthDistance = (isAce ? Math.max(tier.stealthDist + 2.5, 12.5) : tier.stealthDist) + sensorAwareBonus * 0.6;
    const focusFactor = isFocused ? 1.0 : AIFlightProfile.lerp(0.72, 0.94, fp ? fp.precision : 0.5);
    const triggerDistance = (isStealth ? stealthDistance : reactDistance) * focusFactor;
    if (nearestMsl.distanceToTarget > triggerDistance) return;

    const effAgi = hostile.getEffectiveAgility();
    const agiFactor = Math.max(0.45, Math.min(1.40, effAgi / 0.85));
    const sOpt = hostile.getOptimalCornerSpeed();
    const turnOptEff = hostile.isCoffin ? 1.0 : Physics.calcTurnEfficiency(hostile.speed, sOpt);
    const turnOptFactor = Math.max(0.50, Math.min(1.18, 0.50 + 0.50 * turnOptEff));

    const baseChance = isAce ? Math.min(0.99, (profile.maneuverChance || 0.75) + 0.12) : (profile.maneuverChance || 0.72);
    const effManeuverChance = Math.max(0.30, Math.min(0.99, baseChance * (isFocused ? 1.0 : 0.90) * (0.85 + 0.15 * agiFactor)));
    const baseCooldown = isAce ? Math.max(2.4, (profile.maneuverCooldownSec || 6.0) - 1.2) : (profile.maneuverCooldownSec || 6.0);

    if (Math.random() >= effManeuverChance) {
      hostile._aiManeuverCooldown = Math.max(1.2, baseCooldown * 0.45);
      return;
    }

    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
    const cmThreshold = isAce ? 16.0 : 12.0;
    const docCmBias = airDoctrine ? airDoctrine.cmBias : 0.0;
    const cmProbability = Math.max(0, Math.min(0.95, (isAce ? 0.82 : tier.cmChance) * (0.85 + 0.15 * agiFactor) + docCmBias));
    if (nearestMsl.distanceToTarget < cmThreshold && hasCm && hostile.cmTimer <= 0 && Math.random() < cmProbability) {
      hostile.deployCountermeasures();
    }

    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]);
    const baseNotchChance = isAce && aceProf ? aceProf.notchChance : profile.notchChance;
    const closeRangeDegradation = (nearestMsl.distanceToTarget < 14.0) ? (isAce ? 0.78 : 0.58) : 1.0;
    const docNotchBias = airDoctrine ? airDoctrine.notchBias : 0.0;
    const effectiveNotchChance = Math.max(0, Math.min(0.88, baseNotchChance * closeRangeDegradation + docNotchBias));

    const maneuverId = this.selectManeuverId(hostile, incoming, nearestMsl, profile, tier, diffKey, effectiveNotchChance, fp);
    const baseBonuses = { DOPPLER_NOTCH: 0.30, BARREL_ROLL: 0.28, PUSH_COBRA: 0.34, SPLIT_S: 0.28, EMERGENCY_CM: 0.26, ZOOM_CLIMB: 0.22, BREAK_TURN: 0.24 };
    const durations = { DOPPLER_NOTCH: 4.5, BARREL_ROLL: 4.0, PUSH_COBRA: 3.5, SPLIT_S: 4.5, EMERGENCY_CM: 4.5, ZOOM_CLIMB: 4.5, BREAK_TURN: 4.0 };
    const labels = { DOPPLER_NOTCH: 'DOPPLER NOTCH', BARREL_ROLL: 'BARREL ROLL', PUSH_COBRA: 'COBRA', SPLIT_S: 'SPLIT-S DIVE', EMERGENCY_CM: 'CHAFF SALVO', ZOOM_CLIMB: 'ZOOM CLIMB', BREAK_TURN: 'BREAK TURN' };

    let bonus = baseBonuses[maneuverId] * tier.skillMult * agiFactor * turnOptFactor;
    if (hostile.stress >= 0.65) bonus *= 0.75;
    if (hostile.isCoffin) bonus += 0.04;
    if (isAce) bonus += 0.06;

    const side = (Math.random() < 0.5) ? 1 : -1;
    hostile._aiManeuverSide = side;
    hostile.activeManeuverId = maneuverId;
    hostile.activeManeuverTimer = durations[maneuverId];
    hostile.activeManeuverBonus = Math.min(0.46, bonus);
    hostile.isNotching = false;
    hostile._aiManeuverCooldown = baseCooldown;

    if (maneuverId === 'DOPPLER_NOTCH') {
      const tolDeg = isAce ? 10 : profile.notchToleranceDeg;
      const jitterRad = ((Math.random() * 2 - 1) * tolDeg * Math.PI) / 180.0;
      hostile._aiNotchJitterRad = jitterRad;
      hostile._aiManeuverTargetHdg = this.wrapHeading(nearestMsl.heading + side * (Math.PI / 2) + jitterRad);
      hostile.isNotching = (Math.abs(this.normalizeAngleDiff(hostile._aiManeuverTargetHdg, hostile.heading)) < 0.48);
      if (hasCm && hostile.cmTimer <= 0) hostile.deployCountermeasures();
    } else if (maneuverId === 'BARREL_ROLL') {
      hostile._aiManeuverBaseHdg = this.wrapHeading(nearestMsl.heading + side * 0.85);
      hostile._aiManeuverTargetHdg = hostile._aiManeuverBaseHdg;
      hostile.applyActionStress(0.14);
    } else if (maneuverId === 'PUSH_COBRA') {
      hostile.speed = Math.max(0.24, hostile.speed * 0.58);
      hostile._aiManeuverTargetHdg = this.wrapHeading(hostile.heading + side * 0.45);
      hostile.applyActionStress(0.22);
    } else if (maneuverId === 'SPLIT_S') {
      hostile.dive();
      hostile._aiManeuverTargetHdg = this.wrapHeading(hostile.heading + Math.PI);
    } else if (maneuverId === 'EMERGENCY_CM') {
      hostile.deployCountermeasures();
      hostile.cmTimer = 4.5;
      hostile._aiManeuverTargetHdg = this.wrapHeading(nearestMsl.heading + side * 0.95);
    } else if (maneuverId === 'ZOOM_CLIMB') {
      hostile.zoomClimb();
      hostile._aiManeuverTargetHdg = this.wrapHeading(hostile.heading + side * 0.55);
    } else {
      hostile._aiManeuverTargetHdg = this.wrapHeading(nearestMsl.heading + side * 1.15);
      hostile.applyActionStress(0.12);
    }

    const game = window.Game;
    if (game && game.radar) {
      game.radar.spawnCombatText(hostile.x, hostile.y, labels[maneuverId], '#f43f5e');
    }
    if (game && game.inspection && game.inspection.enabled) {
      game.inspection.recordEvent('AI MANEUVER', `${window.formatCombatantDisplayName(hostile)} executed ${labels[maneuverId]}`, hostile, nearestMsl, {
        maneuver: maneuverId, evasionBonus: hostile.activeManeuverBonus, distanceKm: nearestMsl.distanceToTarget, difficulty: diffKey
      });
    }
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

      const plannedAlt = aiCommander.planning.getPlannedAltitude(ace, profile, diffKey, airDoctrine);
      const aceRole = ace.tacticalRole || 'FLAGSHIP';
      const desiredAlt = (aceRole === 'DOGFIGHT' || aceRole === 'STRIKE')
        ? plannedAlt
        : Math.max(8000, Math.min(58000, Math.max(aceTier.climbAlt + altBias, plannedAlt)));
      if (Math.abs((ace.altFt || 28000) - desiredAlt) > 3500) ace.targetAltFt = desiredAlt;

      const mergedAceProfile = Object.assign({}, profile, aceProf, { notchChance: aceTier.notchRate });
      this.handleDefensiveBehavior(ace, mergedAceProfile, diffKey, dt, allMissiles, isFocused, airDoctrine);
      if (!isFocused) continue;

      if (typeof AIMissileTactics !== 'undefined') {
        const isStrikeAce = Boolean(aceRole === 'STRIKE' || (ace.spec && ace.spec.role && (ace.spec.role.includes('Strike') || ace.spec.role.includes('Bomber'))));
        const targetsForAce = (isStrikeAce && visibleBunkers.length > 0) ? visibleBunkers.concat(candidateTargets) : candidateTargets;
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, targetsForAce, clouds, allMissiles, diffKey, mergedAceProfile, airDoctrine);
        const isEvading = (ace.activeManeuverTimer > 0);

        if (!isEvading && (!acePlan || !acePlan.target) && untrackedContacts && untrackedContacts.length > 0) {
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
          let roleMove = null;
          if (!docMove) {
            if (aceRole === 'SNIPER') roleMove = aiCommander.planning.getSniperVector(ace, tgt, dist, diffKey);
            else if (aceRole === 'INTERCEPT') roleMove = aiCommander.planning.getInterceptVector(ace, tgt, dist);
            else if (aceRole === 'DOGFIGHT') roleMove = aiCommander.planning.getDogfightVector(ace, tgt, dist, diffKey);
            else if (aceRole === 'AMBUSH') roleMove = aiCommander.planning.getAmbushVector(ace, tgt, dist, diffKey);
            if (!roleMove && typeof aiCommander.planning.getStatAwareSteering === 'function') {
              roleMove = aiCommander.planning.getStatAwareSteering(ace, tgt, dist, diffKey);
            }
          }
          const desiredAngle = docMove ? docMove.heading : (roleMove ? roleMove.heading : Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0));

          let diff = desiredAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          if (!isEvading) {
            const aceAgi = ace.getEffectiveAgility();
            ace.heading += Math.max(-aceAgi * 1.1 * dt, Math.min(aceAgi * 1.1 * dt, diff));
            if (Math.abs(diff) > 0.35) {
              const sOpt = ace.getOptimalCornerSpeed();
              ace.engineAlpha = ace.speed > sOpt * 1.12 ? 0.40 : (ace.speed < sOpt * 0.88 ? 0.85 : 0.65);
            } else if (docMove || roleMove) {
              const baseThrottle = docMove ? docMove.throttle : roleMove.throttle;
              ace.engineAlpha = Math.max(0.25, Math.min(1.0, baseThrottle + (airDoctrine ? airDoctrine.throttleBias : 0)));
            }
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
