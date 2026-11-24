/**
 * js/data/manual/basics.js - Flight Manual Sections 01 to 03: Basics, Kinematics & Stress.
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'SECTION 01: OPERATIONAL DOCTRINE, DEFENSE ALLOCATION & FLIGHT LEAD',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced fighter squadron in a contested airspace. Master these foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($200M - $1,000M CR) &amp; FLIGHT LEAD SELECTION</div>
      <div class="ge-desc">
        Your maximum squadron size scales proportionally with your selected defense budget (<b>8 aircraft at $200M</b> at 1.75x VP, <b>12 at $300M</b>, standard <b>16 aircraft at $400M</b> at 1.00x VP, up to <b>40 aircraft at $1,000M</b> at 0.40x VP), allowing large wings of lightweight fighters supported by unmanned drones or compact elite stealth formations. Designate one aircraft as your <b>[FLIGHT LEAD]</b> <img src="icons/star.svg" width="11" height="11" alt="Lead" class="manual-inline-ico"> in the Hangar. The Lead flies in the <b>central formation slot</b> and receives specialized upgrades:
      </div>

      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#00f0ff;">STEALTH LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> RAM edge-treatment cuts 90&deg; beam radar spike by <b>50%</b> &amp; clean RCS by <b>35%</b>.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15%</b> missile evasion &amp; <b>+0.25 TOK/s</b> datalink regen.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15.0 km</b> active radar reach &amp; <b>1.6x</b> faster target ID.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+1 HP</b> structural armor bulkhead reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">AIR SUPERIORITY LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> clean airframe RCS &amp; <b>+10%</b> top sprint airspeed.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Pressurized cockpit delays pilot G-fatigue by <b>50%</b>.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+18%</b> break-turn evasion &amp; <b>+12%</b> missile P_k accuracy.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+2 HP</b> titanium-alloy framework reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#38bdf8;">MULTIROLE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+2 Max HP</b> composite armor &amp; <b>+0.20 TOK/s</b> datalink.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Digital fly-by-wire provides <b>+20%</b> turn authority.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Rapid RTB</b> (1.8s turnaround) for accelerated rearm.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+18%</b> missile evasion &amp; <b>+3</b> emergency chaff charges.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f97316;">STRIKE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+3 Max HP</b> armor with titanium cockpit tub enclosure.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-1 Damage</b> structural reduction per missile impact.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>60%</b> cannon fire deflection against close-in strafes.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> ordnance weight &amp; drag penalty relief.
          </div>
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #c084fc;">
        <b style="color:#c084fc;">EW, DRONE &amp; EXPERIMENTAL LEAD SUITES</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>EW Leads</b> gain +2 HP, +25% jamming output (up to 95%), passive ESM, +3 chaff, and +20% evasion. <b>Drone Leads</b> gain +2 HP, +15% swarm dodge, 2x MALD decoy drones, +12% Pk, and +20% evasion. <b>Experimental Leads</b> gain +2 HP, +0.30 TOK/s datalink, -40% thermal bloom, and +15% evasion.
        </div>
      </div>

      <div class="ge-subhead">2. STORES ARCHITECTURE: INTERNAL BAYS, EXTERNAL PYLONS &amp; CENTERLINE</div>
      <div class="ge-desc">
        Weapons stations follow aerospace weight ratings (<b>Type S</b> Light, <b>Type M</b> Medium, <b>Type H</b> Heavy, and <b>Type X</b> Strategic) and geometric enclosure rules:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #14b8a6;">
          <b style="color:#2dd4bf;">INTERNAL WEAPONS BAY (STEALTH AIRFRAMES)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zero Parasite Drag &amp; Zero Extra RCS:</b> Concealed behind fuselage doors to preserve clean VLO stealth.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Compact Munitions:</b> Accepts internal-rated weapons (e.g. AIM-120D, PL-15E, Meteor, AIM-260, AIM-9X, GBU-39, AGM-88G).
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #0284c7;">
          <b style="color:#38bdf8;">EXTERNAL PYLONS &amp; CENTERLINE STATIONS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>External Pylons:</b> Carry heavy missiles (R-37M, PL-21), gunpods, and ECM/Targeting pods at the cost of wave drag and radar bloom.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Centerline Fuselage Station:</b> Heavy belly rail certified for oversized hypersonic missiles (Kinzhal, Kh-32, BrahMos-A) and 3,000 kg bombs.
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
            <tr><th>POWER DETENT</th><th>THROTTLE %</th><th>AIRSPEED TARGET</th><th>OPERATIONAL &amp; THERMAL CHARACTERISTICS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">IDLE</td>
              <td>20% - 35%</td>
              <td>~45% Max Speed</td>
              <td>Lowest power setting. Bleeds speed to re-enter corner velocity and cools exhaust plume (<b>0.70x</b> thermal bloom vs IR missiles).</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CRUISE</td>
              <td>36% - 74%</td>
              <td>~65% Max Speed</td>
              <td>Standard formation transit setting. Aligns with corner velocity for maximum turn authority at normal <b>1.00x</b> IR heat.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">MIL POWER</td>
              <td>75% - 85%</td>
              <td>~85% Max Speed</td>
              <td>Maximum dry thrust without afterburner fuel injection. Strong climb rate without wet thermal bloom penalty.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">AFTERBURNER</td>
              <td>86% - 100%</td>
              <td>100% Max Speed</td>
              <td>Wet thrust for maximum sprint speed, creating a bright exhaust plume (<b>1.45x</b> thermal bloom) vulnerable to IR seekers.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. BUILT-IN AUTOCANNONS VS. INTEGRATED DIRECTED-ENERGY LASERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>GUN CLASS</th><th>WEIGHT &amp; SPEED IMPACT</th><th>AIRFRAME RCS IMPACT</th><th>COMBAT TRADE-OFFS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Ballistic Autocannons (M61A2, GSh-30-1, BK-27, GAU-22)</td>
              <td>Light (35 to 150 kg) &bull; <b>0% Speed Loss</b></td>
              <td><b>Flush Stealth (+0% RCS)</b></td>
              <td>Zero thermal spike, 100% cloud penetration, wide 38&deg; to 60&deg; snapshot cones, and kinetic shock, limited to 3.6 to 6.0 km merge range.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Integrated Pulse &amp; Solid-State Lasers (PLSL-10/20/30, 80 kW DEW)</td>
              <td>Heavy capacitor &amp; cooling plant (<b>130 to 520 kg</b>) &bull; <b>-4% to -9% Max Sprint Speed</b></td>
              <td><b>+25% to +85% Base Airframe RCS</b> (scales with your jet&rsquo;s own stealth shaping)</td>
              <td>Instant hitscan reach out to 7.5 to 18.0 km with zero lead error, but firing triggers a 3.5s IR thermal spike, clouds scatter 70% to 80% beam power, and narrow 26&deg; to 34&deg; cones demand boresight alignment.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Electromagnetic Railgun (EML)</td>
              <td>320 kg &bull; 0% Drag Penalty</td>
              <td>Flush (+0% RCS)</td>
              <td>All-weather 9.5 km hypervelocity kinetic slugs with 90% AP and target energy drain, constrained to a tight 22&deg; boresight cone and 8-slug capacity.</td>
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
      <div class="ge-subhead">1. PAYLOAD RATIO (LOAD %) &amp; WEIGHT CALCULATIONS</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PAYLOAD RATIO FORMULATION:</span>
        <div class="ge-formula-code">Payload % = (Equipment Mass / Max Payload Mass) &times; 100% (reduced by Pylon Fairings &amp; Strike Lead)</div>
      </div>
      <div class="ge-desc">
        Carriage weight directly degrades flight kinematics: Light (&le; 35%), Normal (36% - 60%), Heavy (61% - 80%), and Overload (&gt; 80%). Overloading external hardpoints reduces maximum sprint Mach by up to 22% (plus up to 22% external drag) and slows acceleration.
      </div>

      <div class="ge-subhead">2. PILOT G-LOAD FATIGUE, TUNNEL VISION &amp; G-LOC</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #ffb830;">
          <b style="color:#ffb830;">TUNNEL VISION (STRESS &ge; 0.65)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Visual field constriction caused by sustained blood pooling under high lateral Gs. Turn authority degrades by <b>30%</b>, gun targeting accuracy decreases by <b>25%</b>, and active maneuver bonuses drop by <b>25%</b>.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ef4444;">
          <b style="color:#ef4444;">G-LOC BLACKOUT (STRESS &ge; 0.95)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            G-induced Loss of Consciousness for <b>2.8 seconds</b>. The pilot collapses, controls freeze, and the aircraft continues on a ballistic heading without evasive capability until recovery.
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. COFFIN (CONNECTION FOR FLIGHT INTERFACE) SYNTHETIC VISION</div>
      <div class="ge-desc">
        The <b>COFFIN Interface</b> replaces the conventional canopy with a sealed, armored titanium-alloy cockpit tub and pressurized G-protective flight capsule. Multi-spectral optical camera arrays project a zero-latency, spherical 360&deg; synthetic vision panorama directly to the pilot:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">100% TURN EFFICIENCY LOCKED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            COFFIN flight control computers bypass biological aerodynamic constraints. Turn rate authority is <b>permanently locked at 100% efficiency</b> across all speed regimes, completely immune to corner velocity mismatch penalties.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">ZERO G-STRESS &amp; G-LOC IMMUNITY</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Pressurized anti-G flight capsule and advanced damping eliminate physical blood pooling. Pilots accumulate <b>zero G-fatigue stress</b> and possess absolute immunity to Tunnel Vision and G-LOC blackouts up to 20G structural limits.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">AUTOMATED EVASIVE RESPONSE (+24% TO +30%)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            High-bandwidth synthetic vision and predictive fly-by-wire processing eliminate control latency. COFFIN airframes receive a constant passive <b>+24% to +30% evasive dodge bonus</b> against all incoming guided missiles.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">MANUAL CREWED FLIGHT CONTROL</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Unlike autonomous UCAV drones, COFFIN airframes (e.g. F-15 S/MT, Su-37, F-22C, ADF-11F) remain under <b>100% manual human pilot command</b>, blending machine reaction times with human pilot intuition.
          </div>
        </div>
      </div>
    `
  }
];
