/**
 * js/ui/procurement/presetmatcher.js - Aircraft preset matching helper (ignores upgrades, allows up to 1 weapon diff).
 */

class PresetMatcher {
  static escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  static extractWeaponIds(weaponsList) {
    const ids = [];
    (weaponsList || []).forEach(entry => {
      const id = (typeof entry === 'object' && entry !== null) ? (entry.id || entry.specId) : entry;
      if (id) ids.push(id);
    });
    return ids;
  }

  static extractUpgradeIds(upgradesList) {
    const ids = [];
    (upgradesList || []).forEach(entry => {
      const id = (typeof entry === 'object' && entry !== null) ? (entry.id || entry.specId) : entry;
      if (id) ids.push(id);
    });
    return ids;
  }

  static countItems(ids) {
    const map = new Map();
    ids.forEach(id => map.set(id, (map.get(id) || 0) + 1));
    return map;
  }

  static match(specId, weaponsList, chosenGunId = null, upgradesList = [], customLoadouts = null) {
    if (!specId) return null;
    if (!window.WEAPONS_CATALOG) throw new Error('WEAPONS_CATALOG must be loaded before PresetMatcher.match.');

    const templates = (customLoadouts && typeof customLoadouts.getTemplates === 'function')
      ? customLoadouts.getTemplates()
      : window.AIRCRAFT_TEMPLATES;
    if (!templates) throw new Error('AIRCRAFT_TEMPLATES must be loaded before PresetMatcher.match.');

    const templateKeys = Object.keys(templates);
    const cacheSig = `${templateKeys.length}:${templateKeys[templateKeys.length - 1] || ''}`;
    if (!PresetMatcher._specIndex || PresetMatcher._cacheSig !== cacheSig) {
      const idxMap = new Map();
      Object.values(templates).forEach(t => {
        if (!t || !t.specId) return;
        let list = idxMap.get(t.specId);
        if (!list) { list = []; idxMap.set(t.specId, list); }
        list.push(t);
      });
      PresetMatcher._specIndex = idxMap;
      PresetMatcher._cacheSig = cacheSig;
    }

    const candidates = PresetMatcher._specIndex.get(specId);
    if (!candidates || candidates.length === 0) return null;

    const acWeaponIds = PresetMatcher.extractWeaponIds(weaponsList);
    const acCounts = PresetMatcher.countItems(acWeaponIds);
    const acUpgradeSet = new Set(PresetMatcher.extractUpgradeIds(upgradesList));

    let bestMatch = null;
    let bestScore = null;

    candidates.forEach(tpl => {

      const tplWeaponIds = PresetMatcher.extractWeaponIds(tpl.weapons);
      if (acWeaponIds.length === 0 && tplWeaponIds.length > 0) return;

      const tplCounts = PresetMatcher.countItems(tplWeaponIds);
      const allIds = new Set([...acCounts.keys(), ...tplCounts.keys()]);
      const addedIds = [];
      const removedIds = [];

      allIds.forEach(wId => {
        const diff = (acCounts.get(wId) || 0) - (tplCounts.get(wId) || 0);
        if (diff > 0) {
          for (let i = 0; i < diff; i++) addedIds.push(wId);
        } else if (diff < 0) {
          for (let i = 0; i < -diff; i++) removedIds.push(wId);
        }
      });

      if (addedIds.length > 1 || removedIds.length > 1) return;

      let diffRank = 0;
      let diffType = 'EXACT';
      if (addedIds.length === 1 && removedIds.length === 0) {
        diffRank = 1;
        diffType = 'ADDED';
      } else if (addedIds.length === 0 && removedIds.length === 1) {
        diffRank = 1;
        diffType = 'REMOVED';
      } else if (addedIds.length === 1 && removedIds.length === 1) {
        diffRank = 2;
        diffType = 'MODIFIED';
      }

      const gunRank = (chosenGunId && tpl.chosenGunId && chosenGunId === tpl.chosenGunId) ? 0 : 1;
      const tplUpgrades = PresetMatcher.extractUpgradeIds(tpl.upgrades);
      let upgradeOverlap = 0;
      tplUpgrades.forEach(uId => {
        if (acUpgradeSet.has(uId)) upgradeOverlap++;
      });
      const customRank = tpl.roleCategory === 'CUSTOM' ? 0 : 1;

      const score = [diffRank, gunRank, -upgradeOverlap, customRank];
      const isBetter = !bestScore || score.some((val, idx) => {
        if (val < bestScore[idx]) return true;
        if (val > bestScore[idx]) return false;
        return false;
      }) && (() => {
        for (let i = 0; i < score.length; i++) {
          if (score[i] !== bestScore[i]) return score[i] < bestScore[i];
        }
        return false;
      })();

      if (isBetter) {
        bestScore = score;
        const wpnMap = window.WEAPONS_CATALOG;
        const addedId = addedIds[0] || null;
        const removedId = removedIds[0] || null;
        if (addedId && !wpnMap[addedId]) throw new Error(`Weapon "${addedId}" not found in WEAPONS_CATALOG.`);
        if (removedId && !wpnMap[removedId]) throw new Error(`Weapon "${removedId}" not found in WEAPONS_CATALOG.`);

        bestMatch = {
          name: tpl.name,
          diffType,
          addedId,
          removedId,
          addedName: addedId ? wpnMap[addedId].name : null,
          removedName: removedId ? wpnMap[removedId].name : null
        };
      }
    });

    return bestMatch;
  }

  static renderMatchHtml(match) {
    if (!match) return '';
    const safeName = PresetMatcher.escapeHtml(match.name);
    const badgeClass = match.diffType === 'EXACT' ? 'exact' : 'modified';

    let diffHtml = '';
    if (match.diffType === 'ADDED') {
      const safeAdd = PresetMatcher.escapeHtml(match.addedName);
      diffHtml = `<span class="preset-match-diff added" title="1 weapon added vs preset: ${safeAdd}">+${safeAdd}</span>`;
    } else if (match.diffType === 'REMOVED') {
      const safeRem = PresetMatcher.escapeHtml(match.removedName);
      diffHtml = `<span class="preset-match-diff removed" title="1 weapon removed vs preset: ${safeRem}">-${safeRem}</span>`;
    } else if (match.diffType === 'MODIFIED') {
      const safeRem = PresetMatcher.escapeHtml(match.removedName);
      const safeAdd = PresetMatcher.escapeHtml(match.addedName);
      diffHtml = `<span class="preset-match-diff swapped" title="1 weapon modified vs preset: ${safeRem} to ${safeAdd}">${safeRem} &rarr; ${safeAdd}</span>`;
    }

    return `<div class="preset-match-line"><span class="preset-match-badge ${badgeClass}">PRESET</span><span class="preset-match-name" title="${safeName}">${safeName}</span>${diffHtml}</div>`;
  }
}

window.PresetMatcher = PresetMatcher;
