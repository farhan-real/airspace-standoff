/**
 * AIRSPACE STANDOFF: Autocannon Manual Burst Execution Submodule
 */

class AutocannonFireExecutor {
  static fireAutocannonManual(unit, target, game) {
    if (!unit || unit.hp <= 0.05 || unit.gunAmmo <= 0 || unit.gunCooldown > 0) return;
    const gun = unit.gun;
    if (!gun) throw new Error(`Unit "${unit.id}" has no equipped autocannon.`);

    const cd = gun.burstCooldown;
    unit.gunCooldown = cd;

    const numRounds = gun.roundsPerBurst;
    const ammoSpend = gun.ammoPerBurst || numRounds;
    unit.gunAmmo = Math.max(0, unit.gunAmmo - Math.min(unit.gunAmmo, ammoSpend));

    const mountedPods = AutocannonBayRenderer.getMountedGunpods(unit);
    mountedPods.forEach(p => {
      const podBurst = p.weapon.ammoPerBurst || p.weapon.roundsPerBurst;
      p.ammo = Math.max(0, p.ammo - podBurst);
      p.cooldown = p.weapon.burstCooldown || cd;
    });

    const isDEW = Boolean(gun.damagePerPulse || (gun.caliber && gun.caliber.includes('DEW')) || gun.id.startsWith('PLSL') || gun.id === 'DE-PULSE' || gun.id === 'EML_GUN');
    if (gun.thermalBloom && gun.thermalBloom > 1.0) {
      unit.thermalBloomTimer = 3.5;
      if (game && game.radar) game.radar.spawnCombatText(unit.x, unit.y, 'THERMAL BLOOM (STEALTH COMPROMISED)', '#f97316');
    }

    const validTarget = (target && target.hp > 0.05 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y) && !target.isDissolved) ? target : null;

    if (validTarget && validTarget.isCivilian && unit.team === 'friendly' && game && game.simulation) {
      const penalty = window.CONFIG.VP_CIVILIAN_FIRE_PENALTY;
      game.simulation.logScoreEvent('friendly', -penalty, `ROE VIOLATION: Fired autocannon at civilian aircraft (${validTarget.flightCode || validTarget.name})`);
      if (game.simulation.scoring) {
        game.simulation.scoring.recordCivilianFirePenalty('friendly', unit, validTarget, gun, penalty);
      }
      if (game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `ROE VIOLATION: CIVILIAN TARGET (-${penalty} VP)`, '#f43f5e');
      }
    } else if (validTarget && !validTarget.isIdentified && unit.team === 'friendly' && game && game.simulation) {
      const penalty = window.CONFIG.VP_UNIDENTIFIED_FIRE_PENALTY;
      game.simulation.logScoreEvent('friendly', -penalty, 'ROE INFRACTION: Fired autocannon on unverified track [BOGEY ?]');
      if (game.simulation.scoring) {
        game.simulation.scoring.recordBogeyFirePenalty('friendly', unit, validTarget, gun, penalty);
      }
      if (game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `ROE INFRACTION: UNVERIFIED BOGEY (-${penalty} VP)`, '#f97316');
      }
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
        const targetCheck = (target && target.hp > 0.05 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y) && !target.isDissolved) ? target : null;
        const heading = unit.heading;
        const spreadOffset = (r - (numRounds - 1) / 2) * 0.012;
        const tracerAngle = heading + spreadOffset;

        if (targetCheck && Math.hypot(targetCheck.x - unit.x, targetCheck.y - unit.y) <= gun.rangeKm) {
          let angleDiff = Math.abs(heading - Math.atan2(targetCheck.y - unit.y, targetCheck.x - unit.x));
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
          const maxConeRad = (gun.coneAngleDeg / 2.0) * (Math.PI / 180.0);

          if (angleDiff <= maxConeRad) {
            const wasAlive = targetCheck.hp > 0.05;
            let roundDmg = gun.damagePerRound || (gun.damagePerBurst / numRounds);
            mountedPods.forEach(p => {
              const podDmg = p.weapon.damagePerRound || (p.weapon.damagePerBurst / numRounds);
              roundDmg += podDmg;
            });

            const clouds = (game && game.simulation && game.simulation.weatherClouds) || [];
            const cloudHits = Physics.countIntersectingClouds(unit.x, unit.y, targetCheck.x, targetCheck.y, clouds);
            if (cloudHits > 0 && gun.cloudScattering && gun.cloudScattering > 0) {
              roundDmg *= Math.max(0.10, Math.pow(1.0 - gun.cloudScattering, cloudHits));
            }

            if (targetCheck.spec && targetCheck.spec.category === 'STRIKE') roundDmg *= 0.60;
            if (targetCheck.isFlightLead && targetCheck.autocannonResistance) roundDmg *= (1.0 - targetCheck.autocannonResistance);

            if (targetCheck.isGhost) {
              targetCheck.takeDamage(roundDmg);
            } else if (targetCheck.isDecoyDrone) {
              targetCheck.takeDamage(roundDmg);
            } else if (typeof SurfaceUnit !== 'undefined' && targetCheck instanceof SurfaceUnit) {
              targetCheck.takeDamage(roundDmg, true);
            } else if (targetCheck.isCivilian && typeof targetCheck.takeDamage === 'function') {
              targetCheck.takeDamage(roundDmg, unit, gun, r === numRounds - 1);
            } else {
              targetCheck.hp = Math.max(0, targetCheck.hp - roundDmg);
              if (targetCheck.hp < 0.05) targetCheck.hp = 0;

              if (gun.kineticConcussion && gun.kineticConcussion > 0) {
                if (typeof targetCheck.applyActionStress === 'function') targetCheck.applyActionStress(gun.kineticConcussion * 0.25);
                if (targetCheck.energy !== undefined) targetCheck.energy = Math.max(0.20, targetCheck.energy - 0.04);
              }
            }

            totalBurstDamage += roundDmg;
            roundsLanded++;

            const jitterX = (Math.random() - 0.5) * 0.35;
            const jitterY = (Math.random() - 0.5) * 0.35;
            if (game && game.radar) {
              game.radar.spawnGunTracer(unit.x, unit.y, targetCheck.x + jitterX, targetCheck.y + jitterY, gun.tracerColor);
              mountedPods.forEach(p => {
                game.radar.spawnGunTracer(unit.x, unit.y, targetCheck.x + jitterX, targetCheck.y + jitterY, p.weapon.tracerColor);
              });
            }

            if (wasAlive && targetCheck.hp <= 0 && game && game.simulation && !targetCheck.isCivilian) {
              game.simulation.recordKillEvent(unit.team, targetCheck, unit, {
                weapon: gun,
                isSalvo: mountedPods.length > 0,
                salvoCount: mountedPods.length + 1
              });
            }
          } else {
            if (game && game.radar) {
              game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * gun.rangeKm, unit.y + Math.sin(tracerAngle) * gun.rangeKm, gun.tracerColor);
            }
          }
        } else {
          if (game && game.radar) {
            game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * gun.rangeKm, unit.y + Math.sin(tracerAngle) * gun.rangeKm, gun.tracerColor);
            mountedPods.forEach(p => {
              game.radar.spawnGunTracer(unit.x, unit.y, unit.x + Math.cos(tracerAngle) * p.weapon.rangeKm, unit.y + Math.sin(tracerAngle) * p.weapon.rangeKm, p.weapon.tracerColor);
            });
          }
        }

        if (r === numRounds - 1 && game) {
          const podNote = mountedPods.length > 0 ? `+${mountedPods.length} PODS ` : '';
          if (roundsLanded > 0 && targetCheck) {
            if (game.radar) {
              game.radar.spawnCombatText(targetCheck.x, targetCheck.y, `${isDEW ? 'LASER' : 'BURST'} ${podNote}-${totalBurstDamage.toFixed(1)}HP (${roundsLanded}/${numRounds} RDS)`, '#00f0ff');
            }
            if (targetCheck.hp > 0.05 && game.simulation && game.simulation.scoring && !targetCheck.isCivilian) {
              game.simulation.scoring.recordHitEvent(unit.team, targetCheck, unit, {
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

window.AutocannonFireExecutor = AutocannonFireExecutor;