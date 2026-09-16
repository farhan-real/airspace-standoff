/**
 * APEX VECTOR // Touch & Pointer Controls (Smooth 1-finger canvas pan and zero target pre-select)
 * Protects unidentified aircraft anonymity during radar touch selection.
 */

class PointerControlsHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys.game;
    this.isDraggingMap = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.initialPanX = 0;
    this.initialPanY = 0;
    this.pinchStartDist = 0;
    this.hasMovedSignificantly = false;
    this.initCanvasPointer();
  }

  initCanvasPointer() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.pinchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.pinchStartDist > 0) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = curDist / this.pinchStartDist;
        if (Math.abs(ratio - 1.0) > 0.03) {
          this.game.radar.cam.zoomAtCenter(ratio > 1 ? 1.04 : 0.96);
          this.pinchStartDist = curDist;
        }
      }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) this.pinchStartDist = 0;
    }, { passive: true });

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.isDraggingMap = true;
      this.hasMovedSignificantly = false;
      this.dragStartX = e.clientX - rect.left;
      this.dragStartY = e.clientY - rect.top;
      this.initialPanX = this.game.radar.panX;
      this.initialPanY = this.game.radar.panY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      const km = this.game.radar.toKm(curX, curY);

      const coordsEl = document.getElementById('cursor-coords');
      if (coordsEl) {
        coordsEl.textContent = 'COORD: ' + km.x.toFixed(1) + 'KM, ' + km.y.toFixed(1) + 'KM • TAP TO STEER / TARGET';
      }

      if (this.isDraggingMap && this.pinchStartDist === 0) {
        const dx = curX - this.dragStartX;
        const dy = curY - this.dragStartY;
        if (Math.hypot(dx, dy) > 5) {
          this.hasMovedSignificantly = true;
          this.game.radar.trackingUnit = null;
          const cfg = window.CONFIG || { THEATER_WIDTH_KM: 100.0, THEATER_HEIGHT_KM: 70.0 };
          const effScaleX = (this.game.radar.cssWidth / cfg.THEATER_WIDTH_KM) * this.game.radar.zoom;
          const effScaleY = (this.game.radar.cssHeight / cfg.THEATER_HEIGHT_KM) * this.game.radar.zoom;
          this.game.radar.panX = this.initialPanX - (dx / effScaleX);
          this.game.radar.panY = this.initialPanY - (dy / effScaleY);
        }
      } else {
        const candidate = this.findClosestContactInScreenSpace(curX, curY, 32);
        this.game.radar.hoveredContact = candidate ? candidate.entity : null;
      }
    });

    canvas.addEventListener('pointerup', (e) => {
      const rect = canvas.getBoundingClientRect();
      const upX = e.clientX - rect.left;
      const upY = e.clientY - rect.top;
      this.isDraggingMap = false;

      if (this.hasMovedSignificantly) return;

      const pick = this.findClosestContactInScreenSpace(upX, upY, 40);
      if (pick) {
        const entity = pick.entity;
        const commanderTeam = this.game.currentPvpCommander || 'friendly';

        if (entity.isDecoyDrone && entity.team === commanderTeam) {
          if (this.game.radar) {
            this.game.radar.spawnCombatText(entity.x, entity.y, 'DECOY DRONE [AUTONOMOUS]', '#c084fc');
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          return;
        }

        if (entity.team === commanderTeam && entity instanceof Aircraft) {
          this.game.activeUnit = entity;
          if (this.game.radar && this.game.radar.cam && this.game.radar.trackingUnit) {
            this.game.radar.cam.trackActiveCraft(entity);
          }
          this.game.avionics.renderFlightRoster();
          this.game.avionics.updateActiveUnitMFD();
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          return;
        } else {
          this.game.selectedTarget = entity;
          const dist = this.game.activeUnit ? Math.round(Math.hypot(entity.x - this.game.activeUnit.x, entity.y - this.game.activeUnit.y)) : 0;
          const alt = entity.altFt !== undefined ? ('FL' + Math.round(entity.altFt / 100)) : 'GROUND';

          const isKnown = (entity.team === commanderTeam) ||
            (typeof entity.isIdentifiedBy === 'function' ? entity.isIdentifiedBy(commanderTeam) : entity.isIdentified);

          let rawTargetName = 'BOGEY [?]';
          if (!isKnown) {
            rawTargetName = 'BOGEY [?]';
          } else if (entity.isGhost) {
            rawTargetName = 'FALSE ECHO [' + (entity.ghostType || 'CLUTTER') + ']';
          } else if (entity.isDecoyDrone) {
            rawTargetName = 'DECOY [' + (entity.mirroredModel || 'UCAV') + ']';
          } else if (entity.isCivilian) {
            rawTargetName = entity.flightCode || 'CIVILIAN AIRLINER';
          } else if (entity.type) {
            rawTargetName = entity.name || entity.type;
          } else {
            rawTargetName = entity.callsign || (entity.spec ? entity.spec.name : 'TARGET');
          }

          const targetName = String(rawTargetName).replace(/<[^>]*>/g, '').trim();

          const lockInfo = document.getElementById('selected-target-info');
          if (lockInfo) lockInfo.textContent = 'TARGET: ' + targetName + ' [' + dist + 'km • ' + alt + ']';
          if (this.game.radar) {
            const lockCol = !isKnown ? '#f97316' : '#00f0ff';
            this.game.radar.spawnCombatText(entity.x, entity.y, isKnown ? 'TARGET LOCKED' : 'BOGEY LOCKED', lockCol);
            this.game.radar.spawnShockwave(entity.x, entity.y, lockCol, 25);
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.game.avionics.updateActiveUnitMFD();
          return;
        }
      }

      const km = this.game.radar.toKm(upX, upY);
      if (this.game.activeUnit && this.game.activeUnit.hp > 0) {
        this.game.activeUnit.heading = Math.atan2(km.y - this.game.activeUnit.y, km.x - this.game.activeUnit.x);
        this.game.activeUnit.applyActionStress(0.06);
        if (this.game.radar) {
          this.game.radar.spawnCombatText(km.x, km.y, 'VECTOR SET', '#00f0ff');
        }
      }
    });
  }

  findClosestContactInScreenSpace(screenX, screenY, maxRadiusPx) {
    const commanderTeam = this.game.currentPvpCommander || 'friendly';
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
      if (e.hp > 0 && detectedSet.has(e.id)) {
        const pE = this.game.radar.toScreen(e.x, e.y);
        const distE = Math.hypot(pE.x - screenX, pE.y - screenY);
        if (distE <= maxRadiusPx) candidates.push({ entity: e, distPx: distE });
      }
    }

    const ghosts = (this.game.simulation && this.game.simulation.ghostContacts) || [];
    for (const g of ghosts) {
      if (g.hp > 0 && !g.isDissolved && detectedSet.has(g.id)) {
        const pG = this.game.radar.toScreen(g.x, g.y);
        const distG = Math.hypot(pG.x - screenX, pG.y - screenY);
        if (distG <= maxRadiusPx) candidates.push({ entity: g, distPx: distG });
      }
    }

    const decoys = (this.game.simulation && this.game.simulation.decoyDrones) || [];
    for (const d of decoys) {
      if (d.hp > 0 && (d.team === commanderTeam || detectedSet.has(d.id))) {
        const pD = this.game.radar.toScreen(d.x, d.y);
        const distD = Math.hypot(pD.x - screenX, pD.y - screenY);
        if (distD <= maxRadiusPx) candidates.push({ entity: d, distPx: distD });
      }
    }

    for (const s of this.game.surfaceUnits) {
      if (s.hp > 0 && (s.team === commanderTeam || detectedSet.has(s.id))) {
        const pS = this.game.radar.toScreen(s.x, s.y);
        const distS = Math.hypot(pS.x - screenX, pS.y - screenY);
        if (distS <= maxRadiusPx) candidates.push({ entity: s, distPx: distS });
      }
    }

    const civilians = (this.game.simulation && this.game.simulation.civilianTraffic) || [];
    for (const civ of civilians) {
      if (civ.hp > 0 && detectedSet.has(civ.id)) {
        const pC = this.game.radar.toScreen(civ.x, civ.y);
        const distC = Math.hypot(pC.x - screenX, pC.y - screenY);
        if (distC <= maxRadiusPx) candidates.push({ entity: civ, distPx: distC });
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.distPx - b.distPx);
    return candidates[0];
  }
}

window.PointerControlsHandler = PointerControlsHandler;