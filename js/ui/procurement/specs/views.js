/**
 * js/ui/procurement/specs/views.js - Specification dossier modal views for weapons, pods, cannons, and upgrades.
 */

class SpecsSubsystemViews {
  static renderWeapon(w) {
    if (!w) return '<div class="inspect-desc-box">NO WEAPON DATA AVAILABLE</div>';
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const rate = window.StatEvaluator.rate;

    const rRange = rate('missile_range', w.rangeKm || 20.0);
    const rMin = rate('min_arming', w.minRangeKm || 1.0);
    const rSpd = rate('missile_speed', w.speedMach || 1.0);
    const rDmg = rate('missile_damage', w.damage || 2);
    const rAmmo = rate('ammo_count', w.ammoCount || 4);
    const rMass = rate('ordnance_mass', w.mass || 100);
    const rCost = rate('cost_weapon', w.cost || 1.0);
    const category = w.category;

    let seekerText = w.seeker || 'GUIDED';
    if (w.grantsESM) seekerText = 'Wideband Passive ELINT / ESM Emitter Receiver';
    else if (w.grantsIRST && w.a2gPkBonus <= 0) seekerText = 'Long-Wave Passive Infrared Search & Track (IRST)';
    else if (w.isTargetingPod) seekerText = 'Electro-Optical FLIR + Laser Designator';
    else if (w.isJammerPod) seekerText = 'Broadband Microwave ECM';
    else if (w.isDecoy) seekerText = 'Fiber-Optic / DRFM RF Decoy';
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
    if (w.grantsESM) counterHint = 'EMCON radar shutdowns or silent passive optical SHORAD';
    else if (w.isTargetingPod) counterHint = 'Passive optical sensor: undetectable emission; heavy cloud cells soften laser range';
    else if (w.isJammerPod) counterHint = 'Anti-Radiation Missiles (HOJ tracking) or IR/Optical seekers';
    else if (w.isDecoy || w.isDecoyDrone) counterHint = 'Optical seekers, visual identification, or CIWS';
    else if (w.isLaser) counterHint = 'Weather Clouds scatter beam or maintain standoff beyond 9 km';
    else if (w.isGunpod) counterHint = 'Low-altitude AAA and standoff separation beyond 6 km';
    else if (w.seeker === 'ARH') counterHint = 'Beam 90 deg (Doppler Notch), deploy Chaff or ECM pods';
    else if (w.seeker === 'IIR' || w.seeker === 'EO') counterHint = 'Cut throttle to Idle or dive into clouds';
    else if (w.seeker === 'LASER') counterHint = 'Thick clouds scatter laser spot; mitigated by Targeting Pods';
    else if (w.seeker === 'PASSIVE_RADAR') counterHint = w.antiEmcon ? 'CIWS point defense (retains memory through EMCON shutdown)' : 'Enter EMCON radar shutdown to break seeker lock';
    else if (w.seeker === 'GPS_INS' || w.seeker === 'UNGUIDED') counterHint = 'CIWS / SeaRAM / Tor-M2 point defense interception';

    const traitLabel = w.traitBadge;
    const primaryDesc = w.behaviorDesc || w.desc;
    const subDesc = (w.desc && w.desc !== w.behaviorDesc) ? w.desc : '';
    const airframesText = (w.allowedAirframes && w.allowedAirframes.length > 0)
      ? w.allowedAirframes.join(', ')
      : 'All certified aircraft with sufficient pylon rating';

    let podOrWeaponStatsHtml = '';
    if (w.isTargetingPod) {
      podOrWeaponStatsHtml = `
        <div class="inspect-stat-item"><span>SENSOR / RECON RANGE:</span><b class="stat-tier-1">${w.spotRangeKm} km ${w.exposesDecoys ? '(Exposes Ground Decoys)' : ''}</b></div>
        <div class="inspect-stat-item"><span>A2G PRECISION BUFF:</span><b class="stat-tier-2">+${Math.round(w.a2gPkBonus * 100)}% Pk</b></div>
        <div class="inspect-stat-item"><span>CLOUD SCATTER MITIGATION:</span><b class="stat-tier-2">${Math.round(w.cloudMitigation * 100)}%</b></div>
        ${w.grantsIRST ? '<div class="inspect-stat-item"><span>AIR-TO-AIR IRST:</span><b class="stat-tier-1">ACTIVE (28km Stealth Burn-Through)</b></div>' : ''}
        ${w.grantsESM ? `<div class="inspect-stat-item"><span>SEAD ARM RANGE BOOST:</span><b class="stat-tier-1">+${Math.round((w.armRangeBoost - 1) * 100)}% ARM Reach</b></div>` : ''}
      `;
    } else if (w.isJammerPod) {
      podOrWeaponStatsHtml = `
        <div class="inspect-stat-item"><span>JAMMING UMBRELLA:</span><b class="stat-tier-1">${w.rangeKm} km</b></div>
        <div class="inspect-stat-item"><span>RADAR SUPPRESSION:</span><b class="stat-tier-2">-${Math.round(w.jamEfficiency * 100)}% Detection Reach</b></div>
      `;
    } else if (w.isDecoy || w.isDecoyDrone) {
      podOrWeaponStatsHtml = `
        <div class="inspect-stat-item"><span>DEPLOYMENT REACH:</span><b class="stat-tier-1">${w.isDecoyDrone ? `${w.rangeKm} km Autonomous Profile` : 'Towed / Expendable Self-Defense'}</b></div>
        <div class="inspect-stat-item"><span>DISPENSER CAPACITY:</span><b class="${rAmmo.colorClass}">${w.ammoCount} Charges</b></div>
      `;
    } else {
      podOrWeaponStatsHtml = `
        <div class="inspect-stat-item"><span>MAX ENGAGEMENT RANGE:</span><b class="${rRange.colorClass}">${w.rangeKm} km</b></div>
        <div class="inspect-stat-item"><span>MIN ARMING DISTANCE:</span><b class="${rMin.colorClass}">${w.minRangeKm || 0.8} km</b></div>
        <div class="inspect-stat-item"><span>CRUISE &amp; TERMINAL VELOCITY:</span><b class="${rSpd.colorClass}">Mach ${w.speedMach}</b></div>
        <div class="inspect-stat-item"><span>WARHEAD DAMAGE:</span><b class="${rDmg.colorClass}">${w.damage} HP${w.isBunkerCracker ? ' (Bunker Penetrator)' : ''}${w.isAntiRunway ? ' (2x vs Runways)' : ''}</b></div>
        <div class="inspect-stat-item"><span>MAGAZINE CAPACITY:</span><b class="${rAmmo.colorClass}">${w.ammoCount} Rounds</b></div>
      `;
    }

    const specialDetailHtml = window.BehaviorCodex.renderSpecsDetailHtml('weapon', w);
    const kpiRange = w.isTargetingPod ? `${w.spotRangeKm} km` : `${w.rangeKm || 0} km`;
    const kpiSpeed = w.isTargetingPod ? `+${Math.round(w.a2gPkBonus * 100)}% Pk` : (w.isJammerPod ? `-${Math.round(w.jamEfficiency * 100)}%` : `M ${w.speedMach || 0}`);
    const kpiDmg   = (w.isTargetingPod || w.isJammerPod || w.isDecoy || w.isDecoyDrone) ? (w.seeker || 'SUPPORT') : `${w.damage} HP`;

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge badge-cat-${category.toLowerCase()}">${category}</span>
        <span class="inspect-badge propulsion">${traitLabel || 'ORDNANCE'}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${w.cost.toFixed(1)}M</span>
      </div>
      <div class="inspect-kpi-strip">
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">${w.isTargetingPod ? 'RECON REACH' : 'MAX RANGE'}</span><b class="inspect-kpi-val ${rRange.colorClass}">${kpiRange}</b><span class="inspect-kpi-sub">Min ${w.minRangeKm || 0.8} km</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">${w.isTargetingPod ? 'PRECISION BUFF' : (w.isJammerPod ? 'SUPPRESSION' : 'VELOCITY')}</span><b class="inspect-kpi-val ${rSpd.colorClass}">${kpiSpeed}</b><span class="inspect-kpi-sub">${w.seeker || 'GUIDED'}</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">${(w.isTargetingPod || w.isJammerPod || w.isDecoy || w.isDecoyDrone) ? 'ROLE' : 'WARHEAD'}</span><b class="inspect-kpi-val ${rDmg.colorClass}">${kpiDmg}</b><span class="inspect-kpi-sub">${w.ammoCount || 1}x Capacity</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">MOUNT MASS</span><b class="inspect-kpi-val ${rMass.colorClass}">+${w.mass} kg</b><span class="inspect-kpi-sub">${w.slotCost || 1} Pylon Slot(s)</span></div>
      </div>
      ${specialDetailHtml}
      ${SpecsModalRenderer.getLegendHtml()}
      <div class="inspect-sec-head">1. ENGAGEMENT BASKET &amp; KINEMATICS</div>
      <div class="inspect-stat-grid">
        ${podOrWeaponStatsHtml}
        <div class="inspect-stat-item"><span>MOUNT MASS:</span><b class="${rMass.colorClass}">+${w.mass} kg</b></div>
      </div>
      ${w.isCluster ? `<div class="inspect-detail-list"><div class="inspect-detail-row"><span>CLUSTER SPLASH RADIUS:</span><b class="stat-tier-1">${w.clusterRadiusKm} km (${w.clusterDamage} HP AOE)</b></div></div>` : ''}
      <div class="inspect-sec-head">2. GUIDANCE, TRAITS &amp; DEFENSES</div>
      <div class="inspect-detail-list">
        <div class="inspect-detail-row"><span>GUIDANCE &amp; SEEKER HEAD:</span><b style="color:var(--color-cyan);">${seekerText}</b></div>
        <div class="inspect-detail-row"><span>SPECIAL TRAIT:</span><b style="color:var(--color-amber);">[${traitLabel}]</b></div>
        <div class="inspect-detail-row"><span>COMPATIBLE AIRFRAMES:</span><b style="color:#fef08a;font-size:0.62rem;">${airframesText}</b></div>
        <div class="inspect-detail-row"><span>COUNTER / LIMITATION:</span><b style="color:#7dd3fc;font-size:0.64rem;">${counterHint}</b></div>
      </div>
      <div class="inspect-sec-head">3. OPERATIONAL PROFILE</div>
      <div class="inspect-desc-box">
        <p>${primaryDesc}</p>
        ${subDesc ? `<p class="inspect-desc-sub">${subDesc}</p>` : ''}
      </div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderGun(g) {
    if (!g) return '<div class="inspect-desc-box">NO GUN DATA AVAILABLE</div>';
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const rate = window.StatEvaluator.rate;
    const rRpm = rate('gun_rpm', g.rpm);
    const rDps = rate('gun_dps', g.damagePerSec);
    const rMass = rate('ordnance_mass', g.mass);
    const specialDetailHtml = window.BehaviorCodex.renderSpecsDetailHtml('gun', g);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge propulsion">${g.caliber}</span>
        <span class="inspect-cost-tag">BUILT-IN AUTOCANNON</span>
      </div>
      <div class="inspect-kpi-strip">
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">FIRE RATE</span><b class="inspect-kpi-val ${rRpm.colorClass}">${g.rpm} RPM</b><span class="inspect-kpi-sub">${g.burstCooldown.toFixed(1)}s Reload</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">BURST DPS</span><b class="inspect-kpi-val ${rDps.colorClass}">${g.damagePerSec.toFixed(1)} HP/s</b><span class="inspect-kpi-sub">${g.damagePerBurst.toFixed(2)} HP/Burst</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">MERGE REACH</span><b class="inspect-kpi-val">${g.rangeKm} km</b><span class="inspect-kpi-sub">${g.coneAngleDeg} deg Cone</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">MAGAZINE</span><b class="inspect-kpi-val stat-tier-1">${g.defaultAmmo} RDS</b><span class="inspect-kpi-sub">+${g.mass} kg Weight</span></div>
      </div>
      ${specialDetailHtml}
      ${SpecsModalRenderer.getLegendHtml()}
      <div class="inspect-sec-head">1. BALLISTIC SPECIFICATIONS</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>CYCLIC FIRE RATE:</span><b class="${rRpm.colorClass}">${g.rpm} RPM</b></div>
        <div class="inspect-stat-item"><span>SUSTAINED BURST DPS:</span><b class="${rDps.colorClass}">${g.damagePerSec.toFixed(1)} HP/s</b></div>
        <div class="inspect-stat-item"><span>BURST RELOAD:</span><b style="color:var(--color-amber);">${g.burstCooldown.toFixed(1)}s Reload Cycle</b></div>
        <div class="inspect-stat-item"><span>MERGE RANGE:</span><b>${g.rangeKm} km (${g.coneAngleDeg} deg Cone)</b></div>
        <div class="inspect-stat-item"><span>AMMO CAPACITY:</span><b class="stat-tier-1">${g.defaultAmmo} Rounds</b></div>
        <div class="inspect-stat-item"><span>MECHANISM WEIGHT:</span><b class="${rMass.colorClass}">+${g.mass} kg</b></div>
        <div class="inspect-stat-item"><span>SPRINT SPEED PENALTY:</span><b class="${g.speedPenalty > 0 ? 'stat-tier-4' : 'stat-tier-1'}">${g.speedPenalty > 0 ? `-${Math.round(g.speedPenalty * 100)}% Max Mach` : 'None (0%)'}</b></div>
        <div class="inspect-stat-item"><span>SIGNATURE / RCS PENALTY:</span><b class="${g.rcsPenalty > 0 ? 'stat-tier-5' : 'stat-tier-1'}">${g.rcsPenalty > 0 ? `+${Math.round(g.rcsPenalty * 100)}% Airframe RCS` : 'Flush Stealth (+0%)'}</b></div>
      </div>
      <div class="inspect-detail-list">
        <div class="inspect-detail-row"><span>BURST CONFIGURATION:</span><b style="color:var(--color-cyan);">${g.roundsPerBurst} Rounds per Burst (${g.damagePerRound.toFixed(2)} HP ea, ${g.damagePerBurst.toFixed(2)} HP total)</b></div>
      </div>
      <div class="inspect-sec-head">2. BALLISTIC OPERATION</div>
      <div class="inspect-desc-box"><div>${g.desc}</div></div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-equip-gun" onclick="if(window.Game&&window.Game.procurement){window.Game.procurement.equipItemDirectly({type:'gun',id:'${g.id}',name:'${g.name}'});const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();}">EQUIP TO ACTIVE AIRCRAFT</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderUpgrade(u) {
    if (!u) return '<div class="inspect-desc-box">NO UPGRADE DATA AVAILABLE</div>';
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const rate = window.StatEvaluator.rate;
    const rCost = rate('cost_upgrade', u.cost);
    const rMass = rate('component_mass', u.mass);
    const allAirframes = Object.values(window.AIRCRAFT_CATALOG);
    const compatible = !u.isAllowed ? allAirframes : allAirframes.filter(s => u.isAllowed(s));
    const specialDetailHtml = window.BehaviorCodex.renderSpecsDetailHtml('upgrade', u);

    return `
      <div class="inspect-type-banner">
        <span class="inspect-badge propulsion">${u.category}</span>
        <span class="inspect-cost-tag ${rCost.colorClass}">$${u.cost.toFixed(1)}M</span>
      </div>
      <div class="inspect-kpi-strip">
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">DISCIPLINE</span><b class="inspect-kpi-val">${u.category}</b><span class="inspect-kpi-sub">Enhancement Core</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">COMPONENT MASS</span><b class="inspect-kpi-val ${rMass.colorClass}">+${u.mass} kg</b><span class="inspect-kpi-sub">Socket Module</span></div>
        <div class="inspect-kpi-card"><span class="inspect-kpi-label">COMPATIBILITY</span><b class="inspect-kpi-val stat-tier-1">${compatible.length === allAirframes.length ? 'UNIVERSAL' : compatible.length + ' FRAMES'}</b><span class="inspect-kpi-sub">Certified Fleet</span></div>
      </div>
      ${specialDetailHtml}
      ${SpecsModalRenderer.getLegendHtml()}
      <div class="inspect-sec-head">1. SUBSYSTEM INTEGRATION &amp; WEIGHT IMPACT</div>
      <div class="inspect-stat-grid">
        <div class="inspect-stat-item"><span>SUBSYSTEM DISCIPLINE:</span><b>${u.category} Enhancement Core</b></div>
        <div class="inspect-stat-item"><span>COMPONENT MASS:</span><b class="${rMass.colorClass}">+${u.mass} kg</b></div>
      </div>
      <div class="inspect-detail-list">
        <div class="inspect-detail-row"><span>COMPATIBLE AIRFRAMES:</span><b style="color:#fef08a;font-size:0.62rem;">${compatible.length === allAirframes.length ? 'Universal (All Airframes)' : compatible.map(a => a.id).join(', ')}</b></div>
      </div>
      <div class="inspect-sec-head">2. FUNCTIONAL BENEFIT</div>
      <div class="inspect-desc-box"><div>${u.desc}</div></div>
      <div class="inspect-action-bar">
        <button type="button" class="inspect-action-btn select-btn" id="inspect-btn-sel-upg">SELECT TO EQUIP</button>
        <button type="button" class="inspect-action-btn close-btn" onclick="const m=document.getElementById('system-inspect-modal');if(m)m.classList.remove('active');if(window.Game&&window.Game.controls)window.Game.controls.autoUnpauseOnDialogClose();">CLOSE</button>
      </div>
    `;
  }

  static renderLeadBuffs(spec) { return SpecsFacilitiesViews.renderLeadBuffs(spec); }
  static renderCivilian(c) { return SpecsFacilitiesViews.renderCivilian(c); }
  static renderSurfaceUnit(s) { return SpecsFacilitiesViews.renderSurfaceUnit(s); }
}

window.SpecsSubsystemViews = SpecsSubsystemViews;
