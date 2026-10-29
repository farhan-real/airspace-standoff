/**
 * AIRSPACE STANDOFF: Sortie Replay Tactical Map & Distinct Marker Renderer
 * Directional markers for combatants, transports, and drones with zero unlabelled circles.
 */

class ReplayMapRenderer {
  static formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  static drawMap(ctx, state, width, height, startTime) {
    const config = window.CONFIG || {};
    const mapWidth = config.THEATER_WIDTH_KM || 150;
    const mapHeight = config.THEATER_HEIGHT_KM || 100;
    const padding = 20;
    const scaleX = (width - padding * 2) / mapWidth;
    const scaleY = (height - padding * 2) / mapHeight;
    const fieldWidth = mapWidth * scaleX;
    const fieldHeight = mapHeight * scaleY;
    const left = padding;
    const top = padding;

    const toX = (x) => left + x * scaleX;
    const toY = (y) => top + y * scaleY;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#030814';
    ctx.fillRect(left, top, fieldWidth, fieldHeight);

    // Batched theater grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= mapWidth; x += 25) {
      const sx = toX(x);
      ctx.moveTo(sx, top);
      ctx.lineTo(sx, top + fieldHeight);
    }
    for (let y = 0; y <= mapHeight; y += 25) {
      const sy = toY(y);
      ctx.moveTo(left, sy);
      ctx.lineTo(left + fieldWidth, sy);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeRect(left, top, fieldWidth, fieldHeight);

    // Weather clouds
    const clouds = state.clouds;
    if (clouds && clouds.length > 0) {
      ctx.fillStyle = 'rgba(40, 56, 80, 0.16)';
      ctx.strokeStyle = 'rgba(80, 110, 150, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        ctx.moveTo(toX(c.x) + c.rx * scaleX, toY(c.y));
        ctx.ellipse(toX(c.x), toY(c.y), Math.max(3, c.rx * scaleX), Math.max(3, c.ry * scaleY), 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Surface installations
    const surfaces = state.surfaceUnits;
    if (surfaces && surfaces.length > 0) {
      ctx.lineWidth = 1.4;
      for (let i = 0; i < surfaces.length; i++) {
        const unit = surfaces[i];
        const px = toX(unit.x);
        const py = toY(unit.y);
        ctx.strokeStyle = unit.hp <= 0 ? '#475569' : (unit.team === 'hostile' ? '#f43f5e' : '#38bdf8');
        ctx.strokeRect(px - 4, py - 4, 8, 8);
        if (unit.hp > 0) {
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        }
      }
    }

    // Civilian airliner flights (Neutral transport silhouette with directional heading)
    const civilians = state.civilianTraffic;
    if (civilians && civilians.length > 0) {
      for (let i = 0; i < civilians.length; i++) {
        const civ = civilians[i];
        if (civ.hp <= 0) continue;
        const px = toX(civ.x);
        const py = toY(civ.y);
        ReplayMapRenderer.drawCivilianMarker(ctx, px, py, civ.heading || 0);
        if (width >= 460) {
          ctx.font = '600 8px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`CIV [${civ.flightCode || 'TRANSIT'}]`, px + 8, py - 4);
        }
      }
    }

    // Decoy drones (Directional miniature drone chevrons)
    const decoys = state.decoys;
    if (decoys && decoys.length > 0) {
      for (let i = 0; i < decoys.length; i++) {
        const d = decoys[i];
        if (d.hp <= 0) continue;
        const px = toX(d.x);
        const py = toY(d.y);
        const isBlue = (d.team === 'friendly');
        ReplayMapRenderer.drawDecoyMarker(ctx, px, py, d.heading || 0, isBlue);
      }
    }

    // Guided missiles
    const missiles = state.missiles;
    if (missiles && missiles.length > 0) {
      for (let i = 0; i < missiles.length; i++) {
        const m = missiles[i];
        const px = toX(m.x);
        const py = toY(m.y);
        const isBlue = (m.team === 'friendly');
        ReplayMapRenderer.drawMissileMarker(ctx, px, py, m.heading || 0, isBlue ? '#38bdf8' : '#f43f5e');
      }
    }

    // Allied aircraft
    const allies = state.alliedAircraft;
    if (allies && allies.length > 0) {
      for (let i = 0; i < allies.length; i++) {
        const a = allies[i];
        const px = toX(a.x);
        const py = toY(a.y);
        if (a.hp <= 0.05) {
          ReplayMapRenderer.drawWreckage(ctx, px, py, a.cleanCallsign || a.callsign);
          continue;
        }
        ReplayMapRenderer.drawAircraftMarker(ctx, px, py, a.heading, '#38bdf8', false, a.isFlightLead, true);
        if (width >= 460) {
          ReplayMapRenderer.drawAircraftLabel(ctx, px, py, a, '#38bdf8');
        }
      }
    }

    // Hostile aircraft
    const hostiles = state.hostileAircraft;
    if (hostiles && hostiles.length > 0) {
      for (let i = 0; i < hostiles.length; i++) {
        const h = hostiles[i];
        const px = toX(h.x);
        const py = toY(h.y);
        if (h.hp <= 0.05) {
          ReplayMapRenderer.drawWreckage(ctx, px, py, h.cleanCallsign || h.callsign);
          continue;
        }
        const color = h.isAce ? '#ffd700' : '#f43f5e';
        ReplayMapRenderer.drawAircraftMarker(ctx, px, py, h.heading, color, h.isAce, false, false);
        if (width >= 460) {
          ReplayMapRenderer.drawAircraftLabel(ctx, px, py, h, color);
        }
      }
    }

    // Replay header indicator
    ctx.font = '700 9.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`SORTIE REPLAY - ${ReplayMapRenderer.formatTime(state.time - startTime)}`, 10, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BLUE', width - 82, 16);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(width - 104, 10, 14, 2.5);
    ctx.fillStyle = '#f43f5e'; ctx.fillRect(width - 50, 10, 14, 2.5);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('RED', width - 32, 16);
  }

  static drawAircraftMarker(ctx, px, py, heading, color, isAce, isLead, isBlue = true) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(heading || 0);

    const size = isAce ? 8.0 : (isLead ? 7.0 : 6.0);
    const span = size * 0.9;

    ctx.beginPath();
    if (isBlue) {
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.7, -span);
      ctx.lineTo(-size * 0.25, 0);
      ctx.lineTo(-size * 0.7, span);
    } else {
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.35, -span);
      ctx.lineTo(-size * 0.75, 0);
      ctx.lineTo(-size * 0.35, span);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (isAce) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(-size * 1.1, -size * 1.1, size * 2.2, size * 2.2);
    } else if (isLead) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.9;
      ctx.strokeRect(-size * 0.95, -size * 0.95, size * 1.9, size * 1.9);
    }
    ctx.restore();
  }

  static drawCivilianMarker(ctx, px, py, heading) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(heading || 0);

    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(2, -1.8);
    ctx.lineTo(-2, -8);
    ctx.lineTo(-3.5, -8);
    ctx.lineTo(-1.5, -1.8);
    ctx.lineTo(-5, -1.5);
    ctx.lineTo(-7, -3.5);
    ctx.lineTo(-8.5, -3.5);
    ctx.lineTo(-7.5, 0);
    ctx.lineTo(-8.5, 3.5);
    ctx.lineTo(-7, 3.5);
    ctx.lineTo(-5, 1.5);
    ctx.lineTo(-1.5, 1.8);
    ctx.lineTo(-3.5, 8);
    ctx.lineTo(-2, 8);
    ctx.lineTo(2, 1.8);
    ctx.closePath();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.40)';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.restore();
  }

  static drawDecoyMarker(ctx, px, py, heading, isBlue) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(heading || 0);

    const color = isBlue ? '#c084fc' : '#f97316';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(4.5, 0);
    ctx.lineTo(-3, -3.5);
    ctx.lineTo(-1.2, 0);
    ctx.lineTo(-3, 3.5);
    ctx.closePath();
    ctx.fillStyle = isBlue ? 'rgba(192, 132, 252, 0.22)' : 'rgba(249, 115, 22, 0.22)';
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  static drawMissileMarker(ctx, px, py, heading, color) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(heading || 0);

    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(5.4, 0);
    ctx.lineTo(1.2, -1.8);
    ctx.lineTo(-3.6, -1.8);
    ctx.lineTo(-4.2, 0);
    ctx.lineTo(-3.6, 1.8);
    ctx.lineTo(1.2, 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  static drawWreckage(ctx, px, py, callsign) {
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(px - 4, py - 4);
    ctx.lineTo(px + 4, py + 4);
    ctx.moveTo(px + 4, py - 4);
    ctx.lineTo(px - 4, py + 4);
    ctx.stroke();

    if (callsign) {
      ctx.font = '600 8px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${callsign}`, px + 7, py - 2);
    }
  }

  static drawAircraftLabel(ctx, px, py, aircraft, color) {
    ctx.font = '600 8.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = color;
    const callsign = aircraft.cleanCallsign || aircraft.callsign || 'PILOT';
    const model = aircraft.model ? aircraft.model.split(' ')[0] : 'JET';
    ctx.fillText(aircraft.identified ? `${callsign} [${model}]` : 'BOGEY', px + 8, py - 6);
  }
}

window.ReplayMapRenderer = ReplayMapRenderer;