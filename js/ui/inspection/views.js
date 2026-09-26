/**
 * AIRSPACE STANDOFF: Inspection UI Component Views & Data Dossier
 * Structured tactical registries with clean glass sections and real-time live telemetry updating.
 */

class InspectionViews {
  static renderOverviewTab(controller, entity) {
    if (typeof InspectionOverviewRenderer !== 'undefined') {
      return InspectionOverviewRenderer.renderOverviewTab(controller, entity);
    }
    return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b></div>';
  }

  static renderEventTraceTab(controller, event) {
    if (!event) {
      const events = controller.events || [];
      if (events.length === 0) {
        return `
          <section class="inspection-card">
            <h3>CAUSAL EVENT LOG</h3>
            <p class="inspection-muted" style="margin-top:6px; line-height:1.5;">Waiting for tactical engagement events (missile launches, hits, kills, chaff deployments)...</p>
          </section>
        `;
      }
      return `
        <section class="inspection-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0;">CAUSAL EVENT LOG</h3>
            <span class="factor-chip neutral">${events.length} RECORDED</span>
          </div>
          <p class="inspection-muted" style="margin-top:4px;">Tap any tactical event to inspect detailed kinematics, hit probability factors, and causal telemetry.</p>
          <div class="inspection-event-list" style="max-height:360px; overflow-y:auto; margin-top:8px;">
            ${events.map(ev => `
              <button type="button" class="inspection-event-row" data-ev-id="${ev.id}">
                <span>[${ev.time}] ${ev.type}</span>
                <b>${controller.escape(ev.title)}</b>
              </button>
            `).join('')}
          </div>
        </section>
      `;
    }

    const d = event.details || {};
    const formatValue = (v) => {
      if (v === null || v === undefined) return 'None';
      if (typeof v === 'boolean') return v ? 'ACTIVE' : 'INACTIVE';
      if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
      if (Array.isArray(v)) return v.length === 0 ? 'None' : (typeof v[0] === 'object' ? `${v.length} recorded items` : v.join(', '));
      if (typeof v === 'object') return Object.entries(v).map(([subK, subV]) => `${subK}: ${typeof subV === 'number' ? subV.toFixed(2) : subV}`).join(' | ');
      return String(v);
    };

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <button type="button" class="hud-btn small" id="btn-trace-back-to-list">&larr; ALL EVENTS</button>
          <span class="factor-chip neutral">[${event.time}]</span>
        </div>
        <h3 style="margin:0;">${controller.escape(event.type)}</h3>
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

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const fmtNum = (n, dec = 2) => (typeof n === 'number' && Number.isFinite(n)) ? n.toFixed(dec) : 'N/A';
    const isAircraft = Boolean(entity.spec);
    const spec = entity.spec || {};

    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const rSpd = rate('speed', entity.speed || 0.85);
    const rRcs = rate('rcs', entity.effectiveRcs || spec.sigma_0 || 1.0);
    const rHp = rate('hp', entity.hp || 4);
    const rRadar = spec.R_0 ? rate('radar_range', spec.R_0) : { colorClass: 'stat-tier-3' };
    const rSpike = spec.beamSpike ? rate('beam_spike', spec.beamSpike) : { colorClass: 'stat-tier-3' };

    let aeroSection = '';
    if (isAircraft) {
      const sOpt = (typeof entity.getOptimalCornerSpeed === 'function') ? entity.getOptimalCornerSpeed() : 0.75;
      const turnEff = entity.isCoffin ? 1.0 : ((typeof Physics !== 'undefined') ? Physics.calcTurnEfficiency(entity.speed || 0.8, sOpt) : 0.85);
      const effAgi = entity.getEffectiveAgility ? entity.getEffectiveAgility() : spec.AGI_0;
      const rBaseAgi = rate('agility', spec.AGI_0 || 0.85);
      const rLiveAgi = rate('agility', effAgi);
      const rOptSpd = rate('speed', sOpt);
      const rG = rate('glimit', spec.G_limit || 9.0);

      aeroSection = `
        <div class="inspection-data-section">
          <span class="inspection-data-title">AERODYNAMICS &amp; ENVELOPE</span>
          <div class="inspection-data-row"><span class="inspection-data-label">Airframe Base Rating</span><b class="inspection-data-value ${rBaseAgi.colorClass}">${fmtNum(spec.AGI_0)} (Design Spec)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Live Turn Authority</span><b class="inspection-data-value raw-live-agility ${rLiveAgi.colorClass}">${fmtNum(effAgi)} (${Math.round(turnEff * 100)}% Corner Opt)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Corner Velocity (sOpt)</span><b class="inspection-data-value ${rOptSpd.colorClass}">Mach ${fmtNum(sOpt)} (${Math.round(sOpt * 1225)} km/h)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">G-Load Tolerance</span><b class="inspection-data-value ${rG.colorClass}">${fmtNum(spec.G_limit, 1)} G</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Kinetic Energy Reserve</span><b class="inspection-data-value raw-energy-val" style="color:${(entity.energy || 1) >= 0.7 ? 'var(--stat-tier-2)' : 'var(--stat-tier-4)'};">${Math.round((entity.energy !== undefined ? entity.energy : 1) * 100)}%</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Payload Weight Ratio (Wr)</span><b class="inspection-data-value raw-wr-val">${Math.round((entity.Wr || 0) * 100)}% (${Math.round(entity.maxPayloadMass || 5000)} kg max)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Pilot G-Stress</span><b class="inspection-data-value raw-stress-val" style="color:${(entity.stress || 0) >= 0.65 ? 'var(--stat-tier-5)' : 'var(--stat-tier-2)'};">${entity.isCoffin ? 'COFFIN IMMUNE' : `${fmtNum(entity.stress, 2)} / ${fmtNum(entity.glocThreshold, 2)}`}</b></div>
        </div>
      `;
    }

    return `
      <div class="inspection-data-section">
        <span class="inspection-data-title">TACTICAL IDENTITY &amp; FACTION</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Callsign / Name</span><b class="inspection-data-value">${controller.escape(entity.callsign || entity.name || entity.flightCode || entity.id)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Airframe Model</span><b class="inspection-data-value">${spec.name || entity.model || 'Standard'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Category / Role</span><b class="inspection-data-value">${spec.category || entity.type || 'Combatant'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Faction Assignment</span><b class="inspection-data-value">${entity.team ? entity.team.toUpperCase() : 'NEUTRAL'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Squadron Unit</span><b class="inspection-data-value">${controller.escape(entity.squadronName || 'None')}</b></div>
      </div>

      <div class="inspection-data-section">
        <span class="inspection-data-title">POSITION &amp; SPATIAL KINEMATICS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Coordinates (X, Y)</span><b class="inspection-data-value raw-coords-val">${fmtNum(entity.x, 1)} km, ${fmtNum(entity.y, 1)} km</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Flight Level</span><b class="inspection-data-value raw-fl-val">FL${Math.round((entity.altFt || 0) / 100)} (${Math.round(entity.altFt || 0).toLocaleString()} ft)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Airspeed</span><b class="inspection-data-value raw-spd-val ${rSpd.colorClass}">Mach ${fmtNum(entity.speed)} (${Math.round((entity.speed || 0) * 1225)} km/h)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Heading</span><b class="inspection-data-value raw-hdg-val">${String(headingDeg).padStart(3, '0')}&deg; (${fmtNum(entity.heading, 3)} rad)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Vertical Speed</span><b class="inspection-data-value raw-vsi-val">${Math.round(entity.vsiFpm || 0)} fpm</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Total Distance Traveled</span><b class="inspection-data-value raw-dist-val">${fmtNum(entity.distanceTraveled, 1)} km</b></div>
      </div>

      ${aeroSection}

      <div class="inspection-data-section">
        <span class="inspection-data-title">SENSORS &amp; STEALTH</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Radar Array Model</span><b class="inspection-data-value">${spec.radarType || 'N/A'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Instrumented Range (R_0)</span><b class="inspection-data-value ${rRadar.colorClass}">${fmtNum(spec.R_0, 1)} km</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Radar Cross Section (RCS)</span><b class="inspection-data-value raw-rcs-val ${rRcs.colorClass}">${fmtNum(entity.effectiveRcs || spec.sigma_0, 5)} m²</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Beam Exposure Spike</span><b class="inspection-data-value ${rSpike.colorClass}">${fmtNum(spec.beamSpike, 1)}x</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Optical IRST / DAS Sensors</span><b class="inspection-data-value">${entity.hasIRST ? 'IRST Active' : 'Off'} | ${entity.hasDAS ? 'DAS 360' : 'Off'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Electronic Countermeasures</span><b class="inspection-data-value">${entity.jamEfficiency ? `${Math.round(entity.jamEfficiency * 100)}% ECM` : 'None'}</b></div>
      </div>

      <div class="inspection-data-section">
        <span class="inspection-data-title">ARMAMENT &amp; DURABILITY</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Hull Durability (HP)</span><b class="inspection-data-value raw-hp-val ${rHp.colorClass}">${fmtNum(entity.hp, 1)} / ${entity.maxHp || 4} HP</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Autocannon System</span><b class="inspection-data-value raw-gun-ammo">${entity.gun ? entity.gun.name : 'None'} (${entity.gunAmmo || 0} rds)</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Countermeasure Dispenser</span><b class="inspection-data-value raw-chaff-val">${entity.chaff || 0} chaff salvos</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Equipped Stores</span><b class="inspection-data-value raw-stores-val">${(entity.equippedWeapons || []).map(w => w.weapon ? `${w.weapon.name} (${w.ammo}/${w.maxAmmo})` : 'Store').join(', ') || 'None'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Subsystem Upgrades</span><b class="inspection-data-value">${(entity.equippedUpgrades || []).join(', ') || 'None'}</b></div>
      </div>
    `;
  }

  static updateLive(controller, entity, content) {
    if (typeof InspectionOverviewRenderer !== 'undefined') {
      InspectionOverviewRenderer.updateLiveOverview(controller, entity, content);
    }
  }

  static updateRawLive(controller, entity, content) {
    if (!entity || !content) return;
    const fmtNum = (n, dec = 2) => (typeof n === 'number' && Number.isFinite(n)) ? n.toFixed(dec) : 'N/A';
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const coordsVal = content.querySelector('.raw-coords-val');
    if (coordsVal) coordsVal.textContent = `${fmtNum(entity.x, 1)} km, ${fmtNum(entity.y, 1)} km`;

    const flVal = content.querySelector('.raw-fl-val');
    if (flVal) flVal.textContent = `FL${Math.round((entity.altFt || 0) / 100)} (${Math.round(entity.altFt || 0).toLocaleString()} ft)`;

    const rSpd = rate('speed', entity.speed || 0.85);
    const spdVal = content.querySelector('.raw-spd-val');
    if (spdVal) {
      spdVal.textContent = `Mach ${fmtNum(entity.speed)} (${Math.round((entity.speed || 0) * 1225)} km/h)`;
      spdVal.className = `inspection-data-value raw-spd-val ${rSpd.colorClass}`;
    }

    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;
    if (headingDeg >= 360) headingDeg = 0;

    const hdgVal = content.querySelector('.raw-hdg-val');
    if (hdgVal) hdgVal.textContent = `${String(headingDeg).padStart(3, '0')}&deg; (${fmtNum(entity.heading, 3)} rad)`;

    const vsiVal = content.querySelector('.raw-vsi-val');
    if (vsiVal) vsiVal.textContent = `${Math.round(entity.vsiFpm || 0)} fpm`;

    const distVal = content.querySelector('.raw-dist-val');
    if (distVal) distVal.textContent = `${fmtNum(entity.distanceTraveled, 1)} km`;

    const hpVal = content.querySelector('.raw-hp-val');
    if (hpVal) {
      hpVal.textContent = `${fmtNum(entity.hp, 1)} / ${entity.maxHp || 4} HP`;
      hpVal.className = `inspection-data-value raw-hp-val ${rate('hp', entity.hp || 4).colorClass}`;
    }

    const energyVal = content.querySelector('.raw-energy-val');
    if (energyVal) {
      const ePct = Math.round((entity.energy !== undefined ? entity.energy : 1) * 100);
      energyVal.textContent = `${ePct}%`;
      energyVal.style.color = ePct >= 70 ? 'var(--stat-tier-2)' : (ePct >= 40 ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)');
    }

    const stressVal = content.querySelector('.raw-stress-val');
    if (stressVal) {
      stressVal.textContent = entity.isCoffin ? 'COFFIN IMMUNE' : `${fmtNum(entity.stress, 2)} / ${fmtNum(entity.glocThreshold, 2)}`;
      stressVal.style.color = (entity.stress || 0) >= 0.65 ? 'var(--stat-tier-5)' : 'var(--stat-tier-2)';
    }

    const chaffVal = content.querySelector('.raw-chaff-val');
    if (chaffVal) chaffVal.textContent = `${entity.chaff || 0} chaff salvos`;

    const rawWr = content.querySelector('.raw-wr-val');
    if (rawWr && entity.Wr !== undefined) {
      rawWr.textContent = `${Math.round(entity.Wr * 100)}% (${Math.round(entity.maxPayloadMass || 5000)} kg max)`;
    }

    const rawRcs = content.querySelector('.raw-rcs-val');
    if (rawRcs && entity.effectiveRcs !== undefined) {
      const rVal = rate('rcs', entity.effectiveRcs);
      rawRcs.textContent = `${fmtNum(entity.effectiveRcs, 5)} m²`;
      rawRcs.className = `inspection-data-value raw-rcs-val ${rVal.colorClass}`;
    }

    const rawGun = content.querySelector('.raw-gun-ammo');
    if (rawGun && entity.gun) {
      rawGun.textContent = `${entity.gun.name} (${entity.gunAmmo || 0} rds)`;
    }

    const rawStores = content.querySelector('.raw-stores-val');
    if (rawStores && entity.equippedWeapons) {
      rawStores.textContent = entity.equippedWeapons.map(w => w.weapon ? `${w.weapon.name} (${w.ammo}/${w.maxAmmo})` : 'Store').join(', ') || 'None';
    }

    const liveAgi = content.querySelector('.raw-live-agility');
    if (liveAgi && entity.spec) {
      const sOpt = (typeof entity.getOptimalCornerSpeed === 'function') ? entity.getOptimalCornerSpeed() : 0.75;
      const turnEff = entity.isCoffin ? 1.0 : ((typeof Physics !== 'undefined') ? Physics.calcTurnEfficiency(entity.speed || 0.8, sOpt) : 0.85);
      const effAgi = entity.getEffectiveAgility ? entity.getEffectiveAgility() : entity.spec.AGI_0;
      const rLiveAgi = rate('agility', effAgi);
      liveAgi.textContent = `${fmtNum(effAgi)} (${Math.round(turnEff * 100)}% Corner Opt)`;
      liveAgi.className = `inspection-data-value raw-live-agility ${rLiveAgi.colorClass}`;
    }
  }
}

window.InspectionViews = InspectionViews;