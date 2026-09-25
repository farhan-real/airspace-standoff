/* AIRSPACE STANDOFF: Inspection Telemetry & Sensor/Weapons Calculation Engine (Liquid Glass Theme) */

class InspectionTelemetry {
  static getRadarRecord(sensor, target, game) {
    const baseRangeKm = sensor.spec ? (sensor.spec.R_0 || 75) : (sensor.rangeKm || 48);
    let aspectMultiplier = 1.0;
    let targetAspect = 'Nose-on';
    if (typeof target.heading === 'number') {
      let angle = Math.abs(target.heading - Math.atan2(sensor.y - target.y, sensor.x - target.x));
      while (angle > Math.PI) angle = Math.abs(angle - Math.PI * 2);
      const deg = Math.round(angle * 180 / Math.PI);
      targetAspect = `${deg}&deg; aspect`;
      if (angle >= 1.0 && angle <= 2.1) {
        let spike = target.spec && target.spec.beamSpike !== undefined ? target.spec.beamSpike : 3.2;
        if (target.beamSpikeReduction) spike = 1 + (spike - 1) * (1 - target.beamSpikeReduction);
        aspectMultiplier = spike;
        targetAspect += ` (Beam Spike x${aspectMultiplier.toFixed(1)})`;
      } else if (angle > 2.1) {
        aspectMultiplier = 1.8;
        targetAspect += ' (Tail Aspect)';
      }
    }

    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const distanceKm = Math.hypot(target.x - sensor.x, target.y - sensor.y);
    const rangeKm = typeof Physics !== 'undefined' ? Physics.getRadarMaxDetectionRange(sensor, target, clouds) : baseRangeKm;
    const inClouds = clouds.some(c => c.containsPoint(target.x, target.y) || c.containsPoint(sensor.x, sensor.y));
    const inCone = sensor.heading === undefined || !sensor.spec || sensor.spec.radarConeDeg >= 360 || (() => {
      let diff = Math.abs(sensor.heading - Math.atan2(target.y - sensor.y, target.x - sensor.x));
      while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
      return diff <= (sensor.spec.radarConeDeg / 2) * (Math.PI / 180);
    })();

    const detects = rangeKm > 0 && distanceKm <= rangeKm && inCone;
    return { sensor, rangeKm, baseRangeKm, distanceKm, detects, inCone, inClouds, targetAspect, aspectMultiplier };
  }

  static renderRadarDashboard(controller, target) {
    if (!target || typeof target.x !== 'number') return '<div class="inspection-empty"><b>No Target Coordinates</b><span>Select a contact with active spatial coordinates.</span></div>';
    const isMissile = Boolean(target.weapon && target.target);
    const game = controller.game;
    const commanderTeam = game.currentPvpCommander || 'friendly';
    const enemyTeam = commanderTeam === 'friendly' ? 'hostile' : 'friendly';
    const sensors = (enemyTeam === 'friendly' ? (game.alliedAircraft || []) : (game.hostileAircraft || []))
      .filter(sensor => sensor && sensor.id !== target.id && sensor.hp > 0);

    const records = sensors.map(sensor => this.getRadarRecord(sensor, target, game))
      .sort((a, b) => Number(b.detects) - Number(a.detects) || a.distanceKm - b.distanceKm);

    const rcs = Number(target.effectiveRcs !== undefined ? target.effectiveRcs : (target.rcs !== undefined ? target.rcs : 1.0));
    const rcsBar = Math.max(0, Math.min(100, ((Math.log10(Math.max(0.0001, rcs)) + 4) / 6) * 100));

    const enemyDetectedSet = enemyTeam === 'friendly' ? game.detectedByBlue : game.detectedByRed;
    const hasContact = Boolean(enemyDetectedSet && enemyDetectedSet.has(target.id));
    const isId = typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(enemyTeam) : target.isIdentified;

    const sensorRows = records.map(rec => {
      const rangePercent = Math.min(100, (rec.rangeKm / 150) * 100);
      const distPercent = Math.min(100, (rec.distanceKm / 150) * 100);
      const badgeClass = rec.detects ? 'positive' : 'negative';
      const badgeText = rec.detects ? 'IN ENVELOPE (LOCKED)' : (!rec.inCone ? 'OUTSIDE SCAN CONE' : (rec.inClouds ? 'ATTENUATED IN CLOUD' : 'BEYOND RADAR HORIZON'));

      return `
        <div class="inspection-sensor-row">
          <div class="inspection-sensor-meta">
            <b>${controller.escape(controller.getName(rec.sensor))}</b>
            <span class="factor-chip ${badgeClass}">${badgeText}</span>
          </div>
          <div class="inspection-range-track">
            <span class="inspection-range-fill ${rec.detects ? 'detecting' : ''}" style="width:${rangePercent}%;"></span>
            <i class="inspection-distance-marker" style="left:${distPercent}%;" title="Distance: ${rec.distanceKm.toFixed(1)} km"></i>
          </div>
          <div class="inspection-range-reading">
            Range: <b>${rec.rangeKm.toFixed(1)} km</b> - Distance: <b>${rec.distanceKm.toFixed(1)} km</b> - ${rec.targetAspect}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="inspection-card">
        <h3>STEALTH &amp; RADAR CROSS SECTION</h3>
        <div class="inspection-rcs-bar" style="margin-top:6px;">
          <span>RCS SPECTRUM:</span>
          <div><i style="width:${rcsBar}%;"></i></div>
          <b style="color:var(--color-ice-highlight);">${rcs.toFixed(rcs < 0.01 ? 5 : 2)} m&sup2;</b>
        </div>
        <div class="inspection-chips-wrap" style="margin-top:8px;">
          <span class="factor-chip ${hasContact ? 'negative' : 'positive'}">${hasContact ? 'ENEMY RADAR CONTACT ACTIVE' : 'STEALTH PROFILE SECURE'}</span>
          <span class="factor-chip ${isId ? 'negative' : 'positive'}">${isId ? 'TARGET POSITIVELY IDENTIFIED' : 'UNIDENTIFIED BOGEY'}</span>
          ${target.isNotching ? '<span class="factor-chip positive">DOPPLER NOTCHING (90&deg; BEAM)</span>' : ''}
          ${target.cmTimer > 0 ? '<span class="factor-chip positive">CHAFF SCREEN ACTIVE</span>' : ''}
        </div>
      </section>

      <section class="inspection-card">
        <h3>HOSTILE SENSOR ACQUISITION ENVELOPES (${records.filter(r => r.detects).length}/${records.length} IN RANGE)</h3>
        <p class="inspection-muted">Horizontal bar indicates radar reach; gold needle represents current target distance.</p>
        <div style="margin-top:8px; display:flex; flex-direction:column; gap:4px;">
          ${sensorRows || '<p class="inspection-muted">No hostile sensors in this theater.</p>'}
        </div>
      </section>
    `;
  }

  static renderWeaponsDashboard(controller, entity) {
    if (entity.weapon && entity.target) return this.renderInFlightMissileSolution(controller, entity);
    if (entity.spec) return this.renderAircraftWeaponSolutions(controller, entity);
    return '<div class="inspection-empty"><b>No Weapon Solutions Available</b><span>Select an aircraft or missile to review hit solutions.</span></div>';
  }

  static renderInFlightMissileSolution(controller, missile) {
    const w = missile.weapon || {};
    const tgt = missile.target;
    const game = controller.game;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
    const dist = Math.hypot(tgt.x - missile.x, tgt.y - missile.y);

    const pkModel = (typeof MissileKinetics !== 'undefined' && tgt)
      ? MissileKinetics.explainHitProbability(missile, tgt, clouds, 1)
      : { probability: 0.65, factors: {} };

    const pkPct = Math.round(pkModel.probability * 100);
    const factors = pkModel.factors || {};

    const advantageChips = [];
    const disadvantageChips = [];

    if (factors.salvoBonus > 0) advantageChips.push(`Salvo Saturation (+${Math.round(factors.salvoBonus * 100)}%)`);
    if (factors.mixedSeekers) advantageChips.push('Mixed Seeker Dilemma (+25%)');
    if (factors.afterburnerHeatBonus > 0) advantageChips.push('Target Afterburner IR Bloom (+15%)');
    if (factors.targetEnergyBonus > 0) advantageChips.push(`Target Energy Deficit (+${Math.round(factors.targetEnergyBonus * 100)}%)`);

    if (factors.activeManeuverEvasion > 0) disadvantageChips.push(`Target Evasion Break (-${Math.round(factors.activeManeuverEvasion * 100)}%)`);
    if (factors.notchBonus > 0) disadvantageChips.push('Doppler Notch (-38%)');
    if (factors.chaffBonus > 0) disadvantageChips.push('Chaff Decoys Active (-34%)');
    if (factors.opticalWeatherPenalty > 0) disadvantageChips.push('Moisture Cloud Scattering (-25%)');
    if (factors.turnEfficiencyPenalty > 0) disadvantageChips.push('Target Corner Velocity Defense');

    return `
      <section class="inspection-probability-card ${pkPct >= 70 ? 'high' : (pkPct >= 45 ? 'medium' : 'low')}">
        <div class="inspection-probability-head">
          <b>TERMINAL INTERCEPT SOLUTION</b>
          <span class="inspection-probability-value">${pkPct}% P_k</span>
        </div>
        <div class="inspection-probability-bar"><i style="width:${pkPct}%;"></i></div>
        <div style="display:flex; justify-content:space-between; font:600 0.52rem var(--font-dotdigital); color:var(--color-moon-mist);">
          <span>SEEKER: <b style="color:var(--color-ice-highlight);">${w.seeker || 'GUIDED'}</b></span>
          <span>STAGE: <b style="color:var(--stat-tier-3);">${missile.stage || 'BOOST'}</b></span>
          <span>DISTANCE: <b style="color:var(--theme-accent);">${dist.toFixed(1)} km</b></span>
        </div>
        <div class="inspection-chips-wrap" style="margin-top:6px;">
          ${advantageChips.map(c => `<span class="factor-chip positive">+ ${c}</span>`).join('')}
          ${disadvantageChips.map(c => `<span class="factor-chip negative">- ${c}</span>`).join('')}
        </div>
      </section>
    `;
  }

  static renderAircraftWeaponSolutions(controller, aircraft) {
    const game = controller.game;
    const tgt = game.selectedTarget;
    const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];

    const incoming = (game.missiles || []).filter(m => m.active && m.target && m.target.id === aircraft.id);

    let threatListHtml = '';
    if (incoming.length > 0) {
      threatListHtml = `
        <section class="inspection-card" style="border-color:rgba(244,63,94,0.4); background:rgba(24,6,12,0.7);">
          <h3 style="color:#fecdd3;">INBOUND THREAT ALERTS (${incoming.length})</h3>
          <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">
            ${incoming.map(m => {
              const d = Math.hypot(m.x - aircraft.x, m.y - aircraft.y);
              return `
                <div class="inspection-inbound-card">
                  <div>
                    <strong style="display:block;">${controller.escape(m.weapon ? m.weapon.name : 'MISSILE')}</strong>
                    <span style="font:0.48rem var(--font-dotdigital); color:var(--color-frost-glow);">SEEKER: ${m.weapon ? m.weapon.seeker : 'ARH'} - SPEED: Mach ${m.speed.toFixed(1)}</span>
                  </div>
                  <b style="color:var(--color-red); font:700 0.64rem var(--font-dotdigital);">${d.toFixed(1)} km</b>
                </div>`;
            }).join('')}
          </div>
        </section>
      `;
    }

    if (!tgt || tgt.hp <= 0) {
      return `
        ${threatListHtml}
        <div class="inspection-empty">
          <b>NO VALID WEAPON TARGET</b>
          <span>Select an enemy aircraft or surface battery on the radar map to calculate firing solutions.</span>
        </div>
      `;
    }

    const dist = Math.hypot(tgt.x - aircraft.x, tgt.y - aircraft.y);
    const weapons = aircraft.equippedWeapons || [];

    const solutionsHtml = weapons.map((item, idx) => {
      const w = item.weapon;
      if (!w) return '';
      const pkRes = (typeof Physics !== 'undefined') ? Physics.calcPk(w, aircraft, tgt, clouds) : { pk: 50 };
      const pk = pkRes.pk || 0;
      const inRange = (dist <= (w.rangeKm || 50) && dist >= (w.minRangeKm || 0.8));

      return `
        <div class="inspection-sensor-row" style="padding:6px 0;">
          <div class="inspection-sensor-meta">
            <b>${idx + 1}. ${controller.escape(w.name || w.id)} (${item.ammo}/${item.maxAmmo})</b>
            <span class="factor-chip ${inRange ? (pk >= 65 ? 'positive' : 'neutral') : 'negative'}">${inRange ? `${pk}% P_k` : 'OUT OF BASKET'}</span>
          </div>
          <div class="inspection-range-track" style="margin-top:3px;">
            <span class="inspection-range-fill ${inRange ? 'detecting' : ''}" style="width:${Math.min(100, (w.rangeKm / 150) * 100)}%;"></span>
            <i class="inspection-distance-marker" style="left:${Math.min(100, (dist / 150) * 100)}%;"></i>
          </div>
          <div class="inspection-range-reading" style="display:flex; justify-content:space-between; margin-top:2px;">
            <span>${w.seeker || 'GUIDED'} - ${w.damage} HP WARHEAD</span>
            <span>RNG: ${dist.toFixed(1)} / ${w.rangeKm} km</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      ${threatListHtml}
      <section class="inspection-card">
        <h3>STORES FIRING SOLUTIONS VS ${controller.escape(controller.getName(tgt))} (${dist.toFixed(1)} km)</h3>
        <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">
          ${solutionsHtml || '<p class="inspection-muted">No stores installed on this aircraft.</p>'}
        </div>
      </section>
    `;
  }
}

window.InspectionTelemetry = InspectionTelemetry;