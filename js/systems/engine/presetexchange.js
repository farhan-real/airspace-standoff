/**
 * js/systems/engine/presetexchange.js - User-Only Export, Import & Duplicate Validation for Aircraft and Squadron Presets.
 */

class PresetExchange {
  static normalizeKey(name) {
    return String(name || '').trim().toLowerCase();
  }

  static normalizeWeapons(weapons, spec, wpnsMap, label) {
    if (weapons !== undefined && !Array.isArray(weapons)) {
      throw new Error(`Invalid weapons list in "${label}".`);
    }
    return (weapons || []).map((wEntry) => {
      if (typeof wEntry === 'string') {
        if (!wpnsMap[wEntry]) throw new Error(`Unknown weapon "${wEntry}" in "${label}".`);
        return wEntry;
      }
      if (wEntry && typeof wEntry === 'object') {
        const wId = wEntry.id || wEntry.specId;
        if (!wId || !wpnsMap[wId]) throw new Error(`Unknown weapon "${wId}" in "${label}".`);
        const clean = { id: wId };
        if (wEntry.station) {
          if (!['INTERNAL', 'EXTERNAL', 'CENTERLINE'].includes(wEntry.station)) {
            throw new Error(`Invalid weapon station "${wEntry.station}" in "${label}".`);
          }
          clean.station = wEntry.station;
        }
        return clean;
      }
      throw new Error(`Invalid weapon entry in "${label}".`);
    });
  }

  static normalizeUpgrades(upgrades, upgMap, label) {
    if (upgrades !== undefined && !Array.isArray(upgrades)) {
      throw new Error(`Invalid upgrades list in "${label}".`);
    }
    return (upgrades || []).map((uEntry) => {
      const uId = (uEntry && typeof uEntry === 'object') ? (uEntry.id || uEntry.specId) : uEntry;
      if (!uId || !upgMap[uId]) throw new Error(`Unknown system upgrade "${uId}" in "${label}".`);
      return uId;
    });
  }

  static weaponSignatureToken(wEntry) {
    if (typeof wEntry === 'string') return wEntry;
    if (wEntry && typeof wEntry === 'object') {
      const wId = wEntry.id || wEntry.specId || '';
      return wEntry.station ? `${wId}@${wEntry.station}` : wId;
    }
    return '';
  }

  static aircraftConfigSignature(tpl) {
    const specId = String(tpl.specId || '');
    const spec = (window.AIRCRAFT_CATALOG || {})[specId];
    const gunId = String(tpl.chosenGunId || (spec ? spec.builtInGun : '') || '');
    const wpns = (tpl.weapons || []).map(w => this.weaponSignatureToken(w)).sort().join(',');
    const upgs = (tpl.upgrades || []).map(u => String((u && typeof u === 'object') ? (u.id || u.specId) : u)).sort().join(',');
    return `${specId}|${gunId}|${wpns}|${upgs}`;
  }

  static squadronSignature(units) {
    const hasExplicitLead = (units || []).some(u => u && u.isLead);
    return (units || []).map((u, idx) => {
      const leadFlag = (u.isLead || (!hasExplicitLead && idx === 0)) ? '1' : '0';
      return `${this.aircraftConfigSignature(u)}|L${leadFlag}`;
    }).join('||');
  }

  static validateSquadronUnits(units, presetName = 'Imported Squadron') {
    const acMap = window.AIRCRAFT_CATALOG;
    const gunsMap = window.AUTOCANNONS_CATALOG;
    const wpnsMap = window.WEAPONS_CATALOG;
    const upgMap = window.UPGRADES_CATALOG;
    if (!acMap || !gunsMap || !wpnsMap || !upgMap) {
      throw new Error('Aircraft, weapon, gun, and upgrade catalogs must be loaded before validating presets.');
    }
    if (!Array.isArray(units) || units.length === 0) {
      throw new Error(`Squadron preset "${presetName}" must be a non-empty array of aircraft.`);
    }

    return units.map((u, idx) => {
      if (!u || typeof u !== 'object' || Array.isArray(u)) {
        throw new Error(`Unit #${idx + 1} in "${presetName}" is not a valid object.`);
      }
      if (!u.specId || !acMap[u.specId]) {
        throw new Error(`Unknown aircraft "${u.specId}" in "${presetName}" (unit #${idx + 1}).`);
      }
      const spec = acMap[u.specId];
      const chosenGunId = u.chosenGunId || spec.builtInGun;
      if (!gunsMap[chosenGunId]) {
        throw new Error(`Unknown autocannon "${chosenGunId}" in "${presetName}" (unit #${idx + 1}).`);
      }

      const weapons = this.normalizeWeapons(u.weapons, spec, wpnsMap, presetName);
      const upgrades = this.normalizeUpgrades(u.upgrades, upgMap, presetName);

      const normalized = { specId: u.specId, chosenGunId, weapons, upgrades };
      if (u.isLead) normalized.isLead = true;
      if (typeof u.callsign === 'string' && u.callsign.trim()) normalized.callsign = u.callsign.trim();
      return normalized;
    });
  }

  static validateAircraftPreset(rawTpl, keyName = 'Imported Aircraft Preset') {
    const acMap = window.AIRCRAFT_CATALOG;
    const gunsMap = window.AUTOCANNONS_CATALOG;
    const wpnsMap = window.WEAPONS_CATALOG;
    const upgMap = window.UPGRADES_CATALOG;
    if (!acMap || !gunsMap || !wpnsMap || !upgMap) {
      throw new Error('Aircraft, weapon, gun, and upgrade catalogs must be loaded before validating presets.');
    }
    if (!rawTpl || typeof rawTpl !== 'object' || Array.isArray(rawTpl)) {
      throw new Error(`Aircraft preset "${keyName}" is not a valid object.`);
    }
    const cleanName = String(rawTpl.name || keyName || '').trim();
    if (!cleanName) throw new Error('Aircraft preset name cannot be empty.');
    if (!rawTpl.specId || !acMap[rawTpl.specId]) {
      throw new Error(`Unknown aircraft "${rawTpl.specId}" in preset "${cleanName}".`);
    }
    const spec = acMap[rawTpl.specId];
    const chosenGunId = rawTpl.chosenGunId || spec.builtInGun;
    if (!gunsMap[chosenGunId]) {
      throw new Error(`Unknown autocannon "${chosenGunId}" in preset "${cleanName}".`);
    }

    const weapons = this.normalizeWeapons(rawTpl.weapons, spec, wpnsMap, cleanName);
    const upgrades = this.normalizeUpgrades(rawTpl.upgrades, upgMap, cleanName);

    return {
      name: cleanName,
      specId: rawTpl.specId,
      roleCategory: 'CUSTOM',
      chosenGunId,
      weapons,
      upgrades,
      desc: (typeof rawTpl.desc === 'string' && rawTpl.desc.trim())
        ? rawTpl.desc.trim()
        : `User configuration based on ${spec.name}.`
    };
  }

  static buildSquadronIndexFromMap(userMap) {
    const byName = new Map();
    const bySig = new Map();

    if (typeof ProcurementPresets !== 'undefined') {
      ProcurementPresets.getBuiltinPresetCatalog().forEach(meta => {
        const units = ProcurementPresets.getBuiltinPreset(meta.id);
        const rec = { key: meta.id, name: meta.name, source: 'BUILTIN', data: units };
        byName.set(this.normalizeKey(meta.id), rec);
        byName.set(this.normalizeKey(meta.name), rec);
        bySig.set(this.squadronSignature(units), rec);
      });
    }

    Object.entries(userMap || {}).forEach(([name, units]) => {
      if (Array.isArray(units) && units.length > 0) {
        const rec = { key: name, name, source: 'USER', data: units };
        byName.set(this.normalizeKey(name), rec);
        bySig.set(this.squadronSignature(units), rec);
      }
    });

    return { byName, bySig };
  }

  static findSquadronConflict(name, units, userMap) {
    const { byName, bySig } = this.buildSquadronIndexFromMap(userMap);
    const nRec = byName.get(this.normalizeKey(name));
    const sRec = bySig.get(this.squadronSignature(units));
    if (!nRec && !sRec) return null;

    const primary = nRec || sRec;
    let reason = 'NAME';
    if (nRec && sRec) {
      reason = (nRec.key === sRec.key && nRec.source === sRec.source) ? 'NAME_AND_CONFIG' : 'NAME';
    } else if (sRec) {
      reason = 'CONFIG';
    }

    const blockReplace = Boolean(nRec && sRec && (nRec.key !== sRec.key || nRec.source !== sRec.source));
    return {
      kind: 'squadron',
      reason,
      blockReplace,
      secondaryNote: blockReplace ? `Also matches configuration of "${sRec.name}" — resolve that preset first.` : '',
      existing: primary,
      incoming: { name, source: 'INCOMING', data: units }
    };
  }

  static buildAircraftIndexFromMap(customMap, defaultsMap) {
    const byName = new Map();
    const bySig = new Map();
    const defaults = defaultsMap || (window.AIRCRAFT_TEMPLATES || {});

    Object.entries(defaults).forEach(([key, tpl]) => {
      if (!tpl || !tpl.specId) return;
      const label = tpl.name || key;
      const rec = { key, name: label, source: 'BUILTIN', data: tpl };
      byName.set(this.normalizeKey(key), rec);
      byName.set(this.normalizeKey(label), rec);
      bySig.set(this.aircraftConfigSignature(tpl), rec);
    });

    Object.entries(customMap || {}).forEach(([key, tpl]) => {
      if (!tpl || !tpl.specId) return;
      const label = tpl.name || key;
      const rec = { key, name: label, source: 'USER', data: tpl };
      byName.set(this.normalizeKey(key), rec);
      byName.set(this.normalizeKey(label), rec);
      bySig.set(this.aircraftConfigSignature(tpl), rec);
    });

    return { byName, bySig };
  }

  static findAircraftConflict(tpl, customMap, defaultsMap) {
    const { byName, bySig } = this.buildAircraftIndexFromMap(customMap, defaultsMap);
    const nRec = byName.get(this.normalizeKey(tpl.name));
    const sRec = bySig.get(this.aircraftConfigSignature(tpl));
    if (!nRec && !sRec) return null;

    const primary = nRec || sRec;
    let reason = 'NAME';
    if (nRec && sRec) {
      reason = (nRec.key === sRec.key && nRec.source === sRec.source) ? 'NAME_AND_CONFIG' : 'NAME';
    } else if (sRec) {
      reason = 'CONFIG';
    }

    const blockReplace = Boolean(nRec && sRec && (nRec.key !== sRec.key || nRec.source !== sRec.source));
    return {
      kind: 'aircraft',
      reason,
      blockReplace,
      secondaryNote: blockReplace ? `Also matches loadout of "${sRec.name}" — resolve that preset first.` : '',
      existing: primary,
      incoming: { name: tpl.name, source: 'INCOMING', data: tpl }
    };
  }

  static exportAllSquadronPresets(customLoadouts) {
    if (!customLoadouts) throw new Error('CustomLoadoutsManager is required.');
    const userOnly = {};
    const builtinNames = new Set();
    if (typeof ProcurementPresets !== 'undefined') {
      ProcurementPresets.getBuiltinPresetCatalog().forEach(m => {
        builtinNames.add(this.normalizeKey(m.id));
        builtinNames.add(this.normalizeKey(m.name));
      });
    }
    for (const [name, units] of Object.entries(customLoadouts.getAll())) {
      if (!builtinNames.has(this.normalizeKey(name)) && Array.isArray(units) && units.length > 0) {
        userOnly[name] = units;
      }
    }
    const names = Object.keys(userOnly);
    if (names.length === 0) throw new Error('No user-saved squadron presets found to export.');
    DataExchange.downloadJson('airspace-standoff-squadron-presets.json', {
      format: 'AIRSPACE_STANDOFF_SQUADRON_PRESETS',
      version: 1,
      exportedAt: new Date().toISOString(),
      presets: userOnly
    });
    return names.length;
  }

  static exportSingleSquadronPreset(name, units) {
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('Preset name is required for export.');
    const validated = this.validateSquadronUnits(units, cleanName);
    DataExchange.downloadJson(`squadron-preset-${DataExchange.slugify(cleanName)}.json`, {
      format: 'AIRSPACE_STANDOFF_SQUADRON_PRESETS',
      version: 1,
      exportedAt: new Date().toISOString(),
      presets: { [cleanName]: validated }
    });
  }

  static parseSquadronPresetsPayload(rawText, filename) {
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`Invalid JSON file: ${err.message}`);
    }

    let rawMap = null;
    if (Array.isArray(parsed)) {
      const baseName = String(filename || 'Imported Squadron').replace(/\.json$/i, '').trim() || 'Imported Squadron';
      rawMap = { [baseName]: parsed };
    } else if (parsed && typeof parsed === 'object') {
      if (parsed.presets && typeof parsed.presets === 'object' && !Array.isArray(parsed.presets)) {
        rawMap = parsed.presets;
      } else if (typeof parsed.name === 'string' && Array.isArray(parsed.units)) {
        rawMap = { [parsed.name]: parsed.units };
      } else {
        rawMap = parsed;
      }
    }

    if (!rawMap || typeof rawMap !== 'object') {
      throw new Error('JSON file does not contain recognizable squadron presets.');
    }
    const entries = Object.entries(rawMap);
    if (entries.length === 0) {
      throw new Error('No squadron presets found in the imported JSON file.');
    }

    return entries.map(([rawName, units]) => {
      const cleanName = String(rawName || '').trim();
      if (!cleanName) throw new Error('Imported JSON contains an empty squadron preset name.');
      return { name: cleanName, units: this.validateSquadronUnits(units, cleanName) };
    });
  }

  static exportAllAircraftPresets(customLoadouts) {
    if (!customLoadouts) throw new Error('CustomLoadoutsManager is required.');
    const customs = customLoadouts.getCustomTemplates();
    const names = Object.keys(customs);
    if (names.length === 0) throw new Error('No user-saved aircraft presets found to export.');
    DataExchange.downloadJson('airspace-standoff-aircraft-presets.json', {
      format: 'AIRSPACE_STANDOFF_AIRCRAFT_PRESETS',
      version: 1,
      exportedAt: new Date().toISOString(),
      presets: customs
    });
    return names.length;
  }

  static exportSingleAircraftPreset(tpl) {
    const clean = this.validateAircraftPreset(tpl, tpl && tpl.name);
    DataExchange.downloadJson(`aircraft-preset-${DataExchange.slugify(clean.name)}.json`, {
      format: 'AIRSPACE_STANDOFF_AIRCRAFT_PRESETS',
      version: 1,
      exportedAt: new Date().toISOString(),
      presets: { [clean.name]: clean }
    });
  }

  static parseAircraftPresetsPayload(rawText, filename) {
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`Invalid JSON file: ${err.message}`);
    }

    let rawMap = null;
    if (Array.isArray(parsed)) {
      rawMap = {};
      parsed.forEach((item, i) => {
        const key = (item && item.name) ? item.name : `Imported Aircraft ${i + 1}`;
        rawMap[key] = item;
      });
    } else if (parsed && typeof parsed === 'object') {
      if (parsed.presets && typeof parsed.presets === 'object' && !Array.isArray(parsed.presets)) {
        rawMap = parsed.presets;
      } else if (parsed.templates && typeof parsed.templates === 'object' && !Array.isArray(parsed.templates)) {
        rawMap = parsed.templates;
      } else if (typeof parsed.specId === 'string') {
        const baseName = String(parsed.name || filename || 'Imported Aircraft').replace(/\.json$/i, '').trim();
        rawMap = { [baseName]: parsed };
      } else {
        rawMap = parsed;
      }
    }

    if (!rawMap || typeof rawMap !== 'object') {
      throw new Error('JSON file does not contain recognizable aircraft presets.');
    }
    const entries = Object.entries(rawMap);
    if (entries.length === 0) {
      throw new Error('No aircraft presets found in the imported JSON file.');
    }

    return entries.map(([rawKey, rawTpl]) => this.validateAircraftPreset(rawTpl, rawKey));
  }
}

window.PresetExchange = PresetExchange;
