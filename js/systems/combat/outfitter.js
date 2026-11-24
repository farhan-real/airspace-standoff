/**
 * js/systems/combat/outfitter.js - Tactical AI Loadout Planner
 * Matches airframe pylon ratings, weapon range classes, CAS roles, and active AIR_DOCTRINES.
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
    const isCasAirframe = ['A-10C', 'Su-25SM3', 'Su-39', 'MiG-27K', 'A-16', 'AV-8B-PLUS', 'JAGUAR-GR3', 'F-16XL', 'A-29B'].includes(spec.id);
    const isHeavyTruck = ['F-15EX', 'F-15E', 'F-15J-JSI', 'F-16XL', 'MiG-31BM', 'J-16', 'J-11BG', 'J-15T', 'J-36', 'Mirage-4000', 'Su-34', 'A-10C', 'Su-39', 'MiG-27K', 'A-16', 'B-1B', 'B-52H', 'Tu-160M', 'F-111F'].includes(spec.id);
    const isAgileDogfighter = ['Rafale-C', 'Rafale-M', 'Eurofighter', 'TYPHOON-T4', 'Su-35S', 'Su-27SM3', 'Su-30MKI', 'MiG-35S', 'J-10C', 'Mirage-2000', 'Mirage-2000D', 'F-16V', 'F-16C-B52', 'A-16', 'F-16XL', 'AV-8B-PLUS', 'JAS-39E', 'JAS-39C', 'Tejas-MK2', 'Tejas-MK1A', 'JF-17-B3', 'FA-50-B20', 'F-5E-TIGER', 'Su-47', 'X-29A', 'Su-37'].includes(spec.id);
    const isHighSpeed = (spec.S_0 >= 1.25 || ['MiG-31BM', 'MiG-25PD', 'DARKSTAR', 'F-15EX', 'F-15E', 'F-15C', 'F-15J-JSI', 'F-16XL', 'MiG-27K', 'A-16', 'YF-23', 'F-22-SUPER', 'J-20B', 'J-36', 'TEMPEST', 'F-14D', 'F-14B', 'Tu-160M'].includes(spec.id));

    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    const specRatingIndex = ratings.indexOf(spec.maxPylonRating);
    if (specRatingIndex === -1) throw new Error(`Invalid maxPylonRating "${spec.maxPylonRating}" on "${spec.id}".`);

    const isEligible = (w) => Boolean(w && ratings.indexOf(w.minRating) <= specRatingIndex && (!w.allowedAirframes || w.allowedAirframes.includes(spec.id)));
    const class1Ulr = ['AIM-260', 'AIM-260B-HOJ', 'ASTRA-MK3', 'R-37M', 'R-33S', 'PL-21', 'PL-17', 'AIM-174B', 'KS-172', 'K-100', 'AIM-152', 'AIM-54C', 'KINZHAL'].filter(id => isEligible(wCatalog[id]));
    const class2Lr = ['METEOR', 'JNAAM', 'FMRAAM', 'GOKHAN', 'RVV-AE-PD', 'PL-15E', 'PL-15', 'PL-15-HOJ', 'ASTRA-MK2', 'R-77M', 'K-77ME', 'AIM-120D-3', 'AAM-4B', 'R-27ER', 'R-27ET', 'R-27EP', 'AGM-88G'].filter(id => isEligible(wCatalog[id]));
    const class3Mr = ['AIM-120D', 'AIM-120C-7', 'AIM-120D-HOJ', 'R-77-1', 'R-77', 'R-77T', 'MICA-EM', 'ASTRA-MK1', 'I-DERBY-ER', 'GOKDOGAN', 'PL-12', 'AAM-4', 'AIM-7P', 'R-27R', 'R-27T', 'R-27P', 'CUDA-SAC', 'MPBM', 'MPBM-II'].filter(id => isEligible(wCatalog[id]));
    const class4Sr = ['PYTHON-5', 'IRIS-T', 'IRIS-T-LR', 'AIM-9X-2', 'AIM-9X-B3', 'R-73', 'ASRAAM', 'MICA-IR', 'PL-10', 'PL-10E-ER', 'AAM-5B', 'R-74M2', 'BOZDOGAN', 'CACM-6', 'SADM-8', 'MAM', 'PEREGRINE'].filter(id => isEligible(wCatalog[id]));

    const addWpn = (wId, station) => {
      const w = wCatalog[wId];
      if (!w || !isEligible(w)) return false;
      const st = (station === 'EXTERNAL' && spec.externalSlots === 0 && spec.internalSlots > 0) ? 'INTERNAL' : station;
      weapons.push({ id: wId, station: st });
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
      for (const uId of ['GAN_AESA_CORE', 'THRUST_VECTOR', 'SUPERCRUISE_VCE', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'COFFIN_OPTICAL_BUS']) {
        if (upgrades.length >= aceSockets) break;
        addUpg(uId);
      }
      return { weapons, upgrades, totalCost, chosenGunId, role: aceRole };
    }

    let enforceLightweight = false;
    if (isAgileDogfighter && !isHeavyTruck) {
      const lightChances = { CADET: 0.0, BUFFER: 0.0, VETERAN: 0.0, ESCALATED: 0.15, ELITE: 0.30, FORWARD: 0.40, ACE: 0.50, FORTIFIED: 0.55, MASTER: 0.60, LEGEND: 0.65 };
      enforceLightweight = rng.boolean(lightChances[diff]);
    }

    let enforceCleanStealth = false;
    if (isStealth && spec.id !== 'J-20' && spec.id !== 'J-20B' && spec.id !== 'J-20S') {
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
        const highWvr = ['PYTHON-5', 'IRIS-T', 'ASRAAM', 'PL-10', 'AAM-5B', 'BOZDOGAN'].filter(id => isEligible(wCatalog[id]));
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
      if (isCasAirframe) {
        const casCl = ['CBU-105', 'RBK-500', 'CBU-97', 'CBU-87'].filter(id => isEligible(wCatalog[id]));
        const casRk = ['S-25OFM', 'CRV7-MPSM', 'S-13OF', 'HYDRA-70'].filter(id => isEligible(wCatalog[id]));
        const casAt = ['KH-38ML', 'BRIMSTONE-II', 'AGM-179', 'SPIKE-NLOS'].filter(id => isEligible(wCatalog[id]));
        const casTg = ['AN-AAQ-33', 'SAPSAN-E', 'AN-AAQ-28'].filter(id => isEligible(wCatalog[id]));
        if (casCl.length > 0) addWpn(rng.pick(casCl), 'EXTERNAL');
        if (casRk.length > 0) addWpn(rng.pick(casRk), 'EXTERNAL');
        if (casAt.length > 0) addWpn(rng.pick(casAt), 'EXTERNAL');
        if (casTg.length > 0) addWpn(rng.pick(casTg), 'EXTERNAL');
        if (!['A-10C', 'Su-25SM3', 'A-29B'].includes(spec.id) && spec.externalSlots >= 8) addWpn(rollBvr(false), 'EXTERNAL');
        addWpn(rollWvr(), 'EXTERNAL');
        addUpg('KEVLAR_BELLY_ARMOR');
        addUpg('CCIP_BALLISTIC_COMP');
        addUpg('TFR_TERRAIN_RADAR');
      } else {
        const strikeSt = (spec.externalSlots === 0 && spec.internalSlots > 0) ? 'INTERNAL' : 'EXTERNAL';
        if (spec.hasCenterline && isEligible(wCatalog['KINZHAL']) && (diff === 'LEGEND' || rng.boolean(0.50))) addWpn('KINZHAL', 'CENTERLINE');
        else if (isEligible(wCatalog['AGM-158C']) && rng.boolean(0.45)) addWpn('AGM-158C', strikeSt);
        else if (isEligible(wCatalog['AGM-158B'])) addWpn('AGM-158B', strikeSt);
        else addWpn('GBU-39', strikeSt);
        if (isEligible(wCatalog['AGM-88G']) && rng.boolean(0.60)) addWpn('AGM-88G', strikeSt);
        addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
        addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
        addUpg('TFR_TERRAIN_RADAR');
        addUpg('MITL_DATALINK_TRANSCEIVER');
      }
    } else if (role === 'SNIPER') {
      const primaryUlr = rng.pick(class1Ulr) || rollBvr(true), secondaryLr = rng.pick(class2Lr) || rollBvr(false);
      if (['FORTIFIED', 'MASTER', 'LEGEND'].includes(diff) && spec.externalSlots >= 6 && isEligible(wCatalog['LEGION-POD-BLK2'])) addWpn('LEGION-POD-BLK2', 'EXTERNAL');
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
      addWpn(rollWvr(), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      addWpn(rollBvr(false), spec.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL');
      if (['ELITE', 'FORWARD', 'ACE', 'FORTIFIED', 'MASTER', 'LEGEND'].includes(diff)) {
        if (spec.internalSlots >= 4 && isEligible(wCatalog['EOTS-POD-VLO'])) addWpn('EOTS-POD-VLO', 'INTERNAL');
        else if (spec.externalSlots >= 4 && isEligible(wCatalog['OLS-35-POD'])) addWpn('OLS-35-POD', 'EXTERNAL');
      }
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

    for (const uId of rng.shuffle(['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'RAM_NANO_COATING', 'ADAPTIVE_ECCM_SUITE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'TITANIUM_COCKPIT'])) {
      if (upgrades.length >= targetSockets) break;
      addUpg(uId);
    }
    return { weapons, upgrades, totalCost, chosenGunId, role };
  }
}

window.FleetOutfitter = FleetOutfitter;
