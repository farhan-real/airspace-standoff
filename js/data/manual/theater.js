/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Threat tiers, adversary ace cadre, IADS & scoring formulas.
 */

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY FLIGHT LEADS & THEATER ENGAGEMENT TIERS',
    desc: `
      <div class="ge-subhead">DESIGNATED FLIGHT LEADS</div>
      <div class="ge-desc">
        Hostile formations deploy specialized flight leads <img src="icons/diamond.svg" width="11" height="11" alt="Ace" class="manual-inline-ico">:
        <ul style="list-style:none;padding-left:0;margin-top:6px;">
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Realistic Kinematics:</b> Flight leads maneuver with realistic bank rates and bleed energy in sustained turns.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Airframe Scaling:</b> In Contested Sectors, Leads fly 4.5-gen fighters (Su-35S, Eurofighter, Rafale). Experimental fighters are reserved for severe threat sectors.</li>
          <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>High-Value Bounty:</b> Eliminating a designated flight lead awards an immediate <b>+850 Victory Point bounty</b>.</li>
        </ul>
      </div>

      <div class="ge-subhead">THE 6 THEATER ENGAGEMENT TIERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SECTOR CONTESTATION</th><th>SCORE MULTIPLIER</th><th>BUDGET CAP</th><th>LEADS</th><th>AI REACTION &amp; MANEUVER PROFILE</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">LOW THREAT SECTOR</td>
              <td>0.50x VP</td>
              <td>150.0M CR</td>
              <td>0</td>
              <td>7.2s reaction cooldown, basic aerodynamic turns, no notching.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">CONTESTED SECTOR</td>
              <td>1.00x VP</td>
              <td>260.0M CR</td>
              <td>1</td>
              <td>5.8s reaction cooldown, standard aerodynamic maneuvers, 4.5-gen flight lead.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">HIGH THREAT SECTOR</td>
              <td>1.50x VP</td>
              <td>360.0M CR</td>
              <td>1</td>
              <td>4.4s reaction cooldown, standard maneuvers, single-missile volleys.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">SEVERE THREAT SECTOR</td>
              <td>2.00x VP</td>
              <td>460.0M CR</td>
              <td>2</td>
              <td>3.4s reaction cooldown, coordinated pincer attacks, 2 flight leads.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">AIR DEFENSE SECTOR</td>
              <td>2.60x VP</td>
              <td>560.0M CR</td>
              <td>2</td>
              <td>2.8s reaction cooldown, Doppler notching, post-stall maneuvers.</td>
            </tr>
            <tr>
              <td style="color:#ff3366;font-weight:800;">HOSTILE AIRSPACE</td>
              <td>3.20x VP</td>
              <td>660.0M CR</td>
              <td>3</td>
              <td>2.2s reaction cooldown, Doppler notching, TVC cobras, 3 flight leads.</td>
            </tr>
          </tbody>
        </table>
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