/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 13
 * Covers: SEAD & Anti-EMCON Hunting, Terrain Masking, Silent Traps, CIWS Saturation & Strike Blueprints
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
          <b style="color:#fbbf24;">PHASE 2: BLIND RADARS &amp; SABOTAGE LOGISTICS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Fire <b>Anti-Radiation Missiles</b> (or launch ITALD decoys ahead) to kill VHF, Big Bird, and Gap-Filler radars, dropping un-cued LR SAM reach by 52%. Destroy <b>Power Substations</b> to halve jamming and bomb <b>Munition Dumps</b> to double nearby SAM reloads.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">PHASE 3: CRATER RUNWAYS &amp; CRACK OBJECTIVES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Cut Segment 3 (or Segments 2 &amp; 4) on runways with <b>BLU-107 Durandal</b>, <b>JP233</b>, or <b>GBU-24/31</b> penetrators to halt QRA scrambles. Strike Fortified C2 Bunkers and Hardened Shelters with <b>Bunker Penetrators</b> or standoff cruise salvos.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">PHASE 4: SUSTAINED RTB &amp; REARMING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Never risk crippled heavy bombers inside AAA belts after ordnance release. Press <b>[R] Return to Base</b> to sprint back inside the friendly munitions corridor (`x &le; 32 km`), repair armor, and replenish full external bomb racks in 1.8 to 3.5 seconds.
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

      <div class="ge-subhead">3. TERRAIN-MASKING ALTITUDE BANDS &amp; CIWS SATURATION</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ALTITUDE BAND</th><th>DEFENSES AVOIDED</th><th>DEFENSES ACTIVE &amp; RECOMMENDED HARDWARE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Deck Ingress (1,000 - 4,500 ft)</td>
              <td>Evades S-300V4, S-400, HQ-9B, and Patriot when un-cued (or up to 9,000 ft with TFR!).</td>
              <td>Exposed to AAA Flak, Tunguska, and IR SHORAD. Mount <b>Kevlar Belly Armor</b> (-45% flak dmg), <b>DIRCM Turret</b> (+24% vs IR), and <b>TFR Radar</b>.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Mid Band (15,000 - 22,000 ft)</td>
              <td>Above 23mm/30mm/35mm AAA flak and Strela/Avenger/Rapier ceilings.</td>
              <td>Inside 57mm Flak (up to 22,000 ft) and MR/LR SAM baskets. Ideal release height after SEAD clears radars.</td>
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
          CIWS turrets intercept slow subsonic glide bombs (JDAM, UMPK, GBU-39) and subsonic cruise missiles at 65% to 72% per shot within 7.5 km. Never trickle single glide bombs one by one! Either fire a synchronized <b>multi-weapon salvo</b> (4 to 8 SDBs or SOM-Js hitting together to exhaust CIWS cooldowns), attack with <b>Mach 2.4+ supersonic/hypersonic strikes</b> (Kh-38ML, BrahMos-A, Kh-32, Kinzhal — Mach 5+ weapons cannot be intercepted by CIWS!), or blind the dome with an <b>AGM-88G</b> or cluster dispenser first.
        </div>
      </div>

      <div class="ge-subhead">4. PROVEN STRIKE SQUADRON BLUEPRINTS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">PRECISION SEAD &amp; RUNWAY PACKAGE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            1x <b>EA-18G</b> (ALQ-249 Jammer + 2x AGM-88G + HTS) + 1x <b>Tornado GR.4</b> (JP233 + Damocles TGP + Durandal) + 2x <b>F-35A</b> (JSOW-C + StormBreaker + AIM-260 escort). Blinds radars, cuts every runway strip, and cracks bunkers cleanly.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">STANDOFF CITADEL CRACKER WING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            1x <b>F-15EX</b> (Kinzhal + Sniper XR + BVR) + 1x <b>B-1B or B-21</b> (JASSM-ER + GBU-31/57 + MITL Datalink) + 1x <b>Su-34</b> (Kh-58UShKE + RBK-500 + TFR). Combines hypersonic bunker shock, stealth cruise saturation, and cluster suppression.
          </div>
        </div>
      </div>
    `
  }
];
