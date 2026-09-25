/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 4 to 5
 * Covers: Radar Physics, Observability (RCS), Target Classification
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
        <span style="color:#94a3b8;font-size:0.62rem;">RADAR RANGE FORMULATION:</span>
        <div class="ge-formula-code">R_detect = R_0 &times; (RCS / 1.0 m&sup2;)^0.25 &times; K_aspect &times; K_clutter &times; K_weather &times; K_sensor &times; K_jamming</div>
      </div>

      <div class="ge-callout">
        Detection range scales with the <b>fourth root (0.25 power)</b> of Radar Cross Section. Reducing an aircraft's signature by 10x cuts detection range by 44%; cutting RCS by 10,000x cuts detection range by 90%.
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
              <td><b>Very Low Observable (VLO)</b></td>
              <td>Insect / Marble</td>
              <td>Deep standoff nose-on mitigation</td>
              <td>F-22A, YF-23, B-21, RQ-180</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">0.001 - 0.01</td>
              <td><b>Low Observable (LO)</b></td>
              <td>Small Bird</td>
              <td>Suppressed acquisition envelope</td>
              <td>Su-57, J-20, F-35A, Kizilelma</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">0.15 - 0.80</td>
              <td><b>Reduced Signature</b></td>
              <td>Human Torso</td>
              <td>Detected at 45-60 km</td>
              <td>Rafale, Eurofighter, KF-21, Gripen</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">1.0 - 3.5</td>
              <td><b>Conventional</b></td>
              <td>4th-Gen Fighter</td>
              <td>Detected at 60-75 km</td>
              <td>F-16V, Mirage 2000, Tornado, Su-30SM</td>
            </tr>
            <tr>
              <td style="color:#ef4444;font-weight:800;">4.0 - 15.0+</td>
              <td><b>High Reflectivity</b></td>
              <td>Heavy Bomber / Transporter</td>
              <td>Detected across entire sector (80-120+ km)</td>
              <td>F-15EX, MiG-31BM, Tu-160M, Airliners</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch5_classification_uplink',
    title: 'SECTION 05: TARGET CLASSIFICATION & RADAR SURVEILLANCE',
    desc: `
      <div class="ge-subhead">1. TARGET CLASSIFICATION PHASES</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">PHASE 1: BOGEY [?] (INITIAL SKIN TRACK)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Displays position, altitude (FL), speed, and heading, but unverified identity. Firing on unverified bogeys incurs a strict <b>-600 VP RoE penalty</b>.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PHASE 2: POSITIVELY IDENTIFIED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Sensor dwell resolves NCTR modulation. Full airframe model, callsign, and stores unlock. Cleared for ROE-compliant missile release.
          </div>
        </div>
      </div>
    `
  }
];