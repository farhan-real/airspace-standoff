/**
 * js/ui/procurement/specs/facilities.js - Specifications Facilities & Ground Views Submodule.
 */

class SpecsFacilitiesViews {
  static renderLeadBuffs(spec) {
    if (!spec) return '<div class="inspect-desc-box">NO FLIGHT LEAD DATA AVAILABLE</div>';
    const cat = spec.category || 'MULTIROLE';
    const data = (window.LEAD_BUFFS && window.LEAD_BUFFS[cat]) || {
      role: 'Flight Lead',
      title: 'Formation Lead Suite',
      survivability: 'Enhanced Airframe Durability',
      weaknessFixed: 'Formation command and control enhancements.',
      summary: 'Squadron lead flight modifications.',
      buffs: []
    };

    const buffsListHtml = (data.buffs || []).map(b => `
      <div class="inspect-stat-item">
        <span>${b.label}:</span>
        <b style="color:var(--stat-tier-1);">${b.val} <span style="color:var(--color-moon-mist);font-weight:400;font-size:0.62rem;">(${b.desc})</span></b>
      </div>
    `).join('');

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge badge-cat-${cat.toLowerCase()}">${cat} FORMATION LEAD</span>
        <span class="inspect-cost-tag" style="color:var(--stat-tier-2);">SQUADRON COMMAND BUFF</span>
      </div>

      <div class="inspect-special-box">
        <div class="inspect-special-title">FLIGHT LEAD SPECIAL BEHAVIOURS</div>
        <div class="inspect-special-list">
          <div class="inspect-special-row">
            <b class="inspect-special-head" style="color:#fbbf24;">Central Formation Anchor &amp; High-Value Target (+1.5x Kill Bounty)</b>
            <span class="inspect-special-desc">${data.summary}</span>
          </div>
        </div>
      </div>

      <div class="inspect-sec-head">FLIGHT LEAD TACTICAL SUITE: ${data.title.toUpperCase()}</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>ASSIGNED ROLE:</span><b style="color:#ffffff;">${data.role}</b></div>
        <div class="inspect-stat-item"><span>SURVIVABILITY UPGRADE:</span><b style="color:var(--stat-tier-2);">${data.survivability}</b></div>
        <div class="inspect-stat-item"><span>DOCTRINE CORRECTION:</span><b style="color:var(--theme-accent);">${data.weaknessFixed}</b></div>
      </div>

      <div class="inspect-sec-head">SPECIALIZED LEAD MODIFICATIONS</div>
      <div class="inspect-stat-grid">${buffsListHtml}</div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderCivilian(c) {
    if (!c) return '<div class="inspect-desc-box">NO CIVILIAN DATA AVAILABLE</div>';
    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge neutral-civ">NEUTRAL NON-COMBATANT</span>
        <span class="inspect-cost-tag roe-alert">ROE PENALTIES: UNVERIFIED FIRE -600 VP &bull; STRIKE -500 VP &bull; DESTRUCTION -2000 VP</span>
      </div>
      <div class="inspect-special-box">
        <div class="inspect-special-title">RULES OF ENGAGEMENT (ROE) SPECIAL BEHAVIOUR</div>
        <div class="inspect-special-list">
          <div class="inspect-special-row">
            <b class="inspect-special-head" style="color:#fb7185;">Protected Civilian Transponder Traffic (-500 VP Fire / -2,000 VP Kill)</b>
            <span class="inspect-special-desc">Starts as BOGEY [?] until scanned continuously for ~6 seconds; verify track before firing to avoid severe ROE penalties.</span>
          </div>
        </div>
      </div>
      <div class="inspect-sec-head">CIVILIAN TRANSIT FLIGHT SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>FLIGHT CODE:</span><b style="color:var(--color-cyan);">${c.flightCode || c.code || 'CIV-700'}</b></div>
        <div class="inspect-stat-item"><span>AIRCRAFT MODEL:</span><b>${c.model || c.name || 'Commercial Airliner'}</b></div>
        <div class="inspect-stat-item"><span>CRUISE AIRSPEED:</span><b>Mach ${(c.speedMach || 0.78).toFixed(2)} (~${Math.round((c.speedMach || 0.78) * 1225)} km/h)</b></div>
        <div class="inspect-stat-item"><span>FLIGHT LEVEL ALTITUDE:</span><b>FL${Math.round((c.altFt || 36000) / 100)} (${(c.altFt || 36000).toLocaleString()} ft)</b></div>
        <div class="inspect-stat-item"><span>RADAR CROSS SECTION:</span><b>${c.effectiveRcs || c.rcs || 25.0} m2 (Heavy Widebody Return)</b></div>
        <div class="inspect-stat-item"><span>PASSENGER INTEGRITY:</span><b>${c.hp || 6} / ${c.maxHp || 6} HP</b></div>
      </div>
      <div class="inspect-desc-box" style="border-left-color:var(--color-orange);">
        <div class="inspect-sec-head" style="color:var(--color-orange);margin-top:0;">RULES OF ENGAGEMENT (ROE) DIRECTIVE</div>
        <div>${c.desc || 'Scheduled commercial airliner transiting civilian flight corridor. Protected under international aerospace law.'}</div>
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderSurfaceUnit(s) {
    if (!s) return '<div class="inspect-desc-box">NO INSTALLATION DATA AVAILABLE</div>';
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const hpTag = s.isIndestructible ? 'INDESTRUCTIBLE (UNLIMITED CAPACITY)' : `${s.hp} / ${s.maxHp || s.hp} HP`;
    const armorCol = s.armorClass === 'FORTIFIED' ? '#ff3864' : (s.armorClass === 'ARMORED' ? '#fbbf24' : '#00f5a0');
    const floorText = (s.minAltFt && s.minAltFt > 1000)
      ? `${s.minAltFt.toLocaleString()} ft (${s.cuedMinAltFt ? s.cuedMinAltFt.toLocaleString() + ' ft cued' : 'fixed'})`
      : '1,000 ft (All Low Altitude)';
    const hybridText = (s.isAaaGun && s.missileSpec) ? `Twin Flak (${s.aaaRangeKm} km) &amp; ${s.missileSpec.name} (${s.rangeKm} km)` : null;
    const specialDetailHtml = window.BehaviorCodex.renderSpecsDetailHtml('surface', s);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge propulsion">${s.team === 'friendly' ? 'BLUE COALITION' : 'RED HOSTILE'}</span>
        <span class="inspect-badge" style="color:${armorCol};border-color:${armorCol};">${s.armorClass || 'SOFT'} ARMOR</span>
        <span class="inspect-cost-tag">${s.vpValue ? `+${s.vpValue} VP` : 'SURFACE INSTALLATION'}</span>
      </div>
      <div class="inspect-kpi-strip">
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">INTEGRITY</span><b class="inspect-kpi-val" style="color:${s.isIndestructible ? 'var(--color-green)' : '#ffffff'};">${s.isIndestructible ? 'INDESTRUCTIBLE' : `${s.hp} / ${s.maxHp || s.hp} HP`}</b><span class="inspect-kpi-sub">${s.armorClass || 'SOFT'} Armor</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">COVERAGE</span><b class="inspect-kpi-val">${s.rangeKm ? s.rangeKm + ' km' : 'STATIC'}</b><span class="inspect-kpi-sub">${s.canAttack ? 'Armed Site' : 'Facility'}</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">MIN FLOOR</span><b class="inspect-kpi-val">${s.canAttack ? ((s.minAltFt && s.minAltFt > 1000) ? s.minAltFt.toLocaleString() + ' ft' : '1,000 ft') : 'N/A'}</b><span class="inspect-kpi-sub">Engagement Ceiling</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">EMISSIONS</span><b class="inspect-kpi-val" style="color:${s.isEmitter ? 'var(--color-orange)' : 'var(--color-green)'};">${s.isEmitter ? 'ACTIVE RF' : 'SILENT'}</b><span class="inspect-kpi-sub">${s.isEmitter ? 'ARM Targetable' : 'ARM Immune'}</span></div>
      </div>
      ${specialDetailHtml}
      <div class="inspect-sec-head">FACILITY &amp; IADS SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>DESIGNATION:</span><b style="color:var(--color-cyan);">${s.name || s.type}</b></div>
        <div class="inspect-stat-item"><span>ARMOR INTEGRITY:</span><b style="color:${s.isIndestructible ? 'var(--color-green)' : '#ffffff'};">${hpTag}</b></div>
        <div class="inspect-stat-item"><span>COVERAGE:</span><b>${s.rangeKm ? s.rangeKm + ' km' : 'Static Facility'}</b></div>
        <div class="inspect-stat-item"><span>MIN FLOOR:</span><b>${s.canAttack ? floorText : 'N/A'}</b></div>
      </div>
      <div class="inspect-detail-list">
        <div class="inspect-detail-row"><span>EMISSIONS PROFILE:</span><b style="color:${s.isEmitter ? 'var(--color-orange)' : 'var(--color-green)'};">${s.isEmitter ? 'ACTIVE RADAR / RF EMITTER (ARM TARGETABLE)' : 'PASSIVE / SILENT (IMMUNE TO ARM)'}</b></div>
        ${hybridText ? `<div class="inspect-detail-row"><span>HYBRID BATTERY:</span><b style="color:var(--color-blue);">${hybridText}</b></div>` : ''}
        ${s.isLogisticsHub ? `<div class="inspect-detail-row"><span>AIRBASE SUPPORT:</span><b style="color:var(--color-amber);">Accelerates QRA Launches by 18% While Intact</b></div>` : ''}
        ${s.isGroundDecoy ? `<div class="inspect-detail-row"><span>DECOY EXPOSURE:</span><b style="color:var(--color-amber);">${s.spec && s.spec.requiresHighGradeTgp ? 'Requires 45+ km Targeting Pod or 15 km Flyby' : 'Exposed by Any Targeting Pod or 22 km Flyby'}</b></div>` : ''}
        ${s.secondaryBlastRadiusKm ? `<div class="inspect-detail-row"><span>SECONDARY DETONATION:</span><b style="color:var(--color-orange);">${s.secondaryBlastRadiusKm} km Splash (${s.secondaryBlastDamage} HP)</b></div>` : ''}
      </div>
      <div class="inspect-desc-box">
        <div class="inspect-sec-head" style="margin-top:0;">STRATEGIC ANALYSIS</div>
        <div>${s.desc || 'Surface tactical air-defense battery or logistics facility.'}</div>
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }
}

window.SpecsFacilitiesViews = SpecsFacilitiesViews;
