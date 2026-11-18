/**
 * js/data/manual/militarybasics.js - Section 00: Beginner's Guide to Military Aviation Basics & Glossary.
 */

if (!window.MANUAL_MILITARY_DATA) {
  throw new Error('MANUAL_MILITARY_DATA must be loaded before militarybasics.js.');
}

window.MANUAL_MILITARY_BASICS = [
  {
    id: 'ch0_military_basics',
    title: 'SECTION 00: MILITARY BASICS, TERMINOLOGY & ABBREVIATIONS',
    desc: `
      <div class="ge-desc">
        New to modern air combat? You do not need any military background to master <b>AIRSPACE STANDOFF</b>. This opening guide explains how jets, radar, missiles, and ground air defenses work in plain English, followed by a complete dictionary of every word and abbreviation used in the manual.
      </div>

      <div class="ge-subhead">1. HOW MODERN AIR COMBAT WORKS (THE 4-STEP FLOW)</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">1. DETECT &amp; IDENTIFY (DON'T SHOOT BLIND)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Every plane on your screen starts as an unknown orange diamond called a <b>BOGEY [?]</b>. Keep your nose pointed generally toward it for a few seconds so your radar confirms whether it is an enemy fighter or a protected <b>Civilian Airliner</b>. Firing before verifying costs you Victory Points!
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">2. FIRE FROM LONG RANGE (BVR) OR CLOSE IN (WVR)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Modern fighters carry long-range <b>BVR</b> radar missiles (40 to 140 km) and agile short-range <b>WVR</b> heat-seeking missiles (&lt; 35 km) plus built-in cannons. Watch the <b>EST. %</b> accuracy bar on each weapon card before launching.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #fbbf24;">
          <b style="color:#fbbf24;">3. DEFEND WHEN LOCKED (RWR WARNINGS)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            If the <b>RWR</b> box in the top-right flashes red, an enemy radar or missile is locked onto you. Click a defensive <b>Maneuver Card</b> at the bottom of the screen (like <b>Doppler Notch &amp; Chaff</b> for radar missiles, or drop throttle to <b>Idle</b> for heat-seekers).
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #00f5a0;">
          <b style="color:#00f5a0;">4. REPAIR, REARM &amp; MANAGE ENERGY</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Speed and altitude are your lifeline: <b>Dive</b> trades height for sudden speed; <b>Climb</b> saves speed as height. When a jet runs out of missiles or takes heavy damage, press <b>[R] Return to Base</b> to fly behind the green safe line and reload.
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. HOW STEALTH, SENSORS &amp; GROUND DEFENSES WORK</div>
      <div class="ge-grid-2">
        <div class="ge-card">
          <b style="color:#00f5a0;">WHAT IS STEALTH &amp; RCS?</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            <b>Radar</b> works like shouting in the dark and listening for echoes. Conventional jets bounce big echoes back (high <b>RCS</b>). <b>Stealth</b> jets are shaped and painted to deflect echoes away, forcing enemy radars to get much closer before spotting them. Keep missiles inside <b>Internal Bays</b> to stay stealthy!
          </div>
        </div>
        <div class="ge-card">
          <b style="color:#f43f5e;">WHAT IS AN IADS (GROUND DEFENSE GRID)?</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            In Ground Attack mode, enemy bases are guarded by teamwork: tall <b>Early Warning (EW) Radars</b> spot you from afar, <b>SAM</b> launchers fire missiles at medium or high altitude, <b>CIWS</b> turrets shoot down slow bombs, and <b>AAA</b> flak guns guard low altitudes. Knock out radars, power nodes, or runways to break the grid!
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. KEY TACTICAL WORDS &amp; CONCEPTS</div>
      ${window.MANUAL_MILITARY_DATA.conceptsTable}

      <div class="ge-subhead">4. COMPLETE ABBREVIATIONS &amp; ACRONYMS DICTIONARY</div>
      ${window.MANUAL_MILITARY_DATA.acronymsTable}
    `
  }
];

