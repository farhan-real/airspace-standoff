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

  static countActiveInbounds(target, allMissiles, team) {
    if (!allMissiles || allMissiles.length === 0) return 0;
    let count = 0;
    for (let i = 0; i < allMissiles.length; i++) {
      const m = allMissiles[i];
      if (m && m.active && m.target && m.target.id === target.id && m.team === team) count++;
    }
    return count;
  }

  static getAmmoReserveInfo(shooter, availablePylons) {
    let totalAmmoLeft = 0;
    for (let i = 0; i < availablePylons.length; i++) {
      totalAmmoLeft += (availablePylons[i].item.ammo || 0);
    }
    if (shooter._initialMissileAmmo === undefined) {
      let initTotal = 0;
      const list = shooter.equippedWeapons || [];
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (it && it.weapon && !it.weapon.isJammerPod && !it.weapon.isTargetingPod &&
            !it.weapon.isDecoy && !it.weapon.isDecoyDrone && !it.weapon.isGunpod && it.weapon.category !== 'GUN') {
          initTotal += (it.maxAmmo || it.ammo || 0);
        }
      }
      shooter._initialMissileAmmo = Math.max(totalAmmoLeft, initTotal);
    }
    const initAmmo = Math.max(1, shooter._initialMissileAmmo);
    return { totalAmmoLeft, initAmmo, ammoFraction: totalAmmoLeft / initAmmo };
  }

  static computeDynamicFireModifiers(shooter, totalAmmoLeft, ammoFraction, allMissiles, airTargets, hostileFleet, diffKey, airDoctrine = null) {
    const adaptWeights = {
      CADET: 0.25, BUFFER: 0.35, VETERAN: 0.50, ESCALATED: 0.65, ELITE: 0.78,
      FORWARD: 0.85, ACE: 0.92, FORTIFIED: 0.96, MASTER: 1.0, LEGEND: 1.0
    };
    const baseAdapt = adaptWeights[diffKey] !== undefined ? adaptWeights[diffKey] : 0.70;
    const docMult = (airDoctrine && typeof airDoctrine.dangerAggressionMult === 'number') ? airDoctrine.dangerAggressionMult : 1.0;
    const adapt = Math.max(0.15, Math.min(1.25, baseAdapt * docMult));

    const isHeavilyArmed = (totalAmmoLeft >= 8 && ammoFraction >= 0.62);

    const fleet = hostileFleet || [];
    let aliveCount = 0;
    for (let i = 0; i < fleet.length; i++) {
      if (fleet[i] && fleet[i].hp > 0.05) aliveCount++;
    }
    const totalCount = fleet.length;
    const isLastStand = (totalCount > 0 && aliveCount > 0 && (aliveCount <= 2 || (aliveCount / totalCount) <= 0.30));

    let hasInboundThreat = false;
    if (allMissiles && allMissiles.length > 0) {
      for (let i = 0; i < allMissiles.length; i++) {
        const m = allMissiles[i];
        if (m && m.active && m.target && m.target.id === shooter.id && (m.distanceToTarget === undefined || m.distanceToTarget < 32.0)) {
          hasInboundThreat = true;
          break;
        }
      }
    }

    let hasCloseBandit = false;
    if (airTargets && airTargets.length > 0) {
      for (let i = 0; i < airTargets.length; i++) {
        const t = airTargets[i];
        if (t && t.hp > 0.05 && Math.hypot(t.x - shooter.x, t.y - shooter.y) <= 22.0) {
          hasCloseBandit = true;
          break;
        }
      }
    }

    const isLowHp = (shooter.hp <= 2);
    const inDanger = Boolean(hasInboundThreat || isLowHp || hasCloseBandit);

    let pkDelta = 0;
    let cooldownMult = 1.0;
    if (isHeavilyArmed) {
      pkDelta -= Math.round(5 * adapt);
      cooldownMult *= (1.0 - 0.20 * adapt);
    }
    if (isLastStand) {
      pkDelta -= Math.round(5 * adapt);
      cooldownMult *= (1.0 - 0.28 * adapt);
    }
    if (inDanger) {
      pkDelta -= Math.round(6 * adapt);
      cooldownMult *= (1.0 - 0.34 * adapt);
    }

    return {
      isHeavilyArmed,
      isLastStand,
      inDanger,
      pkDelta: Math.max(-12, pkDelta),
      cooldownMult: Math.max(0.45, cooldownMult),
      allowAggressiveSalvo: Boolean((isHeavilyArmed || isLastStand || inDanger) && adapt >= 0.45)
    };
  }

  static estimateTargetEffectiveHp(target, allMissiles, team, diffKey, profile = null) {
    if (!allMissiles || allMissiles.length === 0) return target.hp;
    const inbounds = allMissiles.filter(m => m && m.active && m.target && m.target.id === target.id && m.team === team);
    if (inbounds.length === 0) return target.hp;
    const baseProf = profile || (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]);
    const hitRateEst = (baseProf && typeof baseProf.inboundKillDiscount === 'number')
      ? baseProf.inboundKillDiscount
      : (['FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey) ? 0.85 : 0.55);
    const expectedDmg = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 3) * hitRateEst), 0);
    return Math.max(0, target.hp - expectedDmg);
  }

  static isPylonValidForTarget(pylon, shooter, tgt, dist, offBoresight, rangeRatio, maxOffAngle, isSurface) {
    const w = pylon.weapon;
    if (!w || pylon.item.ammo <= 0) return false;
    const isA2G = Boolean(w.category === 'A2G' || w.isBunkerCracker);
    if (isA2G !== isSurface) return false;
    const maxRange = w.rangeKm * rangeRatio;
    if (dist > maxRange || dist < (w.minRangeKm || 1.0)) return false;
    const isHOBS = (w.trait === 'HOBS_VANE' || w.trait === 'ALL_ASPECT_BURST' || w.trait === 'REAR_ENGAGE' || w.id === 'IRIS-T');
    if (!isSurface && !isHOBS && offBoresight > maxOffAngle) return false;
    return true;
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

    const { totalAmmoLeft, ammoFraction } = this.getAmmoReserveInfo(shooter, availablePylons);
    const baseReserve = (isAce ? aceProf.reserveRatio : profile.reserveRatio) || 0.30;
    const reserveRatio = Math.max(0.05, Math.min(0.65, baseReserve + (airDoctrine ? (airDoctrine.reserveBias || 0) : 0)));
    const dyn = match.dyn || null;
    const urgentBypass = Boolean(dyn && (dyn.inDanger || dyn.isLastStand) && totalAmmoLeft >= 3);

    // Conserve reserve ammo unless shooter is in immediate danger or last-stand attrition
    if (totalAmmoLeft <= 2 || (ammoFraction <= reserveRatio && !urgentBypass)) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }
    if (match.effectiveHp <= w.damage * 1.05 && match.pk >= 62) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }
    if (match.pk < 52) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }
    if (airDoctrine && airDoctrine.id === 'DEFENSIVE_HOLD' && match.pk < 72) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }

    const dist = match.dist;
    const offBoresight = match.offBoresight;
    const rangeRatio = match.rangeRatio;
    const maxAngle = match.maxAngle;

    const validRemaining = availablePylons.filter(p =>
      p.index !== match.pylon.index &&
      p.weapon.category === 'A2A' &&
      this.isPylonValidForTarget(p, shooter, tgt, dist, offBoresight, rangeRatio, maxAngle, false)
    );
    if (validRemaining.length === 0) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const mixedChance = isAce ? aceProf.mixedSeekerChance : profile.mixedSeekerChance;
    if (Math.random() < mixedChance) {
      const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
      const primeIsRf = isRf(w.seeker);
      const mixed = validRemaining.find(p => primeIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker));
      if (mixed) {
        pylonsToFire.push(mixed);
        return { target: tgt, pylonsToFire, primaryWeapon: w };
      }
    }

    // Only fire a 2nd matching missile if target actually needs > 1 missile or is high-value lead/ace
    if (match.effectiveHp > w.damage || tgt.isFlightLead || tgt.isAce) {
      pylonsToFire.push(validRemaining[0]);
    }
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
    const { totalAmmoLeft, ammoFraction } = this.getAmmoReserveInfo(ace, availablePylons);
    const filtered = this.filterCandidateTargets(ace, candidateTargets, aceProf, diffKey);
    const viableTargets = filtered.filter(t => t && t.hp > 0.05 && !t.isCivilian);
    if (viableTargets.length === 0) return null;

    const hostileFleet = (window.Game && window.Game.hostileAircraft) || [];
    const dyn = this.computeDynamicFireModifiers(ace, totalAmmoLeft, ammoFraction, allMissiles, viableTargets, hostileFleet, diffKey, airDoctrine);
    const aceReserveRatio = Math.max(0.05, Math.min(0.65, (aceProf.reserveRatio || 0.35) + (airDoctrine ? (airDoctrine.reserveBias || 0) : 0)));
    const inReserve = (totalAmmoLeft <= 2 || (ammoFraction <= aceReserveRatio && !dyn.inDanger && !dyn.isLastStand));

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

    const maxInboundCap = Math.max(1, Math.min(4, (aceProf.maxInboundPerTarget || 2) + (airDoctrine ? (airDoctrine.inboundCapBias || 0) : 0)));
    const rangeRatio = Math.min(0.92, (inReserve ? 0.68 : 0.78) * (airDoctrine ? airDoctrine.engageRangeMult : 1.0));
    const requiredPk = Math.max(25, Math.min(84, (aceProf.minPk || 55) + (inReserve ? 10 : 0) + dyn.pkDelta + (airDoctrine ? airDoctrine.minPkOffset : 0)));

    let bestMatch = null;
    let bestScore = -999;

    for (const target of viableTargets) {
      const inboundsCount = this.countActiveInbounds(target, allMissiles, ace.team);
      if (inboundsCount >= maxInboundCap) continue;
      const effectiveHp = this.estimateTargetEffectiveHp(target, allMissiles, ace.team, diffKey, aceProf);
      if (effectiveHp <= 0.05) continue;

      const dist = Math.hypot(target.x - ace.x, target.y - ace.y);
      const isSurface = Boolean(target.type && !target.spec && !target.isCivilian);
      const angleToTarget = Math.atan2(target.y - ace.y, target.x - ace.x);
      let offBoresight = Math.abs((ace.heading || 0) - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

      for (const pylon of availablePylons) {
        if (!this.isPylonValidForTarget(pylon, ace, target, dist, offBoresight, rangeRatio, 0.85, isSurface)) continue;
        const pkResult = Physics.calcPk(pylon.weapon, ace, target, clouds);
        const pk = pkResult.pk || 0;
        if (pk < requiredPk) continue;

        const score = pk + (target.isFlightLead ? 18 : 0) + (target.hp <= 2 ? 15 : 0) - (inboundsCount * 15);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { pylon, weapon: pylon.weapon, target, pk, effectiveHp, dist, offBoresight, rangeRatio, maxAngle: 0.85 };
        }
      }
    }

    if (!bestMatch) return null;

    const target = bestMatch.target;
    const primary = bestMatch.pylon;
    const pylonsToFire = [primary];
    const maxSalvo = Math.max(1, Math.min(3, aceProf.salvoMaxMissiles + (airDoctrine ? airDoctrine.salvoBias : 0)));

    if (!inReserve && maxSalvo >= 2 && bestMatch.effectiveHp > primary.weapon.damage && bestMatch.pk >= 56) {
      const validSec = availablePylons.filter(p =>
        p.index !== primary.index &&
        this.isPylonValidForTarget(p, ace, target, bestMatch.dist, bestMatch.offBoresight, rangeRatio, 0.85, Boolean(target.type && !target.spec && !target.isCivilian))
      );
      if (validSec.length > 0) {
        let secondary = null;
        if (Math.random() < aceProf.mixedSeekerChance) {
          const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
          const primaryIsRf = isRf(primary.weapon.seeker);
          secondary = validSec.find(p => (primaryIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker)));
        }
        if (!secondary) secondary = validSec[0];
        if (secondary) pylonsToFire.push(secondary);
      }
    }

    return { target, pylonsToFire, dyn };
  }
}

window.AISalvoPlanner = AISalvoPlanner;
