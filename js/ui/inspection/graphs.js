/**
 * AIRSPACE STANDOFF: Inspection Graphs Tab Coordinator
 */

class InspectionGraphs {
  static selectedWeaponId = null;
  static selectedTargetId = null;

  static getGraphContext(controller, entity) {
    const game = controller.game;
    const isSurf = controller.isSurface(entity);
    const isSurfCombat = Boolean(isSurf && entity.canAttack && entity.missileSpec);
    const shooter = controller.isAircraft(entity) ? entity : (isSurfCombat ? entity : game.activeUnit);

    let weapons = [];
    if (isSurfCombat && entity.missileSpec) {
      weapons = [{ weapon: entity.missileSpec, ammo: 'SAM', maxAmmo: 'SAM' }];
    } else if (shooter && shooter.equippedWeapons) {
      weapons = shooter.equippedWeapons.filter(w =>
        w && w.weapon && !w.weapon.isJammerPod && !w.weapon.isTargetingPod && !w.weapon.isDecoy && !w.weapon.isDecoyDrone
      );
    }

    if (!weapons.some(w => w.weapon && String(w.weapon.id) === String(this.selectedWeaponId))) {
      this.selectedWeaponId = weapons.length > 0 ? weapons[0].weapon.id : null;
    }

    const commanderTeam = game.currentPvpCommander || 'friendly';
    let validTargets = [];
    if (isSurf && !isSurfCombat) {
      validTargets = [entity];
      this.selectedTargetId = entity.id;
    } else if (isSurfCombat) {
      validTargets = (entity.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft).filter(t => t && t.hp > 0.05);
    } else {
      const isFriendly = entity.team === commanderTeam;
      const pool = isFriendly
        ? [...(game.hostileAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'hostile'))]
        : [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly'))];
      validTargets = pool.filter(t => t && (t.hp > 0.05 || t.isIndestructible));
    }

    if (!validTargets.some(t => String(t.id) === String(this.selectedTargetId))) {
      this.selectedTargetId = validTargets.length > 0 ? validTargets[0].id : null;
    }

    return { shooter, weapons, validTargets, isSurf, isSurfCombat };
  }

  static render(controller, entity) {
    if (!entity) {
      return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b><span>Select an aircraft or ground installation to view graphs.</span></div>';
    }

    const game = controller.game;
    const isSurf = controller.isSurface(entity);
    const { weapons, validTargets, isSurfCombat } = this.getGraphContext(controller, entity);

    const weaponOptsHtml = weapons.map(item => {
      const w = item.weapon;
      const isSel = String(w.id) === String(this.selectedWeaponId);
      const countStr = item.ammo === 'SAM' ? '[SAM]' : `(${item.ammo}/${item.maxAmmo})`;
      return `<option value="${w.id}" ${isSel ? 'selected' : ''}>${w.name} ${countStr}</option>`;
    }).join('') || '<option value="">No Weapons Equipped</option>';

    const targetOptsHtml = validTargets.map(t => {
      const isSel = String(t.id) === String(this.selectedTargetId);
      return `<option value="${t.id}" ${isSel ? 'selected' : ''}>${controller.getName(t)}</option>`;
    }).join('') || '<option value="">No Active Targets</option>';

    const title1 = isSurfCombat ? '1. SURFACE SAM ENGAGEMENT ENVELOPE' : (isSurf ? '1. ALLIED STRIKE DLZ VS INSTALLATION' : '1. DYNAMIC LAUNCH ZONE (DLZ) &amp; P_k vs RANGE');
    const title2 = isSurf ? '2. 360deg SURFACE COVERAGE &amp; THREATS' : '2. 360deg RCS POLAR RADIATION DIAGRAM';
    const title3 = isSurf ? '3. BATTERY READINESS / INTEGRITY GAUGE' : '3. TURN SPEED GAUGE &amp; CORNER VELOCITY';
    const title4 = isSurf ? '4. IADS NETWORK &amp; SYSTEM STATUS' : '4. SPEED &amp; ALTITUDE HISTORY (ROLLING 60s)';

    const polarMeta = isSurf
      ? `<span>BASE RANGE: <b>${entity.rangeKm || 0} km</b></span><span>FLOOR: <b>${(entity.minAltFt || 1000).toLocaleString()} ft</b></span><span>EMCON: <b>${entity.emconTimer > 0 ? 'SILENT' : (entity.isEmitter ? 'EMITTING' : 'PASSIVE')}</b></span>`
      : `<span>CLEAN RCS: <b>${entity.spec ? (entity.spec.sigma_0 || 1.0) : 1.0} m2</b></span><span>LOADED RCS: <b style="color:var(--stat-tier-3);">${(entity.effectiveRcs || 1.0).toFixed(4)} m2</b></span><span>BEAM SPIKE: <b style="color:var(--stat-tier-4);">${entity.spec ? (entity.spec.beamSpike || 3.2).toFixed(1) : '3.2'}x</b></span>`;

    return `
      <section class="inspection-graph-card">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">${title1}</h3>
          <div class="inspection-graph-controls">
            <select id="dlz-select-weapon" class="inspection-graph-select">${weaponOptsHtml}</select>
            <select id="dlz-select-target" class="inspection-graph-select">${targetOptsHtml}</select>
          </div>
        </div>
        <div class="inspection-graph-canvas-wrap"><canvas id="canvas-graph-dlz" class="inspection-graph-canvas"></canvas></div>
        <div class="inspection-graph-meta" id="dlz-meta-summary">
          <span>ZONE: <b id="dlz-zone-val" style="color:var(--stat-tier-2);">EVALUATING</b></span>
          <span>MAX RANGE: <b id="dlz-rmax-val">-- km</b></span>
        </div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">${title2}</h3>
          <span class="factor-chip info" style="font-size:0.56rem;">${isSurf ? 'COVERAGE &amp; AMBUSH RINGS' : 'ASPECT BEAM SPIKES &amp; THREATS'}</span>
        </div>
        <div class="inspection-graph-canvas-wrap"><canvas id="canvas-graph-polar" class="inspection-graph-canvas tall"></canvas></div>
        <div class="inspection-graph-meta">${polarMeta}</div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">${title3}</h3>
          <span class="factor-chip" style="color:var(--stat-tier-2); border-color:var(--stat-tier-2); font-size:0.56rem;">DYNAMIC ENVELOPE</span>
        </div>
        <div class="inspection-graph-canvas-wrap"><canvas id="canvas-graph-turn" class="inspection-graph-canvas turn-gauge"></canvas></div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">${title4}</h3>
          <span class="factor-chip neutral" style="font-size:0.56rem;">${isSurf ? 'LIVE NETWORK METRICS' : 'CYAN (MACH) &bull; AMBER (ALT)'}</span>
        </div>
        <div class="inspection-graph-canvas-wrap"><canvas id="canvas-graph-history" class="inspection-graph-canvas compact"></canvas></div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">5. FLEET STRENGTH OVER TIME (COMBAT VALUE)</h3>
          <span class="factor-chip neutral" style="font-size:0.56rem;">${game.scenarioMode === 'ATTACK' ? 'ALLIED WING VS IADS &amp; QRA' : 'NET COMBAT POWER ADVANTAGE'}</span>
        </div>
        <div class="inspection-graph-canvas-wrap"><canvas id="canvas-graph-fleet" class="inspection-graph-canvas"></canvas></div>
      </section>`;
  }

  static bindControls(controller, content) {
    if (!content) return;
    const wSelect = content.querySelector('#dlz-select-weapon');
    if (wSelect) {
      wSelect.onchange = (e) => { this.selectedWeaponId = e.target.value; this.updateLive(controller, controller.selectedEntity, content); };
    }
    const tSelect = content.querySelector('#dlz-select-target');
    if (tSelect) {
      tSelect.onchange = (e) => { this.selectedTargetId = e.target.value; this.updateLive(controller, controller.selectedEntity, content); };
    }
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    const game = controller.game;
    const { shooter, weapons, validTargets, isSurf } = this.getGraphContext(controller, entity);

    const canvasDlz = content.querySelector('#canvas-graph-dlz');
    if (canvasDlz && typeof DLZGraphRenderer !== 'undefined') {
      const chosenItem = weapons.find(w => w.weapon && String(w.weapon.id) === String(this.selectedWeaponId)) || weapons[0] || null;
      const weapon = chosenItem ? chosenItem.weapon : null;
      const target = validTargets.find(t => String(t.id) === String(this.selectedTargetId)) || validTargets[0] || null;

      DLZGraphRenderer.renderCanvas(canvasDlz, shooter, target, weapon, game);

      const effRange = (weapon && shooter && controller.isAircraft(shooter))
        ? weapon.rangeKm * (weapon.isAntiRadiation ? shooter.armRangeMult : ((weapon.seeker === 'UNGUIDED' || weapon.isRocketPod) ? shooter.bombRangeBonus : 1.0))
        : (weapon ? weapon.rangeKm : 0);
      const rmaxVal = content.querySelector('#dlz-rmax-val');
      if (rmaxVal) rmaxVal.textContent = weapon ? `${effRange.toFixed(0)} km` : '-- km';

      const zoneVal = content.querySelector('#dlz-zone-val');
      if (zoneVal && weapon && target && shooter) {
        const d = Math.hypot(target.x - shooter.x, target.y - shooter.y);
        const nezMin = weapon.sweetSpotMin || (effRange * 0.20);
        const nezMax = weapon.sweetSpotMax || (effRange * 0.65);
        if (d < (weapon.minRangeKm || 0.8)) {
          zoneVal.textContent = 'MIN ARMING GATE (COLLAPSED)'; zoneVal.style.color = 'var(--stat-tier-5)';
        } else if (d >= nezMin && d <= nezMax) {
          zoneVal.textContent = 'OPTIMAL / NO-ESCAPE ZONE'; zoneVal.style.color = 'var(--stat-tier-2)';
        } else if (d <= effRange) {
          zoneVal.textContent = 'IN ENVELOPE (BALLISTIC DECAY)'; zoneVal.style.color = 'var(--stat-tier-3)';
        } else {
          zoneVal.textContent = 'OUT OF RANGE'; zoneVal.style.color = 'var(--stat-tier-5)';
        }
      }
    }

    const canvasPolar = content.querySelector('#canvas-graph-polar');
    if (canvasPolar) {
      if (isSurf) InspectionSurfaceGraphs.renderPolarCoverage(canvasPolar, entity, game);
      else if (typeof PolarRCSRenderer !== 'undefined') PolarRCSRenderer.renderCanvas(canvasPolar, entity, game);
    }

    const canvasTurn = content.querySelector('#canvas-graph-turn');
    if (canvasTurn) {
      if (isSurf) InspectionSurfaceGraphs.renderReadinessGauge(canvasTurn, entity, game);
      else if (typeof TurnGaugeRenderer !== 'undefined') TurnGaugeRenderer.renderCanvas(canvasTurn, entity);
    }

    const canvasHist = content.querySelector('#canvas-graph-history');
    if (canvasHist) {
      if (isSurf) InspectionSurfaceGraphs.renderStatusSummary(canvasHist, entity, game);
      else if (typeof HistoryGraphRenderer !== 'undefined') HistoryGraphRenderer.renderCanvas(canvasHist, entity);
    }

    const canvasFleet = content.querySelector('#canvas-graph-fleet');
    if (canvasFleet && typeof FleetPowerRenderer !== 'undefined') {
      FleetPowerRenderer.renderCanvas(canvasFleet, game);
    }
  }
}

window.InspectionGraphs = InspectionGraphs;
