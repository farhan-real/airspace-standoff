/**
 * AIRSPACE STANDOFF: 360 Degree RCS Polar Radiation Diagram
 */

class PolarRCSRenderer {
  static getThreatRadars(aircraft, game) {
    if (!aircraft || !game) return [];
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const isFriendly = aircraft.team === commanderTeam;
    const enemyRadars = [];

    const candidates = isFriendly
      ? [...(game.hostileAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'hostile'))]
      : [...(game.alliedAircraft || []), ...(game.surfaceUnits.filter(s => s.team === 'friendly'))];

    candidates.forEach(sensor => {
      if (!sensor || sensor.hp <= 0.05 || typeof sensor.x !== 'number') return;
      const dx = aircraft.x - sensor.x;
      const dy = aircraft.y - sensor.y;
      const dist = Math.hypot(dx, dy);

      const maxR0 = sensor.spec ? sensor.spec.R_0 : (sensor.rangeKm || 45);
      if (dist > maxR0 * 1.5) return;

      const angleToAircraft = Math.atan2(aircraft.y - sensor.y, aircraft.x - sensor.x);
      let offBoresight = Math.abs((sensor.heading !== undefined ? sensor.heading : angleToAircraft) - angleToAircraft);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

      const halfCone = ((sensor.spec ? sensor.spec.radarConeDeg : (sensor.type ? 360 : 120)) / 2) * (Math.PI / 180);
      const isInCone = (offBoresight <= halfCone);

      const isLocked = Boolean(sensor.radarLockedTarget && sensor.radarLockedTarget.id === aircraft.id);
      if (isInCone || isLocked) {
        // Bearing from aircraft to threat emitter
        const bearingFromAircraft = Math.atan2(sensor.y - aircraft.y, sensor.x - aircraft.x);
        let relAngle = bearingFromAircraft - (aircraft.heading || 0);
        while (relAngle < 0) relAngle += Math.PI * 2;
        while (relAngle >= Math.PI * 2) relAngle -= Math.PI * 2;

        enemyRadars.push({
          unit: sensor,
          distKm: dist,
          relAngleRad: relAngle,
          relAngleDeg: Math.round(relAngle * 180 / Math.PI),
          isLocked,
          name: sensor.callsign || sensor.name || (sensor.spec ? sensor.spec.id : sensor.type || 'RADAR')
        });
      }
    });

    return enemyRadars.sort((a, b) => (b.isLocked ? 1 : 0) - (a.isLocked ? 1 : 0) || a.distKm - b.distKm);
  }

  static renderCanvas(canvas, aircraft, game) {
    if (!canvas || !aircraft) return;
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
    const radius = Math.min(cx - 30, cy - 24);

    // Decibel Logarithmic Rings: 0.0001, 0.01, 0.1, 1.0, 10.0 m2
    const rings = [
      { rcs: 0.0001, label: '0.0001m2 (VLO)' },
      { rcs: 0.01,   label: '0.01m2' },
      { rcs: 0.1,    label: '0.1m2' },
      { rcs: 1.0,    label: '1.0m2 (STD)' },
      { rcs: 10.0,   label: '10m2' }
    ];

    const rcsToRadius = (rcsVal) => {
      const logMin = -4; // 10^-4 = 0.0001
      const logMax = 1.2; // 10^1.2 ~= 15
      const logVal = Math.log10(Math.max(0.0001, Math.min(15, rcsVal)));
      const norm = (logVal - logMin) / (logMax - logMin);
      return Math.max(10, norm * radius);
    };

    // Concentric ring grid
    rings.forEach((ring, idx) => {
      const r = rcsToRadius(ring.rcs);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 3 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = idx === 3 ? 1.4 : 0.8;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '600 7.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(ring.label, cx + 4, cy - r + 9);
    });

    // Radial axis spokes
    [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4].forEach(ang => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(ang) * radius, cy - Math.cos(ang) * radius);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    });

    // Outer Sector Labels
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('0° NOSE', cx, cy - radius - 8);
    ctx.fillText('180° TAIL', cx, cy + radius + 14);
    ctx.textAlign = 'left';
    ctx.fillText('90° R-BEAM', cx + radius + 6, cy + 3);
    ctx.textAlign = 'right';
    ctx.fillText('270° L-BEAM', cx - radius - 6, cy + 3);

    // Compute and draw 360° RCS polygon
    const baseRcs = (aircraft.spec && aircraft.spec.sigma_0 !== undefined) ? aircraft.spec.sigma_0 : 1.0;
    const spike = (aircraft.spec && aircraft.spec.beamSpike !== undefined) ? aircraft.spec.beamSpike : 3.2;
    const loadedRcs = aircraft.effectiveRcs || baseRcs;

    const calcRcsAtAspect = (aspectDeg, sigma) => {
      let ang = Math.abs(aspectDeg);
      while (ang > 180) ang = 360 - ang;
      const rad = ang * (Math.PI / 180);
      let mult = 1.0;
      if (rad >= 1.0 && rad <= 2.1) {
        mult = spike;
      } else if (rad > 2.1) {
        mult = 1.8;
      }
      return sigma * mult;
    };

    // Loaded RCS polygon
    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 4) {
      const angRad = deg * (Math.PI / 180);
      const rcs = calcRcsAtAspect(deg, loadedRcs);
      const r = rcsToRadius(rcs);
      const px = cx + Math.sin(angRad) * r;
      const py = cy - Math.cos(angRad) * r;
      if (deg === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Center aircraft glyph
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Visuals on where enemy radars are pointing currently
    const threats = this.getThreatRadars(aircraft, game);
    threats.forEach(threat => {
      const ang = threat.relAngleRad;
      const endX = cx + Math.sin(ang) * (radius * 0.96);
      const endY = cy - Math.cos(ang) * (radius * 0.96);
      const startX = cx + Math.sin(ang) * (radius * 1.15);
      const startY = cy - Math.cos(ang) * (radius * 1.15);

      const isLocked = threat.isLocked;
      const rayColor = isLocked ? '#f43f5e' : '#fbbf24';

      ctx.save();
      ctx.strokeStyle = rayColor;
      ctx.lineWidth = isLocked ? 2.4 : 1.6;
      if (!isLocked) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow head pointing at center
      const headAngle = Math.atan2(cy - endY, cx - endX);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - Math.cos(headAngle - 0.35) * 8, endY - Math.sin(headAngle - 0.35) * 8);
      ctx.lineTo(endX - Math.cos(headAngle + 0.35) * 8, endY - Math.sin(headAngle + 0.35) * 8);
      ctx.closePath();
      ctx.fillStyle = rayColor;
      ctx.fill();
      ctx.restore();
    });
  }
}

window.PolarRCSRenderer = PolarRCSRenderer;