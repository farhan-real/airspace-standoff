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
              <td style="color:#ffd700;font-weight:800;">INS</td>
              <td>Inertial Navigation System with Terminal Radar (Kh-47M2 Kinzhal)</td>
              <td>Internal solid-state gyroscopes and accelerometers dead-reckon the high-altitude stratospheric cruise. Switches to active radar terrain/target correlation upon terminal hypersonic dive (Mach 5.0). Completely immune to midcourse RF jamming.</td>
              <td><b>Perpendicular Break Turn / CIWS Point Defense.</b> Hypersonic momentum creates a wide turning radius; break hard 90&deg; perpendicular to the dive vector, or intercept with Phalanx / Pantsir CIWS batteries.</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;font-weight:800;">GPS / INS</td>
              <td>Satellite Uplink &amp; Inertial Dead-Reckoning (GBU-39 SDB)</td>
              <td>Coordinates aerodynamic glide trajectory via satellite constellation and internal INS dead-reckoning against surface command bunkers and air defense nodes.</td>
              <td><b>CIWS Point Defense / Platform Neutralization.</b> Intercept glide weapons with CIWS batteries or neutralize launch aircraft before weapon release.</td>
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
              <td>Aero-Ballistic Trajectory (INS / ARH)</td>
              <td>R-37M and Kinzhal loft into the stratosphere (FL550&ndash;FL600) in thin air, then plunge in a terminal hypersonic dive (Mach 4.2&ndash;5.0) onto radar-correlated target coordinates.</td>
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

      <div class="ge-subhead">3. NON-STACKING EVASIONS &amp; KINETIC ENERGY BLEED</div>
      <div class="ge-desc">
        Defense against guided weapons is governed by two fundamental physical principles:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Non-Stacking Evasions:</b> Evasion bonuses do not add linearly. Activating a Doppler notch, dropping chaff, and pulling a barrel roll simultaneously uses your <b>single strongest active defense</b> rather than compounding into immunity.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Kinetic Energy Bleed:</b> Hard turns, banking, and high-G maneuvers induce aerodynamic drag that drains aircraft kinetic energy. An aircraft that bleeds energy (below 100%) suffers reduced turn capability and grants a direct <b>hit probability bonus (+up to 30% P_k)</b> to subsequent inbound missiles!</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Subsequent Missile Vulnerability:</b> Successfully evading a missile costs an immediate 25% energy drain, making chaining multi-missile salvos lethal against evasive targets.</li>
        </ul>
      </div>

      <div class="ge-subhead">4. LAUNCH ESTIMATE VS. IMPACT RESOLUTION</div>
      <div class="ge-desc">
        The probability displayed on the cockpit HUD and weapon buttons (e.g. <code>EST. 72%</code>) is a real-time firing estimate based on launch geometry and target energy. The <b>true hit probability is resolved at the moment of impact</b>, calculating the target's current speed, energy deficit, non-stacking defenses, and terminal aspect.
      </div>

      <div class="ge-subhead">5. PROXIMITY FUSING VS. KINETIC OVERSHOOTS</div>
      <div class="ge-desc">
        Warheads detonate when the missile closes within <b>650 meters</b> or reaches its Closest Point of Approach (CPA &le; 950m). If an aircraft breaks hard outside the missile's turn radius, the missile does not prematurely detonate or enter a circle; it executes a realistic <b>Kinetic Overshoot</b>, streaking past the target on kinetic momentum before expiration.
      </div>

      <div class="ge-subhead">6. PASSIVE RADAR HOMING &amp; CONCEALMENT (AGM-88G)</div>
      <div class="ge-desc">
        Anti-Radiation Missiles (e.g. AGM-88G AARGM-ER) passively track enemy RF radar emissions without transmitting active radar:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Launch Concealment:</b> The missile icon remains hidden from enemy radar for the first 3.2 seconds of motor burn.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Trajectory Path Gating:</b> The missile's path to target is suppressed on enemy radar until within <b>20 km</b> of the target.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Full Commander Telemetry:</b> You always see the complete flight path and telemetry of your own missiles!</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>No Active Lock Warning:</b> Targets receive no active ARH lock tones prior to terminal proximity.</li>
        </ul>
      </div>

      <div class="ge-subhead">7. RADAR TELEMETRY READOUT &amp; THERMOBARIC BLAST (MPBM)</div>
      <div class="ge-desc">
        Missiles display comprehensive two-line telemetry on the radar scope:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Line 1:</b> Missile designation and salvo count in team/identification color (e.g. <code>AIM-120D x2</code>).</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Line 2:</b> Real-time Mach velocity, active propulsion stage, and target range in telemetry accent colors (e.g. <code>M 3.2 [PULSE 2] [18km]</code>).</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Thermobaric Area of Effect (MPBM):</b> The Multi-Purpose Burst Missile detonates in an expansive thermobaric shockwave, inflicting 7 HP direct damage on the target and secondary blast damage (1&ndash;5 HP) across an <b>8.5 km radius</b>.</li>
        </ul>
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
              <td>+35%</td>
              <td>Trigger on active radar (ARH) lock. Beams radar 90&deg;, cuts closure rate, and pops chaff.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td>
              <td>+32%</td>
              <td>Trigger on inbound missile within 25 km. High-G 3D spiral disrupts proportional lead pursuit.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev Push Cobra</td>
              <td>0.8 TOK</td>
              <td>+45%</td>
              <td>Requires TVC. Pitch up to 110&deg; creates an immediate closure rate mismatch against tailgaters.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Kinetic Escape</td>
              <td>0.7 TOK</td>
              <td>+35%</td>
              <td>Requires altitude &gt; FL150. Inverts aircraft and dives to recover Mach speed out of envelope.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">Emergency Chaff Salvo</td>
              <td>0.7 TOK</td>
              <td>+35%</td>
              <td>Dispenses dense chaff cloud to disrupt radar tracking locks. Costs 1 countermeasure charge.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Zoom Climb to Perch</td>
              <td>0.7 TOK</td>
              <td>+25%</td>
              <td>Requires Mach 0.70+. Converts airspeed into +8,500 ft high-altitude perch.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];