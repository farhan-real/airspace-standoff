/**
 * AIRSPACE STANDOFF: Inspection Cognition & AI Attention Submodule
 * Displays live AI cognitive focus slots, mission posture, and succession states for enemy aircraft.
 */

window.INSP_SVG = window.INSP_SVG || {
  deg: '<svg class="insp-ico-deg" viewBox="0 0 10 10" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="5" r="3.2"/></svg>',
  dot: '<svg class="insp-ico-dot" viewBox="0 0 10 10" width="4" height="4" fill="currentColor"><circle cx="5" cy="5" r="2.8"/></svg>',
  pm: '<svg class="insp-ico-pm" viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="4" x2="10" y2="4"/><line x1="6" y1="1" x2="6" y2="7"/><line x1="2" y1="10" x2="10" y2="10"/></svg>'
};

class InspectionCognitionRenderer {
  static renderCognitionCard(controller, aircraft) {
    if (!aircraft || !aircraft.spec) return '';
    const ai = controller.game && controller.game.ai;
    if (!ai || typeof ai.getCognitiveProfile !== 'function') return '';

    const prof = ai.getCognitiveProfile(aircraft.id);
    const isActivelyControlled = Boolean(prof.isFocused);
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);

    const postureText = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');
    const roleText = prof.roleInFormation || 'Independent Element';
    const pairDetail = prof.pairedUnit ? ` ${window.INSP_SVG.dot} Pair: ${prof.pairedUnit.callsign || 'Wingman'}` : '';

    let successionHtml = '<b>Normal decision cycle</b>';
    if (prof.isHesitating) {
      successionHtml = `<b style="color:var(--stat-tier-4);">Command disruption (${prof.successionTimer.toFixed(1)}s hesitation)</b>`;
    }

    return `
      <section class="inspection-card insp-cognition-card ${isActivelyControlled ? 'active-focus' : ''}" data-insp-enemy-cognition="${aircraft.id}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; color:${isActivelyControlled ? 'var(--color-red)' : 'var(--theme-accent)'};">
            AI TACTICAL COGNITION
          </h3>
          <span class="factor-chip ${isActivelyControlled ? 'negative' : 'neutral'} cog-status-chip">
            ${isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL'}
          </span>
        </div>

        <div class="insp-cognition-grid">
          <div class="insp-cognition-field">
            <span>COMMANDER FOCUS:</span>
            <b class="cog-focus-val" style="color:${isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)'};">
              ${isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT'}
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
            <b class="cog-role-val">${roleText}${pairDetail}</b>
          </div>

          <div class="insp-cognition-field">
            <span>CHAIN OF COMMAND:</span>
            <span class="cog-succession-val">${successionHtml}</span>
          </div>

          <div class="insp-cognition-field">
            <span>REACTION LATENCY:</span>
            <b>${prof.reactionCooldown.toFixed(1)}s delay</b>
          </div>

          <div class="insp-cognition-field">
            <span>DOPPLER NOTCH:</span>
            <b>${Math.round(prof.notchChance * 100)}% discipline</b>
          </div>

          <div class="insp-cognition-field">
            <span>DECOY DISCRIMINATION:</span>
            <b>${Math.round(prof.decoyDiscrimination * 100)}% filter rate</b>
          </div>
        </div>

        <div class="inspection-reason-box ${isActivelyControlled ? 'warning' : ''}" style="margin-top:6px;">
          <b>COGNITIVE ASSESSMENT:</b>
          <span class="cog-summary-text">
            ${isActivelyControlled
              ? `Commander attention active. Target steering, energy optimization, and missile release solutions are actively processed.`
              : `Aircraft is on autonomous patrol awaiting an available commander focus slot (${prof.activeFocusCount}/${prof.maxSlots} currently engaged).`}
          </span>
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
    const focusTimerSec = Math.max(0, prof.remainingFocus || 0);

    card.classList.toggle('active-focus', isActivelyControlled);

    const chip = card.querySelector('.cog-status-chip');
    if (chip) {
      chip.className = `factor-chip ${isActivelyControlled ? 'negative' : 'neutral'} cog-status-chip`;
      chip.textContent = isActivelyControlled ? 'ACTIVELY CONTROLLED' : 'AUTONOMOUS PATROL';
    }

    const focusVal = card.querySelector('.cog-focus-val');
    if (focusVal) {
      focusVal.textContent = isActivelyControlled ? `LOCKED (${focusTimerSec.toFixed(1)}s)` : 'WAITING FOR SLOT';
      focusVal.style.color = isActivelyControlled ? 'var(--color-red)' : 'var(--color-moon-mist)';
    }

    const slotsVal = card.querySelector('.cog-slots-val');
    if (slotsVal) slotsVal.textContent = `${prof.activeFocusCount} / ${prof.maxSlots} SLOTS`;

    const postureVal = card.querySelector('.cog-posture-val');
    if (postureVal) postureVal.textContent = String(prof.posture || 'OFFENSIVE_SWEEP').replace(/_/g, ' ');

    const roleVal = card.querySelector('.cog-role-val');
    if (roleVal) {
      const pairDetail = prof.pairedUnit ? ` ${window.INSP_SVG.dot} Pair: ${prof.pairedUnit.callsign || 'Wingman'}` : '';
      roleVal.innerHTML = `${prof.roleInFormation || 'Independent Element'}${pairDetail}`;
    }

    const succVal = card.querySelector('.cog-succession-val');
    if (succVal) {
      succVal.innerHTML = prof.isHesitating
        ? `<b style="color:var(--stat-tier-4);">Command disruption (${prof.successionTimer.toFixed(1)}s hesitation)</b>`
        : '<b>Normal decision cycle</b>';
    }

    const summaryText = card.querySelector('.cog-summary-text');
    if (summaryText) {
      summaryText.textContent = isActivelyControlled
        ? `Commander attention active. Target steering, energy optimization, and missile release solutions are actively processed.`
        : `Aircraft is on autonomous patrol awaiting an available commander focus slot (${prof.activeFocusCount}/${prof.maxSlots} currently engaged).`;
    }
  }
}

window.InspectionCognitionRenderer = InspectionCognitionRenderer;