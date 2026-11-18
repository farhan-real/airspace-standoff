/**
 * js/ui/inspection/surfaceoverview.js - Inspection Overview Submodule for Ground Installations & Ghosts.
 */

class InspectionSurfaceOverview {
  static getArmorDescription(armorClass) {
    if (armorClass === 'FORTIFIED') return 'FORTIFIED (Deflects 80% unguided light ordnance; use Bunker Penetrators or Anti-Runway 2x)';
    if (armorClass === 'ARMORED') return 'ARMORED (65% damage from light rockets/clusters; 100% from ATGMs, Bombs & ARMs)';
    return 'SOFT (Takes 100% full damage from all A2G bombs, clusters, rockets & cannons)';
  }

  static buildNetworkRows(controller, s, mods) {
    const game = controller.game;
    const isAttack = (game.scenarioMode === 'ATTACK');
    const allSurf = game.surfaceUnits || [];
    const rows = [];

    if (s.requiresEwCue) {
      rows.push({
        label: 'EW Radar Cueing',
        val: mods.hasEwCue ? 'CUED (100% Reach)' : 'UN-CUED (-52% Reach)',
        cls: mods.hasEwCue ? 'negative' : 'positive',
        desc: mods.hasEwCue ? 'Receiving long-range radar tracks from sector EW network.' : 'Sector EW link lost; operating on degraded local backup.'
      });
    }
    if (s.minAltFt > 1000 && s.cuedMinAltFt < s.minAltFt) {
      rows.push({
        label: 'Engagement Alt Floor',
        val: `${(mods.hasLowAltCue ? s.cuedMinAltFt : s.minAltFt).toLocaleString()} ft`,
        cls: mods.hasLowAltCue ? 'negative' : 'warning',
        desc: mods.hasLowAltCue ? 'Gap-Filler radar active: low-altitude floor lowered.' : 'Standard horizon floor (aircraft below floor are masked).'
      });
    }
    if (s.isJammerStation && s.requiresPower) {
      rows.push({
        label: 'Grid Power Substation',
        val: mods.isPowerActive ? `ONLINE (${Math.round(s.jamEfficiency * 100)}% Jam)` : `SEVERED (${Math.round(s.jamEfficiency * 100)}% Jam)`,
        cls: mods.isPowerActive ? 'negative' : 'positive',
        desc: mods.isPowerActive ? 'Substation supplying high-voltage jammer power.' : 'Substation destroyed: jamming output cut by 55%.'
      });
    }
    if (isAttack && (s.canAttack || s.canInterceptMissiles || s.isAaaGun)) {
      const hasMun = allSurf.some(u => u.team === s.team && u.isMunitionDepot && Math.hypot(u.x - s.x, u.y - s.y) <= 65.0);
      const aliveMun = allSurf.some(u => u.team === s.team && u.isMunitionDepot && u.hp > 0.05 && Math.hypot(u.x - s.x, u.y - s.y) <= 65.0);
      if (hasMun) {
        rows.push({
          label: 'Munition Depot Supply',
          val: aliveMun ? 'SUPPLIED' : 'DESTROYED (+80% Reload)',
          cls: aliveMun ? 'neutral' : 'positive',
          desc: aliveMun ? 'Forward depot supplying normal reload cycles.' : 'Munition depot destroyed: battery reloads take 1.8x longer.'
        });
      }
      const c2Alive = allSurf.some(u => u.team === s.team && u.isCommandNode && u.hp > 0.05 && Math.hypot(u.x - s.x, u.y - s.y) <= 75.0);
      rows.push({
        label: 'C2 Command Sync',
        val: c2Alive ? 'SYNCHRONIZED' : 'ISOLATED (+40% Delay)',
        cls: c2Alive ? 'neutral' : 'positive',
        desc: c2Alive ? 'Command bunker coordinating rapid reaction cycles.' : 'Local C2 destroyed: reaction & reload delays increased by 40%.'
      });
    }
    if (s.secondaryBlastRadiusKm > 0) {
      rows.push({
        label: 'Volatile Blast Radius',
        val: `${s.secondaryBlastRadiusKm} km (${s.secondaryBlastDamage} HP)`,
        cls: 'warning',
        desc: 'Destroying this site triggers a secondary blast damaging nearby structures.'
      });
    }
    return rows;
  }

  static renderAirbaseSection(controller, s) {
    const game = controller.game;
    const allSurf = game.surfaceUnits || [];
    if (!s.isRunwaySegment && !s.isAircraftParking && !s.isFuelDepot && !s.isMunitionDepot && !s.isLogisticsHub) return '';

    let runwayHtml = '';
    if (s.airbaseId) {
      const segs = allSurf.filter(u => u.team === s.team && u.isRunwaySegment && u.airbaseId === s.airbaseId)
        .sort((a, b) => a.segmentIndex - b.segmentIndex);
      if (segs.length > 0 && typeof AirbaseSystem !== 'undefined') {
        const runInfo = AirbaseSystem.getContiguousRuns(segs);
        const neutralized = AirbaseSystem.isAirbaseNeutralized(game, s.airbaseId);
        const timerSec = (game.airbaseTimers && typeof game.airbaseTimers[s.airbaseId] === 'number')
          ? Math.max(0, game.airbaseTimers[s.airbaseId]).toFixed(1) : '--';
        const segChips = segs.map(seg => {
          const intact = seg.hp > 0.05;
          const isCur = seg.id === s.id;
          return `<span class="factor-chip ${intact ? 'positive' : 'negative'}" style="${isCur ? 'outline:1px solid #fff;' : ''}">SEG ${seg.segmentIndex + 1}: ${intact ? `${Math.round(seg.hp)}HP` : 'CRATERED'}</span>`;
        }).join('');
        runwayHtml = `
          <div class="ovr-surf-rwy-wrap" style="margin-bottom:6px;">
            <div style="display:flex; justify-content:space-between; font:600 0.62rem var(--font-dotdigital); margin-bottom:4px;">
              <span>AIRBASE ${s.airbaseId} (${runInfo.totalIntact}/${segs.length} INTACT)</span>
              <b style="color:${neutralized ? 'var(--stat-tier-2)' : 'var(--stat-tier-5)'};">${neutralized ? 'NEUTRALIZED' : `MAX RUN: ${runInfo.maxLength} SEG | QRA: ${timerSec}s`}</b>
            </div>
            <div class="inspection-chips-wrap">${segChips}</div>
            <small class="inspection-meter-note">Launch req: 1 Seg UCAVs | 2 Seg Light/CAS | 3 Seg Fighters | 4 Seg Heavy/Bombers</small>
          </div>`;
      }
    }

    let parkedHtml = '';
    if (s.isAircraftParking) {
      const list = s.parkedAircraft || [];
      const parkedItems = list.length > 0
        ? list.map((ac, idx) => `<span class="factor-chip warning">${idx + 1}. ${ac.specId} (${ac.takeoffSegments} SEG)${ac.isLead ? ' LEAD' : ''}</span>`).join('')
        : '<span class="inspection-muted">No aircraft currently parked in this bay.</span>';
      parkedHtml = `
        <div class="ovr-surf-parked" style="margin-top:4px;">
          <div style="font:600 0.60rem var(--font-dotdigital); color:var(--color-moon-mist); margin-bottom:3px;">
            STORED QRA AIRCRAFT (${list.length}) ${s.isOpenField ? ' - DISPERSAL 2x LAUNCH WHEN THREATENED' : ''}
          </div>
          <div class="inspection-chips-wrap">${parkedItems}</div>
        </div>`;
    }

    if (!runwayHtml && !parkedHtml) return '';
    return `<section class="inspection-card"><h3>AIRBASE &amp; QRA READINESS</h3>${runwayHtml}${parkedHtml}</section>`;
  }

  static formatSamRackText(s) {
    if (!s.canAttack || !s.missileSpec) return 'PASSIVE';
    if (s.ammo <= 0) return 'OUT OF AMMO';
    if (s.rackReloadTimer > 0) return `RELOADING (${s.rackReloadTimer.toFixed(1)}s) [${s.ammo}/${s.maxAmmo}]`;
    return `${s.readyAmmo}/${s.readyRackSize} READY (${s.ammo}/${s.maxAmmo} TOTAL)`;
  }

  static renderSurfaceOverview(controller, s, status, teamBadgeColor, actionButtons) {
    const rate = StatEvaluator.rate;
    const hp = Math.max(0, s.hp || 0);
    const maxHp = Math.max(1, s.maxHp || s.hp || 6);
    const isInd = Boolean(s.isIndestructible);
    const rHp = rate('hp', hp);
    const mods = (typeof SurfaceCombatSystem !== 'undefined') ? SurfaceCombatSystem.getAttackModifiers(s) : null;
    const armorCol = s.armorClass === 'FORTIFIED' ? 'var(--stat-tier-5)' : (s.armorClass === 'ARMORED' ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)');

    const pipsCount = Math.min(18, Math.max(1, Math.round(maxHp)));
    const filledPips = isInd ? pipsCount : Math.ceil((hp / maxHp) * pipsCount);
    const pipsHtml = Array.from({ length: pipsCount }).map((_, i) =>
      `<div class="insp-hp-pip ${i < filledPips ? ((hp / maxHp <= 0.35 && !isInd) ? 'critical' : 'filled') : 'empty'}"></div>`
    ).join('');

    const docCard = (typeof InspectionCognitionRenderer !== 'undefined' && s.team === 'hostile')
      ? InspectionCognitionRenderer.renderAttackDoctrineCard(controller, s) : '';
    const netRows = mods ? this.buildNetworkRows(controller, s, mods) : [];

    return `
      ${docCard}
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:4px; flex-wrap:wrap;">
          <h3 style="margin:0;">${s.isPrimaryObjective ? '[OBJ] ' : ''}${controller.escape(s.name || s.type)}</h3>
          <div style="display:flex; gap:4px;">
            ${s.isPrimaryObjective ? '<span class="factor-chip warning">PRIMARY OBJ</span>' : ''}
            ${s.isGroundDecoy ? '<span class="factor-chip negative">DECOY BAIT</span>' : ''}
            <span class="factor-chip" style="color:${teamBadgeColor}; border-color:${teamBadgeColor};">${status}</span>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font:700 0.66rem var(--font-dotdigital);">
          <span>ARMOR: <b style="color:${armorCol};">${s.armorClass}</b></span>
          <b class="${isInd ? 'stat-tier-1' : rHp.colorClass} ovr-surf-hp">${isInd ? 'INDESTRUCTIBLE' : `${hp.toFixed(1)} / ${maxHp} HP`}</b>
        </div>
        <div class="insp-armor-bar ovr-surf-pips">${pipsHtml}</div>
        <small class="inspection-meter-note">${this.getArmorDescription(s.armorClass)}</small>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:8px; font:600 0.62rem var(--font-dotdigital);">
          <div>REACH: <b style="color:var(--theme-accent);">${s.rangeKm ? `${s.rangeKm} km` : 'PASSIVE'}</b></div>
          <div>RECOGNITION: <b class="ovr-surf-reveal" style="color:${s.identifiedByBlue ? 'var(--stat-tier-2)' : (s.isRevealedToBlue ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)')};">${s.identifiedByBlue ? 'IDENTIFIED' : (s.isRevealedToBlue ? 'EMITTING [?]' : 'CONCEALED')}</b></div>
          <div>EMCON STATE: <b class="ovr-surf-emcon" style="color:${s.emconTimer > 0 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)'};">${s.emconTimer > 0 ? `SILENT (${s.emconTimer.toFixed(1)}s)` : (s.isEmitter ? 'EMITTING' : 'ZERO RF')}</b></div>
          <div>COOLDOWN: <b class="ovr-surf-cd">${(s.canAttack || s.canInterceptMissiles || s.isAaaGun) ? (s.fireCooldown > 0 ? `${s.fireCooldown.toFixed(1)}s` : 'READY') : 'PASSIVE'}</b></div>
          ${s.canAttack && s.missileSpec ? `<div style="grid-column: 1 / -1;">MISSILE MAGAZINE: <b class="ovr-surf-ammo" style="color:${s.ammo > 0 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)'};">${this.formatSamRackText(s)}</b></div>` : ''}
        </div>
        <p class="inspection-muted" style="margin-top:6px;">${controller.escape(s.desc || '')}</p>
      </section>
      ${this.renderAirbaseSection(controller, s)}
      ${netRows.length > 0 ? `
        <section class="inspection-card">
          <h3>IADS NETWORK &amp; LOGISTICS LINKS</h3>
          <div class="inspection-factors-table ovr-surf-net-list">
            ${netRows.map(r => `<div class="inspection-factor-row ${r.cls}"><span class="factor-name">${r.label}<span class="factor-desc">${r.desc}</span></span><span class="factor-delta ${r.cls}">${r.val}</span></div>`).join('')}
          </div>
        </section>` : ''}
      ${actionButtons.length ? `<div style="margin-top:4px;">${actionButtons.join('')}</div>` : ''}
    `;
  }

  static renderGhostOverview(controller, g, status) {
    const fl = `FL${Math.round((g.altFt || 28000) / 100)}`;
    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">FALSE RADAR ECHO [CLUTTER]</h3>
          <span class="factor-chip warning">${g.isDissolving ? 'DISSIPATING' : status}</span>
        </div>
        <div class="inspection-reason-box warning" style="margin-top:6px;">
          <b>ANOMALOUS RADAR RETURN:</b> ${controller.escape(g.ghostType || 'ATMOSPHERIC CLUTTER')}. Continuous scanning dissolves false echoes automatically. Firing missiles before identification incurs -600 VP.
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font:600 0.62rem var(--font-dotdigital);">
          <div>SPEED: <b>Mach ${(g.speed || 0.8).toFixed(2)}</b></div>
          <div>ALTITUDE: <b>${fl} (${Math.round(g.altFt || 28000).toLocaleString()} ft)</b></div>
          <div>APPARENT RCS: <b>${(g.effectiveRcs || 1.2).toFixed(2)} m2</b></div>
          <div>TRACK PROGRESS: <b class="ovr-ghost-track">${Math.min(100, Math.round(((g.trackDurationBlue || 0) / 8.25) * 100))}%</b></div>
        </div>
      </section>`;
  }

  static updateLiveSurfaceOverview(controller, s, content) {
    const hpEl = content.querySelector('.ovr-surf-hp');
    const maxHp = Math.max(1, s.maxHp || s.hp || 6);
    if (hpEl && !s.isIndestructible) hpEl.textContent = `${Math.max(0, s.hp).toFixed(1)} / ${maxHp} HP`;

    const pips = content.querySelectorAll('.ovr-surf-pips .insp-hp-pip');
    if (pips.length > 0 && !s.isIndestructible) {
      const filled = Math.ceil((Math.max(0, s.hp) / maxHp) * pips.length);
      pips.forEach((p, i) => {
        p.className = `insp-hp-pip ${i < filled ? ((s.hp / maxHp <= 0.35) ? 'critical' : 'filled') : 'empty'}`;
      });
    }

    const revEl = content.querySelector('.ovr-surf-reveal');
    if (revEl) {
      revEl.textContent = s.identifiedByBlue ? 'IDENTIFIED' : (s.isRevealedToBlue ? 'EMITTING [?]' : 'CONCEALED');
      revEl.style.color = s.identifiedByBlue ? 'var(--stat-tier-2)' : (s.isRevealedToBlue ? 'var(--stat-tier-3)' : 'var(--stat-tier-5)');
    }
    const emEl = content.querySelector('.ovr-surf-emcon');
    if (emEl) {
      emEl.textContent = s.emconTimer > 0 ? `SILENT (${s.emconTimer.toFixed(1)}s)` : (s.isEmitter ? 'EMITTING' : 'ZERO RF');
      emEl.style.color = s.emconTimer > 0 ? 'var(--stat-tier-3)' : 'var(--stat-tier-2)';
    }
    const cdEl = content.querySelector('.ovr-surf-cd');
    if (cdEl && (s.canAttack || s.canInterceptMissiles || s.isAaaGun)) {
      cdEl.textContent = s.fireCooldown > 0 ? `${s.fireCooldown.toFixed(1)}s` : 'READY';
    }
    const ammoEl = content.querySelector('.ovr-surf-ammo');
    if (ammoEl && s.canAttack && s.missileSpec) {
      ammoEl.textContent = this.formatSamRackText(s);
    }
  }

  static updateLiveGhostOverview(controller, g, content) {
    const trkEl = content.querySelector('.ovr-ghost-track');
    if (trkEl) trkEl.textContent = `${Math.min(100, Math.round(((g.trackDurationBlue || 0) / 8.25) * 100))}%`;
  }
}

window.InspectionSurfaceOverview = InspectionSurfaceOverview;
