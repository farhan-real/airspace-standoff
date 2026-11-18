/**
 * AIRSPACE STANDOFF: Tactical AI Loadout Planner
 * Matches airframe pylon ratings, weapon range classes, and active AIR_DOCTRINES preferences.
 */

class FleetOutfitter {
  static planAircraftLoadout(spec, isAce, doctrine, diff, rngInstance) {
    if (!spec) throw new Error('FleetOutfitter.planAircraftLoadout requires a valid aircraft spec.');
    if (!window.WEAPONS_CATALOG || !window.UPGRADES_CATALOG) throw new Error('Weapon and upgrade catalogs are not loaded.');
    if (!window.AI_DIFFICULTIES || !window.AI_DIFFICULTIES[diff]) throw new Error(`Invalid difficulty "${diff}" in FleetOutfitter.`);
    if (!window.AIR_DOCTRINES || !window.AIR_DOCTRINES[doctrine]) throw new Error(`Invalid air doctrine "${doctrine}" in FleetOutfitter.`);
    const rng = rngInstance || window.PRNG;
    if (!rng || typeof rng.next !== 'function') throw new Error('FleetOutfitter requires a valid PRNG instance.');

    const docProfile = window.AIR_DOCTRINES[doctrine];
    const wCatalog = window.WEAPONS_CATALOG, uCatalog = window.UPGRADES_CATALOG;
    const weapons = [], upgrades = [];
    let totalCost = spec.cost, chosenGunId = spec.builtInGun;
    if (typeof totalCost !== 'number' || !chosenGunId) throw new Error(`Airframe "${spec.id}" missing cost or builtInGun.`);

    const isEW = (spec.category === 'EW' || spec.isEW), isStrike = (spec.category === 'STRIKE');
    const isDrone = (spec.category === 'DRONES' || spec.isDrone), isStealth = (spec.internalSlots > 0 && spec.category === 'STEALTH');
    const isHeavyTruck = ['F-15EX', 'F-15E', 'MiG-31BM', 'J-16', 'Su-34', 'A-10C', 'B-1B', 'B-52H', 'Tu-160M', 'F-111F'].includes(spec.id);
    const isAgileDogfighter = ['Rafale-C', 'Eurofighter', 'Su-35S', 'Mirage-2000', 'Mirage-2000D', 'F-16V', 'JAS-39E', 'Tejas-MK2', 'Su-47', 'X-29A', 'Su-37'].includes(spec.id);
    const isHighSpeed = (spec.S_0 >= 1.25 || ['MiG-31BM', 'DARKSTAR', 'F-15EX', 'F-15E', 'YF-23', 'F-14D', 'Tu-160M'].includes(spec.id));

    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    const specRatingIndex = ratings.indexOf(spec.maxPylonRating);
    if (specRatingIndex === -1) throw new Error(`Invalid maxPylonRating "${spec.maxPylonRating}" on "${spec.id}".`);

    const isEligible = (w) => Boolean(w && ratings.indexOf(w.minRating) <= specRatingIndex && (!w.allowedAirframes || w.allowedAirframes.includes(spec.id)));
    const class1Ulr = ['AIM-260', 'ASTRA-MK3', 'R-37M', 'PL-21', 'PL-17', 'AIM-174B', 'KS-172', 'AIM-152', 'KINZHAL'].filter(id => isEligible(wCatalog[id]));
    const class2Lr = ['METEOR', 'PL-15E', 'ASTRA-MK2', 'R-77M', 'AAM-4B', 'AGM-88G'].filter(id => isEligible(wCatalog[id]));
    const class3Mr = ['AIM-120D', 'R-77-1', 'MICA-EM', 'ASTRA-MK1', 'I-DERBY-ER', 'MPBM'].filter(id => isEligible(wCatalog[id]));
    const class4Sr = ['PYTHON-5', 'IRIS-T', 'AIM-9X-2', 'R-73', 'ASRAAM', 'MICA-IR', 'PL-10', 'AAM-5B', 'R-74M2', 'MAM', 'PEREGRINE'].filter(id => isEligible(wCatalog[id]));

    const addWpn = (wId, station) => {
      const w = wCatalog[wId];
      if (!w || !isEligible(w)) return false;
      weapons.push({ id: wId, station });
      totalCost += w.cost;
      return true;
    };
    const addUpg = (uId) => {
      const u = uCatalog[uId];
      if (!u || upgrades.includes(uId) || (u.isAllowed && !u.isAllowed(spec))) return;
      upgrades.push(uId);
      totalCost += u.cost;
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
      if (class1Ulr.length > 0 && (docProfile.preferWeapons === 'STANDOFF' || rng.boolean(0.45))) aceRole = 'SNIPER';
      else if (spec.isCoffin || spec.category === 'EXPERIMENTAL') aceRole = 'FLAGSHIP';
      else if (isHighSpeed && (docProfile.preferWeapons === 'AGGRESSIVE' || rng.boolean(0.40))) aceRole = 'INTERCEPT';
      else if (isAgileDogfighter && rng.boolean(0.50)) aceRole = 'DOGFIGHT';

      const ulrChoice = rng.pick(class1Ulr) || class2Lr[0];
      const lrChoice = rng.pick(class2Lr);
      const srChoice = ['PYTHON-5', 'IRIS-T', 'ASRAAM', 'PL-10'].filter(id => isEligible(wCatalog[id]))[0] || class4Sr[0];

      if (spec.internalSlots > 0) {
        addWpn(isEligible(wCatalog['AIM-260']) ? 'AIM-260' : ulrChoice, 'INTERNAL');
        addWpn(lrChoice, 'INTERNAL');
        addWpn(srChoice, 'INTERNAL');
        if (spec.externalSlots >= 2 && docProfile.preferWeapons !== 'INTERNAL_STEALTH') addWpn(ulrChoice, 'EXTERNAL');
      } else {
        addWpn(ulrChoice, 'EXTERNAL'); addWpn(lrChoice, 'EXTERNAL'); addWpn(srChoice, 'EXTERNAL');
        if (spec.externalSlots >= 6) addWpn(lrChoice, 'EXTERNAL');
        if (spec.externalSlots >= 8) addWpn(srChoice, 'EXTERNAL');
      }

      const aceSockets = ['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff) ? Math.min(spec.upgradeSockets, 4) : 3;
      const aceUpgPool = ['GAN_AESA_CORE', 'THRUST_VECTOR', 'SUPERCRUISE_VCE', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'COFFIN_OPTICAL_BUS'];
      for (const uId of aceUpgPool) { if (upgrades.length >= aceSockets) break; addUpg(uId); }
      return { weapons, upgrades, totalCost, chosenGunId, role: aceRole };
    }

    let enforceLightweight = false;
    if (isAgileDogfighter && !isHeavyTruck) {
      const lightChances = { CADET: 0.0, BUFFER: 0.0, VETERAN: 0.0, ESCALATED: 0.15, ELITE: 0.30, FORWARD: 0.40, ACE: 0.50, FORTIFIED: 0.55, MASTER: 0.60, LEGEND: 0.65 };
      enforceLightweight = rng.boolean(lightChances[diff]);
    }

    let enforceCleanStealth = false;
    if (isStealth && spec.id !== 'J-20') {
      const cleanChances = { CADET: 0.0, BUFFER: 0.0, VETERAN: 0.0, ESCALATED: 0.18, ELITE: 0.35, FORWARD: 0.40, ACE: 0.45, FORTIFIED: 0.50, MASTER: 0.55, LEGEND: 0.60 };
      const cleanBoost = (docProfile.preferWeapons === 'INTERNAL_STEALTH') ? 0.35 : 0.0;
      enforceCleanStealth = rng.boolean(Math.min(0.95, cleanChances[diff] + cleanBoost));
    }

    let role = 'SWEEP';
    if (isEW) role = 'SEAD';
    else if (isDrone) role = 'SWARM';
    else if (isStrike) role = 'STRIKE';
    else if (isStealth && (enforceCleanStealth || docProfile.preferWeapons === 'INTERNAL_STEALTH' || rng.boolean(0.45))) role = 'AMBUSH';
    else if (isHeavyTruck && class1Ulr.length > 0 && (docProfile.preferWeapons === 'STANDOFF' || rng.boolean(0.60))) role = 'SNIPER';
    else if (isHighSpeed && (docProfile.preferWeapons === 'AGGRESSIVE' || rng.boolean(0.45))) role = 'INTERCEPT';
    else if (isAgileDogfighter && (docProfile.preferWeapons === 'AGGRESSIVE' || rng.boolean(0.45))) role = 'DOGFIGHT';
    else if (docProfile.preferWeapons === 'STANDOFF' && class1Ulr.length > 0) role = 'SNIPER';
    else if ((docProfile.preferWeapons === 'DEFENSIVE' || rng.boolean(0.22)) && !['DARKSTAR', 'B-1B', 'B-52H', 'Tu-160M', 'A-10C'].includes(spec.id)) role = 'ESCORT';

    const ulrWeights = { CADET: 0.0, BUFFER: 0.02, VETERAN: 0.05, ESCALATED: 0.10, ELITE: 0.15, FORWARD: 0.25, ACE: 0.35, FORTIFIED: 0.42, MASTER: 0.50, LEGEND: 0.65 };
    const docUlrMod = docProfile.preferWeapons === 'STANDOFF' ? 0.25 : (docProfile.preferWeapons === 'AGGRESSIVE' ? -0.10 : 0.0);
    const rollBvr = (allowUlr = true) => {
      if (allowUlr && class1Ulr.length > 0 && (rng.next() < (ulrWeights[diff] + docUlrMod) || role === 'SNIPER' || role === 'AMBUSH')) return rng.pick(class1Ulr);
      if (class2Lr.length > 0 && (rng.boolean(0.65) || ['ESCALATED', 'ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff))) return rng.pick(class2Lr);
      return rng.pick(class3Mr) || rng.pick(class4Sr);
    };
    const rollWvr = () => {
      if (docProfile.preferWeapons === 'INTERNAL_STEALTH' && isEligible(wCatalog['MICA-IR'])) return 'MICA-IR';
      if (['ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff) || docProfile.preferWeapons === 'AGGRESSIVE') {
        const highWvr = ['PYTHON-5', 'IRIS-T', 'ASRAAM', 'PL-10', 'AAM-5B'].filter(id => isEligible(wCatalog[id]));
        if (highWvr.length > 0 && rng.boolean(0.60)) return rng.pick(highWvr);
      }
      return rng.pick(class4Sr);
    };

    if (role === 'SEAD') {
      const jamChoices = ['AN-ALQ-249', 'SAP-14-POD', 'AN-ALQ-99', 'KHIBINY-L175', 'AN-ALQ-131'].filter(id => isEligible(wCatalog[id]));
      addWpn((docProfile.preferWeapons === 'EW_SEAD' && jamChoices[0]) ? jamChoices[0] : (rng.pick(jamChoices) || 'AN-ALQ-99'), 'EXTERNAL');
      addWpn(rng.boolean(0.65) ? 'AGM-88G' : 'AGM-88E', 'EXTERNAL');
      addWpn(rollBvr(false), 'EXTERNAL');
      addUpg('ADAPTIVE_ECCM_SUITE');
      if (spec.upgradeSockets >= 2) addUpg('SEAD_HTS_POD');
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
      if (spec.hasCenterline && isEligible(wCatalog['KINZHAL']) && (diff === 'LEGEND' || rng.boolean(0.50))) addWpn('KINZHAL', 'CENTERLINE');
      else if (isEligible(wCatalog['AGM-158C']) && rng.boolean(0.45)) addWpn('AGM-158C', 'EXTERNAL');
      else if (isEligible(wCatalog['AGM-158B'])) addWpn('AGM-158B', 'EXTERNAL');
      else addWpn('GBU-39', 'EXTERNAL');
      if (isEligible(wCatalog['AGM-88G']) && rng.boolean(0.60)) addWpn('AGM-88G', 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
    } else if (role === 'SNIPER') {
      const primaryUlr = rng.pick(class1Ulr) || rollBvr(true), secondaryLr = rng.pick(class2Lr) || rollBvr(false);
      if (spec.internalSlots > 0) {
        addWpn(primaryUlr, 'INTERNAL'); addWpn(secondaryLr, 'INTERNAL');
        if (!enforceCleanStealth && spec.externalSlots >= 2) addWpn(primaryUlr, 'EXTERNAL');
      } else {
        addWpn(primaryUlr, 'EXTERNAL'); addWpn(secondaryLr, 'EXTERNAL');
        if (spec.externalSlots >= 6 && !enforceLightweight) addWpn(secondaryLr, 'EXTERNAL');
      }
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
    } else if (role === 'AMBUSH') {
      addWpn(isEligible(wCatalog['AIM-260']) ? 'AIM-260' : rollBvr(true), 'INTERNAL');
      addWpn(rollWvr(), 'INTERNAL');
      if (spec.internalSlots >= 4) addWpn(rollBvr(false), 'INTERNAL');
      addUpg('RAM_NANO_COATING');
      if (spec.upgradeSockets >= 2) addUpg('EOTS_DUAL_OPTICS');
    } else if (role === 'INTERCEPT') {
      addWpn(rollBvr(true), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addUpg('SUPERCRUISE_VCE');
      if (spec.upgradeSockets >= 2) addUpg('GAN_AESA_CORE');
    } else if (role === 'DOGFIGHT') {
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (spec.externalSlots >= 4 && !enforceLightweight && (docProfile.preferWeapons === 'AGGRESSIVE' || rng.boolean(0.40))) {
        const podChoices = ['DEFA-554-POD', 'SUU-23A', 'SPPU-22', 'GSH-6-23-POD'].filter(id => isEligible(wCatalog[id]));
        if (podChoices.length > 0) addWpn(rng.pick(podChoices), 'EXTERNAL');
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
      const primaryBvr = rollBvr(['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)), primaryWvr = rollWvr();
      if (spec.internalSlots > 0) {
        addWpn(primaryBvr, 'INTERNAL'); addWpn(primaryWvr, 'INTERNAL');
        if (!enforceCleanStealth && spec.externalSlots >= 2 && !enforceLightweight) {
          addWpn(rollBvr(false), 'EXTERNAL'); addWpn(rollWvr(), 'EXTERNAL');
        }
      } else {
        addWpn(primaryBvr, 'EXTERNAL'); addWpn(primaryWvr, 'EXTERNAL');
        if (spec.externalSlots >= 6 && !enforceLightweight) {
          addWpn(rollBvr(false), 'EXTERNAL');
          if (spec.externalSlots >= 8 && ['ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) addWpn(rollWvr(), 'EXTERNAL');
        }
      }
    }

    const maxSockets = spec.upgradeSockets;
    let targetSockets = (diff === 'CADET' || diff === 'BUFFER') ? (rng.boolean(0.35) ? 0 : 1)
      : ((diff === 'VETERAN' || diff === 'ESCALATED') ? Math.min(maxSockets, 1 + rng.int(0, 1))
        : ((diff === 'ELITE' || diff === 'FORWARD') ? Math.min(maxSockets, 2 + rng.int(0, 1)) : maxSockets));

    if (docProfile.preferWeapons === 'SWARM') addUpg('MALD_DECOY_SYSTEM');
    else if (docProfile.preferWeapons === 'EW_SEAD') addUpg('ADAPTIVE_ECCM_SUITE');
    else if (docProfile.preferWeapons === 'DEFENSIVE') addUpg('RTB_HOMING_BEACON');

    const upgPool = ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'TITANIUM_COCKPIT'];
    for (const uId of rng.shuffle(upgPool)) { if (upgrades.length >= targetSockets) break; addUpg(uId); }

    return { weapons, upgrades, totalCost, chosenGunId, role };
  }
}

window.FleetOutfitter = FleetOutfitter;
