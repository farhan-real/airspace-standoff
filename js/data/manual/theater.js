/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Chapters 8 to 9
 * Dynamic keybind resolution, active threat tiers, and theater logistics.
 */

function getManualAssignedKey(action) {
  const binds = (window.Settings && window.Settings.keybinds)
    ? window.Settings.keybinds
    : (window.DEFAULT_KEYBINDS || {});
  const raw = binds[action] || (window.DEFAULT_KEYBINDS ? window.DEFAULT_KEYBINDS[action] : '');
  if (typeof window.formatKeyLabel === 'function') {
    return window.formatKeyLabel(raw);
  }
  return String(raw || '').replace('Key', '').replace('Digit', '');
}

function getManualChapter9Content() {
  const kPause = getManualAssignedKey('PAUSE_TIME');
  const kWarp1 = getManualAssignedKey('TIME_WARP_1X');
  const kWarp2 = getManualAssignedKey('TIME_WARP_2X');
  const kWarp4 = getManualAssignedKey('TIME_WARP_4X');
  const kSteerL = getManualAssignedKey('STEER_LEFT');
  const kSteerR = getManualAssignedKey('STEER_RIGHT');
  const kPrevU = getManualAssignedKey('PREV_UNIT');
  const kNextU = getManualAssignedKey('NEXT_UNIT');
  const kTarget = getManualAssignedKey('CYCLE_TARGET');
  const kLock = getManualAssignedKey('AUTO_LOCK');
  const kGun = getManualAssignedKey('FIRE_GUN');
  const kPylon1 = getManualAssignedKey('FIRE_PYLON_1');
  const kPylon9 = getManualAssignedKey('FIRE_PYLON_9');
  const kCM = getManualAssignedKey('COUNTERMEASURES');
  const kDive = getManualAssignedKey('DIVE');
  const kZoom = getManualAssignedKey('ZOOM');
  const kRTB = getManualAssignedKey('RTB');
  const kDec = getManualAssignedKey('TOGGLE_DECLUTTER');
  const kGnd = getManualAssignedKey('TOGGLE_GROUND');
  const kThrotD = getManualAssignedKey('THROTTLE_DOWN');
  const kThrotU = getManualAssignedKey('THROTTLE_UP');
  const kCamTrk = getManualAssignedKey('CAMERA_TRACK');
  const kCamRst = getManualAssignedKey('CAMERA_RESET');
  const kSettings = getManualAssignedKey('OPEN_SETTINGS');
  const kManual = getManualAssignedKey('OPEN_MANUAL');

  return `
    <div class="ge-subhead">CENTRAL INDESTRUCTIBLE AMMO DEPOTS</div>
    <div class="ge-desc">
      Hardened forward ammunition depots are positioned closer to the center arena (X=32km):
      <ul>
        <li><b>Indestructible (999 HP):</b> Cannot be damaged or destroyed by any weapon.</li>
        <li><b>Rapid Turnaround Refueling:</b> Entering sanctuary or staging near depots replenishes full gun ammunition, chaff countermeasures, and standard missiles for free!</li>
      </ul>
    </div>

    <div class="ge-subhead">SIMULATION SPEED CONTROLS (TIME WARP)</div>
    <div class="ge-grid-2">
      <div class="ge-card">
        <b style="color:#38bdf8;">PAUSE / RESUME [${kPause}]</b>
        <div style="font-size:0.72rem;color:#cbd5e1;">Suspends combat simulation instantly. Opening modals automatically pauses.</div>
      </div>
      <div class="ge-card">
        <b style="color:#00f5a0;">TIME WARP [Keys ${kWarp1}, ${kWarp2}, ${kWarp4}]</b>
        <div style="font-size:0.72rem;color:#cbd5e1;">1X Realtime (Key ${kWarp1}), 2X High Speed (Key ${kWarp2}), or 4X Ultra-Fast (Key ${kWarp4}).</div>
      </div>
    </div>

    <div class="ge-subhead">INTEGRATED AIR DEFENSE SYSTEMS (IADS) &amp; REBALANCED SCORING</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>THEATER ASSET</th><th>INTEGRITY</th><th>ENGAGEMENT RANGE</th><th>VICTORY POINTS (VP)</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Command Bunker</b></td><td>24 HP</td><td>Passive Target</td><td><b>+800 VP</b> (Requires bunker penetrators)</td></tr>
          <tr><td><b>Ace Fighter Kill</b></td><td>5&ndash;7 HP</td><td>Superfighter</td><td><b>Base Kill VP + 850 VP Bounty</b> (Elite bounty)</td></tr>
          <tr><td><b>Standard Combat Aircraft</b></td><td>3&ndash;6 HP</td><td>Fighter / Bomber</td><td><b>150 + (Cost &times; 10) VP</b> (e.g. F-16: 285 VP, F-22: 630 VP; Lead: 1.5&times;)</td></tr>
          <tr><td><b>Combat Drone / UCAV</b></td><td>1&ndash;4 HP</td><td>Unmanned</td><td><b>80 + (Cost &times; 12) VP</b> (e.g. MQ-99: 122 VP, S-70: 248 VP)</td></tr>
          <tr><td><b>S-400 / Patriot SAM</b></td><td>8 HP</td><td>52.0 km reach</td><td><b>+300 VP</b> (Requires active Radar Array to fire)</td></tr>
          <tr><td><b>Early Warning Radar</b></td><td>5 HP</td><td>65.0 km reach</td><td><b>+250 VP</b> (Destruction blinds long-range SAMs)</td></tr>
          <tr><td><b>EW Jammer Station</b></td><td>6 HP</td><td>36.0 km umbrella</td><td><b>+250 VP</b> (Degrades enemy radar locks by 50%)</td></tr>
          <tr><td><b>Pantsir / Phalanx CIWS</b></td><td>6 HP</td><td>16.0 km defense</td><td><b>+200 VP</b> (+40 VP per missile intercept)</td></tr>
          <tr><td><b style="color:#f97316;">Reckless Bogey Engagement</b></td><td>Track [?]</td><td>Unverified</td><td><b style="color:#f97316;">-600 VP Penalty</b> (Firing on unverified track [BOGEY ?] prior to positive ID)</td></tr>
          <tr><td><b style="color:#f97316;">Civilian Air Strike</b></td><td>6 HP</td><td>Airliner</td><td><b style="color:#f97316;">-500 VP Penalty</b> (Striking neutral commercial traffic)</td></tr>
          <tr><td><b style="color:#ff3366;">Civilian Shootdown</b></td><td>6 HP</td><td>Airliner</td><td><b style="color:#ff3366;">-2000 VP Penalty</b> (Catastrophic RoE violation)</td></tr>
        </tbody>
      </table>
    </div>

    <div class="ge-subhead">TACTICAL KEYBINDINGS REFERENCE (CURRENTLY ASSIGNED)</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ACTION</th><th>ASSIGNED KEY</th><th>FUNCTION</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Steer Left / Right</b></td><td>${kSteerL} / ${kSteerR}</td><td>Bank aircraft heading vector</td></tr>
          <tr><td><b>Cycle Active Unit</b></td><td>${kPrevU} / ${kNextU}</td><td>Select previous / next aircraft in squadron</td></tr>
          <tr><td><b>Cycle Target</b></td><td>${kTarget}</td><td>Cycle target lock across detected hostile contacts</td></tr>
          <tr><td><b>Auto-Lock Nearest</b></td><td>${kLock}</td><td>Search forward radar cone and lock nearest threat</td></tr>
          <tr><td><b>Fire Autocannon</b></td><td>${kGun}</td><td>Fire manual strafe burst with active cannon</td></tr>
          <tr><td><b>Fire Pylons 1&ndash;9</b></td><td>${kPylon1} through ${kPylon9}</td><td>Discharge weapon pack at station index</td></tr>
          <tr><td><b>Deploy Countermeasures</b></td><td>${kCM}</td><td>Dispense emergency chaff decoy salvo</td></tr>
          <tr><td><b>Kinetic Dive</b></td><td>${kDive}</td><td>Drop 7,500 ft altitude to regain Mach speed</td></tr>
          <tr><td><b>Zoom Climb</b></td><td>${kZoom}</td><td>Climb 8,500 ft into high-altitude perch</td></tr>
          <tr><td><b>Toggle RTB Re-Arm</b></td><td>${kRTB}</td><td>Order aircraft to return to base or cancel reload</td></tr>
          <tr><td><b>Toggle Declutter</b></td><td>${kDec}</td><td>Toggle radar declutter mode on/off</td></tr>
          <tr><td><b>Toggle Ground Targets</b></td><td>${kGnd}</td><td>Toggle ground and surface installation markers</td></tr>
          <tr><td><b>Throttle Adjust</b></td><td>${kThrotD} and ${kThrotU}</td><td>Decrease / increase throttle power</td></tr>
          <tr><td><b>Pause / Resume</b></td><td>${kPause}</td><td>Toggle simulation pause overlay</td></tr>
          <tr><td><b>Time Warp 1X / 2X / 4X</b></td><td>${kWarp1}, ${kWarp2}, ${kWarp4}</td><td>Set simulation speed multiplier (1X, 2X, 4X)</td></tr>
          <tr><td><b>Track Camera</b></td><td>${kCamTrk}</td><td>Lock radar camera tracking on active aircraft</td></tr>
          <tr><td><b>Reset Camera</b></td><td>${kCamRst}</td><td>Restore default panoramic theater view</td></tr>
          <tr><td><b>Open Settings</b></td><td>${kSettings}</td><td>Configure audio volume, radar zoom, and keybinds</td></tr>
          <tr><td><b>Open Flight Manual</b></td><td>${kManual}</td><td>Open complete tactical manual and combat codex</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'SECTION 08: ADVERSARY ACE SQUADRONS & THEATER ENGAGEMENT TIERS',
    desc: `
      <div class="ge-subhead">DESIGNATED ACE FIGHTERS</div>
      <div class="ge-desc">
        Hostile formations deploy legendary Ace pilots (e.g. <b>Yellow 13, Pixy, Mihaly</b>) flying specialized air superiority fighters:
        <ul>
          <li><b>Realistic Flight Kinematics:</b> Aces maneuver with aerodynamic bank rates (0.70 to 1.15 rad/s) and bleed kinetic energy during prolonged hard turns rather than snapping erratically.</li>
          <li><b>Airframe Scaling:</b> In Contested Airspace (VETERAN / Normal), Aces fly top-tier 4.5-gen fighters (Su-35S, Su-37, Eurofighter, Rafale, F-15EX). Experimental superfighters (ADF-11F, CFA-44, Darkstar) are reserved for high-threat combat zones.</li>
          <li><b>Standard vs. Advanced Movement:</b> On standard difficulties (Cadet through Ace), all hostile aircraft and flight leads employ standard aerodynamic break turns only. Doppler notching and advanced 3D TVC maneuvers are exclusively reserved for very high difficulties (Air Denial Zone and Fortress Airspace).</li>
          <li><b>Human Blunder Margins:</b> Aces make human errors (12% to 65% blunder rate based on difficulty). Under pressure or in multi-missile salvos, their defense fails and allows clean hits.</li>
          <li><b>High-Value Bounty:</b> Eliminating an Ace fighter awards an immediate <b>+850 Victory Point bounty</b>!</li>
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
    title: 'SECTION 09: THEATER IADS, INDESTRUCTIBLE DEPOTS, SCORING & KEYBINDS',
    getDesc: getManualChapter9Content,
    get desc() {
      return getManualChapter9Content();
    }
  }
];