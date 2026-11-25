/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 10
 * Covers: Adversary Cadre, 6 Behavioral Dimensions, Difficulty Tiers, Tactical Roles & Scoring
 */

if (!window.MANUAL_THEATER_TABLES) {
  throw new Error('MANUAL_THEATER_TABLES must be loaded prior to theater.js.');
}

window.MANUAL_THEATER = [
  {
    id: 'ch10_aces_difficulties',
    title: 'SECTION 10: ADVERSARY CADRE, AIR DIFFICULTY TIERS & PLANNING',
    desc: `
      <div class="ge-desc">
        See <b>Section 09</b> for full breakdowns of all 7 Air Combat Doctrines and 7 Ground Attack Doctrines. Below are the 6 pilot behavioral dimensions, difficulty scaling across all 10 Air Combat tiers, and individual tactical roles.
      </div>

      <div class="ge-subhead">1. THE 6 BEHAVIORAL DIMENSIONS</div>
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
          <b style="color:#f43f5e;">4. EVASIVE MANEUVERS, NOTCHING &amp; CHAFF</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Every difficulty actively defends with committed maneuvers (Barrel Rolls, Break Turns, Chaff Salvos, plus Split-S Dives &amp; Zoom Climbs at Veteran+, TVC Cobras at Elite+, and IR Idle cooling). Reaction range scales from 11.5 km (58% chance, 12% notch) on Permissive Sector up to 30 km (98% chance, 68% notch, 3.2s cooldown) on Extreme Threat Sector, dropping at close range (&lt;14 km).
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

      <div class="ge-card" style="border-left:3px solid #00f5a0;margin-top:8px;">
        <b style="color:#00f5a0;">CONTINUOUS DIFFICULTY-SCALED STAT, WEIGHT &amp; LOADOUT AI</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          Adversary pilots evaluate their own <b>live airframe stats</b> (agility, sprint speed, G-limit, HP/armor, radar reach, look-down filter, RCS &amp; beam spike, thermal plume, TVC/COFFIN, IRST, TFR), <b>live payload weight (Wr)</b>, <b>pilot stress &amp; energy</b>, and <b>remaining weapons</b> along a smooth, fully continuous precision curve (<b>8% on Permissive Sector up to 100% on Extreme Threat Sector</b>) without artificial yes/no cutoff gates:<br>
          &bull; <b>Low Difficulties (Permissive / Buffer &bull; 8% - 16% Precision):</b> Coarse, minimal repertoire &mdash; basic direct pursuit, broad barrel rolls or break turns, and simple weapon range firing without weight adjustments, corner-speed tuning, or thermal cooling.<br>
          &bull; <b>Mid Difficulties (Contested &rarr; Forward &bull; 28% - 68% Precision):</b> Smoothly scales live weight standoff (heavier jets stand off farther, then push closer as missiles are spent), activates TFR ground-hugging, interpolates corner-speed throttle, blends 4th-root RCS stealth flanking, and adjusts altitude to hunt deck-skimming targets.<br>
          &bull; <b>High Difficulties (High-Threat &rarr; Extreme Threat &bull; 78% - 100% Precision):</b> Full multi-variable optimization &mdash; an agile 3D TVC <i>Su-35S</i> pushes corner merges and weights Cobras heavily while cooling its 1.25x plume against IR missiles; a light <i>JAS-39E Gripen</i> flanks with low RCS; stiff <i>MiG-31BM</i> interceptors maintain high-Mach standoff and drag away before turn fights; stealth jets protect high beam-spike angles; and Ramjet / silent IR BVR shooters time their cranks dynamically.
        </div>
      </div>

      <div class="ge-subhead">2. EXPLOITING ENEMY WEAKNESSES</div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.55;color:#cbd5e1;">
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exploit Approach Routes:</b> High-difficulty and Stealth Ambush flights sweep around outer edges. Fly stealth jets along the sides to hit them while their radars face inward.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Shoot Down the Flight Lead First:</b> Eliminating the leader throws the wingmen into confusion for several seconds, leaving them wide open.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Use Decoy Drones (MALD):</b> Even the best enemy aces have a 35% mistake rate against decoys. Launch decoys ahead of your squad to soak up their first missile volley.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Drain Their Speed (Energy Trap):</b> Enemy pilots try to keep optimal turn speed, but if you make them dodge multiple missiles in a row, they will bleed off all their speed and become easy targets.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. THE 10 COMBAT DIFFICULTY TIERS</div>
      <div class="ge-desc">
        Adversary forces scale across pilot discipline, tactical decision-making, and package coordination rather than mathematical cheating. Below is the operational comparison across all theater difficulty tiers:
      </div>
      ${window.MANUAL_THEATER_TABLES.difficultyComparisonTable}

      <div class="ge-subhead">4. AIRFRAME WEIGHT &amp; STEALTH RULES</div>
      <div class="ge-desc">
        Aerodynamic weight tuning and stealth cleanliness are applied selectively based on airframe design and combat mission:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Heavy Missile Carriers (F-15EX, J-20, MiG-31BM, Su-34):</b> Never restricted to light weight. They carry heavy external racks (Wr = 70% - 90%) and oversized standoff missiles (R-37M, PL-21, Kinzhal) to maximize missile magazine capacity.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Agile Dogfighters (Rafale, Su-35S, Eurofighter, Mirage-2000, F-16V):</b> On higher difficulties, they selectively roll lightweight loadouts (Wr &le; 50%), preserving 100% corner-speed turn authority.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Stealth Cleanliness:</b> Stealth jets (F-22A, YF-23, Su-57, J-20, Su-75) enforce pure internal bays when assigned the Ambush role or Stealth Ambush doctrine.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Natural Fleet Sizing &amp; Rejection Finalization:</b> Fleet size emerges naturally from unit costs and role drafting: 3-5 aircraft on Permissive Sector up to 9-12 aircraft on Extreme Threat Sector.</li>
        </ul>
      </div>

      <div class="ge-subhead">5. TACTICAL COMBAT ROLES &amp; DIFFICULTY INTELLIGENCE</div>
      <div class="ge-desc">
        Adversary aircraft operate under ten distinct combat roles within the chosen Air Combat Doctrine:
      </div>
      ${window.MANUAL_THEATER_TABLES.tacticalRolesGrid}

      <div class="ge-subhead">6. WEAPON RANGE CLASSES &amp; ORDNANCE PROFILES</div>
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

      <div class="ge-subhead">7. THEATER LOGISTICS, DEPOTS &amp; COMBAT SCORING FORMULAS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:var(--stat-tier-2);">STRATEGIC GROUND TARGETS &amp; VP VALUES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Command Bunker (18 HP, +800 VP) &bull; SAM Battery (+220 to +400 VP) &bull; Radar Array (+250 to +420 VP) &bull; EW Jammer (+250 to +280 VP) &bull; CIWS (+220 VP) &bull; Fuel Depot (+200 VP) &bull; Logistics Hub (+260 VP) &bull; Mobile Radar (+150 VP). Munitions Centers are hardened indestructible safe zones.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:var(--stat-tier-1);">AERIAL TARGETS &amp; SPEED RUN MULTIPLIER</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Combat aircraft kills award 150 VP base + 10x airframe cost (+850 VP ace bounty). Completing missions under 6 minutes (9 minutes in Attack) awards a fast-clear speed bonus: <code>(par - elapsed) &times; 2.5 VP</code>. Total score multiplies by difficulty and defense budget ratio.
          </div>
        </div>
      </div>

      <div class="ge-subhead">8. AI FIRE DISCIPLINE, OVERKILL PREVENTION &amp; PER-AIRCRAFT AGGRESSION</div>
      <div class="ge-desc">
        Enemy squadrons and named Aces regulate missile expenditure across the entire engagement so they sustain lethal BVR and WVR pressure into the middle and end of every battle instead of dumping all ordnance in the opening exchange. Discipline scales directly with both <b>Difficulty Tier</b> and active <b>Air Combat Doctrine</b>.
      </div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PACING, SATURATION CAPS &amp; RESERVE CONSERVATION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            &bull; <b>Per-Aircraft Shot Cooldown:</b> Each fighter enforces a minimum delay between launches (2.8s at Permissive Sector up to 5.6s at Extreme Threat Sector, scaled by Doctrine) so inbound missiles force reactions before follow-up shots.<br>
            &bull; <b>Inbound Overkill Prevention:</b> Tracks active missiles already flying toward each target, enforces a max inbound cap (2 to 3 missiles, adjusted by Doctrine), and discounts target effective HP by difficulty (20% up to 95%).<br>
            &bull; <b>Validated Salvos &amp; Reserve Mode:</b> Secondary salvo missiles must independently pass range, minimum-arming, and boresight checks so WVR IR missiles are never wasted at BVR distance. Once ammo drops into the reserve threshold (15% to 50%), AI requires +4% to +14% higher Pk, tightens range (0.84x), and switches to single-shot fire.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #f43f5e;">
          <b style="color:#f43f5e;">DYNAMIC PER-AIRCRAFT AGGRESSION MODIFIERS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            &bull; <b>Heavily Armed Loadouts (&ge;8 missiles &amp; &ge;62% left):</b> Missile-heavy platforms lower their Pk gate (up to -5%), shorten shot cooldown (-20%), and open 2-missile salvos earlier.<br>
            &bull; <b>Last-Stand Attrition (&le;2 jets or &le;30% squadron left):</b> Surviving fighters lower their Pk gate (-5%), compress cooldown (-28%), and bypass reserve holds to spend remaining ordnance.<br>
            &bull; <b>Immediate Danger (Inbound &lt;32 km, HP &le;2, or Bandit &lt;22 km):</b> Threatened fighters cut cooldown (-34%), relax Pk (-6%) for defensive snapshots, and add +24 priority against the locking attacker (+20 under 22 km). Scaled from 25% weight at Permissive Sector to 100% at Air Denial / Extreme Threat and modulated by Doctrine.
          </div>
        </div>
      </div>
    `
  }
];
