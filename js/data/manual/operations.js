/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 10 to 12
 * Covers: Mission Editor, Visual Inspection Analysis & Debriefing Replay
 */

window.MANUAL_OPERATIONS = [
  {
    id: 'ch10_mission_editor',
    title: 'SECTION 10: MISSION EDITOR & CUSTOM SORTIES',
    desc: `
      <div class="ge-desc">
        Access <b>MISSION EDITOR</b> from the Hangar header bar to construct tailored combat scenarios. The live dossier updates dynamically to display force balance and tactical odds. Press <b>ARM SORTIE CONFIGURATION</b> to prepare the setup for your next launch.
      </div>

      <div class="ge-subhead">1. THEATER SCENARIO, OPPOSITION &amp; RANDOMIZATION</div>
      <div class="ge-desc">
        Configure operational parameters across <b>Scenario Mode, Threat Contestation, Combat Doctrine, Fleet Strengths, Ordnance Rules, Weather Clouds, Ground IADS Defenses,</b> and <b>Civilian RoE</b>.
        <br><br>
        <ul style="list-style:none;padding-left:0;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Tactile Random Toggles:</b> Each field includes an independent <b>RANDOM</b> button. Enabling random on a parameter engages procedural theater generation for that specific field at launch time.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Force Ratio Balance:</b> Adjust enemy squadron size from 3 aircraft (Light Flight) up to 15 aircraft (Saturation Fleet) to test squadron survivability against asymmetric numbers.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Unranked Sortie Status:</b> All missions launched using custom editor configurations are flagged as unranked. They provide full debriefings and replays but do not submit scores to the Squadron Leaderboard.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. PROCEDURAL AIRCRAFT IDENTIFICATION</div>
      <div class="ge-desc">
        Every participating combatant receives a unique operational callsign and airframe designation (e.g. <b>Viper 2 - F-22A Raptor</b>). Numerical suffixes prevent telemetry overlap when deploying multiple identical airframes.
      </div>
    `
  },
  {
    id: 'ch11_inspection',
    title: 'SECTION 11: INSPECTION MODE & VISUAL C4ISR ANALYSIS',
    desc: `
      <div class="ge-desc">
        Engage <b>INSPECTION MODE</b> inside the Mission Editor prior to sortie launch. Inspection Mode unlocks an interactive C4ISR analysis workspace while keeping tactical flight and missile controls fully active.
      </div>

      <div class="ge-subhead">1. SELECTION &amp; COMBAT CONTROLS</div>
      <ul style="list-style:none;padding-left:0;font-size:0.74rem;line-height:1.6;">
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Seamless Selection:</b> Tap contacts on the radar scope or select them from the HUD dropdown menu. Friendly aircraft can be taken over directly; hostile contacts are immediately acquired as target locks.</li>
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Enemy Filter Switch:</b> Toggle <b>ENEMY: ON/OFF</b> to inspect enemy telemetry or maintain focus on your active fighter while acquiring targets.</li>
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Simulation Time-Stop:</b> Press <b>STOP TIME</b> in the header bar to freeze combat physics for deep telemetry analysis, then resume when ready.</li>
      </ul>

      <div class="ge-subhead">2. VISUAL DIAGNOSTIC WORKSPACE TABS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead><tr><th>WORKSPACE TAB</th><th>INTELLIGENCE DISPLAY</th></tr></thead>
          <tbody>
            <tr><td><b>OVERVIEW</b></td><td>Visual segmented armor health pips, Mach corner velocity turn-efficiency gauge, altitude tape, energy reserve meter, and store station inventory.</td></tr>
            <tr><td><b>SENSORS</b></td><td>Stealth radar cross-section spectrum bar, aspect spike factors, and horizontal range-versus-distance comparison tracks for all opposing radars.</td></tr>
            <tr><td><b>WEAPONS</b></td><td>Dynamic hit probability gauge (P_k percentage arc), green advantage chips, red disadvantage chips, and inbound threat warnings.</td></tr>
            <tr><td><b>EVENTS</b></td><td>Chronological Causal Log recording missile launches, intercepts, chaff deployments, and kill events with plain-language summaries.</td></tr>
            <tr><td><b>DATA</b></td><td>Complete raw telemetry registry and aircraft flight-path trail coordinates for advanced technical analysis.</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch12_debrief_replay',
    title: 'SECTION 12: MISSION DEBRIEFS, REPLAYS & SQUADRON ARCHIVE',
    desc: `
      <div class="ge-desc">
        Upon sortie completion or mission abort, the After Action Report provides complete performance metrics, pilot podium rankings, chronological engagement timelines, and interactive tactical replays.
      </div>

      <div class="ge-subhead">1. SORTIE REPLAY CONTROLS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead><tr><th>CONTROL</th><th>FUNCTION</th></tr></thead>
          <tbody>
            <tr><td><b>Play / Pause</b></td><td>Start or suspend recorded playback.</td></tr>
            <tr><td><b>Restart</b></td><td>Rewind replay to mission launch coordinates.</td></tr>
            <tr><td><b>Speed</b></td><td>Toggle playback rate across 0.5x, 1x, and 2x.</td></tr>
            <tr><td><b>Timeline Scrubber</b></td><td>Drag timeline slider to inspect any point in the engagement, or click key event chips to jump directly to decisive missile impacts.</td></tr>
          </tbody>
        </table>
      </div>
    `
  }
];