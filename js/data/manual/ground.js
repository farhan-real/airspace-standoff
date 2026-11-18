/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 12
 * Covers: 5-Segment Runways, Airfield Parking, Complete Ground Units Catalog & Attack Difficulty Tiers
 */

window.MANUAL_GROUND = [
  {
    id: 'ch12_ground_iads',
    title: 'SECTION 12: RUNWAYS, AIRBASES & COMPLETE GROUND UNITS REFERENCE',
    desc: `
      <div class="ge-subhead">1. MULTI-SEGMENT RUNWAYS (3,500M) &amp; TAKEOFF LENGTH REQUIREMENTS</div>
      <div class="ge-desc">
        Every hostile airbase operates a 5-segment runway (700 meters per reinforced concrete segment, 7 HP Fortified each). Different aircraft types require different numbers of contiguous intact segments to launch:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">AIRCRAFT CONTIGUOUS SEGMENT REQUIREMENTS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.5;">
            &bull; <b>4 Segments (2,800m):</b> Heavy Interceptors &amp; Strategic Bombers (MiG-31BM, Su-34, Darkstar, B-1B, B-52H, Tu-160M, B-2A, B-21)<br>
            &bull; <b>3 Segments (2,100m):</b> Standard Air Superiority &amp; Stealth Fighters (Su-35S, F-15EX, J-20, Su-57, F-22A, Eurofighter, Su-30SM)<br>
            &bull; <b>2 Segments (1,400m):</b> STOL &amp; Light Multirole Fighters (JAS-39E, F-16V, MiG-29K, F-35A, Rafale-C, Mirage-2000, F-18E)<br>
            &bull; <b>1 Segment (700m):</b> Autonomous UCAV Drones (MQ-99, MQ-101, XQ-58A, Kizilelma)
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #fbbf24;">
          <b style="color:#fbbf24;">TACTICAL RUNWAY CRATERING &amp; PARKING NODES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.5;">
            &bull; <b>Middle Segment Cut (Seg 3):</b> Breaks 3 and 4-segment launches immediately, leaving two 2-segment halves.<br>
            &bull; <b>Quarter Cuts (Seg 2 &amp; Seg 4):</b> Leaves only single isolated segments, permanently grounding all manned aircraft.<br>
            &bull; <b>Parking Nodes:</b> Jets wait inside <b>Open Fields</b> (3 HP Soft), <b>Hangars</b> (8 HP Armored), and <b>Hardened Shelters</b> (10 HP Fortified). Bombing storage destroys parked jets inside. Before takeoff, jets physically <b>taxi</b> and perform a <b>takeoff roll</b> where strafing or runway cratering destroys them!
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. GROUND SURVEILLANCE, EW JAMMERS, C4I &amp; DECOY UNITS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>INSTALLATION</th><th>ARMOR &amp; HP</th><th>RANGE</th><th>TACTICAL FUNCTION &amp; COUNTER</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Nebo-M VHF Radar</b></td><td>SOFT (6 HP)</td><td>135 km</td><td>Long-wave counter-stealth radar degrading VLO stealth shaping by 2.8x. Top ARM target.</td></tr>
            <tr><td><b>91N6E Big Bird AESA</b></td><td>ARMORED (7 HP)</td><td>110 km</td><td>High-power 3D sector radar rapidly cueing S-400, HQ-9B, and Patriot batteries.</td></tr>
            <tr><td><b>Hardened Strategic Radome</b></td><td>FORTIFIED (13 HP)</td><td>122 km</td><td>Concrete-domed heavy EW radar; requires Bunker Penetrators or heavy ARMs to destroy.</td></tr>
            <tr><td><b>96L6 Mast Gap-Filler</b></td><td>SOFT (5 HP)</td><td>78 km</td><td>Elevated mast radar stripping low-altitude masking, dropping LR SAM floors to 2,500-4,500 ft.</td></tr>
            <tr><td><b>Giraffe AMB Mobile 3D</b></td><td>SOFT (4 HP)</td><td>64 km</td><td>Agile mobile low-altitude gap-filler spotting helicopters and deck-skimming strikers down to 850 ft.</td></tr>
            <tr><td><b>Early Warning Array / Van</b></td><td>SOFT (4-5 HP)</td><td>42-65 km</td><td>Regional surveillance radar arrays supporting medium and long-range SAM rings.</td></tr>
            <tr><td><b>Krasukha-4 / EW Jammer</b></td><td>ARMORED (6-7 HP)</td><td>36-52 km</td><td>Broadband microwave jammer degrading airborne locks and seekers. Powered by Grid Substations.</td></tr>
            <tr><td><b>Avtobaza Passive ELINT</b></td><td>SOFT (5 HP)</td><td>95 km</td><td>Silent RF direction-finder. Emits zero radar signal (immune to ARMs); destroy with GPS/Laser/TGP.</td></tr>
            <tr><td><b>SAM &amp; Thermal Decoys</b></td><td>SOFT (2 HP)</td><td>42-48 km</td><td>False RF &amp; thermal emitters baiting wasted ARMs. Exposed by Targeting Pods (45+ km for Thermal).</td></tr>
            <tr><td><b>C2 Bunker &amp; Mobile C2</b></td><td>FORTIFIED (18) / ARMORED (10)</td><td>55 km</td><td>Theater command posts. Destroying them slows local SAM reaction times by 40%.</td></tr>
            <tr><td><b>Comms Tower &amp; Power Node</b></td><td>SOFT (5-7 HP)</td><td>55 km</td><td>Comms cut EW-to-SAM handoff; destroying Power Substations cuts jammer output by 55%.</td></tr>
            <tr><td><b>Fuel, Munition &amp; Logistics Hub</b></td><td>SOFT (8) / ARMORED (8-10)</td><td>55-60 km</td><td>Trigger 4.5-7.5 km secondary blasts. Destroying Munition Dumps doubles SAM reloads; Logistics Hubs speed QRA scrambles by 18%.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. GROUND SAM, CIWS &amp; AAA FLAK BATTERIES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>BATTERY</th><th>CLASS &amp; ARMOR</th><th>REACH &amp; SPEED</th><th>FLOOR (UNCUDED / CUED)</th><th>COMBAT CHARACTERISTICS</th></tr>
          </thead>
          <tbody>
            <tr><td><b>S-300V4 Antey-2500</b></td><td>LR SAM (ARMORED 9 HP)</td><td>92 km (Mach 6.0)</td><td>8,000 / 4,500 ft</td><td>Extreme range, heavy 5 HP warhead; wide turn radius allows 90&deg; Doppler notching.</td></tr>
            <tr><td><b>S-400 Triumf</b></td><td>LR SAM (ARMORED 8 HP)</td><td>82 km (Mach 5.4)</td><td>6,500 / 3,500 ft</td><td>Strategic area-denial SAM (4 HP). Mask below 6,500 ft unless Gap-Filler is active.</td></tr>
            <tr><td><b>HQ-9B Long-Range SAM</b></td><td>LR SAM (ARMORED 8 HP)</td><td>76 km (Mach 4.8)</td><td>5,500 / 3,000 ft</td><td>Track-via-missile AESA SAM resisting Doppler notching (+20% anti-notch).</td></tr>
            <tr><td><b>MIM-104F Patriot PAC-3</b></td><td>LR SAM (ARMORED 7 HP)</td><td>68 km (Mach 4.9)</td><td>4,500 / 2,500 ft</td><td>High-agility hit-to-kill SAM (+25% anti-notch) dangerous inside 28 km.</td></tr>
            <tr><td><b>9K37M3 Buk-M3 TELAR</b></td><td>MR SAM (ARMORED 6 HP)</td><td>46 km (Mach 3.6)</td><td>2,500 / 1,500 ft</td><td>Self-contained organic radar; keeps engaging independently after EW radars fall.</td></tr>
            <tr><td><b>NASAMS-3 AMRAAM-ER</b></td><td>MR SAM (ARMORED 5 HP)</td><td>40 km (Mach 3.5)</td><td>2,200 / 1,500 ft</td><td>Rapid-firing networked medium SAM firing low-RCS interceptors.</td></tr>
            <tr><td><b>MIM-23 Hawk Phase III</b></td><td>MR SAM (SOFT 4 HP)</td><td>36 km (Mach 2.9)</td><td>2,400 / 1,600 ft</td><td>Upgraded medium SAM guarding border approaches and forward outposts.</td></tr>
            <tr><td><b>2K12 Kub (SA-6)</b></td><td>MR SAM (SOFT 4 HP)</td><td>32 km (Mach 2.8)</td><td>2,800 / 2,000 ft</td><td>Legacy semi-active medium SAM vulnerable to chaff and ECM pods.</td></tr>
            <tr><td><b>9K332 Tor-M2 SHORAD</b></td><td>SR SAM (ARMORED 5 HP)</td><td>18 km (Mach 2.8)</td><td>1,000 ft</td><td>All-weather point defense intercepting both aircraft and incoming PGMs (55%).</td></tr>
            <tr><td><b>Rapier Optical SHORAD</b></td><td>SR SAM (SOFT 4 HP)</td><td>15 km (Mach 2.5 EO)</td><td>1,000 ft</td><td>Zero radar emission (immune to ARMs, no RWR warning). Spot visually or via TGP.</td></tr>
            <tr><td><b>Strela-10M / Avenger IR</b></td><td>SR SAM (SOFT 3 HP)</td><td>11 km (Mach 2.3 IIR)</td><td>1,000 ft</td><td>Passive IR heat seeker; zero RWR alert. Counter with Idle throttle or DIRCM turret.</td></tr>
            <tr><td><b>Pantsir-S1 &amp; SeaRAM CIWS</b></td><td>CIWS (ARMORED 5-6 HP)</td><td>7.5-18 km PD</td><td>1,000 ft</td><td>Dedicated counter-PGM interceptors (65-72% vs slow bombs/cruise) plus 30mm guns on Pantsir.</td></tr>
            <tr><td><b>2K22M Tunguska Hybrid</b></td><td>AAA/SAM (ARMORED 5 HP)</td><td>11.5 km SAM / 6.5 km 30mm</td><td>1,000-14,500 ft</td><td>Fires EO SHORAD missiles out to 11.5 km, twin 30mm flak inside 6.5 km, and intercepts glide bombs (45%).</td></tr>
            <tr><td><b>Shilka / Gepard / 57mm Flak</b></td><td>AAA (SOFT 4 / ARMORED 5)</td><td>7.5-12 km</td><td>1,000-22,000 ft</td><td>Low-to-medium ceiling anti-aircraft guns; speed above Mach 1.0 and Kevlar belly armor cut hits.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. THE 10 GROUND ATTACK DIFFICULTY TIERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>TIER</th><th>SCORE</th><th>OBJ AND QRA JETS</th><th>KEY IADS &amp; BEHAVIOR PROFILE</th></tr>
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
