/**
 * AIRSPACE STANDOFF: Radar Auxiliary Contacts, Ghost Echoes & Inspection Controls
 */

class RadarContactsAuxRenderer {
  static drawEnemyControlArrow(ctx, px, py) {
    ctx.save();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(px - 5, py - 18);
    ctx.lineTo(px, py - 12);
    ctx.lineTo(px + 5, py - 18);
    ctx.stroke();
    ctx.restore();
  }

  static drawGhostContacts(ctx, cam, ghosts, detectedSet, selectedTarget, activeUnit, zoom, cleanFn) {
    if (!ghosts || ghosts.length === 0) return;
    ctx.save();
    for (const ghost of ghosts) {
      if (!ghost || ghost.isDissolved) continue;
      const pos = cam.toScreen(ghost.x, ghost.y);
      const px = pos.x;
      const py = pos.y;
      const isSelectedTarget = selectedTarget && selectedTarget.id === ghost.id;
      const alpha = (typeof ghost.dissolveAlpha === 'number') ? ghost.dissolveAlpha : 1.0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const vLen = (ghost.speed || 0.8) * 18 * zoom;
      ctx.strokeStyle = ghost.isDissolving ? 'rgba(249, 115, 22, 0.4)' : '#f97316';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(ghost.heading || 0) * vLen, py + Math.sin(ghost.heading || 0) * vLen);
      ctx.stroke();

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ghost.heading || 0);

      if (!ghost.isDissolving) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.3)';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(ghost.x - activeUnit.x, ghost.y - activeUnit.y)) : null;
      const distTag = distKm !== null ? (' R:' + distKm + 'km') : '';
      const mch = 'M ' + (ghost.speed || 0.8).toFixed(2);
      const fl = 'FL' + Math.round((ghost.altFt || 28000) / 100);

      if (!ghost.isDissolving) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isSelectedTarget ? '#ffffff' : '#f97316';
        ctx.fillText(cleanFn('BOGEY' + distTag), px + 13, py - 8);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(cleanFn(mch + ' ' + fl), px + 13, py + 11);
      } else {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(cleanFn('FALSE ECHO' + distTag), px + 13, py - 4);
        ctx.font = '600 9px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(cleanFn(ghost.ghostType || 'CLUTTER'), px + 13, py + 8);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  static drawDecoyDrones(ctx, cam, decoys, detectedSet, commanderTeam, activeUnit, cleanFn) {
    if (!decoys || decoys.length === 0) return;
    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');
    ctx.save();
    for (const decoy of decoys) {
      if (!decoy || decoy.hp <= 0) continue;
      const isFriendly = decoy.team === commanderTeam;
      const pos = cam.toScreen(decoy.x, decoy.y);
      const px = pos.x;
      const py = pos.y;
      const isIdentified = is2P || decoy.isIdentifiedBy(commanderTeam);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(decoy.heading || 0);

      if (isFriendly) {
        ctx.strokeStyle = '#c084fc';
        ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(8, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.strokeStyle = isIdentified ? '#f43f5e' : '#f97316';
        ctx.fillStyle = isIdentified ? 'rgba(244, 63, 94, 0.25)' : 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.6;
        if (isIdentified) ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(decoy.x - activeUnit.x, decoy.y - activeUnit.y)) : null;
      const distTag = distKm !== null ? (' R:' + distKm + 'km') : '';
      const mch = 'M ' + (decoy.speed || 0.8).toFixed(2);
      const fl = 'FL' + Math.round((decoy.altFt || 30000) / 100);

      if (isFriendly) {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText(cleanFn('DECOY ' + decoy.mirroredModel + distTag), px + 13, py - 3);
      } else if (!isIdentified) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#f97316';
        ctx.fillText(cleanFn('BOGEY' + distTag), px + 13, py - 8);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(cleanFn(mch + ' ' + fl), px + 13, py + 11);
      } else {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#f43f5e';
        ctx.fillText(cleanFn('DECOY ' + decoy.mirroredModel + distTag), px + 13, py - 3);
      }
    }
    ctx.restore();
  }

  static drawOffscreenIndicator(ctx, pos, clampedX, clampedY, cssWidth, cssHeight, isIdentified, isAce, isBlue, safeModel, relDistKm) {
    const edgeAngle = Math.atan2(pos.y - clampedY, pos.x - clampedX);
    ctx.save();
    ctx.translate(clampedX, clampedY);
    ctx.rotate(edgeAngle);
    ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#00f0ff' : '#ef4444'));
    ctx.beginPath();
    ctx.moveTo(10, 0); ctx.lineTo(-6, -6); ctx.lineTo(-3, 0); ctx.lineTo(-6, 6);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = '700 9.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#7dd3fc' : '#fca5a5'));
    const offscreenLabel = isIdentified ? `${safeModel} [${relDistKm !== null ? relDistKm + 'km' : ''}]` : `BOGEY [${relDistKm !== null ? relDistKm + 'km' : ''}]`;
    ctx.fillText(offscreenLabel, clampedX + (clampedX > cssWidth / 2 ? -85 : 12), clampedY + (clampedY > cssHeight / 2 ? -7 : 14));
    ctx.restore();
  }
}

window.RadarContactsAuxRenderer = RadarContactsAuxRenderer;