/**
 * AIRSPACE STANDOFF: Tactical AI Commander
 * Attention allocation, cognitive bandwidth slots, and separated Air vs. Attack doctrine routing.
 */

window.AI_ACE_PROFILES = {
  CADET:     { reactionCooldown: 3.8, shotCooldownSec: 2.6, maxInboundPerTarget: 3, inboundKillDiscount: 0.45, reserveRatio: 0.25, minPk: 38, notchChance: 0.25, decoyDiscrimination: 0.35, blunderChance: 0.20, mixedSeekerChance: 0.00, salvoMaxMissiles: 1 },
  BUFFER:    { reactionCooldown: 3.5, shotCooldownSec: 3.0, maxInboundPerTarget: 3, inboundKillDiscount: 0.55, reserveRatio: 0.28, minPk: 42, notchChance: 0.30, decoyDiscrimination: 0.40, blunderChance: 0.16, mixedSeekerChance: 0.05, salvoMaxMissiles: 1 },
  VETERAN:   { reactionCooldown: 3.2, shotCooldownSec: 3.4, maxInboundPerTarget: 2, inboundKillDiscount: 0.65, reserveRatio: 0.32, minPk: 48, notchChance: 0.35, decoyDiscrimination: 0.45, blunderChance: 0.12, mixedSeekerChance: 0.15, salvoMaxMissiles: 2 },
  ESCALATED: { reactionCooldown: 2.8, shotCooldownSec: 3.8, maxInboundPerTarget: 2, inboundKillDiscount: 0.72, reserveRatio: 0.36, minPk: 52, notchChance: 0.42, decoyDiscrimination: 0.52, blunderChance: 0.09, mixedSeekerChance: 0.20, salvoMaxMissiles: 2 },
  ELITE:     { reactionCooldown: 2.4, shotCooldownSec: 4.1, maxInboundPerTarget: 2, inboundKillDiscount: 0.78, reserveRatio: 0.40, minPk: 56, notchChance: 0.50, decoyDiscrimination: 0.60, blunderChance: 0.06, mixedSeekerChance: 0.25, salvoMaxMissiles: 2 },
  FORWARD:   { reactionCooldown: 2.1, shotCooldownSec: 4.4, maxInboundPerTarget: 2, inboundKillDiscount: 0.84, reserveRatio: 0.42, minPk: 59, notchChance: 0.55, decoyDiscrimination: 0.65, blunderChance: 0.04, mixedSeekerChance: 0.30, salvoMaxMissiles: 2 },
  ACE:       { reactionCooldown: 1.8, shotCooldownSec: 4.7, maxInboundPerTarget: 2, inboundKillDiscount: 0.88, reserveRatio: 0.45, minPk: 62, notchChance: 0.60, decoyDiscrimination: 0.70, blunderChance: 0.02, mixedSeekerChance: 0.35, salvoMaxMissiles: 2 },
  FORTIFIED: { reactionCooldown: 1.6, shotCooldownSec: 4.9, maxInboundPerTarget: 2, inboundKillDiscount: 0.90, reserveRatio: 0.48, minPk: 65, notchChance: 0.65, decoyDiscrimination: 0.75, blunderChance: 0.01, mixedSeekerChance: 0.40, salvoMaxMissiles: 3 },
  MASTER:    { reactionCooldown: 1.4, shotCooldownSec: 5.1, maxInboundPerTarget: 2, inboundKillDiscount: 0.93, reserveRatio: 0.50, minPk: 67, notchChance: 0.70, decoyDiscrimination: 0.80, blunderChance: 0.00, mixedSeekerChance: 0.45, salvoMaxMissiles: 3 },
  LEGEND:    { reactionCooldown: 1.1, shotCooldownSec: 5.4, maxInboundPerTarget: 2, inboundKillDiscount: 0.96, reserveRatio: 0.52, minPk: 70, notchChance: 0.75, decoyDiscrimination: 0.85, blunderChance: 0.00, mixedSeekerChance: 0.55, salvoMaxMissiles: 3 }
};

class AICommander {
  constructor(gameEngine) {
    if (!gameEngine) throw new Error('AICommander requires gameEngine instance.');
    this.game = gameEngine;
    this.focusedUnitIds = [];
    this.focusTimers = new Map();
    this.actionCooldown = 1.2;
    this.aceSalvoTimer = 0.0;
    this.planning = new AIPlanningSystem(this);
  }

  getEffectiveDiffKey() {
    if (this.game.scenarioMode === 'ATTACK') {
      const atkProf = window.ATTACK_DIFFICULTIES[this.game.attackDifficulty];
      if (!atkProf) throw new Error(`Invalid attackDifficulty "${this.game.attackDifficulty}" in AICommander.`);
      return atkProf.qraDifficulty;
    }
    return this.game.aiDifficulty;
  }

  getActiveDoctrines() {
    if (!window.AIR_DOCTRINES || !window.ATTACK_DOCTRINES) throw new Error('Doctrine tables are not loaded.');
    const isAttack = (this.game.scenarioMode === 'ATTACK');
    const airDocKey = isAttack ? 'BALANCED' : this.game.aiDoctrine;
    const airDoctrine = window.AIR_DOCTRINES[airDocKey];
    if (!airDoctrine) throw new Error(`Invalid aiDoctrine "${airDocKey}" in AICommander.`);
    const atkDoctrine = isAttack ? window.ATTACK_DOCTRINES[this.game.attackDoctrine] : null;
    if (isAttack && !atkDoctrine) throw new Error(`Invalid attackDoctrine "${this.game.attackDoctrine}" in AICommander.`);
    return { isAttack, airDoctrine, atkDoctrine };
  }

  isUnitFocused(unitId) { return this.focusedUnitIds.includes(unitId); }

  getCognitiveProfile(unitId) {
    const unit = (this.game.hostileAircraft || []).find(h => h.id === unitId) ||
                 (this.game.alliedAircraft || []).find(a => a.id === unitId);
    const isAce = Boolean(unit && unit.isAce);
    const isFocused = this.isUnitFocused(unitId);
    const remainingFocus = this.focusTimers.get(unitId) || 0;
    const diffKey = this.getEffectiveDiffKey();
    const baseProfile = window.AI_DIFFICULTIES[diffKey];
    if (!baseProfile) throw new Error(`Unknown difficulty "${diffKey}" in getCognitiveProfile.`);
    const aceProfile = window.AI_ACE_PROFILES[diffKey];
    if (!aceProfile) throw new Error(`Unknown ace profile "${diffKey}" in getCognitiveProfile.`);
    const { isAttack, airDoctrine, atkDoctrine } = this.getActiveDoctrines();

    const maxSlots = baseProfile.attentionSlots;
    const activeFocusCount = this.focusedUnitIds.length;
    const isHesitating = this.planning.isHesitating(unitId);
    const successionTimer = this.planning.successionTimers.get(unitId) || 0;
    const posture = this.planning.posture;

    let roleInFormation = isAce ? (unit && unit.isFlightLead ? 'Ace Flight Lead' : 'Ace Interceptor') : 'Independent Element';
    let pairedUnit = null;
    if (this.planning.elementPairs) {
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
    const engagedTargetName = (unit && unit.radarLockedTarget && unit.radarLockedTarget.hp > 0.05)
      ? window.formatCombatantDisplayName(unit.radarLockedTarget) : null;
    const ammoRemaining = (unit && unit.equippedWeapons)
      ? unit.equippedWeapons.reduce((s, it) => s + (it && it.weapon && !it.weapon.isJammerPod && !it.weapon.isTargetingPod ? (it.ammo || 0) : 0), 0)
      : 0;

    return {
      isAce, isFocused, remainingFocus, maxSlots, activeFocusCount, diffKey, posture,
      tacticalRole, isHesitating, successionTimer, roleInFormation, pairedUnit, trackOrder: (unit && unit._aiTrackOrder) || null,
      isAttackMode: isAttack,
      airDoctrineId: airDoctrine.id,
      airDoctrineName: airDoctrine.name,
      atkDoctrineId: atkDoctrine ? atkDoctrine.id : null,
      atkDoctrineName: atkDoctrine ? atkDoctrine.name : null,
      atkCapPosture: atkDoctrine ? atkDoctrine.capPosture : null,
      groundPhase: unit ? unit.groundPhase : null,
      airbaseId: unit ? unit.airbaseId : null,
      takeoffSegmentsReq: unit ? unit.takeoffSegmentsReq : null,
      isRTB: Boolean(unit && unit.isRTB),
      engagedTargetName,
      ammoRemaining,
      salvoMaxMissiles: isAce ? aceProfile.salvoMaxMissiles : Math.max(1, Math.min(3, baseProfile.salvoMaxMissiles + airDoctrine.salvoBias)),
      shotCooldownSec: Number((((isAce ? aceProfile.shotCooldownSec : baseProfile.shotCooldownSec) * airDoctrine.cooldownMult)).toFixed(2)),
      reserveRatio: Math.max(0.05, Math.min(0.65, (isAce ? aceProfile.reserveRatio : baseProfile.reserveRatio) + airDoctrine.reserveBias)),
      maxInboundPerTarget: Math.max(1, Math.min(4, (isAce ? aceProfile.maxInboundPerTarget : baseProfile.maxInboundPerTarget) + airDoctrine.inboundCapBias)),
      mixedSeekerChance: isAce ? aceProfile.mixedSeekerChance : baseProfile.mixedSeekerChance,
      desiredHoldKm: airDoctrine.desiredHoldKm,
      doctrine: isAttack ? atkDoctrine.id : airDoctrine.id,
      doctrineName: isAttack ? atkDoctrine.name : airDoctrine.name,
      reactionCooldown: isAce ? aceProfile.reactionCooldown : baseProfile.reactionCooldown,
      maneuverChance: isAce ? Math.min(0.99, (baseProfile.maneuverChance || 0.72) + 0.12) : (baseProfile.maneuverChance || 0.72),
      maneuverCooldownSec: isAce ? Math.max(2.4, (baseProfile.maneuverCooldownSec || 6.0) - 1.2) : (baseProfile.maneuverCooldownSec || 6.0),
      notchChance: Math.max(0, Math.min(0.85, (isAce ? aceProfile.notchChance : baseProfile.notchChance) + airDoctrine.notchBias)),
      decoyDiscrimination: isAce ? aceProfile.decoyDiscrimination : baseProfile.decoyDiscrimination,
      blunderChance: isAce ? aceProfile.blunderChance : baseProfile.blunderChance
    };
  }

  updateAttention(aliveHostiles, profile, diffKey, allMissiles, dt) {
    const aliveIds = new Set(aliveHostiles.map(h => h.id));
    this.focusedUnitIds = this.focusedUnitIds.filter(id => aliveIds.has(id));
    for (const id of this.focusTimers.keys()) {
      if (!aliveIds.has(id)) this.focusTimers.delete(id);
    }
    for (const id of this.focusedUnitIds) {
      this.focusTimers.set(id, Math.max(0, (this.focusTimers.get(id) || 0) - dt));
    }

    const maxSlots = profile.attentionSlots;
    const scoredUnits = aliveHostiles.map(h => {
      let score = 0;
      const inbound = allMissiles.filter(m => m.active && m.target && m.target.id === h.id);
      if (inbound.length > 0) {
        const nearestDist = inbound.reduce((min, m) => Math.min(min, m.distanceToTarget || 99), 99);
        score += nearestDist < 12.0 ? 120 : (nearestDist < 25.0 ? 75 : 35);
      }
      if (h.hp <= 2) score += 30;
      if (h.radarLockedTarget && h.radarLockedTarget.hp > 0.05 && Math.hypot(h.radarLockedTarget.x - h.x, h.radarLockedTarget.y - h.y) <= 45.0) score += 35;
      if (h.isAce) score += 55;
      else if (h.isFlightLead) score += 20;
      if (this.focusedUnitIds.includes(h.id) && (this.focusTimers.get(h.id) || 0) > 0) score += 40;
      return { unit: h, score };
    });

    scoredUnits.sort((a, b) => b.score - a.score);
    const newFocus = [];
    const span = profile.attentionSpanSec;
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

    const diffKey = this.getEffectiveDiffKey();
    const profile = window.AI_DIFFICULTIES[diffKey];
    if (!profile) throw new Error(`Unknown difficulty "${diffKey}" in AI update.`);
    const { airDoctrine, atkDoctrine } = this.getActiveDoctrines();

    const aliveHostiles = (this.game.hostileAircraft || []).filter(a => a.hp > 0.05 && !a.groundPhase);
    if (aliveHostiles.length === 0) return;

    this.planning.update(dt, aliveHostiles, profile, diffKey, airDoctrine);

    const redDetected = this.game.detectedByRed || new Set();
    const liveAllies = (this.game.alliedAircraft || []).filter(a => a.hp > 0.05 && redDetected.has(a.id));
    const visibleAllies = liveAllies.filter(a => a.identifiedByRed || a.isIdentifiedBy('hostile'));
    const untrackedAllies = liveAllies.filter(a => !(a.identifiedByRed || a.isIdentifiedBy('hostile')));
    const blueDecoys = (this.game.simulation && this.game.simulation.decoyDrones || []).filter(d => d.hp > 0.05 && d.team === 'friendly' && redDetected.has(d.id));

    const candidateAirTargets = visibleAllies.concat(blueDecoys);
    const visibleBunkers = (this.game.surfaceUnits || []).filter(s => s.team === 'friendly' && s.hp > 0.05 && !s.isIndestructible);
    const clouds = (this.game.simulation && this.game.simulation.weatherClouds) || [];
    const allMissiles = this.game.missiles || [];

    this.updateAttention(aliveHostiles, profile, diffKey, allMissiles, dt);
    AIEvasionHandler.coordinateAceTactics(this, aliveHostiles.filter(h => h.isAce), candidateAirTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt, airDoctrine, atkDoctrine, untrackedAllies);

    for (const h of aliveHostiles) {
      if (h._aiFireCooldown > 0) h._aiFireCooldown = Math.max(0, h._aiFireCooldown - dt);
      if (h._aiManeuverCooldown > 0) h._aiManeuverCooldown = Math.max(0, h._aiManeuverCooldown - dt);
      if (!h.isAce) {
        const isFocused = this.isUnitFocused(h.id);
        AIEvasionHandler.handleDefensiveBehavior(h, profile, diffKey, dt, allMissiles, isFocused, airDoctrine);
        AINavigationHandler.handleNavigation(this, h, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused, airDoctrine, atkDoctrine, untrackedAllies, allMissiles);
      }
    }

    const tokenCost = window.CONFIG.TOKEN_ACTION_COST;
    const maxSlots = profile.attentionSlots;

    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      for (const focusedId of this.focusedUnitIds) {
        const shooter = aliveHostiles.find(h => h.id === focusedId && !h.isAce);
        if (!shooter || shooter.hp <= 0.05 || shooter.isRTB || this.planning.isHesitating(shooter.id)) continue;
        if (shooter._aiFireCooldown > 0) continue;
        if (this.game.tokenBucketRed < tokenCost) break;

        if (AIMissileTactics.executeEngagements(this, shooter, candidateAirTargets, visibleBunkers, profile, clouds, diffKey, tokenCost, allMissiles, airDoctrine)) {
          this.actionCooldown = Math.max(0.95, profile.reactionCooldown / Math.max(1.2, maxSlots * 0.9));
          break;
        }
      }
    }
  }
}

window.AICommander = AICommander;
