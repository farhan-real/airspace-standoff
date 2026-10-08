/**
 * AIRSPACE STANDOFF: Inspection Cognition & AI Attention Submodule
 * Displays live AI cognitive focus slots, difficulty-tiered tactical roles, and succession states for enemy aircraft.
 */

window.INSP_SVG = window.INSP_SVG || {
  deg: '<svg class="insp-ico-deg" viewBox="0 0 10 10" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="5" r="3.2"/></svg>',
  dot: '<svg class="insp-ico-dot" viewBox="0 0 10 10" width="4" height="4" fill="currentColor"><circle cx="5" cy="5" r="2.8"/></svg>',
  pm: '<svg class="insp-ico-pm" viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="4" x2="10" y2="4"/><line x1="6" y1="1" x2="6" y2="7"/><line x1="2" y1="10" x2="10" y2="10"/></svg>'
};

class InspectionCognitionRenderer {
  static getTacticalRoleLabel(rawRole) {
    const roleMap = {
      'SNIPER': 'STANDOFF SNIPER',
      'INTERCEPT': 'HIGH-SPEED INTERCEPTOR',
      'DOGFIGHT': 'WVR DOGFIGHTER',
      'SWARM': 'SWARM FLIGHT SCREEN',
      'ESCORT': 'FORMATION ESCORT',
      'SEAD': 'SEAD ESCORT',
      'STRIKE': 'STRIKE INTERDICTION',
      'AMBUSH': 'STEALTH AMBUSH',
      'SWEEP': 'AIR DOMINANCE SWEEP',
      'FLAGSHIP': 'COMMAND FLAGSHIP'
    };
    return roleMap[rawRole] || (rawRole ? String(rawRole).replace(/_/g, ' ') : 'AIR DOMINANCE SWEEP');
  }

  static getRoleAssessment(rawRole, isAce, isActivelyControlled, focusCount, maxSlots, diffKey) {
    if (isAce) {
      if (diffKey === 'LEGEND') return 'Flagship Ace Command: Coordinates multi-axis volleys, utilizes directed-energy lasers, and executes sub-second defensive breaks.';
      if (diffKey === 'MASTER') return 'Master Ace Lead: Operating stratospheric energy perch with railgun/pulse-laser snipes and high-G Kulbit capability.';
      return 'Designated Ace Flight Lead with superior reaction speeds, advanced decoy discrimination, and high-G notch discipline.';
    }

    if (rawRole === 'INTERCEPT') {
      return 'High-Speed Intercept: Pushing afterburner thrust to achieve maximum supersonic closure against high-priority aerial targets.';
    }

    if (rawRole === 'DOGFIGHT') {
      return 'Close-Range Dogfight: Seeking visual-range merge (< 20 km), modulating throttle into optimal corner speed for high-G snapshots and autocannon bursts.';
    }

    if (rawRole === 'SWARM') {
      return 'Unmanned Swarm Screen: Flanking formation edges to draw enemy missile fire and deploy saturation micro-missile volleys.';
    }

    if (rawRole === 'ESCORT') {
      return 'Close Formation Escort: Maintaining tight perimeter coverage around the flight lead and engaging incoming interceptors.';
    }

    if (rawRole === 'SNIPER') {
      if (diffKey === 'LEGEND') return 'Standoff F-Pole Skate: Stratospheric FL500 cruise, maintaining 46 to 90 km standoff and cranking 65 deg off boresight to deny return fire.';
      if (diffKey === 'MASTER') return 'Stratospheric Energy Skate: Cruising FL460, holding 50 to 85 km range and performing tactical retrograde drags to drain incoming missiles.';
      if (diffKey === 'ACE') return 'Distance Drag & Standoff: Cruising FL420 at 50 to 80 km range, executing 135 deg retrograde turns when targets close inside 45 km.';
      return 'Standoff Perimeter: Holding 45 to 75 km range at FL380, turning beam perpendicular if targets approach inside 38 km.';
    }

    if (rawRole === 'SEAD') {
      if (diffKey === 'LEGEND') return 'Surgical IADS Dismantling: Actively blinding Early Warning Radars and Jammer stations first to disable S-400 batteries without radiating.';
      if (diffKey === 'MASTER') return 'Emitter Standoff & Shielding: Projecting GaN AESA jamming while geolocating and neutralizing surface radar arrays with AGM-88Gs.';
      if (diffKey === 'ACE') return 'Threat-Hierarchy SEAD: Actively prioritizing S-400 and Early Warning Radars over secondary ground units, flying FL320 approach.';
      return 'Air Defense Suppression: Actively seeking surface radar stations and air-defense batteries with anti-radiation missiles.';
    }

    if (rawRole === 'STRIKE') {
      if (diffKey === 'LEGEND') return 'Deck-Skimming Attack Run: Low-altitude approach at FL055 beneath sensor horizon, executing synchronized standoff cruise missile releases.';
      if (diffKey === 'MASTER') return 'Low-Altitude Standoff Run: Flying FL080 along low-threat alleys, delivering Kinzhal or JASSM-ER strikes on command bunkers.';
      if (diffKey === 'ACE') return 'Terrain-Masked Strike: Flying FL110 approach with pop-up delivery at 25 km to release glide bombs onto command infrastructure.';
      return 'Low-Altitude Approach: Flying FL140 below radar coverage directly toward allied command bunkers and fuel depots.';
    }

    if (rawRole === 'AMBUSH') {
      if (diffKey === 'LEGEND') return 'Crossfire Stealth Bracket: Deep outer flank approach at FL420, attacking player beam aspects from behind the frontline with clean bays.';
      if (diffKey === 'MASTER') return 'Silent Lateral Ambush: Operating along boundary corridors at FL400 with zero pylon drag to launch surprise broadside BVR volleys.';
      if (diffKey === 'ACE') return 'Offset Corridor Approach: Flying FL360 along northern or southern sector edges, exploiting player beam RCS spikes at 40 km.';
      return 'Lateral Corridor Flanking: Flying outer boundaries at FL320 to acquire broadside locks with internal stealth missiles.';
    }

    if (rawRole === 'SWEEP') {
      if (diffKey === 'LEGEND') return 'Dynamic 3D Air Dominance: High-speed fighter merge, utilizing optimal cornering throttle cuts and post-stall snapshot bursts.';
      if (diffKey === 'MASTER') return 'Tactical Drag & Intercept: High-Low element pairing, pulling defenders into turning dogfights while wingmen take high-off-boresight shots.';
      if (diffKey === 'ACE') return 'Defensive Screen & Merge: Patrolling FL280 to engage allied fighters and clear corridors for friendly snipers and strike craft.';
      return 'Offensive Combat Sweep: Maneuvering to engage allied fighters directly in forward air merges.';
    }

    return isActivelyControlled
      ? 'Commander attention active. Target steering, energy optimization, and missile release solutions are actively processed.'
      : `Aircraft is on autonomous patrol awaiting an available commander focus slot (${focusCount}/${maxSlots} currently engaged).`;
  }

  static renderCognitionCard(controller, aircraft) {
    if (!aircraft || !aircraft.spec) return '';
    const ai = controller.game && controller.game.ai;
    if (!ai || typeof ai.getCognitiveProfile !== 'function') return '';

    const prof = ai.getCognitiveProfile(aircraft.id);
    const isActivelyControlled = Boolean(prof.isFocused);
    const isAce = Boolean(prof.isAce);
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);
    const diffKey = controller.game && controller.game.aiDifficulty ? controller.game.aiDifficulty : 'VETERAN';

    const postureText = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');
    const roleText = prof.roleInFormation || (isAce ? 'Ace Interceptor' : 'Independent Element');
    const pairDetail = prof.pairedUnit ? ` ${window.INSP_SVG.dot} Pair: ${prof.pairedUnit.callsign || 'Wingman'}` : '';

    const tacticalRoleLabel = this.getTacticalRoleLabel(prof.tacticalRole);

    let successionHtml = '<b>Normal decision cycle</b>';
    if (prof.isHesitating) {
      successionHtml = `<b style="color:var(--stat-tier-4);">Command disruption (${prof.successionTimer.toFixed(1)}s hesitation)</b>`;
    }

    const cardClass = isAce ? 'active-focus' : (isActivelyControlled ? 'active-focus' : '');
    const headerColor = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--theme-accent)');
    const statusChipText = isAce ? 'ELITE ACE CADRE' : (isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL');
    const statusChipClass = isAce ? 'warning' : (isActivelyControlled ? 'negative' : 'neutral');

    const focusValText = isAce
      ? (isActivelyControlled ? `LOCKED (ACE CADRE ${focusTimerSec.toFixed(1)}s)` : `ACE STANDBY (${focusTimerSec.toFixed(1)}s)`)
      : (isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT');
    const focusValColor = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)');

    const assessmentText = this.getRoleAssessment(prof.tacticalRole, isAce, isActivelyControlled, prof.activeFocusCount, prof.maxSlots, diffKey);

    return `
      <section class="inspection-card insp-cognition-card ${cardClass}" data-insp-enemy-cognition="${aircraft.id}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; color:${headerColor};">
            ${isAce ? 'ACE PILOT COGNITION' : 'AI TACTICAL COGNITION'}
          </h3>
          <span class="factor-chip ${statusChipClass} cog-status-chip">
            ${statusChipText}
          </span>
        </div>

        <div class="insp-cognition-grid">
          <div class="insp-cognition-field">
            <span>TACTICAL ROLE:</span>
            <b class="cog-tactical-role-val" style="color:var(--stat-tier-1);">${tacticalRoleLabel}</b>
          </div>

          <div class="insp-cognition-field">
            <span>COMMANDER FOCUS:</span>
            <b class="cog-focus-val" style="color:${focusValColor};">
              ${focusValText}
            </b>
          </div>

          <div class="insp-cognition-field">
            <span>ACTIVE FOCUS SLOTS:</span>
            <b class="cog-slots-val">${prof.activeFocusCount} / ${prof.maxSlots} SLOTS</b>
          </div>

          <div class="insp-cognition-field">
            <span>SQUADRON POSTURE:</span>
            <b class="cog-posture-val" style="color:var(--stat-tier-2);">${postureText}</b>
          </div>

          <div class="insp-cognition-field">
            <span>FORMATION ROLE:</span>
            <b class="cog-role-val" style="color:${isAce ? '#ffd700' : 'var(--color-pure-white)'};">${roleText}${pairDetail}</b>
          </div>

          <div class="insp-cognition-field">
            <span>CHAIN OF COMMAND:</span>
            <span class="cog-succession-val">${successionHtml}</span>
          </div>

          <div class="insp-cognition-field">
            <span>REACTION LATENCY:</span>
            <b class="cog-reaction-val" style="color:${isAce ? 'var(--stat-tier-1)' : 'var(--color-pure-white)'};">
              ${prof.reactionCooldown.toFixed(1)}s ${isAce ? '(Ace Reflex)' : 'delay'}
            </b>
          </div>

          <div class="insp-cognition-field">
            <span>DOPPLER NOTCH:</span>
            <b class="cog-notch-val" style="color:${isAce ? 'var(--stat-tier-2)' : 'var(--color-pure-white)'};">
              ${Math.round(prof.notchChance * 100)}% ${isAce ? '(High-G)' : 'discipline'}
            </b>
          </div>

          <div class="insp-cognition-field">
            <span>DECOY DISCRIMINATION:</span>
            <b class="cog-decoy-val" style="color:${isAce ? 'var(--stat-tier-1)' : 'var(--color-pure-white)'};">
              ${Math.round(prof.decoyDiscrimination * 100)}% ${isAce ? '(Signal Filter)' : 'filter rate'}
            </b>
          </div>
        </div>

        <div class="inspection-reason-box ${isActivelyControlled || isAce ? 'warning' : ''}" style="margin-top:6px;">
          <b>COGNITIVE ASSESSMENT:</b>
          <span class="cog-summary-text">${assessmentText}</span>
        </div>
      </section>
    `;
  }

  static updateLive(controller, aircraft, content) {
    if (!aircraft || !content || !aircraft.spec) return;
    const ai = controller.game && controller.game.ai;
    if (!ai || typeof ai.getCognitiveProfile !== 'function') return;

    const card = content.querySelector(`[data-insp-enemy-cognition="${aircraft.id}"]`);
    if (!card) return;

    const prof = ai.getCognitiveProfile(aircraft.id);
    const isActivelyControlled = Boolean(prof.isFocused);
    const isAce = Boolean(prof.isAce);
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);
    const diffKey = controller.game && controller.game.aiDifficulty ? controller.game.aiDifficulty : 'VETERAN';

    card.classList.toggle('active-focus', isActivelyControlled || isAce);

    const chip = card.querySelector('.cog-status-chip');
    if (chip) {
      chip.className = `factor-chip ${isAce ? 'warning' : (isActivelyControlled ? 'negative' : 'neutral')} cog-status-chip`;
      chip.textContent = isAce ? 'ELITE ACE CADRE' : (isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL');
    }

    const tacticalRoleVal = card.querySelector('.cog-tactical-role-val');
    if (tacticalRoleVal) {
      tacticalRoleVal.textContent = this.getTacticalRoleLabel(prof.tacticalRole);
    }

    const focusVal = card.querySelector('.cog-focus-val');
    if (focusVal) {
      focusVal.textContent = isAce
        ? (isActivelyControlled ? `LOCKED (ACE CADRE ${focusTimerSec.toFixed(1)}s)` : `ACE STANDBY (${focusTimerSec.toFixed(1)}s)`)
        : (isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT');
      focusVal.style.color = isAce ? '#ffd700' : (isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)');
    }

    const slotsVal = card.querySelector('.cog-slots-val');
    if (slotsVal) slotsVal.textContent = `${prof.activeFocusCount} / ${prof.maxSlots} SLOTS`;

    const postureVal = card.querySelector('.cog-posture-val');
    if (postureVal) postureVal.textContent = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');

    const roleVal = card.querySelector('.cog-role-val');
    if (roleVal) {
      const pairDetail = prof.pairedUnit ? ` ${window.INSP_SVG.dot} Pair: ${prof.pairedUnit.callsign || 'Wingman'}` : '';
      roleVal.innerHTML = `${prof.roleInFormation || (isAce ? 'Ace Interceptor' : 'Independent Element')}${pairDetail}`;
      roleVal.style.color = isAce ? '#ffd700' : 'var(--color-pure-white)';
    }

    const succVal = card.querySelector('.cog-succession-val');
    if (succVal) {
      succVal.innerHTML = prof.isHesitating
        ? `<b style="color:var(--stat-tier-4);">Command disruption (${prof.successionTimer.toFixed(1)}s hesitation)</b>`
        : '<b>Normal decision cycle</b>';
    }

    const reactionVal = card.querySelector('.cog-reaction-val');
    if (reactionVal) {
      reactionVal.textContent = `${prof.reactionCooldown.toFixed(1)}s ${isAce ? '(Ace Reflex)' : 'delay'}`;
    }

    const notchVal = card.querySelector('.cog-notch-val');
    if (notchVal) {
      notchVal.textContent = `${Math.round(prof.notchChance * 100)}% ${isAce ? '(High-G)' : 'discipline'}`;
    }

    const decoyVal = card.querySelector('.cog-decoy-val');
    if (decoyVal) {
      decoyVal.textContent = `${Math.round(prof.decoyDiscrimination * 100)}% ${isAce ? '(Signal Filter)' : 'filter rate'}`;
    }

    const summaryText = card.querySelector('.cog-summary-text');
    if (summaryText) {
      summaryText.textContent = this.getRoleAssessment(prof.tacticalRole, isAce, isActivelyControlled, prof.activeFocusCount, prof.maxSlots, diffKey);
    }
  }
}

window.InspectionCognitionRenderer = InspectionCognitionRenderer;