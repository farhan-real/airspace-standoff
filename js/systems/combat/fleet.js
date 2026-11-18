/**
 * AIRSPACE STANDOFF: Dynamic Fleet Generator (150km x 100km Theater)
 * Supports friendly and hostile fleet generation with priority ace loading and budget rejection finalization.
 */

const FleetGenerator = {
  getFormationRank(spec, isLead, isAce) {
    return FormationPlanner.getFormationRank(spec, isLead, isAce);
  },

  calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rng) {
    return FormationPlanner.calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rng);
  },

  planAircraftLoadout(spec, isAce, doctrine, diff, rng) {
    return FleetOutfitter.planAircraftLoadout(spec, isAce, doctrine, diff, rng);
  },

  generateFleet(team, difficultyKey, doctrineKey, theaterWidth, theaterHeight, options = {}) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in FleetGenerator.generateFleet.`);
    if (!window.AI_DIFFICULTIES) throw new Error('AI_DIFFICULTIES is not loaded.');
    if (!window.CONFIG || typeof window.CONFIG.MAX_SQUADRON_SIZE !== 'number') throw new Error('CONFIG.MAX_SQUADRON_SIZE is not defined.');
    if (!window.AIRCRAFT_CATALOG) throw new Error('AIRCRAFT_CATALOG is not loaded.');
    if (!Array.isArray(window.CALLSIGN_POOL)) throw new Error('CALLSIGN_POOL is not loaded.');

    const isBlue = (team === 'friendly');
    let diff = difficultyKey;
    const doctrine = doctrineKey;

    let diffProfile = window.AI_DIFFICULTIES[diff];
    if (!diffProfile) {
      const match = Object.entries(window.AI_DIFFICULTIES).find(([k, v]) => v.name === diff || k === diff);
      if (match) {
        diff = match[0];
        diffProfile = match[1];
      } else {
        throw new Error(`Invalid difficulty setting "${difficultyKey}" provided to generateFleet.`);
      }
    }

    const seed = (Date.now() ^ ((performance.now() * 1000) | 0) ^ (isBlue ? 0x12345678 : 0x9E3779B9)) >>> 0;
    const rng = window.PRNG.create(seed);

    const maxSquadronSize = window.CONFIG.MAX_SQUADRON_SIZE;
    let targetBudget = diffProfile.budgetCap;
    if (options.budget !== undefined && options.budget !== null) {
      const parsedBudget = Number(options.budget);
      if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
        throw new Error(`Invalid custom fleet budget "${options.budget}" provided to generateFleet.`);
      }
      targetBudget = parsedBudget;
    }

    const catalog = window.AIRCRAFT_CATALOG;
    const callsignPool = isBlue
      ? window.CALLSIGN_POOL
      : ['Bandit', 'Outlaw', 'Razor', 'Havoc', 'Stalker', 'Cobra'];
    const callsigns = rng.shuffle([...callsignPool]);

    const fleetItems = [];
    let spentBudget = 0.0;

    let aceQuota = ((diff === 'CADET' || diff === 'BUFFER') ? 0 : 1);
    if (diff === 'VETERAN') {
      aceQuota = rng.boolean(0.50) ? 1 : 0;
    } else if (diff === 'MASTER') {
      aceQuota = rng.boolean(0.50) ? 2 : 3;
    } else if (typeof diffProfile.aceCount === 'number') {
      aceQuota = Number.isInteger(diffProfile.aceCount)
        ? diffProfile.aceCount
        : (rng.next() < (diffProfile.aceCount - Math.floor(diffProfile.aceCount)) ? Math.ceil(diffProfile.aceCount) : Math.floor(diffProfile.aceCount));
    }

    const aceCandidates = (['CADET', 'BUFFER', 'VETERAN', 'ESCALATED', 'ELITE', 'FORWARD'].includes(diff))
      ? ['Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'F-15EX', 'Su-30SM', 'F-14D', 'Su-57', 'YF-23', 'J-20']
      : ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'DARKSTAR', 'X-40', 'XFA-36B', 'F-22C-COFFIN', 'Su-57', 'YF-23', 'F-22A', 'F-15EX'];

    const rawAceCallsigns = isBlue
      ? ['Alpha Lead', 'Saber Lead', 'Ghost Lead', 'Viper Ace', 'Archangel']
      : ['Yellow 13', 'Pixy', 'Mihaly', 'Gault', 'Strigon', 'Wizard', 'Schwarze', 'Espada'];
    const aceCallsigns = rng.shuffle([...rawAceCallsigns]);
    const shuffledAces = rng.shuffle([...aceCandidates]);

    for (let a = 0; a < aceQuota; a++) {
      if (fleetItems.length >= maxSquadronSize) break;
      const specId = shuffledAces[a % shuffledAces.length];
      const spec = catalog[specId];
      if (!spec) throw new Error(`Ace candidate airframe "${specId}" missing from AIRCRAFT_CATALOG.`);
      const planned = this.planAircraftLoadout(spec, true, doctrine, diff, rng);
      if (spentBudget + planned.totalCost <= targetBudget) {
        fleetItems.push({
          specId,
          isAce: true,
          isLead: (a === 0),
          role: planned.role,
          callsign: aceCallsigns[a % aceCallsigns.length],
          chosenGunId: planned.chosenGunId,
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
        spentBudget += planned.totalCost;
      } else if (fleetItems.length > 0) {
        break;
      }
    }

    const ewChances = {
      CADET: 0.10, BUFFER: 0.20, VETERAN: 0.35, ESCALATED: 0.48, ELITE: 0.60,
      FORWARD: 0.72, ACE: 0.85, FORTIFIED: 0.92, MASTER: 1.0, LEGEND: 1.0
    };
    const ewChance = ewChances[diff];
    if (ewChance === undefined) throw new Error(`Missing EW chance mapping for difficulty "${diff}".`);
    const ewPool = (diff === 'CADET' || diff === 'BUFFER' || diff === 'VETERAN')
      ? ['Tornado-ECR', 'EF-111A']
      : (['MASTER', 'LEGEND', 'FORTIFIED'].includes(diff)
        ? ['EA-18G', 'J-16D', 'EF-111A', 'EA-36']
        : ['EA-18G', 'J-16D', 'EF-111A']);

    if (rng.boolean(ewChance) && fleetItems.length < maxSquadronSize) {
      const specId = rng.pick(ewPool);
      const spec = catalog[specId];
      if (!spec) throw new Error(`EW pool airframe "${specId}" missing from AIRCRAFT_CATALOG.`);
      const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);
      if (spentBudget + planned.totalCost <= targetBudget) {
        fleetItems.push({
          specId,
          isAce: false,
          isLead: false,
          role: planned.role,
          callsign: isBlue ? `Raven ${fleetItems.length + 1}` : `Shadow ${fleetItems.length + 1}`,
          chosenGunId: planned.chosenGunId,
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
        spentBudget += planned.totalCost;
      }
    }

    const flagshipPool = ['ADF-11F', 'CFA-44', 'X-02S', 'ADFX-01', 'DARKSTAR', 'X-40', 'XFA-36B'];
    const highTierPool = [
      'Su-57', 'F-22A', 'YF-23', 'J-20', 'F-15EX', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN',
      'Su-47', 'F-15-SMTD', 'F-35A', 'Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'MiG-31BM', 'Su-30SM',
      'B-1B', 'Su-34'
    ];
    const midTierPool = [
      'F-15EX', 'Eurofighter', 'Rafale-C', 'Su-35S', 'KF-21', 'F-18E', 'F-2A', 'J-16', 'Su-30SM',
      'MiG-31BM', 'JAS-39E', 'Su-34', 'A-10C', 'Su-25SM3', 'S-70', 'Su-75', 'FC-31', 'J-35'
    ];
    const lowTierPool = [
      'F-15EX', 'F-16V', 'Mirage-2000', 'Tejas-MK2', 'MiG-29K', 'X-29A', 'Tornado-ECR', 'A-10C', 'Su-25SM3'
    ];
    const dronePool = ['MQ-99', 'MQ-101', 'XQ-58A', 'Kizilelma', 'MQ-28', 'RQ-180'];

    while (fleetItems.length < maxSquadronSize) {
      const roll = rng.next();
      let candidatePool;

      if (diff === 'CADET') candidatePool = (roll < 0.20) ? highTierPool : ((roll < 0.65) ? midTierPool : lowTierPool);
      else if (diff === 'BUFFER') candidatePool = (roll < 0.32) ? highTierPool : ((roll < 0.74) ? midTierPool : lowTierPool);
      else if (diff === 'VETERAN') candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? midTierPool : ((roll < 0.90) ? flagshipPool : lowTierPool));
      else if (diff === 'ESCALATED') candidatePool = (roll < 0.48) ? highTierPool : ((roll < 0.78) ? midTierPool : ((roll < 0.88) ? flagshipPool : dronePool));
      else if (diff === 'ELITE') candidatePool = (roll < 0.50) ? highTierPool : ((roll < 0.75) ? flagshipPool : ((roll < 0.90) ? midTierPool : dronePool));
      else if (diff === 'FORWARD') candidatePool = (roll < 0.48) ? highTierPool : ((roll < 0.78) ? flagshipPool : ((roll < 0.91) ? midTierPool : dronePool));
      else if (diff === 'ACE') candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? flagshipPool : ((roll < 0.92) ? midTierPool : dronePool));
      else if (diff === 'FORTIFIED') candidatePool = (roll < 0.45) ? flagshipPool : ((roll < 0.82) ? highTierPool : ((roll < 0.92) ? midTierPool : dronePool));
      else if (diff === 'MASTER') candidatePool = (roll < 0.45) ? flagshipPool : ((roll < 0.85) ? highTierPool : ((roll < 0.93) ? midTierPool : dronePool));
      else candidatePool = (roll < 0.55) ? flagshipPool : ((roll < 0.90) ? highTierPool : ((roll < 0.95) ? midTierPool : dronePool));

      const chosenId = rng.pick(candidatePool);
      const spec = catalog[chosenId];
      if (!spec) throw new Error(`Candidate airframe "${chosenId}" missing from AIRCRAFT_CATALOG.`);

      const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);
      if (spentBudget + planned.totalCost <= targetBudget) {
        const hasLead = fleetItems.some(it => it.isLead);
        const isLead = !hasLead;
        fleetItems.push({
          specId: chosenId,
          isAce: false,
          isLead: isLead,
          role: planned.role,
          callsign: isLead ? (isBlue ? 'Flight Lead' : 'Saber Lead') : (callsigns.pop() || `${isBlue ? 'Blue' : 'Bandit'} ${fleetItems.length + 1}`),
          chosenGunId: planned.chosenGunId,
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
        spentBudget += planned.totalCost;
      } else {
        break;
      }
    }

    if (fleetItems.length > 0 && !fleetItems.some(it => it.isLead)) {
      fleetItems[0].isLead = true;
    }

    const spawnPlans = FormationPlanner.calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rng);
    const squadron = [];

    spawnPlans.forEach(plan => {
      const item = plan.item;
      const heading = isBlue ? rng.range(-0.08, 0.08) : (Math.PI + rng.range(-0.08, 0.08));
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + rng.int(0, 17) * 1000);
      const defaultSquadName = isBlue ? (options.squadronName || 'Allied Strike Wing') : (item.isAce ? 'Elite Ace Cadre' : 'Hostile Intercept Wing');
      const midY = theaterHeight / 2.0;
      const spawnY = plan.isLead ? midY : plan.y;

      const unit = new Aircraft(
        item.specId, team, plan.x, spawnY, heading, item.chosenGunId,
        item.callsign, defaultSquadName,
        plan.isLead, plan.isAce, initialAltFt
      );

      unit.tacticalRole = item.role;
      (item.plannedWeapons || []).forEach(w => unit.installWeapon(w.id, w.station));
      (item.plannedUpgrades || []).forEach(u => unit.installUpgrade(u));
      unit.recalculateWeight();
      squadron.push(unit);
    });

    squadron.sort((a, b) => (b.isAce ? 1 : 0) - (a.isAce ? 1 : 0) || (b.isFlightLead ? 1 : 0) - (a.isFlightLead ? 1 : 0));
    return squadron;
  },

  generateHostileFleet(difficultyKey, doctrineKey, theaterWidth, theaterHeight, options = {}) {
    return this.generateFleet('hostile', difficultyKey, doctrineKey, theaterWidth, theaterHeight, options);
  },

  generateDynamicSquadronWave(waveIndex, team, theaterWidth, theaterHeight, difficultyKey) {
    if (typeof FleetWaveGenerator === 'undefined') throw new Error('FleetWaveGenerator is not loaded.');
    return FleetWaveGenerator.generate(waveIndex, team, theaterWidth, theaterHeight, difficultyKey);
  }
};

window.FleetGenerator = FleetGenerator;
