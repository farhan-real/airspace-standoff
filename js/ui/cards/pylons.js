/**
 * AIRSPACE STANDOFF // Weapon Pylon Bay & Stores Management System
 */

class PylonBayRenderer {
  constructor(deckManager) {
    this.dm = deckManager;
    this.game = (deckManager && deckManager.game) || window.Game || null;
    this.currentPylonUnitId = null;
    this.lastRenderWasMobile = null;
    this.lastFingerprint = null;
  }

  get currentGame() { return (this.dm && this.dm.game) || this.game || window.Game || null; }

  getValidatedTarget() {
    const game = this.currentGame;
    const tgt = game ? game.selectedTarget : null;
    if (tgt && tgt.hp > 0 && typeof tgt.x === 'number' && typeof tgt.y === 'number' && !isNaN(tgt.x) && !isNaN(tgt.y) && !tgt.isDissolved) {
      return tgt;
    }
    return null;
  }

  render(activeUnit, targetEntity, container) {
    const targetContainer = container || document.getElementById('pylon-rack');
    if (!targetContainer) return;

    if (!activeUnit || activeUnit.hp <= 0) {
      targetContainer.innerHTML = '<div class="pylon-empty-msg" style="text-align:center;padding:12px;font-size:0.64rem;color:#8494ab;font-family:var(--font-mono);">NO OPERATIONAL AIRFRAME SELECTED</div>';
      this.currentPylonUnitId = null;
      this.lastFingerprint = null;
      return;
    }

    const weapons = activeUnit.equippedWeapons || [];
    const isMobile = (window.innerWidth <= 1024);
    const validTarget = this.getValidatedTarget();

    const gunId = activeUnit.gun ? activeUnit.gun.id : 'M61A2';
    const weaponKeys = weapons.map(item => `${item && item.weapon ? item.weapon.id : (item ? item.id : '')}:${item ? (item.maxAmmo || 0) : 0}`).join('|');
    const fingerprint = `${activeUnit.id}#${isMobile ? 'mob' : 'desk'}#${gunId}#${weapons.length}#${weaponKeys}`;

    const needsRebuild = (this.lastFingerprint !== fingerprint) ||
      (targetContainer.children.length === 0) ||
      (!isMobile && !targetContainer.querySelector('#mfd-target-solution-card')) ||
      (!targetContainer.querySelector('#autocannon-active-bay'));

    if (needsRebuild) {
      this.currentPylonUnitId = activeUnit.id;
      this.lastRenderWasMobile = isMobile;
      this.lastFingerprint = fingerprint;
      targetContainer.innerHTML = '';

      if (!isMobile) {
        const targetCard = document.createElement('div');
        targetCard.id = 'mfd-target-solution-card';
        targetCard.className = 'target-solution-box no-target';
        targetCard.innerHTML = `
          <div class="tsb-header">
            <span id="tsb-target-name">TARGET: NONE</span>
            <div style="display:flex;align-items:center;gap:6px;"><span id="tsb-target-dist" class="tsb-dist">-- km</span><button type="button" id="tsb-target-specs-btn" class="spec-inspect-btn small hidden">SPECS</button></div>
          </div>
          <div id="tsb-target-grid" class="tsb-grid hidden"><div>ALTITUDE: <b id="tsb-alt">--</b></div><div>AIRSPEED: <b id="tsb-speed">--</b></div><div>ARMOR: <b id="tsb-hp">--</b></div><div>CLASSIFICATION: <b id="tsb-type">--</b></div></div>
          <div id="tsb-target-empty-prompt" class="tsb-empty">NO TARGET LOCKED &bull; TAP RADAR CONTACT TO TARGET</div>
        `;
        targetContainer.appendChild(targetCard);
      }

      if (typeof AutocannonBayRenderer !== 'undefined') {
        AutocannonBayRenderer.render(targetContainer, activeUnit, isMobile, (unit, tgt) => {
          AutocannonBayRenderer.fireAutocannonManual(unit, tgt, this.currentGame);
          this.render(unit, this.getValidatedTarget());
        }, () => this.getValidatedTarget());
      }

      if (weapons.length === 0) {
        const emptyNotice = document.createElement('div');
        emptyNotice.className = 'empty-bay-indicator';
        emptyNotice.style.padding = '6px';
        emptyNotice.style.gridColumn = '1 / -1';
        emptyNotice.textContent = 'NO PYLON WEAPONS INSTALLED';
        targetContainer.appendChild(emptyNotice);
      } else {
        weapons.forEach((item, idx) => {
          const w = item.weapon;
          if (!w) return;
          const pylonCard = document.createElement('div');
          pylonCard.dataset.pylonIdx = idx;

          if (isMobile) {
            pylonCard.className = 'mob-compact-pylon';
            pylonCard.innerHTML = `
              <div class="mob-pylon-top-line">
                <div class="mob-pylon-name-group"><span class="mob-pylon-name">${(w.name || w.id || 'WPN').split(' ')[0]}</span></div>
                <div class="mob-pylon-top-right"><span class="pylon-ammo-counter mob-pylon-cap">${item.ammo}/${item.maxAmmo}</span><button type="button" class="micro-spec-btn" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button></div>
              </div>
              <div class="mob-pylon-prob-row"><span class="mob-pylon-sub">${w.rangeKm || 0}km &bull; ${w.damage || 2}HP</span><span class="pk-value-tag mob-pylon-pk">[${w.seeker || 'GUIDED'}]</span></div>
              <button type="button" class="btn-fire-pylon mob-fire-btn" disabled>ENGAGE</button>
            `;
          } else {
            pylonCard.className = 'pylon-item-card';
            pylonCard.innerHTML = `
              <div class="pylon-top-row">
                <div class="pylon-name-group"><span class="pylon-name">${w.name || w.id}</span></div>
                <div style="display:flex;align-items:center;gap:6px;"><button type="button" class="pylon-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button><span class="pylon-ammo-counter">${item.ammo} / ${item.maxAmmo}</span></div>
              </div>
              <div class="pylon-sub-row"><span class="pylon-seeker-tag">${w.rangeKm || 0}km &bull; <b style="color:#ffb830;">${w.damage || 2} HP</b></span><span class="pk-value-tag">[${w.seeker || 'GUIDED'}]</span></div>
              <div class="pk-progress-bar-bg"><div class="pk-progress-fill" style="width: 0%;"></div></div>
              <button type="button" class="btn-fire-pylon" disabled>ENGAGE TARGET</button>
            `;
          }

          const fireBtn = pylonCard.querySelector('.btn-fire-pylon');
          if (fireBtn) {
            let isTouchScroll = false;
            fireBtn.addEventListener('touchstart', () => { isTouchScroll = false; }, { passive: true });
            fireBtn.addEventListener('touchmove', () => { isTouchScroll = true; }, { passive: true });
            fireBtn.onclick = (e) => {
              e.stopPropagation();
              if (isTouchScroll) return;
              const curGame = this.currentGame;
              const currentUnit = curGame ? curGame.activeUnit : null;
              if (currentUnit && currentUnit.hp > 0 && curGame && typeof curGame.firePylon === 'function') {
                curGame.firePylon(currentUnit, idx, this.getValidatedTarget());
              }
            };
          }
          targetContainer.appendChild(pylonCard);
        });
      }
    }

    const targetBox = document.getElementById('mfd-target-solution-card');
    if (targetBox && !isMobile && typeof PylonTargetSolution !== 'undefined') {
      PylonTargetSolution.updateTargetCard(targetBox, validTarget, activeUnit, (this.currentGame && this.currentGame.currentPvpCommander) || 'friendly');
    }

    if (typeof AutocannonBayRenderer !== 'undefined') {
      AutocannonBayRenderer.update(activeUnit, validTarget);
    }

    const clouds = (this.currentGame && this.currentGame.simulation && this.currentGame.simulation.weatherClouds) || [];
    const cards = targetContainer.querySelectorAll('.pylon-item-card, .mob-compact-pylon');
    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    const curTokens = (this.currentGame && typeof this.currentGame.getCurrentCommanderTokenBucket === 'function') ? this.currentGame.getCurrentCommanderTokenBucket() : 8.0;

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

      if (pkTag) {
        if (w.isJammerPod) {
          pkTag.textContent = isMobile ? '[ECM]' : 'ACTIVE: [ECM]';
          pkTag.style.color = '#00f0ff';
        } else if (w.isDecoy || w.isDecoyDrone) {
          pkTag.textContent = isMobile ? '[DECOY]' : 'DEFENSE: [DECOY]';
          pkTag.style.color = '#c084fc';
        } else if (w.isLaser) {
          pkTag.textContent = isMobile ? '[DEW]' : 'DIRECT: [DEW]';
          pkTag.style.color = '#00f0ff';
        } else {
          const seeker = w.seeker || 'GUIDED';
          pkTag.textContent = isMobile ? `[${seeker}]` : `HOMING: [${seeker}]`;
          const seekerColors = {
            'ARH': '#00f0ff',
            'IIR': '#00f5a0',
            'EO': '#38bdf8',
            'OPT': '#38bdf8',
            'PASSIVE_RADAR': '#ffb830',
            'GPS_INS': '#94a3b8',
            'INS_RADAR': '#ffd700',
            'DIRECT_FIRE': '#fbbf24'
          };
          pkTag.style.color = seekerColors[seeker] || '#7dd3fc';
        }
      }

      if (w.isJammerPod) {
        if (pkFill) pkFill.style.width = `${Math.round((w.jamEfficiency || 0.45)*100)}%`;
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = 'ECM ACTIVE'; }
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
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = 'NO AMMO'; }
        return;
      }

      if (!validTarget) {
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = 'SELECT TARGET'; }
        return;
      }

      const pkResult = (typeof Physics !== 'undefined' && Physics.calcPk) ? Physics.calcPk(w, activeUnit, validTarget, clouds) : { pk: 0, label: 'STANDBY', color: '#64748b' };
      const currentPk = (typeof pkResult.pk === 'number' && !isNaN(pkResult.pk)) ? pkResult.pk : 0;

      if (pkFill) { pkFill.style.width = `${currentPk}%`; pkFill.style.background = pkResult.color || '#00f0ff'; }

      let canFire = false;
      try { canFire = (this.currentGame && typeof this.currentGame.canFirePylon === 'function') ? this.currentGame.canFirePylon(activeUnit, item, validTarget) : false; } catch (err) { canFire = false; }

      if (fireBtn) {
        fireBtn.disabled = !canFire;
        if (pkResult.label === 'AIR ONLY' || pkResult.label === 'GROUND ONLY' || pkResult.label === 'IMMUNE' || pkResult.label === 'TOO CLOSE' || pkResult.label === 'OUT OF RANGE') {
          fireBtn.textContent = pkResult.label;
        } else if (curTokens < tokenCost) {
          fireBtn.textContent = 'NEED TOK';
        } else {
          fireBtn.textContent = `ENGAGE (${currentPk}%)`;
        }
      }
    });
  }
}

window.PylonBayRenderer = PylonBayRenderer;