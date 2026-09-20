/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 1 to 3
 * Covers: Core Rules, Kinematics & Throttle, Flight Lead Systems & COFFIN
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'CHAPTER 1: QUICK-START DOCTRINE & 5 FOUNDATIONAL RULES',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced tactical fighter squadron in a high-density, contested electromagnetic combat arena. Master these five foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($400.0M BUDGET) &amp; FLIGHT LEAD SELECTION</div>
      <div class="ge-desc">
        Your squadron can deploy up to <b>16 combat airframes</b> within your defense budget. Designate one aircraft as your <b>[★ FLIGHT LEAD]</b> in the Hangar. The Lead always flies in the <b>central formation slot</b> and receives tactical upgrades tailored to airframe role and survivability:
      </div>

      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#00f0ff;">STEALTH LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            • Conformal RAM edge-treatment cuts 90° beam radar spike by <b>50%</b>.<br>
            • <b>+20%</b> missile evasion via low-observable seeker spoofing.<br>
            • <b>+15.0 km</b> active radar reach via high-power GaN AESA transmitters.<br>
            • <b>+1 HP</b> structural armor bulkhead reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">AIR SUPERIORITY LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            • <b>-40%</b> clean airframe radar cross-section via leading-edge coatings.<br>
            • Pressurized cockpit environmental systems delay pilot G-fatigue by <b>50%</b>.<br>
            • <b>+25%</b> defensive break-turn evasion &amp; <b>+12%</b> missile P_k accuracy.<br>
            • <b>+2 HP</b> titanium-alloy framework reinforcement.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#38bdf8;">MULTIROLE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            • <b>+2 Max HP</b> composite armor durability.<br>
            • Optimized fly-by-wire gain provides <b>+20%</b> instantaneous turn authority.<br>
            • <b>-40%</b> base turnaround duration for accelerated replenishment.<br>
            • <b>+25%</b> missile evasion &amp; <b>+3</b> emergency chaff charges.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f97316;">ARMORED STRIKE LEAD SUITE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            • <b>+3 Max HP</b> armor with welded titanium cockpit bathtub.<br>
            • <b>-1 Damage</b> structural reduction per missile impact.<br>
            • <b>60%</b> cannon fire deflection against enemy close-in strafes.<br>
            • <b>-40%</b> ordnance drag penalty elimination.
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. RADAR CROSS SECTION (RCS) &amp; THE 90° BEAM SPIKE</div>
      <div class="ge-desc">
        Radar stealth is highly directional. A Very Low Observable (VLO) airframe with a frontal RCS of <b>0.0001 m²</b> is virtually invisible beyond 15 km nose-on. However, turning 90° broadside exposes fuselage surfaces and vertical stabilizers, multiplying radar return by <b>3.2× (+220% signature increase)</b>. Approach hostile radars nose-on whenever practical.
      </div>

      <div class="ge-subhead">3. 100% MANUAL COMMAND DOCTRINE</div>
      <div class="ge-desc">
        Your flight operates under <b>Manual Command</b>. Automated flight laws will not divert your aircraft, alter headings, fire missiles, expend command tokens, or deploy countermeasures without your direct trigger. Autocannons fire strictly upon command: press <b>[Key G]</b> or tap <b>[BURST]</b>.
      </div>

      <div class="ge-subhead">4. MULTI-MISSILE SALVO SATURATION DOCTRINE</div>
      <div class="ge-desc">
        Firing a single missile allows an enemy fighter to focus its kinetic agility entirely on evasion. Synchronized volleys saturate target defense systems, providing <b>+12% hit probability (P_k) per additional missile in flight (up to +30%)</b> while degrading target defensive turn efficiency by <b>25% per extra missile</b>. Combining active radar (ARH) with imaging infrared (IIR) missiles grants an additional <b>+10% Mixed-Seeker Synergy Bonus</b>.
      </div>

      <div class="ge-subhead">5. CORNER TURN VELOCITY (0.65 × S0)</div>
      <div class="ge-desc">
        Every fighter possesses an optimal turning airspeed at approximately <b>65% of clean maximum sprint speed (S_opt = 0.65 × S0)</b>. Turning faster than corner speed widens your radius and generates excessive centrifugal G-loading; turning slower bleeds kinetic energy toward an aerodynamic stall. Maintain corner speed to maximize instantaneous nose-pointing authority.
      </div>
    `
  },
  {
    id: 'ch2_kinematics',
    title: 'CHAPTER 2: FLIGHT KINEMATICS, ENVELOPES & ENGINE REGIMES',
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
              <td>20% – 35%</td>
              <td>Mach 0.35 – 0.55</td>
              <td>Bleeds excess speed to re-enter corner velocity. Cools exhaust plume to minimize IR lock detection range.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CRUISE</td>
              <td>36% – 70%</td>
              <td>Mach 0.65 – 0.85</td>
              <td>Standard formation transit. Optimal fuel efficiency, stable turn performance, and minimal thermal emissions.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">MIL POWER</td>
              <td>71% – 85%</td>
              <td>Mach 0.85 – 1.05</td>
              <td>Maximum dry thrust. High acceleration and climb performance without blooming the infrared exhaust plume.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">AFTERBURNER</td>
              <td>86% – 100%</td>
              <td>Mach 1.05 – 3.20+</td>
              <td>Wet thrust injecting raw fuel into exhaust conduits. Peak dash velocity (+15% tracking vulnerability to hostile IR missiles).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">KINETIC ENERGY CONVERSIONS: DIVE &amp; ZOOM</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">KINETIC DIVE [Key X]</b>
          <div style="font-size:0.74rem;color:#cbd5e1;line-height:1.5;">
            Trades <b>7,500 ft</b> of altitude to gain <b>+0.32 Mach</b> in escape velocity. Recommended for defensive disengagement from long-range missile envelopes and escaping high-G merges. Costs 0.40 TOK.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">ZOOM CLIMB [Key Z]</b>
          <div style="font-size:0.74rem;color:#cbd5e1;line-height:1.5;">
            Converts kinetic airspeed (<b>-0.28 Mach</b>) into <b>+8,500 ft</b> of altitude perch (FL380–FL580), where thinner air expands radar line-of-sight and missile kinematic launch range. Requires at least Mach 0.45. Costs 0.40 TOK.
          </div>
        </div>
      </div>

      <div class="ge-subhead">ALL-AXIS THRUST VECTORING (TVC)</div>
      <div class="ge-desc">
        Aircraft equipped with 2D or 3D thrust-vectoring engine nozzles deflect exhaust directly, augmenting aerodynamic control surfaces. This provides <b>post-stall pitch authority</b> (such as Pugachev Cobra and Kulbit maneuvers) for rapid nose-pointing at low airspeeds.
      </div>
    `
  },
  {
    id: 'ch3_stress_coffin',
    title: 'CHAPTER 3: PAYLOAD RATIO, PILOT G-LOAD & SYNTHETIC VISION',
    desc: `
      <div class="ge-subhead">PAYLOAD RATIO (LOAD %) &amp; WEIGHT CALCULATIONS</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PAYLOAD RATIO FORMULATION:</span>
        <div class="ge-formula-code">Payload % = (Equipment Mass / Max Payload Mass) × 100%</div>
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>WEIGHT STATUS</th><th>PAYLOAD RATIO</th><th>KINEMATIC IMPACT</th><th>AIRFRAME PERFORMANCE IMPACT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">CLEAN / LIGHT</td>
              <td>&le; 35%</td>
              <td>None (100% Top Speed)</td>
              <td>Peak thrust-to-weight ratio. Full dry sprint speed, maximum climb rate, and rapid roll acceleration.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">NORMAL</td>
              <td>36% – 60%</td>
              <td>~5% Speed Decay</td>
              <td>Standard combat loadout with minor aerodynamic degradation. High combat capability.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">HEAVY</td>
              <td>61% – 80%</td>
              <td>10% – 15% Speed Decay</td>
              <td>Heavy strike package. Maximum sprint speed degraded by 10%–15% and turning radius noticeably widened.</td>
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
      <div class="ge-desc">
        Sustained high-G turns induce physiological circulatory strain on human pilots:
      </div>

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
        <b>COFFIN (Connection For Flight Interface)</b> airframes replace the traditional transparent canopy with an armored enclosed cockpit and external digital camera feeds:
        <ul>
          <li><b>Direct Manual Flight:</b> Piloted directly by the user without automated overrides.</li>
          <li><b>Zero Pilot Physiological Limits:</b> Enclosed pressurized crew capsule eliminates G-LOC blackout, allowing continuous <b>16G–20G</b> structural turns.</li>
          <li><b>+8% High-Rate Evasive Dodge:</b> High-bandwidth digital flight controls provide an innate <b>+8% evasion bonus</b> against incoming guided weapons while maintaining realistic missile vulnerability.</li>
        </ul>
      </div>
    `
  }
];