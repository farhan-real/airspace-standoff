/**
 * AIRSPACE STANDOFF: Target Solution Display
 * Displays verified target telemetry, concealed radar emitters, ground armor classes, and boresight indicators.
 */

class PylonTargetSolution {
  static updateTargetCard(targetBox, validTarget, activeUnit, commanderTeam) {
    if (!targetBox) return;

    const nameSpan = targetBox.querySelector('#tsb-target-name');
    const distSpan = targetBox.querySelector('#tsb-target-dist');
    const specsBtn = targetBox.querySelector('#tsb-target-specs-btn');
    const gridDiv = targetBox.querySelector('#tsb-target-grid');
    const emptyPrompt = targetBox.querySelector('#tsb-target-empty-prompt');
    const altB = targetBox.querySelector('#tsb-alt');
    const spdB = targetBox.querySelector('#tsb-speed');
    const hpB = targetBox.querySelector('#tsb-hp');
    const typeB = targetBox.querySelector('#tsb-type');

    if (validTarget) {
      const ax = (typeof activeUnit.x === 'number' && !isNaN(activeUnit.x)) ? activeUnit.x : 0;
      const ay = (typeof activeUnit.y === 'number' && !isNaN(activeUnit.y)) ? activeUnit.y : 0;
      const dist = Math.hypot(validTarget.x - ax, validTarget.y - ay);
      const trackState = (validTarget.team === activeUnit.team) ? 'TRACKED' : (typeof validTarget.getTrackState === 'function' ? validTarget.getTrackState(commanderTeam) : ((typeof validTarget.isIdentifiedBy === 'function' ? validTarget.isIdentifiedBy(commanderTeam) : validTarget.isIdentified) ? 'TRACKED' : 'BOGEY'));
      const isKnown = (trackState === 'TRACKED' || trackState === 'DECAYING');
      const isStale = (trackState === 'STALE');

      let rawTgtName = 'BOGEY [?]';
      let classification = 'UNIDENTIFIED RADAR TRACK';
      let armorText = 'UNKNOWN';

      if (isStale) {
        rawTgtName = "ID'D [NO TRACK]";
        classification = 'CONFIRMED HOSTILE - NO ACTIVE SENSOR TRACK';
        armorText = 'NO TRACK';
      } else if (!isKnown) {
        if (validTarget.type) {
          rawTgtName = 'EMITTER [?]';
          classification = 'UNIDENTIFIED RF EMISSION (RECON OR ARM)';
          armorText = 'UNKNOWN';
        } else {
          rawTgtName = 'BOGEY [?]';
          classification = 'UNIDENTIFIED RADAR TRACK';
          armorText = 'UNKNOWN';
        }
      } else if (validTarget.isGhost) {
        rawTgtName = `FALSE ECHO [${validTarget.ghostType || 'CLUTTER'}]`;
        classification = 'RADAR CLUTTER';
        armorText = '0 HP (DISSIPATING)';
      } else if (validTarget.isDecoyDrone) {
        rawTgtName = `DECOY [${validTarget.mirroredModel || 'SPOOF'}]`;
        classification = 'AIR-LAUNCHED DECOY DRONE';
        armorText = `${Math.max(1, Math.round(validTarget.hp))} HP`;
      } else if (validTarget.isCivilian) {
        rawTgtName = validTarget.flightCode || 'CIVILIAN AIRLINER';
        classification = `CIVILIAN: ${validTarget.model || 'AIRLINER'}`;
        armorText = `${Math.max(1, Math.round(validTarget.hp))}/${validTarget.maxHp} HP`;
      } else if (validTarget.type) {
        const objPrefix = validTarget.isPrimaryObjective ? '[PRIMARY OBJ] ' : '';
        const emconTag = validTarget.emconTimer > 0 ? ' [EMCON]' : '';
        rawTgtName = objPrefix + (validTarget.name || validTarget.type) + emconTag;
        classification = `${validTarget.armorClass || 'SOFT'} GROUND (${validTarget.category || validTarget.type})`;
        armorText = validTarget.isIndestructible ? 'INDESTRUCTIBLE' : `${Math.max(1, Math.round(validTarget.hp))}/${validTarget.maxHp} HP`;
      } else {
        rawTgtName = window.formatAircraftDisplayName
          ? window.formatAircraftDisplayName(validTarget)
          : `${validTarget.callsign || 'PILOT'} - ${validTarget.spec ? (validTarget.spec.name || validTarget.spec.id) : 'AIRCRAFT'}`;
        const dispHp = validTarget.hp > 0.05 ? Math.max(1, Math.round(validTarget.hp)) : 0;
        armorText = `${dispHp}/${validTarget.maxHp} HP`;
        classification = validTarget.spec && validTarget.spec.role ? validTarget.spec.role : 'COMBAT AIRCRAFT';
      }

      const tgtName = String(rawTgtName || 'TARGET').replace(/<[^>]*>/g, '');
      const tgtAlt = (validTarget.altFt !== undefined) ? (`FL${Math.round(validTarget.altFt / 100)}`) : 'SURFACE / GROUND';
      const tgtSpeed = (typeof validTarget.speed === 'number') ? (`M ${validTarget.speed.toFixed(2)}`) : 'STATIC (0 km/h)';
      const isCiv = Boolean(validTarget.isCivilian);
      const isHostile = validTarget.team === 'hostile';
      const showAceColor = Boolean(validTarget.isAce && isKnown);

      const angleToTarget = Math.atan2(validTarget.y - ay, validTarget.x - ax);
      let offBoresight = Math.abs((activeUnit.heading || 0) - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
      const maxConeRad = ((activeUnit.gun && activeUnit.gun.coneAngleDeg ? activeUnit.gun.coneAngleDeg : 45) / 2.0) * (Math.PI / 180.0);
      const inBoresight = (offBoresight <= maxConeRad);
      const inGunRange = (activeUnit && activeUnit.gun && dist <= (activeUnit.gun.rangeKm || 4.6));

      targetBox.className = 'target-solution-box active-target';
      if (nameSpan) {
        nameSpan.textContent = `TARGET: ${tgtName}`;
        nameSpan.style.color = isStale ? '#fb7185' : (!isKnown ? '#f97316' : (validTarget.isPrimaryObjective ? '#ffd700' : (showAceColor ? '#ffd700' : (validTarget.isGhost ? '#94a3b8' : (isHostile ? '#ff3366' : (isCiv ? '#7dd3fc' : '#00f0ff'))))));
      }
      if (distSpan) {
        if (inGunRange && inBoresight) {
          distSpan.textContent = `${dist.toFixed(1)} km [IN BORESIGHT]`;
          distSpan.style.color = '#00f5a0';
        } else if (inGunRange) {
          distSpan.textContent = `${dist.toFixed(1)} km [OFF BORESIGHT]`;
          distSpan.style.color = '#f97316';
        } else {
          distSpan.textContent = `${dist.toFixed(1)} km`;
          distSpan.style.color = '#38bdf8';
        }
      }
      if (altB) altB.textContent = tgtAlt;
      if (spdB) spdB.textContent = tgtSpeed;
      if (hpB) hpB.textContent = armorText;

      if (typeB) {
        typeB.textContent = classification;
        typeB.style.color = isStale ? '#fb7185' : (isKnown ? (isHostile ? '#ff3366' : (isCiv ? '#7dd3fc' : '#f8fafc')) : '#f97316');
      }

      if (specsBtn) {
        if (!isKnown) specsBtn.classList.add('hidden');
        else if (validTarget.isCivilian) {
          specsBtn.classList.remove('hidden');
          specsBtn.setAttribute('data-inspect-type', 'civilian');
          specsBtn.setAttribute('data-inspect-id', validTarget.flightCode || 'PACIFIC-412');
        } else if (validTarget.type) {
          specsBtn.classList.remove('hidden');
          specsBtn.setAttribute('data-inspect-type', 'surface');
          specsBtn.setAttribute('data-inspect-id', validTarget.type);
        } else if (validTarget.spec && validTarget.spec.id) {
          specsBtn.classList.remove('hidden');
          specsBtn.setAttribute('data-inspect-type', 'airframe');
          specsBtn.setAttribute('data-inspect-id', validTarget.spec.id);
        } else {
          specsBtn.classList.add('hidden');
        }
      }
      if (gridDiv) gridDiv.classList.remove('hidden');
      if (emptyPrompt) emptyPrompt.classList.add('hidden');
    } else {
      targetBox.className = 'target-solution-box no-target';
      if (nameSpan) { nameSpan.textContent = 'TARGET: NONE'; nameSpan.style.color = '#8494ab'; }
      if (distSpan) { distSpan.textContent = '-- km'; distSpan.style.color = '#38bdf8'; }
      if (specsBtn) specsBtn.classList.add('hidden');
      if (gridDiv) gridDiv.classList.add('hidden');
      if (emptyPrompt) emptyPrompt.classList.remove('hidden');
    }
  }
}

window.PylonTargetSolution = PylonTargetSolution;
