/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Threat tiers, adversary ace cadre, theater IADS, depots & scoring formulas.
 */

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY ACE SQUADRONS & THEATER ENGAGEMENT TIERS',
    desc: `
      <div class="ge-subhead">DESIGNATED ACE FIGHTERS</div>
      <div class="ge-desc">
        Hostile formations deploy legendary Ace pilots <img src="icons/diamond.svg" width="11" height="11" alt="Ace" class="manual-inline-ico"> (e.g. <b>Yellow 13, Pixy, Mihaly</b>) flying specialized air superiority fighters:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Realistic Flight Kinematics:</b> Aces maneuver with aerodynamic bank rates (0.70 to 1.15 rad/s) and bleed kinetic energy during prolonged hard turns rather than snapping erratically.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Airframe Scaling:</b> In Contested Airspace (VETERAN / Normal), Aces fly top-tier 4.5-gen fighters (Su-35S, Su-37, Eurofighter, Rafale, F-15EX). Experimental superfighters (ADF-11F, CFA-44, Darkstar) are reserved for high-threat combat zones.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Standard vs. Advanced Movement:</b> On standard difficulties (Cadet through Ace), all hostile aircraft and flight leads employ standard aerodynamic break turns only. Doppler notching and advanced 3D TVC maneuvers are exclusively reserved for very high difficulties (Air Denial Zone and Fortress Airspace).</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Human Blunder Margins:</b> Aces make human errors (12% to 65% blunder rate based on difficulty). Under pressure or in multi-missile salvos, their defense fails and allows clean hits.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>High-Value Bounty:</b> Eliminating an Ace fighter awards an immediate <b>+850 Victory Point bounty</b> <img src="icons/star.svg" width="11" height="11" alt="Star" class="manual-inline-ico">!</li>
        </ul>
      </div>

      <div class="ge-subhead">THE 6 THEATER ENGAGEMENT TIERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>THEATER CONTESTATION</th><th>SCORE MULTIPLIER</th><th>BUDGET CAP</th><th>ACES</th><th>AI PROFILE &amp; BLUNDER RATE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">PERMISSIVE SECTOR</td>
              <td>0.50x VP</td>
              <td>180.0M CR</td>
              <td>0</td>
              <td>7.2s reaction cooldown, 62% blunder rate, 16% evasion skill, basic standard flight turns, no notching.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CONTESTED AIRSPACE</td>
              <td>1.00x VP</td>
              <td>260.0M CR</td>
              <td>1</td>
              <td>5.8s reaction cooldown, 46% blunder rate, 24% evasion skill, standard aerodynamic maneuvers only, 4.5-gen Ace flight lead.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ACTIVE COMBAT ZONE</td>
              <td>1.50x VP</td>
              <td>360.0M CR</td>
              <td>1</td>
              <td>4.4s reaction cooldown, 35% blunder rate, 34% evasion skill, standard maneuvers only, single-missile volleys.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">HIGH-THREAT GRID</td>
              <td>2.00x VP</td>
              <td>450.0M CR</td>
              <td>2</td>
              <td>3.4s reaction cooldown, 26% blunder rate, 44% evasion skill, coordinated pincer attacks, standard maneuvers only, 2 Aces.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">AIR DENIAL ZONE</td>
              <td>2.60x VP</td>
              <td>550.0M CR</td>
              <td>2</td>
              <td>2.8s reaction cooldown, 18% blunder rate, 52% evasion skill, Doppler notching, advanced post-stall maneuvers, 2 Aces.</td>
            </tr>
            <tr>
              <td style="color:#ff3366;font-weight:800;">FORTRESS AIRSPACE</td>
              <td>3.20x VP</td>
              <td>650.0M CR</td>
              <td>3</td>
              <td>2.2s reaction cooldown, 12% blunder rate, 60% evasion skill, energy fighting, Doppler notching, TVC cobras, 3 Aces.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch9_logistics_scoring',
    title: 'SECTION 09: THEATER IADS, INDESTRUCTIBLE DEPOTS, LOGISTICS & SCORING',
    desc: `
      <div class="ge-desc">
        The 150 km &times; 100 km theater features an interconnected network of Integrated Air Defense Systems (IADS), hardened logistics hubs, and balanced operational mission debrief scoring formulas.
      </div>

      <div class="ge-subhead">1. INTEGRATED AIR DEFENSE SYSTEM (IADS) ARCHITECTURE</div>
      <div class="ge-desc">
        Surface installations operate in mutual electronic synergy:
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>INSTALLATION</th><th>HP</th><th>ENVELOPE</th><th>TACTICAL INTERACTION &amp; SEAD PROCEDURE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">S-400 / Patriot Battery</td>
              <td>8 HP</td>
              <td>52.0 km</td>
              <td>Fires Mach 4.8 radar-guided SAM volleys. <b>Requires an active Early Warning Radar Array</b> to detect and track targets; destroying the radar blinds the battery!</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Early Warning Radar Array</td>
              <td>5 HP</td>
              <td>65.0 km</td>
              <td>Provides high-altitude target cueing to SAM batteries. Vulnerable to anti-radiation missiles (AGM-88G inflicts 3&times; damage).</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Pantsir / Phalanx CIWS</td>
              <td>6 HP</td>
              <td>16.0 km</td>
              <td>Autonomous rapid-fire close-in defense. Intercepts incoming anti-radiation and cruise missiles (+40 VP per missile intercept).</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">EW Jammer Station</td>
              <td>6 HP</td>
              <td>36.0 km</td>
              <td>Projects a high-power microwave jamming umbrella that degrades hostile radar locks and reduces detection ranges by 50%.</td>
            </tr>
            <tr>
              <td style="color:#f97316;font-weight:800;">Subterranean Command Bunker</td>
              <td>24 HP</td>
              <td>HQ</td>
              <td>Heavily fortified subterranean command nexus. <b>Immune to standard air-to-air missiles and light autocannons</b>; requires specialized bunker penetrators (AGM-158B, Kinzhal, GBU-39 SDB).</td>
            </tr>
            <tr>
              <td style="color:#ffb830;font-weight:800;">Fuel Farm &amp; Depots</td>
              <td>8 HP</td>
              <td>Strategic</td>
              <td>Stores strategic theater fuel reserves. Destroying enemy fuel farms awards +200 VP and weakens theater logistics.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. INDESTRUCTIBLE FORWARD AMMUNITION DEPOTS (X=32km)</div>
      <div class="ge-desc">
        Hardened underground logistics repositories are positioned near the center combat grid (X = 32 km for Blue, X = 118 km for Red):
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Indestructible (999 HP):</b> Cannot be damaged or eliminated by any bomb, missile, or orbital strike.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Instant Turnaround Re-Arming:</b> Crossing into sanctuary or staging near the forward depot replenishes all spent cannon ammunition, defensive chaff charges, and standard missile racks for free!</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Fast RTB Routing:</b> Aircraft ordered to Return to Base (RTB) automatically navigate to depot sanctuary corridors at maximum sprint speed.</li>
        </ul>
      </div>

      <div class="ge-subhead">3. VICTORY POINTS (VP) &amp; MISSION SCORING MATH</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>TACTICAL EVENT</th><th>BASE VP REWARD</th><th>FORMULA &amp; OPERATIONAL NOTES</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Command Bunker Destroyed</b></td><td style="color:#00f0ff;">+800 VP</td><td>Primary strategic victory condition.</td></tr>
            <tr><td><b>Ace Pilot Bounty</b></td><td style="color:#ffd700;">+850 VP</td><td>Added on top of airframe kill points.</td></tr>
            <tr><td><b>Combat Aircraft Kill</b></td><td style="color:#00f5a0;">150 + (Cost &times; 10) VP</td><td>F-16: 285 VP &bull; F-22: 630 VP (Flight Lead: 1.5&times;).</td></tr>
            <tr><td><b>UCAV / Drone Kill</b></td><td style="color:#00f5a0;">80 + (Cost &times; 12) VP</td><td>MQ-99: 122 VP &bull; S-70: 248 VP.</td></tr>
            <tr><td><b>SAM Battery Destroyed</b></td><td style="color:#38bdf8;">+300 VP</td><td>Neutralizes long-range surface threats.</td></tr>
            <tr><td><b>Radar Array Destroyed</b></td><td style="color:#38bdf8;">+250 VP</td><td>Blinds long-range SAM guidance.</td></tr>
            <tr><td><b>EW Jammer Neutralized</b></td><td style="color:#38bdf8;">+250 VP</td><td>Clears sector microwave radar noise.</td></tr>
            <tr><td><b>CIWS Battery Destroyed</b></td><td style="color:#38bdf8;">+200 VP</td><td>Removes point-defense missile interceptors.</td></tr>
            <tr><td><b>CIWS Missile Intercept</b></td><td style="color:#38bdf8;">+40 VP</td><td>Awarded per missile intercepted.</td></tr>
            <tr><td><b style="color:#f97316;">Reckless Bogey Engagement</b></td><td style="color:#f97316;">-600 VP</td><td>Deducted immediately upon firing on unverified bogeys.</td></tr>
            <tr><td><b style="color:#f97316;">Civilian Air Strike</b></td><td style="color:#f97316;">-500 VP</td><td>Deducted per non-lethal strike on civilian flights.</td></tr>
            <tr><td><b style="color:#ff3366;">Civilian Shootdown</b></td><td style="color:#ff3366;">-2000 VP</td><td>Catastrophic penalty for destroying an airliner.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. TIME BONUS &amp; MULTIPLIER STACKING</div>
      <div class="ge-desc">
        Mission score rewards tactical efficiency and high-threat operations:
      </div>
      <div class="ge-formula-card">
        <span style="color:#94a3b8;font-size:0.62rem;">FINAL SCORE FORMULATION:</span>
        <div class="ge-formula-code">Final Score = (Base Combat VP + Speed Time Bonus) &times; (Difficulty Multiplier &times; Budget Multiplier)</div>
      </div>
      <div class="ge-callout">
        <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Speed Time Bonus:</b> Par time is <b>360 seconds (6:00)</b>. For successful sorties completed under par time, every second remaining awards <b>+2.5 VP</b>.<br>
        <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Difficulty Multiplier:</b> Scales from <b>0.50&times;</b> (Permissive Sector) up to <b>3.20&times;</b> (Fortress Airspace).<br>
        <img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Budget Multiplier:</b> Austerity budgets award up to <b>1.75&times;</b>; high funding budgets scale down to <b>0.60&times;</b>.
      </div>
    `
  }
];