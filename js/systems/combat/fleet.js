/**
 * AIRSPACE STANDOFF: Dynamic Fleet Generator (150km x 100km Theater)
 * Supports friendly and hostile fleet generation with priority ace loading and budget rejection finalization.
 */

const FleetGenerator = {
  getFormationRank(spec, isLead, isAce) {
    return FormationPlanner.getFormationRank(spec, isLead, isAce);
  },

  calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rngFn) {
    return FormationPlanner.calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rngFn);
  },

  planAircraftLoadout(spec, isAce, doctrine, diff, rng) {
    return FleetOutfitter.planAircraftLoadout(spec, isAce, doctrine, diff, rng);
  },

  generateFleet(team, difficultyKey, doctrineKey, theaterWidth, theaterHeight, options = {}) {
    const isBlue = (team === 'friendly');
    const diff = difficultyKey;
    const doctrine = doctrineKey;

    const diffProfile = window.AI_DIFFICULTIES[diff];
    if (!diffProfile) throw new Error(`Unknown difficulty "${diff}" in FleetGenerator.`);

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ (isBlue ? 0x12345678 : 0x9E3779B9)) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const maxSquadronSize = window.CONFIG.MAX_SQUADRON_SIZE;
    const targetBudget = Number.isFinite(Number(options.budget)) && Number(options.budget) > 0
      ? Number(options.budget)
      : diffProfile.budgetCap;

    const catalog = window.AIRCRAFT_CATALOG;
    const callsignPool = isBlue
      ? window.CALLSIGN_POOL
      : ['Bandit', 'Outlaw', 'Razor', 'Havoc', 'Stalker', 'Cobra'];
    const callsigns = [...callsignPool].sort(() => rng() - 0.5);

    const fleetItems = [];
    let spentBudget = 0.0;

    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : (diff === 'CADET' ? 0 : 1);
    const aceCandidates = (diff === 'CADET' || diff === 'VETERAN')
      ? ['Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'F-15EX', 'Su-30SM', 'F-14D', 'Su-57', 'YF-23', 'J-20']
      : ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'DARKSTAR', 'X-40', 'XFA-36B', 'F-22C-COFFIN', 'Su-57', 'YF-23', 'F-22A', 'F-15EX'];

    const aceCallsigns = isBlue
      ? ['Alpha Lead', 'Saber Lead', 'Ghost Lead', 'Viper Ace', 'Archangel'].sort(() => rng() - 0.5)
      : ['Yellow 13', 'Pixy', 'Mihaly', 'Gault', 'Strigon', 'Wizard', 'Schwarze', 'Espada'].sort(() => rng() - 0.5);
    const shuffledAces = [...aceCandidates].sort(() => rng() - 0.5);

    for (let a = 0; a < aceQuota; a++) {
      if (fleetItems.length >= maxSquadronSize) break;
      const specId = shuffledAces[a % shuffledAces.length];
      const spec = catalog[specId];
      if (spec) {
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
    }

    const ewChances = { CADET: 0.10, VETERAN: 0.35, ELITE: 0.60, ACE: 0.85, MASTER: 1.0, LEGEND: 1.0 };
    const ewChance = ewChances[diff];
    const ewPool = (diff === 'CADET' || diff === 'VETERAN')
      ? ['Tornado-ECR', 'EF-111A']
      : (['MASTER', 'LEGEND'].includes(diff)
        ? ['EA-18G', 'J-16D', 'EF-111A', 'EA-36']
        : ['EA-18G', 'J-16D', 'EF-111A']);

    if (rng() < ewChance && fleetItems.length < maxSquadronSize) {
      const specId = ewPool[Math.floor(rng() * ewPool.length)];
      const spec = catalog[specId];
      if (spec) {
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
      const roll = rng();
      let candidatePool;

      if (diff === 'CADET') {
        candidatePool = (roll < 0.20) ? highTierPool : ((roll < 0.65) ? midTierPool : lowTierPool);
      } else if (diff === 'VETERAN') {
        candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? midTierPool : ((roll < 0.90) ? flagshipPool : lowTierPool));
      } else if (diff === 'ELITE') {
        candidatePool = (roll < 0.50) ? highTierPool : ((roll < 0.75) ? flagshipPool : ((roll < 0.90) ? midTierPool : dronePool));
      } else if (diff === 'ACE') {
        candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? flagshipPool : ((roll < 0.92) ? midTierPool : dronePool));
      } else if (diff === 'MASTER') {
        candidatePool = (roll < 0.45) ? flagshipPool : ((roll < 0.85) ? highTierPool : ((roll < 0.93) ? midTierPool : dronePool));
      } else {
        candidatePool = (roll < 0.55) ? flagshipPool : ((roll < 0.90) ? highTierPool : ((roll < 0.95) ? midTierPool : dronePool));
      }

      const chosenId = candidatePool[Math.floor(rng() * candidatePool.length)];
      const spec = catalog[chosenId];
      if (!spec) continue;

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
      const heading = isBlue ? (rng() * 0.16 - 0.08) : (Math.PI + (rng() * 0.16 - 0.08));
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(rng() * 18) * 1000);
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
    const diff = difficultyKey;
    const isBlue = (team === 'friendly');
    const count = (diff === 'MASTER' || diff === 'LEGEND') ? 3 : 2;
    const pool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21', 'XFA-36B']
      : (['ACE', 'MASTER', 'LEGEND'].includes(diff)
        ? ['Su-57', 'ADF-11F', 'CFA-44', 'X-02S', 'F-15EX', 'EA-18G', 'X-40', 'XFA-36B', ...(['MASTER', 'LEGEND'].includes(diff) ? ['EA-36'] : [])]
        : ['Su-35S', 'MiG-31BM', 'Su-30SM', 'Eurofighter', 'EA-18G']);
    const sqName = isBlue ? `Reinforcement Wing ${waveIndex}` : `Hostile Wave ${waveIndex}`;

    const items = [];
    for (let i = 0; i < count; i++) {
      const specId = (i === 1 && !isBlue && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diff))
        ? (['MASTER', 'LEGEND'].includes(diff) && Math.random() < 0.5 ? 'EA-36' : 'EA-18G')
        : pool[i % pool.length];
      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && ['ACE', 'MASTER', 'LEGEND'].includes(diff));
      items.push({
        specId, isLead, isAce,
        callsign: isAce ? `Ace ${sqName}` : `${sqName} ${i + 1}`
      });
    }

    const plans = FormationPlanner.calculateFormationSpawns(items, team, theaterWidth, theaterHeight);
    const midY = theaterHeight / 2.0;
    const waveSquadron = plans.map(p => {
      const heading = isBlue ? (Math.random() * 0.16 - 0.08) : (Math.PI + (Math.random() * 0.16 - 0.08));
      const spawnY = p.item.isLead ? midY : p.y;
      const ac = new Aircraft(p.item.specId, team, p.x, spawnY, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);

      const isEW = Boolean(ac.spec && (ac.spec.category === 'EW' || ac.spec.isEW));
      const isStrike = Boolean(ac.spec && ac.spec.category === 'STRIKE');
      const isDrone = Boolean(ac.spec && (ac.spec.category === 'DRONES' || ac.spec.isDrone));
      const isStealth = Boolean(ac.spec && ac.spec.category === 'STEALTH');
      const isAgile = Boolean(ac.spec && ['Su-35S', 'Rafale-C', 'Eurofighter', 'Su-37', 'Su-47', 'XFA-36B'].includes(ac.spec.id));
      const isHighSpeed = Boolean(ac.spec && (ac.spec.S_0 >= 1.25 || ['MiG-31BM', 'F-15EX', 'DARKSTAR', 'X-40'].includes(ac.spec.id)));

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
        ac.installWeapon('AIM-120D', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      } else if (ac.tacticalRole === 'SWARM') {
        ac.installWeapon('MAM', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      } else if (ac.tacticalRole === 'AMBUSH' && ac.internalSlots > 0) {
        ac.installWeapon('AIM-120D', 'INTERNAL');
        ac.installWeapon('AIM-9X-2', 'INTERNAL');
      } else {
        ac.installWeapon('AIM-120D', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      }
      ac.recalculateWeight();
      return ac;
    });

    waveSquadron.sort((a, b) => (b.isAce ? 1 : 0) - (a.isAce ? 1 : 0) || (b.isFlightLead ? 1 : 0) - (a.isFlightLead ? 1 : 0));
    return waveSquadron;
  }
};

window.FleetGenerator = FleetGenerator;