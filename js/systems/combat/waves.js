/**
 * AIRSPACE STANDOFF: Dynamic Theater Reinforcement Wave Generator
 */

class FleetWaveGenerator {
  static generate(waveIndex, team, theaterWidth, theaterHeight, difficultyKey) {
    if (!window.AI_DIFFICULTIES || !window.AI_DIFFICULTIES[difficultyKey]) {
      throw new Error(`Invalid difficultyKey "${difficultyKey}" in FleetWaveGenerator.generate.`);
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
      const specId = (i === 1 && !isBlue && ['ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff))
        ? (['MASTER', 'LEGEND'].includes(diff) && rng.boolean(0.50) ? 'EA-36' : 'EA-18G')
        : pool[i % pool.length];
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

      const isEW = Boolean(ac.spec.category === 'EW' || ac.spec.isEW);
      const isStrike = Boolean(ac.spec.category === 'STRIKE');
      const isDrone = Boolean(ac.spec.category === 'DRONES' || ac.spec.isDrone);
      const isStealth = Boolean(ac.spec.category === 'STEALTH');
      const isAgile = Boolean(['Su-35S', 'Rafale-C', 'Eurofighter', 'Su-37', 'Su-47', 'XFA-36B'].includes(ac.spec.id));
      const isHighSpeed = Boolean(ac.spec.S_0 >= 1.25 || ['MiG-31BM', 'F-15EX', 'DARKSTAR', 'X-40'].includes(ac.spec.id));

      if (isEW) ac.tacticalRole = 'SEAD';
      else if (isDrone) ac.tacticalRole = 'SWARM';
      else if (isStrike) ac.tacticalRole = 'STRIKE';
      else if (isStealth) ac.tacticalRole = 'AMBUSH';
      else if (isHighSpeed) ac.tacticalRole = 'INTERCEPT';
      else if (isAgile) ac.tacticalRole = 'DOGFIGHT';
      else ac.tacticalRole = 'SWEEP';

      if (ac.tacticalRole === 'SEAD') {
        ac.installWeapon('AN-ALQ-99', 'EXTERNAL');
        ac.installWeapon('AGM-88G', 'EXTERNAL');
        ac.installWeapon('AIM-120D', 'EXTERNAL');
      } else if (ac.tacticalRole === 'STRIKE') {
        ac.installWeapon('GBU-39', 'EXTERNAL');
        ac.installWeapon('AIM-120D', ac.internalSlots >= 2 ? 'INTERNAL' : 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', (ac.internalSlots - ac.getUsedInternalSlots() >= 1) ? 'INTERNAL' : 'EXTERNAL');
      } else if (ac.tacticalRole === 'SWARM' || ac.maxPylonRating === 'Type S') {
        if (!ac.installWeapon('MAM', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL')) {
          throw new Error(`Failed to equip MAM on wave drone "${ac.spec.id}".`);
        }
        if (!ac.installWeapon('AIM-9X-2', (ac.internalSlots - ac.getUsedInternalSlots() >= 1) ? 'INTERNAL' : 'EXTERNAL')) {
          throw new Error(`Failed to equip AIM-9X-2 on wave drone "${ac.spec.id}".`);
        }
      } else if (ac.tacticalRole === 'AMBUSH' && ac.internalSlots >= 3) {
        ac.installWeapon('AIM-120D', 'INTERNAL');
        ac.installWeapon('AIM-9X-2', 'INTERNAL');
      } else {
        ac.installWeapon('AIM-120D', ac.internalSlots >= 2 ? 'INTERNAL' : 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', (ac.internalSlots - ac.getUsedInternalSlots() >= 1) ? 'INTERNAL' : 'EXTERNAL');
      }
      ac.recalculateWeight();
      return ac;
    });

    waveSquadron.sort((a, b) => (b.isAce ? 1 : 0) - (a.isAce ? 1 : 0) || (b.isFlightLead ? 1 : 0) - (a.isFlightLead ? 1 : 0));
    return waveSquadron;
  }
}

window.FleetWaveGenerator = FleetWaveGenerator;
