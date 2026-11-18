/**
 * AIRSPACE STANDOFF: Procedural Attack Theater Generator (240km x 160km)
 * Deploys spatially separated IADS layers and multi-segment 5-point Runways proportional to difficulty.
 */

class AttackTheaterGenerator {
  static requirePool(pool, count, poolName, diffKey) {
    if (typeof count !== 'number' || Number.isNaN(count) || count < 0) {
      throw new Error(`Invalid count "${count}" for "${poolName}" on "${diffKey}".`);
    }
    if (count > 0 && (!Array.isArray(pool) || pool.length === 0)) {
      throw new Error(`Empty unit pool "${poolName}" when count is ${count} on "${diffKey}".`);
    }
    return count;
  }

  static generate(game, diffKey, doctrineKey) {
    if (!game) throw new Error('AttackTheaterGenerator.generate requires game instance.');
    if (!window.ATTACK_DIFFICULTIES || !window.ATTACK_DIFFICULTIES[diffKey]) {
      throw new Error(`Invalid attack difficulty "${diffKey}" in AttackTheaterGenerator.generate.`);
    }
    if (!window.ATTACK_DOCTRINES || !window.ATTACK_DOCTRINES[doctrineKey]) {
      throw new Error(`Invalid attack doctrine "${doctrineKey}" in AttackTheaterGenerator.generate.`);
    }
    if (!window.CONFIG || typeof window.CONFIG.ATTACK_WIDTH_KM !== 'number' || typeof window.CONFIG.ATTACK_HEIGHT_KM !== 'number') {
      throw new Error('ATTACK_WIDTH_KM and ATTACK_HEIGHT_KM must be configured in window.CONFIG.');
    }

    const profile = window.ATTACK_DIFFICULTIES[diffKey];
    const rng = window.PRNG.create((Date.now() ^ ((performance.now() * 1000) | 0)) >>> 0);
    const mapW = window.CONFIG.ATTACK_WIDTH_KM;
    const mapH = window.CONFIG.ATTACK_HEIGHT_KM;

    const units = [
      new SurfaceUnit('AMMO_DUMP', 'friendly', 28, mapH * 0.5),
      new SurfaceUnit('RADAR_ARRAY', 'friendly', 16, mapH * 0.5 - 16)
    ];

    const primaryObjectives = [];
    const addUnit = (type, x, y, opts = {}) => {
      const clampedX = Math.max(72, Math.min(mapW - 10, x));
      const clampedY = Math.max(12, Math.min(mapH - 12, y));
      const unit = new SurfaceUnit(type, 'hostile', clampedX, clampedY, opts);
      units.push(unit);
      if (opts.isPrimaryObjective) primaryObjectives.push(unit);
      return unit;
    };

    const placeFree = (minX, maxX, minY, maxY, minDist = 9.0) => {
      const loX = Math.min(minX, maxX), hiX = Math.max(minX, maxX);
      const loY = Math.min(minY, maxY), hiY = Math.max(minY, maxY);
      let bestPt = null, bestMinDist = -1;
      for (let attempt = 0; attempt < 28; attempt++) {
        const cx = rng.range(loX, hiX);
        const cy = rng.range(loY, hiY);
        const nearest = units.reduce((m, u) => Math.min(m, Math.hypot(u.x - cx, u.y - cy)), 9999);
        if (nearest >= minDist) return { x: cx, y: cy };
        if (nearest > bestMinDist) { bestMinDist = nearest; bestPt = { x: cx, y: cy }; }
      }
      return bestPt;
    };

    const objCount = profile.primaryObjectiveCount;
    if (typeof objCount !== 'number' || objCount <= 0) {
      throw new Error(`Invalid primaryObjectiveCount "${objCount}" on "${diffKey}".`);
    }
    const rearMaxX = (objCount <= 3) ? (mapW - 44) : (mapW - 14);
    const c2Count = (objCount >= 7) ? 3 : ((objCount >= 5) ? 2 : 1);
    const citadelYs = [mapH * 0.5, mapH * 0.28, mapH * 0.72];

    for (let i = 0; i < c2Count; i++) {
      const pt = placeFree(rearMaxX - 24, rearMaxX, citadelYs[i % citadelYs.length] - 10, citadelYs[i % citadelYs.length] + 10, 14.0);
      addUnit('BUNKER', pt.x, pt.y, { isPrimaryObjective: true });
    }

    const airbaseIds = [];
    const runwayAnchors = [];
    const runwayCount = profile.runwayCount;
    if (typeof runwayCount !== 'number' || runwayCount < 0) throw new Error(`Invalid runwayCount "${runwayCount}" on "${diffKey}".`);
    const runwaySlots = [mapH * 0.26, mapH * 0.74, mapH * 0.50];
    const segCount = 5;
    const segStepKm = 3.4;

    for (let r = 0; r < runwayCount; r++) {
      const abId = `AB_${r + 1}`;
      airbaseIds.push(abId);
      const centerX = (objCount <= 3 ? mapW - 76 : mapW - rng.range(56, 86));
      const centerY = (runwayCount === 1 ? mapH * 0.50 : runwaySlots[r % runwaySlots.length]) + rng.range(-6, 6);
      const stripAngle = rng.range(-0.14, 0.14);
      const makeObj = primaryObjectives.length < objCount;

      runwayAnchors.push({ abId, baseNum: r + 1, centerX, centerY });

      for (let s = 0; s < segCount; s++) {
        const offset = (s - (segCount - 1) / 2) * segStepKm;
        const sx = centerX + Math.cos(stripAngle) * offset;
        const sy = centerY + Math.sin(stripAngle) * offset;
        const segUnit = addUnit('RUNWAY_SEG', sx, sy, {
          airbaseId: abId, segmentIndex: s, totalSegments: segCount,
          heading: stripAngle, customName: `Runway ${r + 1} Seg ${s + 1}/5`,
          isPrimaryObjective: (s === 2 && makeObj)
        });
        if (s === 2 && makeObj) segUnit.isAirbaseObjectiveAnchor = true;
      }
    }

    if (runwayAnchors.length > 0) {
      for (let f = 0; f < profile.openFieldCount; f++) {
        const anchor = runwayAnchors[f % runwayAnchors.length];
        const tierOffset = Math.floor(f / runwayAnchors.length);
        addUnit('OPEN_FIELD', anchor.centerX + (tierOffset * 6) + rng.range(-2, 2), anchor.centerY + (f % 2 === 0 ? -7.5 : 7.5), {
          airbaseId: anchor.abId, customName: `Airbase ${anchor.baseNum} Open Field ${f + 1}`
        });
      }
      for (let h = 0; h < profile.hangarCount; h++) {
        const anchor = runwayAnchors[h % runwayAnchors.length];
        const tierOffset = Math.floor(h / runwayAnchors.length);
        addUnit('HANGAR', anchor.centerX - 6 + tierOffset * 6, anchor.centerY + 6.5, {
          airbaseId: anchor.abId, customName: `Airbase ${anchor.baseNum} Hangar ${h + 1}`
        });
      }
      for (let hs = 0; hs < profile.hasCount; hs++) {
        const anchor = runwayAnchors[hs % runwayAnchors.length];
        const tierOffset = Math.floor(hs / runwayAnchors.length);
        addUnit('HARDENED_SHELTER', anchor.centerX - 5 + tierOffset * 6, anchor.centerY - 6.5, {
          airbaseId: anchor.abId, customName: `Airbase ${anchor.baseNum} Shelter ${hs + 1}`,
          isPrimaryObjective: primaryObjectives.length < objCount
        });
      }
    }

    const infraTypes = ['FACTORY_SAM', 'BRIDGE_LOGISTICS'];
    for (let k = 0; k < profile.infraCount; k++) {
      const pt = placeFree(125, rearMaxX - 24, 24, mapH - 24, 14.0);
      addUnit(infraTypes[k % infraTypes.length], pt.x, pt.y, { isPrimaryObjective: primaryObjectives.length < objCount });
    }

    while (primaryObjectives.length < objCount) {
      const pt = placeFree(rearMaxX - 35, rearMaxX, 28, mapH - 28, 14.0);
      addUnit('BUNKER', pt.x, pt.y, { isPrimaryObjective: true });
    }

    const forwardYAnchors = [mapH * 0.22, mapH * 0.50, mapH * 0.78];
    const mrCount = this.requirePool(profile.mrSamPool, profile.mrSamCount, 'mrSamPool', diffKey);
    for (let m = 0; m < mrCount; m++) {
      const mType = rng.pick(profile.mrSamPool);
      const baseY = forwardYAnchors[m % 3];
      const pt = placeFree(m < 2 ? 86 : 128, m < 2 ? 124 : rearMaxX - 20, Math.max(18, baseY - 14), Math.min(mapH - 18, baseY + 14), 11.0);
      addUnit(mType, pt.x, pt.y);
    }

    const lrCount = this.requirePool(profile.lrSamPool, profile.lrSamCount, 'lrSamPool', diffKey);
    for (let l = 0; l < lrCount; l++) {
      const lType = rng.pick(profile.lrSamPool);
      const baseY = (l === 0 ? mapH * 0.5 : (l === 1 ? mapH * 0.28 : mapH * 0.72));
      const pt = placeFree(148, rearMaxX - 10, Math.max(20, baseY - 12), Math.min(mapH - 20, baseY + 12), 16.0);
      addUnit(lType, pt.x, pt.y);
    }

    const ewCount = this.requirePool(profile.ewRadarPool, profile.ewRadarCount, 'ewRadarPool', diffKey);
    for (let e = 0; e < ewCount; e++) {
      const eType = rng.pick(profile.ewRadarPool);
      const pt = placeFree(e === 0 ? 92 : 140, e === 0 ? 126 : rearMaxX - 8, 22, mapH - 22, 12.0);
      addUnit(eType, pt.x, pt.y);
    }

    for (let c = 0; c < profile.commsCount; c++) { const pt = placeFree(118, rearMaxX - 18, 24, mapH - 24, 10.0); addUnit('COMMS_TOWER', pt.x, pt.y); }
    for (let p = 0; p < profile.powerCount; p++) { const pt = placeFree(115, rearMaxX - 15, 24, mapH - 24, 10.0); addUnit('POWER_SUBSTATION', pt.x, pt.y); }
    for (let j = 0; j < profile.jammerCount; j++) { const pt = placeFree(112, rearMaxX - 18, 25, mapH - 25, 12.0); addUnit('EW_JAMMER_GROUND', pt.x, pt.y); }
    for (let el = 0; el < profile.elintCount; el++) { const pt = placeFree(125, rearMaxX - 15, 22, mapH - 22, 11.0); addUnit('EW_STATION_ELINT', pt.x, pt.y); }
    for (let f = 0; f < profile.fuelCount; f++) { const pt = placeFree(108, rearMaxX - 16, 22, mapH - 22, 10.0); addUnit('FUEL_DEPOT', pt.x, pt.y); }
    for (let md = 0; md < profile.munitionCount; md++) { const pt = placeFree(118, rearMaxX - 16, 22, mapH - 22, 10.0); addUnit('MUNITION_DUMP', pt.x, pt.y); }

    const srCount = this.requirePool(profile.srSamPool, profile.srSamCount, 'srSamPool', diffKey);
    for (let s = 0; s < srCount; s++) {
      const anchor = primaryObjectives[s % primaryObjectives.length];
      const pt = placeFree(Math.max(76, anchor.x - 14), Math.min(mapW - 12, anchor.x + 10), Math.max(14, anchor.y - 12), Math.min(mapH - 14, anchor.y + 12), 7.0);
      addUnit(rng.pick(profile.srSamPool), pt.x, pt.y);
    }

    const ciwsCount = this.requirePool(profile.ciwsPool, profile.ciwsCount, 'ciwsPool', diffKey);
    for (let ci = 0; ci < ciwsCount; ci++) {
      const anchor = primaryObjectives[ci % primaryObjectives.length];
      const pt = placeFree(Math.max(76, anchor.x - 9), Math.min(mapW - 12, anchor.x + 9), Math.max(14, anchor.y - 9), Math.min(mapH - 14, anchor.y + 9), 6.5);
      addUnit(rng.pick(profile.ciwsPool), pt.x, pt.y);
    }

    const aaaCount = this.requirePool(profile.aaaPool, profile.aaaCount, 'aaaPool', diffKey);
    for (let aa = 0; aa < aaaCount; aa++) {
      const pt = placeFree((aa < 2) ? 80 : 124, (aa < 2) ? 120 : rearMaxX - 10, 18, mapH - 18, 8.5);
      addUnit(rng.pick(profile.aaaPool), pt.x, pt.y);
    }

    const extraDecoys = (doctrineKey === 'AMBUSH_IADS') ? 1 : 0;
    for (let d = 0; d < profile.decoyCount + extraDecoys; d++) {
      const pt = placeFree(78, 175, 20, mapH - 20, 9.0);
      addUnit('RADAR_DECOY', pt.x, pt.y);
    }

    if (profile.lrSamCount >= 2 || profile.ewRadarCount >= 3) {
      const pt = placeFree(132, 175, mapH * 0.35, mapH * 0.65, 11.0);
      addUnit('C2_MOBILE', pt.x, pt.y);
    }

    game.surfaceUnits = units;
    AirbaseSystem.assignAirbaseAssets(game, airbaseIds, profile, rng);
  }
}

window.AttackTheaterGenerator = AttackTheaterGenerator;
