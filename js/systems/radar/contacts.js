/* AIRSPACE STANDOFF: Radar Aircraft Contacts Sub-Renderer */

class RadarContactsRenderer {
  static drawGhostContacts(...args) {
    if (typeof RadarContactsAuxRenderer !== 'undefined') {
      RadarContactsAuxRenderer.drawGhostContacts(...args);
    }
  }

  static drawDecoyDrones(...args) {
    if (typeof RadarContactsAuxRenderer !== 'undefined') {
      RadarContactsAuxRenderer.drawDecoyDrones(...args);
    }
  }

  static drawAircraft(ctx, cam, list, team, activeUnit, selectedTarget, commanderTeam, detectedSet, cssWidth, declutterMode, cleanFn) {
    if (!list || list.length === 0) return;
    const isBlue = (team === 'friendly');
    const isEnemy = (team !== commanderTeam);
    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');
    const isInspection = Boolean(window.Game && window.Game.inspection && (window.Game.inspection.isOpen || window.Game.inspection.enabled));
    const mainCol = isBlue ? '#00f0ff' : '#ef4444';

    let isLastFew = false;
    if (!is2P && isEnemy) {
      let liveCount = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].hp > 0.05) liveCount++;
      }
      isLastFew = (liveCount > 0 && liveCount <= 3);
    }

    const margin = 20;
    const cssHeight = cam.cssHeight || 500;
    const maxScreenDist = cssWidth - margin;

    ctx.save();
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (!a || a.hp <= 0.05) continue;

      const px = Math.round(cam.toScreenX ? cam.toScreenX(a.x) : cam.toScreen(a.x, a.y).x);
      const py = Math.round(cam.toScreenY ? cam.toScreenY(a.y) : cam.toScreen(a.x, a.y).y);
      const isSelected = activeUnit && activeUnit.id === a.id;
      const isTgt = selectedTarget && selectedTarget.id === a.id;
      const isIdentified = is2P || isBlue || (typeof a.isIdentifiedBy === 'function' ? a.isIdentifiedBy(commanderTeam) : a.isIdentified);
      const isAce = Boolean(a.isAce);

      const relDistKm = (activeUnit && activeUnit.hp > 0.05 && activeUnit.id !== a.id)
        ? Math.round(Math.hypot(a.x - activeUnit.x, a.y - activeUnit.y)) : null;

      const clampedX = Math.max(margin, Math.min(maxScreenDist, px));
      const clampedY = Math.max(margin, Math.min(cssHeight - margin, py));
      if (px !== clampedX || py !== clampedY) {
        if (typeof RadarContactsAuxRenderer !== 'undefined') {
          const safeModel = cleanFn ? cleanFn(a.spec ? a.spec.id : 'JET') : (a.spec ? a.spec.id : 'JET');
          RadarContactsAuxRenderer.drawOffscreenIndicator(ctx, { x: px, y: py }, clampedX, clampedY, cssWidth, cssHeight, isIdentified, isAce, isBlue, safeModel, relDistKm);
        }
        continue;
      }

      if (isEnemy && isInspection && window.Game && window.Game.ai && typeof window.Game.ai.isUnitFocused === 'function' && window.Game.ai.isUnitFocused(a.id)) {
        if (typeof RadarContactsAuxRenderer !== 'undefined') {
          RadarContactsAuxRenderer.drawEnemyControlArrow(ctx, px, py);
        }
      }

      if (isSelected && a.hp > 0.05 && a.gun) {
        const gunRangeKm = a.gun.rangeKm || 4.6;
        const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0 };
        const screenRadius = (gunRangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom;
        if (screenRadius > 6) {
          const halfConeRad = (((a.gun.coneAngleDeg || 55) / 2.0) * Math.PI) / 180.0;
          const hdg = a.heading || 0;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.arc(px, py, screenRadius, hdg - halfConeRad, hdg + halfConeRad);
          ctx.closePath();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
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
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, -11); ctx.lineTo(11, 0); ctx.lineTo(0, 11); ctx.lineTo(-11, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (a.isFlightLead) {
          ctx.strokeStyle = isBlue ? '#00f0ff' : '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-8, -8, 16, 16);
        }
      }
      ctx.restore();

      const labelX = px + 12;
      const labelY = py - 8;
      const fl = 'FL' + Math.round((a.altFt || 30000) / 100);
      const mch = 'M ' + (a.speed || 0.8).toFixed(2);
      const rtbTag = a.isRTB ? ' [RTB]' : '';
      const leadTag = (isAce && isIdentified) ? ' [ACE]' : ((a.isFlightLead && isIdentified) ? ' LEAD' : '');
      const pinpointTag = (isLastFew && isIdentified) ? ' PINPOINTED' : '';
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';
      const safeModel = cleanFn ? cleanFn(a.spec ? a.spec.id : 'JET') : (a.spec ? a.spec.id : 'JET');
      const safeCallsign = cleanFn ? cleanFn(a.callsign || 'PILOT') : (a.callsign || 'PILOT');

      if (declutterMode && !isSelected && !isTgt) {
        ctx.font = '800 10px monospace';
        ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#38bdf8' : '#ef4444'));
        ctx.fillText(cleanFn(!isIdentified ? 'BOGEY' + rangeTag : safeModel + leadTag + pinpointTag), labelX, labelY);
      } else {
        if (!isIdentified) {
          ctx.font = '800 10.5px monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : '#f97316';
          ctx.fillText(cleanFn('BOGEY' + rangeTag), labelX, labelY);
          ctx.font = '700 9px monospace';
          ctx.fillStyle = '#8494ab';
          ctx.fillText(cleanFn(mch + ' ' + fl), labelX, labelY + 10);
        } else {
          const displayHp = a.hp > 0.05 ? Math.max(1, Math.round(a.hp)) : 0;
          ctx.font = '800 10.5px monospace';
          ctx.fillStyle = isAce ? '#ffd700' : (isSelected ? '#ffffff' : (isBlue ? '#00f0ff' : '#ef4444'));
          ctx.fillText(cleanFn(safeModel + leadTag + rtbTag + rangeTag + pinpointTag), labelX, labelY);
          ctx.font = '700 9px monospace';
          ctx.fillStyle = isAce ? '#fef08a' : '#94a3b8';
          ctx.fillText(cleanFn(safeCallsign + ' ' + cat), labelX, labelY + 10);
          ctx.fillStyle = displayHp <= 1 ? '#ef4444' : (isBlue ? '#00f5a0' : '#f87171');
          ctx.fillText(cleanFn(mch + ' ' + fl + ' ' + displayHp + '/' + a.maxHp + ' HP'), labelX, labelY + 20);
        }
      }

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(px - 10, py - 10, 20, 20);
      }
    }
    ctx.restore();
  }
}

window.RadarContactsRenderer = RadarContactsRenderer;