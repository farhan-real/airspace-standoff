/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Threat tiers, adversary flight lead cadre, difficulty-scaled tactical roles, IADS & scoring formulas.
 */

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY TACTICAL DOCTRINE, THREAT TIERS & PLANNING',
    desc: `
      <div class="ge-subhead">1. THE 6 BEHAVIORAL DIMENSIONS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">1. TARGET FOCUS &amp; DECOY IDENTIFICATION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Permissive Sector pilots chase any radar blip. In High-Threat, Air Denial, and Extreme Threat sectors, pilots check if a target is shooting back or flying too simply, but <b>still fall for decoy drones (MALD) 35% to 55% of the time</b> under combat stress.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">2. SPEED &amp; ENGINE THROTTLE CONTROL</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Higher tiers adjust throttle to keep their best turning speed (corner velocity, sOpt). However, <b>under heavy turn stress (high G-force) their discipline slips</b>: you can pull them into tight circling dogfights to drain their speed and leave them vulnerable.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#ffd700;">3. MISSILE SALVOS &amp; DUAL MISSILE TRAPS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Air Denial Zone and Extreme Threat Sector pilots occasionally pair radar-guided and heat-seeking missiles in the same attack, triggering the <b>+25% Mixed-Missile Bonus</b>. This forces you to defend against two conflicting threats at once.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f43f5e;">4. DEFENSIVE NOTCHING &amp; CHAFF DEFENSE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Turning 90 degrees to break a radar lock (Doppler notching) is never automatic: Extreme Threat pilots notch on ~55% of long-range shots, and at close range (under 15 km) that drops below 30% because quick turns are much harder.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#c084fc;">5. WINGMAN TEAMWORK &amp; ELEMENT PAIRS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Hostile Airspace and above fly in 2-plane pairs (Lead + Wingman). Wingmen trail by 4 to 8 km to cross-fire. If you shoot down the flight lead, the surviving wingman pauses in confusion for 3.5 to 5.0 seconds before taking over.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f0ff;">6. APPROACH ROUTES &amp; MISSION PLANNING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            High-tier squadrons plan flank routes (some high on the edges, some low). When low on missiles or damaged, they plan a covered retreat toward their fortified base line (and active SAM/CIWS batteries if operational).
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. EXPLOITING ENEMY WEAKNESSES</div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.55;color:#cbd5e1;">
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exploit Approach Routes:</b> High-difficulty flights sweep around the outer edges. Fly stealth jets along the sides to hit them while their radars face inward.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Shoot Down the Flight Lead First:</b> Eliminating the leader throws the wingmen into confusion for several seconds, leaving them wide open.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Use Decoy Drones (MALD):</b> Even the best enemy aces have a 35% mistake rate against decoys. Launch decoys ahead of your squad to soak up their first missile volley.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Drain Their Speed (Energy Trap):</b> Enemy pilots try to keep optimal turn speed, but if you make them dodge multiple missiles in a row, they will bleed off all their speed and become easy targets.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. THE 6 COMBAT DIFFICULTY TIERS</div>
      <div class="ge-desc">
        Adversary forces scale across pilot discipline, tactical decision-making, and package coordination rather than mathematical cheating. Below is the operational comparison across all theater engagement tiers:
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr>
              <th>TACTICAL ELEMENT</th>
              <th style="color:#8494ab;">PERMISSIVE SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">(CADET)</span></th>
              <th style="color:#38bdf8;">CONTESTED AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">(VETERAN)</span></th>
              <th style="color:#00f0ff;">HOSTILE AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">(ELITE)</span></th>
              <th style="color:#ffd700;">HIGH-THREAT SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">(ACE)</span></th>
              <th style="color:#c084fc;">AIR DENIAL ZONE<br><span style="font-size:0.52rem;opacity:0.7;">(MASTER)</span></th>
              <th style="color:#ff3366;">EXTREME THREAT SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">(LEGEND)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Score Multiplier</b></td><td style="color:#94a3b8;font-weight:700;">0.50x</td><td style="color:#38bdf8;font-weight:700;">1.00x</td><td style="color:#38bdf8;font-weight:700;">1.50x</td><td style="color:#f43f5e;font-weight:700;">2.00x</td><td style="color:#f43f5e;font-weight:700;">2.60x</td><td style="color:#f43f5e;font-weight:700;">3.20x</td></tr>
            <tr><td><b>Estimated Fleet Size</b></td><td style="color:#38bdf8;">4 - 6 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(Patrol Flight: Sweepers &amp; Multirole)</span></td><td style="color:#38bdf8;">7 - 9 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace Lead, Interceptors, Dogfighters, 0-1 SEAD)</span></td><td style="color:#38bdf8;">9 - 11 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace Lead, Interceptors, Ambush, Strike, SEAD, Swarm)</span></td><td style="color:#fbbf24;">11 - 13 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Aces, Snipers, Ambush, Dogfighters, Strike, SEAD, Swarm)</span></td><td style="color:#fbbf24;">13 - 15 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Flagship Aces, Snipers, Ambush, Dogfighters, SEAD, Swarm)</span></td><td style="color:#f43f5e;">14 - 16 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(3 Apex Aces, Full Combined-Arms Saturation Wing)</span></td></tr>
            <tr><td><b>Defense Budget Cap</b></td><td style="color:#94a3b8;">190.0M CR</td><td style="color:#38bdf8;">330.0M CR</td><td style="color:#fbbf24;">450.0M CR</td><td style="color:#fbbf24;">570.0M CR</td><td style="color:#fbbf24;">700.0M CR</td><td style="color:#f43f5e;">820.0M CR</td></tr>
            <tr><td><b>Reaction Delay</b></td><td style="color:#94a3b8;">6.5s - 7.5s (Sluggish)</td><td style="color:#38bdf8;">4.5s - 5.5s (Human)</td><td style="color:#fbbf24;">3.4s - 4.0s (Trained)</td><td style="color:#fbbf24;">2.6s - 3.0s (Sharp)</td><td style="color:#fbbf24;">2.0s - 2.4s (Fast)</td><td style="color:#f43f5e;">1.6s - 1.9s (Instant)</td></tr>
            <tr><td><b>Target Focus Slots</b></td><td style="color:#38bdf8;">1 Target at a time</td><td style="color:#38bdf8;">1 Target at a time</td><td style="color:#fbbf24;">2 Targets tracked</td><td style="color:#fbbf24;">2 Targets tracked</td><td style="color:#fbbf24;">2 - 3 Targets tracked</td><td style="color:#f43f5e;">3 Targets tracked</td></tr>
            <tr><td><b>Decoy Drone Defense</b></td><td style="color:#94a3b8;">0% (Chases all decoys)</td><td style="color:#94a3b8;">15% spot rate</td><td style="color:#38bdf8;">30% spot rate</td><td style="color:#38bdf8;">45% spot rate</td><td style="color:#38bdf8;">55% spot rate</td><td style="color:#fbbf24;">65% spot rate</td></tr>
            <tr><td><b>Radar Notch (Beam 90&deg;)</b></td><td style="color:#94a3b8;">0% (Never turns beam)</td><td style="color:#94a3b8;">5% (Rare turn)</td><td style="color:#38bdf8;">15% (Basic turn)</td><td style="color:#38bdf8;">25% (Turns beam)</td><td style="color:#38bdf8;">40% (Turns beam)</td><td style="color:#fbbf24;">55% (Disciplined turn)</td></tr>
            <tr><td><b>Firing Distance</b></td><td style="color:#94a3b8;">Fires at max distance (Easy to dodge)</td><td style="color:#fbbf24;">55% - 85% Max distance</td><td style="color:#fbbf24;">Best hit range (40% - 75%)</td><td style="color:#f43f5e;">Deadly hit range (35% - 70%)</td><td style="color:#f43f5e;">Top missile speed and accuracy</td><td style="color:#f43f5e;">Lethal high-speed missile traps</td></tr>
            <tr><td><b>Missiles per Attack</b></td><td style="color:#38bdf8;">1 Missile only</td><td style="color:#38bdf8;">1 Missile only</td><td style="color:#38bdf8;">1 - 2 Missiles</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#f43f5e;">2 - 3 Missile volley</td></tr>
            <tr><td><b>Mixed Missiles (Radar + Heat)</b></td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#38bdf8;">10% Mixed pair</td><td style="color:#fbbf24;">25% Mixed pair</td><td style="color:#fbbf24;">35% Mixed pair</td></tr>
            <tr><td><b>Speed &amp; Turn Control</b></td><td style="color:#94a3b8;">Burns afterburner; turns flat</td><td style="color:#38bdf8;">Normal cruising speed</td><td style="color:#38bdf8;">Uses best turn speed</td><td style="color:#fbbf24;">Good turn speed (slips under stress)</td><td style="color:#fbbf24;">Smooth throttle control in turns</td><td style="color:#fbbf24;">Expert speed and energy management</td></tr>
            <tr><td><b>3D Altitude Fighting</b></td><td style="color:#94a3b8;">Rarely changes altitude</td><td style="color:#94a3b8;">Occasional climbs</td><td style="color:#38bdf8;">Climbs when needed</td><td style="color:#fbbf24;">Climbs to high perch</td><td style="color:#fbbf24;">High and low spread</td><td style="color:#f43f5e;">Aggressive climbs and dives</td></tr>
            <tr><td><b>Formation Teamwork</b></td><td style="color:#94a3b8;">Scattered and solo</td><td style="color:#38bdf8;">Loose trail follow</td><td style="color:#fbbf24;">2-Plane pairs</td><td style="color:#fbbf24;">Pairs protecting each other</td><td style="color:#fbbf24;">High-low bracket</td><td style="color:#fbbf24;">Crossfire pairs</td></tr>
            <tr><td><b>Attack Approach Route</b></td><td style="color:#94a3b8;">Straight charge down center</td><td style="color:#94a3b8;">Straight flight path</td><td style="color:#fbbf24;">High altitude sweep</td><td style="color:#38bdf8;">Holds on outer edge</td><td style="color:#fbbf24;">Flank attack from side</td><td style="color:#fbbf24;">Attacks from multiple angles</td></tr>
            <tr><td><b>Tactical Roles</b></td><td style="color:#94a3b8;">Basic Sweep</td><td style="color:#38bdf8;">Sweep, Intercept, Dogfight</td><td style="color:#00f0ff;">Intercept, Dogfight, Strike, SEAD, Swarm</td><td style="color:#ffd700;">Snipers, Ambush, Dogfight, SEAD, Swarm</td><td style="color:#c084fc;">Superfighters, Snipers, Ambush, SEAD, Swarm</td><td style="color:#ff3366;">Full Combined-Arms Superfighter Wing</td></tr>
            <tr><td><b>Missile Ammo Saving</b></td><td style="color:#94a3b8;">Fires all missiles immediately</td><td style="color:#94a3b8;">Fires long-range missiles quickly</td><td style="color:#38bdf8;">Keeps 1 dogfight missile safe</td><td style="color:#fbbf24;">Saves missiles for good shots</td><td style="color:#fbbf24;">Only uses best missiles on key targets</td><td style="color:#fbbf24;">Saves reserve ammo, retreats if empty</td></tr>
            <tr><td><b>Reaction if Flight Lead Dies</b></td><td style="color:#94a3b8;">Complete panic and scatter</td><td style="color:#94a3b8;">Confused and stalls (5.0s)</td><td style="color:#38bdf8;">Hesitates (4.0s)</td><td style="color:#38bdf8;">Wingman takes charge (3.5s)</td><td style="color:#38bdf8;">Falls back to defense patrol (2.5s)</td><td style="color:#f43f5e;">Switches to defense instantly (1.8s)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. AIRFRAME WEIGHT &amp; STEALTH RULES</div>
      <div class="ge-desc">
        Aerodynamic weight tuning and stealth cleanliness are applied selectively based on airframe design and tactical mission:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Missile Trucks (F-15EX, J-20, MiG-31BM, Su-34):</b> Never restricted to light weight. They carry heavy external racks (Wr = 70% - 90%) and oversized standoff missiles (R-37M, PL-21, Kinzhal) to maximize missile magazine capacity.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Agile Dogfighters (Rafale, Su-35S, Eurofighter, Mirage-2000, F-16V):</b> On higher difficulties, they selectively roll lightweight loadouts (Wr &le; 50%), preserving 100% corner-speed turn authority.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Cleanliness:</b> Stealth jets (F-22A, YF-23, Su-57, J-20, Su-75) enforce pure internal bays when assigned the Ambush role. In other roles, they mount external rails for extra missile firepower.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Natural Fleet Sizing &amp; Rejection Finalization:</b> Fleet size is not governed by hardcoded plane limits. The adversary drafts aircraft sequentially against the sector defense budget, loading elite Aces first. Standard aircraft are then drawn based on role and tier probabilities. The moment an aircraft proposal exceeds the remaining budget, it is rejected and fleet generation instantly finalizes. Fleet sizes emerge naturally from unit costs and role drafting: 4-6 aircraft on Permissive Sector, 7-9 on Contested Airspace, 9-11 on Hostile Airspace, 11-13 on High-Threat Sector, 13-15 on Air Denial Zone, and 14-16 on Extreme Threat Sector.</li>
        </ul>
      </div>

      <div class="ge-subhead">5. TACTICAL COMBAT ROLES &amp; DIFFICULTY INTELLIGENCE</div>
      <div class="ge-desc">
        Adversary aircraft operate under ten distinct combat roles that scale in tactical intelligence and flight dynamics:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">STANDOFF SNIPER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>High-Threat to Extreme Threat:</b> Stratospheric FL420 to FL500 cruise holding 50 to 90 km perimeter separation. Fires ultra-long-range ramjet missiles (PL-21, R-37M, AIM-260) and cranks 65&deg; off boresight at radar gimbal limits to deny return fire.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">HIGH-SPEED INTERCEPTOR</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>All Difficulties:</b> Fast supersonic sprinters (MiG-31BM, DARKSTAR, F-15EX, Eurofighter, F-14D) cruising FL340 to FL420. Pushes afterburner thrust to achieve maximum closing velocity against high-value targets, delivering high-Mach BVR volleys.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">WVR DOGFIGHTER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>All Difficulties:</b> Agile high-AOA fighters (Su-35S, Mirage-2000, F-16V, Su-37, Rafale-C) operating FL180 to FL220. Drives into visual range (< 20 km), modulating throttle into optimal corner speed (sOpt) for high-G snapshot bursts and gunpod strafes.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #c084fc;">
          <b style="color:#c084fc;">SWARM FLIGHT SCREEN</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite through Legend:</b> High-G autonomous drones (MQ-99, MQ-101, XQ-58A, Kizilelma) holding outer corner positions. Flanks formation boundaries to draw enemy missile fire, deploying saturation micro-missile ripples (MAM) with zero pilot G-LOC constraints.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">FORMATION ESCORT</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>All Difficulties:</b> Balanced multirole platforms (Rafale-C, F-18E, KF-21) cruising FL260 to FL300. Maintains protective perimeter coverage around the Flight Lead or strike aircraft, engaging incoming interceptors with datalink-coordinated volleys.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #14b8a6;">
          <b style="color:#2dd4bf;">STEALTH AMBUSH</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite through Legend:</b> Pure stealth airframes (F-22A, YF-23, Su-57, J-20, Su-75) cruising FL360 to FL420 with clean internal bays. Stalks lateral sector boundaries, exploiting player beam-aspect radar spikes to deliver surprise BVR missile traps.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #e11d48;">
          <b style="color:#fb7185;">STRIKE INTERDICTION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Veteran through Legend:</b> Armored ground-attack aircraft and bombers (A-10C, Su-25SM3, Su-34, B-1B, F-15EX). Penetrates low beneath sensor horizons (FL055 to FL140) to deliver precision cruise missiles (JASSM-ER), glide bombs (SDB), or hypersonic Kinzhal strikes.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #a855f7;">
          <b style="color:#d8b4fe;">SEAD ESCORT (AIR DEFENSE SUPPRESSION)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>All Difficulties:</b> Electronic warfare escorts (EA-18G, J-16D, Tornado ECR, EF-111A) cruising FL300 to FL360. Projects broadband microwave jamming while geolocating and neutralizing surface radar arrays and SAM batteries with AGM-88Gs.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #10b981;">
          <b style="color:#10b981;">AIR DOMINANCE SWEEP</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>All Difficulties:</b> Balanced offensive fighter elements engaging in forward air merges, screening friendly strike wings, and executing 2-plane element crossfire tactics.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">COMMAND FLAGSHIP (ACE CADRE)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Veteran through Legend:</b> Elite formation leaders flying superfighters (ADF-11F, CFA-44, X-02S, ADFX-01, DARKSTAR) or top 5th-gen platforms. Possesses sub-second reaction latencies, directed-energy pulse lasers, EML railguns, and post-stall maneuvers.
          </div>
        </div>
      </div>

      <div class="ge-subhead">6. WEAPON RANGE CLASSES &amp; ORDNANCE PROFILES</div>
      <div class="ge-desc">
        Adversary aircraft plan ordnance configurations by matching weapon range classes to their assigned tactical role:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-1);">THE 4 WEAPON RANGE CLASSES</b>
          <div style="font-size:0.70rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>ULR (Ultra-Long: 110 - 135 km):</b> AIM-260, R-37M, PL-21, Kinzhal.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>LR (Long-Range: 78 - 95 km):</b> Meteor ramjet, PL-15E dual-pulse, AGM-88G.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>MR (Medium-Range: 60 - 75 km):</b> AIM-120D AMRAAM, MPBM burst.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>SR (Dogfight: 20 - 35 km):</b> Python-5 (rear shot), IRIS-T, AIM-9X-2, R-73.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--theme-accent);">ROLE-BASED ORDNANCE PROFILES</b>
          <div style="font-size:0.70rem;color:#cbd5e1;line-height:1.45;">
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Standoff Sniper:</b> ULR + LR ramjet missiles + heavy centerline rail.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>High-Speed Interceptor:</b> High-Mach BVR + WVR snap + Supercruise VCE.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>WVR Dogfighter:</b> Dual WVR missiles + gunpods + TVC agility.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Swarm Screen:</b> Micro-missile MAM ripples + Swarm AI coprocessors.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Formation Escort:</b> Balanced BVR + WVR + MADL battle link.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Ambush:</b> Pure internal bays (AIM-260, PL-15E) + RAM coating.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Strike / SEAD:</b> Centerline bunker penetrators + Jamming pods.
          </div>
        </div>
      </div>

      <div class="ge-subhead">7. INTEGRATED AIR DEFENSE SYSTEMS (IADS)</div>
      <div class="ge-desc" style="font-size:0.68rem;color:var(--color-moon-mist);margin-bottom:6px;"><b>NOTE:</b> Surface SAM batteries are currently offline by theater command directive. When active in operational scenarios, they establish the long-range engagement envelopes described below.</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>INSTALLATION</th><th>HP</th><th>ENVELOPE</th><th>OPERATIONAL CAPABILITY</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">S-400 / Patriot Battery</td>
              <td>8 HP</td>
              <td>52.0 km</td>
              <td>Fires Mach 5.2 radar-guided SAM volleys. Requires active Early Warning Radar Array.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Early Warning Radar Array</td>
              <td>5 HP</td>
              <td>65.0 km</td>
              <td>Provides high-altitude target cueing to SAM batteries. Vulnerable to anti-radiation missiles.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Pantsir / Phalanx CIWS</td>
              <td>6 HP</td>
              <td>16.0 km</td>
              <td>Close-in point defense. Intercepts incoming missiles (+40 VP per intercept).</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">EW Jammer Station</td>
              <td>6 HP</td>
              <td>36.0 km</td>
              <td>Projects microwave jamming that degrades hostile radar locks across 36 km.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">8. THEATER LOGISTICS, DEPOTS &amp; COMBAT SCORING FORMULAS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-2);">STRATEGIC GROUND TARGETS &amp; VP VALUES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Command Bunker (24 HP, +800 VP) &bull; SAM Battery (+300 VP) &bull; Radar Array (+250 VP) &bull; EW Jammer (+250 VP) &bull; CIWS (+200 VP) &bull; Fuel Depot (+200 VP) &bull; Mobile Radar (+150 VP). Munitions Centers are hardened indestructible safe zones.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--stat-tier-1);">AERIAL TARGETS &amp; SPEED RUN MULTIPLIER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Combat aircraft kills award 150 VP base + 10x airframe cost (+850 VP ace bounty). Completing missions under 6 minutes awards a fast-clear speed bonus: <code>(360s - elapsed) &times; 2.5 VP</code>. Total score multiplies by difficulty and defense budget ratio.
          </div>
        </div>
      </div>
    `
  }
];