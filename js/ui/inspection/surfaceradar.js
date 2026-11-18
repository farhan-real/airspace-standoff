/**
 * AIRSPACE STANDOFF: Inspection Sensors Submodule for Ground Recon & Surface Installations
 */

class InspectionSurfaceRadarRenderer {
  static renderGroundReconSection(controller, aircraft, groundUnits) {
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 240.0;
    const records = groundUnits
      .map(s => InspectionTelemetry.getGroundReconRecord(aircraft, s, controller.game))
      .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);

    if (records.length === 0) return '';
    const detectedCount = records.filter(r => r.detects).length;

    const rowsHtml = records.map(rec => {
      const s = rec.surface;
      const accordionId = `gnd-recon-${s.id}`;
      let statusCls = 'negative', statusTxt = 'OUT OF RECON REACH';
      if (rec.identifies) { statusCls = 'positive'; statusTxt = 'IDENTIFIED'; }
      else if (rec.detects) { statusCls = 'warning'; statusTxt = 'EMITTER TRACKED [?]'; }
      else if (s.emconTimer > 0 && s.isEmitter) { statusCls = 'neutral'; statusTxt = `EMCON SILENT (${s.emconTimer.toFixed(1)}s)`; }

      const reachKm = Math.max(rec.esmReachKm, rec.tgpReachKm, rec.sarReachKm);
      const fillPct = Math.min(100, (reachKm / theaterW) * 100);
      const distPct = Math.min(100, (rec.distanceKm / theaterW) * 100);

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${s.isPrimaryObjective ? '[OBJ] ' : ''}${controller.escape(s.name || s.type)}</b>
              <span class="gnd-recon-sub">Dist: ${rec.distanceKm.toFixed(1)} km | Max Recon: ${reachKm.toFixed(0)} km</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${statusCls} gnd-recon-badge">${statusTxt}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${rec.detects ? 'detecting' : ''}" style="width:${fillPct}%;"></span>
              <i class="inspection-distance-marker" style="left:${distPct}%;"></i>
            </div>
            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${rec.esmDetects ? 'positive' : 'neutral'}">
                <span class="factor-name">Passive ESM / HTS Receiver<span class="factor-desc">Detects active RF emitters out to ${rec.esmReachKm} km.</span></span>
                <span class="factor-delta ${rec.esmDetects ? 'positive' : 'neutral'}">${s.isEmitter ? (s.emconTimer > 0 ? 'EMCON SILENT' : (rec.esmDetects ? 'EMITTER LOCKED' : 'OUT OF ESM')) : 'PASSIVE (ZERO RF)'}</span>
              </div>
              <div class="inspection-factor-row ${rec.tgpDetects ? 'positive' : 'neutral'}">
                <span class="factor-name">Optical / Targeting Pod Recon<span class="factor-desc">${rec.needsAdvancedTgp ? 'Thermal Mockup: needs 45+ km TGP or 15 km flyby.' : `Exposes decoys & silent traps inside ${rec.tgpReachKm.toFixed(0)} km.`}</span></span>
                <span class="factor-delta ${rec.tgpDetects ? 'positive' : 'neutral'}">${rec.tgpDetects ? 'OPTICAL ID' : `${rec.tgpReachKm.toFixed(0)} km Reach`}</span>
              </div>
              <div class="inspection-factor-row ${rec.sarDetects ? 'positive' : 'neutral'}">
                <span class="factor-name">SAR Ground-Mapping Radar<span class="factor-desc">Maps non-decoy structures out to ${rec.sarReachKm.toFixed(0)} km.</span></span>
                <span class="factor-delta ${rec.sarDetects ? 'positive' : 'neutral'}">${s.isGroundDecoy ? 'CANNOT VERIFY DECOY' : (rec.sarDetects ? 'SAR MAPPED' : `${rec.sarReachKm.toFixed(0)} km Reach`)}</span>
              </div>
            </div>
          </div>
        </details>`;
    }).join('');

    return `
      <section style="margin-top:6px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span class="gnd-recon-count">GROUND RECON &amp; EMITTER TRACKS (${detectedCount}/${records.length} SPOTTED)</span>
          <span>ESM / TGP / SAR</span>
        </div>
        ${rowsHtml}
      </section>`;
  }

  static renderSurfaceSensors(controller, s) {
    const game = controller.game;
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 240.0;
    const opposingAc = (s.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft).filter(a => a && a.hp > 0.05);
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : null;
    const activeFloor = (s.canAttack && mods && mods.hasLowAltCue) ? s.cuedMinAltFt : (s.minAltFt || s.spec.minDetectAltFt || 1000);
    const vhfMult = s.counterStealthMult || 1.0;

    const airRows = opposingAc.map(ac => {
      const rec = InspectionTelemetry.getSurfaceVsAirRecord(s, ac, game, mods);
      const accId = `surf-air-${ac.id}`;
      let cls = 'negative', txt = 'OUT OF RANGE';
      if (s.emconTimer > 0) { cls = 'neutral'; txt = 'EMCON SILENT'; }
      else if (s.isPassiveElint) { cls = rec.detects ? 'positive' : 'neutral'; txt = rec.detects ? 'ELINT TRACKING' : 'NO RF / OUT OF REACH'; }
      else if (s.isJammerStation) { cls = rec.detects ? 'warning' : 'neutral'; txt = rec.detects ? 'IN JAM UMBRELLA' : 'OUTSIDE UMBRELLA'; }
      else if (rec.tfrMasked) { cls = 'positive'; txt = 'MASKED BY TFR'; }
      else if (rec.belowFloor) { cls = 'positive'; txt = 'BELOW ALT FLOOR'; }
      else if (rec.detects) { cls = 'negative'; txt = 'DETECTED / IN COVERAGE'; }

      return `
        <details class="inspection-accordion" data-accordion-id="${accId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${controller.escape(controller.getName(ac))}</b>
              <span class="surf-air-sub">Dist: ${rec.distanceKm.toFixed(1)} km | Eff Reach: ${rec.effRangeKm.toFixed(1)} km | FL${Math.round(ac.altFt / 100)}</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${cls} surf-air-badge">${txt}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${rec.detects ? 'detecting' : ''}" style="width:${Math.min(100, (rec.effRangeKm / theaterW) * 100)}%;"></span>
              <i class="inspection-distance-marker" style="left:${Math.min(100, (rec.distanceKm / theaterW) * 100)}%;"></i>
            </div>
            <div class="inspection-reason-box ${rec.detects ? 'warning' : ''}" style="margin-top:6px;">
              <b>SENSOR NOTE:</b> ${rec.reason}
            </div>
          </div>
        </details>`;
    }).join('');

    return `
      <section class="inspection-card">
        <h3>SURFACE SENSOR &amp; EW PROFILE</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:6px; font:600 0.62rem var(--font-dotdigital);">
          <div>COVERAGE: <b style="color:var(--theme-accent);">${s.rangeKm ? `${s.rangeKm} km` : 'NONE'}</b></div>
          <div>ALT FLOOR: <b style="color:var(--stat-tier-3);">${activeFloor.toLocaleString()} ft</b></div>
          <div>EMITTER TYPE: <b style="color:${s.isEmitter ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)'};">${s.isPassiveElint ? 'PASSIVE ELINT' : (s.isEmitter ? 'ACTIVE RF' : 'SILENT OPTICAL/PASSIVE')}</b></div>
          <div>COUNTER-STEALTH: <b style="color:${vhfMult > 1 ? 'var(--stat-tier-1)' : 'var(--color-moon-mist)'};">${vhfMult > 1 ? `${vhfMult.toFixed(1)}x VHF` : '1.0x STANDARD'}</b></div>
          ${s.isJammerStation ? `<div>JAM OUTPUT: <b class="surf-jam-eff" style="color:var(--color-purple);">${Math.round(s.jamEfficiency * 100)}%</b></div>` : ''}
          <div>EMCON TIMER: <b class="surf-emcon-val">${s.emconTimer > 0 ? `${s.emconTimer.toFixed(1)}s` : 'ACTIVE'}</b></div>
        </div>
      </section>
      <section style="margin-top:4px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span>OPPOSING AIRCRAFT SENSOR COVERAGE</span>
          <span>EXPAND FOR MASKING</span>
        </div>
        ${airRows || '<p class="inspection-muted" style="padding:8px;">No opposing aircraft active.</p>'}
      </section>`;
  }

  static updateLiveGroundRecon(controller, aircraft, content) {
    const game = controller.game;
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 240.0;
    const groundUnits = (game.surfaceUnits || []).filter(s => s && s.team !== aircraft.team && s.hp > 0.05 && !s.isIndestructible);
    let detectedCount = 0;

    groundUnits.forEach(s => {
      const acc = content.querySelector(`[data-accordion-id="gnd-recon-${s.id}"]`);
      if (!acc) return;
      const rec = InspectionTelemetry.getGroundReconRecord(aircraft, s, game);
      if (rec.detects) detectedCount++;
      const reachKm = Math.max(rec.esmReachKm, rec.tgpReachKm, rec.sarReachKm);

      const sub = acc.querySelector('.gnd-recon-sub');
      if (sub) sub.textContent = `Dist: ${rec.distanceKm.toFixed(1)} km | Max Recon: ${reachKm.toFixed(0)} km`;
      const badge = acc.querySelector('.gnd-recon-badge');
      if (badge) {
        let cls = 'negative', txt = 'OUT OF RECON REACH';
        if (rec.identifies) { cls = 'positive'; txt = 'IDENTIFIED'; }
        else if (rec.detects) { cls = 'warning'; txt = 'EMITTER TRACKED [?]'; }
        else if (s.emconTimer > 0 && s.isEmitter) { cls = 'neutral'; txt = `EMCON SILENT (${s.emconTimer.toFixed(1)}s)`; }
        badge.className = `factor-delta ${cls} gnd-recon-badge`;
        badge.textContent = txt;
      }
      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) { fill.style.width = `${Math.min(100, (reachKm / theaterW) * 100)}%`; fill.classList.toggle('detecting', rec.detects); }
      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (rec.distanceKm / theaterW) * 100)}%`;
    });

    const cntEl = content.querySelector('.gnd-recon-count');
    if (cntEl) cntEl.textContent = `GROUND RECON & EMITTER TRACKS (${detectedCount}/${groundUnits.length} SPOTTED)`;
  }

  static updateLiveSurfaceSensors(controller, s, content) {
    const game = controller.game;
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 240.0;
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : null;
    const emEl = content.querySelector('.surf-emcon-val');
    if (emEl) emEl.textContent = s.emconTimer > 0 ? `${s.emconTimer.toFixed(1)}s` : 'ACTIVE';
    const jamEl = content.querySelector('.surf-jam-eff');
    if (jamEl) jamEl.textContent = `${Math.round(s.jamEfficiency * 100)}%`;

    const opposingAc = (s.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft).filter(a => a && a.hp > 0.05);
    opposingAc.forEach(ac => {
      const acc = content.querySelector(`[data-accordion-id="surf-air-${ac.id}"]`);
      if (!acc) return;
      const rec = InspectionTelemetry.getSurfaceVsAirRecord(s, ac, game, mods);
      const sub = acc.querySelector('.surf-air-sub');
      if (sub) sub.textContent = `Dist: ${rec.distanceKm.toFixed(1)} km | Eff Reach: ${rec.effRangeKm.toFixed(1)} km | FL${Math.round(ac.altFt / 100)}`;
      const badge = acc.querySelector('.surf-air-badge');
      if (badge) {
        let cls = 'negative', txt = 'OUT OF RANGE';
        if (s.emconTimer > 0) { cls = 'neutral'; txt = 'EMCON SILENT'; }
        else if (s.isPassiveElint) { cls = rec.detects ? 'positive' : 'neutral'; txt = rec.detects ? 'ELINT TRACKING' : 'NO RF / OUT OF REACH'; }
        else if (s.isJammerStation) { cls = rec.detects ? 'warning' : 'neutral'; txt = rec.detects ? 'IN JAM UMBRELLA' : 'OUTSIDE UMBRELLA'; }
        else if (rec.tfrMasked) { cls = 'positive'; txt = 'MASKED BY TFR'; }
        else if (rec.belowFloor) { cls = 'positive'; txt = 'BELOW ALT FLOOR'; }
        else if (rec.detects) { cls = 'negative'; txt = 'DETECTED / IN COVERAGE'; }
        badge.className = `factor-delta ${cls} surf-air-badge`;
        badge.textContent = txt;
      }
      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) { fill.style.width = `${Math.min(100, (rec.effRangeKm / theaterW) * 100)}%`; fill.classList.toggle('detecting', rec.detects); }
      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (rec.distanceKm / theaterW) * 100)}%`;
    });
  }
}

window.InspectionSurfaceRadarRenderer = InspectionSurfaceRadarRenderer;
