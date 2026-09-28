/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Threat tiers, adversary flight lead cadre, IADS & scoring formulas.
 */

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY TACTICAL DOCTRINE, THREAT TIERS & PLANNING',
    desc: `
      <div class="ge-subhead">THE 6 COMBAT DIFFICULTY TIERS</div>
      <div class="ge-desc">
        Adversary forces scale across pilot discipline, tactical decision-making, and package coordination rather than mathematical cheating. Below is the operational comparison matrix across all theater engagement tiers:
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
            <tr><td><b>Squadron Size</b></td><td style="color:#38bdf8;">3 - 4 Aircraft</td><td style="color:#38bdf8;">4 - 5 Aircraft</td><td style="color:#38bdf8;">5 - 6 Aircraft</td><td style="color:#fbbf24;">6 - 7 Aircraft</td><td style="color:#fbbf24;">7 Aircraft</td><td style="color:#f43f5e;">8 Aircraft</td></tr>
            <tr><td><b>Defense Budget Cap</b></td><td style="color:#94a3b8;">150.0M CR</td><td style="color:#38bdf8;">260.0M CR</td><td style="color:#fbbf24;">360.0M CR</td><td style="color:#fbbf24;">460.0M CR</td><td style="color:#fbbf24;">560.0M CR</td><td style="color:#f43f5e;">660.0M CR</td></tr>
            <tr><td><b>Reaction Delay</b></td><td style="color:#94a3b8;">6.5s - 7.5s (Sluggish)</td><td style="color:#38bdf8;">4.5s - 5.5s (Human)</td><td style="color:#fbbf24;">3.4s - 4.0s (Trained)</td><td style="color:#fbbf24;">2.6s - 3.0s (Sharp)</td><td style="color:#fbbf24;">2.0s - 2.4s (Fast)</td><td style="color:#f43f5e;">1.6s - 1.9s (Instant)</td></tr>
            <tr><td><b>Target Focus Slots</b></td><td style="color:#38bdf8;">1 Target at a time</td><td style="color:#38bdf8;">1 Target at a time</td><td style="color:#fbbf24;">2 Targets tracked</td><td style="color:#fbbf24;">2 Targets tracked</td><td style="color:#fbbf24;">2 - 3 Targets tracked</td><td style="color:#f43f5e;">3 Targets tracked</td></tr>
            <tr><td><b>Decoy Drone Defense</b></td><td style="color:#94a3b8;">0% (Chases all decoys)</td><td style="color:#94a3b8;">15% spot rate</td><td style="color:#38bdf8;">30% spot rate</td><td style="color:#38bdf8;">45% spot rate</td><td style="color:#38bdf8;">55% spot rate</td><td style="color:#fbbf24;">65% spot rate</td></tr>
            <tr><td><b>Radar Notch (Beam 90&deg;)</b></td><td style="color:#94a3b8;">0% (Never turns beam)</td><td style="color:#94a3b8;">5% (Rare turn)</td><td style="color:#38bdf8;">15% (Basic turn)</td><td style="color:#38bdf8;">25% (Turns beam)</td><td style="color:#38bdf8;">40% (Turns beam)</td><td style="color:#fbbf24;">55% (Disciplined turn)</td></tr>
            <tr><td><b>Firing Distance</b></td><td style="color:#94a3b8;">Fires at max distance (Easy to dodge)</td><td style="color:#fbbf24;">55% - 85% Max distance</td><td style="color:#fbbf24;">Best hit range (40% - 75%)</td><td style="color:#f43f5e;">Deadly hit range (35% - 70%)</td><td style="color:#f43f5e;">Top missile speed and accuracy</td><td style="color:#f43f5e;">Lethal high-speed missile traps</td></tr>
            <tr><td><b>Missiles per Attack</b></td><td style="color:#38bdf8;">1 Missile only</td><td style="color:#38bdf8;">1 Missile only</td><td style="color:#38bdf8;">1 - 2 Missiles</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#f43f5e;">2 - 3 Missile volley</td></tr>
            <tr><td><b>Mixed Missiles (Radar + Heat)</b></td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#94a3b8;">0% (Single type)</td><td style="color:#38bdf8;">10% Mixed pair</td><td style="color:#fbbf24;">25% Mixed pair</td><td style="color:#fbbf24;">35% Mixed pair</td></tr>
            <tr><td><b>Speed &amp; Turn Control</b></td><td style="color:#94a3b8;">Burns afterburner; turns flat</td><td style="color:#38bdf8;">Normal cruising speed</td><td style="color:#38bdf8;">Uses best turn speed</td><td style="color:#fbbf24;">Good turn speed (slips under stress)</td><td style="color:#fbbf24;">Smooth throttle control in turns</td><td style="color:#fbbf24;">Expert speed and energy management</td></tr>
            <tr><td><b>3D Altitude Fighting</b></td><td style="color:#94a3b8;">Rarely changes altitude</td><td style="color:#94a3b8;">Occasional climbs</td><td style="color:#38bdf8;">Climbs when needed</td><td style="color:#fbbf24;">Climbs to high perch</td><td style="color:#fbbf24;">High and low spread</td><td style="color:#f43f5e;">Aggressive climbs and dives</td></tr>
            <tr><td><b>Formation Teamwork</b></td><td style="color:#94a3b8;">Scattered and solo</td><td style="color:#38bdf8;">Loose trail follow</td><td style="color:#fbbf24;">2-Plane pairs</td><td style="color:#fbbf24;">Pairs protecting each other</td><td style="color:#fbbf24;">High and low spread</td><td style="color:#fbbf24;">Two-sided attack</td></tr>
            <tr><td><b>Attack Approach Route</b></td><td style="color:#94a3b8;">Straight charge down center</td><td style="color:#94a3b8;">Straight flight path</td><td style="color:#fbbf24;">High altitude sweep</td><td style="color:#38bdf8;">Holds on outer edge</td><td style="color:#fbbf24;">Flank attack from side</td><td style="color:#fbbf24;">Attacks from multiple angles</td></tr>
            <tr><td><b>Target Priority &amp; Role</b></td><td style="color:#94a3b8;">Attacks anything nearby</td><td style="color:#38bdf8;">Fighters fight, bombers strike</td><td style="color:#fbbf24;">Prioritizes dangerous targets</td><td style="color:#fbbf24;">Protects bombers and strikes</td><td style="color:#fbbf24;">Blinds radar before bombing</td><td style="color:#f43f5e;">Timed radar kills then strikes</td></tr>
            <tr><td><b>Missile Ammo Saving</b></td><td style="color:#94a3b8;">Fires all missiles immediately</td><td style="color:#94a3b8;">Fires long-range missiles quickly</td><td style="color:#38bdf8;">Keeps 1 dogfight missile safe</td><td style="color:#fbbf24;">Saves missiles for good shots</td><td style="color:#fbbf24;">Only uses best missiles on key targets</td><td style="color:#fbbf24;">Saves reserve ammo, retreats if empty</td></tr>
            <tr><td><b>Reaction if Flight Lead Dies</b></td><td style="color:#94a3b8;">Complete panic and scatter</td><td style="color:#94a3b8;">Confused and stalls (5.0s)</td><td style="color:#38bdf8;">Hesitates (4.0s)</td><td style="color:#38bdf8;">Wingman takes charge (3.5s)</td><td style="color:#38bdf8;">Falls back to defense patrol (2.5s)</td><td style="color:#f43f5e;">Switches to defense instantly (1.8s)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">FORCE COMPOSITION &amp; BUDGET ALLOCATION</div>
      <div class="ge-desc">
        To prevent screen clutter and unplayable missile swarms in advanced sectors, difficulty scales by aircraft sophistication rather than raw numbers:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Permissive Sector &amp; Contested Airspace (3 - 5 Aircraft):</b> Field budget-friendly 4th-generation fighters (F-16V, Mirage 2000, MiG-29K, Tejas) with standard missile loads and few system upgrades.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Hostile Airspace &amp; High-Threat Sector (5 - 7 Aircraft):</b> Field 4.5-gen and 5th-gen fighters (Su-35S, Eurofighter, Rafale, F-15EX, Su-57, J-20) equipped with long-range radar missiles, advanced sensors, and designated flight leads.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Air Denial Zone &amp; Extreme Threat Sector (7 - 8 Aircraft):</b> Rather than deploying 12+ weak planes, the enemy spends their large 560M - 660M budget by equipping 7 to 8 top-tier stealth superfighters (ADF-11F, CFA-44, X-02S, Su-57, F-22A, Darkstar) with maximum missile racks and full system upgrades.</li>
        </ul>
      </div>

      <div class="ge-subhead">THE 6 BEHAVIORAL DIMENSIONS</div>
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

      <div class="ge-subhead">EXPLOITING ENEMY WEAKNESSES</div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.55;color:#cbd5e1;">
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exploit Approach Routes:</b> High-difficulty flights sweep around the outer edges. Fly stealth jets along the sides to hit them while their radars face inward.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Shoot Down the Flight Lead First:</b> Eliminating the leader throws the wingmen into confusion for several seconds, leaving them wide open.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Use Decoy Drones (MALD):</b> Even the best enemy aces have a 35% mistake rate against decoys. Launch decoys ahead of your squad to soak up their first missile volley.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Drain Their Speed (Energy Trap):</b> Enemy pilots try to keep optimal turn speed, but if you make them dodge multiple missiles in a row, they will bleed off all their speed and become easy targets.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'ch9_logistics_scoring',
    title: 'SECTION 09: THEATER IADS, DEPOTS & SCORING',
    desc: `
      <div class="ge-desc">
        The theater features an Integrated Air Defense System (IADS), logistics hubs, and scoring formulas.
      </div>

      <div class="ge-subhead">1. INTEGRATED AIR DEFENSE SYSTEMS (IADS)</div>
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
              <td>Projects microwave jamming that degrades hostile radar locks.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];