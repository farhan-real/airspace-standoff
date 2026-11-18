/**
 * AIRSPACE STANDOFF: Simulation Command Tokens, Focus & Win Conditions
 * Extracted from simulation.js to keep simulation files modular and under 250 lines.
 */

class SimulationRules {
  static updateCommandTokens(sim, dt) {
    const game = sim.game;
    const baseRegen = window.CONFIG.TOKEN_BASE_REGEN;
    const perAcRegen = window.CONFIG.TOKEN_PER_AIRCRAFT_REGEN;
    const maxToken = window.CONFIG.TOKEN_MAX;

    const liveAllies = game.alliedAircraft.filter(a => a.hp > 0.05);
    const allyDatalinkTotal = liveAllies.reduce((sum, a) => sum + (a.datalinkBonus || 0), 0);
    const regenBlue = baseRegen + perAcRegen * liveAllies.length + allyDatalinkTotal;
    game.tokenBucketBlue = Math.min(maxToken, game.tokenBucketBlue + regenBlue * dt);

    const liveHostiles = game.hostileAircraft.filter(h => h.hp > 0.05);
    const hostileDatalinkTotal = liveHostiles.reduce((sum, a) => sum + (a.datalinkBonus || 0), 0);
    const regenRed = baseRegen + perAcRegen * liveHostiles.length + hostileDatalinkTotal;
    game.tokenBucketRed = Math.min(maxToken, game.tokenBucketRed + regenRed * dt);

    const currentTokens = game.getCurrentCommanderTokenBucket();
    const currentRegen = (game.currentPvpCommander === 'friendly') ? regenBlue : regenRed;

    const tokenBar = document.getElementById('token-bar');
    const tokenVal = document.getElementById('token-value');
    const tokenRate = document.getElementById('token-regen-rate');
    if (tokenBar) tokenBar.style.width = Math.min(100, (currentTokens / maxToken) * 100) + '%';
    if (tokenVal) tokenVal.textContent = currentTokens.toFixed(1) + ' / ' + maxToken.toFixed(1);
    if (tokenRate) tokenRate.textContent = '+' + currentRegen.toFixed(1) + '/s';
  }

  static resolveUnitFocus(sim) {
    const game = sim.game;
    if (game.activeUnit && game.activeUnit.hp <= 0.05) {
      const roster = (game.currentPvpCommander === 'friendly') ? game.alliedAircraft : game.hostileAircraft;
      const nextLive = roster.find(a => a.hp > 0.05);
      if (nextLive) {
        game.activeUnit = nextLive;
        if (game.radar && game.radar.cam && game.radar.cam.trackingUnit) {
          game.radar.cam.trackActiveCraft(nextLive);
        }
      }
    }
    const tgt = game.selectedTarget;
    const isMsl = Boolean(tgt && tgt.weapon && tgt.target);
    const isGnd = Boolean(tgt && tgt.type && !tgt.spec && !tgt.isCivilian);
    const gndShown = Boolean(game.radar && game.radar.cam && game.radar.cam.showGroundTargets);
    const inspOpen = Boolean(game.inspection && game.inspection.isOpen);
    if (tgt && ((typeof tgt.hp === 'number' && tgt.hp <= 0.05) || tgt.isDissolved || tgt.isDead || (isMsl && !inspOpen) || (isGnd && !gndShown))) {
      game.selectedTarget = null;
      const targetInfo = document.getElementById('selected-target-info');
      if (targetInfo) targetInfo.textContent = 'TARGET: NONE';
    }
  }

  static checkWinConditions(sim, dt = 0.016) {
    const game = sim.game;
    const vpAllyEl = document.getElementById('vp-ally');
    const vpHostileEl = document.getElementById('vp-hostile');
    if (vpAllyEl) { vpAllyEl.textContent = game.vpAlly; vpAllyEl.style.color = (game.vpAlly < 0) ? '#f43f5e' : ''; }
    if (vpHostileEl) { vpHostileEl.textContent = game.vpHostile; vpHostileEl.style.color = (game.vpHostile < 0) ? '#f43f5e' : ''; }

    for (const h of game.hostileAircraft) { if (h && h.hp <= 0.05) h.hp = 0; }
    for (const a of game.alliedAircraft) { if (a && a.hp <= 0.05) a.hp = 0; }

    if (sim.victoryDelayTimer > 0) {
      sim.victoryDelayTimer -= dt;
      if (sim.victoryDelayTimer <= 0 && sim.pendingGameOver) {
        game.triggerGameOver(sim.pendingGameOver.blueWon, sim.pendingGameOver.reason);
        sim.pendingGameOver = null;
      }
      return;
    }

    const allAlliesDead = game.alliedAircraft.length > 0 && game.alliedAircraft.every(a => a.hp <= 0.05);
    if (allAlliesDead) {
      sim.victoryDelayTimer = 2.8;
      sim.pendingGameOver = { blueWon: false, reason: 'ALL ALLIED AIR ASSETS NEUTRALIZED' };
      sim.captureReplayFrame(true);
      return;
    }

    if (game.scenarioMode === 'ATTACK') {
      if (typeof AttackDirector === 'undefined') throw new Error('AttackDirector is not loaded.');
      const obj = AttackDirector.getObjectiveSummary(game);
      if (obj.total > 0 && obj.remaining === 0) {
        sim.victoryDelayTimer = 2.8;
        sim.pendingGameOver = { blueWon: true, reason: `ALL ${obj.total} PRIMARY STRIKE OBJECTIVES DESTROYED` };
        sim.captureReplayFrame(true);
        if (game.radar) {
          game.radar.spawnCombatText(window.CONFIG.THEATER_WIDTH_KM * 0.75, window.CONFIG.THEATER_HEIGHT_KM * 0.5, 'ALL OBJECTIVES DESTROYED', '#00f5a0');
        }
      }
      return;
    }

    const allHostilesDead = game.hostileAircraft.length > 0 && game.hostileAircraft.every(h => h.hp <= 0.05);
    const hasUpcomingWaves = game.scenarioMode === 'DYNAMIC_THEATER' && game.playerMode !== '2P' && sim.currentWave <= 3;

    if (allHostilesDead && !hasUpcomingWaves) {
      const hostileBunkerDestroyed = game.surfaceUnits.some(s => s.type === 'BUNKER' && s.team === 'hostile' && s.hp <= 0.05);
      const winReason = hostileBunkerDestroyed
        ? 'ALL HOSTILE AIR ASSETS NEUTRALIZED & COMMAND BUNKER DESTROYED'
        : 'ALL HOSTILE AIR ASSETS NEUTRALIZED: AIR SUPERIORITY SECURED';

      sim.victoryDelayTimer = 2.8;
      sim.pendingGameOver = { blueWon: true, reason: winReason };
      sim.captureReplayFrame(true);
      if (game.radar) {
        const lastEnemy = game.hostileAircraft[game.hostileAircraft.length - 1];
        const cx = (lastEnemy && Number.isFinite(lastEnemy.x)) ? lastEnemy.x : (window.CONFIG.THEATER_WIDTH_KM / 2);
        const cy = (lastEnemy && Number.isFinite(lastEnemy.y)) ? lastEnemy.y : (window.CONFIG.THEATER_HEIGHT_KM / 2);
        game.radar.spawnCombatText(cx, cy, 'AIR SUPERIORITY SECURED', '#00f0ff');
        game.radar.spawnShockwave(cx, cy, '#00f0ff', 48);
      }
    }
  }
}

window.SimulationRules = SimulationRules;
