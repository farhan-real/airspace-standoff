/**
 * AIRSPACE STANDOFF: Tactical AI Commander
 * Human-like attention allocation, cognitive bandwidth slots, and tactical urgency switching.
 */

class TacticalAICommander {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.focusedUnitIds = [];
    this.focusTimers = new Map();
    this.actionCooldown = 1.6;
    this.aceSalvoTimer = 0.0;
  }

  isUnitFocused(unitId) {
    return this.focusedUnitIds.includes(unitId);
  }

  updateAttention(aliveHostiles, profile, diffKey, allMissiles, candidateAirTargets, dt) {
    // 1. Prune dead or non-existent units
    const aliveIds = new Set(aliveHostiles.map(h => h.id));
    this.focusedUnitIds = this.focusedUnitIds.filter(id => aliveIds.has(id));
    for (const id of this.focusTimers.keys()) {
      if (!aliveIds.has(id)) this.focusTimers.delete(id);
    }

    // 2. Decrement focus timers
    for (const id of this.focusedUnitIds) {
      const remaining = (this.focusTimers.get(id) || 0) - dt;
      this.focusTimers.set(id, Math.max(0, remaining));
    }

    const maxSlots = profile.attentionSlots || (['ACE', 'MASTER', 'LEGEND'].includes(diffKey) ? 2 : 1);

    // 3. Evaluate urgency score for each alive hostile aircraft
    const scoredUnits = aliveHostiles.map(h => {
      let score = 0;
      const inbound = allMissiles.filter(m => m.active && m.target && m.target.id === h.id);

      // Immediate missile threat: emergency attention shift
      if (inbound.length > 0) {
        const nearestDist = inbound.reduce((min, m) => Math.min(min, m.distanceToTarget || 99), 99);
        if (nearestDist < 12.0) score += 120;
        else if (nearestDist < 25.0) score += 75;
        else score += 40;
        score += (inbound.length - 1) * 30; // Salvo saturation pressure
      }

      // Hull integrity risk
      if (h.hp <= 2) score += 35;

      // Offensive lock / engagement opportunity
      if (h.radarLockedTarget && h.radarLockedTarget.hp > 0) {
        const d = Math.hypot(h.radarLockedTarget.x - h.x, h.radarLockedTarget.y - h.y);
        if (d <= 50.0) score += 40;
      }

      // Tactical rank priority
      if (h.isAce) score += 25;
      else if (h.isFlightLead) score += 15;

      // Cognitive inertia / task stickiness (prevents erratic jumping while attention span remains)
      const remainingTimer = this.focusTimers.get(h.id) || 0;
      if (this.focusedUnitIds.includes(h.id) && remainingTimer > 0) {
        score += 45;
      }

      return { unit: h, score };
    });

    scoredUnits.sort((a, b) => b.score - a.score);

    // 4. Assign top slots
    const newFocus = [];
    const span = profile.attentionSpanSec || 3.5;
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
      reactionCooldown: 5.8, attentionSpanSec: 4.8, attentionSlots: 1, engagementRangeRatio: 0.55,
      evasionSkill: 0.24, blunderChance: 0.46, usesDopplerNotch: false
    };

    const aliveHostiles = (this.game.hostileAircraft || []).filter(a => a.hp > 0);
    if (aliveHostiles.length === 0) return;

    const redDetected = this.game.detectedByRed || new Set();
    const visibleAllies = (this.game.alliedAircraft || []).filter(a => a.hp > 0 && redDetected.has(a.id) && (a.identifiedByRed || a.isIdentifiedBy('hostile')));
    const blueDecoys = (this.game.simulation && this.game.simulation.decoyDrones || []).filter(d => d.hp > 0 && d.team === 'friendly' && redDetected.has(d.id));

    const candidateAirTargets = visibleAllies.concat(blueDecoys);
    const visibleBunkers = (this.game.surfaceUnits || []).filter(s => s.team === 'friendly' && s.hp > 0 && !s.isIndestructible);
    const clouds = (this.game.simulation && this.game.simulation.weatherClouds) || [];
    const allMissiles = this.game.missiles || [];

    // Update human-like attention allocation
    this.updateAttention(aliveHostiles, profile, diffKey, allMissiles, candidateAirTargets, dt);

    // Evasive and offensive routines for aces
    if (typeof AIDefenseHandler !== 'undefined') {
      AIDefenseHandler.coordinateAceTactics(this, aliveHostiles.filter(h => h.isAce), candidateAirTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt);
    }

    // Evasive and navigation routines for non-aces
    for (const h of aliveHostiles) {
      if (!h.isAce) {
        const isFocused = this.isUnitFocused(h.id);
        if (typeof AIDefenseHandler !== 'undefined') {
          AIDefenseHandler.handleDefensiveBehavior(h, profile, diffKey, dt, allMissiles, isFocused);
        }
        this.handleNavigation(h, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused);
      }
    }

    // Offensive weapon execution strictly for focused aircraft within available command tokens
    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      for (const focusedId of this.focusedUnitIds) {
        const shooter = aliveHostiles.find(h => h.id === focusedId && !h.isAce);
        if (!shooter || shooter.hp <= 0 || shooter.isRTB) continue;
        if (this.game.tokenBucketRed < tokenCost) break;
        this.executeTacticalEngagements(shooter, candidateAirTargets, visibleBunkers, profile, clouds, diffKey, tokenCost, allMissiles);
      }
    }
  }

  executeTacticalEngagements(shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles) {
    if (typeof AIMissileTactics === 'undefined') return;
    const res = AIMissileTactics.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles);

    if (res.isBingo && !shooter.isRTB) {
      if (shooter.gunAmmo && shooter.gunAmmo > 0) return;
      const rtbRoll = Math.random();
      const rtbChances = { CADET: 0.20, VETERAN: 0.35, ELITE: 0.55, ACE: 0.75, MASTER: 0.85, LEGEND: 0.95 };
      if (rtbRoll < (rtbChances[diffKey] || 0.40)) {
        shooter.orderRTB();
        if (this.game.radar) this.game.radar.spawnCombatText(shooter.x, shooter.y, 'BINGO AMMO: WITHDRAWING', '#f59e0b');
      }
      return;
    }

    if (!res.plan || !res.plan.pylonsToFire || res.plan.pylonsToFire.length === 0) return;
    const plan = res.plan;
    const tgt = plan.target;

    for (const pylon of plan.pylonsToFire) {
      if (this.game.tokenBucketRed < tokenCost || pylon.item.ammo <= 0) break;
      pylon.item.ammo--;
      this.game.tokenBucketRed = Math.max(0, this.game.tokenBucketRed - tokenCost);
      this.actionCooldown = profile.reactionCooldown || 5.0;

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
  }

  handleNavigation(hostile, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused) {
    if (!hostile || hostile.activeManeuverTimer > 0 || hostile.isRTB || hostile.hp <= 0) return;

    let target = null;
    const isBomber = Boolean(hostile.spec && hostile.spec.role && (hostile.spec.role.includes('Strike') || hostile.spec.role.includes('Bomber')));
    if (isBomber && visibleBunkers.length > 0) target = visibleBunkers[0];
    else if (candidateAirTargets.length > 0) {
      target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
    }

    const navTiers = {
      CADET:   { turnMult: 0.44, throttle: 0.50, overshootDist: 7.0, overshootChance: 0.60 },
      VETERAN: { turnMult: 0.54, throttle: 0.55, overshootDist: 6.5, overshootChance: 0.45 },
      ELITE:   { turnMult: 0.65, throttle: 0.60, overshootDist: 5.5, overshootChance: 0.32 },
      ACE:     { turnMult: 0.75, throttle: 0.70, overshootDist: 4.8, overshootChance: 0.22 },
      MASTER:  { turnMult: 0.82, throttle: 0.75, overshootDist: 4.2, overshootChance: 0.16 },
      LEGEND:  { turnMult: 0.88, throttle: 0.80, overshootDist: 3.8, overshootChance: 0.10 }
    };

    const tier = navTiers[diffKey] || navTiers.VETERAN;

    if (!target) {
      hostile.heading = Math.PI;
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

    const targetHeading = Math.atan2(target.y - hostile.y, target.x - hostile.x);
    let diff = targetHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const effAgi = (typeof hostile.getEffectiveAgility === 'function')
      ? hostile.getEffectiveAgility()
      : ((hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85);

    // Focused units get active turning; unattended wingmen turn at a steady formation pace
    const focusAgiScale = isFocused ? 1.0 : 0.55;
    const turnCap = effAgi * tier.turnMult * focusAgiScale;
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
    hostile.engineAlpha = isFocused ? tier.throttle : 0.50;
  }
}

window.TacticalAICommander = TacticalAICommander;