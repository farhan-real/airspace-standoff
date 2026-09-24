/**
 * AIRSPACE STANDOFF: Persistence Engine
 * Saves and loads: Sortie Match History, Top 10 High Scores, Full Debriefing Records,
 * Last Squadron Used, Custom Aircraft Templates, Custom Loadouts, Squadron Designation.
 */

class PersistenceEngine {
  constructor() {
    this.storagePrefix = 'AIRSPACE_STANDOFF_';
    this.legacyPrefix = 'AIRSPACE_STANDOFF_LEGACY_';
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

  saveTopSortie(sortieData) {
    if (!sortieData) return [];
    let list = this.get('TOP_10_SORTIES', []);
    list.push(sortieData);
    list.sort((a, b) => {
      const diff = (b.totalScore || 0) - (a.totalScore || 0);
      if (diff !== 0) return diff;
      return (a.durationSec || 999) - (b.durationSec || 999);
    });
    if (list.length > 10) list = list.slice(0, 10);
    this.set('TOP_10_SORTIES', list);
    return list;
  }

  deleteTopSortie(idOrIndex) {
    let list = this.get('TOP_10_SORTIES', []);
    if (typeof idOrIndex === 'number') {
      if (idOrIndex >= 0 && idOrIndex < list.length) {
        list.splice(idOrIndex, 1);
      }
    } else if (typeof idOrIndex === 'string') {
      list = list.filter(item => item && item.id !== idOrIndex);
    }
    this.set('TOP_10_SORTIES', list);
    return list;
  }

  getTopSorties() {
    return this.get('TOP_10_SORTIES', []);
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
    let name = this.get('SQUADRON_NAME', '7th Tactical Squadron');
    if (!name || typeof name !== 'string' || name.toLowerCase().includes('wardog')) {
      name = '7th Tactical Squadron';
      this.saveSquadronName(name);
      try {
        localStorage.removeItem('AIRSPACE_STANDOFF_LEGACY_SQUADRON_NAME');
      } catch (err) {}
    }
    return name;
  }
}

window.Persistence = new PersistenceEngine();