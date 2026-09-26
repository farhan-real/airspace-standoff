/**
 * AIRSPACE STANDOFF: Leaderboard Sortie Dossier Submodule
 * Renders individual historical sorties, ace podiums, timelines, and replay views.
 */

class LeaderboardDossierRenderer {
  static renderDetail(item, itemIdx = 0, onRecordDeleted) {
    const detailContainer = document.getElementById('leaderboard-detail-view');
    if (!detailContainer || !item) return;

    const timeBonusVal = item.timeBonus || 0;
    const pilots = item.pilots || [];
    const topThreePilots = (item.topPilots && item.topPilots.length > 0)
      ? item.topPilots
      : (pilots.slice(0, 3).map((p, idx) => ({
          rank: idx + 1, callsign: p.callsign || 'Pilot', model: p.model || 'JET',
          team: 'friendly', isAce: false, kills: p.kills || 0, evaded: 0,
          points: p.scorePoints || p.points || 0, survived: p.survived
        })));

    const podiumCardsHtml = topThreePilots.map((p, idx) => {
      const rankClass = 'rank-' + (p.rank || idx + 1);
      const isBlue = (p.team === 'friendly');
      const teamTag = p.isAce ? `${isBlue ? 'BLUE' : 'RED'} ACE` : (isBlue ? 'BLUE' : 'RED');
      const teamColor = p.isAce ? '#ffd700' : (isBlue ? '#00f0ff' : '#ff3366');
      return `
        <div class="dossier-podium-card ${rankClass}">
          <div class="dossier-podium-head"><span style="color:#ffffff;">#${p.rank || idx + 1} PILOT</span><b style="color:${teamColor};">[${teamTag}]</b></div>
          <div class="dossier-podium-cs">${p.callsign || 'Pilot'}</div>
          <div class="dossier-podium-sub">${p.model || 'JET'} &bull; <span style="color:${p.survived ? '#00f5a0' : '#ef4444'};">${p.survived ? 'SURVIVED' : 'LOST'}</span></div>
          <div class="dossier-podium-metrics">
            <span><b>${p.kills || 0}</b> KILLS</span><span><b>${p.evaded || 0}</b> EVADED</span><b style="color:#00f5a0;">${(p.points || 0).toLocaleString()} VP</b>
          </div>
        </div>`;
    }).join('');

    const timelineEvents = item.timeline || [];
    const combatSummary = item.combatSummary || {};
    const summaryValue = (key) => item.combatSummary ? (combatSummary[key] || 0) : '—';
    const timelineHtml = (timelineEvents.length > 0)
      ? timelineEvents.map(ev => LeaderboardDossierRenderer.renderTimelineEvent(ev)).join('')
      : `<div style="color:#8494ab;font-size:0.62rem;font-style:italic;padding:8px 0;">No chronological engagement events archived for this sortie.</div>`;

    const pilotsListHtml = pilots.map((p, pIdx) => `
      <div class="dossier-roster-item">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:#8494ab;font-family:var(--font-dotdigital);font-size:0.58rem;">#${pIdx + 1}</span>
          <b style="color:#ffffff;">${p.callsign || 'Pilot'}</b>
          <span style="color:var(--color-moon-mist);font-size:0.58rem;">[${p.model || 'JET'}]</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-dotdigital);">
          <span style="color:${p.survived ? 'var(--stat-tier-2)' : 'var(--color-red)'};font-weight:600;">${p.survived ? 'SURVIVED' : 'LOST'}</span>
          <span style="color:var(--color-moon-mist);font-size:0.58rem;">${p.kills || 0} KILLS</span>
          <b style="color:var(--stat-tier-2);">${(p.scorePoints || p.points || 0).toLocaleString()} VP</b>
        </div>
      </div>`).join('');

    detailContainer.innerHTML = `
      <div class="dossier-header-box">
        <div>
          <div class="dossier-title">${item.squadronName || '7th Tactical Squadron'}</div>
          <span style="color:#8494ab;font-size:0.58rem;">SORTIE ARCHIVE RECORD &bull; ${item.date || ''}</span>
        </div>
        <div class="dossier-header-right">
          <button type="button" class="hud-btn small alert btn-delete-sortie" id="btn-delete-sortie" title="Delete this match record" aria-label="Delete sortie">
            <img src="icons/trash.svg" class="btn-vector-ico" width="12" height="12" alt="Delete">
          </button>
          <div class="dossier-score-block">
            <div class="dossier-score-num">${(item.totalScore || 0).toLocaleString()}</div>
            <span class="dossier-score-unit">POINTS</span>
          </div>
        </div>
      </div>

      <div class="dossier-meta-grid">
        <div class="dossier-card">
          <div style="color:#00f0ff;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">ENGAGEMENT METRICS</div>
          <div class="dossier-row"><span>MISSION STATUS:</span><b style="color:${item.blueWon ? '#00f5a0' : '#f97316'};">${item.outcome || 'COMPLETED'}</b></div>
          <div class="dossier-row"><span>SORTIE DURATION:</span><b style="color:#00f0ff;">${item.timeStr || '00:00'}</b></div>
          <div class="dossier-row"><span>SPEED TIME BONUS:</span><b class="time-bonus-tag">+${timeBonusVal.toLocaleString()} VP</b></div>
          <div class="dossier-row"><span>BASE RAW SCORE:</span><b>${(item.rawScore || 0).toLocaleString()} VP</b></div>
          <div class="dossier-row"><span>BLUE IMPACTS / KILLS:</span><b>${item.combatSummary ? `${summaryValue('blueImpacts')} / ${summaryValue('blueKills')}` : '—'}</b></div>
          <div class="dossier-row"><span>RED IMPACTS / KILLS:</span><b>${item.combatSummary ? `${summaryValue('redImpacts')} / ${summaryValue('redKills')}` : '—'}</b></div>
          <div class="dossier-row"><span>BLUE MISSILES EVADED:</span><b>${summaryValue('blueMissilesEvaded')}</b></div>
          <div class="dossier-row"><span>DEFENSIVE INTERCEPTS:</span><b>${summaryValue('defensiveIntercepts')}</b></div>
          <div class="dossier-row"><span>ROE INCIDENTS:</span><b>${summaryValue('roeIncidents')}</b></div>
        </div>

        <div class="dossier-card">
          <div style="color:#ffd700;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">THEATER MULTIPLIERS</div>
          <div class="dossier-row"><span>DIFFICULTY (${item.difficulty || 'VETERAN'}):</span><b>x${(item.diffMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>BUDGET TIER (${item.budgetTier || 400}M):</span><b>x${(item.budgetMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>TOTAL MULTIPLIER:</span><b style="color:#00f5a0;">x${(item.totalMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>AIR LOSSES:</span><span>BLUE: ${item.blueLosses || 0} &bull; RED: ${item.redLosses || 0}</span></div>
        </div>
      </div>

      <div class="aar-replay-container dossier-replay-container">
        <div class="aar-replay-heading">
          <span class="strip-subhead" style="color:#7dd3fc;margin:0;border-bottom:none;">SORTIE REPLAY</span>
          <span class="aar-replay-status">LOADING ARCHIVED PLAYBACK</span>
        </div>
        <canvas class="aar-replay-canvas" aria-label="Tactical replay of the archived sortie"></canvas>
        <div class="aar-replay-controls">
          <button type="button" class="hud-btn small aar-replay-play">PLAY</button>
          <button type="button" class="hud-btn small aar-replay-restart">RESTART</button>
          <button type="button" class="hud-btn small aar-replay-speed">1x SPEED</button>
          <input type="range" class="aar-replay-slider" min="0" max="1" step="0.1" value="0" aria-label="Archived replay position">
          <span class="aar-replay-clock">00:00 / 00:00</span>
        </div>
        <div class="aar-replay-events" aria-label="Archived replay event jump points"></div>
      </div>

      <div class="dossier-card">
        <div style="color:#ffd700;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:4px;">TOP 3 FLIGHT ACES</div>
        <div class="dossier-podium-grid">${podiumCardsHtml}</div>
      </div>

      <div class="dossier-timeline-container">
        <div style="color:#00f0ff;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;display:flex;justify-content:space-between;align-items:center;">
          <span>SORTIE ENGAGEMENT TIMELINE</span>
          <span style="color:#8494ab;font-size:0.56rem;">${timelineEvents.length} EVENTS RECORDED</span>
        </div>
        <div class="dossier-timeline-list">${timelineHtml}</div>
      </div>

      <div class="dossier-roster-card">
        <div style="color:#7dd3fc;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;display:flex;justify-content:space-between;">
          <span>SQUADRON PARTICIPATING ROSTER</span>
          <span style="color:#8494ab;font-size:0.56rem;">${pilots.length} AIRCRAFT ASSIGNED</span>
        </div>
        <div class="dossier-roster-list">${pilotsListHtml || '<span style="color:#8494ab;font-size:0.60rem;font-style:italic;">No pilot records found.</span>'}</div>
      </div>`;

    if (window.AfterActionReplay && typeof window.AfterActionReplay.showArchived === 'function') {
      window.AfterActionReplay.showArchived(
        detailContainer.querySelector('.dossier-replay-container'),
        item.replay,
        timelineEvents
      );
    }

    const deleteBtn = detailContainer.querySelector('#btn-delete-sortie');
    if (deleteBtn) {
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        const confirmMsg = `Delete sortie record for "${item.squadronName || 'Squadron'}" (${(item.totalScore || 0).toLocaleString()} PTS)?`;
        const doDelete = () => {
          if (window.Persistence && typeof window.Persistence.deleteTopSortie === 'function') {
            window.Persistence.deleteTopSortie(item.id !== undefined ? item.id : itemIdx);
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          if (onRecordDeleted) onRecordDeleted();
        };

        if (window.Game && window.Game.procurement && typeof window.Game.procurement.showConfirmModal === 'function') {
          window.Game.procurement.showConfirmModal('DELETE SORTIE', confirmMsg, doDelete, { confirmText: 'DELETE', isAlert: true });
        } else if (window.confirm(confirmMsg)) {
          doDelete();
        }
      };
    }
  }

  static renderTimelineEvent(ev) {
    const isKill = ev.type === 'kill' || ev.type === 'ace-kill';
    const isRoe = ev.type === 'roe_penalty';
    const isHit = ev.type === 'hit';
    const isTimeBonus = ev.type === 'time_bonus';
    const isVictory = ev.type === 'victory';
    const col = isVictory ? '#00f0ff' : (ev.type === 'ace-kill' ? '#ffd700' : (isTimeBonus ? '#00f5a0' : (isKill ? (ev.team === 'friendly' ? '#00f0ff' : '#ff3366') : (isRoe ? '#f97316' : (isHit ? '#38bdf8' : '#94a3b8')))));
    const teamStr = isVictory ? 'VICTORY' : (isTimeBonus ? 'TIME BONUS' : (ev.type === 'ace-kill' ? 'LEADER DOWN' : (ev.team ? (ev.team === 'friendly' ? 'BLUE' : 'RED') : '')));
    const salvoBadge = ev.isSalvo ? `<span class="timeline-salvo-badge" style="color:#00f0ff;font-size:0.56rem;margin-left:4px;">[Salvo: ${ev.salvoBreakdown || ('x' + (ev.salvoCount || 2))}]</span>` : '';

    if (isVictory) {
      return `
        <div class="timeline-entry victory-entry">
          <div class="timeline-main-info"><span class="timeline-time">[${ev.time || '00:00'}]</span> <b style="color:#00f0ff;">[MISSION COMPLETE]</b> <span class="timeline-combatant"><b>${ev.source || 'Squadron'}</b> secured theater air dominance</span></div>
          <b style="color:#00f0ff;white-space:nowrap;">AIR DOMINANCE</b>
        </div>`;
    } else if (isTimeBonus) {
      return `
        <div class="timeline-entry" style="background:rgba(0,245,160,0.08);border-left:2px solid #00f5a0;">
          <div class="timeline-main-info"><span class="timeline-time">[${ev.time || '00:00'}]</span> <b style="color:#00f5a0;">[SPEED BONUS]</b> <span>Rapid air neutralization speed bonus</span></div>
          <b style="color:#00f5a0;white-space:nowrap;">+${(ev.points || 0).toLocaleString()} VP</b>
        </div>`;
    } else if (isKill) {
      return `
        <div class="timeline-entry ${ev.type === 'ace-kill' ? 'ace-kill' : 'kill'}">
          <div class="timeline-main-info">
            <span class="timeline-time">[${ev.time || '00:00'}]</span>
            <b style="color:${col};">[${teamStr}]</b>
            <span class="timeline-combatant"><b>${ev.source || 'PILOT'}</b> (${ev.sourceType || 'AIRCRAFT'})</span>
            <span>destroyed</span>
            <span class="timeline-combatant"><b>${ev.target || 'TARGET'}</b> (${ev.targetType || 'TARGET'})</span>
            <span class="timeline-weapon-tag">using <b>${ev.weapon || 'Missile'}</b></span>
            ${salvoBadge}
          </div>
          <b style="color:${col};white-space:nowrap;">+${(ev.points || 0).toLocaleString()} VP</b>
        </div>`;
    } else if (isHit) {
      return `
        <div class="timeline-entry hit">
          <div class="timeline-main-info">
            <span class="timeline-time">[${ev.time || '00:00'}]</span>
            <b style="color:#38bdf8;">[${teamStr}]</b>
            <span class="timeline-combatant"><b>${ev.source || 'PILOT'}</b> (${ev.sourceType || 'AIRCRAFT'})</span>
            <span>struck</span>
            <span class="timeline-combatant"><b>${ev.target || 'TARGET'}</b> (${ev.targetType || 'TARGET'})</span>
            <span class="timeline-weapon-tag">with <b>${ev.weapon || 'Missile'}</b> (-${ev.damage || 2} HP)</span>
            ${salvoBadge}
          </div>
          <b style="color:#64748b;white-space:nowrap;">STRIKE</b>
        </div>`;
    } else if (isRoe) {
      return `
        <div class="timeline-entry roe">
          <div class="timeline-main-info"><span class="timeline-time">[${ev.time || '00:00'}]</span> <b style="color:#f97316;">[ROE PENALTY]</b> <span>${ev.reason || 'Civilian engagement violation'}</span></div>
          <b style="color:#ff3366;white-space:nowrap;">${ev.points || 0} VP</b>
        </div>`;
    }
    return `
      <div class="timeline-entry">
        <div class="timeline-main-info"><span class="timeline-time">[${ev.time || '00:00'}]</span> <span>${ev.target || ev.reason || 'Combat Event'}</span></div>
        <b>${ev.points || 0} VP</b>
      </div>`;
  }
}

window.LeaderboardDossierRenderer = LeaderboardDossierRenderer;