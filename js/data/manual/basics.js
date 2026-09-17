/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 1 to 3
 * Covers: Core Rules, Kinematics & Throttle, Flight Lead Selection, Formation & Systems
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'CHAPTER 1: QUICK-START DOCTRINE & 5 FOUNDATIONAL RULES',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced tactical fighter squadron in a high-density, contested electromagnetic combat theater. Master these five foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($400.0M BUDGET) &amp; FLIGHT LEAD</div>
      <div class="ge-desc">
        Your squadron can field up to <b>16 combat airframes</b> within your defense budget. Designate one aircraft as your <b>[★ FLIGHT LEAD]</b> in the Hangar. The Lead always flies in the <b>central formation slot</b> and receives tactical upgrades tailored to airframe role and survivability:
        <ul>
          <li><b>Stealth Lead:</b> 50% broadside beam radar spike reduction, +20% missile evasion, +15km radar range, +1 HP armor.</li>
          <li><b>Superiority Lead:</b> -40% clean airframe RCS, -50% pilot G-fatigue buildup, +25% break-turn evasion, +2 HP armor.</li>
          <li><b>Multirole Lead:</b> +2 Max HP armor, +20% instantaneous turn authority, -40% base turnaround time, +25% missile evasion.</li>
          <li><b>Strike Lead:</b> +3 Max HP titanium tub armor, -1 damage reduction per missile hit, -40% payload drag penalty, 60% cannon fire deflection.</li>
          <li><b>EW Lead:</b> +30% missile evasion vs radar-guided munitions, +25% standoff jamming power, +25km passive ESM detection range, +2 HP armor.</li>
          <li><b>Drone Lead:</b> +2 Max HP armor (significantly reinforcing light UCAVs), +35% high-G break evasion, +2 MALD decoy drones.</li>
          <li><b>Experimental Lead:</b> -40% thermal exhaust signature (mitigates IR missile tracking), +2 HP armor, +30% break-turn evasion.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. RADAR CROSS SECTION (RCS) &amp; THE 90° BEAM SPIKE</div>
      <div class="ge-desc">
        Radar stealth is directional. A Very Low Observable (VLO) airframe with a frontal RCS of <b>0.0001 m²</b> is virtually undetectable beyond 15 km nose-on. However, turning 90° broadside to hostile radar exposes fuselage and vertical stabilizers, multiplying the radar signature by <b>3.2× (+220% signature increase)</b>. Approach hostile threats nose-on whenever practical.
      </div>

      <div class="ge-subhead">3. 100% MANUAL COMMAND DOCTRINE</div>
      <div class="ge-desc">
        Your flight operates under <b>Manual Command</b>. Automatic flight laws will not divert your aircraft, alter headings, fire missiles, expend command tokens, or deploy countermeasures without your direct trigger. Autocannons fire strictly upon command: press <b>[Key G]</b> or tap <b>[BURST]</b>.
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
      <div class="ge-desc">
        Your engine throttle quadrant operates across four distinct regimes:
        <ul>
          <li><b>IDLE (20%):</b> Minimum sustained power. Bleeds excess airspeed to re-enter corner turn velocity and cools engine exhaust to lower thermal IR signature.</li>
          <li><b>CRUISE (50%–60%):</b> Standard transit power. Efficient fuel consumption, stable turn performance, and minimal thermal emissions.</li>
          <li><b>MILITARY POWER (85%):</b> Maximum dry thrust. High acceleration and climb performance without blooming the infrared exhaust plume.</li>
          <li><b>AFTERBURNER (86%–100%):</b> Wet thrust injecting raw fuel into the exhaust conduit. Delivers peak acceleration and sprint velocity at the cost of high thermal signature (+15% tracking bonus for hostile heat-seeking missiles).</li>
        </ul>
      </div>

      <div class="ge-subhead">MANUAL CANNON &amp; WEAPON DISCHARGE</div>
      <div class="ge-desc">
        <ul>
          <li><b>MANUAL BURST [Key G]:</b> Fires a 30-round high-velocity burst along your boresight heading. When locked onto a target within cannon range (&lt;4.8 km), rounds deliver direct penetrative damage.</li>
          <li><b>PYLONS [Keys 1–9]:</b> Discharges the weapon system mounted on the corresponding hardpoint station against your designated target.</li>
        </ul>
      </div>

      <div class="ge-subhead">KINETIC ENERGY CONVERSIONS: DIVE &amp; ZOOM</div>
      <div class="ge-desc">
        <ul>
          <li><b>KINETIC DIVE [Key X]:</b> Trades 7,500 ft of altitude to recover <b>+0.32 Mach</b> in escape velocity. Recommended for defensive disengagement from missile envelopes.</li>
          <li><b>ZOOM CLIMB [Key Z]:</b> Converts kinetic airspeed (-0.28 Mach) into <b>+8,500 ft</b> of altitude perch (FL380–FL500), where thinner air expands radar line-of-sight and missile kinematic range. Requires at least Mach 0.45.</li>
        </ul>
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
      <div class="ge-desc">
        Every airframe has an empty weight and a certified <b>Maximum Payload Carriage (M_max)</b>:
        <br><br>
        <center><code>Payload % = (Equipment Mass / Max Payload Mass) × 100%</code></center>
        <br>
        <ul>
          <li><b>&le; 35% [CLEAN / LIGHT]:</b> Peak thrust-to-weight ratio. Full top sprint speed (100% S0), rapid acceleration, and maximum climb rate.</li>
          <li><b>36% – 60% [NORMAL]:</b> Standard combat loadout with minor aerodynamic degradation (~5% top speed reduction).</li>
          <li><b>61% – 80% [HEAVY]:</b> Heavy strike package. Maximum sprint speed degraded by 10%–15% and turning radius widened.</li>
          <li><b>&gt; 80% [OVERLOAD]:</b> Maximum ordnance loadout. Top speed degraded by up to 25% with noticeable acceleration lag.</li>
        </ul>
      </div>

      <div class="ge-subhead">PILOT G-LOAD FATIGUE, TUNNEL VISION &amp; G-LOC</div>
      <div class="ge-desc">
        Sustained high-G turns induce physiological circulatory strain on human pilots:
        <ul>
          <li><b>STRESS &ge; 0.65 [TUNNEL VISION]:</b> Visual field constriction. Turn authority degrades by <b>30%</b>, weapon accuracy decreases by <b>15%</b>, and defensive evasion efficiency drops by <b>50%</b>.</li>
          <li><b>STRESS &ge; 0.95 [G-LOC BLACKOUT]:</b> Temporary loss of consciousness for 2.8 seconds. The aircraft maintains current heading without maneuver authority; evasion drops to <b>0%</b>.</li>
          <li>Stress dissipates during straight-and-level flight. Titanium-Kevlar cockpit tubs raise G-LOC tolerance to 1.05. Flight Leads receive an inherent G-fatigue mitigation bonus.</li>
        </ul>
      </div>

      <div class="ge-subhead">COFFIN SYNTHETIC VISION (MANUAL FLIGHT INTERFACE)</div>
      <div class="ge-desc">
        <b>COFFIN (Connection For Flight Interface)</b> airframes replace the traditional transparent canopy with an armored enclosed cockpit and external digital camera feeds:
        <ul>
          <li><b>Direct Manual Flight:</b> Piloted directly by the user without automated overrides.</li>
          <li><b>Zero Pilot Physiological Limits:</b> Enclosed pressurized crew capsule eliminates G-LOC blackout, allowing continuous <b>16G–20G</b> structural turns.</li>
          <li><b>+25% High-Rate Evasive Dodge:</b> High-bandwidth digital flight controls provide an innate <b>+25% evasion bonus</b> against all incoming guided weapons.</li>
        </ul>
      </div>
    `
  }
];