/**
 * AIRSPACE STANDOFF: Pylon Card Real-time Status & Live P_k Updater
 */

class PylonCardUpdater {
  static updatePylons(pylonBay, targetContainer, activeUnit, validTarget, isMobile) {
    const curGame = pylonBay.currentGame;
    const clouds = (curGame && curGame.simulation && curGame.simulation.weatherClouds) || [];
    const cards = targetContainer.querySelectorAll('.pylon-item-card, .mob-compact-pylon');
    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    const curTokens = (curGame && typeof curGame.getCurrentCommanderTokenBucket === 'function') ? curGame.getCurrentCommanderTokenBucket() : 8.0;

    cards.forEach(cardEl => {
      const idx = parseInt(cardEl.dataset.pylonIdx || cardEl.getAttribute('data-pylon-idx'), 10);
      if (isNaN(idx)) return;
      const item = (activeUnit.equippedWeapons && activeUnit.equippedWeapons[idx]) || null;
      if (!item || !item.weapon) return;
      const w = item.weapon;

      const ammoTag = cardEl.querySelector('.pylon-ammo-counter');
      if (ammoTag) ammoTag.textContent = isMobile ? `${item.ammo}/${item.maxAmmo}` : `${item.ammo} / ${item.maxAmmo}`;
      const pkTag = cardEl.querySelector('.pk-value-tag');
      const pkFill = cardEl.querySelector('.pk-progress-fill');
      const fireBtn = cardEl.querySelector('.btn-fire-pylon');

      const pkResult = (typeof Physics !== 'undefined' && Physics.calcPk) ? Physics.calcPk(w, activeUnit, validTarget, clouds) : { pk: 0, label: 'STANDBY', color: '#64748b', hasMixedSeekers: false };
      const currentPk = (typeof pkResult.pk === 'number' && !isNaN(pkResult.pk)) ? pkResult.pk : 0;

      if (pkTag) {
        if (w.isJammerPod) {
          pkTag.textContent = isMobile ? '[ECM]' : 'ACTIVE: [ECM]';
          pkTag.style.color = '#00f0ff';
        } else if (w.isDecoy || w.isDecoyDrone) {
          pkTag.textContent = isMobile ? '[DECOY]' : 'DEFENSE: [DECOY]';
          pkTag.style.color = '#c084fc';
        } else if (w.isGunpod || w.category === 'GUN') {
          pkTag.textContent = isMobile ? '[GUNPOD]' : 'BATTERY: [GUNPOD]';
          pkTag.style.color = '#fde047';
        } else if (w.isLaser) {
          pkTag.textContent = isMobile ? '[DEW]' : 'DIRECT: [DEW]';
          pkTag.style.color = '#00f0ff';
        } else {
          const seeker = w.seeker || 'GUIDED';
          const mixedTag = pkResult.hasMixedSeekers ? ' [MIXED +25%]' : '';
          pkTag.textContent = isMobile ? `[${seeker}]${mixedTag}` : `HOMING: [${seeker}]${mixedTag}`;
          const seekerColors = {
            'ARH': '#00f0ff', 'IIR': '#00f5a0', 'EO': '#38bdf8', 'OPT': '#38bdf8',
            'PASSIVE_RADAR': '#ffb830', 'GPS_INS': '#94a3b8', 'INS': '#ffd700', 'INS_RADAR': '#ffd700', 'DIRECT_FIRE': '#fbbf24'
          };
          pkTag.style.color = pkResult.hasMixedSeekers ? '#00f5a0' : (seekerColors[seeker] || '#7dd3fc');
        }
      }

      if (w.isJammerPod) {
        if (pkFill) pkFill.style.width = `${Math.round((w.jamEfficiency || 0.45)*100)}%`;
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = 'ECM ACTIVE'; }
        return;
      }

      if (item.cooldown && item.cooldown > 0) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          fireBtn.textContent = `RECHARGE (${item.cooldown.toFixed(1)}s)`;
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return;
      }

      if (w.isDecoy || w.isDecoyDrone) {
        const hasTokens = (curTokens >= tokenCost);
        if (pkFill) pkFill.style.width = item.ammo > 0 ? '100%' : '0%';
        if (fireBtn) { fireBtn.disabled = (!hasTokens || item.ammo <= 0); fireBtn.textContent = item.ammo <= 0 ? 'DEPLETED' : (hasTokens ? 'DEPLOY' : 'NEED TOK'); }
        return;
      }

      if (item.ammo <= 0) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          fireBtn.textContent = (item.station === 'INTERNAL') ? 'EMPTY BAY' : 'DEPLETED (JETTISONED)';
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        cardEl.classList.add('depleted-rack');
        return;
      } else {
        cardEl.classList.remove('depleted-rack');
      }

      if (w.isGunpod || w.category === 'GUN') {
        const hasTokens = (curTokens >= tokenCost);
        if (pkFill) pkFill.style.width = '100%';
        if (fireBtn) {
          fireBtn.disabled = !hasTokens;
          fireBtn.textContent = hasTokens ? `POD BURST (${w.damagePerBurst || 1.4} HP)` : 'NEED TOK';
          fireBtn.style.color = '#ffffff';
          fireBtn.style.borderColor = 'var(--theme-primary)';
        }
        return;
      }

      if (!validTarget) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) {
          fireBtn.disabled = true;
          fireBtn.textContent = 'SELECT TARGET';
          fireBtn.style.color = '#94a3b8';
          fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return;
      }

      if (pkFill) { pkFill.style.width = `${currentPk}%`; pkFill.style.background = pkResult.color || '#00f0ff'; }

      let canFire = false;
      try { canFire = (curGame && typeof curGame.canFirePylon === 'function') ? curGame.canFirePylon(activeUnit, item, validTarget) : false; } catch (err) { canFire = false; }

      if (fireBtn) {
        fireBtn.disabled = !canFire;
        if (pkResult.label === 'AIR ONLY' || pkResult.label === 'GROUND ONLY' || pkResult.label === 'IMMUNE' || pkResult.label === 'TOO CLOSE' || pkResult.label === 'OUT OF RANGE' || pkResult.label === 'OFF BORESIGHT') {
          fireBtn.textContent = pkResult.label;
          if (pkResult.label === 'OUT OF RANGE' || pkResult.label === 'TOO CLOSE' || pkResult.label === 'OFF BORESIGHT') {
            fireBtn.style.color = '#f87171';
            fireBtn.style.borderColor = 'rgba(244, 63, 94, 0.4)';
          } else {
            fireBtn.style.color = '#94a3b8';
            fireBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }
        } else if (curTokens < tokenCost) {
          fireBtn.textContent = 'NEED TOK';
          fireBtn.style.color = '#fbbf24';
          fireBtn.style.borderColor = 'rgba(251, 191, 36, 0.35)';
        } else if (pkResult.hasMixedSeekers) {
          fireBtn.textContent = `ENGAGE (EST. ${currentPk}% MIXED +25%)`;
          fireBtn.style.color = '#ffffff';
          fireBtn.style.borderColor = 'var(--theme-primary)';
        } else {
          fireBtn.textContent = `ENGAGE (EST. ${currentPk}%)`;
          fireBtn.style.color = '#ffffff';
          fireBtn.style.borderColor = 'var(--theme-primary)';
        }
      }
    });
  }
}

window.PylonCardUpdater = PylonCardUpdater;