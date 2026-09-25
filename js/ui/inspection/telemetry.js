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
    const rangeKm = typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(scanner, target, clouds) : baseRangeKm;
    const inClouds = clouds.some(c => c.containsPoint(target.x, target.y) || c.containsPoint(scanner.x, scanner.y));

    const angleToTarget = Math.atan2(target.y - scanner.y, target.x - scanner.x);
    let offBoresight = Math.abs((scanner.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const halfConeDeg = Math.round(((scanner.spec ? scanner.spec.radarConeDeg : 120) / 2));
    const inCone = scanner.heading === undefined || !scanner.spec || scanner.spec.radarConeDeg >= 360 || (offBoresightDeg <= halfConeDeg);

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

    const detects = rangeKm > 0 && distanceKm <= rangeKm && inCone;
    const marginKm = rangeKm - distanceKm;
    const baseRcs = target.spec ? (target.spec.sigma_0 || 1.0) : 1.0;
    const effectiveRcs = target.effectiveRcs !== undefined ? target.effectiveRcs : baseRcs;
    const rcsRatio = Math.pow(Math.max(0.0001, effectiveRcs * aspectMultiplier), 0.25);
    const jammingFactor = target.jamEfficiency ? Math.max(0.50, 1.0 - target.jamEfficiency * 0.35) : 1.0;

    return {
      scanner, target, rangeKm, baseRangeKm, distanceKm, detects, inCone, inClouds,
      offBoresightDeg, halfConeDeg, targetAspect, aspectMultiplier, aspectAngleDeg,
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

    let headerTitle = '';
    let headerSub = '';
    let records = [];

    if (isFriendly) {
      headerTitle = 'ONBOARD SENSORS & RADAR TRACKS';
      headerSub = `Forward radar sweep, target locks, and scan beam tracking from ${controller.getName(selectedEntity)}`;
      const enemyAircraft = (game.hostileAircraft || []).filter(h => h && h.hp > 0);
      const enemySurfaces = (game.surfaceUnits || []).filter(s => s && s.team === 'hostile' && s.hp > 0);
      const targetPool = [...enemyAircraft, ...enemySurfaces];
      records = targetPool.map(target => this.getSensorRecord(selectedEntity, target, game))
        .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    } else {
      headerTitle = 'ALLIED SENSOR COVERAGE & FRIENDLY LOCKS';
      headerSub = `Allied fighters and radar stations tracking ${controller.getName(selectedEntity)}`;
      const alliedAircraft = (game.alliedAircraft || []).filter(a => a && a.hp > 0);
      const alliedSurfaces = (game.surfaceUnits || []).filter(s => s && s.team === 'friendly' && s.hp > 0 && (s.type === 'RADAR_ARRAY' || s.type === 'S-400'));
      const scannerPool = [...alliedAircraft, ...alliedSurfaces];
      records = scannerPool.map(scanner => this.getSensorRecord(scanner, selectedEntity, game))
        .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    }

    const radarName = selectedEntity.spec ? selectedEntity.spec.radarType : (selectedEntity.name || 'Pulse-Doppler Radar');
    const radarRange = selectedEntity.spec ? selectedEntity.spec.R_0 : (selectedEntity.rangeKm || 75);
    const scanCone = selectedEntity.spec ? selectedEntity.spec.radarConeDeg : 120;
    const lookDown = Math.round((selectedEntity.spec ? (selectedEntity.spec.lookDownBonus || 0.2) : 0.2) * 100);

    const contactRowsHtml = records.map((rec) => {
      const otherUnit = isFriendly ? rec.target : rec.scanner;
      const accordionId = `sensor-${otherUnit.id}`;
      const otherName = controller.escape(controller.getName(otherUnit));
      const rangePercent = Math.min(100, (rec.rangeKm / 150) * 100);
      const distPercent = Math.min(100, (rec.distanceKm / 150) * 100);

      const isLocked = rec.detects && activeLock && activeLock.id === rec.target.id;
      const statusClass = isLocked ? 'positive' : (rec.detects ? 'neutral' : 'negative');
      const statusText = isLocked ? 'PRIMARY LOCK' : (rec.detects ? 'IN BEAM (LOCKED)' : (!rec.inCone ? 'OFF-BORESIGHT' : 'OUT OF RANGE'));

      const arcText = rec.inCone
        ? `In Radar Cone (${rec.offBoresightDeg}\u00B0 off boresight)`
        : `Outside Radar Cone (${rec.offBoresightDeg}\u00B0 > +-${rec.halfConeDeg}\u00B0)`;
      const arcClass = rec.inCone ? 'positive' : 'negative';

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${otherName}</b>
              <span class="sensor-sub">Dist: ${rec.distanceKm.toFixed(1)} km | Reach: ${rec.rangeKm.toFixed(1)} km &bull; ${rec.targetAspect}</span>
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
              <span class="sensor-reach-val">Radar Reach: <b>${rec.rangeKm.toFixed(1)} km</b></span>
              <span class="sensor-margin-val" style="color:${rec.detects ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">
                ${rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`}
              </span>
            </div>

            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${arcClass}">
                <span class="factor-name">Radar Beam Alignment<span class="factor-desc">Target angle relative to forward gimbal limits (+-${rec.halfConeDeg}\u00B0).</span></span>
                <span class="factor-delta ${arcClass}">${arcText}</span>
              </div>
              <div class="inspection-factor-row ${rec.rcsRatio <= 0.9 ? 'negative' : 'positive'}">
                <span class="factor-name">Target Radar Signature<span class="factor-desc">Effective RCS: ${rec.effectiveRcs.toFixed(rec.effectiveRcs < 0.01 ? 5 : 2)} m&sup2;.</span></span>
                <span class="factor-delta ${rec.rcsRatio <= 0.9 ? 'negative' : 'positive'}">${rec.rcsRatio.toFixed(2)}x detection multiplier</span>
              </div>
              <div class="inspection-factor-row ${rec.inClouds ? 'negative' : 'neutral'}">
                <span class="factor-name">Atmospheric Clouds<span class="factor-desc">${rec.inClouds ? 'Inside cloud cell: radar signal attenuated by 50%.' : 'Clear air: unobstructed radar line of sight.'}</span></span>
                <span class="factor-delta ${rec.inClouds ? 'negative' : 'neutral'}">${rec.inClouds ? '-50% Attenuation' : 'Clear Line of Sight'}</span>
              </div>
              ${rec.target.jamEfficiency ? `
                <div class="inspection-factor-row negative">
                  <span class="factor-name">Target ECM Jamming<span class="factor-desc">Target projecting active microwave noise into radar frontend.</span></span>
                  <span class="factor-delta negative">-${Math.round((1 - rec.jammingFactor) * 100)}% Range</span>
                </div>` : ''}
            </div>

            <div class="inspection-reason-box ${rec.detects ? '' : 'warning'}" style="margin-top:4px;">
              <b>RADAR ASSESSMENT:</b> ${rec.detects
                ? `Solid radar track established. Target is ${Math.abs(rec.marginKm).toFixed(1)} km inside reliable firing and detection envelope.`
                : (!rec.inCone ? `Target is outside forward radar cone (${rec.offBoresightDeg}\u00B0 off nose). Turn towards target to acquire lock.` : `Target is beyond radar detection horizon by ${Math.abs(rec.marginKm).toFixed(1)} km.`)}
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
          <b style="color:${activeLock ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)'};">
            ${activeLock ? controller.escape(controller.getName(activeLock)) : 'NONE (SEARCHING)'}
          </b>
        </div>
      </section>

      <section style="margin-top:4px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span>${isFriendly ? 'CONTACTS IN THEATER & RADAR ENVELOPES' : 'ALLIED SENSORS TRACKING TARGET'} (${records.filter(r => r.detects).length}/${records.length} IN REACH)</span>
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

    targetsOrScanners.forEach(unit => {
      const acc = content.querySelector(`[data-accordion-id="sensor-${unit.id}"]`);
      if (!acc) return;
      const rec = isFriendly ? this.getSensorRecord(selectedEntity, unit, game) : this.getSensorRecord(unit, selectedEntity, game);

      const titleSub = acc.querySelector('.sensor-sub');
      if (titleSub) titleSub.textContent = `Dist: ${rec.distanceKm.toFixed(1)} km | Reach: ${rec.rangeKm.toFixed(1)} km \u2022 ${rec.targetAspect}`;

      const isLocked = rec.detects && activeLock && activeLock.id === rec.target.id;
      const statusClass = isLocked ? 'positive' : (rec.detects ? 'neutral' : 'negative');
      const statusText = isLocked ? 'PRIMARY LOCK' : (rec.detects ? 'IN BEAM (LOCKED)' : (!rec.inCone ? 'OFF-BORESIGHT' : 'OUT OF RANGE'));

      const badge = acc.querySelector('.inspection-accordion-meta .factor-delta');
      if (badge) {
        badge.className = `factor-delta ${statusClass}`;
        badge.textContent = statusText;
      }

      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) {
        fill.style.width = `${Math.min(100, (rec.rangeKm / 150) * 100)}%`;
        fill.classList.toggle('detecting', rec.detects);
      }

      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (rec.distanceKm / 150) * 100)}%`;

      const distVal = acc.querySelector('.sensor-dist-val b');
      if (distVal) distVal.textContent = `${rec.distanceKm.toFixed(1)} km`;

      const reachVal = acc.querySelector('.sensor-reach-val b');
      if (reachVal) reachVal.textContent = `${rec.rangeKm.toFixed(1)} km`;

      const marginVal = acc.querySelector('.sensor-margin-val');
      if (marginVal) {
        marginVal.textContent = rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`;
        marginVal.style.color = rec.detects ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)';
      }
    });
  }
}

window.InspectionTelemetry = InspectionTelemetry;