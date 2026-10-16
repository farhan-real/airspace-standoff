/**
 * AIRSPACE STANDOFF: Inspection Graphs Tab Coordinator
 */

class InspectionGraphs {
  static selectedWeaponId = null;
  static selectedTargetId = null;

  static render(controller, entity) {
    if (!entity) {
      return '<div class="inspection-empty"><b>NO OBJECT SELECTED</b><span>Select an aircraft to analyze tactical performance graphs.</span></div>';
    }

    const game = controller.game;
    const shooter = entity.spec ? entity : game.activeUnit;

    const weapons = shooter && shooter.equippedWeapons ? shooter.equippedWeapons : [];
    const airWeapons = weapons.filter(w => w && w.weapon && !w.weapon.isJammerPod && !w.weapon.isDecoy && !w.weapon.isDecoyDrone);

    if (!this.selectedWeaponId && airWeapons.length > 0) {
      this.selectedWeaponId = airWeapons[0].weapon.id;
    }

    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = entity.team === commanderTeam;
    const opposingFleet = isFriendly
      ? [...(game.hostileAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'hostile'))]
      : [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly'))];

    const validTargets = opposingFleet.filter(t => t && t.hp > 0.05);
    if (!this.selectedTargetId && validTargets.length > 0) {
      this.selectedTargetId = validTargets[0].id;
    }

    const weaponOptsHtml = airWeapons.map(item => {
      const w = item.weapon;
      const isSel = String(w.id) === String(this.selectedWeaponId);
      return `<option value="${w.id}" ${isSel ? 'selected' : ''}>${w.name} (${item.ammo}/${item.maxAmmo})</option>`;
    }).join('') || '<option value="">No Weapons Equipped</option>';

    const targetOptsHtml = validTargets.map(t => {
      const isSel = String(t.id) === String(this.selectedTargetId);
      const name = controller.getName(t);
      return `<option value="${t.id}" ${isSel ? 'selected' : ''}>${name}</option>`;
    }).join('') || '<option value="">No Active Targets</option>';

    return `
      <section class="inspection-graph-card">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">1. DYNAMIC LAUNCH ZONE (DLZ) &amp; P_k vs RANGE</h3>
          <div class="inspection-graph-controls">
            <select id="dlz-select-weapon" class="inspection-graph-select" title="Select munition">${weaponOptsHtml}</select>
            <select id="dlz-select-target" class="inspection-graph-select" title="Select target">${targetOptsHtml}</select>
          </div>
        </div>
        <div class="inspection-graph-canvas-wrap">
          <canvas id="canvas-graph-dlz" class="inspection-graph-canvas"></canvas>
        </div>
        <div class="inspection-graph-meta" id="dlz-meta-summary">
          <span>ZONE: <b id="dlz-zone-val" style="color:var(--stat-tier-2);">EVALUATING</b></span>
          <span>MAX RANGE: <b id="dlz-rmax-val">-- km</b></span>
        </div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">2. 360° RCS POLAR RADIATION DIAGRAM</h3>
          <span class="factor-chip info" style="font-size:0.56rem;">ASPECT BEAM SPIKES &amp; THREATS</span>
        </div>
        <div class="inspection-graph-canvas-wrap">
          <canvas id="canvas-graph-polar" class="inspection-graph-canvas tall"></canvas>
        </div>
        <div class="inspection-graph-meta">
          <span>CLEAN RCS: <b>${entity.spec ? (entity.spec.sigma_0 || 1.0) : 1.0} m2</b></span>
          <span>LOADED RCS: <b style="color:var(--stat-tier-3);">${(entity.effectiveRcs || 1.0).toFixed(4)} m2</b></span>
          <span>BEAM SPIKE: <b style="color:var(--stat-tier-4);">${entity.spec ? (entity.spec.beamSpike || 3.2).toFixed(1) : '3.2'}x (+${Math.round(((entity.spec ? entity.spec.beamSpike : 3.2) - 1) * 100)}%)</b></span>
        </div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">3. TURN SPEED GAUGE &amp; CORNER VELOCITY</h3>
          <span class="factor-chip" style="color:var(--stat-tier-2); border-color:var(--stat-tier-2); font-size:0.56rem;">DYNAMIC ENVELOPE</span>
        </div>
        <div class="inspection-graph-canvas-wrap">
          <canvas id="canvas-graph-turn" class="inspection-graph-canvas turn-gauge"></canvas>
        </div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">4. SPEED &amp; ALTITUDE HISTORY (ROLLING 60s)</h3>
          <span class="factor-chip neutral" style="font-size:0.56rem;">CYAN (MACH) &bull; AMBER (ALT)</span>
        </div>
        <div class="inspection-graph-canvas-wrap">
          <canvas id="canvas-graph-history" class="inspection-graph-canvas compact"></canvas>
        </div>
      </section>

      <section class="inspection-graph-card" style="margin-top:6px;">
        <div class="inspection-graph-header">
          <h3 class="inspection-graph-title">5. FLEET STRENGTH OVER TIME (ECONOMIC COMBAT VALUE)</h3>
          <span class="factor-chip neutral" style="font-size:0.56rem;">NET COMBAT POWER ADVANTAGE</span>
        </div>
        <div class="inspection-graph-canvas-wrap">
          <canvas id="canvas-graph-fleet" class="inspection-graph-canvas"></canvas>
        </div>
      </section>
    `;
  }

  static bindControls(controller, content) {
    if (!content) return;
    const wSelect = content.querySelector('#dlz-select-weapon');
    if (wSelect) {
      wSelect.onchange = (e) => {
        this.selectedWeaponId = e.target.value;
        this.updateLive(controller, controller.selectedEntity, content);
      };
    }
    const tSelect = content.querySelector('#dlz-select-target');
    if (tSelect) {
      tSelect.onchange = (e) => {
        this.selectedTargetId = e.target.value;
        this.updateLive(controller, controller.selectedEntity, content);
      };
    }
  }

  static updateLive(controller, entity, content) {
    if (!entity || !content) return;
    const game = controller.game;
    const shooter = entity.spec ? entity : game.activeUnit;
    if (!shooter) return;

    // 1. DLZ Graph
    const canvasDlz = content.querySelector('#canvas-graph-dlz');
    if (canvasDlz && typeof DLZGraphRenderer !== 'undefined') {
      const weapons = shooter.equippedWeapons || [];
      const chosenItem = weapons.find(w => w.weapon && String(w.weapon.id) === String(this.selectedWeaponId)) ||
                         weapons.find(w => w.weapon && !w.weapon.isJammerPod && !w.weapon.isDecoy) || null;
      const weapon = chosenItem ? chosenItem.weapon : null;

      const allTargets = [
        ...(game.alliedAircraft || []),
        ...(game.hostileAircraft || []),
        ...(game.surfaceUnits || [])
      ];
      const target = allTargets.find(t => String(t.id) === String(this.selectedTargetId)) ||
                     allTargets.find(t => t.team !== shooter.team && t.hp > 0.05) || null;

      DLZGraphRenderer.renderCanvas(canvasDlz, shooter, target, weapon);

      const rmaxVal = content.querySelector('#dlz-rmax-val');
      if (rmaxVal && weapon) rmaxVal.textContent = `${weapon.rangeKm} km`;

      const zoneVal = content.querySelector('#dlz-zone-val');
      if (zoneVal && weapon && target) {
        const d = Math.hypot(target.x - shooter.x, target.y - shooter.y);
        const nezMin = weapon.sweetSpotMin || (weapon.rangeKm * 0.20);
        const nezMax = weapon.sweetSpotMax || (weapon.rangeKm * 0.65);
        if (d < (weapon.minRangeKm || 1.0)) {
          zoneVal.textContent = 'MIN ARMING GATE (COLLAPSED)';
          zoneVal.style.color = 'var(--stat-tier-5)';
        } else if (d >= nezMin && d <= nezMax) {
          zoneVal.textContent = 'NO-ESCAPE ZONE (PEAK Pk)';
          zoneVal.style.color = 'var(--stat-tier-2)';
        } else if (d <= weapon.rangeKm) {
          zoneVal.textContent = 'BALLISTIC COAST PHASE';
          zoneVal.style.color = 'var(--stat-tier-3)';
        } else {
          zoneVal.textContent = 'OUT OF RANGE';
          zoneVal.style.color = 'var(--stat-tier-5)';
        }
      }
    }

    // 2. Polar RCS Diagram
    const canvasPolar = content.querySelector('#canvas-graph-polar');
    if (canvasPolar && typeof PolarRCSRenderer !== 'undefined') {
      PolarRCSRenderer.renderCanvas(canvasPolar, entity, game);
    }

    // 3. Turn Speed Gauge
    const canvasTurn = content.querySelector('#canvas-graph-turn');
    if (canvasTurn && typeof TurnGaugeRenderer !== 'undefined') {
      TurnGaugeRenderer.renderCanvas(canvasTurn, entity);
    }

    // 4. Speed & Altitude History
    const canvasHist = content.querySelector('#canvas-graph-history');
    if (canvasHist && typeof HistoryGraphRenderer !== 'undefined') {
      HistoryGraphRenderer.renderCanvas(canvasHist, entity);
    }

    // 5. Fleet Strength Over Time
    const canvasFleet = content.querySelector('#canvas-graph-fleet');
    if (canvasFleet && typeof FleetPowerRenderer !== 'undefined') {
      FleetPowerRenderer.renderCanvas(canvasFleet, game);
    }
  }
}

window.InspectionGraphs = InspectionGraphs;