/**
 * js/systems/engine/save/manager.js - Single-Slot Save, Completion Tracking & Load Coordinator.
 */

class SaveGameManager {
  static STORAGE_KEY = 'SAVED_SORTIE_V1';
  static SINGLE_SAVE_ID = 'ACTIVE_SORTIE_SAVE';

  static getSave() {
    if (!window.Persistence) throw new Error('Persistence engine is required for SaveGameManager.');
    const save = window.Persistence.get(this.STORAGE_KEY, null);
    if (save !== null && typeof save !== 'object') throw new Error('Corrupted saved sortie in storage.');
    return save;
  }

  static writeSave(saveObj) {
    if (!window.Persistence) throw new Error('Persistence engine is required for SaveGameManager.');
    const ok = window.Persistence.set(this.STORAGE_KEY, saveObj);
    if (!ok) throw new Error('Failed to write saved sortie to localStorage.');
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
    const docTable = isAttack ? window.ATTACK_DOCTRINES : window.AIR_DOCTRINES;
    const docEntry = docTable && docTable[isAttack ? save.attackDoctrine : save.aiDoctrine];
    const doctrineLabel = docEntry ? docEntry.name : (isAttack ? save.attackDoctrine : save.aiDoctrine);

    return {
      id: save.id,
      squadronName: save.squadronName,
      savedAtDisplay: save.savedAtDisplay,
      elapsedClock: save.elapsedClock || '00:00',
      modeLabel,
      diffLabel,
      doctrineLabel,
      vpAlly: save.vpAlly || 0,
      vpHostile: save.vpHostile || 0,
      blueAlive,
      blueTotal,
      redAlive,
      redTotal,
      unranked: Boolean(save.isMissionEditorMatch),
      isCompleted: Boolean(save.isCompleted)
    };
  }

  static saveCurrentSortie(game, silent = false) {
    if (!game || game.isGameOver) return null;
    if (typeof SaveGameSerializer === 'undefined') throw new Error('SaveGameSerializer is not loaded.');

    const payload = SaveGameSerializer.serialize(game, this.SINGLE_SAVE_ID);
    payload.isCompleted = false;
    this.writeSave(payload);
    game.activeSaveId = this.SINGLE_SAVE_ID;
    this.updateHangarLoadButton();

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

  static markSaveCompleted(game) {
    const save = this.getSave();
    if (!save) return;
    save.isCompleted = true;
    this.writeSave(save);
    if (game) game.activeSaveId = null;
    this.updateHangarLoadButton();
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

  static loadSortie(game) {
    if (!game) throw new Error('SaveGameManager.loadSortie requires game instance.');
    if (typeof SaveGameDeserializer === 'undefined') throw new Error('SaveGameDeserializer is not loaded.');
    const save = this.getSave();
    if (!save) throw new Error('No saved sortie was found.');
    if (save.isCompleted) throw new Error('Previous game is already completed.');
    SaveGameDeserializer.restoreIntoGame(game, save);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    return save;
  }

  static deleteSave() {
    this.writeSave(null);
    if (window.Game) window.Game.activeSaveId = null;
    this.updateHangarLoadButton();
  }

  static updateHangarLoadButton() {
    const loadBtn = document.getElementById('btn-proc-load');
    if (!loadBtn) return;
    const save = this.getSave();
    loadBtn.textContent = 'LOAD PREVIOUS GAME';
    if (!save) {
      loadBtn.disabled = true;
      loadBtn.title = 'No saved game available';
    } else if (save.isCompleted) {
      loadBtn.disabled = true;
      loadBtn.title = 'Previous game is completed';
    } else {
      loadBtn.disabled = false;
      loadBtn.title = `Inspect or resume saved game (${save.squadronName} - ${save.elapsedClock})`;
    }
  }
}

window.SaveGameManager = SaveGameManager;
