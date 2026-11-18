/**
 * AIRSPACE STANDOFF: Surface Installation Defenses & Air-to-Ground Strike Solutions
 */

class InspectionSurfaceWeaponsRenderer {
  static calcGroundArmorDamage(weapon, target) {
    const baseDmg = weapon.damage || 2;
    const armMult = (weapon.trait === 'EMITTER_KILLER' && target.isEmitter) ? (target.emconTimer > 0 ? 1.5 : 3.0) : 1.0;
    const apRating = weapon.armorPiercing || 0;
    let armorMult = 1.0;
    if (weapon.isAntiRunway && target.isAirbaseRunway) armorMult = 2.0;
    else if (target.armorClass === 'FORTIFIED') armorMult = weapon.isBunkerCracker ? 1.0 : (apRating >= 0.65 ? 0.50 : 0.20);
    else if (target.armorClass === 'ARMORED') armorMult = (weapon.isBunkerCracker || apRating >= 0.70 || weapon.isAntiRadiation || (weapon.category === 'A2G' && !weapon.isCluster)) ? 1.0 : 0.65;
    return { effectiveDmg: Math.max(0.1, baseDmg * armMult * armorMult), armorMult, armMult };
  }

  static evaluateCiwsRisk(weapon, target, game) {
    if (!weapon || !target || !game || !Array.isArray(game.surfaceUnits)) return { turrets: [], maxChance: 0, immuneReason: '' };
    if (weapon.isGunpod || weapon.isLaser || weapon.category === 'GUN') return { turrets: [], maxChance: 0, immuneReason: 'Direct fire unaffected by CIWS' };
    if (weapon.speedMach >= 5.0) return { turrets: [], maxChance: 0, immuneReason: `Mach ${weapon.speedMach.toFixed(1)} hypersonic speed immune to CIWS` };

    const turrets = [];
    for (const u of game.surfaceUnits) {
      if (!u || u.team !== target.team || u.hp <= 0.05 || !u.canInterceptMissiles || u.emconTimer > 0) continue;
      const dome = (u.category === 'CIWS') ? Math.min(u.rangeKm, 7.5) : Math.min(u.rangeKm, 9.5);
      if (Math.hypot(u.x - target.x, u.y - target.y) <= dome) {
        const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(u) : { ciwsAccuracy: u.interceptAccuracy };
        let prob = mods.ciwsAccuracy;
        if (weapon.speedMach >= 2.6) prob *= 0.45;
        if (weapon.isStealthMissile) prob *= 0.55;
        turrets.push({ unit: u, domeKm: dome, chance: prob });
      }
    }
    const maxChance = turrets.reduce((m, t) => Math.max(m, t.chance), 0);
    return { turrets, maxChance, immuneReason: '' };
  }

  static renderAirToGroundCard(controller, firingAircraft, target, item, idx, clouds, theaterW) {
    const w = item.weapon;
    const dist = Math.hypot(target.x - firingAircraft.x, target.y - firingAircraft.y);
    const effRange = w.rangeKm * (w.isAntiRadiation ? firingAircraft.armRangeMult : ((w.seeker === 'UNGUIDED' || w.isRocketPod) ? firingAircraft.bombRangeBonus : 1.0));
    const pkRes = Physics.calcPk(w, firingAircraft, target, clouds);
    const pk = pkRes.pk || 0;
    const inRange = (dist <= effRange && dist >= (w.minRangeKm || 0.8));
    const isValid = inRange && pk > 0;
    const dmgInfo = this.calcGroundArmorDamage(w, target);
    const ciwsInfo = this.evaluateCiwsRisk(w, target, controller.game);

    const cloudHits = Physics.countIntersectingClouds(firingAircraft.x, firingAircraft.y, target.x, target.y, clouds);
    const jamImpact = (w.seeker !== 'UNGUIDED') ? Physics.getGroundJammingImpact(target, firingAircraft) : 0;
    const tgpBonus = (firingAircraft.targetingPodBonus || 0) + (firingAircraft.hasIRST && !firingAircraft.targetingPodBonus ? 0.08 : 0);
    const ccipAdd = (w.seeker === 'UNGUIDED' || w.isCluster || w.isRocketPod) ? firingAircraft.ccipBonus : 0;
    const armAdd = w.isAntiRadiation ? firingAircraft.armPkBonus : 0;
    const mitlAdd = (w.seeker === 'GPS_INS' || w.seeker === 'IIR' || w.seeker === 'INS') ? firingAircraft.mitlBonus : 0;

    const pkClass = isValid ? (pk >= 70 ? 'positive' : (pk >= 45 ? 'warning' : 'negative')) : 'negative';
    const accordionId = `wpn-${w.id}-${idx}`;

    const factors = [
      { n: 'Base Weapon Guidance (T_0)', v: `${Math.round(w.T_0 * 100)}%`, t: 'neutral', d: `${w.seeker || 'UNGUIDED'} baseline release accuracy` },
      { n: `Armor Penetration (${target.armorClass})`, v: `${dmgInfo.effectiveDmg.toFixed(1)} HP (${dmgInfo.armorMult.toFixed(2)}x)`, t: dmgInfo.armorMult >= 1 ? 'positive' : 'negative', d: w.isAntiRunway && target.isAirbaseRunway ? 'Anti-runway 2.0x structural bonus' : (dmgInfo.armMult > 1 ? `ARM emitter bonus ${dmgInfo.armMult}x` : 'Target armor class scaling') },
      tgpBonus > 0 ? { n: 'Targeting Pod / Optical Lock', v: `+${Math.round(tgpBonus * 100)}% Pk`, t: 'positive', d: `Cloud scatter cut by ${Math.round(firingAircraft.cloudMitigation * 100)}%` } : null,
      ccipAdd > 0 ? { n: 'Digital CCIP Computer', v: `+${Math.round(ccipAdd * 100)}% Pk`, t: 'positive', d: 'Ballistic release boost (+15% reach)' } : null,
      armAdd > 0 ? { n: 'HTS HARM Targeting System', v: `+${Math.round(armAdd * 100)}% Pk`, t: 'positive', d: '+20% ARM reach & emitter ID' } : null,
      mitlAdd > 0 ? { n: 'Two-Way MITL Datalink', v: `+${Math.round(mitlAdd * 100)}% Pk`, t: 'positive', d: 'In-flight correction & -50% jamming impact' } : null,
      (w.seeker === 'LASER' && cloudHits > 0) ? { n: 'Cloud Laser Scattering', v: `-${Math.round(cloudHits * 20 * (1 - firingAircraft.cloudMitigation))}% Pk`, t: 'warning', d: `${cloudHits} cloud cell(s) in laser path` } : null,
      (w.seeker === 'UNGUIDED' && !w.isRocketPod && firingAircraft.altFt > 26000 && ccipAdd <= 0) ? { n: 'High-Altitude Dispersion (>FL260)', v: `-${tgpBonus > 0 ? 8 : 18}% Pk`, t: 'warning', d: 'Drop below 26,000 ft or equip CCIP' } : null,
      jamImpact > 0 ? { n: 'Ground Jamming Interference', v: `-${Math.round(10 * (1 - firingAircraft.eccmBonus))}% Pk`, t: 'warning', d: firingAircraft.eccmBonus > 0 ? 'Mitigated by ECCM / MITL' : 'Active ground ECM degrading guidance' } : null,
      w.isAntiRadiation ? { n: 'EMCON Radar Shutdown Risk', v: w.antiEmcon ? 'ANTI-EMCON MEMORY' : 'LOST ON EMCON', t: w.antiEmcon ? 'positive' : 'negative', d: w.antiEmcon ? 'Retains lock if radar shuts off' : 'Legacy ARM breaks lock on EMCON' } : null,
      ciwsInfo.turrets.length > 0 ? { n: `CIWS Point Defense (${ciwsInfo.turrets.length} Active)`, v: `${Math.round(ciwsInfo.maxChance * 100)}% INTERCEPT RISK`, t: 'negative', d: `Covered by ${ciwsInfo.turrets.map(t => t.unit.name).join(', ')}. Fire multi-bomb salvos.` } : { n: 'CIWS Point Defense', v: 'CLEAR', t: 'positive', d: ciwsInfo.immuneReason || 'No active CIWS interceptors covering target' }
    ].filter(Boolean);

    return `
      <details class="inspection-accordion" data-accordion-id="${accordionId}">
        <summary class="inspection-accordion-summary">
          <div class="inspection-accordion-title">
            <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
            <span class="sol-sub">Range: ${dist.toFixed(1)} / ${effRange.toFixed(0)} km &bull; ${w.seeker || 'GROUND'} &bull; Eff: ${dmgInfo.effectiveDmg.toFixed(1)} HP</span>
          </div>
          <div class="inspection-accordion-meta">
            <span class="factor-delta ${pkClass} sol-pk-badge">${isValid ? `${pk}% [${pkRes.label}]` : (dist < (w.minRangeKm || 0.8) ? 'TOO CLOSE' : 'OUT OF RANGE')}</span>
            <span class="inspection-accordion-chevron"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
          </div>
        </summary>
        <div class="inspection-accordion-body">
          <div class="inspection-range-track">
            <span class="inspection-range-fill ${isValid ? 'detecting' : ''}" style="width:${Math.min(100, (effRange / theaterW) * 100)}%;"></span>
            <i class="inspection-distance-marker" style="left:${Math.min(100, (dist / theaterW) * 100)}%;"></i>
          </div>
          <div class="inspection-factors-table" style="margin-top:6px;">
            ${factors.map(f => `<div class="inspection-factor-row ${f.t}"><span class="factor-name">${f.n}<span class="factor-desc">${f.d}</span></span><span class="factor-delta ${f.t}">${f.v}</span></div>`).join('')}
          </div>
        </div>
      </details>`;
  }

  static renderSurfaceDefenseSolutions(controller, s) {
    const game = controller.game;
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : { hasEwCue: false, hasLowAltCue: false, samCooldownMult: 1, ambushRatio: 1, ciwsAccuracy: s.interceptAccuracy, aaaHitBonus: 0 };
    const isAttack = (game.scenarioMode === 'ATTACK');

    if (!s.canAttack && !s.canInterceptMissiles && !s.isAaaGun) {
      return `
        <section class="inspection-card">
          <h3>INSTALLATION DEFENSES</h3>
          <p class="inspection-muted">Unarmed ${s.armorClass} facility (${s.category}). Relies on nearby SAM, CIWS, and AAA batteries for protection.</p>
        </section>`;
    }

    let effRange = s.rangeKm;
    if (s.requiresEwCue && isAttack && !mods.hasEwCue) effRange *= 0.48;
    const ambushKm = effRange * (isAttack ? mods.ambushRatio : 1.0);
    const activeFloor = mods.hasLowAltCue ? s.cuedMinAltFt : s.minAltFt;

    const opposingAc = (s.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft).filter(a => a && a.hp > 0.05);
    const airEvaluations = opposingAc.map(ac => {
      const dist = Math.hypot(ac.x - s.x, ac.y - s.y);
      const tfrBonus = (ac.hasTfrMasking && ac.altFt <= 10000) ? ac.tfrFloorBonusFt : 0;
      const effFloor = activeFloor + tfrBonus;
      const rcsFactor = Math.max(0.45, Math.min(1.15, Math.pow(Math.max(0.0005, ac.effectiveRcs), 0.16)));
      const lockGate = ambushKm * rcsFactor;
      const inSam = Boolean(s.canAttack && s.missileSpec && dist <= lockGate && ac.altFt >= effFloor);
      const inAaa = Boolean((s.isAaaGun || s.type === 'PANTSIR') && s.aaaRangeKm > 0 && dist <= s.aaaRangeKm && ac.altFt <= s.aaaMaxAltFt);

      let tag = 'CLEAR', cls = 'positive';
      if (s.emconTimer > 0) { tag = 'EMCON LOCKOUT'; cls = 'neutral'; }
      else if (inSam || inAaa) { tag = inAaa && inSam ? 'SAM + AAA ENGAGING' : (inSam ? 'IN SAM ENVELOPE' : 'IN AAA FLAK'); cls = 'negative'; }
      else if (ac.altFt < effFloor && dist <= lockGate) { tag = tfrBonus > 0 ? 'MASKED BY TFR' : 'BELOW SAM FLOOR'; cls = 'positive'; }

      return `
        <div class="inspection-factor-row ${cls}" data-surf-tgt="${ac.id}">
          <span class="factor-name">${controller.escape(controller.getName(ac))} (${dist.toFixed(1)} km, FL${Math.round(ac.altFt / 100)})<span class="factor-desc">Gate: ${lockGate.toFixed(1)} km | Floor: ${effFloor.toLocaleString()} ft${ac.aaaResistance > 0 ? ' | Kevlar Belly -45% AAA' : ''}</span></span>
          <span class="factor-delta ${cls} surf-tgt-badge">${tag}</span>
        </div>`;
    }).join('');

    let ciwsSection = '';
    if (s.canInterceptMissiles) {
      const pdRange = (s.category === 'CIWS') ? Math.min(s.rangeKm, 7.5) : Math.min(s.rangeKm, 9.5);
      const inboundMsls = (game.missiles || []).filter(m => m.active && m.team !== s.team && Math.hypot(m.x - s.x, m.y - s.y) <= pdRange * 2.5);
      ciwsSection = `
        <div class="inspection-factor-row info" style="margin-top:6px;">
          <span class="factor-name">CIWS / Point-Defense Dome (${pdRange} km)<span class="factor-desc">Base Intercept: ${Math.round(mods.ciwsAccuracy * 100)}% (45% vs M2.6+, 55% vs Stealth, 0% vs M5+ Hypersonic)</span></span>
          <span class="factor-delta info surf-pd-count">${inboundMsls.length} NEARBY MUNITIONS</span>
        </div>`;
    }

    return `
      <section class="inspection-card">
        <h3>BATTERY ARMAMENT &amp; THREAT ENVELOPE</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:6px; font:600 0.62rem var(--font-dotdigital);">
          <div>LAUNCHER: <b style="color:var(--theme-accent);">${s.missileSpec ? s.missileSpec.name : (s.isAaaGun ? 'AAA Flak Gun' : 'CIWS Turret')}</b></div>
          <div>AMBUSH GATE: <b style="color:var(--stat-tier-3);">${ambushKm.toFixed(1)} / ${effRange.toFixed(1)} km</b></div>
          <div>ACTIVE FLOOR: <b>${activeFloor.toLocaleString()} ft</b></div>
          <div>RELOAD TIMER: <b class="surf-wpn-cd">${s.fireCooldown > 0 ? `${s.fireCooldown.toFixed(1)}s` : 'READY'} (${(s.cooldownMax * mods.samCooldownMult).toFixed(1)}s cycle)</b></div>
          ${s.isAaaGun || s.type === 'PANTSIR' ? `<div>AAA FLAK: <b style="color:var(--stat-tier-4);">${s.aaaRangeKm} km (up to ${s.aaaMaxAltFt.toLocaleString()} ft)</b></div><div>AAA DMG: <b>${s.aaaDamage.toFixed(1)} HP</b></div>` : ''}
        </div>
        ${ciwsSection}
        <div class="inspection-factors-table surf-air-evals" style="margin-top:6px;">
          ${airEvaluations || '<span class="inspection-muted">No opposing aircraft in theater.</span>'}
        </div>
      </section>`;
  }

  static updateLiveSurfaceWeapons(controller, s, content) {
    const game = controller.game;
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : { hasEwCue: false, hasLowAltCue: false, samCooldownMult: 1, ambushRatio: 1 };
    const cdEl = content.querySelector('.surf-wpn-cd');
    if (cdEl) cdEl.textContent = `${s.fireCooldown > 0 ? `${s.fireCooldown.toFixed(1)}s` : 'READY'} (${(s.cooldownMax * mods.samCooldownMult).toFixed(1)}s cycle)`;

    let effRange = s.rangeKm;
    if (s.requiresEwCue && game.scenarioMode === 'ATTACK' && !mods.hasEwCue) effRange *= 0.48;
    const ambushKm = effRange * (game.scenarioMode === 'ATTACK' ? mods.ambushRatio : 1.0);
    const activeFloor = mods.hasLowAltCue ? s.cuedMinAltFt : s.minAltFt;

    const opposingAc = (s.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft).filter(a => a && a.hp > 0.05);
    opposingAc.forEach(ac => {
      const row = content.querySelector(`[data-surf-tgt="${ac.id}"]`);
      if (!row) return;
      const dist = Math.hypot(ac.x - s.x, ac.y - s.y);
      const tfrBonus = (ac.hasTfrMasking && ac.altFt <= 10000) ? ac.tfrFloorBonusFt : 0;
      const effFloor = activeFloor + tfrBonus;
      const rcsFactor = Math.max(0.45, Math.min(1.15, Math.pow(Math.max(0.0005, ac.effectiveRcs), 0.16)));
      const lockGate = ambushKm * rcsFactor;
      const inSam = Boolean(s.canAttack && s.missileSpec && dist <= lockGate && ac.altFt >= effFloor);
      const inAaa = Boolean((s.isAaaGun || s.type === 'PANTSIR') && s.aaaRangeKm > 0 && dist <= s.aaaRangeKm && ac.altFt <= s.aaaMaxAltFt);

      let tag = 'CLEAR', cls = 'positive';
      if (s.emconTimer > 0) { tag = 'EMCON LOCKOUT'; cls = 'neutral'; }
      else if (inSam || inAaa) { tag = inAaa && inSam ? 'SAM + AAA ENGAGING' : (inSam ? 'IN SAM ENVELOPE' : 'IN AAA FLAK'); cls = 'negative'; }
      else if (ac.altFt < effFloor && dist <= lockGate) { tag = tfrBonus > 0 ? 'MASKED BY TFR' : 'BELOW SAM FLOOR'; cls = 'positive'; }

      row.className = `inspection-factor-row ${cls}`;
      const badge = row.querySelector('.surf-tgt-badge');
      if (badge) { badge.className = `factor-delta ${cls} surf-tgt-badge`; badge.textContent = tag; }
    });
  }
}

window.InspectionSurfaceWeaponsRenderer = InspectionSurfaceWeaponsRenderer;
