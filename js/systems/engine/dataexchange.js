/**
 * js/systems/engine/dataexchange.js - File I/O & Full Game Data JSON Export/Import.
 */

class DataExchange {
  static GAMEDATA_KEYS = {
    AIRSPACE_STANDOFF_SETTINGS: 'object',
    AIRSPACE_STANDOFF_GAMEPLAY_SETTINGS: 'object',
    AIRSPACE_STANDOFF_SQUADRON_NAME: 'string',
    AIRSPACE_STANDOFF_LAST_SQUADRON_USED: 'array',
    AIRSPACE_STANDOFF_CUSTOM_LOADOUTS: 'object',
    AIRSPACE_STANDOFF_AIRCRAFT_TEMPLATES: 'object',
    AIRSPACE_STANDOFF_TOP_10_SORTIES: 'array',
    AIRSPACE_STANDOFF_SORTIE_HISTORY: 'array',
    AIRSPACE_STANDOFF_SAVED_SORTIE_V1: 'object_or_null'
  };

  static downloadJson(filename, payload) {
    const jsonText = JSON.stringify(payload, null, 2) + '\n';
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
  }

  static pickJsonFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.style.display = 'none';
      document.body.appendChild(input);

      const cleanup = () => setTimeout(() => input.remove(), 250);

      input.onchange = async () => {
        try {
          const file = input.files && input.files[0];
          if (!file) { cleanup(); resolve(null); return; }
          const text = await file.text();
          cleanup();
          resolve({ name: file.name, text });
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      input.oncancel = () => { cleanup(); resolve(null); };
      input.click();
    });
  }

  static slugify(name) {
    return String(name || 'preset')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'preset';
  }

  static readStorageItem(key, game) {
    const adapter = game && game.procurement && game.procurement.customLoadouts ? game.procurement.customLoadouts.storage : null;
    if (adapter) return adapter.getItem(key);
    return window.localStorage.getItem(key);
  }

  static writeStorageItem(key, rawValue, game) {
    const adapter = game && game.procurement && game.procurement.customLoadouts ? game.procurement.customLoadouts.storage : null;
    if (adapter) adapter.setItem(key, rawValue);
    else window.localStorage.setItem(key, rawValue);
  }

  static removeStorageItem(key, game) {
    const adapter = game && game.procurement && game.procurement.customLoadouts ? game.procurement.customLoadouts.storage : null;
    if (adapter && adapter.memStore) delete adapter.memStore[key];
    try { window.localStorage.removeItem(key); } catch (e) {}
  }

  static extractUserTemplates(rawTemplates, game) {
    const cl = game && game.procurement ? game.procurement.customLoadouts : null;
    const defaults = cl ? cl.getDefaultTemplates() : (window.AIRCRAFT_TEMPLATES || {});
    const builtinNames = new Set(Object.values(defaults).map(t => String((t && t.name) || '').trim().toLowerCase()).filter(Boolean));
    const out = {};
    if (!rawTemplates || typeof rawTemplates !== 'object') return out;
    for (const [k, tpl] of Object.entries(rawTemplates)) {
      if (!tpl || typeof tpl !== 'object') continue;
      const tplName = String(tpl.name || k || '').trim().toLowerCase();
      const isBuiltin = Object.prototype.hasOwnProperty.call(defaults, k) || builtinNames.has(tplName);
      if (tpl.roleCategory === 'CUSTOM' || !isBuiltin) {
        out[k] = tpl;
      }
    }
    return out;
  }

  static extractUserSquadronPresets(rawPresets) {
    const out = {};
    if (!rawPresets || typeof rawPresets !== 'object' || Array.isArray(rawPresets)) return out;
    const builtinNames = new Set();
    if (typeof ProcurementPresets !== 'undefined') {
      ProcurementPresets.getBuiltinPresetCatalog().forEach(m => {
        builtinNames.add(String(m.id || '').trim().toLowerCase());
        builtinNames.add(String(m.name || '').trim().toLowerCase());
      });
    }
    for (const [name, units] of Object.entries(rawPresets)) {
      if (!builtinNames.has(String(name || '').trim().toLowerCase()) && Array.isArray(units) && units.length > 0) {
        out[name] = units;
      }
    }
    return out;
  }

  static getGameDataSummary(game) {
    const readJson = (key, fallback) => {
      try {
        const raw = this.readStorageItem(key, game);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    };

    const customLoadouts = readJson('AIRSPACE_STANDOFF_CUSTOM_LOADOUTS', {});
    const customTemplates = this.extractUserTemplates(readJson('AIRSPACE_STANDOFF_AIRCRAFT_TEMPLATES', {}), game);
    const topSorties = readJson('AIRSPACE_STANDOFF_TOP_10_SORTIES', []);
    const history = readJson('AIRSPACE_STANDOFF_SORTIE_HISTORY', []);
    const savedSortie = readJson('AIRSPACE_STANDOFF_SAVED_SORTIE_V1', null);
    const sqName = readJson('AIRSPACE_STANDOFF_SQUADRON_NAME', null);

    let keyCount = 0;
    for (const key of Object.keys(this.GAMEDATA_KEYS)) {
      if (this.readStorageItem(key, game) !== null) keyCount++;
    }

    return {
      keyCount,
      customSquadronCount: customLoadouts && typeof customLoadouts === 'object' ? Object.keys(customLoadouts).length : 0,
      customTemplateCount: Object.keys(customTemplates).length,
      topSortiesCount: Array.isArray(topSorties) ? topSorties.length : 0,
      historyCount: Array.isArray(history) ? history.length : 0,
      hasSavedSortie: Boolean(savedSortie && !savedSortie.isCompleted),
      squadronName: typeof sqName === 'string' && sqName.trim() ? sqName.trim() : '7th Tactical Squadron'
    };
  }

  static exportGameData(game) {
    const data = {};
    for (const key of Object.keys(this.GAMEDATA_KEYS)) {
      const raw = this.readStorageItem(key, game);
      if (raw !== null) {
        try {
          const parsed = JSON.parse(raw);
          if (key === 'AIRSPACE_STANDOFF_AIRCRAFT_TEMPLATES') {
            const userOnly = this.extractUserTemplates(parsed, game);
            if (Object.keys(userOnly).length > 0) data[key] = userOnly;
          } else if (key === 'AIRSPACE_STANDOFF_CUSTOM_LOADOUTS') {
            const userSquadrons = this.extractUserSquadronPresets(parsed);
            if (Object.keys(userSquadrons).length > 0) data[key] = userSquadrons;
          } else {
            data[key] = parsed;
          }
        } catch (err) {
          throw new Error(`Cannot export corrupted storage key "${key}": ${err.message}`);
        }
      }
    }

    const stamp = new Date().toISOString().slice(0, 10);
    this.downloadJson(`airspace-standoff-gamedata-${stamp}.json`, {
      format: 'AIRSPACE_STANDOFF_GAMEDATA',
      version: 1,
      exportedAt: new Date().toISOString(),
      data
    });
    return Object.keys(data).length;
  }

  static parseAndValidateGameData(rawText) {
    if (typeof PresetExchange === 'undefined') throw new Error('PresetExchange is not loaded.');
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`Invalid JSON file: ${err.message}`);
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || parsed.format !== 'AIRSPACE_STANDOFF_GAMEDATA') {
      throw new Error('File is not a valid AIRSPACE STANDOFF game data export.');
    }
    if (!parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
      throw new Error('Game data export is missing a valid "data" object.');
    }

    const validated = {};
    const entries = Object.entries(parsed.data);
    if (entries.length === 0) throw new Error('Game data export contains no stored entries.');

    for (const [key, val] of entries) {
      const expected = this.GAMEDATA_KEYS[key];
      if (!expected) throw new Error(`Unrecognized game data key "${key}".`);
      if (expected === 'object' && (!val || typeof val !== 'object' || Array.isArray(val))) {
        throw new Error(`Game data key "${key}" must be an object.`);
      } else if (expected === 'array' && !Array.isArray(val)) {
        throw new Error(`Game data key "${key}" must be an array.`);
      } else if (expected === 'string' && (typeof val !== 'string' || !val.trim())) {
        throw new Error(`Game data key "${key}" must be a non-empty string.`);
      } else if (expected === 'object_or_null' && val !== null && (typeof val !== 'object' || Array.isArray(val))) {
        throw new Error(`Game data key "${key}" must be an object or null.`);
      }

      if (key === 'AIRSPACE_STANDOFF_CUSTOM_LOADOUTS') {
        const cleanPresets = {};
        const seenNames = new Set();
        const seenSigs = new Set();
        for (const [pName, pUnits] of Object.entries(val)) {
          const cleanName = String(pName || '').trim();
          if (!cleanName) throw new Error('Custom squadron preset name cannot be empty.');
          const cleanUnits = PresetExchange.validateSquadronUnits(pUnits, cleanName);
          const nKey = PresetExchange.normalizeKey(cleanName);
          const sig = PresetExchange.squadronSignature(cleanUnits);
          if (seenNames.has(nKey) || seenSigs.has(sig)) {
            throw new Error(`Duplicate squadron preset "${cleanName}" in game data export.`);
          }
          seenNames.add(nKey);
          seenSigs.add(sig);
          cleanPresets[cleanName] = cleanUnits;
        }
        validated[key] = cleanPresets;
      } else if (key === 'AIRSPACE_STANDOFF_AIRCRAFT_TEMPLATES') {
        const cleanTpls = {};
        const seenNames = new Set();
        const seenSigs = new Set();
        for (const [tKey, tVal] of Object.entries(val)) {
          if (!tVal || typeof tVal !== 'object') continue;
          if (tVal.roleCategory !== 'CUSTOM' && Object.prototype.hasOwnProperty.call(window.AIRCRAFT_TEMPLATES || {}, tKey)) {
            continue;
          }
          const cleanTpl = PresetExchange.validateAircraftPreset(tVal, tKey);
          const nKey = PresetExchange.normalizeKey(cleanTpl.name);
          const sig = PresetExchange.aircraftConfigSignature(cleanTpl);
          if (seenNames.has(nKey) || seenSigs.has(sig)) {
            throw new Error(`Duplicate aircraft preset "${cleanTpl.name}" in game data export.`);
          }
          seenNames.add(nKey);
          seenSigs.add(sig);
          cleanTpls[cleanTpl.name] = cleanTpl;
        }
        validated[key] = cleanTpls;
      } else if (key === 'AIRSPACE_STANDOFF_LAST_SQUADRON_USED' && val.length > 0) {
        validated[key] = PresetExchange.validateSquadronUnits(val, 'Last Squadron Used');
      } else {
        validated[key] = val;
      }
    }

    return { data: validated, keys: Object.keys(validated) };
  }

  static applyGameDataImport(validatedData, game, settingsManager) {
    const importedKeys = new Set(Object.keys(validatedData));
    for (const key of Object.keys(this.GAMEDATA_KEYS)) {
      if (importedKeys.has(key)) this.writeStorageItem(key, JSON.stringify(validatedData[key]), game);
      else this.removeStorageItem(key, game);
    }

    if (settingsManager && typeof settingsManager.loadFromStorage === 'function') {
      settingsManager.loadFromStorage();
    }

    if (game) {
      if (game.procurement && game.procurement.customLoadouts) {
        game.procurement.customLoadouts._templatesCache = null;
      }
      if (window.Persistence) {
        const gp = window.Persistence.getGameplaySettings();
        if (gp) {
          if (gp.aiDifficulty && window.AI_DIFFICULTIES[gp.aiDifficulty]) game.aiDifficulty = gp.aiDifficulty;
          if (gp.aiDoctrine && window.AIR_DOCTRINES[gp.aiDoctrine]) game.aiDoctrine = gp.aiDoctrine;
          if (gp.attackDifficulty && window.ATTACK_DIFFICULTIES[gp.attackDifficulty]) game.attackDifficulty = gp.attackDifficulty;
          if (gp.attackDoctrine && window.ATTACK_DOCTRINES[gp.attackDoctrine]) game.attackDoctrine = gp.attackDoctrine;
          if (gp.gameMode && window.GAME_MODES[gp.gameMode]) game.setGameMode(gp.gameMode);
          if (gp.playerBudgetId && window.BUDGET_TIERS[gp.playerBudgetId]) game.setPlayerBudgetTier(gp.playerBudgetId);
        }
        const sqName = window.Persistence.getSquadronName();
        if (sqName) game.setSquadronName(sqName);
        const lastSq = window.Persistence.getLastSquadron();
        if (Array.isArray(lastSq) && lastSq.length > 0) game.procurementSquadron = lastSq;
      }
      if (game.procurement) {
        game.procurement.updateUI();
        game.procurement.renderCatalog();
      }
      if (typeof SaveGameManager !== 'undefined') SaveGameManager.updateHangarLoadButton();
    }

    return importedKeys.size;
  }
}

window.DataExchange = DataExchange;
