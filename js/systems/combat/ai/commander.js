/**
 * AIRSPACE STANDOFF: Tactical AI Commander
 * Attention allocation, cognitive bandwidth slots, mission planning, and difficulty-tiered tactical execution.
 */

window.AI_ACE_PROFILES = {
  CADET:   { reactionCooldown: 3.8, notchChance: 0.25, decoyDiscrimination: 0.35, blunderChance: 0.20, mixedSeekerChance: 0.00, salvoMaxMissiles: 1 },
  VETERAN: { reactionCooldown: 3.2, notchChance: 0.35, decoyDiscrimination: 0.45, blunderChance: 0.12, mixedSeekerChance: 0.15, salvoMaxMissiles: 2 },
  ELITE:   { reactionCooldown: 2.4, notchChance: 0.50, decoyDiscrimination: 0.60, blunderChance: 0.06, mixedSeekerChance: 0.25, salvoMaxMissiles: 2 },
  ACE:     { reactionCooldown: 1.8, notchChance: 0.60, decoyDiscrimination: 0.70, blunderChance: 0.02, mixedSeekerChance: 0.35, salvoMaxMissiles: 2 },
  MASTER:  { reactionCooldown: 1.4, notchChance: 0.70, decoyDiscrimination: 0.80, blunderChance: 0.00, mixedSeekerChance: 0.45, salvoMaxMissiles: 3 },
  LEGEND:  { reactionCooldown: 1.1, notchChance: 0.75, decoyDiscrimination: 0.85, blunderChance: 0.00, mixedSeekerChance: 0.55, salvoMaxMissiles: 3 }
};

class TacticalAICommander {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.focusedUnitIds = [];
    this.focusTimers = new Map();
    this.actionCooldown = 1.2;
    this.aceSalvoTimer = 0.0;
    this.planning = new AIPlanningSystem(this);
  }

  isUnitFocused(unitId) {
    return this.focusedUnitIds.includes(unitId);
  }

  getCognitiveProfile(unitId) {
    const unit = (this.game.hostileAircraft || []).find(h => h.id === unitId) ||
                 (this.game.alliedAircraft || []).find(a => a.id === unitId);
    const isAce = Boolean(unit && unit.isAce);
    const isFocused = this.isUnitFocused(unitId);
    const remainingFocus = this.focusTimers.get(unitId) || 0;
    const diffKey = this.game.aiDifficulty || 'VETERAN';
    const baseProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]) || {};
    const aceProfile = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]) || baseProfile;

    const maxSlots = baseProfile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));
    const activeFocusCount = this.focusedUnitIds.length;
    const isHesitating = this.planning ? this.planning.isHesitating(unitId) : false;
    const successionTimer = this.planning ? (this.planning.successionTimers.get(unitId) || 0) : 0;
    const posture = this.planning ? this.planning.posture : 'OFFENSIVE_SWEEP';

    let roleInFormation = isAce ? (unit && unit.isFlightLead ? 'Ace Flight Lead' : 'Ace Interceptor') : 'Independent Element';
    let pairedUnit = null;

    if (this.planning && this.planning.elementPairs) {
      for (const [leadId, wingId] of this.planning.elementPairs.entries()) {
        if (leadId === unitId) {
          roleInFormation = isAce ? 'Ace Element Lead' : 'Element Leader';
          pairedUnit = (this.game.hostileAircraft || []).find(h => h.id === wingId) || null;
          break;
        } else if (wingId === unitId) {
          roleInFormation = isAce ? 'Ace Escort' : 'Wingman';
          pairedUnit = (this.game.hostileAircraft || []).find(h => h.id === leadId) || null;
          break;
        }
      }
    }

    const tacticalRole = (unit && unit.tacticalRole) ? unit.tacticalRole : (unit && unit.spec && unit.spec.category === 'EW' ? 'SEAD' : 'SWEEP');

    return {
      isAce,
      isFocused,
      remainingFocus,
      maxSlots,
      activeFocusCount,
      diffKey,
      posture,
      tacticalRole,
      isHesitating,
      successionTimer,
      roleInFormation,
      pairedUnit,
      reactionCooldown: isAce ? aceProfile.reactionCooldown : (baseProfile.reactionCooldown || 3.0),
      notchChance: isAce ? aceProfile.notchChance : (baseProfile.notchChance || 0),
      decoyDiscrimination: isAce ? aceProfile.decoyDiscrimination : (baseProfile.decoyDiscrimination || 0),
      blunderChance: isAce ? aceProfile.blunderChance : (baseProfile.blunderChance || 0.3)
    };
  }

  updateAttention(aliveHostiles, profile, diffKey, allMissiles, candidateAirTargets, dt) {
    const aliveIds = new Set(aliveHostiles.map(h => h.id));
    this.focusedUnitIds = this.focusedUnitIds.filter(id => aliveIds.has(id));
    for (const id of this.focusTimers.keys()) {
      if (!aliveIds.has(id)) this.focusTimers.delete(id);
    }
    for (const id of this.focusedUnitIds) {
      const remaining = (this.focusTimers.get(id) || 0) - dt;
      this.focusTimers.set(id, Math.max(0, remaining));
    }

    const maxSlots = profile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));

    const scoredUnits = aliveHostiles.map(h => {
      let score = 0;
      const inbound = allMissiles.filter(m => m.active && m.target && m.target.id === h.id);

      if (inbound.length > 0) {
        const nearestDist = inbound.reduce((min, m) => Math.min(min, m.distanceToTarget || 99), 99);
        if (nearestDist < 12.0) score += 120;
        else if (nearestDist < 25.0) score += 75;
        else score += 35;
      }

      if (h.hp <= 2) score += 30;
      if (h.radarLockedTarget && h.radarLockedTarget.hp > 0) {
        const d = Math.hypot(h.radarLockedTarget.x - h.x, h.radarLockedTarget.y - h.y);
        if (d <= 45.0) score += 35;
      }

      if (h.isAce) score += 55;
      else if (h.isFlightLead) score += 20;

      const remainingTimer = this.focusTimers.get(h.id) || 0;
      if (this.focusedUnitIds.includes(h.id) && remainingTimer > 0) score += 40;

      return { unit: h, score };
    });

    scoredUnits.sort((a, b) => b.score - a.score);

    const newFocus = [];
    const span = profile.attentionSpanSec || 3.0;
    for (let i = 0; i < Math.min(maxSlots, scoredUnits.length); i++) {
      const h = scoredUnits[i].unit;
      newFocus.push(h.id);
      if (!this.focusedUnitIds.includes(h.id) || (this.focusTimers.get(h.id) || 0) <= 0) {
        this.focusTimers.set(h.id, h.isAce ? span * 1.25 : span);
      }
    }
    this.focusedUnitIds = newFocus;
  }

  update(dt) {
    if (this.game.playerMode === '2P' || this.game.isGameOver) return;

    if (this.actionCooldown > 0) this.actionCooldown -= dt;
    if (this.aceSalvoTimer > 0) this.aceSalvoTimer -= dt;

    const diffKey = this.game.aiDifficulty || 'VETERAN';
    const profile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]) || {
      reactionCooldown: 5.0, attentionSpanSec: 4.2, attentionSlots: 1, engagementRangeRatio: 0.80,
      evasionSkill: 0.24, blunderChance: 0.46, usesDopplerNotch: false, formationDoctrine: 'LOOSE_FOLLOW'
    };

    const aliveHostiles = (this.game.hostileAircraft || []).filter(a => a.hp > 0);
    if (aliveHostiles.length === 0) return;

    this.planning.update(dt, aliveHostiles, profile, diffKey);

    const redDetected = this.game.detectedByRed || new Set();
    const visibleAllies = (this.game.alliedAircraft || []).filter(a => a.hp > 0 && redDetected.has(a.id) && (a.identifiedByRed || a.isIdentifiedBy('hostile')));
    const blueDecoys = (this.game.simulation && this.game.simulation.decoyDrones || []).filter(d => d.hp > 0 && d.team === 'friendly' && redDetected.has(d.id));

    const candidateAirTargets = visibleAllies.concat(blueDecoys);
    const visibleBunkers = (this.game.surfaceUnits || []).filter(s => s.team === 'friendly' && s.hp > 0 && !s.isIndestructible);
    const clouds = (this.game.simulation && this.game.simulation.weatherClouds) || [];
    const allMissiles = this.game.missiles || [];

    this.updateAttention(aliveHostiles, profile, diffKey, allMissiles, candidateAirTargets, dt);

    if (typeof AIDefenseHandler !== 'undefined') {
      AIDefenseHandler.coordinateAceTactics(this, aliveHostiles.filter(h => h.isAce), candidateAirTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt);
    }

    for (const h of aliveHostiles) {
      if (!h.isAce) {
        const isFocused = this.isUnitFocused(h.id);
        if (typeof AIDefenseHandler !== 'undefined') {
          AIDefenseHandler.handleDefensiveBehavior(h, profile, diffKey, dt, allMissiles, isFocused);
        }
        this.handleNavigation(h, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused);
      }
    }

    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    const maxSlots = profile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));

    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      for (const focusedId of this.focusedUnitIds) {
        const shooter = aliveHostiles.find(h => h.id === focusedId && !h.isAce);
        if (!shooter || shooter.hp <= 0 || shooter.isRTB) continue;
        if (this.planning.isHesitating(shooter.id)) continue;
        if (this.game.tokenBucketRed < tokenCost) break;

        const fired = this.executeTacticalEngagements(shooter, candidateAirTargets, visibleBunkers, profile, clouds, diffKey, tokenCost, allMissiles);
        if (fired) {
          const interUnitDelay = Math.max(0.35, (profile.reactionCooldown || 3.0) / (maxSlots * 1.5));
          this.actionCooldown = interUnitDelay;
          break;
        }
      }
    }
  }

  executeTacticalEngagements(shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles) {
    if (typeof AIMissileTactics !== 'undefined') {
      return AIMissileTactics.executeTacticalEngagements(this, shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles);
    }
    return false;
  }

  handleNavigation(hostile, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused) {
    if (!hostile || hostile.activeManeuverTimer > 0 || hostile.hp <= 0) return;

    if (hostile.isRTB) {
      if (['MASTER', 'LEGEND'].includes(diffKey)) {
        const egressHeading = this.planning.getCoveredEgressHeading(hostile);
        let diff = egressHeading - hostile.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        hostile.heading += Math.max(-1.5 * dt, Math.min(1.5 * dt, diff));
      }
      return;
    }

    if (this.planning.isHesitating(hostile.id)) {
      hostile.engineAlpha = 0.40;
      return;
    }

    const role = hostile.tacticalRole || (hostile.spec && hostile.spec.category === 'EW' ? 'SEAD' : 'SWEEP');

    let target = null;
    if (role === 'SEAD') {
      const hostileRadars = (this.game.surfaceUnits || []).filter(s => s.team !== hostile.team && s.hp > 0 && (s.type === 'RADAR_ARRAY' || s.type === 'EW_JAMMER' || s.type === 'S-400' || s.type === 'PANTSIR' || s.type === 'RADAR_VAN'));
      if (hostileRadars.length > 0) {
        target = hostileRadars[0];
      } else if (candidateAirTargets.length > 0) {
        target = candidateAirTargets[0];
      }
    } else if (role === 'STRIKE') {
      const strikeTargets = (this.game.surfaceUnits || []).filter(s => s.team !== hostile.team && s.hp > 0 && (s.type === 'BUNKER' || s.type === 'FUEL_DEPOT' || !s.isIndestructible));
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

    const wingmanOffset = this.planning.getWingmanOffset(hostile, profile);
    const navTiers = {
      CADET:   { turnMult: 0.45, throttle: 0.50, overshootDist: 6.5, overshootChance: 0.55 },
      VETERAN: { turnMult: 0.55, throttle: 0.55, overshootDist: 6.0, overshootChance: 0.42 },
      ELITE:   { turnMult: 0.65, throttle: 0.62, overshootDist: 5.2, overshootChance: 0.30 },
      ACE:     { turnMult: 0.74, throttle: 0.70, overshootDist: 4.6, overshootChance: 0.20 },
      MASTER:  { turnMult: 0.82, throttle: 0.75, overshootDist: 4.0, overshootChance: 0.14 },
      LEGEND:  { turnMult: 0.88, throttle: 0.80, overshootDist: 3.6, overshootChance: 0.08 }
    };
    const tier = navTiers[diffKey] || navTiers.VETERAN;

    if (profile.verticalCombat) {
      const targetAlt = this.planning.getPlannedAltitude(hostile, profile, diffKey);
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
      const sniperMove = this.planning.getSniperVector(hostile, target, dist, diffKey);
      desiredHeading = sniperMove.heading;
      hostile.engineAlpha = sniperMove.throttle;
    } else if (role === 'INTERCEPT') {
      const interceptMove = this.planning.getInterceptVector(hostile, target, dist);
      desiredHeading = interceptMove.heading;
      hostile.engineAlpha = interceptMove.throttle;
    } else if (role === 'DOGFIGHT') {
      const dogfightMove = this.planning.getDogfightVector(hostile, target, dist);
      desiredHeading = dogfightMove.heading;
      hostile.engineAlpha = dogfightMove.throttle;
    } else if (role === 'AMBUSH' && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diffKey)) {
      const ambushMove = this.planning.getAmbushVector(hostile, target, dist, diffKey);
      desiredHeading = ambushMove.heading;
      hostile.engineAlpha = ambushMove.throttle;
    } else if (dist < tier.overshootDist) {
      const closingDiff = Math.abs(hostile.heading - (target.heading || 0));
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

    const effAgi = (typeof hostile.getEffectiveAgility === 'function')
      ? hostile.getEffectiveAgility()
      : ((hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85);

    const focusAgiScale = isFocused ? 1.0 : 0.55;
    const turnCap = effAgi * tier.turnMult * focusAgiScale;
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));

    const sOpt = (typeof hostile.getOptimalCornerSpeed === 'function') ? hostile.getOptimalCornerSpeed() : 0.75;
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

window.TacticalAICommander = TacticalAICommander;