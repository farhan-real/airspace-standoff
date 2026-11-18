/**
 * AIRSPACE STANDOFF: Combat Guns Subsystem
 * Automatic boresight cannon burst calculations against aircraft and low-altitude ground targets.
 */

class CombatGunsSystem {
  static updateAutomaticGun(aircraft, dt, enemiesList, radarRenderer, surfaceTargets = null) {
    if (!aircraft || aircraft.hp <= 0.05 || aircraft.gunAmmo <= 0 || aircraft.gunCooldown > 0 || aircraft.groundPhase) return;
    if (!aircraft.gun) throw new Error(`Aircraft "${aircraft.id}" has no gun configuration.`);
    const diffKey = (window.Game && window.Game.aiDifficulty);
    const isEnemy = (aircraft.team !== ((window.Game && window.Game.currentPvpCommander) || 'friendly'));

    const maxRange = aircraft.gun.rangeKm;
    const maxConeRad = (aircraft.gun.coneAngleDeg / 2.0) * (Math.PI / 180.0);
    const isEnergy = Boolean(aircraft.gun.damagePerPulse || aircraft.gun.id === 'DE-PULSE' || aircraft.gun.id.startsWith('PLSL') || aircraft.gun.id === 'EML_GUN');

    let totalGunDps = aircraft.gun.damagePerSec;
    const activeGunpods = aircraft.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
    activeGunpods.forEach(p => { totalGunDps += p.weapon.damagePerSec; });

    let candidates = enemiesList;
    if (surfaceTargets && surfaceTargets.length > 0 && aircraft.altFt <= 16500) {
      candidates = enemiesList.concat(surfaceTargets.filter(s => s && s.hp > 0.05 && !s.isIndestructible && s.armorClass !== 'FORTIFIED'));
    }

    for (const enemy of candidates) {
      if (!enemy || enemy.hp <= 0.05 || enemy.isCivilian) continue;
      const dist = Math.hypot(enemy.x - aircraft.x, enemy.y - aircraft.y);
      if (dist <= maxRange) {
        let angleDiff = Math.abs(aircraft.heading - Math.atan2(enemy.y - aircraft.y, enemy.x - aircraft.x));
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

        if (angleDiff < maxConeRad) {
          if (isEnemy && !aircraft.isAce && Math.random() < (diffKey === 'CADET' ? 0.60 : 0.40)) break;

          const isSurface = (typeof SurfaceUnit !== 'undefined' && enemy instanceof SurfaceUnit);
          let totalBurstDamage = aircraft.gun.damagePerBurst;
          if (isSurface) {
            activeGunpods.forEach(p => {
              if (p.weapon && p.weapon.groundDamageMult) {
                totalBurstDamage += p.weapon.damagePerBurst * (p.weapon.groundDamageMult - 1.0);
              }
            });
          }

          let sustainedDmg = totalBurstDamage;
          const damageFactors = [];
          const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];
          const cloudHits = Physics.countIntersectingClouds(aircraft.x, aircraft.y, enemy.x, enemy.y, clouds);

          if (cloudHits > 0 && isEnergy && aircraft.gun.cloudScattering) {
            const factor = Math.max(0.10, Math.pow(1.0 - aircraft.gun.cloudScattering, cloudHits));
            sustainedDmg *= factor;
            damageFactors.push({ cause: 'Cloud scattering', multiplier: factor });
          }
          if (isEnemy && !aircraft.isAce) { sustainedDmg *= 0.65; damageFactors.push({ cause: 'AI gun damage scaling', multiplier: 0.65 }); }
          if (enemy.spec && enemy.spec.category === 'STRIKE') { sustainedDmg *= 0.50; damageFactors.push({ cause: 'Strike-aircraft resistance', multiplier: 0.50 }); }
          if (enemy.isFlightLead && enemy.autocannonResistance) {
            const factor = 1.0 - enemy.autocannonResistance; sustainedDmg *= factor;
            damageFactors.push({ cause: 'Flight-lead autocannon resistance', multiplier: factor });
          }
          if (aircraft.stress >= 0.65 && !aircraft.isCoffin && !aircraft.spec.isDrone) {
            sustainedDmg *= 0.75; damageFactors.push({ cause: 'Shooter stress', multiplier: 0.75 });
          }

          const hpBefore = enemy.hp;
          const wasAlive = enemy.hp > 0.05;
          if (isSurface) {
            const ap = (aircraft.gun.id === 'GAU-8' || aircraft.gun.id === 'EML_GUN') ? 0.85 : ((aircraft.gun.id === 'GSH-30-1' || aircraft.gun.id === 'BK-27') ? 0.50 : 0.25);
            const podBunkerCracker = activeGunpods.some(p => p.weapon && p.weapon.isBunkerCracker);
            const podAp = activeGunpods.reduce((m, p) => Math.max(m, (p.weapon && p.weapon.armorPiercing) || 0), ap);
            enemy.takeDamage(sustainedDmg, podBunkerCracker, { armorPiercing: podAp });
          } else {
            enemy.hp = Math.max(0, enemy.hp - sustainedDmg);
            if (enemy.hp <= 0.05) enemy.hp = 0;
            if (aircraft.gun.kineticConcussion && aircraft.gun.kineticConcussion > 0 && typeof enemy.applyActionStress === 'function') {
              enemy.applyActionStress(aircraft.gun.kineticConcussion * 0.4 * dt);
            }
          }

          const burstRds = aircraft.gun.roundsPerBurst;
          aircraft.gunAmmo = Math.max(0, aircraft.gunAmmo - burstRds);
          activeGunpods.forEach(p => {
            const podBurst = p.weapon.ammoPerBurst || p.weapon.roundsPerBurst;
            p.ammo = Math.max(0, p.ammo - podBurst);
            p.cooldown = p.weapon.burstCooldown || aircraft.gun.burstCooldown;
          });
          aircraft.recalculateWeight();

          const inspection = window.Game && window.Game.inspection;
          if (inspection && inspection.enabled) {
            inspection.recordEvent('GUN BURST', `${window.formatAircraftDisplayName(aircraft)} fired ${aircraft.gun.name} at ${window.formatCombatantDisplayName(enemy)}`, aircraft, enemy, {
              gun: aircraft.gun.name, rangeKm: dist, maximumRangeKm: maxRange,
              targetAngleDeg: angleDiff * 180 / Math.PI, allowedHalfConeDeg: maxConeRad * 180 / Math.PI,
              firingDps: totalGunDps, simulationStepSec: dt, baseDamage: totalBurstDamage, damageFactors,
              finalDamage: hpBefore - enemy.hp, hpBefore, hpAfter: enemy.hp, ammunitionRemaining: aircraft.gunAmmo
            });
          }

          aircraft.gunCooldown = window.CONFIG.AUTO_GUN_COOLDOWN;

          if (radarRenderer && (Math.random() < 0.45 || isEnergy || activeGunpods.length > 0 || isSurface)) {
            radarRenderer.spawnGunTracer(aircraft.x, aircraft.y, enemy.x, enemy.y, aircraft.gun.tracerColor || (isEnemy ? '#ef4444' : '#00f0ff'));
            activeGunpods.forEach(p => radarRenderer.spawnGunTracer(aircraft.x, aircraft.y, enemy.x, enemy.y, p.weapon.tracerColor || '#fbbf24'));
          }

          if (wasAlive && enemy.hp <= 0.05 && window.Game && window.Game.simulation) {
            enemy.hp = 0;
            window.Game.simulation.recordKillEvent(aircraft.team, enemy, aircraft, { weapon: aircraft.gun, isSalvo: activeGunpods.length > 0, salvoCount: activeGunpods.length + 1 });
          } else if (wasAlive && enemy.hp > 0.05 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
            window.Game.simulation.scoring.recordHitEvent(aircraft.team, enemy, aircraft, { weapon: aircraft.gun, damage: sustainedDmg, isSalvo: activeGunpods.length > 0, salvoCount: activeGunpods.length + 1 });
          }
          break;
        }
      }
    }
  }
}

window.CombatGunsSystem = CombatGunsSystem;
