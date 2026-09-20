/**
 * AIRSPACE STANDOFF // After Action Report Engagement Timeline Submodule
 */

class AfterActionReportTimeline {
  static renderTimeline(game) {
    const timelineListEl = document.getElementById('aar-timeline-list');
    const toggleTimelineBtn = document.getElementById('btn-toggle-aar-timeline');
    if (!timelineListEl || !game.simulation || !game.simulation.timelineEvents) return;

    timelineListEl.innerHTML = game.simulation.timelineEvents.map(ev => {
      const isKill = ev.type === 'kill' || ev.type === 'ace-kill';
      const isRoe = ev.type === 'roe_penalty';
      const col = ev.type === 'ace-kill' ? '#ffd700' : (isKill ? (ev.team === 'friendly' ? '#00f0ff' : '#ff3366') : (isRoe ? '#f97316' : '#94a3b8'));
      const teamStr = ev.type === 'ace-kill' ? 'LEADER DOWN' : (ev.team ? (ev.team === 'friendly' ? 'BLUE' : 'RED') : '');

      if (isKill) {
        const salvoBadge = ev.isSalvo ? `<span class="timeline-salvo-badge" style="color:#00f0ff;font-size:0.56rem;margin-left:4px;">[Salvo: ${ev.salvoBreakdown || ('x' + ev.salvoCount)}]</span>` : '';
        return `
          <div class="timeline-entry ${ev.type === 'ace-kill' ? 'ace-kill' : 'kill'}">
            <div class="timeline-main-info">
              <span class="timeline-time">[${ev.time}]</span>
              <b style="color:${col};">[${teamStr}]</b>
              <span class="timeline-combatant"><b>${ev.source}</b> (${ev.sourceType || 'AIRCRAFT'})</span>
              <span>destroyed</span>
              <span class="timeline-combatant"><b>${ev.target}</b> (${ev.targetType || 'TARGET'})</span>
              <span class="timeline-weapon-tag">using <b>${ev.weapon || 'Missile'}</b></span>
              ${salvoBadge}
            </div>
            <b style="color:${col};white-space:nowrap;">+${ev.points} VP</b>
          </div>
        `;
      } else if (isRoe) {
        return `
          <div class="timeline-entry roe">
            <div class="timeline-main-info">
              <span class="timeline-time">[${ev.time}]</span>
              <b style="color:#f97316;">[ROE VIOLATION]</b>
              <span>Civilian aircraft <b>${ev.target}</b> destroyed</span>
            </div>
            <b style="color:#ff3366;white-space:nowrap;">${ev.points} VP</b>
          </div>
        `;
      } else {
        return `
          <div class="timeline-entry">
            <span>[${ev.time}] ${ev.target}</span>
            <b>${ev.points || 0} VP</b>
          </div>
        `;
      }
    }).join('');

    if (toggleTimelineBtn) {
      timelineListEl.classList.add('hidden');
      toggleTimelineBtn.textContent = 'EXPAND TIMELINE';
      toggleTimelineBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = timelineListEl.classList.contains('hidden');
        timelineListEl.classList.toggle('hidden', !isHidden);
        toggleTimelineBtn.textContent = isHidden ? 'COLLAPSE TIMELINE' : 'EXPAND TIMELINE';
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    }
  }
}

window.AfterActionReportTimeline = AfterActionReportTimeline;