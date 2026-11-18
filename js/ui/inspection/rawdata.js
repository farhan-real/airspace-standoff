/**
 * AIRSPACE STANDOFF: Raw Telemetry Data Tab Renderer
 */

class InspectionRawDataRenderer {
  static fmtNum(n, dec = 2) {
    return (typeof n === 'number' && Number.isFinite(n)) ? n.toFixed(dec) : 'N/A';
  }

  static render(controller, entity) {
    if (!entity) return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b></div>';
    if (controller.isSurface(entity)) return this.renderSurfaceRaw(controller, entity);
    if (controller.isMissile(entity)) return this.renderMissileRaw(controller, entity);
    return this.renderAirOrAuxRaw(controller, entity);
  }

  static renderAirOrAuxRaw(controller, entity) {
    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    const rate = StatEvaluator.rate;
    const isAircraft = controller.isAircraft(entity);
    const spec = entity.spec || {};
    let headingDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (headingDeg < 0) headingDeg += 360;

    const rSpd = rate('speed', entity.speed || 0.85);
    const rRcs = rate('rcs', entity.effectiveRcs || spec.sigma_0 || 1.0);
    const rHp = rate('hp', entity.hp || 4);

    let aeroSection = '';
    let strikeSection = '';
    if (isAircraft) {
      const sOpt = entity.getOptimalCornerSpeed();
      const turnEff = entity.isCoffin ? 1.0 : Physics.calcTurnEfficiency(entity.speed || 0.8, sOpt);
      const effAgi = entity.getEffectiveAgility();
      aeroSection = `
        <div class="inspection-data-section">
          <span class="inspection-data-title">AERODYNAMICS &amp; ENVELOPE</span>
          <div class="inspection-data-row"><span class="inspection-data-label">Ground Ops Phase</span><b class="inspection-data-value raw-gphase-val">${entity.groundPhase ? `${entity.groundPhase} (${entity.airbaseId}, ${entity.takeoffSegmentsReq} Seg)` : 'AIRBORNE'}</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Live Turn Authority</span><b class="inspection-data-value raw-live-agility ${rate('agility', effAgi).colorClass}">${this.fmtNum(effAgi)} (${Math.round(turnEff * 100)}% Corner Opt)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Corner Velocity (sOpt)</span><b class="inspection-data-value ${rate('speed', sOpt).colorClass}">Mach ${this.fmtNum(sOpt)} (${Math.round(sOpt * 1225)} km/h)</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">G-Load Tolerance</span><b class="inspection-data-value ${rate('glimit', spec.G_limit).colorClass}">${this.fmtNum(spec.G_limit, 1)} G</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Kinetic Energy &amp; Wr</span><b class="inspection-data-value raw-energy-val">${Math.round((entity.energy !== undefined ? entity.energy : 1) * 100)}% | Wr ${Math.round((entity.Wr || 0) * 100)}%</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Pilot G-Stress</span><b class="inspection-data-value raw-stress-val">${entity.isCoffin ? 'COFFIN IMMUNE' : `${this.fmtNum(entity.stress, 2)} / ${this.fmtNum(entity.glocThreshold, 2)}`}</b></div>
        </div>`;

      strikeSection = `
        <div class="inspection-data-section">
          <span class="inspection-data-title">STRIKE, SEAD &amp; SURVIVABILITY MODIFIERS</span>
          <div class="inspection-data-row"><span class="inspection-data-label">TFR Terrain Masking</span><b class="inspection-data-value">${entity.hasTfrMasking ? `+${entity.tfrFloorBonusFt} ft Floor (<FL100), -25% Look-Down` : 'Inactive'}</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Targeting Pod &amp; Cloud</span><b class="inspection-data-value">+${Math.round((entity.targetingPodBonus || 0) * 100)}% A2G Pk | ${entity.targetingSpotRangeKm || 0}km Spot | -${Math.round((entity.cloudMitigation || 0) * 100)}% Cloud</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">CCIP / MITL / HTS</span><b class="inspection-data-value">CCIP +${Math.round((entity.ccipBonus || 0) * 100)}% | MITL +${Math.round((entity.mitlBonus || 0) * 100)}% | ARM ${(entity.armRangeMult || 1).toFixed(2)}x</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">DIRCM / Kevlar / ECCM</span><b class="inspection-data-value">DIRCM +${Math.round((entity.dircmEvasion || 0) * 100)}% | AAA -${Math.round((entity.aaaResistance || 0) * 100)}% | ECCM ${Math.round((entity.eccmBonus || 0) * 100)}%</b></div>
        </div>`;
    }

    let cognitionSection = '';
    const commanderTeam = controller.game.currentPvpCommander || 'friendly';
    if (entity.team && entity.team !== commanderTeam && isAircraft && controller.game.ai) {
      const prof = controller.game.ai.getCognitiveProfile(entity.id);
      cognitionSection = `
        <div class="inspection-data-section">
          <span class="inspection-data-title">AI COGNITION &amp; DOCTRINE</span>
          <div class="inspection-data-row"><span class="inspection-data-label">Active Doctrine</span><b class="inspection-data-value">${prof.doctrineName}${prof.atkCapPosture ? ` (${prof.atkCapPosture})` : ''}</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Focus State</span><b class="inspection-data-value raw-cog-state">${prof.isFocused ? `ACTIVE (${prof.remainingFocus.toFixed(1)}s)` : 'PATROL'} (${prof.activeFocusCount}/${prof.maxSlots})</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Tactical Role &amp; Posture</span><b class="inspection-data-value">${prof.tacticalRole} | ${prof.posture}</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Salvo &amp; Mixed Seeker</span><b class="inspection-data-value">Max x${prof.salvoMaxMissiles} | ${Math.round(prof.mixedSeekerChance * 100)}% Mixed</b></div>
          <div class="inspection-data-row"><span class="inspection-data-label">Notch / Decoy Filter</span><b class="inspection-data-value">${Math.round(prof.notchChance * 100)}% Notch | ${Math.round(prof.decoyDiscrimination * 100)}% Decoy</b></div>
        </div>`;
    }

    return `
      <div class="inspection-data-section">
        <span class="inspection-data-title">COMBATANT IDENTITY &amp; KINEMATICS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Callsign / Name</span><b class="inspection-data-value">${controller.escape(entity.callsign || entity.name || entity.flightCode || entity.id)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Model &amp; Faction</span><b class="inspection-data-value">${spec.name || entity.model || entity.ghostType || 'Contact'} (${entity.team ? entity.team.toUpperCase() : 'NEUTRAL'})</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Position &amp; Altitude</span><b class="inspection-data-value raw-coords-val">${this.fmtNum(entity.x, 1)}, ${this.fmtNum(entity.y, 1)} km | FL${Math.round((entity.altFt || 0) / 100)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Speed &amp; Heading</span><b class="inspection-data-value raw-spd-val ${rSpd.colorClass}">M ${this.fmtNum(entity.speed)} | ${String(headingDeg).padStart(3, '0')}${sDeg}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Hull HP &amp; RCS</span><b class="inspection-data-value raw-hp-val ${rHp.colorClass}">${this.fmtNum(entity.hp, 1)}/${entity.maxHp || 4} HP | <span class="${rRcs.colorClass}">${this.fmtNum(entity.effectiveRcs || spec.sigma_0, 5)} m2</span></b></div>
      </div>
      ${aeroSection}
      ${cognitionSection}
      ${strikeSection}
      <div class="inspection-data-section">
        <span class="inspection-data-title">ARMAMENT &amp; SUBSYSTEMS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Gun &amp; Chaff</span><b class="inspection-data-value raw-gun-ammo">${entity.gun ? `${entity.gun.name} (${entity.gunAmmo} rds)` : 'None'} | ${entity.chaff || 0} CM</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Equipped Stores</span><b class="inspection-data-value raw-stores-val">${(entity.equippedWeapons || []).map(w => w.weapon ? `${w.weapon.name} (${w.ammo}/${w.maxAmmo})` : 'Store').join(', ') || 'None'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Upgrades</span><b class="inspection-data-value">${(entity.equippedUpgrades || []).join(', ') || 'None'}</b></div>
      </div>`;
  }

  static renderSurfaceRaw(controller, s) {
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : null;
    const isAttack = (controller.game.scenarioMode === 'ATTACK');
    return `
      <div class="inspection-data-section">
        <span class="inspection-data-title">INSTALLATION IDENTITY &amp; ARMOR</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Designation &amp; Type</span><b class="inspection-data-value">${controller.escape(s.name)} (${s.type})</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Category &amp; Armor</span><b class="inspection-data-value">${s.category} | ${s.armorClass}${s.isPrimaryObjective ? ' [PRIMARY OBJ]' : ''}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Coordinates &amp; VP</span><b class="inspection-data-value">${this.fmtNum(s.x, 1)}, ${this.fmtNum(s.y, 1)} km | ${s.vpValue} VP</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Integrity (HP)</span><b class="inspection-data-value raw-surf-hp">${s.isIndestructible ? 'INDESTRUCTIBLE' : `${this.fmtNum(s.hp, 1)} / ${s.maxHp} HP`}</b></div>
      </div>
      <div class="inspection-data-section">
        <span class="inspection-data-title">RECON, EMCON &amp; SENSORS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Blue Recon State</span><b class="inspection-data-value raw-surf-reveal">${s.identifiedByBlue ? 'IDENTIFIED' : (s.isRevealedToBlue ? 'REVEALED [?]' : 'CONCEALED')}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Emitter &amp; EMCON</span><b class="inspection-data-value raw-surf-emcon">${s.isEmitter ? (s.emconTimer > 0 ? `EMCON (${s.emconTimer.toFixed(1)}s)` : 'ACTIVE RF') : 'PASSIVE / SILENT'}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Counter-Stealth / Jam</span><b class="inspection-data-value raw-surf-jam">${(s.counterStealthMult || 1).toFixed(1)}x VHF | ${Math.round((s.jamEfficiency || 0) * 100)}% Jam</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Decoy Status</span><b class="inspection-data-value">${s.isGroundDecoy ? `DECOY (Spoofs ${s.spoofsType}${s.spec && s.spec.requiresHighGradeTgp ? ', 45+km TGP' : ''})` : 'Genuine Facility'}</b></div>
      </div>
      <div class="inspection-data-section">
        <span class="inspection-data-title">ARMAMENT &amp; IADS MODIFIERS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Range &amp; Cooldown</span><b class="inspection-data-value raw-surf-cd">${s.rangeKm} km | CD: ${s.fireCooldown > 0 ? `${s.fireCooldown.toFixed(1)}s` : 'READY'} / ${s.cooldownMax}s</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Altitude Floors</span><b class="inspection-data-value">${s.minAltFt} ft uncued / ${s.cuedMinAltFt} ft cued</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">CIWS &amp; AAA Flak</span><b class="inspection-data-value">${s.canInterceptMissiles ? `CIWS ${Math.round((mods ? mods.ciwsAccuracy : s.interceptAccuracy) * 100)}%` : 'No CIWS'} | ${s.isAaaGun || s.type === 'PANTSIR' ? `AAA ${s.aaaRangeKm}km/${s.aaaMaxAltFt}ft` : 'No AAA'}</b></div>
        ${isAttack && mods ? `<div class="inspection-data-row"><span class="inspection-data-label">IADS Link State</span><b class="inspection-data-value">EW:${mods.hasEwCue ? 'ON' : 'OFF'} | LowCue:${mods.hasLowAltCue ? 'ON' : 'OFF'} | Pwr:${mods.isPowerActive ? 'ON' : 'CUT'} | Reload:${mods.samCooldownMult.toFixed(2)}x | Gate:${Math.round(mods.ambushRatio * 100)}%</b></div>` : ''}
        ${s.airbaseId ? `<div class="inspection-data-row"><span class="inspection-data-label">Airbase Asset</span><b class="inspection-data-value raw-surf-parked">${s.airbaseId}${s.isRunwaySegment ? ` Seg ${s.segmentIndex + 1}/${s.totalSegments}` : ''}${s.isAircraftParking ? ` | Parked: ${(s.parkedAircraft || []).length}` : ''}</b></div>` : ''}
      </div>`;
  }

  static renderMissileRaw(controller, m) {
    const w = m.weapon || {};
    return `
      <div class="inspection-data-section">
        <span class="inspection-data-title">IN-FLIGHT MUNITION TELEMETRY</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Weapon &amp; Category</span><b class="inspection-data-value">${controller.escape(w.name || w.id)} (${w.category || 'MSL'})</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Seeker &amp; Traits</span><b class="inspection-data-value">${w.seeker || 'GUIDED'} | ${w.trait || 'STANDARD'}${w.antiEmcon ? ' [ANTI-EMCON]' : ''}${w.isBunkerCracker ? ' [PENETRATOR]' : ''}${w.isAntiRunway ? ' [2x RUNWAY]' : ''}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Stage &amp; Speed</span><b class="inspection-data-value raw-msl-stage">${m.stage || 'BOOST'} | Mach ${this.fmtNum(m.speed)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Distance &amp; Range</span><b class="inspection-data-value raw-msl-dist">${this.fmtNum(m.distanceToTarget, 1)} km to tgt | ${this.fmtNum(m.distanceTraveled, 1)}/${this.fmtNum(m.maxRangeKm, 1)} km</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Signature &amp; Damage</span><b class="inspection-data-value">${this.fmtNum(m.rcs, 4)} m2${m.isStealthMissile ? ' [VLO]' : ''} | ${w.damage || 0} HP</b></div>
      </div>
      <div class="inspection-data-section">
        <span class="inspection-data-title">LAUNCH RELEASE MODIFIERS</span>
        <div class="inspection-data-row"><span class="inspection-data-label">Release Range &amp; Alt</span><b class="inspection-data-value">${this.fmtNum(m.launchDistKm, 1)} km @ FL${Math.round((m.launchAltFt || 0) / 100)}</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">A2G Guidance Buffs</span><b class="inspection-data-value">TGP +${Math.round((m.launchTgpBonus || 0) * 100)}% | CCIP +${Math.round((m.launchCcipBonus || 0) * 100)}% | HTS +${Math.round((m.launchArmPkBonus || 0) * 100)}% | MITL +${Math.round((m.launchMitlBonus || 0) * 100)}%</b></div>
        <div class="inspection-data-row"><span class="inspection-data-label">Cloud Path &amp; ECCM</span><b class="inspection-data-value">${m.launchCloudHits || 0} cloud(s) (Mit ${Math.round((m.launchCloudMitigation || 0) * 100)}%) | ECCM ${Math.round((m.launchEccmBonus || 0) * 100)}%</b></div>
      </div>`;
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    if (controller.isSurface(entity)) {
      const hpEl = content.querySelector('.raw-surf-hp');
      if (hpEl && !entity.isIndestructible) hpEl.textContent = `${this.fmtNum(Math.max(0, entity.hp), 1)} / ${entity.maxHp} HP`;
      const revEl = content.querySelector('.raw-surf-reveal');
      if (revEl) revEl.textContent = entity.identifiedByBlue ? 'IDENTIFIED' : (entity.isRevealedToBlue ? 'REVEALED [?]' : 'CONCEALED');
      const emEl = content.querySelector('.raw-surf-emcon');
      if (emEl) emEl.textContent = entity.isEmitter ? (entity.emconTimer > 0 ? `EMCON (${entity.emconTimer.toFixed(1)}s)` : 'ACTIVE RF') : 'PASSIVE / SILENT';
      const cdEl = content.querySelector('.raw-surf-cd');
      if (cdEl) cdEl.textContent = `${entity.rangeKm} km | CD: ${entity.fireCooldown > 0 ? `${entity.fireCooldown.toFixed(1)}s` : 'READY'} / ${entity.cooldownMax}s`;
      const pkEl = content.querySelector('.raw-surf-parked');
      if (pkEl && entity.airbaseId) pkEl.textContent = `${entity.airbaseId}${entity.isRunwaySegment ? ` Seg ${entity.segmentIndex + 1}/${entity.totalSegments}` : ''}${entity.isAircraftParking ? ` | Parked: ${(entity.parkedAircraft || []).length}` : ''}`;
      return;
    }
    if (controller.isMissile(entity)) {
      const stEl = content.querySelector('.raw-msl-stage');
      if (stEl) stEl.textContent = `${entity.stage || 'BOOST'} | Mach ${this.fmtNum(entity.speed)}`;
      const dEl = content.querySelector('.raw-msl-dist');
      if (dEl) dEl.textContent = `${this.fmtNum(entity.distanceToTarget, 1)} km to tgt | ${this.fmtNum(entity.distanceTraveled, 1)}/${this.fmtNum(entity.maxRangeKm, 1)} km`;
      return;
    }

    const sDeg = window.INSP_SVG ? window.INSP_SVG.deg : '';
    let hdgDeg = Math.round(((entity.heading || 0) * 180 / Math.PI) % 360);
    if (hdgDeg < 0) hdgDeg += 360;
    const coords = content.querySelector('.raw-coords-val');
    if (coords) coords.textContent = `${this.fmtNum(entity.x, 1)}, ${this.fmtNum(entity.y, 1)} km | FL${Math.round((entity.altFt || 0) / 100)}`;
    const spd = content.querySelector('.raw-spd-val');
    if (spd) spd.innerHTML = `M ${this.fmtNum(entity.speed)} | ${String(hdgDeg).padStart(3, '0')}${sDeg}`;
    const hpEl = content.querySelector('.raw-hp-val');
    if (hpEl) hpEl.innerHTML = `${this.fmtNum(entity.hp, 1)}/${entity.maxHp || 4} HP | <span>${this.fmtNum(entity.effectiveRcs || (entity.spec && entity.spec.sigma_0), 5)} m2</span>`;
    const gph = content.querySelector('.raw-gphase-val');
    if (gph) gph.textContent = entity.groundPhase ? `${entity.groundPhase} (${entity.airbaseId}, ${entity.takeoffSegmentsReq} Seg)` : 'AIRBORNE';
    const eng = content.querySelector('.raw-energy-val');
    if (eng) eng.textContent = `${Math.round((entity.energy !== undefined ? entity.energy : 1) * 100)}% | Wr ${Math.round((entity.Wr || 0) * 100)}%`;
    const strs = content.querySelector('.raw-stress-val');
    if (strs) strs.textContent = entity.isCoffin ? 'COFFIN IMMUNE' : `${this.fmtNum(entity.stress, 2)} / ${this.fmtNum(entity.glocThreshold, 2)}`;
    const cog = content.querySelector('.raw-cog-state');
    if (cog && controller.game.ai) {
      const prof = controller.game.ai.getCognitiveProfile(entity.id);
      cog.textContent = `${prof.isFocused ? `ACTIVE (${prof.remainingFocus.toFixed(1)}s)` : 'PATROL'} (${prof.activeFocusCount}/${prof.maxSlots})`;
    }
  }
}

window.InspectionRawDataRenderer = InspectionRawDataRenderer;
