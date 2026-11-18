/**
 * js/systems/combat/airbase.js - Multi-segment runway, takeoff roll, and parking dispatch system.
 */

class AirbaseSystem {
  static TAKEOFF_SEGMENTS = {
    'MQ-99': 1, 'MQ-101': 1, 'XQ-58A': 1, 'MQ-28': 1, 'RQ-180': 1, 'A-29B': 1, 'AKINCI': 1, 'AV-8B-PLUS': 1,
    'JAS-39E': 2, 'F-16V': 2, 'Mirage-2000': 2, 'Mirage-2000D': 2, 'Tejas-MK2': 2, 'MiG-29K': 2,
    'F-18E': 2, 'F-2A': 2, 'Rafale-C': 2, 'A-10C': 2, 'Su-25SM3': 2, 'Su-39': 2, 'MiG-27K': 2,
    'A-16': 2, 'JAGUAR-GR3': 2, 'F-16XL': 2, 'MQ-20': 2, 'Kizilelma': 2, 'X-29A': 2, 'F-35A': 2,
    'Eurofighter': 3, 'KF-21': 3, 'Su-30SM': 3, 'Su-35S': 3, 'Su-37': 3, 'Su-47': 3,
    'F-15EX': 3, 'F-15E': 3, 'F-15-SMTD': 3, 'F-14D': 3, 'J-16': 3, 'J-16D': 3, 'J-15D': 3,
    'EA-18G': 3, 'Tornado-ECR': 3, 'Tornado-GR4': 3, 'EF-111A': 3, 'Su-24M2': 3, 'Su-24MP': 3,
    'JH-7A': 3, 'F-111F': 3, 'F-117A': 3, 'F-22A': 3, 'FB-22': 3, 'Su-57': 3, 'J-20': 3,
    'Su-75': 3, 'FC-31': 3, 'J-35': 3, 'X-02S': 3, 'ADFX-01': 3, 'CFA-44': 3, 'S-70': 3,
    'XFA-36B': 3, 'EA-36': 3, 'X-40': 3, 'ADF-11F': 3, 'YF-23': 3,
    'F-22C-COFFIN': 3, 'Su-37-COFFIN': 3, 'F-15-SMT-COFFIN': 3,
    'MiG-31BM': 4, 'DARKSTAR': 4, 'B-1B': 4, 'B-52H': 4, 'Tu-160M': 4, 'B-2A': 4, 'B-21': 4, 'Su-34': 4
  };

  static getTakeoffSegments(specId) {
    if (!specId || !(specId in this.TAKEOFF_SEGMENTS)) throw new Error(`No takeoff segment requirement for "${specId}".`);
    return this.TAKEOFF_SEGMENTS[specId];
  }

  static getAirbaseRosterPool(qraDiff) {
    const pools = {
      CADET: ['F-16V', 'MiG-29K', 'Mirage-2000'],
      BUFFER: ['MiG-29K', 'Mirage-2000', 'F-16V', 'Su-30SM'],
      VETERAN: ['JAS-39E', 'F-16V', 'Su-30SM', 'Eurofighter'],
      ESCALATED: ['F-16V', 'MiG-29K', 'Su-30SM', 'Eurofighter', 'Su-35S'],
      ELITE: ['JAS-39E', 'Su-35S', 'Eurofighter', 'Rafale-C', 'MiG-31BM'],
      FORWARD: ['Rafale-C', 'Su-35S', 'J-16', 'MiG-31BM', 'F-15EX'],
      ACE: ['MiG-29K', 'Su-35S', 'Su-57', 'MiG-31BM', 'MQ-101'],
      FORTIFIED: ['JAS-39E', 'Su-57', 'J-20', 'F-15EX', 'MiG-31BM', 'MQ-101'],
      MASTER: ['Rafale-C', 'Su-57', 'F-22A', 'J-20', 'MiG-31BM', 'MQ-101'],
      LEGEND: ['F-35A', 'Su-57', 'F-22A', 'X-02S', 'MiG-31BM', 'MQ-101']
    };
    if (!qraDiff || !pools[qraDiff]) throw new Error(`Invalid QRA roster difficulty "${qraDiff}".`);
    return pools[qraDiff];
  }

  static assignAirbaseAssets(game, airbaseIds, profile, rng) {
    if (!game || !profile || typeof profile.airbaseAircraftCount !== 'number') throw new Error('Invalid game or profile in assignAirbaseAssets.');
    if (!rng || typeof rng.pick !== 'function') throw new Error('assignAirbaseAssets requires a valid PRNG instance.');
    const allUnits = game.surfaceUnits;
    if (!Array.isArray(allUnits)) throw new Error('game.surfaceUnits must be an array.');
    const pool = this.getAirbaseRosterPool(profile.qraDifficulty);
    const totalCount = profile.airbaseAircraftCount;
    const parkingNodes = allUnits.filter(u => u.team === 'hostile' && u.isAircraftParking);
    if (totalCount > 0 && parkingNodes.length === 0) throw new Error('Cannot assign aircraft without parking structures.');

    game.airbaseTimers = {};
    airbaseIds.forEach((id, idx) => { game.airbaseTimers[id] = 10.0 + idx * 9.0; });
    if (totalCount <= 0) return;

    parkingNodes.sort((a, b) => (b.isAircraftShelter ? 2 : (b.isHangar ? 1 : 0)) - (a.isAircraftShelter ? 2 : (a.isHangar ? 1 : 0)));
    for (let i = 0; i < totalCount; i++) {
      const node = parkingNodes[i % parkingNodes.length];
      const specId = rng.pick(pool);
      node.parkedAircraft.push({ specId, takeoffSegments: this.getTakeoffSegments(specId), isLead: (i === 0) });
    }
  }

  static getContiguousRuns(segments) {
    const sorted = [...segments].sort((a, b) => a.segmentIndex - b.segmentIndex);
    const runs = [];
    let cur = [];
    for (const seg of sorted) {
      if (seg.hp > 0.05) cur.push(seg);
      else if (cur.length > 0) {
        runs.push({ startIdx: cur[0].segmentIndex, endIdx: cur[cur.length - 1].segmentIndex, length: cur.length, segments: cur });
        cur = [];
      }
    }
    if (cur.length > 0) runs.push({ startIdx: cur[0].segmentIndex, endIdx: cur[cur.length - 1].segmentIndex, length: cur.length, segments: cur });
    return { runs, maxLength: runs.reduce((m, r) => Math.max(m, r.length), 0), totalIntact: sorted.filter(s => s.hp > 0.05).length };
  }

  static getAirbaseIds(game) {
    const ids = new Set();
    for (const s of game.surfaceUnits) {
      if (s.team === 'hostile' && s.isRunwaySegment && s.airbaseId) ids.add(s.airbaseId);
    }
    return Array.from(ids);
  }

  static isAirbaseNeutralized(game, airbaseId) {
    const segs = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isRunwaySegment && s.airbaseId === airbaseId);
    if (segs.length === 0) return false;
    const { maxLength } = this.getContiguousRuns(segs);
    if (maxLength < 2) return true;

    const parked = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isAircraftParking && s.airbaseId === airbaseId && s.hp > 0.05);
    const anyTakeoffCapable = parked.some(p => p.parkedAircraft.some(ac => ac.takeoffSegments <= maxLength));
    const rollingFromBase = game.hostileAircraft.some(a => a.hp > 0.05 && a.groundPhase && a.airbaseId === airbaseId);
    if (maxLength <= 2 && !anyTakeoffCapable && !rollingFromBase) return true;
    return !anyTakeoffCapable && !rollingFromBase && parked.every(p => p.parkedAircraft.length === 0) && maxLength < segs.length;
  }

  static onParkingDestroyed(unit) {
    const game = window.Game;
    if (!game || !unit.parkedAircraft || unit.parkedAircraft.length === 0) return;
    const destroyedCount = unit.parkedAircraft.length;
    unit.parkedAircraft = [];
    const bonusVp = destroyedCount * 140;
    if (game.simulation) game.simulation.logScoreEvent('friendly', bonusVp, `Destroyed ${destroyedCount} parked aircraft on ${unit.name}`);
    if (game.inspection && game.inspection.enabled) {
      game.inspection.recordEvent('PARKED JET DESTROYED', `${destroyedCount} stored QRA jet(s) destroyed on ${unit.name}`, null, unit, { destroyedCount, bonusVp, airbaseId: unit.airbaseId });
    }
    if (game.radar) {
      game.radar.spawnCombatText(unit.x, unit.y, `${destroyedCount} PARKED JETS DESTROYED (+${bonusVp} VP)`, '#00f5a0');
      game.radar.spawnExplosionFX(unit.x, unit.y, true);
    }
  }

  static equipQraLoadout(ac, qraDifficulty, fullAmmo) {
    if (ac.maxPylonRating === 'Type S' || ac.spec.isDrone) {
      if (!ac.installWeapon('MAM', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL')) throw new Error(`Failed to install MAM on "${ac.spec.id}".`);
      if (fullAmmo && !ac.installWeapon('AIM-9X-2', ac.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL')) throw new Error(`Failed to install AIM-9X-2 on "${ac.spec.id}".`);
      return;
    }
    if (!ac.installWeapon('AIM-120D', ac.internalSlots >= 2 ? 'INTERNAL' : 'EXTERNAL')) throw new Error(`Failed to install AIM-120D on "${ac.spec.id}".`);
    if (fullAmmo) {
      const wvrStation = (ac.internalSlots - ac.getUsedInternalSlots() >= 1) ? 'INTERNAL' : 'EXTERNAL';
      if (!ac.installWeapon('AIM-9X-2', wvrStation)) throw new Error(`Failed to install AIM-9X-2 on "${ac.spec.id}".`);
      if (ac.externalSlots >= 4 && !['CADET', 'BUFFER'].includes(qraDifficulty)) {
        if (!ac.installWeapon('METEOR', 'EXTERNAL')) throw new Error(`Failed to install METEOR on "${ac.spec.id}".`);
      }
    }
  }

  static updateAirbases(game, dt, profile, doctrine) {
    if (!profile || typeof profile.dispersalAlertKm !== 'number' || typeof profile.takeoffIntervalSec !== 'number') {
      throw new Error('Invalid profile in AirbaseSystem.updateAirbases.');
    }
    const docProfile = window.ATTACK_DOCTRINES && window.ATTACK_DOCTRINES[doctrine];
    if (!docProfile) throw new Error(`Invalid attack doctrine "${doctrine}" in AirbaseSystem.updateAirbases.`);

    this.updateGroundOperations(game, dt);
    if (!game.airbaseTimers) throw new Error('game.airbaseTimers must be initialized prior to updateAirbases.');

    const airbaseIds = this.getAirbaseIds(game);
    const c2Alive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isCommandNode && s.hp > 0.05);
    const liveAllies = game.alliedAircraft.filter(a => a.hp > 0.05);

    for (const abId of airbaseIds) {
      if (typeof game.airbaseTimers[abId] !== 'number') throw new Error(`Missing airbase timer for "${abId}".`);
      const segs = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isRunwaySegment && s.airbaseId === abId);
      const runInfo = this.getContiguousRuns(segs);
      if (runInfo.maxLength <= 0) continue;

      const parking = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isAircraftParking && s.airbaseId === abId && s.hp > 0.05 && s.parkedAircraft.length > 0);
      if (parking.length === 0) continue;

      const centerSeg = segs[Math.floor(segs.length / 2)];
      const fuelAlive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isFuelDepot && s.hp > 0.05 && Math.hypot(s.x - centerSeg.x, s.y - centerSeg.y) <= 55.0);
      const hasFuelNearby = game.surfaceUnits.some(s => s.team === 'hostile' && s.isFuelDepot && Math.hypot(s.x - centerSeg.x, s.y - centerSeg.y) <= 55.0);
      const fuelMult = (hasFuelNearby && !fuelAlive) ? 1.35 : 1.0;

      const logisticsAlive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isLogisticsHub && s.hp > 0.05 && Math.hypot(s.x - centerSeg.x, s.y - centerSeg.y) <= 65.0);
      const logisticsMult = logisticsAlive ? 0.82 : 1.0;

      const threatClose = liveAllies.some(a => Math.hypot(a.x - centerSeg.x, a.y - centerSeg.y) <= profile.dispersalAlertKm);
      const openFieldsReady = parking.some(p => p.isOpenField && p.parkedAircraft.some(ac => ac.takeoffSegments <= runInfo.maxLength));
      const dispersalSpeedup = (threatClose && openFieldsReady) ? 0.50 : 1.0;

      const docMult = docProfile.takeoffIntervalMult * (c2Alive ? 1.0 : 1.40);
      game.airbaseTimers[abId] -= (dt / (fuelMult * logisticsMult * docMult * dispersalSpeedup));
      if (game.airbaseTimers[abId] > 0) continue;

      const pairChance = Math.min(0.95, Math.max(0, profile.scramblePairChance + docProfile.scramblePairBonus));
      const launchCount = (Math.random() < pairChance) ? 2 : 1;
      let launched = 0;
      for (let k = 0; k < launchCount; k++) {
        if (this.dispatchNextAircraft(game, abId, parking, runInfo.runs, profile)) launched++;
      }
      if (launched > 0) game.airbaseTimers[abId] = profile.takeoffIntervalSec;
    }
  }

  static dispatchNextAircraft(game, abId, parkingNodes, runs, profile) {
    parkingNodes.sort((a, b) => (a.isOpenField ? -1 : (a.isHangar ? 0 : 1)) - (b.isOpenField ? -1 : (b.isHangar ? 0 : 1)));
    const maxLen = runs.reduce((m, r) => Math.max(m, r.length), 0);

    let chosenNode = null, chosenIdx = -1, chosenRun = null;
    for (const node of parkingNodes) {
      const acIdx = node.parkedAircraft.findIndex(ac => ac.takeoffSegments <= maxLen);
      if (acIdx !== -1) {
        chosenNode = node; chosenIdx = acIdx;
        chosenRun = runs.find(r => r.length >= node.parkedAircraft[acIdx].takeoffSegments);
        break;
      }
    }
    if (!chosenNode || !chosenRun) return false;

    const acDef = chosenNode.parkedAircraft.splice(chosenIdx, 1)[0];
    const startSeg = chosenRun.segments[0], endSeg = chosenRun.segments[acDef.takeoffSegments - 1];
    const rollRefSeg = chosenRun.segments.find(s => s !== startSeg);
    const rollHdg = rollRefSeg ? Math.atan2(rollRefSeg.y - startSeg.y, rollRefSeg.x - startSeg.x) : startSeg.heading;
    if (!Number.isFinite(rollHdg)) throw new Error(`Invalid runway roll heading computed for "${abId}".`);

    const ac = new Aircraft(acDef.specId, 'hostile', chosenNode.x, chosenNode.y, Math.atan2(startSeg.y - chosenNode.y, startSeg.x - chosenNode.x), null, `QRA-${window.PRNG.int(10, 99)}`, 'Airbase QRA Wing', acDef.isLead, false, 1000);
    ac.altFt = 0; ac.alt = 0; ac.speed = 0.14; ac.groundPhase = 'TAXI'; ac.airbaseId = abId;
    ac.takeoffSegmentsReq = acDef.takeoffSegments; ac.taxiTargetSeg = startSeg; ac.rollEndSeg = endSeg;
    ac.rollHeading = rollHdg; ac.rollSegs = chosenRun.segments.slice(0, acDef.takeoffSegments);

    const hasMunitionNearby = game.surfaceUnits.some(s => s.team === 'hostile' && s.isMunitionDepot && Math.hypot(s.x - startSeg.x, s.y - startSeg.y) <= 65.0);
    const munitionAlive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isMunitionDepot && s.hp > 0.05 && Math.hypot(s.x - startSeg.x, s.y - startSeg.y) <= 65.0);
    this.equipQraLoadout(ac, profile.qraDifficulty, !hasMunitionNearby || munitionAlive);
    ac.tacticalRole = 'INTERCEPT';
    ac.recalculateWeight();
    game.hostileAircraft.push(ac);
    if (game.inspection && game.inspection.enabled) {
      game.inspection.recordEvent('QRA TAXI', `${window.formatAircraftDisplayName(ac)} taxiing from ${chosenNode.name}`, ac, chosenNode, { airbaseId: abId, takeoffSegmentsRequired: acDef.takeoffSegments, fullAmmo: !hasMunitionNearby || munitionAlive });
    }
    if (game.radar) game.radar.spawnCombatText(chosenNode.x, chosenNode.y, `TAXIING: ${ac.spec.id} (${acDef.takeoffSegments} SEG)`, '#fbbf24');
    return true;
  }

  static updateGroundOperations(game, dt) {
    for (const ac of game.hostileAircraft) {
      if (!ac || ac.hp <= 0.05 || !ac.groundPhase) continue;
      if (ac.groundPhase === 'TAXI') {
        const tgt = ac.taxiTargetSeg;
        if (!tgt || tgt.hp <= 0.05) {
          ac.hp = 0;
          if (game.inspection && game.inspection.enabled) {
            game.inspection.recordEvent('RUNWAY CRASH', `${window.formatAircraftDisplayName(ac)} aborted taxi on cratered runway`, ac, tgt || null, { airbaseId: ac.airbaseId, phase: 'TAXI' });
          }
          if (game.radar) game.radar.spawnCombatText(ac.x, ac.y, 'RUNWAY CRATERED - TAXI ABORT', '#f43f5e');
          continue;
        }
        const dx = tgt.x - ac.x, dy = tgt.y - ac.y;
        ac.heading = Math.atan2(dy, dx); ac.speed = 0.14; ac.altFt = 0;
        if (Math.hypot(dx, dy) <= 0.8) {
          ac.groundPhase = 'TAKEOFF'; ac.heading = ac.rollHeading; ac.speed = 0.25;
          if (game.inspection && game.inspection.enabled) {
            game.inspection.recordEvent('QRA TAKEOFF ROLL', `${window.formatAircraftDisplayName(ac)} began takeoff roll on ${ac.airbaseId}`, ac, tgt, { airbaseId: ac.airbaseId, takeoffSegmentsRequired: ac.takeoffSegmentsReq });
          }
          if (game.radar) game.radar.spawnCombatText(ac.x, ac.y, `TAKEOFF ROLL: ${ac.spec.id}`, '#f43f5e');
        }
      } else if (ac.groundPhase === 'TAKEOFF') {
        if (ac.rollSegs.some(s => !s || s.hp <= 0.05)) {
          ac.hp = 0;
          if (game.radar) { game.radar.spawnExplosionFX(ac.x, ac.y, false); game.radar.spawnCombatText(ac.x, ac.y, 'TAKEOFF CRASH (CRATERED)', '#00f5a0'); }
          if (game.simulation) game.simulation.recordKillEvent('friendly', ac, null, { weapon: { name: 'Runway Denial' } });
          continue;
        }
        ac.heading = ac.rollHeading; ac.speed = Math.min(0.75, ac.speed + 0.25 * dt); ac.altFt = 0;
        const end = ac.rollEndSeg;
        const passedEnd = !end || Math.hypot(end.x - ac.x, end.y - ac.y) <= 1.5 || ((end.x - ac.x) * Math.cos(ac.rollHeading) + (end.y - ac.y) * Math.sin(ac.rollHeading) <= 0);
        if (ac.speed >= 0.58 && passedEnd) {
          ac.groundPhase = null; ac.altFt = 2500; ac.targetAltFt = 24000; ac.speed = Math.max(0.68, ac.getTargetMach());
          if (game.inspection && game.inspection.enabled) {
            game.inspection.recordEvent('QRA AIRBORNE', `${window.formatAircraftDisplayName(ac)} airborne from ${ac.airbaseId}`, ac, null, { airbaseId: ac.airbaseId, speedMach: ac.speed, altitudeFt: ac.altFt });
          }
          if (game.radar) game.radar.spawnCombatText(ac.x, ac.y, `AIRBORNE: ${ac.spec.id}`, '#f43f5e');
        }
      }
    }
  }
}

window.AirbaseSystem = AirbaseSystem;
