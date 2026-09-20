/**
 * AIRSPACE STANDOFF // Ghost Contact Reflection Entity
 * Simulates raw radar reflections, temperature inversions, and atmospheric clutter
 */

class GhostContact {
  constructor(x, y, heading, speedMach, altFt) {
    this.id = 'GHOST_' + Math.random().toString(36).substr(2, 6);
    this.team = 'hostile';
    this.isGhost = true;
    this.hp = 1;
    this.maxHp = 1;

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;

    this.x = (typeof x === 'number') ? x : (w / 2.0);
    this.y = (typeof y === 'number') ? y : (h / 2.0);
    this.heading = (typeof heading === 'number') ? heading : (Math.PI + (Math.random() * 0.4 - 0.2));
    this.speed = speedMach || (0.80 + Math.random() * 0.15);
    this.altFt = altFt || (24000 + Math.floor(Math.random() * 8) * 1000);
    this.alt = this.altFt / 65000.0;

    this.effectiveRcs = 1.0 + Math.random() * 1.5;
    this.turnTimer = 6.0 + Math.random() * 8.0;
    this.turnDirection = 0;
    this.lifespan = 60.0 + Math.random() * 20.0;
    this.age = 0.0;

    this.isDissolving = false;
    this.dissolveTimer = 0.0;
    this.dissolveDuration = 2.4;
    this.dissolveAlpha = 1.0;
    this.isDissolved = false;

    this.trackDurationBlue = 0.0;
    this.trackDurationRed = 0.0;
    this.identifiedByBlue = false;
    this.identifiedByRed = false;

    this.callsign = 'BOGEY [?]';
    this.ghostType = ['ATMOSPHERIC CLUTTER', 'TEMPERATURE INVERSION', 'ANOMALOUS PROPAGATION', 'CHAFF REMNANT'][Math.floor(Math.random() * 4)];
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

  triggerDissolve(reason) {
    if (this.isDissolving) return;
    this.isDissolving = true;
    this.dissolveReason = reason || 'ECHO DISSIPATED';
  }

  update(dt) {
    if (this.isDissolved) return;
    this.age += dt;

    if (this.age >= this.lifespan && !this.isDissolving) {
      this.triggerDissolve('CLUTTER DISSIPATED');
    }

    if (this.isDissolving) {
      this.dissolveTimer += dt;
      this.dissolveAlpha = Math.max(0, 1.0 - (this.dissolveTimer / this.dissolveDuration));
      if (this.dissolveTimer >= this.dissolveDuration) {
        this.isDissolved = true;
        this.hp = 0;
        if (window.Game && window.Game.selectedTarget && window.Game.selectedTarget.id === this.id) {
          window.Game.selectedTarget = null;
          const targetInfo = document.getElementById('selected-target-info');
          if (targetInfo) targetInfo.textContent = 'TARGET: NONE';
          if (window.Game.avionics) window.Game.avionics.updateActiveUnitMFD();
        }
        return;
      }
    }

    this.turnTimer -= dt;
    if (this.turnTimer <= 0) {
      this.turnTimer = 6.0 + Math.random() * 10.0;
      this.turnDirection = (Math.random() * 0.3 - 0.15);
    }
    this.heading += this.turnDirection * 0.35 * dt;

    const kmPerSec = this.speed * 0.35;
    this.x += Math.cos(this.heading) * kmPerSec * dt;
    this.y += Math.sin(this.heading) * kmPerSec * dt;

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    if (this.x < 2 || this.x > w - 2 || this.y < 2 || this.y > h - 2) {
      this.triggerDissolve('OUT OF SECTOR');
    }
  }

  takeDamage() {
    this.hp = 0;
    this.triggerDissolve('ECHO DISSIPATED');
    this.isDissolved = true;
  }
}

window.GhostContact = GhostContact;