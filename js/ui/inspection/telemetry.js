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

    const halfConeDeg = Math.round(((scanner.spec ? scanner.spec.radarConeDeg : 120) / 2));
    const inCone = scanner.heading === undefined || !scanner.spec || scanner.spec.radarConeDeg >= 360 || (offBoresightDeg <= halfConeDeg);

    const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(scanner.x, scanner.y, target.x, target.y, clouds) : 0;
    const forwardRangeKm = typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(Object.assign({}, scanner, { heading: angleToTarget }), target, clouds) : baseRangeKm;
    const rangeKm = inCone ? (typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(scanner, target, clouds) : baseRangeKm) : 0.0;

    let aspectAngleDeg = 0;
    let aspectMultiplier = 1.0;
    let targetAspect = 'Nose-on';
    if (typeof target.heading === 'number') {
      let angle = Math.abs(target.heading - (angleToTarget + Math.PI));
      while (angle > Math.PI) angle = Math.abs(angle - Math.PI * 2);
      aspectAngleDeg = Math.round(angle * 180 / Math.PI);
      if (aspectAngleDeg >= 70 && aspectAngleDeg <= 110) {
        let spike = target.spec && target.spec.beamSpike !== undefined ? target.spec.beamSpike : 3.2;
        if (target.beamSpikeReduction) spike = 1 + (spike - 1) * (1 - target.beamSpikeReduction);
        aspectMultiplier = spike;
        targetAspect = `Beam (${aspectAngleDeg}\u00B0, +${Math.round((aspectMultiplier - 1) * 100)}% Spike)`;
      } else if (aspectAngleDeg > 120) {
        aspectMultiplier = 1.8;
        targetAspect = `Tail (${aspectAngleDeg}\u00B0, +80% Bloom)`;
      } else {
        targetAspect = `Nose (${aspectAngleDeg}\u00B0, Clean Profile)`;
      }
    }

    const detects = inCone && rangeKm > 0 && distanceKm <= rangeKm;
    const marginKm = rangeKm - distanceKm;
    const baseRcs = target.spec ? (target.spec.sigma_0 || 1.0) : 1.0;
    const effectiveRcs = target.effectiveRcs !== undefined ? target.effectiveRcs : baseRcs;
    const rcsRatio = Math.pow(Math.max(0.0001, effectiveRcs * aspectMultiplier), 0.25);
    const jammingFactor = target.jamEfficiency ? Math.max(0.50, 1.0 - target.jamEfficiency * 0.35) : 1.0;

    return {
      scanner, target, rangeKm, baseRangeKm, forwardRangeKm, distanceKm, detects, inCone,
      cloudHits, offBoresightDeg, halfConeDeg, targetAspect, aspectMultiplier, aspectAngleDeg,
      marginKm, effectiveRcs, rcsRatio, jammingFactor
    };
  }

  static renderRadarDashboard(controller, selectedEntity) {
    if (!selectedEntity || typeof selectedEntity.x !== 'number') {
      return '<div class="inspection-empty"><b>NO SENSOR TARGET</b><span>Select an aircraft or contact to evaluate sensor envelopes.</span></div>';
    }

    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = selectedEntity.team === commanderTeam;
    const activeLock = selectedEntity.radarLockedTarget;

    let headerTitle = isFriendly ? 'ONBOARD SENSORS & RADAR TRACKS' : 'ALLIED SENSOR COVERAGE & FRIENDLY LOCKS';
    let headerSub = isFriendly
      ? `Forward radar sweep, target locks, and scan beam tracking from ${controller.getName(selectedEntity)}`
      : `Allied fighters and radar stations tracking ${controller.getName(selectedEntity)}`;

    let records = [];
    if (isFriendly) {
      const enemyPool = [...(game.hostileAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'hostile'))].filter(u => u && u.hp > 0);
      records = enemyPool.map(target => this.getSensorRecord(selectedEntity, target, game)).sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    } else {
      const scannerPool = [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly' && (s.type === 'RADAR_ARRAY' || s.type === 'S-400')))].filter(u => u && u.hp > 0);
      records = scannerPool.map(scanner => this.getSensorRecord(scanner, selectedEntity, game)).sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    }

    const radarName = selectedEntity.spec ? selectedEntity.spec.radarType : (selectedEntity.name || 'Pulse-Doppler Radar');
    const radarRange = selectedEntity.spec ? selectedEntity.spec.R_0 : (selectedEntity.rangeKm || 75);
    const scanCone = selectedEntity.spec ? selectedEntity.spec.radarConeDeg : 120;
    const lookDown = Math.round((selectedEntity.spec ? (selectedEntity.spec.lookDownBonus || 0.2) : 0.2) * 100);

    const contactRowsHtml = records.map((rec) => {
      const otherUnit = isFriendly ? rec.target : rec.scanner;
      const accordionId = `sensor-${otherUnit.id}`;
      const otherName = controller.escape(controller.getName(otherUnit));
      const rangePercent = Math.min(100, ((rec.inCone ? rec.rangeKm : rec.forwardRangeKm) / 150) * 100);
      const distPercent = Math.min(100, (rec.distanceKm / 150) * 100);

      const isLocked = rec.detects && activeLock && activeLock.id === rec.target.id;
      const statusClass = !rec.inCone ? 'negative' : (isLocked ? 'positive' : (rec.detects ? 'neutral' : 'negative'));
      const statusText = !rec.inCone ? `OFF-BORESIGHT (${rec.offBoresightDeg}\u00B0)` : (isLocked ? 'PRIMARY LOCK' : (rec.detects ? 'IN BEAM (TRACKED)' : 'OUT OF RANGE'));

      const beamClass = rec.inCone ? 'positive' : 'negative';
      const beamText = rec.inCone ? `In Radar Cone (${rec.offBoresightDeg}\u00B0 off boresight)` : `Outside Radar Cone (${rec.offBoresightDeg}\u00B0 > +-${rec.halfConeDeg}\u00B0)`;

      const atten = (window.CONFIG && window.CONFIG.CLOUD_RADAR_ATTENUATION) || 0.08;
      const totalAttenPct = Math.round((1 - Math.pow(1.0 - atten, rec.cloudHits)) * 100);
      const cloudClass = rec.cloudHits > 0 ? 'negative' : (rec.inCone ? 'neutral' : 'negative');
      const cloudText = rec.cloudHits > 0 ? `-${totalAttenPct}% Attenuation (${rec.cloudHits} Cloud${rec.cloudHits > 1 ? 's' : ''})` : (rec.inCone ? 'Clear Line of Sight' : `NO RADAR SIGHT (${rec.offBoresightDeg}\u00B0)`);
      const cloudDesc = rec.cloudHits > 0 ? `${rec.cloudHits === 1 ? '1 cloud cell' : `${rec.cloudHits} overlapping clouds`} in line of sight: microwave radar signal attenuated by ${totalAttenPct}%.` : (rec.inCone ? 'Clear air: unobstructed atmospheric radar line of sight.' : `Target is ${rec.offBoresightDeg}\u00B0 off nose in rear blind zone; no forward radar line of sight.`);

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${otherName}</b>
              <span class="sensor-sub">Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} &bull; ${rec.targetAspect}</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${statusClass}">${statusText}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${rec.detects ? 'detecting' : ''}" style="width:${rangePercent}%;"></span>
              <i class="inspection-distance-marker" style="left:${distPercent}%;" title="Distance: ${rec.distanceKm.toFixed(1)} km"></i>
            </div>
            <div class="inspection-range-reading" style="display:flex; justify-content:space-between;">
              <span class="sensor-dist-val">Distance: <b>${rec.distanceKm.toFixed(1)} km</b></span>
              <span class="sensor-reach-val">${rec.inCone ? `Radar Reach: <b>${rec.rangeKm.toFixed(1)} km</b>` : `Forward Reach: <b>${rec.forwardRangeKm.toFixed(1)} km (Blind)</b>`}</span>
              <span class="sensor-margin-val" style="color:${rec.detects ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">
                ${!rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}\u00B0)` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`)}
              </span>
            </div>

            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${beamClass} sensor-beam-row">
                <span class="factor-name">Radar Beam Alignment<span class="factor-desc">Target angle relative to forward gimbal limits (+-${rec.halfConeDeg}\u00B0).</span></span>
                <span class="factor-delta ${beamClass}">${beamText}</span>
              </div>
              <div class="inspection-factor-row ${rec.rcsRatio <= 0.9 ? 'negative' : 'positive'}">
                <span class="factor-name">Target Radar Signature<span class="factor-desc">Effective RCS: ${rec.effectiveRcs.toFixed(rec.effectiveRcs < 0.01 ? 5 : 2)} m&sup2;.</span></span>
                <span class="factor-delta ${rec.rcsRatio <= 0.9 ? 'negative' : 'positive'}">${rec.rcsRatio.toFixed(2)}x detection multiplier</span>
              </div>
              <div class="inspection-factor-row ${cloudClass} sensor-cloud-row">
                <span class="factor-name">Atmospheric Clouds<span class="factor-desc">${cloudDesc}</span></span>
                <span class="factor-delta ${cloudClass}">${cloudText}</span>
              </div>
            </div>

            <div class="inspection-reason-box ${rec.detects ? '' : 'warning'}" style="margin-top:4px;">
              <b>RADAR ASSESSMENT:</b> ${!rec.inCone ? `NO RADAR SIGHT: Target is in rear blind sector (${rec.offBoresightDeg}\u00B0 off nose, outside +-${rec.halfConeDeg}\u00B0 radar cone). Turn towards target to acquire radar track.` : (rec.detects ? `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.` : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}
            </div>
          </div>
        </details>
      `;
    }).join('');

    return `
      <section class="inspection-card">
        <h3>${headerTitle}</h3>
        <p class="inspection-muted">${headerSub}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>RADAR: <b style="color:var(--color-ice-highlight);">${radarName}</b></div>
          <div>BASE RANGE: <b style="color:var(--stat-tier-2);">${radarRange} km</b></div>
          <div>SCAN CONE: <b style="color:var(--theme-accent);">+-${Math.round(scanCone / 2)}\u00B0</b></div>
          <div>LOOK-DOWN: <b style="color:var(--stat-tier-3);">+${lookDown}%</b></div>
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06); font:600 0.62rem var(--font-dotdigital); display:flex; justify-content:space-between;">
          <span>ACTIVE TARGET LOCK:</span>
          <b class="sensor-active-lock-val" style="color:${activeLock ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)'};">
            ${activeLock ? controller.escape(controller.getName(activeLock)) : 'NONE (SEARCHING)'}
          </b>
        </div>
      </section>
      <section style="margin-top:4px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span class="sensor-in-reach-count">${isFriendly ? 'CONTACTS IN THEATER & RADAR ENVELOPES' : 'ALLIED SENSORS TRACKING TARGET'} (${records.filter(r => r.detects).length}/${records.length} IN REACH)</span>
          <span>EXPAND FOR DETAILS</span>
        </div>
        ${contactRowsHtml || '<p class="inspection-muted" style="padding:8px;">No contacts detected in radar search sector.</p>'}
      </section>
    `;
  }

  static updateLive(controller, selectedEntity, content) {
    if (!selectedEntity || !content) return;
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

      const isLocked = rec.detects && activeLock && activeLock.id === rec.target.id;
      const statusClass = !rec.inCone ? 'negative' : (isLocked ? 'positive' : (rec.detects ? 'neutral' : 'negative'));
      const statusText = !rec.inCone ? `OFF-BORESIGHT (${rec.offBoresightDeg}\u00B0)` : (isLocked ? 'PRIMARY LOCK' : (rec.detects ? 'IN BEAM (TRACKED)' : 'OUT OF RANGE'));

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
        marginVal.style.color = rec.detects ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)';
      }

      const beamRow = acc.querySelector('.sensor-beam-row');
      if (beamRow) {
        const beamClass = rec.inCone ? 'positive' : 'negative';
        beamRow.className = `inspection-factor-row ${beamClass} sensor-beam-row`;
        const delta = beamRow.querySelector('.factor-delta');
        if (delta) {
          delta.className = `factor-delta ${beamClass}`;
          delta.textContent = rec.inCone ? `In Radar Cone (${rec.offBoresightDeg}\u00B0 off boresight)` : `Outside Radar Cone (${rec.offBoresightDeg}\u00B0 > +-${rec.halfConeDeg}\u00B0)`;
        }
      }

      const cloudRow = acc.querySelector('.sensor-cloud-row');
      if (cloudRow) {
        const atten = (window.CONFIG && window.CONFIG.CLOUD_RADAR_ATTENUATION) || 0.08;
        const totalAttenPct = Math.round((1 - Math.pow(1.0 - atten, rec.cloudHits)) * 100);
        const cloudClass = rec.cloudHits > 0 ? 'negative' : (rec.inCone ? 'neutral' : 'negative');
        cloudRow.className = `inspection-factor-row ${cloudClass} sensor-cloud-row`;
        const desc = cloudRow.querySelector('.factor-desc');
        if (desc) desc.textContent = rec.cloudHits > 0 ? `${rec.cloudHits === 1 ? '1 cloud cell' : `${rec.cloudHits} overlapping clouds`} in line of sight: microwave radar signal attenuated by ${totalAttenPct}%.` : (rec.inCone ? 'Clear air: unobstructed atmospheric radar line of sight.' : `Target is ${rec.offBoresightDeg}\u00B0 off nose in rear blind zone; no forward radar line of sight.`);
        const delta = cloudRow.querySelector('.factor-delta');
        if (delta) {
          delta.className = `factor-delta ${cloudClass}`;
          delta.textContent = rec.cloudHits > 0 ? `-${totalAttenPct}% Attenuation (${rec.cloudHits} Cloud${rec.cloudHits > 1 ? 's' : ''})` : (rec.inCone ? 'Clear Line of Sight' : `NO RADAR SIGHT (${rec.offBoresightDeg}\u00B0)`);
        }
      }

      const reasonBox = acc.querySelector('.inspection-reason-box');
      if (reasonBox) {
        reasonBox.className = `inspection-reason-box ${rec.detects ? '' : 'warning'}`;
        reasonBox.innerHTML = `<b>RADAR ASSESSMENT:</b> ${!rec.inCone ? `NO RADAR SIGHT: Target is in rear blind sector (${rec.offBoresightDeg}\u00B0 off nose, outside +-${rec.halfConeDeg}\u00B0 radar cone). Turn towards target to acquire radar track.` : (rec.detects ? `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.` : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}`;
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