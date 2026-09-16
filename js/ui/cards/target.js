/**
 * APEX VECTOR // Pylon Target Solution Submodule
 * Unidentified aircraft (including civilian) display raw doppler telemetry without revealing model or faction.
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
      const isKnown = (validTarget.team === activeUnit.team) ||
        (typeof validTarget.isIdentifiedBy === 'function' ? validTarget.isIdentifiedBy(commanderTeam) : validTarget.isIdentified);

      let rawTgtName = 'BOGEY [?]';
      let classification = 'RAW DOPPLER TRACK [UNIDENTIFIED]';
      let armorText = 'UNKNOWN';

      if (!isKnown) {
        rawTgtName = 'BOGEY [?]';
        classification = 'RAW DOPPLER TRACK [UNIDENTIFIED]';
        armorText = 'UNKNOWN';
      } else if (validTarget.isGhost) {
        rawTgtName = `FALSE ECHO [${validTarget.ghostType || 'CLUTTER'}]`;
        classification = 'RADAR CLUTTER';
        armorText = '0 HP (DISSIPATING)';
      } else if (validTarget.isDecoyDrone) {
        rawTgtName = `DECOY [${validTarget.mirroredModel || 'SPOOF'}]`;
        classification = 'TACTICAL DECOY DRONE';
        armorText = `${Math.round(validTarget.hp)} HP`;
      } else if (validTarget.isCivilian) {
        rawTgtName = validTarget.flightCode || 'CIVILIAN AIRLINER';
        classification = `CIVILIAN // ${validTarget.model || 'AIRLINER'}`;
        armorText = `${Math.round(validTarget.hp)}/${validTarget.maxHp} HP`;
      } else if (validTarget.type) {
        rawTgtName = validTarget.name || validTarget.type;
        classification = `GROUND INSTALLATION // ${validTarget.type}`;
        armorText = validTarget.isIndestructible ? 'INDESTRUCTIBLE' : `${Math.round(validTarget.hp)}/${validTarget.maxHp} HP`;
      } else {
        rawTgtName = validTarget.spec ? validTarget.spec.id : (validTarget.callsign || 'TARGET');
        armorText = `${Math.round(validTarget.hp)}/${validTarget.maxHp} HP`;
        classification = validTarget.spec && validTarget.spec.role ? `${validTarget.spec.role} (${validTarget.callsign || 'PILOT'})` : 'COMBAT AIRCRAFT';
      }

      const tgtName = String(rawTgtName || 'TARGET').replace(/<[^>]*>/g, '');
      const tgtAlt = (validTarget.altFt !== undefined) ? (`FL${Math.round(validTarget.altFt / 100)}`) : 'SURFACE / GROUND';
      const tgtSpeed = (typeof validTarget.speed === 'number') ? (`M ${validTarget.speed.toFixed(2)}`) : 'STATIC (0 km/h)';
      const isCiv = Boolean(validTarget.isCivilian);
      const isHostile = validTarget.team === 'hostile';
      const showAceColor = Boolean(validTarget.isAce && isKnown);

      targetBox.className = 'target-solution-box active-target';
      if (nameSpan) {
        nameSpan.textContent = `TARGET: ${tgtName}`;
        nameSpan.style.color = !isKnown ? '#f97316' : (showAceColor ? '#ffd700' : (validTarget.isGhost ? '#94a3b8' : (isHostile ? '#ff3366' : (isCiv ? '#7dd3fc' : '#00f0ff'))));
      }
      if (distSpan) distSpan.textContent = `${dist.toFixed(1)} km`;
      if (altB) altB.textContent = tgtAlt;
      if (spdB) spdB.textContent = tgtSpeed;
      if (hpB) hpB.textContent = armorText;

      if (typeB) {
        typeB.textContent = classification;
        typeB.style.color = isKnown ? (isHostile ? '#ff3366' : (isCiv ? '#7dd3fc' : '#f8fafc')) : '#f97316';
      }

      if (specsBtn) {
        if (!isKnown) {
          specsBtn.classList.add('hidden');
        } else if (validTarget.isCivilian) {
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
      if (distSpan) distSpan.textContent = '-- km';
      if (specsBtn) specsBtn.classList.add('hidden');
      if (gridDiv) gridDiv.classList.add('hidden');
      if (emptyPrompt) emptyPrompt.classList.remove('hidden');
    }
  }
}

window.PylonTargetSolution = PylonTargetSolution;