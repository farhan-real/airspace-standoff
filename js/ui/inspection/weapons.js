/**
 * AIRSPACE STANDOFF: Inspection Weapons Analysis Engine
 * Real-time telemetry, off-boresight angle checks, and cloud obstruction factor reporting.
 */

class InspectionWeapons {
  static renderWeaponsDashboard(controller, entity) {
    if (!entity) {
      return '<div class="inspection-empty"><b>NO WEAPON TARGET</b><span>Select an aircraft or contact to evaluate tactical solutions.</span></div>';
    }
    if (entity.weapon && entity.target) {
      return this.renderInFlightMissileSolution(controller, entity);
    }
    if (entity.spec) {
      return this.renderAircraftWeapons(controller, entity);
    }
    return '<div class="inspection-empty"><b>NO WEAPONS INSTALLED</b><span>Ground installation or civilian transit flight has no stores management system.</span></div>';
  }

  static renderAircraftWeapons(controller, aircraft) {
    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = aircraft.team === commanderTeam;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === aircraft.id);

    let threatSectionHtml = '';
    if (incoming.length > 0) {
      threatSectionHtml = `
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

              const pkModel = (typeof MissileKinetics !== 'undefined')
                ? MissileKinetics.explainHitProbability(m, aircraft, clouds, 1)
                : { probability: 0.70, factors: {} };
              const pkPct = Math.round(pkModel.probability * 100);

              let recTitle = '';
              let recSteps = [];
              if (seeker === 'ARH' || seeker === 'PASSIVE_RADAR') {
                recTitle = 'DOPPLER NOTCH + CHAFF';
                recSteps = [
                  { name: 'Turn 90 deg Beam (Doppler Notch)', delta: '+48% Evasion', desc: 'Cuts radial closure velocity to zero, dropping missile tracking gate.' },
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
                  { name: 'Hard 90 deg Break Turn', delta: '+55% Evasion', desc: 'Exploits wide turning radius of hypersonic missile to force overshoot.' },
                  { name: 'Zoom Climb Trajectory', delta: '+25% Evasion', desc: 'Forces weapon to climb against gravity during terminal descent.' }
                ];
              } else {
                recTitle = 'PURSUIT DISRUPTION';
                recSteps = [
                  { name: 'Split-S Kinetic Dive', delta: '+45% Evasion', desc: 'Trades altitude for sprint velocity out of weapon engagement basket.' },
                  { name: 'High-G Spiral Evasion', delta: '+45% Evasion', desc: 'Induces rapid line-of-sight rotation spikes to exceed steering rate.' }
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
    } else if (isFriendly) {
      threatSectionHtml = `
        <div class="inspection-reason-box" style="border-left:3px solid var(--stat-tier-2); margin-bottom:8px;">
          <b style="color:var(--stat-tier-2);">DEFENSIVE ENVELOPE CLEAR:</b> No inbound guided munitions tracking this aircraft.
        </div>
      `;
    }

    const firingAircraft = aircraft;
    const target = isFriendly
      ? game.selectedTarget
      : ((game.activeUnit && game.activeUnit.hp > 0) ? game.activeUnit : ((game.alliedAircraft && game.alliedAircraft.find(a => a.hp > 0)) || null));

    if (!target || target.hp <= 0 || !firingAircraft) {
      const emptyMsg = isFriendly
        ? 'Select an enemy aircraft or surface installation on radar to calculate firing solutions.'
        : 'No operational friendly aircraft found to evaluate hostile firing solutions.';
      return `
        ${threatSectionHtml}
        <div class="inspection-empty">
          <b>NO ACTIVE WEAPON TARGET</b>
          <span>${emptyMsg}</span>
        </div>
      `;
    }

    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const weapons = firingAircraft.equippedWeapons || [];

    const angleToTarget = Math.atan2(target.y - firingAircraft.y, target.x - firingAircraft.x);
    let offBoresight = Math.abs((firingAircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isDecoy || w.isDecoyDrone) return '';

      const accordionId = `wpn-${w.id}-${idx}`;
      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = isRear ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && (offBoresight > maxOff);

      const pkRes = (typeof Physics !== 'undefined')
        ? Physics.calcPk(w, firingAircraft, target, clouds)
        : { pk: 50, label: 'STANDBY', color: '#64748b' };
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const bd = pkRes.breakdown || {};

      const factorRows = [
        { name: 'Base Seeker Tracking Reliability', val: `+${Math.round((bd.weaponBasePk || 0.8) * 100)}%`, good: true, desc: 'Factory seeker tracking capability against an unevading target.' },
        { name: 'Range Curve Efficiency', val: `${Math.round(((bd.rangeScore || 1.0) - 1.0) * 100)}%`, good: (bd.rangeScore || 1.0) >= 0.9, desc: `Target at ${dist.toFixed(1)} km relative to sweet spot (${bd.sweetMinKm || 15}-${bd.sweetMaxKm || 60} km).` },
        { name: 'Aspect Angle Trajectory', val: `${Math.round(((bd.aspectScore || 1.0) - 1.0) * 100)}%`, good: (bd.aspectScore || 1.0) >= 0.95, desc: bd.rearShot ? 'Rear over-the-shoulder launch bonus.' : 'Line-of-sight aspect alignment factor.' },
        { name: 'Target Defensive Break Turn', val: `-${Math.round((bd.activeEvasion || 0) * 100)}%`, good: false, desc: 'Target aerodynamic break turn disrupting proportional navigation lead.' },
        { name: 'Target Corner Speed Efficiency', val: `-${Math.round((bd.turnEfficiencyPenalty || 0) * 100)}%`, good: false, desc: 'Target turn rate efficiency based on optimal corner velocity matching.' },
        { name: 'Cloud Moisture Optical Scattering', val: `-${Math.round((bd.weatherPenalty || 0) * 100)}%`, good: false, desc: 'Atmospheric moisture cloud attenuating electro-optical / IR seeker tracking.' },
        { name: 'Shooter G-Stress Penalty', val: `-${Math.round((bd.shooterStressPenalty || 0) * 100)}%`, good: false, desc: 'Firing aircraft pilot under sustained G-load experiencing tunnel vision.' },
        { name: 'Salvo Saturation Synergy', val: `+${Math.round((bd.salvoBonus || 0) * 100)}%`, good: true, desc: 'Multiple coordinated missiles in flight saturating target defense capacity.' },
        { name: 'Mixed Seeker Dilemma', val: `+${Math.round((bd.mixedSeekerBonus || 0) * 100)}%`, good: true, desc: 'Simultaneous RF + IR missiles force contradictory defensive maneuvers.' },
        { name: 'Target Afterburner Heat Plume', val: `+${Math.round((bd.afterburnerHeatBonus || 0) * 100)}%`, good: true, desc: 'Target in afterburner provides intense thermal exhaust contrast.' },
        { name: 'Target Kinetic Energy Deficit', val: `+${Math.round((bd.targetEnergyBonus || 0) * 100)}%`, good: true, desc: 'Target energy bled in prior turns delays defensive break.' }
      ].filter(f => !f.val.startsWith('0%') && !f.val.startsWith('+0%') && !f.val.startsWith('-0%'));

      let outReason = isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}\u00B0)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE');
      const isValidSolution = inRange && !isOutsideCone;
      const pkClass = isValidSolution ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'neutral' : 'negative')) : 'negative';
      const pkLabel = isValidSolution ? `${pk}% [${pkRes.label}]` : outReason;

      let assessmentText = '';
      if (isValidSolution) {
        if (isFriendly) {
          assessmentText = (pk >= 70)
            ? 'Optimal firing solution established. Direct hit anticipated; clear for release.'
            : 'Marginal engagement solution. Coordinate multi-missile salvo or close range to defeat evasive break.';
        } else {
          assessmentText = (pk >= 70)
            ? `HIGH THREAT: Hostile has an optimal firing solution against ${controller.escape(controller.getName(target))}! Prepare Doppler notch or countermeasures.`
            : 'Hostile firing solution is degraded by range or aspect geometry. Maintain evasive separation.';
        }
      } else if (isOutsideCone) {
        assessmentText = isFriendly
          ? `Target is outside forward weapon acquisition cone (${offBoresightDeg}\u00B0 off nose). Turn aircraft towards target to acquire lock.`
          : `Hostile aircraft is pointing away (${offBoresightDeg}\u00B0 off your aircraft). Not currently aligned in their forward firing cone.`;
      } else if (dist < (w.minRangeKm || 1.0)) {
        assessmentText = isFriendly
          ? 'Target is inside minimum arming distance. Disengage with break turn.'
          : 'Hostile is inside minimum missile arming distance. Watch for close-range autocannon strafes.';
      } else {
        assessmentText = isFriendly
          ? 'Target exceeds maximum aerodynamic reach. Advance power to close distance.'
          : 'Your aircraft is beyond hostile missile maximum aerodynamic reach.';
      }

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km &bull; ${w.seeker || 'GUIDED'} &bull; ${w.damage} HP</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${pkClass} sol-pk-badge">${pkLabel}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${isValidSolution ? 'detecting' : ''}" style="width:${Math.min(100, (w.rangeKm / 150) * 100)}%;"></span>
              <i class="inspection-distance-marker" style="left:${Math.min(100, (dist / 150) * 100)}%;"></i>
            </div>
            <div class="inspection-range-reading" style="display:flex; justify-content:space-between;">
              <span class="sol-dist-reading">Target Distance: <b>${dist.toFixed(1)} km</b></span>
              <span>Envelope: <b>${w.minRangeKm || 1.0} - ${w.rangeKm} km</b></span>
              <span class="sol-status-text" style="color:${isValidSolution ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">
                ${isValidSolution ? 'IN ENVELOPE' : outReason}
              </span>
            </div>

            <div class="inspection-factors-table" style="margin-top:6px;">
              <div class="inspection-factor-row ${isOutsideCone ? 'negative' : 'positive'}">
                <span class="factor-name">Boresight Angle Alignment<span class="factor-desc">Target angle relative to forward gimbal limits (${offBoresightDeg}\u00B0 off nose).</span></span>
                <span class="factor-delta ${isOutsideCone ? 'negative' : 'positive'}">${isOutsideCone ? `BLIND ZONE (${offBoresightDeg}\u00B0)` : `IN GIMBAL ARC (${offBoresightDeg}\u00B0)`}</span>
              </div>
              ${factorRows.map(row => `
                <div class="inspection-factor-row ${row.good ? 'positive' : 'negative'}">
                  <span class="factor-name">${row.name}<span class="factor-desc">${row.desc}</span></span>
                  <span class="factor-delta ${row.good ? 'positive' : 'negative'}">${row.val}</span>
                </div>
              `).join('')}
            </div>

            <div class="inspection-reason-box ${isValidSolution && pk >= 70 ? '' : 'warning'}" style="margin-top:4px;">
              <b>ASSESSMENT:</b> ${assessmentText}
            </div>
          </div>
        </details>
      `;
    }).join('');

    const titlePrefix = isFriendly ? 'FIRING SOLUTIONS VS' : 'HOSTILE WEAPON SOLUTIONS VS';

    return `
      ${threatSectionHtml}
      <section style="margin-top:6px;">
        <div class="inspection-subhead" style="padding:0 2px 4px 2px;">
          <span class="sol-head-title">${titlePrefix} ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)</span>
          <span>EXPAND FOR DETAILS</span>
        </div>
        ${solutionsHtml || '<p class="inspection-muted" style="padding:8px;">No combat weapons installed on aircraft.</p>'}
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

    const factorRows = [
      { name: 'Base Seeker Warhead Guidance', val: `+${Math.round((factors.baseHitProbability || 0.8) * 100)}%`, good: true, desc: 'Seeker tracking accuracy in standard flight regime.' },
      { name: 'Aspect Angle Trajectory Multiplier', val: `${Math.round(((factors.aspectScore || 1.0) - 1.0) * 100)}%`, good: (factors.aspectScore || 1.0) >= 0.95, desc: 'Target presentation geometry relative to missile velocity vector.' },
      { name: 'Target Active Maneuver Evasion', val: `-${Math.round((factors.activeManeuverEvasion || 0) * 100)}%`, good: false, desc: 'Target aerodynamic break turn generating proportional pursuit lag.' },
      { name: 'Doppler Notch Gate Break', val: `-${Math.round((factors.notchBonus || 0) * 100)}%`, good: false, desc: 'Target 90 deg beaming aspect cuts radial closure velocity.' },
      { name: 'Chaff Decoy Seduction', val: `-${Math.round((factors.chaffBonus || 0) * 100)}%`, good: false, desc: 'Dispersed chaff bloom creating competing radar reflections.' },
      { name: 'Target Corner Speed Efficiency', val: `-${Math.round((factors.turnEfficiencyPenalty || 0) * 100)}%`, good: false, desc: 'Target maneuver authority matching optimal corner speed.' },
      { name: 'Target Afterburner Thermal Plume', val: `+${Math.round((factors.afterburnerHeatBonus || 0) * 100)}%`, good: true, desc: 'Target wet thrust creates high-contrast IR thermal beacon.' },
      { name: 'Target Kinetic Energy Deficit', val: `+${Math.round((factors.targetEnergyBonus || 0) * 100)}%`, good: true, desc: 'Target energy bled in prior turns delays defensive break.' },
      { name: 'Cloud Moisture Attenuation', val: `-${Math.round((factors.opticalWeatherPenalty || 0) * 100)}%`, good: false, desc: 'Moisture droplets scattering optical / IR seeker tracker.' },
      { name: 'Excessive Lead Turn Energy Drain', val: `-${Math.round((factors.excessiveTurnPenalty || 0) * 100)}%`, good: false, desc: 'Severe steering angle bled missile kinetic velocity.' }
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
                <div class="inspection-factor-row ${row.good ? 'positive' : 'negative'}">
                  <span class="factor-name">${row.name}<span class="factor-desc">${row.desc}</span></span>
                  <span class="factor-delta ${row.good ? 'positive' : 'negative'}">${row.val}</span>
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

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];

    if (entity.weapon && entity.target) {
      const tgt = entity.target;
      const dist = Math.hypot((tgt.x || 0) - entity.x, (tgt.y || 0) - entity.y);
      const mSpeedKm = Math.max(0.4, entity.speed * 0.35);
      const etaSec = (dist / mSpeedKm).toFixed(1);

      const pkModel = (typeof MissileKinetics !== 'undefined' && tgt)
        ? MissileKinetics.explainHitProbability(entity, tgt, clouds, 1) : { probability: 0.65 };
      const pkPct = Math.round(pkModel.probability * 100);

      const pkValEl = content.querySelector('.inspection-probability-value');
      if (pkValEl) pkValEl.textContent = `${pkPct}% P_k`;

      const barEl = content.querySelector('.inspection-probability-bar i');
      if (barEl) barEl.style.width = `${pkPct}%`;

      const stageEl = content.querySelector('.msl-live-stage');
      if (stageEl) stageEl.textContent = entity.stage || 'BOOST';

      const machEl = content.querySelector('.msl-live-mach');
      if (machEl) machEl.textContent = `Mach ${entity.speed.toFixed(2)}`;

      const distEl = content.querySelector('.msl-live-dist');
      if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;

      const etaEl = content.querySelector('.msl-live-eta');
      if (etaEl) etaEl.textContent = `${etaSec}s`;
      return;
    }

    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = entity.team === commanderTeam;
    const firingAircraft = entity;
    const target = isFriendly
      ? game.selectedTarget
      : ((game.activeUnit && game.activeUnit.hp > 0) ? game.activeUnit : ((game.alliedAircraft && game.alliedAircraft.find(a => a.hp > 0)) || null));

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === entity.id);
    incoming.forEach(m => {
      const acc = content.querySelector(`[data-accordion-id="threat-${m.id}"]`);
      if (!acc) return;
      const d = Math.hypot(m.x - entity.x, m.y - entity.y);
      const mSpeedKm = Math.max(0.4, m.speed * 0.35);
      const etaSec = (d / mSpeedKm).toFixed(1);

      const subEl = acc.querySelector('.threat-sub');
      if (subEl) subEl.textContent = `From: ${controller.escape(controller.getName(m.source))} &bull; ${d.toFixed(1)} km | ETA: ${etaSec}s`;

      const machEl = acc.querySelector('.threat-mach');
      if (machEl) machEl.textContent = `Mach ${m.speed.toFixed(2)}`;

      const stageEl = acc.querySelector('.threat-stage');
      if (stageEl) stageEl.textContent = m.stage || 'BOOST';

      const pkModel = (typeof MissileKinetics !== 'undefined')
        ? MissileKinetics.explainHitProbability(m, entity, clouds, 1) : { probability: 0.70 };
      const pkPct = Math.round(pkModel.probability * 100);

      const badge = acc.querySelector('.threat-badge');
      if (badge) badge.textContent = `${pkPct}% Inbound Risk`;
    });

    if (!target || target.hp <= 0 || !firingAircraft) return;
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);

    const angleToTarget = Math.atan2(target.y - firingAircraft.y, target.x - firingAircraft.x);
    let offBoresight = Math.abs((firingAircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const headTitle = content.querySelector('.sol-head-title');
    if (headTitle) {
      headTitle.textContent = isFriendly
        ? `FIRING SOLUTIONS VS ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)`
        : `HOSTILE WEAPON SOLUTIONS VS ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)`;
    }

    const weapons = firingAircraft.equippedWeapons || [];
    weapons.forEach((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isDecoy || w.isDecoyDrone) return;
      const acc = content.querySelector(`[data-accordion-id="wpn-${w.id}-${idx}"]`);
      if (!acc) return;

      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = isRear ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && (offBoresight > maxOff);

      const pkRes = (typeof Physics !== 'undefined')
        ? Physics.calcPk(w, firingAircraft, target, clouds) : { pk: 50, label: 'STANDBY' };
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const isValidSolution = inRange && !isOutsideCone;

      const sub = acc.querySelector('.sol-sub');
      if (sub) sub.textContent = `Range: ${dist.toFixed(1)} / ${w.rangeKm} km &bull; ${w.seeker || 'GUIDED'} &bull; ${w.damage} HP`;

      let outReason = isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}\u00B0)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE');
      const pkClass = isValidSolution ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'neutral' : 'negative')) : 'negative';
      const pkLabel = isValidSolution ? `${pk}% [${pkRes.label}]` : outReason;

      const badge = acc.querySelector('.sol-pk-badge');
      if (badge) {
        badge.className = `factor-delta ${pkClass} sol-pk-badge`;
        badge.textContent = pkLabel;
      }

      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) {
        fill.style.width = `${Math.min(100, (w.rangeKm / 150) * 100)}%`;
        fill.classList.toggle('detecting', isValidSolution);
      }

      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (dist / 150) * 100)}%`;

      const distReading = acc.querySelector('.sol-dist-reading b');
      if (distReading) distReading.textContent = `${dist.toFixed(1)} km`;

      const statusText = acc.querySelector('.sol-status-text');
      if (statusText) {
        statusText.textContent = isValidSolution ? 'IN ENVELOPE' : outReason;
        statusText.style.color = isValidSolution ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)';
      }
    });
  }
}

window.InspectionWeapons = InspectionWeapons;