/**
 * AIRSPACE STANDOFF: Inspection Solutions Submodule
 * Ground target solutions and in-flight missile hit probability cards.
 */

class InspectionSolutionsRenderer {
  static renderGroundTargetSolutions(controller, firingAircraft, target) {
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
          <p style="margin:2px 0 0 0; color:#fecdd3;">Weapon launch on this transit airliner will incur an immediate -2,000 VP penalty. Firing is prohibited under international airspace rules.</p>
        </div>
      `;
    } else if (isGhost) {
      roeBanner = `
        <div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-4); margin-bottom:8px;">
          <b style="color:var(--stat-tier-4);">ROE RESTRICTION: UNVERIFIED RADAR TRACK [BOGEY ?]</b>
          <p style="margin:2px 0 0 0; color:#fed7aa;">Target is an unverified radar skin track. Firing prior to NCTR radar identification will trigger an automatic -600 VP penalty.</p>
        </div>
      `;
    }

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isDecoy || w.isDecoyDrone) return '';

      const accordionId = `wpn-${w.id}-${idx}`;
      const isGroundCompatible = (w.category === 'A2G' || w.isBunkerCracker || w.category === 'GUN' || w.isLaser);

      if (!isGroundCompatible && !isCivilian) {
        return `
          <details class="inspection-accordion" data-accordion-id="${accordionId}">
            <summary class="inspection-accordion-summary">
              <div class="inspection-accordion-title">
                <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
                <span class="sol-sub">Range: ${w.rangeKm} km &bull; Air-to-Air Munition</span>
              </div>
              <div class="inspection-accordion-meta">
                <span class="factor-delta negative">AIR TARGET ONLY</span>
                <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
              </div>
            </summary>
            <div class="inspection-accordion-body">
              <div class="inspection-reason-box warning">
                <b>INCOMPATIBLE TARGET:</b> ${w.name} is an air-to-air weapon and cannot acquire or engage surface installations. Select an air-to-ground munition (Kinzhal, JASSM-ER, SDB) or autocannon.
              </div>
            </div>
          </details>
        `;
      }

      const pkRes = (typeof Physics !== 'undefined')
        ? Physics.calcPk(w, firingAircraft, target, clouds)
        : { pk: 75, label: 'LOCKED', color: '#10b981' };
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const isValid = inRange && pk > 0;
      const pkClass = isValid ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative';

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km &bull; ${w.seeker || 'GROUND'} &bull; ${w.damage} HP</span>
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
              <b>TACTICAL ASSESSMENT:</b> ${isValid ? `Target is within ballistic delivery basket. Weapon impact will deliver ${w.damage} structural damage.` : `Installation is beyond delivery reach by ${(dist - w.rangeKm).toFixed(1)} km. Advance to close distance.`}
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
    const w = missile.weapon || {};
    const tgt = missile.target;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const dist = Math.hypot((tgt.x || 0) - missile.x, (tgt.y || 0) - missile.y);

    const pkModel = (typeof MissileKinetics !== 'undefined' && tgt)
      ? MissileKinetics.explainHitProbability(missile, tgt, clouds, 1)
      : { probability: 0.65, factors: {} };

    const pkPct = Math.round(pkModel.probability * 100);
    const factors = pkModel.factors || {};
    const therm = factors.thermalModifier !== undefined ? factors.thermalModifier : 0;

    const factorRows = [
      { name: 'Base Seeker Warhead Guidance', val: `+${Math.round((factors.baseHitProbability || 0.8) * 100)}%`, type: 'positive', desc: 'Seeker tracking accuracy in standard flight regime.' },
      { name: 'Aspect Angle Trajectory Multiplier', val: `${Math.round(((factors.aspectScore || 1.0) - 1.0) * 100)}%`, type: (factors.aspectScore || 1.0) >= 0.95 ? 'positive' : 'warning', desc: 'Target presentation geometry relative to missile velocity vector.' },
      { name: 'Target Active Maneuver Evasion', val: `-${Math.round((factors.activeManeuverEvasion || 0) * 100)}%`, type: 'negative', desc: 'Target aerodynamic break turn generating proportional pursuit lag.' },
      { name: 'Doppler Notch Gate Break', val: `-${Math.round((factors.notchBonus || 0) * 100)}%`, type: 'negative', desc: 'Target 90 deg beaming aspect cuts radial closure velocity.' },
      { name: 'Chaff Decoy Seduction', val: `-${Math.round((factors.chaffBonus || 0) * 100)}%`, type: 'negative', desc: 'Dispersed chaff bloom creating competing radar reflections.' },
      { name: 'Target Corner Speed Efficiency', val: `-${Math.round((factors.turnEfficiencyPenalty || 0) * 100)}%`, type: (factors.turnEfficiencyPenalty || 0) <= 0.08 ? 'warning' : 'negative', desc: 'Target maneuver authority matching optimal corner speed.' },
      therm > 0
        ? { name: 'Target Afterburner Thermal Plume', val: `+${Math.round(therm * 100)}%`, type: 'positive', desc: 'Target wet thrust creates high-contrast IR thermal beacon.' }
        : { name: 'Suppressed Thermal IR Exhaust', val: `${Math.round(therm * 100)}%`, type: 'warning', desc: 'Target engine cooling or idle throttle suppresses infrared seeker tracking.' },
      { name: 'Target Kinetic Energy Deficit', val: `+${Math.round((factors.targetEnergyBonus || 0) * 100)}%`, type: 'positive', desc: 'Target energy bled in prior turns delays defensive break.' },
      { name: 'Cloud Moisture Attenuation', val: `-${Math.round((factors.opticalWeatherPenalty || 0) * 100)}%`, type: (factors.opticalWeatherPenalty || 0) <= 0.15 ? 'warning' : 'negative', desc: 'Moisture droplets scattering optical / IR seeker tracker.' },
      { name: 'Excessive Lead Turn Energy Drain', val: `-${Math.round((factors.excessiveTurnPenalty || 0) * 100)}%`, type: 'negative', desc: 'Severe steering angle bled missile kinetic velocity.' }
    ].filter(f => !f.val.startsWith('0%') && !f.val.startsWith('+0%') && !f.val.startsWith('-0%'));

    const mSpeedKm = Math.max(0.4, missile.speed * 0.35);
    const etaSec = (dist / mSpeedKm).toFixed(1);

    return `
      <section class="inspection-probability-card ${pkPct >= 70 ? 'high' : (pkPct >= 45 ? 'medium' : 'low')}">
        <div class="inspection-probability-head">
          <b>TERMINAL INTERCEPT ESTIMATE</b>
          <span class="inspection-probability-value">${pkPct}% P_k</span>
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
            <div class="inspection-accordion-title">
              <b>PROBABILITY CALCULATION FACTORS</b>
              <span>Net impact of aerodynamics, guidance, and defenses</span>
            </div>
            <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-factors-table">
              ${factorRows.map(row => `
                <div class="inspection-factor-row ${row.type}">
                  <span class="factor-name">${row.name}<span class="factor-desc">${row.desc}</span></span>
                  <span class="factor-delta ${row.type}">${row.val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </details>

        <div class="inspection-reason-box" style="margin-top:6px;">
          ${pkPct >= 70
            ? 'TERMINAL GUIDANCE LOCKED: Proportional navigation collision course established. High kill probability.'
            : 'TERMINAL GUIDANCE DEGRADED: Target evasive break or countermeasure deployment is creating line-of-sight tracking errors.'}
        </div>
      </section>
    `;
  }
}

window.InspectionSolutionsRenderer = InspectionSolutionsRenderer;