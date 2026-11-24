/**
 * AIRSPACE STANDOFF: Inspection Cognition & Doctrine Submodule
 * Displays live AI cognitive focus slots, Air & Attack doctrines, ground phase, and friendly subsystems.
 */

window.INSP_SVG = window.INSP_SVG || {
  deg: '<svg class="insp-ico-deg" viewBox="0 0 10 10" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="5" r="3.2"/></svg>',
  dot: '<svg class="insp-ico-dot" viewBox="0 0 10 10" width="4" height="4" fill="currentColor"><circle cx="5" cy="5" r="2.8"/></svg>',
  pm: '<svg class="insp-ico-pm" viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="4" x2="10" y2="4"/><line x1="6" y1="1" x2="6" y2="7"/><line x1="2" y1="10" x2="10" y2="10"/></svg>'
};

class InspectionCognitionRenderer {
  static getTacticalRoleLabel(rawRole, groundPhase) {
    const roleMap = {
      SNIPER: 'STANDOFF SNIPER', INTERCEPT: 'HIGH-SPEED INTERCEPTOR', DOGFIGHT: 'WVR DOGFIGHTER',
      SWARM: 'SWARM FLIGHT SCREEN', ESCORT: 'FORMATION ESCORT', SEAD: 'SEAD ESCORT',
      STRIKE: 'STRIKE INTERDICTION', AMBUSH: 'STEALTH AMBUSH', SWEEP: 'AIR DOMINANCE SWEEP', FLAGSHIP: 'COMMAND FLAGSHIP'
    };
    const base = roleMap[rawRole] || String(rawRole || 'SWEEP').replace(/_/g, ' ');
    return groundPhase ? `${base} [${groundPhase}]` : base;
  }

  static getRoleAssessment(prof) {
    if (prof.groundPhase === 'TAXI') return `QRA Taxi Phase on ${prof.airbaseId}: Taxiing to intact runway segment (requires ${prof.takeoffSegmentsReq} contiguous segments).`;
    if (prof.groundPhase === 'TAKEOFF') return `QRA Takeoff Roll on ${prof.airbaseId}: Accelerating down runway strip. Cratering active segments destroys the rolling aircraft.`;
    if (prof.isRTB) return 'Returning to covered base sanctuary or SAM cover to conserve remaining airframe integrity.';

    if (prof.isAttackMode && prof.atkCapPosture) {
      if (prof.atkCapPosture === 'GUARD_OBJECTIVES') return 'Tight Base Defense CAP: Orbiting primary strategic bunkers and runways to intercept incoming strike flights.';
      if (prof.atkCapPosture === 'INTERCEPT_FORWARD') return 'Fast Air Scramble CAP: Pushing aggressively forward toward incoming strike packages at high throttle.';
      if (prof.atkCapPosture === 'AMBUSH') return 'Silent Radar Ambush CAP: Flanking wide around the central corridor to ambush strikers from outer angles.';
    }

    if (prof.isAce) {
      return `Ace Cadre (${prof.diffKey}): Coordinating ${prof.salvoMaxMissiles}-missile volleys (${Math.round(prof.mixedSeekerChance * 100)}% mixed radar+IR), ${prof.reactionCooldown.toFixed(1)}s reflex, and ${Math.round(prof.notchChance * 100)}% notch discipline.`;
    }

    const docNotes = {
      AGGRESSIVE: 'Aggressive Rush Doctrine: Pushing high throttle, committing early to close merges, and firing expanded salvos.',
      STANDOFF: 'Long-Range Standoff Doctrine: Climbing high, firing early at extended reach, cranking 60 deg, and dragging away inside 44 km.',
      STEALTH_AMBUSH: 'Stealth Ambush Doctrine: Routing along north/south borders at reduced cruise heat and holding fire for broadside angles.',
      DRONE_SWARM: 'Drone Swarm Doctrine: Screening forward with unmanned waves and MALD decoys while leads coordinate behind.',
      RADAR_JAMMING: 'Electronic Jamming Doctrine: Maintaining central ECM jamming umbrella while escorts screen ahead.',
      DEFENSIVE_HOLD: 'Defensive Hold Doctrine: Orbiting friendly base SAM/jammer cover, conserving missiles, and retreating early to rearm.'
    };
    if (!prof.isAttackMode && prof.airDoctrineId && docNotes[prof.airDoctrineId]) return docNotes[prof.airDoctrineId];

    const trackNote = prof.trackOrder ? ` Active sensor task: ${prof.trackOrder}.` : '';
    return prof.isFocused
      ? `Commander focus active (${prof.remainingFocus.toFixed(1)}s). Steering, speed control, and weapon firing actively managed.${trackNote}`
      : `Autonomous patrol awaiting a free focus slot (${prof.activeFocusCount}/${prof.maxSlots} active).${trackNote}`;
  }

  static renderCognitionCard(controller, aircraft) {
    if (!controller.isAircraft(aircraft)) return '';
    const ai = controller.game && controller.game.ai;
    if (!ai || typeof ai.getCognitiveProfile !== 'function') return '';

    const prof = ai.getCognitiveProfile(aircraft.id);
    const isActivelyControlled = Boolean(prof.isFocused);
    const isAce = Boolean(prof.isAce);
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);

    const postureText = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');
    const roleText = prof.roleInFormation;
    const pairDetail = prof.pairedUnit ? ` ${window.INSP_SVG.dot} Pair: ${prof.pairedUnit.callsign}` : '';
    const tacticalRoleLabel = this.getTacticalRoleLabel(prof.tacticalRole, prof.groundPhase);
    const doctrineLabel = `${String(prof.doctrineName).toUpperCase()}${prof.atkCapPosture ? ` (${prof.atkCapPosture.replace(/_/g, ' ')})` : ''}`;

    const successionHtml = prof.isHesitating
      ? `<b style="color:var(--stat-tier-4);">Command disruption (${prof.successionTimer.toFixed(1)}s hesitation)</b>`
      : '<b>Normal decision cycle</b>';

    const cardClass = (isAce || isActivelyControlled) ? 'active-focus' : '';
    const headerColor = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--theme-accent)');
    const statusChipText = prof.groundPhase ? `GROUND: ${prof.groundPhase}` : (isAce ? 'ELITE ACE CADRE' : (isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL'));
    const statusChipClass = prof.groundPhase ? 'warning' : (isAce ? 'warning' : (isActivelyControlled ? 'negative' : 'neutral'));

    const focusValText = isAce
      ? (isActivelyControlled ? `LOCKED (ACE ${focusTimerSec.toFixed(1)}s)` : `ACE CADRE (${focusTimerSec.toFixed(1)}s)`)
      : (isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT');
    const focusValColor = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)');

    return `
      <section class="inspection-card insp-cognition-card ${cardClass}" data-insp-enemy-cognition="${aircraft.id}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; color:${headerColor};">${isAce ? 'ACE PILOT COGNITION' : 'AI COGNITIVE PROFILE'}</h3>
          <span class="factor-chip ${statusChipClass} cog-status-chip">${statusChipText}</span>
        </div>
        <div class="insp-cognition-grid">
          <div class="insp-cognition-field"><span>DOCTRINE:</span><b class="cog-doctrine-val" style="color:var(--stat-tier-3);">${doctrineLabel}</b></div>
          <div class="insp-cognition-field"><span>TACTICAL ROLE:</span><b class="cog-tactical-role-val" style="color:var(--stat-tier-1);">${tacticalRoleLabel}</b></div>
          <div class="insp-cognition-field"><span>COMMANDER FOCUS:</span><b class="cog-focus-val" style="color:${focusValColor};">${focusValText}</b></div>
          <div class="insp-cognition-field"><span>FOCUS SLOTS:</span><b class="cog-slots-val">${prof.activeFocusCount} / ${prof.maxSlots} SLOTS</b></div>
          <div class="insp-cognition-field"><span>SQUAD POSTURE:</span><b class="cog-posture-val" style="color:var(--stat-tier-2);">${postureText}</b></div>
          <div class="insp-cognition-field"><span>FORMATION:</span><b class="cog-role-val" style="color:${isAce ? '#ffd700' : 'var(--color-pure-white)'};">${roleText}${pairDetail}</b></div>
          <div class="insp-cognition-field"><span>COMMAND CHAIN:</span><span class="cog-succession-val">${successionHtml}</span></div>
          <div class="insp-cognition-field"><span>TARGET LOCKED:</span><b class="cog-target-val" style="color:var(--color-ice-highlight);">${controller.escape(prof.engagedTargetName || (prof.isRTB ? 'RTB EGRESS' : 'SEARCHING'))}</b></div>
          <div class="insp-cognition-field"><span>SALVO / MIXED:</span><b class="cog-salvo-val">Max x${prof.salvoMaxMissiles} (${Math.round(prof.mixedSeekerChance * 100)}% Mix)</b></div>
          <div class="insp-cognition-field"><span>REFLEX / NOTCH:</span><b>${prof.reactionCooldown.toFixed(1)}s | ${Math.round(prof.notchChance * 100)}%</b></div>
          <div class="insp-cognition-field"><span>DECOY FILTER:</span><b>${Math.round(prof.decoyDiscrimination * 100)}% spot rate</b></div>
          <div class="insp-cognition-field"><span>ORDNANCE LEFT:</span><b class="cog-ammo-val">${prof.ammoRemaining} rounds</b></div>
        </div>
        <div class="inspection-reason-box ${isActivelyControlled || isAce ? 'warning' : ''}" style="margin-top:6px;">
          <b>COGNITIVE ASSESSMENT:</b> <span class="cog-summary-text">${this.getRoleAssessment(prof)}</span>
        </div>
      </section>`;
  }

  static renderFriendlyAircraftProfile(controller, a) {
    const leadData = (a.isFlightLead && window.LEAD_BUFFS) ? window.LEAD_BUFFS[a.spec.category] : null;
    const chips = [];
    if (a.isFlightLead) chips.push({ t: 'warning', txt: `FLIGHT LEAD: ${leadData ? leadData.title : 'ACTIVE'}` });
    if (a.isCoffin) chips.push({ t: 'positive', txt: `COFFIN (+${Math.round(a.coffinDodgeBonus * 100)}% DODGE, NO G-LOC)` });
    if (a.hasTfrMasking) chips.push({ t: a.altFt <= 10000 ? 'positive' : 'neutral', txt: a.altFt <= 10000 ? 'TFR MASKING ENGAGED (+2500FT FLOOR)' : 'TFR RADAR (ACTIVE <FL100)' });
    if (a.targetingPodBonus > 0) chips.push({ t: 'positive', txt: `TGP +${Math.round(a.targetingPodBonus * 100)}% A2G | ${a.targetingSpotRangeKm}KM SPOT` });
    if (a.hasHtsPod) chips.push({ t: 'positive', txt: 'HTS POD (+20% ARM RNG, +14% Pk)' });
    if (a.ccipBonus > 0) chips.push({ t: 'positive', txt: 'CCIP COMPUTER (+16% BOMB/RKT)' });
    if (a.mitlBonus > 0) chips.push({ t: 'positive', txt: 'MITL DATALINK (+14% STANDOFF)' });
    if (a.aaaResistance > 0) chips.push({ t: 'positive', txt: `KEVLAR BELLY (-${Math.round(a.aaaResistance * 100)}% AAA)` });
    if (a.dircmEvasion > 0) chips.push({ t: 'positive', txt: `DIRCM (+${Math.round(a.dircmEvasion * 100)}% VS IR)` });
    if (a.jamEfficiency > 0) chips.push({ t: 'info', txt: `ECM JAMMER (${Math.round(a.jamEfficiency * 100)}%)` });
    if (a.hasECCM) chips.push({ t: 'info', txt: `ECCM (-${Math.round(a.eccmBonus * 100)}% JAM)` });
    if (a.hasIRST) chips.push({ t: 'info', txt: `PASSIVE IRST (${a.irstRangeKm || 28}KM BURN)` });
    if (a.a2aPkBonus > 0) chips.push({ t: 'positive', txt: `A2A SENSOR POD (+${Math.round(a.a2aPkBonus * 100)}% PK)` });
    if (a.hasDatalinkRelay) chips.push({ t: 'neutral', txt: 'OPTICAL DATALINK RELAY' });
    if (a.hasGaNAESA) chips.push({ t: 'info', txt: 'GaN AESA (+20% REACH)' });
    if (a.hasDAS) chips.push({ t: 'info', txt: 'DAS 360 (+10% EVASION)' });
    if (a.datalinkBonus > 0) chips.push({ t: 'neutral', txt: `MADL +${a.datalinkBonus.toFixed(2)} TOK/s` });
    if (a.hasFastRTB) chips.push({ t: 'neutral', txt: 'TACAN FAST RTB (1.8s)' });

    const manStatus = a.activeManeuverTimer > 0
      ? `<b class="fr-man-val" style="color:var(--stat-tier-2);">${a.activeManeuverId} (+${Math.round(a.activeManeuverBonus * 100)}% EVASION, ${a.activeManeuverTimer.toFixed(1)}s)</b>`
      : '<b class="fr-man-val" style="color:var(--color-moon-mist);">CRUISE / MANUAL CONTROL</b>';

    return `
      <section class="inspection-card insp-cognition-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">SQUADRON SYSTEMS &amp; CAPABILITIES</h3>
          <span class="factor-chip ${a.isRTB ? 'warning' : 'positive'}">${a.isRTB ? 'RTB REARMING' : 'COMBAT READY'}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font:600 0.62rem var(--font-dotdigital); margin-top:6px;">
          <span>ACTIVE MANEUVER:</span>${manStatus}
        </div>
        <div class="inspection-chips-wrap" style="margin-top:6px;">
          ${chips.map(c => `<span class="factor-chip ${c.t}">${c.txt}</span>`).join('') || '<span class="inspection-muted">Standard baseline avionics.</span>'}
        </div>
      </section>`;
  }

  static renderAttackDoctrineCard(controller, s) {
    const game = controller.game;
    if (game.scenarioMode !== 'ATTACK') return '';
    if (!window.ATTACK_DIFFICULTIES || !window.ATTACK_DOCTRINES) throw new Error('Attack difficulty or doctrine tables not loaded.');
    const diff = window.ATTACK_DIFFICULTIES[game.attackDifficulty];
    const doc = window.ATTACK_DOCTRINES[game.attackDoctrine];
    if (!diff || !doc) throw new Error('Invalid active attack difficulty or doctrine.');

    const emconPct = Math.round(Math.min(85, Math.max(0, (diff.emconChance + doc.emconBonus) * 100)));
    const gatePct = Math.round(Math.min(100, Math.max(52, (diff.ambushHoldRatio + doc.ambushHoldOffset) * 100)));

    return `
      <section class="inspection-card insp-cognition-card ${s.emconTimer > 0 ? '' : 'active-focus'}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; color:var(--color-red);">IADS DEFENSE DOCTRINE</h3>
          <span class="factor-chip warning">${doc.name.toUpperCase()}</span>
        </div>
        <div class="insp-cognition-grid">
          <div class="insp-cognition-field"><span>DEFENSE TIER:</span><b>${diff.name}</b></div>
          <div class="insp-cognition-field"><span>CAP POSTURE:</span><b style="color:var(--stat-tier-1);">${doc.capPosture.replace(/_/g, ' ')}</b></div>
          <div class="insp-cognition-field"><span>EMCON CHANCE:</span><b>${emconPct}% (&le;${doc.armTriggerKm}km ARM)</b></div>
          <div class="insp-cognition-field"><span>AMBUSH GATE:</span><b>${gatePct}% Max Range</b></div>
          <div class="insp-cognition-field"><span>SAM / AAA CADENCE:</span><b>${doc.samCooldownMult.toFixed(2)}x SAM | ${doc.aaaCooldownMult.toFixed(2)}x AAA</b></div>
          <div class="insp-cognition-field"><span>QRA SCRAMBLE:</span><b>${(diff.takeoffIntervalSec * doc.takeoffIntervalMult).toFixed(0)}s (${Math.round((diff.scramblePairChance + doc.scramblePairBonus) * 100)}% Pair)</b></div>
        </div>
        <div class="inspection-reason-box" style="margin-top:6px;">
          <b>DOCTRINE BRIEF:</b> ${doc.desc}
        </div>
      </section>`;
  }

  static updateLive(controller, aircraft, content) {
    if (!aircraft || !content || !controller.isAircraft(aircraft)) return;
    const frMan = content.querySelector('.fr-man-val');
    if (frMan) {
      if (aircraft.activeManeuverTimer > 0) {
        frMan.textContent = `${aircraft.activeManeuverId} (+${Math.round(aircraft.activeManeuverBonus * 100)}% EVASION, ${aircraft.activeManeuverTimer.toFixed(1)}s)`;
        frMan.style.color = 'var(--stat-tier-2)';
      } else {
        frMan.textContent = 'CRUISE / MANUAL CONTROL';
        frMan.style.color = 'var(--color-moon-mist)';
      }
    }

    const ai = controller.game && controller.game.ai;
    const card = content.querySelector(`[data-insp-enemy-cognition="${aircraft.id}"]`);
    if (!ai || !card) return;
    const prof = ai.getCognitiveProfile(aircraft.id);
    const isActivelyControlled = Boolean(prof.isFocused);
    const isAce = Boolean(prof.isAce);
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);

    card.classList.toggle('active-focus', isActivelyControlled || isAce);
    const chip = card.querySelector('.cog-status-chip');
    if (chip) {
      chip.className = `factor-chip ${prof.groundPhase ? 'warning' : (isAce ? 'warning' : (isActivelyControlled ? 'negative' : 'neutral'))} cog-status-chip`;
      chip.textContent = prof.groundPhase ? `GROUND: ${prof.groundPhase}` : (isAce ? 'ELITE ACE CADRE' : (isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL'));
    }
    const roleEl = card.querySelector('.cog-tactical-role-val');
    if (roleEl) roleEl.textContent = this.getTacticalRoleLabel(prof.tacticalRole, prof.groundPhase);
    const focusVal = card.querySelector('.cog-focus-val');
    if (focusVal) {
      focusVal.textContent = isAce ? (isActivelyControlled ? `LOCKED (ACE ${focusTimerSec.toFixed(1)}s)` : `ACE CADRE (${focusTimerSec.toFixed(1)}s)`) : (isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT');
      focusVal.style.color = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)');
    }
    const slotsVal = card.querySelector('.cog-slots-val');
    if (slotsVal) slotsVal.textContent = `${prof.activeFocusCount} / ${prof.maxSlots} SLOTS`;
    const postureVal = card.querySelector('.cog-posture-val');
    if (postureVal) postureVal.textContent = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');
    const tgtVal = card.querySelector('.cog-target-val');
    if (tgtVal) tgtVal.textContent = prof.engagedTargetName || (prof.isRTB ? 'RTB EGRESS' : 'SEARCHING');
    const ammoVal = card.querySelector('.cog-ammo-val');
    if (ammoVal) ammoVal.textContent = `${prof.ammoRemaining} rounds`;
    const sumVal = card.querySelector('.cog-summary-text');
    if (sumVal) sumVal.textContent = this.getRoleAssessment(prof);
  }
}

window.InspectionCognitionRenderer = InspectionCognitionRenderer;
