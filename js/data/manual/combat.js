/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 6 to 7
 * Covers: Guided Munitions, Seekers, Salvos, Electronic Warfare & Doppler Notching
 */

window.MANUAL_COMBAT = [
  {
    id: 'ch6_weapons_salvos',
    title: 'SECTION 06 // GUIDED MISSILES, HOMING SEEKERS & SALVO SATURATION DOCTRINE',
    desc: `
      <div class="ge-subhead">MISSILE SEEKER TYPES &amp; COUNTERMEASURES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SEEKER</th><th>GUIDANCE METHOD</th><th>TACTICAL ADVANTAGE</th><th>DEFENSIVE COUNTERMEASURE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ARH</td>
              <td>Active Radar Homing (AIM-120D, Meteor, R-37M, PL-15E, AIM-260)</td>
              <td>Autonomous internal radar seeker. Fire-and-forget; long BVR reach (72–130 km).</td>
              <td><b>Doppler Notch (Beam 90°) + Chaff / ECM Pod / MALD Decoys.</b> Cuts radial closure velocity and creates zero-Doppler false echoes.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">IIR / EO</td>
              <td>Imaging Infrared / Optical (AIM-9X, R-73, Python-5, IRIS-T)</td>
              <td>Tracks exhaust heat plume and 3D silhouette. Immune to RF radar jamming and Doppler notching.</td>
              <td><b>Throttle to Idle / Dive into Weather Clouds / Break Line of Sight.</b> Clouds scatter infrared tracking; idle reduces thermal exhaust bloom.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RADAR</td>
              <td>Anti-Radiation Homing (AGM-88G AARGM-ER)</td>
              <td>Homes directly on active radar emissions. Deals <b>3× damage</b> to SAM radar batteries.</td>
              <td>Power down emitter radar array, deactivate jammer pods, or intercept with CIWS.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">DIRECT ENERGY</td>
              <td>Hitscan Chemical Laser / Railgun (DE-Pulse, TLS, EML)</td>
              <td>Instantaneous speed-of-light kinetic or thermal impact. Zero lead time required.</td>
              <td>Dive into weather clouds (scatters thermal laser beam) or maintain standoff beyond 9.0 km.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">PROPULSION SYSTEMS: RAMJET &amp; DUAL-PULSE</div>
      <div class="ge-grid-3">
        <div class="ge-card">
          <b style="color:#00f0ff;">RAMJET SUSTAINED</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            MBDA Meteor and PL-21 draw atmospheric air continually, maintaining Mach 4.6+ with <b>zero speed decay</b> out to maximum range.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">DUAL-PULSE ROCKET</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            PL-15E carries two propellant grains. Second pulse ignites 22 km from target, delivering a <b>+1.5 Mach terminal speed surge</b> to defeat evasions.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f97316;">HYPERSONIC AERO-BALLISTIC</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            R-37M and Kh-47M2 Kinzhal sprint at Mach 6.2–8.5 in the stratosphere before diving downward with crushing kinetic shock.
          </div>
        </div>
      </div>

      <div class="ge-subhead">PROBABILITY OF KILL (P_k) &amp; SALVO SATURATION FORMULA</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">TACTICAL HIT PROBABILITY EQUATION:</span>
        <div class="ge-formula-code">P_k = Base P_k × Range Score × Aspect Score - Target Agility - CMs + Salvo Bonus + Seeker Synergy</div>
      </div>

      <div class="ge-callout">
        <b>Salvo Saturation:</b> When multiple missiles are in flight against the same target, target defensive agility is degraded by <b>25% per additional missile</b>, while firing systems gain <b>+12% P_k per extra missile (up to +30%)</b>. Combining an ARH radar missile with an IIR optical missile grants an extra <b>+10% Mixed-Seeker Synergy Bonus</b>.
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'SECTION 07 // ELECTRONIC WARFARE, DOPPLER NOTCHING & DEFENSIVE MANEUVERS',
    desc: `
      <div class="ge-subhead">HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90°)</div>
      <div class="ge-desc">
        Pulse-Doppler radars detect targets by filtering for frequency shifts caused by closure velocity:
        <br><br>
        <b>To notch:</b> Turn your aircraft exactly <b>90° perpendicular</b> to the threat's radar vector (beam aspect). Your relative radial closure speed drops to zero relative to ground clutter. The hostile radar mistakes you for stationary background terrain and drops lock. Dispensing chaff creates an artificial zero-Doppler false echo, breaking missile homing.
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
              <td>Compact self-protection jammer. Emits directional RF pulse noise against active locks.</td>
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
              <td>Trigger on active radar (ARH) lock. Beams radar 90°, cuts closure rate, and pops chaff.</td>
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
              <td>Requires TVC. Pitch up to 110° creates an immediate closure rate mismatch against tailgaters.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Kinetic Escape</td>
              <td>0.7 TOK</td>
              <td>+28%</td>
              <td>Requires altitude > FL150. Inverts aircraft and dives to recover Mach speed out of envelope.</td>
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