/**
 * AIRSPACE STANDOFF: Inspection Telemetry & Sensor Dynamics Engine
 * Onboard radar suite, ground recon models, TFR masking, VHF counter-stealth, and live updates.
 */

class InspectionTelemetry {
  static getSensorRecord(scanner, target, game) {
    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const baseRangeKm = scanner.spec ? (scanner.spec.R_0 !== undefined ? scanner.spec.R_0 : scanner.rangeKm) : (scanner.rangeKm || 48);
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const distanceKm = Math.hypot(target.x - scanner.x, target.y - scanner.y);

    const angleToTarget = Math.atan2(target.y - scanner.y, target.x - scanner.x);
    let offBoresight = Math.abs((scanner.heading !== undefined ? scanner.heading : 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const halfConeDeg = Math.round(((scanner.spec && scanner.spec.radarConeDeg ? scanner.spec.radarConeDeg : 360) / 2));
    const inCone = scanner.heading === undefined || !scanner.spec || !scanner.spec.radarConeDeg || scanner.spec.radarConeDeg >= 360 || (offBoresightDeg <= halfConeDeg);

    const cloudHits = Physics.countIntersectingClouds(scanner.x, scanner.y, target.x, target.y, clouds);
    const forwardRangeKm = Physics.getRadarMaxDetectionRange(Object.assign({}, scanner, { heading: angleToTarget }), target, clouds);
    const rangeKm = inCone ? Physics.getRadarMaxDetectionRange(scanner, target, clouds) : 0.0;

    let aspectAngleDeg = 0, aspectMultiplier = 1.0, targetAspect = 'Nose-on';
    if (typeof target.heading === 'number' && !isNaN(target.heading)) {
      let aspectOffNose = Math.abs(target.heading - Math.atan2(scanner.y - target.y, scanner.x - target.x));
      while (aspectOffNose > Math.PI) aspectOffNose = Math.abs(aspectOffNose - Math.PI * 2);
      aspectAngleDeg = Math.round(aspectOffNose * 180 / Math.PI);
      if (aspectOffNose >= 1.0 && aspectOffNose <= 2.1) {
        let spike = target.spec && target.spec.beamSpike !== undefined ? target.spec.beamSpike : 3.2;
        if (target.beamSpikeReduction) spike = 1 + (spike - 1) * (1 - target.beamSpikeReduction);
        aspectMultiplier = spike;
        targetAspect = `Beam (${aspectAngleDeg}${sDeg}, +${Math.round((aspectMultiplier - 1) * 100)}% Spike)`;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
        targetAspect = `Tail (${aspectAngleDeg}${sDeg}, +80% Bloom)`;
      } else {
        targetAspect = `Nose (${aspectAngleDeg}${sDeg}, Clean Profile)`;
      }
    }

    const groundJamImpact = Physics.getGroundJammingImpact(target, scanner);
    const totalJamming = Math.max(target.jamEfficiency || 0, groundJamImpact);
    const eccmMitigation = scanner.hasECCM ? (scanner.eccmBonus || 0.60) : 0.0;
    const vhfMult = scanner.counterStealthMult || (scanner.spec && scanner.spec.counterStealthMult) || 1.0;
    const tfrMasked = Boolean(target.hasTfrMasking && target.altFt < 13000 && (target.alt || 0.5) < 0.20);
    const belowFloor = Boolean(scanner.spec && scanner.spec.minDetectAltFt && typeof target.altFt === 'number' && target.altFt < scanner.spec.minDetectAltFt);
    const irstBurnThrough = Boolean(scanner.hasIRST && distanceKm <= 28.0);
    const isEmcon = Boolean(scanner.emconTimer > 0);

    const detects = inCone && rangeKm > 0 && distanceKm <= rangeKm;
    const marginKm = rangeKm - distanceKm;
    const baseRcs = target.spec ? (target.spec.sigma_0 || 1.0) : (target.effectiveRcs || 1.0);
    const effectiveRcs = target.effectiveRcs !== undefined ? target.effectiveRcs : baseRcs;
    const rcsRatio = Math.pow(Math.max(0.0001, effectiveRcs * aspectMultiplier), 0.25);

    return {
      scanner, target, rangeKm, baseRangeKm, forwardRangeKm, distanceKm, detects, inCone,
      cloudHits, offBoresightDeg, halfConeDeg, targetAspect, aspectMultiplier, aspectAngleDeg,
      marginKm, effectiveRcs, rcsRatio, totalJamming, eccmMitigation, vhfMult,
      tfrMasked, belowFloor, irstBurnThrough, isEmcon
    };
  }

  static getGroundReconRecord(aircraft, s) {
    const distanceKm = Math.hypot(s.x - aircraft.x, s.y - aircraft.y);
    const esmReachKm = aircraft.hasHtsPod ? 155.0 : (aircraft.hasESM ? 135.0 : 105.0);
    const esmDetects = Boolean(s.isEmitter && s.emconTimer <= 0 && distanceKm <= esmReachKm);

    const tgpRange = aircraft.targetingSpotRangeKm || (aircraft.hasIRST ? 30.0 : 0.0);
    const needsAdvancedTgp = Boolean(s.spec && s.spec.requiresHighGradeTgp);
    const opticalCloseRange = needsAdvancedTgp ? 15.0 : 22.0;
    const effectiveTgpRange = (needsAdvancedTgp && tgpRange < 44.0) ? 0.0 : tgpRange;
    const tgpReachKm = Math.max(opticalCloseRange, effectiveTgpRange);
    const tgpDetects = distanceKm <= tgpReachKm;

    const sarReachKm = (!s.isGroundDecoy && aircraft.spec && aircraft.spec.R_0) ? (aircraft.spec.R_0 * 0.72) : 0.0;
    const sarDetects = sarReachKm > 0 && distanceKm <= sarReachKm;

    return {
      surface: s, distanceKm, esmReachKm, esmDetects, tgpReachKm, tgpDetects,
      sarReachKm, sarDetects, needsAdvancedTgp,
      detects: esmDetects || tgpDetects || sarDetects || Boolean(s.isRevealedToBlue),
      identifies: tgpDetects || sarDetects || (esmDetects && aircraft.hasHtsPod && distanceKm <= 130.0) || Boolean(s.identifiedByBlue)
    };
  }

  static getSurfaceVsAirRecord(s, ac, game, mods) {
    const distanceKm = Math.hypot(ac.x - s.x, ac.y - s.y);
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const activeFloor = (s.canAttack && mods && mods.hasLowAltCue) ? s.cuedMinAltFt : (s.minAltFt || s.spec.minDetectAltFt || 1000);
    const tfrBonus = (s.canAttack && ac.hasTfrMasking && ac.altFt <= 10000) ? ac.tfrFloorBonusFt : 0;
    const effFloor = activeFloor + tfrBonus;
    const belowFloor = ac.altFt < activeFloor;
    const tfrMasked = !belowFloor && (ac.altFt < effFloor);

    let effRangeKm = s.rangeKm || 0;
    let detects = false;
    let reason = '';

    if (s.emconTimer > 0) {
      reason = `Emitter in EMCON shutdown (${s.emconTimer.toFixed(1)}s remaining).`;
    } else if (s.isPassiveElint) {
      detects = (ac.spec.R_0 > 0) && distanceKm <= effRangeKm;
      reason = detects ? 'Passive ELINT receiving active aircraft radar emissions (immune to ARMs).' : 'Aircraft outside 95 km passive ELINT reach.';
    } else if (s.isJammerStation) {
      detects = distanceKm <= effRangeKm;
      reason = detects ? `Aircraft inside ${Math.round(s.jamEfficiency * 100)}% broadband jamming umbrella.` : 'Aircraft outside jamming perimeter.';
    } else if (s.category === 'EW_RADAR' || s.type === 'RADAR_ARRAY' || s.type === 'RADAR_VAN') {
      effRangeKm = Physics.getRadarMaxDetectionRange(s, ac, clouds);
      detects = effRangeKm > 0 && distanceKm <= effRangeKm;
      reason = belowFloor ? `Aircraft flying below ${activeFloor.toLocaleString()} ft EW floor.` : (detects ? `Tracking aircraft (VHF ${s.counterStealthMult}x counter-stealth).` : 'Aircraft beyond radar horizon.');
    } else if (s.canAttack && s.missileSpec) {
      const ewMult = (s.requiresEwCue && game.scenarioMode === 'ATTACK' && mods && !mods.hasEwCue) ? 0.48 : 1.0;
      const rcsFactor = Math.max(0.45, Math.min(1.15, Math.pow(Math.max(0.0005, ac.effectiveRcs), 0.16)));
      effRangeKm = s.rangeKm * ewMult * (mods ? mods.ambushRatio : 1.0) * rcsFactor;
      detects = !belowFloor && !tfrMasked && distanceKm <= effRangeKm;
      reason = tfrMasked ? 'TFR Terrain Masking (+2,500 ft floor) hides aircraft from SAM lock.' : (belowFloor ? `Aircraft below ${activeFloor.toLocaleString()} ft SAM floor.` : (detects ? 'Aircraft inside active SAM launch gate.' : 'Aircraft outside SAM engagement gate.'));
    } else if (s.isAaaGun) {
      effRangeKm = s.aaaRangeKm || s.rangeKm;
      detects = ac.altFt <= s.aaaMaxAltFt && distanceKm <= effRangeKm;
      reason = ac.altFt > s.aaaMaxAltFt ? `Aircraft above ${s.aaaMaxAltFt.toLocaleString()} ft AAA ceiling.` : (detects ? 'Aircraft inside optical/radar AAA flak envelope.' : 'Aircraft outside AAA slant range.');
    } else {
      reason = 'Passive facility without active sensor array.';
    }

    return { distanceKm, effRangeKm, detects, belowFloor, tfrMasked, reason };
  }

  static renderMissileSeekerDashboard(controller, missile) {
    return InspectionRadarView.renderMissileSeekerDashboard(controller, missile);
  }

  static renderRadarDashboard(controller, selectedEntity) {
    return InspectionRadarView.renderRadarDashboard(controller, selectedEntity);
  }

  static updateLive(controller, selectedEntity, content) {
    if (!selectedEntity || !content || controller.isMissile(selectedEntity)) return;
    if (controller.isSurface(selectedEntity)) {
      InspectionSurfaceRadarRenderer.updateLiveSurfaceSensors(controller, selectedEntity, content);
      return;
    }

    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const sDot = window.INSP_SVG ? window.INSP_SVG.dot : '';
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = selectedEntity.team === commanderTeam;
    const activeLock = selectedEntity.radarLockedTarget;

    const targetsOrScanners = isFriendly
      ? (game.hostileAircraft || []).filter(u => u && u.hp > 0.05)
      : [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly' && (s.category === 'EW_RADAR' || s.type === 'RADAR_ARRAY' || s.type === 'S-400')))].filter(u => u && u.hp > 0.05);

    let detectedCount = 0;
    targetsOrScanners.forEach(unit => {
      const acc = content.querySelector(`[data-accordion-id="sensor-${unit.id}"]`);
      if (!acc) return;
      const rec = isFriendly ? this.getSensorRecord(selectedEntity, unit, game) : this.getSensorRecord(unit, selectedEntity, game);
      if (rec.detects) detectedCount++;

      const titleSub = acc.querySelector('.sensor-sub');
      if (titleSub) titleSub.innerHTML = `Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} ${sDot} ${rec.targetAspect}`;

      const isLocked = isFriendly
        ? Boolean(rec.detects && activeLock && activeLock.id === rec.target.id)
        : Boolean(rec.detects && unit.radarLockedTarget && unit.radarLockedTarget.id === selectedEntity.id);

      let statusClass = 'negative', statusText = `OFF-BORESIGHT (${rec.offBoresightDeg}${sDeg})`;
      if (rec.isEmcon) { statusClass = 'neutral'; statusText = 'EMCON SILENT'; }
      else if (rec.belowFloor) { statusClass = 'positive'; statusText = 'BELOW FLOOR'; }
      else if (rec.inCone) {
        if (isLocked) { statusClass = 'positive'; statusText = 'PRIMARY LOCK'; }
        else if (rec.detects) { statusClass = rec.marginKm < 15 ? 'warning' : 'positive'; statusText = rec.marginKm < 15 ? 'MARGINAL TRACK' : 'IN BEAM (TRACKED)'; }
        else statusText = 'IN CONE (OUT OF RANGE)';
      }

      const badge = acc.querySelector('.inspection-accordion-meta .factor-delta');
      if (badge) { badge.className = `factor-delta ${statusClass}`; badge.innerHTML = statusText; }
      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) { fill.style.width = `${Math.min(100, ((rec.inCone ? rec.rangeKm : rec.forwardRangeKm) / theaterW) * 100)}%`; fill.classList.toggle('detecting', rec.detects); }
      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (rec.distanceKm / theaterW) * 100)}%`;
      const distVal = acc.querySelector('.sensor-dist-val b');
      if (distVal) distVal.textContent = `${rec.distanceKm.toFixed(1)} km`;
      const reachVal = acc.querySelector('.sensor-reach-val');
      if (reachVal) reachVal.innerHTML = rec.inCone ? `Radar Reach: <b>${rec.rangeKm.toFixed(1)} km</b>` : `Forward Reach: <b>${rec.forwardRangeKm.toFixed(1)} km (Blind)</b>`;
      const marginVal = acc.querySelector('.sensor-margin-val');
      if (marginVal) {
        marginVal.innerHTML = !rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}${sDeg})` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`);
        marginVal.style.color = rec.detects ? (rec.marginKm < 15 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)') : 'var(--stat-tier-5)';
      }
    });

    const activeLockVal = content.querySelector('.sensor-active-lock-val');
    if (activeLockVal) {
      activeLockVal.textContent = activeLock ? controller.escape(controller.getName(activeLock)) : 'NONE (SEARCHING)';
      activeLockVal.style.color = activeLock ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)';
    }
    const reachCount = content.querySelector('.sensor-in-reach-count');
    if (reachCount) {
      reachCount.textContent = `${isFriendly ? 'AIR CONTACTS & RADAR ENVELOPES' : 'ALLIED SENSORS TRACKING TARGET'} (${detectedCount}/${targetsOrScanners.length} IN REACH)`;
    }
    if (controller.isAircraft(selectedEntity)) {
      InspectionSurfaceRadarRenderer.updateLiveGroundRecon(controller, selectedEntity, content);
    }
  }
}

window.InspectionTelemetry = InspectionTelemetry;
