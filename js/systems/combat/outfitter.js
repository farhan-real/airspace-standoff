/**
 * AIRSPACE STANDOFF: Fleet Outfitter Submodule
 * Evaluates airframe constraints, weapon classes, contextual aerodynamics, and tactical role planning.
 */

class FleetOutfitter {
  static planAircraftLoadout(spec, isAce, doctrine, diff, rngInstance) {
    const rng = (rngInstance && typeof rngInstance.next === 'function') ? rngInstance : window.PRNG;

    const wCatalog = window.WEAPONS_CATALOG || {};
    const uCatalog = window.UPGRADES_CATALOG || {};
    const weapons = [];
    const upgrades = [];
    let totalCost = spec.cost || 20.0;
    let chosenGunId = spec.builtInGun || 'M61A2';

    const isEW = (spec.category === 'EW' || spec.isEW);
    const isStrike = (spec.category === 'STRIKE');
    const isDrone = (spec.category === 'DRONES' || spec.isDrone);
    const isStealth = (spec.internalSlots > 0 && spec.category === 'STEALTH');
    const isHeavyTruck = ['F-15EX', 'MiG-31BM', 'J-16', 'Su-34', 'A-10C', 'B-1B', 'Tu-160M'].includes(spec.id);
    const isAgileDogfighter = ['Rafale-C', 'Eurofighter', 'Su-35S', 'Mirage-2000', 'F-16V', 'Gripen', 'Tejas-MK2', 'Su-47', 'X-29A', 'Su-37'].includes(spec.id);
    const isHighSpeed = (spec.S_0 >= 1.25 || ['MiG-31BM', 'DARKSTAR', 'F-15EX', 'YF-23', 'F-14D', 'Tu-160M'].includes(spec.id));

    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    const specRatingIndex = ratings.indexOf(spec.maxPylonRating || 'Type M');

    const isEligible = (w) => {
      if (!w) return false;
      if (ratings.indexOf(w.minRating || 'Type S') > specRatingIndex) return false;
      if (w.allowedAirframes && !w.allowedAirframes.includes(spec.id)) return false;
      return true;
    };

    const class1Ulr = ['AIM-260', 'R-37M', 'PL-21', 'KINZHAL'].filter(id => isEligible(wCatalog[id]));
    const class2Lr = ['METEOR', 'PL-15E', 'AGM-88G'].filter(id => isEligible(wCatalog[id]));
    const class3Mr = ['AIM-120D', 'MPBM'].filter(id => isEligible(wCatalog[id]));
    const class4Sr = ['PYTHON-5', 'IRIS-T', 'AIM-9X-2', 'R-73', 'MAM'].filter(id => isEligible(wCatalog[id]));

    const addWpn = (wId, station) => {
      const w = wCatalog[wId];
      if (!w || !isEligible(w)) return false;
      weapons.push({ id: wId, station });
      totalCost += (w.cost || 0);
      return true;
    };

    const addUpg = (uId) => {
      const u = uCatalog[uId];
      if (!u || upgrades.includes(uId)) return;
      if (u.isAllowed && !u.isAllowed(spec)) return;
      upgrades.push(uId);
      totalCost += (u.cost || 0);
    };

    if ((isAce || ['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) && spec.allowedGuns) {
      if (spec.allowedGuns.includes('EML_GUN') && rng.boolean(0.70)) chosenGunId = 'EML_GUN';
      else if (spec.allowedGuns.includes('DE-PULSE') && rng.boolean(0.80)) chosenGunId = 'DE-PULSE';
      else if (spec.allowedGuns.includes('PLSL_HEAVY') && rng.boolean(0.70)) chosenGunId = 'PLSL_HEAVY';
      else if (spec.allowedGuns.includes('PLSL_MED') && rng.boolean(0.65)) chosenGunId = 'PLSL_MED';
      else if (isHeavyTruck && spec.allowedGuns.includes('GPU-5A') && rng.boolean(0.50)) chosenGunId = 'GPU-5A';
    }

    if (isAce) {
      let aceRole = 'SWEEP';
      if (class1Ulr.length > 0 && (doctrine === 'STANDOFF' || rng.boolean(0.45))) {
        aceRole = 'SNIPER';
      } else if (spec.isCoffin || spec.category === 'EXPERIMENTAL') {
        aceRole = 'FLAGSHIP';
      } else if (isHighSpeed && rng.boolean(0.40)) {
        aceRole = 'INTERCEPT';
      } else if (isAgileDogfighter && rng.boolean(0.50)) {
        aceRole = 'DOGFIGHT';
      }

      const ulrChoice = rng.pick(class1Ulr) || (class2Lr[0] || 'METEOR');
      const lrChoice = rng.pick(class2Lr) || 'METEOR';
      const srChoice = ['PYTHON-5', 'IRIS-T'].filter(id => isEligible(wCatalog[id]))[0] || (class4Sr[0] || 'AIM-9X-2');

      if (spec.internalSlots > 0) {
        addWpn(isEligible(wCatalog['AIM-260']) ? 'AIM-260' : ulrChoice, 'INTERNAL');
        addWpn(lrChoice, 'INTERNAL');
        addWpn(srChoice, 'INTERNAL');
        if (spec.externalSlots >= 2) addWpn(ulrChoice, 'EXTERNAL');
      } else {
        addWpn(ulrChoice, 'EXTERNAL');
        addWpn(lrChoice, 'EXTERNAL');
        addWpn(srChoice, 'EXTERNAL');
        if (spec.externalSlots >= 6) addWpn(lrChoice, 'EXTERNAL');
        if (spec.externalSlots >= 8) addWpn(srChoice, 'EXTERNAL');
      }

      const aceSockets = ['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff) ? Math.min(spec.upgradeSockets || 4, 4) : 3;
      const aceUpgPool = ['GAN_AESA_CORE', 'THRUST_VECTOR', 'SUPERCRUISE_VCE', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'COFFIN_OPTICAL_BUS'];
      for (const uId of aceUpgPool) {
        if (upgrades.length >= aceSockets) break;
        addUpg(uId);
      }
      return { weapons, upgrades, totalCost, chosenGunId, role: aceRole };
    }

    let enforceLightweight = false;
    if (isAgileDogfighter && !isHeavyTruck) {
      const lightChances = {
        CADET: 0.0,
        BUFFER: 0.0,
        VETERAN: 0.0,
        ESCALATED: 0.15,
        ELITE: 0.30,
        FORWARD: 0.40,
        ACE: 0.50,
        FORTIFIED: 0.55,
        MASTER: 0.60,
        LEGEND: 0.65
      };
      enforceLightweight = rng.boolean(lightChances[diff] || 0.0);
    }

    let enforceCleanStealth = false;
    if (isStealth && spec.id !== 'J-20') {
      const cleanChances = {
        CADET: 0.0,
        BUFFER: 0.0,
        VETERAN: 0.0,
        ESCALATED: 0.18,
        ELITE: 0.35,
        FORWARD: 0.40,
        ACE: 0.45,
        FORTIFIED: 0.50,
        MASTER: 0.55,
        LEGEND: 0.60
      };
      enforceCleanStealth = rng.boolean(cleanChances[diff] || 0.0);
    }

    let role = 'SWEEP';
    if (isEW) {
      role = 'SEAD';
    } else if (isDrone) {
      role = 'SWARM';
    } else if (isStrike) {
      role = 'STRIKE';
    } else if (isStealth && (enforceCleanStealth || rng.boolean(0.45))) {
      role = 'AMBUSH';
    } else if (isHeavyTruck && class1Ulr.length > 0 && rng.boolean(0.60)) {
      role = 'SNIPER';
    } else if (isHighSpeed && (doctrine === 'AGGRESSIVE' || rng.boolean(0.45))) {
      role = 'INTERCEPT';
    } else if (isAgileDogfighter && (doctrine === 'AGGRESSIVE' || rng.boolean(0.45))) {
      role = 'DOGFIGHT';
    } else if (doctrine === 'STANDOFF' && class1Ulr.length > 0) {
      role = 'SNIPER';
    } else if (rng.boolean(0.22) && !['DARKSTAR', 'B-1B', 'Tu-160M', 'A-10C'].includes(spec.id)) {
      role = 'ESCORT';
    }

    const ulrWeights = {
      CADET: 0.0,
      BUFFER: 0.02,
      VETERAN: 0.05,
      ESCALATED: 0.10,
      ELITE: 0.15,
      FORWARD: 0.25,
      ACE: 0.35,
      FORTIFIED: 0.42,
      MASTER: 0.50,
      LEGEND: 0.65
    };
    const rollBvr = (allowUlr = true) => {
      const ulrRoll = rng.next();
      const ulrThresh = ulrWeights[diff] !== undefined ? ulrWeights[diff] : 0.05;
      if (allowUlr && class1Ulr.length > 0 && (ulrRoll < ulrThresh || role === 'SNIPER' || role === 'AMBUSH')) {
        return rng.pick(class1Ulr);
      }
      if (class2Lr.length > 0 && (rng.boolean(0.65) || ['ESCALATED', 'ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff))) {
        return rng.pick(class2Lr);
      }
      return rng.pick(class3Mr) || 'AIM-120D';
    };

    const rollWvr = () => {
      if (['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) {
        if (class4Sr.includes('PYTHON-5') && rng.boolean(0.45)) return 'PYTHON-5';
        if (class4Sr.includes('IRIS-T') && rng.boolean(0.35)) return 'IRIS-T';
      }
      return rng.pick(class4Sr) || 'AIM-9X-2';
    };

    if (role === 'SEAD') {
      addWpn(rng.boolean(0.60) ? 'AN-ALQ-249' : 'AN-ALQ-99', 'EXTERNAL');
      addWpn('AGM-88G', 'EXTERNAL');
      addWpn(rollBvr(false), 'EXTERNAL');
      addUpg('ADAPTIVE_ECCM_SUITE');
      if (spec.upgradeSockets >= 2) addUpg('ESM_PASSIVE_SUITE');
      if (spec.upgradeSockets >= 3 && ['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) addUpg('GAN_AESA_CORE');
      return { weapons, upgrades, totalCost, chosenGunId, role };
    }

    if (role === 'SWARM') {
      addWpn(isEligible(wCatalog['MAM']) ? 'MAM' : rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (spec.externalSlots >= 2) addWpn(rollWvr(), 'EXTERNAL');
      addUpg('SWARM_AI_COPROCESSOR');
      if (spec.upgradeSockets >= 2) addUpg('SUPERCRUISE_VCE');
      return { weapons, upgrades, totalCost, chosenGunId, role };
    }

    if (role === 'STRIKE') {
      if (spec.hasCenterline && isEligible(wCatalog['KINZHAL']) && (diff === 'LEGEND' || rng.boolean(0.50))) {
        addWpn('KINZHAL', 'CENTERLINE');
      } else if (isEligible(wCatalog['AGM-158B'])) {
        addWpn('AGM-158B', 'EXTERNAL');
      } else {
        addWpn('GBU-39', 'EXTERNAL');
      }
      if (isEligible(wCatalog['AGM-88G']) && rng.boolean(0.60)) addWpn('AGM-88G', 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
    } else if (role === 'SNIPER') {
      const primaryUlr = rng.pick(class1Ulr) || rollBvr(true);
      const secondaryLr = rng.pick(class2Lr) || rollBvr(false);

      if (spec.internalSlots > 0) {
        addWpn(primaryUlr, 'INTERNAL');
        addWpn(secondaryLr, 'INTERNAL');
        if (!enforceCleanStealth && spec.externalSlots >= 2) addWpn(primaryUlr, 'EXTERNAL');
      } else {
        addWpn(primaryUlr, 'EXTERNAL');
        addWpn(secondaryLr, 'EXTERNAL');
        if (spec.externalSlots >= 6 && !enforceLightweight) addWpn(secondaryLr, 'EXTERNAL');
      }
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
    } else if (role === 'AMBUSH') {
      addWpn('AIM-260', 'INTERNAL');
      addWpn(rollWvr(), 'INTERNAL');
      if (spec.internalSlots >= 4) addWpn(rollBvr(false), 'INTERNAL');
      addUpg('RAM_NANO_COATING');
      if (spec.upgradeSockets >= 2) addUpg('EOTS_DUAL_OPTICS');
    } else if (role === 'INTERCEPT') {
      const fastBvr = rollBvr(true);
      addWpn(fastBvr, spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addUpg('SUPERCRUISE_VCE');
      if (spec.upgradeSockets >= 2) addUpg('GAN_AESA_CORE');
    } else if (role === 'DOGFIGHT') {
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (spec.externalSlots >= 4 && !enforceLightweight && rng.boolean(0.40)) {
        const podChoice = spec.category === 'MULTIROLE' ? 'SUU-23A' : 'SPPU-22';
        if (isEligible(wCatalog[podChoice])) addWpn(podChoice, 'EXTERNAL');
      }
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (spec.thrustVector) addUpg('THRUST_VECTOR');
      addUpg('EOTS_DUAL_OPTICS');
    } else if (role === 'ESCORT') {
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (spec.externalSlots >= 4) addWpn(rollBvr(false), 'EXTERNAL');
      addUpg('MADL_BATTLE_LINK');
      if (spec.upgradeSockets >= 2) addUpg('EXPANDED_CM_DISPENSER');
    } else {
      const primaryBvr = rollBvr(['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff));
      const primaryWvr = rollWvr();

      if (spec.internalSlots > 0) {
        addWpn(primaryBvr, 'INTERNAL');
        addWpn(primaryWvr, 'INTERNAL');
        if (!enforceCleanStealth && spec.externalSlots >= 2 && !enforceLightweight) {
          addWpn(rollBvr(false), 'EXTERNAL');
          addWpn(rollWvr(), 'EXTERNAL');
        }
      } else {
        addWpn(primaryBvr, 'EXTERNAL');
        addWpn(primaryWvr, 'EXTERNAL');
        if (spec.externalSlots >= 6 && !enforceLightweight) {
          addWpn(rollBvr(false), 'EXTERNAL');
          if (spec.externalSlots >= 8 && ['ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) {
            addWpn(rollWvr(), 'EXTERNAL');
          }
        }
      }
    }

    const maxSockets = spec.upgradeSockets || 3;
    let targetSockets = 1;
    if (diff === 'CADET') targetSockets = rng.boolean(0.40) ? 0 : 1;
    else if (diff === 'BUFFER') targetSockets = rng.boolean(0.25) ? 0 : 1;
    else if (diff === 'VETERAN' || diff === 'ESCALATED') targetSockets = Math.min(maxSockets, 1 + rng.int(0, 1));
    else if (diff === 'ELITE' || diff === 'FORWARD') targetSockets = Math.min(maxSockets, 2 + rng.int(0, 1));
    else if (diff === 'ACE') targetSockets = Math.min(maxSockets, Math.max(2, maxSockets - 1));
    else targetSockets = maxSockets;

    const upgPool = ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'TITANIUM_COCKPIT'];
    const shuffledUpg = rng.shuffle(upgPool);
    for (const uId of shuffledUpg) {
      if (upgrades.length >= targetSockets) break;
      addUpg(uId);
    }

    return { weapons, upgrades, totalCost, chosenGunId, role };
  }
}

window.FleetOutfitter = FleetOutfitter;