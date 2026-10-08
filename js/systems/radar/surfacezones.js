/**
 * AIRSPACE STANDOFF: Tactical Radar Viewport: Surface Facilities & Civilian Traffic
 */

class RadarTacticalSurfaceRenderer {
  static drawSurface(ctx, cam, units, team, detectedSet, activeUnit, selectedTarget, cssWidth, declutterMode, cleanFn) {
    if (!units || units.length === 0) return;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0 };
    ctx.save();

    for (let i = 0; i < units.length; i++) {
      const s = units[i];
      if (!s || s.hp <= 0 || typeof s.x !== 'number') continue;
      const isSelectedSurface = Boolean(selectedTarget && selectedTarget.id === s.id);
      if (!cam.showGroundTargets && !isSelectedSurface) continue;

      const pos = cam.toScreen(s.x, s.y);
      const px = pos.x;
      const py = pos.y;
      const col = s.isIndestructible ? '#00f5a0' : (s.team === 'hostile' ? '#ef4444' : (s.isJammerStation ? '#c084fc' : '#00f0ff'));

      if (s.rangeKm && isSelectedSurface) {
        ctx.beginPath();
        ctx.arc(px, py, (s.rangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom, 0, Math.PI * 2);
        if (s.isJammerStation) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(192, 132, 252, 0.45)';
          ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
        } else if (s.canAttack) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.40)' : 'rgba(0, 240, 255, 0.40)';
          ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
      }

      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = isSelectedSurface ? 2.2 : 1.6;

      if (s.type === 'BUNKER') {
        ctx.strokeRect(px - 7, py - 7, 14, 14);
        ctx.fillRect(px - 3, py - 3, 6, 6);
      } else if (s.type === 'S-400') {
        ctx.beginPath();
        ctx.moveTo(px, py - 8); ctx.lineTo(px + 8, py); ctx.lineTo(px, py + 8); ctx.lineTo(px - 8, py);
        ctx.closePath(); ctx.stroke();
      } else if (s.type === 'EW_JAMMER') {
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 4, py); ctx.lineTo(px, py - 4); ctx.lineTo(px + 4, py); ctx.lineTo(px, py + 4);
        ctx.closePath(); ctx.fill();
      } else if (s.type === 'RADAR_ARRAY') {
        ctx.beginPath(); ctx.arc(px, py, 6, Math.PI, Math.PI * 2); ctx.stroke();
      } else if (s.type === 'AMMO_DUMP') {
        ctx.strokeStyle = '#00f5a0'; ctx.strokeRect(px - 7, py - 7, 14, 14);
        ctx.fillStyle = '#00f5a0'; ctx.fillRect(px - 3, py - 3, 6, 6);
      } else {
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.stroke();
      }

      if (!declutterMode || isSelectedSurface) {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = col;
        const shortCode = s.type === 'BUNKER' ? 'HQ' : (s.type === 'EW_JAMMER' ? 'EW JAMMER' : (s.type === 'RADAR_ARRAY' ? 'RADAR' : (s.isIndestructible ? 'AMMO DEPOT [SAFE]' : (s.name || s.type))));
        const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(s.x - activeUnit.x, s.y - activeUnit.y)) : null;
        const distTag = distKm !== null ? (' R:' + distKm + 'km') : '';
        const hpTag = s.isIndestructible ? ' [INF]' : ` [${Math.round(s.hp)}]`;
        ctx.fillText(cleanFn(shortCode + hpTag + distTag), px + 10, py + 4);
      }
    }
    ctx.restore();
  }

  static drawCivilianTraffic(ctx, cam, civilians, detectedSet, activeUnit, declutterMode, cssWidth, cleanFn) {
    if (!civilians || civilians.length === 0) return;
    ctx.save();

    for (let i = 0; i < civilians.length; i++) {
      const civ = civilians[i];
      if (!civ || civ.hp <= 0 || typeof civ.x !== 'number') continue;
      const pos = cam.toScreen(civ.x, civ.y);
      const px = pos.x;
      const py = pos.y;
      const isIdentified = civ.isIdentified;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(civ.heading || 0);

      if (!isIdentified) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.90)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.quadraticCurveTo(9, 2.4, 5, 2.4);
        ctx.lineTo(2, 2.5); ctx.lineTo(-3, 12); ctx.lineTo(-5.5, 12); ctx.lineTo(-2, 2.5);
        ctx.lineTo(-8, 2.0); ctx.lineTo(-11, 6); ctx.lineTo(-13, 6); ctx.lineTo(-11, 1.2);
        ctx.lineTo(-13, 0); ctx.lineTo(-11, -1.2); ctx.lineTo(-13, -6); ctx.lineTo(-11, -6);
        ctx.lineTo(-8, -2.0); ctx.lineTo(-2, -2.5); ctx.lineTo(-5.5, -12); ctx.lineTo(-3, -12);
        ctx.lineTo(2, -2.5); ctx.lineTo(5, -2.4);
        ctx.quadraticCurveTo(9, -2.4, 12, 0);
        ctx.closePath();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)'; ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-2, 4.5, 3.5, 1.8);
        ctx.fillRect(-2, -6.3, 3.5, 1.8);
      }
      ctx.restore();

      const vLen = (civ.speed || 0.78) * 18 * cam.zoom;
      ctx.strokeStyle = isIdentified ? '#38bdf8' : '#f97316';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(civ.heading || 0) * vLen, py + Math.sin(civ.heading || 0) * vLen);
      ctx.stroke();

      const relDistKm = (activeUnit && activeUnit.hp > 0)
        ? Math.round(Math.hypot(civ.x - activeUnit.x, civ.y - activeUnit.y)) : null;
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';
      const rawCode = cleanFn ? cleanFn(civ.flightCode || '700') : (civ.flightCode || '700');
      const mch = 'M ' + (civ.speed || 0.78).toFixed(2);
      const fl = 'FL' + Math.round((civ.altFt || 36000) / 100);

      const labelX = px + 15;
      const labelY = py - 7;

      if (declutterMode) {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isIdentified ? '#38bdf8' : '#f97316';
        ctx.fillText(cleanFn(isIdentified ? 'CIVILIAN' : ('BOGEY' + (rangeTag ? ` [${relDistKm}km]` : ''))), labelX, labelY + 6);
      } else {
        if (!isIdentified) {
          ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#f97316';
          ctx.fillText(cleanFn('BOGEY [?]' + rangeTag), labelX, labelY);
          ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(cleanFn(mch + ' ' + fl), labelX, labelY + 11);
        } else {
          ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(cleanFn('CIVILIAN ' + rawCode), labelX, labelY);
          ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(cleanFn((civ.model || civ.name || 'Commercial Airliner') + rangeTag), labelX, labelY + 11);
          ctx.fillStyle = '#00f5a0';
          ctx.fillText(cleanFn(mch + ' ' + fl + ' ' + Math.round(civ.hp) + '/' + (civ.maxHp || 6) + ' HP'), labelX, labelY + 22);
        }
      }
    }
    ctx.restore();
  }
}

window.RadarTacticalSurfaceRenderer = RadarTacticalSurfaceRenderer;