/**
 * AIRSPACE STANDOFF: Tactical Dialog Modal Submodule
 * Standardized operational dialogs and clean confirmations.
 */

class TacticalDialogModal {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this._dialogCallback = null;
    this._modalBound = false;
  }

  ensureModal() {
    if (document.getElementById('tactical-dialog-modal')) return;
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
      window.ModalDialogTemplates.ensure('tactical-dialog-modal');
    }
    this.bindModalEvents();
  }

  bindModalEvents() {
    if (this._modalBound) return;
    this._modalBound = true;
    const dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');
    const dialogCloseBtn = document.getElementById('btn-tactical-dialog-close');
    const dialogInput = document.getElementById('tactical-dialog-input');

    if (dialogCloseBtn) dialogCloseBtn.onclick = () => this.close();
    if (dialogCancelBtn) dialogCancelBtn.onclick = () => this.close();
    if (dialogConfirmBtn) {
      dialogConfirmBtn.onclick = () => {
        if (this._dialogCallback) {
          const val = dialogInput ? dialogInput.value : '';
          this._dialogCallback(val);
        }
        this.close();
      };
    }
    if (dialogInput) {
      dialogInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); dialogConfirmBtn.click(); }
        else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
      });
    }
  }

  close() {
    const dialogModal = document.getElementById('tactical-dialog-modal');
    if (dialogModal) dialogModal.classList.remove('active');
    this._dialogCallback = null;
    if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
  }

  showPrompt(title, msg, defValue, onConfirm) {
    this.ensureModal();
    const dialogModal = document.getElementById('tactical-dialog-modal');
    const dialogTitle = document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('tactical-dialog-field-wrap');
    const dialogInput = document.getElementById('tactical-dialog-input');
    const dialogOptionsWrap = document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');

    if (!dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    if (dialogTitle) dialogTitle.textContent = title || 'INPUT REQUIRED';
    if (dialogMsg) dialogMsg.textContent = msg || '';
    if (dialogInputWrap) dialogInputWrap.style.display = 'block';
    if (dialogOptionsWrap) dialogOptionsWrap.style.display = 'none';
    if (dialogInput) dialogInput.value = defValue || '';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'inline-flex';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = 'CONFIRM';
      dialogConfirmBtn.className = 'hud-btn tactical-dialog-btn highlight';
      dialogConfirmBtn.style.display = 'inline-flex';
    }
    this._dialogCallback = onConfirm;

    dialogModal.classList.add('active');
    setTimeout(() => {
      if (dialogInput) {
        dialogInput.focus();
        dialogInput.select();
      }
    }, 50);
  }

  showConfirm(title, msg, onConfirm, options = {}) {
    this.ensureModal();
    const dialogModal = document.getElementById('tactical-dialog-modal');
    const dialogTitle = document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('tactical-dialog-field-wrap');
    const dialogOptionsWrap = document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');

    if (!dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    if (dialogTitle) dialogTitle.textContent = title || 'CONFIRMATION';
    if (dialogMsg) dialogMsg.textContent = msg || '';
    if (dialogInputWrap) dialogInputWrap.style.display = 'none';
    if (dialogOptionsWrap) dialogOptionsWrap.style.display = 'none';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'inline-flex';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = options.confirmText || 'CONFIRM';
      dialogConfirmBtn.className = 'hud-btn tactical-dialog-btn ' + (options.isAlert ? 'alert' : 'highlight');
      dialogConfirmBtn.style.display = 'inline-flex';
    }
    this._dialogCallback = () => { if (onConfirm) onConfirm(); };
    dialogModal.classList.add('active');
  }

  showAlert(title, msg) {
    this.ensureModal();
    const dialogModal = document.getElementById('tactical-dialog-modal');
    const dialogTitle = document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('tactical-dialog-field-wrap');
    const dialogOptionsWrap = document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');

    if (!dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    if (dialogTitle) dialogTitle.textContent = title || 'NOTICE';
    if (dialogMsg) dialogMsg.textContent = msg || '';
    if (dialogInputWrap) dialogInputWrap.style.display = 'none';
    if (dialogOptionsWrap) dialogOptionsWrap.style.display = 'none';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'none';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = 'OK';
      dialogConfirmBtn.className = 'hud-btn tactical-dialog-btn highlight';
      dialogConfirmBtn.style.display = 'inline-flex';
    }
    this._dialogCallback = null;
    dialogModal.classList.add('active');
  }

  openCallsignPicker(sIdx) {
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return;
    this.ensureModal();
    const dialogModal = document.getElementById('tactical-dialog-modal');
    const dialogTitle = document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('tactical-dialog-field-wrap');
    const dialogInput = document.getElementById('tactical-dialog-input');
    const dialogOptionsWrap = document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');

    if (dialogTitle) dialogTitle.textContent = 'ASSIGN CALLSIGN';
    if (dialogMsg) dialogMsg.textContent = `Select an operational callsign for Aircraft #${sIdx + 1} or enter a custom identifier:`;
    if (dialogInputWrap) dialogInputWrap.style.display = 'block';
    if (dialogInput) dialogInput.value = item.callsign || '';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'inline-flex';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = 'ASSIGN';
      dialogConfirmBtn.className = 'hud-btn tactical-dialog-btn highlight';
      dialogConfirmBtn.style.display = 'inline-flex';
    }

    if (dialogOptionsWrap) {
      dialogOptionsWrap.style.display = 'flex';
      dialogOptionsWrap.innerHTML = '';
      const pool = window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'];
      pool.slice(0, 14).forEach(cs => {
        const chip = document.createElement('button');
        chip.className = 'hud-btn small';
        chip.style.textAlign = 'left';
        chip.textContent = cs;
        chip.onclick = () => { if (dialogInput) dialogInput.value = cs; };
        dialogOptionsWrap.appendChild(chip);
      });
    }

    this._dialogCallback = (chosen) => {
      if (chosen && chosen.trim()) {
        item.callsign = chosen.trim();
        this.pm.updateUI();
      }
    };
    if (dialogModal) dialogModal.classList.add('active');
  }
}

window.TacticalDialogModal = TacticalDialogModal;