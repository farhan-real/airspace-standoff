/**
 * AIRSPACE STANDOFF: Mission Debrief and After Action Report Orchestrator
 * Mathematical parity between participating aircraft points, event timeline, time bonus, and sortie final score.
 */

class DebriefReportSystem {
  static downsampleFleetHistory(history, maxPoints = 120) {
    if (!history || history.length <= maxPoints) return history || [];
    const stride = Math.ceil(history.length / maxPoints);
    return history.filter((_, idx) => idx % stride === 0 || idx === history.length - 1);
  }

  static renderSortieSummary(game, blueWon, msg) {
    if (window.ModalDebriefTemplate && typeof window.ModalDebriefTemplate.ensure === 'function') {
      window.ModalDebriefTemplate.ensure();
    }
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
      tEl.style.color = blueWon ? '#38bdf8' : '#f43f5e';
    }
    if (dEl) {
      const sortieNote = game.isMissionEditorMatch ? ' - CUSTOM EDITOR SORTIE - NOT LEADERBOARD RANKED' : '';
      dEl.textContent = `${msg || 'OPERATIONAL SUMMARY'}${sortieNote}`;
    }

    const allPilots = [...game.alliedAircraft, ...game.hostileAircraft];
    allPilots.sort((a, b) => (b.scorePoints || 0) - (a.scorePoints || 0));

    const topThree = allPilots.slice(0, 3);

    if (podiumEl) {
      const rankNames = ['TOP SCORING PILOT', '2ND HIGHEST SCORE', '3RD HIGHEST SCORE'];
      podiumEl.innerHTML = topThree.map((p, idx) => {
        const rankClass = 'rank-' + (idx + 1);
        const isBlue = (p.team === 'friendly');
        const teamClass = isBlue ? 'team-blue' : 'team-red';
        const teamName = isBlue ? 'BLUE' : 'RED';
        const teamColor = p.isAce ? '#ffd700' : (isBlue ? '#38bdf8' : '#f43f5e');
        const teamTag = p.isAce ? `${teamName} ACE` : teamName;

        return `
          <div class="ace-card ${rankClass} ${teamClass}">
            <div class="ace-rank-title"><span>#${idx + 1} - ${rankNames[idx]}</span> <b style="color:${teamColor}">[${teamTag}]</b></div>
            <div class="ace-callsign">${p.callsign || 'PILOT'}</div>
            <div class="ace-sub">${p.spec ? p.spec.name : 'AIRCRAFT'} - ${p.squadronName || (isBlue ? 'Allied Fleet' : 'Hostile Fleet')}</div>
            <div class="ace-stats">
              <span>KILLS: <b>${p.kills || 0}</b></span>
              <span>EVADED: <b>${p.missilesEvadedCount || 0}</b></span>
              <span>POINTS: <b>${p.scorePoints || 0}</b></span>
            </div>
          </div>`;
      }).join('');
    }

    if (fullRosterContainer) {
      const rowsHtml = allPilots.map((p, i) => {
        const isBlue = (p.team === 'friendly');
        const teamClass = isBlue ? 'team-blue' : 'team-red';
        const col = isBlue ? '#38bdf8' : '#f43f5e';
        const isAlive = p.hp > 0.05;
        const displayHp = isAlive ? Math.max(1, Math.round(p.hp)) : 0;
        const statusStr = isAlive
          ? `<b style="color:var(--stat-tier-2);">SURVIVED (${displayHp} HP)</b>`
          : `<span style="color:#f43f5e;">DESTROYED</span>`;
        const aceBadge = p.isAce
          ? `<img src="icons/diamond.svg" width="10" height="10" alt="Ace" style="vertical-align:middle;margin-left:3px;" title="Ace Pilot">`
          : '';
        const rankClass = i === 0 ? 'rank-gold' : (i === 1 ? 'rank-silver' : (i === 2 ? 'rank-bronze' : 'rank-standard'));
        const rowClass = `${teamClass} ${i === 0 ? 'top-scoring-row' : ''}`;

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

    const metrics = AARStatsCalculator.computeSortieMetrics(game, blueWon, durSec);

    if (sEl) {
      sEl.innerHTML = AARStatsCalculator.generateReportHtml(game, blueWon, timeStr, metrics);
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
      ? AfterActionReportTimeline.getMergedTimelineEvents(game, blueWon)
      : ((game.simulation && game.simulation.timelineEvents) ? [...game.simulation.timelineEvents] : []);

    const difficultyDisplayName = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[metrics.scoreData.diffKey])
      ? window.AI_DIFFICULTIES[metrics.scoreData.diffKey].name
      : (metrics.scoreData.diffName || metrics.scoreData.diffKey);

    const difficultyKey = metrics.scoreData.diffKey || game.aiDifficulty || 'VETERAN';

    const archivedFleetPower = this.downsampleFleetHistory(
      (game.simulation && game.simulation.fleetStrengthHistory) ? game.simulation.fleetStrengthHistory : []
    );

    if (!game.isMissionEditorMatch && window.Persistence && window.Persistence.saveTopSortie) {
      window.Persistence.saveTopSortie({
        id: 'SORTIE_' + Date.now(),
        date: new Date().toLocaleDateString(),
        timeStr: timeStr,
        durationSec: durSec,
        squadronName: game.squadronName || '7th Tactical Squadron',
        outcome: blueWon ? 'VICTORY' : 'ABORTED',
        blueWon: blueWon,
        rawScore: metrics.rawBlueScore,
        timeBonus: metrics.timeBonus,
        totalScore: metrics.finalSortieScore,
        difficulty: difficultyKey,
        difficultyName: difficultyDisplayName,
        diffMult: metrics.scoreData.diffMult,
        budgetTier: metrics.scoreData.budgetCap,
        budgetMult: metrics.scoreData.budgetMult,
        totalMult: metrics.scoreData.totalMult,
        blueLosses: game.stats.blueLosses,
        redLosses: game.stats.redLosses,
        combatSummary: {
          blueImpacts: metrics.blueImpacts, redImpacts: metrics.redImpacts,
          blueKills: metrics.blueKills, redKills: metrics.redKills,
          roeIncidents: metrics.roeIncidents, blueMissilesEvaded: metrics.blueMissilesEvaded,
          defensiveIntercepts: metrics.defensiveIntercepts
        },
        topPilot: {
          callsign: topPilot ? topPilot.callsign : 'Pilot',
          model: topPilot && topPilot.spec ? topPilot.spec.id : 'JET',
          kills: topPilot ? topPilot.kills : 0,
          points: topPilot ? topPilot.scorePoints : 0
        },
        topPilots: archivedTopThree,
        timeline: archivedTimeline,
        fleetPower: archivedFleetPower,
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

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.onclick = () => {
        if (window.AfterActionReplay && typeof window.AfterActionReplay.stop === 'function') window.AfterActionReplay.stop();
        if (window.MissionEditor && typeof window.MissionEditor.restoreBaseSettings === 'function') {
          window.MissionEditor.restoreBaseSettings(game);
        }
        modal.classList.remove('active');
        game.returnToHangar();
      };
    }

    modal.classList.add('active');

    const powerCanvas = document.getElementById('aar-fleet-power-canvas');
    if (powerCanvas && typeof FleetPowerRenderer !== 'undefined') {
      requestAnimationFrame(() => {
        FleetPowerRenderer.renderCanvas(powerCanvas, game);
      });
    }

    if (window.AfterActionReplay && typeof window.AfterActionReplay.show === 'function') {
      window.AfterActionReplay.show(game);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(true);
  }
}

window.DebriefReportSystem = DebriefReportSystem;