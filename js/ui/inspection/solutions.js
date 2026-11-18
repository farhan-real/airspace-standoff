/**
 * AIRSPACE STANDOFF: Inspection Solutions Submodule
 * Ground target solutions, inbound missile threat assessments, and terminal probability cards.
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
            const mSpeedKm = Math.max(0.4, m.speed * 0.35);
            const etaSec = (d / mSpeedKm).toFixed(1);
            const seeker = m.weapon ? m.weapon.seeker : 'ARH';
            const pkModel = MissileKinetics.explainHitProbability(m, aircraft, clouds, 1);
            const pkPct = Math.round(pkModel.probability * 100);

            let recTitle = 'PURSUIT DISRUPTION';
            let recSteps = [
              { name: 'Split-S Kinetic Dive', delta: '+45% Evasion', desc: 'Trades altitude for sprint velocity out of weapon engagement basket.' },
              { name: 'High-G Spiral Evasion', delta: '+45% Evasion', desc: 'Induces rapid line-of-sight rotation spikes to exceed steering rate.' }
            ];
            if (seeker === 'ARH' || seeker === 'PASSIVE_RADAR') {
              recTitle = 'DOPPLER NOTCH + CHAFF';
              recSteps = [
                { name: 'Turn 90&deg; Beam (Doppler Notch)', delta: '+48% Evasion', desc: 'Cuts radial closure velocity to zero, dropping missile tracking gate.' },
                { name: 'Deploy Chaff Salvo', delta: '+34% Evasion', desc: 'Creates false zero-Doppler radar bloom to seduce seeker away.' },
                { name: 'Throttle to Corner Velocity', delta: '+20% Turn Authority', desc: 'Aligns speed with sOpt to execute a maximum-G defensive break turn.' }
              ];
            } else if (seeker === 'IIR' || seeker === 'EO') {
              recTitle = 'THERMAL CUT + CLOUD DIVE';
              recSteps = [
                { name: 'Pull Throttle to IDLE', delta: '+28% Evasion', desc: 'Cools engine exhaust plume and terminates afterburner thermal IR bloom.' },
                { name: 'Dive into Weather Clouds', delta: '+25% Evasion', desc: 'Moisture droplets scatter optical and imaging infrared matrix seekers.' },
                { name: 'High-G Barrel Roll Break', delta: '+45% Evasion', desc: 'Displaces aircraft outside proportional pursuit lead trajectory.' }
              ];
            } else if (seeker === 'INS') {
              recTitle = 'HIGH-G KINETIC BREAK';
              recSteps = [
                { name: 'Hard 90&deg; Break Turn', delta: '+55% Evasion', desc: 'Exploits wide turning radius of hypersonic missile to force overshoot.' },
                { name: 'Zoom Climb Trajectory', delta: '+25% Evasion', desc: 'Forces weapon to climb against gravity during terminal descent.' }
              ];
            }

            return `
              <details class="inspection-accordion threat" data-accordion-id="${accordionId}" style="border-color:rgba(244,63,94,0.45); background:rgba(24,6,12,0.75);">
                <summary class="inspection-accordion-summary">
                  <div class="inspection-accordion-title">
                    <b style="color:#fecdd3;">${controller.escape(m.weapon ? m.weapon.name : 'MISSILE')}</b>
                    <span class="threat-sub">From: ${controller.escape(controller.getName(m.source))} &bull; ${d.toFixed(1)} km | ETA: ${etaSec}s</span>
                  </div>
                  <div class="inspection-accordion-meta">
                    <span class="factor-delta negative threat-badge">${pkPct}% Inbound Risk</span>
                    <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
                  </div>
                </summary>
                <div class="inspection-accordion-body">
                  <div style="display:flex; justify-content:space-between; font:600 0.64rem var(--font-dotdigital); color:var(--color-moon-mist);">
                    <span>SEEKER: <b style="color:var(--stat-tier-3);">${seeker}</b></span>
                    <span>VELOCITY: <b class="threat-mach" style="color:var(--color-red);">Mach ${m.speed.toFixed(2)}</b></span>
                    <span>STAGE: <b class="threat-stage" style="color:var(--theme-accent);">${m.stage || 'BOOST'}</b></span>
                  </div>
                  <div class="inspection-factors-table" style="margin-top:6px;">
                    <div class="inspection-factor-row neutral">
                      <span class="factor-name">DEFENSE PROTOCOL: ${recTitle}<span class="factor-desc">Execute recommended actions to maximize probability of defeat.</span></span>
                      <span class="factor-delta info">DEFENSE</span>
                    </div>
                    ${recSteps.map(step => `
                      <div class="inspection-factor-row positive">
                        <span class="factor-name">${step.name}<span class="factor-desc">${step.desc}</span></span>
                        <span class="factor-delta positive">${step.delta}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </details>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  static renderGroundTargetSolutions(controller, firingAircraft, target) {
    const sDot = window.INSP_SVG ? window.INSP_SVG.dot : '';
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const weapons = firingAircraft.equippedWeapons || [];

    const isCivilian = Boolean(target.isCivilian);
    const isGhost = Boolean(target.isGhost);

    let roeBanner = '';
    if (isCivilian) {
      roeBanner = `
        <div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-bottom:8px;">
          <b style="color:var(--stat-tier-5);">ROE DIRECTIVE: PROTECTED CIVILIAN AIRLINER</b>
          <p style="margin:2px 0 0 0; color:#fecdd3;">Weapon launch on this transit airliner incurs an immediate -2,000 VP penalty.</p>
        </div>
      `;
    } else if (isGhost) {
      roeBanner = `
        <div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-4); margin-bottom:8px;">
          <b style="color:var(--stat-tier-4);">ROE RESTRICTION: UNVERIFIED RADAR TRACK [BOGEY ?]</b>
          <p style="margin:2px 0 0 0; color:#fed7aa;">Firing prior to identification triggers an automatic -600 VP penalty.</p>
        </div>
      `;
    }

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return '';

      const accordionId = `wpn-${w.id}-${idx}`;
      const isGroundCompatible = (w.category === 'A2G' || w.isBunkerCracker || w.isCluster || w.category === 'GUN' || w.isLaser);

      if (!isGroundCompatible && !isCivilian) {
        return `
          <details class="inspection-accordion" data-accordion-id="${accordionId}">
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
              <div class="inspection-reason-box warning">
                <b>INCOMPATIBLE TARGET:</b> ${w.name} is an air-to-air weapon and cannot engage ground installations.
              </div>
            </div>
          </details>
        `;
      }

      const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const isValid = inRange && pk > 0;
      const pkClass = isValid ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative';

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km ${sDot} ${w.seeker || 'GROUND'} ${sDot} ${w.damage} HP</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${pkClass} sol-pk-badge">${isValid ? `${pk}% [${pkRes.label}]` : 'OUT OF RANGE'}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-reading" style="display:flex; justify-content:space-between;">
              <span class="sol-dist-reading">Installation Distance: <b>${dist.toFixed(1)} km</b></span>
              <span>Reach: <b>${w.rangeKm} km</b></span>
              <span class="sol-status-text" style="color:${isValid ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">
                ${isValid ? 'READY FOR RELEASE' : 'OUT OF RANGE'}
              </span>
            </div>
            <div class="inspection-reason-box ${isValid ? '' : 'warning'}" style="margin-top:6px;">
              <b>COMBAT ASSESSMENT:</b> ${isValid ? `Target is inside ballistic delivery basket (${target.armorClass || 'SOFT'} armor).` : `Installation is beyond delivery reach by ${(dist - w.rangeKm).toFixed(1)} km.`}
            </div>
          </div>
        </details>
      `;
    }).join('');

    return `
      ${roeBanner}
      <section style="margin-top:4px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span>STRIKE SOLUTIONS VS ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)</span>
          <span>EXPAND FOR DETAILS</span>
        </div>
        ${solutionsHtml || '<p class="inspection-muted" style="padding:8px;">No ground-attack munitions installed on active aircraft.</p>'}
      </section>
    `;
  }

  static renderInFlightMissileSolution(controller, missile) {
    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const w = missile.weapon || {};
    const tgt = missile.target;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const dist = Math.hypot((tgt.x || 0) - missile.x, (tgt.y || 0) - missile.y);

    const pkModel = tgt
      ? MissileKinetics.explainHitProbability(missile, tgt, clouds, 1)
      : { probability: 0.0, factors: {} };

    const pkPct = Math.round(pkModel.probability * 100);
    const factors = pkModel.factors || {};
    const therm = factors.thermalModifier !== undefined ? factors.thermalModifier : 0;

    const factorRows = [
      { name: 'Base Seeker Warhead Guidance', val: `+${Math.round((factors.baseHitProbability || 0.8) * 100)}%`, type: 'positive', desc: 'Seeker tracking accuracy in standard flight regime.' },
      factors.kineticRetention !== undefined ? {
        name: 'Aerodynamic Energy Retention', val: `${Math.round(((factors.kineticRetention || 1.0) - 1.0) * 100)}%`,
        type: (factors.kineticRetention || 1.0) >= 0.85 ? 'positive' : ((factors.kineticRetention || 1.0) >= 0.65 ? 'warning' : 'negative'),
        desc: 'Ballistic drag decay over flight path.'
      } : null,
      { name: 'Aspect Angle Trajectory', val: `${Math.round(((factors.aspectScore || 1.0) - 1.0) * 100)}%`, type: (factors.aspectScore || 1.0) >= 0.95 ? 'positive' : 'warning', desc: 'Target geometry relative to missile velocity vector.' },
      { name: 'Target Active Evasion', val: `-${Math.round((factors.activeManeuverEvasion || 0) * 100)}%`, type: 'negative', desc: 'Target break turn generating pursuit lag.' },
      { name: 'Doppler Notch Gate Break', val: `-${Math.round((factors.notchBonus || 0) * 100)}%`, type: 'negative', desc: `Target 90${sDeg} beam cuts closure velocity.` },
      { name: 'Chaff Decoy Seduction', val: `-${Math.round((factors.chaffBonus || 0) * 100)}%`, type: 'negative', desc: 'Chaff bloom creating competing reflections.' },
      therm !== 0 ? { name: therm > 0 ? 'Target Thermal Heat Plume' : 'Suppressed Thermal Exhaust', val: `${therm > 0 ? '+' : ''}${Math.round(therm * 100)}%`, type: therm > 0 ? 'positive' : 'warning', desc: 'Engine thermal emission effect on IR tracker.' } : null,
      { name: 'Cloud Moisture Attenuation', val: `-${Math.round((factors.opticalWeatherPenalty || 0) * 100)}%`, type: 'warning', desc: 'Moisture scattering optical / IR tracker.' }
    ].filter(Boolean).filter(f => !f.val.startsWith('0%') && !f.val.startsWith('+0%') && !f.val.startsWith('-0%'));

    const mSpeedKm = Math.max(0.4, missile.speed * 0.35);
    const etaSec = (dist / mSpeedKm).toFixed(1);

    return `
      <section class="inspection-probability-card ${pkPct >= 70 ? 'high' : (pkPct >= 45 ? 'medium' : 'low')}">
        <div class="inspection-probability-head">
          <b>TERMINAL INTERCEPT ESTIMATE</b>
          <span class="inspection-probability-value">${pkPct}% Pk</span>
        </div>
        <div class="inspection-probability-bar"><i style="width:${pkPct}%;"></i></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font:600 0.64rem var(--font-dotdigital); color:var(--color-moon-mist); margin-top:4px;">
          <div>MISSILE: <b style="color:var(--color-ice-highlight);">${w.name || 'MISSILE'}</b></div>
          <div>SEEKER: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'}</b></div>
          <div>FLIGHT STAGE: <b class="msl-live-stage" style="color:var(--stat-tier-3);">${missile.stage || 'BOOST'}</b></div>
          <div>VELOCITY: <b class="msl-live-mach" style="color:var(--theme-accent);">Mach ${missile.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b class="msl-live-dist">${dist.toFixed(1)} km</b></div>
          <div>ETA TO INTERCEPT: <b class="msl-live-eta" style="color:var(--stat-tier-1);">${etaSec}s</b></div>
        </div>
        <details class="inspection-accordion" style="margin-top:6px;">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title"><b>PROBABILITY CALCULATION FACTORS</b><span>Aerodynamics, guidance, and defenses</span></div>
            <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-factors-table">
              ${factorRows.map(row => `<div class="inspection-factor-row ${row.type}"><span class="factor-name">${row.name}<span class="factor-desc">${row.desc}</span></span><span class="factor-delta ${row.type}">${row.val}</span></div>`).join('')}
            </div>
          </div>
        </details>
      </section>
    `;
  }
}

window.InspectionSolutionsRenderer = InspectionSolutionsRenderer;
