/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 4 to 5
 * Covers: Radar Physics, Observability (RCS), Progressive Classification & Satellite Uplink
 */

window.MANUAL_SENSORS = [
  {
    id: 'ch4_radar_physics',
    title: 'SECTION 04: RADAR DETECTION EQUATION, CLUTTER FILTERS & STEALTH RCS',
    desc: `
      <div class="ge-subhead">THE RADAR RANGE EQUATION IN COMBAT</div>
      <div class="ge-desc">
        Radar detection distance is dynamically computed every simulation tick according to microwave physics:
      </div>

      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">TACTICAL RADAR RANGE FORMULATION:</span>
        <div class="ge-formula-code">R_detect = R_0 &times; (RCS / 1.0 m&sup2;)^0.25 &times; K_aspect &times; K_clutter &times; K_weather &times; K_sensor &times; K_jamming</div>
      </div>

      <div class="ge-callout">
        Because detection range scales with the <b>fourth root (0.25 power)</b> of Radar Cross Section, reducing an aircraft's signature by 10&times; cuts detection range by 44%; cutting RCS by 10,000&times; cuts detection range by 90%!
      </div>

      <div class="ge-subhead">RADAR CROSS SECTION (RCS in m&sup2;) SPECTRUM</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>RCS (m&sup2;)</th><th>STEALTH TIER</th><th>EQUIVALENT SIZE</th><th>TYPICAL DETECTION BASKET</th><th>AIRFRAME EXAMPLES</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">&le; 0.0005</td>
              <td><b>VLO Ghost Stealth</b></td>
              <td>Insect / Glass Marble</td>
              <td>Undetectable beyond 10&ndash;18 km nose-on</td>
              <td>F-22A, YF-23, B-21, RQ-180, F-22C [COFFIN]</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">0.001 &ndash; 0.01</td>
              <td><b>Low Observable (LO)</b></td>
              <td>Small Bird</td>
              <td>Detected at 20&ndash;35 km</td>
              <td>Su-57, J-20, F-35A, Kizilelma, Checkmate</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">0.15 &ndash; 0.80</td>
              <td><b>Reduced Signature</b></td>
              <td>Human Torso</td>
              <td>Detected at 45&ndash;60 km</td>
              <td>Rafale, Eurofighter, KF-21, Gripen</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">1.0 &ndash; 3.5</td>
              <td><b>Conventional</b></td>
              <td>Clean 4th-Gen Fighter</td>
              <td>Detected at 60&ndash;75 km</td>
              <td>F-16V, Mirage 2000, Tornado, Su-30SM</td>
            </tr>
            <tr>
              <td style="color:#ef4444;font-weight:800;">4.0 &ndash; 15.0+</td>
              <td><b>Reflective Barn</b></td>
              <td>Heavy Bomber / Transporter</td>
              <td>Detected across entire theater (80&ndash;120+ km)</td>
              <td>F-15EX, MiG-31BM, Tu-160M, Airliners</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">GIMBAL SCAN CONES (&plusmn;Degrees off Nose)</div>
      <div class="ge-desc">
        Radars steer electronically (AESA) or mechanically across a conical field of view:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Standard Radars (100&deg;&ndash;120&deg;):</b> Scan &plusmn;50&deg; to &plusmn;60&deg; off nose. Contacts outside this forward cone cannot be tracked or locked.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Cheek Array Radars (130&deg;&ndash;140&deg;):</b> Advanced airframes (Su-57, Su-35S, Eurofighter, ADF-11F) mount secondary cheek arrays, permitting target tracking while beaming 70&deg; off-boresight.</li>
        </ul>
      </div>

      <div class="ge-subhead">LOOK-DOWN GROUND CLUTTER SUPPRESSION (+X%)</div>
      <div class="ge-desc">
        When airborne radar looks downward toward terrain, surface reflections blind basic radar:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Fighters flying below <b>FL100 (10,000 ft)</b> gain natural terrain masking against high-altitude radars.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Radars with high <b>Look-Down Clutter Suppression (+25% to +45%)</b> (APG-81, Byelka, Captor-E) filter ground noise to track deck-skimming bandits.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'ch5_classification_uplink',
    title: 'SECTION 05: TARGET CLASSIFICATION, SQUADRON DATALINK & ORBITAL SATELLITE UPLINK',
    desc: `
      <div class="ge-desc">
        AIRSPACE STANDOFF simulates a full battlefield C4ISR architecture: progressive radar classification, inter-aircraft datalink telemetry sharing, and stratospheric orbital satellite tracking.
      </div>

      <div class="ge-subhead">1. THE THREE TARGET IDENTIFICATION PHASES</div>
      <div class="ge-grid-3">
        <div class="ge-card" style="border-left:3px solid #64748b;">
          <b style="color:#94a3b8;">PHASE 0: INVISIBLE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Target is outside radar reach, masked in dense clouds, or beyond sensor scan limits. Zero radar return displayed.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">PHASE 1: BOGEY [?]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Raw skin return tracked: shows 2D position, altitude (FL), speed, and heading vector, but <b>unconfirmed identity</b>. Firing on unverified bogeys incurs an immediate <b>-600 VP penalty</b>!
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PHASE 2: IDENTIFIED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Sensor fusion resolves turbine blade modulation (NCTR) or civil transponders. Full airframe model, weapons, and armor unlock. Cleared for weapons release!
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. SQUADRON DATALINK MESH &amp; MADL NETWORK</div>
      <div class="ge-desc">
        Modern air combat relies on shared situational awareness rather than isolated radars:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Shared Common Operational Picture:</b> If any friendly fighter, loyal wingman drone, or early warning radar array tracks a contact, the targeting data is instantly shared with all allied aircraft across the theater.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Command Token Regeneration Bonus:</b> Units mounting the <b>MADL Battle Link</b> or Flight Lead command suites accelerate your squadron command pool generation by <b>+0.10 to +0.30 Tokens/sec</b>.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Third-Party LOAL Missile Guidance:</b> Missiles with the <code>[DATALINK LOAL]</code> trait (such as AIM-120D, AIM-260, and Meteor) receive midcourse guidance corrections from wingmen. The shooter can execute a defensive Doppler notch or break turn while wingmen continue guiding the salvo toward the target!</li>
        </ul>
      </div>

      <div class="ge-subhead">3. AUTOMATIC ORBITAL SATELLITE RADAR UPLINK (&le;3 FIGHTERS REMAINING)</div>
      <div class="ge-desc">
        When the hostile fighter fleet is whittled down to <b>3 or fewer operational aircraft</b>, high-altitude military reconnaissance satellites automatically link directly with your tactical HUD:
      </div>

      <div class="ge-card" style="border:1.5px solid #00f0ff;background:#030a18;">
        <div style="color:#00f0ff;font-weight:900;font-size:0.78rem;font-family:var(--font-mono);">
          <img src="icons/star.svg" width="12" height="12" alt="Satellite" class="manual-inline-ico"> ORBITAL RECONNAISSANCE SATELLITE CONSTELLATION OVERRIDE:
        </div>
        <ul style="list-style:none;padding-left:0;margin:6px 0 0 0;font-size:0.74rem;color:#e0f2fe;line-height:1.55;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Total Fog-of-War Bypass:</b> Downlink radar permanently illuminates all remaining hostiles across the entire 150 km &times; 100 km theater, completely ignoring stealth coatings (VLO), terrain masking, and clouds.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Instant Positive Identification:</b> Hostile airframes, flight lead status, and health states are immediately decoded as friendly combat tracks, eliminating unverified bogey firing risks.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Pulsing Tactical Locator Beacons:</b> A pulsing cyan locator ring surrounds each remaining hostile aircraft on radar tagged with <code>[PINPOINTED]</code>.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Off-Screen Edge Clamp Arrows:</b> If your radar camera pans away, persistent directional arrows at the viewport perimeter point directly toward their bearing and display live distance.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Instant Auto-Lock:</b> Pressing <span class="manual-key-badge">SPACEBAR</span> or tapping a pinpointed contact immediately acquires an optimal firing solution for rapid mission conclusion!</li>
        </ul>
      </div>

      <div class="ge-subhead">4. DISTANT &amp; ENEMY-SECTOR CIVILIAN IDENTIFICATION</div>
      <div class="ge-desc">
        Commercial flights entering deep within contested or enemy sectors (X &gt; 75 km) experience reduced secondary surveillance interrogation. They remain unverified <b>BOGEY [?]</b> contacts for <b>14 to 20 seconds</b> until closing within sensor range or friendly territory.
        <br><br>
        <span style="color:#f97316;font-weight:800;">TACTICAL WARNING:</span> Never launch long-range missiles at distant bogeys without positive ID. Launching upon unverified contacts immediately triggers a <b>-600 VP RoE penalty</b> upon firing, plus severe civilian strike (-500 VP) and shootdown (-2000 VP) penalties if an airliner is struck!
      </div>
    `
  }
];