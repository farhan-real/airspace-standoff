/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 10 to 12
 * Covers: Mission Editor, Visual Inspection Analysis & Debriefing Replay
 */

window.MANUAL_OPERATIONS = [
  {
    id: 'ch10_mission_editor',
    title: 'SECTION 10: MISSION EDITOR & CUSTOM SORTIE GENERATOR',
    desc: `
      <div class="ge-desc">
        Access the <b>MISSION EDITOR</b> from the Hangar header bar to construct tailored tactical engagements. Test airframe doctrines, force ratios, and weapon configurations in an unranked combat laboratory.
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
              <td>Skirmish vs Dynamic Theater</td>
              <td>Skirmish deploys single wave clash; Dynamic Theater introduces reinforcing wave wings every 80 seconds.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Threat Contestation</td>
              <td>Permissive Sector (0.50x) through Extreme Threat Sector (3.20x)</td>
              <td>Adjusts AI reaction speed, Doppler notch discipline, salvo sizing, and formation pairing.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AI Combat Doctrine</td>
              <td>Balanced, Aggressive, Standoff</td>
              <td>Sets adversary priority between high-G dogfighting merges, balanced BVR, or long-range sniper volleys.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Allied Blue Force</td>
              <td>Hangar Fleet or Sector Difficulty Fleet</td>
              <td>Deploy your custom hangar fleet (budget locked to hangar) or deploy an autonomous fleet using any sector difficulty tier (Permissive Sector through Extreme Threat Sector) with independent budget configuration.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Allied Blue Budget</td>
              <td>Standard Tiers or Custom Credit Value (10M - 2500M)</td>
              <td>Configures expenditure allowance for blue fleet. Displays default budget for selected sector difficulty (e.g. 330M Default). Tap CUSTOM to enter any tailored credit amount. Automatically locks when Hangar is selected.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Hostile Red Fleet</td>
              <td>Sector Difficulty Fleet or Hangar Mirror</td>
              <td>Select adversary fleet based on any sector difficulty doctrine (Permissive Sector through Extreme Threat Sector) or deploy an exact mirror of your current Hangar fleet.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Hostile Red Budget</td>
              <td>Standard Tiers or Custom Credit Value (10M - 2500M)</td>
              <td>Configures adversary defense budget with difficulty default indicator or custom entered value. Rejection finalization applies naturally as soon as an aircraft exceeds the budget.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Weather &amp; Clouds</td>
              <td>Clear, Light, Scattered, Dense Overcast</td>
              <td>Controls cloud cell counts, microwave radar attenuation (-8% per cell), and IR optical scattering.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Ground IADS Grid</td>
              <td>Full (S-400 + CIWS + EW), Light, Off</td>
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
    id: 'ch11_inspection',
    title: 'SECTION 11: INSPECTION MODE, LIVE C4ISR &amp; AI COGNITION ANALYSIS',
    desc: `
      <div class="ge-desc">
        Enable <b>INSPECTION MODE</b> inside the Mission Editor to unlock an advanced real-time C4ISR telemetry workspace while keeping cockpit flight controls, banking, and missile releases fully functional.
      </div>

      <div class="ge-subhead">1. WORKSPACE CONTROLS &amp; SIMULATION TIME-STOP</div>
      <div class="ge-card">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.6;color:#cbd5e1;">
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Contact Selection:</b> Tap any aircraft, surface site, or in-flight missile on the radar display or choose from the HUD dropdown to immediately focus telemetry.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Enemy Filter Switch (ENEMY: ON/OFF):</b> Toggles hostile telemetry analysis on or off. With Enemy Off, tapping an enemy blip locks them as your weapon target while keeping friendly aircraft telemetry active.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Simulation Time-Stop (STOP TIME / RESUME TIME):</b> Freezes combat simulation physics in place. Allows deep analysis of radar envelopes, aspect angles, and missile kill probability before resuming.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Concurrent Combat Controls:</b> Flight steering keys, throttle adjustment, and weapon triggers remain fully active during inspection analysis.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. ACTIVE AI CONTROL ARROWS (RADAR VIEWPORT SYMBOLOGY)</div>
      <div class="ge-desc">
        In Inspection Mode, the radar viewport renders a small, dedicated downward-pointing arrow directly above every enemy aircraft currently under active AI commander control:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid var(--color-red);">
          <b style="color:var(--color-red);">ACTIVE AI CONTROL ARROW</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            An inverted chevron arrow rendered at the top of the contact pointing straight down indicates that the AI Commander is currently dedicating an active cognitive attention slot to that airframe. The unit is actively executing aggressive steering, energy optimization, or computing firing solutions.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid var(--color-moon-mist);">
          <b style="color:var(--color-moon-mist);">STANDBY / AUTONOMOUS PATROL</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Enemy aircraft without an arrow are flying on autonomous standby patrol awaiting a free attention slot. They adhere to basic navigation guidelines but lack real-time tactical commander guidance until prioritized.
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. AI TACTICAL COGNITION &amp; ATTENTION TELEMETRY</div>
      <div class="ge-desc">
        When an enemy aircraft is selected during inspection, the <b>OVERVIEW</b> tab displays the <b>AI TACTICAL COGNITION</b> dossier, revealing the adversary's cognitive state, command hierarchy, and difficulty-scaled role execution:
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>COGNITIVE PARAMETER</th><th>OPERATIONAL FUNCTION &amp; TACTICAL SIGNIFICANCE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Tactical Role</td>
              <td>Displays active combat mission: <code>STANDOFF SNIPER</code> (holds 50-85 km perimeter and retrograde drag angles), <code>HIGH-SPEED INTERCEPTOR</code> (supersonic dash and high-Mach BVR closure), <code>WVR DOGFIGHTER</code> (close-range visual merge with corner-speed snapshots), <code>SWARM FLIGHT SCREEN</code> (flank picket drawing fire with ripple micro-missiles), <code>FORMATION ESCORT</code> (tight defensive screen shielding lead or strike assets), <code>SEAD ESCORT</code> (hunts surface radar arrays/SAMs with anti-radiation missiles), <code>STRIKE INTERDICTION</code> (low-deck cruise missile/glide bomb delivery), <code>STEALTH AMBUSH</code> (unannounced broadside BVR volleys from boundary corridors), <code>AIR DOMINANCE SWEEP</code> (forward air combat merge), or <code>COMMAND FLAGSHIP</code> (ace superfighter lead).</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Commander Focus</td>
              <td>Displays whether the airframe is currently locked into an active attention slot and shows the countdown timer (in seconds) before focus is re-evaluated.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Active Focus Slots</td>
              <td>Shows current bandwidth utilization against total cognitive capacity (e.g. 1 slot on Cadet/Veteran, 2 on Elite/Ace, up to 3 on Master/Legend).</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Squadron Posture</td>
              <td>Indicates high-level doctrine: <code>OFFENSIVE SWEEP</code> (active engagement) vs <code>DEFENSIVE HOLD</code> (retreat toward fortified base perimeter, taking SAM cover if batteries are active, when fleet survival drops below 25-40%).</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Formation Role</td>
              <td>Reveals tactical placement: Flight Lead, Wingman (with designated element partner callsign), or Independent Element.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Chain of Command</td>
              <td>Reports command health. If the enemy Flight Lead is eliminated, surviving wingmen enter a <code>COMMAND DISRUPTION</code> state with a hesitation timer (6.0s on Cadet down to 1.8s on Legend) where weapons are locked and throttle drops to 40%.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Behavioral Discipline</td>
              <td>Displays probability ratings for executing Doppler notching break turns and filtering MALD decoy drones under current combat stress.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. THE 5 DIAGNOSTIC WORKSPACE TABS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>WORKSPACE TAB</th><th>DIAGNOSTIC DISPLAY &amp; TACTICAL TELEMETRY</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">OVERVIEW</td>
              <td>Segmented armor integrity pips, Mach corner velocity turn efficiency gauge, flight level altitude and VSI rate, kinetic energy recovery meter, AI cognition dossier (with active tactical role and behavioral assessment for enemies), and complete stores inventory.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">SENSORS</td>
              <td>Onboard radar specifications, active target locks, stealth RCS spectrum bar, aspect spike factors (nose-on, beam 90 deg, tail), and horizontal range-versus-distance comparison tracks for all contacts in beam.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">WEAPONS</td>
              <td>Dynamic hit probability (P_k percentage gauge), factor-by-factor breakdown (proportional navigation, energy deficit, cloud scattering), and inbound threat alerts with step-by-step countermeasure protocols.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">TRACE</td>
              <td>Chronological Causal Log recording weapon launches, missile intercepts, chaff deployments, and kill events. Tap any event to inspect detailed launch range, speed, and probability factors.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">DATA</td>
              <td>Complete raw telemetry registry: exact spatial coordinates (km), flight level, Mach airspeed, heading in degrees and radians, G-load stress, hardware components, and raw AI cognitive variables.</td>
            </tr>
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
        Upon sortie completion or mission abort, the After Action Report provides complete performance metrics, pilot podium rankings, chronological engagement timelines, and interactive tactical mission replays.
      </div>

      <div class="ge-subhead">1. SORTIE REPLAY CONTROLS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>CONTROL</th><th>FUNCTION</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Play / Pause</b></td><td>Start or suspend recorded sortie playback.</td></tr>
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
            Top 10 ranked missions are saved to local persistent storage. Revisit previous debriefs, examine participating rosters, and re-watch recorded tactical replays from the Leaderboard.
          </div>
        </div>
      </div>
    `
  }
];