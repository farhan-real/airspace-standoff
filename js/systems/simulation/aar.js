/**
 * AIRSPACE STANDOFF: Mission Debrief and After Action Report Orchestrator
 * Mathematical parity between participating aircraft points, event timeline, time bonus, and sortie final score.
 */

class AfterActionReportSystem {
  static renderSortieSummary(game, blueWon, msg) {
    const modal = document.getElementById('game-over-modal');
    if (!modal) return;

    const tEl = document.getElementById('game-over-title');
    const dEl = document.getElementById('game-over-desc');
    const sEl = document.getElementById('game-over-stats');
    const podiumEl = document.getElementById('ace-podium-cards');
    const fullRosterContainer = document.getElementById('aar-full-roster-content');

    const sortieElapsed = game.simulation && Number.isFinite(game.simulation.elapsedTimeSec)
      ? game.simulation.elapsedTimeSec
      : (performance.now() - (game.matchStartTime || performance.now())) / 1000;
    const durSec = Math.max(1, Math.round(sortieElapsed));
    const min = Math.floor(durSec / 60);
    const sec = durSec % 60;
    const timeStr = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');

    if (tEl) {
      tEl.textContent = blueWon ? 'MISSION SUCCESSFUL' : 'MISSION ABORTED';
      tEl.style.color = blueWon ? 'var(--color-ice-highlight)' : 'var(--color-red)';
    }
    if (dEl) {
      const sortieNote = game.isMissionEditorMatch ? ' · CUSTOM EDITOR SORTIE · NOT LEADERBOARD RANKED' : '';
      dEl.textContent = `${msg || 'OPERATIONAL SUMMARY'}${sortieNote}`;
    }

    const allPilots = [...game.alliedAircraft, ...game.hostileAircraft];
    allPilots.sort((a, b) => (b.scorePoints || 0) - (a.scorePoints || 0));

    const topThree = allPilots.slice(0, 3);

    if (podiumEl) {
      const rankNames = ['TOP SCORING PILOT', '2ND HIGHEST SCORE', '3RD HIGHEST SCORE'];
      podiumEl.innerHTML = topThree.map((p, idx) => {
        const rankClass = 'rank-' + (idx + 1);
        const teamName = p.team === 'friendly' ? 'BLUE' : 'RED';
        const teamColor = p.isAce ? '#ffd700' : (p.team === 'friendly' ? 'var(--theme-accent)' : 'var(--color-red)');
        const teamTag = p.isAce ? `${teamName} ACE` : teamName;

        return `
          <div class="ace-card ${rankClass}">
            <div class="ace-rank-title"><span>#${idx + 1} - ${rankNames[idx]}</span> <b style="color:${teamColor}">[${teamTag}]</b></div>
            <div class="ace-callsign">${p.callsign || 'PILOT'}</div>
            <div class="ace-sub">${p.spec ? p.spec.name : 'AIRCRAFT'} - ${p.squadronName || (p.team === 'friendly' ? 'Allied Fleet' : 'Hostile Fleet')}</div>
            <div class="ace-stats">
              <span>KILLS: <b>${p.kills || 0}</b></span>
              <span>EVADED: <b>${p.missilesEvadedCount || 0}</b></span>
              <span>POINTS: <b>${p.scorePoints || 0}</b></span>
            </div>
          </div>
        `;
      }).join('');
    }

    if (fullRosterContainer) {
      const rowsHtml = allPilots.map((p, i) => {
        const isBlue = (p.team === 'friendly');
        const col = isBlue ? 'var(--theme-accent)' : 'var(--color-red)';
        const isAlive = p.hp > 0.05;
        const displayHp = isAlive ? Math.max(1, Math.round(p.hp)) : 0;
        const statusStr = isAlive
          ? `<b style="color:var(--stat-tier-2);">SURVIVED (${displayHp} HP)</b>`
          : `<span style="color:var(--color-red);">DESTROYED</span>`;
        const aceBadge = p.isAce
          ? `<img src="icons/diamond.svg" width="10" height="10" alt="Ace" style="vertical-align:middle;margin-left:3px;" title="Ace Pilot">`
          : '';
        const rankClass = i === 0 ? 'rank-gold' : (i === 1 ? 'rank-silver' : (i === 2 ? 'rank-bronze' : 'rank-standard'));
        const rowClass = i === 0 ? 'top-scoring-row' : '';

        return `
          <tr class="${rowClass}">
            <td><span class="leaderboard-rank-tag ${rankClass}">#${i + 1}</span></td>
            <td style="color:${col};font-weight:700;">${p.callsign || 'PILOT'}${aceBadge}</td>
            <td style="color:var(--color-moon-mist);">${p.spec ? p.spec.id : 'AIRCRAFT'}</td>
            <td><b style="color:${col};">[${isBlue ? 'BLUE' : 'RED'}]</b></td>
            <td style="color:#ffffff;font-family:var(--font-dotdigital);">${p.kills || 0}</td>
            <td style="color:var(--color-moon-mist);font-family:var(--font-dotdigital);">${p.missilesEvadedCount || 0}</td>
            <td style="color:var(--stat-tier-2);font-weight:700;font-family:var(--font-dotdigital);">${(p.scorePoints || 0).toLocaleString()}</td>
            <td>${statusStr}</td>
          </tr>
        `;
      }).join('');

      fullRosterContainer.innerHTML = `
        <table class="debrief-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>CALLSIGN</th>
              <th>AIRCRAFT</th>
              <th>FORCE</th>
              <th>KILLS</th>
              <th>EVADED</th>
              <th>POINTS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    }

    const scoreData = (game.simulation && game.simulation.scoring)
      ? game.simulation.scoring.getScoreMultipliers()
      : { diffKey: game.aiDifficulty, diffMult: 1.0, budgetCap: 400.0, budgetMult: 1.0, totalMult: 1.0 };

    const timeBonus = (game.simulation && game.simulation.scoring)
      ? game.simulation.scoring.calcTimeBonus(durSec, blueWon)
      : 0;

    const engagementEvents = (game.simulation && game.simulation.timelineEvents) || [];
    const blueKills = engagementEvents.filter(event => (event.type === 'kill' || event.type === 'ace-kill') && event.team === 'friendly').length;
    const redKills = engagementEvents.filter(event => (event.type === 'kill' || event.type === 'ace-kill') && event.team === 'hostile').length;
    const blueImpacts = engagementEvents.filter(event => event.type === 'hit' && event.team === 'friendly').length + blueKills;
    const redImpacts = engagementEvents.filter(event => event.type === 'hit' && event.team === 'hostile').length + redKills;
    const roeIncidents = engagementEvents.filter(event => event.type === 'roe_penalty').length;
    const blueMissilesEvaded = game.alliedAircraft.reduce((sum, pilot) => sum + (pilot.missilesEvadedCount || 0), 0);
    const defensiveIntercepts = game.stats.defensiveIntercepts || 0;

    const rawBlueScore = game.vpAlly || 0;
    const adjustedRawScore = rawBlueScore + timeBonus;
    const finalSortieScore = Math.round(adjustedRawScore * scoreData.totalMult);

    if (sEl) {
      sEl.innerHTML = `
        <div class="aar-report-section">
          <div class="aar-report-grid">
            <div class="aar-report-card">
              <div class="aar-card-head">
                <span class="aar-card-title">MISSION TELEMETRY</span>
                <span class="aar-card-badge">LOG</span>
              </div>
              <div class="aar-metrics-table">
                <div class="aar-metric-row"><span>MISSION DURATION:</span><b style="color:var(--theme-accent);">${timeStr}</b></div>
                <div class="aar-metric-row"><span>SPEED TIME BONUS:</span><b style="color:var(--stat-tier-2);">+${timeBonus.toLocaleString()} VP</b></div>
                <div class="aar-metric-row"><span>COMMANDER WEAPON RELEASES:</span><b style="color:#f8fafc;">${game.stats.missilesLaunched}</b></div>
                <div class="aar-metric-row"><span>FRIENDLY LOSSES (BLUE):</span><b style="color:${game.stats.blueLosses > 0 ? 'var(--color-red)' : 'var(--stat-tier-2)'};">${game.stats.blueLosses}</b></div>
                <div class="aar-metric-row"><span>HOSTILE LOSSES (RED):</span><b style="color:var(--theme-accent);">${game.stats.redLosses}</b></div>
              </div>
            </div>

            <div class="aar-report-card">
              <div class="aar-card-head">
                <span class="aar-card-title">PERFORMANCE EVALUATION</span>
                <span class="aar-card-badge highlight">ASSESSMENT</span>
              </div>
              <div class="aar-metrics-table">
                <div class="aar-metric-row"><span>BASE COMBAT VP:</span><b><span style="color:var(--theme-accent);">BLUE ${rawBlueScore.toLocaleString()}</span> : <span style="color:var(--color-red);">RED ${game.vpHostile.toLocaleString()}</span></b></div>
                <div class="aar-metric-row"><span>ADJUSTED BASE VP:</span><b style="color:var(--stat-tier-2);">${adjustedRawScore.toLocaleString()} VP</b></div>
                <div class="aar-metric-row"><span>DIFFICULTY (${scoreData.diffKey}):</span><b style="color:var(--theme-accent);">x${scoreData.diffMult.toFixed(2)} MULTIPLIER</b></div>
                <div class="aar-metric-row"><span>BUDGET TIER (${scoreData.budgetCap}M):</span><b style="color:var(--stat-tier-3);">x${scoreData.budgetMult.toFixed(2)} MULTIPLIER</b></div>
                <div class="aar-metric-row"><span>FINAL MULTIPLIER:</span><b style="color:var(--stat-tier-2);">x${scoreData.totalMult.toFixed(2)} MULTIPLIER</b></div>
              </div>
            </div>

            <div class="aar-report-card">
              <div class="aar-card-head">
                <span class="aar-card-title">ENGAGEMENT RESULTS</span>
                <span class="aar-card-badge">TACTICAL</span>
              </div>
              <div class="aar-metrics-table">
                <div class="aar-metric-row"><span>BLUE CONFIRMED IMPACTS:</span><b style="color:var(--theme-accent);">${blueImpacts}</b></div>
                <div class="aar-metric-row"><span>RED CONFIRMED IMPACTS:</span><b style="color:var(--color-red);">${redImpacts}</b></div>
                <div class="aar-metric-row"><span>BLUE TARGETS DESTROYED:</span><b style="color:var(--theme-accent);">${blueKills}</b></div>
                <div class="aar-metric-row"><span>RED TARGETS DESTROYED:</span><b style="color:var(--color-red);">${redKills}</b></div>
                <div class="aar-metric-row"><span>BLUE MISSILES EVADED:</span><b>${blueMissilesEvaded}</b></div>
                <div class="aar-metric-row"><span>DEFENSIVE INTERCEPTS:</span><b>${defensiveIntercepts}</b></div>
                <div class="aar-metric-row"><span>ROE INCIDENTS:</span><b style="color:${roeIncidents > 0 ? 'var(--color-red)' : 'var(--stat-tier-2)'};">${roeIncidents}</b></div>
              </div>
            </div>
          </div>

          <div class="aar-score-banner ${blueWon ? 'victory' : 'defeat'}">
            <div class="aar-banner-lead">
              <span class="aar-banner-status">${blueWon ? 'MISSION SUCCESSFUL - OBJECTIVES COMPLETED' : 'MISSION ABORTED'}</span>
              <span class="aar-banner-sub">Final Performance Score (${adjustedRawScore.toLocaleString()} x ${scoreData.totalMult.toFixed(2)})</span>
            </div>
            <div class="aar-banner-score">
              <span class="aar-score-num">${finalSortieScore.toLocaleString()}</span>
              <span class="aar-score-unit">PTS</span>
            </div>
          </div>
        </div>
      `;
    }

    if (typeof AfterActionReportTimeline !== 'undefined') {
      AfterActionReportTimeline.renderTimeline(game, blueWon);
    }

    const topPilot = allPilots.find(p => p.team === 'friendly') || allPilots[0] || null;
    const archivedTopThree = topThree.map((p, idx) => ({
      rank: idx + 1,
      callsign: p.callsign || 'Pilot',
      model: p.spec ? p.spec.id : 'JET',
      team: p.team || 'friendly',
      isAce: Boolean(p.isAce),
      kills: p.kills || 0,
      evaded: p.missilesEvadedCount || 0,
      points: p.scorePoints || 0,
      survived: p.hp > 0.05
    }));

    const archivedTimeline = (typeof AfterActionReportTimeline !== 'undefined' && AfterActionReportTimeline.getMergedTimelineEvents)
      ? AfterActionReportTimeline.getMergedTimelineEvents(game)
      : ((game.simulation && game.simulation.timelineEvents) ? [...game.simulation.timelineEvents] : []);

    if (!game.isMissionEditorMatch && window.Persistence && window.Persistence.saveTopSortie) {
      window.Persistence.saveTopSortie({
        id: 'SORTIE_' + Date.now(),
        date: new Date().toLocaleDateString(),
        timeStr: timeStr,
        durationSec: durSec,
        squadronName: game.squadronName || '7th Tactical Squadron',
        outcome: blueWon ? 'VICTORY' : 'ABORTED',
        blueWon: blueWon,
        rawScore: rawBlueScore,
        timeBonus: timeBonus,
        totalScore: finalSortieScore,
        difficulty: scoreData.diffKey,
        diffMult: scoreData.diffMult,
        budgetTier: scoreData.budgetCap,
        budgetMult: scoreData.budgetMult,
        totalMult: scoreData.totalMult,
        blueLosses: game.stats.blueLosses,
        redLosses: game.stats.redLosses,
        combatSummary: { blueImpacts, redImpacts, blueKills, redKills, roeIncidents, blueMissilesEvaded, defensiveIntercepts },
        topPilot: {
          callsign: topPilot ? topPilot.callsign : 'Pilot',
          model: topPilot && topPilot.spec ? topPilot.spec.id : 'JET',
          kills: topPilot ? topPilot.kills : 0,
          points: topPilot ? topPilot.scorePoints : 0
        },
        topPilots: archivedTopThree,
        timeline: archivedTimeline,
        replay: window.AfterActionReplay && typeof window.AfterActionReplay.encode === 'function'
          ? window.AfterActionReplay.encode((game.simulation && game.simulation.replaySnapshots) || [])
          : null,
        pilots: allPilots.filter(p => p.team === 'friendly').map(p => ({
          callsign: p.callsign || 'Pilot',
          model: p.spec ? p.spec.id : 'JET',
          kills: p.kills || 0,
          scorePoints: p.scorePoints || 0,
          survived: p.hp > 0.05
        }))
      });
    }

    const toggleRosterBtn = document.getElementById('btn-toggle-aar-roster');
    if (toggleRosterBtn && fullRosterContainer) {
      fullRosterContainer.classList.remove('hidden');
      fullRosterContainer.style.display = 'block';
      toggleRosterBtn.textContent = 'COLLAPSE';
      toggleRosterBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = fullRosterContainer.classList.contains('hidden') || fullRosterContainer.style.display === 'none';
        if (isHidden) {
          fullRosterContainer.classList.remove('hidden');
          fullRosterContainer.style.display = 'block';
          toggleRosterBtn.textContent = 'COLLAPSE';
        } else {
          fullRosterContainer.classList.add('hidden');
          fullRosterContainer.style.display = 'none';
          toggleRosterBtn.textContent = 'EXPAND';
        }
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    }

    modal.classList.add('active');
    if (window.AfterActionReplay && typeof window.AfterActionReplay.show === 'function') {
      window.AfterActionReplay.show(game);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(true);
  }
}

window.AfterActionReportSystem = AfterActionReportSystem; 
