/**
 * AIRSPACE STANDOFF: Rolling Speed & Altitude History Graph
 * Distinct high-contrast colors: Electric Cyan for airspeed, Vivid Amber for altitude.
 */

class HistoryGraphRenderer {
  static renderCanvas(canvas, aircraft) {
    if (!canvas || !aircraft) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || 300);
    const h = Math.max(1, canvas.clientHeight || 170);

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    const padL = 36;
    const padR = 42;
    const padT = 16;
    const padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const history = aircraft.flightHistory || [];
    if (history.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ACCUMULATING FLIGHT HISTORY...', w / 2, h / 2);
      return;
    }

    const tEnd = history[history.length - 1].time;
    const tStart = Math.max(history[0].time, tEnd - 60);
    const tSpan = Math.max(5, tEnd - tStart);

    const maxMach = 2.4;
    const maxAltFt = 60000;

    const toX = (t) => padL + ((t - tStart) / tSpan) * plotW;
    const toYSpd = (spd) => padT + (1 - Math.max(0, Math.min(spd, maxMach)) / maxMach) * plotH;
    const toYAlt = (alt) => padT + (1 - Math.max(0, Math.min(alt, maxAltFt)) / maxAltFt) * plotH;

    // Grid lines for speed (Left / Cyan)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
    ctx.lineWidth = 1;
    [0.5, 1.0, 1.5, 2.0].forEach(mach => {
      const y = toYSpd(mach);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`M${mach.toFixed(1)}`, padL - 4, y + 3);
    });

    // Grid labels for altitude (Right / Vivid Amber)
    [15000, 30000, 45000].forEach(alt => {
      const y = toYAlt(alt);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FL${alt / 100}`, w - padR + 4, y + 3);
    });

    // Reference Corner Speed Line (Dashed Green)
    const sOpt = (typeof aircraft.getOptimalCornerSpeed === 'function')
      ? aircraft.getOptimalCornerSpeed()
      : ((aircraft.spec && aircraft.spec.sOpt) ? aircraft.spec.sOpt : 0.85);
    const optY = toYSpd(sOpt);

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, optY);
    ctx.lineTo(w - padR, optY);
    ctx.stroke();
    ctx.restore();

    // Altitude Line (Vivid Amber)
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = toX(pt.time);
      const y = toYAlt(pt.altFt || 0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Airspeed Line (Electric Cyan)
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = toX(pt.time);
      const y = toYSpd(pt.speed || 0.8);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Legend Header Callouts
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`AIRSPEED: M ${(aircraft.speed || 0.8).toFixed(2)}`, padL + 4, padT - 4);

    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'right';
    ctx.fillText(`ALTITUDE: FL${Math.round((aircraft.altFt || 0) / 100)}`, w - padR - 4, padT - 4);

    // X Axis Reference
    ctx.fillStyle = '#64748b';
    ctx.font = '600 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('-60s', padL, h - padB + 13);
    ctx.fillText('-30s', padL + plotW / 2, h - padB + 13);
    ctx.fillText('LIVE MOMENT', padL + plotW, h - padB + 13);
  }
}

window.HistoryGraphRenderer = HistoryGraphRenderer;