/**
 * js/data/templates.js - Master Templates Aggregator & Query Registry.
 */

const requiredTemplateModules = [
  ['TEMPLATES_STEALTH', window.TEMPLATES_STEALTH],
  ['TEMPLATES_STEALTH_NEXT', window.TEMPLATES_STEALTH_NEXT],
  ['TEMPLATES_SUPERIORITY', window.TEMPLATES_SUPERIORITY],
  ['TEMPLATES_AIR_DOMINANCE', window.TEMPLATES_AIR_DOMINANCE],
  ['TEMPLATES_MULTIROLE', window.TEMPLATES_MULTIROLE],
  ['TEMPLATES_MULTIROLE_PLUS', window.TEMPLATES_MULTIROLE_PLUS],
  ['TEMPLATES_STRIKE', window.TEMPLATES_STRIKE],
  ['TEMPLATES_EW', window.TEMPLATES_EW],
  ['TEMPLATES_DRONES', window.TEMPLATES_DRONES],
  ['TEMPLATES_EXPERIMENTAL', window.TEMPLATES_EXPERIMENTAL],
  ['TEMPLATES_SUPERFIGHTERS', window.TEMPLATES_SUPERFIGHTERS],
  ['TEMPLATES_A2G_CAS', window.TEMPLATES_A2G_CAS],
  ['TEMPLATES_A2G_BOMBERS', window.TEMPLATES_A2G_BOMBERS],
  ['TEMPLATES_A2G_STEALTH', window.TEMPLATES_A2G_STEALTH],
  ['TEMPLATES_A2G_MULTIROLE', window.TEMPLATES_A2G_MULTIROLE],
  ['TEMPLATES_A2G_SUPERIORITY', window.TEMPLATES_A2G_SUPERIORITY],
  ['TEMPLATES_A2G_SPECIALS', window.TEMPLATES_A2G_SPECIALS]
];

for (const [name, moduleData] of requiredTemplateModules) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Aircraft template module "${name}" is missing or failed to load.`);
  }
}

window.AIRCRAFT_TEMPLATES = Object.assign(
  {},
  window.TEMPLATES_STEALTH,
  window.TEMPLATES_STEALTH_NEXT,
  window.TEMPLATES_SUPERIORITY,
  window.TEMPLATES_AIR_DOMINANCE,
  window.TEMPLATES_MULTIROLE,
  window.TEMPLATES_MULTIROLE_PLUS,
  window.TEMPLATES_STRIKE,
  window.TEMPLATES_EW,
  window.TEMPLATES_DRONES,
  window.TEMPLATES_EXPERIMENTAL,
  window.TEMPLATES_SUPERFIGHTERS,
  window.TEMPLATES_A2G_CAS,
  window.TEMPLATES_A2G_BOMBERS,
  window.TEMPLATES_A2G_STEALTH,
  window.TEMPLATES_A2G_MULTIROLE,
  window.TEMPLATES_A2G_SUPERIORITY,
  window.TEMPLATES_A2G_SPECIALS
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
