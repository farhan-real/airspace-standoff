/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 4 to 5
 * Covers: Radar Physics, Observability (RCS), Progressive Classification & Satellite Uplink
 */

window.MANUAL_SENSORS = [
  {
    id: 'ch4_radar_physics',
    title: 'SECTION 04 // RADAR DETECTION EQUATION, CLUTTER FILTERS & STEALTH RCS',
    desc: `
      <div class="ge-subhead">THE RADAR RANGE EQUATION IN COMBAT</div>
      <div class="ge-desc">
        Radar detection distance is dynamically computed every simulation tick according to microwave physics:
      </div>

      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">TACTICAL RADAR RANGE FORMULATION:</span>
        <div class="ge-formula-code">R_detect = R_0 × (RCS / 1.0 m²)^0.25 × K_aspect × K_clutter × K_weather × K_sensor × K_jamming</div>
      </div>

      <div class="ge-callout">
        Because detection range scales with the <b>fourth root (0.25 power)</b> of Radar Cross Section, reducing an aircraft's signature by 10× cuts detection range by 44%; cutting RCS by 10,000× cuts detection range by 90%!
      </div>

      <div class="ge-subhead">RADAR CROSS SECTION (RCS in m²) SPECTRUM</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>RCS (m²)</th><th>STEALTH TIER</th><th>EQUIVALENT SIZE</th><th>TYPICAL DETECTION BASKET</th><th>AIRFRAME EXAMPLES</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">&le; 0.0005</td>
              <td><b>VLO Ghost Stealth</b></td>
              <td>Insect / Glass Marble</td>
              <td>Undetectable beyond 10–18 km nose-on</td>
              <td>F-22A, YF-23, B-21, RQ-180, F-22C [COFFIN]</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">0.001 – 0.01</td>
              <td><b>Low Observable (LO)</b></td>
              <td>Small Bird</td>
              <td>Detected at 20–35 km</td>
              <td>Su-57, J-20, F-35A, Kizilelma, Checkmate</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">0.15 – 0.80</td>
              <td><b>Reduced Signature</b></td>
              <td>Human Torso</td>
              <td>Detected at 45–60 km</td>
              <td>Rafale, Eurofighter, KF-21, Gripen</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">1.0 – 3.5</td>
              <td><b>Conventional</b></td>
              <td>Clean 4th-Gen Fighter</td>
              <td>Detected at 60–75 km</td>
              <td>F-16V, Mirage 2000, Tornado, Su-30SM</td>
            </tr>
            <tr>
              <td style="color:#ef4444;font-weight:800;">4.0 – 15.0+</td>
              <td><b>Reflective Barn</b></td>
              <td>Heavy Bomber / Transporter</td>
              <td>Detected across entire theater (80–120+ km)</td>
              <td>F-15EX, MiG-31BM, Tu-160M, Airliners</td>
            </tr>
          </tbody>
        </table>
      </div>

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
    title: 'SECTION 05 // TARGET CLASSIFICATION PIPELINE & ORBITAL SATELLITE UPLINK',
    desc: `
      <div class="ge-desc">
        AIRSPACE STANDOFF simulates an authentic multi-stage radar signal intelligence pipeline rather than displaying omniscient contact data.
      </div>

      <div class="ge-subhead">THE THREE RADAR DETECTION PHASES</div>
      <div class="ge-grid-3">
        <div class="ge-card" style="border-left:3px solid #64748b;">
          <b style="color:#94a3b8;">PHASE 0: INVISIBLE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Target distance exceeds radar detection range, target is concealed inside weather clouds, or outside forward radar cone. Display shows zero returns.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">PHASE 1: BOGEY [?]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Radar tracks 2D coordinates, heading vector, altitude (FL), and speed, but cannot confirm airframe model or weapons. Displayed as an orange warning diamond.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PHASE 2: IDENTIFIED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Continuous tracking over several seconds resolves turbine blade modulation (NCTR) or electronic emissions. Unlocks full contact dossier.
          </div>
        </div>
      </div>

      <div class="ge-subhead">AUTOMATIC SATELLITE RADAR UPLINK (&le;3 FIGHTERS REMAINING)</div>
      <div class="ge-desc">
        When only <b>3 or fewer hostile fighters remain alive</b> in the theater, high-altitude orbital reconnaissance satellites link directly with your cockpit:
      </div>

      <div class="ge-card" style="border:1.5px solid #00f0ff;background:#030a18;">
        <div style="color:#00f0ff;font-weight:900;font-size:0.78rem;font-family:var(--font-mono);">ORBITAL SATELLITE CONSTELLATION OVERRIDE:</div>
        <ul style="margin:6px 0 0 16px;font-size:0.74rem;color:#e0f2fe;line-height:1.55;">
          <li><b>Permanent Sensor Broadcast:</b> The remaining hostiles are constantly revealed on your radar, completely bypassing fog-of-war and stealth concealment.</li>
          <li><b>Instant Target Identification:</b> Target identities, airframe models, and armor states are fully decoded.</li>
          <li><b>Pulsing Tactical Locator Beacons:</b> A pulsing locator ring surrounds remaining fighters on radar tagged with <code>[PINPOINTED]</code>.</li>
          <li><b>Off-Screen Clamp Arrows:</b> If camera tracking or zoom pans away, persistent directional edge arrows point directly toward their positions.</li>
          <li><b>Instant Auto-Lock:</b> Pressing <b>[SPACEBAR]</b> or tapping the target immediately locks onto them for rapid sortie conclusion!</li>
        </ul>
      </div>
    `
  }
];