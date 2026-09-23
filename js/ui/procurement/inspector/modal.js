/**
 * AIRSPACE STANDOFF: Inspector Modal Renderer
 * Displays comprehensive airframe specifications with station breakdown and optimal corner speeds.
 */

class InspectorModalRenderer {
  static getLegendHtml() {
    return `
      <div class="inspect-spectrum-legend">
        <div class="legend-row">
          <span class="legend-title">PERFORMANCE:</span>
          <div class="legend-chips-row">
            <span class="legend-chip tier-1">[T1: EXCELLENT]</span>
            <span class="legend-chip tier-2">[T2: GOOD]</span>
            <span class="legend-chip tier-3">[T3: AVERAGE]</span>
            <span class="legend-chip tier-4">[T4: POOR]</span>
            <span class="legend-chip tier-5">[T5: VERY POOR]</span>
          </div>
        </div>
        <div class="legend-row">
          <span class="legend-title">COST / BUDGET:</span>
          <div class="legend-chips-row">
            <span class="legend-chip tier-1">[T1: VERY LOW]</span>
            <span class="legend-chip tier-2">[T2: LOW]</span>
            <span class="legend-chip tier-3">[T3: MEDIUM]</span>
            <span class="legend-chip tier-4">[T4: HIGH]</span>
            <span class="legend-chip tier-5">[T5: VERY HIGH]</span>
          </div>
        </div>
      </div>
    `;
  }

  static renderAirframe(a, guns) {
    if (!a) return '<div class="inspect-desc-box">NO AIRFRAME DATA AVAILABLE</div>';
    guns = guns || window.AUTOCANNONS_CATALOG || {};

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rSpeed = rate('speed', a.S_0 || 0.90);
    const rAgi = rate('agility', a.AGI_0 || 0.85);
    const rG = rate('glimit', a.G_limit || 9.0);
    const rHp = rate('hp', a.hp || 4);
    const rRadar = rate('radar_range', a.R_0 || 75.0);
    const rCone = rate('radar_cone', a.radarConeDeg || 120);
    const rClutter = rate('clutter', a.lookDownBonus || 0.20);
    const rRcs = rate('rcs', a.sigma_0 || 1.0);
    const baseSpike = (a.beamSpike !== undefined) ? a.beamSpike : 3.2;
    const rBeamSpike = rate('beam_spike', baseSpike);
    const spikePct = Math.round((baseSpike - 1.0) * 100);

    const rSlots = rate('pylon_slots', a.totalSlots || 6);
    const rMass = rate('payload_capacity', a.M_max || 5000);
    const rUpg = rate('upgrade_sockets', a.upgradeSockets || 3);
    const rCost = rate('cost_airframe', a.cost || 20.0);

    const category = a.category || 'MULTIROLE';
    const stealthClass = (a.sigma_0 <= 0.0005) ? 'VLO Stealth' : ((a.sigma_0 < 0.1) ? 'Low-Observable' : ((a.sigma_0 < 2.0) ? 'Reduced Signature' : 'Conventional Fighter'));
    const nozzleDesc = a.thrustVector ? '3D/2D Thrust Vectoring Nozzles' : (a.isCoffin ? 'COFFIN Neural Flight (Manual)' : 'Conventional Aerodynamic Surfaces');
    const nozzleTier = a.thrustVector ? 'tier-1' : (a.isCoffin ? 'tier-1' : 'tier-3');
    const nozzleClass = a.thrustVector ? 'stat-tier-1' : (a.isCoffin ? 'stat-tier-1' : 'stat-tier-3');

    const allowedList = a.allowedGuns || (a.builtInGun ? [a.builtInGun] : ['M61A2']);
    const allowedGunNames = allowedList.map(gId => (guns[gId] ? guns[gId].name : gId)).join(', ');
    const builtInName = guns[a.builtInGun] ? guns[a.builtInGun].name : (a.builtInGun || 'M61A2 Vulcan');
    const maxPayloadKg = (a.M_max || 5000).toLocaleString();

    const sOptVal = a.sOpt || ((a.S_0 || 0.90) * 0.65);
    const sOptKmH = Math.round(sOptVal * 1225);

    const internalBayDesc = a.internalSlots > 0
      ? `${a.internalSlots} Slots (Concealed VLO Bay - Zero Drag & Zero Extra RCS)`
      : 'None (Conventional Airframe)';
    const externalPylonsDesc = `${a.externalSlots !== undefined ? a.externalSlots : (a.totalSlots || 6)} Pylons (${a.maxPylonRating || 'Type M'} Max Rating)`;
    const centerlineDesc = a.hasCenterline
      ? `1 Heavy Station (${a.centerlineSlots || 6} Slots Max - Kinzhal Compatible)`
      : 'None';

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge badge-cat-${category.toLowerCase()}" data-tag-title="${category} CLASS" data-tag-tooltip="${a.desc || 'Tactical airframe.'}">${category}</span>
        <span class="inspect-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;" data-tag-title="PROPULSION SYSTEM" data-tag-tooltip="${nozzleDesc}">${a.thrustVector ? '3D TVC' : (a.isCoffin ? 'COFFIN' : 'AERO')}</span>
        <span class="inspect-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;" data-tag-title="GROUND CLUTTER FILTER" data-tag-tooltip="Look-down clutter suppression allows tracking terrain-skimming bandits.">CLUTTER: +${Math.round((a.lookDownBonus || 0.2)*100)}%</span>
        <span class="inspect-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;" data-tag-title="PAYLOAD CARRIAGE" data-tag-tooltip="Certified structural payload limit.">PAYLOAD: ${maxPayloadKg} kg</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${Number(a.cost || 0).toFixed(1)}M</span>
      </div>

      ${InspectorModalRenderer.getLegendHtml()}

      <div class="inspect-sec-head">1. KINEMATICS &amp; FLIGHT ENVELOPE</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>PRIMARY COMBAT ROLE:</span><b>${a.role || 'Fighter'}</b></div>
        <div class="inspect-stat-item"><span>MAX SPRINT AIRSPEED:</span><b class="${rSpeed.colorClass}">Mach ${(a.S_0 || 0.90).toFixed(2)} (${Math.round((a.S_0 || 0.90) * 1225)} km/h)</b></div>
        <div class="inspect-stat-item"><span>TURN AGILITY (CORNER SPEED):</span><b class="${rAgi.colorClass}">${(a.AGI_0 || 0.85).toFixed(2)} (M ${sOptVal.toFixed(2)} / ${sOptKmH} km/h opt)</b></div>
        <div class="inspect-stat-item"><span>STRUCTURAL G-LIMIT:</span><b class="${rG.colorClass}">${(a.G_limit || 9.0).toFixed(1)} G</b></div>
        <div class="inspect-stat-item"><span>THRUST VECTORING / COFFIN:</span><b class="${nozzleClass}">${nozzleDesc} <span class="stat-badge-tier ${nozzleTier}">${a.thrustVector ? 'TVC' : (a.isCoffin ? 'COFFIN' : 'AERO')}</span></b></div>
        <div class="inspect-stat-item"><span>AIRFRAME ARMOR INTEGRITY:</span><b class="${rHp.colorClass}">${a.hp || 4} HP</b></div>
      </div>

      <div class="inspect-sec-head">2. SENSORS, OBSERVABILITY &amp; BEAM SIGNATURE</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>RADAR ARRAY:</span><b>${a.radarType || 'Pulse-Doppler'}</b></div>
        <div class="inspect-stat-item"><span>INSTRUMENTED RANGE:</span><b class="${rRadar.colorClass}">${(a.R_0 || 75.0).toFixed(1)} km</b></div>
        <div class="inspect-stat-item"><span>GIMBAL SCAN CONE:</span><b class="${rCone.colorClass}">+-${Math.round((a.radarConeDeg || 120) / 2)}deg</b></div>
        <div class="inspect-stat-item"><span>LOOK-DOWN CLUTTER FILTER:</span><b class="${rClutter.colorClass}">+${Math.round((a.lookDownBonus || 0.20) * 100)}%</b></div>
        <div class="inspect-stat-item"><span>BASE RCS (NOSE-ON):</span><b class="${rRcs.colorClass}">${a.sigma_0 || 1.0} m2 (${stealthClass})</b></div>
        <div class="inspect-stat-item"><span>BEAM EXPOSURE SPIKE:</span><b class="${rBeamSpike.colorClass}">${baseSpike.toFixed(1)}x (+${spikePct}% signature increase when turning broadside)</b></div>
        <div class="inspect-stat-item"><span>COFFIN NEURAL FLIGHT:</span><b class="${a.isCoffin ? 'stat-tier-1' : 'stat-tier-3'}">${a.isCoffin ? 'MANUAL COFFIN (Zero stress, immune to G-LOC, +25% dodge bonus)' : 'HUMAN CREWED (Standard stress limits)'}</b></div>
      </div>

      <div class="inspect-sec-head">3. ORDNANCE ARCHITECTURE &amp; HARDPOINTS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>INTERNAL WEAPONS BAY:</span><b class="${a.internalSlots > 0 ? 'stat-tier-1' : 'stat-tier-4'}">${internalBayDesc}</b></div>
        <div class="inspect-stat-item"><span>EXTERNAL WING PYLONS:</span><b class="stat-tier-2">${externalPylonsDesc}</b></div>
        <div class="inspect-stat-item"><span>CENTERLINE FUSELAGE STATION:</span><b class="${a.hasCenterline ? 'stat-tier-2' : 'stat-tier-4'}">${centerlineDesc}</b></div>
        <div class="inspect-stat-item"><span>TOTAL COMBINED CAPACITY:</span><b class="${rSlots.colorClass}">${a.totalSlots || 6} Max Slots</b></div>
        <div class="inspect-stat-item"><span>MAX PAYLOAD CARRIAGE:</span><b class="${rMass.colorClass}">${maxPayloadKg} kg</b></div>
        <div class="inspect-stat-item"><span>BUILT-IN CANNON:</span><b>${builtInName} (${a.gunRounds || 3200} rds)</b></div>
        <div class="inspect-stat-item"><span>COMPATIBLE GUNS:</span><b>${allowedGunNames}</b></div>
        <div class="inspect-stat-item"><span>MODULAR SOCKETS:</span><b class="${rUpg.colorClass}">${a.upgradeSockets || 3} Sockets</b></div>
      </div>

      <div class="inspect-desc-box">
        <div class="inspect-sec-head">TACTICAL DOCTRINE &amp; PILOT GUIDANCE:</div>
        ${a.desc || 'Standard multirole air superiority platform.'}
      </div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn req-btn" id="inspect-btn-req">+ ADD TO SQUADRON</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }

  static renderWeapon(w) { return InspectorSubsystemViews.renderWeapon(w); }
  static renderGun(g) { return InspectorSubsystemViews.renderGun(g); }
  static renderUpgrade(u) { return InspectorSubsystemViews.renderUpgrade(u); }
  static renderCivilian(c) { return InspectorSubsystemViews.renderCivilian(c); }
  static renderSurfaceUnit(s) { return InspectorSubsystemViews.renderSurfaceUnit(s); }
}

window.InspectorModalRenderer = InspectorModalRenderer;