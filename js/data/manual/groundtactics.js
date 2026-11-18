/**
 * js/data/manual/groundtactics.js - Flight Manual Submodule: Section 13
 * Covers: SEAD & Anti-EMCON Hunting, Terrain Masking, ECM & Decoy Baiting, Fast CAS Gun/Rocket Runs
 */

window.MANUAL_GROUND_TACTICS = [
  {
    id: 'ch13_ground_tactics',
    title: 'SECTION 13: SEAD OPERATIONS & COUNTER-IADS STRIKE TACTICS',
    desc: `
      <div class="ge-desc">
        Flying straight at an undefeated Integrated Air Defense System wastes precision bombs to CIWS turrets and exposes strikers to lethal overlapping SAM envelopes. Follow this proven four-phase ground strike doctrine to dismantle enemy defenses efficiently.
      </div>

      <div class="ge-subhead">1. THE FOUR-PHASE GROUND STRIKE SEQUENCE</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PHASE 1: RECON &amp; AIR SUPERIORITY ESCORT</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Lead with fighters carrying <b>ELINT/ESM Pods</b> (or HTS) and long-range BVR missiles. Sweep away initial airborne CAP interceptors while passively mapping radiating EW radars, S-400s, and ground jammers from 105 to 155 km out.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #fbbf24;">
          <b style="color:#fbbf24;">PHASE 2: ECM SUPPRESSION, DECOY BAITING &amp; SEAD</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Project an <b>ECM Jamming Pod</b> umbrella (cuts active RF SAM range up to 45% and slows SAM lock times) and launch <b>ITALD / MALD Decoys</b> ahead to drain SAM ready racks into a 20s-32s reload window while ARMs kill radars. Destroy <b>Power Substations</b> to halve ground jamming and bomb <b>Munition Dumps</b> to extend SAM reloads by 80%.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">PHASE 3: CRATER RUNWAYS, FAST CAS &amp; OBJECTIVE STRIKES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Cut Segment 3 on runways with <b>BLU-107 Durandal</b>, <b>JP233</b>, or <b>GBU-24/31</b> penetrators to halt QRA scrambles. Send fast CAS attackers (<b>MiG-27K</b>, <b>A-16</b>, <b>F-16XL</b>, <b>Su-39</b>, <b>AV-8B+</b>, <b>Jaguar</b>, <b>A-10C</b>) armed with 30mm/37mm cannons and <b>S-25OFM / CRV7-MPSM</b> rockets to finish exposed SAMs, shelters, and AAA.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">PHASE 4: SUSTAINED RTB &amp; REARMING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Never risk crippled heavy bombers inside AAA belts after ordnance release. Press <b>[R] Return to Base</b> to sprint back inside the friendly munitions corridor (x &le; 32 km), repair armor, and replenish full external bomb racks in 1.8 to 3.5 seconds.
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. ANTI-EMCON HUNTING &amp; DECOY DISCRIMINATION</div>
      <div class="ge-card">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.6;color:#cbd5e1;">
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Defeating EMCON Shutdowns:</b> On mid-to-high tiers and <i>Silent Radar Ambush</i> doctrine, SAM operators shut off radars when legacy ARMs (Shrike, AGM-88C, Kh-31P) approach within 28 km, breaking missile lock. Load <b>Anti-EMCON ARMs</b> (<b>AGM-88E</b>, <b>AGM-88G</b>, <b>Kh-58UShKE</b>, <b>ALARM-II</b>, <b>HAROP-AL</b>, <b>SPEAR-EW</b>) whose inertial memory and terminal millimeter-wave seekers continue killing shut-down emitters.</li>
          <li><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exposing Decoys &amp; Silent Traps:</b> Standard radar sweeps cannot tell real S-400s from <b>Radar Decoys</b> or spot passive <b>Rapier</b>, <b>Strela</b>, and <b>Avtobaza ELINT</b> sites. Equip a <b>Targeting Pod</b>: LITENING (36 km) and Sapsan-E (42 km) expose RF decoys, while high-grade pods like <b>ATFLIR</b> (45 km), <b>Damocles</b> (52 km), <b>Sniper XR</b> (55 km), <b>Legion</b> (58 km), and <b>TARPS</b> (65 km) also reveal <b>Thermal &amp; Visual Mockups</b> from safe distance.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. TERRAIN-MASKING ALTITUDE BANDS &amp; FAST CAS GUN/ROCKET PASSES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ALTITUDE BAND</th><th>DEFENSES AVOIDED</th><th>DEFENSES ACTIVE &amp; RECOMMENDED HARDWARE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Deck Ingress (1,000 - 4,500 ft)</td>
              <td>Evades S-300V4, S-400, HQ-9B, and Patriot floors (or up to 6,000-8,500 ft with TFR!).</td>
              <td>Exposed to AAA Flak, Tunguska, and IR SHORAD. High speed (&gt; Mach 1.0) on MiG-27K, A-16, and F-16XL cuts AAA hit rates, while <b>A-10C / Su-39</b> innate armor + <b>Kevlar Belly Armor</b> absorb flak.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Mid Band (15,000 - 22,000 ft)</td>
              <td>Above 23mm/30mm/35mm AAA flak and Strela/Avenger/Rapier ceilings.</td>
              <td>Inside 57mm Flak (up to 20,000 ft) and MR/LR SAM baskets. Ideal release height for laser/SDB bombs after SEAD clears radars.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">High Perch (26,000 - 45,000 ft)</td>
              <td>Completely immune to all AAA flak and SHORAD batteries.</td>
              <td>Optimal release altitude for SDB glide bombs (55-68 km) and standoff cruise missiles. Equip <b>CCIP</b> if dropping unguided bombs high.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ge-card" style="border-left:3px solid #f43f5e;">
        <b style="color:#f43f5e;">BEATING SEA-RAM, PANTSIR &amp; TUNGUSKA POINT DEFENSE</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          CIWS turrets intercept slow subsonic glide bombs (JDAM, UMPK, GBU-39) and subsonic cruise missiles at 55% to 62% per shot within 7.5 km. Overwhelm CIWS with synchronized <b>multi-bomb salvos</b>, fire <b>Mach 2.4+ supersonic rockets and missiles</b> (S-25OFM, CRV7-MPSM, Kh-38ML, BrahMos-A, Kh-32, Kinzhal), or fly a fast CAS jet straight in with <b>30mm/37mm AP cannons</b> (immune to CIWS!).
        </div>
      </div>

      <div class="ge-subhead">4. PROVEN STRIKE &amp; FAST CAS SQUADRON BLUEPRINTS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">FAST CAS HEAVY-GUN &amp; ROCKET WING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            1x <b>EA-18G</b> (ALQ-249 Jammer + AGM-88G) + 1x <b>MiG-27K</b> (GSh-6-30 + S-25OFM + Kh-29T) + 1x <b>A-16</b> (GAU-13 + GPU-5/A + CRV7-MPSM + TFR) + 1x <b>Su-39 or A-10C</b> (GSh-30-2/GAU-8 + BK-37 + Kevlar Belly). Jammer suppresses SAMs while supersonic gunships tear through batteries and shelters at Mach 1.3+.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">STANDOFF CITADEL CRACKER WING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            1x <b>F-16XL</b> (GAU-13 + BK-37 + GBU-31 + CBU-105) + 1x <b>B-1B or B-21</b> (JASSM-ER + GBU-31/57 + MITL Datalink) + 1x <b>F-35A</b> (JSOW-C + StormBreaker + AIM-260 escort). Combines supersonic heavy payload sweeps, stealth cruise saturation, and escort air cover.
          </div>
        </div>
      </div>
    `
  }
];
