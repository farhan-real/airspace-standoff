/**
 * AIRSPACE STANDOFF: Master Aircraft Catalog Aggregator & Query Engine
 */

window.AIRCRAFT_CATALOG = Object.assign(
  {},
  window.AIRCRAFT_STEALTH || {},
  window.AIRCRAFT_SUPERIORITY || {},
  window.AIRCRAFT_MULTIROLE || {},
  window.AIRCRAFT_STRIKE || {},
  window.AIRCRAFT_EW || {},
  window.AIRCRAFT_DRONES || {},
  window.AIRCRAFT_EXPERIMENTAL || {},
  window.AIRCRAFT_COFFIN || {}
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
  },
  isGunCompatible(spec, gun) {
    if (!spec || !gun) return false;
    if (gun.lockedTo && gun.lockedTo.length > 0) {
      if (!gun.lockedTo.includes(spec.id)) return false;
    }
    if (spec.allowedGuns && spec.allowedGuns.length > 0) {
      if (!spec.allowedGuns.includes(gun.id)) return false;
    }
    return true;
  }
};