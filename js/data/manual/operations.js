/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Sections 14 to 16
 * Covers: Mission Editor, Visual Inspection Analysis & Debriefing Replay
 */

window.MANUAL_OPERATIONS = [
  {
    id: 'ch14_mission_editor',
    title: 'SECTION 14: MISSION EDITOR & CUSTOM SORTIE GENERATOR',
    desc: `
      <div class="ge-desc">
        Access the <b>MISSION EDITOR</b> from the Hangar header bar to construct tailored combat engagements. Test airframe doctrines, force ratios, and weapon configurations in an unranked combat laboratory.
      </div>

      <div class="ge-subhead">1. THEATER PARAMETERS &amp; FORCE BALANCE</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>PARAMETER GROUP</th><th>OPTIONS &amp; SETTINGS</th><th>OPERATIONAL IMPACT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Scenario Mode</td>
              <td>Skirmish, Dynamic Theater, or Ground Attack</td>
              <td>Skirmish deploys single wave clash; Dynamic Theater introduces reinforcing wave wings every 80 seconds; Ground Attack opens the 240x160 IADS theater.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Difficulty</td>
              <td>10 Air Combat Tiers (Skirmish and Dynamic) or 10 Ground Attack Tiers (Attack)</td>
              <td>Automatically switches between Air Combat and Ground Attack difficulty tables to control reaction speed, notching, salvo sizing, and IADS density.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AI Combat &amp; Defense Doctrine</td>
              <td>Air: Balanced, Aggressive Rush, Long-Range Standoff, Stealth Ambush, Drone Swarm, Electronic Jamming, Defensive Hold. Attack: Balanced Defense, Silent Radar Ambush, Fast Air Scramble, Heavy SAM Wall, Heavy Jamming Shield, Tight Base Defense, Low-Altitude Flak Belt.</td>
              <td>Automatically adapts to Scenario Mode, shaping either enemy squadron fleet selection and tactics or Ground Attack SAM, EW, CIWS, AAA, and QRA behavior.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Allied Blue Force</td>
              <td>Hangar Fleet or Difficulty Fleet</td>
              <td>Deploy your custom hangar fleet or an autonomous procedural fleet using any difficulty tier with independent budget configuration.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Allied Blue Budget</td>
              <td>Standard Tiers or Custom Credit Value (10M - 2500M)</td>
              <td>Configures expenditure allowance for blue fleet. Automatically locks when Hangar is selected.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Hostile Red Fleet</td>
              <td>Difficulty Fleet or Hangar Mirror (Air Combat modes)</td>
              <td>Select adversary fleet based on any difficulty setting or deploy an exact mirror of your current Hangar fleet.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Hostile Red Budget</td>
              <td>Standard Tiers or Custom Credit Value (10M - 2500M)</td>
              <td>Configures adversary defense budget with difficulty default indicator or custom entered value.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Weather &amp; Clouds</td>
              <td>Clear, Light, Scattered, Dense Overcast</td>
              <td>Controls cloud cell counts, microwave radar attenuation (-4% per cell), and IR optical scattering.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Ground IADS Grid</td>
              <td>Full (SAMs + CIWS + EW), Light, Off</td>
              <td>Controls surface air-defense coverage, radar arrays, and command bunker defenses.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Civilian RoE Flights</td>
              <td>Active (Strict RoE) vs Disabled</td>
              <td>Toggles commercial airliner flights subject to strict -600 VP unverified launch penalties.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. PROCEDURAL RANDOMIZATION &amp; ARMING WORKFLOW</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-2);">INDEPENDENT RANDOM TOGGLES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Every parameter field features an independent <b>RANDOM</b> toggle button. Enabling random on a parameter engages dynamic procedural generation for that specific setting at launch time, allowing mixed custom and randomized sorties.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--stat-tier-3);">ARMED SORTIE CONFIGURATION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Clicking <b>ARM SORTIE CONFIGURATION</b> locks the draft for your next launch. The hangar header status displays <code>EDITOR CONFIG ARMED</code>. Custom editor sorties are fully simulated with complete debriefs, but are flagged as <b>UNRANKED</b> to protect leaderboard integrity.
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'ch15_inspection',
    title: 'SECTION 15: INSPECTION MODE, LIVE C4ISR & AI COGNITION ANALYSIS',
    desc: `
      <div class="ge-desc">
        Enable <b>INSPECTION MODE</b> inside the Mission Editor to unlock an advanced real-time C4ISR telemetry workspace while keeping cockpit flight controls, banking, and missile releases fully functional across Skirmish, Dynamic Theater, and Ground Attack operations.
      </div>

      <div class="ge-subhead">1. WORKSPACE CONTROLS &amp; SIMULATION TIME-STOP</div>
      <div class="ge-card">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.6;color:#cbd5e1;">
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Contact Selection:</b> Tap any aircraft, surface IADS installation, or in-flight missile on the radar display or choose from the HUD dropdown to immediately focus telemetry.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Enemy Filter Switch (ENEMY: ON or OFF):</b> Toggles hostile air and concealed IADS telemetry analysis on or off. With Enemy Off, concealed enemy SAMs and decoys stay hidden while tapping visible threats locks them as weapon targets.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Simulation Time-Stop (STOP TIME or RESUME TIME):</b> Freezes combat simulation physics in place. Allows deep analysis of radar envelopes, EMCON timers, aspect angles, and missile kill probability before resuming.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Concurrent Combat Controls:</b> Flight steering keys, throttle adjustment, and weapon triggers remain fully active during inspection analysis.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. ACTIVE AI CONTROL ARROWS (RADAR VIEWPORT SYMBOLOGY)</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid var(--color-red);">
          <b style="color:var(--color-red);">ACTIVE AI CONTROL ARROW</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            An inverted chevron arrow rendered at the top of the contact pointing straight down indicates that the AI Commander is currently dedicating an active cognitive attention slot to that airframe.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid var(--color-moon-mist);">
          <b style="color:var(--color-moon-mist);">STANDBY &amp; AUTONOMOUS PATROL</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Enemy aircraft without an arrow are flying on autonomous standby patrol awaiting a free attention slot.
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. AI COGNITIVE PROFILE &amp; THE 6 WORKSPACE TABS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>WORKSPACE TAB</th><th>DIAGNOSTIC DISPLAY &amp; TACTICAL TELEMETRY</th></tr>
          </thead>
          <tbody>
            <tr><td style="color:#00f0ff;font-weight:800;">OVERVIEW</td><td>Armor pips, corner turn gauge, installed subsystems (TFR, CCIP, HTS, MITL, DIRCM, Kevlar), Air &amp; Attack Doctrine cognition dossiers, 5-segment runway status, parked QRA queues, and IADS network links.</td></tr>
            <tr><td style="color:#00f5a0;font-weight:800;">SENSORS</td><td>Radar specs, active locks, stealth RCS spectrum, jamming/ECCM, TFR low-alt masking, VHF counter-stealth, passive ELINT, and ground recon (ESM, TGP, SAR) tracks.</td></tr>
            <tr><td style="color:#ffd700;font-weight:800;">WEAPONS</td><td>Dynamic A2A &amp; A2G hit probability (Pk), primary gun solutions, armor class deflection, CIWS interception risk, EMCON vulnerability, SAM/AAA defense envelopes, and inbound missile protocols.</td></tr>
            <tr><td style="color:#38bdf8;font-weight:800;">GRAPHS</td><td>Dynamic Launch Zone (A2A, A2G &amp; SAM DLZ), 360&deg; RCS/SAM polar coverage diagrams, turn speed &amp; battery readiness gauges, 60s flight/IADS status panels, and Attack-integrated fleet power curves.</td></tr>
            <tr><td style="color:#c084fc;font-weight:800;">EVENTS</td><td>Chronological Causal Log recording launches, EMCON shutdowns, QRA scrambles, AAA/CIWS intercepts, ground recon exposures, decoys, chaff, secondary blasts, and kills.</td></tr>
            <tr><td style="color:#38bdf8;font-weight:800;">DATA</td><td>Complete raw telemetry registry: coordinates, FL, Mach, ground ops, strike/SEAD upgrades, surface IADS network modifiers, missile release buffs, and AI state variables.</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch16_debrief_replay',
    title: 'SECTION 16: MISSION DEBRIEFS, REPLAYS & SQUADRON ARCHIVE',
    desc: `
      <div class="ge-desc">
        Upon sortie completion or mission abort, the After Action Report provides complete performance metrics, pilot podium rankings, chronological engagement timelines, and interactive sortie replays.
      </div>

      <div class="ge-subhead">1. SORTIE REPLAY CONTROLS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>CONTROL</th><th>FUNCTION</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Play and Pause</b></td><td>Start or suspend recorded sortie playback.</td></tr>
            <tr><td><b>Restart</b></td><td>Rewind replay to mission launch coordinates.</td></tr>
            <tr><td><b>Speed Selector</b></td><td>Toggle playback rate across 0.5x, 1x, and 2x simulation velocity.</td></tr>
            <tr><td><b>Timeline Scrubber</b></td><td>Drag timeline slider to inspect any second of the engagement, or click key event chips to jump directly to decisive missile impacts.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. AFTER ACTION REPORT (AAR) &amp; PILOT PODIUM RANKINGS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-1);">SORTIE ACE PODIUM</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Highlights the top 3 highest scoring pilots across friendly and hostile fleets. Displays individual air-to-air kills, missile evasions, and total victory points earned.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--theme-accent);">HISTORICAL SQUADRON DOSSIER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Top 10 ranked missions are saved to local persistent storage. Revisit previous debriefs, examine participating rosters, and re-watch recorded sortie replays from the Leaderboard.
          </div>
        </div>
      </div>
    `
  }
];
