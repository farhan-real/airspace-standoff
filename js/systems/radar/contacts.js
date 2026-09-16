/**
 * APEX VECTOR // Radar Contacts Sub-Renderer
 * Unidentified aircraft render 100% identically with identical tactical diamond geometry.
 */

class RadarContactsRenderer {
  static drawAircraft(ctx, cam, list, team, activeUnit, selectedTarget, commanderTeam, detectedSet, cssWidth, declutterMode, cleanFn) {
    if (!list || list.length === 0) return;
    const isBlue = (team === 'friendly');
    const isEnemy = (team !== commanderTeam);
    const mainCol = isBlue ? '#00f0ff' : '#ef4444';
    const isMobile = (cssWidth < 800);
    const occupiedSlots = [];

    const liveEnemies = list.filter(a => a && a.hp > 0);
    const uplinkThreshold = (window.CONFIG && window.CONFIG.UPLINK_THRESHOLD_FIGHTERS !== undefined) ? window.CONFIG.UPLINK_THRESHOLD_FIGHTERS : 3;
    const isLastFew = (isEnemy && liveEnemies.length > 0 && liveEnemies.length <= uplinkThreshold);

    ctx.save();
    if (!isMobile) {
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 2;
    }

    for (const a of list) {
      if (!a || a.hp <= 0 || typeof a.x !== 'number' || typeof a.y !== 'number' || isNaN(a.x) || isNaN(a.y)) continue;
      const pos = cam.toScreen(a.x, a.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const isSelected = activeUnit && activeUnit.id === a.id;
      const isTgt = selectedTarget && selectedTarget.id === a.id;
      const isIdentified = isBlue || (typeof a.isIdentifiedBy === 'function' ? a.isIdentifiedBy(commanderTeam) : a.isIdentified);
      const isAce = Boolean(a.isAce);

      const relDistKm = (activeUnit && activeUnit.hp > 0 && activeUnit.id !== a.id)
        ? Math.round(Math.hypot(a.x - activeUnit.x, a.y - activeUnit.y)) : null;
      const rangeTag = (relDistKm !== null) ? (' • R:' + relDistKm + 'km') : '';

      const safeModel = cleanFn ? cleanFn(a.spec ? a.spec.id : 'JET') : (a.spec ? a.spec.id : 'JET');
      const safeCallsign = cleanFn ? cleanFn(a.callsign || 'PILOT') : (a.callsign || 'PILOT');

      const margin = 20;
      const cssHeight = cam.cssHeight || 500;
      const clampedX = Math.max(margin, Math.min(cssWidth - margin, pos.x));
      const clampedY = Math.max(margin, Math.min(cssHeight - margin, pos.y));
      const isOffScreen = (pos.x !== clampedX || pos.y !== clampedY);

      if (isOffScreen && (isLastFew || isTgt)) {
        const edgeAngle = Math.atan2(pos.y - clampedY, pos.x - clampedX);
        ctx.save();
        ctx.translate(clampedX, clampedY);
        ctx.rotate(edgeAngle);
        ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#00f0ff' : '#ef4444'));
        ctx.beginPath();
        ctx.moveTo(9, 0); ctx.lineTo(-6, -5); ctx.lineTo(-3, 0); ctx.lineTo(-6, 5);
        ctx.closePath(); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.font = '800 8.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#7dd3fc' : '#fca5a5'));
        const offscreenLabel = isIdentified ? `${safeModel} [${relDistKm !== null ? relDistKm + 'km' : ''}]` : `BOGEY [?] [${relDistKm !== null ? relDistKm + 'km' : ''}]`;
        ctx.fillText(offscreenLabel, clampedX + (clampedX > cssWidth / 2 ? -80 : 10), clampedY + (clampedY > cssHeight / 2 ? -6 : 12));
        ctx.restore();
        continue;
      }

      if (isOffScreen) continue;

      let offY = -10;
      for (const oc of occupiedSlots) {
        if (Math.hypot(px - oc.x, py - oc.y) < 28) offY += 24;
      }
      occupiedSlots.push({ x: px, y: py });

      if (isLastFew && isIdentified) {
        const pulse = (performance.now() % 1400) / 1400;
        const ringRadius = 14 + pulse * 14;
        ctx.save();
        ctx.strokeStyle = isAce ? '#ffd700' : '#00f0ff';
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = Math.max(0.15, 1.0 - pulse);
        ctx.beginPath();
        ctx.arc(px, py, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const vLen = (a.speed || 0.8) * 18 * cam.zoom;
      ctx.strokeStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : mainCol);
      ctx.lineWidth = (isAce && isIdentified) ? 2.0 : 1.4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(Math.round(px + Math.cos(a.heading || 0) * vLen), Math.round(py + Math.sin(a.heading || 0) * vLen));
      ctx.stroke();

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a.heading || 0);

      const cat = a.spec ? a.spec.category : 'MULTIROLE';

      if (!isIdentified) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = isAce ? '#ffd700' : (isSelected ? '#ffffff' : mainCol);
        if (cat === 'STEALTH') {
          ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill();
        } else if (a.isCoffin || cat === 'EXPERIMENTAL') {
          ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-4, -7); ctx.lineTo(-7, 0); ctx.lineTo(-4, 7); ctx.closePath(); ctx.fill();
        } else if (cat === 'DRONES') {
          ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(2, -4); ctx.lineTo(-4, -4); ctx.lineTo(-6, 0); ctx.lineTo(-4, 4); ctx.lineTo(2, 4); ctx.closePath(); ctx.fill();
        } else if (cat === 'STRIKE') {
          ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-3, -9); ctx.lineTo(-6, -9); ctx.lineTo(-3, 0); ctx.lineTo(-6, 9); ctx.lineTo(-3, 9); ctx.closePath(); ctx.fill();
        } else {
          ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-6, -5); ctx.lineTo(-3, 0); ctx.lineTo(-6, 5); ctx.closePath(); ctx.fill();
        }

        if (isAce) {
          ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke();
        } else if (a.isFlightLead) {
          ctx.strokeStyle = isBlue ? '#00f0ff' : '#ef4444'; ctx.lineWidth = 1.5; ctx.strokeRect(-8, -8, 16, 16);
        }
      }
      ctx.restore();

      const labelX = px + 12;
      const labelY = py + offY;

      const fl = 'FL' + Math.round((a.altFt || 30000) / 100);
      const mch = 'M ' + (a.speed || 0.8).toFixed(2);
      const rtbTag = a.isRTB ? ' [RTB]' : '';
      const leadTag = (isAce && isIdentified) ? ' ★ ACE' : ((a.isFlightLead && isIdentified) ? ' [LEAD]' : '');
      const pinpointTag = (isLastFew && isIdentified) ? ' [PINPOINTED]' : '';

      if ((isMobile || declutterMode) && !isSelected && !isTgt) {
        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#38bdf8' : '#ef4444'));
        if (!isIdentified) {
          ctx.fillText((cleanFn ? cleanFn('BOGEY [?]' + rangeTag) : ('BOGEY [?]' + rangeTag)), labelX, labelY);
        } else {
          ctx.fillText((cleanFn ? cleanFn(safeModel + leadTag + pinpointTag) : (safeModel + leadTag + pinpointTag)), labelX, labelY);
        }
      } else {
        if (!isIdentified) {
          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : '#f97316';
          ctx.fillText((cleanFn ? cleanFn('BOGEY [?]' + rangeTag) : ('BOGEY [?]' + rangeTag)), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#8494ab';
          ctx.fillText((cleanFn ? cleanFn(mch + ' • ' + fl) : (mch + ' • ' + fl)), labelX, labelY + 10);
        } else {
          const hpText = Math.round(a.hp) + '/' + a.maxHp + ' HP';

          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isAce ? '#ffd700' : (isSelected ? '#ffffff' : (isBlue ? '#00f0ff' : '#ef4444'));
          ctx.fillText((cleanFn ? cleanFn(safeModel + leadTag + rtbTag + rangeTag + pinpointTag) : (safeModel + leadTag + rtbTag + rangeTag + pinpointTag)), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isAce ? '#fef08a' : '#94a3b8';
          ctx.fillText((cleanFn ? cleanFn(safeCallsign + ' • ' + cat) : (safeCallsign + ' • ' + cat)), labelX, labelY + 10);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = a.hp <= 1 ? '#ef4444' : (isBlue ? '#00f5a0' : '#f87171');
          ctx.fillText((cleanFn ? cleanFn(mch + ' • ' + fl + ' • ' + hpText) : (mch + ' • ' + fl + ' • ' + hpText)), labelX, labelY + 20);
        }
      }

      if (isSelected) {
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4; ctx.strokeRect(px - 10, py - 10, 20, 20);
      }
    }
    ctx.restore();
  }

  static drawGhostContacts(ctx, cam, ghosts, detectedSet, selectedTarget, activeUnit, zoom, cleanFn) {
    if (!ghosts || ghosts.length === 0) return;
    ctx.save();
    for (const ghost of ghosts) {
      if (!ghost || ghost.isDissolved) continue;
      const pos = cam.toScreen(ghost.x, ghost.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const isSelectedTarget = selectedTarget && selectedTarget.id === ghost.id;
      const alpha = (typeof ghost.dissolveAlpha === 'number') ? ghost.dissolveAlpha : 1.0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const vLen = (ghost.speed || 0.8) * 18 * zoom;
      ctx.strokeStyle = ghost.isDissolving ? 'rgba(249, 115, 22, 0.4)' : '#f97316';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(Math.round(px + Math.cos(ghost.heading || 0) * vLen), Math.round(py + Math.sin(ghost.heading || 0) * vLen));
      ctx.stroke();

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ghost.heading || 0);

      if (!ghost.isDissolving) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(ghost.x - activeUnit.x, ghost.y - activeUnit.y)) : null;
      const distTag = distKm !== null ? (' • R:' + distKm + 'km') : '';
      const mch = 'M ' + (ghost.speed || 0.8).toFixed(2);
      const fl = 'FL' + Math.round((ghost.altFt || 28000) / 100);

      if (!ghost.isDissolving) {
        ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = isSelectedTarget ? '#ffffff' : '#f97316';
        ctx.fillText((cleanFn ? cleanFn('BOGEY [?]' + distTag) : ('BOGEY [?]' + distTag)), px + 12, py - 8);
        ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#8494ab';
        ctx.fillText((cleanFn ? cleanFn(mch + ' • ' + fl) : (mch + ' • ' + fl)), px + 12, py + 10);
      } else {
        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText((cleanFn ? cleanFn('[FALSE ECHO]' + distTag) : ('[FALSE ECHO]' + distTag)), px + 12, py - 4);
        ctx.font = '700 8.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText((cleanFn ? cleanFn(ghost.ghostType || 'CLUTTER') : (ghost.ghostType || 'CLUTTER')), px + 12, py + 7);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  static drawDecoyDrones(ctx, cam, decoys, detectedSet, commanderTeam, activeUnit, cleanFn) {
    if (!decoys || decoys.length === 0) return;
    ctx.save();
    for (const decoy of decoys) {
      if (!decoy || decoy.hp <= 0) continue;
      const isFriendly = decoy.team === commanderTeam;
      const pos = cam.toScreen(decoy.x, decoy.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const isIdentified = decoy.isIdentifiedBy(commanderTeam);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(decoy.heading || 0);

      if (isFriendly) {
        ctx.strokeStyle = '#c084fc';
        ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(7, 0); ctx.lineTo(-4, -5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.strokeStyle = isIdentified ? '#f43f5e' : '#f97316';
        ctx.fillStyle = isIdentified ? 'rgba(244, 63, 94, 0.25)' : 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.5;
        if (isIdentified) ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(decoy.x - activeUnit.x, decoy.y - activeUnit.y)) : null;
      const distTag = distKm !== null ? (' • R:' + distKm + 'km') : '';
      const mch = 'M ' + (decoy.speed || 0.8).toFixed(2);
      const fl = 'FL' + Math.round((decoy.altFt || 30000) / 100);

      if (isFriendly) {
        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText((cleanFn ? cleanFn('[DECOY] ' + decoy.mirroredModel + distTag) : ('[DECOY] ' + decoy.mirroredModel + distTag)), px + 12, py - 3);
      } else if (!isIdentified) {
        ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#f97316';
        ctx.fillText((cleanFn ? cleanFn('BOGEY [?]' + distTag) : ('BOGEY [?]' + distTag)), px + 12, py - 8);
        ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#8494ab';
        ctx.fillText((cleanFn ? cleanFn(mch + ' • ' + fl) : (mch + ' • ' + fl)), px + 12, py + 10);
      } else {
        ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#f43f5e';
        ctx.fillText((cleanFn ? cleanFn('DECOY [' + decoy.mirroredModel + ']' + distTag) : ('DECOY [' + decoy.mirroredModel + ']' + distTag)), px + 12, py - 3);
      }
    }
    ctx.restore();
  }
}

window.RadarContactsRenderer = RadarContactsRenderer;