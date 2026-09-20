/**
 * AIRSPACE STANDOFF // Autocannon Bay Controller & Manual Fire Engine
 */

class AutocannonBayRenderer {
  static render(targetContainer, activeUnit, isMobile, fireCallback, getTargetFn) {
    const gun = activeUnit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { name: 'Autocannon', id: 'M61A2', rangeKm: 4.6, damagePerSec: 2.5 };
    const gunName = String(gun.name || 'Autocannon');
    const shortGunName = gunName.split(' ')[0] || 'GUN';
    const gunBox = document.createElement('div');
    gunBox.id = 'autocannon-active-bay';

    if (isMobile) {
      gunBox.className = 'mob-compact-cannon';
      gunBox.innerHTML = `
        <div class="mob-cannon-row">
          <div style="display:flex;align-items:center;gap:4px;overflow:hidden;min-width:0;flex:1;">
            <span class="mob-pylon-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;">${shortGunName}</span>
            <span id="gun-ui-ammo" class="mob-pylon-cap" style="flex-shrink:0;">${activeUnit.gunAmmo || 0} RDS</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <button type="button" class="micro-spec-btn" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon mob-fire-btn" style="width:auto;min-width:65px;">BURST</button>
          </div>
        </div>
      `;
    } else {
      gunBox.className = 'autocannon-status-card';
      gunBox.innerHTML = `
        <div class="pylon-top-row">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;min-width:0;flex:1;">
            <span id="gun-ui-name" style="color:#f8fafc;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px;">${gunName}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <span id="gun-ui-ammo" class="gun-ammo-tag" style="color:#00f5a0;font-family:var(--font-mono);font-weight:700;">${activeUnit.gunAmmo || 0} RDS</span>
          </div>
        </div>
        <div class="autocannon-auto-badge">
          <span id="gun-ui-stats">MAX: ${gun.rangeKm || 4.6}km &bull; <b style="color:#ffb830;">${(gun.damagePerSec || 2.5).toFixed(1)} HP/s</b></span>
          <span id="gun-ui-indicator" class="armed-indicator" style="color:#00f0ff;">ARMED</span>
        </div>
        <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon" style="margin-top:2px;border-color:#00f0ff;color:#7dd3fc;">FIRE BURST</button>
      `;
    }

    const cannonBtn = gunBox.querySelector('#btn-fire-cannon-manual');
    if (cannonBtn) {
      let isTouchScroll = false;
      cannonBtn.addEventListener('touchstart', () => { isTouchScroll = false; }, { passive: true });
      cannonBtn.addEventListener('touchmove', () => { isTouchScroll = true; }, { passive: true });
      cannonBtn.onclick = (e) => {
        e.stopPropagation();
        if (isTouchScroll) return;
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
    const ammoEl = gunCard.querySelector('#gun-ui-ammo');
    const indicatorEl = gunCard.querySelector('#gun-ui-indicator');
    const cannonBtn = gunCard.querySelector('#btn-fire-cannon-manual');

    if (ammoEl) ammoEl.textContent = `${activeUnit.gunAmmo || 0} RDS`;
    if (indicatorEl) {
      indicatorEl.textContent = inGunRange ? 'IN RANGE' : 'ARMED';
      indicatorEl.style.color = inGunRange ? '#00f5a0' : '#00f0ff';
    }
    if (cannonBtn) {
      const isCooldown = (activeUnit.gunCooldown || 0) > 0;
      cannonBtn.disabled = ((activeUnit.gunAmmo || 0) <= 0 || isCooldown);
      cannonBtn.textContent = ((activeUnit.gunAmmo || 0) <= 0) ? 'EMPTY' : (inGunRange ? 'BURST' : 'STRAFE');
    }
  }

  static fireAutocannonManual(unit, target, game) {
    if (!unit || unit.hp <= 0 || (unit.gunAmmo || 0) <= 0 || (unit.gunCooldown || 0) > 0) return;
    const gun = unit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { rangeKm: 4.6, damagePerSec: 2.5, tracerColor: '#00f0ff' };
    unit.gunAmmo = Math.max(0, unit.gunAmmo - Math.min(unit.gunAmmo, 30));
    unit.gunCooldown = (window.CONFIG && window.CONFIG.AUTO_GUN_COOLDOWN) || 0.35;

    const validTarget = (target && target.hp > 0 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y)) ? target : null;

    if (validTarget && Math.hypot(validTarget.x - unit.x, validTarget.y - unit.y) <= (gun.rangeKm || 4.6)) {
      let rawDmg = (gun.damagePerSec || 2.5) * 0.45;
      const wasAlive = validTarget.hp > 0;

      if (validTarget.isGhost) { validTarget.takeDamage(rawDmg); }
      else if (validTarget.isDecoyDrone) { validTarget.takeDamage(rawDmg); }
      else if (typeof SurfaceUnit !== 'undefined' && validTarget instanceof SurfaceUnit) { validTarget.takeDamage(rawDmg, false); }
      else if (validTarget.isCivilian && typeof validTarget.takeDamage === 'function') { validTarget.takeDamage(rawDmg, unit); }
      else {
        if (validTarget.spec && validTarget.spec.category === 'STRIKE') rawDmg *= 0.60;
        validTarget.hp = Math.max(0, validTarget.hp - rawDmg);
        if (typeof validTarget.applyActionStress === 'function') validTarget.applyActionStress(0.18);
      }

      if (game && game.radar) {
        game.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, gun.tracerColor || '#00f0ff');
        game.radar.spawnCombatText(validTarget.x, validTarget.y, `GUN -${rawDmg.toFixed(1)}HP`, '#00f0ff');
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();

      if (wasAlive && validTarget.hp <= 0 && game && game.simulation) {
        if (validTarget.isCivilian) game.simulation.recordCivilianShootdown(unit.team, validTarget);
        else game.simulation.recordKillEvent(unit.team, validTarget, unit, { weapon: gun, isSalvo: false, salvoCount: 1 });
      }
      return;
    }

    const heading = (typeof unit.heading === 'number' && !isNaN(unit.heading)) ? unit.heading : 0;
    if (game && game.radar) {
      game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(heading) * (gun.rangeKm || 4.5), unit.y + Math.sin(heading) * (gun.rangeKm || 4.5), gun.tracerColor || '#00f0ff');
      game.radar.spawnCombatText(unit.x, unit.y, 'STRAFE', '#00f0ff');
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
  }
}

window.AutocannonBayRenderer = AutocannonBayRenderer;