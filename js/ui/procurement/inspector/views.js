/**
 * AIRSPACE STANDOFF: Subsystem Dossier Views Module
 * Renders modal dossiers for: Guided Weapons, Autocannons, Modular Components, Civilians, Surface Units.
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

    let seekerText = w.seeker || 'GUIDED';
    if (w.seeker === 'INS') seekerText = 'INS (Inertial Navigation & Terminal Radar)';
    else if (w.seeker === 'GPS_INS') seekerText = 'GPS / INS (Satellite Assisted Inertial)';
    else if (w.seeker === 'ARH') seekerText = 'ARH (Active Radar Homing)';
    else if (w.seeker === 'IIR') seekerText = 'IIR (Imaging Infrared)';
    else if (w.seeker === 'EO') seekerText = 'EO (Electro-Optical Matrix)';
    else if (w.seeker === 'OPT') seekerText = 'OPT (Optical Swarm Tracker)';
    else if (w.seeker === 'PASSIVE_RADAR') seekerText = 'Passive Radar (Anti-Radiation)';
    else if (w.isJammerPod) seekerText = 'Broadband Microwave ECM';
    else if (w.isDecoy) seekerText = 'Fiber-Optic RF Decoy';
    else if (w.isDecoyDrone) seekerText = 'Autonomous Radar Mirror';
    else if (w.isLaser) seekerText = 'Directed Energy Thermal Beam';
    else if (w.isGunpod) seekerText = 'Direct-Fire Gunpod';

    let counterHint = '';
    if (w.isJammerPod) counterHint = 'Anti-Radiation Missiles (HOJ tracking) or IR/Optical seekers';
    else if (w.isDecoy || w.isDecoyDrone) counterHint = 'Imaging Infrared/Optical seekers, close-in visual NCTR, or CIWS';
    else if (w.isLaser) counterHint = 'Dive into Weather Clouds (liquid moisture scatters beam) or maintain standoff beyond 9.0 km';
    else if (w.isGunpod) counterHint = 'Maintain BVR standoff beyond 5.0 km to exploit carrier weight';
    else if (w.seeker === 'ARH') counterHint = 'Beam 90 deg (Doppler Notch), deploy Chaff or ECM jammer pods';
    else if (w.seeker === 'IIR' || w.seeker === 'EO') counterHint = 'Throttle to Idle or Cruise to cut thermal exhaust, or dive into clouds';
    else if (w.seeker === 'PASSIVE_RADAR') counterHint = 'Deactivate airborne ECM jammer pods and power down emitting radar arrays';
    else if (w.seeker === 'INS') counterHint = 'Break 90 deg perpendicular to dive angle to exploit hypersonic turn radius, or intercept with CIWS';
    else if (w.seeker === 'GPS_INS') counterHint = 'Intercept glide bombs with CIWS air-defense batteries';
    else counterHint = 'Execute high-G defensive break turns, Split-S kinetic dives, or deploy countermeasures';

    const traitLabel = w.traitBadge || 'STANDARD';
    const primaryDesc = w.behaviorDesc || w.desc || 'Standard precision-guided munition.';
    const subDesc = (w.desc && w.desc !== w.behaviorDesc) ? w.desc : '';
    const airframesText = (w.allowedAirframes && w.allowedAirframes.length > 0)
      ? w.allowedAirframes.join(', ')
      : 'All certified aircraft with sufficient pylon rating';

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
        <div class="inspect-stat-item"><span>MAGAZINE CAPACITY:</span><b class="${rAmmo.colorClass}">${w.ammoCount !== undefined ? w.ammoCount : 4} Rounds</b></div>
        <div class="inspect-stat-item"><span>MOUNT MASS:</span><b class="${rMass.colorClass}">+${w.mass || 100} kg</b></div>
      </div>

      <div class="inspect-sec-head">2. GUIDANCE, TRAITS &amp; DEFENSES</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>GUIDANCE &amp; SEEKER HEAD:</span><b style="color:#00f0ff;">${seekerText}</b></div>
        <div class="inspect-stat-item"><span>SPECIAL TRAIT:</span><b style="color:#ffd700;">[${traitLabel}]</b></div>
        <div class="inspect-stat-item"><span>MISSILE STEALTH RCS:</span><b class="${w.isStealthMissile ? 'stat-tier-1' : 'stat-tier-3'}">${w.rcs || 0.04} m2</b></div>
        <div class="inspect-stat-item"><span>COMPATIBLE AIRFRAMES:</span><b style="color:#fef08a;text-align:right;font-size:0.62rem;">${airframesText}</b></div>
        <div class="inspect-stat-item"><span>EVASION COUNTER:</span><b style="color:#7dd3fc;text-align:right;font-size:0.64rem;">${counterHint}</b></div>
      </div>

      <div class="inspect-sec-head">3. OPERATIONAL PROFILE</div>
      <div class="inspect-desc-box">
        <p style="color:#f8fafc;font-size:0.72rem;line-height:1.55;">${primaryDesc}</p>
        ${subDesc ? `<p style="color:#8494ab;font-size:0.66rem;border-top:1px dashed #16273e;padding-top:4px;margin-top:4px;line-height:1.45;">${subDesc}</p>` : ''}
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
    const coneDeg = g.coneAngleDeg || 45;
    const roundsInBurst = g.roundsPerBurst || 4;
    const perRoundDmg = (g.damagePerRound || ((g.damagePerBurst || 1.4) / roundsInBurst)).toFixed(2);
    const totalBurstDmg = (g.damagePerBurst || 1.40).toFixed(2);

    const stealthImpact = (g.thermalBloom && g.thermalBloom > 1.0) ? '+60% IR THERMAL BLOOM (STEALTH COMPROMISED)' : 'ZERO THERMAL BLOOM (VLO STEALTH PRESERVED)';
    const cloudPenetration = (g.cloudScattering && g.cloudScattering > 0) ? 'SCATTERED IN CLOUDS (-75% DAMAGE)' : '100% ALL-WEATHER PENETRATION';
    const concussionText = (g.kineticConcussion && g.kineticConcussion > 0) ? `KINETIC FLINCH & ENERGY DRAIN (${Math.round(g.kineticConcussion * 100)}% STRESS)` : 'PURE THERMAL (ZERO KINETIC CONCUSSION)';

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
        <div class="inspect-stat-item"><span>BURST CONFIGURATION:</span><b style="color:#00f0ff;">${roundsInBurst} Rounds / Pulses per Burst</b></div>
        <div class="inspect-stat-item"><span>DAMAGE PER ROUND:</span><b style="color:#ffd700;">${perRoundDmg} HP / round</b></div>
        <div class="inspect-stat-item"><span>TOTAL BURST DAMAGE:</span><b style="color:#00f5a0;">${totalBurstDmg} HP total</b></div>
        <div class="inspect-stat-item"><span>BURST RELOAD / COOLING:</span><b style="color:#ffb830;">${(g.burstCooldown || 1.6).toFixed(1)}s Reload Cycle</b></div>
        <div class="inspect-stat-item"><span>EFFECTIVE MERGE RANGE:</span><b>${g.rangeKm || 4.8} km</b></div>
        <div class="inspect-stat-item"><span>AMMUNITION CAPACITY:</span><b class="stat-tier-1">${g.defaultAmmo || 500} Rounds / Pulses</b></div>
        <div class="inspect-stat-item"><span>MECHANISM WEIGHT:</span><b class="${rMass.colorClass}">+${g.mass || 100} kg</b></div>
      </div>

      <div class="inspect-sec-head">2. TACTICAL ADVANTAGES &amp; DOCTRINE</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>BORESIGHT CONE AUTHORITY:</span><b style="color:${coneDeg >= 48 ? '#00f5a0' : '#f97316'};">${coneDeg} deg Boresight Cone (${coneDeg >= 48 ? 'Forgiving High-G Snapshot' : 'Narrow Pinpoint Beam'})</b></div>
        <div class="inspect-stat-item"><span>THERMAL STEALTH IMPACT:</span><b style="color:${g.thermalBloom > 1 ? '#f97316' : '#00f5a0'};">${stealthImpact}</b></div>
        <div class="inspect-stat-item"><span>WEATHER CLOUD INTEGRITY:</span><b style="color:${g.cloudScattering ? '#f97316' : '#00f5a0'};">${cloudPenetration}</b></div>
        <div class="inspect-stat-item"><span>KINETIC IMPACT DISRUPTION:</span><b style="color:#7dd3fc;">${concussionText}</b></div>
      </div>

      <div class="inspect-sec-head">3. BALLISTIC OPERATION</div>
      <div class="inspect-desc-box">
        <div style="color:#f8fafc;">${g.desc || ''}</div>
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

      <div class="inspect-sec-head">2. FUNCTIONAL BENEFIT</div>
      <div class="inspect-desc-box">
        <div style="color:#f8fafc;">${u.desc || ''}</div>
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
        <span class="inspect-cost-tag" style="color:#ff3366;">ROE PENALTIES: UNVERIFIED FIRE -600 VP &bull; STRIKE -500 VP &bull; DESTRUCTION -2000 VP</span>
      </div>
      <div class="inspect-sec-head">CIVILIAN TRANSIT FLIGHT SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>FLIGHT CODE:</span><b style="color:#00f0ff;">${c.flightCode || c.code || 'CIV-700'}</b></div>
        <div class="inspect-stat-item"><span>AIRCRAFT MODEL:</span><b>${c.model || c.name || 'Commercial Airliner'}</b></div>
        <div class="inspect-stat-item"><span>CRUISE AIRSPEED:</span><b>Mach ${(c.speedMach || 0.78).toFixed(2)} (~${Math.round((c.speedMach || 0.78) * 1225)} km/h)</b></div>
        <div class="inspect-stat-item"><span>FLIGHT LEVEL ALTITUDE:</span><b>FL${Math.round((c.altFt || 36000) / 100)} (${(c.altFt || 36000).toLocaleString()} ft)</b></div>
        <div class="inspect-stat-item"><span>RADAR CROSS SECTION:</span><b>${c.effectiveRcs || c.rcs || 25.0} m2 (Heavy Widebody Return)</b></div>
        <div class="inspect-stat-item"><span>PASSENGER INTEGRITY:</span><b>${c.hp || 6} / ${c.maxHp || 6} HP</b></div>
      </div>
      <div class="inspect-desc-box" style="border-left-color:#f97316;">
        <div class="inspect-sec-head" style="color:#f97316;margin-top:0;">RULES OF ENGAGEMENT (ROE) DIRECTIVE:</div>
        <div style="color:#f8fafc;margin-top:2px;">${c.desc || 'Scheduled commercial airliner transiting civilian flight corridor. Strictly protected under international aerospace law. Firing upon an unverified bogey incurs -600 VP; striking this aircraft incurs -500 VP; destroying it incurs a catastrophic -2000 Victory Point penalty.'}</div>
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
        <div class="inspect-sec-head" style="margin-top:0;">STRATEGIC ANALYSIS:</div>
        <div style="color:#f8fafc;margin-top:2px;">${s.desc || 'Surface tactical air-defense battery or logistics facility.'}</div>
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn close-btn" onclick="document.getElementById('system-inspect-modal').classList.remove('active');">CLOSE</button>
      </div>
    `;
  }
}

window.InspectorSubsystemViews = InspectorSubsystemViews;