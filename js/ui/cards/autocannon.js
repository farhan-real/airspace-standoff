/**
 * AIRSPACE STANDOFF: Autocannon Bay Controller & Gun Pod Volleys
 */

class AutocannonBayRenderer {
  static getMountedGunpods(unit) {
    if (!unit || !unit.equippedWeapons) return [];
    return unit.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
  }

  static render(targetContainer, activeUnit, isMobile, fireCallback, getTargetFn) {
    const gun = activeUnit.gun;
    if (!gun) throw new Error(`Unit "${activeUnit.id}" has no active autocannon definition.`);
    const gunName = String(gun.name);
    const shortGunName = gunName.split(' ')[0] || 'GUN';
    const gunRangeKm = gun.rangeKm.toFixed(1);
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
            <span class="mob-pylon-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1 1 auto;min-width:0;">${shortGunName}${podTag}</span>
            <span class="mob-pylon-cap" style="color:#00f0ff;flex-shrink:0;">${gunRangeKm}km</span>
            <span id="gun-ui-ammo" class="mob-pylon-cap" style="flex-shrink:0;">${activeUnit.gunAmmo} RDS</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <button type="button" class="micro-spec-btn" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon mob-fire-btn" style="width:auto;min-width:76px;">BURST</button>
          </div>
        </div>
      `;
    } else {
      gunBox.className = 'autocannon-status-card';
      let totalBurstDmg = gun.damagePerBurst;
      mountedPods.forEach(p => { totalBurstDmg += p.weapon.damagePerBurst; });
      const roundsCount = gun.roundsPerBurst;
      const dmgDisplay = `${totalBurstDmg.toFixed(2)} HP (${roundsCount} rds)${podTag}`;
      const coneText = `${gun.coneAngleDeg}&deg; CONE`;

      gunBox.innerHTML = `
        <div class="pylon-top-row">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;min-width:0;flex:1;">
            <span id="gun-ui-name" style="color:#f8fafc;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1 1 auto;min-width:0;">${gunName}${podTag}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <span id="gun-ui-ammo" class="gun-ammo-tag" style="color:#00f5a0;font-family:var(--font-mono);font-weight:700;">${activeUnit.gunAmmo} RDS</span>
          </div>
        </div>
        <div class="autocannon-auto-badge">
          <span id="gun-ui-stats"><b style="color:#00f0ff;">${gunRangeKm}km</b> &bull; ${coneText} &bull; <b style="color:#ffb830;">${dmgDisplay}</b></span>
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
    if (!gunCard || !activeUnit || !activeUnit.gun) return;

    const gunRange = activeUnit.gun.rangeKm;
    const distToTgt = validTarget ? Math.hypot(validTarget.x - activeUnit.x, validTarget.y - activeUnit.y) : 999;
    const inGunRange = (distToTgt <= gunRange);

    let inCone = false;
    if (validTarget && inGunRange) {
      let angleDiff = Math.abs((activeUnit.heading || 0) - Math.atan2(validTarget.y - activeUnit.y, validTarget.x - activeUnit.x));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
      const maxConeRad = (activeUnit.gun.coneAngleDeg / 2.0) * (Math.PI / 180.0);
      inCone = (angleDiff <= maxConeRad);
    }

    const ammoEl = gunCard.querySelector('#gun-ui-ammo');
    const indicatorEl = gunCard.querySelector('#gun-ui-indicator');
    const cannonBtn = gunCard.querySelector('#btn-fire-cannon-manual');

    if (ammoEl) ammoEl.textContent = `${activeUnit.gunAmmo} RDS`;
    if (indicatorEl) {
      if (validTarget) {
        if (inCone) {
          indicatorEl.textContent = 'TARGET IN CONE';
          indicatorEl.style.color = '#00f5a0';
        } else if (inGunRange) {
          indicatorEl.textContent = 'OFF BORESIGHT';
          indicatorEl.style.color = '#f97316';
        } else {
          indicatorEl.textContent = 'OUT OF RANGE';
          indicatorEl.style.color = '#ef4444';
        }
      } else {
        indicatorEl.textContent = 'ARMED';
        indicatorEl.style.color = '#00f0ff';
      }
    }

    if (cannonBtn) {
      const cd = activeUnit.gunCooldown || 0;
      const isCooldown = cd > 0;
      const isOutOfAmmo = activeUnit.gunAmmo <= 0;
      cannonBtn.disabled = (isOutOfAmmo || isCooldown);

      if (isOutOfAmmo) {
        cannonBtn.textContent = 'EMPTY';
        cannonBtn.style.opacity = '0.4';
      } else if (isCooldown) {
        const isEnergy = Boolean(activeUnit.gun.damagePerPulse || activeUnit.gun.id === 'DE-PULSE' || activeUnit.gun.id.startsWith('PLSL') || activeUnit.gun.id === 'EML_GUN');
        const label = isEnergy ? 'RECHARGE' : 'RELOAD';
        cannonBtn.textContent = `${label} (${cd.toFixed(1)}s)`;
        cannonBtn.style.opacity = '0.5';
      } else {
        const roundsCount = activeUnit.gun.roundsPerBurst;
        if (validTarget && !inGunRange) {
          cannonBtn.textContent = `OUT OF RANGE (${distToTgt.toFixed(1)}km)`;
        } else if (inCone) {
          cannonBtn.textContent = `BURST (${roundsCount} RDS)`;
        } else if (inGunRange) {
          cannonBtn.textContent = `BURST [WIDE] (${roundsCount} RDS)`;
        } else {
          cannonBtn.textContent = `BURST (${roundsCount} RDS)`;
        }
        cannonBtn.style.opacity = '1.0';
      }
    }
  }

  static fireAutocannonManual(unit, target, game) {
    if (typeof AutocannonFireExecutor === 'undefined') throw new Error('AutocannonFireExecutor is not loaded.');
    AutocannonFireExecutor.fireAutocannonManual(unit, target, game);
  }
}

window.AutocannonBayRenderer = AutocannonBayRenderer;