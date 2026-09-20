/**
 * AIRSPACE STANDOFF: Leaderboard & Sortie Archive Dossier UI Controller
 */

class LeaderboardUI {
  static init() {
    const btnProc = document.getElementById('btn-proc-leaderboard');
    const btnHud = document.getElementById('btn-hud-leaderboard');
    const btnClose = document.getElementById('btn-close-leaderboard');
    const modal = document.getElementById('leaderboard-modal');

    if (btnProc) {
      btnProc.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        LeaderboardUI.open();
      };
    }

    if (btnHud) {
      btnHud.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        LeaderboardUI.open();
      };
    }

    if (btnClose) {
      btnClose.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        LeaderboardUI.close();
      };
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          LeaderboardUI.close();
        }
      });
    }
  }

  static open() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) return;
    if (window.Game && window.Game.controls) window.Game.controls.autoPauseOnDialogOpen();

    LeaderboardUI.render();
    modal.classList.add('active');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static close() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) return;
    modal.classList.remove('active');
    if (window.Game && window.Game.controls) window.Game.controls.autoUnpauseOnDialogClose();
  }

  static render() {
    const tableContainer = document.getElementById('leaderboard-list-table');
    const detailContainer = document.getElementById('leaderboard-detail-view');
    if (!tableContainer || !detailContainer) return;

    const list = (window.Persistence && window.Persistence.getTopSorties)
      ? window.Persistence.getTopSorties()
      : [];

    if (list.length === 0) {
      tableContainer.innerHTML = `
        <div style="text-align:center;padding:40px 10px;color:#8494ab;font-size:0.72rem;">
          <b style="color:#00f0ff;">NO ARCHIVED SORTIES LOGGED YET</b>
          <p style="margin-top:6px;">Complete missions to set high scores on the leaderboard.</p>
        </div>
      `;
      detailContainer.innerHTML = `
        <div style="text-align:center;padding:40px 10px;color:#8494ab;font-size:0.72rem;">
          Select a recorded sortie from the left pane to view classified flight debrief details.
        </div>
      `;
      return;
    }

    const rowsHtml = list.map((item, idx) => {
      let rankClass = 'rank-standard';
      if (idx === 0) rankClass = 'rank-gold';
      else if (idx === 1) rankClass = 'rank-silver';
      else if (idx === 2) rankClass = 'rank-bronze';

      return `
        <tr class="leaderboard-row ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
          <td><span class="leaderboard-rank-tag ${rankClass}">#${idx + 1}</span></td>
          <td><b>${item.squadronName || 'Squadron'}</b><br><span style="color:#8494ab;font-size:0.56rem;">${item.date || ''}</span></td>
          <td style="color:#7dd3fc;">${item.difficulty || 'VETERAN'}</td>
          <td style="color:#00f0ff;">${item.timeStr || '00:00'}</td>
          <td style="text-align:right;"><b style="color:#00f5a0;font-size:0.74rem;">${(item.totalScore || 0).toLocaleString()}</b></td>
        </tr>
      `;
    }).join('');

    tableContainer.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>UNIT &amp; DATE</th>
            <th>TIER</th>
            <th>TIME</th>
            <th style="text-align:right;">FINAL SCORE</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;

    tableContainer.querySelectorAll('.leaderboard-row').forEach(row => {
      row.onclick = () => {
        tableContainer.querySelectorAll('.leaderboard-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const i = parseInt(row.getAttribute('data-idx'), 10);
        LeaderboardUI.renderDetail(list[i]);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    });

    LeaderboardUI.renderDetail(list[0]);
  }

  static renderDetail(item) {
    const detailContainer = document.getElementById('leaderboard-detail-view');
    if (!detailContainer || !item) return;

    const timeBonusVal = item.timeBonus || 0;
    const pilots = item.pilots || [];
    const pilotsListHtml = pilots.map(p => `
      <div class="dossier-row">
        <span>${p.callsign || 'Pilot'} [${p.model || 'JET'}]</span>
        <span style="color:${p.survived ? '#00f5a0' : '#ef4444'};">${p.survived ? 'SURVIVED' : 'LOST'} &bull; <b>${p.scorePoints || 0} VP</b></span>
      </div>
    `).join('');

    detailContainer.innerHTML = `
      <div class="dossier-header-box">
        <div>
          <div class="dossier-title">${item.squadronName || 'Wardog Squadron'}</div>
          <span style="color:#8494ab;font-size:0.58rem;">SORTIE ARCHIVE RECORD &bull; ${item.date || ''}</span>
        </div>
        <div style="text-align:right;">
          <div class="dossier-score-num">${(item.totalScore || 0).toLocaleString()}</div>
          <span style="color:#00f5a0;font-size:0.58rem;font-weight:800;">POINTS</span>
        </div>
      </div>

      <div class="dossier-meta-grid">
        <div class="dossier-card">
          <div style="color:#00f0ff;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">ENGAGEMENT METRICS</div>
          <div class="dossier-row"><span>MISSION STATUS:</span><b style="color:${item.blueWon ? '#00f5a0' : '#f97316'};">${item.outcome || 'COMPLETED'}</b></div>
          <div class="dossier-row"><span>SORTIE DURATION:</span><b style="color:#00f0ff;">${item.timeStr || '00:00'}</b></div>
          <div class="dossier-row"><span>SPEED TIME BONUS:</span><b class="time-bonus-tag">+${timeBonusVal.toLocaleString()} VP</b></div>
          <div class="dossier-row"><span>BASE RAW SCORE:</span><b>${(item.rawScore || 0).toLocaleString()} VP</b></div>
        </div>

        <div class="dossier-card">
          <div style="color:#ffd700;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">THEATER MULTIPLIERS</div>
          <div class="dossier-row"><span>DIFFICULTY (${item.difficulty || 'VETERAN'}):</span><b>x${(item.diffMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>BUDGET TIER (${item.budgetTier || 400}M):</span><b>x${(item.budgetMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>TOTAL MULTIPLIER:</span><b style="color:#00f5a0;">x${(item.totalMult || 1.0).toFixed(2)}</b></div>
          <div class="dossier-row"><span>AIR LOSSES:</span><span>BLUE: ${item.blueLosses || 0} &bull; RED: ${item.redLosses || 0}</span></div>
        </div>
      </div>

      <div class="dossier-card">
        <div style="color:#7dd3fc;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">TOP SCORING PILOT</div>
        <div class="dossier-row">
          <span style="color:#ffffff;font-weight:800;">${item.topPilot ? item.topPilot.callsign : 'Pilot'} [${item.topPilot ? item.topPilot.model : 'AIRCRAFT'}]</span>
          <span style="color:#00f5a0;"><b>${item.topPilot ? item.topPilot.kills : 0}</b> KILLS &bull; <b>${item.topPilot ? item.topPilot.points : 0}</b> VP</span>
        </div>
      </div>

      <div class="dossier-card" style="flex:1;min-height:90px;">
        <div style="color:#00f0ff;font-size:0.64rem;font-weight:800;border-bottom:1px solid #162c46;padding-bottom:3px;margin-bottom:3px;">PARTICIPATING AIRCRAFT ROSTER</div>
        <div style="overflow-y:auto;max-height:130px;display:flex;flex-direction:column;gap:2px;">${pilotsListHtml}</div>
      </div>
    `;
  }
}

window.LeaderboardUI = LeaderboardUI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LeaderboardUI.init());
} else {
  LeaderboardUI.init();
}