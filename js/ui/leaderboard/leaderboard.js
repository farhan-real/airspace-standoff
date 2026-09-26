/**
 * AIRSPACE STANDOFF: Leaderboard & Sortie Archive Dossier UI Controller
 */

class LeaderboardUI {
  static init() {
    const btnProc = document.getElementById('btn-proc-leaderboard');
    const btnClose = document.getElementById('btn-close-leaderboard');
    const modal = document.getElementById('leaderboard-modal');

    if (btnProc) {
      btnProc.onclick = (e) => {
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
        if (e.target === modal) LeaderboardUI.close();
      });
    }
  }

  static open() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) return;
    if (window.Game && window.Game.controls) window.Game.controls.autoPauseOnDialogOpen();
    modal.classList.add('active');
    LeaderboardUI.render();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static close() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) return;
    if (window.AfterActionReplay && typeof window.AfterActionReplay.stopArchived === 'function') {
      window.AfterActionReplay.stopArchived();
    }
    modal.classList.remove('active');
    if (window.Game && window.Game.controls) window.Game.controls.autoUnpauseOnDialogClose();
  }

  static render() {
    const tableContainer = document.getElementById('leaderboard-list-table');
    const detailContainer = document.getElementById('leaderboard-detail-view');
    if (!tableContainer || !detailContainer) return;
    if (window.AfterActionReplay && typeof window.AfterActionReplay.stopArchived === 'function') {
      window.AfterActionReplay.stopArchived();
    }

    const list = (window.Persistence && window.Persistence.getTopSorties)
      ? window.Persistence.getTopSorties() : [];

    if (list.length === 0) {
      tableContainer.innerHTML = `
        <div style="text-align:center;padding:40px 10px;color:#8494ab;font-size:0.72rem;">
          <b style="color:#00f0ff;">NO ARCHIVED SORTIES LOGGED YET</b>
          <p style="margin-top:6px;">Complete missions to set high scores on the leaderboard.</p>
        </div>`;
      detailContainer.innerHTML = `
        <div style="text-align:center;padding:40px 10px;color:#8494ab;font-size:0.72rem;">
          Select a recorded sortie from the left pane to view classified flight debrief details.
        </div>`;
      return;
    }

    const rowsHtml = list.map((item, idx) => {
      const rankClass = idx === 0 ? 'rank-gold' : (idx === 1 ? 'rank-silver' : (idx === 2 ? 'rank-bronze' : 'rank-standard'));
      return `
        <tr class="leaderboard-row ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
          <td><span class="leaderboard-rank-tag ${rankClass}">#${idx + 1}</span></td>
          <td><b>${item.squadronName || 'Squadron'}</b><br><span style="color:#8494ab;font-size:0.56rem;">${item.date || ''}</span></td>
          <td style="color:#7dd3fc;">${item.difficulty || 'VETERAN'}</td>
          <td style="color:#00f0ff;">${item.timeStr || '00:00'}</td>
          <td style="text-align:right;"><b style="color:#00f5a0;font-size:0.74rem;">${(item.totalScore || 0).toLocaleString()}</b></td>
        </tr>`;
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
      </table>`;

    tableContainer.querySelectorAll('.leaderboard-row').forEach(row => {
      row.onclick = () => {
        tableContainer.querySelectorAll('.leaderboard-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const i = parseInt(row.getAttribute('data-idx'), 10);
        LeaderboardUI.renderDetail(list[i], i);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    });

    LeaderboardUI.renderDetail(list[0], 0);
  }

  static renderDetail(item, itemIdx = 0) {
    if (typeof LeaderboardDossierRenderer !== 'undefined') {
      LeaderboardDossierRenderer.renderDetail(item, itemIdx, () => LeaderboardUI.render());
    }
  }
}

window.LeaderboardUI = LeaderboardUI;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LeaderboardUI.init());
} else {
  LeaderboardUI.init();
}