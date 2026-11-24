/**
 * AIRSPACE STANDOFF: Radar Dashboard & In-Cone Tracking View
 */

class InspectionRadarView {
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

    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const isOptical = (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT');
    const cloudAtten = cloudHits > 0 ? (isOptical ? `${cloudHits * 12}% Optical Contrast Loss` : `${cloudHits * 4}% RF Attenuation`) : 'Clear Track';

    return `
      <section class="inspection-card">
        <h3>MISSILE TERMINAL SEEKER SUITE</h3>
        <p class="inspection-muted">In-flight weapon guidance sensors and tracking lock telemetry</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>SEEKER HEAD: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'} (${(missile.effectiveSeekerRangeKm || missile.seekerRangeKm || 18).toFixed(1)} km)</b></div>
          <div>GUIDANCE MODE: <b style="color:${missile.guidanceMode === 'ACTIVE_SEEKER' ? 'var(--stat-tier-2)' : (missile.guidanceMode === 'COAST_INERTIAL' ? 'var(--stat-tier-4)' : 'var(--theme-accent)')};">${missile.guidanceMode || 'MIDCOURSE'}</b></div>
          <div>FLIGHT STAGE: <b style="color:var(--stat-tier-3);">${missile.stage || 'BOOST'}</b></div>
          <div>BORESIGHT OFFSET: <b style="color:${offBoresightDeg <= 30 ? 'var(--stat-tier-2)' : 'var(--stat-tier-4)'};">${offBoresightDeg}${sDeg} off seeker line</b></div>
          <div>CLOUD IMPACT: <b style="color:${cloudHits > 0 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)'};">${cloudAtten}</b></div>
          <div>DATALINK STATUS: <b style="color:${missile.hasMidcourseDatalink ? 'var(--stat-tier-2)' : 'var(--stat-tier-4)'};">${missile.hasOwnSeekerLock ? 'AUTONOMOUS SEEKER' : (missile.hasMidcourseDatalink ? 'FRIENDLY TRACK LINKED' : 'NO FRIENDLY TRACK')}</b></div>
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
            <span class="factor-name">Doppler Notch Break<span class="factor-desc">Radial closure zeroing breaks radar doppler gate.</span></span>
            <span class="factor-delta ${w.seeker === 'ARH' ? 'negative' : 'positive'}">${w.seeker === 'ARH' ? 'Vulnerable (-38% Gate Break)' : 'Immune'}</span>
          </div>
          <div class="inspection-factor-row ${w.seeker === 'PASSIVE_RADAR' ? (w.antiEmcon ? 'positive' : 'negative') : 'neutral'}">
            <span class="factor-name">EMCON Radar Shutdown<span class="factor-desc">Anti-EMCON MMW retains lock if emitter goes silent.</span></span>
            <span class="factor-delta ${w.seeker === 'PASSIVE_RADAR' ? (w.antiEmcon ? 'positive' : 'negative') : 'neutral'}">${w.seeker === 'PASSIVE_RADAR' ? (w.antiEmcon ? 'Anti-EMCON Memory' : 'Breaks on EMCON') : 'N/A'}</span>
          </div>
        </div>
      </section>`;
  }

  static renderRadarDashboard(controller, selectedEntity) {
    if (!selectedEntity || typeof selectedEntity.x !== 'number') {
      return '<div class="inspection-empty"><b>NO SENSOR TARGET</b><span>Select an aircraft, surface installation, or missile.</span></div>';
    }
    if (controller.isMissile(selectedEntity)) return this.renderMissileSeekerDashboard(controller, selectedEntity);
    if (controller.isSurface(selectedEntity)) return InspectionSurfaceRadarRenderer.renderSurfaceSensors(controller, selectedEntity);

    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const sDot = window.INSP_SVG ? window.INSP_SVG.dot : '';
    const sPm = window.INSP_SVG ? window.INSP_SVG.pm : '';
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = selectedEntity.team === commanderTeam;
    const activeLock = selectedEntity.radarLockedTarget;

    const headerTitle = isFriendly ? 'ONBOARD SENSORS & RADAR TRACKS' : 'ALLIED SENSOR COVERAGE & FRIENDLY LOCKS';
    const headerSub = isFriendly
      ? `Forward radar sweep, ground recon, and scan beam tracking from ${controller.getName(selectedEntity)}`
      : `Allied fighters and radar stations tracking ${controller.getName(selectedEntity)}`;

    let records = [];
    if (isFriendly) {
      const airPool = (game.hostileAircraft || []).filter(u => u && u.hp > 0.05);
      records = airPool.map(target => InspectionTelemetry.getSensorRecord(selectedEntity, target, game))
        .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    } else {
      const scannerPool = [
        ...(game.alliedAircraft || []),
        ...(game.surfaceUnits.filter(s => s.team === 'friendly' && (s.category === 'EW_RADAR' || s.type === 'RADAR_ARRAY' || s.type === 'S-400')))
      ].filter(u => u && u.hp > 0.05);
      records = scannerPool.map(scanner => InspectionTelemetry.getSensorRecord(scanner, selectedEntity, game))
        .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);
    }

    const spec = selectedEntity.spec || {};
    const radarName = spec.radarType || selectedEntity.model || 'Transit Transponder';
    const radarRange = spec.R_0 !== undefined ? spec.R_0 : 0;
    const scanCone = spec.radarConeDeg || 120;
    const lookDown = Math.round((spec.lookDownBonus || 0) * 100);

    const contactRowsHtml = records.map((rec) => {
      const otherUnit = isFriendly ? rec.target : rec.scanner;
      const accordionId = `sensor-${otherUnit.id}`;
      const otherName = controller.escape(controller.getName(otherUnit));
      const rangePercent = Math.min(100, ((rec.inCone ? rec.rangeKm : rec.forwardRangeKm) / theaterW) * 100);
      const distPercent = Math.min(100, (rec.distanceKm / theaterW) * 100);

      const isLocked = isFriendly
        ? Boolean(rec.detects && activeLock && activeLock.id === rec.target.id)
        : Boolean(rec.detects && rec.scanner.radarLockedTarget && rec.scanner.radarLockedTarget.id === selectedEntity.id);

      let statusClass = 'negative', statusText = `OFF-BORESIGHT (${rec.offBoresightDeg}${sDeg})`;
      if (rec.isEmcon) { statusClass = 'neutral'; statusText = 'EMCON SILENT'; }
      else if (rec.belowFloor) { statusClass = 'positive'; statusText = 'BELOW FLOOR'; }
      else if (rec.inCone) {
        if (isLocked) { statusClass = 'positive'; statusText = 'PRIMARY LOCK'; }
        else if (rec.detects) { statusClass = rec.marginKm < 15 ? 'warning' : 'positive'; statusText = rec.marginKm < 15 ? 'MARGINAL TRACK' : 'IN BEAM (TRACKED)'; }
        else statusText = 'IN CONE (OUT OF RANGE)';
      }

      const beamClass = !rec.inCone ? 'negative' : (rec.offBoresightDeg <= rec.halfConeDeg * 0.65 ? 'positive' : 'warning');
      const beamText = !rec.inCone ? `Outside Cone (${rec.offBoresightDeg}${sDeg} > ${sPm}${rec.halfConeDeg}${sDeg})` : `Aligned (${rec.offBoresightDeg}${sDeg} off nose)`;

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${otherName}</b>
              <span class="sensor-sub">Dist: ${rec.distanceKm.toFixed(1)} km | ${rec.inCone ? `Reach: ${rec.rangeKm.toFixed(1)} km` : `Forward Reach: ${rec.forwardRangeKm.toFixed(1)} km (Blind)`} ${sDot} ${rec.targetAspect}</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${statusClass}">${statusText}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${rec.detects ? 'detecting' : ''}" style="width:${rangePercent}%;"></span>
              <i class="inspection-distance-marker" style="left:${distPercent}%;"></i>
            </div>
            <div class="inspection-range-reading" style="display:flex; justify-content:space-between;">
              <span class="sensor-dist-val">Distance: <b>${rec.distanceKm.toFixed(1)} km</b></span>
              <span class="sensor-reach-val">${rec.inCone ? `Radar Reach: <b>${rec.rangeKm.toFixed(1)} km</b>` : `Forward Reach: <b>${rec.forwardRangeKm.toFixed(1)} km (Blind)</b>`}</span>
              <span class="sensor-margin-val" style="color:${rec.detects ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">
                ${!rec.inCone ? `BLIND SECTOR (${rec.offBoresightDeg}${sDeg})` : (rec.marginKm >= 0 ? `+${rec.marginKm.toFixed(1)} km margin` : `${rec.marginKm.toFixed(1)} km shortfall`)}
              </span>
            </div>
            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${beamClass} sensor-beam-row">
                <span class="factor-name">Radar Beam Alignment<span class="factor-desc">Target bearing relative to gimbal limits (${sPm}${rec.halfConeDeg}${sDeg}).</span></span>
                <span class="factor-delta ${beamClass}">${beamText}</span>
              </div>
              <div class="inspection-factor-row ${rec.rcsRatio >= 1.15 ? 'positive' : 'warning'}">
                <span class="factor-name">Target Signature &amp; Aspect<span class="factor-desc">Effective RCS: ${rec.effectiveRcs.toFixed(rec.effectiveRcs < 0.01 ? 5 : 2)} m2${rec.vhfMult > 1 ? ` | VHF ${rec.vhfMult.toFixed(1)}x` : ''}</span></span>
                <span class="factor-delta ${rec.rcsRatio >= 1.15 ? 'positive' : 'warning'}">${rec.rcsRatio.toFixed(2)}x detect factor</span>
              </div>
              ${rec.totalJamming > 0 ? `
              <div class="inspection-factor-row warning">
                <span class="factor-name">Electronic Jamming<span class="factor-desc">Active air/ground ECM suppression on sensor link.</span></span>
                <span class="factor-delta warning">${Math.round(rec.totalJamming * 100)}% Jam${rec.eccmMitigation > 0 ? ` (-${Math.round(rec.eccmMitigation * 100)}% ECCM)` : ''}</span>
              </div>` : ''}
              ${rec.tfrMasked ? `
              <div class="inspection-factor-row negative">
                <span class="factor-name">TFR Low-Altitude Masking<span class="factor-desc">Target flying below 10,000 ft with terrain-following radar.</span></span>
                <span class="factor-delta negative">-25% Look-Down Reach</span>
              </div>` : ''}
              ${rec.irstBurnThrough ? `
              <div class="inspection-factor-row positive">
                <span class="factor-name">Optical IRST Burn-Through<span class="factor-desc">Target within 28 km passive infrared acquisition range.</span></span>
                <span class="factor-delta positive">INSTANT TRACK</span>
              </div>` : ''}
            </div>
          </div>
        </details>`;
    }).join('');

    const showGround = Boolean(game.radar && game.radar.cam && game.radar.cam.showGroundTargets);
    let groundReconHtml = '';
    if (showGround && controller.isAircraft(selectedEntity)) {
      const oppGround = (game.surfaceUnits || []).filter(s => s && s.team !== selectedEntity.team && s.hp > 0.05 && !s.isIndestructible);
      if (oppGround.length > 0) {
        groundReconHtml = InspectionSurfaceRadarRenderer.renderGroundReconSection(controller, selectedEntity, oppGround);
      }
    }

    return `
      <section class="inspection-card">
        <h3>${headerTitle}</h3>
        <p class="inspection-muted">${headerSub}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.62rem var(--font-dotdigital);">
          <div>RADAR: <b style="color:var(--color-ice-highlight);">${radarName}</b></div>
          <div>BASE RANGE: <b style="color:var(--stat-tier-2);">${radarRange} km</b></div>
          <div>SCAN CONE: <b style="color:var(--theme-accent);">${scanCone >= 360 ? `360${sDeg} (OMNI)` : `${sPm}${Math.round(scanCone / 2)}${sDeg}`}</b></div>
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
          <span class="sensor-in-reach-count">${isFriendly ? 'AIR CONTACTS &amp; RADAR ENVELOPES' : 'ALLIED SENSORS TRACKING TARGET'} (${records.filter(r => r.detects).length}/${records.length} IN REACH)</span>
          <span>EXPAND FOR DETAILS</span>
        </div>
        ${contactRowsHtml || '<p class="inspection-muted" style="padding:8px;">No aircraft contacts in sector.</p>'}
      </section>
      ${groundReconHtml}`;
  }
}

window.InspectionRadarView = InspectionRadarView;
