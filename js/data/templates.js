/**
 * AIRSPACE STANDOFF: Master Templates Aggregator & Query Registry
 */

window.AIRCRAFT_TEMPLATES = Object.assign(
  {},
  window.TEMPLATES_STEALTH || {},
  window.TEMPLATES_SUPERIORITY || {},
  window.TEMPLATES_MULTIROLE || {},
  window.TEMPLATES_STRIKE || {},
  window.TEMPLATES_EW || {},
  window.TEMPLATES_DRONES || {},
  window.TEMPLATES_EXPERIMENTAL || {}
);

window.AircraftTemplatesRegistry = {
  getAll() {
    return Object.values(window.AIRCRAFT_TEMPLATES);
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(t => t.roleCategory === cat);
  },
  getByAirframe(specId) {
    if (!specId || specId === 'ALL') return this.getAll();
    return this.getAll().filter(t => t.specId === specId);
  },
  count() {
    return Object.keys(window.AIRCRAFT_TEMPLATES).length;
  }
};