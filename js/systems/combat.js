/**
 * AIRSPACE STANDOFF // Tactical Combat Engine & Pylon Discharge Bus
 * Enforces verified ROE; in 2P mode all aircraft are mutually identified from start.
 */

class CombatSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  canFire(sourceUnit, item, targetEntity) {
    if (!sourceUnit || sourceUnit.hp <= 0) return false;
    if (!item || item.ammo <= 0) return false;
    const w = item.weapon;
    if (!w || w.isJammerPod) return false;

    const cfg = window.CONFIG || {};
    const tokenCost = cfg.TOKEN_ACTION_COST || 0.70;
    if (this.game.getCurrentCommanderTokenBucket() < tokenCost) return false;

    if (w.isDecoy || w.isDecoyDrone) return true;

    if (!targetEntity || targetEntity.hp <= 0) return false;
    if (typeof targetEntity.x !== 'number' || typeof targetEntity.y !== 'number' || isNaN(targetEntity.x) || isNaN(targetEntity.y)) return false;

    const dist = Math.hypot(targetEntity.x - sourceUnit.x, targetEntity.y - sourceUnit.y);
    if (isNaN(dist) || dist > (w.rangeKm || 100)) return false;

    const isSurface = (typeof SurfaceUnit !== 'undefined' && targetEntity instanceof SurfaceUnit) || Boolean(targetEntity.type && !targetEntity.spec && !targetEntity.isCivilian);
    if (isSurface) {
      if (w.category === 'A2A') return false;
      if (targetEntity.type === 'BUNKER' && !w.isBunkerCracker && w.category !== 'GUN' && !w.isLaser) return false;
      return w.category === 'A2G' || w.isBunkerCracker === true || w.category === 'GUN' || w.isLaser === true;
    }

    if (w.category === 'A2G' || w.isBunkerCracker) return false;
    return w.category === 'A2A' || w.category === 'GUN' || w.isLaser === true;
  }

  fire(sourceUnit, pylonIdx, targetEntity) {
    if (!sourceUnit || sourceUnit.hp <= 0) return;
    const item = sourceUnit.equippedWeapons && sourceUnit.equippedWeapons[pylonIdx];
    if (!item || !this.canFire(sourceUnit, item, targetEntity)) return;

    const cfg = window.CONFIG || {};
    const tokenCost = cfg.TOKEN_ACTION_COST || 0.70;
    if (!this.game.consumeCurrentCommanderTokens(tokenCost)) return;

    item.ammo--;
    const w = item.weapon;
    sourceUnit.applyActionStress(0.08);

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const is2P = Boolean(this.game && this.game.playerMode === '2P');
    const isTargetIdentified = is2P || Boolean(
      targetEntity && (
        targetEntity.type ||
        targetEntity.identifiedByBlue ||
        (typeof targetEntity.isIdentifiedBy === 'function' ? targetEntity.isIdentifiedBy(commanderTeam) : targetEntity.isIdentified)
      )
    );

    if (!isTargetIdentified && !w.isDecoy && !w.isDecoyDrone && !targetEntity.isCivilian) {
      const penalty = (window.CONFIG && window.CONFIG.VP_UNIDENTIFIED_FIRE_PENALTY) || 150;
      if (sourceUnit.team === 'friendly') {
        if (this.game.simulation) {
          this.game.simulation.logScoreEvent('friendly', -penalty, 'RECKLESS ENGAGEMENT: Fired on unverified track [BOGEY ?]');
        }
      }
      if (this.game.radar) {
        this.game.radar.spawnCombatText(sourceUnit.x, sourceUnit.y, `ROE PENALTY: UNVERIFIED BOGEY (-${penalty} VP)`, '#f97316');
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playMissileLost();
    }

    if (w.isDecoyDrone) {
      const drone = new DecoyDrone(sourceUnit, sourceUnit.heading);
      if (this.game.simulation) this.game.simulation.decoyDrones.push(drone);
      if (this.game.radar) {
        this.game.radar.spawnCombatText(sourceUnit.x, sourceUnit.y, 'MALD DECOY DEPLOYED', '#c084fc');
        this.game.radar.spawnShockwave(sourceUnit.x, sourceUnit.y, '#c084fc', 26);
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    } else if (w.isDecoy) {
      sourceUnit.deployCountermeasures();
      if (this.game.radar) {
        this.game.radar.spawnCombatText(sourceUnit.x, sourceUnit.y, 'TOWED DECOY DEPLOYED', '#38bdf8');
        this.game.radar.spawnShockwave(sourceUnit.x, sourceUnit.y, '#38bdf8', 25);
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    } else if (w.isLaser) {
      if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
      const wasAlive = targetEntity.hp > 0;

      if (targetEntity.isGhost) {
        targetEntity.takeDamage();
        if (this.game.radar) {
          this.game.radar.spawnExplosionFX(targetEntity.x, targetEntity.y, false);
          this.game.radar.spawnCombatText(targetEntity.x, targetEntity.y, 'DISSIPATED CLUTTER', '#94a3b8');
        }
      } else if (typeof SurfaceUnit !== 'undefined' && targetEntity instanceof SurfaceUnit) {
        targetEntity.takeDamage(w.damage, true);
      } else if (targetEntity.isCivilian && typeof targetEntity.takeDamage === 'function') {
        targetEntity.takeDamage(w.damage, sourceUnit);
      } else {
        targetEntity.hp = Math.max(0, targetEntity.hp - w.damage);
        if (typeof targetEntity.applyActionStress === 'function') targetEntity.applyActionStress(0.35);
      }

      if (wasAlive && targetEntity.hp <= 0 && this.game.simulation) {
        if (targetEntity.isCivilian) this.game.simulation.recordCivilianShootdown(sourceUnit.team, targetEntity);
        else this.game.simulation.recordKillEvent(sourceUnit.team, targetEntity, sourceUnit, { weapon: w, isSalvo: false, salvoCount: 1 });
      }
      if (this.game.radar && !targetEntity.isGhost) {
        this.game.radar.spawnExplosionFX(targetEntity.x, targetEntity.y, false);
        this.game.radar.spawnCombatText(targetEntity.x, targetEntity.y, `LASER -${w.damage}HP`, '#00f0ff');
      }
    } else {
      if (typeof MissileEntity !== 'undefined') {
        this.game.missiles.push(new MissileEntity(w, sourceUnit, targetEntity));
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
    }

    sourceUnit.recalculateWeight();
    if (this.game.deckManager) this.game.deckManager.renderPylonBay(sourceUnit, this.game.selectedTarget);
  }

  executeCard(card, unit) {
    const cfg = window.CONFIG || {};
    const cost = card.cost || cfg.TOKEN_ACTION_COST || 0.70;
    if (!this.game.consumeCurrentCommanderTokens(cost)) return;
    unit.applyActionStress(0.18);
    card.execute(unit);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    if (this.game.deckManager) this.game.deckManager.renderManeuverHand(this.game.activeUnit);
  }
}

window.CombatSystem = CombatSystem;