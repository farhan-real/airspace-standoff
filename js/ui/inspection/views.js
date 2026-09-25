/* AIRSPACE STANDOFF: Inspection UI Component Views & Gauge Builders (Liquid Glass Theme) */

class InspectionViews {
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

    if (entity.spec) {
      return this.renderAircraftOverview(controller, entity, status, teamBadgeColor, actionButtons);
    }
    if (entity.weapon && entity.target) {
      return this.renderMissileOverview(controller, entity);
    }
    return this.renderGenericOverview(controller, entity, status, teamBadgeColor);
  }

  static renderAircraftOverview(controller, a, status, teamBadgeColor, actionButtons) {
    const maxHp = Math.max(1, a.maxHp || 4);
    const hp = Math.max(0, a.hp || 0);
    const hpRatio = hp / maxHp;

    const pipsHtml = Array.from({ length: maxHp }).map((_, i) => {
      const isFilled = i < Math.ceil(hp);
      const isCrit = hpRatio <= 0.35;
      const cls = isFilled ? (isCrit ? 'critical' : 'filled') : 'empty';
      return `<div class="insp-hp-pip ${cls}"></div>`;
    }).join('');

    const mach = (a.speed || 0.85).toFixed(2);
    const sOpt = (typeof a.getOptimalCornerSpeed === 'function') ? a.getOptimalCornerSpeed() : 0.75;
    const isCornerOpt = Math.abs(a.speed - sOpt) <= 0.12;

    const altFt = Math.round(a.altFt || 30000);
    const fl = `FL${Math.round(altFt / 100)}`;
    const headingDeg = Math.round(((a.heading || 0) * 180 / Math.PI) % 360);

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
        <div style="display:flex; justify-content:space-between; margin-top:6px; font:700 0.58rem var(--font-dotdigital);">
          <span>FUSELAGE INTEGRITY</span>
          <b style="color:${hpRatio <= 0.35 ? 'var(--stat-tier-5)' : 'var(--stat-tier-2)'};">${hp.toFixed(1)} / ${maxHp} HP</b>
        </div>
        <div class="insp-armor-bar">${pipsHtml}</div>
      </section>

      <section class="inspection-metric-grid">
        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">AIRSPEED</span>
            <b class="inspection-metric-value" style="color:${isCornerOpt ? 'var(--stat-tier-2)' : 'var(--theme-accent)'};">M ${mach}</b>
          </div>
          <div class="inspection-meter"><i style="width:${Math.min(100, (a.speed / 2.2) * 100)}%;"></i></div>
          <small class="inspection-meter-note" style="color:${isCornerOpt ? 'var(--color-frost-glow)' : 'var(--color-fog-veil)'};">
            ${isCornerOpt ? 'OPTIMAL CORNER SPEED (100% TURN)' : `OPT: M ${sOpt.toFixed(2)}`}
          </small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">ALTITUDE &amp; HDG</span>
            <b class="inspection-metric-value">${fl} - ${headingDeg}&deg;</b>
          </div>
          <div class="inspection-meter"><i style="width:${Math.min(100, (altFt / 60000) * 100)}%;"></i></div>
          <small class="inspection-meter-note">${altFt.toLocaleString()} FT - ${a.vsiFpm > 200 ? 'CLIMBING' : (a.vsiFpm < -200 ? 'DIVING' : 'LEVEL')}</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">KINETIC ENERGY</span>
            <b class="inspection-metric-value" style="color:var(--stat-tier-2);">${energyPct}%</b>
          </div>
          <div class="inspection-meter"><i style="width:${energyPct}%;"></i></div>
          <small class="inspection-meter-note">Maneuver recovery reserve</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">PILOT G-STRESS</span>
            <b class="inspection-metric-value" style="color:${stressPct >= 65 ? 'var(--stat-tier-5)' : 'var(--stat-tier-3)'};">${stressPct}%</b>
          </div>
          <div class="inspection-meter ${stressPct >= 65 ? 'warning' : ''}"><i style="width:${stressPct}%;"></i></div>
          <small class="inspection-meter-note">${a.isCoffin ? 'COFFIN (IMMUNE TO G-LOC)' : (stressPct >= 65 ? 'TUNNEL VISION' : 'NORMAL ENVELOPE')}</small>
        </div>
      </section>

      <section class="inspection-card">
        <h3>GUN &amp; STORES INVENTORY</h3>
        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06); font:600 0.54rem var(--font-dotdigital);">
          <span style="color:var(--color-moon-mist);">${gunName}</span>
          <b style="color:var(--stat-tier-2);">${gunAmmo} RDS</b>
        </div>
        <div style="display:flex; flex-direction:column; gap:3px; margin-top:4px;">
          ${(a.equippedWeapons || []).map((w, idx) => `
            <div style="display:flex; justify-content:space-between; font:600 0.52rem var(--font-dotdigital); color:var(--color-frost-glow);">
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
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px; font:600 0.56rem var(--font-dotdigital);">
          <div>WEAPON: <b style="color:var(--theme-accent);">${w.name || 'MISSILE'}</b></div>
          <div>SEEKER: <b style="color:var(--stat-tier-2);">${w.seeker || 'GUIDED'}</b></div>
          <div>SPEED: <b style="color:var(--color-cyan);">Mach ${m.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b>${dist.toFixed(1)} km</b></div>
          <div>TRAVELED: <b>${m.distanceTraveled.toFixed(1)} / ${w.rangeKm} km</b></div>
          <div>FLIGHT STAGE: <b style="color:var(--stat-tier-3);">${m.stage || 'BOOST'}</b></div>
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

  static renderGenericOverview(controller, entity, status, teamBadgeColor) {
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(controller.getName(entity))}</h3>
          <span class="factor-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${status}</span>
        </div>
        <div style="margin-top:6px; font:0.56rem var(--font-dotdigital); color:var(--color-moon-mist);">
          ${controller.escape(entity.desc || 'Surface installation or atmospheric contact.')}
        </div>
      </section>
    `;
  }

  static renderEventTraceTab(controller, event) {
    if (!event) return '<div class="inspection-empty"><b>NO EVENT SELECTED</b><span>Select a tactical event from the log below to inspect cause and effect telemetry.</span></div>';

    const d = event.details || {};
    return `
      <section class="inspection-card">
        <h3>[${event.time}] ${event.type}</h3>
        <p style="color:var(--color-frost-glow); font:600 0.62rem var(--font-dotdigital); margin-top:4px;">${controller.escape(event.title)}</p>
        <div style="display:flex; flex-direction:column; gap:3px; margin-top:8px; font:600 0.52rem var(--font-dotdigital);">
          ${Object.entries(d).map(([k, v]) => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding:2px 0;">
              <span style="color:var(--color-moon-mist);">${k}:</span>
              <b style="color:var(--color-frost-glow);">${typeof v === 'object' ? JSON.stringify(v) : v}</b>
            </div>`).join('')}
        </div>
      </section>
    `;
  }

  static renderRawDataTab(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b></div>';
    const rows = [];
    Object.entries(entity).forEach(([k, v]) => {
      if (typeof v === 'function' || ['game', 'trail', 'parentUnit'].includes(k)) return;
      const displayVal = (v !== null && typeof v === 'object') ? JSON.stringify(v) : String(v);
      rows.push(`<div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding:3px 0;">
        <span style="color:var(--color-moon-mist);">${k}</span>
        <b style="color:var(--color-frost-glow); word-break:break-all; max-width:65%; text-align:right;">${displayVal}</b>
      </div>`);
    });

    return `
      <section class="inspection-card">
        <h3>COMPLETE SUBSYSTEM REGISTRY</h3>
        <div style="display:flex; flex-direction:column; gap:2px; margin-top:6px; font:0.50rem var(--font-dotdigital);">
          ${rows.join('')}
        </div>
      </section>
    `;
  }
}

window.InspectionViews = InspectionViews;