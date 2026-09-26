/**
 * AIRSPACE STANDOFF: Inspection Telemetry & Sensor Dynamics Engine
 * Displays onboard radar suite, active locks, and contacts in beam for selected aircraft,
 * or friendly tracking coverage when inspecting an enemy target.
 */

class InspectionTelemetry {
  static getSensorRecord(scanner, target, game) {
    const baseRangeKm = scanner.spec ? (scanner.spec.R_0 || 75) : (scanner.rangeKm || 48);
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const distanceKm = Math.hypot(target.x - scanner.x, target.y - scanner.y);

    const angleToTarget = Math.atan2(target.y - scanner.y, target.x - scanner.x);
    let offBoresight = Math.abs((scanner.heading !== undefined ? scanner.heading : 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const halfConeDeg = Math.round(((scanner.spec ? scanner.spec.radarConeDeg : (scanner.type ? 360 : 120)) / 2));
    const inCone = scanner.heading === undefined || !scanner.spec || scanner.spec.radarConeDeg >= 360 || (offBoresightDeg <= halfConeDeg);

    const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(scanner.x, scanner.y, target.x, target.y, clouds) : 0;
    const forwardRangeKm = typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(Object.assign({}, scanner, { heading: angleToTarget }), target, clouds) : baseRangeKm;
    const rangeKm = inCone ? (typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(scanner, target, clouds) : baseRangeKm) : 0.0;

    let aspectAngleDeg = 0;
    let aspectMultiplier = 1.0;
    let targetAspect = 'Nose-on';
    if (typeof target.heading === 'number' && !isNaN(target.heading)) {
      let aspectOffNose = Math.abs(target.heading - Math.atan2(scanner.y - target.y, scanner.x - target.x));
      while (aspectOffNose > Math.PI) aspectOffNose = Math.abs(aspectOffNose - Math.PI * 2);
      aspectAngleDeg = Math.round(aspectOffNose * 180 / Math.PI);
      if (aspectOffNose >= 1.0 && aspectOffNose <= 2.1) {
        let spike = target.spec && target.spec.beamSpike !== undefined ? target.spec.beamSpike : 3.2;
        if (target.beamSpikeReduction) spike = 1 + (spike - 1) * (1 - target.beamSpikeReduction);
        aspectMultiplier = spike;
        targetAspect = `Beam (${aspectAngleDeg}\u00B0, +${Math.round((aspectMultiplier - 1) * 100)}% Spike)`;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
        targetAspect = `Tail (${aspectAngleDeg}\u00B0, +80% Bloom)`;
      } else {
        targetAspect = `Nose (${aspectAngleDeg}\u00B0, Clean Profile)`;
      }
    }

    const detects = inCone && rangeKm > 0 && distanceKm <= rangeKm;
    const marginKm = rangeKm - distanceKm;
    const baseRcs = target.spec ? (target.spec.sigma_0 || 1.0) : (target.effectiveRcs || 1.0);
    const effectiveRcs = target.effectiveRcs !== undefined ? target.effectiveRcs : baseRcs;
    const rcsRatio = Math.pow(Math.max(0.0001, effectiveRcs * aspectMultiplier), 0.25);
    const jammingFactor = target.jamEfficiency ? Math.max(0.50, 1.0 - target.jamEfficiency * 0.35) : 1.0;

    return {
      scanner, target, rangeKm, baseRangeKm, forwardRangeKm, distanceKm, detects, inCone,
      cloudHits, offBoresightDeg, halfConeDeg, targetAspect, aspectMultiplier, aspectAngleDeg,
      marginKm, effectiveRcs, rcsRatio, jammingFactor
    };
  }

  static renderMissileSeekerDashboard(controller, missile) {
    if (typeof InspectionRadarView !== 'undefined') {
      return InspectionRadarView.renderMissileSeekerDashboard(controller, missile);
    }
    return '';
  }

  static renderRadarDashboard(controller, selectedEntity) {
    if (typeof InspectionRadarView !== 'undefined') {
      return InspectionRadarView.renderRadarDashboard(controller, selectedEntity);
    }
    return '';
  }

  static updateLive(controller, selectedEntity, content) {
    if (!selectedEntity || !content || (selectedEntity.weapon && selectedEntity.target)) return;

    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = selectedEntity.team === commanderTeam;
    const activeLock = selectedEntity.radarLockedTarget;

    const targetsOrScanners = isFriendly
      ? [...(game.hostileAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'hostile'))].filter(u => u && u.hp > 0)
      : [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly' && (s.type === 'RADAR_ARRAY' || s.type === 'S-400')))].filter(u => u && u.hp > 0);

    let detectedCount = 0;

    targetsOrScanners.forEach(unit => {
      const acc = content.querySelector(`[data-accordion-id="sensor-${unit.id}"]`);
      if (!acc) return;
      const rec = isFriendly ? this.getSensorRecord(selectedEntity, unit, game) : this.getSensorRecord(unit, selectedEntity, game);
      if (rec.detects) detectedCount++;

      const titleSub = acc.querySelector('.sensor-sub');
      if (titleSub) titleSub.textContent = `Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} \u2022 ${rec.targetAspect}`;

      const isLocked = isFriendly
        ? Boolean(rec.detects && activeLock && activeLock.id === rec.target.id)
        : Boolean(rec.detects && unit.radarLockedTarget && unit.radarLockedTarget.id === selectedEntity.id);

      let statusClass = 'negative';
      let statusText = `OFF-BORESIGHT (${rec.offBoresightDeg}\u00B0)`;
      if (rec.inCone) {
        if (isLocked) {
          statusClass = 'positive';
          statusText = 'PRIMARY LOCK';
        } else if (rec.detects) {
          statusClass = rec.marginKm < 15 ? 'warning' : 'positive';
          statusText = rec.marginKm < 15 ? 'MARGINAL TRACK' : 'IN BEAM (TRACKED)';
        } else {
          statusClass = 'negative';
          statusText = 'IN CONE (OUT OF RANGE)';
        }
      }

      const badge = acc.querySelector('.inspection-accordion-meta .factor-delta');
      if (badge) {
        badge.className = `factor-delta ${statusClass}`;
        badge.textContent = statusText;
      }

      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) {
        fill.style.width = `${Math.min(100, ((rec.inCone ? rec.rangeKm : rec.forwardRangeKm) / 150) * 100)}%`;
        fill.classList.toggle('detecting', rec.detects);
      }

      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (rec.distanceKm / 150) * 100)}%`;

      const distVal = acc.querySelector('.sensor-dist-val b');
      if (distVal) distVal.textContent = `${rec.distanceKm.toFixed(1)} km`;

      const reachVal = acc.querySelector('.sensor-reach-val');
      if (reachVal) reachVal.innerHTML = rec.inCone ? `Radar Reach: <b>${rec.rangeKm.toFixed(1)} km</b>` : `Forward Reach: <b>${rec.forwardRangeKm.toFixed(1)} km (Blind)</b>`;

      const marginVal = acc.querySelector('.sensor-margin-val');
      if (marginVal) {
        marginVal.textContent = !rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}\u00B0)` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`);
        marginVal.style.color = rec.detects ? (rec.marginKm < 15 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)') : 'var(--stat-tier-5)';
      }

      const beamRow = acc.querySelector('.sensor-beam-row');
      if (beamRow) {
        let beamClass = 'negative';
        let beamText = `Outside Radar Cone (${rec.offBoresightDeg}\u00B0 > \u00B1${rec.halfConeDeg}\u00B0)`;
        if (rec.inCone) {
          beamClass = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65) ? 'positive' : 'warning';
          beamText = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65)
            ? `Boresight Aligned (${rec.offBoresightDeg}\u00B0 off nose)`
            : `Outer Gimbal Arc (${rec.offBoresightDeg}\u00B0 off nose)`;
        }
        beamRow.className = `inspection-factor-row ${beamClass} sensor-beam-row`;
        const delta = beamRow.querySelector('.factor-delta');
        if (delta) {
          delta.className = `factor-delta ${beamClass}`;
          delta.textContent = beamText;
        }
      }

      const cloudRow = acc.querySelector('.sensor-cloud-row');
      if (cloudRow) {
        const atten = (window.CONFIG && window.CONFIG.CLOUD_RADAR_ATTENUATION) || 0.08;
        const totalAttenPct = Math.round((1 - Math.pow(1.0 - atten, rec.cloudHits)) * 100);
        let cloudClass = 'neutral';
        let cloudText = 'Clear Line of Sight';
        let cloudDesc = 'Clear air: unobstructed atmospheric radar line of sight.';
        if (rec.cloudHits === 1) {
          cloudClass = 'warning';
          cloudText = `-${totalAttenPct}% Attenuation (1 Cloud Cell)`;
          cloudDesc = 'Single cloud cell in sensor path: moderate microwave RF attenuation.';
        } else if (rec.cloudHits >= 2) {
          cloudClass = 'negative';
          cloudText = `-${totalAttenPct}% Attenuation (${rec.cloudHits} Clouds)`;
          cloudDesc = `${rec.cloudHits} overlapping cloud cells: severe microwave radar scattering.`;
        } else if (!rec.inCone) {
          cloudClass = 'negative';
          cloudText = `NO RADAR SIGHT (${rec.offBoresightDeg}\u00B0)`;
          cloudDesc = `Target is ${rec.offBoresightDeg}\u00B0 off nose in rear blind zone; no forward radar line of sight.`;
        }
        cloudRow.className = `inspection-factor-row ${cloudClass} sensor-cloud-row`;
        const desc = cloudRow.querySelector('.factor-desc');
        if (desc) desc.textContent = cloudDesc;
        const delta = cloudRow.querySelector('.factor-delta');
        if (delta) {
          delta.className = `factor-delta ${cloudClass}`;
          delta.textContent = cloudText;
        }
      }

      const reasonBox = acc.querySelector('.inspection-reason-box');
      if (reasonBox) {
        reasonBox.className = `inspection-reason-box ${rec.detects ? (rec.marginKm < 15 ? 'warning' : '') : 'warning'}`;
        reasonBox.innerHTML = `<b>RADAR ASSESSMENT:</b> ${!rec.inCone ? `NO RADAR SIGHT: Target is in rear blind sector (${rec.offBoresightDeg}\u00B0 off nose, outside \u00B1${rec.halfConeDeg}\u00B0 radar cone). Turn towards target to acquire radar track.` : (rec.detects ? (rec.marginKm < 15 ? `Marginal radar track: target is near horizon boundary (${rec.marginKm.toFixed(1)} km margin). Maneuvering may drop track.` : `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.`) : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}`;
      }
    });

    const activeLockVal = content.querySelector('.sensor-active-lock-val');
    if (activeLockVal) {
      activeLockVal.textContent = activeLock ? controller.escape(controller.getName(activeLock)) : 'NONE (SEARCHING)';
      activeLockVal.style.color = activeLock ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)';
    }

    const reachCount = content.querySelector('.sensor-in-reach-count');
    if (reachCount) {
      reachCount.textContent = `${isFriendly ? 'CONTACTS IN THEATER & RADAR ENVELOPES' : 'ALLIED SENSORS TRACKING TARGET'} (${detectedCount}/${targetsOrScanners.length} IN REACH)`;
    }
  }
}

window.InspectionTelemetry = InspectionTelemetry;