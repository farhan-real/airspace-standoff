/**
 * AIRSPACE STANDOFF: Tactical AI Commander
 * Human-like attention allocation, cognitive bandwidth slots, mission planning, and tactical execution.
 */

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
    const isFocused = this.isUnitFocused(unitId);
    const remainingFocus = this.focusTimers.get(unitId) || 0;
    const diffKey = this.game.aiDifficulty || 'VETERAN';
    const profile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]) || {};
    const maxSlots = profile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));
    const activeFocusCount = this.focusedUnitIds.length;
    const isHesitating = this.planning ? this.planning.isHesitating(unitId) : false;
    const successionTimer = this.planning ? (this.planning.successionTimers.get(unitId) || 0) : 0;
    const posture = this.planning ? this.planning.posture : 'OFFENSIVE_SWEEP';

    let roleInFormation = 'Independent Element';
    let pairedUnit = null;
    if (this.planning && this.planning.elementPairs) {
      for (const [leadId, wingId] of this.planning.elementPairs.entries()) {
        if (leadId === unitId) {
          roleInFormation = 'Element Leader';
          pairedUnit = (this.game.hostileAircraft || []).find(h => h.id === wingId) || null;
          break;
        } else if (wingId === unitId) {
          roleInFormation = 'Wingman';
          pairedUnit = (this.game.hostileAircraft || []).find(h => h.id === leadId) || null;
          break;
        }
      }
    }

    return {
      isFocused,
      remainingFocus,
      maxSlots,
      activeFocusCount,
      diffKey,
      posture,
      isHesitating,
      successionTimer,
      roleInFormation,
      pairedUnit,
      reactionCooldown: profile.reactionCooldown || 3.0,
      notchChance: profile.notchChance || 0,
      decoyDiscrimination: profile.decoyDiscrimination || 0
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

      if (h.isAce) score += 20;
      else if (h.isFlightLead) score += 15;

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
        this.focusTimers.set(h.id, span);
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
    if (typeof AIMissileTactics === 'undefined') return false;
    const res = AIMissileTactics.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles);

    if (res.isBingo && !shooter.isRTB) {
      if (shooter.gunAmmo && shooter.gunAmmo > 0) return false;
      const rtbRoll = Math.random();
      const rtbChances = { CADET: 0.15, VETERAN: 0.30, ELITE: 0.50, ACE: 0.65, MASTER: 0.80, LEGEND: 0.90 };
      if (rtbRoll < (rtbChances[diffKey] || 0.40)) {
        shooter.orderRTB();
      }
      return false;
    }

    if (!res.plan || !res.plan.pylonsToFire || res.plan.pylonsToFire.length === 0) return false;
    const plan = res.plan;
    const tgt = plan.target;
    let anyFired = false;

    for (const pylon of plan.pylonsToFire) {
      if (this.game.tokenBucketRed < tokenCost || pylon.item.ammo <= 0) break;
      pylon.item.ammo--;
      this.game.tokenBucketRed = Math.max(0, this.game.tokenBucketRed - tokenCost);
      anyFired = true;

      if (pylon.weapon.isLaser) {
        if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
        const wasAlive = tgt.hp > 0.05;
        if (tgt.isGhost || tgt.isDecoyDrone) {
          tgt.takeDamage(pylon.weapon.damage);
        } else if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) {
          tgt.takeDamage(pylon.weapon.damage, false);
        } else if (tgt.isCivilian && typeof tgt.takeDamage === 'function') {
          tgt.takeDamage(pylon.weapon.damage, shooter, pylon.weapon, true);
        } else {
          tgt.hp = Math.max(0, tgt.hp - pylon.weapon.damage);
          if (tgt.hp < 0.05) tgt.hp = 0;
          if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.20);
        }
        if (this.game.radar) {
          this.game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
          this.game.radar.spawnCombatText(tgt.x, tgt.y, `LASER -${pylon.weapon.damage}HP`, '#f43f5e');
        }
        if (wasAlive && tgt.hp <= 0 && this.game.simulation && !tgt.isCivilian) {
          this.game.simulation.recordKillEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, isSalvo: false, salvoCount: 1 });
        } else if (wasAlive && tgt.hp > 0 && this.game.simulation && this.game.simulation.scoring && !tgt.isCivilian && (!tgt.isIndestructible)) {
          this.game.simulation.scoring.recordHitEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, damage: pylon.weapon.damage });
        }
      } else if (!pylon.weapon.isGunpod && pylon.weapon.category !== 'GUN') {
        this.game.missiles.push(new MissileEntity(pylon.weapon, shooter, tgt));
        if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
      }
    }
    shooter.recalculateWeight();
    return anyFired;
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

    let target = null;
    const isBomber = Boolean(hostile.spec && hostile.spec.role && (hostile.spec.role.includes('Strike') || hostile.spec.role.includes('Bomber')));
    if (isBomber && visibleBunkers.length > 0) target = visibleBunkers[0];
    else if (candidateAirTargets.length > 0) {
      target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
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
      if (Math.abs(hostile.altFt - targetAlt) > 4000) {
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

    if (dist < tier.overshootDist) {
      const closingDiff = Math.abs(hostile.heading - (target.heading || 0));
      if (closingDiff > 1.8 && Math.random() < tier.overshootChance) {
        hostile.engineAlpha = tier.throttle;
        return;
      }
    }

    let targetHeading = Math.atan2(target.y - hostile.y, target.x - hostile.x);
    if (wingmanOffset && dist > 20.0) {
      targetHeading = Math.atan2(wingmanOffset.y - hostile.y, wingmanOffset.x - hostile.x);
    }

    let diff = targetHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const effAgi = (typeof hostile.getEffectiveAgility === 'function')
      ? hostile.getEffectiveAgility()
      : ((hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85);

    const focusAgiScale = isFocused ? 1.0 : 0.55;
    const turnCap = effAgi * tier.turnMult * focusAgiScale;
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));

    const sOpt = (typeof hostile.getOptimalCornerSpeed === 'function') ? hostile.getOptimalCornerSpeed() : 0.75;
    if (['ACE', 'MASTER', 'LEGEND'].includes(diffKey) && Math.abs(diff) > 0.40) {
      if (hostile.speed > sOpt * 1.15) hostile.engineAlpha = 0.40;
      else if (hostile.speed < sOpt * 0.85) hostile.engineAlpha = 0.85;
      else hostile.engineAlpha = 0.65;
    } else {
      hostile.engineAlpha = isFocused ? tier.throttle : 0.50;
    }
  }
}

window.TacticalAICommander = TacticalAICommander;