/**
 * AIRSPACE STANDOFF: Standalone Flight Systems & Controls Reference
 * Non-chapter operational manual reference table with live keybind bindings.
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

function getManualControlsContent() {
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
    <div class="ge-desc">
      AIRSPACE STANDOFF supports full desktop keyboard and mouse controls, tablet touch interactions, and mobile portrait/landscape gestures. Rebind any action at any time in the <b>SETTINGS</b> menu.
    </div>

    <div class="ge-subhead">1. FLIGHT &amp; PROPULSION CONTROLS</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ACTION</th><th>DEFAULT / ASSIGNED INPUT</th><th>OPERATIONAL FUNCTION</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Continuous Bank &amp; Turn</b></td>
            <td><span class="manual-key-badge">${kSteerL}</span> / <span class="manual-key-badge">${kSteerR}</span></td>
            <td>Banks aircraft left or right with continuous aerodynamic roll authority.</td>
          </tr>
          <tr>
            <td><b>Engine Power Adjust</b></td>
            <td><span class="manual-key-badge">${kThrotD}</span> / <span class="manual-key-badge">${kThrotU}</span></td>
            <td>Steps engine throttle up or down through Idle, Cruise, Mil Power, and Afterburner.</td>
          </tr>
          <tr>
            <td><b>Kinetic Dive</b></td>
            <td><span class="manual-key-badge">${kDive}</span></td>
            <td>Sacrifices 7,500 ft of altitude to rapidly gain +0.32 Mach escape velocity.</td>
          </tr>
          <tr>
            <td><b>Zoom Climb</b></td>
            <td><span class="manual-key-badge">${kZoom}</span></td>
            <td>Trades -0.28 Mach of kinetic airspeed to establish an +8,500 ft high-altitude perch.</td>
          </tr>
          <tr>
            <td><b>Return to Base (RTB)</b></td>
            <td><span class="manual-key-badge">${kRTB}</span></td>
            <td>Orders active fighter to navigate at high speed to friendly depot sanctuary for reload.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ge-subhead">2. SENSOR &amp; TARGETING CONTROLS</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ACTION</th><th>DEFAULT / ASSIGNED INPUT</th><th>OPERATIONAL FUNCTION</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Cycle Detected Targets</b></td>
            <td><span class="manual-key-badge">${kTarget}</span></td>
            <td>Cycles through all detected radar contacts, hostiles, and civilian tracks.</td>
          </tr>
          <tr>
            <td><b>Instant Auto-Lock</b></td>
            <td><span class="manual-key-badge">${kLock}</span></td>
            <td>Searches forward radar cone and locks onto the nearest verified threat.</td>
          </tr>
          <tr>
            <td><b>Cycle Active Aircraft</b></td>
            <td><span class="manual-key-badge">${kPrevU}</span> / <span class="manual-key-badge">${kNextU}</span></td>
            <td>Switches cockpit focus across active operational squadron fighters.</td>
          </tr>
          <tr>
            <td><b>Radar Declutter Mode</b></td>
            <td><span class="manual-key-badge">${kDec}</span></td>
            <td>Toggles compact radar contact labels on/off to declutter busy engagements.</td>
          </tr>
          <tr>
            <td><b>Ground Target Overlay</b></td>
            <td><span class="manual-key-badge">${kGnd}</span></td>
            <td>Toggles display of surface air-defense batteries, SAM arrays, and command bunkers.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ge-subhead">3. WEAPONS, STORES RELEASE &amp; STATION MANAGEMENT</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ACTION</th><th>DEFAULT / ASSIGNED INPUT</th><th>OPERATIONAL FUNCTION</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Fire Autocannon Burst</b></td>
            <td><span class="manual-key-badge">${kGun}</span></td>
            <td>Fires a manual boresight strafe burst with active cannon and mounted gunpods.</td>
          </tr>
          <tr>
            <td><b>Fire Stations 1 &ndash; 9</b></td>
            <td><span class="manual-key-badge">${kPylon1}</span> through <span class="manual-key-badge">${kPylon9}</span></td>
            <td>Launches internal bay missile, external pylon weapon, or centerline hypersonic munition.</td>
          </tr>
          <tr>
            <td><b>Deploy Countermeasures</b></td>
            <td><span class="manual-key-badge">${kCM}</span></td>
            <td>Dispenses an emergency chaff cloud to break active radar seeker locks.</td>
          </tr>
          <tr>
            <td><b>Stores Management System (SMS)</b></td>
            <td><span class="manual-key-badge">MFD RACK</span></td>
            <td>Displays station tags: <b style="color:#2dd4bf;">[INTERNAL]</b> (doors closed, 0 drag/RCS), <b style="color:#38bdf8;">[EXTERNAL]</b>, or <b style="color:#fbbf24;">[CENTERLINE]</b>. Marks depleted racks as jettisoned in real time.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ge-subhead">4. VIEWPORT, CAMERA &amp; SIMULATION ENGINE</div>
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr><th>ACTION</th><th>DEFAULT / ASSIGNED INPUT</th><th>OPERATIONAL FUNCTION</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Track Active Aircraft</b></td>
            <td><span class="manual-key-badge">${kCamTrk}</span></td>
            <td>Centers and locks radar camera tracking onto active aircraft.</td>
          </tr>
          <tr>
            <td><b>Reset Panoramic View</b></td>
            <td><span class="manual-key-badge">${kCamRst}</span></td>
            <td>Restores default panoramic 150 km &times; 100 km theater view.</td>
          </tr>
          <tr>
            <td><b>Pause / Resume</b></td>
            <td><span class="manual-key-badge"><img src="icons/pause.svg" width="10" height="10" alt="Pause" class="manual-inline-ico"> ${kPause}</span></td>
            <td>Suspends simulation instantly. Opening any modal dialog also auto-pauses.</td>
          </tr>
          <tr>
            <td><b>Time Warp 1X / 2X / 4X</b></td>
            <td><span class="manual-key-badge">${kWarp1}</span>, <span class="manual-key-badge">${kWarp2}</span>, <span class="manual-key-badge">${kWarp4}</span></td>
            <td>Sets simulation speed to 1X Realtime, 2X Fast-Forward, or 4X Ultra-Speed.</td>
          </tr>
          <tr>
            <td><b>Open Settings</b></td>
            <td><span class="manual-key-badge"><img src="icons/settings.svg" width="11" height="11" alt="Settings" class="manual-inline-ico"> ${kSettings}</span></td>
            <td>Opens volume configuration, safe-zone padding, and key rebinding modal.</td>
          </tr>
          <tr>
            <td><b>Open Flight Manual</b></td>
            <td><span class="manual-key-badge"><img src="icons/manual.svg" width="11" height="11" alt="Manual" class="manual-inline-ico"> ${kManual}</span></td>
            <td>Opens classified flight operations manual and combat codex.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ge-subhead">5. MOUSE, TRACKPAD &amp; TOUCH GESTURES</div>
    <div class="ge-card">
      <ul style="list-style:none;padding-left:0;font-size:0.74rem;line-height:1.65;">
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Direct Pan:</b> Click/touch and drag across the radar scope to freely pan across the 150 km theater grid.</li>
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Zoom:</b> Scroll mouse wheel or pinch with two fingers on touchscreen devices to smoothly zoom between 0.65&times; and 4.0&times; magnification.</li>
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Target Selection:</b> Tap any aircraft or surface installation directly on the radar scope to acquire a target solution.</li>
        <li style="margin-bottom:6px;"><img src="icons/chevron.svg" width="8" height="8" alt=">" class="manual-chevron-ico"> <b>Mobile Steering Overlay:</b> In portrait or touch mode, large on-screen steering buttons appear at the lower right corner for continuous high-G banking.</li>
      </ul>
    </div>
  `;
}

window.MANUAL_CONTROLS = [
  {
    id: 'ref_controls',
    title: 'FLIGHT CONTROLS &amp; AVIONICS SYSTEMS REFERENCE',
    isSpecial: true,
    getDesc: getManualControlsContent,
    get desc() {
      return getManualControlsContent();
    }
  }
];