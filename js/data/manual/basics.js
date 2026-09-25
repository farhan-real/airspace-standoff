/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 1 to 3
 * Covers: Core Rules, Kinematics & Throttle, Corner Velocity & Gunnery
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'SECTION 01: OPERATIONAL DOCTRINE, DEFENSE ALLOCATION & COMBAT ROE',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced fighter squadron in an contested electromagnetic combat arena. Master these foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($400.0M BUDGET) &amp; FLIGHT LEAD SELECTION</div>
      <div class="ge-desc">
        Your squadron can deploy up to <b>16 combat airframes</b> within your defense budget. Designate one aircraft as your <b>[FLIGHT LEAD]</b> <img src="icons/star.svg" width="11" height="11" alt="Lead" class="manual-inline-ico"> in the Hangar. The Lead flies in the <b>central formation slot</b> and receives specialized upgrades:
      </div>

      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#00f0ff;">STEALTH LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> RAM edge-treatment cuts 90&deg; beam radar spike by <b>50%</b>.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15%</b> missile evasion via low-observable signature management.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15.0 km</b> active radar reach via high-power GaN AESA transmitters.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+1 HP</b> structural armor bulkhead reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">AIR SUPERIORITY LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> clean airframe radar cross-section via leading-edge coatings.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Cockpit environmental control systems delay pilot G-fatigue by <b>50%</b>.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+18%</b> defensive break-turn evasion &amp; <b>+12%</b> missile P_k accuracy.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+2 HP</b> titanium-alloy framework reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#38bdf8;">MULTIROLE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+2 Max HP</b> composite armor durability.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Optimized fly-by-wire gain provides <b>+20%</b> instantaneous turn authority.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> base turnaround duration for accelerated replenishment.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+18%</b> missile evasion &amp; <b>+3</b> emergency chaff charges.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f97316;">STRIKE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+3 Max HP</b> armor with titanium cockpit tub enclosure.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-1 Damage</b> structural reduction per missile impact.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>60%</b> cannon fire deflection against enemy close-in strafes.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> ordnance drag penalty elimination.
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. STORES ARCHITECTURE: INTERNAL BAYS, EXTERNAL PYLONS &amp; CENTERLINE STATIONS</div>
      <div class="ge-desc">
        Weapons stations follow strict aerospace physics and geometric enclosure rules:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #14b8a6;">
          <b style="color:#2dd4bf;">INTERNAL WEAPONS BAY (STEALTH AIRFRAMES)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zero Parasite Drag:</b> Enclosed behind sealed fuselage doors; causes zero aerodynamic wave drag.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zero Extra RCS:</b> Preserves clean Very Low Observable (VLO) stealth.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Restricted Munitions:</b> Accepts only compact internal-rated missiles (e.g. AIM-120D, PL-15E, Meteor, AIM-260, AIM-9X, GBU-39).
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #0284c7;">
          <b style="color:#38bdf8;">EXTERNAL WING &amp; FUSELAGE PYLONS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Universal Mounting:</b> Carries internal-rated missiles, heavy missiles (R-37M, PL-21), cruise missiles, and ECM pods.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Parasite Wave Drag:</b> Reduces top speed and acceleration while ordnance is loaded.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Radar Bloom:</b> Exposed ordnance adds pylon RCS, compromising stealth.
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'ch2_kinematics',
    title: 'SECTION 02: FLIGHT KINEMATICS, CORNER VELOCITY & PROPULSION DETENTS',
    desc: `
      <div class="ge-desc">
        Aerodynamic flight models physical dynamics: airspeed, altitude, air density, structural G-loading, corner velocity, and throttle propulsion states.
      </div>

      <div class="ge-subhead">1. OPTIMAL CORNER VELOCITY (V_CORNER / sOpt) &amp; TURN EFFICIENCY</div>
      <div class="ge-desc">
        Every airframe possesses an <b>Optimal Corner Speed</b> (displayed on HUD as <code>sOpt</code>):
        <br><br>
        <ul style="list-style:none;padding-left:0;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Peak Turn Rate:</b> Flying within &plusmn;12% of corner velocity delivers <b>100% turn authority</b>.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Maneuver Defense:</b> Defensive break turns scale with turn efficiency. Throttling into corner velocity before breaking maximizes missile evasion probability.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>COFFIN Exemption:</b> Synthetic vision airframes maintain 100% turn rate authority across all airspeeds.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. ENGINE POWER MODES: IDLE, CRUISE, MILITARY POWER &amp; AFTERBURNER</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>POWER DETENT</th><th>THROTTLE %</th><th>AIRSPEED TARGET</th><th>OPERATIONAL CHARACTERISTICS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">IDLE</td>
              <td>20% - 35%</td>
              <td>~45% Max Speed</td>
              <td>Lowest power setting. Rapidly bleeds speed to re-enter corner velocity. Cools exhaust plume.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CRUISE</td>
              <td>36% - 74%</td>
              <td>~65% Max Speed</td>
              <td>Standard formation transit setting. Aligns with corner velocity for maximum turn authority.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">MIL POWER</td>
              <td>75% - 85%</td>
              <td>~85% Max Speed</td>
              <td>Maximum dry thrust without afterburner fuel injection. High climb rate without IR bloom.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">AFTERBURNER</td>
              <td>86% - 100%</td>
              <td>100% Max Speed</td>
              <td>Wet thrust for maximum sprint speed (+15% tracking vulnerability to IR missiles).</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch3_stress_coffin',
    title: 'SECTION 03: AIRFRAME PAYLOAD RATIOS, PILOT G-LOAD & COFFIN INTERFACE',
    desc: `
      <div class="ge-subhead">PAYLOAD RATIO (LOAD %) &amp; WEIGHT CALCULATIONS</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PAYLOAD RATIO FORMULATION:</span>
        <div class="ge-formula-code">Payload % = (Equipment Mass + External Drag Mass &times; 0.40) / Max Payload Mass &times; 100%</div>
      </div>

      <div class="ge-subhead">PILOT G-LOAD FATIGUE, TUNNEL VISION &amp; G-LOC</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #ffb830;">
          <b style="color:#ffb830;">TUNNEL VISION (STRESS &ge; 0.65)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Visual field constriction. Turn authority degrades by <b>30%</b>, weapon targeting accuracy decreases by <b>15%</b>, and defensive evasion drops by <b>50%</b>.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ef4444;">
          <b style="color:#ef4444;">G-LOC BLACKOUT (STRESS &ge; 0.95)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Temporary loss of consciousness for <b>2.8 seconds</b>. The aircraft maintains current heading without maneuver authority.
          </div>
        </div>
      </div>
    `
  }
];