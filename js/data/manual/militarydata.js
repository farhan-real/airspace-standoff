/**
 * js/data/manual/militarydata.js - Structured military terminology, acronyms, and plain-English glossary tables.
 */

window.MANUAL_MILITARY_DATA = {
  acronymsTable: `
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ABBREVIATION</th><th>FULL TERM</th><th>PLAIN-ENGLISH MEANING</th></tr>
        </thead>
        <tbody>
          <tr><td><b>A2A / A2G</b></td><td>Air-to-Air / Air-to-Ground</td><td>Fighting other aircraft in the sky (A2A) vs. bombing or strafing surface targets on the ground (A2G).</td></tr>
          <tr><td><b>AAA</b></td><td>Anti-Aircraft Artillery</td><td>Rapid-fire ground flak cannons (such as 23mm, 30mm, 35mm, or 57mm guns) shooting shells at low-flying aircraft.</td></tr>
          <tr><td><b>AAR</b></td><td>After Action Report</td><td>The post-mission summary screen showing kills, losses, scores, timeline events, and battle replay.</td></tr>
          <tr><td><b>AESA / PESA</b></td><td>Active / Passive Electronically Scanned Array</td><td>Modern radar antennas that steer beams electronically in milliseconds instead of spinning a dish, improving range and jamming resistance.</td></tr>
          <tr><td><b>AoA</b></td><td>Angle of Attack</td><td>The angle between an aircraft's wing and the oncoming air. High AoA lets agile jets point their nose rapidly in tight dogfights.</td></tr>
          <tr><td><b>AP</b></td><td>Armor-Piercing</td><td>Heavy shells or warheads engineered to punch through thick metal plating or concrete instead of exploding only on the surface.</td></tr>
          <tr><td><b>ARH</b></td><td>Active Radar Homing</td><td>A radar-guided missile that carries its own mini-radar in the nose to track targets independently during the final intercept.</td></tr>
          <tr><td><b>ARM</b></td><td>Anti-Radiation Missile</td><td>A missile that locks onto and follows enemy radar radio broadcasts to destroy SAM and early warning radar sites.</td></tr>
          <tr><td><b>ATGM</b></td><td>Anti-Tank Guided Missile</td><td>A precision tactical missile designed to destroy armored vehicles, mobile SAM launchers, and fortified point targets.</td></tr>
          <tr><td><b>BVR / WVR</b></td><td>Beyond / Within Visual Range</td><td>Long-range radar missile combat from 35 to 140+ km away (BVR) vs. close-range dogfighting under 35 km (WVR).</td></tr>
          <tr><td><b>C2 / C4I</b></td><td>Command &amp; Control</td><td>Headquarters bunkers and command posts that coordinate radars, SAM batteries, and airfield launches across a theater.</td></tr>
          <tr><td><b>CAP / QRA</b></td><td>Combat Air Patrol / Quick Reaction Alert</td><td>Fighters already orbiting in the sky to guard airspace (CAP) vs. standby jets parked at airfields ready to scramble quickly (QRA).</td></tr>
          <tr><td><b>CAS</b></td><td>Close Air Support</td><td>Low-flying attack runs using heavy guns, rockets, and precision bombs to clear frontline enemy defenses.</td></tr>
          <tr><td><b>CCIP / CCRP</b></td><td>Continuously Computed Impact / Release Point</td><td>Onboard bombing computers that calculate exactly where unguided iron bombs and rockets will land.</td></tr>
          <tr><td><b>CIWS</b></td><td>Close-In Weapon System</td><td>Automated point-defense turrets (like SeaRAM or Pantsir) guarding bases by shooting down incoming bombs and cruise missiles.</td></tr>
          <tr><td><b>CM</b></td><td>Countermeasures</td><td>Defensive tools such as chaff, flares, and towed decoys released to confuse or break missile locks.</td></tr>
          <tr><td><b>COFFIN</b></td><td>Connection For Flight Interface</td><td>An armored, windowless cockpit using exterior cameras and synthetic displays; eliminates pilot G-LOC blackouts.</td></tr>
          <tr><td><b>DAS</b></td><td>Distributed Aperture System</td><td>Cameras around the aircraft skin giving 360-degree threat awareness and automatic missile-launch alerts.</td></tr>
          <tr><td><b>DEW / EML</b></td><td>Directed Energy Weapon / Electromagnetic Railgun</td><td>Pulse lasers hitting at the speed of light (DEW) or magnetic launchers firing hypersonic kinetic slugs (EML).</td></tr>
          <tr><td><b>DIRCM</b></td><td>Directional Infrared Countermeasures</td><td>A defensive laser turret that shines into incoming heat-seeking missiles to blind their infrared sensors.</td></tr>
          <tr><td><b>DLZ / NEZ</b></td><td>Dynamic Launch Zone / No-Escape Zone</td><td>The full range window where a missile can hit (DLZ) and the inner sweet-spot range where the target cannot outrun it (NEZ).</td></tr>
          <tr><td><b>ECM / ECCM</b></td><td>Electronic Countermeasures / Counter-Countermeasures</td><td>Radio jamming that shrinks enemy radar range (ECM) vs. frequency-hopping radar tech that resists jamming (ECCM).</td></tr>
          <tr><td><b>ELINT / ESM</b></td><td>Electronic Intelligence / Support Measures</td><td>Passive listening sensors that locate enemy radars from far away simply by hearing their radio broadcasts.</td></tr>
          <tr><td><b>EMCON</b></td><td>Emission Control</td><td>Turning off radars and transmitters ("going radio silent") so enemy warning receivers and ARMs cannot detect you.</td></tr>
          <tr><td><b>EO / IIR / IR</b></td><td>Electro-Optical / Imaging Infrared / Infrared</td><td>Camera and heat-seeking sensors that track engine heat and aircraft shapes silently without triggering radar warnings.</td></tr>
          <tr><td><b>EW</b></td><td>Early Warning / Electronic Warfare</td><td>Long-range surveillance radars watching the whole sky (Early Warning) or combat using jamming and signal deception (Electronic Warfare).</td></tr>
          <tr><td><b>FL</b></td><td>Flight Level</td><td>Altitude written in hundreds of feet. For example, FL300 means 30,000 feet and FL050 means 5,000 feet.</td></tr>
          <tr><td><b>FLIR</b></td><td>Forward-Looking Infrared</td><td>A thermal night-vision camera used on targeting pods to spot ground units and hidden decoys.</td></tr>
          <tr><td><b>G-LOC</b></td><td>G-Induced Loss of Consciousness</td><td>A temporary pilot blackout caused by extreme turning G-forces draining blood from the brain.</td></tr>
          <tr><td><b>GPS / INS</b></td><td>Global Positioning / Inertial Navigation System</td><td>Satellite and internal motion-sensor guidance guiding bombs to fixed ground coordinates in any weather.</td></tr>
          <tr><td><b>HAS</b></td><td>Hardened Aircraft Shelter</td><td>A thick concrete bunker at an airbase protecting standby fighter jets from light bombs and shrapnel.</td></tr>
          <tr><td><b>HOBS</b></td><td>High Off-Boresight</td><td>Ability to lock and fire missiles at sharp angles to the side without pointing the aircraft nose directly at the target.</td></tr>
          <tr><td><b>HTS</b></td><td>HARM Targeting System</td><td>A specialized pod that pinpoints enemy ground radars at long range and boosts Anti-Radiation Missile reach and accuracy.</td></tr>
          <tr><td><b>IADS</b></td><td>Integrated Air Defense System</td><td>An interconnected defense grid linking Early Warning radars, command bunkers, power nodes, SAMs, CIWS, and AAA.</td></tr>
          <tr><td><b>IRST</b></td><td>Infrared Search and Track</td><td>A passive nose heat-sensor that detects stealth fighters and tracks turning jets without emitting any radar signal.</td></tr>
          <tr><td><b>JDAM / LGB / SDB</b></td><td>GPS Bomb / Laser-Guided Bomb / Small Diameter Bomb</td><td>All-weather satellite-guided bombs (JDAM), laser-spot precision bombs (LGB), and compact gliding wing-bombs (SDB).</td></tr>
          <tr><td><b>LO / VLO</b></td><td>Low Observable / Very Low Observable</td><td>Stealth shaping and radar-absorbing designs that make an aircraft appear tiny on enemy radar screens.</td></tr>
          <tr><td><b>LOAL</b></td><td>Lock-On After Launch</td><td>Firing a missile toward a predicted point and feeding it mid-flight radio updates before its own seeker turns on.</td></tr>
          <tr><td><b>MALD / ITALD / FOTD</b></td><td>Decoy Drones &amp; Towed Decoys</td><td>Flying decoy gliders (MALD, ITALD) and trailing wire repeaters (FOTD) that imitate a jet's radar reflection to waste enemy missiles.</td></tr>
          <tr><td><b>MITL</b></td><td>Man-In-The-Loop</td><td>A two-way datalink radio letting the pilot steer standoff bombs and cruise missiles in flight for higher accuracy.</td></tr>
          <tr><td><b>MMW</b></td><td>Millimeter-Wave Radar</td><td>Short-range high-frequency radar inside smart missiles that spots armored targets right through clouds and smoke.</td></tr>
          <tr><td><b>Pk</b></td><td>Probability of Kill</td><td>The estimated percentage chance (0% to 95%) that a missile or bomb will hit and damage its target.</td></tr>
          <tr><td><b>RAM</b></td><td>Radar-Absorbent Material</td><td>Special stealth coatings applied to an aircraft skin to soak up radar waves rather than bouncing them back.</td></tr>
          <tr><td><b>RCS</b></td><td>Radar Cross Section</td><td>How large an aircraft looks to radar, measured in square meters. Lower RCS means enemies must get closer to see you.</td></tr>
          <tr><td><b>ROE</b></td><td>Rules of Engagement</td><td>Combat laws defining legal targets; firing at civilian airliners or unverified bogeys brings heavy Victory Point penalties.</td></tr>
          <tr><td><b>RTB</b></td><td>Return to Base</td><td>Ordering an aircraft to fly back to friendly airspace to repair airframe damage and reload empty weapon bays.</td></tr>
          <tr><td><b>RWR</b></td><td>Radar Warning Receiver</td><td>Cockpit sensor that alerts the pilot when enemy radar is searching (Sweep), targeting (Lock), or guiding a missile toward you.</td></tr>
          <tr><td><b>SAM</b></td><td>Surface-to-Air Missile</td><td>Ground-based missile batteries defending airspace across Short (SR), Medium (MR), or Long (LR) ranges.</td></tr>
          <tr><td><b>SAR / TFR</b></td><td>Synthetic Aperture / Terrain-Following Radar</td><td>Ground-mapping radar that images structures (SAR) or scans terrain ahead so strike jets can hug the ground below SAM floors (TFR).</td></tr>
          <tr><td><b>SEAD</b></td><td>Suppression of Enemy Air Defenses</td><td>Missions focused on blinding, jamming, or destroying enemy ground radars and SAM sites so bombers can strike safely.</td></tr>
          <tr><td><b>SHORAD</b></td><td>Short-Range Air Defense</td><td>Mobile point-defense SAM batteries protecting bases and depots out to 10 to 16 km.</td></tr>
          <tr><td><b>TGP</b></td><td>Targeting Pod</td><td>External camera and laser pod used to expose ground decoys, pierce haze, and guide precision A2G strikes.</td></tr>
          <tr><td><b>TVC</b></td><td>Thrust Vectoring Control</td><td>Movable jet exhaust nozzles that push the tail sideways or up/down for extreme tight turns.</td></tr>
          <tr><td><b>UCAV</b></td><td>Unmanned Combat Aerial Vehicle</td><td>Pilotless combat drones capable of extreme high-G turns without human pilot blackout limits.</td></tr>
          <tr><td><b>VP</b></td><td>Victory Points</td><td>Score earned by destroying hostile units and completing objectives quickly, or lost from friendly-fire ROE mistakes.</td></tr>
        </tbody>
      </table>
    </div>
  `,
  conceptsTable: `
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>TACTICAL WORD / CONCEPT</th><th>PLAIN-ENGLISH EXPLANATION</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Clutter &amp; Look-Down</b></td><td>When a high-flying radar looks downward, radio waves bounce off hills, trees, and oceans, creating background static called <b>Clutter</b>. A strong <b>Look-Down</b> filter cleans out that static so low-flying targets cannot hide in it.</td></tr>
          <tr><td><b>Doppler Notch (Beaming)</b></td><td>Airborne radars separate moving jets from stationary ground clutter by measuring speed toward or away from the radar. Turning exactly <b>90&deg; sideways (beaming)</b> makes your closing speed zero, tricking the radar filter into dropping your track.</td></tr>
          <tr><td><b>Aspect &amp; Beam Spike</b></td><td><i>Aspect</i> is which side of a plane faces the radar: <b>Nose-on</b> (smallest, stealthiest), <b>Tail-on</b> (shows hot engine exhaust), or <b>Beam</b> (sideways 90&deg;, where wide flat wings bounce back a huge <b>Beam Spike</b> reflection).</td></tr>
          <tr><td><b>Bogey vs. Bandit</b></td><td>A <b>Bogey [?]</b> is an unverified radar blip that might be friendly, hostile, or a civilian passenger jet. Once your radar scans it long enough to confirm it is an enemy, it becomes a confirmed hostile (<b>Bandit</b>).</td></tr>
          <tr><td><b>Burn-Through</b></td><td>Getting close enough (or using strong radar power) to overpower enemy jamming noise or stealth shaping and lock a clear track.</td></tr>
          <tr><td><b>Thermal Bloom</b></td><td>The bright heat plume pouring out of jet engines. Using Afterburner expands thermal bloom (1.45x), helping heat-seeking IR missiles lock on from farther away; pulling throttle to Idle cools it (0.70x).</td></tr>
          <tr><td><b>Corner Velocity (sOpt)</b></td><td>The sweet-spot airspeed where an aircraft turns its tightest and fastest. Flying much slower starves the wings of lift; flying much faster makes your turn circle wider.</td></tr>
          <tr><td><b>Cranking</b></td><td>Turning 50&deg; to 65&deg; sideways right after firing a radar missile. Your radar still sees the target at the edge of its scan cone to guide the missile, while you slow down how fast you fly toward the enemy's own missiles.</td></tr>
          <tr><td><b>ProNav (Proportional Nav)</b></td><td>Smart missile steering that aims ahead of where a moving target is going (intercept path) rather than chasing directly behind its tail.</td></tr>
          <tr><td><b>Salvo &amp; Saturation</b></td><td>Firing multiple missiles or glide bombs together so the target or defensive CIWS turrets cannot dodge or shoot down every incoming weapon.</td></tr>
          <tr><td><b>Sortie</b></td><td>A single complete combat mission from takeoff or spawn until victory, withdrawal, or debriefing.</td></tr>
          <tr><td><b>Dispersion &amp; Scatter</b></td><td><i>Dispersion</i> is how much unguided bombs drift off-target when dropped from very high altitude. <i>Scatter</i> is thick cloud moisture weakening laser designation beams and pulse lasers.</td></tr>
        </tbody>
      </table>
    </div>
  `
};

