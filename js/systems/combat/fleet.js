/**
 * AIRSPACE STANDOFF // Fleet Formation Generator (150km x 100km Theater)
 */

const FleetGenerator = {
  getFormationRank(spec, isLead, isAce) {
    if (isLead || isAce) return 0;
    if (spec.isDrone || spec.category === 'DRONES') return 4;
    const cheaperOlder = ['Mirage-2000', 'Tejas-MK2', 'F-16V', 'MiG-29K', 'Tornado-ECR', 'X-29A', 'EF-111A'];
    if (cheaperOlder.includes(spec.id) || (spec.cost <= 15.0 && spec.category !== 'STRIKE')) return 3;
    const heavySpecs = ['B-1B', 'Tu-160M', 'B-21', 'B-2A', 'Su-34', 'A-10C', 'Su-25SM3', 'MiG-31BM', 'F-15EX', 'CFA-44', 'DARKSTAR', 'F-15-SMT-COFFIN'];
    if (heavySpecs.includes(spec.id) || spec.category === 'STRIKE' || (spec.M_max >= 8000) || (spec.hp >= 6)) return 1;
    return 2;
  },

  calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rngFn) {
    const rng = rngFn || Math.random;
    const isBlue = (team === 'friendly');
    const total = fleetItems.length;
    if (total === 0) return [];

    const sorted = [...fleetItems].map((item, originalIndex) => {
      const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
      const rank = this.getFormationRank(spec, item.isLead, item.isAce);
      return { item, spec, rank, originalIndex };
    }).sort((a, b) => a.rank - b.rank);

    const midY = theaterHeight / 2.0;
    const totalSpanY = Math.min(theaterHeight - 20.0, Math.max(22.0, (total - 1) * 6.0));
    const startY = midY - (totalSpanY / 2.0);
    const stepY = total > 1 ? (totalSpanY / (total - 1)) : 0;

    const slotOrder = [];
    const middleSlot = Math.floor(total / 2);
    slotOrder.push(middleSlot);
    let l = middleSlot - 1;
    let r = middleSlot + 1;
    while (l >= 0 || r < total) {
      if (l >= 0) slotOrder.push(l--);
      if (r < total) slotOrder.push(r++);
    }

    const baseSpawnX = isBlue
      ? (13.0 + rng() * 2.0)
      : (theaterWidth - 14.0 - rng() * 2.0);

    const plans = new Array(total);
    for (let k = 0; k < total; k++) {
      const slotIndex = slotOrder[k];
      const assigned = sorted[k];
      const nominalY = (total === 1) ? midY : (startY + slotIndex * stepY);
      const randomizedY = Math.max(8.0, Math.min(theaterHeight - 8.0, nominalY + (rng() * 2.6 - 1.3)));
      const tightX = baseSpawnX + (rng() * 2.4 - 1.2);

      plans[assigned.originalIndex] = {
        item: assigned.item,
        spec: assigned.spec,
        x: tightX,
        y: randomizedY,
        isLead: Boolean(assigned.item.isLead),
        isAce: Boolean(assigned.item.isAce)
      };
    }
    return plans;
  },

  generateHostileFleet(difficultyKey, doctrineKey, theaterWidth, theaterHeight) {
    const diff = difficultyKey || 'VETERAN';
    const doctrine = doctrineKey || 'BALANCED';
    const diffProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diff]) || { budgetCap: 260.0, aceCount: 1 };

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ 0x9E3779B9) >>> 0;
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

    const candidateAirframes = (diff === 'CADET')
      ? ['F-16V', 'JAS-39E', 'Mirage-2000', 'Tejas-MK2', 'MQ-99', 'MiG-29K']
      : (doctrine === 'STANDOFF')
      ? ['MiG-31BM', 'F-15EX', 'J-16', 'Su-57', 'J-20', 'Eurofighter', 'J-16D', 'EA-18G', 'Kizilelma', 'XQ-58A', 'KF-21']
      : (doctrine === 'AGGRESSIVE')
      ? ['Su-35S', 'Rafale-C', 'X-02S', 'F-22A', 'Su-57', 'Su-34', 'A-10C', 'MQ-101', 'Su-47', 'ADFX-01', 'Su-30SM']
      : ['Su-57', 'F-22A', 'F-35A', 'Su-35S', 'Eurofighter', 'Rafale-C', 'F-15EX', 'MiG-31BM', 'KF-21', 'ADF-11F', 'MQ-101', 'CFA-44', 'J-16', 'Su-30SM'];

    const aceCandidates = ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'Su-47', 'Su-37-COFFIN', 'DARKSTAR'];
    const aceCallsigns = ['★ Yellow 13 ★', '★ Pixy ★', '★ Mihaly ★', '★ Gault 1 ★', '★ Strigon 1 ★', '★ Wizard 1 ★', '★ Schwarze 1 ★', '★ Espada 1 ★'];
    const shuffledAces = [...aceCandidates].sort(() => rng() - 0.5);
    const shuffledAceCallsigns = [...aceCallsigns].sort(() => rng() - 0.5);

    const fleetItems = [];
    let spentBudget = 0.0;
    let acesSpawned = 0;

    for (let a = 0; a < aceQuota; a++) {
      const aceSpecId = shuffledAces[a % shuffledAces.length];
      if (catalog[aceSpecId] && (spentBudget + catalog[aceSpecId].cost <= targetBudget)) {
        fleetItems.push({
          specId: aceSpecId,
          isAce: true,
          isLead: (a === 0),
          callsign: shuffledAceCallsigns[a % shuffledAceCallsigns.length] || `★ Ace ${a + 1} ★`
        });
        spentBudget += catalog[aceSpecId].cost;
        acesSpawned++;
      }
    }

    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'])].sort(() => rng() - 0.5);
    for (let i = acesSpawned; i < maxPlanes; i++) {
      const affordable = candidateAirframes.filter(id => catalog[id] && (spentBudget + catalog[id].cost <= targetBudget - 5.0));
      if (affordable.length === 0) break;
      const chosenId = affordable[Math.floor(rng() * affordable.length)];
      const isLead = (i === 0 && acesSpawned === 0);
      fleetItems.push({
        specId: chosenId,
        isAce: false,
        isLead: isLead,
        callsign: isLead ? 'Saber Lead' : (callsigns.pop() || `Bandit ${i + 1}`)
      });
      spentBudget += catalog[chosenId].cost;
    }

    const spawnPlans = this.calculateFormationSpawns(fleetItems, 'hostile', theaterWidth, theaterHeight, rng);
    const hostileSquadron = [];

    spawnPlans.forEach(plan => {
      const item = plan.item;
      const heading = Math.PI + (rng() * 0.16 - 0.08);
      const altFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(rng() * 16) * 1000);
      const unit = new Aircraft(
        item.specId, 'hostile', plan.x, plan.y, heading, null,
        item.callsign, item.isAce ? 'Elite Ace Cadre' : 'Hostile Intercept Wing',
        plan.isLead, plan.isAce, altFt
      );

      if (unit.isAce) {
        const admmAllowed = (window.WEAPONS_CATALOG && window.WEAPONS_CATALOG['ADMM'] && window.WEAPONS_CATALOG['ADMM'].allowedAirframes)
          ? window.WEAPONS_CATALOG['ADMM'].allowedAirframes.includes(unit.spec.id)
          : false;
        const aceLoadouts = [
          ['AIM-260', 'METEOR', 'AIM-9X-2'],
          admmAllowed ? ['ADMM', 'AIM-260', 'PYTHON-5'] : ['AIM-260', 'METEOR', 'AIM-9X-2'],
          ['R-37M', 'PL-15E', 'R-73'],
          ['PL-21', 'AIM-260', 'IRIS-T']
        ];
        const chosen = aceLoadouts[Math.floor(rng() * aceLoadouts.length)];
        chosen.forEach(wId => unit.installWeapon(wId));
        if (unit.upgradeSockets >= 2) unit.installUpgrade('GAN_AESA_CORE');
        if (unit.upgradeSockets >= 3) unit.installUpgrade('ADAPTIVE_ECCM_SUITE');
      }
      hostileSquadron.push(unit);
    });

    this.equipSquadronMunitions(hostileSquadron.filter(u => !u.isAce), targetBudget, spentBudget, doctrine, diff, rng);
    return hostileSquadron;
  },

  generateDynamicSquadronWave(waveIndex, team, theaterWidth, theaterHeight, difficultyKey) {
    const diff = difficultyKey || 'VETERAN';
    const isBlue = (team === 'friendly');
    const count = (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND') ? 4 : 3;
    const pool = isBlue ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21'] : ['Su-35S', 'MiG-31BM', 'Su-57', 'ADF-11F', 'MQ-101', 'X-02S'];
    const sqName = isBlue ? `Reinforcement Wing ${waveIndex}` : `Hostile Wave ${waveIndex}`;

    const items = [];
    for (let i = 0; i < count; i++) {
      const specId = pool[i % pool.length];
      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND'));
      items.push({
        specId, isLead, isAce,
        callsign: isAce ? `★ Ace ${sqName} ★` : `${sqName} ${i + 1}`
      });
    }

    const plans = this.calculateFormationSpawns(items, team, theaterWidth, theaterHeight);
    return plans.map(p => {
      const heading = isBlue ? (Math.random() * 0.16 - 0.08) : (Math.PI + (Math.random() * 0.16 - 0.08));
      const ac = new Aircraft(p.item.specId, team, p.x, p.y, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);
      ac.installWeapon('AIM-120D');
      ac.installWeapon('AIM-9X-2');
      return ac;
    });
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
      while (ac.getUsedSlots() < ac.totalSlots && attempts < 10) {
        attempts++;
        const pool = (doctrine === 'STANDOFF') ? bvrMissiles : (rand() < 0.65 ? dogfightMissiles.concat(bvrMissiles) : bvrMissiles);
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
            if (ac.installUpgrade(chosenUpg)) { currentSpent += upg.cost; break; }
          }
        }
      }
    });
  }
};

window.FleetGenerator = FleetGenerator;