/**
 * APEX VECTOR // Fleet Generator (150km x 100km Theater Adaptation)
 */

const FleetGenerator = {
  generateHostileFleet(difficultyKey, doctrineKey, theaterWidth, theaterHeight) {
    const diff = difficultyKey || 'VETERAN';
    const doctrine = doctrineKey || 'BALANCED';
    const diffProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diff]) || { budgetCap: 260.0, aceCount: 1 };

    const targetBudget = diffProfile.budgetCap || 260.0;
    const maxPlanes = diff === 'CADET' ? 5 : (diff === 'VETERAN' ? 8 : (diff === 'ELITE' ? 10 : 12));
    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : 1;

    const catalog = window.AIRCRAFT_CATALOG || {};
    let candidateAirframes = [];

    if (diff === 'CADET') {
      candidateAirframes = ['F-16V', 'JAS-39E', 'Mirage-2000', 'Tejas-MK2', 'MQ-99'];
    } else if (doctrine === 'STANDOFF') {
      candidateAirframes = ['MiG-31BM', 'F-15EX', 'J-16', 'Su-57', 'J-20', 'Eurofighter', 'J-16D', 'EA-18G', 'Kizilelma', 'XQ-58A'];
    } else if (doctrine === 'AGGRESSIVE') {
      candidateAirframes = ['Su-35S', 'Rafale-C', 'X-02S', 'F-22A', 'Su-57', 'Su-34', 'A-10C', 'MQ-101', 'Su-47', 'ADFX-01'];
    } else {
      candidateAirframes = ['Su-57', 'F-22A', 'F-35A', 'Su-35S', 'Eurofighter', 'Rafale-C', 'F-15EX', 'MiG-31BM', 'KF-21', 'ADF-11F', 'MQ-101', 'CFA-44'];
    }

    const aceCandidates = ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'Su-47'];
    const aceCallsigns = ['★ Yellow 13 ★', '★ Pixy ★', '★ Mihaly ★', '★ Gault 1 ★', '★ Strigon 1 ★', '★ Wizard 1 ★'];

    const hostileSquadron = [];
    let spentBudget = 0.0;
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'])];

    let acesSpawned = 0;
    for (let a = 0; a < aceQuota; a++) {
      const aceSpecId = aceCandidates[a % aceCandidates.length];
      if (catalog[aceSpecId] && (spentBudget + catalog[aceSpecId].cost <= targetBudget)) {
        const spawnX = (theaterWidth - 12.0) - Math.random() * 15.0;
        const spawnY = 18.0 + (a + 1) * (theaterHeight / (aceQuota + 1.5));
        const heading = Math.PI + (Math.random() * 0.2 - 0.1);
        const aceCallsign = aceCallsigns[a % aceCallsigns.length] || `★ Ace ${a + 1} ★`;

        const aceUnit = new Aircraft(
          aceSpecId, 'hostile', spawnX, spawnY, heading, null, aceCallsign, 'Elite Ace Cadre', true, true
        );
        aceUnit.altFt = 34000 + a * 2000;
        spentBudget += aceUnit.spec.cost;

        aceUnit.installWeapon('AIM-260');
        aceUnit.installWeapon('ADMM');
        aceUnit.installWeapon('AIM-9X-2');
        if (aceUnit.upgradeSockets >= 2) aceUnit.installUpgrade('GAN_AESA_CORE');
        if (aceUnit.upgradeSockets >= 3) aceUnit.installUpgrade('ADAPTIVE_ECCM_SUITE');

        hostileSquadron.push(aceUnit);
        acesSpawned++;
      }
    }

    for (let i = acesSpawned; i < maxPlanes; i++) {
      const affordable = candidateAirframes.filter(id => catalog[id] && (spentBudget + catalog[id].cost <= targetBudget - 10.0));
      if (affordable.length === 0) break;

      const chosenId = affordable[Math.floor(Math.random() * affordable.length)];
      const spawnX = (theaterWidth - 10.0) - Math.random() * 20.0;
      const baseY = 14.0 + (i / Math.max(1, maxPlanes - 1)) * (theaterHeight - 28.0);
      const spawnY = Math.max(10.0, Math.min(theaterHeight - 10.0, baseY + (Math.random() * 6.0 - 3.0)));
      const randomizedHeading = Math.PI + (Math.random() * 0.3 - 0.15);

      const isLead = (i === 0 && acesSpawned === 0);
      const chosenCallsign = isLead ? 'Saber Lead' : (callsigns.pop() || (`Bandit ${i + 1}`));

      const ac = new Aircraft(
        chosenId, 'hostile', spawnX, spawnY, randomizedHeading, null, chosenCallsign, 'Hostile Intercept Wing', isLead, false
      );
      ac.altFt = 24000 + Math.floor(Math.random() * 10) * 1000;

      spentBudget += ac.spec.cost;
      hostileSquadron.push(ac);
    }

    this.equipSquadronMunitions(hostileSquadron.filter(u => !u.isAce), targetBudget, spentBudget, doctrine, diff);
    return hostileSquadron;
  },

  generateDynamicSquadronWave(waveIndex, team, theaterWidth, theaterHeight, difficultyKey) {
    const diff = difficultyKey || 'VETERAN';
    const isBlue = team === 'friendly';
    const count = (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND') ? 4 : 3;
    const squadronNames = isBlue ? ['Alpha Wing', 'Sierra Flight', 'Onyx Flight'] : ['Zulu Flight', 'Havoc Wing', 'Viper Flight'];
    const sqName = squadronNames[Math.min(waveIndex, squadronNames.length - 1)];

    const candidatePool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101']
      : ['Su-35S', 'MiG-31BM', 'Su-57', 'ADF-11F', 'MQ-101', 'X-02S'];

    const waveCraft = [];

    for (let i = 0; i < count; i++) {
      const specId = candidatePool[i % candidatePool.length];
      const spawnX = isBlue ? (10.0 + Math.random() * 15.0) : (theaterWidth - 10.0 - Math.random() * 15.0);
      const spawnY = 16.0 + Math.random() * (theaterHeight - 32.0);
      const baseHeading = isBlue ? (Math.random() * 0.3 - 0.15) : (Math.PI + (Math.random() * 0.3 - 0.15));

      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND'));
      const callsign = isAce ? `★ Ace ${sqName} Lead ★` : (isLead ? `${sqName} Lead` : `${sqName} ${i + 1}`);

      const ac = new Aircraft(specId, team, spawnX, spawnY, baseHeading, null, callsign, sqName, isLead, isAce);
      ac.altFt = 26000 + Math.floor(Math.random() * 8) * 1000;

      ac.installWeapon(isLead ? 'AIM-260' : 'AIM-120D');
      ac.installWeapon('AIM-9X-2');
      if (ac.upgradeSockets >= 2) ac.installUpgrade('MADL_BATTLE_LINK');

      waveCraft.push(ac);
    }
    return waveCraft;
  },

  equipSquadronMunitions(squadron, targetBudget, currentSpent, doctrine, diff) {
    const weaponsCatalog = window.WEAPONS_CATALOG || {};
    const upgradesCatalog = window.UPGRADES_CATALOG || {};
    const bvrMissiles = ['AIM-120D', 'PL-15E', 'METEOR', 'R-37M', 'AIM-260'];
    const dogfightMissiles = ['R-73', 'PYTHON-5', 'IRIS-T', 'AIM-9X-2'];

    squadron.forEach(ac => {
      let attempts = 0;
      const allowedUpgrades = diff === 'CADET' ? 0 : (diff === 'VETERAN' ? 1 : 2);

      while (ac.getUsedSlots() < ac.totalSlots && attempts < 10) {
        attempts++;
        const pool = (doctrine === 'STANDOFF') ? bvrMissiles : dogfightMissiles.concat(bvrMissiles);
        const weaponId = pool[Math.floor(Math.random() * pool.length)];
        const wpn = weaponsCatalog[weaponId];
        if (wpn && (currentSpent + wpn.cost <= targetBudget)) {
          if (ac.installWeapon(weaponId)) currentSpent += wpn.cost;
        }
      }

      if (allowedUpgrades > 0 && ac.equippedUpgrades.length < allowedUpgrades) {
        const upgPool = Object.keys(upgradesCatalog);
        const chosenUpg = upgPool[Math.floor(Math.random() * upgPool.length)];
        const upg = upgradesCatalog[chosenUpg];
        if (upg && (currentSpent + upg.cost <= targetBudget)) {
          ac.installUpgrade(chosenUpg);
        }
      }
    });
  }
};

window.FleetGenerator = FleetGenerator;
