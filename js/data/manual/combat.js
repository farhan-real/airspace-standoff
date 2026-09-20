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
            <tr><th>SEEKER</th><th>HOMING METHOD</th><th>TACTICAL PROFILE</th><th>DEFENSIVE COUNTERMEASURE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ARH</td>
              <td>Active Radar Homing (AIM-120D, Meteor, R-37M, PL-15E, AIM-260)</td>
              <td>Internal nose radar transmitter. Autonomous fire-and-forget; long BVR reach (72&ndash;130 km).</td>
              <td><b>Doppler Notch (Beam 90&deg;) + Chaff / ECM Pod / Decoys.</b> Cuts radial closure velocity to zero and drops tracking lock.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">IIR / EO</td>
              <td>Imaging Infrared / Optical (AIM-9X, R-73, Python-5, IRIS-T)</td>
              <td>Tracks thermal exhaust plume and 3D silhouette. Immune to RF radar jamming and Doppler notching.</td>
              <td><b>Throttle to Idle / Dive into Weather Clouds / Break Line of Sight.</b> Clouds scatter infrared tracking; idle cuts thermal signature.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RADAR</td>
              <td>Anti-Radiation Homing (AGM-88G AARGM-ER)</td>
              <td>Homes directly on hostile radar emissions. Inflicts <b>3&times; damage</b> to SAM radar arrays and EW jammers.</td>
              <td>Power down emitting radar arrays, deactivate airborne jammer pods, or intercept with CIWS.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">DIRECT ENERGY</td>
              <td>Hitscan Chemical Laser / Railgun (DE-Pulse, TLS, EML)</td>
              <td>Instantaneous speed-of-light kinetic or thermal impact. Zero lead time required.</td>
              <td>Dive into moisture clouds (scatters thermal laser beam) or maintain standoff beyond 9.0 km.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. MULTI-STAGE PROPULSION &amp; RADAR FLIGHT STATES</div>
      <div class="ge-desc">
        Missiles feature authentic multi-stage propulsion physics. Speed scales proportionally relative to combat aircraft (from subsonic cruise at Mach 0.90 up to hypersonic plunges at Mach 5.0). The active stage is displayed in real time on the radar scope:
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>STAGE TAG</th><th>PROPULSION PHASE</th><th>KINEMATIC CHARACTERISTICS</th><th>TACTICAL APPLICATION</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">[BOOST]</td>
              <td>Initial Rocket Burn</td>
              <td>Separation impulse kicks missile forward off the rail; solid rocket booster burns intensely, accelerating to peak speed.</td>
              <td>Leaves host aircraft behind immediately in a trail of smoke; high energy and acceleration.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">[SUSTAIN]</td>
              <td>Midcourse Sustainer</td>
              <td>Sustainer grain (e.g. AIM-260 JATM) continues burning for 14s, maintaining high Mach 3.6 cruise across long distances.</td>
              <td>Extends effective BVR reach without the kinetic decay of pure booster rockets.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">[RAMJET]</td>
              <td>Continuous Ramjet</td>
              <td>Solid-fuel variable-flow ramjet (Meteor, PL-21) maintains continuous thrust at Mach 3.2&ndash;3.6 with <b>zero speed decay</b> out to maximum range.</td>
              <td>Hits distant targets at full sprint speed, denying the kinetic escape window.</td>
            </tr>
            <tr>
              <td style="color:#8494ab;font-weight:800;">[COAST]</td>
              <td>Unpowered Glide</td>
              <td>Rocket motor has burned out. Aerodynamic drag causes velocity to gradually bleed over extended ranges.</td>
              <td>Missiles arriving in coast phase have reduced kinetic energy, making evasion easier for evasive targets.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">[PULSE 2]</td>
              <td>Terminal Reignition</td>
              <td>At 22 km from target, PL-15E second pulse rocket grain ignites, surging velocity by <b>+1.1 Mach</b> into the terminal basket.</td>
              <td>Defeats midcourse defensive notches with a dramatic burst of speed and renewed turn authority.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">[LOFT] / [DIVE]</td>
              <td>Aero-Ballistic Trajectory</td>
              <td>R-37M and Kinzhal loft into the stratosphere (FL550&ndash;FL600) in thin air, then plunge in a terminal hypersonic dive (Mach 4.2&ndash;5.0).</td>
              <td>Devastating kinetic energy against heavy aircraft and bunkers; wide turn radius allows perpendicular evasion breaks.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">[TERMINAL]</td>
              <td>Active Terminal Homing</td>
              <td>Missile enters the endgame engagement basket; seeker transitions to high-frequency target tracking.</td>
              <td>Final closure phase prior to proximity fuse detonation.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. GUIDANCE LAW: PROPORTIONAL NAVIGATION &amp; G-LIMITS</div>
      <div class="ge-desc">
        Guided weapons employ <b>Proportional Navigation (ProNav)</b> rather than simple lead extrapolation:
        <ul>
          <li><b>Collision Course Pursuit:</b> ProNav commands turn rates proportional to the Line of Sight (LOS) angular rate, steering the missile along smooth, natural pursuit arcs that do not oscillate or jitter.</li>
          <li><b>Physical G-Limits:</b> Missiles have realistic structural turn rate limits:
            <ul>
              <li><b>Dogfight Missiles (WVR):</b> Pull up to 45&ndash;50G (turn rate 2.6&ndash;3.4 rad/s) via jet vanes and gas-vane thrust vectoring.</li>
              <li><b>Medium BVR Rockets:</b> Pull 25&ndash;35G (turn rate 1.3&ndash;1.8 rad/s).</li>
              <li><b>Heavy Hypersonic Missiles (R-37M, Kinzhal):</b> High forward momentum limits lateral turn rate to 0.75 rad/s. A sharp 90&deg; break turn forces heavy missiles to overshoot cleanly.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="ge-subhead">4. PROXIMITY FUSING VS. KINETIC OVERSHOOTS</div>
      <div class="ge-desc">
        Warheads detonate when the missile closes within <b>450 meters</b> or reaches its Closest Point of Approach (CPA &le; 850m). If an aircraft breaks hard outside the missile's turn radius, the missile does not prematurely detonate&mdash;it executes a realistic <b>Kinetic Overshoot</b>, streaking past the target on kinetic momentum before fuel exhaustion.
      </div>

      <div class="ge-subhead">5. PASSIVE RADAR HOMING &amp; CONCEALMENT (AGM-88G)</div>
      <div class="ge-desc">
        Anti-Radiation Missiles (e.g. AGM-88G AARGM-ER) passively track enemy RF radar emissions without transmitting active radar:
        <ul>
          <li><b>Launch Concealment:</b> The missile icon remains hidden from enemy radar for the first 3.2 seconds of motor burn.</li>
          <li><b>Trajectory Path Gating:</b> The missile's path to target is suppressed on enemy radar until within <b>20 km</b> of the target.</li>
          <li><b>Full Commander Telemetry:</b> You always see the complete flight path and telemetry of your own missiles!</li>
          <li><b>No Active Lock Warning:</b> Targets receive no active ARH lock tones prior to terminal proximity.</li>
        </ul>
      </div>

      <div class="ge-subhead">6. RADAR TELEMETRY READOUT &amp; THERMOBARIC BLAST (MPBM)</div>
      <div class="ge-desc">
        Missiles display comprehensive two-line telemetry on the radar scope:
        <ul>
          <li><b>Line 1:</b> Missile designation and salvo count in team/identification color (e.g. <code>AIM-120D x2</code>).</li>
          <li><b>Line 2:</b> Real-time Mach velocity, active propulsion stage, and target range in telemetry accent colors (e.g. <code>M 3.2 [PULSE 2] [18km]</code>).</li>
          <li><b>Thermobaric Area of Effect (MPBM):</b> The Multi-Purpose Burst Missile detonates in an expansive thermobaric shockwave, inflicting 7 HP direct damage on the target and secondary blast damage (1&ndash;5 HP) across an <b>8.5 km radius</b>.</li>
        </ul>
      </div>

      <div class="ge-subhead">7. PROBABILITY OF KILL (P_k) &amp; SALVO SATURATION FORMULA</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">TACTICAL HIT PROBABILITY EQUATION:</span>
        <div class="ge-formula-code">P_k = Base P_k &times; Range Score &times; Aspect Score - Target Agility - CMs + Salvo Bonus + Seeker Synergy</div>
      </div>

      <div class="ge-callout">
        <b>Salvo Saturation:</b> When multiple missiles are in flight against the same target, target defensive agility is degraded by <b>25% per additional missile</b>, while firing systems gain <b>+12% P_k per extra missile (up to +30%)</b>. Combining an ARH radar missile with an IIR optical missile grants an extra <b>+10% Mixed-Seeker Synergy Bonus</b>.
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'SECTION 07: ELECTRONIC WARFARE, DOPPLER NOTCHING & DEFENSIVE MANEUVERS',
    desc: `
      <div class="ge-subhead">HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90&deg;)</div>
      <div class="ge-desc">
        Pulse-Doppler radars detect targets by filtering for frequency shifts caused by radial closure velocity:
        <br><br>
        <b>To notch:</b> Turn your aircraft exactly <b>90&deg; perpendicular</b> to the threat's radar vector (beam aspect). Your relative radial closure speed drops to zero relative to ground clutter. The hostile radar filters your return as background clutter and drops lock. Dispensing chaff creates an artificial zero-Doppler false echo, breaking missile homing.
      </div>

      <div class="ge-subhead">ACTIVE ELECTRONIC WARFARE (EW) PODS &amp; DECOYS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>EW SYSTEM</th><th>MOUNT TYPE</th><th>SUPPRESSION EFFECT</th><th>OPERATIONAL CAPABILITY</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AN/ALQ-184</td>
              <td>1-Slot Self Pod</td>
              <td>30% Lock Degradation</td>
              <td>Compact self-protection jammer. Emits directional RF pulse noise against active radar locks.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">AN/ALQ-99</td>
              <td>2-Slot Heavy Pod</td>
              <td>45% Area Suppression</td>
              <td>Broadband tactical jammer pod suppressing enemy early warning radars across 95 km.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">AN/ALQ-249 NGJ</td>
              <td>3-Slot AESA Pod</td>
              <td>60% Standoff Jamming</td>
              <td>Next-gen GaN AESA standoff jamming pod delivering concentrated beam jamming out to 125 km.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">ADM-160B MALD</td>
              <td>Decoy Drone (2x)</td>
              <td>Signature Spoofing</td>
              <td>Air-launched autonomous decoy drone replicating host radar signature and speed profile out to 110 km.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">AN/ALE-55 FOTD</td>
              <td>Towed Decoy (4x)</td>
              <td>Missile Seduction</td>
              <td>Fiber-optic towed decoy trailing high-power RF repeaters behind the aircraft to seduce radar missiles.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">TACTICAL MANEUVER CARDS REFERENCE</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>MANEUVER</th><th>COST</th><th>EVASION</th><th>TRIGGER CONDITION &amp; TACTICAL EFFECT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Doppler Notch &amp; Chaff</td>
              <td>0.7 TOK</td>
              <td>+30%</td>
              <td>Trigger on active radar (ARH) lock. Beams radar 90&deg;, cuts closure rate, and pops chaff.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td>
              <td>+25%</td>
              <td>Trigger on inbound missile within 25 km. High-G 3D spiral disrupts proportional lead pursuit.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev Push Cobra</td>
              <td>0.8 TOK</td>
              <td>+38%</td>
              <td>Requires TVC. Pitch up to 110&deg; creates an immediate closure rate mismatch against tailgaters.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Kinetic Escape</td>
              <td>0.7 TOK</td>
              <td>+28%</td>
              <td>Requires altitude &gt; FL150. Inverts aircraft and dives to recover Mach speed out of envelope.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">Emergency Chaff Salvo</td>
              <td>0.7 TOK</td>
              <td>+30%</td>
              <td>Dispenses dense chaff cloud to disrupt radar tracking locks. Costs 1 countermeasure charge.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Zoom Climb to Perch</td>
              <td>0.7 TOK</td>
              <td>+20%</td>
              <td>Requires Mach 0.70+. Converts airspeed into +8,500 ft high-altitude perch.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];