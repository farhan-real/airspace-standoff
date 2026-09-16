/**
 * AIRSPACE STANDOFF // Persistence Engine
 * Saves and loads: Sortie Match History, Full Debriefing Records, Last Squadron Used,
 * Custom Aircraft Templates, Custom Loadouts, Squadron Designation, and Tactical Keybinds.
 */

class PersistenceEngine {
  constructor() {
    this.storagePrefix = 'AIRSPACE_STANDOFF_';
    this.legacyPrefix = 'APEX_VECTOR_';
  }

  get(key, defaultValue = null) {
    try {
      let raw = localStorage.getItem(this.storagePrefix + key);
      if (!raw) {
        raw = localStorage.getItem(this.legacyPrefix + key);
      }
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.warn('Persistence read error:', key, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Persistence write error:', key, e);
      return false;
    }
  }

  recordSortie(matchRecord) {
    if (!matchRecord) return;
    const history = this.get('SORTIE_HISTORY', []);
    history.unshift({
      id: 'SORTIE_' + Date.now(),
      date: new Date().toISOString(),
      ...matchRecord
    });
    if (history.length > 25) history.pop();
    this.set('SORTIE_HISTORY', history);
  }

  getSortieHistory() {
    return this.get('SORTIE_HISTORY', []);
  }

  saveLastSquadron(squadronList) {
    if (!squadronList || squadronList.length === 0) return;
    this.set('LAST_SQUADRON_USED', squadronList);
  }

  getLastSquadron() {
    return this.get('LAST_SQUADRON_USED', null);
  }

  saveSquadronName(name) {
    if (!name || !name.trim()) return;
    this.set('SQUADRON_NAME', name.trim());
  }

  getSquadronName() {
    return this.get('SQUADRON_NAME', 'Wardog Squadron');
  }
}

window.Persistence = new PersistenceEngine();