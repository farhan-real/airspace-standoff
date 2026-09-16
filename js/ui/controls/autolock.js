/**
 * APEX VECTOR // Auto-Lock Threat Prioritization & Target Cycling Controller
 * Unidentified tracks (including civilian airliners) strictly lock as BOGEY [?].
 */

class AutoLockController {
  constructor(gameEngine) {
    this.game = gameEngine;
    this._autoLockTimeout = null;
  }

  getDetectedTargets() {
    const active = this.game.activeUnit;
    if (!active || active.hp <= 0) return [];

    const commanderTeam = this.game.currentPvpCommander || 'friendly';
    const detectedSet = (commanderTeam === 'friendly')
      ? (this.game.detectedByBlue || new Set())
      : (this.game.detectedByRed || new Set());
    const enemyRoster = (commanderTeam === 'friendly') ? this.game.hostileAircraft : this.game.alliedAircraft;
    const enemyTeamTag = (commanderTeam === 'friendly') ? 'hostile' : 'friendly';

    const detected = [];

    for (const h of enemyRoster) {
      if (h && h.hp > 0 && detectedSet.has(h.id)) {
        const dist = Math.hypot(h.x - active.x, h.y - active.y);
        const angleTo = Math.atan2(h.y - active.y, h.x - active.x);
        let offHeading = Math.abs(active.heading - angleTo);
        while (offHeading > Math.PI) offHeading = Math.abs(offHeading - Math.PI * 2);

        const acePriority = (h.isAce && h.isIdentified) ? -15.0 : 0.0;
        detected.push({ entity: h, priorityScore: dist + (offHeading * 20.0) + acePriority });
      }
    }

    const ghosts = (this.game.simulation && this.game.simulation.ghostContacts) || [];
    for (const g of ghosts) {
      if (g && g.hp > 0 && !g.isDissolved && detectedSet.has(g.id)) {
        const distG = Math.hypot(g.x - active.x, g.y - active.y);
        const angleToG = Math.atan2(g.y - active.y, g.x - active.x);
        let offHeadingG = Math.abs(active.heading - angleToG);
        while (offHeadingG > Math.PI) offHeadingG = Math.abs(offHeadingG - Math.PI * 2);
        detected.push({ entity: g, priorityScore: distG + (offHeadingG * 20.0) + 4.0 });
      }
    }

    const decoys = (this.game.simulation && this.game.simulation.decoyDrones) || [];
    for (const d of decoys) {
      if (d && d.hp > 0 && d.team === enemyTeamTag && detectedSet.has(d.id)) {
        const distD = Math.hypot(d.x - active.x, d.y - active.y);
        const angleToD = Math.atan2(d.y - active.y, d.x - active.x);
        let offHeadingD = Math.abs(active.heading - angleToD);
        while (offHeadingD > Math.PI) offHeadingD = Math.abs(offHeadingD - Math.PI * 2);
        detected.push({ entity: d, priorityScore: distD + (offHeadingD * 20.0) + 6.0 });
      }
    }

    for (const s of this.game.surfaceUnits) {
      if (s && s.team === enemyTeamTag && s.hp > 0 && detectedSet.has(s.id)) {
        const distS = Math.hypot(s.x - active.x, s.y - active.y);
        const angleToS = Math.atan2(s.y - active.y, s.x - active.x);
        let offHeadingS = Math.abs(active.heading - angleToS);
        while (offHeadingS > Math.PI) offHeadingS = Math.abs(offHeadingS - Math.PI * 2);
        detected.push({ entity: s, priorityScore: distS + (offHeadingS * 20.0) + 12.0 });
      }
    }

    const civilians = (this.game.simulation && this.game.simulation.civilianTraffic) || [];
    for (const c of civilians) {
      if (c && c.hp > 0 && detectedSet.has(c.id)) {
        const distC = Math.hypot(c.x - active.x, c.y - active.y);
        const angleToC = Math.atan2(c.y - active.y, c.x - active.x);
        let offHeadingC = Math.abs(active.heading - angleToC);
        while (offHeadingC > Math.PI) offHeadingC = Math.abs(offHeadingC - Math.PI * 2);
        detected.push({ entity: c, priorityScore: distC + (offHeadingC * 20.0) + 20.0 });
      }
    }

    detected.sort((a, b) => a.priorityScore - b.priorityScore);
    return detected;
  }

  cycleTarget(direction = 1) {
    const active = this.game.activeUnit;
    const btn = document.getElementById('btn-autotarget');

    if (!active || active.hp <= 0) {
      this.flashFeedback(btn, 'SELECT CRAFT', '#f43f5e');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return;
    }

    const targets = this.getDetectedTargets();
    if (targets.length === 0) {
      this.flashFeedback(btn, 'NO CONTACTS', '#f97316');
      const coordsEl = document.getElementById('cursor-coords');
      if (coordsEl) coordsEl.textContent = 'RADAR: NO CONTACTS (FOG OF WAR ACTIVE - ADVANCE SQUADRON)';
      if (this.game.radar) this.game.radar.spawnCombatText(active.x, active.y, 'NO RADAR CONTACTS', '#f97316');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return;
    }

    let currentIndex = -1;
    if (this.game.selectedTarget) {
      for (let k = 0; k < targets.length; k++) {
        if (targets[k].entity.id === this.game.selectedTarget.id) {
          currentIndex = k; break;
        }
      }
    }

    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + direction + targets.length) % targets.length;
    }

    const nextTarget = targets[nextIndex].entity;
    this.lockTargetEntity(nextTarget, nextIndex + 1, targets.length);
  }

  autoTargetNearestEnemy() {
    this.cycleTarget(1);
  }

  lockTargetEntity(target, currentNum, totalNum) {
    const active = this.game.activeUnit;
    const btn = document.getElementById('btn-autotarget');
    const commanderTeam = this.game.currentPvpCommander || 'friendly';

    this.game.selectedTarget = target;
    const distKm = Math.round(Math.hypot(target.x - active.x, target.y - active.y));

    const isKnown = (target.team === active.team) ||
      (typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified);

    let rawTgtName = 'BOGEY [?]';
    if (!isKnown) {
      rawTgtName = 'BOGEY [?]';
    } else if (target.isGhost) {
      rawTgtName = `FALSE ECHO [${target.ghostType || 'CLUTTER'}]`;
    } else if (target.isDecoyDrone) {
      rawTgtName = `DECOY [${target.mirroredModel}]`;
    } else if (target.isCivilian) {
      rawTgtName = target.flightCode || 'CIVILIAN AIRLINER';
    } else if (target.type) {
      rawTgtName = target.name || target.type;
    } else {
      rawTgtName = target.spec ? target.spec.id : (target.callsign || 'TARGET');
    }

    const tgtName = String(rawTgtName).replace(/<[^>]*>/g, '');
    const tgtAlt = target.altFt !== undefined ? (`FL${Math.round(target.altFt / 100)}`) : 'SURFACE / GROUND';

    const targetInfo = document.getElementById('selected-target-info');
    if (targetInfo) targetInfo.textContent = `TARGET: ${tgtName} [${distKm}km • ${tgtAlt}]`;

    let rawTgtBadge = isKnown ? (target.spec ? target.spec.id : (target.callsign || target.type)) : 'BOGEY [?]';
    if (target.isAce && isKnown) rawTgtBadge = `★ ${rawTgtBadge} ★`;
    const tgtBadge = String(rawTgtBadge).replace(/<[^>]*>/g, '');
    const badgeColor = !isKnown ? '#f97316' : ((target.isAce && isKnown) ? '#ffd700' : '#00f5a0');
    this.flashFeedback(btn, `LOCK [${currentNum}/${totalNum}] ${tgtBadge}`, badgeColor);

    if (this.game.radar) {
      const lockColor = !isKnown ? '#f97316' : ((target.isAce && isKnown) ? '#ffd700' : '#00f0ff');
      this.game.radar.spawnCombatText(target.x, target.y, isKnown ? 'TARGET LOCKED [T]' : 'BOGEY LOCKED [T]', lockColor);
      this.game.radar.spawnShockwave(target.x, target.y, lockColor, 25);
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.game.avionics.updateActiveUnitMFD();
  }

  flashFeedback(btn, text, color) {
    if (!btn) return;
    if (this._autoLockTimeout) clearTimeout(this._autoLockTimeout);
    btn.textContent = text;
    btn.style.borderColor = color;
    btn.style.color = color;

    this._autoLockTimeout = setTimeout(() => {
      btn.textContent = 'AUTO-LOCK [SPACE]';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 1800);
  }
}

window.AutoLockController = AutoLockController;