/**
 * AIRSPACE STANDOFF: Inspection Solutions Submodule
 * Ground target strike solutions, inbound missile defense protocols, and terminal intercept cards.
 */

class InspectionSolutionsRenderer {
  static renderInboundThreats(controller, aircraft, incoming, clouds) {
    if (!incoming || incoming.length === 0) return '';
    return `
      <section style="margin-bottom:8px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px; color:#fecdd3;">
          <span class="threat-head-title">INBOUND GUIDED THREATS (${incoming.length} MISSILES TRACKING)</span>
          <span>EXPAND FOR DEFENSE PROTOCOL</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          ${incoming.map((m) => {
            const accordionId = `threat-${m.id}`;
            const d = Math.hypot(m.x - aircraft.x, m.y - aircraft.y);
            const etaSec = (d / Math.max(0.4, m.speed * 0.35)).toFixed(1);
            const seeker = m.weapon ? m.weapon.seeker : 'ARH';
            const pkPct = Math.round(MissileKinetics.explainHitProbability(m, aircraft, clouds, 1).probability * 100);

            let recTitle = 'PURSUIT DISRUPTION';
            const recSteps = [];
            if (seeker === 'ARH' || seeker === 'PASSIVE_RADAR') {
              recTitle = 'DOPPLER NOTCH + CHAFF';
              recSteps.push(
                { name: 'Turn 90deg Beam (Doppler Notch)', delta: '+48% Evasion', desc: 'Cuts radial closure velocity to zero, dropping radar gate.' },
                { name: 'Deploy Chaff Salvo', delta: '+34% Evasion', desc: 'Creates competing radar return.' }
              );
              if (m.weapon && m.weapon.category === 'SAM' && aircraft.hasTfrMasking) {
                recSteps.push({ name: 'Descend Below 10,000 ft (TFR)', delta: '+2,500 ft SAM Floor', desc: 'Terrain-following radar prevents follow-up SAM launches.' });
              }
            } else if (seeker === 'IIR' || seeker === 'EO') {
              recTitle = 'THERMAL CUT + CLOUD DIVE';
              recSteps.push(
                { name: 'Pull Throttle to IDLE', delta: '+28% Evasion', desc: 'Cools exhaust plume and reduces thermal bloom.' },
                { name: 'Dive into Weather Clouds', delta: '+25% Evasion', desc: 'Moisture scatters imaging infrared seekers.' }
              );
              if (aircraft.dircmEvasion > 0) {
                recSteps.push({ name: 'DIRCM IR Turret Active', delta: `+${Math.round(aircraft.dircmEvasion * 100)}% Evasion`, desc: 'Onboard laser turret actively blinding heat-seeking warhead.' });
              }
            } else {
              recSteps.push(
                { name: 'Hard 90deg Break Turn', delta: '+55% Evasion', desc: 'Exploits wide hypersonic turn radius to force overshoot.' },
                { name: 'Split-S Kinetic Dive', delta: '+45% Evasion', desc: 'Trades altitude for sprint velocity.' }
              );
            }

            return `
              <details class="inspection-accordion threat" data-accordion-id="${accordionId}" style="border-color:rgba(244,63,94,0.45); background:rgba(24,6,12,0.75);">
                <summary class="inspection-accordion-summary">
                  <div class="inspection-accordion-title">
                    <b style="color:#fecdd3;">${controller.escape(m.weapon ? m.weapon.name : 'MISSILE')}</b>
                    <span class="threat-sub">From: ${controller.escape(controller.getName(m.source))} | ${d.toFixed(1)} km | ETA: ${etaSec}s</span>
                  </div>
                  <div class="inspection-accordion-meta">
                    <span class="factor-delta negative threat-badge">${pkPct}% Inbound Risk</span>
                    <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
                  </div>
                </summary>
                <div class="inspection-accordion-body">
                  <div style="display:flex; justify-content:space-between; font:600 0.62rem var(--font-dotdigital); color:var(--color-moon-mist);">
                    <span>SEEKER: <b style="color:var(--stat-tier-3);">${seeker}</b></span>
                    <span>VELOCITY: <b class="threat-mach" style="color:var(--color-red);">Mach ${m.speed.toFixed(2)}</b></span>
                    <span>STAGE: <b class="threat-stage" style="color:var(--theme-accent);">${m.stage || 'BOOST'}</b></span>
                  </div>
                  <div class="inspection-factors-table" style="margin-top:6px;">
                    <div class="inspection-factor-row neutral">
                      <span class="factor-name">DEFENSE PROTOCOL: ${recTitle}<span class="factor-desc">Execute actions to defeat incoming lock.</span></span>
                      <span class="factor-delta info">DEFENSE</span>
                    </div>
                    ${recSteps.map(step => `<div class="inspection-factor-row positive"><span class="factor-name">${step.name}<span class="factor-desc">${step.desc}</span></span><span class="factor-delta positive">${step.delta}</span></div>`).join('')}
                  </div>
                </div>
              </details>`;
          }).join('')}
        </div>
      </section>`;
  }

  static renderGroundTargetSolutions(controller, firingAircraft, target) {
    const sDot = window.INSP_SVG ? window.INSP_SVG.dot : '';
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 240.0;
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const weapons = firingAircraft.equippedWeapons || [];

    const isCivilian = Boolean(target.isCivilian);
    const isGhost = Boolean(target.isGhost);
    const isSurf = controller.isSurface(target);

    let roeBanner = '';
    if (isCivilian) roeBanner = '<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-bottom:8px;"><b style="color:var(--stat-tier-5);">ROE DIRECTIVE: PROTECTED CIVILIAN AIRLINER</b><p style="margin:2px 0 0 0; color:#fecdd3;">Weapon launch incurs -2,000 VP penalty.</p></div>';
    else if (isGhost) roeBanner = '<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-4); margin-bottom:8px;"><b style="color:var(--stat-tier-4);">ROE RESTRICTION: UNVERIFIED TRACK [BOGEY ?]</b><p style="margin:2px 0 0 0; color:#fed7aa;">Firing prior to ID incurs -600 VP penalty.</p></div>';

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return '';
      const isGroundCompatible = (w.category === 'A2G' || w.isBunkerCracker || w.isCluster || w.category === 'GUN' || w.isLaser);

      if (!isGroundCompatible && !isCivilian) {
        return `
          <details class="inspection-accordion" data-accordion-id="wpn-${w.id}-${idx}">
            <summary class="inspection-accordion-summary">
              <div class="inspection-accordion-title">
                <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
                <span class="sol-sub">Range: ${w.rangeKm} km ${sDot} Air-to-Air Munition</span>
              </div>
              <div class="inspection-accordion-meta">
                <span class="factor-delta negative">AIR TARGET ONLY</span>
                <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
              </div>
            </summary>
            <div class="inspection-accordion-body">
              <div class="inspection-reason-box warning"><b>INCOMPATIBLE TARGET:</b> ${w.name} is an air-to-air weapon and cannot strike ground installations.</div>
            </div>
          </details>`;
      }

      if (isSurf) {
        return InspectionSurfaceWeaponsRenderer.renderAirToGroundCard(controller, firingAircraft, target, item, idx, clouds, theaterW);
      }

      const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const isValid = dist <= w.rangeKm && dist >= (w.minRangeKm || 0.8) && pk > 0;
      return `
        <details class="inspection-accordion" data-accordion-id="wpn-${w.id}-${idx}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${isValid ? 'positive' : 'negative'}">${isValid ? `${pk}% [${pkRes.label}]` : 'OUT OF RANGE'}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
        </details>`;
    }).join('');

    return `
      ${roeBanner}
      <section style="margin-top:6px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span class="sol-head-title">STRIKE SOLUTIONS VS ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)</span>
          <span>EXPAND FOR DETAILS</span>
        </div>
        ${solutionsHtml || '<p class="inspection-muted" style="padding:8px;">No ground-attack munitions installed on active aircraft.</p>'}
      </section>`;
  }

  static renderInFlightMissileSolution(controller, missile) {
    const w = missile.weapon || {};
    const tgt = missile.target;
    const clouds = (controller.game && controller.game.simulation && controller.game.simulation.weatherClouds) || [];
    const dist = Math.hypot((tgt.x || 0) - missile.x, (tgt.y || 0) - missile.y);

    const isSurfTgt = controller.isSurface(tgt);
    let pkPct = 85;
    let factorRows = [];

    if (isSurfTgt) {
      const hitChance = MissileImpactSystem.calcSurfaceHitChance(missile, tgt, clouds);
      pkPct = Math.round(hitChance * 100);
      factorRows = [
        { name: 'Base A2G Weapon Accuracy (T_0)', val: `${Math.round(w.T_0 * 100)}%`, type: 'positive', desc: 'Nominal weapon release guidance precision.' },
        missile.launchTgpBonus > 0 ? { name: 'Targeting Pod Lock Bonus', val: `+${Math.round(missile.launchTgpBonus * 100)}%`, type: 'positive', desc: 'Laser/optical designation enhancement.' } : null,
        missile.launchCcipBonus > 0 ? { name: 'CCIP Ballistic Computer', val: `+${Math.round(missile.launchCcipBonus * 100)}%`, type: 'positive', desc: 'Computed impact release.' } : null,
        missile.launchMitlBonus > 0 ? { name: 'MITL Two-Way Datalink', val: `+${Math.round(missile.launchMitlBonus * 100)}%`, type: 'positive', desc: 'Mid-course correction link.' } : null
      ].filter(Boolean);
    } else {
      const pkModel = tgt ? MissileKinetics.explainHitProbability(missile, tgt, clouds, 1) : { probability: 0.0, factors: {} };
      pkPct = Math.round(pkModel.probability * 100);
      const f = pkModel.factors || {};
      factorRows = [
        { name: 'Base Seeker Guidance', val: `+${Math.round((f.baseHitProbability || 0.8) * 100)}%`, type: 'positive', desc: 'Seeker tracking precision.' },
        { name: 'Kinetic Energy Retention', val: `${Math.round(((f.kineticRetention || 1.0) - 1.0) * 100)}%`, type: (f.kineticRetention || 1.0) >= 0.8 ? 'positive' : 'warning', desc: 'Aerodynamic drag decay over distance.' },
        f.notchBonus > 0 ? { name: 'Doppler Notch Break', val: `-${Math.round(f.notchBonus * 100)}%`, type: 'negative', desc: 'Target 90deg beam reducing closure rate.' } : null,
        f.chaffBonus > 0 ? { name: 'Countermeasure Diversion', val: `-${Math.round(f.chaffBonus * 100)}%`, type: 'negative', desc: 'Chaff/decoy interference.' } : null,
        f.dircmBonus > 0 ? { name: 'Target DIRCM IR Jammer', val: `-${Math.round(f.dircmBonus * 100)}%`, type: 'negative', desc: 'Infrared turret blinding seeker.' } : null
      ].filter(Boolean);
    }

    const etaSec = (dist / Math.max(0.4, missile.speed * 0.35)).toFixed(1);
    return `
      <section class="inspection-probability-card ${pkPct >= 70 ? 'high' : (pkPct >= 45 ? 'medium' : 'low')}">
        <div class="inspection-probability-head">
          <b>TERMINAL INTERCEPT ESTIMATE</b>
          <span class="inspection-probability-value">${pkPct}% Pk</span>
        </div>
        <div class="inspection-probability-bar"><i style="width:${pkPct}%;"></i></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font:600 0.62rem var(--font-dotdigital); color:var(--color-moon-mist); margin-top:4px;">
          <div>MISSILE: <b style="color:var(--color-ice-highlight);">${w.name || 'MISSILE'}</b></div>
          <div>SEEKER: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'}</b></div>
          <div>STAGE: <b class="msl-live-stage" style="color:var(--stat-tier-3);">${missile.stage || 'BOOST'}</b></div>
          <div>VELOCITY: <b class="msl-live-mach" style="color:var(--theme-accent);">Mach ${missile.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b class="msl-live-dist">${dist.toFixed(1)} km</b></div>
          <div>ETA: <b class="msl-live-eta" style="color:var(--stat-tier-1);">${etaSec}s</b></div>
        </div>
        <details class="inspection-accordion" style="margin-top:6px;">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title"><b>PROBABILITY CALCULATION FACTORS</b><span>Guidance, armor, and defenses</span></div>
            <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-factors-table">
              ${factorRows.map(r => `<div class="inspection-factor-row ${r.type}"><span class="factor-name">${r.name}<span class="factor-desc">${r.desc}</span></span><span class="factor-delta ${r.type}">${r.val}</span></div>`).join('')}
            </div>
          </div>
        </details>
      </section>`;
  }
}

window.InspectionSolutionsRenderer = InspectionSolutionsRenderer;
