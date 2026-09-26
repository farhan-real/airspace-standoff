/**
 * AIRSPACE STANDOFF: Combat Guns Subsystem
 * Automatic boresight cannon burst calculations, kinetic flinch, and live tracer rendering.
 */

class CombatGunsSystem {
  static updateAutomaticGun(aircraft, dt, enemiesList, radarRenderer) {
    if (aircraft.hp <= 0.05 || aircraft.gunAmmo <= 0 || aircraft.gunCooldown > 0) return;
    const diffKey = (window.Game && window.Game.aiDifficulty) || 'VETERAN';
    const isEnemy = (aircraft.team !== ((window.Game && window.Game.currentPvpCommander) || 'friendly'));

    const maxRange = (aircraft.gun && aircraft.gun.rangeKm) ? aircraft.gun.rangeKm : 4.6;
    const maxConeRad = ((aircraft.gun && aircraft.gun.coneAngleDeg ? aircraft.gun.coneAngleDeg : 40) / 2.0) * (Math.PI / 180.0);
    const isEnergy = Boolean(aircraft.gun && (aircraft.gun.damagePerPulse || aircraft.gun.id === 'DE-PULSE' || aircraft.gun.id.startsWith('PLSL') || aircraft.gun.id === 'EML_GUN'));

    let totalGunDps = (aircraft.gun.damagePerSec || 2.5);
    const activeGunpods = aircraft.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
    activeGunpods.forEach(p => { totalGunDps += (p.weapon.damagePerSec || 2.0); });

    for (const enemy of enemiesList) {
      if (!enemy || enemy.hp <= 0.05 || enemy.isCivilian) continue;
      const dist = Math.hypot(enemy.x - aircraft.x, enemy.y - aircraft.y);
      if (dist <= maxRange) {
        let angleDiff = Math.abs(aircraft.heading - Math.atan2(enemy.y - aircraft.y, enemy.x - aircraft.x));
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

        if (angleDiff < maxConeRad) {
          if (isEnemy && !aircraft.isAce && Math.random() < (diffKey === 'CADET' ? 0.60 : 0.40)) break;

          const totalBurstDamage = (aircraft.gun.damagePerBurst || (totalGunDps * 0.50));
          let sustainedDmg = totalBurstDamage;
          const damageFactors = [];
          const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];
          const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(aircraft.x, aircraft.y, enemy.x, enemy.y, clouds) : 0;

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
          if (aircraft.stress >= 0.65 && !aircraft.isCoffin && !aircraft.spec.isDrone) { sustainedDmg *= 0.75; damageFactors.push({ cause: 'Shooter stress', multiplier: 0.75 }); }

          const hpBefore = enemy.hp;
          const wasAlive = enemy.hp > 0.05;
          enemy.hp = Math.max(0, enemy.hp - sustainedDmg);
          if (enemy.hp < 0.05) enemy.hp = 0;

          if (aircraft.gun.kineticConcussion && aircraft.gun.kineticConcussion > 0) {
            if (typeof enemy.applyActionStress === 'function') enemy.applyActionStress(aircraft.gun.kineticConcussion * 0.4 * dt);
          }

          const burstRds = aircraft.gun.roundsPerBurst || 4;
          aircraft.gunAmmo = Math.max(0, aircraft.gunAmmo - burstRds);

          activeGunpods.forEach(p => {
            const podBurst = p.weapon.ammoPerBurst || p.weapon.roundsPerBurst || 4;
            p.ammo = Math.max(0, p.ammo - podBurst);
            p.cooldown = p.weapon.burstCooldown || (aircraft.gun.burstCooldown || 0.50);
          });
          aircraft.recalculateWeight();

          const inspection = window.Game && window.Game.inspection;
          if (inspection && inspection.enabled) {
            inspection.recordEvent('GUN BURST', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(aircraft) : aircraft.callsign} fired ${aircraft.gun.name || aircraft.gun.id} at ${window.formatCombatantDisplayName ? window.formatCombatantDisplayName(enemy) : (enemy.callsign || enemy.name || enemy.id)}`, aircraft, enemy, {
              gun: aircraft.gun.name || aircraft.gun.id, rangeKm: dist, maximumRangeKm: maxRange,
              targetAngleDeg: angleDiff * 180 / Math.PI, allowedHalfConeDeg: maxConeRad * 180 / Math.PI,
              firingDps: totalGunDps, simulationStepSec: dt, baseDamage: totalBurstDamage, damageFactors,
              finalDamage: hpBefore - enemy.hp, hpBefore, hpAfter: enemy.hp, ammunitionRemaining: aircraft.gunAmmo
            });
          }

          aircraft.gunCooldown = (window.CONFIG && window.CONFIG.AUTO_GUN_COOLDOWN) || 0.50;

          if (radarRenderer && (Math.random() < 0.45 || isEnergy || activeGunpods.length > 0)) {
            radarRenderer.spawnGunTracer(aircraft.x, aircraft.y, enemy.x, enemy.y, aircraft.gun.tracerColor || (isEnemy ? '#ef4444' : '#00f0ff'));
            activeGunpods.forEach(p => {
              radarRenderer.spawnGunTracer(aircraft.x, aircraft.y, enemy.x, enemy.y, p.weapon.tracerColor || '#fbbf24');
            });
          }

          if (wasAlive && enemy.hp <= 0 && window.Game && window.Game.simulation) {
            window.Game.simulation.recordKillEvent(aircraft.team, enemy, aircraft, { weapon: aircraft.gun || { name: 'Autocannon' }, isSalvo: activeGunpods.length > 0, salvoCount: activeGunpods.length + 1 });
          } else if (wasAlive && enemy.hp > 0 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
            window.Game.simulation.scoring.recordHitEvent(aircraft.team, enemy, aircraft, { weapon: aircraft.gun || { name: 'Autocannon' }, damage: sustainedDmg, isSalvo: activeGunpods.length > 0, salvoCount: activeGunpods.length + 1 });
          }
          break;
        }
      }
    }
  }
}

window.CombatGunsSystem = CombatGunsSystem;
window.AircraftGunSystem = CombatGunsSystem;