/**
 * AIRSPACE STANDOFF: AAR Stats & Multiplier Calculator Submodule
 */

class AARStatsCalculator {
  static computeSortieMetrics(game, blueWon, durSec) {
    const scoreData = (game.simulation && game.simulation.scoring)
      ? game.simulation.scoring.getScoreMultipliers()
      : { diffKey: game.aiDifficulty || 'VETERAN', diffMult: 1.0, budgetCap: 400.0, budgetMult: 1.0, totalMult: 1.0 };

    const timeBonus = (game.simulation && game.simulation.scoring)
      ? game.simulation.scoring.calcTimeBonus(durSec, blueWon)
      : 0;

    const engagementEvents = (game.simulation && game.simulation.timelineEvents) || [];
    const blueKills = engagementEvents.filter(event => (event.type === 'kill' || event.type === 'ace-kill') && event.team === 'friendly').length;
    const redKills = engagementEvents.filter(event => (event.type === 'kill' || event.type === 'ace-kill') && event.team === 'hostile').length;
    const blueImpacts = engagementEvents.filter(event => event.type === 'hit' && event.team === 'friendly').length + blueKills;
    const redImpacts = engagementEvents.filter(event => event.type === 'hit' && event.team === 'hostile').length + redKills;
    const roeIncidents = engagementEvents.filter(event => event.type === 'roe_penalty').length;
    const blueMissilesEvaded = (game.alliedAircraft || []).reduce((sum, pilot) => sum + (pilot.missilesEvadedCount || 0), 0);
    const defensiveIntercepts = (game.stats && game.stats.defensiveIntercepts) || 0;

    const rawBlueScore = Number.isFinite(game.vpAlly) ? game.vpAlly : 0;
    const adjustedRawScore = rawBlueScore + timeBonus;
    const finalSortieScore = Math.round(adjustedRawScore * scoreData.totalMult);

    return {
      scoreData, timeBonus, rawBlueScore, adjustedRawScore, finalSortieScore,
      blueKills, redKills, blueImpacts, redImpacts, roeIncidents,
      blueMissilesEvaded, defensiveIntercepts
    };
  }

  static generateReportHtml(game, blueWon, timeStr, metrics) {
    const { scoreData, timeBonus, rawBlueScore, adjustedRawScore, finalSortieScore } = metrics;
    const diffLabel = scoreData.diffKey || game.aiDifficulty || 'VETERAN';
    const budgetCap = scoreData.budgetCap || 400;
    const ordnanceExpended = (game.stats && game.stats.missilesLaunched !== undefined) ? game.stats.missilesLaunched : 0;
    const blueLosses = (game.stats && game.stats.blueLosses !== undefined) ? game.stats.blueLosses : 0;
    const redLosses = (game.stats && game.stats.redLosses !== undefined) ? game.stats.redLosses : 0;

    let bannerStatus = blueWon ? 'MISSION SUCCESSFUL' : 'MISSION ABORTED';
    if (blueWon && finalSortieScore < 0) {
      bannerStatus = 'MISSION COMPLETED - ROE VIOLATIONS';
    }

    return `
      <div class="aar-report-section">
        <div class="aar-report-grid">
          <div class="aar-report-card">
            <div class="aar-card-head">
              <span class="aar-card-title">MISSION TELEMETRY</span>
              <span class="aar-card-badge">LOG</span>
            </div>
            <div class="aar-metrics-table">
              <div class="aar-metric-row"><span>MISSION DURATION:</span><b style="color:#00f0ff;">${timeStr}</b></div>
              <div class="aar-metric-row"><span>SPEED TIME BONUS:</span><b style="color:#00f5a0;">+${timeBonus.toLocaleString()} VP</b></div>
              <div class="aar-metric-row"><span>ORDNANCE EXPENDED:</span><b style="color:#ffffff;">${ordnanceExpended}</b></div>
              <div class="aar-metric-row"><span>FRIENDLY LOSSES (BLUE):</span><b style="color:${blueLosses > 0 ? '#f43f5e' : '#00f5a0'};">${blueLosses}</b></div>
              <div class="aar-metric-row"><span>HOSTILE LOSSES (RED):</span><b style="color:#00f0ff;">${redLosses}</b></div>
            </div>
          </div>

          <div class="aar-report-card">
            <div class="aar-card-head">
              <span class="aar-card-title">PERFORMANCE EVALUATION</span>
              <span class="aar-card-badge highlight">ASSESSMENT</span>
            </div>
            <div class="aar-metrics-table">
              <div class="aar-metric-row"><span>BASE COMBAT VP:</span><b><span style="color:${rawBlueScore < 0 ? '#f43f5e' : '#38bdf8'};">BLUE ${rawBlueScore.toLocaleString()}</span> : <span style="color:#f43f5e;">RED ${(game.vpHostile || 0).toLocaleString()}</span></b></div>
              <div class="aar-metric-row"><span>ADJUSTED BASE VP:</span><b style="color:${adjustedRawScore < 0 ? '#f43f5e' : '#00f5a0'};">${adjustedRawScore.toLocaleString()} VP</b></div>
              <div class="aar-metric-row"><span>DIFFICULTY (${diffLabel}):</span><b style="color:#38bdf8;">x${scoreData.diffMult.toFixed(2)} MULTIPLIER</b></div>
              <div class="aar-metric-row"><span>BUDGET TIER (${budgetCap}M):</span><b style="color:#fbbf24;">x${scoreData.budgetMult.toFixed(2)} MULTIPLIER</b></div>
              <div class="aar-metric-row"><span>FINAL MULTIPLIER:</span><b style="color:#00f5a0;">x${scoreData.totalMult.toFixed(2)} MULTIPLIER</b></div>
            </div>
          </div>
        </div>

        <div class="aar-score-banner ${blueWon && finalSortieScore >= 0 ? 'victory' : 'defeat'}">
          <div class="aar-banner-lead">
            <span class="aar-banner-status">${bannerStatus}</span>
            <span class="aar-banner-sub">Final Performance Score (${adjustedRawScore.toLocaleString()} x ${scoreData.totalMult.toFixed(2)})</span>
          </div>
          <div class="aar-banner-score">
            <span class="aar-score-num" style="color:${finalSortieScore < 0 ? '#f43f5e' : '#ffffff'};">${finalSortieScore.toLocaleString()}</span>
            <span class="aar-score-unit">PTS</span>
          </div>
        </div>
      </div>
    `;
  }
}

window.AARStatsCalculator = AARStatsCalculator;