/* AIRSPACE STANDOFF: Modal Templates - Mission Editor */

class ModalEditorTemplate {
  static install() {
    const container = document.createElement('div');
    container.id = 'modal-editor-container';
    container.innerHTML = `
      <div id="mission-editor-modal" class="modal-backdrop">
        <div class="mission-editor-window">
          <div class="inspect-header mission-editor-header">
            <div class="modal-title-row">
              <img src="icons/edit.svg" class="modal-title-ico" width="18" height="18" alt="Mission Editor">
              <div>
                <h2>MISSION EDITOR</h2>
                <span class="mission-editor-kicker">CUSTOM SORTIE GENERATOR &bull; UNRANKED</span>
              </div>
            </div>
            <button type="button" id="btn-close-mission-editor" class="hud-btn small">CLOSE</button>
          </div>
          <div class="mission-editor-body">
            <div class="mission-editor-intro-card">
              <p>Configure operational parameters for your next sortie. Toggle <b>RANDOM</b> on any setting to generate it procedurally at launch.</p>
              <span class="mission-editor-unranked-badge">UNRANKED SORTIE</span>
            </div>

            <div class="mission-editor-inspection-setting">
              <div class="me-insp-info">
                <div class="me-insp-head">
                  <strong>INSPECTION SUITE</strong>
                  <span class="me-insp-desc">Live Telemetry &amp; Causal Analysis Workspace</span>
                </div>
                <div class="me-insp-pills">
                  <span class="me-insp-pill">RADAR SPECTRUM</span>
                  <span class="me-insp-pill">CAUSAL TRACE</span>
                  <span class="me-insp-pill">HIT PROBABILITY</span>
                  <span class="me-insp-pill">TIME STOP</span>
                </div>
              </div>
              <button type="button" id="me-inspection-mode" class="mission-editor-inspection-toggle" aria-pressed="false">OFF</button>
            </div>

            <div class="mission-editor-section">
              <h3><span>01</span> THEATER SCENARIO &amp; DIFFICULTY</h3>
              <div class="mission-editor-grid">
                <div class="mission-editor-field">
                  <label for="cdd-me-scenario">SCENARIO MODE <span class="me-field-badge">OBJECTIVE</span></label>
                  <div id="cdd-me-scenario" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="scenario" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field">
                  <label for="cdd-me-difficulty">DIFFICULTY <span class="me-field-badge">MULTIPLIER</span></label>
                  <div id="cdd-me-difficulty" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="difficulty" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field" style="grid-column: 1 / -1;">
                  <label for="cdd-me-doctrine">ENEMY COMBAT STYLE <span class="me-field-badge">AI DOCTRINE</span></label>
                  <div id="cdd-me-doctrine" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="doctrine" aria-pressed="false">RANDOM</button>
                </div>
              </div>
            </div>

            <div class="mission-editor-section">
              <h3><span>02</span> FORCE BALANCE &amp; PROCUREMENT</h3>
              <div class="mission-editor-grid">
                <div class="mission-editor-field">
                  <label for="cdd-me-blue-fleet">ALLIED FLEET (BLUE) <span class="me-field-badge">DOCTRINE</span></label>
                  <div id="cdd-me-blue-fleet" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="blue-fleet" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field">
                  <label for="cdd-me-blue-budget">ALLIED BUDGET (BLUE) <button type="button" class="me-custom-btn" data-custom-budget="blue" title="Enter custom budget value">CUSTOM</button></label>
                  <div id="cdd-me-blue-budget" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="blue-budget" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field">
                  <label for="cdd-me-red-fleet">ENEMY FLEET (RED) <span class="me-field-badge">DOCTRINE</span></label>
                  <div id="cdd-me-red-fleet" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="red-fleet" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field">
                  <label for="cdd-me-red-budget">ENEMY BUDGET (RED) <button type="button" class="me-custom-btn" data-custom-budget="red" title="Enter custom budget value">CUSTOM</button></label>
                  <div id="cdd-me-red-budget" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="red-budget" aria-pressed="false">RANDOM</button>
                </div>
              </div>
            </div>

            <div class="mission-editor-section">
              <h3><span>03</span> THEATER ENVIRONMENT &amp; DEFENSES</h3>
              <div class="mission-editor-grid">
                <div class="mission-editor-field">
                  <label for="cdd-me-clouds">WEATHER &amp; CLOUDS <span class="me-field-badge">RADAR ATTENUATION</span></label>
                  <div id="cdd-me-clouds" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="clouds" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field">
                  <label for="cdd-me-defenses">GROUND AIR DEFENSES <span class="me-field-badge">IADS GRID</span></label>
                  <div id="cdd-me-defenses" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="defenses" aria-pressed="false">RANDOM</button>
                </div>
                <div class="mission-editor-field" style="grid-column: 1 / -1;">
                  <label for="cdd-me-civilians">CIVILIAN TRANSIT FLIGHTS <span class="me-field-badge">RULES OF ENGAGEMENT</span></label>
                  <div id="cdd-me-civilians" class="me-dropdown-container"></div>
                  <button type="button" class="mission-editor-random-toggle" data-random-for="civilians" aria-pressed="false">RANDOM</button>
                </div>
              </div>
            </div>

            <div class="mission-editor-preview-card">
              <div class="me-preview-head">
                <span>SORTIE CONFIGURATION DOSSIER</span>
                <span id="me-preview-status" class="me-preview-status unarmed">NOT ARMED</span>
              </div>
              <div id="mission-editor-preview" class="me-preview-chips">Standard mission setup is unchanged until you apply an editor configuration.</div>
            </div>
          </div>
          <div class="mission-editor-footer">
            <button type="button" id="btn-reset-mission-editor" class="hud-btn small alert">RESET DEFAULTS</button>
            <button type="button" id="btn-apply-mission-editor" class="hud-btn highlight">
              <img src="icons/edit.svg" class="btn-vector-ico" width="13" height="13" alt="Arm">
              <span>ARM SORTIE CONFIGURATION</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }
}

window.ModalEditorTemplate = ModalEditorTemplate;