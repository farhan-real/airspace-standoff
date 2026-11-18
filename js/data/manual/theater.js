/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Threat tiers, separated Air Combat Doctrines, tactical roles, IADS & scoring formulas.
 */

if (!window.MANUAL_THEATER_TABLES) {
  throw new Error('MANUAL_THEATER_TABLES must be loaded prior to theater.js.');
}

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY COMBAT DOCTRINE, DIFFICULTY TIERS & PLANNING',
    desc: `
      <div class="ge-subhead">1. AIR COMBAT FLEET DOCTRINES (SQUADRON-WIDE STRATEGY)</div>
      <div class="ge-desc">
        Distinct from individual aircraft roles, your selected <b>Air Combat Doctrine</b> shapes the entire enemy squadron's aircraft drafting, weapon choices, positioning, firing discipline, and evasive habits:
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>AIR DOCTRINE</th><th>FLEET COMPOSITION</th><th>BATTLEFIELD BEHAVIOR</th></tr>
          </thead>
          <tbody>
            <tr><td><b style="color:#38bdf8;">Balanced</b></td><td>Standard difficulty mix</td><td>Normal BVR spacing, standard energy control, and balanced defensive pacing.</td></tr>
            <tr><td><b style="color:#f43f5e;">Aggressive Rush</b></td><td>Fast interceptors &amp; agile fighters</td><td>Pushes straight ahead on high throttle, fires early, and forces close-range dogfights.</td></tr>
            <tr><td><b style="color:#00f0ff;">Long-Range Standoff</b></td><td>BVR missile carriers &amp; ramjets</td><td>Climbs high (+6,000 ft), fires long-range missiles early, and cranks or drags away from merges.</td></tr>
            <tr><td><b style="color:#a855f7;">Stealth Ambush</b></td><td>Stealth airframes with internal bays</td><td>Flanks along north and south edges at low throttle and holds fire for high-Pk broadside shots.</td></tr>
            <tr><td><b style="color:#fbbf24;">Drone Swarm</b></td><td>Massed unmanned UCAVs &amp; MALD decoys</td><td>Sends wide drone waves ahead of manned leads to soak missiles and saturate radar locks.</td></tr>
            <tr><td><b style="color:#c084fc;">Electronic Jamming</b></td><td>Multiple EW escorts &amp; AESA fighters</td><td>Holds jammers in a central umbrella behind forward fighters while focusing fire on enemy sensors.</td></tr>
            <tr><td><b style="color:#00f5a0;">Defensive Hold</b></td><td>Durable multirole &amp; long-range fighters</td><td>Patrols inside friendly base cover, saves missiles for high-odds shots, and RTBs early to rearm.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. THE 6 BEHAVIORAL DIMENSIONS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">1. TARGET FOCUS &amp; DECOY IDENTIFICATION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Permissive Sector and Buffer Zone pilots chase any radar blip. In High-Threat, Fortified Airspace, and Air Denial sectors, pilots check if a target is shooting back or flying too simply, but <b>still fall for decoy drones (MALD) 35% to 55% of the time</b> under combat stress.
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
            Turning 90 degrees to break a radar lock (Doppler notching) is never automatic: Extreme Threat Sector pilots notch on ~55% of long-range shots, and at close range (under 15 km) that drops below 30% because quick turns are much harder.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#c084fc;">5. WINGMAN TEAMWORK &amp; ELEMENT PAIRS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Escalated Airspace, Hostile Airspace, and above fly in 2-plane pairs (Lead + Wingman). Wingmen trail by 4 to 8 km to cross-fire. If you shoot down the flight lead, the surviving wingman pauses in confusion for 3.5 to 5.5 seconds before taking over.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f0ff;">6. APPROACH ROUTES &amp; MISSION PLANNING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            High-tier squadrons plan flank routes (some high on the edges, some low). When low on missiles or damaged, they plan a covered retreat toward their fortified base line (and active SAM/CIWS batteries if operational).
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. EXPLOITING ENEMY WEAKNESSES</div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.55;color:#cbd5e1;">
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exploit Approach Routes:</b> High-difficulty and Stealth Ambush flights sweep around outer edges. Fly stealth jets along the sides to hit them while their radars face inward.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Shoot Down the Flight Lead First:</b> Eliminating the leader throws the wingmen into confusion for several seconds, leaving them wide open.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Use Decoy Drones (MALD):</b> Even the best enemy aces have a 35% mistake rate against decoys. Launch decoys ahead of your squad to soak up their first missile volley.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Drain Their Speed (Energy Trap):</b> Enemy pilots try to keep optimal turn speed, but if you make them dodge multiple missiles in a row, they will bleed off all their speed and become easy targets.</li>
        </ul>
      </div>

      <div class="ge-subhead">4. THE 10 COMBAT DIFFICULTY TIERS</div>
      <div class="ge-desc">
        Adversary forces scale across pilot discipline, tactical decision-making, and package coordination rather than mathematical cheating. Below is the operational comparison across all theater difficulty tiers:
      </div>
      ${window.MANUAL_THEATER_TABLES.difficultyComparisonTable}

      <div class="ge-subhead">5. AIRFRAME WEIGHT &amp; STEALTH RULES</div>
      <div class="ge-desc">
        Aerodynamic weight tuning and stealth cleanliness are applied selectively based on airframe design and combat mission:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Missile Carriers (F-15EX, J-20, MiG-31BM, Su-34):</b> Never restricted to light weight. They carry heavy external racks (Wr = 70% - 90%) and oversized standoff missiles (R-37M, PL-21, Kinzhal) to maximize missile magazine capacity.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Agile Dogfighters (Rafale, Su-35S, Eurofighter, Mirage-2000, F-16V):</b> On higher difficulties, they selectively roll lightweight loadouts (Wr &le; 50%), preserving 100% corner-speed turn authority.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Cleanliness:</b> Stealth jets (F-22A, YF-23, Su-57, J-20, Su-75) enforce pure internal bays when assigned the Ambush role or Stealth Ambush doctrine.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Natural Fleet Sizing &amp; Rejection Finalization:</b> Fleet size emerges naturally from unit costs and role drafting: 3-5 aircraft on Permissive Sector up to 9-12 aircraft on Extreme Threat Sector.</li>
        </ul>
      </div>

      <div class="ge-subhead">6. TACTICAL COMBAT ROLES &amp; DIFFICULTY INTELLIGENCE</div>
      <div class="ge-desc">
        Adversary aircraft operate under ten distinct combat roles within the chosen Air Combat Doctrine:
      </div>
      ${window.MANUAL_THEATER_TABLES.tacticalRolesGrid}

      <div class="ge-subhead">7. WEAPON RANGE CLASSES &amp; ORDNANCE PROFILES</div>
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
            <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Strike and SEAD:</b> Centerline bunker penetrators + Jamming pods.
          </div>
        </div>
      </div>

      <div class="ge-subhead">8. THEATER LOGISTICS, DEPOTS &amp; COMBAT SCORING FORMULAS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-2);">STRATEGIC GROUND TARGETS &amp; VP VALUES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Command Bunker (18 HP, +800 VP) &bull; SAM Battery (+220 to +400 VP) &bull; Radar Array (+250 to +320 VP) &bull; EW Jammer (+250 to +280 VP) &bull; CIWS (+220 VP) &bull; Fuel Depot (+200 VP) &bull; Mobile Radar (+150 VP). Munitions Centers are hardened indestructible safe zones.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--stat-tier-1);">AERIAL TARGETS &amp; SPEED RUN MULTIPLIER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Combat aircraft kills award 150 VP base + 10x airframe cost (+850 VP ace bounty). Completing missions under 6 minutes (9 minutes in Attack) awards a fast-clear speed bonus: <code>(par - elapsed) &times; 2.5 VP</code>. Total score multiplies by difficulty and defense budget ratio.
          </div>
        </div>
      </div>
    `
  }
];
