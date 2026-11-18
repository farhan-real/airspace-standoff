/**
 * AIRSPACE STANDOFF: Fleet Strength Over Time (Single Difference Line)
 * Dynamically scales vertical bounds for Skirmish, Dynamic, Attack IADS, and Custom Editor sorties.
 */

class FleetPowerRenderer {
  static renderCanvas(canvas, source, optionalBudgetMax) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let history = [];
    let maxBudget = 400;

    if (Array.isArray(source)) {
      history = source;
      maxBudget = Number(optionalBudgetMax) || 400;
    } else if (source && source.simulation) {
      history = (source.simulation.fleetStrengthHistory && source.simulation.fleetStrengthHistory.length > 0)
        ? source.simulation.fleetStrengthHistory : [];
      maxBudget = Number(source.budgetMax) || 400;
    } else if (source && typeof source === 'object') {
      history = Array.isArray(source.fleetPower) ? source.fleetPower : [];
      maxBudget = Number(source.budgetTier || source.budgetCap || optionalBudgetMax) || 400;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || 300);
    const h = Math.max(1, canvas.clientHeight || 190);

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    if (!history || history.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ACCUMULATING MATCH MOMENTUM...', w / 2, h / 2);
      return;
    }

    const isCompact = w < 500;
    const padL = w < 360 ? 40 : 48, padR = 16, padT = isCompact ? 29 : 18, padB = 22;
    const plotW = w - padL - padR, plotH = h - padT - padB, midY = padT + plotH / 2;

    let maxAbsDiff = 0;
    for (let i = 0; i < history.length; i++) {
      const d = Math.abs(history[i].blueCost - history[i].redCost);
      if (d > maxAbsDiff) maxAbsDiff = d;
    }
    const ceilingBudget = Math.max(150, maxBudget * 0.95, Math.ceil((maxAbsDiff * 1.15) / 50) * 50);

    const tStart = history[0].time, tEnd = history[history.length - 1].time;
    const tSpan = Math.max(5, tEnd - tStart);

    const toX = (t) => padL + ((t - tStart) / tSpan) * plotW;
    const toYDiff = (diff) => midY - (Math.max(-ceilingBudget, Math.min(ceilingBudget, diff)) / ceilingBudget) * (plotH / 2);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;

    const tickStep = ceilingBudget > 550 ? 200 : 100;
    for (let v = tickStep; v <= ceilingBudget; v += tickStep) {
      const yB = toYDiff(v);
      ctx.beginPath(); ctx.moveTo(padL, yB); ctx.lineTo(w - padR, yB); ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`+${v}M`, padL - 4, yB + 3);

      const yR = toYDiff(-v);
      ctx.beginPath(); ctx.moveTo(padL, yR); ctx.lineTo(w - padR, yR); ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`+${v}M`, padL - 4, yR + 3);
    }

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(w - padR, midY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(w < 360 ? 'PARITY' : '0 (PARITY)', padL - 4, midY + 3);

    const diffPoints = history.map(pt => ({ t: pt.time, diff: Number((pt.blueCost - pt.redCost).toFixed(1)) }));

    for (let i = 0; i < diffPoints.length - 1; i++) {
      const p1 = diffPoints[i], p2 = diffPoints[i + 1];
      const x1 = toX(p1.t), x2 = toX(p2.t), y1 = toYDiff(p1.diff), y2 = toYDiff(p2.diff);

      if (p1.diff >= 0 && p2.diff >= 0) {
        ctx.beginPath(); ctx.moveTo(x1, midY); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2, midY); ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)'; ctx.fill();
      } else if (p1.diff <= 0 && p2.diff <= 0) {
        ctx.beginPath(); ctx.moveTo(x1, midY); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2, midY); ctx.closePath();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.32)'; ctx.fill();
      } else {
        const span = p2.diff - p1.diff;
        const frac = span !== 0 ? (0 - p1.diff) / span : 0.5;
        const crossX = toX(p1.t + frac * (p2.t - p1.t));
        ctx.beginPath(); ctx.moveTo(x1, midY); ctx.lineTo(x1, y1); ctx.lineTo(crossX, midY); ctx.closePath();
        ctx.fillStyle = p1.diff > 0 ? 'rgba(56, 189, 248, 0.32)' : 'rgba(244, 63, 94, 0.32)'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(crossX, midY); ctx.lineTo(x2, y2); ctx.lineTo(x2, midY); ctx.closePath();
        ctx.fillStyle = p2.diff > 0 ? 'rgba(56, 189, 248, 0.32)' : 'rgba(244, 63, 94, 0.32)'; ctx.fill();
      }
    }

    for (let i = 0; i < diffPoints.length - 1; i++) {
      const p1 = diffPoints[i], p2 = diffPoints[i + 1];
      ctx.beginPath(); ctx.moveTo(toX(p1.t), toYDiff(p1.diff)); ctx.lineTo(toX(p2.t), toYDiff(p2.diff));
      ctx.strokeStyle = ((p1.diff + p2.diff) / 2) >= 0 ? '#00f0ff' : '#f43f5e';
      ctx.lineWidth = 2.0; ctx.stroke();
    }

    const last = history[history.length - 1];
    const curDiff = last.blueCost - last.redCost;
    const isAdvBlue = curDiff >= 0;

    let advantageText = w < 300 ? 'EVEN PARITY' : 'EVEN COMBAT PARITY';
    let advantageColor = '#00f5a0';
    if (Math.abs(curDiff) >= 0.5) {
      advantageText = isAdvBlue
        ? (w < 300 ? `BLUE +$${curDiff.toFixed(1)}M` : `BLUE ADVANTAGE: +$${curDiff.toFixed(1)}M`)
        : (w < 300 ? `RED +$${Math.abs(curDiff).toFixed(1)}M` : `RED ADVANTAGE: +$${Math.abs(curDiff).toFixed(1)}M`);
      advantageColor = isAdvBlue ? '#00f0ff' : '#f43f5e';
    }

    if (isCompact) {
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center'; ctx.fillStyle = advantageColor; ctx.fillText(advantageText, w / 2, 11);
      ctx.textAlign = 'left'; ctx.fillStyle = '#38bdf8';
      ctx.fillText(w < 350 ? `BLUE: $${last.blueCost.toFixed(1)}M` : `BLUE FLEET: $${last.blueCost.toFixed(1)}M`, padL, 22);
      ctx.textAlign = 'right'; ctx.fillStyle = '#f43f5e';
      ctx.fillText(w < 350 ? `RED: $${last.redCost.toFixed(1)}M` : `RED FLEET: $${last.redCost.toFixed(1)}M`, w - padR, 22);
    } else {
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left'; ctx.fillStyle = '#38bdf8'; ctx.fillText(`BLUE FLEET: $${last.blueCost.toFixed(1)}M`, padL + 4, padT - 5);
      ctx.textAlign = 'right'; ctx.fillStyle = '#f43f5e'; ctx.fillText(`RED FLEET: $${last.redCost.toFixed(1)}M`, w - padR - 4, padT - 5);
      ctx.textAlign = 'center'; ctx.fillStyle = advantageColor; ctx.fillText(advantageText, w / 2, padT - 5);
    }

    ctx.fillStyle = '#64748b'; ctx.font = '600 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left'; ctx.fillText('SORTIE LAUNCH', padL, h - padB + 13);
    ctx.textAlign = 'right'; ctx.fillText('SORTIE END', padL + plotW, h - padB + 13);
  }
}

window.FleetPowerRenderer = FleetPowerRenderer;
