/**
 * AIRSPACE STANDOFF: Targeting Controls & Contact Proximity Engine
 */

class ControlsTargetingHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys.game;
  }

  getDetectedTargets() {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return [];

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const is2P = Boolean(this.game && this.game.playerMode === '2P');
    const detectedSet = is2P ? null : ((commanderTeam === 'friendly') ? (this.game.detectedByBlue || new Set()) : (this.game.detectedByRed || new Set()));
    const enemyRoster = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
    const enemyTeamTag = (commanderTeam === 'friendly') ? 'hostile' : 'friendly';

    const detected = [];
    for (const h of enemyRoster) {
      if (h && h.hp > 0 && (is2P || (detectedSet && detectedSet.has(h.id)))) {
        detected.push({ entity: h, dist: Math.hypot(h.x - active.x, h.y - active.y) });
      }
    }
    const ghosts = (this.game.simulation && this.game.simulation.ghostContacts) || [];
    for (const g of ghosts) {
      if (g && g.hp > 0 && !g.isDissolved && (is2P || (detectedSet && detectedSet.has(g.id)))) {
        detected.push({ entity: g, dist: Math.hypot(g.x - active.x, g.y - active.y) });
      }
    }
    const decoys = (this.game.simulation && this.game.simulation.decoyDrones) || [];
    for (const d of decoys) {
      if (d && d.hp > 0 && d.team === enemyTeamTag && (is2P || (detectedSet && detectedSet.has(d.id)))) {
        detected.push({ entity: d, dist: Math.hypot(d.x - active.x, d.y - active.y) });
      }
    }
    for (const s of this.game.surfaceUnits) {
      if (s && s.team === enemyTeamTag && s.hp > 0 && !s.isIndestructible && (is2P || (detectedSet && detectedSet.has(s.id)))) {
        detected.push({ entity: s, dist: Math.hypot(s.x - active.x, s.y - active.y) });
      }
    }
    const civilians = (this.game.simulation && this.game.simulation.civilianTraffic) || [];
    for (const c of civilians) {
      if (c && c.hp > 0 && (is2P || (detectedSet && detectedSet.has(c.id)))) {
        detected.push({ entity: c, dist: Math.hypot(c.x - active.x, c.y - active.y) });
      }
    }

    detected.sort((a, b) => a.dist - b.dist);
    return detected;
  }

  autoLock() {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return;

    const targets = this.getDetectedTargets();
    if (targets.length === 0) {
      if (this.game.radar) this.game.radar.spawnCombatText(active.x, active.y, 'NO CONTACTS IN SECTOR', '#f97316');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return;
    }

    const halfConeRad = (((active.spec && active.spec.radarConeDeg ? active.spec.radarConeDeg : 120) / 2.0) * Math.PI) / 180.0;
    const forwardTargets = targets.filter(t => {
      const tgt = t.entity;
      const angle = Math.atan2(tgt.y - active.y, tgt.x - active.x);
      let diff = Math.abs((active.heading || 0) - angle);
      while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
      return diff <= halfConeRad;
    });

    const candidates = forwardTargets.length > 0 ? forwardTargets : targets;
    const prioritized = candidates.filter(t => !t.entity.isCivilian && !t.entity.isGhost && !t.entity.isIndestructible);
    const chosen = (prioritized.length > 0 ? prioritized[0] : candidates[0]).entity;

    this.lockTargetEntity(chosen);
  }

  cycleTarget(direction = 1) {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return;

    const targets = this.getDetectedTargets();
    if (targets.length === 0) {
      if (this.game.radar) this.game.radar.spawnCombatText(active.x, active.y, 'NO CONTACTS', '#f97316');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return;
    }

    let currentIndex = -1;
    if (this.game.selectedTarget) {
      for (let k = 0; k < targets.length; k++) {
        if (targets[k].entity.id === this.game.selectedTarget.id) {
          currentIndex = k; break;
        }
      }
    }

    const nextIndex = (currentIndex + direction + targets.length) % targets.length;
    this.lockTargetEntity(targets[nextIndex].entity);
  }

  lockTargetEntity(target) {
    const active = this.game.activeUnit;
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const is2P = Boolean(this.game && this.game.playerMode === '2P');

    this.game.selectedTarget = target;
    if (active) active.radarLockedTarget = target;

    const isKnown = is2P || (target.team === active.team) ||
      (typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified);

    if (this.game.radar) {
      const lockColor = !isKnown ? '#f97316' : ((target.isAce && isKnown) ? '#ffd700' : '#00f0ff');
      this.game.radar.spawnCombatText(target.x, target.y, isKnown ? 'TARGET LOCKED' : 'CONTACT TRACKED', lockColor);
      this.game.radar.spawnShockwave(target.x, target.y, lockColor, 25);
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.game.avionics.updateActiveUnitMFD();
  }
}

window.ControlsTargetingHandler = ControlsTargetingHandler;