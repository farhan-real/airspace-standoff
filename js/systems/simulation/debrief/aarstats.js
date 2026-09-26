/**
 * AIRSPACE STANDOFF: AAR Stats & Multiplier Calculator Submodule
 */

class AARStatsCalculator {
  static computeSortieMetrics(game, blueWon, durSec) {
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

    return {
      scoreData, timeBonus, rawBlueScore, adjustedRawScore, finalSortieScore,
      blueKills, redKills, blueImpacts, redImpacts, roeIncidents,
      blueMissilesEvaded, defensiveIntercepts
    };
  }

  static generateReportHtml(game, blueWon, timeStr, metrics) {
    const { scoreData, timeBonus, rawBlueScore, adjustedRawScore, finalSortieScore,
      blueKills, redKills, blueImpacts, redImpacts, roeIncidents,
      blueMissilesEvaded, defensiveIntercepts } = metrics;

    return `
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
}

window.AARStatsCalculator = AARStatsCalculator;