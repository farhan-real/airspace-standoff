/* AIRSPACE STANDOFF: Modal Templates - Dialogs & Confirmations */

class ModalDialogTemplates {
  static install() {
    const container = document.createElement('div');
    container.id = 'modal-dialogs-container';
    container.innerHTML = `
      <!-- PAUSE OVERLAY MODAL -->
      <div id="pause-modal" class="modal-backdrop">
        <div class="inspect-window" style="max-width: 440px; text-align: center;">
          <div class="inspect-header">
            <h2 style="color: var(--color-ice-highlight);">SIMULATION PAUSED</h2>
          </div>
          <div class="inspect-body" style="padding: 20px; gap: 14px;">
            <p style="font-size: 0.76rem; color: var(--color-moon-mist); line-height: 1.5;">
              Simulation paused. Select an option to proceed.
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button id="btn-resume-sortie" class="scramble-btn" style="width: 100%; padding: 8px;">RESUME</button>
              <button id="btn-pause-settings" class="hud-btn" style="width: 100%;">
                <img src="icons/settings.svg" class="btn-vector-ico" width="13" height="13" alt="Settings">
                <span>SETTINGS</span>
              </button>
              <button id="btn-pause-manual" class="hud-btn" style="width: 100%;">
                <img src="icons/manual.svg" class="btn-vector-ico" width="13" height="13" alt="Manual">
                <span>FLIGHT MANUAL</span>
              </button>
              <button id="btn-pause-abort" class="hud-btn alert" style="width: 100%;">ABORT MISSION</button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONFIRMATION MODAL -->
      <div id="tactical-dialog-modal" class="modal-backdrop">
        <div class="inspect-window" style="max-width: 500px;">
          <div class="inspect-header">
            <div class="modal-title-row"><h2 id="tactical-dialog-title">CONFIRMATION</h2></div>
            <button id="btn-tactical-dialog-close" class="hud-btn small">
              <img src="icons/close.svg" width="10" height="10" alt="Close">
            </button>
          </div>
          <div class="inspect-body" style="padding: 16px 18px; gap: 12px;">
            <p id="tactical-dialog-msg" style="font-size: 0.80rem; color: var(--color-moon-mist); line-height: 1.5;"></p>
            <div id="tactical-dialog-field-wrap">
              <input type="text" id="tactical-dialog-input" class="hud-search-input" style="font-size: 0.78rem; padding: 7px 12px; width: 100%;">
            </div>
            <div id="tactical-dialog-options-wrap" style="display:none; flex-direction:column; gap:5px; max-height:200px; overflow-y:auto;"></div>
            <div class="tactical-dialog-actions">
              <button id="btn-tactical-dialog-cancel" class="hud-btn tactical-dialog-btn">CANCEL</button>
              <button id="btn-tactical-dialog-confirm" class="hud-btn tactical-dialog-btn highlight">CONFIRM</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SYSTEM INSPECTION MODAL -->
      <div id="system-inspect-modal" class="modal-backdrop">
        <div class="inspect-window" style="max-width: 860px;">
          <div class="inspect-header">
            <div class="modal-title-row"><h2 id="inspect-modal-title">SYSTEM SPECIFICATIONS</h2></div>
            <button id="btn-close-inspect" class="hud-btn small">CLOSE</button>
          </div>
          <div class="inspect-body" id="inspect-modal-body"></div>
        </div>
      </div>

      <!-- RWR THREAT BRIEFING MODAL -->
      <div id="rwr-briefing-modal" class="modal-backdrop">
        <div class="inspect-window" style="max-width: 660px;">
          <div class="inspect-header">
            <div class="modal-title-row"><h2>RWR THREAT REFERENCE &amp; PROCEDURES</h2></div>
            <button id="btn-close-rwr-modal" class="hud-btn small">CLOSE</button>
          </div>
          <div class="inspect-body">
            <div class="inspect-stat-grid" style="grid-template-columns: 1fr; gap: 6px;">
              <div class="inspect-stat-item"><span style="color: var(--color-green); font-weight: 600;">SEARCH CLEAR:</span><b>No hostile radar emissions detected. Safe to maintain cruise profile.</b></div>
              <div class="inspect-stat-item"><span style="color: var(--color-amber); font-weight: 600;">RADAR SWEEP:</span><b>Hostile radar sweep detected. Turn nose-on to reduce RCS or use terrain/clouds for masking.</b></div>
              <div class="inspect-stat-item"><span style="color: var(--color-red); font-weight: 600;">RADAR LOCK:</span><b>Target tracking lock detected. Beam 90 degrees (Doppler Notch) and deploy chaff.</b></div>
              <div class="inspect-stat-item"><span style="color: var(--color-red); font-weight: 600;">STEALTH MISSILE:</span><b>Low-observable missile detected. Minimum warning range; execute defensive break turn.</b></div>
              <div class="inspect-stat-item"><span style="color: var(--color-frost-glow); font-weight: 600;">CIVILIAN ROE:</span><b>Strict RoE enforced: Firing on unverified bogeys incurs -600 VP upon launch.</b></div>
              <div class="inspect-stat-item"><span style="color: var(--color-amber); font-weight: 600;">HOSTILE LEADERS:</span><b>Designated hostile flight leads active. They employ high-G breaks and coordinated volleys.</b></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ABORT CONFIRM MODAL -->
      <div id="abort-confirm-modal" class="modal-backdrop">
        <div class="inspect-window" style="max-width: 440px; text-align: center;">
          <div class="inspect-header" style="background: rgba(244, 63, 94, 0.12);"><h2 style="color: #fca5a5;">ABORT MISSION?</h2></div>
          <div class="inspect-body" style="gap:12px; padding: 18px;">
            <p style="font-size:0.76rem; color: var(--color-moon-mist);">Abort current mission and review the debriefing report?</p>
            <div style="display:flex; justify-content:center; gap:10px;">
              <button id="btn-confirm-abort" class="hud-btn alert">ABORT MISSION</button>
              <button id="btn-cancel-abort" class="hud-btn">CANCEL</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }
}

window.ModalDialogTemplates = ModalDialogTemplates;