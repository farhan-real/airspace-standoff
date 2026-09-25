/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 6 to 7
 * Covers: Guided Munitions, Propulsion Stages, Guidance Kinematics, Electronic Warfare
 */

window.MANUAL_COMBAT = [
  {
    id: 'ch6_weapons_salvos',
    title: 'SECTION 06: GUIDED MISSILES, PROPULSION STAGES & GUIDANCE KINEMATICS',
    desc: `
      <div class="ge-subhead">1. MISSILE SEEKER HEADS &amp; DEFENSIVE COUNTERMEASURES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SEEKER</th><th>HOMING METHOD</th><th>SLOT COMPATIBILITY</th><th>DEFENSIVE COUNTERMEASURE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ARH</td>
              <td>Active Radar Homing (AIM-120D, Meteor, PL-15E, AIM-260, R-37M, PL-21)</td>
              <td>Internal &amp; External Racks</td>
              <td><b>Doppler Notch (Beam 90&deg;) + Chaff / ECM Pod / Decoys.</b> Cuts radial closure velocity to zero and drops tracking lock.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">IIR / EO</td>
              <td>Imaging Infrared / Optical (AIM-9X, R-73, Python-5, IRIS-T)</td>
              <td>Internal &amp; External Racks</td>
              <td><b>Throttle to Idle / Dive into Clouds.</b> Clouds scatter infrared tracking; idle cuts thermal signature.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">INS</td>
              <td>Inertial Navigation with Terminal Radar (Kh-47M2 Kinzhal)</td>
              <td>Centerline Station Only</td>
              <td><b>Perpendicular Break Turn / CIWS Defense.</b> Break hard 90&deg; perpendicular to dive path.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RADAR</td>
              <td>Anti-Radiation Homing (AGM-88G AARGM-ER)</td>
              <td>Internal &amp; External Racks</td>
              <td>Power down emitting radar arrays, deactivate airborne jammer pods, or intercept with CIWS.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. PROPORTIONAL NAVIGATION GUIDANCE</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PRONAV COMMAND TURN RATE FORMULATION:</span>
        <div class="ge-formula-code">&omega;_m = N &times; (V_c / V_m) &times; &lambda;_dot</div>
      </div>
      <div class="ge-desc">
        The seeker tracks the rotation rate of Line of Sight (&lambda;_dot) and closure velocity (V_c), flying a predictive lead pursuit collision course. High-G breaks force rapid spikes in LOS rotation to force kinetic overshoots.
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'SECTION 07: ELECTRONIC WARFARE & DEFENSIVE MANEUVERS',
    desc: `
      <div class="ge-subhead">1. HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90&deg;)</div>
      <div class="ge-desc">
        Turn your aircraft exactly <b>90&deg; perpendicular</b> to the threat's radar vector (beam aspect). Relative radial closure speed drops to zero relative to ground clutter, breaking lock. Dispensing chaff creates an artificial zero-Doppler false echo.
      </div>

      <div class="ge-subhead">2. FLIGHT MANEUVERS REFERENCE</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>MANEUVER</th><th>COST</th><th>TIME</th><th>BASE EVASION</th><th>TRIGGER CONDITION &amp; EFFECT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Doppler Notch &amp; Chaff</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+48%</td>
              <td>Trigger on active radar (ARH) lock. Beams threat 90&deg;, cuts closure rate, and pops chaff.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.0s</td>
              <td>+45%</td>
              <td>Trigger on inbound missile within 25 km. High-G spiral disrupts proportional pursuit.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev's Cobra</td>
              <td>0.8 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">6.0s</td>
              <td>+55%</td>
              <td>Requires TVC. Pitch up to 110&deg; creates immediate closure rate mismatch.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Dive</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.5s</td>
              <td>+45%</td>
              <td>Requires altitude &gt; FL150. Inverts aircraft and dives to recover Mach speed out of envelope.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];