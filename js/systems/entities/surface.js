/**
 * AIRSPACE STANDOFF: Surface Air Defense Batteries, Radars & Logistics Depots
 * Ground targets are pre-briefed: always revealed and fully identified.
 */

class SurfaceUnit {
  constructor(type, team, x, y) {
    this.id = 'SURF_' + Math.random().toString(36).substr(2, 6);
    this.type = type;
    this.team = team;
    this.x = x;
    this.y = y;
    this.alt = 0.0;
    this.fireCooldown = 0.0;
    this.canAttack = false;
    this.isCivilian = false;
    this.isJammerStation = false;
    this.isIndestructible = false;
    this.jamEfficiency = 0.0;

    this.identifiedByBlue = true;
    this.identifiedByRed = true;

    if (type === 'S-400') {
      this.name = team === 'friendly' ? 'Patriot / S-400 SAM' : 'S-400 SAM Battery';
      this.hp = 8;
      this.maxHp = 8;
      this.rangeKm = 52.0;
      this.cooldownMax = 6.5;
      this.canAttack = true;
      this.desc = 'Long-range surface-to-air missile battery (52 km engagement envelope). Fires Mach 5.2 radar-guided SAMs; requires active Radar Array to engage.';
    } else if (type === 'PANTSIR') {
      this.name = team === 'friendly' ? 'Phalanx CIWS' : 'Pantsir-S1 CIWS';
      this.hp = 6;
      this.maxHp = 6;
      this.rangeKm = 16.0;
      this.cooldownMax = 1.8;
      this.canAttack = true;
      this.desc = 'Point-defense close-in weapon system. Intercepts incoming missiles within its 16 km defense radius.';
    } else if (type === 'RADAR_ARRAY') {
      this.name = 'Early Warning Radar';
      this.hp = 5;
      this.maxHp = 5;
      this.rangeKm = 65.0;
      this.cooldownMax = 999.0;
      this.desc = 'Phased-array early warning radar (65 km coverage). Provides tracking and cueing telemetry for long-range SAM batteries.';
    } else if (type === 'EW_JAMMER') {
      this.name = team === 'friendly' ? 'Allied EW Jammer Station' : 'Hostile EW Jammer Station';
      this.hp = 6;
      this.maxHp = 6;
      this.rangeKm = 36.0;
      this.cooldownMax = 999.0;
      this.isJammerStation = true;
      this.jamEfficiency = 0.50;
      this.desc = 'Surface electronic warfare station. Emits high-power microwave jamming across a 36 km umbrella.';
    } else if (type === 'BUNKER') {
      this.name = 'Command Bunker';
      this.hp = 24;
      this.maxHp = 24;
      this.rangeKm = 0.0;
      this.cooldownMax = 999.0;
      this.desc = 'Reinforced subterranean theater command center. Primary strategic target.';
    } else if (type === 'FUEL_DEPOT') {
      this.name = team === 'friendly' ? 'Allied Fuel Farm' : 'Strategic Fuel Depot';
      this.hp = 8;
      this.maxHp = 8;
      this.rangeKm = 0.0;
      this.cooldownMax = 999.0;
      this.desc = 'Aviation fuel storage tanks. Neutralization degrades theater readiness.';
    } else if (type === 'AMMO_DUMP') {
      this.name = team === 'friendly' ? 'Allied Munitions Center (Indestructible)' : 'Central Munitions Hub (Indestructible)';
      this.hp = 999;
      this.maxHp = 999;
      this.rangeKm = 0.0;
      this.cooldownMax = 999.0;
      this.isIndestructible = true;
      this.desc = 'Hardened forward strategic ammunition repository positioned near the center. Indestructible and provides automated munitions turnaround.';
    } else if (type === 'RADAR_VAN') {
      this.name = team === 'friendly' ? 'Allied Mobile Radar' : 'Mobile Radar Van';
      this.hp = 4;
      this.maxHp = 4;
      this.rangeKm = 0.0;
      this.cooldownMax = 999.0;
      this.desc = 'Mobile forward sensor van providing localized radar telemetry.';
    }
  }

  isIdentifiedBy(team) { return true; }
  get isIdentified() { return true; }
  set isIdentified(val) {
    this.identifiedByBlue = Boolean(val);
    this.identifiedByRed = Boolean(val);
  }

  takeDamage(amount) {
    if (this.isIndestructible) {
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(this.x, this.y, 'DEPOT INDESTRUCTIBLE', '#00f5a0');
      }
      return;
    }
    this.hp = Math.max(0, this.hp - amount);
    if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(this.type === 'BUNKER');
  }

  update(dt, enemyAircraftList, enemyMissilesList, spawnedMissiles, radarArrayActive) {
    if (this.hp <= 0) return;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;

    if (this.type === 'S-400' && radarArrayActive && this.fireCooldown <= 0) {
      for (const plane of enemyAircraftList) {
        if (!plane || plane.hp <= 0 || plane.isCivilian) continue;
        const dist = Math.hypot(plane.x - this.x, plane.y - this.y);
        if (dist <= this.rangeKm && plane.alt > 0.08) {
          const samWeapon = {
            id: this.team === 'friendly' ? 'MIM-104_SAM' : '48N6_SAM',
            name: 'Heavy SAM Missile',
            rangeKm: 52.0,
            speedMach: 5.2,
            seeker: 'ARH',
            rcs: 0.12,
            lambda: 0.25,
            p: 1.0,
            damage: 4,
            T_0: 0.72
          };
          spawnedMissiles.push(new MissileEntity(samWeapon, this, plane));
          this.fireCooldown = this.cooldownMax;
          if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
          break;
        }
      }
    }

    if (this.type === 'PANTSIR' && this.fireCooldown <= 0) {
      const incomingSalvo = enemyMissilesList.filter(m => {
        return m.team !== this.team && m.active && Math.hypot(m.x - this.x, m.y - this.y) <= this.rangeKm;
      });

      if (incomingSalvo.length > 0) {
        const targetMissile = incomingSalvo[0];
        const interceptionDistance = Math.hypot(targetMissile.x - this.x, targetMissile.y - this.y);
        targetMissile.active = false;
        targetMissile.isDead = true;
        this.fireCooldown = this.cooldownMax;

        const inspection = window.Game && window.Game.inspection;
        if (inspection && inspection.enabled) inspection.recordEvent('CIWS INTERCEPT', `${this.name} intercepted ${targetMissile.weapon.name || targetMissile.weapon.id}`, this, targetMissile.source, {
          interceptedMissile: targetMissile.id,
          missileWeapon: targetMissile.weapon.name || targetMissile.weapon.id,
          missileTeam: targetMissile.team,
          interceptionRangeKm: interceptionDistance,
          maximumDefenseRadiusKm: this.rangeKm,
          insideDefenseRadius: interceptionDistance <= this.rangeKm,
          interceptCount: (window.Game.stats.defensiveIntercepts || 0) + 1
        }, targetMissile);

        if (window.Game && window.Game.stats) window.Game.stats.defensiveIntercepts = (window.Game.stats.defensiveIntercepts || 0) + 1;
        if (window.Game && window.Game.simulation) {
          window.Game.simulation.logScoreEvent(this.team, 40, 'CIWS intercepted inbound missile');
        }

        if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(false);
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnExplosionFX(targetMissile.x, targetMissile.y, false);
          window.Game.radar.spawnCombatText(targetMissile.x, targetMissile.y, 'CIWS INTERCEPT', '#38bdf8');
          window.Game.radar.spawnShockwave(targetMissile.x, targetMissile.y, '#38bdf8', 25);
        }
      }
    }
  }
}

window.SurfaceUnit = SurfaceUnit;
