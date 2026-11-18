/**
 * AIRSPACE STANDOFF: Specifications Subsystem Dossier Views Module
 */

class SpecsSubsystemViews {
  static renderWeapon(w) {
    if (!w) return '<div class="inspect-desc-box">NO WEAPON DATA AVAILABLE</div>';
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rRange = rate('missile_range', w.rangeKm || 20.0);
    const rMin = rate('min_arming', w.minRangeKm || 1.0);
    const rSpd = rate('missile_speed', w.speedMach || 1.0);
    const rDmg = rate('missile_damage', w.damage || 2);
    const rAmmo = rate('ammo_count', w.ammoCount || 4);
    const rMass = rate('ordnance_mass', w.mass || 100);
    const rCost = rate('cost_weapon', w.cost || 1.0);

    const category = w.category || 'WEAPON';

    let seekerText = w.seeker || 'GUIDED';
    if (w.isTargetingPod) seekerText = 'Electro-Optical FLIR + Laser Designator';
    else if (w.isJammerPod) seekerText = 'Broadband Microwave ECM';
    else if (w.isDecoy) seekerText = 'Fiber-Optic RF Decoy';
    else if (w.isDecoyDrone) seekerText = 'Autonomous Radar Mirror';
    else if (w.isLaser) seekerText = 'Directed Energy Thermal Beam';
    else if (w.isGunpod) seekerText = 'Direct-Fire Gunpod';
    else if (w.seeker === 'INS') seekerText = 'INS (Inertial Navigation & Terminal Radar)';
    else if (w.seeker === 'GPS_INS') seekerText = 'GPS / INS (Satellite Assisted Inertial)';
    else if (w.seeker === 'ARH') seekerText = 'ARH (Active Radar Homing)';
    else if (w.seeker === 'IIR') seekerText = 'IIR (Imaging Infrared)';
    else if (w.seeker === 'EO') seekerText = 'EO (Electro-Optical Matrix)';
    else if (w.seeker === 'OPT') seekerText = 'OPT (Optical Swarm Tracker)';
    else if (w.seeker === 'LASER') seekerText = 'SALH (Semi-Active Laser Homing)';
    else if (w.seeker === 'MMW') seekerText = 'MMW (Millimeter-Wave All-Weather Radar)';
    else if (w.seeker === 'MMW_IIR') seekerText = 'Tri-Mode MMW + IIR + Laser Seeker';
    else if (w.seeker === 'UNGUIDED') seekerText = 'Ballistic / CCIP Unguided (Immune to ECM)';
    else if (w.seeker === 'PASSIVE_RADAR') seekerText = w.antiEmcon ? 'Passive RF + MMW Anti-EMCON Memory' : 'Passive Radar (Anti-Radiation)';

    let counterHint = 'High-G break turns or countermeasures';
    if (w.isTargetingPod) counterHint = 'Passive optical sensor: undetectable emission; heavy cloud cells soften laser range';
    else if (w.isJammerPod) counterHint = 'Anti-Radiation Missiles (HOJ tracking) or IR/Optical seekers';
    else if (w.isDecoy || w.isDecoyDrone) counterHint = 'Optical seekers, visual identification, or CIWS';
    else if (w.isLaser) counterHint = 'Weather Clouds scatter beam or maintain standoff beyond 9 km';
    else if (w.isGunpod) counterHint = 'Low-altitude AAA and standoff separation beyond 6 km';
    else if (w.seeker === 'ARH') counterHint = 'Beam 90 deg (Doppler Notch), deploy Chaff or ECM pods';
    else if (w.seeker === 'IIR' || w.seeker === 'EO') counterHint = 'Cut throttle to Idle or dive into clouds';
    else if (w.seeker === 'LASER') counterHint = 'Thick clouds scatter laser spot; mitigated by Targeting Pods';
    else if (w.seeker === 'PASSIVE_RADAR') counterHint = w.antiEmcon ? 'CIWS point defense (retains memory through EMCON shutdown!)' : 'Enter EMCON radar shutdown to break seeker lock';
    else if (w.seeker === 'GPS_INS' || w.seeker === 'UNGUIDED') counterHint = 'CIWS / SeaRAM / Tor-M2 point defense interception';

    const traitLabel = w.traitBadge || 'STANDARD';
    const primaryDesc = w.behaviorDesc || w.desc || 'Precision-guided aerospace munition.';
    const subDesc = (w.desc && w.desc !== w.behaviorDesc) ? w.desc : '';
    const airframesText = (w.allowedAirframes && w.allowedAirframes.length > 0)
      ? w.allowedAirframes.join(', ')
      : 'All certified aircraft with sufficient pylon rating';

    const tgpSpecsHtml = w.isTargetingPod ? `
      <div class="inspect-stat-item"><span>OPTICAL RECON SPOT RANGE:</span><b class="stat-tier-1">${w.spotRangeKm || 40} km (Exposes Ground Decoys)</b></div>
      <div class="inspect-stat-item"><span>A2G PRECISION ACCURACY BUFF:</span><b class="stat-tier-2">+${Math.round((w.a2gPkBonus || 0.18) * 100)}% Pk</b></div>
      <div class="inspect-stat-item"><span>CLOUD SCATTER MITIGATION:</span><b class="stat-tier-2">${Math.round((w.cloudMitigation || 0.25) * 100)}%</b></div>
    ` : `
      <div class="inspect-stat-item"><span>MAX ENGAGEMENT RANGE:</span><b class="${rRange.colorClass}">${w.rangeKm || 0} km</b></div>
      <div class="inspect-stat-item"><span>MIN ARMING DISTANCE:</span><b class="${rMin.colorClass}">${w.minRangeKm || 0.8} km</b></div>
      <div class="inspect-stat-item"><span>CRUISE &amp; TERMINAL VELOCITY:</span><b class="${rSpd.colorClass}">Mach ${w.speedMach || '1.0'}</b></div>
      <div class="inspect-stat-item"><span>WARHEAD DAMAGE:</span><b class="${rDmg.colorClass}">${w.damage || 0} HP${w.isBunkerCracker ? ' (Bunker Penetrator)' : ''}</b></div>
      <div class="inspect-stat-item"><span>MAGAZINE CAPACITY:</span><b class="${rAmmo.colorClass}">${w.ammoCount !== undefined ? w.ammoCount : 4} Rounds</b></div>
    `;

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge badge-cat-${category.toLowerCase()}">${category}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${Number(w.cost || 0).toFixed(1)}M</span>
      </div>
      ${SpecsModalRenderer.getLegendHtml()}
      <div class="inspect-sec-head">1. ENGAGEMENT BASKET &amp; KINEMATICS</div>
      <div class="inspect-stat-grid">
        ${tgpSpecsHtml}
        <div class="inspect-stat-item"><span>MOUNT MASS:</span><b class="${rMass.colorClass}">+${w.mass || 100} kg</b></div>
        ${w.isCluster ? `<div class="inspect-stat-item"><span>CLUSTER SPLASH RADIUS:</span><b class="stat-tier-1">${w.clusterRadiusKm} km (${w.clusterDamage} HP AOE)</b></div>` : ''}
      </div>
      <div class="inspect-sec-head">2. GUIDANCE, TRAITS &amp; DEFENSES</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>GUIDANCE &amp; SEEKER HEAD:</span><b style="color:#00f0ff;">${seekerText}</b></div>
        <div class="inspect-stat-item"><span>SPECIAL TRAIT:</span><b style="color:#ffd700;">[${traitLabel}]</b></div>
        <div class="inspect-stat-item"><span>COMPATIBLE AIRFRAMES:</span><b style="color:#fef08a;text-align:right;font-size:0.62rem;">${airframesText}</b></div>
        <div class="inspect-stat-item"><span>COUNTER / LIMITATION:</span><b style="color:#7dd3fc;text-align:right;font-size:0.64rem;">${counterHint}</b></div>
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
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rRpm = rate('gun_rpm', g.rpm || 3000);
    const rDps = rate('gun_dps', g.damagePerSec || 2.5);
    const rMass = rate('ordnance_mass', g.mass || 100);
    const coneDeg = g.coneAngleDeg || 45;
    const roundsInBurst = g.roundsPerBurst || 4;
    const perRoundDmg = (g.damagePerRound || ((g.damagePerBurst || 1.4) / roundsInBurst)).toFixed(2);
    const totalBurstDmg = (g.damagePerBurst || 1.40).toFixed(2);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge">${g.caliber || 'Direct Fire'}</span>
        <span class="inspect-cost-tag">BUILT-IN AUTOCANNON</span>
      </div>
      ${SpecsModalRenderer.getLegendHtml()}
      <div class="inspect-sec-head">1. BALLISTIC SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>CYCLIC FIRE RATE:</span><b class="${rRpm.colorClass}">${g.rpm || 3000} RPM</b></div>
        <div class="inspect-stat-item"><span>SUSTAINED BURST DPS:</span><b class="${rDps.colorClass}">${(g.damagePerSec || 2.5).toFixed(1)} HP/s</b></div>
        <div class="inspect-stat-item"><span>BURST CONFIGURATION:</span><b style="color:#00f0ff;">${roundsInBurst} Rounds per Burst (${perRoundDmg} HP ea, ${totalBurstDmg} HP total)</b></div>
        <div class="inspect-stat-item"><span>BURST RELOAD:</span><b style="color:#ffb830;">${(g.burstCooldown || 1.6).toFixed(1)}s Reload Cycle</b></div>
        <div class="inspect-stat-item"><span>EFFECTIVE MERGE RANGE:</span><b>${g.rangeKm || 4.8} km (${coneDeg} deg Cone)</b></div>
        <div class="inspect-stat-item"><span>AMMUNITION CAPACITY:</span><b class="stat-tier-1">${g.defaultAmmo || 500} Rounds</b></div>
        <div class="inspect-stat-item"><span>MECHANISM WEIGHT:</span><b class="${rMass.colorClass}">+${g.mass || 100} kg</b></div>
      </div>
      <div class="inspect-sec-head">2. BALLISTIC OPERATION</div>
      <div class="inspect-desc-box"><div style="color:#f8fafc;">${g.desc || ''}</div></div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-equip-gun" onclick="if(window.Game&&window.Game.procurement){window.Game.procurement.equipItemDirectly({type:'gun',id:'${g.id}',name:'${g.name}'});const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();}">EQUIP TO ACTIVE AIRCRAFT</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderUpgrade(u) {
    if (!u) return '<div class="inspect-desc-box">NO UPGRADE DATA AVAILABLE</div>';
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });
    const rCost = rate('cost_upgrade', u.cost || 1.0);
    const rMass = rate('component_mass', u.mass || 50);
    const allAirframes = Object.values(window.AIRCRAFT_CATALOG || {});
    const compatible = !u.isAllowed ? allAirframes : allAirframes.filter(s => u.isAllowed(s));

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
        <div class="inspect-stat-item"><span>COMPATIBLE AIRFRAMES:</span><b style="color:#fef08a;font-size:0.62rem;">${compatible.length === allAirframes.length ? 'Universal (All Airframes)' : compatible.map(a => a.id).join(', ')}</b></div>
      </div>
      <div class="inspect-sec-head">2. FUNCTIONAL BENEFIT</div>
      <div class="inspect-desc-box"><div style="color:#f8fafc;">${u.desc || ''}</div></div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel-upg">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderLeadBuffs(spec) { return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderLeadBuffs(spec) : ''; }
  static renderCivilian(c) { return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderCivilian(c) : ''; }
  static renderSurfaceUnit(s) { return (typeof SpecsFacilitiesViews !== 'undefined') ? SpecsFacilitiesViews.renderSurfaceUnit(s) : ''; }
}

window.SpecsSubsystemViews = SpecsSubsystemViews;
