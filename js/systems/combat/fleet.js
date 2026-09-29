/**
 * AIRSPACE STANDOFF: Fleet Formation & Dynamic Hostile Fleet Generator (150km x 100km Theater)
 * Enforces scaled squadron sizing, difficulty-tiered airframe selection, and formation geometry.
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
    if (typeof FleetLoadoutPlanner !== 'undefined') {
      return FleetLoadoutPlanner.planAircraftLoadout(spec, isAce, doctrine, diff, rng);
    }
    return { weapons: [], upgrades: [], totalCost: spec.cost || 20.0, chosenGunId: spec.builtInGun || 'M61A2', role: 'SWEEP' };
  },

  generateHostileFleet(difficultyKey, doctrineKey, theaterWidth, theaterHeight, options = {}) {
    const diff = difficultyKey || 'VETERAN';
    const doctrine = doctrineKey || 'BALANCED';
    const diffProfile = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diff]) || { budgetCap: 330.0, aceCount: 1 };

    let s = (Date.now() ^ ((performance.now() * 1000) | 0) ^ 0x9E3779B9) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const targetAircraftCounts = { CADET: 3, VETERAN: 4, ELITE: 5, ACE: 6, MASTER: 7, LEGEND: 8 };
    const configuredCount = Number.isFinite(Number(options.aircraftCount)) ? Number(options.aircraftCount) : null;
    const targetBudget = configuredCount !== null ? Number.POSITIVE_INFINITY : (diffProfile.budgetCap || 330.0);
    const basePlanes = targetAircraftCounts[diff] || 5;

    const extraVariance = (diff === 'MASTER' || diff === 'LEGEND') ? 3 : 2;
    const maxPlanes = configuredCount !== null
      ? Math.max(3, Math.min(16, Math.floor(configuredCount)))
      : Math.max(3, basePlanes + Math.floor(rng() * (extraVariance + 1)));

    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : 1;
    const catalog = window.AIRCRAFT_CATALOG || {};
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'])].sort(() => rng() - 0.5);

    const fleetItems = [];
    let spentBudget = 0.0;

    const aceCandidates = (diff === 'CADET' || diff === 'VETERAN')
      ? ['Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'F-15EX', 'Su-30SM', 'F-14D', 'Su-57', 'YF-23', 'J-20']
      : ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'Su-47', 'Su-37-COFFIN', 'DARKSTAR', 'F-15-SMT-COFFIN'];

    const aceCallsigns = ['Yellow 13', 'Pixy', 'Mihaly', 'Gault', 'Strigon', 'Wizard', 'Schwarze', 'Espada'].sort(() => rng() - 0.5);
    const shuffledAces = [...aceCandidates].sort(() => rng() - 0.5);

    for (let a = 0; a < aceQuota; a++) {
      const specId = shuffledAces[a % shuffledAces.length];
      const spec = catalog[specId];
      if (spec) {
        const planned = this.planAircraftLoadout(spec, true, doctrine, diff, rng);
        if (spentBudget + planned.totalCost <= targetBudget) {
          fleetItems.push({
            specId, isAce: true, isLead: (a === 0),
            role: planned.role || (a === 0 ? 'FLAGSHIP' : 'SWEEP'),
            callsign: aceCallsigns[a % aceCallsigns.length] || `Ace ${a + 1}`,
            chosenGunId: planned.chosenGunId,
            plannedWeapons: planned.weapons,
            plannedUpgrades: planned.upgrades
          });
          spentBudget += planned.totalCost;
        }
      }
    }

    const ewChances = { CADET: 0.10, VETERAN: 0.35, ELITE: 0.60, ACE: 0.85, MASTER: 1.0, LEGEND: 1.0 };
    const ewChance = ewChances[diff] !== undefined ? ewChances[diff] : 0.40;
    const ewPool = (diff === 'CADET' || diff === 'VETERAN') ? ['Tornado-ECR', 'EF-111A'] : ['EA-18G', 'J-16D', 'EF-111A'];

    if (rng() < ewChance && fleetItems.length < maxPlanes) {
      const specId = ewPool[Math.floor(rng() * ewPool.length)];
      const spec = catalog[specId];
      if (spec) {
        const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);
        if (spentBudget + planned.totalCost <= targetBudget) {
          fleetItems.push({
            specId, isAce: false, isLead: false,
            role: planned.role || 'SEAD',
            callsign: `Raven ${fleetItems.length + 1}`,
            chosenGunId: planned.chosenGunId,
            plannedWeapons: planned.weapons,
            plannedUpgrades: planned.upgrades
          });
          spentBudget += planned.totalCost;
        }
      }
    }

    const apexPool = ['ADF-11F', 'CFA-44', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'YF-23', 'F-22A', 'J-20', 'DARKSTAR', 'Su-47', 'F-15-SMT-COFFIN', 'F-15EX'];
    const highTierPool = ['Su-57', 'F-22A', 'YF-23', 'J-20', 'F-15EX', 'Eurofighter', 'Rafale-C', 'Su-35S', 'Su-37', 'MiG-31BM', 'F-35A', 'Su-30SM'];
    const midTierPool = ['Eurofighter', 'Rafale-C', 'Su-35S', 'F-15EX', 'KF-21', 'F-18E', 'F-2A', 'J-16', 'Su-30SM', 'MiG-31BM', 'JAS-39E'];
    const lowTierPool = ['F-16V', 'Mirage-2000', 'Tejas-MK2', 'MiG-29K', 'X-29A', 'Tornado-ECR'];

    let screenAttempts = 0;
    let consecutiveRejections = 0;
    while (fleetItems.length < maxPlanes && screenAttempts < maxPlanes * 25) {
      screenAttempts++;
      const remainingBudget = targetBudget - spentBudget;

      if (remainingBudget < 14.0 && fleetItems.length >= basePlanes) {
        break;
      }

      const roll = rng();
      let candidatePool;

      if (remainingBudget < 28.0) {
        candidatePool = lowTierPool;
      } else if (remainingBudget < 45.0) {
        candidatePool = (diff === 'CADET') ? lowTierPool : midTierPool;
      } else {
        if (diff === 'CADET') candidatePool = (roll < 0.75) ? lowTierPool : midTierPool;
        else if (diff === 'VETERAN') candidatePool = (roll < 0.60) ? midTierPool : (roll < 0.85 ? highTierPool : lowTierPool);
        else if (diff === 'ELITE') candidatePool = (roll < 0.65) ? highTierPool : (roll < 0.90 ? apexPool : midTierPool);
        else if (diff === 'ACE') candidatePool = (roll < 0.55) ? apexPool : highTierPool;
        else candidatePool = (roll < 0.70) ? apexPool : highTierPool;
      }

      const chosenId = candidatePool[Math.floor(rng() * candidatePool.length)];
      const spec = catalog[chosenId];
      if (!spec) continue;

      const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);

      if (spentBudget + planned.totalCost <= targetBudget) {
        const hasLead = fleetItems.some(it => it.isLead);
        const isLead = !hasLead;
        fleetItems.push({
          specId: chosenId, isAce: false, isLead: isLead,
          role: planned.role || 'SWEEP',
          callsign: isLead ? 'Saber Lead' : (callsigns.pop() || `Bandit ${fleetItems.length + 1}`),
          chosenGunId: planned.chosenGunId,
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
        spentBudget += planned.totalCost;
        consecutiveRejections = 0;
      } else {
        consecutiveRejections++;
        if (fleetItems.length >= basePlanes && (consecutiveRejections >= 4 || remainingBudget < 20.0)) {
          break;
        }
      }
    }

    if (fleetItems.length > 0 && !fleetItems.some(it => it.isLead)) {
      fleetItems[0].isLead = true;
    }

    const spawnPlans = this.calculateFormationSpawns(fleetItems, 'hostile', theaterWidth, theaterHeight, rng);
    const hostileSquadron = [];

    spawnPlans.forEach(plan => {
      const item = plan.item;
      const heading = Math.PI + (rng() * 0.16 - 0.08);
      const altFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(rng() * 16) * 1000);
      const unit = new Aircraft(
        item.specId, 'hostile', plan.x, plan.y, heading, item.chosenGunId || null,
        item.callsign, item.isAce ? 'Elite Ace Cadre' : 'Hostile Intercept Wing',
        plan.isLead, plan.isAce, altFt
      );

      unit.tacticalRole = item.role || 'SWEEP';

      (item.plannedWeapons || []).forEach(w => unit.installWeapon(w.id, w.station));
      (item.plannedUpgrades || []).forEach(u => unit.installUpgrade(u));
      unit.recalculateWeight();
      hostileSquadron.push(unit);
    });

    return hostileSquadron;
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
    return plans.map(p => {
      const heading = isBlue ? (Math.random() * 0.16 - 0.08) : (Math.PI + (Math.random() * 0.16 - 0.08));
      const ac = new Aircraft(p.item.specId, team, p.x, p.y, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);
      const isEW = Boolean(ac.spec && ac.spec.category === 'EW');
      const isStrike = Boolean(ac.spec && ac.spec.category === 'STRIKE');
      ac.tacticalRole = isEW ? 'SEAD' : (isStrike ? 'STRIKE' : 'SWEEP');

      if (isEW) {
        ac.installWeapon('AN-ALQ-99', 'EXTERNAL');
        ac.installWeapon('AGM-88G', 'EXTERNAL');
        ac.installWeapon('AIM-120D', 'EXTERNAL');
      } else if (ac.internalSlots > 0) {
        ac.installWeapon('AIM-120D', 'INTERNAL');
        ac.installWeapon('AIM-9X-2', 'INTERNAL');
      } else {
        ac.installWeapon('AIM-120D', 'EXTERNAL');
        ac.installWeapon('AIM-9X-2', 'EXTERNAL');
      }
      ac.recalculateWeight();
      return ac;
    });
  }
};

window.FleetGenerator = FleetGenerator;