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
    const mainCol = isBlue ? '#00f0ff' : '#ef4444';
    const isMobile = (cssWidth < 800);

    const liveEnemies = list.filter(a => a && a.hp > 0.05);
    const uplinkThreshold = (window.CONFIG && window.CONFIG.UPLINK_THRESHOLD_FIGHTERS !== undefined) ? window.CONFIG.UPLINK_THRESHOLD_FIGHTERS : 3;
    const isLastFew = (!is2P && isEnemy && liveEnemies.length > 0 && liveEnemies.length <= uplinkThreshold);

    ctx.save();
    if (!isMobile) {
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 2;
    }

    for (const a of list) {
      if (!a || a.hp <= 0.05) continue;

      if (isNaN(a.x) || isNaN(a.y)) {
        a.x = isBlue ? 20.0 : ((window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) ? window.CONFIG.THEATER_WIDTH_KM - 20.0 : 130.0);
        a.y = 50.0;
        a.speed = a.effectiveMaxSpeed || 0.95;
        a.heading = isBlue ? 0.0 : Math.PI;
      }

      const pos = cam.toScreen(a.x, a.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const isSelected = activeUnit && activeUnit.id === a.id;
      const isTgt = selectedTarget && selectedTarget.id === a.id;
      const isIdentified = is2P || isBlue || (typeof a.isIdentifiedBy === 'function' ? a.isIdentifiedBy(commanderTeam) : a.isIdentified);
      const isAce = Boolean(a.isAce);

      const relDistKm = (activeUnit && activeUnit.hp > 0.05 && activeUnit.id !== a.id)
        ? Math.round(Math.hypot(a.x - activeUnit.x, a.y - activeUnit.y)) : null;
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';

      const safeModel = cleanFn ? cleanFn(a.spec ? a.spec.id : 'JET') : (a.spec ? a.spec.id : 'JET');
      const safeCallsign = cleanFn ? cleanFn(a.callsign || 'PILOT') : (a.callsign || 'PILOT');

      const margin = 20;
      const cssHeight = cam.cssHeight || 500;
      const clampedX = Math.max(margin, Math.min(cssWidth - margin, pos.x));
      const clampedY = Math.max(margin, Math.min(cssHeight - margin, pos.y));
      const isOffScreen = (pos.x !== clampedX || pos.y !== clampedY);

      if (isOffScreen) {
        if (typeof RadarContactsAuxRenderer !== 'undefined') {
          RadarContactsAuxRenderer.drawOffscreenIndicator(ctx, pos, clampedX, clampedY, cssWidth, cssHeight, isIdentified, isAce, isBlue, safeModel, relDistKm);
        }
        continue;
      }

      if (isSelected && a.hp > 0.05 && a.gun) {
        const gunRangeKm = a.gun.rangeKm || 4.6;
        const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0 };
        const screenRadius = (gunRangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom;

        if (screenRadius > 6) {
          ctx.save();
          const coneDeg = a.gun.coneAngleDeg || 55;
          const halfConeRad = ((coneDeg / 2.0) * Math.PI) / 180.0;
          const hdg = a.heading || 0;
          const isDEW = Boolean(a.gun.damagePerPulse || a.gun.id.startsWith('PLSL') || a.gun.id === 'DE-PULSE' || a.gun.id === 'EML_GUN');
          const rangeCol = isDEW ? 'rgba(0, 240, 255, 0.45)' : 'rgba(56, 189, 248, 0.40)';
          const fillCol = isDEW ? 'rgba(0, 240, 255, 0.06)' : 'rgba(56, 189, 248, 0.05)';

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.arc(px, py, screenRadius, hdg - halfConeRad, hdg + halfConeRad);
          ctx.closePath();
          ctx.fillStyle = fillCol;
          ctx.fill();
          ctx.strokeStyle = rangeCol;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, screenRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isDEW ? 'rgba(0, 240, 255, 0.20)' : 'rgba(56, 189, 248, 0.18)';
          ctx.lineWidth = 1.0;
          ctx.setLineDash([3, 4]);
          ctx.stroke();

          ctx.restore();
        }
      }

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
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, -11);
          ctx.lineTo(11, 0);
          ctx.lineTo(0, 11);
          ctx.lineTo(-11, 0);
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

      const rtbTag = a.isRTB ? ' [RETURN TO BASE]' : '';
      const leadTag = (isAce && isIdentified) ? ' [ACE]' : ((a.isFlightLead && isIdentified) ? ' LEAD' : '');
      const pinpointTag = (isLastFew && isIdentified) ? ' PINPOINTED' : '';

      if (declutterMode && !isSelected && !isTgt) {
        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = !isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#38bdf8' : '#ef4444'));
        if (!isIdentified) {
          ctx.fillText(cleanFn('BOGEY' + rangeTag), labelX, labelY);
        } else {
          ctx.fillText(cleanFn(safeModel + leadTag + pinpointTag), labelX, labelY);
        }
      } else {
        if (!isIdentified) {
          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : '#f97316';
          ctx.fillText(cleanFn('BOGEY' + rangeTag), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#8494ab';
          ctx.fillText(cleanFn(mch + ' ' + fl), labelX, labelY + 10);
        } else {
          const displayHp = a.hp > 0.05 ? Math.max(1, Math.round(a.hp)) : 0;
          const hpText = displayHp + '/' + a.maxHp + ' HP';

          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isAce ? '#ffd700' : (isSelected ? '#ffffff' : (isBlue ? '#00f0ff' : '#ef4444'));
          ctx.fillText(cleanFn(safeModel + leadTag + rtbTag + rangeTag + pinpointTag), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = isAce ? '#fef08a' : '#94a3b8';
          ctx.fillText(cleanFn(safeCallsign + ' ' + cat), labelX, labelY + 10);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = displayHp <= 1 ? '#ef4444' : (isBlue ? '#00f5a0' : '#f87171');
          ctx.fillText(cleanFn(mch + ' ' + fl + ' ' + hpText), labelX, labelY + 20);
        }
      }

      if (isSelected) {
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4; ctx.strokeRect(px - 10, py - 10, 20, 20);
      }
    }
    ctx.restore();
  }
}

window.RadarContactsRenderer = RadarContactsRenderer;