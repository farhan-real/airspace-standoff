/**
 * AIRSPACE STANDOFF: Inspection Overview Submodule
 * Structural armor pips, flight envelope metrics, and inventory overviews.
 */

class InspectionOverviewRenderer {
  static renderOverviewTab(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b><span>Select a contact on the radar display or list.</span></div>';

    const status = entity.hp === undefined ? 'Active' : (entity.hp > 0 ? 'OPERATIONAL' : 'DESTROYED');
    const isFriendly = entity.team === 'friendly';
    const isEnemy = entity.team === 'hostile';
    const teamBadgeColor = isFriendly ? 'var(--theme-accent)' : (isEnemy ? 'var(--color-red)' : 'var(--color-moon-mist)');

    const actionButtons = [];
    const commanderTeam = controller.game.currentPvpCommander || 'friendly';

    if (typeof Aircraft !== 'undefined' && entity instanceof Aircraft && entity.team === commanderTeam && entity.hp > 0) {
      actionButtons.push('<button type="button" class="hud-btn small highlight" data-insp-action="fly" style="width:100%;">TAKE FLIGHT CONTROLS</button>');
    } else if (entity.hp > 0 && !entity.weapon) {
      actionButtons.push('<button type="button" class="hud-btn small alert" data-insp-action="target" style="width:100%;">LOCK AS WEAPON TARGET</button>');
    }

    if (entity.spec) return this.renderAircraftOverview(controller, entity, status, teamBadgeColor, actionButtons);
    if (entity.weapon && entity.target) return this.renderMissileOverview(controller, entity);
    if (entity.isCivilian) return this.renderCivilianOverview(controller, entity, status, teamBadgeColor, actionButtons);
    if (entity.type) return this.renderSurfaceOverview(controller, entity, status, teamBadgeColor, actionButtons);
    if (entity.isDecoyDrone) return this.renderDecoyOverview(controller, entity, status, teamBadgeColor);
    return this.renderGenericOverview(controller, entity, status, teamBadgeColor);
  }

  static renderAircraftOverview(controller, a, status, teamBadgeColor, actionButtons) {
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const maxHp = Math.max(1, a.maxHp || 4);
    const hp = Math.max(0, a.hp || 0);
    const hpRatio = hp / maxHp;
    const rHp = rate('hp', hp);

    const pipsHtml = Array.from({ length: maxHp }).map((_, i) => {
      const isFilled = i < Math.ceil(hp);
      const isCrit = hpRatio <= 0.35;
      return `<div class="insp-hp-pip ${isFilled ? (isCrit ? 'critical' : 'filled') : 'empty'}"></div>`;
    }).join('');

    const mach = (a.speed || 0.85).toFixed(2);
    const rSpd = rate('speed', a.speed || 0.85);
    const sOpt = (typeof a.getOptimalCornerSpeed === 'function') ? a.getOptimalCornerSpeed() : 0.75;
    const isCornerOpt = Math.abs(a.speed - sOpt) <= 0.12;

    const altFt = Math.round(a.altFt || 30000);
    const fl = `FL${Math.round(altFt / 100)}`;
    let headingDeg = Math.round(((a.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const stressPct = Math.round((a.stress || 0) * 100);
    const energyPct = Math.round((a.energy !== undefined ? a.energy : 1.0) * 100);
    const gunName = a.gun ? a.gun.name : 'Autocannon';
    const gunAmmo = a.gunAmmo || 0;

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">AIRCRAFT CONDITION</h3>
          <span class="factor-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${status}</span>
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
            ${isCornerOpt ? 'CORNER VELOCITY (100% TURN)' : `OPT: M ${sOpt.toFixed(2)}`}
          </small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">ALTITUDE &amp; HDG</span>
            <b class="inspection-metric-value ovr-alt-val" style="color:var(--color-ice-highlight);">${fl} &bull; ${String(headingDeg).padStart(3, '0')}&deg;</b>
          </div>
          <div class="inspection-meter"><i class="ovr-alt-meter" style="width:${Math.min(100, (altFt / 60000) * 100)}%;"></i></div>
          <small class="inspection-meter-note ovr-alt-note">${altFt.toLocaleString()} FT - ${a.vsiFpm > 200 ? 'CLIMBING' : (a.vsiFpm < -200 ? 'DIVING' : 'LEVEL')}</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">KINETIC ENERGY</span>
            <b class="inspection-metric-value ovr-energy-val" style="color:${energyPct >= 70 ? 'var(--stat-tier-2)' : (energyPct >= 40 ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)')};">${energyPct}%</b>
          </div>
          <div class="inspection-meter"><i class="ovr-energy-meter" style="width:${energyPct}%;"></i></div>
          <small class="inspection-meter-note">Maneuver recovery reserve</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">PILOT G-STRESS</span>
            <b class="inspection-metric-value ovr-stress-val" style="color:${stressPct >= 65 ? 'var(--stat-tier-5)' : (stressPct >= 35 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)')};">${stressPct}%</b>
          </div>
          <div class="inspection-meter ${stressPct >= 65 ? 'warning' : ''}"><i class="ovr-stress-meter" style="width:${stressPct}%;"></i></div>
          <small class="inspection-meter-note ovr-stress-note">${a.isCoffin ? 'COFFIN (IMMUNE TO G-LOC)' : (stressPct >= 65 ? 'TUNNEL VISION' : 'NORMAL ENVELOPE')}</small>
        </div>
      </section>

      <section class="inspection-card">
        <h3>GUN &amp; STORES INVENTORY</h3>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06); font:600 0.64rem var(--font-dotdigital);">
          <span style="color:var(--color-moon-mist);">${gunName}</span>
          <b class="ovr-gun-ammo" style="color:var(--stat-tier-2);">${gunAmmo} RDS</b>
        </div>
        <div class="ovr-wpn-list" style="display:flex; flex-direction:column; gap:3px; margin-top:4px;">
          ${(a.equippedWeapons || []).map((w, idx) => `
            <div style="display:flex; justify-content:space-between; font:600 0.64rem var(--font-dotdigital); color:var(--color-frost-glow);">
              <span>${idx + 1}. ${w.weapon ? w.weapon.name : 'Store'}</span>
              <b style="color:${w.ammo > 0 ? 'var(--theme-accent)' : 'var(--color-red)'};">${w.ammo}/${w.maxAmmo}</b>
            </div>`).join('') || '<span class="inspection-muted">No external weapons loaded.</span>'}
        </div>
      </section>

      ${actionButtons.length ? `<div style="margin-top:2px;">${actionButtons.join('')}</div>` : ''}
    `;
  }

  static renderMissileOverview(controller, m) {
    const w = m.weapon || {};
    const tgt = m.target;
    const dist = Math.hypot((tgt.x || 0) - m.x, (tgt.y || 0) - m.y);

    return `
      <section class="inspection-card">
        <h3>IN-FLIGHT WEAPON TELEMETRY</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px; font:600 0.64rem var(--font-dotdigital);">
          <div>WEAPON: <b style="color:var(--theme-accent);">${w.name || 'MISSILE'}</b></div>
          <div>SEEKER: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'}</b></div>
          <div>SPEED: <b class="ovr-msl-mach" style="color:var(--stat-tier-1);">Mach ${m.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b class="ovr-msl-dist">${dist.toFixed(1)} km</b></div>
          <div>TRAVELED: <b class="ovr-msl-traveled">${m.distanceTraveled.toFixed(1)} / ${w.rangeKm} km</b></div>
          <div>FLIGHT STAGE: <b class="ovr-msl-stage msl-live-stage" style="color:var(--stat-tier-3);">${m.stage || 'BOOST'}</b></div>
        </div>
      </section>
      <section class="inspection-card">
        <h3>ENGAGEMENT PARTICIPANTS</h3>
        <div style="display:flex; flex-direction:column; gap:4px; font:600 0.54rem var(--font-dotdigital);">
          <div style="display:flex; justify-content:space-between;"><span>FIRING PLATFORM:</span><b>${controller.escape(controller.getName(m.source))}</b></div>
          <div style="display:flex; justify-content:space-between;"><span>TARGET LOCK:</span><b style="color:var(--color-red);">${controller.escape(controller.getName(tgt))}</b></div>
        </div>
      </section>
    `;
  }

  static renderSurfaceOverview(controller, s, status, teamBadgeColor, actionButtons) {
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const hp = Math.max(0, s.hp || 0);
    const maxHp = s.maxHp || s.hp || 6;
    const isIndestructible = Boolean(s.isIndestructible);
    const rHp = rate('hp', hp);
    const rRange = s.rangeKm ? rate('radar_range', s.rangeKm) : { colorClass: 'stat-tier-3' };

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(s.name || s.type)}</h3>
          <span class="factor-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${status}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font:700 0.68rem var(--font-dotdigital);">
          <span>STRUCTURE INTEGRITY</span>
          <b class="${isIndestructible ? 'stat-tier-1' : rHp.colorClass} ovr-surf-hp">${isIndestructible ? 'INDESTRUCTIBLE' : `${hp} / ${maxHp} HP`}</b>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>TYPE: <b style="color:var(--color-ice-highlight);">${s.type}</b></div>
          <div>ENGAGEMENT: <b class="${rRange.colorClass}">${s.rangeKm ? `${s.rangeKm} km` : 'PASSIVE'}</b></div>
          <div>FACILITY: <b style="color:var(--stat-tier-3);">${s.canAttack ? 'AIR DEFENSE' : (s.isJammerStation ? 'EW STATION' : 'LOGISTICS')}</b></div>
          <div>STATUS: <b class="ovr-surf-status" style="color:${s.hp > 0 ? 'var(--stat-tier-2)' : 'var(--color-red)'};">${s.hp > 0 ? 'ACTIVE' : 'DESTROYED'}</b></div>
        </div>
        <div style="margin-top:8px; font:0.64rem var(--font-dotdigital); color:var(--color-moon-mist); line-height:1.45;">
          ${controller.escape(s.desc || 'Surface air defense battery or logistics installation.')}
        </div>
      </section>
      ${actionButtons.length ? `<div style="margin-top:6px;">${actionButtons.join('')}</div>` : ''}
    `;
  }

  static renderCivilianOverview(controller, c, status, teamBadgeColor, actionButtons) {
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const altFt = Math.round(c.altFt || 36000);
    const fl = `FL${Math.round(altFt / 100)}`;
    const mach = (c.speed || 0.78).toFixed(2);
    const rSpd = rate('speed', c.speed || 0.78);
    const rRcs = rate('rcs', c.effectiveRcs || 25);
    const rHp = rate('hp', c.hp || 6);

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(c.flightCode || 'CIVILIAN')}</h3>
          <span class="factor-chip" style="color:#7dd3fc; border-color:#38bdf8;">NEUTRAL AIRLINER</span>
        </div>
        <div class="inspection-reason-box warning" style="border-left:3px solid var(--stat-tier-5); margin-top:6px;">
          <b style="color:var(--stat-tier-5);">STRICT RULES OF ENGAGEMENT:</b> Protected non-combatant passenger flight. Missile release incurs an immediate -2,000 VP penalty.
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>AIRCRAFT: <b style="color:var(--color-ice-highlight);">${controller.escape(c.model || c.name)}</b></div>
          <div>SPEED: <b class="ovr-civ-spd ${rSpd.colorClass}">Mach ${mach}</b></div>
          <div>ALTITUDE: <b class="ovr-civ-alt" style="color:var(--stat-tier-2);">${fl} (${altFt.toLocaleString()} ft)</b></div>
          <div>RCS: <b class="${rRcs.colorClass}">${c.effectiveRcs || 25} m²</b></div>
          <div>AIRFRAME: <b class="ovr-civ-hp ${rHp.colorClass}">${c.hp} / ${c.maxHp || 6} HP</b></div>
          <div>IDENTIFICATION: <b class="ovr-civ-id" style="color:var(--stat-tier-2);">${c.isIdentified ? 'VERIFIED CIVILIAN' : 'BOGEY [?]'}</b></div>
        </div>
      </section>
      ${actionButtons.length ? `<div style="margin-top:6px;">${actionButtons.join('')}</div>` : ''}
    `;
  }

  static renderDecoyOverview(controller, d, status, teamBadgeColor) {
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">MALD DECOY DRONE</h3>
          <span class="factor-chip" style="color:#c084fc; border-color:#c084fc;">SPOOF DRONE</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.64rem var(--font-dotdigital);">
          <div>MIRRORED PROFILE: <b style="color:var(--theme-accent);">${d.mirroredModel || 'FIGHTER'}</b></div>
          <div>SPOOFED RCS: <b style="color:var(--stat-tier-3);">${(d.effectiveRcs || 1.0).toFixed(3)} m²</b></div>
          <div>AIRSPEED: <b>Mach ${(d.speed || 0.8).toFixed(2)}</b></div>
          <div>REMAINING LIFE: <b class="ovr-decoy-life" style="color:var(--stat-tier-2);">${Math.max(0, Math.round(d.lifespan - d.age))}s</b></div>
        </div>
        <p class="inspection-muted" style="margin-top:8px;">Miniature Air-Launched Decoy flying an autonomous profile to deceive hostile radar networks and draw surface missile fire.</p>
      </section>
    `;
  }

  static renderGenericOverview(controller, entity, status, teamBadgeColor) {
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(controller.getName(entity))}</h3>
          <span class="factor-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${status}</span>
        </div>
        <div style="margin-top:6px; font:0.66rem var(--font-dotdigital); color:var(--color-moon-mist);">
          ${controller.escape(entity.desc || 'Surface installation or atmospheric contact.')}
        </div>
      </section>
    `;
  }

  static updateLiveOverview(controller, entity, content) {
    if (!entity || !content) return;
    if (entity.weapon && entity.target) {
      const machEl = content.querySelector('.ovr-msl-mach');
      if (machEl) machEl.textContent = `Mach ${entity.speed.toFixed(2)}`;
      const dist = Math.hypot((entity.target.x || 0) - entity.x, (entity.target.y || 0) - entity.y);
      const distEl = content.querySelector('.ovr-msl-dist');
      if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
      const travEl = content.querySelector('.ovr-msl-traveled');
      if (travEl && entity.weapon) travEl.textContent = `${entity.distanceTraveled.toFixed(1)} / ${entity.weapon.rangeKm} km`;
      const stageEl = content.querySelector('.ovr-msl-stage, .msl-live-stage');
      if (stageEl) stageEl.textContent = entity.stage || 'BOOST';
      return;
    }

    if (entity.type) {
      const surfHp = content.querySelector('.ovr-surf-hp');
      const maxHp = entity.maxHp || entity.hp || 6;
      if (surfHp && !entity.isIndestructible) surfHp.textContent = `${Math.max(0, entity.hp).toFixed(1)} / ${maxHp} HP`;
      const surfStatus = content.querySelector('.ovr-surf-status');
      if (surfStatus) {
        surfStatus.textContent = entity.hp > 0 ? 'ACTIVE' : 'DESTROYED';
        surfStatus.style.color = entity.hp > 0 ? 'var(--stat-tier-2)' : 'var(--color-red)';
      }
      return;
    }

    if (entity.isCivilian) {
      const civSpd = content.querySelector('.ovr-civ-spd');
      if (civSpd) civSpd.textContent = `Mach ${(entity.speed || 0.78).toFixed(2)}`;
      const altFt = Math.round(entity.altFt || 36000);
      const civAlt = content.querySelector('.ovr-civ-alt');
      if (civAlt) civAlt.textContent = `FL${Math.round(altFt / 100)} (${altFt.toLocaleString()} ft)`;
      const civHp = content.querySelector('.ovr-civ-hp');
      if (civHp) civHp.textContent = `${Math.max(0, entity.hp).toFixed(1)} / ${entity.maxHp || 6} HP`;
      const civId = content.querySelector('.ovr-civ-id');
      if (civId) civId.textContent = entity.isIdentified ? 'VERIFIED CIVILIAN' : 'BOGEY [?]';
      return;
    }

    if (entity.isDecoyDrone) {
      const decoyLife = content.querySelector('.ovr-decoy-life');
      if (decoyLife) decoyLife.textContent = `${Math.max(0, Math.round(entity.lifespan - entity.age))}s`;
      return;
    }

    if (!entity.spec) return;

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const hp = Math.max(0, entity.hp || 0);
    const maxHp = Math.max(1, entity.maxHp || 4);
    const rHp = rate('hp', hp);

    const hpValEl = content.querySelector('.ovr-hp-val');
    if (hpValEl) {
      hpValEl.textContent = `${hp.toFixed(1)} / ${maxHp} HP`;
      hpValEl.className = `ovr-hp-val ${rHp.colorClass}`;
    }

    const pips = content.querySelectorAll('.ovr-pips-bar .insp-hp-pip');
    pips.forEach((pip, i) => {
      const isFilled = i < Math.ceil(hp);
      const isCrit = (hp / maxHp) <= 0.35;
      pip.className = `insp-hp-pip ${isFilled ? (isCrit ? 'critical' : 'filled') : 'empty'}`;
    });

    const sOpt = (typeof entity.getOptimalCornerSpeed === 'function') ? entity.getOptimalCornerSpeed() : 0.75;
    const isCornerOpt = Math.abs(entity.speed - sOpt) <= 0.12;
    const rSpd = rate('speed', entity.speed || 0.85);

    const spdValEl = content.querySelector('.ovr-spd-val');
    if (spdValEl) {
      spdValEl.textContent = `M ${(entity.speed || 0.85).toFixed(2)}`;
      spdValEl.className = `inspection-metric-value ovr-spd-val ${rSpd.colorClass}`;
    }

    const spdMeter = content.querySelector('.ovr-spd-meter');
    if (spdMeter) spdMeter.style.width = `${Math.min(100, ((entity.speed || 0) / 2.2) * 100)}%`;

    const altFt = Math.round(entity.altFt || 30000);
    const fl = `FL${Math.round(altFt / 100)}`;
    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const altValEl = content.querySelector('.ovr-alt-val');
    if (altValEl) altValEl.textContent = `${fl} &bull; ${String(headingDeg).padStart(3, '0')}&deg;`;

    const altMeter = content.querySelector('.ovr-alt-meter');
    if (altMeter) altMeter.style.width = `${Math.min(100, (altFt / 60000) * 100)}%`;

    const altNote = content.querySelector('.ovr-alt-note');
    if (altNote) altNote.textContent = `${altFt.toLocaleString()} FT - ${entity.vsiFpm > 200 ? 'CLIMBING' : (entity.vsiFpm < -200 ? 'DIVING' : 'LEVEL')}`;

    const energyPct = Math.round((entity.energy !== undefined ? entity.energy : 1) * 100);
    const energyValEl = content.querySelector('.ovr-energy-val');
    if (energyValEl) {
      energyValEl.textContent = `${energyPct}%`;
      energyValEl.style.color = energyPct >= 70 ? 'var(--stat-tier-2)' : (energyPct >= 40 ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)');
    }

    const energyMeter = content.querySelector('.ovr-energy-meter');
    if (energyMeter) energyMeter.style.width = `${energyPct}%`;

    const stressPct = Math.round((entity.stress || 0) * 100);
    const stressValEl = content.querySelector('.ovr-stress-val');
    if (stressValEl) {
      stressValEl.textContent = `${stressPct}%`;
      stressValEl.style.color = stressPct >= 65 ? 'var(--stat-tier-5)' : (stressPct >= 35 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)');
    }

    const stressMeter = content.querySelector('.ovr-stress-meter');
    if (stressMeter) stressMeter.style.width = `${stressPct}%`;

    const gunAmmoEl = content.querySelector('.ovr-gun-ammo');
    if (gunAmmoEl) gunAmmoEl.textContent = `${entity.gunAmmo || 0} RDS`;

    const wpnList = content.querySelector('.ovr-wpn-list');
    if (wpnList && entity.equippedWeapons) {
      const items = wpnList.querySelectorAll('div');
      entity.equippedWeapons.forEach((w, idx) => {
        if (items[idx]) {
          const valB = items[idx].querySelector('b');
          if (valB) {
            valB.textContent = `${w.ammo}/${w.maxAmmo}`;
            valB.style.color = w.ammo > 0 ? 'var(--theme-accent)' : 'var(--color-red)';
          }
        }
      });
    }
  }
}

window.InspectionOverviewRenderer = InspectionOverviewRenderer;