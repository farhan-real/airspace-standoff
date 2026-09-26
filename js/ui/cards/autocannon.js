/**
 * AIRSPACE STANDOFF: Autocannon Bay Controller, Gun Pod Volleys & Multi-Round Burst Engine
 */

class AutocannonBayRenderer {
  static getMountedGunpods(unit) {
    if (!unit || !unit.equippedWeapons) return [];
    return unit.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
  }

  static render(targetContainer, activeUnit, isMobile, fireCallback, getTargetFn) {
    const gun = activeUnit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { name: 'Autocannon', id: 'M61A2', rangeKm: 4.6, damagePerSec: 2.8, coneAngleDeg: 55, roundsPerBurst: 4, damagePerBurst: 1.40, burstCooldown: 1.6 };
    const gunName = String(gun.name || 'Autocannon');
    const shortGunName = gunName.split(' ')[0] || 'GUN';
    const gunRangeKm = (gun.rangeKm || 4.6).toFixed(1);
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
            <span class="mob-pylon-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:85px;">${shortGunName}${podTag}</span>
            <span class="mob-pylon-cap" style="color:#00f0ff;flex-shrink:0;">${gunRangeKm}km</span>
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
      let totalBurstDmg = (gun.damagePerBurst || gun.damagePerPulse || 1.40);
      mountedPods.forEach(p => { totalBurstDmg += (p.weapon.damagePerBurst || p.weapon.damage || 1.28); });
      const roundsCount = gun.roundsPerBurst || 4;
      const dmgDisplay = `${totalBurstDmg.toFixed(2)} HP (${roundsCount} rds)${podTag}`;
      const coneText = `${gun.coneAngleDeg || 45}&deg; CONE`;

      gunBox.innerHTML = `
        <div class="pylon-top-row">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;min-width:0;flex:1;">
            <span id="gun-ui-name" style="color:#f8fafc;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:145px;">${gunName}${podTag}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
            <span id="gun-ui-ammo" class="gun-ammo-tag" style="color:#00f5a0;font-family:var(--font-mono);font-weight:700;">${activeUnit.gunAmmo || 0} RDS</span>
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
    if (!gunCard || !activeUnit) return;

    const gunRange = activeUnit.gun ? (activeUnit.gun.rangeKm || 4.6) : 4.6;
    const distToTgt = validTarget ? Math.hypot(validTarget.x - (activeUnit.x || 0), validTarget.y - (activeUnit.y || 0)) : 999;
    const inGunRange = (distToTgt <= gunRange);

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
      const cd = (activeUnit.gunCooldown || 0);
      const isCooldown = cd > 0;
      const isOutOfAmmo = ((activeUnit.gunAmmo || 0) <= 0);
      cannonBtn.disabled = (isOutOfAmmo || isCooldown);

      if (isOutOfAmmo) {
        cannonBtn.textContent = 'EMPTY';
        cannonBtn.style.opacity = '0.4';
      } else if (isCooldown) {
        const isEnergy = Boolean(activeUnit.gun && (activeUnit.gun.damagePerPulse || activeUnit.gun.id === 'DE-PULSE' || activeUnit.gun.id.startsWith('PLSL') || activeUnit.gun.id === 'EML_GUN'));
        const label = isEnergy ? 'RECHARGE' : 'RELOAD';
        cannonBtn.textContent = `${label} (${cd.toFixed(1)}s)`;
        cannonBtn.style.opacity = '0.5';
      } else {
        const roundsCount = activeUnit.gun ? (activeUnit.gun.roundsPerBurst || 4) : 4;
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
    if (!unit || unit.hp <= 0.05 || (unit.gunAmmo || 0) <= 0 || (unit.gunCooldown || 0) > 0) return;
    const gun = unit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { rangeKm: 4.6, damagePerSec: 2.8, burstCooldown: 1.6, tracerColor: '#00f0ff', coneAngleDeg: 55, roundsPerBurst: 4, damagePerRound: 0.35, damagePerBurst: 1.40 };
    const cd = gun.burstCooldown || 1.6;
    unit.gunCooldown = cd;

    const numRounds = gun.roundsPerBurst || 4;
    const ammoSpend = gun.roundsPerBurst || gun.ammoPerBurst || numRounds;
    unit.gunAmmo = Math.max(0, unit.gunAmmo - Math.min(unit.gunAmmo, ammoSpend));

    const mountedPods = AutocannonBayRenderer.getMountedGunpods(unit);
    mountedPods.forEach(p => {
      const podBurst = p.weapon.ammoPerBurst || p.weapon.roundsPerBurst || 4;
      p.ammo = Math.max(0, p.ammo - podBurst);
      p.cooldown = p.weapon.burstCooldown || cd;
    });

    const isDEW = Boolean(gun.damagePerPulse || (gun.caliber && gun.caliber.includes('DEW')) || gun.id.startsWith('PLSL') || gun.id === 'DE-PULSE' || gun.id === 'EML_GUN');
    if (gun.thermalBloom && gun.thermalBloom > 1.0) {
      unit.thermalBloomTimer = 3.5;
      if (game && game.radar) game.radar.spawnCombatText(unit.x, unit.y, 'THERMAL BLOOM (STEALTH COMPROMISED)', '#f97316');
    }

    if (typeof AudioSys !== 'undefined') {
      if (isDEW) AudioSys.playLaser();
      else AudioSys.playGunBurst();
    }

    let totalBurstDamage = 0;
    let roundsLanded = 0;

    for (let r = 0; r < numRounds; r++) {
      setTimeout(() => {
        if (!unit || unit.hp <= 0.05) return;
        const validTarget = (target && target.hp > 0.05 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y) && !target.isDissolved) ? target : null;
        const heading = (typeof unit.heading === 'number' && !isNaN(unit.heading)) ? unit.heading : 0;
        const spreadOffset = (r - (numRounds - 1) / 2) * 0.012;
        const tracerAngle = heading + spreadOffset;

        if (validTarget && Math.hypot(validTarget.x - unit.x, validTarget.y - unit.y) <= (gun.rangeKm || 4.6)) {
          let angleDiff = Math.abs(heading - Math.atan2(validTarget.y - unit.y, validTarget.x - unit.x));
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
          const maxConeRad = ((gun.coneAngleDeg || 45) / 2.0) * (Math.PI / 180.0);

          if (angleDiff <= maxConeRad) {
            const wasAlive = validTarget.hp > 0.05;
            let roundDmg = gun.damagePerRound || ((gun.damagePerBurst || 1.40) / numRounds);
            mountedPods.forEach(p => {
              const podDmg = p.weapon.damagePerRound || ((p.weapon.damagePerBurst || 1.28) / numRounds);
              roundDmg += podDmg;
            });

            const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
            const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(unit.x, unit.y, validTarget.x, validTarget.y, clouds) : 0;
            if (cloudHits > 0 && gun.cloudScattering && gun.cloudScattering > 0) {
              roundDmg *= Math.max(0.10, Math.pow(1.0 - gun.cloudScattering, cloudHits));
            }

            if (validTarget.spec && validTarget.spec.category === 'STRIKE') roundDmg *= 0.60;
            if (validTarget.isFlightLead && validTarget.autocannonResistance) roundDmg *= (1.0 - validTarget.autocannonResistance);

            if (validTarget.isGhost) {
              validTarget.takeDamage(roundDmg);
            } else if (validTarget.isDecoyDrone) {
              validTarget.takeDamage(roundDmg);
            } else if (typeof SurfaceUnit !== 'undefined' && validTarget instanceof SurfaceUnit) {
              validTarget.takeDamage(roundDmg, true);
            } else if (validTarget.isCivilian && typeof validTarget.takeDamage === 'function') {
              validTarget.takeDamage(roundDmg, unit, gun, r === numRounds - 1);
            } else {
              validTarget.hp = Math.max(0, validTarget.hp - roundDmg);
              if (validTarget.hp < 0.05) validTarget.hp = 0;

              if (gun.kineticConcussion && gun.kineticConcussion > 0) {
                if (typeof validTarget.applyActionStress === 'function') validTarget.applyActionStress(gun.kineticConcussion * 0.25);
                if (validTarget.energy !== undefined) validTarget.energy = Math.max(0.20, validTarget.energy - 0.04);
              }
            }

            totalBurstDamage += roundDmg;
            roundsLanded++;

            const jitterX = (Math.random() - 0.5) * 0.35;
            const jitterY = (Math.random() - 0.5) * 0.35;
            if (game && game.radar) {
              game.radar.spawnGunTracer(unit.x, unit.y, validTarget.x + jitterX, validTarget.y + jitterY, gun.tracerColor || '#00f0ff');
              mountedPods.forEach(p => {
                game.radar.spawnGunTracer(unit.x, unit.y, validTarget.x + jitterX, validTarget.y + jitterY, p.weapon.tracerColor || '#fbbf24');
              });
            }

            if (wasAlive && validTarget.hp <= 0 && game && game.simulation && !validTarget.isCivilian) {
              game.simulation.recordKillEvent(unit.team, validTarget, unit, {
                weapon: gun,
                isSalvo: mountedPods.length > 0,
                salvoCount: mountedPods.length + 1
              });
            }
          } else {
            if (game && game.radar) {
              game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * (gun.rangeKm || 4.5), unit.y + Math.sin(tracerAngle) * (gun.rangeKm || 4.5), gun.tracerColor || '#00f0ff');
            }
          }
        } else {
          if (game && game.radar) {
            game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * (gun.rangeKm || 4.5), unit.y + Math.sin(tracerAngle) * (gun.rangeKm || 4.5), gun.tracerColor || '#00f0ff');
            mountedPods.forEach(p => {
              game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * (p.weapon.rangeKm || 4.2), unit.y + Math.sin(tracerAngle) * (p.weapon.rangeKm || 4.2), p.weapon.tracerColor || '#fbbf24');
            });
          }
        }

        if (r === numRounds - 1 && game) {
          const podNote = mountedPods.length > 0 ? `+${mountedPods.length} PODS ` : '';
          if (roundsLanded > 0 && validTarget) {
            if (game.radar) {
              game.radar.spawnCombatText(validTarget.x, validTarget.y, `${isDEW ? 'LASER' : 'BURST'} ${podNote}-${totalBurstDamage.toFixed(1)}HP (${roundsLanded}/${numRounds} RDS)`, '#00f0ff');
            }
            if (validTarget.hp > 0.05 && game.simulation && game.simulation.scoring && !validTarget.isCivilian) {
              game.simulation.scoring.recordHitEvent(unit.team, validTarget, unit, {
                weapon: gun,
                damage: totalBurstDamage,
                isSalvo: mountedPods.length > 0,
                salvoCount: mountedPods.length + 1
              });
            }
          } else if (game.radar) {
            game.radar.spawnCombatText(unit.x, unit.y, `${isDEW ? 'LASER PULSE' : 'STRAFE BURST'} (${numRounds} RDS)`, '#00f0ff');
          }
        }
      }, r * 50);
    }
  }
}

window.AutocannonBayRenderer = AutocannonBayRenderer;