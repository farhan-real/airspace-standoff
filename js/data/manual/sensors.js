/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 4 to 5
 * Covers: Radar Physics, Observability (RCS), Progressive Classification & Satellite Uplink
 */

window.MANUAL_SENSORS = [
  {
    id: 'ch4_radar_physics',
    title: 'CHAPTER 4: RADAR SENSORS, CLUTTER FILTERS & OBSERVABILITY (RCS)',
    desc: `
      <div class="ge-subhead">THE RADAR RANGE EQUATION IN COMBAT</div>
      <div class="ge-desc">
        Radar detection distance is dynamically computed every simulation tick according to microwave physics:
        <br><br>
        <center><code>R_detect = R_0 × (RCS / 1.0 m²)^0.25 × K_aspect × K_clutter × K_weather × K_sensor × K_jamming</code></center>
        <br>
        Because detection range scales with the <b>fourth root (0.25 power)</b> of Radar Cross Section, reducing an aircraft's signature by 10× cuts detection range by 44%; cutting RCS by 10,000× cuts detection range by 90%!
      </div>

      <div class="ge-subhead">RADAR CROSS SECTION (RCS in m²) SPECTRUM</div>
      <table class="ge-table">
        <thead>
          <tr><th>RCS (m²)</th><th>STEALTH CLASSIFICATION</th><th>RADAR FOOTPRINT EQUIVALENT</th><th>TYPICAL DETECTION BASKET</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:#00f0ff;">&le; 0.0005</td>
            <td><b>VLO Ghost Stealth</b></td>
            <td>Insect / glass marble (F-22A, YF-23, B-21, RQ-180, F-22C [COFFIN])</td>
            <td>Undetectable beyond 10–18 km nose-on.</td>
          </tr>
          <tr>
            <td style="color:#00f5a0;">0.001 – 0.01</td>
            <td><b>Low Observable (LO)</b></td>
            <td>Small bird (Su-57, J-20, F-35A, Kizilelma, Checkmate)</td>
            <td>Detected at 20–35 km.</td>
          </tr>
          <tr>
            <td style="color:#38bdf8;">0.15 – 0.80</td>
            <td><b>Reduced Signature</b></td>
            <td>Man-sized target (Rafale, Eurofighter, KF-21, Gripen)</td>
            <td>Detected at 45–60 km.</td>
          </tr>
          <tr>
            <td style="color:#ffb830;">1.0 – 3.5</td>
            <td><b>Conventional Fighter</b></td>
            <td>Clean 4th-Gen fighter (F-16V, Mirage 2000, Tornado)</td>
            <td>Detected at 60–75 km.</td>
          </tr>
          <tr>
            <td style="color:#ff3366;">4.0 – 15.0+</td>
            <td><b>Reflective Barn</b></td>
            <td>Heavy interceptor / strategic bomber (F-15EX, MiG-31, Tu-160M)</td>
            <td>Detected at 80–100+ km across entire arena.</td>
          </tr>
        </tbody>
      </table>

      <div class="ge-subhead">GIMBAL SCAN CONES (±Degrees off Nose)</div>
      <div class="ge-desc">
        Radars steer electronically (AESA) or mechanically across a conical field of view:
        <ul>
          <li><b>Standard Radars (100°–120°):</b> Scan ±50° to ±60° off nose. Contacts outside this forward cone cannot be tracked or locked.</li>
          <li><b>Cheek Array Radars (130°–140°):</b> Advanced airframes (Su-57, Su-35S, Eurofighter, ADF-11F) mount secondary cheek arrays, permitting target tracking while beaming 70° off-boresight.</li>
        </ul>
      </div>

      <div class="ge-subhead">LOOK-DOWN GROUND CLUTTER SUPPRESSION (+X%)</div>
      <div class="ge-desc">
        When airborne radar looks downward toward terrain, surface reflections blind basic radar:
        <ul>
          <li>Fighters flying below <b>FL100 (10,000 ft)</b> gain natural terrain masking against high-altitude radars.</li>
          <li>Radars with high <b>Look-Down Clutter Suppression (+25% to +45%)</b> (APG-81, Byelka, Captor-E) filter ground noise to track deck-skimming bandits.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'ch5_classification_uplink',
    title: 'CHAPTER 5: TARGET CLASSIFICATION & AUTOMATIC SATELLITE UPLINK',
    desc: `
      <div class="ge-desc">
        AIRSPACE STANDOFF simulates an authentic multi-stage radar signal intelligence pipeline rather than displaying omniscient contact data.
      </div>

      <div class="ge-subhead">THE THREE RADAR DETECTION PHASES</div>
      <div class="ge-desc">
        <ul>
          <li>
            <b>PHASE 0: INVISIBLE (Undetected):</b><br>
            Target distance exceeds radar detection range, target is hidden in clouds, or outside forward radar cone. Display shows zero returns.
          </li>
          <li>
            <b>PHASE 1: BOGEY [?] (Raw Doppler Track):</b><br>
            Radar tracks 2D coordinates, heading vector, altitude (FL), and speed, but <b>cannot determine airframe model, pilot callsign, or weapons</b>. Displayed as an unclassified warning diamond: <code>BOGEY [?] • R:36km • M 0.95 • FL320</code>.
          </li>
          <li>
            <b>PHASE 2: IDENTIFIED (Confirmed Classification):</b><br>
            Continuous tracking over time allows <b>Non-Cooperative Target Recognition (NCTR)</b> spectral analysis to resolve turbine blade modulation (JEM) or electronic emissions. Unlocks full contact dossier: <code>Trigger • [F-22A] STEALTH • M 1.08 • 5/5 HP</code>.
          </li>
        </ul>
      </div>

      <div class="ge-subhead">AUTOMATIC SATELLITE RADAR UPLINK (&le;3 FIGHTERS REMAINING)</div>
      <div class="ge-desc">
        When only <b>3 or fewer hostile fighters remain alive</b> in the theater, high-altitude orbital reconnaissance satellites link directly with your cockpit:
        <ul>
          <li><b>Permanent Sensor Broadcast:</b> The remaining hostiles are constantly revealed on your radar, completely bypassing fog-of-war and stealth concealment.</li>
          <li><b>Instant Identification:</b> Target identities, airframe models, and armor states are fully decoded.</li>
          <li><b>Pulsing Tactical Locator Beacons:</b> A pulsing locator ring surrounds the remaining fighters on radar, tagged with <code>[PINPOINTED]</code>.</li>
          <li><b>Off-Screen Clamp Arrows:</b> If camera tracking or zoom pans away, persistent directional edge arrows point directly toward their positions.</li>
          <li><b>Instant Auto-Lock:</b> Pressing <b>[SPACEBAR]</b> or tapping the target immediately locks onto them for rapid sortie conclusion!</li>
        </ul>
      </div>
    `
  }
];