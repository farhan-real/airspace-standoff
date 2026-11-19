/**
 * js/systems/engine/save/manager.js - Save Slot Storage, Quick-Save, Save and Quit, and Load Coordinator.
 */

class SaveGameManager {
  static STORAGE_KEY = 'SAVED_SORTIES_V1';
  static MAX_SLOTS = 8;

  static getSaves() {
    if (!window.Persistence) throw new Error('Persistence engine is required for SaveGameManager.');
    const list = window.Persistence.get(this.STORAGE_KEY, []);
    if (!Array.isArray(list)) throw new Error('Corrupted saved sorties list in storage.');
    return list;
  }

  static writeSaves(list) {
    if (!window.Persistence) throw new Error('Persistence engine is required for SaveGameManager.');
    const ok = window.Persistence.set(this.STORAGE_KEY, list);
    if (!ok) throw new Error('Failed to write saved sorties to localStorage.');
  }

  static getSummary(save) {
    if (!save) return null;
    const blueAlive = (save.alliedAircraft || []).filter(a => a && a.hp > 0.05).length;
    const blueTotal = (save.alliedAircraft || []).length;
    const redAlive = (save.hostileAircraft || []).filter(a => a && a.hp > 0.05).length;
    const redTotal = (save.hostileAircraft || []).length;
    const modeData = window.GAME_MODES && window.GAME_MODES[save.gameMode];
    const modeLabel = modeData ? modeData.shortName : save.gameMode;
    const isAttack = (save.scenarioMode === 'ATTACK');
    const diffTable = isAttack ? window.ATTACK_DIFFICULTIES : window.AI_DIFFICULTIES;
    const diffEntry = diffTable && diffTable[isAttack ? save.attackDifficulty : save.aiDifficulty];
    const diffLabel = diffEntry ? diffEntry.name : (isAttack ? save.attackDifficulty : save.aiDifficulty);

    return {
      id: save.id,
      squadronName: save.squadronName,
      savedAtDisplay: save.savedAtDisplay,
      elapsedClock: save.elapsedClock || '00:00',
      modeLabel,
      diffLabel,
      vpAlly: save.vpAlly || 0,
      vpHostile: save.vpHostile || 0,
      blueAlive,
      blueTotal,
      redAlive,
      redTotal,
      unranked: Boolean(save.isMissionEditorMatch)
    };
  }

  static saveCurrentSortie(game, silent = false) {
    if (!game || game.isGameOver) return null;
    if (typeof SaveGameSerializer === 'undefined') throw new Error('SaveGameSerializer is not loaded.');

    const slotId = game.activeSaveId || ('SAVE_' + Date.now());
    const payload = SaveGameSerializer.serialize(game, slotId);

    let list = this.getSaves().filter(s => s && s.id !== slotId);
    list.unshift(payload);
    if (list.length > this.MAX_SLOTS) list = list.slice(0, this.MAX_SLOTS);
    this.writeSaves(list);
    game.activeSaveId = slotId;

    if (!silent) {
      if (game.radar && game.activeUnit) {
        game.radar.spawnCombatText(game.activeUnit.x, game.activeUnit.y, 'SORTIE SAVED', '#00f5a0');
      }
      const btn = document.getElementById('btn-save-game');
      if (btn) {
        btn.textContent = 'SAVED!';
        setTimeout(() => { if (btn) btn.textContent = 'SAVE'; }, 1400);
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    }
    return payload;
  }

  static saveAndQuitToHangar(game) {
    if (!game) return;
    if (!game.isGameOver) {
      this.saveCurrentSortie(game, true);
    }
    const pauseModal = document.getElementById('pause-modal');
    if (pauseModal) pauseModal.classList.remove('active');
    if (game.controls) game.controls._wasAutoPaused = false;
    if (typeof AudioSys !== 'undefined' && AudioSys.rwr) AudioSys.rwr.stop();
    if (window.MissionEditor && typeof window.MissionEditor.restoreBaseSettings === 'function') {
      window.MissionEditor.restoreBaseSettings(game);
    }
    game.returnToHangar();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static loadSortie(game, saveId) {
    if (!game) throw new Error('SaveGameManager.loadSortie requires game instance.');
    if (typeof SaveGameDeserializer === 'undefined') throw new Error('SaveGameDeserializer is not loaded.');
    const save = this.getSaves().find(s => s && s.id === saveId);
    if (!save) throw new Error(`Saved sortie "${saveId}" was not found.`);
    SaveGameDeserializer.restoreIntoGame(game, save);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    return save;
  }

  static deleteSave(saveId) {
    const next = this.getSaves().filter(s => s && s.id !== saveId);
    this.writeSaves(next);
    if (window.Game && window.Game.activeSaveId === saveId) {
      window.Game.activeSaveId = null;
    }
    return next;
  }

  static updateHangarIntelSummary() {
    const el = document.getElementById('procurement-intel');
    if (!el) return;
    const saves = this.getSaves();
    const loadBtn = document.getElementById('btn-proc-load');
    if (loadBtn) loadBtn.textContent = saves.length > 0 ? `LOAD (${saves.length})` : 'LOAD';

    if (saves.length === 0) {
      el.innerHTML = '<span class="intel-save-note">NO SAVED SORTIES IN STORAGE</span>';
      return;
    }
    const latest = this.getSummary(saves[0]);
    el.innerHTML = `<span class="intel-save-note active">LATEST SAVE: <b>${latest.squadronName}</b> &bull; ${latest.modeLabel} [${latest.elapsedClock}] &bull; ${latest.blueAlive}/${latest.blueTotal} BLUE</span>`;
  }
}

window.SaveGameManager = SaveGameManager;
