/**
 * AIRSPACE STANDOFF // Tactical AI Commander
 * Multi-missile salvo execution, difficulty-scaled Ace blunders, and autonomous RTB.
 */

class TacticalAICommander {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.focusUnitId = null;
    this.focusTimer = 0.0;
    this.actionCooldown = 1.4;
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
      reactionCooldown: 3.8, attentionSpanSec: 4.0, engagementRangeRatio: 0.70, evasionSkill: 0.40, blunderChance: 0.28, usesDopplerNotch: true, multiTarget: false, useAdvancedManeuvers: false
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
        this.handleDefensiveBehavior(h, profile, dt);
        this.handleNavigation(h, candidateAirTargets, visibleBunkers, profile, dt);
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
      this.focusTimer = profile.attentionSpanSec || 3.5;
    }
    return focus;
  }

  executeTacticalEngagements(shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles) {
    if (typeof AIMissileTactics === 'undefined') return;
    const res = AIMissileTactics.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles);

    if (res.isBingo && !shooter.isRTB) {
      const rtbRoll = Math.random();
      const rtbChance = diffKey === 'CADET' ? 0.20 : (diffKey === 'VETERAN' ? 0.40 : (diffKey === 'ELITE' ? 0.75 : 0.95));
      if (rtbRoll < rtbChance) {
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
      this.actionCooldown = profile.reactionCooldown || 3.0;

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

    // Difficulty-scaled Ace blunder and evasion rates
    const aceBlunders = { CADET: 0.35, VETERAN: 0.25, ELITE: 0.08, ACE: 0.03, MASTER: 0.01, LEGEND: 0.00 };
    const aceBlunderChance = aceBlunders[diffKey] !== undefined ? aceBlunders[diffKey] : 0.12;

    for (const ace of aces) {
      if (ace.hp <= 0) continue;

      const incoming = (this.game.missiles || []).filter(m => m.active && m.target && m.target.id === ace.id);
      if (incoming.length > 0) {
        const nearest = incoming.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, incoming[0]);
        const isRadar = Boolean(nearest.weapon && (nearest.weapon.seeker === 'ARH' || nearest.weapon.seeker === 'PASSIVE_RADAR'));
        const blunderedDefense = Math.random() < aceBlunderChance;

        if (nearest.distanceToTarget < (blunderedDefense ? 20.0 : 36.0)) {
          if (isRadar) {
            const notchOffset = blunderedDefense ? (Math.PI / 2.6) : (Math.PI / 2);
            const perpHeading = nearest.heading + notchOffset;
            let dAngle = perpHeading - ace.heading;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            ace.heading += Math.max(-2.8 * dt, Math.min(2.8 * dt, dAngle));
            if (!blunderedDefense || Math.random() < 0.60) {
              ace.isNotching = true;
              if (ace.chaff > 0 && ace.cmTimer <= 0) ace.deployCountermeasures();
            }
          } else {
            ace.engineAlpha = blunderedDefense ? 0.60 : 0.40;
          }
        }

        if (nearest.distanceToTarget < 14.0 && ace.activeManeuverTimer <= 0) {
          const failBreak = blunderedDefense && Math.random() < 0.40;
          if (!failBreak) {
            if (ace.thrustVector) {
              ace.activeManeuverTimer = 2.8;
              ace.activeManeuverBonus = diffKey === 'VETERAN' ? 0.28 : 0.38;
              ace.speed = Math.max(0.18, ace.speed * 0.45);
              if (this.game.radar) {
                this.game.radar.spawnCombatText(ace.x, ace.y, 'ACE COBRA (+38% EVASION)', '#ffd700');
                this.game.radar.spawnShockwave(ace.x, ace.y, '#ffd700', 35);
              }
            } else {
              ace.activeManeuverTimer = 3.0;
              ace.activeManeuverBonus = diffKey === 'VETERAN' ? 0.20 : 0.28;
              ace.speed = Math.max(0.25, ace.speed - 0.14);
              if (this.game.radar) {
                this.game.radar.spawnCombatText(ace.x, ace.y, 'ACE BREAK TURN (+28% EVASION)', '#ffd700');
                this.game.radar.spawnShockwave(ace.x, ace.y, '#ffd700', 25);
              }
            }
          }
        }
      }

      if (typeof AIMissileTactics !== 'undefined') {
        const acePlan = AIMissileTactics.selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey);

        if (!acePlan && ace.equippedWeapons.every(p => !p || p.ammo <= 0) && !ace.isRTB) {
          const rtbChance = diffKey === 'VETERAN' ? 0.40 : (diffKey === 'ELITE' ? 0.75 : 0.95);
          if (Math.random() < rtbChance) {
            ace.orderRTB();
            if (this.game.radar) this.game.radar.spawnCombatText(ace.x, ace.y, 'ACE RTB REARM', '#ffd700');
          }
          continue;
        }

        if (acePlan && acePlan.target) {
          const tgt = acePlan.target;
          ace.radarLockedTarget = tgt;

          const interceptAngle = Physics.calcLeadInterceptAngle(ace.x, ace.y, ace.speed || 0.9, tgt.x, tgt.y, tgt.heading || 0, tgt.speed || 0);
          let diff = interceptAngle - ace.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          ace.heading += Math.max(-2.6 * dt, Math.min(2.6 * dt, diff));

          const dToTgt = Math.hypot(tgt.x - ace.x, tgt.y - ace.y);
          ace.engineAlpha = dToTgt > 25.0 ? 0.95 : 0.65;

          if (this.aceSalvoTimer <= 0 && this.game.tokenBucketRed >= 0.70 && !ace.isRTB) {
            for (const pylon of acePlan.pylonsToFire) {
              if (this.game.tokenBucketRed < 0.70 || pylon.item.ammo <= 0) break;
              pylon.item.ammo--;
              this.game.tokenBucketRed = Math.max(0, this.game.tokenBucketRed - 0.70);
              this.game.missiles.push(new MissileEntity(pylon.weapon, ace, tgt));
              if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
            }
            ace.recalculateWeight();
            this.aceSalvoTimer = diffKey === 'VETERAN' ? 4.2 : 3.0;
          }
        }
      }
    }
  }

  handleDefensiveBehavior(hostile, profile, dt) {
    if (!hostile || !this.game.missiles || hostile.hp <= 0) return;
    const incoming = this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);
    if (nearestMsl.distanceToTarget < (profile.multiTarget ? 35.0 : 28.0)) {
      if (Math.random() < (profile.blunderChance || 0.28)) return;

      if (hostile.hasMaldDecoy && hostile.maldDecoyCharges > 0 && Math.random() < 0.75) {
        hostile.deployDecoyDrone();
      }

      const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0);
      if (nearestMsl.distanceToTarget < 20.0 && hasCm && hostile.cmTimer <= 0) {
        if (Math.random() < (profile.evasionSkill || 0.40)) hostile.deployCountermeasures();
      }

      if (profile.usesDopplerNotch && nearestMsl.weapon && (nearestMsl.weapon.seeker === 'ARH' || nearestMsl.weapon.seeker === 'PASSIVE_RADAR')) {
        const desiredPerp = nearestMsl.heading + Math.PI / 2;
        let diff = desiredPerp - hostile.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        const agi = (hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85;
        hostile.heading += Math.max(-agi * 1.8 * dt, Math.min(agi * 1.8 * dt, diff));
        if (Math.abs(diff) < 0.30) {
          hostile.isNotching = true;
          hostile.activeManeuverTimer = 2.8;
          hostile.activeManeuverBonus = 0.30 * (profile.evasionSkill || 0.40);
        }
      }
    }
  }

  handleNavigation(hostile, candidateAirTargets, visibleBunkers, profile, dt) {
    if (!hostile || hostile.activeManeuverTimer > 0 || hostile.isRTB || hostile.hp <= 0) return;

    let target = null;
    const isBomber = Boolean(hostile.spec && hostile.spec.role && (hostile.spec.role.includes('Strike') || hostile.spec.role.includes('Bomber')));
    if (isBomber && visibleBunkers.length > 0) target = visibleBunkers[0];
    else if (candidateAirTargets.length > 0) {
      target = candidateAirTargets.reduce((best, cur) => (Math.hypot(cur.x - hostile.x, cur.y - hostile.y) < Math.hypot(best.x - hostile.x, best.y - hostile.y) ? cur : best), candidateAirTargets[0]);
    }

    if (!target) {
      hostile.heading = Math.PI;
      hostile.engineAlpha = 0.60;
      return;
    }

    hostile.radarLockedTarget = target;
    const targetHeading = Math.atan2(target.y - hostile.y, target.x - hostile.x);
    let diff = targetHeading - hostile.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    const agi = (hostile.spec && hostile.spec.AGI_0) ? hostile.spec.AGI_0 : 0.85;
    hostile.heading += Math.max(-agi * (profile.multiTarget ? 1.8 : 1.5) * dt, Math.min(agi * (profile.multiTarget ? 1.8 : 1.5) * dt, diff));
  }
}

window.TacticalAICommander = TacticalAICommander;