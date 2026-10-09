/**
 * AIRSPACE STANDOFF: Master Weapons Catalog Aggregator
 */

const requiredWeaponModules = [
  ['WEAPONS_A2A', window.WEAPONS_A2A],
  ['WEAPONS_A2A_WVR', window.WEAPONS_A2A_WVR],
  ['WEAPONS_A2G', window.WEAPONS_A2G],
  ['WEAPONS_PODS', window.WEAPONS_PODS]
];

for (const [name, moduleData] of requiredWeaponModules) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Weapon module "${name}" is missing or failed to load.`);
  }
}

const requiredGunModules = [
  ['AUTOCANNONS_BALLISTIC', window.AUTOCANNONS_BALLISTIC],
  ['AUTOCANNONS_ENERGY', window.AUTOCANNONS_ENERGY]
];

for (const [name, moduleData] of requiredGunModules) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Autocannon module "${name}" is missing or failed to load.`);
  }
}

window.WEAPONS_CATALOG = Object.assign(
  {},
  window.WEAPONS_A2A,
  window.WEAPONS_A2A_WVR,
  window.WEAPONS_A2G,
  window.WEAPONS_PODS
);

window.AUTOCANNONS_CATALOG = Object.assign(
  {},
  window.AUTOCANNONS_BALLISTIC,
  window.AUTOCANNONS_ENERGY
);

window.WeaponsRegistry = {
  getAll() {
    return Object.values(window.WEAPONS_CATALOG);
  },
  getById(id) {
    const weapon = window.WEAPONS_CATALOG[id];
    if (!weapon) {
      throw new Error(`Weapon with ID "${id}" does not exist in WEAPONS_CATALOG.`);
    }
    return weapon;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(w => w.category === cat);
  },
  getAutocannons() {
    return Object.values(window.AUTOCANNONS_CATALOG);
  },
  getAutocannonById(id) {
    const gun = window.AUTOCANNONS_CATALOG[id];
    if (!gun) {
      throw new Error(`Autocannon with ID "${id}" does not exist in AUTOCANNONS_CATALOG.`);
    }
    return gun;
  }
};