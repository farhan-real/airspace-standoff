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
        Adversary forces scale by pilot discipline, tactical planning, and armament density rather than overwhelming swarm numbers. Higher difficulty sectors deploy compact, top-tier squadrons that fully utilize their allocated budgets with advanced airframes, full weapon racks, and comprehensive avionics:
      </div>

      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SECTOR CONTESTATION</th><th>SCORE MULT</th><th>SQUADRON SIZE</th><th>BUDGET</th><th>DECOY REJECT</th><th>NOTCH RATE</th><th>PLANNING PROFILE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">PERMISSIVE SECTOR (CADET)</td>
              <td>0.50x</td>
              <td>3 - 4 Aircraft</td>
              <td>150.0M CR</td>
              <td>0%</td>
              <td>0%</td>
              <td>Direct centerline charge; flat energy</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CONTESTED AIRSPACE (VETERAN)</td>
              <td>1.00x</td>
              <td>4 - 5 Aircraft</td>
              <td>260.0M CR</td>
              <td>15%</td>
              <td>5%</td>
              <td>Standard sweep line; nominal cruise</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">HOSTILE AIRSPACE (ELITE)</td>
              <td>1.50x</td>
              <td>5 - 6 Aircraft</td>
              <td>360.0M CR</td>
              <td>30%</td>
              <td>15%</td>
              <td>Staged altitude sweep; 2-ship elements</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">HIGH-THREAT SECTOR (ACE)</td>
              <td>2.00x</td>
              <td>6 - 7 Aircraft</td>
              <td>460.0M CR</td>
              <td>45%</td>
              <td>25%</td>
              <td>Perimeter CAP hold; 2 flight leads</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">AIR DENIAL ZONE (MASTER)</td>
              <td>2.60x</td>
              <td>7 Aircraft</td>
              <td>560.0M CR</td>
              <td>55%</td>
              <td>40%</td>
              <td>Offset corridor pincer; 2 flight leads</td>
            </tr>
            <tr>
              <td style="color:#ff3366;font-weight:800;">EXTREME THREAT SECTOR (LEGEND)</td>
              <td>3.20x</td>
              <td>8 Aircraft</td>
              <td>660.0M CR</td>
              <td>65%</td>
              <td>55%</td>
              <td>Coordinated strike package; 3 flight leads</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">FORCE COMPOSITION &amp; BUDGET UTILIZATION</div>
      <div class="ge-desc">
        To prevent visual clutter and unplayable missile saturation in advanced sectors, force scaling emphasizes airframe sophistication over raw numbers:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Cadet &amp; Veteran (3 - 5 Aircraft):</b> Field budget-conscious 4th-generation multirole fighters (F-16V, Mirage 2000, MiG-29K, Tejas) with basic missile loads and few avionics upgrades.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Elite &amp; Ace (5 - 7 Aircraft):</b> Field 4.5-gen and 5th-gen platforms (Su-35S, Eurofighter, Rafale, F-15EX, Su-57, J-20) equipped with extended BVR missiles, GaN AESA radar cores, and 2 designated flight leads.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Master &amp; Legend (7 - 8 Aircraft):</b> Rather than deploying 12+ cheap aircraft, the adversary utilizes their 560M - 660M budget by outfitting 7 to 8 apex superfighters and stealth airframes (ADF-11F, CFA-44, X-02S, Su-57, F-22A, Darkstar) with maximum weapon racks (AIM-260, Meteor, R-37M, Kinzhal) and full 4-socket upgrade suites.</li>
        </ul>
      </div>

      <div class="ge-subhead">THE 6 BEHAVIORAL DIMENSIONS</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#38bdf8;">1. SITUATIONAL TRIAGE &amp; DECOY DISCRIMINATION</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Cadet pilots chase any radar skin return. On Ace, Master, and Legend, pilots evaluate target return fire and kinematic speeds, but <b>still bite on MALD decoy drones 35% to 55% of the time</b> under the fog of war.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">2. ENERGY-MANEUVERABILITY (EM) &amp; THROTTLE</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Higher tiers modulate throttle to match their optimal corner velocity (sOpt). However, <b>under sustained G-load (&gt;0.65 stress) their discipline slips</b>: they can be baited into rate fights, bleeding energy down to vulnerable speeds.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#ffd700;">3. MISSILE SALVOS &amp; MIXED-SEEKER SYNERGY</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Master and Legend pilots occasionally pair Active Radar (ARH) and Infrared (IIR/EO) missiles, triggering the <b>+25% Mixed-Seeker Synergy Bonus</b>. They retain ammunition rather than dumping weapons at maximum range.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f43f5e;">4. DEFENSIVE NOTCHING &amp; COUNTERMEASURES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Doppler notching is never automatic: Legend pilots notch on ~55% of long-range engagements, dropping to under 30% inside 15 km where high angular line-of-sight rates make beaming difficult.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#c084fc;">5. FORMATION INTEGRITY &amp; ELEMENT PAIRING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Elite and above operate in 2-ship elements (Lead + Wingman). Wingmen trail by 4 to 8 km to create crossfire angles. If the element lead is neutralized, the wingman hesitates for 3.5 to 5.0 seconds before assuming command.
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#00f0ff;">6. INGRESS ROUTING &amp; PACKAGE PLANNING</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            High-tier squadrons plan offset ingress routes (high perimeter sweeps vs low-altitude corridor punch). When low on ammunition (Winchester) or damaged, they plan a withdrawal vector toward surface air defense umbrellas.
          </div>
        </div>
      </div>

      <div class="ge-subhead">EXPLOITING ADVERSARY TACTICAL WEAKNESSES</div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <ul style="list-style:none;padding-left:0;font-size:0.72rem;line-height:1.55;color:#cbd5e1;">
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Exploit Ingress Corridors:</b> Master/Legend formations sweep the outer perimeters. Position stealth fighters along the flanks to ambush them from the beam while their radar cones face center.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Disrupt the Command Chain:</b> Down the adversary flight lead early. Surviving wingmen freeze for several seconds, leaving them open to rapid follow-up shots.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>MALD Decoy Seduction:</b> Even Legend aces have a 35% blunder rate against MALD decoys. Deploy decoys ahead of your strike package to draw their opening missile volley.</li>
          <li style="margin-bottom:5px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Energy Trapping:</b> Higher-tier pilots respect corner velocity, but if you force them to defend against successive breaks, their energy reserve will collapse, disabling their turn rate.</li>
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