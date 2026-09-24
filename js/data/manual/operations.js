/**
 * AIRSPACE STANDOFF: Flight Manual additions for mission setup, inspection, and sortie review.
 */

window.MANUAL_OPERATIONS = [
  {
    id: 'ch10_mission_editor',
    title: 'SECTION 10: MISSION EDITOR & CUSTOM SORTIES',
    desc: `
      <div class="ge-desc">
        Open <b>MISSION EDITOR</b> in the Hangar to set up one custom sortie. The preview shows the choices that will be used. Press <b>USE THIS SETUP</b> to arm it for the next sortie. Press <b>RESET</b> to clear the setup and restore the default values.
      </div>

      <div class="ge-subhead">1. SET EACH FIELD YOUR WAY</div>
      <div class="ge-desc">
        Choose values for <b>scenario, difficulty, enemy style, your squadron, your weapons, enemy squadron size, enemy weapons, cloud cover, ground air defenses,</b> and <b>civilian traffic</b>. Each field has its own <b>RANDOM</b> button. Turn on only the fields you want the game to choose at launch; their menus become disabled until you turn RANDOM off. All other fields keep the values you chose.
      </div>
      <div class="ge-callout">
        <b>Example:</b> Keep your Hangar squadron and clear skies, but turn RANDOM on for enemy size and weapons. The separate <b>INSPECTION MODE</b> switch opens live analysis when the sortie starts. A menu choice such as <b>RANDOM LEGAL LOADOUTS</b> sets that weapon rule; the nearby RANDOM button instead randomizes which weapon rule is used.
      </div>
      <div class="ge-callout">
        <b>EDITOR SORTIES ARE UNRANKED.</b> Every sortie launched with this editor setup is excluded from the leaderboard, even if all fields use their default values. The setup applies to the next sortie only.
      </div>

      <div class="ge-subhead">2. IDENTIFY AIRCRAFT</div>
      <div class="ge-desc">
        Every aircraft in the sortie, on both teams, gets a unique callsign. If two aircraft start with the same callsign, a number is added to distinguish them. Aircraft are identified by both callsign and model, for example <b>Viper 2 · F-22A Raptor</b>.
      </div>
    `
  },
  {
    id: 'ch11_inspection',
    title: 'SECTION 11: INSPECTION MODE & LIVE ANALYSIS',
    desc: `
      <div class="ge-desc">
        Turn on <b>INSPECTION MODE</b> in the Mission Editor before pressing <b>USE THIS SETUP</b>. The live analysis workspace opens when that sortie starts. The tactical map and normal flight and weapon controls remain usable.
      </div>

      <div class="ge-subhead">1. PICK AN OBJECT AND CONTROL YOUR AIRCRAFT</div>
      <ul style="list-style:none;padding-left:0;font-size:0.74rem;line-height:1.6;">
        <li style="margin-bottom:6px;">Select an object on the map or from <b>CHOOSE OBJECT</b>. Select a friendly aircraft to make it the aircraft you fly.</li>
        <li style="margin-bottom:6px;">Select an enemy aircraft to target it. <b>ENEMY: ON</b> also shows its details. Switch to <b>ENEMY: OFF</b> to keep your own aircraft details on screen while selecting enemies as targets.</li>
        <li style="margin-bottom:6px;">Use the normal flight and weapon controls to maneuver and launch. Inspection does not disable combat actions.</li>
      </ul>

      <div class="ge-subhead">2. READ THE PICTURE, THEN OPEN DETAILS IF NEEDED</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead><tr><th>TAB</th><th>WHAT YOU CAN LEARN</th></tr></thead>
          <tbody>
            <tr><td>Summary</td><td>Aircraft condition, speed, altitude, energy, pilot status, and weapons at a glance.</td></tr>
            <tr><td>Sensors</td><td>Shows the selected object's radar signature and enemy-aircraft sensor coverage. Friendly aircraft and ground units are not listed as sensors. The range bars compare sensor reach with target distance; read the status text to see if the target is currently detected. Missile details also say whether the opposing side can see the missile's intended target.</td></tr>
            <tr><td>Weapons</td><td>Shows incoming missiles and estimated hit chances. The bar gives a quick visual estimate; expand its factors to see what helps or hurts the shot. The estimate can change while a missile is flying.</td></tr>
            <tr><td>Events</td><td>Lists recorded actions and outcomes in time order. Select an event to focus on the objects involved and read the explanation.</td></tr>
            <tr><td>All Data</td><td>Shows the detailed values behind the simpler summaries.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ge-desc">
        Expand <b>Show why and how</b> to see the calculation or reason behind a result. You can expand details only when you want them; they stay open as the live information refreshes.
      </div>

      <div class="ge-subhead">3. STOP TIME OR CLOSE ANALYSIS</div>
      <div class="ge-desc">
        <b>STOP TIME</b> is in the top action bar, outside the analysis panel, so it remains available even after you press <b>EXIT</b> to close analysis. Press <b>RESUME TIME</b> to continue. On a phone, the workspace rearranges to fit the screen; scroll the analysis tabs and rotate to landscape for more room if needed.
      </div>
    `
  },
  {
    id: 'ch12_debrief_replay',
    title: 'SECTION 12: MISSION DEBRIEFS, REPLAYS & LEADERBOARD',
    desc: `
      <div class="ge-desc">
        After a sortie, the debrief shows who flew, what was hit or lost, and when key events happened. A replay is available in the debrief. When a ranked sortie is saved as a leaderboard result, its replay is saved with it.
      </div>

      <div class="ge-subhead">1. REVIEW THE DEBRIEF</div>
      <ul style="list-style:none;padding-left:0;font-size:0.74rem;line-height:1.6;">
        <li style="margin-bottom:6px;">The performance summary highlights the top pilots and their results.</li>
        <li style="margin-bottom:6px;">Review the aircraft roster for each aircraft, its model, kills, missiles evaded, score, and whether it survived.</li>
        <li style="margin-bottom:6px;">Open the engagement timeline to review hits, kills, and rules-of-engagement incidents in order.</li>
      </ul>

      <div class="ge-subhead">2. CONTROL THE REPLAY</div>
      <div class="ge-desc">Open <b>LEADERBOARD</b> and select a saved result to view its archived replay in the result details.</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead><tr><th>CONTROL</th><th>USE</th></tr></thead>
          <tbody>
            <tr><td>Play / Pause</td><td>Start or pause the recorded battle.</td></tr>
            <tr><td>Restart</td><td>Return the replay to the beginning.</td></tr>
            <tr><td>Speed</td><td>Cycle through 0.5×, 1×, and 2× playback.</td></tr>
            <tr><td>Timeline slider</td><td>Scrub to any recorded time. Select a key engagement below the timeline to jump to it.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ge-callout">
        New ranked matches save their replay with the leaderboard record, so you can open the result later and watch it again. Mission Editor sorties still have a debrief replay, but the match itself is unranked and is not saved to the leaderboard. An older record may have no replay if it was saved before replay recording was added.
      </div>
    `
  }
];
