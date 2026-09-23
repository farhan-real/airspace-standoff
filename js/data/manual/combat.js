/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 6 to 7
 * Covers: Guided Munitions, Propulsion Stages, ProNav Guidance, Electronic Warfare & Doppler Notching
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
              <td>AIM-120D/PL-15E/Meteor/AIM-260: <b>Internal &amp; External</b>.<br>R-37M/PL-21: <b>External Only</b>.</td>
              <td><b>Doppler Notch (Beam 90&deg;) + Chaff / ECM Pod / Decoys.</b> Cuts radial closure velocity to zero and drops tracking lock.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">IIR / EO</td>
              <td>Imaging Infrared / Optical (AIM-9X, R-73, Python-5, IRIS-T)</td>
              <td>AIM-9X/R-73/IRIS-T: <b>Internal &amp; External</b>.<br>Python-5: <b>External Only</b>.</td>
              <td><b>Throttle to Idle / Dive into Weather Clouds / Break Line of Sight.</b> Clouds scatter infrared tracking; idle cuts thermal signature.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">INS</td>
              <td>Inertial Navigation System with Terminal Radar (Kh-47M2 Kinzhal)</td>
              <td><b>Centerline Station Only</b>. Hypersonic plunge from stratosphere.</td>
              <td><b>Perpendicular Break Turn / CIWS Point Defense.</b> Hypersonic momentum creates a wide turning radius; break hard 90&deg; perpendicular.</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;font-weight:800;">GPS / INS</td>
              <td>Satellite Uplink &amp; Inertial Dead-Reckoning (GBU-39 SDB)</td>
              <td><b>Internal &amp; External</b>. Standoff glide weapon.</td>
              <td><b>CIWS Point Defense / Platform Neutralization.</b> Intercept glide weapons with CIWS batteries or neutralize launch aircraft.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RADAR</td>
              <td>Anti-Radiation Homing (AGM-88G AARGM-ER)</td>
              <td><b>Internal &amp; External</b>. Homes on radar emissions; 3&times; SAM damage.</td>
              <td>Power down emitting radar arrays, deactivate airborne jammer pods, or intercept with CIWS.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">DIRECT ENERGY</td>
              <td>Hitscan Chemical Laser / Railgun (DE-Pulse, TLS, EML)</td>
              <td>Built-in or <b>External Pylon Pods</b>. Speed-of-light beam.</td>
              <td>Dive into moisture clouds (scatters thermal laser beam) or maintain standoff beyond 9.0 km.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. STATION COMPATIBILITY RULES &amp; LIVE BATTLE RECOVERY</div>
      <div class="ge-desc">
        Weapon stations adhere to physical enclosure and mounting constraints:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Internal Missiles:</b> Sized for stealth bays with folding fins. Can be mounted in internal bays (zero drag, zero extra RCS) OR on external pylons.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>External Missiles:</b> Heavy or long airframes (R-37M, PL-21, AGM-158B, gunpods, ECM pods). Can ONLY be mounted on external pylons.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Centerline Missiles:</b> Strategic aero-ballistic weapons (Kh-47M2 Kinzhal). Can ONLY be mounted on the centerline fuselage station.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Live Battle Drag &amp; Stealth Shedding:</b> When external or centerline missiles are launched in battle, their weight, drag penalty, and radar reflection bloom are removed in real time. Both player and AI fighters immediately recover top speed and return to clean stealth observability.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. MULTI-STAGE PROPULSION &amp; RADAR FLIGHT STATES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>STAGE TAG</th><th>PROPULSION PHASE</th><th>KINEMATIC CHARACTERISTICS</th><th>TACTICAL APPLICATION</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">[BOOST]</td>
              <td>Initial Rocket Burn</td>
              <td>Separation impulse kicks missile off rail; booster accelerates to peak Mach speed.</td>
              <td>Leaves host aircraft behind immediately in a trail of smoke; high energy.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">[SUSTAIN]</td>
              <td>Midcourse Sustainer</td>
              <td>Sustainer grain (AIM-260) burns for 14s, maintaining Mach 3.6 across long distances.</td>
              <td>Extends effective BVR reach without the kinetic decay of pure booster rockets.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">[RAMJET]</td>
              <td>Continuous Ramjet</td>
              <td>Ramjet (Meteor, PL-21) maintains continuous thrust at Mach 3.2&ndash;3.6 with <b>zero speed decay</b>.</td>
              <td>Hits distant targets at full sprint speed, denying the kinetic escape window.</td>
            </tr>
            <tr>
              <td style="color:#8494ab;font-weight:800;">[COAST]</td>
              <td>Unpowered Glide</td>
              <td>Rocket motor has burned out. Aerodynamic drag causes velocity to gradually bleed.</td>
              <td>Arriving in coast phase leaves reduced kinetic energy, making evasion easier.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">[PULSE 2]</td>
              <td>Terminal Reignition</td>
              <td>At 22 km from target, PL-15E second pulse rocket ignites, surging velocity by <b>+1.1 Mach</b>.</td>
              <td>Defeats midcourse defensive notches with a dramatic burst of speed and turn authority.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">[LOFT] / [DIVE]</td>
              <td>Aero-Ballistic Trajectory (INS / ARH)</td>
              <td>Lofts into stratosphere (FL550&ndash;FL600), then plunges in terminal hypersonic dive (Mach 4.2&ndash;5.0).</td>
              <td>Devastating kinetic energy against heavy aircraft and bunkers; wide turn radius allows perpendicular evasion.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">[TERMINAL]</td>
              <td>Active Terminal Homing</td>
              <td>Seeker transitions to high-frequency target tracking in the endgame engagement basket.</td>
              <td>Final closure phase prior to proximity fuse detonation.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. PROPORTIONAL NAVIGATION (PRONAV) GUIDANCE LAW</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PRONAV COMMAND TURN RATE FORMULATION:</span>
        <div class="ge-formula-code">&omega;_m = N &times; (V_c / V_m) &times; &lambda;_dot</div>
      </div>
      <div class="ge-desc">
        <ul style="list-style:none;padding-left:0;margin-top:4px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Constant Bearing, Decreasing Range (CBDR):</b> The seeker tracks the rotation rate of Line of Sight (&lambda;_dot) and closure velocity (V_c), flying a predictive lead pursuit collision course.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Defeating ProNav via High-G Breaks:</b> A late, sudden break turn forces a rapid spike in &lambda;_dot. At high speeds, matching this rotation rate demands more lateral acceleration than fins can aerodynamically deliver, causing a <b>Kinetic Overshoot</b>.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Corner Speed &amp; Agility Scaling:</b> Maneuvering while within &plusmn;12% of your aircraft's optimal corner velocity delivers maximum angular displacement, dramatically increasing the probability of forcing a kinetic miss.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Disrupting Guidance Gain (N):</b> Active defensive maneuvers degrade effective navigation gain from N = 4.0 down to 0.6&ndash;1.2, breaking intercept calculations.</li>
        </ul>
      </div>

      <div class="ge-subhead">5. MULTI-MISSILE SALVO &amp; MIXED-SEEKER SYNERGY (+25% P_K)</div>
      <div class="ge-desc">
        Synchronized volleys saturate defenses, providing <b>+12% P_k per additional missile in flight (up to +30%)</b> while degrading target turn efficiency by <b>25% per extra missile</b>.<br><br>
        Combining active radar (ARH) with imaging infrared (IIR) or optical missiles creates an insurmountable defensive dilemma: beaming 90&deg; to notch radar exposes hot exhaust plumes to the trailing heat seeker, awarding a <b>+25% Mixed-Seeker Synergy Bonus</b> and reducing countermeasure effectiveness by <b>45%</b>!
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'SECTION 07: ELECTRONIC WARFARE, DOPPLER NOTCHING & DEFENSIVE MANEUVERS',
    desc: `
      <div class="ge-subhead">1. HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90&deg;)</div>
      <div class="ge-desc">
        Pulse-Doppler radars detect targets by filtering for frequency shifts caused by radial closure velocity:
        <br><br>
        <b>To notch:</b> Turn your aircraft exactly <b>90&deg; perpendicular</b> to the threat's radar vector (beam aspect). Your relative radial closure speed drops to zero relative to ground clutter. The hostile radar filters your return as background clutter and drops lock. Dispensing chaff creates an artificial zero-Doppler false echo, breaking missile homing.
      </div>

      <div class="ge-subhead">2. CORNER SPEED &amp; DEFENSIVE EVASION SCALING</div>
      <div class="ge-desc">
        Maneuver cards and break turns are governed by dynamic aerodynamic efficiency:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Agility Multiplier:</b> Evasion probability gained from tactical cards scales directly with your airframe's effective agility rating. A 1.20 agility fighter generates up to 40% higher evasive displacement than an aircraft with 0.65 agility.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Corner Speed Peak:</b> Executing maneuvers while flying at your aircraft's optimal corner speed (<code>sOpt</code>) boosts defense effectiveness to its maximum. Flying in deep overspeed or near stall degrades evasive value.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Weight Impact:</b> Heavy payload carriages reduce turn rate and degrade evasive agility until ordnance is expended.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. ACTIVE ELECTRONIC WARFARE (EW) PODS &amp; DECOYS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>EW SYSTEM</th><th>MOUNT TYPE</th><th>SUPPRESSION EFFECT</th><th>OPERATIONAL CAPABILITY</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AN/ALQ-184</td>
              <td>1-Slot External Pod</td>
              <td>30% Lock Degradation</td>
              <td>Compact self-protection jammer. Emits directional RF pulse noise against active radar locks.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AN/ALQ-99</td>
              <td>2-Slot External Pod</td>
              <td>45% Area Suppression</td>
              <td>Broadband tactical jammer pod suppressing enemy early warning radars across 95 km.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">AN/ALQ-249 NGJ</td>
              <td>3-Slot External Pod</td>
              <td>60% Standoff Jamming</td>
              <td>Next-gen GaN AESA standoff jamming pod delivering concentrated beam jamming out to 125 km.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">ADM-160B MALD</td>
              <td>External Decoy (2x)</td>
              <td>Signature Spoofing</td>
              <td>Air-launched autonomous decoy drone replicating host radar signature and speed profile out to 110 km.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">AN/ALE-55 FOTD</td>
              <td>External Decoy (4x)</td>
              <td>Missile Seduction</td>
              <td>Fiber-optic towed decoy trailing high-power RF repeaters behind the aircraft to seduce radar missiles.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. TACTICAL MANEUVER CARDS REFERENCE</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>MANEUVER</th><th>COST</th><th>TIME</th><th>BASE EVASION</th><th>TRIGGER CONDITION &amp; TACTICAL EFFECT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Doppler Notch &amp; Chaff</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+48%</td>
              <td>Trigger on active radar (ARH) lock. Beams threat 90&deg;, cuts closure rate, and pops chaff. Evasion scales with agility and corner velocity.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.0s</td>
              <td>+45%</td>
              <td>Trigger on inbound missile within 25 km. High-G 3D spiral disrupts proportional lead pursuit. Evasion scales with agility and corner velocity.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev Push Cobra</td>
              <td>0.8 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">6.0s</td>
              <td>+55%</td>
              <td>Requires TVC. Pitch up to 110&deg; creates an immediate closure rate mismatch against tailgaters. Evasion scales with agility and corner velocity.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Kinetic Escape</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.5s</td>
              <td>+45%</td>
              <td>Requires altitude &gt; FL150. Inverts aircraft and dives to recover Mach speed out of envelope. Evasion scales with agility and corner velocity.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">Emergency Chaff Salvo</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+42%</td>
              <td>Dispenses dense chaff cloud to disrupt radar tracking locks. Costs 1 countermeasure charge. Evasion scales with agility and corner velocity.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Zoom Climb to Perch</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+38%</td>
              <td>Requires Mach 0.70+. Converts airspeed into +8,500 ft high-altitude perch. Evasion scales with agility and corner velocity.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];