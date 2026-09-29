/**
 * AIRSPACE STANDOFF: Fleet Formation & Dynamic Fleet Generator (150km x 100km Theater)
 * Supports friendly and hostile fleet generation with priority ace loading and budget rejection finalization.
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

    const baseSpawnX = isBlue ? (13.0 + rng() * 2.0) : (theaterWidth - 14.0 - rng() * 2.0);
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

  planAircraftLoadout(spec, isAce, doctrine, diff, rng) {
    if (typeof FleetOutfitter !== 'undefined') {
      return FleetOutfitter.planAircraftLoadout(spec, isAce, doctrine, diff, rng);
    }
    return { weapons: [], upgrades: [], totalCost: spec.cost || 20.0, chosenGunId: spec.builtInGun || 'M61A2', role: 'SWEEP' };
  },

  generateFleet(team, difficultyKey, doctrineKey, theaterWidth, theaterHeight, options = {}) {
    const isBlue = (team === 'friendly');
    const diff = difficultyKey || 'VETERAN';
    const doctrine = doctrineKey || 'BALANCED';
    const diffProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diff]) || { budgetCap: 330.0, aceCount: 1 };

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ (isBlue ? 0x12345678 : 0x9E3779B9)) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const maxSquadronSize = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    const targetBudget = Number.isFinite(Number(options.budget)) && Number(options.budget) > 0
      ? Number(options.budget)
      : (diffProfile.budgetCap || 330.0);

    const catalog = window.AIRCRAFT_CATALOG || {};
    const callsignPool = isBlue
      ? (window.CALLSIGN_POOL || ['Trigger', 'Mobius', 'Cipher', 'Viper', 'Ghost'])
      : ['Bandit', 'Outlaw', 'Razor', 'Havoc', 'Stalker', 'Cobra'];
    const callsigns = [...callsignPool].sort(() => rng() - 0.5);

    const fleetItems = [];
    let spentBudget = 0.0;

    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : (diff === 'CADET' ? 0 : 1);
    const aceCandidates = (diff === 'CADET' || diff === 'VETERAN')
      ? ['Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'F-15EX', 'Su-30SM', 'F-14D', 'Su-57', 'YF-23', 'J-20']
      : ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'DARKSTAR', 'F-22C-COFFIN', 'Su-57', 'YF-23', 'F-22A', 'F-15EX'];

    const aceCallsigns = isBlue
      ? ['Apex Lead', 'Saber Lead', 'Ghost Lead', 'Viper Ace', 'Archangel'].sort(() => rng() - 0.5)
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
            role: planned.role || (a === 0 ? 'FLAGSHIP' : 'SWEEP'),
            callsign: aceCallsigns[a % aceCallsigns.length] || `Ace ${a + 1}`,
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
    const ewChance = ewChances[diff] !== undefined ? ewChances[diff] : 0.40;
    const ewPool = (diff === 'CADET' || diff === 'VETERAN') ? ['Tornado-ECR', 'EF-111A'] : ['EA-18G', 'J-16D', 'EF-111A'];

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
            role: planned.role || 'SEAD',
            callsign: isBlue ? `Raven ${fleetItems.length + 1}` : `Shadow ${fleetItems.length + 1}`,
            chosenGunId: planned.chosenGunId,
            plannedWeapons: planned.weapons,
            plannedUpgrades: planned.upgrades
          });
          spentBudget += planned.totalCost;
        }
      }
    }

    const apexPool = ['ADF-11F', 'CFA-44', 'X-02S', 'ADFX-01', 'DARKSTAR'];
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
        candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? midTierPool : ((roll < 0.90) ? apexPool : lowTierPool));
      } else if (diff === 'ELITE') {
        candidatePool = (roll < 0.50) ? highTierPool : ((roll < 0.75) ? apexPool : ((roll < 0.90) ? midTierPool : dronePool));
      } else if (diff === 'ACE') {
        candidatePool = (roll < 0.45) ? highTierPool : ((roll < 0.80) ? apexPool : ((roll < 0.92) ? midTierPool : dronePool));
      } else if (diff === 'MASTER') {
        candidatePool = (roll < 0.45) ? apexPool : ((roll < 0.85) ? highTierPool : ((roll < 0.93) ? midTierPool : dronePool));
      } else {
        candidatePool = (roll < 0.55) ? apexPool : ((roll < 0.90) ? highTierPool : ((roll < 0.95) ? midTierPool : dronePool));
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
          role: planned.role || 'SWEEP',
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

    if (fleetItems.length === 0) {
      const fallbackId = lowTierPool[0] || 'F-15EX';
      const spec = catalog[fallbackId];
      if (spec) {
        const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);
        fleetItems.push({
          specId: fallbackId,
          isAce: false,
          isLead: true,
          role: 'SWEEP',
          callsign: isBlue ? 'Flight Lead' : 'Saber Lead',
          chosenGunId: planned.chosenGunId,
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
      }
    }

    if (fleetItems.length > 0 && !fleetItems.some(it => it.isLead)) {
      fleetItems[0].isLead = true;
    }

    const spawnPlans = this.calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rng);
    const squadron = [];

    spawnPlans.forEach(plan => {
      const item = plan.item;
      const heading = isBlue ? (rng() * 0.16 - 0.08) : (Math.PI + (rng() * 0.16 - 0.08));
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(rng() * 18) * 1000);
      const defaultSquadName = isBlue ? (options.squadronName || 'Allied Strike Wing') : (item.isAce ? 'Elite Ace Cadre' : 'Hostile Intercept Wing');
      const midY = theaterHeight / 2.0;
      const spawnY = plan.isLead ? midY : plan.y;

      const unit = new Aircraft(
        item.specId, team, plan.x, spawnY, heading, item.chosenGunId || null,
        item.callsign, defaultSquadName,
        plan.isLead, plan.isAce, initialAltFt
      );

      unit.tacticalRole = item.role || 'SWEEP';

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
    const diff = difficultyKey || 'VETERAN';
    const isBlue = (team === 'friendly');
    const count = (diff === 'MASTER' || diff === 'LEGEND') ? 3 : 2;
    const pool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21']
      : (['ACE', 'MASTER', 'LEGEND'].includes(diff)
        ? ['Su-57', 'ADF-11F', 'CFA-44', 'X-02S', 'F-15EX', 'EA-18G']
        : ['Su-35S', 'MiG-31BM', 'Su-30SM', 'Eurofighter', 'EA-18G']);
    const sqName = isBlue ? `Reinforcement Wing ${waveIndex}` : `Hostile Wave ${waveIndex}`;

    const items = [];
    for (let i = 0; i < count; i++) {
      const specId = (i === 1 && !isBlue && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diff))
        ? 'EA-18G' : pool[i % pool.length];
      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && ['ACE', 'MASTER', 'LEGEND'].includes(diff));
      items.push({
        specId, isLead, isAce,
        callsign: isAce ? `Ace ${sqName}` : `${sqName} ${i + 1}`
      });
    }

    const plans = this.calculateFormationSpawns(items, team, theaterWidth, theaterHeight);
    const midY = theaterHeight / 2.0;
    const waveSquadron = plans.map(p => {
      const heading = isBlue ? (Math.random() * 0.16 - 0.08) : (Math.PI + (Math.random() * 0.16 - 0.08));
      const spawnY = p.item.isLead ? midY : p.y;
      const ac = new Aircraft(p.item.specId, team, p.x, spawnY, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);

      const isEW = Boolean(ac.spec && (ac.spec.category === 'EW' || ac.spec.isEW));
      const isStrike = Boolean(ac.spec && ac.spec.category === 'STRIKE');
      const isDrone = Boolean(ac.spec && (ac.spec.category === 'DRONES' || ac.spec.isDrone));
      const isStealth = Boolean(ac.spec && ac.spec.category === 'STEALTH');
      const isAgile = Boolean(ac.spec && ['Su-35S', 'Rafale-C', 'Eurofighter', 'Su-37', 'Su-47'].includes(ac.spec.id));
      const isHighSpeed = Boolean(ac.spec && (ac.spec.S_0 >= 1.25 || ['MiG-31BM', 'F-15EX', 'DARKSTAR'].includes(ac.spec.id)));

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