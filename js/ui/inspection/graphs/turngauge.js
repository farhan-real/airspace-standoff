/**
 * AIRSPACE STANDOFF: Dynamic Turn Speed Gauge
 * Sizes/percentages based on how big the zone is relative to available speeds.
 */

class TurnGaugeRenderer {
  static renderCanvas(canvas, aircraft) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || 300);
    const h = Math.max(1, canvas.clientHeight || 240);

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    if (!aircraft || !aircraft.spec) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SELECT AN AIRCRAFT TO DISPLAY TURN SPEED GAUGE', w / 2, h / 2);
      return;
    }

    // Geometry calibrated with generous 22px+ clearance from top legend
    const cx = w / 2;
    const cy = Math.round(h * 0.55);
    const radius = Math.min(cx - 36, cy - 46);

    const vMin = 0.20;
    const vMax = Math.max(1.20, (aircraft.effectiveMaxSpeed || (aircraft.spec && aircraft.spec.S_0) || 1.20) * 1.12);
    const sOpt = (typeof aircraft.getOptimalCornerSpeed === 'function')
      ? aircraft.getOptimalCornerSpeed()
      : ((aircraft.spec && aircraft.spec.sOpt) ? aircraft.spec.sOpt : 0.85);

    const optLow = Math.max(vMin + 0.04, sOpt * 0.88);
    const optHigh = Math.min(vMax - 0.04, sOpt * 1.12);
    const speedSpan = Math.max(0.1, vMax - vMin);

    const fracUnder = Math.max(0.06, (optLow - vMin) / speedSpan);
    const fracOpt = Math.max(0.08, (optHigh - optLow) / speedSpan);
    const fracOver = Math.max(0.06, (vMax - optHigh) / speedSpan);
    const sumFrac = fracUnder + fracOpt + fracOver;
    const nUnder = fracUnder / sumFrac;
    const nOpt = fracOpt / sumFrac;

    // Semicircle arc running from 180 deg to 360 deg
    const startAng = Math.PI;
    const totalAng = Math.PI;
    const endAng = Math.PI * 2;

    const angUnderEnd = startAng + totalAng * nUnder;
    const angOptEnd = angUnderEnd + totalAng * nOpt;
    const angSOpt = angUnderEnd + (angOptEnd - angUnderEnd) * 0.5;

    const curSpeed = (typeof aircraft.speed === 'number' && !isNaN(aircraft.speed)) ? aircraft.speed : 0.85;
    const curFrac = Math.max(0, Math.min(1, (curSpeed - vMin) / speedSpan));
    const needleAng = startAng + totalAng * curFrac;

    // 1. Top Legend Bar with clear vertical clearance from dial
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';

    const pUnder = Math.round(nUnder * 100);
    const pOpt = Math.round(nOpt * 100);
    const pOver = Math.round((1 - nUnder - nOpt) * 100);

    const legY = 15;

    // Under-speed legend (Left)
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.arc(14, legY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillText(`UNDER (${pUnder}%)`, 22, legY);

    // Optimal legend (Center)
    ctx.fillStyle = '#00f5a0';
    ctx.beginPath(); ctx.arc(cx - 36, legY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillText(`OPTIMAL (${pOpt}%)`, cx - 28, legY);

    // Over-speed legend (Right)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(w - 76, legY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillText(`OVER (${pOver}%)`, w - 68, legY);

    // 2. Dial Arc Segments
    const arcW = 10;

    // Under-speed segment (Amber)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAng, angUnderEnd);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = arcW;
    ctx.stroke();

    // Optimal corner speed segment (Green Glow)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, angUnderEnd, angOptEnd);
    ctx.strokeStyle = '#00f5a0';
    ctx.lineWidth = arcW + 2;
    ctx.stroke();

    // Over-speed segment (Sky Blue)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, angOptEnd, endAng);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = arcW;
    ctx.stroke();

    // 3. Speed Boundary Ticks on the Arc
    const drawDialTick = (ang, labelText, align, baseline, color, isPeak = false) => {
      const extraLen = isPeak ? 4 : 2;
      const x1 = cx + Math.cos(ang) * (radius - arcW / 2 - extraLen);
      const y1 = cy + Math.sin(ang) * (radius - arcW / 2 - extraLen);
      const x2 = cx + Math.cos(ang) * (radius + arcW / 2 + extraLen);
      const y2 = cy + Math.sin(ang) * (radius + arcW / 2 + extraLen);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isPeak ? '#00f5a0' : '#ffffff';
      ctx.lineWidth = isPeak ? 2.0 : 1.4;
      ctx.stroke();

      if (labelText) {
        const tx = cx + Math.cos(ang) * (radius + arcW / 2 + 8);
        const ty = cy + Math.sin(ang) * (radius + arcW / 2 + 8);
        ctx.fillStyle = color || '#94a3b8';
        ctx.font = isPeak ? '700 8px "JetBrains Mono", monospace' : '600 7.5px "JetBrains Mono", monospace';
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(labelText, tx, ty);
      }
    };

    drawDialTick(startAng, `Mach ${vMin.toFixed(1)}`, 'right', 'middle', '#64748b');
    drawDialTick(angUnderEnd, `Mach ${optLow.toFixed(2)}`, 'right', 'bottom', '#fef08a');
    // 100% Turn Rate Speed Indicator (sOpt pinnacle peak)
    drawDialTick(angSOpt, `Mach ${sOpt.toFixed(2)}`, 'center', 'bottom', '#00f5a0', true);
    drawDialTick(angOptEnd, `Mach ${optHigh.toFixed(2)}`, 'left', 'bottom', '#bae6fd');
    drawDialTick(endAng, `Mach ${vMax.toFixed(1)}`, 'left', 'middle', '#64748b');

    // 4. Needle Pointer (strictly pointing to angle)
    const needleLen = radius - 3;
    const nx = cx + Math.cos(needleAng) * needleLen;
    const ny = cy + Math.sin(needleAng) * needleLen;
    const perp = needleAng + Math.PI / 2;
    const bw = 3.5;
    const bx1 = cx + Math.cos(perp) * bw;
    const by1 = cy + Math.sin(perp) * bw;
    const bx2 = cx - Math.cos(perp) * bw;
    const by2 = cy - Math.sin(perp) * bw;

    ctx.beginPath();
    ctx.moveTo(bx1, by1);
    ctx.lineTo(nx, ny);
    ctx.lineTo(bx2, by2);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 5. Dynamic Live Turn Efficiency & Rate Calculation (Updates with Speed & Stress)
    const isGloc = Boolean(aircraft.glocTimer && aircraft.glocTimer > 0);
    const isCoffin = Boolean(aircraft.isCoffin);

    // Aerodynamic turn efficiency scales live with airspeed relative to sOpt
    let turnEff = (typeof Physics !== 'undefined' && Physics.calcTurnEfficiency)
      ? Physics.calcTurnEfficiency(curSpeed, sOpt)
      : 1.0;

    if (aircraft.stress >= 0.65 && !isCoffin && !aircraft.spec.isDrone) {
      turnEff *= 0.70;
    }

    const turnPct = isGloc ? 0 : Math.round(Math.max(0.40, Math.min(1.0, turnEff)) * 100);

    // Physical peak turn rate in deg/s at corner velocity
    let baseAgi = (aircraft.spec && aircraft.spec.AGI_0) ? aircraft.spec.AGI_0 : 0.85;
    if (aircraft.turnBonus) baseAgi += aircraft.turnBonus;
    if (aircraft.thrustVector) baseAgi *= 1.20;
    if (isCoffin) baseAgi *= 1.20;
    if (aircraft.Wr) baseAgi *= Math.max(0.45, 1.0 - 0.30 * aircraft.Wr);

    const peakTurnRateDeg = baseAgi * 2.0 * (180 / Math.PI);
    const turnRateDeg = isGloc ? 0 : (peakTurnRateDeg * (turnPct / 100));

    let stateLabel = 'OPTIMAL: 100% TURN AUTHORITY';
    let stateColor = '#00f5a0';
    let badgeBg = 'rgba(0, 245, 160, 0.12)';
    let badgeBorder = 'rgba(0, 245, 160, 0.40)';

    if (isCoffin) {
      stateLabel = 'COFFIN SYNTHETIC VISION: 100% TURN RATE LOCKED';
      stateColor = '#00f0ff';
      badgeBg = 'rgba(0, 240, 255, 0.14)';
      badgeBorder = 'rgba(0, 240, 255, 0.45)';
    } else if (curSpeed < optLow) {
      stateLabel = `UNDER-SPEED: SLUGGISH TURNS (${turnPct}% EFFICIENCY)`;
      stateColor = '#f97316';
      badgeBg = 'rgba(249, 115, 22, 0.12)';
      badgeBorder = 'rgba(249, 115, 22, 0.40)';
    } else if (curSpeed > optHigh) {
      stateLabel = `OVER-SPEED: WIDE RADIUS (${turnPct}% EFFICIENCY)`;
      stateColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.12)';
      badgeBorder = 'rgba(56, 189, 248, 0.40)';
    }

    // 6. Tiered Bottom Telemetry (Each Metric on its Own Dedicated Line)
    // Row 1: Digital Mach Readout
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Mach ${curSpeed.toFixed(2)}`, cx, cy + 22);

    // Row 2: Turn Rate on its own line showing BOTH number and percentage
    ctx.font = '700 11.5px "JetBrains Mono", monospace';
    ctx.fillStyle = isGloc ? '#f43f5e' : (turnPct >= 88 ? '#00f5a0' : (curSpeed < optLow ? '#f97316' : '#38bdf8'));
    const turnRateLabel = isGloc
      ? 'TURN RATE: 0.0°/s (0% G-LOC)'
      : `TURN RATE: ${turnRateDeg.toFixed(1)}°/s (${turnPct}%)`;
    ctx.fillText(turnRateLabel, cx, cy + 39);

    // Row 3: Tactical Status Badge Pill
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(stateLabel).width;
    const badgeW = Math.min(w - 24, textWidth + 18);
    const badgeH = 17;
    const badgeX = cx - badgeW / 2;
    const badgeY = cy + 47;

    ctx.fillStyle = badgeBg;
    ctx.strokeStyle = badgeBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = stateColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stateLabel, cx, badgeY + badgeH / 2);

    // Row 4: Technical Corner Velocity Reference Strip
    const bottomY = cy + 78;
    ctx.font = '600 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`sOpt Mach ${sOpt.toFixed(2)} [Mach ${optLow.toFixed(2)} - Mach ${optHigh.toFixed(2)}] | G-TOLERANCE: ${(aircraft.spec && aircraft.spec.G_limit ? aircraft.spec.G_limit : 9.0).toFixed(1)}G`, cx, bottomY);
  }
}

window.TurnGaugeRenderer = TurnGaugeRenderer;