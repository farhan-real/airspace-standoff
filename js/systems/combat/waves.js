/**
 * AIRSPACE STANDOFF: Dynamic Theater Reinforcement Wave Generator
 */

class FleetWaveGenerator {
  static generate(waveIndex, team, theaterWidth, theaterHeight, difficultyKey, doctrineKey) {
    if (!window.AI_DIFFICULTIES || !window.AI_DIFFICULTIES[difficultyKey]) {
      throw new Error(`Invalid difficultyKey "${difficultyKey}" in FleetWaveGenerator.generate.`);
    }
    if (!window.AIR_DOCTRINES || !window.AIR_DOCTRINES[doctrineKey]) {
      throw new Error(`Invalid doctrineKey "${doctrineKey}" in FleetWaveGenerator.generate.`);
    }
    if (typeof FormationPlanner === 'undefined') {
      throw new Error('FormationPlanner is not loaded.');
    }
    const diff = difficultyKey;
    const isBlue = (team === 'friendly');
    const rng = window.PRNG;

    const count = (diff === 'FORTIFIED' || diff === 'MASTER' || diff === 'LEGEND') ? 3 : 2;
    const pool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21', 'XFA-36B']
      : (['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)
        ? ['Su-57', 'ADF-11F', 'CFA-44', 'X-02S', 'F-15EX', 'EA-18G', 'X-40', 'XFA-36B', ...(['MASTER', 'LEGEND'].includes(diff) ? ['EA-36'] : [])]
        : ['Su-35S', 'MiG-31BM', 'Su-30SM', 'Eurofighter', 'EA-18G']);
    const sqName = isBlue ? `Reinforcement Wing ${waveIndex}` : `Hostile Wave ${waveIndex}`;

    const items = [];
    for (let i = 0; i < count; i++) {
      const forceEw = (doctrineKey === 'RADAR_JAMMING' && i === 1) ||
        (i === 1 && !isBlue && ['ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff));
      const specId = forceEw
        ? (['MASTER', 'LEGEND'].includes(diff) && rng.boolean(0.50) ? 'EA-36' : 'EA-18G')
        : (doctrineKey === 'DRONE_SWARM' && i > 0 ? 'MQ-101' : pool[i % pool.length]);
      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && ['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff));
      items.push({
        specId, isLead, isAce,
        callsign: isAce ? `Ace ${sqName}` : `${sqName} ${i + 1}`
      });
    }

    const plans = FormationPlanner.calculateFormationSpawns(items, team, theaterWidth, theaterHeight, rng);
    const midY = theaterHeight / 2.0;
    const waveSquadron = plans.map(p => {
      const heading = isBlue ? rng.range(-0.08, 0.08) : (Math.PI + rng.range(-0.08, 0.08));
      const spawnY = p.item.isLead ? midY : p.y;
      const ac = new Aircraft(p.item.specId, team, p.x, spawnY, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);
      const planned = FleetOutfitter.planAircraftLoadout(ac.spec, p.item.isAce, doctrineKey, diff, rng);
      ac.tacticalRole = planned.role;
      if (planned.chosenGunId) ac.setGun(planned.chosenGunId);
      (planned.weapons || []).forEach(w => ac.installWeapon(w.id, w.station));
      (planned.upgrades || []).forEach(u => ac.installUpgrade(u));
      ac.recalculateWeight();
      return ac;
    });

    waveSquadron.sort((a, b) => (b.isAce ? 1 : 0) - (a.isAce ? 1 : 0) || (b.isFlightLead ? 1 : 0) - (a.isFlightLead ? 1 : 0));
    return waveSquadron;
  }
}

window.FleetWaveGenerator = FleetWaveGenerator;
