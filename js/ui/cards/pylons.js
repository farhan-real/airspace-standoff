/**
 * AIRSPACE STANDOFF: Weapon Pylon Bay & Stores Management System
 * Displays weapon name exclusively on the top row, with ammo count, station tag, and specs on a new line.
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
    const weaponKeys = weapons.map(item => `${item && item.weapon ? item.weapon.id : (item ? item.id : '')}:${item ? item.station : 'EXT'}:${item ? (item.maxAmmo || 0) : 0}`).join('|');
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
        emptyNotice.textContent = 'NO WEAPONS INSTALLED';
        targetContainer.appendChild(emptyNotice);
      } else {
        weapons.forEach((item, idx) => {
          const w = item.weapon;
          if (!w) return;
          const pylonCard = document.createElement('div');
          pylonCard.dataset.pylonIdx = idx;

          const station = item.station || 'EXTERNAL';
          let stationLabel = 'EXT';
          let stationClass = 'station-external-tag';
          if (station === 'INTERNAL') {
            stationLabel = 'INT';
            stationClass = 'station-internal-tag';
          } else if (station === 'CENTERLINE') {
            stationLabel = 'CTR';
            stationClass = 'station-centerline-tag';
          }

          if (isMobile) {
            pylonCard.className = 'mob-compact-pylon';
            const cleanName = (w.name || w.id || 'WPN').replace(/\s*\(\d+x\)/gi, '').trim();
            pylonCard.innerHTML = `
              <div class="mob-pylon-top-line">
                <span class="mob-pylon-name" title="${w.name || w.id}">${cleanName}</span>
              </div>
              <div class="mob-pylon-meta-row">
                <div style="display:inline-flex;align-items:center;gap:3px;">
                  <span class="pylon-ammo-counter mob-pylon-cap">${item.ammo}/${item.maxAmmo}</span>
                  <span class="pylon-station-tag ${stationClass}">[${stationLabel}]</span>
                </div>
                <button type="button" class="micro-spec-btn" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
              </div>
              <div class="mob-pylon-prob-row">
                <span class="mob-pylon-sub">${w.rangeKm || 0}km &bull; ${w.damagePerBurst || w.damage || 2}HP</span>
                <span class="pk-value-tag mob-pylon-pk">[${w.seeker || 'GUIDED'}]</span>
              </div>
              <button type="button" class="btn-fire-pylon mob-fire-btn" disabled>ENGAGE</button>
            `;
          } else {
            pylonCard.className = 'pylon-item-card';
            pylonCard.innerHTML = `
              <div class="pylon-top-row">
                <span class="pylon-name" title="${w.name || w.id}">${w.name || w.id}</span>
              </div>
              <div class="pylon-meta-row">
                <div style="display:inline-flex;align-items:center;gap:6px;">
                  <span class="pylon-ammo-counter">${item.ammo} / ${item.maxAmmo}</span>
                  <span class="pylon-station-tag ${stationClass}">[${stationLabel}]</span>
                </div>
                <button type="button" class="pylon-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
              </div>
              <div class="pylon-sub-row">
                <span class="pylon-seeker-tag">${w.rangeKm || 0}km &bull; <b style="color:#ffb830;">${w.damagePerBurst || w.damage || 2} HP</b></span>
                <span class="pk-value-tag">[${w.seeker || 'GUIDED'}]</span>
              </div>
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

    if (typeof PylonCardUpdater !== 'undefined') {
      PylonCardUpdater.updatePylons(this, targetContainer, activeUnit, validTarget, isMobile);
    }
  }
}

window.PylonBayRenderer = PylonBayRenderer;