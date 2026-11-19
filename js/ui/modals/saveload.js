/**
 * js/ui/modals/saveload.js - Single Saved Game Preview, Positions & Resume Controller.
 */

class SaveLoadModal {
  static ensureModal() {
    if (document.getElementById('save-load-modal')) return;
    const html = `
      <div id="save-load-modal" class="modal-backdrop">
        <div class="saveload-window">
          <div class="inspect-header">
            <div class="modal-title-row">
              <h2>SAVED GAME</h2>
              <span class="subtext" style="color:var(--color-frost-glow);font-family:var(--font-dotdigital);font-size:0.62rem;">SINGLE SAVE OVERVIEW</span>
            </div>
            <button type="button" id="btn-close-saveload" class="hud-btn small"><img src="icons/close.svg" width="10" height="10" alt="Close"></button>
          </div>
          <div id="saveload-list" class="saveload-body"></div>
          <div id="saveload-footer" class="saveload-footer"></div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const modal = document.getElementById('save-load-modal');
    const closeBtn = document.getElementById('btn-close-saveload');
    if (closeBtn) closeBtn.onclick = () => this.close();
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    }
  }

  static open(game) {
    this.ensureModal();
    this.render(game);
    const modal = document.getElementById('save-load-modal');
    if (modal) modal.classList.add('active');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static close() {
    const modal = document.getElementById('save-load-modal');
    if (modal) modal.classList.remove('active');
  }

  static render(game) {
    const bodyEl = document.getElementById('saveload-list');
    const footerEl = document.getElementById('saveload-footer');
    if (!bodyEl || !footerEl || typeof SaveGameManager === 'undefined') return;

    const save = SaveGameManager.getSave();
    if (!save || save.isCompleted) {
      bodyEl.innerHTML = `
        <div class="saveload-empty">
          <b>NO ACTIVE SAVED GAME</b>
          <span>${save && save.isCompleted ? 'Your previous game has been completed. Start a New Game to play.' : 'Use SAVE or SAVE &amp; QUIT during a sortie to store progress.'}</span>
        </div>`;
      footerEl.innerHTML = `
        <div class="saveload-footer-right">
          <button type="button" id="btn-saveload-cancel" class="hud-btn small">CLOSE</button>
        </div>`;
      const cancelBtn = document.getElementById('btn-saveload-cancel');
      if (cancelBtn) cancelBtn.onclick = () => this.close();
      return;
    }

    const sum = SaveGameManager.getSummary(save);
    const blueHtml = SaveMapRenderer.renderUnitList(save.alliedAircraft, true);
    const redHtml = SaveMapRenderer.renderUnitList(save.hostileAircraft, false);

    let objectiveBadge = '';
    if (save.scenarioMode === 'ATTACK') {
      const objs = (save.surfaceUnits || []).filter(s => s && s.team === 'hostile' && s.isPrimaryObjective);
      const aliveObjs = objs.filter(s => (s.isAirbaseObjectiveAnchor ? !s.isAirbaseNeutralized : s.hp > 0.05));
      objectiveBadge = `<span class="save-slot-badge" style="color:#ffd700;border-color:rgba(255,215,0,0.45);">OBJECTIVES: ${aliveObjs.length}/${objs.length}</span>`;
    }

    bodyEl.innerHTML = `
      <div class="save-slot-card">
        <div class="save-slot-top">
          <div>
            <div class="save-slot-title">${sum.squadronName}</div>
            <div class="save-slot-date">SAVED: ${sum.savedAtDisplay}</div>
          </div>
          <div class="save-slot-badges">
            <span class="save-slot-badge mode">${sum.modeLabel}</span>
            <span class="save-slot-badge">${sum.diffLabel.toUpperCase()}</span>
            <span class="save-slot-badge">${sum.doctrineLabel.toUpperCase()}</span>
            ${objectiveBadge}
            ${sum.unranked ? '<span class="save-slot-badge unranked">EDITOR UNRANKED</span>' : ''}
          </div>
        </div>
        <div class="save-slot-metrics">
          <div class="save-slot-metric"><span>TIME PLAYED</span><b style="color:var(--theme-accent);">${sum.elapsedClock}</b></div>
          <div class="save-slot-metric"><span>SCORE (BLUE : RED)</span><b>${sum.vpAlly} : ${sum.vpHostile}</b></div>
          <div class="save-slot-metric"><span>BLUE ALIVE</span><b style="color:#38bdf8;">${sum.blueAlive} / ${sum.blueTotal}</b></div>
          <div class="save-slot-metric"><span>RED ALIVE</span><b style="color:#f43f5e;">${sum.redAlive} / ${sum.redTotal}</b></div>
        </div>
      </div>

      <div class="saveload-map-card">
        <div class="saveload-section-head">
          <b>TACTICAL RADAR POSITIONS</b>
          <span>BLUE: CYAN &bull; RED: CRIMSON &bull; X: DESTROYED</span>
        </div>
        <canvas id="saveload-map-canvas" class="saveload-map-canvas"></canvas>
      </div>

      <div class="saveload-rosters-grid">
        <div class="saveload-roster-card">
          <div class="saveload-section-head">
            <b style="color:#38bdf8;">BLUE FORCE (${sum.blueAlive}/${sum.blueTotal} ALIVE)</b>
            <span>POSITIONS</span>
          </div>
          <div class="saveload-roster-list">${blueHtml}</div>
        </div>
        <div class="saveload-roster-card">
          <div class="saveload-section-head">
            <b style="color:#f43f5e;">RED FORCE (${sum.redAlive}/${sum.redTotal} ALIVE)</b>
            <span>POSITIONS</span>
          </div>
          <div class="saveload-roster-list">${redHtml}</div>
        </div>
      </div>`;

    footerEl.innerHTML = `
      <button type="button" id="btn-delete-saved-game" class="hud-btn alert">DELETE SAVE</button>
      <div class="saveload-footer-right">
        <button type="button" id="btn-saveload-cancel" class="hud-btn">CANCEL</button>
        <button type="button" id="btn-resume-saved-game" class="hud-btn highlight">LOAD PREVIOUS GAME</button>
      </div>`;

    requestAnimationFrame(() => {
      const canvas = document.getElementById('saveload-map-canvas');
      if (canvas) SaveMapRenderer.draw(canvas, save);
    });

    document.getElementById('btn-saveload-cancel').onclick = () => this.close();
    document.getElementById('btn-resume-saved-game').onclick = () => {
      this.close();
      game.loadSavedSortie();
    };
    document.getElementById('btn-delete-saved-game').onclick = () => {
      const doDelete = () => {
        SaveGameManager.deleteSave();
        this.close();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
      if (game && game.procurement && typeof game.procurement.showConfirmModal === 'function') {
        game.procurement.showConfirmModal('DELETE SAVED GAME', `Delete saved game for "${sum.squadronName}" (${sum.elapsedClock})?`, doDelete, { confirmText: 'DELETE', isAlert: true });
      } else {
        doDelete();
      }
    };
  }
}

window.SaveLoadModal = SaveLoadModal;
