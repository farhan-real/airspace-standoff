/* AIRSPACE STANDOFF: Modal Templates - Debriefing & Replay */

class ModalDebriefTemplate {
  static install() {
    const container = document.createElement('div');
    container.id = 'modal-debrief-container';
    container.innerHTML = `
      <div id="game-over-modal" class="modal-backdrop">
        <div class="game-over-dialog">
          <div class="after-action-header">
            <h2 id="game-over-title">MISSION DEBRIEF</h2>
            <span id="game-over-desc" class="after-action-subtitle">OPERATIONAL SUMMARY</span>
          </div>

          <div class="after-action-body">
            <div class="ace-podium-section">
              <div class="strip-subhead" style="color: var(--color-ice-highlight);">FLIGHT PERFORMANCE SUMMARY</div>
              <div class="ace-podium-grid" id="ace-podium-cards"></div>
            </div>

            <div id="game-over-stats"></div>

            <div class="aar-replay-container">
              <div class="aar-replay-heading">
                <span class="strip-subhead" style="color: var(--color-ice-highlight); margin:0; border-bottom: none;">SORTIE REPLAY</span>
                <span id="aar-replay-status" class="aar-replay-status">RECORDED BATTLE PLAYBACK</span>
              </div>
              <canvas id="aar-replay-canvas" class="aar-replay-canvas" aria-label="Tactical replay of the completed sortie"></canvas>
              <div class="aar-replay-controls">
                <button type="button" id="btn-aar-replay-play" class="hud-btn small aar-replay-play">PLAY</button>
                <button type="button" id="btn-aar-replay-restart" class="hud-btn small aar-replay-restart">RESTART</button>
                <button type="button" id="btn-aar-replay-speed" class="hud-btn small aar-replay-speed">1x SPEED</button>
                <input type="range" id="aar-replay-slider" class="aar-replay-slider" min="0" max="1" step="0.1" value="0" aria-label="Replay position">
                <span id="aar-replay-clock" class="aar-replay-clock">00:00 / 00:00</span>
              </div>
              <div id="aar-replay-events" class="aar-replay-events" aria-label="Replay event jump points"></div>
            </div>

            <div class="aar-full-roster-box">
              <div class="aar-roster-toggle-row">
                <span class="strip-subhead" style="color: var(--color-ice-highlight); margin:0; border-bottom: none;">PARTICIPATING AIRCRAFT &bull; STATUS REPORT</span>
                <button type="button" id="btn-toggle-aar-roster" class="hud-btn small">COLLAPSE</button>
              </div>
              <div id="aar-full-roster-content" class="aar-roster-content" style="max-height: 180px; overflow-y: auto;"></div>
            </div>

            <div class="aar-timeline-container">
              <div class="aar-timeline-toggle-row">
                <span class="strip-subhead" style="margin:0;">ENGAGEMENT TIMELINE</span>
                <button id="btn-toggle-aar-timeline" class="hud-btn small">EXPAND TIMELINE</button>
              </div>
              <div id="aar-timeline-list" class="aar-timeline-content hidden"></div>
            </div>
          </div>

          <div class="after-action-footer">
            <button id="btn-restart" class="scramble-btn" style="width:100%;">RETURN TO HANGAR</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }
}

window.ModalDebriefTemplate = ModalDebriefTemplate;