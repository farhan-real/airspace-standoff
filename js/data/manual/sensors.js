/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 4 to 5
 * Covers: Radar Physics, Observability (RCS), Target Identification & Satellite Uplink
 */

window.MANUAL_SENSORS = [
  {
    id: 'ch4_radar_physics',
    title: 'SECTION 04: RADAR DETECTION EQUATION, CLUTTER FILTERS & STEALTH RCS',
    desc: `
      <div class="ge-subhead">1. THE RADAR RANGE EQUATION IN COMBAT</div>
      <div class="ge-desc">
        Radar detection distance is dynamically computed every simulation tick according to microwave physics:
      </div>

      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">RADAR RANGE FORMULATION:</span>
        <div class="ge-formula-code">R_detect = R_0 &times; (RCS / 1.0 m&sup2;)^0.25 &times; K_aspect &times; K_clutter &times; K_weather &times; K_sensor &times; K_jamming</div>
      </div>

      <div class="ge-card" style="border-left:3px solid var(--theme-accent);">
        <b style="color:var(--color-ice-highlight);">FOURTH-ROOT SCALING LAW</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          Detection range scales with the <b>fourth root (0.25 power)</b> of Radar Cross Section. Reducing an aircraft signature by 10x cuts detection range by 44%; cutting RCS by 10,000x cuts detection range by 90%. Very Low Observable airframes achieve extreme standoff mitigation against standard surveillance radars.
        </div>
      </div>

      <div class="ge-subhead">2. RADAR CROSS SECTION (RCS in m&sup2;) SPECTRUM</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>RCS (m&sup2;)</th><th>STEALTH TIER</th><th>EQUIVALENT SIZE</th><th>TYPICAL DETECTION BASKET</th><th>AIRFRAME EXAMPLES</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">&le; 0.0005</td>
              <td><b>Very Low Observable (VLO)</b></td>
              <td>Insect / Marble</td>
              <td>Deep standoff nose-on mitigation (&lt; 20 km)</td>
              <td>F-22A, YF-23, B-21, RQ-180</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">0.001 - 0.01</td>
              <td><b>Low Observable (LO)</b></td>
              <td>Small Bird</td>
              <td>Suppressed acquisition envelope (25 - 38 km)</td>
              <td>Su-57, J-20, F-35A, Kizilelma</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">0.15 - 0.80</td>
              <td><b>Reduced Signature</b></td>
              <td>Human Torso</td>
              <td>Detected at 45 - 60 km</td>
              <td>Rafale, Eurofighter, KF-21, Gripen</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">1.0 - 3.5</td>
              <td><b>Conventional</b></td>
              <td>4th-Gen Fighter</td>
              <td>Detected at 60 - 75 km</td>
              <td>F-16V, Mirage 2000, Tornado, Su-30SM</td>
            </tr>
            <tr>
              <td style="color:#ef4444;font-weight:800;">4.0 - 15.0+</td>
              <td><b>High Reflectivity</b></td>
              <td>Heavy Bomber / Transporter</td>
              <td>Detected across entire sector (80 - 120+ km)</td>
              <td>F-15EX, MiG-31BM, Tu-160M, Airliners</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch5_classification_uplink',
    title: 'SECTION 05: SENSORS, TARGET IDENTIFICATION & SATELLITE RADAR UPLINK',
    desc: `
      <div class="ge-desc">
        To prevent friendly fire and protect commercial air traffic, all contacts detected on your radar screen start as unverified tracks before continuous scanning confirms their identity.
      </div>

      <div class="ge-subhead">1. HOW TARGET IDENTIFICATION WORKS</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">PHASE 1: BOGEY [?] (UNVERIFIED CONTACT)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            When your radar first picks up a target, it appears as an orange diamond labeled <b>BOGEY [?]</b>. You can see its position, altitude, speed, and heading, but you cannot tell if it is friendly, hostile, or a civilian airliner. Firing a weapon at an unverified bogey violates Rules of Engagement and penalizes you <b>-600 VP</b> upon launch.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PHASE 2: POSITIVELY IDENTIFIED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Keep the target inside your radar scan cone. After a few seconds of continuous scanning, your avionics will recognize the aircraft type, callsign, and weapons. The blip turns Blue for friendly, Red for hostile, or Light Blue for civilian. Once identified as hostile, you are cleared to fire with no penalty.
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. SCANNING SPEED &amp; OPTICAL CAMERAS</div>
      <div class="ge-card">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.6;color:#cbd5e1;">
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Standard Identification Time:</b> Standard fighters take about <b>5.5 seconds</b> of steady radar tracking to identify. Stealth aircraft take about <b>11.0 seconds</b> because their shape deflects radar signals.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Close-Range Identification:</b> Closing within <b>18.0 km</b> burns through enemy radar jammers and identifies targets in under 2 seconds.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Optical IRST Cameras:</b> Aircraft equipped with nose-mounted optical cameras (like the Su-35S, Rafale, and Eurofighter) can visually identify targets from <b>28.0 km</b> away in clear skies, completely ignoring radar jammers.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Two-Player Mode:</b> In Two-Player mode, all aircraft are identified from the start so both commanders can engage immediately.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. SATELLITE RADAR UPLINK PROTOCOL</div>
      <div class="ge-desc">
        When only <b>3 or fewer enemy aircraft</b> remain in the theater, defense command locks orbital satellites to help you locate and finish off the remaining hostiles:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">CONSTANT SATELLITE BROADCAST</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Orbital satellites downlink the exact position, altitude, and heading of all surviving enemy fighters straight to your radar. Hostile stealth coatings, cloud cover, and distance limits no longer hide them.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">RADAR &amp; HUD NOTIFICATIONS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Pinpointed enemies are highlighted on radar with an electric blue pulse circle and labeled [PINPOINTED]. A banner appears across the top of your cockpit workspace: <code>SATELLITE RADAR UPLINK: X HOSTILE(S) REMAINING (PINPOINTED)</code>.
          </div>
        </div>
      </div>

      <div class="ge-subhead">4. FAKE RADAR BLIPS &amp; CIVILIAN AIRLINERS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#f97316;">GHOST BLIPS &amp; WEATHER CLUTTER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Heavy weather, clouds, and old chaff can create temporary fake radar echoes (Ghost Contacts). If you keep scanning them for 8 to 12 seconds, your radar will confirm they are just atmospheric clutter and the echo will fade away.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#38bdf8;">PROTECTED CIVILIAN FLIGHTS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Commercial passenger flights cross the airspace in designated transit lanes. They transmit civilian transponder codes. Damaging a civilian plane costs you <b>-500 VP</b>, and destroying one penalizes you <b>-2,000 VP</b>.
          </div>
        </div>
      </div>
    `
  }
];