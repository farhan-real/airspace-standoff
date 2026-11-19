/**
 * js/ui/modals/savemap.js - Saved Game Tactical Radar Snapshot & Roster Renderer.
 */

class SaveMapRenderer {
  static draw(canvas, save) {
    if (!canvas || !save) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = Math.max(240, canvas.clientWidth || 640);
    const height = Math.max(150, canvas.clientHeight || 200);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mapW = save.mapW || (save.scenarioMode === 'ATTACK' ? window.CONFIG.ATTACK_WIDTH_KM : window.CONFIG.SKIRMISH_WIDTH_KM);
    const mapH = save.mapH || (save.scenarioMode === 'ATTACK' ? window.CONFIG.ATTACK_HEIGHT_KM : window.CONFIG.SKIRMISH_HEIGHT_KM);
    const pad = 16;
    const scaleX = (width - pad * 2) / mapW;
    const scaleY = (height - pad * 2) / mapH;
    const toX = x => pad + x * scaleX;
    const toY = y => pad + y * scaleY;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#030814';
    ctx.fillRect(pad, pad, mapW * scaleX, mapH * scaleY);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= mapW; x += 25) {
      ctx.moveTo(toX(x), pad);
      ctx.lineTo(toX(x), pad + mapH * scaleY);
    }
    for (let y = 0; y <= mapH; y += 25) {
      ctx.moveTo(pad, toY(y));
      ctx.lineTo(pad + mapW * scaleX, toY(y));
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 245, 160, 0.35)';
    ctx.setLineDash([4, 4]);
    const rtbX = toX(window.CONFIG.RTB_CORRIDOR_X_KM);
    ctx.beginPath();
    ctx.moveTo(rtbX, pad);
    ctx.lineTo(rtbX, pad + mapH * scaleY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeRect(pad, pad, mapW * scaleX, mapH * scaleY);

    (save.weatherClouds || []).forEach(c => {
      ctx.beginPath();
      ctx.ellipse(toX(c.x), toY(c.y), Math.max(3, c.rx * scaleX), Math.max(3, c.ry * scaleY), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 56, 80, 0.18)';
      ctx.fill();
    });

    (save.surfaceUnits || []).forEach(s => {
      const px = toX(s.x), py = toY(s.y);
      ctx.strokeStyle = s.hp <= 0.05 ? '#475569' : (s.isPrimaryObjective ? '#ffd700' : (s.team === 'hostile' ? '#f43f5e' : '#38bdf8'));
      ctx.lineWidth = 1.2;
      ctx.strokeRect(px - 3.5, py - 3.5, 7, 7);
    });

    (save.missiles || []).forEach(m => {
      if (m.isDead) return;
      ctx.fillStyle = m.team === 'friendly' ? '#38bdf8' : '#fb7185';
      ctx.beginPath();
      ctx.arc(toX(m.x), toY(m.y), 2.0, 0, Math.PI * 2);
      ctx.fill();
    });

    const drawAircraft = (ac, isBlue) => {
      const px = toX(ac.x), py = toY(ac.y);
      if (ac.hp <= 0.05) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(px - 3.5, py - 3.5); ctx.lineTo(px + 3.5, py + 3.5);
        ctx.moveTo(px + 3.5, py - 3.5); ctx.lineTo(px - 3.5, py + 3.5);
        ctx.stroke();
        return;
      }
      const color = ac.isAce ? '#ffd700' : (isBlue ? '#00f0ff' : '#f43f5e');
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ac.heading || 0);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(6.5, 0); ctx.lineTo(-4.5, -4.5); ctx.lineTo(-2, 0); ctx.lineTo(-4.5, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (width >= 420) {
        ctx.font = '600 8px "JetBrains Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(ac.callsign || ac.specId, px + 8, py - 3);
      }
    };

    (save.alliedAircraft || []).forEach(a => drawAircraft(a, true));
    (save.hostileAircraft || []).forEach(h => drawAircraft(h, false));
  }

  static renderUnitList(units, isBlue) {
    if (!units || units.length === 0) {
      return '<div class="saveload-unit-pos">No aircraft in force</div>';
    }
    return units.map(ac => {
      const alive = ac.hp > 0.05;
      const hpText = alive ? `ALIVE (${Math.max(1, Math.round(ac.hp))}/${ac.maxHp} HP)` : 'DESTROYED';
      const statusCol = alive ? (ac.isRTB ? '#fbbf24' : '#00f5a0') : '#f43f5e';
      const tag = ac.isAce ? ' [ACE]' : (ac.isFlightLead ? ' [LEAD]' : '');
      const rtbTag = (alive && ac.isRTB) ? ' [RTB]' : '';
      const phaseTag = (alive && ac.groundPhase) ? ` [${ac.groundPhase}]` : '';
      const fl = Math.round((ac.altFt || 0) / 100);
      const posStr = alive
        ? `(${ac.x.toFixed(1)}, ${ac.y.toFixed(1)}) km | FL${fl} | M ${(ac.speed || 0).toFixed(2)}`
        : `LOST AT (${ac.x.toFixed(1)}, ${ac.y.toFixed(1)}) km`;

      return `
        <div class="saveload-unit-row ${isBlue ? 'blue' : 'red'} ${alive ? '' : 'dead'}">
          <div class="saveload-unit-main">
            <b>${ac.callsign || ac.specId} (${ac.specId})${tag}${rtbTag}${phaseTag}</b>
            <span class="saveload-unit-pos">${posStr}</span>
          </div>
          <span class="saveload-unit-status" style="color:${statusCol};">${hpText}</span>
        </div>`;
    }).join('');
  }
}

window.SaveMapRenderer = SaveMapRenderer;
