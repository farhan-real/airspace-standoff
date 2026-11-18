/**
 * AIRSPACE STANDOFF: Inspection Weapons Analysis Engine
 * Real-time telemetry, off-boresight angle checks, and cloud obstruction factor reporting.
 */

class InspectionWeapons {
  static renderWeaponsDashboard(controller, entity) {
    if (!entity) {
      return '<div class="inspection-empty"><b>NO WEAPON TARGET</b><span>Select an aircraft or contact to evaluate firing solutions.</span></div>';
    }
    if (entity.weapon && entity.target) {
      return (typeof InspectionSolutionsRenderer !== 'undefined')
        ? InspectionSolutionsRenderer.renderInFlightMissileSolution(controller, entity) : '';
    }
    if (entity.spec) return this.renderAircraftWeapons(controller, entity);

    const game = controller.game;
    const activeFighter = game ? game.activeUnit : null;
    if (activeFighter && activeFighter.hp > 0 && activeFighter.spec && typeof InspectionSolutionsRenderer !== 'undefined') {
      return InspectionSolutionsRenderer.renderGroundTargetSolutions(controller, activeFighter, entity);
    }

    return '<div class="inspection-empty"><b>NO WEAPONS INSTALLED</b><span>Ground installation or civilian transit flight has no stores management system.</span></div>';
  }

  static renderAircraftWeapons(controller, aircraft) {
    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = aircraft.team === commanderTeam;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === aircraft.id);
    let threatSectionHtml = '';
    if (incoming.length > 0 && typeof InspectionSolutionsRenderer !== 'undefined') {
      threatSectionHtml = InspectionSolutionsRenderer.renderInboundThreats(controller, aircraft, incoming, clouds);
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
      return `${threatSectionHtml}<div class="inspection-empty"><b>NO ACTIVE WEAPON TARGET</b><span>${emptyMsg}</span></div>`;
    }

    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const weapons = firingAircraft.equippedWeapons || [];
    const angleToTarget = Math.atan2(target.y - firingAircraft.y, target.x - firingAircraft.x);
    let offBoresight = Math.abs((firingAircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    let roeBanner = '';
    if (target.isCivilian) {
      roeBanner = `<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-bottom:8px;"><b style="color:var(--stat-tier-5);">ROE DIRECTIVE: PROTECTED CIVILIAN AIRLINER</b><p style="margin:2px 0 0 0; color:#fecdd3;">Firing incurs an immediate -2,000 VP penalty.</p></div>`;
    } else if (target.isGhost) {
      roeBanner = `<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-4); margin-bottom:8px;"><b style="color:var(--stat-tier-4);">ROE RESTRICTION: UNVERIFIED TRACK [BOGEY ?]</b><p style="margin:2px 0 0 0; color:#fed7aa;">Firing prior to identification incurs a -600 VP penalty.</p></div>`;
    }

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return '';

      const accordionId = `wpn-${w.id}-${idx}`;
      const isSurface = Boolean(target.type && !target.spec && !target.isCivilian);
      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = (isRear || isSurface) ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && !isSurface && (offBoresight > maxOff);

      const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const isValidSolution = inRange && !isOutsideCone && pk > 0;
      const outReason = (isSurface && w.category === 'A2A') ? 'AIR ONLY' : ((!isSurface && (w.category === 'A2G' || w.isBunkerCracker)) ? 'GROUND ONLY' : (isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}&deg;)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE')));
      const pkClass = isValidSolution ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative';
      const pkLabel = isValidSolution ? `${pk}% [${pkRes.label}]` : outReason;

      let assessmentText = pkRes.desc || '';
      if (isValidSolution) {
        assessmentText = isFriendly
          ? (pk >= 70 ? 'Optimal firing solution established. Clear for release.' : 'Moderate engagement solution; susceptible to defenses or weather.')
          : `HOSTILE THREAT: Valid firing solution against ${controller.escape(controller.getName(target))}.`;
      } else if (isOutsideCone) {
        assessmentText = `Target outside forward acquisition cone (${offBoresightDeg}&deg; off nose).`;
      } else if (dist > (w.rangeKm || 50)) {
        assessmentText = 'Target exceeds maximum aerodynamic reach.';
      }

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b class="sol-title-text">${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km &bull; ${w.seeker || 'GUIDED'} &bull; ${w.damage} HP</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${pkClass} sol-pk-badge">${pkLabel}</span>
              <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
            </div>
          </summary>
          <div class="inspection-accordion-body">
            <div class="inspection-range-track">
              <span class="inspection-range-fill ${isValidSolution ? 'detecting' : ''}" style="width:${Math.min(100, (w.rangeKm / theaterW) * 100)}%;"></span>
              <i class="inspection-distance-marker" style="left:${Math.min(100, (dist / theaterW) * 100)}%;"></i>
            </div>
            <div class="inspection-range-reading" style="display:flex; justify-content:space-between;">
              <span class="sol-dist-reading">Target Distance: <b>${dist.toFixed(1)} km</b></span>
              <span>Envelope: <b>${w.minRangeKm || 1.0} - ${w.rangeKm} km</b></span>
              <span class="sol-status-text" style="color:${isValidSolution ? (pk >= 70 ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)') : 'var(--stat-tier-5)'}; font-weight:700;">
                ${isValidSolution ? 'IN ENVELOPE' : outReason}
              </span>
            </div>
            <div class="inspection-reason-box ${isValidSolution && pk >= 70 ? '' : 'warning'}" style="margin-top:4px;">
              <b>ASSESSMENT:</b> ${assessmentText}
            </div>
          </div>
        </details>
      `;
    }).join('');

    const titlePrefix = isFriendly ? 'FIRING SOLUTIONS VS' : 'HOSTILE WEAPON SOLUTIONS VS';
    return `${roeBanner}${threatSectionHtml}<section style="margin-top:6px;"><div class="inspection-subhead" style="padding:0 2px 4px 2px;"><span class="sol-head-title">${titlePrefix} ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)</span><span>EXPAND FOR DETAILS</span></div>${solutionsHtml || '<p class="inspection-muted" style="padding:8px;">No combat weapons installed on aircraft.</p>'}</section>`;
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    if (entity.weapon && entity.target) {
      const tgt = entity.target;
      const dist = Math.hypot((tgt.x || 0) - entity.x, (tgt.y || 0) - entity.y);
      const mSpeedKm = Math.max(0.4, entity.speed * 0.35);
      const etaSec = (dist / mSpeedKm).toFixed(1);
      const pkModel = tgt ? MissileKinetics.explainHitProbability(entity, tgt, clouds, 1) : { probability: 0.0 };
      const pkPct = Math.round(pkModel.probability * 100);
      const card = content.querySelector('.inspection-probability-card');
      if (card) { card.classList.toggle('high', pkPct >= 70); card.classList.toggle('medium', pkPct >= 45 && pkPct < 70); card.classList.toggle('low', pkPct < 45); }
      const pkValEl = content.querySelector('.inspection-probability-value');
      if (pkValEl) pkValEl.textContent = `${pkPct}% Pk`;
      const barEl = content.querySelector('.inspection-probability-bar i');
      if (barEl) barEl.style.width = `${pkPct}%`;
      const stageEl = content.querySelector('.msl-live-stage, .ovr-msl-stage');
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
    const firingAircraft = entity.spec ? entity : game.activeUnit;
    if (!firingAircraft) return;

    const target = isFriendly
      ? (entity.spec ? game.selectedTarget : entity)
      : ((game.activeUnit && game.activeUnit.hp > 0) ? game.activeUnit : ((game.alliedAircraft && game.alliedAircraft.find(a => a.hp > 0)) || null));

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === entity.id);
    incoming.forEach(m => {
      const acc = content.querySelector(`[data-accordion-id="threat-${m.id}"]`);
      if (!acc) return;
      const d = Math.hypot(m.x - entity.x, m.y - entity.y);
      const subEl = acc.querySelector('.threat-sub');
      if (subEl) subEl.textContent = `From: ${controller.escape(controller.getName(m.source))} &bull; ${d.toFixed(1)} km | ETA: ${(d / Math.max(0.4, m.speed * 0.35)).toFixed(1)}s`;
      const machEl = acc.querySelector('.threat-mach');
      if (machEl) machEl.textContent = `Mach ${m.speed.toFixed(2)}`;
      const stageEl = acc.querySelector('.threat-stage');
      if (stageEl) stageEl.textContent = m.stage || 'BOOST';
      const badge = acc.querySelector('.threat-badge');
      if (badge) badge.textContent = `${Math.round(MissileKinetics.explainHitProbability(m, entity, clouds, 1).probability * 100)}% Inbound Risk`;
    });

    if (!target || target.hp <= 0 || !firingAircraft) return;
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const angleToTarget = Math.atan2(target.y - firingAircraft.y, target.x - firingAircraft.x);
    let offBoresight = Math.abs((firingAircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    const headTitle = content.querySelector('.sol-head-title');
    if (headTitle) headTitle.textContent = `${isFriendly ? 'FIRING SOLUTIONS VS' : 'HOSTILE WEAPON SOLUTIONS VS'} ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)`;

    (firingAircraft.equippedWeapons || []).forEach((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return;
      const acc = content.querySelector(`[data-accordion-id="wpn-${w.id}-${idx}"]`);
      if (!acc) return;

      const isSurface = Boolean(target.type && !target.spec && !target.isCivilian);
      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = (isRear || isSurface) ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && !isSurface && (offBoresight > maxOff);

      const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));
      const isValidSolution = inRange && !isOutsideCone && pk > 0;
      const outReason = (isSurface && w.category === 'A2A') ? 'AIR ONLY' : ((!isSurface && (w.category === 'A2G' || w.isBunkerCracker)) ? 'GROUND ONLY' : (isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}&deg;)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE')));

      const badge = acc.querySelector('.sol-pk-badge');
      if (badge) {
        badge.className = `factor-delta ${isValidSolution ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative'} sol-pk-badge`;
        badge.textContent = isValidSolution ? `${pk}% [${pkRes.label}]` : outReason;
      }
      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) { fill.style.width = `${Math.min(100, (w.rangeKm / theaterW) * 100)}%`; fill.classList.toggle('detecting', isValidSolution); }
      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (dist / theaterW) * 100)}%`;
      const distReading = acc.querySelector('.sol-dist-reading b');
      if (distReading) distReading.textContent = `${dist.toFixed(1)} km`;
      const statusText = acc.querySelector('.sol-status-text');
      if (statusText) {
        statusText.textContent = isValidSolution ? 'IN ENVELOPE' : outReason;
        statusText.style.color = isValidSolution ? (pk >= 70 ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)') : 'var(--stat-tier-5)';
      }
    });
  }
}

window.InspectionWeapons = InspectionWeapons;
