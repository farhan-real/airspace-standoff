/**
 * AIRSPACE STANDOFF: Master Templates Aggregator & Query Registry
 */

const requiredTemplateModules = [
  ['TEMPLATES_STEALTH', window.TEMPLATES_STEALTH],
  ['TEMPLATES_SUPERIORITY', window.TEMPLATES_SUPERIORITY],
  ['TEMPLATES_MULTIROLE', window.TEMPLATES_MULTIROLE],
  ['TEMPLATES_STRIKE', window.TEMPLATES_STRIKE],
  ['TEMPLATES_EW', window.TEMPLATES_EW],
  ['TEMPLATES_DRONES', window.TEMPLATES_DRONES],
  ['TEMPLATES_EXPERIMENTAL', window.TEMPLATES_EXPERIMENTAL],
  ['TEMPLATES_SUPERFIGHTERS', window.TEMPLATES_SUPERFIGHTERS]
];

for (const [name, moduleData] of requiredTemplateModules) {
  if (!moduleData || typeof moduleData !== 'object') {
    throw new Error(`Aircraft template module "${name}" is missing or failed to load.`);
  }
}

window.AIRCRAFT_TEMPLATES = Object.assign(
  {},
  window.TEMPLATES_STEALTH,
  window.TEMPLATES_SUPERIORITY,
  window.TEMPLATES_MULTIROLE,
  window.TEMPLATES_STRIKE,
  window.TEMPLATES_EW,
  window.TEMPLATES_DRONES,
  window.TEMPLATES_EXPERIMENTAL,
  window.TEMPLATES_SUPERFIGHTERS
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