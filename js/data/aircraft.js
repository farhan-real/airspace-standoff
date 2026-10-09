/**
 * AIRSPACE STANDOFF: Master Aircraft Catalog Aggregator & Query Engine
 */

const requiredAircraftCategories = [
  ['AIRCRAFT_STEALTH', window.AIRCRAFT_STEALTH],
  ['AIRCRAFT_SUPERIORITY', window.AIRCRAFT_SUPERIORITY],
  ['AIRCRAFT_MULTIROLE', window.AIRCRAFT_MULTIROLE],
  ['AIRCRAFT_STRIKE', window.AIRCRAFT_STRIKE],
  ['AIRCRAFT_EW', window.AIRCRAFT_EW],
  ['AIRCRAFT_DRONES', window.AIRCRAFT_DRONES],
  ['AIRCRAFT_EXPERIMENTAL', window.AIRCRAFT_EXPERIMENTAL],
  ['AIRCRAFT_SUPERFIGHTERS', window.AIRCRAFT_SUPERFIGHTERS],
  ['AIRCRAFT_COFFIN', window.AIRCRAFT_COFFIN]
];

for (const [name, moduleData] of requiredAircraftCategories) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Aircraft category module "${name}" is missing or failed to load.`);
  }
}

window.AIRCRAFT_CATALOG = Object.assign(
  {},
  window.AIRCRAFT_STEALTH,
  window.AIRCRAFT_SUPERIORITY,
  window.AIRCRAFT_MULTIROLE,
  window.AIRCRAFT_STRIKE,
  window.AIRCRAFT_EW,
  window.AIRCRAFT_DRONES,
  window.AIRCRAFT_EXPERIMENTAL,
  window.AIRCRAFT_SUPERFIGHTERS,
  window.AIRCRAFT_COFFIN
);

window.AircraftRegistry = {
  getAll() {
    return Object.values(window.AIRCRAFT_CATALOG);
  },
  getById(id) {
    const aircraft = window.AIRCRAFT_CATALOG[id];
    if (!aircraft) {
      throw new Error(`Aircraft with ID "${id}" does not exist in AIRCRAFT_CATALOG.`);
    }
    return aircraft;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(a => a.category === cat);
  },
  count() {
    return Object.keys(window.AIRCRAFT_CATALOG).length;
  },
  isGunCompatible(spec, gun) {
    if (!spec) throw new Error('AircraftRegistry.isGunCompatible requires a spec object.');
    if (!gun) throw new Error('AircraftRegistry.isGunCompatible requires a gun object.');
    if (gun.lockedTo && gun.lockedTo.length > 0) {
      if (!gun.lockedTo.includes(spec.id)) return false;
    }
    if (spec.allowedGuns && spec.allowedGuns.length > 0) {
      if (!spec.allowedGuns.includes(gun.id)) return false;
    }
    return true;
  }
};