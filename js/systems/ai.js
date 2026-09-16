/**
 * APEX VECTOR // Tactical AI Commander
 * High-difficulty AI (Elite, Ace, Master, Legend) coordinates fleet-wide maneuvers,
 * lethal mixed-seeker salvos, aggressive notching, and Ace escape tactics.
 */

class TacticalAICommander {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.focusUnitId = null;
    this.focusTimer = 0.0;
    this.actionCooldown = 1.5;
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
      reactionCooldown: 3.0, attentionSpanSec: 3.5, engagementRangeRatio: 0.75, evasionSkill: 0.50, blunderChance: 0.20, usesDopplerNotch: true, multiTarget: false, useAdvancedManeuvers: false
    };

    const aliveHostiles = this.game.hostileAircraft ? this.game.hostileAircraft.filter(a => a.hp > 0) : [];
    if (aliveHostiles.length === 0) return;

    const redDetected = this.game.detectedByRed || new Set();

    const visibleAllies = (this.game.alliedAircraft || []).filter(a => a.hp > 0 && redDetected.has(a.id) && (a.identifiedByRed || a.isIdentifiedBy('hostile')));
    const blueDecoys = (this.game.simulation && this.game.simulation.decoyDrones || [])
      .filter(d => d.hp > 0 && d.team === 'friendly' && redDetected.has(d.id) && (d.identifiedByRed || d.isIdentifiedBy('hostile')));

    const candidateAirTargets = visibleAllies.concat(blueDecoys);
    const visibleBunkers = (this.game.surfaceUnits || []).filter(s => s.team === 'friendly' && s.hp > 0);

    // Coordinate Ace maneuvers and extreme missile evasion
    this.coordinateAceTactics(aliveHostiles.filter(h => h.isAce), candidateAirTargets, dt);

    // Fleet-wide defensive reactions on higher difficulty
    if (profile.multiTarget) {
      for (const h of aliveHostiles) {
        this.handleDefensiveBehavior(h, profile, dt);
      }
    }

    let activeFocusUnit = aliveHostiles.find(a => a.id === this.focusUnitId);
    if (!activeFocusUnit || this.focusTimer <= 0) {
      const threatened = aliveHostiles.find(h => this.game.missiles.some(m => m.active && m.target && m.target.id === h.id));
      activeFocusUnit = threatened || aliveHostiles[Math.floor(Math.random() * aliveHostiles.length)];
      this.focusUnitId = activeFocusUnit.id;
      this.focusTimer = profile.attentionSpanSec;
    }

    if (!profile.multiTarget) {
      this.handleDefensiveBehavior(activeFocusUnit, profile, dt);
    }

    // Fleet navigation
    for (const h of aliveHostiles) {
      this.handleNavigation(h, candidateAirTargets, visibleBunkers, profile, dt);
    }

    // Weapons engagement
    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      const shooters = profile.multiTarget ? aliveHostiles : [activeFocusUnit];
      for (const shooter of shooters) {
        if (this.game.tokenBucketRed < tokenCost) break;
        this.handleWeaponEngagements(shooter, candidateAirTargets, visibleBunkers, profile, tokenCost);
      }
    }
  }

  coordinateAceTactics(aces, candidateTargets, dt) {
    if (aces.length === 0) return;

    // Aces proactively evade any incoming missiles within 42km
    for (const ace of aces) {
      const incoming = (this.game.missiles || []).filter(m => m.active && m.target && m.target.id === ace.id);
      if (incoming.length > 0) {
        const nearest = incoming.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, incoming[0]);
        if (nearest.distanceToTarget < 40.0) {
          if (ace.chaff > 0 && ace.cmTimer <= 0) {
            ace.deployCountermeasures();
          }
          if (nearest.weapon && nearest.weapon.seeker === 'ARH') {
            const desiredPerp = nearest.heading + Math.PI / 2;
            let diff = desiredPerp - ace.heading;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            ace.heading += Math.max(-2.6 * dt, Math.min(2.6 * dt, diff));
            ace.isNotching = true;
            ace.activeManeuverTimer = 3.0;
            ace.activeManeuverBonus = 0.35;
          }
          if (nearest.distanceToTarget < 14.0 && ace.thrustVector) {
            ace.activeManeuverBonus = Math.max(ace.activeManeuverBonus, 0.40);
            ace.speed = Math.max(0.30, ace.speed * 0.75);
          }
        }
      }
    }

    if (candidateTargets.length === 0) return;
    const targetLead = candidateTargets.find(t => t.isFlightLead) || candidateTargets[0];

    aces.forEach((ace, idx) => {
      const offsetAngle = (idx === 0) ? -0.40 : 0.40;
      const targetHeading = Math.atan2(targetLead.y - ace.y, targetLead.x - ace.x) + offsetAngle;
      let diff = targetHeading - ace.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      ace.heading += Math.max(-2.5 * dt, Math.min(2.5 * dt, diff));

      if (this.aceSalvoTimer <= 0 && this.game.tokenBucketRed >= 1.4) {
        const dist = Math.hypot(targetLead.x - ace.x, targetLead.y - ace.y);
        if (dist <= 75.0 && dist >= 6.0 && ace.equippedWeapons) {
          for (let pIdx = 0; pIdx < ace.equippedWeapons.length; pIdx++) {
            const item = ace.equippedWeapons[pIdx];
            if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy) {
              item.ammo--;
              this.game.tokenBucketRed -= 0.70;
              this.game.missiles.push(new MissileEntity(item.weapon, ace, targetLead));
              if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
              this.aceSalvoTimer = 3.2;
              break;
            }
          }
        }
      }
    });
  }

  handleDefensiveBehavior(hostile, profile, dt) {
    if (!hostile || !this.game.missiles) return;
    const incoming = this.game.missiles.filter(m => m.active && m.target && m.target.id === hostile.id);
    if (incoming.length === 0) return;

    const nearestMsl = incoming.reduce((min, m) => (m.distanceToTarget < min.distanceToTarget ? m : min), incoming[0]);

    if (nearestMsl.distanceToTarget < (profile.multiTarget ? 35.0 : 28.0)) {
      if (!hostile.isAce && Math.random() < profile.blunderChance) {
        return;
      }

      if (hostile.hasMaldDecoy && hostile.maldDecoyCharges > 0 && Math.random() < 0.75) {
        hostile.deployDecoyDrone();
      }

      const hasCm = (hostile.chaff > 0 || hostile.countermeasures > 0 || hostile.chaffFlares > 0);
      if (nearestMsl.distanceToTarget < 20.0 && hasCm && hostile.cmTimer <= 0) {
        if (hostile.isAce || Math.random() < profile.evasionSkill) {
          hostile.deployCountermeasures();
        }
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
          hostile.activeManeuverBonus = 0.30 * profile.evasionSkill;
        }
      }

      if (profile.useAdvancedManeuvers && nearestMsl.distanceToTarget < 12.0) {
        if (hostile.thrustVector) {
          hostile.activeManeuverBonus = Math.max(hostile.activeManeuverBonus, 0.38);
        } else if (hostile.alt > 0.30) {
          hostile.dive();
        }
      }
    }
  }

  handleNavigation(hostile, candidateAirTargets, visibleBunkers, profile, dt) {
    if (!hostile || hostile.activeManeuverTimer > 0) return;

    let target = null;
    const isBomber = hostile.spec && hostile.spec.role && (hostile.spec.role.includes('Strike') || hostile.spec.role.includes('Bomber'));

    if (isBomber && visibleBunkers.length > 0) target = visibleBunkers[0];
    else if (candidateAirTargets.length > 0) {
      target = candidateAirTargets.reduce((best, cur) => {
        const dCur = Math.hypot(cur.x - hostile.x, cur.y - hostile.y);
        const dBest = Math.hypot(best.x - hostile.x, best.y - hostile.y);
        return dCur < dBest ? cur : best;
      }, candidateAirTargets[0]);
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
    const turnMult = profile.multiTarget ? 1.8 : 1.5;
    hostile.heading += Math.max(-agi * turnMult * dt, Math.min(agi * turnMult * dt, diff));
  }

  handleWeaponEngagements(hostile, candidateAirTargets, visibleBunkers, profile, tokenCost) {
    if (!hostile || !hostile.equippedWeapons || hostile.equippedWeapons.length === 0) return;

    for (let pIdx = 0; pIdx < hostile.equippedWeapons.length; pIdx++) {
      const item = hostile.equippedWeapons[pIdx];
      if (!item || item.ammo <= 0) continue;
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isDecoy) continue;

      const candidateTargets = (w.category === 'A2G' || w.isBunkerCracker) ? visibleBunkers : candidateAirTargets;
      if (candidateTargets.length === 0) continue;

      for (const tgt of candidateTargets) {
        if (tgt.isCivilian) continue;
        if (!tgt.type && !tgt.identifiedByRed && !tgt.isIdentifiedBy('hostile')) continue;

        const dist = Math.hypot(tgt.x - hostile.x, tgt.y - hostile.y);
        const maxEngagementRange = w.rangeKm * profile.engagementRangeRatio;

        if (dist <= maxEngagementRange && dist >= (w.minRangeKm || 2.0)) {
          item.ammo--;
          this.game.tokenBucketRed = Math.max(0, this.game.tokenBucketRed - tokenCost);
          this.actionCooldown = profile.reactionCooldown;

          if (w.isLaser) {
            if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
            tgt.hp = Math.max(0, tgt.hp - w.damage);
            if (this.game.radar) {
              this.game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
              this.game.radar.spawnCombatText(tgt.x, tgt.y, `LASER -${w.damage}HP`, '#f43f5e');
            }
          } else {
            if (typeof MissileEntity !== 'undefined') {
              this.game.missiles.push(new MissileEntity(w, hostile, tgt));
            }
            if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
          }

          hostile.recalculateWeight();
          return;
        }
      }
    }
  }
}

window.TacticalAICommander = TacticalAICommander;
