/**
 * AIRSPACE STANDOFF: Air-Launched Decoy Drone Entity
 * Deploys autonomous decoy drones mirroring host aircraft radar signature
 */

class DecoyDrone {
  constructor(parentUnit, targetHeading) {
    this.id = 'DECOY_' + Math.random().toString(36).substr(2, 6);
    this.parentUnit = parentUnit;
    this.team = parentUnit.team;
    this.isDecoyDrone = true;
    this.hp = 1;
    this.maxHp = 1;
    this.x = parentUnit.x;
    this.y = parentUnit.y;
    this.heading = targetHeading !== undefined ? targetHeading : parentUnit.heading;
    this.speed = Math.max(0.75, (parentUnit.speed || 0.90) * 0.95);
    this.altFt = parentUnit.altFt || 30000;
    this.alt = this.altFt / 65000.0;

    this.effectiveRcs = parentUnit.effectiveRcs || (parentUnit.spec ? parentUnit.spec.sigma_0 : 1.0);
    this.mirroredModel = parentUnit.spec ? parentUnit.spec.id : 'FIGHTER';
    this.mirroredCallsign = parentUnit.callsign ? `${parentUnit.callsign} [DECOY]` : 'Decoy Drone';
    this.callsign = this.mirroredCallsign;

    this.lifespan = 55.0;
    this.age = 0.0;
    this.trackDurationBlue = (this.team === 'friendly') ? 999.0 : 0.0;
    this.trackDurationRed = (this.team === 'hostile') ? 999.0 : 0.0;
    this.identifiedByBlue = (this.team === 'friendly');
    this.identifiedByRed = (this.team === 'hostile');
  }

  isIdentifiedBy(team) {
    return (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
  }

  get isIdentified() {
    const commander = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    return this.isIdentifiedBy(commander);
  }

  set isIdentified(val) {
    this.identifiedByBlue = Boolean(val);
    this.identifiedByRed = Boolean(val);
  }

  update(dt) {
    if (this.hp <= 0) return;
    this.age += dt;
    if (this.age >= this.lifespan) {
      this.hp = 0;
      return;
    }

    const kmPerSec = this.speed * 0.35;
    this.x += Math.cos(this.heading) * kmPerSec * dt;
    this.y += Math.sin(this.heading) * kmPerSec * dt;

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    if (this.x < 2 || this.x > w - 2 || this.y < 2 || this.y > h - 2) {
      this.hp = 0;
    }
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }
}

window.DecoyDrone = DecoyDrone;