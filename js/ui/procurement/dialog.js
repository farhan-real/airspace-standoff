/**
 * APEX VECTOR // Tactical Dialog Modal Submodule
 * Manages prompts, confirmations, alerts, callsign picker, and mobile bay equipping popups
 */

class TacticalDialogModal {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.dialogModal = document.getElementById('tactical-dialog-modal');
    this.dialogTitle = document.getElementById('tactical-dialog-title');
    this.dialogMsg = document.getElementById('tactical-dialog-msg');
    this.dialogInputWrap = document.getElementById('tactical-dialog-field-wrap');
    this.dialogInput = document.getElementById('tactical-dialog-input');
    this.dialogOptionsWrap = document.getElementById('tactical-dialog-options-wrap');
    this.dialogConfirmBtn = document.getElementById('btn-tactical-dialog-confirm');
    this.dialogCancelBtn = document.getElementById('btn-tactical-dialog-cancel');
    this.dialogCloseBtn = document.getElementById('btn-tactical-dialog-close');
    this._dialogCallback = null;

    if (this.dialogCloseBtn) this.dialogCloseBtn.onclick = () => this.close();
    if (this.dialogCancelBtn) this.dialogCancelBtn.onclick = () => this.close();
    if (this.dialogConfirmBtn) {
      this.dialogConfirmBtn.onclick = () => {
        if (this._dialogCallback) {
          const val = this.dialogInput ? this.dialogInput.value : '';
          this._dialogCallback(val);
        }
        this.close();
      };
    }
    if (this.dialogInput) {
      this.dialogInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); this.dialogConfirmBtn.click(); }
        else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
      });
    }
  }

  close() {
    if (this.dialogModal) this.dialogModal.classList.remove('active');
    this._dialogCallback = null;
    if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
  }

  showPrompt(title, msg, defValue, onConfirm) {
    if (!this.dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    this.dialogTitle.textContent = title || 'TACTICAL PROMPT';
    this.dialogMsg.textContent = msg || '';
    this.dialogInputWrap.style.display = 'block';
    if (this.dialogOptionsWrap) this.dialogOptionsWrap.style.display = 'none';
    this.dialogInput.value = defValue || '';
    this.dialogCancelBtn.style.display = 'inline-block';
    this.dialogConfirmBtn.textContent = 'CONFIRM';
    this.dialogConfirmBtn.style.display = 'inline-block';
    this._dialogCallback = onConfirm;

    this.dialogModal.classList.add('active');
    setTimeout(() => {
      this.dialogInput.focus();
      this.dialogInput.select();
    }, 50);
  }

  showConfirm(title, msg, onConfirm) {
    if (!this.dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    this.dialogTitle.textContent = title || 'CONFIRM ACTION';
    this.dialogMsg.textContent = msg || '';
    this.dialogInputWrap.style.display = 'none';
    if (this.dialogOptionsWrap) this.dialogOptionsWrap.style.display = 'none';
    this.dialogCancelBtn.style.display = 'inline-block';
    this.dialogConfirmBtn.textContent = 'PROCEED';
    this.dialogConfirmBtn.style.display = 'inline-block';
    this._dialogCallback = () => { if (onConfirm) onConfirm(); };
    this.dialogModal.classList.add('active');
  }

  showAlert(title, msg) {
    if (!this.dialogModal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    this.dialogTitle.textContent = title || 'NOTICE';
    this.dialogMsg.textContent = msg || '';
    this.dialogInputWrap.style.display = 'none';
    if (this.dialogOptionsWrap) this.dialogOptionsWrap.style.display = 'none';
    this.dialogCancelBtn.style.display = 'none';
    this.dialogConfirmBtn.textContent = 'DISMISS';
    this.dialogConfirmBtn.style.display = 'inline-block';
    this._dialogCallback = null;
    this.dialogModal.classList.add('active');
  }

  openCallsignPicker(sIdx) {
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return;

    this.dialogTitle.textContent = 'ASSIGN CALLSIGN';
    this.dialogMsg.textContent = `Select an authentic aviation callsign for Bay #${sIdx + 1} or enter a custom designation:`;
    this.dialogInputWrap.style.display = 'block';
    this.dialogInput.value = item.callsign || '';
    this.dialogCancelBtn.style.display = 'inline-block';
    this.dialogConfirmBtn.textContent = 'ASSIGN';
    this.dialogConfirmBtn.style.display = 'inline-block';

    if (this.dialogOptionsWrap) {
      this.dialogOptionsWrap.style.display = 'flex';
      this.dialogOptionsWrap.innerHTML = '';
      const pool = window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Reaper', 'Bandit'];
      pool.slice(0, 14).forEach(cs => {
        const chip = document.createElement('button');
        chip.className = 'hud-btn small';
        chip.style.textAlign = 'left';
        chip.textContent = cs;
        chip.onclick = () => { this.dialogInput.value = cs; };
        this.dialogOptionsWrap.appendChild(chip);
      });
    }

    this._dialogCallback = (chosen) => {
      if (chosen && chosen.trim()) {
        item.callsign = chosen.trim();
        this.pm.updateUI();
      }
    };
    this.dialogModal.classList.add('active');
  }

  openEquipToBayModal(itemData) {
    if (this.pm.game.procurementSquadron.length === 0) {
      this.showAlert('EMPTY SQUADRON', 'Add at least one airframe to your active squadron first!');
      return;
    }
    const acMap = window.AIRCRAFT_CATALOG || {};
    this.dialogTitle.textContent = `EQUIP ${itemData.name.toUpperCase()}`;
    this.dialogMsg.textContent = 'Select which active aircraft bay to equip:';
    this.dialogInputWrap.style.display = 'none';

    if (this.dialogOptionsWrap) {
      this.dialogOptionsWrap.style.display = 'flex';
      this.dialogOptionsWrap.innerHTML = '';

      this.pm.game.procurementSquadron.forEach((item, sIdx) => {
        const spec = acMap[item.specId] || {};
        const row = document.createElement('button');
        row.className = 'hud-btn small';
        row.style.textAlign = 'left';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '8px 10px';

        row.innerHTML = `
          <span><b>Bay #${sIdx + 1}:</b> ${item.callsign || 'Pilot'} [${spec.name || item.specId}]</span>
          <span style="color:#00f0ff;font-weight:800;">+ EQUIP</span>
        `;

        row.onclick = () => {
          this.pm.equipItemDataToSquadron(sIdx, itemData);
          this.close();
          const btnRoster = document.getElementById('btn-tab-flight-roster');
          if (btnRoster && window.innerWidth <= 1024) btnRoster.click();
        };

        this.dialogOptionsWrap.appendChild(row);
      });
    }

    this.dialogCancelBtn.style.display = 'inline-block';
    this.dialogConfirmBtn.style.display = 'none';
    this.dialogModal.classList.add('active');
  }
}

window.TacticalDialogModal = TacticalDialogModal;
