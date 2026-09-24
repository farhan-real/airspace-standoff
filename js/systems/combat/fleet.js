/**
 * AIRSPACE STANDOFF: Fleet Formation & Dynamic Hostile Fleet Generator (150km x 100km Theater)
 * Enforces proper loadout planning immediately upon selection; rejects over-budget aircraft and finalizes fleet.
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
    const wCatalog = window.WEAPONS_CATALOG || {};
    const uCatalog = window.UPGRADES_CATALOG || {};
    const weapons = [];
    const upgrades = [];
    let totalCost = spec.cost || 20.0;

    const isEW = (spec.category === 'EW' || spec.isEW);
    const isStealth = (spec.internalSlots > 0);
    const isStrike = (spec.category === 'STRIKE');

    const intBvr = ['AIM-120D', 'PL-15E', 'METEOR', 'AIM-260'];
    const intWvr = ['AIM-9X-2', 'R-73', 'IRIS-T'];
    const extBvr = ['R-37M', 'PL-21', 'AIM-260', 'METEOR', 'AIM-120D', 'PL-15E'];
    const extWvr = ['PYTHON-5', 'AIM-9X-2', 'R-73', 'IRIS-T'];

    const addWpn = (wId, station) => {
      const w = wCatalog[wId];
      if (!w) return;
      weapons.push({ id: wId, station });
      totalCost += (w.cost || 0);
    };

    const addUpg = (uId) => {
      const u = uCatalog[uId];
      if (!u) return;
      upgrades.push(uId);
      totalCost += (u.cost || 0);
    };

    if (isEW) {
      addWpn(rng() < 0.5 ? 'AN-ALQ-99' : 'AN-ALQ-249', 'EXTERNAL');
      addWpn('AGM-88G', 'EXTERNAL');
      addWpn('AIM-120D', 'EXTERNAL');
      addUpg('ADAPTIVE_ECCM_SUITE');
      if (spec.upgradeSockets >= 2) addUpg('ESM_PASSIVE_SUITE');
      return { weapons, upgrades, totalCost };
    }

    if (isAce) {
      if (isStealth) {
        addWpn('AIM-260', 'INTERNAL');
        addWpn('METEOR', 'INTERNAL');
        addWpn('AIM-9X-2', 'INTERNAL');
        if (rng() < 0.70 && spec.externalSlots >= 2) addWpn('AIM-260', 'EXTERNAL');
      } else {
        addWpn('R-37M', 'EXTERNAL');
        addWpn('PL-15E', 'EXTERNAL');
        addWpn('R-73', 'EXTERNAL');
        if (spec.externalSlots >= 8) {
          addWpn('PL-15E', 'EXTERNAL');
          addWpn('PYTHON-5', 'EXTERNAL');
        }
      }
      if (spec.upgradeSockets >= 1) addUpg('GAN_AESA_CORE');
      return { weapons, upgrades, totalCost };
    }

    if (isStealth) {
      let intUsed = 0;
      while (intUsed < spec.internalSlots) {
        const rem = spec.internalSlots - intUsed;
        const pick = (rem >= 2) ? intBvr[Math.floor(rng() * intBvr.length)] : intWvr[Math.floor(rng() * intWvr.length)];
        const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
        if (intUsed + slots <= spec.internalSlots) {
          addWpn(pick, 'INTERNAL');
          intUsed += slots;
        } else break;
      }
      if ((rng() < 0.65 || doctrine === 'STANDOFF') && spec.externalSlots > 0) {
        let extUsed = 0;
        while (extUsed < spec.externalSlots) {
          const pool = (doctrine === 'STANDOFF') ? extBvr : (rng() < 0.60 ? extBvr : extWvr);
          const pick = pool[Math.floor(rng() * pool.length)];
          const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
          if (extUsed + slots <= spec.externalSlots) {
            addWpn(pick, 'EXTERNAL');
            extUsed += slots;
          } else break;
        }
      }
      if (diff !== 'CADET' && spec.upgradeSockets >= 1) {
        addUpg(rng() < 0.5 ? 'RAM_NANO_COATING' : 'GAN_AESA_CORE');
      }
      return { weapons, upgrades, totalCost };
    }

    // Heavy missile trucks (F-15EX 14 slots, J-16 12 slots, Su-35S 10 slots) & conventional fighters
    if (isStrike) addWpn(rng() < 0.5 ? 'AGM-158B' : 'GBU-39', 'EXTERNAL');

    let usedSlots = weapons.reduce((s, it) => s + ((wCatalog[it.id] || {}).slots || 1), 0);
    let attempts = 0;
    while (usedSlots < spec.totalSlots && attempts < 16) {
      attempts++;
      const pool = (doctrine === 'STANDOFF') ? extBvr : (rng() < 0.65 ? extBvr : extWvr);
      const pick = pool[Math.floor(rng() * pool.length)];
      const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
      if (usedSlots + slots <= spec.totalSlots) {
        addWpn(pick, 'EXTERNAL');
        usedSlots += slots;
      }
    }

    if (spec.hasCenterline && (doctrine === 'STANDOFF' || spec.id === 'MiG-31BM')) {
      addWpn('KINZHAL', 'CENTERLINE');
    }

    if (diff !== 'CADET' && spec.upgradeSockets >= 1) {
      const pool = ['SUPERCRUISE_VCE', 'THRUST_VECTOR', 'GAN_AESA_CORE'];
      addUpg(pool[Math.floor(rng() * pool.length)]);
    }

    return { weapons, upgrades, totalCost };
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
    const basePlanes = diff === 'CADET' ? 5 : (diff === 'VETERAN' ? 7 : (diff === 'ELITE' ? 9 : 11));
    const maxPlanes = Math.max(3, basePlanes + Math.floor(rng() * 2));
    const aceQuota = diffProfile.aceCount !== undefined ? diffProfile.aceCount : 1;
    const catalog = window.AIRCRAFT_CATALOG || {};
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'])].sort(() => rng() - 0.5);

    const fleetItems = [];
    let spentBudget = 0.0;
    let acesSpawned = 0;

    // 1. ACE PILOTS: Planned immediately and checked against budget
    const aceCandidates = (diff === 'CADET' || diff === 'VETERAN')
      ? ['Su-35S', 'Su-37', 'Eurofighter', 'Rafale-C', 'F-15EX', 'Su-30SM', 'F-14D', 'Su-57', 'YF-23', 'J-20']
      : ['ADF-11F', 'CFA-44', 'ADFX-01', 'X-02S', 'F-22C-COFFIN', 'Su-57', 'Su-47', 'Su-37-COFFIN', 'DARKSTAR', 'F-15-SMT-COFFIN'];

    const aceCallsigns = ['Yellow 13', 'Pixy', 'Mihaly', 'Gault 1', 'Strigon 1', 'Wizard 1', 'Schwarze 1', 'Espada 1'].sort(() => rng() - 0.5);
    const shuffledAces = [...aceCandidates].sort(() => rng() - 0.5);

    for (let a = 0; a < aceQuota; a++) {
      const specId = shuffledAces[a % shuffledAces.length];
      const spec = catalog[specId];
      if (spec) {
        const planned = this.planAircraftLoadout(spec, true, doctrine, diff, rng);
        if (spentBudget + planned.totalCost <= targetBudget) {
          fleetItems.push({
            specId, isAce: true, isLead: (a === 0),
            callsign: aceCallsigns[a % aceCallsigns.length] || `Ace ${a + 1}`,
            plannedWeapons: planned.weapons,
            plannedUpgrades: planned.upgrades
          });
          spentBudget += planned.totalCost;
          acesSpawned++;
        }
      }
    }

    // 2. ELECTRONIC WARFARE (EW) ESCORT: Planned immediately and checked against budget
    const ewChances = { CADET: 0.20, VETERAN: 0.55, ELITE: 0.80, ACE: 1.0, MASTER: 1.0, LEGEND: 1.0 };
    const ewChance = ewChances[diff] !== undefined ? ewChances[diff] : 0.55;
    const ewPool = (diff === 'CADET' || diff === 'VETERAN') ? ['Tornado-ECR', 'EF-111A', 'EA-18G'] : ['EA-18G', 'J-16D', 'EF-111A'];

    if (rng() < ewChance && fleetItems.length < maxPlanes) {
      const specId = ewPool[Math.floor(rng() * ewPool.length)];
      const spec = catalog[specId];
      if (spec) {
        const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);
        if (spentBudget + planned.totalCost <= targetBudget) {
          fleetItems.push({
            specId, isAce: false, isLead: false,
            callsign: `Raven ${fleetItems.length + 1}`,
            plannedWeapons: planned.weapons,
            plannedUpgrades: planned.upgrades
          });
          spentBudget += planned.totalCost;
        }
      }
    }

    // 3. AIR SUPERIORITY & BALANCED SCREEN: Planned immediately
    const airSuperiorityPool = (doctrine === 'STANDOFF')
      ? ['MiG-31BM', 'F-15EX', 'J-16', 'Su-57', 'J-20', 'YF-23', 'F-14D', 'Eurofighter', 'Su-35S']
      : (doctrine === 'AGGRESSIVE')
      ? ['Su-35S', 'Su-37', 'Rafale-C', 'F-22A', 'Su-57', 'Su-30SM', 'Su-47', 'F-15-SMTD']
      : ['Su-57', 'F-22A', 'Su-35S', 'Eurofighter', 'Rafale-C', 'F-15EX', 'J-20', 'Su-30SM', 'MiG-31BM', 'F-14D', 'YF-23', 'F-35A', 'Su-75', 'FC-31', 'J-35', 'Su-37'];

    const multiroleScreenPool = ['JAS-39E', 'Mirage-2000', 'F-16V', 'MiG-29K', 'KF-21', 'Tejas-MK2', 'F-2A', 'F-18E', 'X-29A'];
    const supportPool = (doctrine === 'AGGRESSIVE') ? ['Su-34', 'MQ-101', 'Kizilelma', 'S-70'] : ['XQ-58A', 'MQ-101', 'Su-34', 'Kizilelma', 'MQ-28'];

    while (fleetItems.length < maxPlanes) {
      const roll = rng();
      let candidatePool;
      if (roll < 0.60 || diff === 'CADET') candidatePool = (diff === 'CADET') ? multiroleScreenPool : airSuperiorityPool;
      else if (roll < 0.88) candidatePool = multiroleScreenPool;
      else candidatePool = supportPool;

      const chosenId = candidatePool[Math.floor(rng() * candidatePool.length)];
      const spec = catalog[chosenId];
      if (!spec) continue;

      const planned = this.planAircraftLoadout(spec, false, doctrine, diff, rng);

      if (spentBudget + planned.totalCost <= targetBudget) {
        const isLead = (fleetItems.length === 0 && acesSpawned === 0);
        fleetItems.push({
          specId: chosenId, isAce: false, isLead: isLead,
          callsign: isLead ? 'Saber Lead' : (callsigns.pop() || `Bandit ${fleetItems.length + 1}`),
          plannedWeapons: planned.weapons,
          plannedUpgrades: planned.upgrades
        });
        spentBudget += planned.totalCost;
      } else {
        // Exceeds budget: reject the whole aircraft and finalize fleet
        break;
      }
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
    const count = (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND') ? 4 : 3;
    const pool = isBlue
      ? ['F-15-SMTD', 'Eurofighter', 'Rafale-C', 'F-22A', 'MQ-101', 'KF-21']
      : ['Su-35S', 'MiG-31BM', 'Su-57', 'ADF-11F', 'EA-18G', 'X-02S'];
    const sqName = isBlue ? `Reinforcement Wing ${waveIndex}` : `Hostile Wave ${waveIndex}`;

    const items = [];
    for (let i = 0; i < count; i++) {
      const specId = (i === 1 && !isBlue && (diff === 'ELITE' || diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND'))
        ? 'EA-18G' : pool[i % pool.length];
      const isLead = (i === 0);
      const isAce = (!isBlue && isLead && (diff === 'ACE' || diff === 'MASTER' || diff === 'LEGEND'));
      items.push({
        specId, isLead, isAce,
        callsign: isAce ? `Ace ${sqName}` : `${sqName} ${i + 1}`
      });
    }

    const plans = this.calculateFormationSpawns(items, team, theaterWidth, theaterHeight);
    return plans.map(p => {
      const heading = isBlue ? (Math.random() * 0.16 - 0.08) : (Math.PI + (Math.random() * 0.16 - 0.08));
      const ac = new Aircraft(p.item.specId, team, p.x, p.y, heading, null, p.item.callsign, sqName, p.item.isLead, p.item.isAce, 28000);
      if (ac.spec && ac.spec.category === 'EW') {
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