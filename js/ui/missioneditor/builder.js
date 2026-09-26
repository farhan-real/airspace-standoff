/**
 * AIRSPACE STANDOFF: Mission Builder & Fleet Randomization Submodule
 */

class MissionBuilder {
  static createRandomSquadron(game, mission) {
    const catalog = Object.values(window.AIRCRAFT_CATALOG || {}).filter(spec => spec && spec.id && !spec.isDrone && Number(spec.cost) > 0);
    if (catalog.length === 0 || typeof FleetGenerator === 'undefined') return [];
    const budget = Math.max(1, Number(game.budgetMax) || 400);
    let remaining = budget;
    const requested = 3 + Math.floor(Math.random() * 6);
    const roster = [];
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Saber'])];

    while (roster.length < requested && roster.length < 16) {
      const affordable = catalog.filter(spec => Number(spec.cost) <= remaining);
      if (affordable.length === 0) break;
      const spec = affordable[Math.floor(Math.random() * affordable.length)];
      const planned = FleetGenerator.planAircraftLoadout(spec, false, mission.doctrine, mission.difficulty, Math.random);
      const loadoutCost = Number(planned.totalCost) || Number(spec.cost) || 20;
      if (loadoutCost > remaining) {
        const light = affordable.filter(candidate => Number(candidate.cost) <= remaining)
          .sort((a, b) => Number(a.cost) - Number(b.cost))[0];
        if (!light) break;
        roster.push({
          specId: light.id, chosenGunId: light.builtInGun || 'M61A2', callsign: callsigns.pop() || `Flight ${roster.length + 1}`,
          isLead: roster.length === 0, weapons: [], upgrades: []
        });
        remaining -= Number(light.cost) || 20;
        continue;
      }
      roster.push({
        specId: spec.id, chosenGunId: spec.builtInGun || 'M61A2', callsign: callsigns.pop() || `Flight ${roster.length + 1}`,
        isLead: roster.length === 0, weapons: planned.weapons || [], upgrades: planned.upgrades || []
      });
      remaining -= loadoutCost;
    }
    return roster;
  }

  static applyStandardWeapons(aircraft, mission) {
    if (!aircraft || typeof FleetGenerator === 'undefined') return;
    const spec = aircraft.spec || (window.AIRCRAFT_CATALOG || {})[aircraft.specId];
    if (!spec) return;
    const plan = FleetGenerator.planAircraftLoadout(spec, aircraft.isAce, mission.doctrine, mission.difficulty, Math.random);
    this.replaceAircraftWeapons(aircraft, plan.weapons || []);
  }

  static applyRandomWeapons(aircraft) {
    if (!aircraft) return;
    const weaponPool = Object.values(window.WEAPONS_CATALOG || {}).filter(weapon =>
      weapon && weapon.category === 'A2A' && !weapon.isJammerPod && !weapon.isDecoy && !weapon.isDecoyDrone
    );
    if (weaponPool.length === 0) return;
    this.replaceAircraftWeapons(aircraft, []);
    const shuffled = [...weaponPool].sort(() => Math.random() - 0.5);
    const targetCount = 2 + Math.floor(Math.random() * 5);
    let installed = 0;
    for (const weapon of shuffled) {
      if (installed >= targetCount) break;
      if (aircraft.installWeapon(weapon.id)) installed++;
    }
    if (installed === 0 && typeof FleetGenerator !== 'undefined') {
      const fallback = FleetGenerator.planAircraftLoadout(aircraft.spec, aircraft.isAce, 'BALANCED', 'VETERAN', Math.random);
      this.replaceAircraftWeapons(aircraft, fallback.weapons || []);
    }
    aircraft.recalculateWeight();
  }

  static replaceAircraftWeapons(aircraft, weapons) {
    if (!aircraft) return;
    aircraft.equippedWeapons = [];
    aircraft.jamEfficiency = 0;
    aircraft.hasMaldDecoy = false;
    aircraft.maldDecoyCharges = 0;
    (weapons || []).forEach(item => {
      const id = typeof item === 'string' ? item : (item && (item.id || item.specId));
      if (id) aircraft.installWeapon(id, item && typeof item === 'object' ? item.station : null);
    });
    aircraft.recalculateWeight();
  }

  static randomizeWeaponsForFleet(fleet) {
    (fleet || []).forEach(aircraft => this.applyRandomWeapons(aircraft));
  }
}

window.MissionBuilder = MissionBuilder;