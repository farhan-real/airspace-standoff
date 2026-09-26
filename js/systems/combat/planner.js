/**
 * AIRSPACE STANDOFF: Fleet Loadout Planner Submodule
 * Evaluates airframe station constraints and plans weapon and upgrade loadouts.
 */

class FleetLoadoutPlanner {
  static planAircraftLoadout(spec, isAce, doctrine, diff, rng) {
    const wCatalog = window.WEAPONS_CATALOG || {};
    const uCatalog = window.UPGRADES_CATALOG || {};
    const weapons = [];
    const upgrades = [];
    let totalCost = spec.cost || 20.0;

    const isEW = (spec.category === 'EW' || spec.isEW);
    const isStealth = (spec.internalSlots > 0);
    const isStrike = (spec.category === 'STRIKE');

    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    const specRatingIndex = ratings.indexOf(spec.maxPylonRating || 'Type M');

    const isWeaponEligible = (w) => {
      if (!w) return false;
      const minIndex = ratings.indexOf(w.minRating || 'Type S');
      if (minIndex > specRatingIndex) return false;
      if (w.allowedAirframes && !w.allowedAirframes.includes(spec.id)) return false;
      return true;
    };

    const intBvr = ['AIM-120D', 'PL-15E', 'METEOR', 'AIM-260'].filter(id => isWeaponEligible(wCatalog[id]));
    const intWvr = ['AIM-9X-2', 'R-73', 'IRIS-T'].filter(id => isWeaponEligible(wCatalog[id]));
    const extBvr = ['R-37M', 'PL-21', 'AIM-260', 'METEOR', 'AIM-120D', 'PL-15E'].filter(id => isWeaponEligible(wCatalog[id]));
    const extWvr = ['PYTHON-5', 'AIM-9X-2', 'R-73', 'IRIS-T'].filter(id => isWeaponEligible(wCatalog[id]));

    const addWpn = (wId, station) => {
      const w = wCatalog[wId];
      if (!w || !isWeaponEligible(w)) return false;
      weapons.push({ id: wId, station });
      totalCost += (w.cost || 0);
      return true;
    };

    const addUpg = (uId) => {
      const u = uCatalog[uId];
      if (!u) return;
      if (u.isAllowed && !u.isAllowed(spec)) return;
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
        if (!addWpn('R-37M', 'EXTERNAL')) addWpn('AIM-120D', 'EXTERNAL');
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
        const candidates = (rem >= 2 && intBvr.length > 0) ? intBvr : intWvr;
        if (candidates.length === 0) break;
        const pick = candidates[Math.floor(rng() * candidates.length)];
        const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
        if (intUsed + slots <= spec.internalSlots) {
          if (addWpn(pick, 'INTERNAL')) intUsed += slots;
          else break;
        } else break;
      }
      if ((rng() < 0.65 || doctrine === 'STANDOFF') && spec.externalSlots > 0) {
        let extUsed = 0;
        while (extUsed < spec.externalSlots) {
          const pool = (doctrine === 'STANDOFF' && extBvr.length > 0) ? extBvr : (rng() < 0.60 && extBvr.length > 0 ? extBvr : extWvr);
          if (pool.length === 0) break;
          const pick = pool[Math.floor(rng() * pool.length)];
          const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
          if (extUsed + slots <= spec.externalSlots) {
            if (addWpn(pick, 'EXTERNAL')) extUsed += slots;
            else break;
          } else break;
        }
      }
      if (diff !== 'CADET' && spec.upgradeSockets >= 1) {
        addUpg(rng() < 0.5 ? 'RAM_NANO_COATING' : 'GAN_AESA_CORE');
      }
      return { weapons, upgrades, totalCost };
    }

    if (isStrike) {
      if (isWeaponEligible(wCatalog['AGM-158B'])) addWpn(rng() < 0.5 ? 'AGM-158B' : 'GBU-39', 'EXTERNAL');
      else addWpn('GBU-39', 'EXTERNAL');
    }

    let usedSlots = weapons.reduce((s, it) => s + ((wCatalog[it.id] || {}).slots || 1), 0);
    let attempts = 0;
    while (usedSlots < spec.totalSlots && attempts < 16) {
      attempts++;
      const pool = (doctrine === 'STANDOFF' && extBvr.length > 0) ? extBvr : (rng() < 0.65 && extBvr.length > 0 ? extBvr : extWvr);
      if (pool.length === 0) break;
      const pick = pool[Math.floor(rng() * pool.length)];
      const slots = (wCatalog[pick] && wCatalog[pick].slots) || 1;
      if (usedSlots + slots <= spec.totalSlots) {
        if (addWpn(pick, 'EXTERNAL')) usedSlots += slots;
      }
    }

    const kinzhal = wCatalog['KINZHAL'];
    if (spec.hasCenterline && (spec.centerlineSlots || 0) >= 6 && isWeaponEligible(kinzhal) && (doctrine === 'STANDOFF' || spec.id === 'MiG-31BM')) {
      addWpn('KINZHAL', 'CENTERLINE');
    }

    if (diff !== 'CADET' && spec.upgradeSockets >= 1) {
      const pool = ['SUPERCRUISE_VCE', 'THRUST_VECTOR', 'GAN_AESA_CORE'];
      addUpg(pool[Math.floor(rng() * pool.length)]);
    }

    return { weapons, upgrades, totalCost };
  }
}

window.FleetLoadoutPlanner = FleetLoadoutPlanner;