/**
 * AIRSPACE STANDOFF: Tactical Radar Viewport: Surface Facilities, Multi-Segment Runways & Civilian Traffic
 */

class RadarSurfaceRenderer {
  static MINIMAL_GROUND_LABELS = {
    EW_RADAR_VHF: 'VHF', EW_RADAR_AESA: 'EW', RADAR_BUNKER: 'RADOME',
    EW_RADAR_GAPFILLER: 'GAP', EW_RADAR_MOBILE_3D: 'GIRAFFE', RADAR_ARRAY: 'RADAR', RADAR_VAN: 'RDR',
    EW_JAMMER: 'JAM', EW_JAMMER_GROUND: 'KRASUKHA', EW_STATION_ELINT: 'ELINT',
    COMMS_TOWER: 'COMMS', RADAR_DECOY: 'DECOY', DECOY_THERMAL: 'DECOY-IR',
    'S-400': 'S-400', SAM_HQ9: 'HQ-9B', SAM_PATRIOT: 'PATRIOT', SAM_S300V: 'S-300V',
    SAM_BUK: 'BUK', SAM_NASAMS: 'NASAMS', SAM_HAWK: 'HAWK', SAM_KUB: 'KUB',
    SAM_TOR: 'TOR', SAM_RAPIER: 'RAPIER', SAM_AVENGER: 'STRELA',
    PANTSIR: 'PANTSIR', CIWS_SEARAM: 'SEARAM',
    AAA_TUNGUSKA: 'TUNGUSKA', AAA_SHILKA: 'SHILKA', AAA_GEPARD: 'GEPARD', AAA_FLAK57: 'AAA-57',
    BUNKER: 'HQ', C2_MOBILE: 'C2', RUNWAY_SEG: 'RWY', RUNWAY: 'RWY',
    HARDENED_SHELTER: 'HAS', HANGAR: 'HGR', OPEN_FIELD: 'PAD',
    FUEL_DEPOT: 'FUEL', MUNITION_DUMP: 'AMMO', LOGISTICS_HUB: 'LOGHUB', AMMO_DUMP: 'DEPOT',
    POWER_SUBSTATION: 'PWR', BRIDGE_LOGISTICS: 'BRIDGE', FACTORY_SAM: 'PLANT'
  };

  static getMinimalGroundLabel(s, units) {
    const short = this.MINIMAL_GROUND_LABELS[s.type];
    if (!short) throw new Error(`Missing declutter label mapping for ground unit type "${s.type}".`);
    if (s.isRunwaySegment) {
      const baseSegs = units.filter(u => u.isRunwaySegment && u.airbaseId === s.airbaseId);
      const runInfo = AirbaseSystem.getContiguousRuns(baseSegs);
      const objTag = s.isPrimaryObjective ? (s.isAirbaseNeutralized ? '[OFF] ' : '[OBJ] ') : '';
      return `${objTag}${short} ${runInfo.totalIntact}/5`;
    }
    const objPrefix = s.isPrimaryObjective ? '[OBJ] ' : '';
    const countPart = (s.isAircraftParking && s.parkedAircraft && s.parkedAircraft.length > 0) ? ` (${s.parkedAircraft.length})` : '';
    return `${objPrefix}${short}${countPart}`;
  }

  static drawRunwayStrips(ctx, cam, units) {
    const groups = new Map();
    for (const s of units) {
      if (s && s.isRunwaySegment && s.airbaseId) {
        if (!groups.has(s.airbaseId)) groups.set(s.airbaseId, []);
        groups.get(s.airbaseId).push(s);
      }
    }
    for (const segs of groups.values()) {
      if (segs.length < 2) continue;
      segs.sort((a, b) => a.segmentIndex - b.segmentIndex);
      const p0 = cam.toScreen(segs[0].x, segs[0].y);
      const pN = cam.toScreen(segs[segs.length - 1].x, segs[segs.length - 1].y);

      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = Math.max(5, 7 * cam.zoom);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(pN.x, pN.y); ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(pN.x, pN.y); ctx.stroke();
      ctx.restore();
    }
  }

  static drawSurface(ctx, cam, units, team, detectedSet, activeUnit, selectedTarget, cssWidth, declutterMode) {
    if (!units || units.length === 0 || !cam.showGroundTargets) return;
    const cfg = window.CONFIG;
    if (!cfg || !cfg.THEATER_WIDTH_KM) throw new Error('CONFIG.THEATER_WIDTH_KM is not configured.');
    const isAttack = Boolean(window.Game && window.Game.scenarioMode === 'ATTACK');
    const isInspection = Boolean(window.Game && window.Game.inspection && window.Game.inspection.isOpen && window.Game.inspection.showEnemyDetails);

    this.drawRunwayStrips(ctx, cam, units);
    ctx.save();

    for (let i = 0; i < units.length; i++) {
      const s = units[i];
      if (!s || typeof s.x !== 'number') continue;
      if (s.hp <= 0.05 && !s.isRunwaySegment) continue;
      if (isAttack && s.team === 'hostile' && !s.isRevealedToBlue && !isInspection) continue;

      const isSelectedSurface = Boolean(selectedTarget && selectedTarget.id === s.id);
      const isKnown = !isAttack || s.team === 'friendly' || Boolean(s.identifiedByBlue) || isInspection;
      const pos = cam.toScreen(s.x, s.y);
      const px = pos.x, py = pos.y;

      let col = s.isIndestructible ? '#00f5a0' : (s.team === 'hostile' ? '#ef4444' : (s.isJammerStation ? '#c084fc' : '#00f0ff'));
      if (!isKnown) col = '#f97316';
      else if (s.hp <= 0.05 && s.isRunwaySegment) col = '#64748b';
      else if (s.isGroundDecoy) col = '#fbbf24';
      else if (s.isPrimaryObjective) col = '#ffd700';

      if (s.hp > 0.05 && s.rangeKm && (isSelectedSurface || (isKnown && s.isJammerStation))) {
        ctx.beginPath();
        ctx.arc(px, py, (s.rangeKm / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom, 0, Math.PI * 2);
        if (s.isJammerStation) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.30)' : 'rgba(192, 132, 252, 0.40)';
          ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
        } else if (s.canAttack && isKnown) {
          ctx.strokeStyle = s.team === 'hostile' ? 'rgba(239, 68, 68, 0.38)' : 'rgba(0, 240, 255, 0.38)';
          ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
      }

      ctx.fillStyle = col;
      ctx.strokeStyle = col;
      ctx.lineWidth = isSelectedSurface ? 2.2 : 1.5;

      if (!isKnown) {
        ctx.beginPath(); ctx.moveTo(px, py - 7); ctx.lineTo(px + 7, py); ctx.lineTo(px, py + 7); ctx.lineTo(px - 7, py); ctx.closePath(); ctx.stroke();
      } else if (s.isRunwaySegment) {
        ctx.save(); ctx.translate(px, py); ctx.rotate(s.heading || 0);
        if (s.hp <= 0.05) {
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(5, 4); ctx.moveTo(5, -4); ctx.lineTo(-5, 4); ctx.stroke();
        } else {
          ctx.strokeRect(-7, -3, 14, 6); ctx.fillRect(-5, -1, 10, 2);
        }
        ctx.restore();
      } else if (s.isOpenField) {
        ctx.setLineDash([2, 2]); ctx.strokeRect(px - 7, py - 5, 14, 10); ctx.setLineDash([]);
        if (s.parkedAircraft && s.parkedAircraft.length > 0) { ctx.fillStyle = '#fbbf24'; ctx.fillRect(px - 2, py - 2, 4, 4); }
      } else if (s.type === 'RADAR_BUNKER') {
        ctx.strokeRect(px - 7, py - 7, 14, 14);
        ctx.beginPath(); ctx.arc(px, py + 1, 4.5, Math.PI, Math.PI * 2); ctx.stroke();
      } else if (s.type === 'BUNKER' || s.isAircraftShelter || s.type === 'C2_MOBILE' || s.isLogisticsHub) {
        ctx.strokeRect(px - 7, py - 7, 14, 14);
        ctx.fillRect(px - 3, py - 3, 6, 6);
      } else if (s.category === 'LR_SAM' || s.category === 'MR_SAM' || s.category === 'SR_SAM' || s.type === 'S-400') {
        ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(px + 8, py); ctx.lineTo(px, py + 8); ctx.lineTo(px - 8, py); ctx.closePath(); ctx.stroke();
      } else if (s.isAaaGun || s.category === 'CIWS') {
        ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 7, py); ctx.lineTo(px + 7, py); ctx.moveTo(px, py - 7); ctx.lineTo(px, py + 7); ctx.stroke();
      } else if (s.isJammerStation) {
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 4, py); ctx.lineTo(px, py - 4); ctx.lineTo(px + 4, py); ctx.lineTo(px, py + 4); ctx.closePath(); ctx.fill();
      } else if (s.category === 'EW_RADAR' || s.isPassiveElint || s.isCommsRelay) {
        ctx.beginPath(); ctx.arc(px, py, 6, Math.PI, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 4, py + 2); ctx.lineTo(px + 4, py + 2); ctx.stroke();
      } else if (s.isIndestructible) {
        ctx.strokeStyle = '#00f5a0'; ctx.strokeRect(px - 7, py - 7, 14, 14);
        ctx.fillStyle = '#00f5a0'; ctx.fillRect(px - 3, py - 3, 6, 6);
      } else {
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.stroke();
      }

      if (isKnown && s.isPrimaryObjective && (!s.isRunwaySegment || (s.hp > 0.05 && !s.isAirbaseNeutralized))) {
        ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1.4; ctx.strokeRect(px - 12, py - 12, 24, 24);
      }

      const showSegmentLabel = !s.isRunwaySegment || s.segmentIndex === 2 || isSelectedSurface;
      if (showSegmentLabel) {
        ctx.font = '700 10px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = col;

        if (declutterMode && !isSelectedSurface) {
          const minLabel = !isKnown ? 'EMITTER ?' : this.getMinimalGroundLabel(s, units);
          ctx.fillText(RadarRenderer.cleanText(minLabel), px + 11, s.isRunwaySegment ? py - 11 : py + 3);
        } else {
          const distKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(s.x - activeUnit.x, s.y - activeUnit.y)) : null;
          const distTag = distKm !== null ? (' R:' + distKm + 'km') : '';

          if (!isKnown) ctx.fillText(RadarRenderer.cleanText(`EMITTER [?]${distTag}`), px + 11, py + 3);
          else if (s.isRunwaySegment && s.segmentIndex === 2 && !isSelectedSurface) {
            const baseSegs = units.filter(u => u.isRunwaySegment && u.airbaseId === s.airbaseId);
            const runInfo = AirbaseSystem.getContiguousRuns(baseSegs);
            const objTag = s.isPrimaryObjective ? (s.isAirbaseNeutralized ? '[DISABLED] ' : '[OBJ] ') : '';
            ctx.fillText(RadarRenderer.cleanText(`${objTag}RUNWAY (${runInfo.totalIntact}/5 INTACT, MAX ${runInfo.maxLength} SEG)${distTag}`), px + 11, py - 11);
          } else {
            const shortCode = s.isPrimaryObjective ? `[OBJ] ${s.name}` : (s.isIndestructible ? 'AMMO DEPOT [SAFE]' : s.name);
            const jetsTag = (s.isAircraftParking && s.parkedAircraft && s.parkedAircraft.length > 0) ? ` (${s.parkedAircraft.length} JETS)` : '';
            const emconTag = s.emconTimer > 0 ? ' [EMCON]' : '';
            const displayHp = s.hp > 0.05 ? Math.max(1, Math.round(s.hp)) : 0;
            const hpTag = s.isIndestructible ? ' [INF]' : ` [${displayHp}]`;
            ctx.fillText(RadarRenderer.cleanText(shortCode + jetsTag + hpTag + emconTag + distTag), px + 11, py + 3);
          }
        }
      }
    }
    ctx.restore();
  }

  static drawCivilianTraffic(ctx, cam, civilians, detectedSet, activeUnit, declutterMode) {
    if (!civilians || civilians.length === 0) return;
    ctx.save();
    for (let i = 0; i < civilians.length; i++) {
      const civ = civilians[i];
      if (!civ || civ.hp <= 0 || typeof civ.x !== 'number') continue;
      const pos = cam.toScreen(civ.x, civ.y);
      const px = pos.x, py = pos.y, isIdentified = civ.isIdentified;

      ctx.save(); ctx.translate(px, py); ctx.rotate(civ.heading || 0);
      if (!isIdentified) {
        ctx.strokeStyle = '#f97316'; ctx.fillStyle = 'rgba(20, 25, 35, 0.90)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(12, 0); ctx.quadraticCurveTo(9, 2.4, 5, 2.4); ctx.lineTo(2, 2.5); ctx.lineTo(-3, 12); ctx.lineTo(-5.5, 12);
        ctx.lineTo(-2, 2.5); ctx.lineTo(-8, 2.0); ctx.lineTo(-11, 6); ctx.lineTo(-13, 6); ctx.lineTo(-11, 1.2); ctx.lineTo(-13, 0);
        ctx.lineTo(-11, -1.2); ctx.lineTo(-13, -6); ctx.lineTo(-11, -6); ctx.lineTo(-8, -2.0); ctx.lineTo(-2, -2.5);
        ctx.lineTo(-5.5, -12); ctx.lineTo(-3, -12); ctx.lineTo(2, -2.5); ctx.lineTo(5, -2.4); ctx.quadraticCurveTo(9, -2.4, 12, 0); ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)'; ctx.fill(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();

      const vLen = (civ.speed || 0.78) * 18 * cam.zoom;
      ctx.strokeStyle = isIdentified ? '#38bdf8' : '#f97316'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(civ.heading || 0) * vLen, py + Math.sin(civ.heading || 0) * vLen); ctx.stroke();

      const relDistKm = (activeUnit && activeUnit.hp > 0) ? Math.round(Math.hypot(civ.x - activeUnit.x, civ.y - activeUnit.y)) : null;
      const rangeTag = (relDistKm !== null) ? (' R:' + relDistKm + 'km') : '';
      const rawCode = RadarRenderer.cleanText(civ.flightCode || '700');
      const mch = 'M ' + (civ.speed || 0.78).toFixed(2);
      const fl = 'FL' + Math.round((civ.altFt || 36000) / 100);
      const labelX = px + 15, labelY = py - 7;

      if (declutterMode) {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = isIdentified ? '#38bdf8' : '#f97316';
        ctx.fillText(RadarRenderer.cleanText(isIdentified ? 'CIVILIAN' : ('BOGEY' + (rangeTag ? ` [${relDistKm}km]` : ''))), labelX, labelY + 6);
      } else if (!isIdentified) {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = '#f97316'; ctx.fillText(RadarRenderer.cleanText('BOGEY [?]' + rangeTag), labelX, labelY);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(RadarRenderer.cleanText(mch + ' ' + fl), labelX, labelY + 11);
      } else {
        ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = '#38bdf8'; ctx.fillText(RadarRenderer.cleanText('CIVILIAN ' + rawCode), labelX, labelY);
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(RadarRenderer.cleanText((civ.model || civ.name || 'Commercial Airliner') + rangeTag), labelX, labelY + 11);
        ctx.fillStyle = '#00f5a0'; ctx.fillText(RadarRenderer.cleanText(mch + ' ' + fl + ' ' + Math.round(civ.hp) + '/' + (civ.maxHp || 6) + ' HP'), labelX, labelY + 22);
      }
    }
    ctx.restore();
  }
}

window.RadarSurfaceRenderer = RadarSurfaceRenderer;
