/**
 * js/ui/inspection/graphs/surfacegraphs.js - Inspection Graphs for Ground Installations & IADS Batteries
 */

class InspectionSurfaceGraphs {
  static renderPolarCoverage(canvas, s, game) {
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || 300);
    const h = Math.max(1, canvas.clientHeight || 210);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 6;
    const radius = Math.min(cx - 28, cy - 22);
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : { hasEwCue: true, hasLowAltCue: false, ambushRatio: 1.0 };
    const isAttack = (game && game.scenarioMode === 'ATTACK');
    const effRange = (s.requiresEwCue && isAttack && !mods.hasEwCue) ? s.rangeKm * 0.48 : s.rangeKm;
    const ambushKm = effRange * (isAttack ? mods.ambushRatio : 1.0);
    const maxScaleKm = Math.max(40, s.rangeKm * 1.25, 110);
    const toR = (km) => Math.min(radius, (Math.max(0, km) / maxScaleKm) * radius);

    [25, 50, 75, 100].filter(km => km <= maxScaleKm).forEach(km => {
      const r = toR(km);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '600 8px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${km}km`, cx + 3, cy - r + 9);
    });

    if (s.rangeKm > 0 && s.emconTimer <= 0) {
      const rOuter = toR(effRange);
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      ctx.fillStyle = s.isJammerStation ? 'rgba(168, 85, 247, 0.12)' : 'rgba(244, 63, 94, 0.10)';
      ctx.fill();
      ctx.strokeStyle = s.isJammerStation ? '#c084fc' : '#f43f5e';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (s.canAttack && ambushKm < effRange - 0.5) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, toR(ambushKm), 0, Math.PI * 2);
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    if ((s.isAaaGun || s.type === 'PANTSIR') && s.aaaRangeKm > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, toR(s.aaaRangeKm), 0, Math.PI * 2);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    ctx.fillStyle = s.isPrimaryObjective ? '#ffd700' : (s.team === 'hostile' ? '#f43f5e' : '#00f0ff');
    ctx.fillRect(cx - 5, cy - 5, 10, 10);

    const opposingAc = ((s.team === 'hostile' ? game.alliedAircraft : game.hostileAircraft) || []).filter(a => a && a.hp > 0.05);
    const activeFloor = (s.canAttack && mods.hasLowAltCue) ? s.cuedMinAltFt : s.minAltFt;
    opposingAc.forEach(ac => {
      const dx = ac.x - s.x, dy = ac.y - s.y;
      const dist = Math.hypot(dx, dy);
      if (dist > maxScaleKm * 1.1) return;
      const ang = Math.atan2(dy, dx);
      const r = toR(dist);
      const px = cx + Math.cos(ang) * r;
      const py = cy + Math.sin(ang) * r;
      const tfrBonus = (ac.hasTfrMasking && ac.altFt <= 10000) ? ac.tfrFloorBonusFt : 0;
      const masked = (s.canAttack && ac.altFt < activeFloor + tfrBonus);

      ctx.fillStyle = masked ? '#00f5a0' : (dist <= ambushKm ? '#f43f5e' : '#38bdf8');
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '600 7.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(ac.callsign || ac.spec.id, px + 5, py + 3);
    });
  }

  static renderReadinessGauge(canvas, s, game) {
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || 300);
    const h = Math.max(1, canvas.clientHeight || 220);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#01040a';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h * 0.54;
    const radius = Math.min(cx - 40, cy - 36);
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : { samCooldownMult: 1, ambushRatio: 1, isPowerActive: true };

    let ratio = 1.0, mainVal = '', subVal = '', color = '#00f5a0';
    if (s.isRunwaySegment) {
      const segs = (game.surfaceUnits || []).filter(u => u.team === s.team && u.isRunwaySegment && u.airbaseId === s.airbaseId);
      const runInfo = (typeof AirbaseSystem !== 'undefined') ? AirbaseSystem.getContiguousRuns(segs) : { maxLength: 5, totalIntact: 5 };
      const isMiddleCratered = segs.some(seg => seg.segmentIndex === Math.floor(segs.length / 2) && seg.hp <= 0.05);
      ratio = runInfo.maxLength / Math.max(1, segs.length);
      mainVal = `${runInfo.maxLength} / ${segs.length} CONTIGUOUS`;
      subVal = runInfo.maxLength === 0
        ? 'RUNWAY DESTROYED'
        : ((isMiddleCratered || runInfo.maxLength < 2)
          ? `DISABLED (MAX ${runInfo.maxLength} SEG ACTIVE)`
          : `${runInfo.totalIntact} SEGMENTS INTACT`);
      color = (isMiddleCratered || runInfo.maxLength < 2) ? '#f43f5e' : (runInfo.maxLength <= 3 ? '#fbbf24' : '#00f5a0');
    } else if (s.canAttack || s.canInterceptMissiles || s.isAaaGun) {
      const effMax = Math.max(0.5, s.cooldownMax * mods.samCooldownMult);
      ratio = s.emconTimer > 0 ? 0 : Math.max(0, Math.min(1, 1 - (s.fireCooldown / effMax)));
      mainVal = s.emconTimer > 0 ? `EMCON ${s.emconTimer.toFixed(1)}s` : (s.fireCooldown > 0 ? `RELOAD ${s.fireCooldown.toFixed(1)}s` : 'BATTERY READY');
      subVal = `CYCLE: ${effMax.toFixed(1)}s | GATE: ${Math.round(mods.ambushRatio * 100)}%`;
      color = s.emconTimer > 0 ? '#fbbf24' : (s.fireCooldown > 0 ? '#38bdf8' : '#f43f5e');
    } else {
      ratio = s.isIndestructible ? 1 : Math.max(0, Math.min(1, s.hp / Math.max(1, s.maxHp)));
      mainVal = s.isIndestructible ? '100% HARDENED' : `${Math.round(ratio * 100)}% INTEGRITY`;
      subVal = s.isJammerStation ? `JAM POWER: ${Math.round(s.jamEfficiency * 100)}% (${mods.isPowerActive ? 'ONLINE' : 'POWER CUT'})` : `${s.armorClass} STRUCTURE`;
      color = ratio > 0.6 ? '#00f5a0' : (ratio > 0.3 ? '#fbbf24' : '#f43f5e');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, Math.PI + Math.PI * ratio);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px "JetBrains Mono", monospace';
    ctx.fillText(mainVal, cx, cy + 20);
    ctx.fillStyle = color;
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(subVal, cx, cy + 38);
  }

  static renderStatusSummary(canvas, s, game) {
    if (!canvas || !s) return;
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

    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : null;
    const lines = [
      { k: 'INSTALLATION', v: `${s.name} (${s.armorClass})`, c: '#ffffff' },
      { k: 'EW RADAR CUE', v: mods ? (mods.hasEwCue ? 'ACTIVE (100% REACH)' : 'LOST (-52% LR SAM)') : 'N/A', c: mods && mods.hasEwCue ? '#f43f5e' : '#00f5a0' },
      { k: 'POWER & MUNITION', v: mods ? `PWR ${mods.isPowerActive ? 'ON' : 'CUT'} | RELOAD ${mods.samCooldownMult.toFixed(2)}x` : 'N/A', c: '#38bdf8' },
      { k: 'EMCON & CONCEAL', v: `${s.emconTimer > 0 ? `SILENT (${s.emconTimer.toFixed(1)}s)` : (s.isEmitter ? 'EMITTING' : 'PASSIVE')} | ${s.identifiedByBlue ? 'ID CONFIRMED' : 'HIDDEN/UNID'}`, c: '#fbbf24' },
      { k: 'AIRBASE QUEUE', v: s.isAircraftParking ? `${(s.parkedAircraft || []).length} PARKED JETS` : (s.airbaseId || 'NON-AIRBASE'), c: '#c084fc' }
    ];

    lines.forEach((ln, idx) => {
      const y = 26 + idx * 28;
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(12, y - 14, w - 24, 22);
      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(ln.k, 18, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = ln.c;
      ctx.fillText(ln.v, w - 18, y);
    });
  }
}

window.InspectionSurfaceGraphs = InspectionSurfaceGraphs;
