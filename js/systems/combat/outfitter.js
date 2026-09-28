/**
 * AIRSPACE STANDOFF: Fleet Outfitter Submodule
 * Evaluates airframe constraints, weapon classes, contextual aerodynamics, and role planning.
 */

class FleetOutfitter {
  static planAircraftLoadout(spec, isAce, doctrine, diff, rng) {
    const wCatalog = window.WEAPONS_CATALOG || {};
    const uCatalog = window.UPGRADES_CATALOG || {};
    const gCatalog = window.AUTOCANNONS_CATALOG || {};
    const weapons = [];
    const upgrades = [];
    let totalCost = spec.cost || 20.0;
    let chosenGunId = spec.builtInGun || 'M61A2';

    const isEW = (spec.category === 'EW' || spec.isEW);
    const isStrike = (spec.category === 'STRIKE');
    const isStealth = (spec.internalSlots > 0 && spec.category === 'STEALTH');
    const isHeavyTruck = ['F-15EX', 'MiG-31BM', 'J-16', 'Su-34', 'A-10C', 'B-1B', 'Tu-160M'].includes(spec.id);
    const isAgileDogfighter = ['Rafale-C', 'Eurofighter', 'Su-35S', 'Mirage-2000', 'F-16V', 'Gripen', 'Tejas-MK2'].includes(spec.id);

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

    // Gun & Directed-Energy scaling on high difficulties
    if (['MASTER', 'LEGEND'].includes(diff) && spec.allowedGuns) {
      if (spec.allowedGuns.includes('EML_GUN') && rng() < 0.65) chosenGunId = 'EML_GUN';
      else if (spec.allowedGuns.includes('DE-PULSE') && rng() < 0.75) chosenGunId = 'DE-PULSE';
      else if (spec.allowedGuns.includes('PLSL_HEAVY') && rng() < 0.70) chosenGunId = 'PLSL_HEAVY';
      else if (spec.allowedGuns.includes('PLSL_MED') && rng() < 0.65) chosenGunId = 'PLSL_MED';
      else if (isHeavyTruck && spec.allowedGuns.includes('GPU-5A') && rng() < 0.50) chosenGunId = 'GPU-5A';
    }

    // Contextual Aerodynamic Policies: Weight Discipline & Clean Stealth Bays
    let enforceLightweight = false;
    if (isAgileDogfighter && !isHeavyTruck) {
      const lightChances = { CADET: 0.0, VETERAN: 0.0, ELITE: 0.30, ACE: 0.50, MASTER: 0.60, LEGEND: 0.65 };
      enforceLightweight = (rng() < (lightChances[diff] || 0.0));
    }

    let enforceCleanStealth = false;
    if (isStealth && spec.id !== 'J-20') {
      const cleanChances = { CADET: 0.0, VETERAN: 0.0, ELITE: 0.35, ACE: 0.45, MASTER: 0.55, LEGEND: 0.60 };
      enforceCleanStealth = (rng() < (cleanChances[diff] || 0.0));
    }

    // Role Assignment
    let role = 'SWEEP';
    if (isEW) role = 'SEAD';
    else if (isStrike) role = 'STRIKE';
    else if (enforceCleanStealth && class1Ulr.includes('AIM-260')) role = 'AMBUSH';
    else if ((isAce || ['MASTER', 'LEGEND'].includes(diff)) && class1Ulr.length > 0 && rng() < 0.45) role = 'SNIPER';
    else if (doctrine === 'STANDOFF' && class1Ulr.length > 0) role = 'SNIPER';

    const ulrWeights = { CADET: 0.0, VETERAN: 0.05, ELITE: 0.15, ACE: 0.35, MASTER: 0.50, LEGEND: 0.65 };
    const rollBvr = (allowUlr = true) => {
      const ulrRoll = rng();
      const ulrThresh = ulrWeights[diff] || 0.0;
      if (allowUlr && class1Ulr.length > 0 && (ulrRoll < ulrThresh || role === 'SNIPER' || role === 'AMBUSH')) {
        return class1Ulr[Math.floor(rng() * class1Ulr.length)];
      }
      if (class2Lr.length > 0 && (rng() < 0.65 || ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diff))) {
        return class2Lr[Math.floor(rng() * class2Lr.length)];
      }
      return class3Mr[Math.floor(rng() * class3Mr.length)] || 'AIM-120D';
    };

    const rollWvr = () => {
      if (['ACE', 'MASTER', 'LEGEND'].includes(diff)) {
        if (class4Sr.includes('PYTHON-5') && rng() < 0.45) return 'PYTHON-5';
        if (class4Sr.includes('IRIS-T') && rng() < 0.35) return 'IRIS-T';
      }
      return class4Sr[Math.floor(rng() * class4Sr.length)] || 'AIM-9X-2';
    };

    // Role-Based Weapons Allocation
    if (role === 'SEAD') {
      addWpn(rng() < 0.60 ? 'AN-ALQ-249' : 'AN-ALQ-99', 'EXTERNAL');
      addWpn('AGM-88G', 'EXTERNAL');
      addWpn(rollBvr(false), 'EXTERNAL');
      addUpg('ADAPTIVE_ECCM_SUITE');
      if (spec.upgradeSockets >= 2) addUpg('ESM_PASSIVE_SUITE');
      if (spec.upgradeSockets >= 3 && ['ACE', 'MASTER', 'LEGEND'].includes(diff)) addUpg('GAN_AESA_CORE');
      return { weapons, upgrades, totalCost, chosenGunId };
    }

    if (role === 'STRIKE') {
      if (spec.hasCenterline && isEligible(wCatalog['KINZHAL']) && (diff === 'LEGEND' || rng() < 0.50)) {
        addWpn('KINZHAL', 'CENTERLINE');
      } else if (isEligible(wCatalog['AGM-158B'])) {
        addWpn('AGM-158B', 'EXTERNAL');
      } else {
        addWpn('GBU-39', 'EXTERNAL');
      }
      if (isEligible(wCatalog['AGM-88G']) && rng() < 0.60) addWpn('AGM-88G', 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
    } else if (role === 'SNIPER') {
      const primaryUlr = class1Ulr[Math.floor(rng() * class1Ulr.length)] || rollBvr(true);
      const secondaryLr = class2Lr[Math.floor(rng() * class2Lr.length)] || rollBvr(false);

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
    } else {
      // SWEEP Role (Balanced BVR + WVR, optionally Mixed-Seeker)
      const primaryBvr = rollBvr(isAce || ['MASTER', 'LEGEND'].includes(diff));
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
          if (spec.externalSlots >= 8 && ['ELITE', 'ACE', 'MASTER', 'LEGEND'].includes(diff)) {
            addWpn(rollWvr(), 'EXTERNAL');
          }
        }
      }
    }

    // Upgrade Sockets Allocation
    const maxSockets = spec.upgradeSockets || 3;
    let targetSockets = 1;
    if (diff === 'CADET') targetSockets = rng() < 0.40 ? 0 : 1;
    else if (diff === 'VETERAN') targetSockets = Math.min(maxSockets, 1 + Math.floor(rng() * 2));
    else if (diff === 'ELITE') targetSockets = Math.min(maxSockets, 2 + Math.floor(rng() * 2));
    else if (diff === 'ACE') targetSockets = Math.min(maxSockets, Math.max(2, maxSockets - 1));
    else targetSockets = maxSockets;

    const upgPool = ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'TITANIUM_COCKPIT'];
    const shuffledUpg = [...upgPool].sort(() => rng() - 0.5);
    for (const uId of shuffledUpg) {
      if (upgrades.length >= targetSockets) break;
      addUpg(uId);
    }

    return { weapons, upgrades, totalCost, chosenGunId };
  }
}

window.FleetOutfitter = FleetOutfitter;
window.FleetLoadoutPlanner = FleetOutfitter;