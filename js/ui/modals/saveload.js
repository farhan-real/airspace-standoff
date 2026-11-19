/**
 * js/ui/modals/saveload.js - Hangar Saved Sorties Modal Controller.
 */

class SaveLoadModal {
  static ensureModal() {
    if (document.getElementById('save-load-modal')) return;
    const html = `
      <div id="save-load-modal" class="modal-backdrop">
        <div class="saveload-window">
          <div class="inspect-header">
            <div class="modal-title-row">
              <h2>SAVED SORTIES</h2>
              <span class="subtext" style="color:var(--color-frost-glow);font-family:var(--font-dotdigital);font-size:0.62rem;">RESUME MID-MISSION PROGRESS</span>
            </div>
            <button type="button" id="btn-close-saveload" class="hud-btn small"><img src="icons/close.svg" width="10" height="10" alt="Close"></button>
          </div>
          <div id="saveload-list" class="saveload-body"></div>
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
    const listEl = document.getElementById('saveload-list');
    if (!listEl || typeof SaveGameManager === 'undefined') return;

    const saves = SaveGameManager.getSaves();
    if (saves.length === 0) {
      listEl.innerHTML = `
        <div class="saveload-empty">
          <b>NO SAVED SORTIES FOUND</b>
          <span>Use SAVE or SAVE &amp; QUIT during a mission to store mid-sortie progress.</span>
        </div>`;
      return;
    }

    listEl.innerHTML = '';
    saves.forEach(raw => {
      const sum = SaveGameManager.getSummary(raw);
      const card = document.createElement('div');
      card.className = 'save-slot-card';
      card.innerHTML = `
        <div class="save-slot-top">
          <div>
            <div class="save-slot-title">${sum.squadronName}</div>
            <div class="save-slot-date">SAVED: ${sum.savedAtDisplay}</div>
          </div>
          <div class="save-slot-badges">
            <span class="save-slot-badge mode">${sum.modeLabel}</span>
            <span class="save-slot-badge">${sum.diffLabel.toUpperCase()}</span>
            ${sum.unranked ? '<span class="save-slot-badge unranked">EDITOR UNRANKED</span>' : ''}
          </div>
        </div>
        <div class="save-slot-metrics">
          <div class="save-slot-metric"><span>CLOCK</span><b style="color:var(--theme-accent);">${sum.elapsedClock}</b></div>
          <div class="save-slot-metric"><span>SCORE</span><b>${sum.vpAlly} : ${sum.vpHostile}</b></div>
          <div class="save-slot-metric"><span>BLUE AIR</span><b style="color:#38bdf8;">${sum.blueAlive} / ${sum.blueTotal}</b></div>
          <div class="save-slot-metric"><span>RED AIR</span><b style="color:#f43f5e;">${sum.redAlive} / ${sum.redTotal}</b></div>
        </div>
        <div class="save-slot-actions">
          <button type="button" class="hud-btn small alert btn-slot-delete">DELETE</button>
          <button type="button" class="hud-btn small highlight btn-slot-load">LOAD SORTIE</button>
        </div>`;

      card.querySelector('.btn-slot-load').onclick = () => {
        this.close();
        game.loadSavedSortie(sum.id);
      };

      card.querySelector('.btn-slot-delete').onclick = () => {
        const doDelete = () => {
          SaveGameManager.deleteSave(sum.id);
          SaveGameManager.updateHangarIntelSummary();
          this.render(game);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        };
        if (game && game.procurement && typeof game.procurement.showConfirmModal === 'function') {
          game.procurement.showConfirmModal('DELETE SAVE', `Delete saved sortie for "${sum.squadronName}" (${sum.elapsedClock})?`, doDelete, { confirmText: 'DELETE', isAlert: true });
        } else {
          doDelete();
        }
      };

      listEl.appendChild(card);
    });
  }
}

window.SaveLoadModal = SaveLoadModal;
