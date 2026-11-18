/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 09B
 * Covers: Ground Attack Gamemode, 240x160 IADS Theater, Multi-Segment Runways & Attack Difficulties
 */

window.MANUAL_ATTACK = [
  {
    id: 'ch9b_attack_iads',
    title: 'SECTION 09B: GROUND ATTACK MODE &amp; INTEGRATED AIR DEFENSE (IADS)',
    desc: `
      <div class="ge-desc">
        <b>SINGLE PLAYER ATTACK</b> shifts focus to deep air-to-ground operations across an expanded <b>240 km &times; 160 km</b> tactical theater defended by interconnected radar networks, layered SAM belts, AAA, and active multi-segment airbases.
      </div>

      <div class="ge-subhead">1. VICTORY OBJECTIVES &amp; GROUND ARMOR CLASSES</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">PRIMARY OBJECTIVES [OBJ]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Strategic targets marked with gold <b>[OBJ]</b> brackets (C2 Bunkers, Military Runways, Hardened Shelters, Logistics Bridges, SAM Assembly Plants) must be neutralized to win the sortie.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f43f5e;">
          <b style="color:#f43f5e;">SOFT, ARMORED &amp; FORTIFIED ARMOR</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>SOFT</b> (Radars, AAA, Fuel Depots, Open Fields): full damage from all ordnance.<br>
            <b>ARMORED</b> (SAMs, Hangars, Munition Dumps): full damage from ATGMs, PGMs, AP cannons, and clusters.<br>
            <b>FORTIFIED</b> (C2 Bunkers, Runways, HAS, Bridges): deflect 80% of light rockets/frag; use <b>Bunker Penetrators</b> or heavy cruise missiles!
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. MULTI-SEGMENT RUNWAYS, TAKEOFF LENGTHS &amp; PARKED AIRCRAFT</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">5-SEGMENT LONG RUNWAYS (3,500M STRIP)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Every airbase operates a 5-segment runway (700m per section). Different aircraft require different contiguous intact runway lengths:<br>
            &bull; <b>4 Segments:</b> Heavy Interceptors &amp; Bombers (MiG-31BM, Su-34)<br>
            &bull; <b>3 Segments:</b> Standard Fighters (Su-35S, F-15EX, J-20, Su-57)<br>
            &bull; <b>2 Segments:</b> STOL &amp; Light Jets (JAS-39E, F-16V, MiG-29K, F-35A)<br>
            &bull; <b>1 Segment:</b> Swarm UCAVs (MQ-101)<br>
            Bombing the <b>middle segment</b> grounds 3-to-4-segment jets immediately while 2-segment jets can still launch from either remaining half. Cutting both quarters (segments 2 and 4) leaves only 1-segment fragments and neutralizes manned flight operations.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #fbbf24;">
          <b style="color:#fbbf24;">OPEN FIELDS, HANGARS &amp; TAXIING JETS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Airbases hold finite stationed aircraft inside <b>Open Fields</b> (3 HP Soft), <b>Hangars</b> (8 HP Armored), and <b>Hardened Shelters</b> (10 HP Fortified). Destroying a storage structure destroys every jet parked inside. Before taking off, jets visibly <b>taxi</b> to an intact runway slice and perform a <b>takeoff roll</b> where they can be bombed or strafed on the ground.
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. IADS NETWORK ARCHITECTURE &amp; SUPPORT NODES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>INSTALLATION TYPE</th><th>SYSTEM MODELS</th><th>TACTICAL FUNCTION &amp; WEAKNESS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">EW Radars</td>
              <td>Nebo-M VHF (135km), Big Bird AESA (110km), 96L6 Gap-Filler (78km)</td>
              <td>VHF degrades stealth RCS; Gap-Filler drops LR SAM altitude floors down to 2,500 to 4,500 ft. Prime ARM targets.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Long-Range SAMs</td>
              <td>S-400 (82km), Patriot PAC-3 (68km), S-300V4 (92km)</td>
              <td>High-altitude area denial (Mach 4.9 to 6.0). Dive below 6,500 ft (or neutralize Gap-Fillers) to mask beneath their horizon.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">Medium &amp; Short SAMs</td>
              <td>Buk-M3, NASAMS-3, Kub, Tor-M2, Rapier Optical, Strela/Avenger IR</td>
              <td>Buk operates independently; Rapier &amp; Avenger emit zero radar warning (immune to ARMs; spot via Targeting Pod!).</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CIWS &amp; Low-Alt AAA</td>
              <td>SeaRAM (7.5km PD), Pantsir-S1 (7.5km PD), Shilka 23mm, Gepard 35mm, 57mm Flak</td>
              <td>CIWS intercepts slow glide bombs and subsonic cruise missiles within 7.5 km (saturate with salvos). Fast Mach 1+ passes cut AAA hit rates.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Jammers, ELINT &amp; Comms</td>
              <td>Krasukha-4 Jammer, Avtobaza ELINT, C4I Comms Towers, Power Substations</td>
              <td>Neutralizing Power Substations cuts jammer strength by 55%; destroying Comms breaks long-range EW-to-SAM handoff; ELINT is silent.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Depots &amp; Decoys</td>
              <td>Fuel Depots, Munition Depots, SAM Radar Decoys</td>
              <td>Fuel &amp; Munition dumps detonate in secondary blasts, slow scrambles, and double SAM reload delays. Targeting Pods expose Decoys.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. EMCON SHUTDOWNS &amp; THE 10 GROUND ATTACK DIFFICULTY TIERS</div>
      <div class="ge-desc">
        Target count, airbase stockpiles, SAM overlap, and EMCON shutdown discipline scale smoothly with player squadron ammunition capacity across all 10 tiers.
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>TIER</th><th>SCORE</th><th>OBJ / QRA JETS</th><th>KEY IADS &amp; BEHAVIOR PROFILE</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Unprepared Garrison</b></td><td>0.50x</td><td>2 Obj / 1 Jet</td><td>1 Runway (5 seg), 1 EW, 1 Strela, 1 Shilka, 1 Fuel, 60s scramble, 0% EMCON.</td></tr>
            <tr><td><b>Border Outpost</b></td><td>0.75x</td><td>2 Obj / 2 Jets</td><td>1 Runway, 1 EW, 1 MR SAM, 1 SR SAM, 1 AAA, 1 Comms, 54s scramble, 6% EMCON.</td></tr>
            <tr><td><b>Forward Garrison</b></td><td>1.00x</td><td>3 Obj / 3 Jets</td><td>1 Runway + 1 HAS, 1 EW, 1 LR SAM, 1 MR SAM, 1 SR SAM, 1 CIWS, 1 Decoy, 48s scramble, 14% EMCON.</td></tr>
            <tr><td><b>Fortified Belt</b></td><td>1.25x</td><td>3 Obj / 3 Jets</td><td>2 EW + Gap-Filler, 1 LR SAM, 1 MR SAM, 1 SR SAM, 1 CIWS, 1 Jammer, 44s scramble, 22% EMCON.</td></tr>
            <tr><td><b>Integrated Air Defense</b></td><td>1.50x</td><td>3 Obj / 4 Jets</td><td>VHF counter-stealth + 1 LR SAM, 1 MR SAM, 2 AAA, ELINT + Jammer, 40s scramble, 30% EMCON.</td></tr>
            <tr><td><b>Hardened Command Sector</b></td><td>1.75x</td><td>4 Obj / 5 Jets</td><td>2 EW, 1 LR SAM, 2 MR SAM, 1 SR SAM, 1 CIWS, 1 Infra obj, 36s scramble, 36% EMCON.</td></tr>
            <tr><td><b>Dense Air Defense Sector</b></td><td>2.00x</td><td>4 Obj / 6 Jets</td><td>2 EW, 2 LR SAM, 2 MR SAM, 2 SR SAM, 2 CIWS, 2 HAS, 2 Decoys, 32s scramble, 44% EMCON.</td></tr>
            <tr><td><b>Layered Defense Corridor</b></td><td>2.30x</td><td>4 Obj / 7 Jets</td><td>2 EW, 2 LR SAM, 2 MR SAM, 2 SR SAM, 2 CIWS, 2 Jammers, 55% pair scramble, 50% EMCON.</td></tr>
            <tr><td><b>Heavy Integrated Defense</b></td><td>2.60x</td><td>5 Obj / 8 Jets</td><td>2 Runways, 2 Bunkers, 2 LR SAM, 2 MR SAM, 2 SR SAM, 2 CIWS, 65% pair scramble, 58% EMCON.</td></tr>
            <tr><td><b>Strategic Air Denial</b></td><td>3.20x</td><td>5 Obj / 8 Jets</td><td>2 Runways, 2 Bunkers, 3 EW, 2 LR SAM, 3 MR SAM, 2 SR SAM, 2 CIWS, 3 AAA, 22s scramble, 66% EMCON.</td></tr>
          </tbody>
        </table>
      </div>
    `
  }
];
