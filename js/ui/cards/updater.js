/**
 * js/ui/cards/updater.js - Real-time pylon status, Pk bar, and sensor pod indicator updater.
 */

class PylonCardUpdater {
  static updatePylons(pylonBay, targetContainer, activeUnit, validTarget, isMobile) {
    const curGame = pylonBay.currentGame;
    const clouds = (curGame && curGame.simulation && curGame.simulation.weatherClouds) || [];
    const cards = targetContainer.querySelectorAll('.pylon-item-card, .mob-compact-pylon');
    const tokenCost = window.CONFIG.TOKEN_ACTION_COST;
    const curTokens = curGame ? curGame.getCurrentCommanderTokenBucket() : 8.0;

    cards.forEach(cardEl => {
      const idx = parseInt(cardEl.dataset.pylonIdx || cardEl.getAttribute('data-pylon-idx'), 10);
      if (isNaN(idx)) return;
      const item = activeUnit.equippedWeapons[idx];
      if (!item || !item.weapon) return;
      const w = item.weapon;

      const ammoTag = cardEl.querySelector('.pylon-ammo-counter');
      if (ammoTag) {
        const expectedAmmo = (w.isJammerPod || w.isTargetingPod) ? 'ACTIVE' : (isMobile ? `${item.ammo}/${item.maxAmmo}` : `${item.ammo} / ${item.maxAmmo}`);
        if (ammoTag.textContent !== expectedAmmo) ammoTag.textContent = expectedAmmo;
      }

      const pkTag = cardEl.querySelector('.pk-value-tag');
      const pkFill = cardEl.querySelector('.pk-progress-fill');
      const fireBtn = cardEl.querySelector('.btn-fire-pylon');

      const pkResult = Physics.calcPk(w, activeUnit, validTarget, clouds);
      const currentPk = (typeof pkResult.pk === 'number' && !isNaN(pkResult.pk)) ? pkResult.pk : 0;

      if (pkTag) {
        let expectedTag = '';
        let expectedColor = '#7dd3fc';

        if (w.isJammerPod) {
          expectedTag = isMobile ? '[ECM]' : 'ACTIVE: [ECM]';
          expectedColor = '#00f0ff';
        } else if (w.isTargetingPod) {
          if (w.grantsESM) {
            expectedTag = isMobile ? '[ESM]' : 'ACTIVE: [ESM / ELINT]';
            expectedColor = '#fbbf24';
          } else if (w.grantsIRST && w.a2gPkBonus <= 0) {
            expectedTag = isMobile ? '[IRST]' : 'ACTIVE: [PASSIVE IRST]';
            expectedColor = '#00f0ff';
          } else {
            expectedTag = isMobile ? '[TGP]' : `ACTIVE: [TGP +${Math.round(w.a2gPkBonus * 100)}%]`;
            expectedColor = '#00f5a0';
          }
        } else if (w.isDecoy || w.isDecoyDrone) {
          expectedTag = isMobile ? '[DECOY]' : 'DEFENSE: [DECOY]';
          expectedColor = '#c084fc';
        } else if (w.isGunpod || w.category === 'GUN') {
          expectedTag = isMobile ? '[GUNPOD]' : 'BATTERY: [GUNPOD]';
          expectedColor = '#fde047';
        } else if (w.isLaser) {
          expectedTag = isMobile ? '[DEW]' : 'DIRECT: [DEW]';
          expectedColor = '#00f0ff';
        } else {
          const seeker = w.seeker;
          const mixedTag = pkResult.hasMixedSeekers ? ' [MIXED +25%]' : '';
          expectedTag = isMobile ? `[${seeker}]${mixedTag}` : `HOMING: [${seeker}]${mixedTag}`;
          const seekerColors = {
            'ARH': '#00f0ff', 'IIR': '#00f5a0', 'EO': '#38bdf8', 'OPT': '#38bdf8',
            'PASSIVE_RADAR': '#ffb830', 'GPS_INS': '#94a3b8', 'INS': '#ffd700', 'LASER': '#00f5a0',
            'MMW': '#c084fc', 'MMW_IIR': '#c084fc', 'UNGUIDED': '#f97316', 'DIRECT_FIRE': '#fbbf24'
          };
          expectedColor = pkResult.hasMixedSeekers ? '#00f5a0' : (seekerColors[seeker] || '#7dd3fc');
        }

        if (pkTag.textContent !== expectedTag) pkTag.textContent = expectedTag;
        if (pkTag.style.color !== expectedColor) pkTag.style.color = expectedColor;
      }

      if (w.isJammerPod) {
        if (pkFill) pkFill.style.width = `${Math.round(w.jamEfficiency * 100)}%`;
        if (fireBtn && !fireBtn.disabled) { fireBtn.disabled = true; fireBtn.textContent = 'ECM ACTIVE'; }
        return;
      }

      if (w.isTargetingPod) {
        if (pkFill) { pkFill.style.width = '100%'; pkFill.style.background = w.grantsESM ? '#fbbf24' : '#00f5a0'; }
        if (fireBtn && !fireBtn.disabled) {
          fireBtn.disabled = true;
          fireBtn.textContent = w.grantsESM ? `ESM ACTIVE (${w.spotRangeKm}km)` : (w.grantsIRST && w.a2gPkBonus <= 0 ? 'IRST TRACK ACTIVE' : `TGP RECON (${w.spotRangeKm}km)`);
        }
        return;
      }

      if (item.cooldown && item.cooldown > 0) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          const coolText = `RECHARGE (${item.cooldown.toFixed(1)}s)`;
          if (fireBtn.textContent !== coolText) fireBtn.textContent = coolText;
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return;
      }

      if (w.isDecoy || w.isDecoyDrone) {
        const hasTokens = (curTokens >= tokenCost);
        if (pkFill) pkFill.style.width = item.ammo > 0 ? '100%' : '0%';
        if (fireBtn) {
          const isDis = (!hasTokens || item.ammo <= 0);
          if (fireBtn.disabled !== isDis) fireBtn.disabled = isDis;
          const dText = item.ammo <= 0 ? 'DEPLETED' : (hasTokens ? 'DEPLOY' : 'NEED TOK');
          if (fireBtn.textContent !== dText) fireBtn.textContent = dText;
        }
        return;
      }

      if (item.ammo <= 0) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          const depText = (item.station === 'INTERNAL') ? 'EMPTY BAY' : 'DEPLETED (JETTISONED)';
          if (fireBtn.textContent !== depText) fireBtn.textContent = depText;
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        cardEl.classList.add('depleted-rack');
        return;
      }
      cardEl.classList.remove('depleted-rack');

      if (w.isGunpod || w.category === 'GUN') {
        const hasTokens = (curTokens >= tokenCost);
        if (pkFill) pkFill.style.width = '100%';
        if (fireBtn) {
          fireBtn.disabled = !hasTokens;
          const podText = hasTokens ? `POD BURST (${w.damagePerBurst} HP)` : 'NEED TOK';
          if (fireBtn.textContent !== podText) fireBtn.textContent = podText;
          fireBtn.style.color = '#ffffff';
          fireBtn.style.borderColor = 'var(--theme-primary)';
        }
        return;
      }

      if (!validTarget) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          if (fireBtn.textContent !== 'SELECT TARGET') fireBtn.textContent = 'SELECT TARGET';
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return;
      }

      if (pkFill) {
        const nextW = `${currentPk}%`;
        const nextBg = pkResult.color || '#00f0ff';
        if (pkFill._lastW !== nextW) { pkFill._lastW = nextW; pkFill.style.width = nextW; }
        if (pkFill._lastBg !== nextBg) { pkFill._lastBg = nextBg; pkFill.style.background = nextBg; }
      }

      const canFire = curGame ? curGame.canFirePylon(activeUnit, item, validTarget) : false;

      if (fireBtn) {
        fireBtn.disabled = !canFire;
        let expectedBtnText = '';
        let expectedBtnColor = '#ffffff';
        let expectedBtnBorder = 'var(--theme-primary)';

        const isKnown = Boolean(
          validTarget.type ||
          (typeof validTarget.isIdentifiedBy === 'function' ? validTarget.isIdentifiedBy(curGame.currentPvpCommander) : validTarget.isIdentified)
        );

        if (['AIR ONLY', 'GROUND ONLY', 'IMMUNE', 'TOO CLOSE', 'OUT OF RANGE', 'OFF BORESIGHT'].includes(pkResult.label)) {
          expectedBtnText = pkResult.label;
          if (pkResult.label === 'OUT OF RANGE' || pkResult.label === 'TOO CLOSE' || pkResult.label === 'OFF BORESIGHT') {
            expectedBtnColor = '#f87171';
            expectedBtnBorder = 'rgba(244, 63, 94, 0.4)';
          } else {
            expectedBtnColor = '#94a3b8';
            expectedBtnBorder = 'rgba(255, 255, 255, 0.1)';
          }
        } else if (curTokens < tokenCost) {
          expectedBtnText = 'NEED TOK';
          expectedBtnColor = '#fbbf24';
          expectedBtnBorder = 'rgba(251, 191, 36, 0.35)';
        } else if (validTarget.isCivilian) {
          expectedBtnText = 'CIVILIAN ROE (-2000 VP)';
          expectedBtnColor = '#f43f5e';
          expectedBtnBorder = 'rgba(244, 63, 94, 0.5)';
        } else if (!isKnown) {
          expectedBtnText = `ENGAGE BOGEY [? (${currentPk}%)]`;
          expectedBtnColor = '#f97316';
          expectedBtnBorder = 'rgba(249, 115, 22, 0.5)';
        } else if (pkResult.hasMixedSeekers) {
          expectedBtnText = `ENGAGE (EST. ${currentPk}% MIXED +25%)`;
        } else {
          expectedBtnText = `ENGAGE (EST. ${currentPk}%)`;
        }

        if (fireBtn.textContent !== expectedBtnText) fireBtn.textContent = expectedBtnText;
        if (fireBtn.style.color !== expectedBtnColor) fireBtn.style.color = expectedBtnColor;
        if (fireBtn.style.borderColor !== expectedBtnBorder) fireBtn.style.borderColor = expectedBtnBorder;
      }
    });
  }
}

window.PylonCardUpdater = PylonCardUpdater;
