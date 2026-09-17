/**
 * AIRSPACE STANDOFF // Radar Tactical Sub-Renderer (150km x 100km Theater)
 * Unidentified aircraft render identically to standard bogeys.
 * Displays commercial airliner icon, multiline civilian telemetry, and grouped missile salvos.
 */

class RadarTacticalRenderer {
  static drawSurface(ctx, cam, units, team, detectedSet, activeUnit, selectedTarget, cssWidth, declutterMode, cleanFn) {
    if (!units || units.length === 0) return;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0 };
    const isMobile = (cssWidth < 800);
    ctx.save();
    if (!isMobile) { ctx.shadowColor = '#000000'; ctx.shadowBlur = 2; }

    for (const s of units) {
      if (!s || s.hp <= 0 || typeof s.x !== 'number') continue;
      const isSelectedSurface = Boolean(selectedTarget && selectedTarget.id === s.id);
      if (!cam.showGroundTargets && !isSelectedSurface) continue;

      const pos = cam.toScreen(s.x, s.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const col = s.isIndestructible ? '#00f5a0' : (s.team === 'hostile' ? '#ef4444' : (s.isJammerStation ? '#c084fc' : '#00f0ff'));

      if (s.rangeKm && isSelectedSurface) {
        ctx.beginPath();
        ctx.arc(px, py, (s.rangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom, 0, Math.PI * 2);
        if (s.isJammerStation) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.40)' : 'rgba(192, 132, 252, 0.40)';
          ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
        } else if (s.canAttack) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 240, 255, 0.35)';
          ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
      }

      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = isSelectedSurface ? 2.0 : 1.4;

      if (s.type === 'BUNKER') {
        ctx.strokeRect(px - 6, py - 6, 12, 12);
        ctx.fillRect(px - 2, py - 2, 4, 4);
      } else if (s.type === 'S-400') {
        ctx.beginPath();
        ctx.moveTo(px, py - 7); ctx.lineTo(px + 7, py); ctx.lineTo(px, py + 7); ctx.lineTo(px - 7, py);
        ctx.closePath(); ctx.stroke();
      } else if (s.type === 'EW_JAMMER') {
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 4, py); ctx.lineTo(px, py - 4); ctx.lineTo(px + 4, py); ctx.lineTo(px, py + 4);
        ctx.closePath(); ctx.fill();
      } else if (s.type === 'RADAR_ARRAY') {
        ctx.beginPath(); ctx.arc(px, py, 5, Math.PI, Math.PI * 2); ctx.stroke();
      } else if (s.type === 'AMMO_DUMP') {
        ctx.strokeStyle = '#00f5a0'; ctx.strokeRect(px - 6, py - 6, 12, 12);
        ctx.fillStyle = '#00f5a0'; ctx.fillRect(px - 2, py - 2, 4, 4);
      } else {
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.stroke();
      }

      if (!declutterMode || isSelectedSurface) {
        ctx.font = '700 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = col;
        const shortCode = s.type === 'BUNKER' ? 'HQ' : (s.type === 'EW_JAMMER' ? 'EW JAMMER' : (s.type === 'RADAR_ARRAY' ? 'RADAR' : (s.isIndestructible ? 'AMMO DEPOT [SAFE]' : (s.name || s.type))));
        const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(s.x - activeUnit.x, s.y - activeUnit.y)) : null;
        const distTag = distKm !== null ? (' R:' + distKm + 'km') : '';
        const hpTag = s.isIndestructible ? ' [INF]' : ` [${Math.round(s.hp)}]`;
        ctx.fillText(cleanFn(shortCode + hpTag + distTag), px + 9, py + 3);
      }
    }
    ctx.restore();
  }

  static drawCivilianTraffic(ctx, cam, civilians, detectedSet, activeUnit, declutterMode, cssWidth, cleanFn) {
    if (!civilians || civilians.length === 0) return;
    const isMobile = (cssWidth < 800);
    ctx.save();
    if (!isMobile) { ctx.shadowColor = '#000000'; ctx.shadowBlur = 2; }

    for (const civ of civilians) {
      if (!civ || civ.hp <= 0 || typeof civ.x !== 'number') continue;
      const pos = cam.toScreen(civ.x, civ.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      const isIdentified = civ.isIdentified;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(civ.heading || 0);

      if (!isIdentified) {
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = 'rgba(20, 25, 35, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.quadraticCurveTo(8.5, 2.2, 4.5, 2.2);
        ctx.lineTo(2, 2.4); ctx.lineTo(-3, 11); ctx.lineTo(-5, 11); ctx.lineTo(-2, 2.4);
        ctx.lineTo(-7.5, 1.8); ctx.lineTo(-10.5, 5.5); ctx.lineTo(-12, 5.5); ctx.lineTo(-10, 1.0);
        ctx.lineTo(-12, 0); ctx.lineTo(-10, -1.0); ctx.lineTo(-12, -5.5); ctx.lineTo(-10.5, -5.5);
        ctx.lineTo(-7.5, -1.8); ctx.lineTo(-2, -2.4); ctx.lineTo(-5, -11); ctx.lineTo(-3, -11);
        ctx.lineTo(2, -2.4); ctx.lineTo(4.5, -2.2);
        ctx.quadraticCurveTo(8.5, -2.2, 11, 0);
        ctx.closePath();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)'; ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.4; ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-1.5, 4.2, 3.2, 1.5);
        ctx.fillRect(-1.5, -5.7, 3.2, 1.5);
      }
      ctx.restore();

      const vLen = (civ.speed || 0.78) * 18 * cam.zoom;
      ctx.strokeStyle = isIdentified ? '#38bdf8' : '#f97316';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(Math.round(px + Math.cos(civ.heading || 0) * vLen), Math.round(py + Math.sin(civ.heading || 0) * vLen));
      ctx.stroke();

      const relDistKm = (activeUnit && activeUnit.hp > 0)
        ? Math.round(Math.hypot(civ.x - activeUnit.x, civ.y - activeUnit.y)) : null;
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';
      const rawCode = cleanFn ? cleanFn(civ.flightCode || '700') : (civ.flightCode || '700');
      const mch = 'M ' + (civ.speed || 0.78).toFixed(2);
      const fl = 'FL' + Math.round((civ.altFt || 36000) / 100);

      const labelX = px + 14;
      const labelY = py - 7;

      if (declutterMode) {
        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = isIdentified ? '#38bdf8' : '#f97316';
        const tag = isIdentified ? 'CIVILIAN' : ('BOGEY' + (rangeTag ? ` [${relDistKm}km]` : ''));
        ctx.fillText(cleanFn(tag), labelX, labelY + 6);
      } else {
        if (!isIdentified) {
          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#f97316';
          ctx.fillText(cleanFn('BOGEY [?]' + rangeTag), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#8494ab';
          ctx.fillText(cleanFn(mch + ' ' + fl), labelX, labelY + 11);
        } else {
          ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(cleanFn('CIVILIAN ' + rawCode), labelX, labelY);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#94a3b8';
          const modelName = civ.model || civ.name || 'Commercial Airliner';
          ctx.fillText(cleanFn(modelName + rangeTag), labelX, labelY + 11);

          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
          ctx.fillStyle = '#00f5a0';
          const hpText = Math.round(civ.hp) + '/' + (civ.maxHp || 6) + ' HP';
          ctx.fillText(cleanFn(mch + ' ' + fl + ' ' + hpText), labelX, labelY + 22);
        }
      }
    }
    ctx.restore();
  }

  static drawRadarLocks(ctx, cam, allCraft, activeUnit, team, detectedSet) {
    for (const source of allCraft) {
      if (!source || source.hp <= 0 || !source.radarLockedTarget || typeof source.x !== 'number') continue;
      const tgt = source.radarLockedTarget;
      if (!tgt || tgt.hp <= 0 || typeof tgt.x !== 'number') continue;
      const p1 = cam.toScreen(source.x, source.y);
      const p2 = cam.toScreen(tgt.x, tgt.y);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
      ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
      ctx.strokeStyle = (activeUnit && activeUnit.id === source.id) ? '#00f0ff' : (source.team !== team && tgt.team === team ? '#ef4444' : 'rgba(0, 240, 255, 0.35)');
      ctx.lineWidth = 1.4; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.restore();
    }
  }

  static drawSalvoCoordinations(ctx, cam, missiles) {
    const salvos = {};
    for (const m of missiles) {
      if (!m || !m.active || !m.target || m.target.hp <= 0 || typeof m.target.x !== 'number') continue;
      if (!salvos[m.target.id]) salvos[m.target.id] = [];
      salvos[m.target.id].push(m);
    }
    Object.keys(salvos).forEach(tid => {
      const group = salvos[tid];
      if (group.length > 1 && group[0].target) {
        const pT = cam.toScreen(group[0].target.x, group[0].target.y);
        const tx = Math.round(pT.x);
        const ty = Math.round(pT.y);
        ctx.save(); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 1.0; ctx.setLineDash([2, 4]);
        for (const m of group) {
          if (typeof m.x === 'number') {
            const pM = cam.toScreen(m.x, m.y);
            ctx.beginPath(); ctx.moveTo(Math.round(pM.x), Math.round(pM.y)); ctx.lineTo(tx, ty); ctx.stroke();
          }
        }
        ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('SALVO x' + group.length, tx - 22, ty - 14);
        ctx.restore();
      }
    });
  }

  static drawMissiles(ctx, cam, missiles, team, detectedSet, declutterMode, cleanFn) {
    const isMobile = (cam.cssWidth < 800);
    ctx.save();
    if (!isMobile) { ctx.shadowColor = '#000000'; ctx.shadowBlur = 2; }

    const visibleMissiles = [];

    // 1. Draw physical missile sprites and trails
    for (const m of missiles) {
      if (!m || m.isDead || typeof m.x !== 'number' || (m.team !== team && !detectedSet.has(m.id))) continue;
      const pos = cam.toScreen(m.x, m.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      visibleMissiles.push({ m: m, px: px, py: py });

      if (m.trail && m.trail.length > 1) {
        for (let t = 0; t < m.trail.length - 1; t++) {
          if (m.trail[t] && m.trail[t + 1]) {
            const p1 = cam.toScreen(m.trail[t].x, m.trail[t].y);
            const p2 = cam.toScreen(m.trail[t + 1].x, m.trail[t + 1].y);
            ctx.strokeStyle = m.team === 'friendly' ? ('rgba(0, 240, 255, ' + m.trail[t].alpha + ')') : ('rgba(239, 68, 68, ' + m.trail[t].alpha + ')');
            ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(Math.round(p1.x), Math.round(p1.y)); ctx.lineTo(Math.round(p2.x), Math.round(p2.y)); ctx.stroke();
          }
        }
      }

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(m.heading || 0);
      const isBlue = (m.team === 'friendly');
      ctx.fillStyle = isBlue ? '#00f0ff' : '#ef4444';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(2, -2.5); ctx.lineTo(-5, -2.5); ctx.lineTo(-6, 0); ctx.lineTo(-5, 2.5); ctx.lineTo(2, 2.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // 2. Render labels: group identical missiles launched from the same aircraft; shows missile name in both declutter ON and OFF
    if (visibleMissiles.length > 0) {
      const clusters = [];

      for (const item of visibleMissiles) {
        const m = item.m;
        const px = item.px;
        const py = item.py;
        const isBlue = (m.team === 'friendly');
        const isIdentified = isBlue || (typeof m.isIdentifiedBy === 'function' ? m.isIdentifiedBy(team) : m.isIdentified);
        const sourceId = (m.source && m.source.id) ? m.source.id : 'src';
        const weaponId = (m.weapon && m.weapon.id) ? m.weapon.id : 'MSL';
        const distVal = (typeof m.distanceToTarget === 'number' && !isNaN(m.distanceToTarget)) ? Math.round(m.distanceToTarget) : 0;

        let cluster = null;
        for (const cl of clusters) {
          if (cl.sourceId === sourceId && cl.weaponId === weaponId && cl.isBlue === isBlue && cl.isIdentified === isIdentified) {
            if (Math.hypot(cl.px - px, cl.py - py) < 34) { cluster = cl; break; }
          }
        }

        if (cluster) {
          cluster.count++;
          if (distVal < cluster.minDist) {
            cluster.minDist = distVal;
            cluster.px = px;
            cluster.py = py;
          }
        } else {
          clusters.push({
            sourceId: sourceId,
            weaponId: weaponId,
            weaponName: (m.weapon && (m.weapon.id || m.weapon.name)) ? (m.weapon.id || m.weapon.name) : 'MSL',
            isBlue: isBlue,
            isIdentified: isIdentified,
            count: 1,
            minDist: distVal,
            px: px,
            py: py
          });
        }
      }

      ctx.font = '700 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      for (const cl of clusters) {
        ctx.fillStyle = cl.isBlue ? '#7dd3fc' : '#ef4444';
        const countTag = cl.count > 1 ? ` x${cl.count}` : '';
        const mslLabel = cl.isIdentified ? cleanFn(cl.weaponName) : 'FAST TRACK [?]';
        const distTag = declutterMode ? '' : ` [${cl.minDist}km]`;
        ctx.fillText(cleanFn(`${mslLabel}${countTag}${distTag}`), cl.px + 8, cl.py - 2);
      }
    }
    ctx.restore();
  }

  static drawHoverReticle(ctx, cam, contact) {
    if (!contact || typeof contact.x !== 'number') return;
    const pos = cam.toScreen(contact.x, contact.y);
    const px = Math.round(pos.x);
    const py = Math.round(pos.y);
    ctx.save(); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }

  static drawTargetReticle(ctx, cam, target) {
    if (!target || typeof target.x !== 'number') return;
    const pos = cam.toScreen(target.x, target.y);
    const px = Math.round(pos.x);
    const py = Math.round(pos.y);
    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const isKnown = (target.team === commanderTeam) ||
      (typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified);
    const isHostile = target.team === 'hostile';
    const isAce = Boolean(target.isAce);

    ctx.save();
    let reticleColor = '#f97316';
    if (isKnown) {
      if (isAce) reticleColor = '#ffd700';
      else if (isHostile) reticleColor = '#ef4444';
      else if (target.isCivilian) reticleColor = '#38bdf8';
      else reticleColor = '#00f0ff';
    }
    ctx.strokeStyle = reticleColor;
    ctx.lineWidth = 1.8;
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(px - s, py - s + 4); ctx.lineTo(px - s, py - s); ctx.lineTo(px - s + 4, py - s);
    ctx.moveTo(px + s - 4, py - s); ctx.lineTo(px + s, py - s); ctx.lineTo(px + s, py - s + 4);
    ctx.moveTo(px + s, py + s - 4); ctx.lineTo(px + s, py + s); ctx.lineTo(px + s - 4, py + s);
    ctx.moveTo(px - s + 4, py + s); ctx.lineTo(px - s, py + s); ctx.lineTo(px - s, py + s - 4);
    ctx.stroke();
    ctx.restore();
  }
}

window.RadarTacticalRenderer = RadarTacticalRenderer;