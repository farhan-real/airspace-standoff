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
    if (!gameEngine) throw new Error('TacticalAICommander requires gameEngine instance.');
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
    const diffKey = this.game.aiDifficulty;
    const baseProfile = window.AI_DIFFICULTIES[diffKey];
    if (!baseProfile) throw new Error(`Unknown difficulty "${diffKey}" in getCognitiveProfile.`);
    const aceProfile = window.AI_ACE_PROFILES[diffKey];

    const maxSlots = baseProfile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));
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
      reactionCooldown: isAce ? aceProfile.reactionCooldown : baseProfile.reactionCooldown,
      notchChance: isAce ? aceProfile.notchChance : baseProfile.notchChance,
      decoyDiscrimination: isAce ? aceProfile.decoyDiscrimination : baseProfile.decoyDiscrimination,
      blunderChance: isAce ? aceProfile.blunderChance : baseProfile.blunderChance
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

    const diffKey = this.game.aiDifficulty;
    const profile = window.AI_DIFFICULTIES[diffKey];
    if (!profile) throw new Error(`Unknown difficulty "${diffKey}" in AI update.`);

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

    AIDefenseHandler.coordinateAceTactics(this, aliveHostiles.filter(h => h.isAce), candidateAirTargets, visibleBunkers, clouds, allMissiles, profile, diffKey, dt);

    for (const h of aliveHostiles) {
      if (!h.isAce) {
        const isFocused = this.isUnitFocused(h.id);
        AIDefenseHandler.handleDefensiveBehavior(h, profile, diffKey, dt, allMissiles, isFocused);
        AINavigationHandler.handleNavigation(this, h, candidateAirTargets, visibleBunkers, profile, diffKey, dt, isFocused);
      }
    }

    const tokenCost = window.CONFIG.TOKEN_ACTION_COST;
    const maxSlots = profile.attentionSlots || (['MASTER', 'LEGEND'].includes(diffKey) ? 3 : (['ELITE', 'ACE'].includes(diffKey) ? 2 : 1));

    if (this.actionCooldown <= 0 && this.game.tokenBucketRed >= tokenCost) {
      for (const focusedId of this.focusedUnitIds) {
        const shooter = aliveHostiles.find(h => h.id === focusedId && !h.isAce);
        if (!shooter || shooter.hp <= 0 || shooter.isRTB) continue;
        if (this.planning.isHesitating(shooter.id)) continue;
        if (this.game.tokenBucketRed < tokenCost) break;

        const fired = AIMissileTactics.executeTacticalEngagements(this, shooter, candidateAirTargets, visibleBunkers, profile, clouds, diffKey, tokenCost, allMissiles);
        if (fired) {
          const interUnitDelay = Math.max(0.35, profile.reactionCooldown / (maxSlots * 1.5));
          this.actionCooldown = interUnitDelay;
          break;
        }
      }
    }
  }
}

window.TacticalAICommander = TacticalAICommander;