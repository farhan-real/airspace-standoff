/**
 * AIRSPACE STANDOFF: Specifications Subsystem Dossier Views Module
 * Renders modal dossiers for: Guided Weapons, Autocannons, Modular Components, Civilians, Surface Units, Flight Leads.
 */

class SpecsSubsystemViews {
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
    else if (w.isDecoy || w.isDecoyDrone) counterHint = 'Imaging Infrared/Optical seekers, close-in visual identification, or CIWS';
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

      ${SpecsModalRenderer.getLegendHtml()}

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
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
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

      ${SpecsModalRenderer.getLegendHtml()}

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

      <div class="inspect-sec-head">2. COMBAT CAPABILITIES &amp; DOCTRINE</div>
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
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-equip-gun" onclick="if(window.Game&&window.Game.procurement){window.Game.procurement.equipItemDirectly({type:'gun',id:'${g.id}',name:'${g.name}'});const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();}">EQUIP TO ACTIVE AIRCRAFT</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static getUpgradeCompatibility(u, allAirframes) {
    if (!u.isAllowed) {
      return {
        summary: 'Universal (All Airframes)',
        groupText: 'Stealth, Superiority, Multirole, Strike, EW, Drones, Experimental',
        exceptionsText: 'None',
        compatibleList: allAirframes.map(a => a.id).join(', ')
      };
    }

    const compatible = allAirframes.filter(s => u.isAllowed(s));
    const isUniversal = (compatible.length === allAirframes.length);

    if (isUniversal) {
      return {
        summary: 'Universal (All Airframes)',
        groupText: 'Stealth, Superiority, Multirole, Strike, EW, Drones, Experimental',
        exceptionsText: 'None',
        compatibleList: allAirframes.map(a => a.id).join(', ')
      };
    }

    let summary = `${compatible.length} of ${allAirframes.length} Airframes`;
    let groupText = 'Specific compatible groups';
    let exceptionsText = 'Restricted';

    if (u.id === 'THRUST_VECTOR') {
      summary = 'Universal except Drones and COFFIN';
      groupText = 'Conventional crewed fighters (Stealth, Superiority, Multirole, Strike, EW, Experimental)';
      exceptionsText = 'Drones (UCAVs) and COFFIN capsules (aerodynamic and cockpit limits)';
    } else if (u.id === 'TITANIUM_COCKPIT') {
      summary = 'Universal except Drones and COFFIN';
      groupText = 'Physical crewed cockpits (Stealth, Superiority, Multirole, Strike, EW, Experimental)';
      exceptionsText = 'Autonomous drones and COFFIN synthetic vision capsules';
    } else if (u.id === 'ZOE_NEURAL_PROCESSOR') {
      summary = 'Drones and COFFIN airframes only';
      groupText = 'Autonomous Swarm Drones and COFFIN Synthetic Vision airframes';
      exceptionsText = 'Conventional crewed aircraft';
    } else if (u.id === 'COFFIN_OPTICAL_BUS') {
      summary = 'Experimental, COFFIN, and Drones only';
      groupText = 'Technology demonstrators, COFFIN conversions, and autonomous drones';
      exceptionsText = 'Standard production fighters (Stealth, Superiority, Multirole, Strike, EW)';
    } else if (u.id === 'SWARM_AI_COPROCESSOR') {
      summary = 'Drones only (UCAVs)';
      groupText = 'Autonomous Swarm Drones and UCAVs';
      exceptionsText = 'All crewed airframes (Universal except drones)';
    }

    return {
      summary,
      groupText,
      exceptionsText,
      compatibleList: compatible.map(a => a.id).join(', ')
    };
  }

  static renderUpgrade(u) {
    if (!u) return '<div class="inspect-desc-box">NO UPGRADE DATA AVAILABLE</div>';

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rCost = rate('cost_upgrade', u.cost || 1.0);
    const rMass = rate('component_mass', u.mass || 50);

    const allAirframes = Object.values(window.AIRCRAFT_CATALOG || {});
    const compat = this.getUpgradeCompatibility(u, allAirframes);
    const isUniversal = !u.isAllowed || allAirframes.every(s => u.isAllowed(s));

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge">${u.category || 'AVIONICS'}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${Number(u.cost || 0).toFixed(1)}M</span>
      </div>

      ${SpecsModalRenderer.getLegendHtml()}

      <div class="inspect-sec-head">1. SUBSYSTEM INTEGRATION &amp; WEIGHT IMPACT</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>SUBSYSTEM DISCIPLINE:</span><b>${u.category || 'AVIONICS'} Enhancement Core</b></div>
        <div class="inspect-stat-item"><span>COMPONENT MASS:</span><b class="${rMass.colorClass}">+${u.mass || 50} kg</b></div>
        <div class="inspect-stat-item"><span>SOCKET OCCUPANCY:</span><b>1 Modular Component Socket</b></div>
        <div class="inspect-stat-item"><span>AIRFRAME COMPATIBILITY:</span><b style="color:${isUniversal ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)'};">${compat.summary}</b></div>
      </div>

      <div class="inspect-sec-head">2. COMPATIBLE AIRFRAMES &amp; INTEGRATION REQUIREMENTS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>COMPATIBILITY ENVELOPE:</span><b style="color:${isUniversal ? 'var(--stat-tier-2)' : 'var(--stat-tier-3)'};">${compat.summary}</b></div>
        <div class="inspect-stat-item"><span>COMPATIBLE GROUPS:</span><b style="color:var(--color-ice-highlight);">${compat.groupText}</b></div>
        <div class="inspect-stat-item"><span>EXCEPTIONS:</span><b style="color:${isUniversal ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'};">${compat.exceptionsText}</b></div>
        <div class="inspect-stat-item" style="flex-direction:column;align-items:flex-start;gap:4px;">
          <span>COMPATIBLE AIRFRAMES:</span>
          <b style="color:#fef08a;font-size:0.62rem;line-height:1.45;text-align:left;font-family:var(--font-dotdigital);">${compat.compatibleList}</b>
        </div>
      </div>

      <div class="inspect-sec-head">3. FUNCTIONAL BENEFIT</div>
      <div class="inspect-desc-box">
        <div style="color:#f8fafc;">${u.desc || ''}</div>
      </div>

      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel-upg">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderLeadBuffs(spec) {
    return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderLeadBuffs(spec) : '';
  }

  static renderCivilian(c) {
    return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderCivilian(c) : '';
  }

  static renderSurfaceUnit(s) {
    return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderSurfaceUnit(s) : '';
  }
}

window.SpecsSubsystemViews = SpecsSubsystemViews;