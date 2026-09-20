/**
 * AIRSPACE STANDOFF: After Action Report Engagement Timeline Submodule
 */

class AfterActionReportTimeline {
  static getMergedTimelineEvents(game) {
    if (!game || !game.simulation) return [];
    const events = (game.simulation && game.simulation.timelineEvents) ? [...game.simulation.timelineEvents] : [];

    // Synchronize any events from scoreLog not yet represented in timelineEvents
    const scoreLog = (game.simulation && game.simulation.scoreLog) ? game.simulation.scoreLog : [];
    for (const logItem of scoreLog) {
      if (!logItem || !logItem.reason) continue;
      const isPenalty = logItem.points < 0;
      if (isPenalty) {
        const alreadyPresent = events.some(ev => ev.type === 'roe_penalty' && (ev.reason === logItem.reason || ev.points === logItem.points));
        if (!alreadyPresent) {
          events.push({
            time: logItem.time || '00:00',
            type: 'roe_penalty',
            team: logItem.team || 'friendly',
            source: game.squadronName || 'Flight',
            sourceType: 'AIRCRAFT',
            target: 'BOGEY [?]',
            targetType: 'UNVERIFIED',
            reason: logItem.reason,
            points: logItem.points
          });
        }
      }
    }
    return events;
  }

  static renderTimeline(game, blueWon = false) {
    const timelineListEl = document.getElementById('aar-timeline-list');
    const toggleTimelineBtn = document.getElementById('btn-toggle-aar-timeline');
    if (!timelineListEl || !game || !game.simulation) return;

    // Retrieve consolidated combat events
    const recordedEvents = AfterActionReportTimeline.getMergedTimelineEvents(game);

    // Append mission victory milestone to provide complete context
    if (blueWon) {
      recordedEvents.push({
        time: game.simulation.getElapsedTimeString ? game.simulation.getElapsedTimeString() : '00:00',
        type: 'victory',
        team: 'friendly',
        source: game.squadronName || 'Blue Coalition',
        sourceType: 'FLEET',
        target: 'Hostile Airspace',
        targetType: 'THEATER',
        weapon: 'Air Superiority',
        isSalvo: false,
        salvoCount: 1,
        salvoBreakdown: '',
        points: game.vpAlly || 0
      });
    }

    // Render entries or fallback message
    if (recordedEvents.length === 0) {
      timelineListEl.innerHTML = `
        <div class="timeline-entry">
          <div class="timeline-main-info">
            <span class="timeline-time">[00:00]</span>
            <span style="color:#8494ab;font-style:italic;">No combat engagements logged for this sortie.</span>
          </div>
          <b style="color:#8494ab;">0 VP</b>
        </div>
      `;
    } else {
      timelineListEl.innerHTML = recordedEvents.map(ev => {
        const isKill = ev.type === 'kill' || ev.type === 'ace-kill';
        const isRoe = ev.type === 'roe_penalty';
        const isHit = ev.type === 'hit';
        const isVictory = ev.type === 'victory';
        const col = isVictory ? '#00f0ff' : (ev.type === 'ace-kill' ? '#ffd700' : (isKill ? (ev.team === 'friendly' ? '#00f0ff' : '#ff3366') : (isRoe ? '#f97316' : (isHit ? '#38bdf8' : '#94a3b8'))));
        const teamStr = isVictory ? 'VICTORY' : (ev.type === 'ace-kill' ? 'LEADER DOWN' : (ev.team ? (ev.team === 'friendly' ? 'BLUE' : 'RED') : ''));

        if (isVictory) {
          return `
            <div class="timeline-entry victory-entry">
              <div class="timeline-main-info">
                <span class="timeline-time">[${ev.time}]</span>
                <b style="color:#00f0ff;">[MISSION COMPLETE]</b>
                <span class="timeline-combatant"><b>${ev.source}</b> secured theater air dominance</span>
              </div>
              <b style="color:#00f0ff;white-space:nowrap;">VICTORY</b>
            </div>
          `;
        } else if (isKill) {
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
        } else if (isHit) {
          const salvoBadge = ev.isSalvo ? `<span class="timeline-salvo-badge" style="color:#38bdf8;font-size:0.56rem;margin-left:4px;">[Salvo: ${ev.salvoBreakdown || ('x' + ev.salvoCount)}]</span>` : '';
          return `
            <div class="timeline-entry hit">
              <div class="timeline-main-info">
                <span class="timeline-time">[${ev.time}]</span>
                <b style="color:#38bdf8;">[${teamStr}]</b>
                <span class="timeline-combatant"><b>${ev.source}</b> (${ev.sourceType || 'AIRCRAFT'})</span>
                <span>struck</span>
                <span class="timeline-combatant"><b>${ev.target}</b> (${ev.targetType || 'TARGET'})</span>
                <span class="timeline-weapon-tag">with <b>${ev.weapon || 'Missile'}</b> (-${ev.damage || 2} HP)</span>
                ${salvoBadge}
              </div>
              <b style="color:#38bdf8;white-space:nowrap;">+${ev.points || 0} VP</b>
            </div>
          `;
        } else if (isRoe) {
          const reasonText = ev.reason ? ev.reason : `Civilian aircraft <b>${ev.target}</b> destroyed`;
          return `
            <div class="timeline-entry roe">
              <div class="timeline-main-info">
                <span class="timeline-time">[${ev.time}]</span>
                <b style="color:#f97316;">[ROE PENALTY]</b>
                <span>${ev.source ? `<b>${ev.source}</b>: ` : ''}${reasonText}</span>
              </div>
              <b style="color:#ff3366;white-space:nowrap;">${ev.points} VP</b>
            </div>
          `;
        } else {
          return `
            <div class="timeline-entry">
              <div class="timeline-main-info">
                <span class="timeline-time">[${ev.time}]</span>
                <span>${ev.target || ev.reason || 'Combat Event'}</span>
              </div>
              <b>${ev.points || 0} VP</b>
            </div>
          `;
        }
      }).join('');
    }

    // Automatically expand the timeline upon victory
    const shouldAutoExpand = Boolean(blueWon);

    if (shouldAutoExpand) {
      timelineListEl.classList.remove('hidden');
      timelineListEl.style.display = 'flex';
      if (toggleTimelineBtn) toggleTimelineBtn.textContent = 'COLLAPSE TIMELINE';
    } else {
      timelineListEl.classList.add('hidden');
      timelineListEl.style.display = 'none';
      if (toggleTimelineBtn) toggleTimelineBtn.textContent = 'EXPAND TIMELINE';
    }

    // Configure manual expansion/collapse toggle
    if (toggleTimelineBtn) {
      toggleTimelineBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = timelineListEl.classList.contains('hidden') || timelineListEl.style.display === 'none';
        if (isHidden) {
          timelineListEl.classList.remove('hidden');
          timelineListEl.style.display = 'flex';
          toggleTimelineBtn.textContent = 'COLLAPSE TIMELINE';
          try {
            timelineListEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (err) {}
        } else {
          timelineListEl.classList.add('hidden');
          timelineListEl.style.display = 'none';
          toggleTimelineBtn.textContent = 'EXPAND TIMELINE';
        }
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    }
  }
}

window.AfterActionReportTimeline = AfterActionReportTimeline;