/**
 * AIRSPACE STANDOFF: Master Ground Installations Catalog Aggregator & Query Engine
 */

const requiredGroundModules = [
  ['GROUND_RADARS', window.GROUND_RADARS],
  ['GROUND_SAMS', window.GROUND_SAMS],
  ['GROUND_BASES', window.GROUND_BASES]
];

for (const [name, moduleData] of requiredGroundModules) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Ground installation module "${name}" is missing or failed to load.`);
  }
}

window.GROUND_UNITS_CATALOG = Object.assign(
  {},
  window.GROUND_RADARS,
  window.GROUND_SAMS,
  window.GROUND_BASES
);

window.GroundUnitsRegistry = {
  getAll() {
    return Object.values(window.GROUND_UNITS_CATALOG);
  },
  getById(id) {
    const unit = window.GROUND_UNITS_CATALOG[id];
    if (!unit) {
      throw new Error(`Ground installation "${id}" does not exist in GROUND_UNITS_CATALOG.`);
    }
    return unit;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(u => u.category === cat);
  }
};
