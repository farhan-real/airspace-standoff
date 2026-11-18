/**
 * AIRSPACE STANDOFF: AI Salvo Composition & Ace Target Selector
 * Handles inbound damage accounting, doctrine salvo sizing, mixed-seeker traps, and Ace salvo selection.
 */

class AISalvoPlanner {
  static filterCandidateTargets(shooter, rawTargets, profile, diffKey) {
    const isAce = Boolean(shooter && shooter.isAce);
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]);
    const descChance = isAce && aceProf ? aceProf.decoyDiscrimination : profile.decoyDiscrimination;

    return rawTargets.filter(t => {
      if (!t || t.hp <= 0.05) return false;
      if ((t.isDecoyDrone || t.isGhost) && Math.random() < descChance) return false;
      return true;
    });
  }

  static estimateTargetEffectiveHp(target, allMissiles, team, diffKey) {
    if (!allMissiles || allMissiles.length === 0) return target.hp;
    const inbounds = allMissiles.filter(m => m.active && m.target && m.target.id === target.id && m.team === team);
    if (inbounds.length === 0) return target.hp;
    if (diffKey === 'CADET' || diffKey === 'BUFFER' || diffKey === 'VETERAN') return target.hp;
    const hitRateEst = ['FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey) ? 0.75 : 0.60;
    const expectedDmg = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 3) * hitRateEst), 0);
    return Math.max(0, target.hp - expectedDmg);
  }

  static calculateSalvoComposition(match, availablePylons, diffKey, shooter, profile, airDoctrine) {
    const tgt = match.target;
    const w = match.weapon;
    const pylonsToFire = [match.pylon];
    if (w.category !== 'A2A') return { target: tgt, pylonsToFire, primaryWeapon: w };

    const isAce = Boolean(shooter && shooter.isAce);
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]) || profile;
    const baseMaxSalvo = isAce ? aceProf.salvoMaxMissiles : profile.salvoMaxMissiles;
    const docSalvoBias = airDoctrine ? airDoctrine.salvoBias : 0;
    const maxSalvo = Math.max(1, Math.min(3, baseMaxSalvo + docSalvoBias));
    if (maxSalvo < 2) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const totalAmmoLeft = availablePylons.reduce((sum, p) => sum + (p.item.ammo || 0), 0);
    if (match.effectiveHp <= w.damage && totalAmmoLeft <= 2) return { target: tgt, pylonsToFire, primaryWeapon: w };
    if (airDoctrine && airDoctrine.id === 'DEFENSIVE_HOLD' && match.pk < 70) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }

    const remaining = availablePylons.filter(p => p.index !== match.pylon.index && p.weapon.category === 'A2A');
    if (remaining.length === 0) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const mixedChance = isAce ? aceProf.mixedSeekerChance : profile.mixedSeekerChance;
    if (Math.random() < mixedChance) {
      const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
      const primeIsRf = isRf(w.seeker);
      const mixed = remaining.find(p => primeIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker));
      if (mixed) {
        pylonsToFire.push(mixed);
        return { target: tgt, pylonsToFire, primaryWeapon: w };
      }
    }

    pylonsToFire.push(remaining[0]);
    return { target: tgt, pylonsToFire, primaryWeapon: w };
  }

  static selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey, profile, airDoctrine) {
    if (!ace.equippedWeapons || ace.equippedWeapons.length === 0) return null;

    const availablePylons = [];
    for (let i = 0; i < ace.equippedWeapons.length; i++) {
      const item = ace.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isTargetingPod &&
          !item.weapon.isDecoy && !item.weapon.isDecoyDrone && !item.weapon.isGunpod && item.weapon.category !== 'GUN') {
        availablePylons.push({ index: i, item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return null;

    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]) || profile;
    const filtered = this.filterCandidateTargets(ace, candidateTargets, aceProf, diffKey);
    const viableTargets = filtered.filter(t => t && t.hp > 0.05 && !t.isCivilian);
    if (viableTargets.length === 0) return null;

    const preferEw = Boolean(airDoctrine && airDoctrine.id === 'RADAR_JAMMING');
    const preferLong = Boolean(airDoctrine && airDoctrine.id === 'STANDOFF');

    viableTargets.sort((a, b) => {
      const distA = Math.hypot(a.x - ace.x, a.y - ace.y);
      const distB = Math.hypot(b.x - ace.x, b.y - ace.y);
      const ewA = (preferEw && (a.jamEfficiency > 0 || (a.spec && a.spec.category === 'EW'))) ? 26 : 0;
      const ewB = (preferEw && (b.jamEfficiency > 0 || (b.spec && b.spec.category === 'EW'))) ? 26 : 0;
      const prioA = (a.hp <= 2 ? 30 : 0) + (a.isFlightLead ? 22 : 0) + ewA + (preferLong ? distA * 0.10 : -distA * 0.18);
      const prioB = (b.hp <= 2 ? 30 : 0) + (b.isFlightLead ? 22 : 0) + ewB + (preferLong ? distB * 0.10 : -distB * 0.18);
      return prioB - prioA;
    });

    for (const target of viableTargets) {
      const dist = Math.hypot(target.x - ace.x, target.y - ace.y);
      const isSurface = Boolean(target.type && !target.spec && !target.isCivilian);
      const compatiblePylons = availablePylons.filter(p => Boolean(p.weapon.category === 'A2G' || p.weapon.isBunkerCracker) === isSurface);
      if (compatiblePylons.length === 0) continue;

      const angleToTarget = Math.atan2(target.y - ace.y, target.x - ace.x);
      let offBoresight = Math.abs((ace.heading || 0) - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

      const primary = compatiblePylons[0];
      const maxRange = primary.weapon.rangeKm * Math.min(0.95, 0.85 * (airDoctrine ? airDoctrine.engageRangeMult : 1.0));
      if (!primary || dist > maxRange || dist < (primary.weapon.minRangeKm || 1.0)) continue;

      const isHOBS = (primary.weapon.trait === 'HOBS_VANE' || primary.weapon.trait === 'ALL_ASPECT_BURST' || primary.weapon.trait === 'REAR_ENGAGE' || primary.weapon.id === 'IRIS-T');
      if (!isSurface && !isHOBS && offBoresight > 0.85) continue;

      const pylonsToFire = [primary];
      const maxSalvo = Math.max(1, Math.min(3, aceProf.salvoMaxMissiles + (airDoctrine ? airDoctrine.salvoBias : 0)));

      if (maxSalvo >= 2 && target.hp >= 3) {
        let secondary = null;
        if (Math.random() < aceProf.mixedSeekerChance) {
          const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
          const primaryIsRf = isRf(primary.weapon.seeker);
          secondary = compatiblePylons.find(p => p.index !== primary.index && dist <= p.weapon.rangeKm * 0.85 && (primaryIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker)));
        }
        if (!secondary) {
          secondary = compatiblePylons.find(p => p.index !== primary.index && dist <= p.weapon.rangeKm * 0.85 && dist >= (p.weapon.minRangeKm || 1.0));
        }
        if (secondary) pylonsToFire.push(secondary);
      }

      return { target, pylonsToFire };
    }
    return null;
  }
}

window.AISalvoPlanner = AISalvoPlanner;
