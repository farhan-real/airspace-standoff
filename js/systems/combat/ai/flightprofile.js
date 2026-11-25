/**
 * js/systems/combat/ai/flightprofile.js - Fully Continuous Live Stat, Weight & Loadout Evaluator
 * Replaces discrete gate thresholds with smooth, continuous polynomial blending curves across all 10 difficulties.
 */

class AIFlightProfile {
  static clamp(val, lo, hi) {
    return Math.max(lo, Math.min(hi, val));
  }

  static lerp(a, b, t) {
    return a + (b - a) * this.clamp(t, 0, 1);
  }

  static smoothstep(edge0, edge1, x) {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  static getPrecision(diffKey, isAce = false) {
    const table = {
      CADET: 0.08, BUFFER: 0.16, VETERAN: 0.28, ESCALATED: 0.42, ELITE: 0.56,
      FORWARD: 0.68, ACE: 0.78, FORTIFIED: 0.87, MASTER: 0.94, LEGEND: 1.00
    };
    const base = table[diffKey] !== undefined ? table[diffKey] : 0.30;
    return isAce ? Math.min(1.00, base + 0.18) : base;
  }

  static computeCornerThrottle(unit, effMaxMach, precision, fallback = 0.65) {
    const sOpt = typeof unit.getOptimalCornerSpeed === 'function' ? unit.getOptimalCornerSpeed() : 0.75;
    const speedErr = (sOpt - (unit.speed || sOpt)) / Math.max(0.30, effMaxMach);
    const targetThrottle = this.clamp(0.62 + speedErr * 0.95, 0.26, 1.00);
    return this.lerp(fallback, targetThrottle, precision);
  }

  static evaluate(unit, diffKey) {
    if (!unit || !unit.spec) throw new Error('AIFlightProfile.evaluate requires a valid aircraft unit.');
    const spec = unit.spec;
    const isAce = Boolean(unit.isAce);
    const precision = this.getPrecision(diffKey, isAce);

    const wr = this.clamp(typeof unit.Wr === 'number' ? unit.Wr : 0, 0, 1);
    const effMaxMach = typeof unit.effectiveMaxSpeed === 'number' ? unit.effectiveMaxSpeed : (spec.S_0 || 1.0);
    const effAgi = typeof unit.getEffectiveAgility === 'function' ? unit.getEffectiveAgility() : (spec.AGI_0 || 0.85);
    const sOpt = typeof unit.getOptimalCornerSpeed === 'function' ? unit.getOptimalCornerSpeed() : (spec.sOpt || 0.75);

    const agiScore = this.clamp((effAgi - 0.35) / 1.05, 0, 1);
    const speedScore = this.clamp((effMaxMach - 0.65) / 1.40, 0, 1);
    const gLimitScore = this.clamp(((spec.G_limit || 9.0) - 5.0) / 11.0, 0, 1);

    const isNoStress = Boolean(unit.isCoffin || spec.isDrone);
    const stressRatio = isNoStress ? 0 : this.clamp((unit.stress || 0) / Math.max(0.5, unit.glocThreshold || 0.95), 0, 1);
    const energyRatio = this.clamp(unit.energy !== undefined ? unit.energy : 1.0, 0.20, 1.0);
    const hpRatio = this.clamp((unit.hp || 1) / Math.max(1, unit.maxHp || spec.hp || 4), 0, 1);
    const armorStrength = this.clamp(((unit.maxHp || spec.hp || 4) - 3) / 5.0, 0, 1);

    const effRcs = typeof unit.effectiveRcs === 'number' ? unit.effectiveRcs : (spec.sigma_0 || 1.0);
    const stealthFactor = this.clamp(1.0 - Math.pow(this.clamp(effRcs / 1.5, 0, 1), 0.25), 0, 1);
    const radarRangeKm = spec.R_0 || 70;
    const radarReachScore = this.clamp((radarRangeKm - 45) / 70, 0, 1);
    const halfConeRad = ((spec.radarConeDeg || 120) / 2.0) * (Math.PI / 180.0);
    const lookDownScore = this.clamp(((spec.lookDownBonus || 0.20) - 0.15) / 0.60, 0, 1);
    const beamSpike = spec.beamSpike || 3.0;
    const baseThermal = typeof unit.baseThermalBloom === 'number' ? unit.baseThermalBloom : (spec.thermalBloom || 1.0);
    const thermalVuln = this.clamp((baseThermal - 0.85) / 0.70, 0, 1) * this.clamp(1.0 - (unit.dircmEvasion || 0) * 2.0, 0, 1);
    const jamPower = this.clamp(unit.jamEfficiency || 0, 0, 0.95);

    let bvrAmmo = 0, wvrAmmo = 0, a2gAmmo = 0, ramjetBvr = 0, irBvr = 0, arhBvr = 0;
    let maxA2ARangeKm = 0, maxA2GRangeKm = 0, hasGunpod = false;

    const list = unit.equippedWeapons || [];
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      if (!it || it.ammo <= 0 || !it.weapon) continue;
      const w = it.weapon;
      if (w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) continue;
      if (w.isGunpod || w.category === 'GUN') { hasGunpod = true; continue; }
      if (w.category === 'A2G' || w.isBunkerCracker || w.isAntiRadiation) {
        a2gAmmo += it.ammo;
        maxA2GRangeKm = Math.max(maxA2GRangeKm, w.rangeKm || 0);
      } else if (w.category === 'A2A') {
        const rngKm = w.rangeKm || 25;
        maxA2ARangeKm = Math.max(maxA2ARangeKm, rngKm);
        if (rngKm >= 38.0) {
          bvrAmmo += it.ammo;
          if (w.trait === 'RAMJET_SUSTAINED' || w.trait === 'DUAL_PULSE_SURGE') ramjetBvr += it.ammo;
          if (w.seeker === 'IIR' || w.seeker === 'EO') irBvr += it.ammo;
          else arhBvr += it.ammo;
        } else {
          wvrAmmo += it.ammo;
        }
      }
    }

    const ramjetRatio = bvrAmmo > 0 ? (ramjetBvr / bvrAmmo) : 0;
    const irBvrRatio = bvrAmmo > 0 ? (irBvr / bvrAmmo) : 0;
    const arhRatio = bvrAmmo > 0 ? (arhBvr / bvrAmmo) : 0;
    const gunRangeKm = unit.gun ? (unit.gun.rangeKm || 5.0) : 5.0;
    const hasEnergyGun = Boolean(unit.gun && (unit.gun.damagePerPulse || unit.gun.id === 'DE-PULSE' || (unit.gun.id && unit.gun.id.startsWith('PLSL')) || unit.gun.id === 'EML_GUN'));
    const totalMissiles = bvrAmmo + wvrAmmo + a2gAmmo;
    const outOfBvr = (bvrAmmo === 0);

    const useWeight = wr * precision;
    const useCaution = (1.0 - hpRatio) * (1.15 - 0.45 * armorStrength) * precision;
    const useStealth = stealthFactor * precision;
    const useLookDown = lookDownScore * precision;
    const useStress = this.smoothstep(0.40, 0.90, stressRatio) * precision;
    const useEnergy = this.smoothstep(0.70, 0.30, energyRatio) * precision;
    const useBeamSpike = this.smoothstep(2.2, 4.5, beamSpike) * stealthFactor * precision;
    const useWeaponTraits = precision;

    let preferredEngageKm = 26.0;
    if (bvrAmmo > 0) {
      const baseSpan = maxA2ARangeKm * (0.48 + 0.12 * ramjetRatio * useWeaponTraits);
      preferredEngageKm = this.clamp(baseSpan, 28.0, 84.0);
      preferredEngageKm += useWeight * 14.0;
      preferredEngageKm += precision * ((1.0 - agiScore) * 20.0 - agiScore * 12.0);
      preferredEngageKm += precision * (speedScore * 11.0 + radarReachScore * 8.0);
      preferredEngageKm += useCaution * 15.0;
      preferredEngageKm -= useStealth * 9.0 + (irBvrRatio * 8.0 * useWeaponTraits);
      preferredEngageKm = this.clamp(preferredEngageKm, 22.0, 88.0);
    } else if (wvrAmmo > 0 || hasGunpod || hasEnergyGun) {
      preferredEngageKm = hasEnergyGun ? Math.max(8.5, gunRangeKm * 0.85) : (12.0 + (1.0 - agiScore) * 8.0 * precision);
    } else {
      preferredEngageKm = Math.max(4.0, gunRangeKm * 0.80);
    }

    const stressDamp = 1.0 - 0.65 * useStress;
    const cobraWeight = unit.thrustVector ? (0.28 + 0.52 * agiScore * precision) * stressDamp : 0.0;
    const splitSWeight = this.clamp(0.20 + (wr * 0.32 + (1.0 - agiScore) * 0.28 + useEnergy * 0.40 + useStress * 0.35) * precision, 0.12, 0.92);
    const barrelWeight = this.clamp(0.25 + (agiScore * 0.48 + gLimitScore * 0.18 - wr * 0.22) * precision, 0.14, 0.90) * stressDamp;
    const zoomWeight = this.clamp(0.12 + (speedScore * 0.36 - wr * 0.18 - useEnergy * 0.28) * precision, 0.04, 0.70);
    const notchMod = (stealthFactor * 0.12 + (1.0 - useBeamSpike) * 0.04) * precision;

    return {
      precision, wr, effMaxMach, effAgi, sOpt, agiScore, speedScore, gLimitScore,
      stressRatio, energyRatio, hpRatio, armorStrength,
      effRcs, stealthFactor, radarRangeKm, radarReachScore, halfConeRad, lookDownScore,
      beamSpike, thermalVuln, jamPower,
      hasTvc: Boolean(unit.thrustVector), isCoffin: Boolean(unit.isCoffin), isDrone: Boolean(spec.isDrone),
      hasIrst: Boolean(unit.hasIRST), hasTfr: Boolean(unit.hasTfrMasking),
      bvrAmmo, wvrAmmo, a2gAmmo, outOfBvr, maxA2ARangeKm, maxA2GRangeKm,
      ramjetRatio, irBvrRatio, arhRatio, hasGunpod, gunRangeKm, hasEnergyGun,
      useWeight, useCaution, useStealth, useLookDown, useStress, useEnergy, useBeamSpike, useWeaponTraits,
      preferredEngageKm, cobraWeight, splitSWeight, barrelWeight, zoomWeight, notchMod
    };
  }
}

window.AIFlightProfile = AIFlightProfile;
