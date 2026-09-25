/* AIRSPACE STANDOFF: Modal Templates - Presets, Leaderboard, Manual & Settings */

class ModalPanelsTemplates {
  static install() {
    const container = document.createElement('div');
    container.id = 'modal-panels-container';
    container.innerHTML = `
      <!-- PRECONFIGURED AIRCRAFT MODAL -->
      <div id="preconfig-aircraft-modal" class="modal-backdrop">
        <div class="inspect-window preconfig-window">
          <div class="inspect-header">
            <div class="modal-title-row">
              <h2>AIRCRAFT LOADOUT PRESETS</h2>
              <span class="subtext" style="color: var(--color-frost-glow); font-family: var(--font-dotdigital); font-size: 0.64rem; margin-left: 8px;">STANDARD &amp; CUSTOM CONFIGURATIONS</span>
            </div>
            <button id="btn-close-preconfig" class="hud-btn small">
              <img src="icons/close.svg" width="10" height="10" alt="Close">
            </button>
          </div>
          <div class="preconfig-toolbar">
            <div class="preconfig-search-row">
              <input type="text" id="preconfig-search-input" class="hud-search-input" placeholder="Filter by preset name, aircraft, weapons, or role...">
              <div id="cdd-preconfig-airframe"></div>
              <div id="cdd-preconfig-sort"></div>
              <button type="button" class="hud-btn small highlight" id="btn-save-current-to-templates">+ SAVE CURRENT AIRCRAFT</button>
            </div>
            <div class="preconfig-pills-row" id="preconfig-category-pills">
              <button type="button" class="cat-pill-btn active" data-pcat="ALL">ALL</button>
              <button type="button" class="cat-pill-btn" data-pcat="AIR DOMINANCE">AIR SUPERIORITY</button>
              <button type="button" class="cat-pill-btn" data-pcat="DOGFIGHT">WVR COMBAT</button>
              <button type="button" class="cat-pill-btn" data-pcat="STRIKE">STRIKE &amp; CAS</button>
              <button type="button" class="cat-pill-btn" data-pcat="SEAD & EW">SEAD &amp; EW</button>
              <button type="button" class="cat-pill-btn" data-pcat="SWARM & DRONES">UNMANNED (UAV)</button>
              <button type="button" class="cat-pill-btn" data-pcat="COFFIN & FLAGSHIPS">ADVANCED / EXPERIMENTAL</button>
              <button type="button" class="cat-pill-btn" data-pcat="CUSTOM">USER PRESETS</button>
            </div>
          </div>
          <div class="preconfig-modal-body">
            <div id="preconfig-cards-grid" class="preconfig-grid"></div>
          </div>
        </div>
      </div>

      <!-- SQUADRON LEADERBOARD MODAL -->
      <div id="leaderboard-modal" class="modal-backdrop">
        <div class="inspect-window leaderboard-window">
          <div class="inspect-header">
            <div class="modal-title-row">
              <img src="icons/leaderboard.svg" class="modal-title-ico" width="16" height="16" alt="Leaderboard">
              <h2>SQUADRON LEADERBOARD</h2>
              <span class="subtext" style="color: var(--color-frost-glow); font-family: var(--font-dotdigital); font-size: 0.64rem; margin-left: 8px;">TOP 10 HISTORICAL SORTIES</span>
            </div>
            <button id="btn-close-leaderboard" class="hud-btn small">CLOSE</button>
          </div>
          <div class="leaderboard-body">
            <div class="leaderboard-table-pane">
              <div id="leaderboard-list-table"></div>
            </div>
            <div class="leaderboard-detail-pane" id="leaderboard-detail-view"></div>
          </div>
        </div>
      </div>

      <!-- FLIGHT MANUAL & GLOSSARY MODAL -->
      <div id="glossary-modal" class="modal-backdrop">
        <div class="glossary-window">
          <div class="glossary-header">
            <div class="modal-title-row">
              <img src="icons/manual.svg" class="modal-title-ico" width="16" height="16" alt="Manual">
              <h2>FLIGHT MANUAL &amp; OPERATIONAL REFERENCE</h2>
            </div>
            <button id="btn-close-glossary" class="hud-btn small">CLOSE</button>
          </div>
          <div class="manual-toolbar">
            <div class="manual-search-row">
              <input type="text" id="manual-search-filter" class="manual-search-input" placeholder="Search manual (e.g. Mission Editor, Inspection, Replay, Notch, RCS)...">
              <div id="manual-search-actions" class="manual-search-actions">
                <span id="manual-search-count" class="manual-search-count"></span>
                <button type="button" id="btn-manual-search-prev" class="manual-search-nav-btn" title="Previous Match">&lt;</button>
                <button type="button" id="btn-manual-search-next" class="manual-search-nav-btn" title="Next Match">&gt;</button>
                <button type="button" id="btn-manual-search-clear" class="manual-search-clear-btn" title="Clear Search">&times;</button>
              </div>
            </div>
            <div class="manual-nav-wrapper">
              <button type="button" id="btn-manual-nav-prev" class="manual-nav-scroll-btn" title="Scroll left">
                <img src="icons/arrowleft.svg" width="9" height="9" alt="&lt;">
              </button>
              <div class="manual-nav-bar" id="manual-quick-nav-bar"></div>
              <button type="button" id="btn-manual-nav-next" class="manual-nav-scroll-btn" title="Scroll right">
                <img src="icons/arrowright.svg" width="9" height="9" alt="&gt;">
              </button>
            </div>
          </div>
          <div class="glossary-content" id="glossary-modal-content"></div>
        </div>
      </div>

      <!-- SETTINGS MODAL -->
      <div id="settings-modal" class="modal-backdrop">
        <div class="settings-window">
          <div class="settings-header">
            <div class="modal-title-row">
              <img src="icons/settings.svg" class="modal-title-ico" width="16" height="16" alt="Settings">
              <h2>SETTINGS &amp; CONTROLS</h2>
            </div>
            <button id="btn-close-settings" class="hud-btn small">CLOSE</button>
          </div>
          <div class="settings-nav-tabs">
            <button class="settings-tab-btn active" data-stab="keybinds">CONTROLS</button>
            <button class="settings-tab-btn" data-stab="audio">AUDIO</button>
            <button class="settings-tab-btn" data-stab="radar">DISPLAY &amp; RADAR</button>
          </div>
          <div class="settings-body" id="settings-tab-content"></div>
          <div class="settings-footer">
            <button id="btn-reset-keybinds" class="hud-btn small alert">RESET</button>
            <button id="btn-save-settings" class="hud-btn">APPLY &amp; CLOSE</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }
}

window.ModalPanelsTemplates = ModalPanelsTemplates;