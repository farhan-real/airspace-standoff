/**
 * AIRSPACE STANDOFF: Inspection Overview Submodule
 * Structural armor pips, flight envelope metrics, ground-phase status, and stores inventory.
 */

class InspectionOverviewRenderer {
  static renderOverviewTab(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b><span>Select a contact on the radar display or list.</span></div>';

    const status = entity.hp === undefined ? 'Active' : (entity.hp > 0.05 || entity.isIndestructible ? 'OPERATIONAL' : 'DESTROYED');
    const isFriendly = entity.team === 'friendly';
    const isEnemy = entity.team === 'hostile';
    const teamBadgeColor = isFriendly ? 'var(--theme-accent)' : (isEnemy ? 'var(--color-red)' : 'var(--color-moon-mist)');

    const actionButtons = [];
    const commanderTeam = controller.game.currentPvpCommander || 'friendly';

    if (controller.isAircraft(entity) && entity.team === commanderTeam && entity.hp > 0.05) {
      actionButtons.push('<button type="button" class="hud-btn small highlight" data-insp-action="fly" style="width:100%;">TAKE FLIGHT CONTROLS</button>');
    } else if ((entity.hp > 0.05 || entity.isIndestructible) && !controller.isMissile(entity)) {
      actionButtons.push('<button type="button" class="hud-btn small alert" data-insp-action="target" style="width:100%;">LOCK AS WEAPON TARGET</button>');
    }

    if (controller.isSurface(entity)) {
      return InspectionSurfaceOverview.renderSurfaceOverview(controller, entity, status, teamBadgeColor, actionButtons);
    }
    if (controller.isAircraft(entity)) return this.renderAircraftOverview(controller, entity, status, teamBadgeColor, actionButtons);
    if (controller.isMissile(entity)) return this.renderMissileOverview(controller, entity);
    if (entity.isCivilian) return this.renderCivilianOverview(controller, entity);
    if (entity.isGhost) return InspectionSurfaceOverview.renderGhostOverview(controller, entity, status);
    if (entity.isDecoyDrone) return this.renderDecoyOverview(controller, entity);
    return '<div class="inspection-empty"><b>UNRECOGNIZED CONTACT</b></div>';
  }

  static renderAircraftOverview(controller, a, status, teamBadgeColor, actionButtons) {
    const rate = StatEvaluator.rate;
    const maxHp = Math.max(1, a.maxHp || 4);
    const hp = Math.max(0, a.hp || 0);
    const hpRatio = hp / maxHp;
    const rHp = rate('hp', hp);

    const pipsHtml = Array.from({ length: maxHp }).map((_, i) =>
      `<div class="insp-hp-pip ${i < Math.ceil(hp) ? (hpRatio <= 0.35 ? 'critical' : 'filled') : 'empty'}"></div>`
    ).join('');

    const mach = (a.speed || 0.85).toFixed(2);
    const rSpd = rate('speed', a.speed || 0.85);
    const sOpt = a.getOptimalCornerSpeed();
    const isCornerOpt = Math.abs(a.speed - sOpt) <= 0.12;
    const altFt = Math.round(a.altFt || 30000);
    const fl = `FL${Math.round(altFt / 100)}`;
    let headingDeg = Math.round(((a.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;

    const stressPct = Math.round((a.stress || 0) * 100);
    const energyPct = Math.round((a.energy !== undefined ? a.energy : 1.0) * 100);
    const gunName = a.gun ? a.gun.name : 'Autocannon';
    const gunAmmo = a.gunAmmo || 0;

    const commanderTeam = controller.game.currentPvpCommander || 'friendly';
    const isEnemy = a.team && a.team !== commanderTeam;
    const profileHtml = (typeof InspectionCognitionRenderer !== 'undefined')
      ? (isEnemy ? InspectionCognitionRenderer.renderCognitionCard(controller, a) : InspectionCognitionRenderer.renderFriendlyAircraftProfile(controller, a))
      : '';

    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const sDot = window.INSP_SVG ? window.INSP_SVG.dot : '';
    const opLabel = a.groundPhase ? `GROUND: ${a.groundPhase}` : (a.isRTB ? 'RTB' : (a.glocTimer > 0 ? 'G-LOC' : status));

    return `
      ${profileHtml}
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">AIRCRAFT CONDITION</h3>
          <span class="factor-chip ovr-status-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${opLabel}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font:700 0.68rem var(--font-dotdigital);">
          <span>FUSELAGE INTEGRITY</span>
          <b class="ovr-hp-val ${rHp.colorClass}">${hp.toFixed(1)} / ${maxHp} HP</b>
        </div>
        <div class="insp-armor-bar ovr-pips-bar">${pipsHtml}</div>
      </section>

      <section class="inspection-metric-grid">
        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">AIRSPEED</span>
            <b class="inspection-metric-value ovr-spd-val ${rSpd.colorClass}">M ${mach}</b>
          </div>
          <div class="inspection-meter"><i class="ovr-spd-meter" style="width:${Math.min(100, (a.speed / 2.2) * 100)}%;"></i></div>
          <small class="inspection-meter-note ovr-spd-note" style="color:${isCornerOpt ? 'var(--color-frost-glow)' : 'var(--color-fog-veil)'};">
            ${a.groundPhase ? `GROUND OPS (${a.takeoffSegmentsReq} SEG REQ)` : (isCornerOpt ? 'CORNER VELOCITY (100% TURN)' : `OPT: M ${sOpt.toFixed(2)}`)}
          </small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">ALTITUDE AND HDG</span>
            <b class="inspection-metric-value ovr-alt-val" style="color:var(--color-ice-highlight);">${fl} ${sDot} ${String(headingDeg).padStart(3, '0')}${sDeg}</b>
          </div>
          <div class="inspection-meter"><i class="ovr-alt-meter" style="width:${Math.min(100, (altFt / 60000) * 100)}%;"></i></div>
          <small class="inspection-meter-note ovr-alt-note">${altFt.toLocaleString()} FT ${sDot} ${a.groundPhase || (a.vsiFpm > 200 ? 'CLIMBING' : (a.vsiFpm < -200 ? 'DIVING' : 'LEVEL'))}</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">KINETIC ENERGY</span>
            <b class="inspection-metric-value ovr-energy-val" style="color:${energyPct >= 70 ? 'var(--stat-tier-2)' : (energyPct >= 40 ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)')};">${energyPct}%</b>
          </div>
          <div class="inspection-meter"><i class="ovr-energy-meter" style="width:${energyPct}%;"></i></div>
          <small class="inspection-meter-note">Payload Wr: ${Math.round((a.Wr || 0) * 100)}% | RCS: ${a.effectiveRcs.toFixed(4)} m2</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">PILOT G-STRESS</span>
            <b class="inspection-metric-value ovr-stress-val" style="color:${stressPct >= 65 ? 'var(--stat-tier-5)' : (stressPct >= 35 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)')};">${stressPct}%</b>
          </div>
          <div class="inspection-meter ${stressPct >= 65 ? 'warning' : ''}"><i class="ovr-stress-meter" style="width:${stressPct}%;"></i></div>
          <small class="inspection-meter-note ovr-stress-note">${a.isCoffin ? 'COFFIN (IMMUNE TO G-LOC)' : (a.spec.isDrone ? 'UCAV AUTONOMOUS' : (stressPct >= 65 ? 'TUNNEL VISION' : 'NORMAL ENVELOPE'))}</small>
        </div>
      </section>

      <section class="inspection-card">
        <h3>GUN AND STORES INVENTORY</h3>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06); font:600 0.64rem var(--font-dotdigital);">
          <span style="color:var(--color-moon-mist);">${gunName}</span>
          <b class="ovr-gun-ammo" style="color:var(--stat-tier-2);">${gunAmmo} RDS</b>
        </div>
        <div class="ovr-wpn-list" style="display:flex; flex-direction:column; gap:3px; margin-top:4px;">
          ${(a.equippedWeapons || []).map((w, idx) => {
            const st = w.station === 'INTERNAL' ? 'INT' : (w.station === 'CENTERLINE' ? 'CTR' : 'EXT');
            const isPod = Boolean(w.weapon && (w.weapon.isJammerPod || w.weapon.isTargetingPod));
            return `
              <div style="display:flex; justify-content:space-between; font:600 0.62rem var(--font-dotdigital); color:var(--color-frost-glow);">
                <span>${idx + 1}. [${st}] ${w.weapon ? w.weapon.name : 'Store'}</span>
                <b style="color:${isPod ? 'var(--stat-tier-2)' : (w.ammo > 0 ? 'var(--theme-accent)' : 'var(--color-red)')};">${isPod ? 'ACTIVE' : `${w.ammo}/${w.maxAmmo}`}</b>
              </div>`;
          }).join('') || '<span class="inspection-muted">No external weapons loaded.</span>'}
        </div>
      </section>
      ${actionButtons.length ? `<div style="margin-top:2px;">${actionButtons.join('')}</div>` : ''}
    `;
  }

  static renderMissileOverview(controller, m) {
    const w = m.weapon || {};
    const tgt = m.target;
    const dist = Math.hypot((tgt.x || 0) - m.x, (tgt.y || 0) - m.y);
    const ciwsImmune = (m.speed >= 5.0);
    const tags = [w.category || 'MSL', w.seeker || 'GUIDED'];
    if (w.isBunkerCracker) tags.push('PENETRATOR');
    if (w.isAntiRunway) tags.push('2x RUNWAY');
    if (w.isAntiRadiation) tags.push(w.antiEmcon ? 'ANTI-EMCON ARM' : 'LEGACY ARM');
    if (w.isCluster) tags.push('CLUSTER AOE');

    return `
      <section class="inspection-card">
        <h3>IN-FLIGHT WEAPON TELEMETRY</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px; font:600 0.62rem var(--font-dotdigital);">
          <div>WEAPON: <b style="color:var(--theme-accent);">${w.name || 'MISSILE'}</b></div>
          <div>TYPE: <b style="color:var(--stat-tier-2);">${tags.join(' | ')}</b></div>
          <div>SPEED: <b class="ovr-msl-mach" style="color:var(--stat-tier-1);">Mach ${m.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b class="ovr-msl-dist">${dist.toFixed(1)} km</b></div>
          <div>TRAVELED: <b class="ovr-msl-traveled">${m.distanceTraveled.toFixed(1)} / ${m.maxRangeKm.toFixed(0)} km</b></div>
          <div>STAGE: <b class="ovr-msl-stage msl-live-stage" style="color:var(--stat-tier-3);">${m.stage || 'BOOST'}</b></div>
          <div>CIWS STATUS: <b style="color:${ciwsImmune ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)'};">${ciwsImmune ? 'IMMUNE (>= M5.0)' : 'INTERCEPTABLE'}</b></div>
          <div>DAMAGE: <b>${w.damage || 0} HP</b></div>
        </div>
      </section>
      <section class="inspection-card">
        <h3>ENGAGEMENT PARTICIPANTS</h3>
        <div style="display:flex; flex-direction:column; gap:4px; font:600 0.60rem var(--font-dotdigital);">
          <div style="display:flex; justify-content:space-between;"><span>FIRING PLATFORM:</span><b>${controller.escape(controller.getName(m.source))}</b></div>
          <div style="display:flex; justify-content:space-between;"><span>TARGET LOCK:</span><b style="color:var(--color-red);">${controller.escape(controller.getName(tgt))}</b></div>
        </div>
      </section>`;
  }

  static renderCivilianOverview(controller, c) {
    const rate = StatEvaluator.rate;
    const altFt = Math.round(c.altFt || 36000);
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(c.flightCode || 'CIVILIAN')}</h3>
          <span class="factor-chip" style="color:#7dd3fc; border-color:#38bdf8;">NEUTRAL AIRLINER</span>
        </div>
        <div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-top:6px;">
          <b style="color:var(--stat-tier-5);">STRICT ROE:</b> Protected civilian airliner. Destroying incurs -2,000 VP penalty.
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.62rem var(--font-dotdigital);">
          <div>AIRCRAFT: <b style="color:var(--color-ice-highlight);">${controller.escape(c.model || c.name)}</b></div>
          <div>SPEED: <b class="ovr-civ-spd ${rate('speed', c.speed || 0.78).colorClass}">Mach ${(c.speed || 0.78).toFixed(2)}</b></div>
          <div>ALTITUDE: <b class="ovr-civ-alt" style="color:var(--stat-tier-2);">FL${Math.round(altFt / 100)} (${altFt.toLocaleString()} ft)</b></div>
          <div>RCS / HP: <b class="ovr-civ-hp">${c.effectiveRcs || 25} m2 | ${c.hp}/${c.maxHp || 6} HP</b></div>
          <div>ID STATE: <b class="ovr-civ-id">${c.isIdentified ? 'VERIFIED CIVILIAN' : 'BOGEY [?]'}</b></div>
        </div>
      </section>`;
  }

  static renderDecoyOverview(controller, d) {
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">MALD DECOY DRONE</h3>
          <span class="factor-chip" style="color:#c084fc; border-color:#c084fc;">SPOOF DRONE</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.62rem var(--font-dotdigital);">
          <div>MIRRORED PROFILE: <b style="color:var(--theme-accent);">${d.mirroredModel}</b></div>
          <div>SPOOFED RCS: <b style="color:var(--stat-tier-3);">${(d.effectiveRcs || 1.0).toFixed(3)} m2</b></div>
          <div>AIRSPEED: <b>Mach ${(d.speed || 0.8).toFixed(2)}</b></div>
          <div>REMAINING LIFE: <b class="ovr-decoy-life" style="color:var(--stat-tier-2);">${Math.max(0, Math.round(d.lifespan - d.age))}s</b></div>
        </div>
      </section>`;
  }

  static updateLiveOverview(controller, entity, content) {
    if (!entity || !content) return;
    if (controller.isSurface(entity)) { InspectionSurfaceOverview.updateLiveSurfaceOverview(controller, entity, content); return; }
    if (entity.isGhost) { InspectionSurfaceOverview.updateLiveGhostOverview(controller, entity, content); return; }

    if (controller.isMissile(entity)) {
      const machEl = content.querySelector('.ovr-msl-mach');
      if (machEl) machEl.textContent = `Mach ${entity.speed.toFixed(2)}`;
      const dist = Math.hypot((entity.target.x || 0) - entity.x, (entity.target.y || 0) - entity.y);
      const distEl = content.querySelector('.ovr-msl-dist');
      if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
      const travEl = content.querySelector('.ovr-msl-traveled');
      if (travEl) travEl.textContent = `${entity.distanceTraveled.toFixed(1)} / ${entity.maxRangeKm.toFixed(0)} km`;
      const stageEl = content.querySelector('.ovr-msl-stage, .msl-live-stage');
      if (stageEl) stageEl.textContent = entity.stage || 'BOOST';
      return;
    }

    if (entity.isCivilian) {
      const civHp = content.querySelector('.ovr-civ-hp');
      if (civHp) civHp.textContent = `${entity.effectiveRcs || 25} m2 | ${Math.max(0, entity.hp).toFixed(1)}/${entity.maxHp || 6} HP`;
      const civId = content.querySelector('.ovr-civ-id');
      if (civId) civId.textContent = entity.isIdentified ? 'VERIFIED CIVILIAN' : 'BOGEY [?]';
      return;
    }

    if (entity.isDecoyDrone) {
      const dl = content.querySelector('.ovr-decoy-life');
      if (dl) dl.textContent = `${Math.max(0, Math.round(entity.lifespan - entity.age))}s`;
      return;
    }

    if (!controller.isAircraft(entity)) return;
    if (typeof InspectionCognitionRenderer !== 'undefined') InspectionCognitionRenderer.updateLive(controller, entity, content);

    const rate = StatEvaluator.rate;
    const hp = Math.max(0, entity.hp || 0), maxHp = Math.max(1, entity.maxHp || 4);
    const hpValEl = content.querySelector('.ovr-hp-val');
    if (hpValEl) { hpValEl.textContent = `${hp.toFixed(1)} / ${maxHp} HP`; hpValEl.className = `ovr-hp-val ${rate('hp', hp).colorClass}`; }
    content.querySelectorAll('.ovr-pips-bar .insp-hp-pip').forEach((pip, i) => {
      pip.className = `insp-hp-pip ${i < Math.ceil(hp) ? (hp / maxHp <= 0.35 ? 'critical' : 'filled') : 'empty'}`;
    });

    const spdValEl = content.querySelector('.ovr-spd-val');
    if (spdValEl) { spdValEl.textContent = `M ${(entity.speed || 0.85).toFixed(2)}`; spdValEl.className = `inspection-metric-value ovr-spd-val ${rate('speed', entity.speed || 0.85).colorClass}`; }
    const spdMeter = content.querySelector('.ovr-spd-meter');
    if (spdMeter) spdMeter.style.width = `${Math.min(100, ((entity.speed || 0) / 2.2) * 100)}%`;

    const altFt = Math.round(entity.altFt || 30000);
    let hdg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (hdg < 0) hdg += 360;
    const altValEl = content.querySelector('.ovr-alt-val');
    if (altValEl) altValEl.innerHTML = `FL${Math.round(altFt / 100)} ${window.INSP_SVG.dot} ${String(hdg).padStart(3, '0')}${window.INSP_SVG.deg}`;
    const altMeter = content.querySelector('.ovr-alt-meter');
    if (altMeter) altMeter.style.width = `${Math.min(100, (altFt / 60000) * 100)}%`;
    const altNote = content.querySelector('.ovr-alt-note');
    if (altNote) altNote.innerHTML = `${altFt.toLocaleString()} FT ${window.INSP_SVG.dot} ${entity.groundPhase || (entity.vsiFpm > 200 ? 'CLIMBING' : (entity.vsiFpm < -200 ? 'DIVING' : 'LEVEL'))}`;

    const energyPct = Math.round((entity.energy !== undefined ? entity.energy : 1) * 100);
    const eVal = content.querySelector('.ovr-energy-val');
    if (eVal) eVal.textContent = `${energyPct}%`;
    const eMeter = content.querySelector('.ovr-energy-meter');
    if (eMeter) eMeter.style.width = `${energyPct}%`;

    const stressPct = Math.round((entity.stress || 0) * 100);
    const sVal = content.querySelector('.ovr-stress-val');
    if (sVal) sVal.textContent = `${stressPct}%`;
    const sMeter = content.querySelector('.ovr-stress-meter');
    if (sMeter) sMeter.style.width = `${stressPct}%`;

    const gunAmmoEl = content.querySelector('.ovr-gun-ammo');
    if (gunAmmoEl) gunAmmoEl.textContent = `${entity.gunAmmo || 0} RDS`;

    const wpnList = content.querySelector('.ovr-wpn-list');
    if (wpnList && entity.equippedWeapons) {
      const items = wpnList.querySelectorAll('div');
      entity.equippedWeapons.forEach((w, idx) => {
        if (items[idx] && w.weapon && !w.weapon.isJammerPod && !w.weapon.isTargetingPod) {
          const valB = items[idx].querySelector('b');
          if (valB) { valB.textContent = `${w.ammo}/${w.maxAmmo}`; valB.style.color = w.ammo > 0 ? 'var(--theme-accent)' : 'var(--color-red)'; }
        }
      });
    }
  }
}

window.InspectionOverviewRenderer = InspectionOverviewRenderer;
