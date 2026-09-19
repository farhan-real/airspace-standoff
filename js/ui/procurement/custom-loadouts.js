/**
 * AIRSPACE STANDOFF // Custom Loadouts & Preconfigured Aircraft Storage
 */

class SafeStorageAdapter {
  constructor() {
    this.memStore = {};
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const k = '__airspace_test__';
      window.localStorage.setItem(k, k);
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      console.warn('LocalStorage restricted. Using in-memory fallback.', e);
      return false;
    }
  }

  getItem(key) {
    if (this.isAvailable) {
      try { return window.localStorage.getItem(key); } catch (e) { return this.memStore[key] || null; }
    }
    return this.memStore[key] || null;
  }

  setItem(key, value) {
    this.memStore[key] = value;
    if (this.isAvailable) {
      try { window.localStorage.setItem(key, value); } catch (e) { console.warn('LocalStorage write failed.', e); }
    }
  }
}

class CustomLoadoutsManager {
  constructor() {
    this.storage = new SafeStorageAdapter();
    this.fleetKey = 'AIRSPACE_STANDOFF_CUSTOM_LOADOUTS';
    this.aircraftTemplateKey = 'AIRSPACE_STANDOFF_AIRCRAFT_TEMPLATES';
    this.legacyFleetKey = 'APEX_VECTOR_CUSTOM_LOADOUTS';
    this.legacyTemplateKey = 'APEX_VECTOR_AIRCRAFT_TEMPLATES';
  }

  getAll() {
    try {
      let raw = this.storage.getItem(this.fleetKey);
      if (!raw) raw = this.storage.getItem(this.legacyFleetKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  save(name, squadron) {
    if (!name || !squadron || squadron.length === 0) return false;
    const all = this.getAll();
    all[name.trim()] = JSON.parse(JSON.stringify(squadron));
    this.storage.setItem(this.fleetKey, JSON.stringify(all));
    return true;
  }

  load(name) {
    const all = this.getAll();
    return all[name] ? JSON.parse(JSON.stringify(all[name])) : null;
  }

  delete(name) {
    const all = this.getAll();
    if (all[name]) {
      delete all[name];
      this.storage.setItem(this.fleetKey, JSON.stringify(all));
      return true;
    }
    return false;
  }

  rename(oldName, newName) {
    if (!oldName || !newName || oldName === newName) return false;
    const all = this.getAll();
    if (!all[oldName]) return false;
    all[newName.trim()] = all[oldName];
    delete all[oldName];
    this.storage.setItem(this.fleetKey, JSON.stringify(all));
    return true;
  }

  getDefaultTemplates() {
    return window.AIRCRAFT_TEMPLATES || {};
  }

  getTemplates() {
    const defaults = this.getDefaultTemplates();
    try {
      let raw = this.storage.getItem(this.aircraftTemplateKey);
      if (!raw) raw = this.storage.getItem(this.legacyTemplateKey);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaults, parsed);
    } catch (e) {
      return defaults;
    }
  }

  saveTemplate(templateName, aircraftConfig) {
    if (!templateName || !aircraftConfig) return false;
    const all = this.getTemplates();
    all[templateName.trim()] = JSON.parse(JSON.stringify(aircraftConfig));
    this.storage.setItem(this.aircraftTemplateKey, JSON.stringify(all));
    return true;
  }

  deleteTemplate(templateName) {
    if (!templateName) return false;
    try {
      let raw = this.storage.getItem(this.aircraftTemplateKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed[templateName]) {
        delete parsed[templateName];
        this.storage.setItem(this.aircraftTemplateKey, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {}
    return false;
  }
}

window.CustomLoadoutsManager = CustomLoadoutsManager;