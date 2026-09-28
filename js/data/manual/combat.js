/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 6 to 7
 * Covers: Guided Munitions, ProNav Guidance, Salvos & Multi-Layer Defenses
 */

window.MANUAL_COMBAT = [
  {
    id: 'ch6_weapons_salvos',
    title: 'SECTION 06: GUIDED MISSILES, PRONAV GUIDANCE & SALVO SYNERGIES',
    desc: `
      <div class="ge-desc">
        Modern air-to-air missiles utilize specialized seeker heads and proportional navigation guidance to achieve terminal intercepts across visual and beyond-visual-range baskets.
      </div>

      <div class="ge-subhead">1. MISSILE SEEKER CLASSES &amp; COUNTERMEASURE MATRIX</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SEEKER</th><th>HOMING METHOD</th><th>MUNITION EXAMPLES</th><th>PRIMARY DEFENSIVE PROTOCOL</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ARH</td>
              <td>Active Radar Homing</td>
              <td>AIM-120D, Meteor, PL-15E, AIM-260, R-37M, PL-21</td>
              <td><b>Doppler Notch (Beam 90&deg;) + Chaff / ECM Pod / Decoys.</b> Cuts radial closure velocity to zero and drops Doppler tracking gate.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">IIR / EO</td>
              <td>Imaging Infrared / Optical</td>
              <td>AIM-9X-2, R-73, Python-5, IRIS-T, MAM</td>
              <td><b>Throttle to Idle / Dive into Clouds.</b> Moisture scatters imaging contrast; Idle reduces engine exhaust thermal bloom.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">INS / RADAR</td>
              <td>Inertial Guidance with Terminal Radar</td>
              <td>Kh-47M2 Kinzhal</td>
              <td><b>90&deg; Break Turn / CIWS Intercept.</b> High turning radius at Mach 6+ creates extreme lag displacement.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RF</td>
              <td>Anti-Radiation Homing (ARM)</td>
              <td>AGM-88G AARGM-ER</td>
              <td><b>Emitter Shutdown / ECM Deactivation.</b> Deactivate jamming pods and radar arrays to starve the seeker of emissions.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. PROPORTIONAL NAVIGATION (PRONAV) GUIDANCE KINEMATICS</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PRONAV COMMAND ACCELERATION FORMULATION:</span>
        <div class="ge-formula-code">a_n = N &times; V_c &times; &lambda;_dot</div>
      </div>
      <div class="ge-desc">
        Proportional Navigation guides the interceptor by commanding acceleration normal to the velocity vector ($a_n$) proportional to the Line of Sight (LOS) rotation rate ($\lambda_{dot}$) and closing velocity ($V_c$). Key flight mechanics:
        <br><br>
        <ul style="list-style:none;padding-left:0;">
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Predictive Lead Pursuit:</b> Rather than chasing the target's current position, ProNav flies toward the predicted future collision point, minimizing steering effort.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Navigation Ratio (N = 3 to 5):</b> Higher navigation gain ensures rapid convergence onto the collision triangle during the midcourse phase.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>High-G Wave Drag Bleed:</b> Rocket motors burn for only 1.0 to 3.2 seconds. After burnout, missiles coast ballistically. Forcing high LOS rotation rates ($\lambda_{dot}$) with sharp defensive breaks demands high lateral Gs, rapidly bleeding kinetic energy and causing the weapon to fall short.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Aerodynamic Energy Retention (Lambda &amp; p):</b> Ballistic speed decays over distance according to: <code>V = V_peak &times; max(0.20, 1.0 - &lambda; &times; (D / D_max)^p)</code>. Shots taken at maximum range lose up to 60% of their kinetic energy before impact.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. MULTI-MISSILE SALVOS &amp; THE MIXED-SEEKER DILEMMA</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid var(--theme-accent);">
          <b style="color:var(--color-ice-highlight);">SALVO SATURATION DYNAMICS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Launching multiple missiles against a single target increases single-shot kill probability ($P_k$) by <b>+12% per extra missile</b> (up to +30% maximum salvo bonus). Each consecutive inbound missile forces sustained defensive turning, degrading target evasion probability by <b>25% per weapon</b>.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">MIXED-SEEKER SYNERGY BONUS (+25%)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Coordinating an Active Radar Homing missile (e.g. AIM-120D, Meteor) with an Imaging Infrared missile (e.g. AIM-9X-2, Python-5) triggers a <b>+25% synergy bonus</b>. The defender cannot satisfy conflicting defensive requirements simultaneously: beaming 90&deg; exposes engine exhaust, while throttling to idle destroys corner speed.
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'ch7_defense_ew',
    title: 'SECTION 07: MULTI-LAYER DEFENSES, ELECTRONIC WARFARE & EVASION',
    desc: `
      <div class="ge-subhead">1. HOW TO EXECUTE A DOPPLER NOTCH (BEAMING 90&deg;)</div>
      <div class="ge-desc">
        Turn your aircraft exactly <b>90&deg; perpendicular</b> to the threat's radar vector (beam aspect). Pulse-Doppler radars filter out stationary ground returns by ignoring zero radial velocity echoes. Turning 90&deg; drops your closure rate into the Doppler filter, breaking lock. Dispensing chaff while in the notch creates an artificial zero-Doppler clutter bloom that seduces the missile's seeker gate away from your airframe.
      </div>

      <div class="ge-subhead">2. TACTICAL DEFENSIVE MANEUVERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>MANEUVER</th><th>COST</th><th>DURATION</th><th>EVASION BONUS</th><th>TACTICAL TRIGGER &amp; OPERATIONAL EFFECT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Doppler Notch &amp; Chaff</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+48%</td>
              <td>Trigger on active radar (ARH) lock. Beams threat 90&deg;, zeros radial closure rate, and deploys chaff bloom.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.0s</td>
              <td>+45%</td>
              <td>Trigger on inbound missile within 25 km. Continuous spiral displacement forces extreme ProNav lead pursuit drag.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev's Cobra</td>
              <td>0.8 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">6.0s</td>
              <td>+55%</td>
              <td>Requires TVC nozzles. Snaps pitch to 110&deg;+ to create an immediate closure mismatch, forcing missile overshoot.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Dive</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">7.5s</td>
              <td>+45%</td>
              <td>Requires altitude &gt; FL150. Inverts aircraft and dives to recover +0.32 Mach escape speed out of weapon basket.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Zoom Climb</td>
              <td>0.7 TOK</td>
              <td style="color:#00f5a0;font-weight:700;">8.0s</td>
              <td>+38%</td>
              <td>Trades -0.28 Mach of kinetic speed for +8,500 ft altitude perch, forcing incoming missiles to climb against gravity.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. ELECTRONIC WARFARE, DECOYS &amp; THERMAL SUPPRESSION</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--theme-accent);">AIRBORNE JAMMING PODS (ECM)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            AN/ALQ-184 (30%), AN/ALQ-99 (45%), and AN/ALQ-249 GaN AESA (60%) emit high-power microwave noise that blinds incoming active radar seekers and degrades enemy search radars across 70 to 125 km.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#c084fc;">DECOYS: TOWED FOTD &amp; MALD DRONES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            AN/ALE-55 fiber-optic towed decoys trail behind the host airframe to draw active radar missiles. ADM-160B MALD decoy drones fly autonomous profiles matching host speed and radar cross-section.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">WEATHER CLOUD MASKING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Diving inside meteorological cloud cells scatters optical, laser, and imaging infrared (IIR) seeker optics, reducing tracking probability by up to 25% per cell and attenuating laser damage.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#fbbf24;">THERMAL THROTTLE MANAGEMENT</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Afterburners generate a 1.45x thermal exhaust plume. Cutting engine power to IDLE or CRUISE cools the turbine core to 0.70x, frustrating infrared missiles and extending defensive separation.
          </div>
        </div>
      </div>
    `
  }
];