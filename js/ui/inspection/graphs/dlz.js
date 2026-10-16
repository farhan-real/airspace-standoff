/**
 * AIRSPACE STANDOFF: Dynamic Launch Zone (DLZ) and Pk vs Range Graph
 */

class DLZGraphRenderer {
  static getCanvasPoints(canvas, count = 75) {
    return {
      w: Math.max(1, canvas.clientWidth || 300),
      h: Math.max(1, canvas.clientHeight || 180),
      samples: count
    };
  }

  static renderCanvas(canvas, shooter, target, weapon) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const { w, h, samples } = this.getCanvasPoints(canvas);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padL = 36;
    const padR = 14;
    const padT = 16;
    const padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    if (!weapon || !shooter) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NO WEAPON SELECTED FOR DLZ CALCULATION', w / 2, h / 2);
      return;
    }

    const rMax = Math.max(10, weapon.rangeKm || 60);
    const minArmKm = weapon.minRangeKm || 1.0;
    const nezMinKm = weapon.sweetSpotMin || (rMax * 0.20);
    const nezMaxKm = weapon.sweetSpotMax || (rMax * 0.65);
    const xMax = rMax * 1.05;

    const toX = (km) => padL + (Math.max(0, Math.min(km, xMax)) / xMax) * plotW;
    const toY = (pk) => padT + (1 - Math.max(0, Math.min(pk, 100)) / 100) * plotH;

    // Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    [0, 25, 50, 75, 100].forEach(p => {
      const y = toY(p);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '600 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${p}%`, padL - 4, y + 3);
    });

    // Shaded Zones
    // Min Arming Gate (Red)
    const minX0 = toX(0);
    const minX1 = toX(minArmKm);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
    ctx.fillRect(minX0, padT, Math.max(2, minX1 - minX0), plotH);

    // No Escape Zone (Green)
    const nezX0 = toX(nezMinKm);
    const nezX1 = toX(nezMaxKm);
    ctx.fillStyle = 'rgba(0, 245, 160, 0.14)';
    ctx.fillRect(nezX0, padT, Math.max(2, nezX1 - nezX0), plotH);

    // Ballistic Coast (Amber)
    const coastX0 = toX(nezMaxKm);
    const coastX1 = toX(rMax);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
    ctx.fillRect(coastX0, padT, Math.max(2, coastX1 - coastX0), plotH);

    // Zone labels at top
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.fillText('MIN', (minX0 + minX1) / 2, padT - 4);
    ctx.fillStyle = 'rgba(0, 245, 160, 0.85)';
    ctx.fillText('NO-ESCAPE ZONE (NEZ)', (nezX0 + nezX1) / 2, padT - 4);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.fillText('COAST', (coastX0 + coastX1) / 2, padT - 4);

    // Compute Pk Curve Points
    const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];
    const curve = [];
    const lambda = weapon.lambda !== undefined ? weapon.lambda : 0.40;
    const pExp = weapon.p !== undefined ? weapon.p : 1.0;
    const baseT0 = weapon.T_0 || 0.80;

    let targetDefense = 0.0;
    let thermalModifier = 0.0;
    if (target) {
      const isManeuvering = (target.activeManeuverTimer > 0 && target.glocTimer <= 0);
      targetDefense = isManeuvering ? (target.activeManeuverBonus || 0.35) : 0.0;
      if (weapon.seeker === 'IIR' || weapon.seeker === 'EO' || weapon.seeker === 'OPT') {
        const targetTherm = Number(target.thermalBloom !== undefined ? target.thermalBloom : 1.0);
        thermalModifier = (targetTherm - 1.0) * 0.22;
      }
    }

    for (let i = 0; i <= samples; i++) {
      const d = (i / samples) * xMax;
      let pk = 0;
      if (d >= minArmKm && d <= rMax) {
        const norm = Math.max(0, Math.min(1, d / rMax));
        let rangeScore = Math.max(0.20, 1.0 - lambda * Math.pow(norm, pExp));
        if (weapon.trait === 'DUAL_PULSE_SURGE' && (d <= 25.0 || norm >= 0.60)) {
          rangeScore = Math.min(1.0, rangeScore + 0.16);
        }
        const raw = (baseT0 * rangeScore - targetDefense + thermalModifier) * 100;
        pk = Math.round(Math.max(15, Math.min(95, raw)));
      } else if (d < minArmKm) {
        pk = 10;
      }
      curve.push({ km: d, pk });
    }

    // Draw area fill
    ctx.beginPath();
    ctx.moveTo(toX(curve[0].km), toY(0));
    curve.forEach(pt => ctx.lineTo(toX(pt.km), toY(pt.pk)));
    ctx.lineTo(toX(curve[curve.length - 1].km), toY(0));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    curve.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(toX(pt.km), toY(pt.pk));
      else ctx.lineTo(toX(pt.km), toY(pt.pk));
    });
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Live Target Distance Cursor
    if (target && typeof target.x === 'number') {
      const curDist = Math.hypot(target.x - shooter.x, target.y - shooter.y);
      const curX = toX(curDist);
      const pkModel = (typeof Physics !== 'undefined') ? Physics.calcPk(weapon, shooter, target, clouds) : { pk: 0 };
      const curPk = pkModel.pk || 0;
      const curY = toY(curPk);

      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(curX, padT);
      ctx.lineTo(curX, padT + plotH);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = curDist > xMax * 0.65 ? 'right' : 'left';
      const offset = curDist > xMax * 0.65 ? -8 : 8;
      ctx.fillText(`R: ${curDist.toFixed(1)}km [${curPk}% Pk]`, curX + offset, curY - 6);
    }

    // X Axis ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const tickInterval = rMax >= 100 ? 25 : (rMax >= 50 ? 15 : 10);
    for (let km = 0; km <= xMax; km += tickInterval) {
      ctx.fillText(`${km}km`, toX(km), h - padB + 13);
    }
  }
}

window.DLZGraphRenderer = DLZGraphRenderer;