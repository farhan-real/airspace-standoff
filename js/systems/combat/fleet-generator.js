/**
 * AIRSPACE STANDOFF // Fleet Generator (150km x 100km Theater Adaptation)
 * Restored defense budgets, difficulty-tuned squadron sizes, and dynamic Ace loadouts.
 */

const FleetGenerator = {
  generateHostileFleet(difficultyKey, doctrineKey, theaterWidth, theaterHeight) {
    const diff = difficultyKey || 'VETERAN';
    const doctrine = doctrineKey || 'BALANCED';
    const diffProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diff]) || { budgetCap: 260.0, aceCount: 1 };

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ ((Math.random() * 0x7FFFFFFF) | 0)) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const targetBudget = diffProfile.budgetCap || 260.0;
    const basePlanes = diff === 'CADET' ? 5 : (diff === 'VETERAN' ? 8 : (diff === 'ELITE' ? 10 : 12));
    const maxPlanes = Math.max(3, basePlanes + Math.floor(rng() * 2));
    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : 1;

    const catalog = window.AIRCRAFT_CATALOG || {};
    let candidateAirframes = [];

    if (diff === 'CADET') {
      candidateAirframes = ['F-16V', 'JAS-39E', 'Mirage-2000', 'Tejas-MK2', 'MQ-99', 'MiG-29K'];
    } else if (doctrine === 'STANDOFF') {
      candidateAirframes = ['MiG-31BM', 'F-15EX', 'J-16', 'Su-57', 'J-20', 'Eurofighter', 'J-16D', 'EA-18G', 'Kizilelma', 'XQ-58A', 'KF-21'];
    } else if (doctrine === 'AGGRESSIVE') {
      candidateAirframes = ['Su-35S', 'Rafale-C', 'X-02S', 'F-22A', 'Su-57', 'Su-34', 'A-10C', 'MQ-101', 'Su-47', 'ADFX-01', 'Su-30SM'];
    } else {
      candidateAirframes = ['Su-57', 'F-22A', 'F-35A', 'Su-35S', 'Eurofighter', 'Rafale-C', 'F-15EX', 'MiG-31BM', 'KF-21', 'ADF-11F', 'MQ-101', 'CFA-44', 'J-16', 'Su-30SM'];
    }

    const aceCandidates = ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'Su-47', 'Su-37-COFFIN', 'DARKSTAR'];
    const aceCallsigns = [
      '★ Yellow 13 ★', '★ Pixy ★', '★ Mihaly ★', '★ Gault 1 ★', '★ Strigon 1 ★',
      '★ Wizard 1 ★', '★ Schwarze 1 ★', '★ Espada 1 ★', '★ Silber 1 ★', '★ Sorcerer 1 ★'
    ];

    const shuffledAces = [...aceCandidates].sort(() => rng() - 0.5);
    const shuffledAceCallsigns = [...aceCallsigns].sort(() => rng() - 0.5);

    const hostileSquadron = [];
    let spentBudget = 0.0;
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'])].sort(() => rng() - 0.5);

    let acesSpawned = 0;
    for (let a = 0; a < aceQuota; a++) {
      const aceSpecId = shuffledAces[a % shuffledAces.length];
      if (catalog[aceSpecId] && (spentBudget + catalog[aceSpecId].cost <= targetBudget)) {
        const spawnX = (theaterWidth - 10.0) - rng() * 22.0;
        const spawnY = 14.0 + rng() * (theaterHeight - 28.0);
        const heading = Math.PI + (rng() * 0.35 - 0.175);
        const aceCallsign = shuffledAceCallsigns[a % shuffledAceCallsigns.length] || `★ Ace ${a + 1} ★`;
        const aceAltFt = (aceSpecId === 'DARKSTAR') ? 58000 : (32000 + Math.floor(rng() * 12) * 1000);

        const aceUnit = new Aircraft(
          aceSpecId, 'hostile', spawnX, spawnY, heading, null, aceCallsign, 'Elite Ace Cadre', true, true, aceAltFt
        );
        spentBudget += aceUnit.spec.cost;

        const aceLoadoutProfiles = [
          ['AIM-260', 'METEOR', 'AIM-9X-2'],
          ['ADMM', 'AIM-260', 'PYTHON-5'],
          ['R-37M', 'PL-15E', 'R-73'],
          ['PL-21', 'AIM-260', 'IRIS-T']
        ];
        const chosenAceWeapons = aceLoadoutProfiles[Math.floor(rng() * aceLoadoutProfiles.length)];
        chosenAceWeapons.forEach(wId => aceUnit.installWeapon(wId));

        if (aceUnit.upgradeSockets >= 2) aceUnit.installUpgrade('GAN_AESA_CORE');
        if (aceUnit.upgradeSockets >= 3) aceUnit.installUpgrade('ADAPTIVE_ECCM_SUITE');

        hostileSquadron.push(aceUnit);
        acesSpawned++;
      }
    }

    const formationStyle = ['SPREAD_WALL', 'DOUBLE_COLUMN', 'PINCER_BRACKET', 'ECHELON'][Math.floor(rng() * 4)];
    const midY = theaterHeight / 2.0;

    for (let i = acesSpawned; i < maxPlanes; i++) {
      const affordable = candidateAirframes.filter(id => catalog[id] && (spentBudget + catalog[id].cost <= targetBudget - 6.0));
      if (affordable.length === 0) break;

      const chosenId = affordable[Math.floor(rng() * affordable.length)];
      let spawnX = (theaterWidth - 12.0) - rng() * 18.0;
      let spawnY = midY;

      if (formationStyle === 'SPREAD_WALL') {
        const span = theaterHeight - 24.0;
        spawnY = 12.0 + ((i - acesSpawned) / Math.max(1, maxPlanes - acesSpawned - 1)) * span + (rng() * 4.0 - 2.0);
      } else if (formationStyle === 'PINCER_BRACKET') {
        const isUpper = (i % 2 === 0);
        spawnY = isUpper ? (14.0 + rng() * 22.0) : (theaterHeight - 14.0 - rng() * 22.0);
        spawnX -= (rng() * 10.0);
      } else if (formationStyle === 'ECHELON') {
        const step = (i - acesSpawned);
        spawnX -= step * 3.0;
        spawnY = 16.0 + step * (theaterHeight / (maxPlanes + 1)) + (rng() * 3.0 - 1.5);
      } else {
        spawnY = 14.0 + rng() * (theaterHeight - 28.0);
      }

      spawnX = Math.max(theaterWidth / 2.0 + 10.0, Math.min(theaterWidth - 6.0, spawnX));
      spawnY = Math.max(8.0, Math.min(theaterHeight - 8.0, spawnY));

      const randomizedHeading = Math.PI + (rng() * 0.30 - 0.15);
      const hostileAltFt = (chosenId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(rng() * 16) * 1000);

      const isLead = (i === 0 && acesSpawned === 0);
      const chosenCallsign = isLead ? 'Saber Lead' : (callsigns.pop() || (`Bandit ${i + 1}`));

      const ac = new Aircraft(
        chosenId, 'hostile', spawnX, spawnY, randomizedHeading, null, chosenCallsign, 'Hostile Intercept Wing', isLead, false, hostileAltFt
      );

      spentBudget += ac.spec.cost;
      hostileSquadron.push(ac);
    }

    this.equipSquadronMunitions(hostileSquadron.filter(u => !u.isAce), targetBudget, spentBudget, doctrine, diff, rng);
    return hostileSquadron;
  },

  generateDynamicSquadronWave(waveIndex, team, theaterWidth, theaterHeight, difficultyKey) {
    const diff = difficultyKey || 'VETERAN';
    const isBlue = team === 'friendly';
    const count = (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND') ? 4 : 3;
    const squadronNames = isBlue ? ['Alpha Wing', 'Sierra Flight', 'Onyx Flight'] : ['Zulu Flight', 'Havoc Wing', 'Viper Flight'];
    const sqName = squadronNames[Math.min(waveIndex, squadronNames.length - 1)];

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ waveIndex) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const candidatePool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21', 'JAS-39E']
      : ['Su-35S', 'MiG-31BM', 'Su-57', 'ADF-11F', 'MQ-101', 'X-02S', 'J-16'];

    const shuffledPool = [...candidatePool].sort(() => rng() - 0.5);
    const waveCraft = [];

    for (let i = 0; i < count; i++) {
      const specId = shuffledPool[i % shuffledPool.length];
      const spawnX = isBlue ? (8.0 + rng() * 18.0) : (theaterWidth - 8.0 - rng() * 18.0);
      const spawnY = 14.0 + rng() * (theaterHeight - 28.0);
      const baseHeading = isBlue ? (rng() * 0.3 - 0.15) : (Math.PI + (rng() * 0.3 - 0.15));
      const waveAltFt = (specId === 'DARKSTAR') ? 58000 : (24000 + Math.floor(rng() * 12) * 1000);

      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND'));
      const callsign = isAce ? `★ Ace ${sqName} Lead ★` : (isLead ? `${sqName} Lead` : `${sqName} ${i + 1}`);

      const ac = new Aircraft(specId, team, spawnX, spawnY, baseHeading, null, callsign, sqName, isLead, isAce, waveAltFt);

      const wpn1 = isLead ? (rng() < 0.5 ? 'AIM-260' : 'METEOR') : 'AIM-120D';
      const wpn2 = rng() < 0.5 ? 'AIM-9X-2' : 'PYTHON-5';
      ac.installWeapon(wpn1);
      ac.installWeapon(wpn2);
      if (ac.upgradeSockets >= 2) ac.installUpgrade('MADL_BATTLE_LINK');

      waveCraft.push(ac);
    }
    return waveCraft;
  },

  equipSquadronMunitions(squadron, targetBudget, currentSpent, doctrine, diff, rng) {
    const weaponsCatalog = window.WEAPONS_CATALOG || {};
    const upgradesCatalog = window.UPGRADES_CATALOG || {};
    const rand = rng || Math.random;
    const bvrMissiles = ['AIM-120D', 'PL-15E', 'METEOR', 'R-37M', 'AIM-260', 'PL-21'];
    const dogfightMissiles = ['R-73', 'PYTHON-5', 'IRIS-T', 'AIM-9X-2'];

    squadron.forEach(ac => {
      let attempts = 0;
      const allowedUpgrades = diff === 'CADET' ? 0 : (diff === 'VETERAN' ? 1 : 2);

      while (ac.getUsedSlots() < ac.totalSlots && attempts < 12) {
        attempts++;
        const pool = (doctrine === 'STANDOFF')
          ? bvrMissiles
          : (rand() < 0.65 ? dogfightMissiles.concat(bvrMissiles) : bvrMissiles);
        const weaponId = pool[Math.floor(rand() * pool.length)];
        const wpn = weaponsCatalog[weaponId];
        if (wpn && (currentSpent + wpn.cost <= targetBudget)) {
          if (ac.installWeapon(weaponId)) currentSpent += wpn.cost;
        }
      }

      if (allowedUpgrades > 0 && ac.equippedUpgrades.length < allowedUpgrades) {
        const upgPool = Object.keys(upgradesCatalog).sort(() => rand() - 0.5);
        for (const chosenUpg of upgPool) {
          const upg = upgradesCatalog[chosenUpg];
          if (upg && (currentSpent + upg.cost <= targetBudget)) {
            if (ac.installUpgrade(chosenUpg)) {
              currentSpent += upg.cost;
              break;
            }
          }
        }
      }
    });
  }
};

window.FleetGenerator = FleetGenerator;