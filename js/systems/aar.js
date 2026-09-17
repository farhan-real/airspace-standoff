/**
 * AIRSPACE STANDOFF // After Action Report System
 * Displays Top 3 Podium, Squadron Debrief Table, and High-Precision Telemetry Reporting.
 */

class AfterActionReportSystem {
  static renderSortieSummary(game, blueWon, msg) {
    const modal = document.getElementById('game-over-modal');
    if (!modal) return;

    const tEl = document.getElementById('game-over-title');
    const dEl = document.getElementById('game-over-desc');
    const sEl = document.getElementById('game-over-stats');
    const podiumEl = document.getElementById('ace-podium-cards');
    const timelineListEl = document.getElementById('aar-timeline-list');
    const fullRosterContainer = document.getElementById('aar-full-roster-content');

    const durSec = Math.max(1, Math.round((performance.now() - game.matchStartTime) / 1000));
    const min = Math.floor(durSec / 60);
    const sec = durSec % 60;
    const timeStr = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');

    if (tEl) {
      tEl.textContent = blueWon ? 'TACTICAL VICTORY - AIRSPACE SECURED' : 'SORTIE TERMINATED - MISSION DEBRIEF';
      tEl.style.color = blueWon ? '#00f0ff' : '#ff3366';
    }
    if (dEl) dEl.textContent = msg || 'THEATER COMBAT ASSESSMENT';

    const allPilots = [...game.alliedAircraft, ...game.hostileAircraft];
    allPilots.sort((a, b) => (b.kills * 100 + (b.scorePoints || 0)) - (a.kills * 100 + (a.scorePoints || 0)));

    if (podiumEl) {
      const topThree = allPilots.slice(0, 3);
      podiumEl.innerHTML = topThree.map((p, idx) => {
        const rankNames = ['ACE OF THE THEATER', 'SECOND HIGHEST ACE', 'THIRD HIGHEST ACE'];
        const rankClass = 'rank-' + (idx + 1);
        const teamColor = p.isAce ? '#ffd700' : (p.team === 'friendly' ? '#00f0ff' : '#ff3366');
        const teamTag = p.isAce ? 'ACE' : (p.team === 'friendly' ? 'BLUE' : 'RED');

        return (
          `<div class="ace-card ${rankClass}">` +
            `<div class="ace-rank-title"><span>#${idx + 1} - ${rankNames[idx]}</span> <b style="color:${teamColor}">[${teamTag}]</b></div>` +
            `<div class="ace-callsign">${p.callsign || 'PILOT'}</div>` +
            `<div class="ace-sub">${p.spec ? p.spec.name : 'JET'} - ${p.squadronName || 'FLIGHT'}</div>` +
            `<div class="ace-stats">` +
              `<span>KILLS: <b>${p.kills || 0}</b></span>` +
              `<span>EVADED: <b>${p.missilesEvadedCount || 0}</b></span>` +
              `<span>POINTS: <b>${p.scorePoints || 0}</b></span>` +
            `</div>` +
          `</div>`
        );
      }).join('');
    }

    if (fullRosterContainer) {
      const rowsHtml = allPilots.map((p, i) => {
        const col = p.team === 'friendly' ? '#00f0ff' : '#ff3366';
        const statusStr = p.hp > 0 ? `<b style="color:#00f5a0;">SURVIVED (${Math.round(p.hp)}HP)</b>` : `<span style="color:#ef4444;">DESTROYED</span>`;
        return `
          <tr>
            <td>#${i + 1}</td>
            <td style="color:${col};font-weight:800;">${p.callsign || 'PILOT'} ${p.isAce ? '★' : ''}</td>
            <td>${p.spec ? p.spec.id : 'JET'}</td>
            <td><b style="color:${col};">[${p.team === 'friendly' ? 'BLUE' : 'RED'}]</b></td>
            <td><b>${p.kills || 0}</b></td>
            <td>${p.missilesEvadedCount || 0}</td>
            <td><b>${p.scorePoints || 0}</b></td>
            <td>${statusStr}</td>
          </tr>
        `;
      }).join('');

      fullRosterContainer.innerHTML = `
        <table class="debrief-table">
          <thead>
            <tr><th>RANK</th><th>CALLSIGN</th><th>AIRFRAME</th><th>COALITION</th><th>KILLS</th><th>EVADED</th><th>POINTS</th><th>STATUS</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    }

    const scoreData = (game.simulation && game.simulation.scoring)
      ? game.simulation.scoring.getScoreMultipliers()
      : { diffKey: game.aiDifficulty, diffMult: 1.0, budgetCap: 400.0, budgetMult: 1.0, totalMult: 1.0 };

    const rawBlueScore = game.vpAlly || 0;
    const finalSortieScore = Math.round(rawBlueScore * scoreData.totalMult);

    if (sEl) {
      sEl.innerHTML = `
        <div class="aar-report-section">
          <div class="aar-report-grid">
            <div class="aar-report-card">
              <div class="aar-card-head">
                <span class="aar-card-title">SORTIE TELEMETRY &amp; ENGAGEMENT</span>
                <span class="aar-card-badge">THEATER LOG</span>
              </div>
              <div class="aar-metrics-table">
                <div class="aar-metric-row"><span>OPERATIONAL DURATION:</span><b style="color:#00f0ff;">${timeStr}</b></div>
                <div class="aar-metric-row"><span>MISSILES EXPENDED:</span><b style="color:#f8fafc;">${game.stats.missilesLaunched}</b></div>
                <div class="aar-metric-row"><span>ALLIED LOSSES (BLUE):</span><b style="color:${game.stats.blueLosses > 0 ? '#ff3366' : '#00f5a0'};">${game.stats.blueLosses}</b></div>
                <div class="aar-metric-row"><span>HOSTILE LOSSES (RED):</span><b style="color:#38bdf8;">${game.stats.redLosses}</b></div>
              </div>
            </div>

            <div class="aar-report-card">
              <div class="aar-card-head">
                <span class="aar-card-title">TACTICAL EVALUATION &amp; RATING</span>
                <span class="aar-card-badge highlight">SCORE ENGINE</span>
              </div>
              <div class="aar-metrics-table">
                <div class="aar-metric-row"><span>RAW VICTORY POINTS:</span><b><span style="color:#38bdf8;">BLUE ${game.vpAlly}</span> : <span style="color:#ff3366;">RED ${game.vpHostile}</span></b></div>
                <div class="aar-metric-row"><span>AI DIFFICULTY (${scoreData.diffKey}):</span><b style="color:#7dd3fc;">x${scoreData.diffMult.toFixed(2)} MULTIPLIER</b></div>
                <div class="aar-metric-row"><span>BUDGET TIER (${scoreData.budgetCap}M):</span><b style="color:#ffb830;">x${scoreData.budgetMult.toFixed(2)} MULTIPLIER</b></div>
                <div class="aar-metric-row"><span>TOTAL SCORE RATING:</span><b style="color:#00f5a0;">x${scoreData.totalMult.toFixed(2)} MULTIPLIER</b></div>
              </div>
            </div>
          </div>

          <div class="aar-score-banner ${blueWon ? 'victory' : 'defeat'}">
            <div class="aar-banner-lead">
              <span class="aar-banner-status">${blueWon ? 'SORTIE SUCCESSFUL - AIR DOMINANCE' : 'SORTIE TERMINATED - WITHDRAWAL'}</span>
              <span class="aar-banner-sub">Combined Coalition Performance Rating</span>
            </div>
            <div class="aar-banner-score">
              <span class="aar-score-num">${finalSortieScore.toLocaleString()}</span>
              <span class="aar-score-unit">FINAL PTS</span>
            </div>
          </div>
        </div>
      `;
    }

    if (timelineListEl && game.simulation && game.simulation.timelineEvents) {
      timelineListEl.innerHTML = game.simulation.timelineEvents.map(ev => {
        const isKill = ev.type === 'kill' || ev.type === 'ace-kill';
        const isRoe = ev.type === 'roe_penalty';
        const col = ev.type === 'ace-kill' ? '#ffd700' : (isKill ? (ev.team === 'friendly' ? '#00f0ff' : '#ff3366') : (isRoe ? '#f97316' : '#94a3b8'));
        const teamStr = ev.type === 'ace-kill' ? 'ACE SLAIN' : (ev.team ? (ev.team === 'friendly' ? 'BLUE' : 'RED') : '');

        if (isKill) {
          const salvoBadge = ev.isSalvo
            ? `<span class="timeline-salvo-badge">[SALVO x${ev.salvoCount || 2}]</span>`
            : `<span class="timeline-solo-badge">[SOLO]</span>`;

          return (
            `<div class="timeline-entry ${ev.type === 'ace-kill' ? 'ace-kill' : 'kill'}">` +
              `<div class="timeline-main-info">` +
                `<span class="timeline-time">[${ev.time}]</span> ` +
                `<b style="color:${col};">[${teamStr}]</b> ` +
                `<span class="timeline-combatant"><b>${ev.source}</b> <span class="timeline-type">(${ev.sourceType || 'JET'})</span></span> ` +
                `<span class="timeline-verb">neutralized</span> ` +
                `<span class="timeline-combatant"><b>${ev.target}</b> <span class="timeline-type">(${ev.targetType || 'AIRCRAFT'})</span></span> ` +
                `<span class="timeline-weapon-tag">via <b>${ev.weapon || 'Guided Munition'}</b></span> ` +
                salvoBadge +
              `</div>` +
              `<b style="color:${col};white-space:nowrap;">+${ev.points} VP</b>` +
            `</div>`
          );
        } else if (isRoe) {
          return (
            `<div class="timeline-entry roe">` +
              `<div class="timeline-main-info">` +
                `<span class="timeline-time">[${ev.time}]</span> ` +
                `<b style="color:#f97316;">[ROE PENALTY]</b> ` +
                `<span>Civilian Flight <b>${ev.target}</b> destroyed!</span>` +
              `</div>` +
              `<b style="color:#ff3366;white-space:nowrap;">${ev.points} VP</b>` +
            `</div>`
          );
        } else {
          return (
            `<div class="timeline-entry">` +
              `<span>[${ev.time}] ${ev.target}</span>` +
              `<b>${ev.points || 0} VP</b>` +
            `</div>`
          );
        }
      }).join('');
    }

    if (window.Persistence) {
      window.Persistence.recordSortie({
        blueWon: blueWon,
        message: msg,
        duration: timeStr,
        vpBlue: game.vpAlly,
        vpRed: game.vpHostile,
        finalScore: finalSortieScore,
        scoreMultiplier: scoreData.totalMult,
        difficulty: scoreData.diffKey,
        budgetTier: scoreData.budgetTierKey,
        blueLosses: game.stats.blueLosses,
        redLosses: game.stats.redLosses,
        missilesLaunched: game.stats.missilesLaunched,
        pilots: allPilots.map(p => ({
          callsign: p.callsign,
          airframe: p.spec ? p.spec.id : 'JET',
          team: p.team,
          isAce: Boolean(p.isAce),
          kills: p.kills || 0,
          evaded: p.missilesEvadedCount || 0,
          score: p.scorePoints || 0,
          survived: p.hp > 0
        }))
      });
    }

    modal.classList.add('active');
    if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(true);
  }
}

window.AfterActionReportSystem = AfterActionReportSystem;