/**
 * js/data/manual/combat.js - Flight Manual Sections 06 to 07: Guided Missiles, Ordnance, ProNav & Defenses.
 */

window.MANUAL_COMBAT = [
  {
    id: 'ch6_weapons_salvos',
    title: 'SECTION 06: GUIDED MISSILES, A2G ORDNANCE, PRONAV & SALVO SYNERGIES',
    desc: `
      <div class="ge-desc">
        Modern air-to-air and air-to-ground munitions utilize specialized seeker heads, kinetic staging, and precision guidance to neutralize aerial threats and fortified IADS infrastructure.
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
              <td>AIM-9X-2, R-73, Python-5, IRIS-T, AGM-158B, Storm Shadow</td>
              <td><b>Throttle to Idle / Dive into Clouds / DIRCM.</b> Moisture softens imaging contrast; Idle cuts engine exhaust thermal bloom.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">INS / RADAR</td>
              <td>Inertial Guidance with Terminal Radar</td>
              <td>Kh-47M2 Kinzhal, BrahMos-A</td>
              <td><b>90&deg; Break Turn / CIWS Intercept.</b> High turning radius at Mach 3 to 6 creates lag displacement; CIWS blocks slower variants.</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">PASSIVE RF</td>
              <td>Anti-Radiation Homing (ARM)</td>
              <td>AGM-45B, AGM-88C, Kh-31P, ALARM-II, Kh-58UShKE, AGM-88G</td>
              <td><b>EMCON Emitter Shutdown.</b> Cuts lock on legacy ARMs; advanced memory ARMs (AGM-88G, Kh-58UShKE, ALARM-II) retain coordinates.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">LASER / MMW</td>
              <td>Semi-Active Laser &amp; Millimeter-Wave</td>
              <td>GBU-12/24/28, APKWS-II, Hellfire, JAGM, Brimstone II, GBU-53</td>
              <td><b>Weather Clouds vs Targeting Pods.</b> Clouds attenuate laser designation; Targeting Pods mitigate scatter and boost accuracy up to +26%.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. AIR-TO-GROUND ORDNANCE FAMILIES &amp; ARMOR PENETRATION</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ORDNANCE CLASS</th><th>ROLE &amp; STRENGTHS</th><th>LIMITATIONS &amp; COUNTERS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#f97316;font-weight:800;">Dumb Bombs &amp; Rockets</td>
              <td>Low-cost, immune to ECM/chaff, high blast per credit (Mk-82/84, FAB-500/1500, Hydra-70, Zuni, S-13OF).</td>
              <td>Short release range; low-alt exposure to AAA/SHORAD. High-altitude drops suffer dispersion without Targeting Pod CCIP.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Cluster Munitions</td>
              <td>Wide area-of-effect (5.5 to 7.0 km splash) wiping out clustered AAA, SAMs, radars, and depots (CBU-87/105, RBK-500, JSOW-A).</td>
              <td>Deflected by fortified concrete roofs (0.25x vs C2 Bunkers and Hardened Shelters).</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Glide Bombs &amp; SDBs</td>
              <td>All-weather GPS/INS standoff saturation (26 to 78 km) and compact internal carriage (JDAM, UMPK, GBU-39, StormBreaker, JSOW-C).</td>
              <td>Subsonic glide velocity allows SeaRAM and Pantsir CIWS turrets to intercept single releases. Fire in coordinated salvos.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Laser Bombs &amp; Bunker Busters</td>
              <td>Pinpoint concrete penetration against Fortified C2 Bunkers, Runways, and Shelters (GBU-10/24/28, KAB-1500L, GBU-57 MOP, TAURUS).</td>
              <td>Weather clouds degrade laser guidance unless paired with a Sniper XR or ATFLIR Targeting Pod.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">ATGMs &amp; Strafe Cannons</td>
              <td>Rapid supersonic/MMW strikes (Hellfire, JAGM, Maverick, Brimstone, Kh-38ML) and 30mm/37mm AP pods (BK-37, GSh-30-2K).</td>
              <td>Require medium-to-close ingress inside MR/SR SAM rings; best paired with SEAD suppression or low-deck approaches.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Targeting Pods (TGP)</td>
              <td>Passive external pods (LITENING, Sniper XR, ATFLIR, Sapsan-E, Legion). Grant +18% to +26% A2G Pk and expose Ground Radar Decoys out to 58 km.</td>
              <td>Occupies 1 external hardpoint and adds slight external pylon signature; worth mounting on strike leads.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. PROPORTIONAL NAVIGATION (PRONAV) &amp; SALVO SYNERGIES</div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">PRONAV COMMAND ACCELERATION FORMULATION:</span>
        <div class="ge-formula-code">a_n = N &times; V_c &times; &lambda;_dot</div>
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid var(--theme-accent);">
          <b style="color:var(--color-ice-highlight);">SALVO SATURATION DYNAMICS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Coordinating multiple missiles against one target boosts Pk by <b>+12% per extra missile</b> (up to +30%) and overwhelms CIWS point-defense reload cycles against glide bombs and cruise missiles.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">MIXED-SEEKER SYNERGY (+25%)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Combining Active Radar Homing (ARH) with Imaging Infrared (IIR) missiles triggers a <b>+25% synergy bonus</b>, forcing conflicting evasive responses.
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
        Turn your aircraft exactly <b>90&deg; perpendicular</b> to the threat radar vector. Pulse-Doppler radars filter out zero radial velocity echoes; beaming cuts your closure rate into the filter and breaks radar lock.
      </div>

      <div class="ge-subhead">2. DEFENSIVE MANEUVERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>MANEUVER</th><th>COST</th><th>DURATION</th><th>EVASION BONUS</th><th>TRIGGER CONDITION &amp; OPERATIONAL EFFECT</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Doppler Notch &amp; Chaff</td>
              <td>0.7 TOK</td><td style="color:#00f5a0;font-weight:700;">8.0s</td><td>+48%</td>
              <td>Trigger on active radar (ARH) lock. Beams threat 90&deg; and deploys chaff bloom.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">High-G Barrel Roll</td>
              <td>0.7 TOK</td><td style="color:#00f5a0;font-weight:700;">7.0s</td><td>+45%</td>
              <td>Trigger on inbound missile within 25 km. Spiral displacement forces ProNav lead lag.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Pugachev's Cobra</td>
              <td>0.8 TOK</td><td style="color:#00f5a0;font-weight:700;">6.0s</td><td>+55%</td>
              <td>Requires TVC nozzles. Rapid deceleration creates closure mismatch, forcing overshoot.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Split-S Dive</td>
              <td>0.7 TOK</td><td style="color:#00f5a0;font-weight:700;">7.5s</td><td>+45%</td>
              <td>Requires altitude &ge; FL117 (alt &ge; 0.18). Inverts 180&deg; and dives beneath LR SAM floors.</td>
            </tr>
            <tr>
              <td style="color:#f59e0b;font-weight:800;">Emergency Chaff Salvo</td>
              <td>0.7 TOK</td><td style="color:#00f5a0;font-weight:700;">8.0s</td><td>+42%</td>
              <td>Trigger on active radar lock. Releases dense chaff screen to disrupt tracking.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">Zoom Climb</td>
              <td>0.7 TOK</td><td style="color:#00f5a0;font-weight:700;">8.0s</td><td>+38%</td>
              <td>Climbs above low-altitude AAA and SHORAD ceilings while extending bomb glide range.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. ELECTRONIC WARFARE, TARGETING PODS &amp; DECOYS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--theme-accent);">AIRBORNE JAMMING PODS (ECM)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            AN/ALQ-184 (30%), AN/ALQ-99 (45%), and AN/ALQ-249 GaN AESA (60%) blind enemy aircraft radars and SAM fire-control locks across 70 to 125 km.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">OPTICAL TARGETING PODS (TGP)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            LITENING, ATFLIR, Sapsan-E, Sniper XR, and Legion Pods expose ground Radar Decoys and silent Optical SHORAD traps from 36 to 58 km away while boosting A2G precision.
          </div>
        </div>
      </div>
    `
  }
];
