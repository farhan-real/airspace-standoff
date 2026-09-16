/**
 * APEX VECTOR // Master Manual Aggregator & Interactive Chapter Navigator
 */

window.TACTICAL_FLIGHT_MANUAL = [
  ...(window.MANUAL_BASICS || []),
  ...(window.MANUAL_SENSORS || []),
  ...(window.MANUAL_COMBAT || []),
  ...(window.MANUAL_THEATER || [])
];

window.initTacticalManual = function() {
  const container = document.getElementById('glossary-modal-content');
  const modal = document.getElementById('glossary-modal');

  // Re-compile in case submodules loaded asynchronously
  window.TACTICAL_FLIGHT_MANUAL = [
    ...(window.MANUAL_BASICS || []),
    ...(window.MANUAL_SENSORS || []),
    ...(window.MANUAL_COMBAT || []),
    ...(window.MANUAL_THEATER || [])
  ];

  if (container && window.TACTICAL_FLIGHT_MANUAL.length > 0) {
    const navButtonsHtml = `
      <div class="manual-nav-bar">
        <span style="font-size:0.62rem;color:#ffb830;font-family:var(--font-mono);font-weight:800;margin-right:4px;">JUMP TO:</span>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch1_quickstart').scrollIntoView({behavior:'smooth'});">CH 1: RULES</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch2_kinematics').scrollIntoView({behavior:'smooth'});">CH 2: KINEMATICS</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch3_stress_coffin').scrollIntoView({behavior:'smooth'});">CH 3: STRESS &amp; COFFIN</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch4_radar_physics').scrollIntoView({behavior:'smooth'});">CH 4: RADAR &amp; RCS</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch5_classification_uplink').scrollIntoView({behavior:'smooth'});">CH 5: SATELLITE UPLINK</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch6_weapons_salvos').scrollIntoView({behavior:'smooth'});">CH 6: WEAPONS &amp; SALVOS</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch7_defense_ew').scrollIntoView({behavior:'smooth'});">CH 7: EW &amp; NOTCHING</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch8_aces_difficulties').scrollIntoView({behavior:'smooth'});">CH 8: ACES &amp; DIFFICULTIES</button>
        <button type="button" class="manual-nav-btn" onclick="document.getElementById('ch9_logistics_scoring').scrollIntoView({behavior:'smooth'});">CH 9: LOGISTICS &amp; IADS</button>
      </div>
    `;

    const chaptersHtml = window.TACTICAL_FLIGHT_MANUAL.map(ch => `
      <div class="glossary-entry" id="${ch.id}">
        <div class="ge-title">${ch.title}</div>
        <div class="ge-content">${ch.desc}</div>
      </div>
    `).join('');

    container.innerHTML = navButtonsHtml + chaptersHtml;
  }

  const openHangarBtn = document.getElementById('btn-open-glossary');
  if (openHangarBtn && modal) {
    openHangarBtn.onclick = (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (window.Game && window.Game.controls) {
        window.Game.controls.autoPauseOnDialogOpen();
      }
    };
  }

  const openHudBtn = document.getElementById('btn-hud-glossary');
  if (openHudBtn && modal) {
    openHudBtn.onclick = (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (window.Game && window.Game.controls) {
        window.Game.controls.autoPauseOnDialogOpen();
      }
    };
  }

  const closeBtn = document.getElementById('btn-close-glossary');
  if (closeBtn && modal) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      modal.classList.remove('active');
      if (window.Game && window.Game.controls) {
        window.Game.controls.autoUnpauseOnDialogClose();
      }
    };
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        if (window.Game && window.Game.controls) {
          window.Game.controls.autoUnpauseOnDialogClose();
        }
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initTacticalManual);
} else {
  window.initTacticalManual();
}