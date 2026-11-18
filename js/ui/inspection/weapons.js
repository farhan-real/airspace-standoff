/**
 * AIRSPACE STANDOFF: Inspection Weapons Analysis Engine
 * Handles Aircraft A2A/A2G firing solutions, primary guns, Surface SAM/CIWS/AAA defenses, and live updates.
 */

class InspectionWeapons {
  static renderWeaponsDashboard(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO WEAPON TARGET</b><span>Select an aircraft, surface installation, or missile.</span></div>';
    if (controller.isMissile(entity)) return InspectionSolutionsRenderer.renderInFlightMissileSolution(controller, entity);
    if (controller.isAircraft(entity)) return this.renderAircraftWeapons(controller, entity);

    if (controller.isSurface(entity)) {
      const defHtml = InspectionSurfaceWeaponsRenderer.renderSurfaceDefenseSolutions(controller, entity);
      const active = controller.game.activeUnit;
      const commanderTeam = controller.game.currentPvpCommander || 'friendly';
      const strikeHtml = (active && active.hp > 0.05 && controller.isAircraft(active) && entity.team !== commanderTeam)
        ? InspectionSolutionsRenderer.renderGroundTargetSolutions(controller, active, entity) : '';
      return `${defHtml}${strikeHtml}`;
    }

    const activeFighter = controller.game ? controller.game.activeUnit : null;
    if (activeFighter && activeFighter.hp > 0.05 && controller.isAircraft(activeFighter)) {
      return InspectionSolutionsRenderer.renderGroundTargetSolutions(controller, activeFighter, entity);
    }
    return '<div class="inspection-empty"><b>NO WEAPONS INSTALLED</b><span>Contact has no stores management system.</span></div>';
  }

  static renderGunCard(controller, aircraft, target, dist, offBoresightDeg, clouds) {
    const gun = aircraft.gun;
    if (!gun) return '';
    const inRange = dist <= gun.rangeKm;
    const halfCone = (gun.coneAngleDeg || 45) / 2;
    const inCone = offBoresightDeg <= halfCone;
    const isEnergy = Boolean(gun.cloudScattering && gun.cloudScattering > 0);
    const cloudHits = isEnergy ? Physics.countIntersectingClouds(aircraft.x, aircraft.y, target.x, target.y, clouds) : 0;
    const isSurf = controller.isSurface(target);
    const statusCls = (inRange && inCone && aircraft.gunAmmo > 0) ? 'positive' : 'negative';
    const statusTxt = aircraft.gunAmmo <= 0 ? 'EMPTY' : (!inRange ? 'OUT OF RANGE' : (!inCone ? `OFF CONE (${offBoresightDeg}deg)` : (isSurf && target.armorClass === 'FORTIFIED' ? '20% FORTIFIED DEFLECT' : 'IN CONE (READY)')));

    return `
      <details class="inspection-accordion" data-accordion-id="wpn-gun-${gun.id}">
        <summary class="inspection-accordion-summary">
          <div class="inspection-accordion-title">
            <b>PRIMARY GUN: ${controller.escape(gun.name)} (${aircraft.gunAmmo} RDS)</b>
            <span class="gun-sol-sub">Range: ${dist.toFixed(1)} / ${gun.rangeKm} km &bull; Cone: +-${halfCone}deg &bull; ${gun.damagePerBurst.toFixed(2)} HP/burst</span>
          </div>
          <div class="inspection-accordion-meta">
            <span class="factor-delta ${statusCls} gun-sol-badge">${statusTxt}</span>
            <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
          </div>
        </summary>
        <div class="inspection-accordion-body">
          <div class="inspection-reason-box ${inRange && inCone ? '' : 'warning'}">
            <b>BALLISTIC NOTE:</b> ${gun.caliber} (${gun.roundsPerBurst} rds/burst, ${gun.burstCooldown.toFixed(1)}s reload).${cloudHits > 0 ? ` ${cloudHits} cloud(s) scattering laser energy.` : ''}
          </div>
        </div>
      </details>`;
  }

  static renderAircraftWeapons(controller, aircraft) {
    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = aircraft.team === commanderTeam;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === aircraft.id);
    const threatSectionHtml = incoming.length > 0
      ? InspectionSolutionsRenderer.renderInboundThreats(controller, aircraft, incoming, clouds)
      : (isFriendly ? '<div class="inspection-reason-box" style="border-left:3px solid var(--stat-tier-2); margin-bottom:8px;"><b style="color:var(--stat-tier-2);">DEFENSIVE ENVELOPE CLEAR:</b> No inbound guided munitions tracking this aircraft.</div>' : '');

    const target = isFriendly
      ? game.selectedTarget
      : ((game.activeUnit && game.activeUnit.hp > 0.05) ? game.activeUnit : ((game.alliedAircraft && game.alliedAircraft.find(a => a.hp > 0.05)) || null));

    if (!target || (target.hp <= 0.05 && !target.isIndestructible)) {
      return `${threatSectionHtml}<div class="inspection-empty"><b>NO ACTIVE WEAPON TARGET</b><span>Select a target on radar to calculate firing solutions.</span></div>`;
    }

    if (controller.isSurface(target)) {
      return `${threatSectionHtml}${InspectionSolutionsRenderer.renderGroundTargetSolutions(controller, aircraft, target)}`;
    }

    const dist = Math.hypot(target.x - aircraft.x, target.y - aircraft.y);
    const weapons = aircraft.equippedWeapons || [];
    const angleToTarget = Math.atan2(target.y - aircraft.y, target.x - aircraft.x);
    let offBoresight = Math.abs((aircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);

    let roeBanner = '';
    if (target.isCivilian) roeBanner = '<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-bottom:8px;"><b style="color:var(--stat-tier-5);">ROE DIRECTIVE: PROTECTED CIVILIAN AIRLINER</b><p style="margin:2px 0 0 0; color:#fecdd3;">Firing incurs an immediate -2,000 VP penalty.</p></div>';
    else if (target.isGhost) roeBanner = '<div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-4); margin-bottom:8px;"><b style="color:var(--stat-tier-4);">ROE RESTRICTION: UNVERIFIED TRACK [BOGEY ?]</b><p style="margin:2px 0 0 0; color:#fed7aa;">Firing prior to identification incurs a -600 VP penalty.</p></div>';

    const gunHtml = this.renderGunCard(controller, aircraft, target, dist, offBoresightDeg, clouds);

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return '';
      const accordionId = `wpn-${w.id}-${idx}`;
      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = isRear ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && (offBoresight > maxOff);

      const pkRes = Physics.calcPk(w, aircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const inRange = (dist <= w.rangeKm && dist >= (w.minRangeKm || 0.8));
      const isValidSolution = inRange && !isOutsideCone && pk > 0;
      const outReason = (w.category === 'A2G' || w.isBunkerCracker) ? 'GROUND ONLY' : (isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}deg)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE'));
      const pkClass = isValidSolution ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative';

      return `
        <details class="inspection-accordion" data-accordion-id="${accordionId}">
          <summary class="inspection-accordion-summary">
            <div class="inspection-accordion-title">
              <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
              <span class="sol-sub">Range: ${dist.toFixed(1)} / ${w.rangeKm} km &bull; ${w.seeker || 'GUIDED'} &bull; ${w.damage} HP</span>
            </div>
            <div class="inspection-accordion-meta">
              <span class="factor-delta ${pkClass} sol-pk-badge">${isValidSolution ? `${pk}% [${pkRes.label}]` : outReason}</span>
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
              <span class="sol-status-text" style="color:${isValidSolution ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'}; font-weight:700;">${isValidSolution ? 'IN ENVELOPE' : outReason}</span>
            </div>
            <div class="inspection-reason-box ${isValidSolution && pk >= 70 ? '' : 'warning'}" style="margin-top:4px;">
              <b>ASSESSMENT:</b> ${pkRes.desc}${target.dircmEvasion > 0 && (w.seeker === 'IIR' || w.seeker === 'EO') ? ` | Target DIRCM IR Jammer (-${Math.round(target.dircmEvasion * 100)}%)` : ''}
            </div>
          </div>
        </details>`;
    }).join('');

    const titlePrefix = isFriendly ? 'FIRING SOLUTIONS VS' : 'HOSTILE WEAPON SOLUTIONS VS';
    return `${roeBanner}${threatSectionHtml}<section style="margin-top:6px;"><div class="inspection-subhead" style="padding:0 2px 4px 2px;"><span class="sol-head-title">${titlePrefix} ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)</span><span>EXPAND FOR DETAILS</span></div>${gunHtml}${solutionsHtml}</section>`;
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const theaterW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;

    if (controller.isMissile(entity)) {
      const tgt = entity.target;
      const dist = Math.hypot((tgt.x || 0) - entity.x, (tgt.y || 0) - entity.y);
      const etaSec = (dist / Math.max(0.4, entity.speed * 0.35)).toFixed(1);
      const pkPct = Math.round((tgt ? MissileKinetics.explainHitProbability(entity, tgt, clouds, 1).probability : 0) * 100);
      const card = content.querySelector('.inspection-probability-card');
      if (card) { card.classList.toggle('high', pkPct >= 70); card.classList.toggle('medium', pkPct >= 45 && pkPct < 70); card.classList.toggle('low', pkPct < 45); }
      const pkVal = content.querySelector('.inspection-probability-value');
      if (pkVal) pkVal.textContent = `${pkPct}% Pk`;
      const bar = content.querySelector('.inspection-probability-bar i');
      if (bar) bar.style.width = `${pkPct}%`;
      const stEl = content.querySelector('.msl-live-stage, .ovr-msl-stage');
      if (stEl) stEl.textContent = entity.stage || 'BOOST';
      const machEl = content.querySelector('.msl-live-mach');
      if (machEl) machEl.textContent = `Mach ${entity.speed.toFixed(2)}`;
      const distEl = content.querySelector('.msl-live-dist');
      if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
      const etaEl = content.querySelector('.msl-live-eta');
      if (etaEl) etaEl.textContent = `${etaSec}s`;
      return;
    }

    if (controller.isSurface(entity)) {
      InspectionSurfaceWeaponsRenderer.updateLiveSurfaceWeapons(controller, entity, content);
    }

    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = entity.team === commanderTeam;
    const firingAircraft = controller.isAircraft(entity) ? entity : game.activeUnit;
    if (!firingAircraft) return;

    const target = controller.isAircraft(entity)
      ? (isFriendly ? game.selectedTarget : ((game.activeUnit && game.activeUnit.hp > 0.05) ? game.activeUnit : null))
      : entity;

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === entity.id);
    incoming.forEach(m => {
      const acc = content.querySelector(`[data-accordion-id="threat-${m.id}"]`);
      if (!acc) return;
      const d = Math.hypot(m.x - entity.x, m.y - entity.y);
      const subEl = acc.querySelector('.threat-sub');
      if (subEl) subEl.textContent = `From: ${controller.escape(controller.getName(m.source))} | ${d.toFixed(1)} km | ETA: ${(d / Math.max(0.4, m.speed * 0.35)).toFixed(1)}s`;
      const machEl = acc.querySelector('.threat-mach');
      if (machEl) machEl.textContent = `Mach ${m.speed.toFixed(2)}`;
      const stageEl = acc.querySelector('.threat-stage');
      if (stageEl) stageEl.textContent = m.stage || 'BOOST';
      const badge = acc.querySelector('.threat-badge');
      if (badge) badge.textContent = `${Math.round(MissileKinetics.explainHitProbability(m, entity, clouds, 1).probability * 100)}% Inbound Risk`;
    });

    if (!target || (target.hp <= 0.05 && !target.isIndestructible)) return;
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const angleToTarget = Math.atan2(target.y - firingAircraft.y, target.x - firingAircraft.x);
    let offBoresight = Math.abs((firingAircraft.heading || 0) - angleToTarget);
    while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
    const offBoresightDeg = Math.round(offBoresight * 180 / Math.PI);
    const isSurf = controller.isSurface(target);

    const headTitle = content.querySelector('.sol-head-title');
    if (headTitle) headTitle.textContent = `${isSurf ? 'STRIKE SOLUTIONS VS' : (isFriendly ? 'FIRING SOLUTIONS VS' : 'HOSTILE WEAPON SOLUTIONS VS')} ${controller.escape(controller.getName(target))} (${dist.toFixed(1)} km)`;

    (firingAircraft.equippedWeapons || []).forEach((item, idx) => {
      const w = item.weapon;
      if (!w || w.isJammerPod || w.isTargetingPod || w.isDecoy || w.isDecoyDrone) return;
      const acc = content.querySelector(`[data-accordion-id="wpn-${w.id}-${idx}"]`);
      if (!acc) return;

      const effRange = w.rangeKm * (w.isAntiRadiation ? firingAircraft.armRangeMult : ((w.seeker === 'UNGUIDED' || w.isRocketPod) ? firingAircraft.bombRangeBonus : 1.0));
      const isRear = (w.trait === 'REAR_ENGAGE' || w.trait === 'ALL_ASPECT_BURST');
      const isHobs = (w.trait === 'HOBS_VANE' || w.id === 'IRIS-T');
      const maxOff = (isRear || isSurf) ? Math.PI : (isHobs ? Math.PI * 0.65 : Math.PI * 0.45);
      const isOutsideCone = !isRear && !isSurf && (offBoresight > maxOff);

      const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
      const pk = pkRes.pk || 0;
      const inRange = (dist <= effRange && dist >= (w.minRangeKm || 0.8));
      const isValid = inRange && !isOutsideCone && pk > 0;
      const outReason = (isSurf && w.category === 'A2A') ? 'AIR ONLY' : ((!isSurf && (w.category === 'A2G' || w.isBunkerCracker)) ? 'GROUND ONLY' : (isOutsideCone ? `OFF-BORESIGHT (${offBoresightDeg}deg)` : (dist < (w.minRangeKm || 1.0) ? 'TOO CLOSE' : 'OUT OF RANGE')));

      const badge = acc.querySelector('.sol-pk-badge');
      if (badge) {
        badge.className = `factor-delta ${isValid ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative'} sol-pk-badge`;
        badge.textContent = isValid ? `${pk}% [${pkRes.label}]` : outReason;
      }
      const fill = acc.querySelector('.inspection-range-fill');
      if (fill) { fill.style.width = `${Math.min(100, (effRange / theaterW) * 100)}%`; fill.classList.toggle('detecting', isValid); }
      const marker = acc.querySelector('.inspection-distance-marker');
      if (marker) marker.style.left = `${Math.min(100, (dist / theaterW) * 100)}%`;
      const distReading = acc.querySelector('.sol-dist-reading b');
      if (distReading) distReading.textContent = `${dist.toFixed(1)} km`;
      const statusText = acc.querySelector('.sol-status-text');
      if (statusText) {
        statusText.textContent = isValid ? 'IN ENVELOPE' : outReason;
        statusText.style.color = isValid ? (pk >= 70 ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)') : 'var(--stat-tier-5)';
      }
    });
  }
}

window.InspectionWeapons = InspectionWeapons;
