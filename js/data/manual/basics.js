/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 1 to 3
 * Covers: Core Rules, Kinematics & Throttle, Flight Lead Systems & Tactical Gunnery
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'SECTION 01: OPERATIONAL DOCTRINE, DEFENSE ALLOCATION & COMBAT ROE',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced tactical fighter squadron in a high-density, contested electromagnetic combat arena. Master these foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($400.0M BUDGET) &amp; FLIGHT LEAD SELECTION</div>
      <div class="ge-desc">
        Your squadron can deploy up to <b>16 combat airframes</b> within your defense budget. Designate one aircraft as your <b>[FLIGHT LEAD]</b> <img src="icons/star.svg" width="11" height="11" alt="Lead" class="manual-inline-ico"> in the Hangar. The Lead always flies in the <b>central formation slot</b> and receives tactical upgrades tailored to airframe role and survivability:
      </div>

      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#00f0ff;">STEALTH LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Conformal RAM edge-treatment cuts 90&deg; beam radar spike by <b>50%</b>.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15%</b> missile evasion via low-observable seeker spoofing.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+15.0 km</b> active radar reach via high-power GaN AESA transmitters.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+1 HP</b> structural armor bulkhead reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">AIR SUPERIORITY LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>-40%</b> clean airframe radar cross-section via leading-edge coatings.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> Pressurized cockpit environmental systems delay pilot G-fatigue by <b>50%</b>.<br>
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
          <b style="color:#f97316;">ARMORED STRIKE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+3 Max HP</b> armor with welded titanium cockpit bathtub.<br>
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
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Restricted Munitions:</b> Accepts only compact internal-rated missiles (e.g. AIM-120D, PL-15E, Meteor, AIM-260, AIM-9X, GBU-39).<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Visual Layout:</b> Always displayed on top of the roster card, showing open slots.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #0284c7;">
          <b style="color:#38bdf8;">EXTERNAL WING &amp; FUSELAGE PYLONS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Universal Mounting:</b> Carries internal-rated missiles, external heavy missiles (R-37M, PL-21), cruise missiles, and ECM pods.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Parasite Wave Drag:</b> Reduces top speed and acceleration while ordnance is loaded.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Radar Bloom:</b> Exposed ordnance adds pylon RCS (&sigma;_pylon), compromising stealth.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Visual Layout:</b> Positioned in the middle of the roster card; hides individual empty slots.
          </div>
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #f59e0b;margin-top:6px;">
        <b style="color:#fbbf24;">CENTERLINE FUSELAGE STATION (HEAVY / HYPERSONIC)</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Dedicated Heavy Station:</b> High-capacity station under the fuselage centerline reserved for heavy strategic weapons (Kh-47M2 Kinzhal).<br>
          <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Selective Visibility:</b> Only rendered on the roster card when a centerline weapon is mounted. Hidden when unequipped.<br>
          <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Massive Dynamic Weight:</b> Imposes substantial form drag and radar return while mounted; shedding it drops over 8,000 kg instantly.
        </div>
      </div>

      <div class="ge-subhead">3. LIVE IN-BATTLE PERFORMANCE SHEDDING (PLAYER &amp; AI)</div>
      <div class="ge-desc">
        Loadout weight, aerodynamic drag, and pylon radar reflections update in real time as weapons are fired:
        <br><br>
        <span style="color:#00f0ff;font-weight:700;">DYNAMIC STEALTH &amp; SPEED RECOVERY:</span> When a stealth aircraft launches its external or centerline missiles in combat, the pylon radar cross-section bloom and parasite drag are immediately eliminated. A stealth fighter that entered contested airspace with an elevated RCS returns to pristine clean VLO stealth (e.g. 0.0001 m&sup2;) as soon as its external stores are expended. Both player and AI fighters benefit from dynamic drag and weight reduction.
      </div>

      <div class="ge-subhead">4. TACTICAL GUNNERY: BALLISTIC GATLINGS VS. DIRECTED ENERGY (LASERS)</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">BALLISTIC ROTARY CANNONS (M61A2, GAU-22, BK-27)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zero Thermal Bloom:</b> Firing draws no generator power and creates no thermal spike, preserving VLO stealth.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Wide Snapshot Cone (48&deg;&ndash;55&deg;):</b> High-G boresight authority allows scoring snapshot deflection hits during hard turns.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>100% All-Weather Penetration:</b> Tungsten shells pierce moisture clouds with zero damage degradation.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Kinetic Concussion:</b> Shell impacts induce pilot stress (+30%) and drain target kinetic energy (-15%).
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">DIRECTED ENERGY WEAPONS (DE-PULSE, PLSL, EML)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Speed-of-Light Hitscan:</b> Instantaneous thermal beam impact out to 7.5&ndash;18.0 km with zero travel time.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Narrow Pencil Beam (22&deg;&ndash;34&deg;):</b> Demands precise nose-pointing alignment.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Thermal Bloom:</b> Capacitor discharge increases IR signature (+60% for 4s), compromising stealth.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Scattered in Clouds:</b> Cloud vapor scatters optical beams, inflicting a 75% damage penalty.
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'ch2_kinematics',
    title: 'SECTION 02: FLIGHT KINEMATICS, SPEED ENVELOPES & PROPULSION DETENTS',
    desc: `
      <div class="ge-desc">
        Aerodynamic flight in AIRSPACE STANDOFF models real-world physical dynamics: airspeed, altitude, air density, structural G-loading, and throttle propulsion states.
      </div>

      <div class="ge-subhead">ENGINE POWER MODES: IDLE, CRUISE, MILITARY POWER &amp; AFTERBURNER</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>POWER DETENT</th><th>THROTTLE %</th><th>AIRSPEED PROFILE</th><th>TACTICAL CHARACTERISTICS &amp; THERMAL EMISSION</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">IDLE</td>
              <td>20% &ndash; 35%</td>
              <td>Mach 0.35 &ndash; 0.55</td>
              <td>Bleeds excess speed to re-enter corner velocity. Cools exhaust plume to minimize IR lock detection range.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CRUISE</td>
              <td>36% &ndash; 70%</td>
              <td>Mach 0.65 &ndash; 0.85</td>
              <td>Standard formation transit. Optimal fuel efficiency, stable turn performance, and minimal thermal emissions.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">MIL POWER</td>
              <td>71% &ndash; 85%</td>
              <td>Mach 0.85 &ndash; 1.05</td>
              <td>Maximum dry thrust. High acceleration and climb performance without blooming the infrared exhaust plume.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">AFTERBURNER</td>
              <td>86% &ndash; 100%</td>
              <td>Mach 1.05 &ndash; 3.20+</td>
              <td>Wet thrust injecting raw fuel into exhaust conduits. Peak dash velocity (+15% tracking vulnerability to hostile IR missiles).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">KINETIC ENERGY CONVERSIONS: DIVE &amp; ZOOM</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">KINETIC DIVE <span class="manual-key-badge">[Key X]</span></b>
          <div style="font-size:0.74rem;color:#cbd5e1;line-height:1.5;">
            Trades <b>7,500 ft</b> of altitude to gain <b>+0.32 Mach</b> in escape velocity. Recommended for defensive disengagement from long-range missile envelopes and escaping high-G merges. Costs 0.40 TOK.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">ZOOM CLIMB <span class="manual-key-badge">[Key Z]</span></b>
          <div style="font-size:0.74rem;color:#cbd5e1;line-height:1.5;">
            Converts kinetic airspeed (<b>-0.28 Mach</b>) into <b>+8,500 ft</b> of altitude perch (FL380&ndash;FL580), where thinner air expands radar line-of-sight and missile kinematic launch range. Requires at least Mach 0.45. Costs 0.40 TOK.
          </div>
        </div>
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
      <div class="ge-desc">
        Notice that internal bay weapons add only pure equipment mass without multiplying parasite drag, keeping the payload ratio lower and preserving maximum speed.
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>WEIGHT STATUS</th><th>PAYLOAD RATIO</th><th>KINEMATIC IMPACT</th><th>AIRFRAME PERFORMANCE IMPACT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">LIGHT</td>
              <td>&le; 35%</td>
              <td>None (100% Top Speed)</td>
              <td>Peak thrust-to-weight ratio. Full dry sprint speed, maximum climb rate, and rapid roll acceleration.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">NORMAL</td>
              <td>36% &ndash; 60%</td>
              <td>~5% Speed Decay</td>
              <td>Standard combat loadout with minor aerodynamic degradation. High combat capability.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">HEAVY</td>
              <td>61% &ndash; 80%</td>
              <td>10% &ndash; 15% Speed Decay</td>
              <td>Heavy strike package. Maximum sprint speed degraded by 10%&ndash;15% and turning radius noticeably widened.</td>
            </tr>
            <tr>
              <td style="color:#ef4444;font-weight:800;">OVERLOAD</td>
              <td>&gt; 80%</td>
              <td>Up to 25% Speed Decay</td>
              <td>Maximum ordnance loadout. Top speed degraded by up to 25% with pronounced acceleration lag.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">PILOT G-LOAD FATIGUE, TUNNEL VISION &amp; G-LOC</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #ffb830;">
          <b style="color:#ffb830;">TUNNEL VISION (STRESS &ge; 0.65)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Visual field constriction. Turn authority degrades by <b>30%</b>, weapon targeting accuracy decreases by <b>15%</b>, and defensive evasion efficiency drops by <b>50%</b>. Dissipates during straight-and-level flight.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ef4444;">
          <b style="color:#ef4444;">G-LOC BLACKOUT (STRESS &ge; 0.95)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Temporary loss of consciousness for <b>2.8 seconds</b>. The aircraft maintains current heading without maneuver authority; missile evasion drops to <b>0%</b>.
          </div>
        </div>
      </div>

      <div class="ge-subhead">COFFIN SYNTHETIC VISION (MANUAL FLIGHT INTERFACE)</div>
      <div class="ge-desc">
        <b>COFFIN (Connection For Flight Interface)</b> airframes replace the traditional transparent canopy with an armored enclosed cockpit and spherical digital camera feeds:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Direct Manual Flight:</b> Piloted directly by the user with instantaneous electro-neural control responsiveness (+20% roll/pitch rate).</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zero Pilot Physiological Limits:</b> Enclosed pressurized crew capsule eliminates G-LOC blackout, allowing sustained <b>16G&ndash;20G</b> structural turns.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>+24% to +30% Neural Evasive Dodge:</b> High-bandwidth neural flight controls and 360-degree sensor fusion provide an innate <b>+24% to +30% missile evasion bonus</b>.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>HUD Readout (TURN: 100% LOCKED):</b> On the central HUD flight tape, COFFIN fighters display a distinctive blue <code>TURN: 100% LOCKED</code> badge. Turn efficiency is locked at 100% across all airspeed regimes.</li>
        </ul>
      </div>
    `
  }
];