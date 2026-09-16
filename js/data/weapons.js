/**
 * APEX VECTOR // Master Weapons Catalog Aggregator
 */

window.WEAPONS_CATALOG = Object.assign(
  {},
  window.WEAPONS_A2A || {},
  window.WEAPONS_A2G || {},
  window.WEAPONS_PODS || {}
);

window.WeaponsRegistry = {
  getAll() {
    return Object.values(window.WEAPONS_CATALOG);
  },
  getById(id) {
    return window.WEAPONS_CATALOG[id] || null;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(w => w.category === cat);
  },
  getAutocannons() {
    return Object.values(window.AUTOCANNONS_CATALOG || {});
  },
  getAutocannonById(id) {
    return (window.AUTOCANNONS_CATALOG || {})[id] || null;
  }
};