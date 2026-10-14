/**
 * AIRSPACE STANDOFF: Sortie Replay Tactical Map & Distinct Simple Arrow Renderer
 * Distinct simple arrows for friendly (delta arrow), hostile (swept diamond arrow), and missiles (forward kinetic dart).
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
    const point = (x, y) => ({ x: left + x * scaleX, y: top + y * scaleY });

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#030814';
    ctx.fillRect(left, top, fieldWidth, fieldHeight);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= mapWidth; x += 25) {
      const pTop = point(x, 0), pBottom = point(x, mapHeight);
      ctx.beginPath(); ctx.moveTo(pTop.x, pTop.y); ctx.lineTo(pTop.x, pBottom.y); ctx.stroke();
    }
    for (let y = 0; y <= mapHeight; y += 25) {
      const pLeft = point(0, y), pRight = point(mapWidth, y);
      ctx.beginPath(); ctx.moveTo(pLeft.x, pLeft.y); ctx.lineTo(pRight.x, pRight.y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeRect(left, top, fieldWidth, fieldHeight);

    (state.clouds || []).forEach(cloud => {
      const p = point(cloud.x, cloud.y);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, Math.max(3, cloud.rx * scaleX), Math.max(3, cloud.ry * scaleY), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 56, 80, 0.16)'; ctx.fill();
      ctx.strokeStyle = 'rgba(80, 110, 150, 0.25)'; ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);
    });

    (state.surfaceUnits || []).forEach(unit => {
      const p = point(unit.x, unit.y);
      ctx.strokeStyle = unit.hp <= 0 ? '#475569' : (unit.team === 'hostile' ? '#ef4444' : '#38bdf8');
      ctx.lineWidth = 1.4;
      ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
      if (unit.hp > 0) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
    });

    (state.civilianTraffic || []).forEach(civilian => {
      if (civilian.hp <= 0) return;
      const p = point(civilian.x, civilian.y);
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#7dd3fc'; ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.0; ctx.stroke();
    });

    (state.decoys || []).forEach(decoy => {
      if (decoy.hp <= 0) return;
      const p = point(decoy.x, decoy.y);
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#c084fc'; ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]);
    });

    (state.missiles || []).forEach(missile => {
      const p = point(missile.x, missile.y);
      const isBlue = (missile.team === 'friendly');
      const missileColor = isBlue ? '#38bdf8' : '#fb7185';
      ReplayMapRenderer.drawMissileMarker(ctx, p, missile.heading || 0, missileColor);
    });

    (state.alliedAircraft || []).forEach(aircraft => {
      const p = point(aircraft.x, aircraft.y);
      if (aircraft.hp <= 0.05) {
        ReplayMapRenderer.drawWreckage(ctx, p, aircraft);
        return;
      }
      ReplayMapRenderer.drawAircraftMarker(ctx, p, aircraft.heading, '#00f0ff', false, aircraft.isFlightLead, true);
      if (width >= 460) {
        ReplayMapRenderer.drawAircraftLabel(ctx, p, aircraft, '#00f0ff');
      }
    });

    (state.hostileAircraft || []).forEach(aircraft => {
      const p = point(aircraft.x, aircraft.y);
      if (aircraft.hp <= 0.05) {
        ReplayMapRenderer.drawWreckage(ctx, p, aircraft);
        return;
      }
      const color = aircraft.isAce ? '#ffd700' : '#f43f5e';
      ReplayMapRenderer.drawAircraftMarker(ctx, p, aircraft.heading, color, aircraft.isAce, false, false);
      if (width >= 460) {
        ReplayMapRenderer.drawAircraftLabel(ctx, p, aircraft, color);
      }
    });

    ctx.font = '700 9.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`SORTIE REPLAY - ${ReplayMapRenderer.formatTime(state.time - startTime)}`, 10, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BLUE', width - 82, 16);
    ctx.fillStyle = '#00f0ff'; ctx.fillRect(width - 104, 10, 14, 2.5);
    ctx.fillStyle = '#f43f5e'; ctx.fillRect(width - 50, 10, 14, 2.5);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('RED', width - 32, 16);
  }

  static drawAircraftMarker(ctx, position, heading, color, isAce, isLead, isBlue = true) {
    ctx.save();
    ctx.translate(position.x, position.y);
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

  static drawMissileMarker(ctx, position, heading, color) {
    ctx.save();
    ctx.translate(position.x, position.y);
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

  static drawWreckage(ctx, position, aircraft) {
    ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(position.x - 4, position.y - 4);
    ctx.lineTo(position.x + 4, position.y + 4);
    ctx.moveTo(position.x + 4, position.y - 4);
    ctx.lineTo(position.x - 4, position.y + 4);
    ctx.stroke();

    if (aircraft && aircraft.callsign) {
      ctx.font = '600 8px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      const cleanCallsign = String(aircraft.callsign).replace(/<[^>]*>/g, '');
      ctx.fillText(`${cleanCallsign} [LOST]`, position.x + 8, position.y - 3);
    }
    ctx.restore();
  }

  static drawAircraftLabel(ctx, position, aircraft, color) {
    ctx.font = '600 8.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = color;
    const callsign = aircraft.callsign || 'PILOT';
    const model = aircraft.model ? aircraft.model.split(' ')[0] : 'JET';
    ctx.fillText(aircraft.identified ? `${callsign} [${model}]` : 'BOGEY', position.x + 8, position.y - 6);
  }
}

window.ReplayMapRenderer = ReplayMapRenderer;