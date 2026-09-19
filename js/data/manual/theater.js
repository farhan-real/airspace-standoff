/**
 * AIRSPACE STANDOFF // Flight Manual Submodule: Chapters 8 to 9
 * Covers: Ace Pilots, Difficulties, Central Depots, Time Warp & Keybinds
 */

window.MANUAL_THEATER = [
  {
    id: 'ch8_aces_difficulties',
    title: 'CHAPTER 8: ACE COMBAT CADRE & 6 THEATER DIFFICULTIES',
    desc: `
      <div class="ge-subhead">DESIGNATED ACE FIGHTERS (★ ACE ★)</div>
      <div class="ge-desc">
        Hostile formations deploy legendary Ace pilots (e.g. <b>★ Yellow 13 ★, ★ Pixy ★, ★ Mihaly ★</b>) flying experimental superfighters:
        <ul>
          <li><b>Superior Kinematics:</b> Aces feature +1 extra armor HP, +0.08 turn agility, and +2.5G higher structural thresholds.</li>
          <li><b>Coordinated Pincer Tactics:</b> Aces coordinate with wingmen to bracket your fighters from opposing angles.</li>
          <li><b>Synchronized Volleys:</b> Aces fire synchronized multi-missile salvos to maximize saturation hit bonuses.</li>
          <li><b>Extreme Evasion:</b> Aces deploy chaff/flares with flawless timing and perform post-stall breaks (+32% evasion bonus).</li>
          <li><b>High-Value Bounty:</b> Eliminating an Ace fighter awards a massive <b>+850 Victory Point bounty</b>!</li>
        </ul>
      </div>

      <div class="ge-subhead">THE 6 THEATER DIFFICULTIES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>DIFFICULTY</th><th>SCORE MULTIPLIER</th><th>BUDGET CAP</th><th>ACES</th><th>AI PROFILE &amp; EVASION SKILL</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#8494ab;font-weight:800;">CADET</td>
              <td>0.60x VP</td>
              <td>180.0M CR</td>
              <td>0</td>
              <td>4.8s reaction cooldown, 40% blunder rate, basic flight logic, no Doppler notching.</td>
            </tr>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">VETERAN</td>
              <td>1.00x VP</td>
              <td>260.0M CR</td>
              <td>1</td>
              <td>3.0s reaction cooldown, 20% blunder rate, active Doppler notching, disciplined merges.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">ELITE</td>
              <td>1.40x VP</td>
              <td>360.0M CR</td>
              <td>1</td>
              <td>1.8s reaction cooldown, 8% blunder rate, multi-unit coordination, BVR salvos.</td>
            </tr>
            <tr>
              <td style="color:#ffd700;font-weight:800;">THEATER ACE</td>
              <td>1.80x VP</td>
              <td>450.0M CR</td>
              <td>2</td>
              <td>1.0s reaction cooldown, 3% blunder rate, coordinated pincer attacks, lethal salvos.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">SUPREME MASTER</td>
              <td>2.20x VP</td>
              <td>550.0M CR</td>
              <td>2</td>
              <td>0.65s reaction cooldown, 1% blunder rate, rapid countermeasure and notch responses.</td>
            </tr>
            <tr>
              <td style="color:#ff3366;font-weight:800;">APEX LEGEND</td>
              <td>2.80x VP</td>
              <td>650.0M CR</td>
              <td>3</td>
              <td>0.35s reaction cooldown, 0% blunder rate, energy fighting, TVC cobras, ruthless merges.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'ch9_logistics_scoring',
    title: 'CHAPTER 9: THEATER LOGISTICS, CENTRAL DEPOTS, TIME WARP & CONTROLS',
    desc: `
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
          <b style="color:#38bdf8;">PAUSE / RESUME [Key P]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;">Suspends combat simulation instantly. Opening modals automatically pauses.</div>
        </div>
        <div class="ge-card">
          <b style="color:#00f5a0;">TIME WARP [Keys 1, 2, 4]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;">1X Realtime (10Hz clock), 2X High Speed, or 4X Ultra-Fast simulation rate.</div>
        </div>
      </div>

      <div class="ge-subhead">INTEGRATED AIR DEFENSE SYSTEMS (IADS) &amp; SCORING</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>THEATER ASSET</th><th>INTEGRITY</th><th>ENGAGEMENT RANGE</th><th>VICTORY POINTS (VP)</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Command Bunker</b></td><td>24 HP</td><td>Passive Target</td><td><b>+600 VP</b> (Requires bunker penetrators)</td></tr>
            <tr><td><b>Ace Fighter Kill</b></td><td>5–7 HP</td><td>Superfighter</td><td><b>Cost × 3 + 850 VP</b> (Elite bounty)</td></tr>
            <tr><td><b>Standard Hostile Kill</b></td><td>1–9 HP</td><td>Varies</td><td><b>Cost × 3 VP</b> (Lead kills award 2× bounty)</td></tr>
            <tr><td><b>S-400 / Patriot SAM</b></td><td>8 HP</td><td>48.0 km reach</td><td><b>+250 VP</b> (Requires active Radar Array to fire)</td></tr>
            <tr><td><b>Early Warning Radar</b></td><td>5 HP</td><td>55.0 km reach</td><td><b>+200 VP</b> (Destruction blinds long-range SAMs)</td></tr>
            <tr><td><b>EW Jammer Station</b></td><td>6 HP</td><td>36.0 km umbrella</td><td><b>+200 VP</b> (Degrades enemy radar locks by 50%)</td></tr>
            <tr><td><b>Pantsir / Phalanx CIWS</b></td><td>6 HP</td><td>16.0 km defense</td><td><b>+150 VP</b> (+40 VP per missile intercept)</td></tr>
            <tr><td><b style="color:#ff3366;">Civilian Shootdown</b></td><td>6 HP</td><td>Airliner</td><td><b style="color:#ff3366;">-800 VP Penalty</b> (Strict RoE violation)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">TACTICAL KEYBINDINGS REFERENCE</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ACTION</th><th>DEFAULT KEY</th><th>FUNCTION</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Steer Left / Right</b></td><td>ArrowLeft / ArrowRight</td><td>Bank aircraft heading vector</td></tr>
            <tr><td><b>Cycle Active Unit</b></td><td>ArrowUp / ArrowDown</td><td>Select previous / next aircraft in squadron</td></tr>
            <tr><td><b>Cycle Target</b></td><td>Key T / Tab</td><td>Cycle target lock across detected hostile contacts</td></tr>
            <tr><td><b>Auto-Lock Nearest</b></td><td>Spacebar</td><td>Search forward radar cone and lock nearest threat</td></tr>
            <tr><td><b>Fire Autocannon</b></td><td>Key G</td><td>Fire manual strafe burst with active cannon</td></tr>
            <tr><td><b>Fire Pylons 1–9</b></td><td>Keys 1 through 9</td><td>Discharge weapon pack at station index</td></tr>
            <tr><td><b>Deploy Countermeasures</b></td><td>Key F</td><td>Dispense emergency chaff decoy salvo</td></tr>
            <tr><td><b>Kinetic Dive</b></td><td>Key X</td><td>Drop 7,500 ft altitude to regain Mach speed</td></tr>
            <tr><td><b>Zoom Climb</b></td><td>Key Z</td><td>Climb 8,500 ft into high-altitude perch</td></tr>
            <tr><td><b>Toggle RTB Re-Arm</b></td><td>Key R</td><td>Order aircraft to return to base or cancel reload</td></tr>
            <tr><td><b>Toggle Declutter</b></td><td>Key V</td><td>Toggle radar declutter mode on/off</td></tr>
            <tr><td><b>Toggle Ground Targets</b></td><td>Key B</td><td>Toggle ground and surface installation markers</td></tr>
            <tr><td><b>Throttle Adjust</b></td><td>[ and ]</td><td>Decrease / increase throttle power</td></tr>
            <tr><td><b>Pause / Resume</b></td><td>Key P</td><td>Toggle simulation pause overlay</td></tr>
            <tr><td><b>Time Warp 1X / 2X / 4X</b></td><td>Keys 1, 2, 4</td><td>Set simulation speed multiplier</td></tr>
            <tr><td><b>Track Camera</b></td><td>Key C</td><td>Lock radar camera tracking on active aircraft</td></tr>
            <tr><td><b>Reset Camera</b></td><td>Digit 0 / Backspace</td><td>Restore default panoramic theater view</td></tr>
            <tr><td><b>Open Settings</b></td><td>Key O</td><td>Configure audio volume, radar zoom, and keybinds</td></tr>
            <tr><td><b>Open Flight Manual</b></td><td>Key M</td><td>Open complete tactical manual and combat codex</td></tr>
          </tbody>
        </table>
      </div>
    `
  }
];