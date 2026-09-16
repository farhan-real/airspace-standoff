/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 1 to 3
 * Covers: Core Rules, Kinematics & Throttle, Flight Lead Selection, Formation & Buffs
 */

window.MANUAL_BASICS = [
  {
    id: 'ch1_quickstart',
    title: 'CHAPTER 1: QUICK-START DOCTRINE & 5 FOUNDATIONAL RULES',
    desc: `
      <div class="ge-desc">
        Welcome to <b>AIRSPACE STANDOFF</b>. You command an advanced tactical fighter squadron in a high-density, contested C4ISR electromagnetic combat theater. Before scrambling your first sortie, master these five foundational operational rules:
      </div>

      <div class="ge-subhead">1. DEFENSE ALLOCATION ($400.0M BUDGET) &amp; FLIGHT LEAD</div>
      <div class="ge-desc">
        Your squadron can field up to <b>16 combat airframes</b> within a strict credit cap. Designate one flagship or fighter as your <b>[★ FLIGHT LEAD]</b> in the Hangar. The Lead always spawns at the <b>exact tactical center of the formation</b> and receives specialized buffs that fix airframe weaknesses and drastically boost missile evasion and combat survivability:
        <ul>
          <li><b>Stealth Lead:</b> 50% broadside beam spike reduction (fixes 3.2x RCS vulnerability), +20% missile evasion, +15km radar, +1 HP.</li>
          <li><b>Superiority Lead:</b> -40% base RCS (fixes giant radar footprint), -50% stress accumulation, +25% break evasion, +2 HP.</li>
          <li><b>Multirole Lead:</b> +2 Max HP (fixes durability weakness), +20% turn agility, -40% RTB duration, +25% missile evasion.</li>
          <li><b>Strike Lead:</b> +3 Max HP (flying fortress), -1 damage from missile hits, -40% payload drag penalty, 60% gun deflection.</li>
          <li><b>EW Lead:</b> +30% missile evasion vs radar weapons, +25% jamming efficiency, +25km ESM detection, +2 HP.</li>
          <li><b>Drone Lead:</b> +2 Max HP (triples fragile 1-2 HP drone durability), +35% 20G missile dodge, +2 free MALD decoys.</li>
          <li><b>Experimental Lead:</b> -40% engine thermal bloom (suppresses IR missile locks), +2 HP, +30% neural missile dodge.</li>
        </ul>
      </div>

      <div class="ge-subhead">2. RADAR CROSS SECTION (RCS) &amp; THE 90° BEAM SPIKE</div>
      <div class="ge-desc">
        Radar stealth is highly directional. A Very Low Observable (VLO) airframe with a frontal RCS of <b>0.0001 m²</b> is virtually invisible beyond 15 km nose-on. However, turning 90° broadside to enemy radar exposes your entire fuselage and vertical stabilizers, multiplying your radar signature by <b>3.2× (+220% signature increase)</b>. Always approach hostile threats nose-on!
      </div>

      <div class="ge-subhead">3. 100% MANUAL COMMAND DOCTRINE</div>
      <div class="ge-desc">
        Your entire flight operates under <b>100% Manual Control</b>. AI autonomy will never hijack your wingmen, change their headings, auto-fire missiles, waste your Command Bus tokens, or deploy countermeasures without your direct command. Autocannons on your aircraft fire strictly on manual player trigger: press <b>[Key G]</b> or tap <b>[BURST]</b>!
      </div>

      <div class="ge-subhead">4. MULTI-MISSILE SALVO SATURATION DOCTRINE</div>
      <div class="ge-desc">
        Firing a single missile allows an enemy fighter to focus 100% of its kinetic agility on evasion. Launching synchronized volleys overwhelms target defensive systems, granting <b>+12% hit probability (P_k) per additional in-flight missile (up to +30%)</b> while degrading target defensive agility by <b>25% per extra missile</b>! Combining active radar (ARH) and imaging infrared (IIR) missiles grants an extra <b>+10% Mixed-Seeker Synergy Bonus</b>.
      </div>

      <div class="ge-subhead">5. CORNER TURN VELOCITY (0.65 × S0)</div>
      <div class="ge-desc">
        Every fighter possesses an optimal turning velocity at approximately <b>65% of its clean sprint speed (S_opt = 0.65 × S0)</b>. Dogfighting faster than corner speed widens your turning radius and spikes pilot centrifugal G-forces; flying slower bleeds kinetic energy into an aerodynamic stall. Maintain corner speed to maximize instantaneous nose-pointing authority.
      </div>
    `
  },
  {
    id: 'ch2_kinematics',
    title: 'CHAPTER 2: FLIGHT KINEMATICS, ENVELOPES & ENGINE REGIMES',
    desc: `
      <div class="ge-desc">
        Combat flight in AIRSPACE STANDOFF is governed by real-time aerodynamic physics: airspeed, altitude, air density, structural G-loading, and throttle propulsion states.
      </div>

      <div class="ge-subhead">ENGINE POWER MODES: IDLE, CRUISE, MILITARY POWER &amp; AFTERBURNER</div>
      <div class="ge-desc">
        Your engine throttle quadrant operates across four operational regimes:
        <ul>
          <li><b>IDLE (20%):</b> Minimum sustained power. Rapidly bleeds kinetic airspeed to re-enter corner turn velocity and cools exhaust to reduce thermal IR signature.</li>
          <li><b>CRUISE (50%–60%):</b> Standard transit power. Excellent sustained maneuverability and minimal thermal profile.</li>
          <li><b>MILITARY POWER (85%):</b> Maximum dry thrust. High acceleration and climb performance without blooming your infrared signature.</li>
          <li><b>AFTERBURNER (86%–100%):</b> Wet thrust injecting raw fuel into the exhaust plume. Maximizes speed and acceleration, but heat-seeking missiles track you significantly better (+15% tracking bonus for hostile heat-seekers).</li>
        </ul>
      </div>

      <div class="ge-subhead">MANUAL CANNON &amp; WEAPON DISCHARGE</div>
      <div class="ge-desc">
        Unlike hostile forces which auto-burst, your aircraft reserve all munitions for your tactical command:
        <ul>
          <li><b>MANUAL STRAFE [Key G]:</b> Fires an immediate 30-round high-velocity burst along your boresight vector. When a target is locked and within gun range (&lt;4.8 km), firing scores direct penetrative damage!</li>
          <li><b>PYLONS [Keys 1–9]:</b> Discharges the ordnance mounted at the corresponding pylon index against your locked target.</li>
        </ul>
      </div>

      <div class="ge-subhead">KINETIC ENERGY CONVERSIONS: DIVE &amp; ZOOM</div>
      <div class="ge-desc">
        <ul>
          <li><b>KINETIC DIVE [Key X]:</b> Drops 7,500 ft of altitude to immediately recover <b>+0.32 Mach</b> of escape velocity. Use when defensive or escaping missile envelopes.</li>
          <li><b>ZOOM CLIMB [Key Z]:</b> Converts kinetic airspeed (-0.28 Mach) into <b>+8,500 ft</b> of altitude perch (FL380–FL500), where thinner air expands radar line-of-sight and missile kinematic range. Requires at least Mach 0.45.</li>
        </ul>
      </div>

      <div class="ge-subhead">ALL-AXIS 3D THRUST VECTORING (TVC)</div>
      <div class="ge-desc">
        Aircraft equipped with 2D or 3D thrust-vectoring engine nozzles (Su-35S, Su-57, F-22A, Su-47, F-15 S/MTD) deflect jet exhaust directly, bypassing rudder airflow dependencies. This enables <b>post-stall super-maneuverability</b> (Pugachev Cobra and Kulbit loop) for radical nose-pointing at low speeds.
      </div>
    `
  },
  {
    id: 'ch3_stress_coffin',
    title: 'CHAPTER 3: PAYLOAD RATIO, PILOT STRESS & MANUAL COFFIN FLIGHT',
    desc: `
      <div class="ge-subhead">PAYLOAD RATIO (LOAD %) &amp; MASS EQUATIONS</div>
      <div class="ge-desc">
        Every airframe has an empty weight and a certified <b>Maximum Payload Carriage (M_max)</b>:
        <br><br>
        <center><code>Payload % = (Equipment Mass / Max Payload Mass) × 100%</code></center>
        <br>
        <ul>
          <li><b>&le; 35% [CLEAN / LIGHT]:</b> Peak thrust-to-weight ratio. Maximum acceleration, fastest climb rates, and full top sprint speed (100% S0).</li>
          <li><b>36% – 60% [NORMAL]:</b> Standard multirole combat configuration with negligible aerodynamic penalty (~5% speed drop).</li>
          <li><b>61% – 80% [HEAVY]:</b> Heavy strike configuration. Top speed degraded by 10%–15%, widened turn radius.</li>
          <li><b>&gt; 80% [OVERLOAD]:</b> Maximum ordnance load. Dash velocity degraded by up to 25%, noticeable acceleration lag.</li>
        </ul>
      </div>

      <div class="ge-subhead">PILOT STRESS, TUNNEL VISION &amp; G-LOC BLACKOUT</div>
      <div class="ge-desc">
        Sustained high-G turns force blood away from the pilot's brain toward the lower extremities:
        <ul>
          <li><b>STRESS &ge; 0.65 [TUNNEL VISION]:</b> Pilot suffers peripheral vision loss. Turn rate authority drops by <b>30%</b>, weapon accuracy drops by <b>15%</b>, and missile evasion defense is degraded by <b>50%</b>!</li>
          <li><b>STRESS &ge; 0.95 [G-LOC BLACKOUT]:</b> Physiological blackout for 2.8 seconds. Aircraft maintains current heading and cannot maneuver; defensive evasion drops to <b>0%</b>!</li>
          <li>Stress recovers naturally during straight-and-level flight. Titanium-Kevlar cockpit tubs raise G-LOC tolerance to 1.05. Flight Leads receive an innate stress mitigation factor.</li>
        </ul>
      </div>

      <div class="ge-subhead">COFFIN NEURAL LINK (100% MANUAL PLAYER FLIGHT)</div>
      <div class="ge-desc">
        <b>COFFIN (Connection For Flight Interface)</b> superfighters (F-22C [COFFIN], ADF-11F Raven, Su-37 [COFFIN], F-15 S/MT [COFFIN]) replace the glass canopy with an armored electro-optical shell:
        <ul>
          <li><b>100% Manual Flight:</b> COFFIN craft are directly piloted by you—no AI override or autonomous interference.</li>
          <li><b>Zero Stress &amp; Zero G-LOC:</b> Structural limits are governed solely by composite frames, permitting continuous <b>16G–20G</b> turns with zero pilot fatigue or blackout!</li>
          <li><b>+25% Extreme Dodge Bonus:</b> Instantaneous electro-neural flight control delivers an innate <b>+25% evasion bonus</b> against all incoming missiles.</li>
        </ul>
      </div>
    `
  }
];