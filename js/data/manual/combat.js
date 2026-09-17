/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 6 to 7
 * Covers: Guided Munitions, Seekers, Salvos, Electronic Warfare & Doppler Notching
 */

window.MANUAL_COMBAT = [
  {
    id: 'ch6_weapons_salvos',
    title: 'CHAPTER 6: GUIDED MISSILES, SEEKERS & SALVO SATURATION DOCTRINE',
    desc: `
      <div class="ge-subhead">MISSILE SEEKER TYPES &amp; COUNTERMEASURES</div>
      <table class="ge-table">
        <thead>
          <tr><th>SEEKER TYPE</th><th>GUIDANCE METHOD</th><th>TACTICAL ADVANTAGE</th><th>DEFENSIVE COUNTERMEASURE</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:#00f0ff;"><b>ARH</b></td>
            <td>Active Radar Homing (AIM-120D, Meteor, R-37M, PL-15E, AIM-260)</td>
            <td>Autonomous internal radar seeker. Fire-and-forget; long BVR reach (72–130 km).</td>
            <td><b>Doppler Notch (Beam 90°) + Dispense Chaff / ECM Pod / MALD Decoys.</b> Cuts radial closure velocity and creates zero-Doppler false echoes.</td>
          </tr>
          <tr>
            <td style="color:#00f5a0;"><b>IIR / EO</b></td>
            <td>Imaging Infrared / Optical (AIM-9X, R-73, Python-5, IRIS-T)</td>
            <td>Tracks exhaust heat plume and 3D silhouette. Immune to RF radar jamming and Doppler notching.</td>
            <td><b>Throttle to Idle / Dive into Weather Clouds / Break Line of Sight.</b> Clouds scatter infrared tracking; idle reduces thermal exhaust bloom.</td>
          </tr>
          <tr>
            <td style="color:#ffb830;"><b>PASSIVE RADAR</b></td>
            <td>Anti-Radiation Homing (AGM-88G AARGM-ER)</td>
            <td>Homes directly on active radar emissions. Deals <b>3× damage</b> to SAM radar batteries.</td>
            <td>Power down emitter radar array, deactivate jammer pods, or intercept with CIWS.</td>
          </tr>
          <tr>
            <td style="color:#c084fc;"><b>DIRECT ENERGY</b></td>
            <td>Hitscan Chemical Laser / Railgun (DE-Pulse, TLS, EML)</td>
            <td>Instantaneous speed-of-light kinetic or thermal impact. Zero lead time required.</td>
            <td>Dive into weather clouds (scatters thermal laser beam) or maintain standoff beyond 9.0 km.</td>
          </tr>
        </tbody>
      </table>

      <div class="ge-subhead">PROPULSION SYSTEMS: RAMJET &amp; DUAL-PULSE</div>
      <div class="ge-desc">
        <ul>
          <li><b>Ramjet Sustained (MBDA Meteor, PL-21):</b> Draws atmospheric air continually, maintaining Mach 4.6+ with <b>zero speed decay</b> out to maximum range.</li>
          <li><b>Dual-Pulse Rocket (PL-15E):</b> Carries two solid-propellant grains. Second pulse ignites 22 km from target, providing a <b>+1.5 Mach terminal speed surge</b> to defeat evasions.</li>
          <li><b>Hypersonic Aero-Ballistic (R-37M, Kinzhal):</b> Sprints at Mach 6.2–8.5 in the stratosphere before diving down with crushing kinetic shock.</li>
        </ul>
      </div>

      <div class="ge-subhead">PROBABILITY OF KILL (P_k) &amp; SALVO SATURATION FORMULA</div>
      <div class="ge-desc">
        Hit probability is dynamically computed from geometry, kinematic state, and countermeasures:
        <br><br>
        <center><code>P_k = Base P_k × Range Score × Aspect Score - Target Agility - CMs + Salvo Bonus + Seeker Synergy</code></center>
        <br>
        <b>Salvo Saturation:</b> When multiple missiles are in flight against the same target, target defensive agility is degraded by <b>25% per additional missile</b>, while firing systems gain <b>+12% P_k per extra missile (up to +30%)</b>. Combining an ARH radar missile with an IIR optical missile grants an extra <b>+10% Mixed-Seeker Synergy Bonus</b>.
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'CHAPTER 7: ELECTRONIC WARFARE, DOPPLER NOTCHING & MANEUVERS',
    desc: `
      <div class="ge-subhead">HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90°)</div>
      <div class="ge-desc">
        Pulse-Doppler radars detect targets by filtering for frequency shifts caused by closure velocity:
        <br><br>
        <b>To notch:</b> Turn your aircraft exactly <b>90° perpendicular</b> to the threat's radar vector (beam aspect). Your relative radial closure speed drops to zero relative to ground clutter. The hostile radar mistakes you for stationary background terrain and drops lock. Dispensing chaff creates an artificial zero-Doppler false echo, breaking missile homing.
      </div>

      <div class="ge-subhead">ACTIVE ELECTRONIC WARFARE (EW) PODS &amp; DECOYS</div>
      <div class="ge-desc">
        <ul>
          <li><b>AN/ALQ-184 &amp; AN/ALQ-99:</b> Emit broadband microwave noise that degrades incoming active radar locks by 30%–45%. Vulnerable to Home-On-Jam (HOJ) missiles.</li>
          <li><b>AN/ALQ-249 NGJ-MB:</b> Next-generation GaN AESA standoff jamming pod delivering directional beam jamming out to 125 km (60% suppression).</li>
          <li><b>ADM-160B MALD Decoy Drone:</b> Autonomous decoy drone replicating the host aircraft's radar cross-section and speed profile out to 110 km to deceive enemy sensors.</li>
          <li><b>AN/ALE-55 FOTD:</b> Fiber-optic towed decoy trailing high-power RF repeaters behind the aircraft to seduce radar missiles away from the airframe.</li>
        </ul>
      </div>

      <div class="ge-subhead">TACTICAL MANEUVER CARDS</div>
      <table class="ge-table">
        <thead>
          <tr><th>MANEUVER CARD</th><th>TOKEN COST</th><th>EVASION BONUS</th><th>TACTICAL TRIGGER &amp; EFFECT</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Doppler Notch &amp; Chaff</b></td><td>0.7 TOK</td><td>+30% Evasion</td><td>Trigger on active radar (ARH) lock. Beams 90°, cuts closure, pops chaff.</td></tr>
          <tr><td><b>High-G Barrel Roll</b></td><td>0.7 TOK</td><td>+25% Evasion</td><td>Trigger on missile within 25 km. High-G spiral disrupts proportional lead.</td></tr>
          <tr><td><b>Pugachev Push Cobra</b></td><td>0.8 TOK</td><td>+38% Evasion</td><td>Requires TVC. Pitch up to 110° creates closure mismatch against tailgaters.</td></tr>
          <tr><td><b>Split-S Kinetic Escape</b></td><td>0.7 TOK</td><td>+28% Evasion</td><td>Requires altitude > FL150. Inverts and dives to gain Mach speed.</td></tr>
          <tr><td><b>Emergency Chaff Salvo</b></td><td>0.7 TOK</td><td>+30% Evasion</td><td>Dispenses high-density chaff cloud to disrupt radar tracking.</td></tr>
          <tr><td><b>Zoom Climb to Perch</b></td><td>0.7 TOK</td><td>+20% Evasion</td><td>Requires Mach 0.70+. Converts airspeed into +8,500 ft high-altitude perch.</td></tr>
        </tbody>
      </table>
    `
  }
];