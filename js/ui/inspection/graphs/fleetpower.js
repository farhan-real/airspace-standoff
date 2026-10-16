/**
 * AIRSPACE STANDOFF: Fleet Strength Over Time (Single Difference Line)
 * Difference line: Positive Y = Blue Advantage ($M), Negative Y = Red Advantage ($M)
 */

class FleetPowerRenderer {
  static renderCanvas(canvas, game) {
    if (!canvas || !game) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const padL = 48;
    const padR = 16;
    const padT = 18;
    const padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const midY = padT + plotH / 2;

    const history = (game.simulation && game.simulation.fleetStrengthHistory) || [];
    if (history.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ACCUMULATING MATCH MOMENTUM...', w / 2, h / 2);
      return;
    }

    const maxBudget = Math.max(150, (game.budgetMax || 400) * 0.95);
    const tStart = history[0].time;
    const tEnd = history[history.length - 1].time;
    const tSpan = Math.max(5, tEnd - tStart);

    const toX = (t) => padL + ((t - tStart) / tSpan) * plotW;
    const toYDiff = (diff) => midY - (Math.max(-maxBudget, Math.min(maxBudget, diff)) / maxBudget) * (plotH / 2);

    // Horizontal Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;

    [100, 200, 300].filter(v => v <= maxBudget).forEach(v => {
      // Upper half: Blue Advantage (+v M)
      const yB = toYDiff(v);
      ctx.beginPath(); ctx.moveTo(padL, yB); ctx.lineTo(w - padR, yB); ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`+${v}M`, padL - 4, yB + 3);

      // Lower half: Red Advantage (+v M for Red)
      const yR = toYDiff(-v);
      ctx.beginPath(); ctx.moveTo(padL, yR); ctx.lineTo(w - padR, yR); ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`+${v}M`, padL - 4, yR + 3);
    });

    // Zero Parity Baseline
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, midY);
    ctx.lineTo(w - padR, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('0 (PARITY)', padL - 4, midY + 3);

    // Build dense path segments with zero-crossing interpolation
    const diffPoints = history.map(pt => ({
      t: pt.time,
      diff: Number((pt.blueCost - pt.redCost).toFixed(1))
    }));

    // Area Fills for Positive (Blue) and Negative (Red) Lobes
    for (let i = 0; i < diffPoints.length - 1; i++) {
      const p1 = diffPoints[i];
      const p2 = diffPoints[i + 1];
      const x1 = toX(p1.t);
      const x2 = toX(p2.t);
      const y1 = toYDiff(p1.diff);
      const y2 = toYDiff(p2.diff);

      if (p1.diff >= 0 && p2.diff >= 0) {
        ctx.beginPath();
        ctx.moveTo(x1, midY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, midY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
        ctx.fill();
      } else if (p1.diff <= 0 && p2.diff <= 0) {
        ctx.beginPath();
        ctx.moveTo(x1, midY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, midY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.32)';
        ctx.fill();
      } else {
        // Zero crossing interpolation
        const span = p2.diff - p1.diff;
        const frac = span !== 0 ? (0 - p1.diff) / span : 0.5;
        const crossT = p1.t + frac * (p2.t - p1.t);
        const crossX = toX(crossT);

        // First half
        ctx.beginPath();
        ctx.moveTo(x1, midY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(crossX, midY);
        ctx.closePath();
        ctx.fillStyle = p1.diff > 0 ? 'rgba(56, 189, 248, 0.32)' : 'rgba(244, 63, 94, 0.32)';
        ctx.fill();

        // Second half
        ctx.beginPath();
        ctx.moveTo(crossX, midY);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, midY);
        ctx.closePath();
        ctx.fillStyle = p2.diff > 0 ? 'rgba(56, 189, 248, 0.32)' : 'rgba(244, 63, 94, 0.32)';
        ctx.fill();
      }
    }

    // Single Difference Stroke Line
    for (let i = 0; i < diffPoints.length - 1; i++) {
      const p1 = diffPoints[i];
      const p2 = diffPoints[i + 1];
      const x1 = toX(p1.t);
      const x2 = toX(p2.t);
      const y1 = toYDiff(p1.diff);
      const y2 = toYDiff(p2.diff);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = ((p1.diff + p2.diff) / 2) >= 0 ? '#00f0ff' : '#f43f5e';
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }

    // Clean Telemetry Header Callouts (Raw Fleet Asset Values without signs)
    const last = history[history.length - 1];
    const curDiff = last.blueCost - last.redCost;
    const isAdvBlue = curDiff >= 0;

    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`BLUE FLEET: $${last.blueCost.toFixed(1)}M`, padL + 4, padT - 5);

    ctx.fillStyle = '#f43f5e';
    ctx.textAlign = 'right';
    ctx.fillText(`RED FLEET: $${last.redCost.toFixed(1)}M`, w - padR - 4, padT - 5);

    // Center Net Advantage Callout (Always Positive for the Leading Team)
    ctx.textAlign = 'center';
    if (Math.abs(curDiff) < 0.5) {
      ctx.fillStyle = '#00f5a0';
      ctx.fillText('EVEN COMBAT PARITY', w / 2, padT - 5);
    } else if (isAdvBlue) {
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`BLUE ADVANTAGE: +$${curDiff.toFixed(1)}M`, w / 2, padT - 5);
    } else {
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`RED ADVANTAGE: +$${Math.abs(curDiff).toFixed(1)}M`, w / 2, padT - 5);
    }

    // Time Axis
    ctx.fillStyle = '#64748b';
    ctx.font = '600 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SORTIE LAUNCH', padL, h - padB + 13);
    ctx.fillText('CURRENT MATCH TIME', padL + plotW, h - padB + 13);
  }
}

window.FleetPowerRenderer = FleetPowerRenderer;