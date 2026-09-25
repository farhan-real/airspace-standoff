/**
 * AIRSPACE STANDOFF: Inspection UI Component Views & Data Dossier
 * Structured tactical registries with clean, non-collapsible glass sections and real-time live telemetry updating.
 */

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
          <b class="ovr-hp-val" style="color:${hpRatio <= 0.35 ? 'var(--stat-tier-5)' : 'var(--stat-tier-2)'};">${hp.toFixed(1)} / ${maxHp} HP</b>
        </div>
        <div class="insp-armor-bar ovr-pips-bar">${pipsHtml}</div>
      </section>

      <section class="inspection-metric-grid">
        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">AIRSPEED</span>
            <b class="inspection-metric-value ovr-spd-val" style="color:${isCornerOpt ? 'var(--stat-tier-2)' : 'var(--theme-accent)'};">M ${mach}</b>
          </div>
          <div class="inspection-meter"><i class="ovr-spd-meter" style="width:${Math.min(100, (a.speed / 2.2) * 100)}%;"></i></div>
          <small class="inspection-meter-note ovr-spd-note" style="color:${isCornerOpt ? 'var(--color-frost-glow)' : 'var(--color-fog-veil)'};">
            ${isCornerOpt ? 'CORNER VELOCITY (100% TURN)' : `OPT: M ${sOpt.toFixed(2)}`}
          </small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">ALTITUDE &amp; HDG</span>
            <b class="inspection-metric-value ovr-alt-val">${fl} \u2022 ${String(headingDeg).padStart(3, '0')}&deg;</b>
          </div>
          <div class="inspection-meter"><i class="ovr-alt-meter" style="width:${Math.min(100, (altFt / 60000) * 100)}%;"></i></div>
          <small class="inspection-meter-note ovr-alt-note">${altFt.toLocaleString()} FT - ${a.vsiFpm > 200 ? 'CLIMBING' : (a.vsiFpm < -200 ? 'DIVING' : 'LEVEL')}</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">KINETIC ENERGY</span>
            <b class="inspection-metric-value ovr-energy-val" style="color:var(--stat-tier-2);">${energyPct}%</b>
          </div>
          <div class="inspection-meter"><i class="ovr-energy-meter" style="width:${energyPct}%;"></i></div>
          <small class="inspection-meter-note">Maneuver recovery reserve</small>
        </div>

        <div class="inspection-metric">
          <div class="inspection-metric-top">
            <span class="inspection-metric-label">PILOT G-STRESS</span>
            <b class="inspection-metric-value ovr-stress-val" style="color:${stressPct >= 65 ? 'var(--stat-tier-5)' : 'var(--stat-tier-3)'};">${stressPct}%</b>
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
          <div>SPEED: <b class="ovr-msl-mach" style="color:var(--color-cyan);">Mach ${m.speed.toFixed(2)}</b></div>
          <div>DISTANCE: <b class="ovr-msl-dist">${dist.toFixed(1)} km</b></div>
          <div>TRAVELED: <b class="ovr-msl-traveled">${m.distanceTraveled.toFixed(1)} / ${w.rangeKm} km</b></div>
          <div>FLIGHT STAGE: <b class="ovr-msl-stage" style="color:var(--stat-tier-3);">${m.stage || 'BOOST'}</b></div>
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
        <div style="margin-top:6px; font:0.66rem var(--font-dotdigital); color:var(--color-moon-mist);">
          ${controller.escape(entity.desc || 'Surface installation or atmospheric contact.')}
        </div>
      </section>
    `;
  }

  static renderEventTraceTab(controller, event) {
    if (!event) return '<div class="inspection-empty"><b>NO EVENT SELECTED</b><span>Select a tactical event from the log below to inspect cause and effect telemetry.</span></div>';

    const d = event.details || {};
    const formatValue = (v) => {
      if (v === null || v === undefined) return 'None';
      if (typeof v === 'boolean') return v ? 'ACTIVE' : 'INACTIVE';
      if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
      if (Array.isArray(v)) {
        if (v.length === 0) return 'None';
        if (typeof v[0] === 'object') return `${v.length} recorded items`;
        return v.join(', ');
      }
      if (typeof v === 'object') {
        return Object.entries(v).map(([subK, subV]) => `${subK}: ${typeof subV === 'number' ? subV.toFixed(2) : subV}`).join(' | ');
      }
      return String(v);
    };

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">${controller.escape(event.type)}</h3>
          <span class="factor-chip neutral">[${event.time}]</span>
        </div>
        <p style="color:var(--color-ice-highlight); font:600 0.72rem var(--font-dotdigital); margin-top:5px; line-height:1.4;">
          ${controller.escape(event.title)}
        </p>

        <div style="display:flex; justify-content:space-between; font:600 0.64rem var(--font-dotdigital); margin-top:8px; padding-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.06);">
          <span>SOURCE: <b style="color:var(--theme-accent);">${controller.escape(event.sourceName || 'Unknown')}</b></span>
          <span>TARGET: <b style="color:var(--color-red);">${controller.escape(event.targetName || 'None')}</b></span>
        </div>

        <div style="display:flex; flex-direction:column; gap:4px; margin-top:8px;">
          ${Object.entries(d).map(([k, v]) => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding:3px 0; font:0.64rem var(--font-dotdigital);">
              <span style="color:var(--color-moon-mist); text-transform:uppercase;">${k.replace(/([A-Z])/g, ' $1')}:</span>
              <b style="color:var(--color-pure-white); text-align:right; max-width:65%; word-break:break-all;">${formatValue(v)}</b>
            </div>`).join('')}
        </div>
      </section>
    `;
  }

  static renderRawDataTab(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b></div>';

    const fmtNum = (n, dec = 2) => (typeof n === 'number' && Number.isFinite(n)) ? n.toFixed(dec) : 'N/A';
    const isAircraft = Boolean(entity.spec);
    const spec = entity.spec || {};

    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const sections = [];

    // 1. Identity & Faction
    sections.push(`
      <div class="inspection-data-section">
        <span class="inspection-data-title">TACTICAL IDENTITY &amp; FACTION</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Callsign / Name</span><b class="inspection-data-value">${controller.escape(entity.callsign || entity.name || entity.flightCode || entity.id)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Airframe Model</span><b class="inspection-data-value">${spec.name || entity.model || 'Standard'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Category / Role</span><b class="inspection-data-value">${spec.category || entity.type || 'Combatant'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Faction Assignment</span><b class="inspection-data-value">${entity.team ? entity.team.toUpperCase() : 'NEUTRAL'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Squadron Unit</span><b class="inspection-data-value">${controller.escape(entity.squadronName || 'None')}</b></div>
      </div>
    `);

    // 2. Spatial Position & Kinematics
    sections.push(`
      <div class="inspection-data-section">
        <span class="inspection-data-title">POSITION &amp; SPATIAL KINEMATICS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Coordinates (X, Y)</span><b class="inspection-data-value raw-coords-val">${fmtNum(entity.x, 1)} km, ${fmtNum(entity.y, 1)} km</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Flight Level</span><b class="inspection-data-value raw-fl-val">FL${Math.round((entity.altFt || 0) / 100)} (${Math.round(entity.altFt || 0).toLocaleString()} ft)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Airspeed</span><b class="inspection-data-value raw-spd-val">Mach ${fmtNum(entity.speed)} (${Math.round((entity.speed || 0) * 1225)} km/h)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Heading</span><b class="inspection-data-value raw-hdg-val">${String(headingDeg).padStart(3, '0')}&deg; (${fmtNum(entity.heading, 3)} rad)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Vertical Speed</span><b class="inspection-data-value raw-vsi-val">${Math.round(entity.vsiFpm || 0)} fpm</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Total Distance Traveled</span><b class="inspection-data-value raw-dist-val">${fmtNum(entity.distanceTraveled, 1)} km</b></div>
      </div>
    `);

    // 3. Aerodynamics & Flight Envelope
    if (isAircraft) {
      const sOpt = (typeof entity.getOptimalCornerSpeed === 'function') ? entity.getOptimalCornerSpeed() : 0.75;
      sections.push(`
        <div class="inspection-data-section">
          <span class="inspection-data-title">AERODYNAMICS &amp; ENVELOPE</span>
          <div class="inspection-data-row"><span class="inspection-data-label">Base Agility / Effective</span><b class="inspection-data-value">${fmtNum(spec.AGI_0)} &rarr; ${fmtNum(entity.getEffectiveAgility ? entity.getEffectiveAgility() : spec.AGI_0)}</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Corner Velocity (sOpt)</span><b class="inspection-data-value">Mach ${fmtNum(sOpt)} (${Math.round(sOpt * 1225)} km/h)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">G-Load Tolerance</span><b class="inspection-data-value">${fmtNum(spec.G_limit, 1)} G</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Kinetic Energy Reserve</span><b class="inspection-data-value raw-energy-val">${Math.round((entity.energy !== undefined ? entity.energy : 1) * 100)}%</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Payload Weight Ratio (Wr)</span><b class="inspection-data-value">${Math.round((entity.Wr || 0) * 100)}% (${Math.round(entity.maxPayloadMass || 5000)} kg max)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Pilot G-Stress</span><b class="inspection-data-value raw-stress-val">${entity.isCoffin ? 'COFFIN IMMUNE' : `${fmtNum(entity.stress, 2)} / ${fmtNum(entity.glocThreshold, 2)}`}</b></div>
        </div>
      `);
    }

    // 4. Sensors & Signature
    sections.push(`
      <div class="inspection-data-section">
        <span class="inspection-data-title">SENSORS &amp; STEALTH</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Radar Array Model</span><b class="inspection-data-value">${spec.radarType || 'N/A'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Instrumented Range (R_0)</span><b class="inspection-data-value">${fmtNum(spec.R_0, 1)} km</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Radar Cross Section (RCS)</span><b class="inspection-data-value">${fmtNum(entity.effectiveRcs || spec.sigma_0, 5)} m&sup2;</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Beam Exposure Spike</span><b class="inspection-data-value">${fmtNum(spec.beamSpike, 1)}x</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Optical IRST / DAS Sensors</span><b class="inspection-data-value">${entity.hasIRST ? 'IRST Active' : 'Off'} | ${entity.hasDAS ? 'DAS 360' : 'Off'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Electronic Countermeasures</span><b class="inspection-data-value">${entity.jamEfficiency ? `${Math.round(entity.jamEfficiency * 100)}% ECM` : 'None'}</b></div>
      </div>
    `);

    // 5. Armament & Durability
    sections.push(`
      <div class="inspection-data-section">
        <span class="inspection-data-title">ARMAMENT &amp; DURABILITY</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Hull Durability (HP)</span><b class="inspection-data-value raw-hp-val">${fmtNum(entity.hp, 1)} / ${entity.maxHp || 4} HP</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Autocannon System</span><b class="inspection-data-value">${entity.gun ? entity.gun.name : 'None'} (${entity.gunAmmo || 0} rds)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Countermeasure Dispenser</span><b class="inspection-data-value raw-chaff-val">${entity.chaff || 0} chaff salvos</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Equipped Stores</span><b class="inspection-data-value">${(entity.equippedWeapons || []).map(w => w.weapon ? w.weapon.name : 'Store').join(', ') || 'None'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Subsystem Upgrades</span><b class="inspection-data-value">${(entity.equippedUpgrades || []).join(', ') || 'None'}</b></div>
      </div>
    `);

    return sections.join('');
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    if (entity.weapon && entity.target) {
      const machEl = content.querySelector('.ovr-msl-mach');
      if (machEl) machEl.textContent = `Mach ${entity.speed.toFixed(2)}`;
      const dist = Math.hypot((entity.target.x || 0) - entity.x, (entity.target.y || 0) - entity.y);
      const distEl = content.querySelector('.ovr-msl-dist');
      if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
      const travEl = content.querySelector('.ovr-msl-traveled');
      if (travEl && entity.weapon) travEl.textContent = `${entity.distanceTraveled.toFixed(1)} / ${entity.weapon.rangeKm} km`;
      const stageEl = content.querySelector('.ovr-msl-stage');
      if (stageEl) stageEl.textContent = entity.stage || 'BOOST';
      return;
    }
    if (!entity.spec) return;

    const hp = Math.max(0, entity.hp || 0);
    const maxHp = Math.max(1, entity.maxHp || 4);
    const hpValEl = content.querySelector('.ovr-hp-val');
    if (hpValEl) hpValEl.textContent = `${hp.toFixed(1)} / ${maxHp} HP`;

    const pips = content.querySelectorAll('.ovr-pips-bar .insp-hp-pip');
    pips.forEach((pip, i) => {
      const isFilled = i < Math.ceil(hp);
      const isCrit = (hp / maxHp) <= 0.35;
      pip.className = `insp-hp-pip ${isFilled ? (isCrit ? 'critical' : 'filled') : 'empty'}`;
    });

    const sOpt = (typeof entity.getOptimalCornerSpeed === 'function') ? entity.getOptimalCornerSpeed() : 0.75;
    const isCornerOpt = Math.abs(entity.speed - sOpt) <= 0.12;

    const spdValEl = content.querySelector('.ovr-spd-val');
    if (spdValEl) {
      spdValEl.textContent = `M ${(entity.speed || 0.85).toFixed(2)}`;
      spdValEl.style.color = isCornerOpt ? 'var(--stat-tier-2)' : 'var(--theme-accent)';
    }

    const spdMeter = content.querySelector('.ovr-spd-meter');
    if (spdMeter) spdMeter.style.width = `${Math.min(100, ((entity.speed || 0) / 2.2) * 100)}%`;

    const altFt = Math.round(entity.altFt || 30000);
    const fl = `FL${Math.round(altFt / 100)}`;
    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const altValEl = content.querySelector('.ovr-alt-val');
    if (altValEl) altValEl.textContent = `${fl} \u2022 ${String(headingDeg).padStart(3, '0')}\u00B0`;

    const altMeter = content.querySelector('.ovr-alt-meter');
    if (altMeter) altMeter.style.width = `${Math.min(100, (altFt / 60000) * 100)}%`;

    const altNote = content.querySelector('.ovr-alt-note');
    if (altNote) altNote.textContent = `${altFt.toLocaleString()} FT - ${entity.vsiFpm > 200 ? 'CLIMBING' : (entity.vsiFpm < -200 ? 'DIVING' : 'LEVEL')}`;

    const energyPct = Math.round((entity.energy !== undefined ? entity.energy : 1) * 100);
    const energyValEl = content.querySelector('.ovr-energy-val');
    if (energyValEl) energyValEl.textContent = `${energyPct}%`;

    const energyMeter = content.querySelector('.ovr-energy-meter');
    if (energyMeter) energyMeter.style.width = `${energyPct}%`;

    const stressPct = Math.round((entity.stress || 0) * 100);
    const stressValEl = content.querySelector('.ovr-stress-val');
    if (stressValEl) {
      stressValEl.textContent = `${stressPct}%`;
      stressValEl.style.color = stressPct >= 65 ? 'var(--stat-tier-5)' : 'var(--stat-tier-3)';
    }

    const stressMeter = content.querySelector('.ovr-stress-meter');
    if (stressMeter) stressMeter.style.width = `${stressPct}%`;

    const gunAmmoEl = content.querySelector('.ovr-gun-ammo');
    if (gunAmmoEl) gunAmmoEl.textContent = `${entity.gunAmmo || 0} RDS`;
  }

  static updateRawLive(controller, entity, content) {
    if (!entity || !content) return;
    const fmtNum = (n, dec = 2) => (typeof n === 'number' && Number.isFinite(n)) ? n.toFixed(dec) : 'N/A';

    const coordsVal = content.querySelector('.raw-coords-val');
    if (coordsVal) coordsVal.textContent = `${fmtNum(entity.x, 1)} km, ${fmtNum(entity.y, 1)} km`;

    const flVal = content.querySelector('.raw-fl-val');
    if (flVal) flVal.textContent = `FL${Math.round((entity.altFt || 0) / 100)} (${Math.round(entity.altFt || 0).toLocaleString()} ft)`;

    const spdVal = content.querySelector('.raw-spd-val');
    if (spdVal) spdVal.textContent = `Mach ${fmtNum(entity.speed)} (${Math.round((entity.speed || 0) * 1225)} km/h)`;

    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const hdgVal = content.querySelector('.raw-hdg-val');
    if (hdgVal) hdgVal.textContent = `${String(headingDeg).padStart(3, '0')}\u00B0 (${fmtNum(entity.heading, 3)} rad)`;

    const vsiVal = content.querySelector('.raw-vsi-val');
    if (vsiVal) vsiVal.textContent = `${Math.round(entity.vsiFpm || 0)} fpm`;

    const distVal = content.querySelector('.raw-dist-val');
    if (distVal) distVal.textContent = `${fmtNum(entity.distanceTraveled, 1)} km`;

    const hpVal = content.querySelector('.raw-hp-val');
    if (hpVal) hpVal.textContent = `${fmtNum(entity.hp, 1)} / ${entity.maxHp || 4} HP`;

    const energyVal = content.querySelector('.raw-energy-val');
    if (energyVal) energyVal.textContent = `${Math.round((entity.energy !== undefined ? entity.energy : 1) * 100)}%`;

    const stressVal = content.querySelector('.raw-stress-val');
    if (stressVal) stressVal.textContent = entity.isCoffin ? 'COFFIN IMMUNE' : `${fmtNum(entity.stress, 2)} / ${fmtNum(entity.glocThreshold, 2)}`;

    const chaffVal = content.querySelector('.raw-chaff-val');
    if (chaffVal) chaffVal.textContent = `${entity.chaff || 0} chaff salvos`;
  }
}

window.InspectionViews = InspectionViews;