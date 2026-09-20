/**
 * AIRSPACE STANDOFF: Tactical AI Commander
 * Scaled difficulty curves; notching and advanced movement restricted to very high difficulties.
 */

class TacticalAICommander {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.focusUnitId = null;
    this.focusTimer = 0.0;
    this.actionCooldown = 1.6;
    this.defensiveReactionCooldown = 0.0;
    this.aceSalvoTimer = 0.0;
  }

  update(dt) {
    if (this.game.playerMode === '2P' || this.game.isGameOver) return;

    if (this.actionCooldown > 0) this.actionCooldown -= dt;
    if (this.focusTimer > 0) this.focusTimer -= dt;
    if (this.defensiveReactionCooldown > 0) this.defensiveReactionCooldown -= dt;
    if (this.aceSalvoTimer > 0) this.aceSalvoTimer -= dt;

    const diffKey = this.game.aiDifficulty || 'VETERAN';
    const profile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]) || {
      reactionCooldown: 5.8, attentionSpanSec: 4.8, engagementRangeRatio: 0.55, evasionSkill: 0.24, blunderChance: 0.46, usesDopplerNotch: false, multiTarget: false, useAdvancedManeuvers: false
    };

    const aliveHostiles = (this.game.hostileAircraft || []).filter(a => a.hp > 0);
    if (aliveHostiles.length === 0) return;

    const redDetected = this.game.detectedByRed || new Set();
    const visibleAllies = (this.game.alliedAircraft || []).filter(a => a.hp > 0 && redDetected.has(a.id) && (a.identifiedByRed || a.isIdentifiedBy('hostile')));
    const blueDecoys = (this.game.simulation && this.game.simulation.decoyDrones || []).filter(d => d.hp > 0 && d.team === 'friendly' && redDetected.has(d.id));

    const candidateAirTargets = visibleAllies.concat(blueDecoys);
    const visibleBunkers = (this.game.surfaceUnits || []).filter(s => s.team === 'friendly' && s.hp > 0);
    const clouds = (this.game.simulation && this.game.simulation.weatherClouds) || [];
    const allMissiles = this.game.missiles || [];

    this.coordinateAceTactics(aliveHostiles.filter(h => h.isAce), candidateAirTargets, clouds, allMissiles, profile, diffKey, dt);

    for (const h of aliveHostiles) {
      if (!h.isAce) {
        this.handleDefensiveBehavior(h, profile, diffKey, dt);
        this.handleNavigation(h, candidateAirTargets, visibleBunkers, profile, diffKey, dt);
      }
    }

    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      const nonAces = aliveHostiles.filter(h => !h.isAce);
      const shooters = profile.multiTarget ? nonAces : [this.getFocusShooter(nonAces, profile)];
      for (const shooter of shooters) {
        if (!shooter || shooter.hp <= 0 || shooter.isRTB) continue;
        if (this.game.tokenBucketRed < tokenCost) break;
        this.executeTacticalEngagements(shooter, candidateAirTargets, visibleBunkers, profile, clouds, diffKey, tokenCost, allMissiles);
      }
    }
  }

  getFocusShooter(aliveHostiles, profile) {
    let focus = aliveHostiles.find(a => a.id === this.focusUnitId);
    if (!focus || this.focusTimer <= 0) {
      focus = aliveHostiles.find(h => !h.isRTB) || aliveHostiles[0];
      this.focusUnitId = focus ? focus.id : null;
      this.focusTimer = profile.attentionSpanSec || 4.8;
    }
    return focus;
  }

  executeTacticalEngagements(shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles) {
    if (typeof AIMissileTactics === 'undefined') return;
    const res = AIMissileTactics.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles);

    if (res.isBingo && !shooter.isRTB) {
      const rtbRoll = Math.random();
      const rtbChances = { CADET: 0.20, VETERAN: 0.35, ELITE: 0.55, ACE: 0.75, MASTER: 0.85, LEGEND: 0.95 };
      if (rtbRoll < (rtbChances[diffKey] || 0.40)) {
        shooter.orderRTB();
        if (this.game.radar) this.game.radar.spawnCombatText(shooter.x, shooter.y, 'BINGO AMMO: RTB REARM', '#f59e0b');
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
        tgt.hp = Math.max(0, tgt.hp - pylon.weapon.damage);
        if (this.game.radar) {
          this.game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
          this.game.radar.spawnCombatText(tgt.x, tgt.y, `LASER -${pylon.weapon.damage}HP`, '#f43f5e');
        }
      } else {
        this.game.missiles.push(new MissileEntity(pylon.weapon, shooter, tgt));
        if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
      }
    }
    shooter.recalculateWeight();
  }

  coordinateAceTactics(aces, candidateTargets, clouds, allMissiles, profile, diffKey, dt) {
    if (!aces || aces.length === 0) return;

    const aceBlunders = { CADET: 0.65, VETERAN: 0.50, ELITE: 0.38, ACE: 0.28, MASTER: 0.20, LEGEND: 0.15 };
    const aceBlunderChance = aceBlunders[diffKey] !== undefined ? aceBlunders[diffKey] : 0.40;
    const isVeryHighDiff = (diffKey === 'MASTER' || diffKey === 'LEGEND');

    for (const ace of aces) {
      if (ace.hp <= 0) continue;

      const incoming = (this.game.missiles || []).filter(m => m.active && m.target && m.target.id === ace.id);
      if (incoming.length > 0) {
        const nearest = incoming.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, incoming[0]);
        const isRadar = Boolean(nearest.weapon && (nearest.weapon.seeker === 'ARH' || nearest.weapon.seeker === 'PASSIVE_RADAR'));
        const isStealth = Boolean(nearest.isStealthMissile || (nearest.rcs <= 0.005));
        const blunderedDefense = Math.random() < aceBlunderChance;
        const triggerDist = isStealth ? (blunderedDefense ? 4.5 : 6.5) : (blunderedDefense ? 7.5 : 11.0);

        if (nearest.distanceToTarget < triggerDist) {
          // Doppler notching is strictly reserved for very high difficulties
          if (isVeryHighDiff && isRadar && !blunderedDefense) {
            const perpHeading = nearest.heading + Math.PI / 2;
            let dAngle = perpHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            ace.heading += Math.max(-1.10 * dt, Math.min(1.10 * dt, dAngle));
            if (Math.abs(dAngle) < 0.18) {
              ace.isNotching = true;
              ace.activeManeuverId = 'DOPPLER_NOTCH';
              ace.activeManeuverTimer = 6.0;
              ace.activeManeuverBonus = 0.48;
              if (ace.chaff > 0 && ace.cmTimer <= 0) ace.deployCountermeasures();
            }
          } else {
            // Standard break turn for all other difficulties
            const awayHeading = nearest.heading + (Math.random() < 0.5 ? 0.75 : -0.75);
            let dAngle = awayHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            const turnRateCap = (diffKey === 'CADET' ? 0.70 : (diffKey === 'VETERAN' ? 0.85 : 1.10));
            ace.heading += Math.max(-turnRateCap * dt, Math.min(turnRateCap * dt, dAngle));
            ace.isNotching = false;
            ace.activeManeuverId = 'BREAK_TURN';
            ace.activeManeuverTimer = 5.0;
            ace.activeManeuverBonus = 0.38;
            ace.engineAlpha = blunderedDefense ? 0.75 : 0.50;
            if (ace.chaff > 0 && ace.cmTimer <= 0 && Math.random() < 0.45) ace.deployCountermeasures();
          }
        }
      }

      if (typeof AIMissileTactics !== 'undefined') {
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey);
        if (acePlan && acePlan.target) {
          const tgt = acePlan.target;
          ace.radarLockedTarget = tgt;
          const interceptAngle = Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0);
          let diff = interceptAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const turnRateCap = (diffKey === 'CADET' ? 0.70 : (diffKey === 'VETERAN' ? 0.85 : 1.10));
          ace.heading += Math.max(-turnRateCap * dt, Math.min(turnRateCap * dt, diff));

          if (this.aceSalvoTimer <= 0 && this.game.tokenBucketRed >= 0.70 && !ace.isRTB) {
            for (const pylon of acePlan.pylonsToFire) {
              if (this.game.tokenBucketRed < 0.70 || pylon.item.ammo <= 0) break;
              pylon.item.ammo--;
              this.game.tokenBucketRed = Math.max(0, this.game.tokenBucketRed - 0.70);
              this.game.missiles.push(new MissileEntity(pylon.weapon, ace, tgt));
              if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
            }
            ace.recalculateWeight();
            this.aceSalvoTimer = isVeryHighDiff ? 3.4 : 5.2;
          }
        }
      }
    }
  }

  handleDefensiveBehavior(hostile, profile, diffKey, dt) {
    if (!hostile || !this.game.missiles || hostile.hp <= 0) return;
    const incoming = this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
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
    const reactDistance = isStealth ? tier.stealthDist : tier.reactDist;
    if (nearestMsl.distanceToTarget > reactDistance) return;

    if (Math.random() < tier.blunderChance) return;

    const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
    if (nearestMsl.distanceToTarget < 5.0 && hasCm && hostile.cmTimer <= 0) {
      if (Math.random() < tier.cmChance) hostile.deployCountermeasures();
    }

    // Notching and advanced movement restricted strictly to very high difficulties
    if (!isVeryHighDiff || !profile.usesDopplerNotch) {
      const awayHeading = nearestMsl.heading + (Math.random() < 0.5 ? 0.75 : -0.75);
      let diff = awayHeading - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      const turnCap = (hostile.spec && hostile.spec.AGI_0 ? hostile.spec.AGI_0 : 0.8) * tier.turnMult;
      hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
      hostile.activeManeuverTimer = 5.0;
      hostile.activeManeuverBonus = tier.bonus;
      hostile.activeManeuverId = 'BREAK_TURN';
      hostile.isNotching = false;
      return;
    }

    if (isVeryHighDiff && profile.usesDopplerNotch && nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR')) {
      const desiredPerp = nearestMsl.heading + Math.PI / 2;
      let diff = desiredPerp - hostile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      const agi = (hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85;
      hostile.heading += Math.max(-agi * tier.turnMult * dt, Math.min(agi * tier.turnMult * dt, diff));
      if (Math.abs(diff) < 0.20) {
        hostile.isNotching = true;
        hostile.activeManeuverTimer = 6.0;
        hostile.activeManeuverBonus = tier.bonus;
        hostile.activeManeuverId = 'DOPPLER_NOTCH';
      }
    }
  }

  handleNavigation(hostile, candidateAirTargets, visibleBunkers, profile, diffKey, dt) {
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

    const agi = (hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85;
    const turnCap = agi * tier.turnMult;
    hostile.heading += Math.max(-turnCap * dt, Math.min(turnCap * dt, diff));
    hostile.engineAlpha = tier.throttle;
  }
}

window.TacticalAICommander = TacticalAICommander;