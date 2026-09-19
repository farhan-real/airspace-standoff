/**
 * AIRSPACE STANDOFF // Subsystem Dossier Views Module
 * Renders modal dossiers for: Guided Weapons, Autocannons, Modular Components, Civilians, Surface Units
 */

class InspectorSubsystemViews {
  static renderWeapon(w) {
    if (!w) return '<div class="inspect-desc-box">NO WEAPON DATA AVAILABLE</div>';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rRange = rate('missile_range', w.rangeKm || 20.0);
    const rMin = rate('min_arming', w.minRangeKm || 1.0);
    const rSpd = rate('missile_speed', w.speedMach || 1.0);
    const rDmg = rate('missile_damage', w.damage || 2);
    const rAmmo = rate('ammo_count', w.ammoCount || 4);
    const rMass = rate('ordnance_mass', w.mass || 100);
    const rCost = rate('cost_weapon', w.cost || 1.0);

    const category = w.category || 'WEAPON';
    const seekerText = w.seeker || (w.isJammerPod ? 'Broadband Microwave ECM' : (w.isDecoy ? 'Fiber-Optic RF Decoy' : (w.isDecoyDrone ? 'Autonomous Radar Mirror' : (w.isLaser ? 'Directed Energy Thermal Beam' : 'Direct-Fire Gunpod'))));

    let counterHint = '';
    if (w.isJammerPod) counterHint = 'Anti-Radiation Missiles (HOJ tracking) or IR/Optical seekers.';
    else if (w.isDecoy || w.isDecoyDrone) counterHint = 'Imaging Infrared / Optical seekers, close-in visual NCTR, or CIWS.';
    else if (w.isLaser) counterHint = 'Dive into Weather Clouds (liquid water scatters beam) or maintain standoff beyond 9.0km.';
    else if (w.isGunpod) counterHint = 'Maintain BVR standoff (>5km) to exploit heavy carrier deadweight.';
    else if (w.seeker === 'ARH') counterHint = 'Beam 90° (Doppler Notch) + Dispense Chaff / Jammer Pod / Decoys.';
    else if (w.seeker === 'IIR' || w.seeker === 'EO') counterHint = 'Throttle to Idle/Cruise (cuts thermal exhaust) / Dive into Weather Clouds / Break Line of Sight.';
    else if (w.seeker === 'PASSIVE_RADAR') counterHint = 'Deactivate Jammer Pods and power down emitter radar arrays.';
    else counterHint = 'Execute high-G defensive break turn or Split-S dive.';

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge badge-cat-${category.toLowerCase()}">${category}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${Number(w.cost || 0).toFixed(1)}M</span>
      </div>

      ${InspectorModalRenderer.getLegendHtml()}

      <div class="inspect-sec-head">1. ENGAGEMENT BASKET &amp; KINEMATICS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>MAX ENGAGEMENT RANGE:</span><b class="${rRange.colorClass}">${w.rangeKm || 0} km</b></div>
        <div class="inspect-stat-item"><span>MIN ARMING DISTANCE:</span><b class="${rMin.colorClass}">${w.minRangeKm || 0.8} km</b></div>
        <div class="inspect-stat-item"><span>CRUISE &amp; TERMINAL VELOCITY:</span><b class="${rSpd.colorClass}">Mach ${w.speedMach || '1.0'}</b></div>
        <div class="inspect-stat-item"><span>WARHEAD DAMAGE:</span><b class="${rDmg.colorClass}">${w.damage || 0} HP</b></div>
        <div class="inspect-stat-item"><span>MAGAZINE / PACK CAPACITY:</span><b class="${rAmmo.colorClass}">${w.ammoCount !== undefined ? w.ammoCount : 4} Rounds</b></div>
        <div class="inspect-stat-item"><span>GUIDANCE &amp; SEEKER HEAD:</span><b style="color:#00f0ff;">${seekerText}</b></div>
        <div class="inspect-stat-item"><span>MISSILE STEALTH RCS:</span><b class="${w.isStealthMissile ? 'stat-tier-1' : 'stat-tier-3'}">${w.rcs || 0.04} m²</b></div>
        <div class="inspect-stat-item"><span>MOUNT MASS:</span><b class="${rMass.colorClass}">+${w.mass || 100} kg</b></div>
      </div>

      <div class="inspect-trait-box">
        <div class="inspect-sec-head">TACTICAL FEATURE: [${w.traitBadge || 'STANDARD'}]</div>
        ${w.behaviorDesc || w.desc || 'Standard guided ordnance pack.'}
      </div>

      <div class="inspect-trait-box" style="border-color:rgba(255, 51, 102, 0.3); background:rgba(255, 51, 102, 0.06);">
        <div class="inspect-sec-head" style="color:#ff3366; border-color:rgba(255, 51, 102, 0.2);">IN-GAME COUNTER-TACTIC:</div>
        <b>${counterHint}</b>
      </div>

      <div class="inspect-desc-box">
        <div class="inspect-sec-head">TACTICAL SPECIFICATION:</div>
        ${w.desc || ''}
      </div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }

  static renderGun(g) {
    if (!g) return '<div class="inspect-desc-box">NO GUN DATA AVAILABLE</div>';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rRpm = rate('gun_rpm', g.rpm || 3000);
    const rDps = rate('gun_dps', g.damagePerSec || 2.5);
    const rMass = rate('ordnance_mass', g.mass || 100);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge">${g.caliber || 'Direct Fire'}</span>
        <span class="inspect-cost-tag">BUILT-IN / PODDED AUTOCANNON</span>
      </div>

      ${InspectorModalRenderer.getLegendHtml()}

      <div class="inspect-sec-head">1. BALLISTIC SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>CYCLIC FIRE RATE:</span><b class="${rRpm.colorClass}">${g.rpm || 3000} RPM</b></div>
        <div class="inspect-stat-item"><span>SUSTAINED BURST DPS:</span><b class="${rDps.colorClass}">${(g.damagePerSec || 2.5).toFixed(1)} HP/s</b></div>
        <div class="inspect-stat-item"><span>EFFECTIVE MERGE RANGE:</span><b>${g.rangeKm || 4.8} km (Auto &lt; 4.8 km / Manual [G])</b></div>
        <div class="inspect-stat-item"><span>BORESIGHT SCAN CONE:</span><b>±${Math.round((g.coneAngleDeg || 45) / 2)}°</b></div>
        <div class="inspect-stat-item"><span>AMMUNITION CAPACITY:</span><b class="stat-tier-1">${g.defaultAmmo || 3200} Rounds / Pulses</b></div>
        <div class="inspect-stat-item"><span>MECHANISM WEIGHT:</span><b class="${rMass.colorClass}">+${g.mass || 100} kg</b></div>
      </div>

      <div class="inspect-desc-box">
        <div class="inspect-sec-head">BALLISTIC DESCRIPTION &amp; OPERATION:</div>
        ${g.desc || ''}
      </div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-equip-gun" onclick="if(window.Game&&window.Game.procurement){window.Game.procurement.equipItemDirectly({type:'gun',id:'${g.id}',name:'${g.name}'});document.getElementById('system-inspect-modal').classList.remove('active');}">EQUIP TO ACTIVE AIRCRAFT</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }

  static renderUpgrade(u) {
    if (!u) return '<div class="inspect-desc-box">NO UPGRADE DATA AVAILABLE</div>';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rCost = rate('cost_upgrade', u.cost || 1.0);
    const rMass = rate('component_mass', u.mass || 50);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge">${u.category || 'AVIONICS'}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${Number(u.cost || 0).toFixed(1)}M</span>
      </div>

      ${InspectorModalRenderer.getLegendHtml()}

      <div class="inspect-sec-head">1. SUBSYSTEM INTEGRATION &amp; WEIGHT IMPACT</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>SUBSYSTEM DISCIPLINE:</span><b>${u.category || 'AVIONICS'} Enhancement Core</b></div>
        <div class="inspect-stat-item"><span>COMPONENT MASS:</span><b class="${rMass.colorClass}">+${u.mass || 50} kg</b></div>
        <div class="inspect-stat-item"><span>SOCKET OCCUPANCY:</span><b>1 Modular Component Socket</b></div>
      </div>

      <div class="inspect-desc-box">
        <div class="inspect-sec-head">FUNCTIONAL BENEFIT &amp; ENGINEERING TRADE-OFFS:</div>
        ${u.desc || ''}
      </div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel-upg">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }

  static renderCivilian(c) {
    if (!c) return '<div class="inspect-desc-box">NO CIVILIAN DATA AVAILABLE</div>';
    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge" style="background:#065f46;color:#a7f3d0;">NEUTRAL NON-COMBATANT</span>
        <span class="inspect-cost-tag" style="color:#ff3366;">ROE PENALTY: -800 VP</span>
      </div>
      <div class="inspect-sec-head">CIVILIAN TRANSIT FLIGHT SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>FLIGHT CODE:</span><b style="color:#00f0ff;">${c.flightCode || c.code || 'CIV-700'}</b></div>
        <div class="inspect-stat-item"><span>AIRCRAFT MODEL:</span><b>${c.model || c.name || 'Commercial Airliner'}</b></div>
        <div class="inspect-stat-item"><span>CRUISE AIRSPEED:</span><b>Mach ${(c.speedMach || 0.78).toFixed(2)} (~${Math.round((c.speedMach || 0.78) * 1225)} km/h)</b></div>
        <div class="inspect-stat-item"><span>FLIGHT LEVEL ALTITUDE:</span><b>FL${Math.round((c.altFt || 36000) / 100)} (${(c.altFt || 36000).toLocaleString()} ft)</b></div>
        <div class="inspect-stat-item"><span>RADAR CROSS SECTION:</span><b>${c.effectiveRcs || c.rcs || 25.0} m² (Heavy Widebody Return)</b></div>
        <div class="inspect-stat-item"><span>PASSENGER INTEGRITY:</span><b>${c.hp || 6} / ${c.maxHp || 6} HP</b></div>
      </div>
      <div class="inspect-desc-box" style="border-left-color:#f97316;">
        <div class="inspect-sec-head" style="color:#f97316;">RULES OF ENGAGEMENT (ROE) DIRECTIVE:</div>
        ${c.desc || 'Scheduled commercial airliner transiting civilian flight corridor. Strictly protected under international aerospace law. Firing upon or destroying this craft incurs an immediate -800 Victory Point penalty.'}
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }

  static renderSurfaceUnit(s) {
    if (!s) return '<div class="inspect-desc-box">NO INSTALLATION DATA AVAILABLE</div>';
    const hpTag = s.isIndestructible ? 'INDESTRUCTIBLE (UNLIMITED CAPACITY)' : `${s.hp} / ${s.maxHp || s.hp} HP`;
    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge">${s.team === 'friendly' ? 'BLUE COALITION' : 'RED HOSTILE'}</span>
        <span class="inspect-cost-tag">${s.isIndestructible ? 'STRATEGIC LOGISTICS FACILITY' : 'SURFACE INSTALLATION'}</span>
      </div>
      <div class="inspect-sec-head">FACILITY SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>DESIGNATION:</span><b style="color:#00f0ff;">${s.name || s.type}</b></div>
        <div class="inspect-stat-item"><span>ARMOR INTEGRITY:</span><b style="color:${s.isIndestructible ? '#00f5a0' : '#f8fafc'};">${hpTag}</b></div>
        <div class="inspect-stat-item"><span>ENGAGEMENT RANGE:</span><b>${s.rangeKm ? s.rangeKm + ' km' : 'Passive Facility'}</b></div>
        <div class="inspect-stat-item"><span>FACILITY TYPE:</span><b>${s.type}</b></div>
      </div>
      <div class="inspect-desc-box">
        <div class="inspect-sec-head">STRATEGIC ANALYSIS:</div>
        ${s.desc || 'Surface tactical air-defense battery or logistics facility.'}
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }
}

window.InspectorSubsystemViews = InspectorSubsystemViews;