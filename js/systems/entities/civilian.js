/**
 * AIRSPACE STANDOFF // Commercial Civilian Airliners & Rules of Engagement (RoE)
 */

class CivilianAirliner {
  constructor(flightData, spawnX, spawnY, heading) {
    this.id = 'CIV_' + Math.random().toString(36).substr(2, 6);
    this.name = flightData.name || 'Commercial Airliner';
    this.flightCode = flightData.code || 'TRANSIT-700';
    this.model = flightData.model || flightData.name || 'Commercial Airliner';
    this.team = 'neutral';
    this.isCivilian = true;
    this.x = spawnX;
    this.y = spawnY;
    this.heading = heading;

    this.altFt = flightData.altFt || 36000;
    this.alt = this.altFt / 65000.0;
    this.speed = flightData.speedMach || 0.78;
    this.effectiveRcs = flightData.rcs || 25.0;
    this.desc = flightData.desc || 'Commercial passenger transit flight.';

    this.hp = 6;
    this.maxHp = 6;

    this.identifiedByBlue = false;
    this.identifiedByRed = false;
    this.trackDuration = 0.0;
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

    const kmPerSec = this.speed * 0.35;
    this.x += Math.cos(this.heading) * kmPerSec * dt;
    this.y += Math.sin(this.heading) * kmPerSec * dt;

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;

    if (this.x < -15 || this.x > w + 15 || this.y < -15 || this.y > h + 15) {
      this.hp = 0;
    }
  }

  takeDamage(amount, firingSource) {
    this.hp = Math.max(0, this.hp - amount);

    if (this.hp <= 0 && window.Game && window.Game.simulation) {
      const firingTeam = (firingSource && firingSource.team) || 'friendly';
      window.Game.simulation.recordCivilianShootdown(firingTeam, this);
    }
  }
}

window.CivilianAirliner = CivilianAirliner;