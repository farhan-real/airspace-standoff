/**
 * AIRSPACE STANDOFF: Delta-Based Touch & Pointer Navigation Engine
 */

class PointerControlsHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys.game;
    this.isDraggingMap = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.pinchStartDist = 0;
    this.totalDragDist = 0;
    this.initCanvasPointer();
  }

  initCanvasPointer() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.isDraggingMap = false;
        this.pinchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.pinchStartDist > 0) {
        e.preventDefault();
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = curDist / this.pinchStartDist;
        if (Math.abs(ratio - 1.0) > 0.02) {
          this.game.radar.cam.zoomAtCenter(ratio > 1 ? 1.04 : 0.96);
          this.pinchStartDist = curDist;
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) this.pinchStartDist = 0;
    }, { passive: false });

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.pinchStartDist > 0) return;

      this.isDraggingMap = true;
      this.totalDragDist = 0;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    canvas.addEventListener('pointermove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      if (this.isDraggingMap && this.pinchStartDist === 0) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        this.totalDragDist += Math.hypot(dx, dy);

        if (this.totalDragDist > 4) {
          this.game.radar.trackingUnit = null;

          const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
          const effScaleX = (this.game.radar.cssWidth / cfg.THEATER_WIDTH_KM) * this.game.radar.zoom;
          const effScaleY = (this.game.radar.cssHeight / cfg.THEATER_HEIGHT_KM) * this.game.radar.zoom;

          this.game.radar.panX -= (dx / effScaleX);
          this.game.radar.panY -= (dy / effScaleY);

          const maxPanX = cfg.THEATER_WIDTH_KM;
          const maxPanY = cfg.THEATER_HEIGHT_KM;
          this.game.radar.panX = Math.max(-50, Math.min(maxPanX + 50, this.game.radar.panX));
          this.game.radar.panY = Math.max(-30, Math.min(maxPanY + 30, this.game.radar.panY));
        }
      } else {
        const candidate = this.findClosestContactInScreenSpace(curX, curY, 32);
        this.game.radar.hoveredContact = candidate ? candidate.entity : null;
      }
    });

    const releasePointer = (e) => {
      if (!this.isDraggingMap) return;
      this.isDraggingMap = false;

      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}

      if (this.totalDragDist <= 6) {
        const rect = canvas.getBoundingClientRect();
        const tapX = e.clientX - rect.left;
        const tapY = e.clientY - rect.top;

        const pick = this.findClosestContactInScreenSpace(tapX, tapY, 38);
        if (pick) {
          const entity = pick.entity;
          if (this.game.inspection && this.game.inspection.isOpen) {
            this.game.inspection.selectMapEntity(entity);
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
            return;
          }
          const commanderTeam = this.game.currentPvpCommander || 'friendly';

          if (entity.team === commanderTeam && entity instanceof Aircraft) {
            this.game.activeUnit = entity;
            if (this.game.radar && this.game.radar.cam && this.game.radar.trackingUnit) {
              this.game.radar.cam.trackActiveCraft(entity);
            }
            this.game.avionics.renderFlightRoster();
            this.game.avionics.updateActiveUnitMFD();
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          } else {
            this.game.selectedTarget = entity;
            if (this.game.activeUnit) this.game.activeUnit.radarLockedTarget = entity;
            if (this.game.radar) {
              this.game.radar.spawnCombatText(entity.x, entity.y, 'TARGET SELECTED', '#38bdf8');
              this.game.radar.spawnShockwave(entity.x, entity.y, '#38bdf8', 24);
            }
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
            this.game.avionics.updateActiveUnitMFD();
          }
        }
      }
    };

    canvas.addEventListener('pointerup', releasePointer);
    canvas.addEventListener('pointercancel', releasePointer);
  }

  findClosestContactInScreenSpace(screenX, screenY, maxRadiusPx) {
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const inspectionOpen = Boolean(this.game.inspection && this.game.inspection.isOpen);
    const detectedSet = (commanderTeam === 'friendly')
      ? (this.game.detectedByBlue || new Set())
      : (this.game.detectedByRed || new Set());

    const candidates = [];
    const friendlies = (commanderTeam === 'friendly') ? this.game.alliedAircraft : this.game.hostileAircraft;
    for (const f of friendlies) {
      if (f.hp > 0) {
        const pF = this.game.radar.toScreen(f.x, f.y);
        const distF = Math.hypot(pF.x - screenX, pF.y - screenY);
        if (distF <= maxRadiusPx) candidates.push({ entity: f, distPx: distF });
      }
    }

    const enemies = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
    for (const e of enemies) {
      if (e.hp > 0 && (inspectionOpen || detectedSet.has(e.id))) {
        const pE = this.game.radar.toScreen(e.x, e.y);
        const distE = Math.hypot(pE.x - screenX, pE.y - screenY);
        if (distE <= maxRadiusPx) candidates.push({ entity: e, distPx: distE });
      }
    }

    const ghosts = (this.game.simulation && this.game.simulation.ghostContacts) || [];
    for (const g of ghosts) {
      if (g.hp > 0 && !g.isDissolved && (inspectionOpen || detectedSet.has(g.id))) {
        const pG = this.game.radar.toScreen(g.x, g.y);
        const distG = Math.hypot(pG.x - screenX, pG.y - screenY);
        if (distG <= maxRadiusPx) candidates.push({ entity: g, distPx: distG });
      }
    }

    const decoys = (this.game.simulation && this.game.simulation.decoyDrones) || [];
    for (const d of decoys) {
      if (d.hp > 0 && (inspectionOpen || d.team === commanderTeam || detectedSet.has(d.id))) {
        const pD = this.game.radar.toScreen(d.x, d.y);
        const distD = Math.hypot(pD.x - screenX, pD.y - screenY);
        if (distD <= maxRadiusPx) candidates.push({ entity: d, distPx: distD });
      }
    }

    for (const s of this.game.surfaceUnits) {
      if (s.hp > 0 && (inspectionOpen || s.team === commanderTeam || detectedSet.has(s.id))) {
        const pS = this.game.radar.toScreen(s.x, s.y);
        const distS = Math.hypot(pS.x - screenX, pS.y - screenY);
        if (distS <= maxRadiusPx) candidates.push({ entity: s, distPx: distS });
      }
    }

    const civilians = (this.game.simulation && this.game.simulation.civilianTraffic) || [];
    for (const civ of civilians) {
      if (civ.hp > 0 && (inspectionOpen || detectedSet.has(civ.id))) {
        const pC = this.game.radar.toScreen(civ.x, civ.y);
        const distC = Math.hypot(pC.x - screenX, pC.y - screenY);
        if (distC <= maxRadiusPx) candidates.push({ entity: civ, distPx: distC });
      }
    }

    for (const missile of this.game.missiles || []) {
      if (!missile.isDead && (inspectionOpen || missile.team === commanderTeam || detectedSet.has(missile.id))) {
        const pM = this.game.radar.toScreen(missile.x, missile.y);
        const distM = Math.hypot(pM.x - screenX, pM.y - screenY);
        if (distM <= maxRadiusPx) candidates.push({ entity: missile, distPx: distM });
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.distPx - b.distPx);
    return candidates[0];
  }
}

window.PointerControlsHandler = PointerControlsHandler;