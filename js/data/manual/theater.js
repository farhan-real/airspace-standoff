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
            High-tier squadrons plan flank routes (some high on the edges, some low). When low on missiles or damaged, they plan a safe retreat toward their ground missile batteries.
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
              <th style="color:#ff3366;">EXTREME THREAT<br><span style="font-size:0.52rem;opacity:0.7;">(LEGEND)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Score Multiplier</b></td><td style="color:#94a3b8;font-weight:700;">0.50x</td><td style="color:#38bdf8;font-weight:700;">1.00x</td><td style="color:#38bdf8;font-weight:700;">1.50x</td><td style="color:#f43f5e;font-weight:700;">2.00x</td><td style="color:#f43f5e;font-weight:700;">2.60x</td><td style="color:#f43f5e;font-weight:700;">3.20x</td></tr>
            <tr><td><b>Estimated Squadron Size</b></td><td style="color:#38bdf8;">8 - 10 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(8-10 Sweepers)</span></td><td style="color:#38bdf8;">8 - 10 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace, 5-7 Sweepers, 1-2 Strike, 0-1 SEAD)</span></td><td style="color:#38bdf8;">7 - 9 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace, 4-5 Sweepers, 1-2 Snipers, 1 SEAD)</span></td><td style="color:#fbbf24;">8 - 10 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Aces, 3-4 Sweepers, 2 Snipers, 1 Ambush, 1 SEAD)</span></td><td style="color:#fbbf24;">10 - 12 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Flagship Aces, 4-5 Sweepers, 2 Snipers, 1-2 Ambush, 1 SEAD)</span></td><td style="color:#f43f5e;">11 - 13 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(3 Apex Aces, 4-5 Sweepers, 2 Snipers, 2 Ambush, 1 SEAD)</span></td></tr>
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
            <tr><td><b>Target Priority &amp; Role</b></td><td style="color:#94a3b8;">Attacks anything nearby</td><td style="color:#38bdf8;">Fighters fight, bombers strike</td><td style="color:#fbbf24;">Prioritizes dangerous targets</td><td style="color:#fbbf24;">Protects bombers and strikes</td><td style="color:#fbbf24;">Blinds radar before bombing</td><td style="color:#f43f5e;">Timed radar kills then strikes</td></tr>
            <tr><td><b>Missile Ammo Saving</b></td><td style="color:#94a3b8;">Fires all missiles immediately</td><td style="color:#94a3b8;">Fires long-range missiles quickly</td><td style="color:#38bdf8;">Keeps 1 dogfight missile safe</td><td style="color:#fbbf24;">Saves missiles for good shots</td><td style="color:#fbbf24;">Only uses best missiles on key targets</td><td style="color:#fbbf24;">Saves reserve ammo, retreats if empty</td></tr>
            <tr><td><b>Reaction if Flight Lead Dies</b></td><td style="color:#94a3b8;">Complete panic and scatter</td><td style="color:#94a3b8;">Confused and stalls (5.0s)</td><td style="color:#38bdf8;">Hesitates (4.0s)</td><td style="color:#38bdf8;">Wingman takes charge (3.5s)</td><td style="color:#38bdf8;">Falls back to defense patrol (2.5s)</td><td style="color:#f43f5e;">Switches to defense instantly (1.8s)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. AIRFRAME WEIGHT &amp; STEALTH RULES</div>
      <div class="ge-desc">
        Aerodynamic weight tuning and stealth cleanliness are applied selectively based on airframe design and tactical mission:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Missile Trucks (F-15EX, J-20, MiG-31BM, Su-34):</b> Never restricted to light weight. They intentionally carry heavy external racks (Wr = 70% - 90%) and oversized standoff missiles (R-37M, PL-21, Kinzhal) to maximize missile magazine capacity.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Agile Dogfighters (Rafale, Su-35S, Eurofighter):</b> On higher difficulties, they selectively roll lightweight loadouts (Wr &le; 50%) with fewer heavy bombs, preserving 100% corner-speed turn authority.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Cleanliness:</b> Stealth jets (F-22A, YF-23, Su-57) only enforce pure internal bays when assigned the Ambush role. In other roles, they mount external rails for extra missile firepower.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Natural Fleet Sizing &amp; Rejection Finalization:</b> Fleet size is not governed by hardcoded plane limits. The adversary drafts aircraft sequentially against the sector defense budget, loading elite Aces first. Standard aircraft are then drawn based on role and tier probabilities. The moment an aircraft proposal exceeds the remaining budget, it is rejected and fleet generation instantly finalizes. Fleet sizes emerge naturally from unit costs and role drafting: 8-10 aircraft on Cadet and Veteran (light-to-medium sweepers), 7-9 on Elite (heavier 5th-gen/apex packages with 1 Ace), 8-10 on Ace (2 Aces, snipers and stealth ambushers), 10-12 on Master (2 Flagship Aces, air denial team), and 11-13 on Legend (3 Apex Aces with full saturation strike packages).</li>
        </ul>
      </div>

      <div class="ge-subhead">5. TACTICAL COMBAT ROLES &amp; DIFFICULTY INTELLIGENCE</div>
      <div class="ge-desc">
        Adversary aircraft operate under designated combat roles that scale in tactical intelligence across difficulty settings:
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">STANDOFF SNIPER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Cruises FL380, holds 45 to 75 km range, turns beam if targets approach inside 38 km.<br>
            <b>Ace:</b> Cruises FL420, holds 50 to 80 km, executes 135&deg; retrograde turns inside 45 km to drag out enemy missiles.<br>
            <b>Master:</b> Stratospheric FL460 cruise. Executes a 65&deg; crank off boresight at radar gimbal limits to drag out return fire.<br>
            <b>Legend:</b> Stratospheric FL500 cruise. Executes supersonic drag-away skates and long-range LPI missile volleys.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #c084fc;">
          <b style="color:#c084fc;">SEAD ESCORT (AIR DEFENSE SUPPRESSION)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Actively steers toward surface radars and SAMs, firing AGM-88Gs within 35 km.<br>
            <b>Ace:</b> Approaches at FL320. Prioritizes S-400 batteries and Early Warning Radars over secondary ground units.<br>
            <b>Master:</b> Approaches at FL340. Projects GaN AESA jamming while geolocating and neutralizing surface radar arrays.<br>
            <b>Legend:</b> Surgical IADS breakdown. Destroys Early Warning Radars first to blind S-400 batteries without radiating.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f97316;">
          <b style="color:#f97316;">STRIKE INTERDICTION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Approaches at FL140 directly toward command bunkers and fuel depots.<br>
            <b>Ace:</b> Flies at FL110 beneath radar horizons with pop-up delivery at 25 km to release glide bombs.<br>
            <b>Master:</b> Flies FL080 along low-threat alleys, delivering standoff Kinzhal or JASSM-ER strikes on command bunkers.<br>
            <b>Legend:</b> Deck-skimming attack run at FL055, delivering synchronized hypersonic strikes beneath sensor coverage.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #14b8a6;">
          <b style="color:#2dd4bf;">STEALTH AMBUSH</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Flies outer boundaries at FL320 to acquire broadside locks with internal stealth missiles.<br>
            <b>Ace:</b> Flies FL360 along northern or southern sector edges, exploiting player beam RCS spikes at 40 km.<br>
            <b>Master:</b> Boundary flight path at FL400 with zero pylon drag to launch surprise broadside BVR volleys.<br>
            <b>Legend:</b> Crossfire stealth bracket. Deep outer flank approach at FL420, attacking player beam aspects from behind the frontline with clean bays.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">AIR DOMINANCE SWEEP</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Controls airspeed to maintain optimal corner speed (sOpt) during combat turns.<br>
            <b>Ace:</b> High-Low bracket formation. Screens friendly snipers and bombers while engaging player fighters.<br>
            <b>Master:</b> Tactical drag maneuvers. Leads defenders into tight circles to bleed energy while wingmen attack.<br>
            <b>Legend:</b> 3D air combat wing. Executes post-stall Cobras, mixed-seeker salvos, and high-AOA snapshot bursts.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">COMMAND FLAGSHIP (ACE CADRE)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Elite:</b> Single Ace with advanced prototype airframe and 2.4s reaction latency.<br>
            <b>Ace:</b> Two coordinated Aces with 1.8s reactions, high-altitude perch, and post-stall Kulbit capability.<br>
            <b>Master:</b> Two Flagship Aces with 1.4s reactions, railguns/lasers, zero G-LOC (COFFIN), and 65% notch rate.<br>
            <b>Legend:</b> Three Apex Aces with 1.1s reactions, coordinating theater-wide strikes with directed-energy and hypersonic weapons.
          </div>
        </div>
      </div>

      <div class="ge-subhead">6. WEAPON RANGE CLASSES &amp; ORDNANCE PROFILES</div>
      <div class="ge-desc">
        All missiles and weapons are unlocked from the start. Rather than loading random stores, the adversary plans aircraft loadouts by pairing complementary range classes to fulfill distinct tactical roles:
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
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Standoff Sniper (ULR + LR):</b> High-altitude missile trucks holding outer range.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Air Dominance Sweep (LR/MR + SR):</b> Balanced forward air superiority fighters.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Ambush (ULR + SR):</b> Clean internal bays firing BVR then rear dogfight kills.<br>
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Strike / SEAD:</b> Centerline bunker busters and jamming escorts.
          </div>
        </div>
      </div>

      <div class="ge-subhead">7. LOADOUT ARCHITECTURE &amp; ROLE PLANNING</div>
      <div class="ge-desc">
        All weapons are available from the start. Rather than loading identical static templates, the enemy plans loadouts via weighted rolls, assigning specialized roles while managing weight and stealth:
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr>
              <th>LOADOUT &amp; WEAPON PARAMETER</th>
              <th style="color:#8494ab;">PERMISSIVE (CADET)</th>
              <th style="color:#38bdf8;">CONTESTED (VETERAN)</th>
              <th style="color:#00f0ff;">HOSTILE (ELITE)</th>
              <th style="color:#ffd700;">HIGH-THREAT (ACE)</th>
              <th style="color:#c084fc;">AIR DENIAL (MASTER)</th>
              <th style="color:#ff3366;">EXTREME THREAT (LEGEND)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Primary Assigned Roles</b></td><td style="color:#94a3b8;">100% Generic Sweep</td><td style="color:#38bdf8;">Sweep + Basic Strike</td><td style="color:#38bdf8;">Sweep, Strike, SEAD</td><td style="color:#fbbf24;">Snipers + Agile Flankers</td><td style="color:#fbbf24;">Integrated Combat Team</td><td style="color:#f43f5e;">Full Top-Tier Package</td></tr>
            <tr><td><b>Ultra-Long Chance (110 - 135 km)</b></td><td style="color:#94a3b8;">0% (No ULR snipes)</td><td style="color:#94a3b8;">5% (Rare roll)</td><td style="color:#38bdf8;">15% (Lead only)</td><td style="color:#f43f5e;">35% (Sniper elements)</td><td style="color:#f43f5e;">50% (High priority)</td><td style="color:#f43f5e;">65% (Extreme standoff)</td></tr>
            <tr><td><b>Ramjet BVR Chance (78 - 95 km)</b></td><td style="color:#94a3b8;">15%</td><td style="color:#38bdf8;">30% (Standard)</td><td style="color:#fbbf24;">50% (Meteor/PL-15E)</td><td style="color:#fbbf24;">45%</td><td style="color:#38bdf8;">40%</td><td style="color:#fbbf24;">30%</td></tr>
            <tr><td><b>Medium BVR Chance (60 - 75 km)</b></td><td style="color:#94a3b8;">85% (Main AMRAAM)</td><td style="color:#38bdf8;">65%</td><td style="color:#38bdf8;">35%</td><td style="color:#38bdf8;">20%</td><td style="color:#38bdf8;">10%</td><td style="color:#94a3b8;">5%</td></tr>
            <tr><td><b>Dogfight WVR Seeker Selection</b></td><td style="color:#94a3b8;">100% Basic HOBS</td><td style="color:#38bdf8;">85% Standard / 15% Rear</td><td style="color:#38bdf8;">60% Standard / 40% Rear</td><td style="color:#fbbf24;">40% Python-5 / IRIS-T</td><td style="color:#fbbf24;">75% Python-5 / IRIS-T</td><td style="color:#fbbf24;">85% Rear-Shot &amp; Filter</td></tr>
            <tr><td><b>Heavy Centerline Station</b></td><td style="color:#94a3b8;">0% (Clean station)</td><td style="color:#94a3b8;">0% (Clean station)</td><td style="color:#38bdf8;">20% Standoff rail</td><td style="color:#fbbf24;">40% Heavy ordnance</td><td style="color:#f43f5e;">65% Kinzhal / MPBM</td><td style="color:#f43f5e;">65% Kinzhal / MPBM</td></tr>
            <tr><td><b>Dogfighter Weight Limit (Wr &le; 50%)</b></td><td style="color:#94a3b8;">0% (Overloads racks)</td><td style="color:#94a3b8;">0% (Standard racks)</td><td style="color:#38bdf8;">30% Agile tuning</td><td style="color:#fbbf24;">50% Agile tuning</td><td style="color:#fbbf24;">60% Agile tuning</td><td style="color:#fbbf24;">65% Agile tuning</td></tr>
            <tr><td><b>Heavy Truck Loadout (F-15EX, J-20)</b></td><td style="color:#38bdf8;">Full 70% - 90% load</td><td style="color:#38bdf8;">Full 70% - 90% load</td><td style="color:#38bdf8;">Full 70% - 90% load</td><td style="color:#38bdf8;">Full 70% - 90% load</td><td style="color:#38bdf8;">Full 70% - 90% load</td><td style="color:#38bdf8;">Full 70% - 90% load</td></tr>
            <tr><td><b>Stealth Clean Bay Policy</b></td><td style="color:#94a3b8;">0% (External drag)</td><td style="color:#94a3b8;">0% (External drag)</td><td style="color:#38bdf8;">35% Clean VLO bays</td><td style="color:#38bdf8;">45% Clean VLO bays</td><td style="color:#fbbf24;">55% Clean VLO bays</td><td style="color:#fbbf24;">60% Clean VLO bays</td></tr>
            <tr><td><b>Guns &amp; Directed-Energy</b></td><td style="color:#94a3b8;">Standard cannon</td><td style="color:#38bdf8;">Standard cannon</td><td style="color:#38bdf8;">Standard cannon</td><td style="color:#38bdf8;">Tuned burst discipline</td><td style="color:#f43f5e;">Laser / Pod upgrades</td><td style="color:#f43f5e;">DE-PULSE / Railgun / Lasers</td></tr>
            <tr><td><b>Upgrade Sockets Filled</b></td><td style="color:#94a3b8;">0 - 1 Socket</td><td style="color:#38bdf8;">1 - 2 Sockets</td><td style="color:#fbbf24;">2 - 3 Sockets</td><td style="color:#fbbf24;">3 Sockets</td><td style="color:#fbbf24;">3 - 4 Sockets</td><td style="color:#f43f5e;">4 Full Sockets</td></tr>
            <tr><td><b>Procurement &amp; Finalization</b></td><td style="color:#94a3b8;">Aces first; reject &amp; finalize if >190M</td><td style="color:#38bdf8;">1 Ace first; reject &amp; finalize if >330M</td><td style="color:#38bdf8;">1 Ace first; reject &amp; finalize if >450M</td><td style="color:#fbbf24;">2 Aces first; reject &amp; finalize if >570M</td><td style="color:#fbbf24;">2 Aces first; reject &amp; finalize if >700M</td><td style="color:#f43f5e;">3 Aces first; reject &amp; finalize if >820M</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">8. ADVERSARY FLIGHT LEAD (ACE) SPECIFICATIONS</div>
      <div class="ge-desc">
        Designated Aces operate as elite formation leaders. Regardless of difficulty tier, Aces are guaranteed a triple-tier armament package (ULR + Adv LR + SR) and significantly outperform their wingmen:
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr>
              <th>ACE CAPABILITY &amp; TACTIC</th>
              <th style="color:#38bdf8;">CONTESTED (VETERAN)</th>
              <th style="color:#00f0ff;">HOSTILE (ELITE)</th>
              <th style="color:#ffd700;">HIGH-THREAT (ACE)</th>
              <th style="color:#c084fc;">AIR DENIAL (MASTER)</th>
              <th style="color:#ff3366;">EXTREME THREAT (LEGEND)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Ace Count in Squadron</b></td><td style="color:#38bdf8;">1 Ace Flight Lead</td><td style="color:#38bdf8;">1 Ace Flight Lead</td><td style="color:#fbbf24;">2 Coordinated Aces</td><td style="color:#fbbf24;">2 Coordinated Aces</td><td style="color:#f43f5e;">3 Top Aces</td></tr>
            <tr><td><b>Typical Airframe Class</b></td><td style="color:#38bdf8;">4.5-Gen (Su-35, Typhoon)</td><td style="color:#38bdf8;">5th-Gen Stealth (Su-57, F-22)</td><td style="color:#fbbf24;">Top Stealth / Prototype</td><td style="color:#fbbf24;">Experimental Flagship</td><td style="color:#f43f5e;">Superfighter (ADF-11F, CFA-44)</td></tr>
            <tr><td><b>Upgrade Sockets Filled</b></td><td style="color:#38bdf8;">3 Sockets Minimum</td><td style="color:#38bdf8;">3 Sockets Minimum</td><td style="color:#38bdf8;">3 Sockets Minimum</td><td style="color:#fbbf24;">4 Sockets Minimum</td><td style="color:#f43f5e;">4 Full Sockets</td></tr>
            <tr><td><b>Cannon System</b></td><td style="color:#38bdf8;">Standard Ballistic</td><td style="color:#38bdf8;">Standard Ballistic</td><td style="color:#38bdf8;">Tuned Ballistic</td><td style="color:#f43f5e;">DE-PULSE / EML Railgun</td><td style="color:#f43f5e;">DE-PULSE / EML Railgun</td></tr>
            <tr><td><b>Reaction Delay</b></td><td style="color:#38bdf8;">3.2s (Fast)</td><td style="color:#38bdf8;">2.4s (Sharp)</td><td style="color:#fbbf24;">1.8s (Quick snap)</td><td style="color:#fbbf24;">1.4s (Instant)</td><td style="color:#f43f5e;">1.1s (Fastest snap)</td></tr>
            <tr><td><b>Radar Notch Defense (Beam 90&deg;)</b></td><td style="color:#38bdf8;">30% (Turns beam)</td><td style="color:#38bdf8;">45% (Turns beam)</td><td style="color:#fbbf24;">55% (Disciplined)</td><td style="color:#fbbf24;">65% (40% in close merge)</td><td style="color:#f43f5e;">70% (45% in close merge)</td></tr>
            <tr><td><b>Decoy Drone Rejection Rate</b></td><td style="color:#38bdf8;">40% Filter rate</td><td style="color:#38bdf8;">55% Filter rate</td><td style="color:#fbbf24;">65% Filter rate</td><td style="color:#fbbf24;">75% Filter rate</td><td style="color:#80% Filter rate</td></tr>
            <tr><td><b>Dual-Missile Synergy Chance</b></td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#38bdf8;">15% Radar + Heat</td><td style="color:#fbbf24;">25% Radar + Heat</td><td style="color:#fbbf24;">40% Radar + Heat</td><td style="color:#50% Radar + Heat</td></tr>
            <tr><td><b>Altitude Staging</b></td><td style="color:#38bdf8;">Climbs to FL320</td><td style="color:#38bdf8;">Climbs to FL360</td><td style="color:#fbbf24;">FL380 High perch</td><td style="color:#fbbf24;">FL400+ Supercruise</td><td style="color:#f43f5e;">High-low 3D split</td></tr>
            <tr><td><b>Corner Speed Control (sOpt)</b></td><td style="color:#38bdf8;">Active throttle control</td><td style="color:#38bdf8;">Active throttle control</td><td style="color:#fbbf24;">Strict turn throttle cut</td><td style="color:#fbbf24;">Strict energy traps</td><td style="color:#f43f5e;">Expert 3D energy mastery</td></tr>
            <tr><td><b>Retreat Route (Winchester)</b></td><td style="color:#38bdf8;">Direct to home base</td><td style="color:#38bdf8;">Direct to home base</td><td style="color:#fbbf24;">Covered retreat to SAMs</td><td style="color:#fbbf24;">Covered retreat to SAMs</td><td style="color:#fbbf24;">Covered retreat to SAMs</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">9. INTEGRATED AIR DEFENSE SYSTEMS (IADS)</div>
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

      <div class="ge-subhead">10. THEATER LOGISTICS, DEPOTS &amp; COMBAT SCORING FORMULAS</div>
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