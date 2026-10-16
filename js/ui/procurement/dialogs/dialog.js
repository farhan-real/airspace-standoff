/**
 * AIRSPACE STANDOFF: Dialog Modal Controller
 * Standardized operational dialogs and confirmations.
 */

class DialogModal {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this._dialogCallback = null;
    this._modalBound = false;
  }

  ensureModal() {
    let modal = document.getElementById('dialog-modal') || document.getElementById('tactical-dialog-modal');
    if (modal) {
      this.bindModalEvents();
      return modal;
    }
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
      window.ModalDialogTemplates.ensure('dialog-modal');
    }
    this.bindModalEvents();
    return document.getElementById('dialog-modal') || document.getElementById('tactical-dialog-modal');
  }

  bindModalEvents() {
    const dialogConfirmBtn = document.getElementById('btn-dialog-confirm') || document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-dialog-cancel') || document.getElementById('btn-tactical-dialog-cancel');
    const dialogCloseBtn = document.getElementById('btn-dialog-close') || document.getElementById('btn-tactical-dialog-close');
    const dialogInput = document.getElementById('dialog-input') || document.getElementById('tactical-dialog-input');

    if (!dialogConfirmBtn) return;
    if (this._modalBound) return;
    this._modalBound = true;

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
    const dialogModal = document.getElementById('dialog-modal') || document.getElementById('tactical-dialog-modal');
    if (dialogModal) dialogModal.classList.remove('active');
    this._dialogCallback = null;
    if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
  }

  showPrompt(title, msg, defValue, onConfirm) {
    const dialogModal = this.ensureModal();
    const dialogTitle = document.getElementById('dialog-title') || document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('dialog-msg') || document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('dialog-field-wrap') || document.getElementById('tactical-dialog-field-wrap');
    const dialogInput = document.getElementById('dialog-input') || document.getElementById('tactical-dialog-input');
    const dialogOptionsWrap = document.getElementById('dialog-options-wrap') || document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-dialog-confirm') || document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-dialog-cancel') || document.getElementById('btn-tactical-dialog-cancel');

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
      dialogConfirmBtn.className = 'hud-btn dialog-btn highlight';
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
    const dialogModal = this.ensureModal();
    const dialogTitle = document.getElementById('dialog-title') || document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('dialog-msg') || document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('dialog-field-wrap') || document.getElementById('tactical-dialog-field-wrap');
    const dialogOptionsWrap = document.getElementById('dialog-options-wrap') || document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-dialog-confirm') || document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-dialog-cancel') || document.getElementById('btn-tactical-dialog-cancel');

    if (!dialogModal) {
      if (onConfirm) onConfirm();
      return;
    }

    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    if (dialogTitle) dialogTitle.textContent = title || 'CONFIRMATION';
    if (dialogMsg) dialogMsg.textContent = msg || '';
    if (dialogInputWrap) dialogInputWrap.style.display = 'none';
    if (dialogOptionsWrap) dialogOptionsWrap.style.display = 'none';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'inline-flex';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = options.confirmText || 'CONFIRM';
      dialogConfirmBtn.className = 'hud-btn dialog-btn ' + (options.isAlert ? 'alert' : 'highlight');
      dialogConfirmBtn.style.display = 'inline-flex';
    }
    this._dialogCallback = () => { if (onConfirm) onConfirm(); };
    dialogModal.classList.add('active');
  }

  showAlert(title, msg) {
    const dialogModal = this.ensureModal();
    const dialogTitle = document.getElementById('dialog-title') || document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('dialog-msg') || document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('dialog-field-wrap') || document.getElementById('tactical-dialog-field-wrap');
    const dialogOptionsWrap = document.getElementById('dialog-options-wrap') || document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-dialog-confirm') || document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-dialog-cancel') || document.getElementById('btn-tactical-dialog-cancel');

    if (!dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    if (dialogTitle) dialogTitle.textContent = title || 'NOTICE';
    if (dialogMsg) dialogMsg.textContent = msg || '';
    if (dialogInputWrap) dialogInputWrap.style.display = 'none';
    if (dialogOptionsWrap) dialogOptionsWrap.style.display = 'none';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'none';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = 'OK';
      dialogConfirmBtn.className = 'hud-btn dialog-btn highlight';
      dialogConfirmBtn.style.display = 'inline-flex';
    }
    this._dialogCallback = null;
    dialogModal.classList.add('active');
  }

  openCallsignPicker(sIdx) {
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return;
    const dialogModal = this.ensureModal();
    const dialogTitle = document.getElementById('dialog-title') || document.getElementById('tactical-dialog-title');
    const dialogMsg = document.getElementById('dialog-msg') || document.getElementById('tactical-dialog-msg');
    const dialogInputWrap = document.getElementById('dialog-field-wrap') || document.getElementById('tactical-dialog-field-wrap');
    const dialogInput = document.getElementById('dialog-input') || document.getElementById('tactical-dialog-input');
    const dialogOptionsWrap = document.getElementById('dialog-options-wrap') || document.getElementById('tactical-dialog-options-wrap');
    const dialogConfirmBtn = document.getElementById('btn-dialog-confirm') || document.getElementById('btn-tactical-dialog-confirm');
    const dialogCancelBtn = document.getElementById('btn-dialog-cancel') || document.getElementById('btn-tactical-dialog-cancel');

    if (dialogTitle) dialogTitle.textContent = 'ASSIGN CALLSIGN';
    if (dialogMsg) dialogMsg.textContent = `Select an operational callsign for Aircraft #${sIdx + 1} or enter a custom identifier:`;
    if (dialogInputWrap) dialogInputWrap.style.display = 'block';
    if (dialogInput) dialogInput.value = item.callsign || '';
    if (dialogCancelBtn) dialogCancelBtn.style.display = 'inline-flex';
    if (dialogConfirmBtn) {
      dialogConfirmBtn.textContent = 'ASSIGN';
      dialogConfirmBtn.className = 'hud-btn dialog-btn highlight';
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

window.DialogModal = DialogModal;