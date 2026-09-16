/**
 * AIRSPACE STANDOFF // Weapon Pylon Bay
 * Pure manual command. All keyboard hotkeys ([G], [1], [SPACE], etc.) removed from buttons/text.
 */

class PylonBayRenderer {
  constructor(deckManager) {
    this.dm = deckManager;
    this.game = (deckManager && deckManager.game) || window.Game || null;
    this.currentPylonUnitId = null;
    this.lastRenderWasMobile = null;
    this.lastFingerprint = null;
  }

  get currentGame() {
    return (this.dm && this.dm.game) || this.game || window.Game || null;
  }

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
            <div style="display:flex;align-items:center;gap:6px;">
              <span id="tsb-target-dist" class="tsb-dist">-- km</span>
              <button type="button" id="tsb-target-specs-btn" class="spec-inspect-btn small hidden">SPECS</button>
            </div>
          </div>
          <div id="tsb-target-grid" class="tsb-grid hidden">
            <div>ALTITUDE: <b id="tsb-alt">--</b></div>
            <div>AIRSPEED: <b id="tsb-speed">--</b></div>
            <div>ARMOR: <b id="tsb-hp">--</b></div>
            <div>CLASSIFICATION: <b id="tsb-type">--</b></div>
          </div>
          <div id="tsb-target-empty-prompt" class="tsb-empty">NO TARGET LOCKED &bull; TAP RADAR CONTACT TO TARGET</div>
        `;
        targetContainer.appendChild(targetCard);
      }

      // Autocannon SMS Bay (No [G] Hotkey In Text)
      const gun = activeUnit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { name: 'Autocannon', id: 'M61A2', rangeKm: 4.8, damagePerSec: 2.5 };
      const gunName = String(gun.name || 'Autocannon');
      const shortGunName = gunName.split(' ')[0] || 'GUN';
      const gunDmg = (gun.damagePerSec !== undefined) ? Number(gun.damagePerSec).toFixed(1) : '2.5';
      const gunBox = document.createElement('div');
      gunBox.id = 'autocannon-active-bay';

      if (isMobile) {
        gunBox.className = 'mob-compact-cannon';
        gunBox.innerHTML = `
          <div class="mob-cannon-row">
            <div style="display:flex;align-items:center;gap:4px;overflow:hidden;">
              <span class="mob-pylon-name">${shortGunName}</span>
              <span id="gun-ui-ammo" class="mob-pylon-cap">${activeUnit.gunAmmo || 0} RDS</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <button type="button" class="micro-spec-btn" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
              <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon mob-fire-btn" style="width:auto;min-width:65px;">BURST</button>
            </div>
          </div>
        `;
      } else {
        gunBox.className = 'autocannon-status-card';
        gunBox.innerHTML = `
          <div class="pylon-top-row">
            <div style="display:flex;align-items:center;gap:6px;">
              <span id="gun-ui-name" style="color:#f8fafc;font-weight:800;">${gunName}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <button type="button" class="gun-inspect-btn small" data-inspect-type="gun" data-inspect-id="${gun.id}">SPECS</button>
              <span id="gun-ui-ammo" class="gun-ammo-tag" style="color:#00f5a0;font-family:var(--font-mono);font-weight:700;">${activeUnit.gunAmmo || 0} RDS</span>
            </div>
          </div>
          <div class="autocannon-auto-badge">
            <span id="gun-ui-stats">MAX: ${gun.rangeKm || 4.8}km &bull; <b style="color:#ffb830;">${gunDmg} HP/s</b></span>
            <span id="gun-ui-indicator" class="armed-indicator" style="color:#00f0ff;">ARMED</span>
          </div>
          <button type="button" id="btn-fire-cannon-manual" class="btn-fire-pylon" style="margin-top:2px;border-color:#00f0ff;color:#7dd3fc;">
            FIRE BURST
          </button>
        `;
      }

      const cannonBtn = gunBox.querySelector('#btn-fire-cannon-manual');
      if (cannonBtn) {
        cannonBtn.onclick = (e) => {
          e.stopPropagation();
          const curGame = this.currentGame;
          const currentUnit = curGame ? curGame.activeUnit : null;
          if (currentUnit && currentUnit.hp > 0) {
            this.fireAutocannonManual(currentUnit, this.getValidatedTarget());
          }
        };
      }
      targetContainer.appendChild(gunBox);

      // Pylon Stations (Hotkeys [1], [2] Removed from Text)
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
          const wpnName = String(w.name || w.id || 'MISSILE');
          const shortWpnName = wpnName.split(' ')[0] || 'WPN';
          const wpnDmg = w.damage !== undefined ? w.damage : 2;
          const pylonCard = document.createElement('div');
          pylonCard.dataset.pylonIdx = idx;

          if (isMobile) {
            pylonCard.className = 'mob-compact-pylon';
            pylonCard.innerHTML = `
              <div class="mob-pylon-top-line">
                <div class="mob-pylon-name-group">
                  <span class="mob-pylon-name">${shortWpnName}</span>
                </div>
                <div class="mob-pylon-top-right">
                  <span class="pylon-ammo-counter mob-pylon-cap">${item.ammo}/${item.maxAmmo}</span>
                  <button type="button" class="micro-spec-btn" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
                </div>
              </div>
              <div class="mob-pylon-prob-row">
                <span class="mob-pylon-sub">${w.rangeKm || 0}km &bull; ${wpnDmg}HP</span>
                <span class="pk-value-tag mob-pylon-pk">P_K: --%</span>
              </div>
              <button type="button" class="btn-fire-pylon mob-fire-btn" disabled>FIRE</button>
            `;
          } else {
            pylonCard.className = 'pylon-item-card';
            pylonCard.innerHTML = `
              <div class="pylon-top-row">
                <div class="pylon-name-group">
                  <span class="pylon-name">${wpnName}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <button type="button" class="pylon-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
                  <span class="pylon-ammo-counter">${item.ammo} / ${item.maxAmmo}</span>
                </div>
              </div>
              <div class="pylon-sub-row">
                <span class="pylon-seeker-tag">${w.rangeKm || 0}km &bull; <b style="color:#ffb830;">${wpnDmg} HP</b> &bull; ${w.seeker || (w.isDecoy ? 'DECOY' : (w.isJammerPod ? 'ECM' : 'GUIDED'))}</span>
                <span class="pk-value-tag">P_K: --%</span>
              </div>
              <div class="pk-progress-bar-bg"><div class="pk-progress-fill" style="width: 0%;"></div></div>
              <button type="button" class="btn-fire-pylon" disabled>ENGAGE</button>
            `;
          }

          const fireBtn = pylonCard.querySelector('.btn-fire-pylon');
          if (fireBtn) {
            fireBtn.onclick = (e) => {
              e.stopPropagation();
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

    // Target solution card updates
    const targetBox = document.getElementById('mfd-target-solution-card');
    if (targetBox && !isMobile && typeof PylonTargetSolution !== 'undefined') {
      const commanderTeam = (this.currentGame && this.currentGame.currentPvpCommander) || 'friendly';
      PylonTargetSolution.updateTargetCard(targetBox, validTarget, activeUnit, commanderTeam);
    }

    // Autocannon telemetry updates
    const gunCard = document.getElementById('autocannon-active-bay');
    if (gunCard) {
      const ax = (typeof activeUnit.x === 'number' && !isNaN(activeUnit.x)) ? activeUnit.x : 0;
      const ay = (typeof activeUnit.y === 'number' && !isNaN(activeUnit.y)) ? activeUnit.y : 0;
      const distToTgt = validTarget ? Math.hypot(validTarget.x - ax, validTarget.y - ay) : 999;
      const inGunRange = (distToTgt <= (activeUnit.gun ? (activeUnit.gun.rangeKm || 4.8) : 4.8));
      const ammoEl = gunCard.querySelector('#gun-ui-ammo');
      const indicatorEl = gunCard.querySelector('#gun-ui-indicator');
      const cannonBtn = gunCard.querySelector('#btn-fire-cannon-manual');

      if (ammoEl) ammoEl.textContent = `${activeUnit.gunAmmo || 0} RDS`;
      if (indicatorEl) {
        indicatorEl.textContent = inGunRange ? 'IN RANGE' : 'ARMED';
        indicatorEl.style.color = inGunRange ? '#00f5a0' : '#00f0ff';
      }
      if (cannonBtn) {
        cannonBtn.disabled = ((activeUnit.gunAmmo || 0) <= 0);
        if (isMobile) cannonBtn.textContent = ((activeUnit.gunAmmo || 0) <= 0) ? 'EMPTY' : (inGunRange ? 'BURST' : 'STRAFE');
        else cannonBtn.textContent = ((activeUnit.gunAmmo || 0) <= 0) ? 'CANNON DEPLETED' : (inGunRange ? 'FIRE BURST' : 'FIRE STRAFE BURST');
      }
    }

    // Pylon Statuses & P_k updates
    const clouds = (this.currentGame && this.currentGame.simulation && this.currentGame.simulation.weatherClouds) || [];
    const cards = targetContainer.querySelectorAll('.pylon-item-card, .mob-compact-pylon');
    const tokenCost = (window.CONFIG && window.CONFIG.TOKEN_ACTION_COST) || 0.70;
    const curTokens = (this.currentGame && typeof this.currentGame.getCurrentCommanderTokenBucket === 'function')
      ? this.currentGame.getCurrentCommanderTokenBucket() : 8.0;

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

      if (w.isJammerPod) {
        cardEl.classList.remove('empty');
        if (ammoTag) ammoTag.textContent = 'ON';
        const effPct = Math.round((w.jamEfficiency || 0.45) * 100);
        if (pkTag) { pkTag.textContent = isMobile ? `ECM ${effPct}%` : `ECM ACTIVE (${effPct}%)`; pkTag.style.color = '#00f5a0'; }
        if (pkFill) { pkFill.style.width = `${effPct}%`; pkFill.style.background = '#00f5a0'; }
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = isMobile ? 'ONLINE' : `PASSIVE ECM (${effPct}%)`; }
        return;
      }

      if (w.isDecoy || w.isDecoyDrone) {
        if (item.ammo <= 0) {
          cardEl.classList.add('empty');
          if (pkTag) pkTag.textContent = isMobile ? 'EMPTY' : 'P_K: 0% (DEPLETED)';
          if (pkFill) pkFill.style.width = '0%';
          if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = isMobile ? 'EMPTY' : 'DEPLETED'; }
          return;
        }
        cardEl.classList.remove('empty');
        if (pkTag) {
          pkTag.textContent = isMobile ? (w.isDecoyDrone ? 'MALD' : 'FOTD') : (w.isDecoyDrone ? 'MALD DECOY DRONE' : 'FOTD TOWED DECOY');
          pkTag.style.color = '#c084fc';
        }
        if (pkFill) { pkFill.style.width = '100%'; pkFill.style.background = '#c084fc'; }
        const hasTokens = (curTokens >= tokenCost);
        if (fireBtn) {
          fireBtn.disabled = !hasTokens;
          fireBtn.textContent = !hasTokens ? 'NEED TOK' : (w.isDecoyDrone ? 'LAUNCH MALD' : 'DEPLOY FOTD');
        }
        return;
      }

      if (item.ammo <= 0) {
        cardEl.classList.add('empty');
        if (pkTag) pkTag.textContent = isMobile ? '0%' : 'P_K: 0% (EMPTY)';
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = isMobile ? 'EMPTY' : 'NO AMMO'; }
        return;
      }
      cardEl.classList.remove('empty');

      if (!validTarget) {
        if (pkTag) { pkTag.textContent = isMobile ? '--%' : 'P_K: --% (NO TARGET)'; pkTag.style.color = '#8494ab'; }
        if (pkFill) pkFill.style.width = '0%';
        if (fireBtn) { fireBtn.disabled = true; fireBtn.textContent = isMobile ? 'NO TGT' : 'SELECT TARGET ON RADAR'; }
        return;
      }

      const pkResult = (typeof Physics !== 'undefined' && Physics.calcPk)
        ? Physics.calcPk(w, activeUnit, validTarget, clouds)
        : { pk: 0, label: 'STANDBY', color: '#64748b', arrow: '--', salvoCount: 0 };

      const currentPk = (typeof pkResult.pk === 'number' && !isNaN(pkResult.pk)) ? pkResult.pk : 0;
      const arrowChar = pkResult.arrow === '^' ? '▲' : (pkResult.arrow === 'v' ? '▼' : '');
      const salvoNotice = (pkResult.salvoCount && pkResult.salvoCount > 0) ? ` <span style="color:#00f0ff;">[x${pkResult.salvoCount + 1}]</span>` : '';

      if (pkTag) {
        pkTag.innerHTML = isMobile ? `${currentPk}% ${arrowChar}${salvoNotice}` : `P_K: ${currentPk}% ${arrowChar}${salvoNotice}`;
        pkTag.style.color = pkResult.color || '#00f0ff';
      }
      if (pkFill) {
        pkFill.style.width = `${currentPk}%`;
        pkFill.style.background = pkResult.color || '#00f0ff';
      }

      let canFire = false;
      try {
        canFire = (this.currentGame && typeof this.currentGame.canFirePylon === 'function')
          ? this.currentGame.canFirePylon(activeUnit, item, validTarget) : false;
      } catch (err) { canFire = false; }

      if (fireBtn) {
        fireBtn.disabled = !canFire;
        if (isMobile) {
          if (pkResult.label === 'AIR ONLY') fireBtn.textContent = 'AIR ONLY';
          else if (pkResult.label === 'GROUND ONLY') fireBtn.textContent = 'GND ONLY';
          else if (pkResult.label === 'IMMUNE') fireBtn.textContent = 'IMMUNE';
          else if (pkResult.label === 'TOO CLOSE') fireBtn.textContent = 'TOO CLOSE';
          else if (pkResult.label === 'OUT OF RANGE') fireBtn.textContent = 'OUT RNG';
          else if (curTokens < tokenCost) fireBtn.textContent = 'NEED TOK';
          else fireBtn.textContent = `FIRE (${currentPk}%)`;
        } else {
          if (pkResult.label === 'AIR ONLY') fireBtn.textContent = 'AIR TARGET REQUIRED';
          else if (pkResult.label === 'GROUND ONLY') fireBtn.textContent = 'SURFACE TARGET REQUIRED';
          else if (pkResult.label === 'IMMUNE') fireBtn.textContent = 'BUNKER IMMUNE';
          else if (pkResult.label === 'TOO CLOSE') fireBtn.textContent = `TOO CLOSE (<${w.minRangeKm || 1.2}km)`;
          else if (pkResult.label === 'OUT OF RANGE') fireBtn.textContent = `OUT OF RANGE (${w.rangeKm || 0}km MAX)`;
          else if (curTokens < tokenCost) fireBtn.textContent = `NEED ${tokenCost.toFixed(1)} TOKEN`;
          else fireBtn.textContent = `ENGAGE TARGET (${currentPk}%)`;
        }
      }
    });
  }

  fireAutocannonManual(unit, target) {
    if (!unit || unit.hp <= 0 || (unit.gunAmmo || 0) <= 0) return;
    const gun = unit.gun || (window.AUTOCANNONS_CATALOG && window.AUTOCANNONS_CATALOG['M61A2']) || { rangeKm: 4.8, damagePerSec: 2.5, tracerColor: '#00f0ff' };
    const rounds = Math.min(unit.gunAmmo, 30);
    unit.gunAmmo -= rounds;

    const validTarget = (target && target.hp > 0 && typeof target.x === 'number' && typeof target.y === 'number' && !isNaN(target.x) && !isNaN(target.y)) ? target : null;

    if (validTarget) {
      const dist = Math.hypot(validTarget.x - unit.x, validTarget.y - unit.y);
      if (dist <= (gun.rangeKm || 4.8)) {
        let rawDmg = (gun.damagePerSec || 2.5) * 0.45;
        const wasAlive = validTarget.hp > 0;

        if (validTarget.isGhost) {
          validTarget.takeDamage(rawDmg);
          if (this.currentGame && this.currentGame.radar) {
            this.currentGame.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, '#94a3b8');
            this.currentGame.radar.spawnCombatText(validTarget.x, validTarget.y, 'DISSIPATED CLUTTER', '#94a3b8');
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
          this.render(unit, this.getValidatedTarget());
          return;
        }

        if (validTarget.isDecoyDrone) {
          validTarget.takeDamage(rawDmg);
          if (this.currentGame && this.currentGame.radar) {
            this.currentGame.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, '#c084fc');
            this.currentGame.radar.spawnCombatText(validTarget.x, validTarget.y, `DECOY -${rawDmg.toFixed(1)}HP`, '#c084fc');
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
          this.render(unit, this.getValidatedTarget());
          return;
        }

        if (typeof SurfaceUnit !== 'undefined' && validTarget instanceof SurfaceUnit) {
          validTarget.takeDamage(rawDmg, false);
        } else if (validTarget.isCivilian && typeof validTarget.takeDamage === 'function') {
          validTarget.takeDamage(rawDmg, unit);
        } else {
          if (validTarget.spec && validTarget.spec.category === 'STRIKE') rawDmg *= 0.60;
          validTarget.hp = Math.max(0, validTarget.hp - rawDmg);
          if (typeof validTarget.applyActionStress === 'function') {
            validTarget.applyActionStress(0.18);
          }
        }

        if (this.currentGame && this.currentGame.radar) {
          this.currentGame.radar.spawnGunTracer(unit.x, unit.y, validTarget.x, validTarget.y, '#00f0ff');
          this.currentGame.radar.spawnCombatText(validTarget.x, validTarget.y, `GUN -${rawDmg.toFixed(1)}HP`, '#00f0ff');
        }
        if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();

        if (wasAlive && validTarget.hp <= 0 && this.currentGame && this.currentGame.simulation) {
          if (validTarget.isCivilian) {
            this.currentGame.simulation.recordCivilianShootdown(unit.team, validTarget);
          } else {
            this.currentGame.simulation.recordKillEvent(unit.team, validTarget, unit, {
              weapon: gun,
              isSalvo: false,
              salvoCount: 1
            });
          }
        }
        this.render(unit, this.getValidatedTarget());
        return;
      }
    }

    const heading = (typeof unit.heading === 'number' && !isNaN(unit.heading)) ? unit.heading : 0;
    const tx = unit.x + Math.cos(heading) * (gun.rangeKm || 4.5);
    const ty = unit.y + Math.sin(heading) * (gun.rangeKm || 4.5);
    if (this.currentGame && this.currentGame.radar) {
      this.currentGame.radar.spawnGunTracer(unit.x, unit.y, tx, ty, '#00f0ff');
      this.currentGame.radar.spawnCombatText(unit.x, unit.y, 'STRAFE', '#00f0ff');
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
    this.render(unit, this.getValidatedTarget());
  }
}

window.PylonBayRenderer = PylonBayRenderer;