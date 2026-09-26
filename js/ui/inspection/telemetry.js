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
        targetAspect = `Beam (${aspectAngleDeg}°, +${Math.round((aspectMultiplier - 1) * 100)}% Spike)`;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
        targetAspect = `Tail (${aspectAngleDeg}°, +80% Bloom)`;
      } else {
        targetAspect = `Nose (${aspectAngleDeg}°, Clean Profile)`;
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
    const w = missile.weapon || {};
    const tgt = missile.target;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const dist = Math.hypot((tgt.x || 0) - missile.x, (tgt.y || 0) - missile.y);
    const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(missile.x, missile.y, tgt.x, tgt.y, clouds) : 0;

    const angleToTarget = Math.atan2(tgt.y - missile.y, tgt.x - missile.x);
    let offBoresight = Math.abs(missile.heading - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const isOptical = (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT');
    const cloudAtten = cloudHits > 0 ? (isOptical ? `${cloudHits * 15}% Optical Scatter` : `${cloudHits * 8}% RF Attenuation`) : 'Clear Track';

    return `
      <section class="inspection-card">
        <h3>MISSILE TERMINAL SEEKER SUITE</h3>
        <p class="inspection-muted">In-flight weapon guidance sensors and tracking lock telemetry</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>SEEKER HEAD: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'}</b></div>
          <div>FLIGHT STAGE: <b style="color:var(--stat-tier-3);">${missile.stage || 'BOOST'}</b></div>
          <div>BORESIGHT OFFSET: <b style="color:${offBoresightDeg <= 30 ? 'var(--stat-tier-2)' : 'var(--stat-tier-4)'};">${offBoresightDeg}° off seeker line</b></div>
          <div>CLOUD IMPACT: <b style="color:${cloudHits > 0 ? 'var(--stat-tier-5)' : 'var(--stat-tier-2)'};">${cloudAtten}</b></div>
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06); font:600 0.62rem var(--font-dotdigital); display:flex; justify-content:space-between;">
          <span>TARGET TRACK:</span>
          <b style="color:var(--color-red);">${controller.escape(controller.getName(tgt))} [${dist.toFixed(1)} km]</b>
        </div>
      </section>

      <section class="inspection-card" style="margin-top:4px;">
        <h3>GUIDANCE COUNTERMEASURE SENSITIVITY</h3>
        <div class="inspection-factors-table" style="margin-top:6px;">
          <div class="inspection-factor-row ${w.seeker === 'ARH' ? 'negative' : 'positive'}">
            <span class="factor-name">Doppler Notch Seduction<span class="factor-desc">Radial closure zeroing breaks radar doppler gate.</span></span>
            <span class="factor-delta ${w.seeker === 'ARH' ? 'negative' : 'positive'}">${w.seeker === 'ARH' ? 'Vulnerable (-38% Gate Break)' : 'Immune'}</span>
          </div>
          <div class="inspection-factor-row ${w.seeker === 'ARH' ? 'negative' : (isOptical ? 'warning' : 'neutral')}">
            <span class="factor-name">Countermeasures (Chaff / Flares)<span class="factor-desc">Pyrotechnic decoy bloom tracking interference.</span></span>
            <span class="factor-delta ${w.seeker === 'ARH' ? 'negative' : 'warning'}">${w.seeker === 'ARH' ? 'Chaff Seduction (-34%)' : 'Partial Evasion (-18%)'}</span>
          </div>
          <div class="inspection-factor-row ${isOptical && cloudHits > 0 ? 'negative' : 'positive'}">
            <span class="factor-name">Weather Cloud Moisture<span class="factor-desc">Liquid droplets scatter imaging infrared contrast.</span></span>
            <span class="factor-delta ${isOptical && cloudHits > 0 ? 'negative' : 'positive'}">${isOptical && cloudHits > 0 ? `Scattering Active (${cloudHits} clouds)` : 'Clear Penetration'}</span>
          </div>
        </div>
      </section>
    `;
  }

  static renderRadarDashboard(controller, selectedEntity) {
    if (!selectedEntity || typeof selectedEntity.x !== 'number') {
      return '<div class="inspection-empty"><b>NO SENSOR TARGET</b><span>Select an aircraft or contact to evaluate sensor envelopes.</span></div>';
    }

    if (selectedEntity.weapon && selectedEntity.target) {
      return this.renderMissileSeekerDashboard(controller, selectedEntity);
    }

    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = selectedEntity.team === commanderTeam;
    const activeLock = selectedEntity.radarLockedTarget;

    const headerTitle = isFriendly ? 'ONBOARD SENSORS & RADAR TRACKS' : 'ALLIED SENSOR COVERAGE & FRIENDLY LOCKS';
    const headerSub = isFriendly
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
    const scanCone = selectedEntity.spec ? selectedEntity.spec.radarConeDeg : (selectedEntity.type ? 360 : 120);
    const lookDown = Math.round((selectedEntity.spec ? (selectedEntity.spec.lookDownBonus || 0.2) : 0.2) * 100);

    const contactRowsHtml = records.map((rec) => {
      const otherUnit = isFriendly ? rec.target : rec.scanner;
      const accordionId = `sensor-${otherUnit.id}`;
      const otherName = controller.escape(controller.getName(otherUnit));
      const rangePercent = Math.min(100, ((rec.inCone ? rec.rangeKm : rec.forwardRangeKm) / 150) * 100);
      const distPercent = Math.min(100, (rec.distanceKm / 150) * 100);

      const isLocked = isFriendly
        ? Boolean(rec.detects && activeLock && activeLock.id === rec.target.id)
        : Boolean(rec.detects && rec.scanner.radarLockedTarget && rec.scanner.radarLockedTarget.id === selectedEntity.id);

      let statusClass = 'negative';
      let statusText = `OFF-BORESIGHT (${rec.offBoresightDeg}°)`;
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

      let beamClass = 'negative';
      let beamText = `Outside Radar Cone (${rec.offBoresightDeg}° > ±${rec.halfConeDeg}°)`;
      if (rec.inCone) {
        beamClass = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65) ? 'positive' : 'warning';
        beamText = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65)
          ? `Boresight Aligned (${rec.offBoresightDeg}° off nose)`
          : `Outer Gimbal Arc (${rec.offBoresightDeg}° off nose)`;
      }

      let rcsClass = 'warning';
      let rcsText = `${rec.rcsRatio.toFixed(2)}x detection multiplier`;
      if (rec.rcsRatio >= 1.15) rcsClass = 'positive';
      else if (rec.rcsRatio < 0.70) rcsClass = 'negative';

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
        cloudText = `NO RADAR SIGHT (${rec.offBoresightDeg}°)`;
        cloudDesc = `Target is ${rec.offBoresightDeg}° off nose in rear blind zone; no forward radar line of sight.`;
      }

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${otherName}</b>
              <span class="sensor-sub">Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} • ${rec.targetAspect}</span>
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
              <span class="sensor-margin-val" style="color:${rec.detects ? (rec.marginKm < 15 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)') : 'var(--stat-tier-5)'}; font-weight:700;">
                ${!rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}°)` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`)}
              </span>
            </div>

            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${beamClass} sensor-beam-row">
                <span class="factor-name">Radar Beam Alignment<span class="factor-desc">Target angle relative to forward gimbal limits (±${rec.halfConeDeg}°).</span></span>
                <span class="factor-delta ${beamClass}">${beamText}</span>
              </div>
              <div class="inspection-factor-row ${rcsClass}">
                <span class="factor-name">Target Radar Signature<span class="factor-desc">Effective RCS: ${rec.effectiveRcs.toFixed(rec.effectiveRcs < 0.01 ? 5 : 2)} m².</span></span>
                <span class="factor-delta ${rcsClass}">${rcsText}</span>
              </div>
              <div class="inspection-factor-row ${cloudClass} sensor-cloud-row">
                <span class="factor-name">Atmospheric Clouds<span class="factor-desc">${cloudDesc}</span></span>
                <span class="factor-delta ${cloudClass}">${cloudText}</span>
              </div>
            </div>

            <div class="inspection-reason-box ${rec.detects ? (rec.marginKm < 15 ? 'warning' : '') : 'warning'}" style="margin-top:4px;">
              <b>RADAR ASSESSMENT:</b> ${!rec.inCone ? `NO RADAR SIGHT: Target is in rear blind sector (${rec.offBoresightDeg}° off nose, outside ±${rec.halfConeDeg}° radar cone). Turn towards target to acquire radar track.` : (rec.detects ? (rec.marginKm < 15 ? `Marginal radar track: target is near horizon boundary (${rec.marginKm.toFixed(1)} km margin). Maneuvering may drop track.` : `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.`) : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}
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
          <div>SCAN CONE: <b style="color:var(--theme-accent);">${scanCone >= 360 ? '360° (OMNI)' : `±${Math.round(scanCone / 2)}°`}</b></div>
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
      if (titleSub) titleSub.textContent = `Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} • ${rec.targetAspect}`;

      const isLocked = isFriendly
        ? Boolean(rec.detects && activeLock && activeLock.id === rec.target.id)
        : Boolean(rec.detects && unit.radarLockedTarget && unit.radarLockedTarget.id === selectedEntity.id);

      let statusClass = 'negative';
      let statusText = `OFF-BORESIGHT (${rec.offBoresightDeg}°)`;
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
        marginVal.textContent = !rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}°)` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`);
        marginVal.style.color = rec.detects ? (rec.marginKm < 15 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)') : 'var(--stat-tier-5)';
      }

      const beamRow = acc.querySelector('.sensor-beam-row');
      if (beamRow) {
        let beamClass = 'negative';
        let beamText = `Outside Radar Cone (${rec.offBoresightDeg}° > ±${rec.halfConeDeg}°)`;
        if (rec.inCone) {
          beamClass = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65) ? 'positive' : 'warning';
          beamText = (rec.offBoresightDeg <= rec.halfConeDeg * 0.65)
            ? `Boresight Aligned (${rec.offBoresightDeg}° off nose)`
            : `Outer Gimbal Arc (${rec.offBoresightDeg}° off nose)`;
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
          cloudText = `NO RADAR SIGHT (${rec.offBoresightDeg}°)`;
          cloudDesc = `Target is ${rec.offBoresightDeg}° off nose in rear blind zone; no forward radar line of sight.`;
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
        reasonBox.innerHTML = `<b>RADAR ASSESSMENT:</b> ${!rec.inCone ? `NO RADAR SIGHT: Target is in rear blind sector (${rec.offBoresightDeg}° off nose, outside ±${rec.halfConeDeg}° radar cone). Turn towards target to acquire radar track.` : (rec.detects ? (rec.marginKm < 15 ? `Marginal radar track: target is near horizon boundary (${rec.marginKm.toFixed(1)} km margin). Maneuvering may drop track.` : `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.`) : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}`;
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