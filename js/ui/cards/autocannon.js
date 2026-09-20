/**
 * AIRSPACE STANDOFF: Autocannon Bay Controller, Gun Pod Volleys & Burst Cooldowns
 */

class AutocannonBayRenderer {
  static getMountedGunpods(unit) {
    if (!unit || !unit.equippedWeapons) return [];
    return unit.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
  }

  static render(targetContainer, activeUnit, isMobile, fireCallback, getTargetFn) {
    const gun = activeUnit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { name: 'Autocannon', id: 'M61A2', rangeKm: 4.6, damagePerSec: 2.8, coneAngleDeg: 55 };
    const gunName = String(gun.name || 'Autocannon');
    const shortGunName = gunName.split(' ')[0] || 'GUN';
    const mountedPods = AutocannonBayRenderer.getMountedGunpods(activeUnit);
    const extraPodsCount = mountedPods.length;
    const podTag = extraPodsCount > 0 ? ` (+${extraPodsCount} PODS)` : '';

    const gunBox = document.createElement('div');
    gunBox.id = 'autocannon-active-bay';

    if (isMobile) {
      gunBox.className = 'mob-compact-cannon';
      gunBox.innerHTML = `
        <div class="mob-cannon-row">
          <div style="display:flex;align-items:center;gap:4px;overflow:hidden;min-width:0;flex:1;">
            <span class="mob-pylon-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;">${shortGunName}${podTag}</span>
            <span id="gun-ui-ammo" class="mob-pylon-cap" style="flex-shrink:0;">${activeUnit.gunAmmo || 0} RDS</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <button type="button" class="micro-spec-btn" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon mob-fire-btn" style="width:auto;min-width:76px;">BURST</button>
          </div>
        </div>
      `;
    } else {
      gunBox.className = 'autocannon-status-card';
      let totalBurstDmg = (gun.damagePerBurst || gun.damagePerPulse || 0.85);
      mountedPods.forEach(p => { totalBurstDmg += (p.weapon.damagePerBurst || p.weapon.damage || 0.80); });
      const dmgDisplay = `${totalBurstDmg.toFixed(2)} HP/burst${podTag}`;
      const coneText = `${gun.coneAngleDeg || 45}&deg; CONE`;

      gunBox.innerHTML = `
        <div class="pylon-top-row">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;min-width:0;flex:1;">
            <span id="gun-ui-name" style="color:#f8fafc;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px;">${gunName}${podTag}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <span id="gun-ui-ammo" class="gun-ammo-tag" style="color:#00f5a0;font-family:var(--font-mono);font-weight:700;">${activeUnit.gunAmmo || 0} RDS</span>
          </div>
        </div>
        <div class="autocannon-auto-badge">
          <span id="gun-ui-stats">${coneText} &bull; <b style="color:#ffb830;">${dmgDisplay}</b></span>
          <span id="gun-ui-indicator" class="armed-indicator" style="color:#00f0ff;">ARMED</span>
        </div>
        <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon" style="margin-top:2px;border-color:#00f0ff;color:#7dd3fc;">BURST</button>
      `;
    }

    const cannonBtn = gunBox.querySelector('#btn-fire-cannon-manual');
    if (cannonBtn) {
      let isTouchScroll = false;
      cannonBtn.addEventListener('touchstart', () => { isTouchScroll = false; }, { passive: true });
      cannonBtn.addEventListener('touchmove', () => { isTouchScroll = true; }, { passive: true });
      cannonBtn.onclick = (e) => {
        e.stopPropagation();
        if (isTouchScroll || (activeUnit.gunCooldown && activeUnit.gunCooldown > 0)) return;
        if (fireCallback) fireCallback(activeUnit, getTargetFn());
      };
    }

    targetContainer.appendChild(gunBox);
  }

  static update(activeUnit, validTarget) {
    const gunCard = document.getElementById('autocannon-active-bay');
    if (!gunCard || !activeUnit) return;

    const distToTgt = validTarget ? Math.hypot(validTarget.x - (activeUnit.x || 0), validTarget.y - (activeUnit.y || 0)) : 999;
    const inGunRange = (distToTgt <= (activeUnit.gun ? (activeUnit.gun.rangeKm || 4.6) : 4.6));

    let inCone = false;
    if (validTarget && inGunRange) {
      let angleDiff = Math.abs((activeUnit.heading || 0) - Math.atan2(validTarget.y - activeUnit.y, validTarget.x - activeUnit.x));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
      const maxConeRad = (((activeUnit.gun && activeUnit.gun.coneAngleDeg) ? activeUnit.gun.coneAngleDeg : 45) / 2.0) * (Math.PI / 180.0);
      inCone = (angleDiff <= maxConeRad);
    }

    const ammoEl = gunCard.querySelector('#gun-ui-ammo');
    const indicatorEl = gunCard.querySelector('#gun-ui-indicator');
    const cannonBtn = gunCard.querySelector('#btn-fire-cannon-manual');

    if (ammoEl) ammoEl.textContent = `${activeUnit.gunAmmo || 0} RDS`;
    if (indicatorEl) {
      if (inCone) {
        indicatorEl.textContent = 'TARGET IN CONE';
        indicatorEl.style.color = '#00f5a0';
      } else if (inGunRange) {
        indicatorEl.textContent = 'OFF BORESIGHT';
        indicatorEl.style.color = '#f97316';
      } else {
        indicatorEl.textContent = 'ARMED';
        indicatorEl.style.color = '#00f0ff';
      }
    }

    if (cannonBtn) {
      const cd = (activeUnit.gunCooldown || 0);
      const isCooldown = cd > 0;
      const isOutOfAmmo = ((activeUnit.gunAmmo || 0) <= 0);
      cannonBtn.disabled = (isOutOfAmmo || isCooldown);

      if (isOutOfAmmo) {
        cannonBtn.textContent = 'EMPTY';
        cannonBtn.style.opacity = '0.4';
      } else if (isCooldown) {
        const isEnergy = Boolean(activeUnit.gun && (activeUnit.gun.damagePerPulse || activeUnit.gun.id === 'DE-PULSE' || activeUnit.gun.id.startsWith('PLSL') || activeUnit.gun.id === 'EML_GUN'));
        const label = isEnergy ? 'RECHARGE' : 'COOLING';
        cannonBtn.textContent = `${label} (${cd.toFixed(1)}s)`;
        cannonBtn.style.opacity = '0.5';
      } else {
        cannonBtn.textContent = inCone ? 'BURST' : (inGunRange ? 'BURST [WIDE]' : 'BURST [ARMED]');
        cannonBtn.style.opacity = '1.0';
      }
    }
  }

  static fireAutocannonManual(unit, target, game) {
    if (!unit || unit.hp <= 0.05 || (unit.gunAmmo || 0) <= 0 || (unit.gunCooldown || 0) > 0) return;
    const gun = unit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { rangeKm: 4.6, damagePerSec: 2.8, burstCooldown: 1.0, tracerColor: '#00f0ff', coneAngleDeg: 55 };
    const cd = gun.burstCooldown || 1.5;
    unit.gunCooldown = cd;

    const ammoSpend = gun.ammoPerBurst || 25;
    unit.gunAmmo = Math.max(0, unit.gunAmmo - Math.min(unit.gunAmmo, ammoSpend));

    let combinedDmg = gun.damagePerBurst || gun.damagePerPulse || ((gun.damagePerSec || 2.5) * 0.45);
    const mountedPods = AutocannonBayRenderer.getMountedGunpods(unit);

    mountedPods.forEach(p => {
      p.ammo = Math.max(0, p.ammo - 1);
      p.cooldown = p.weapon.burstCooldown || 1.5;
      combinedDmg += (p.weapon.damagePerBurst || p.weapon.damage || 0.80);
    });

    const validTarget = (target && target.hp > 0.05 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y)) ? target : null;
    const isDEW = Boolean(gun.damagePerPulse || (gun.caliber && gun.caliber.includes('DEW')) || gun.id.startsWith('PLSL') || gun.id === 'DE-PULSE' || gun.id === 'EML_GUN');
    const heading = (typeof unit.heading === 'number' && !isNaN(unit.heading)) ? unit.heading : 0;

    if (gun.thermalBloom && gun.thermalBloom > 1.0) {
      unit.thermalBloomTimer = 4.0;
      if (game && game.radar) game.radar.spawnCombatText(unit.x, unit.y, 'THERMAL BLOOM (STEALTH COMPROMISED)', '#f97316');
    }

    if (validTarget && Math.hypot(validTarget.x - unit.x, validTarget.y - unit.y) <= (gun.rangeKm || 4.6)) {
      let angleDiff = Math.abs(heading - Math.atan2(validTarget.y - unit.y, validTarget.x - unit.x));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
      const maxConeRad = ((gun.coneAngleDeg || 45) / 2.0) * (Math.PI / 180.0);

      if (angleDiff <= maxConeRad) {
        const wasAlive = validTarget.hp > 0.05;
        let finalDmg = combinedDmg;

        const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
        const inCloud = clouds.some(c => c.containsPoint(unit.x, unit.y) || c.containsPoint(validTarget.x, validTarget.y));
        if (inCloud && gun.cloudScattering && gun.cloudScattering > 0) {
          finalDmg *= (1.0 - gun.cloudScattering);
          if (game && game.radar) game.radar.spawnCombatText(validTarget.x, validTarget.y, 'BEAM SCATTERED IN CLOUDS (-75%)', '#f59e0b');
        }

        if (validTarget.isGhost) { validTarget.takeDamage(finalDmg); }
        else if (validTarget.isDecoyDrone) { validTarget.takeDamage(finalDmg); }
        else if (typeof SurfaceUnit !== 'undefined' && validTarget instanceof SurfaceUnit) { validTarget.takeDamage(finalDmg, false); }
        else if (validTarget.isCivilian && typeof validTarget.takeDamage === 'function') { validTarget.takeDamage(finalDmg, unit); }
        else {
          if (validTarget.spec && validTarget.spec.category === 'STRIKE') finalDmg *= 0.60;
          validTarget.hp = Math.max(0, validTarget.hp - finalDmg);
          if (validTarget.hp < 0.05) validTarget.hp = 0;

          if (gun.kineticConcussion && gun.kineticConcussion > 0) {
            if (typeof validTarget.applyActionStress === 'function') validTarget.applyActionStress(gun.kineticConcussion);
            if (validTarget.energy !== undefined) validTarget.energy = Math.max(0.20, validTarget.energy - 0.15);
          } else if (typeof validTarget.applyActionStress === 'function') {
            validTarget.applyActionStress(0.12);
          }
        }

        if (game && game.radar) {
          game.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, gun.tracerColor || '#00f0ff');
          mountedPods.forEach(p => {
            game.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, p.weapon.tracerColor || '#fbbf24');
          });
          const podNote = mountedPods.length > 0 ? `+${mountedPods.length} PODS ` : '';
          game.radar.spawnCombatText(validTarget.x, validTarget.y, `${isDEW ? 'LASER' : 'BURST'} ${podNote}-${finalDmg.toFixed(1)}HP`, '#00f0ff');
        }

        if (typeof AudioSys !== 'undefined') {
          if (isDEW) AudioSys.playLaser();
          else AudioSys.playGunBurst();
        }

        if (wasAlive && validTarget.hp <= 0 && game && game.simulation) {
          if (validTarget.isCivilian) game.simulation.recordCivilianShootdown(unit.team, validTarget, unit);
          else game.simulation.recordKillEvent(unit.team, validTarget, unit, { weapon: gun, isSalvo: mountedPods.length > 0, salvoCount: mountedPods.length + 1 });
        }
        return;
      }
    }

    if (game && game.radar) {
      game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(heading) * (gun.rangeKm || 4.5), unit.y + Math.sin(heading) * (gun.rangeKm || 4.5), gun.tracerColor || '#00f0ff');
      mountedPods.forEach(p => {
        game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(heading) * (p.weapon.rangeKm || 4.2), unit.y + Math.sin(heading) * (p.weapon.rangeKm || 4.2), p.weapon.tracerColor || '#fbbf24');
      });
      game.radar.spawnCombatText(unit.x, unit.y, isDEW ? 'LASER PULSE' : 'STRAFE BURST', '#00f0ff');
    }
    if (typeof AudioSys !== 'undefined') {
      if (isDEW) AudioSys.playLaser();
      else AudioSys.playGunBurst();
    }
  }
}

window.AutocannonBayRenderer = AutocannonBayRenderer;