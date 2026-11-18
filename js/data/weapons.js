/**
 * js/data/weapons.js - Master Weapons Catalog aggregator and separated category query engine.
 */

const requiredWeaponModules = [
  ['WEAPONS_A2A', window.WEAPONS_A2A],
  ['WEAPONS_A2A_ULR', window.WEAPONS_A2A_ULR],
  ['WEAPONS_A2A_WVR', window.WEAPONS_A2A_WVR],
  ['WEAPONS_A2G', window.WEAPONS_A2G],
  ['WEAPONS_A2G_CLUSTER', window.WEAPONS_A2G_CLUSTER],
  ['WEAPONS_A2G_GLIDE', window.WEAPONS_A2G_GLIDE],
  ['WEAPONS_A2G_LASER', window.WEAPONS_A2G_LASER],
  ['WEAPONS_A2G_BUNKER', window.WEAPONS_A2G_BUNKER],
  ['WEAPONS_A2G_ROCKETS', window.WEAPONS_A2G_ROCKETS],
  ['WEAPONS_A2G_MISSILES', window.WEAPONS_A2G_MISSILES],
  ['WEAPONS_A2G_ARMS', window.WEAPONS_A2G_ARMS],
  ['WEAPONS_A2G_CRUISE', window.WEAPONS_A2G_CRUISE],
  ['WEAPONS_A2G_LOITERING', window.WEAPONS_A2G_LOITERING],
  ['WEAPONS_A2A_CANNONS', window.WEAPONS_A2A_CANNONS],
  ['WEAPONS_A2G_CANNONS', window.WEAPONS_A2G_CANNONS],
  ['WEAPONS_TARGETING_PODS', window.WEAPONS_TARGETING_PODS],
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
  window.WEAPONS_A2A_ULR,
  window.WEAPONS_A2A_WVR,
  window.WEAPONS_A2G,
  window.WEAPONS_A2G_CLUSTER,
  window.WEAPONS_A2G_GLIDE,
  window.WEAPONS_A2G_LASER,
  window.WEAPONS_A2G_BUNKER,
  window.WEAPONS_A2G_ROCKETS,
  window.WEAPONS_A2G_MISSILES,
  window.WEAPONS_A2G_ARMS,
  window.WEAPONS_A2G_CRUISE,
  window.WEAPONS_A2G_LOITERING,
  window.WEAPONS_A2A_CANNONS,
  window.WEAPONS_A2G_CANNONS,
  window.WEAPONS_TARGETING_PODS,
  window.WEAPONS_PODS
);

window.AUTOCANNONS_CATALOG = Object.assign(
  {},
  window.AUTOCANNONS_BALLISTIC,
  window.AUTOCANNONS_ENERGY
);

window.WeaponsRegistry = {
  getAll() { return Object.values(window.WEAPONS_CATALOG); },
  getById(id) {
    const weapon = window.WEAPONS_CATALOG[id];
    if (!weapon) throw new Error(`Weapon with ID "${id}" does not exist in WEAPONS_CATALOG.`);
    return weapon;
  },
  getByCategory(cat) {
    if (!cat || cat === 'ALL') return this.getAll();
    return this.getAll().filter(w => w.category === cat);
  },
  getByA2AGroup(group) {
    if (!group || group === 'ALL') return this.getByCategory('A2A');
    return this.getAll().filter(w => w.category === 'A2A' && w.a2aGroup === group);
  },
  getByA2GGroup(group) {
    if (!group || group === 'ALL') return this.getByCategory('A2G');
    return this.getAll().filter(w => w.category === 'A2G' && w.a2gGroup === group);
  },
  getPodsByGroup(group) {
    const pods = this.getAll().filter(w => w.category === 'POD');
    if (!group || group === 'ALL') return pods;
    return pods.filter(w => w.podGroup === group);
  },
  getAutocannons() { return Object.values(window.AUTOCANNONS_CATALOG); },
  getAutocannonById(id) {
    const gun = window.AUTOCANNONS_CATALOG[id];
    if (!gun) throw new Error(`Autocannon with ID "${id}" does not exist in AUTOCANNONS_CATALOG.`);
    return gun;
  }
};
