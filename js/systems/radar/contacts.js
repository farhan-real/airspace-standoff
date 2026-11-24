/* AIRSPACE STANDOFF: Radar Aircraft Contacts Sub-Renderer */

class RadarContactsRenderer {
  static drawGhostContacts(...args) {
    RadarContactsAuxRenderer.drawGhostContacts(...args);
  }

  static drawDecoyDrones(...args) {
    RadarContactsAuxRenderer.drawDecoyDrones(...args);
  }

  static drawAircraft(ctx, cam, list, team, activeUnit, selectedTarget, commanderTeam, detectedSet, cssWidth, declutterMode) {
    if (!list || list.length === 0) return;
    const isBlue = (team === 'friendly');
    const isEnemy = (team !== commanderTeam);
    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');
    const isInspection = Boolean(window.Game && window.Game.inspection && (window.Game.inspection.isOpen || window.Game.inspection.enabled));
    const mainCol = isBlue ? '#00f0ff' : '#ef4444';

    let isLastFew = false;
    if (!is2P && isEnemy && (!window.Game || window.Game.scenarioMode !== 'ATTACK')) {
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

      const px = cam.toScreenX(a.x);
      const py = cam.toScreenY(a.y);
      const isSelected = activeUnit && activeUnit.id === a.id;
      const isTgt = selectedTarget && selectedTarget.id === a.id;
      const trackState = (is2P || isBlue) ? 'TRACKED' : (typeof a.getTrackState === 'function' ? a.getTrackState(commanderTeam) : ((typeof a.isIdentifiedBy === 'function' ? a.isIdentifiedBy(commanderTeam) : a.isIdentified) ? 'TRACKED' : 'BOGEY'));
      const isIdentified = (trackState === 'TRACKED' || trackState === 'DECAYING');
      const isStale = (trackState === 'STALE');
      const isDecaying = (trackState === 'DECAYING');
      const decayVal = (commanderTeam === 'friendly') ? a.trackDecayBlue : a.trackDecayRed;
      const isAce = Boolean(a.isAce);

      const relDistKm = (activeUnit && activeUnit.hp > 0.05 && activeUnit.id !== a.id)
        ? Math.round(Math.hypot(a.x - activeUnit.x, a.y - activeUnit.y)) : null;

      const clampedX = Math.max(margin, Math.min(maxScreenDist, px));
      const clampedY = Math.max(margin, Math.min(cssHeight - margin, py));
      if (px !== clampedX || py !== clampedY) {
        const safeModel = RadarRenderer.cleanText(a.spec ? a.spec.id : 'JET');
        RadarContactsAuxRenderer.drawOffscreenIndicator(ctx, { x: px, y: py }, clampedX, clampedY, cssWidth, cssHeight, isIdentified, isAce, isBlue, safeModel, relDistKm, trackState);
        continue;
      }

      if (isEnemy && isInspection && window.Game && window.Game.ai && typeof window.Game.ai.isUnitFocused === 'function' && window.Game.ai.isUnitFocused(a.id)) {
        RadarContactsAuxRenderer.drawEnemyControlArrow(ctx, px, py);
      }

      if (isSelected && a.hp > 0.05 && a.gun) {
        const gunRangeKm = a.gun.rangeKm || 4.6;
        const cfg = window.CONFIG;
        if (!cfg || !cfg.THEATER_WIDTH_KM) throw new Error('CONFIG.THEATER_WIDTH_KM must be loaded.');
        const screenRadius = (gunRangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom;
        if (screenRadius > 6) {
          const halfConeRad = (((a.gun.coneAngleDeg || 55) / 2.0) * Math.PI) / 180.0;
          const hdg = a.heading || 0;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.arc(px, py, screenRadius, hdg - halfConeRad, hdg + halfConeRad);
          ctx.closePath();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.07)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      const vLen = (a.speed || 0.8) * 18 * cam.zoom;
      ctx.strokeStyle = isStale ? '#fb7185' : (!isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : mainCol));
      ctx.lineWidth = (isAce && isIdentified) ? 2.0 : 1.5;
      if (isStale) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(a.heading || 0) * vLen, py + Math.sin(a.heading || 0) * vLen);
      ctx.stroke();
      if (isStale) ctx.setLineDash([]);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a.heading || 0);

      const cat = a.spec ? a.spec.category : 'MULTIROLE';

      if (isStale) {
        ctx.strokeStyle = '#fb7185';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
      } else if (!isIdentified) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.90)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        const planeColor = isAce ? '#ffd700' : (isSelected ? '#ffffff' : mainCol);
        ctx.fillStyle = planeColor;

        if (isBlue) {
          ctx.beginPath();
          ctx.moveTo(9.5, 0);
          ctx.lineTo(-6.0, -6.5);
          ctx.lineTo(-2.5, 0);
          ctx.lineTo(-6.0, 6.5);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(9.5, 0);
          ctx.lineTo(-3.5, -7.0);
          ctx.lineTo(-7.0, 0);
          ctx.lineTo(-3.5, 7.0);
          ctx.closePath();
          ctx.fill();
        }

        if (isAce) {
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, -12); ctx.lineTo(12, 0); ctx.lineTo(0, 12); ctx.lineTo(-12, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (a.isFlightLead) {
          ctx.strokeStyle = isBlue ? '#00f0ff' : '#ef4444';
          ctx.lineWidth = 1.4;
          ctx.strokeRect(-9, -9, 18, 18);
        }
      }
      ctx.restore();

      const labelX = px + 13;
      const labelY = py - 8;
      const fl = 'FL' + Math.round((a.altFt || 30000) / 100);
      const mch = 'M ' + (a.speed || 0.8).toFixed(2);
      const rtbTag = a.isRTB ? ' [RTB]' : '';
      const leadTag = (isAce && isIdentified) ? ' [ACE]' : ((a.isFlightLead && isIdentified) ? ' LEAD' : '');
      const pinpointTag = (isLastFew && isIdentified) ? ' PINPOINTED' : '';
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';
      const decayTag = (isDecaying && typeof decayVal === 'number') ? (' [DECAY ' + Math.ceil(decayVal) + 's]') : '';
      const safeModel = RadarRenderer.cleanText(a.spec ? a.spec.id : 'JET');
      const safeCallsign = RadarRenderer.cleanText(a.callsign || 'PILOT');

      if (declutterMode && !isSelected && !isTgt) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isStale ? '#fb7185' : (!isIdentified ? '#f97316' : ((isAce && isIdentified) ? '#ffd700' : (isBlue ? '#38bdf8' : '#ef4444')));
        ctx.fillText(RadarRenderer.cleanText(isStale ? ("ID'D [NO TRACK]" + rangeTag) : (!isIdentified ? 'BOGEY' + rangeTag : safeModel + leadTag + pinpointTag + decayTag)), labelX, labelY);
      } else if (isStale) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : '#fb7185';
        ctx.fillText(RadarRenderer.cleanText("ID'D [NO TRACK]" + rangeTag), labelX, labelY);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(RadarRenderer.cleanText(mch + ' ' + fl), labelX, labelY + 11);
      } else if (!isIdentified) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : '#f97316';
        ctx.fillText(RadarRenderer.cleanText('BOGEY' + rangeTag), labelX, labelY);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(RadarRenderer.cleanText(mch + ' ' + fl), labelX, labelY + 11);
      } else {
        const displayHp = a.hp > 0.05 ? Math.max(1, Math.round(a.hp)) : 0;
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isAce ? '#ffd700' : (isSelected ? '#ffffff' : (isBlue ? '#00f0ff' : '#ef4444'));
        ctx.fillText(RadarRenderer.cleanText(safeModel + leadTag + rtbTag + rangeTag + pinpointTag + decayTag), labelX, labelY);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = isAce ? '#fef08a' : '#94a3b8';
        ctx.fillText(RadarRenderer.cleanText(safeCallsign + ' ' + cat), labelX, labelY + 11);
        ctx.fillStyle = displayHp <= 1 ? '#ef4444' : (isBlue ? '#00f5a0' : '#f87171');
        ctx.fillText(RadarRenderer.cleanText(mch + ' ' + fl + ' ' + displayHp + '/' + a.maxHp + ' HP'), labelX, labelY + 22);
      }

      if (isSelected) {
        ctx.strokeStyle = isBlue ? '#00f0ff' : '#ef4444';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(px - 11, py - 11, 22, 22);
      }
    }
    ctx.restore();
  }
}

window.RadarContactsRenderer = RadarContactsRenderer;
