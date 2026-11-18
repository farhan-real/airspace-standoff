/**
 * js/data/upgrades.js - Master Upgrades, Strike Subsystems, and Maneuvers aggregator.
 */

if (!window.UPGRADES_CATALOG || typeof window.UPGRADES_CATALOG !== 'object') {
  throw new Error('Base UPGRADES_CATALOG module is missing or failed to load.');
}
if (!window.STRIKE_UPGRADES_CATALOG || typeof window.STRIKE_UPGRADES_CATALOG !== 'object') {
  throw new Error('STRIKE_UPGRADES_CATALOG module is missing or failed to load.');
}
if (!Array.isArray(window.MANEUVER_CARDS)) {
  throw new Error('MANEUVER_CARDS module is missing or failed to load.');
}

window.UPGRADES_CATALOG = Object.assign(
  {},
  window.UPGRADES_CATALOG,
  window.STRIKE_UPGRADES_CATALOG
);

window.UpgradesRegistry = {
  getAll() {
    return Object.values(window.UPGRADES_CATALOG);
  },
  getById(id) {
    const upgrade = window.UPGRADES_CATALOG[id];
    if (!upgrade) {
      throw new Error(`Upgrade with ID "${id}" does not exist in UPGRADES_CATALOG.`);
    }
    return upgrade;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(u => u.category === cat);
  }
};

window.UPGRADES_READY = true;
