/**
 * APEX VECTOR // Master Aircraft Catalog Aggregator & Query Engine
 */

window.AIRCRAFT_CATALOG = Object.assign(
  {},
  window.AIRCRAFT_STEALTH || {},
  window.AIRCRAFT_FIGHTERS || {},
  window.AIRCRAFT_SUPERIORITY || {},
  window.AIRCRAFT_MULTIROLE || {},
  window.AIRCRAFT_STRIKE || {},
  window.AIRCRAFT_EW || {},
  window.AIRCRAFT_DRONES || {},
  window.AIRCRAFT_EXPERIMENTAL || {}
);

window.AircraftRegistry = {
  getAll() {
    return Object.values(window.AIRCRAFT_CATALOG);
  },
  getById(id) {
    return window.AIRCRAFT_CATALOG[id] || null;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(a => a.category === cat);
  },
  count() {
    return Object.keys(window.AIRCRAFT_CATALOG).length;
  }
};