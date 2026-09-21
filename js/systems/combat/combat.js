/**
 * AIRSPACE STANDOFF: Tactical Combat Engine & Pylon Discharge Bus
 * Enforces verified ROE, gun pod direct discharges, and stores management.
 */

class CombatSystem {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  canFire(sourceUnit, item, targetEntity) {
    if (!sourceUnit || sourceUnit.hp <= 0) return false;
    if (!item || item.ammo <= 0 || (item.cooldown && item.cooldown > 0)) return false;
    const w = item.weapon;
    if (!w || w.isJammerPod) return false;

    const cfg = window.CONFIG || {};
    const tokenCost = cfg.TOKEN_ACTION_COST || 0.70;
    if (this.game.getCurrentCommanderTokenBucket() < tokenCost) return false;

    if (w.isDecoy || w.isDecoyDrone || w.isGunpod || w.category === 'GUN') return true;

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

    if (w.isLaser || w.isGunpod || w.category === 'GUN') {
      item.cooldown = w.cooldown || w.burstCooldown || 1.5;
    }

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const is2P = Boolean(this.game && this.game.playerMode === '2P');
    const isTargetIdentified = is2P || Boolean(
      targetEntity && (
        targetEntity.type ||
        targetEntity.identifiedByBlue ||
        (typeof targetEntity.isIdentifiedBy === 'function' ? targetEntity.isIdentifiedBy(commanderTeam) : targetEntity.isIdentified)
      )
    );

    if (!isTargetIdentified && !w.isDecoy && !w.isDecoyDrone && !w.isGunpod && targetEntity) {
      const penalty = (window.CONFIG && window.CONFIG.VP_UNIDENTIFIED_FIRE_PENALTY) || 600;
      if (sourceUnit.team === 'friendly' && this.game.simulation) {
        this.game.simulation.logScoreEvent('friendly', -penalty, 'RECKLESS ENGAGEMENT: Fired on unverified track [BOGEY ?]');
        if (this.game.simulation.scoring) {
          this.game.simulation.scoring.recordBogeyFirePenalty('friendly', sourceUnit, targetEntity, w, penalty);
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
    } else if (w.isGunpod || (w.category === 'GUN' && !w.isLaser)) {
      const dmg = w.damagePerBurst || w.damage || 1.4;
      if (targetEntity && Math.hypot(targetEntity.x - sourceUnit.x, targetEntity.y - sourceUnit.y) <= (w.rangeKm || 4.8)) {
        const wasAlive = targetEntity.hp > 0.05;
        if (targetEntity.isGhost || targetEntity.isDecoyDrone) targetEntity.takeDamage(dmg);
        else if (typeof SurfaceUnit !== 'undefined' && targetEntity instanceof SurfaceUnit) targetEntity.takeDamage(dmg, false);
        else if (targetEntity.isCivilian) targetEntity.takeDamage(dmg, sourceUnit, w);
        else {
          targetEntity.hp = Math.max(0, targetEntity.hp - dmg);
          if (targetEntity.hp < 0.05) targetEntity.hp = 0;
          if (typeof targetEntity.applyActionStress === 'function') targetEntity.applyActionStress(0.20);
        }

        if (this.game.radar) {
          this.game.radar.spawnGunTracer(sourceUnit.x, sourceUnit.y, targetEntity.x, targetEntity.y, w.tracerColor || '#fbbf24');
          this.game.radar.spawnCombatText(targetEntity.x, targetEntity.y, `POD BURST -${dmg.toFixed(1)}HP`, '#fbbf24');
        }
        if (wasAlive && targetEntity.hp <= 0 && this.game.simulation && !targetEntity.isCivilian) {
          this.game.simulation.recordKillEvent(sourceUnit.team, targetEntity, sourceUnit, { weapon: w, isSalvo: false, salvoCount: 1 });
        }
      } else {
        const hdg = sourceUnit.heading || 0;
        if (this.game.radar) {
          this.game.radar.spawnGunTracer(sourceUnit.x, sourceUnit.y, sourceUnit.x + Math.cos(hdg) * (w.rangeKm || 4.8), sourceUnit.y + Math.sin(hdg) * (w.rangeKm || 4.8), w.tracerColor || '#fbbf24');
          this.game.radar.spawnCombatText(sourceUnit.x, sourceUnit.y, 'GUN POD BURST', '#fbbf24');
        }
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
    } else if (w.isLaser) {
      if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
      if (targetEntity && Math.hypot(targetEntity.x - sourceUnit.x, targetEntity.y - sourceUnit.y) <= (w.rangeKm || 9.0)) {
        const wasAlive = targetEntity.hp > 0.05;
        const dmg = w.damagePerBurst || w.damage || 3;
        if (targetEntity.isGhost || targetEntity.isDecoyDrone) targetEntity.takeDamage(dmg);
        else if (typeof SurfaceUnit !== 'undefined' && targetEntity instanceof SurfaceUnit) targetEntity.takeDamage(dmg, true);
        else if (targetEntity.isCivilian) targetEntity.takeDamage(dmg, sourceUnit, w);
        else {
          targetEntity.hp = Math.max(0, targetEntity.hp - dmg);
          if (targetEntity.hp < 0.05) targetEntity.hp = 0;
          if (typeof targetEntity.applyActionStress === 'function') targetEntity.applyActionStress(0.35);
        }

        if (this.game.radar) {
          this.game.radar.spawnExplosionFX(targetEntity.x, targetEntity.y, false);
          this.game.radar.spawnCombatText(targetEntity.x, targetEntity.y, `LASER -${dmg}HP`, '#00f0ff');
        }
        if (wasAlive && targetEntity.hp <= 0 && this.game.simulation && !targetEntity.isCivilian) {
          this.game.simulation.recordKillEvent(sourceUnit.team, targetEntity, sourceUnit, { weapon: w, isSalvo: false, salvoCount: 1 });
        }
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
    unit.activeManeuverId = card.id;
    card.execute(unit);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    if (this.game.deckManager) this.game.deckManager.renderManeuverHand(this.game.activeUnit);
  }
}

window.CombatSystem = CombatSystem;