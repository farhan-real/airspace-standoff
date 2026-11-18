/**
 * AIRSPACE STANDOFF: Manual Submodule Data for Theater Comparison Tables & Tactical Roles
 */

window.MANUAL_THEATER_TABLES = {
  difficultyComparisonTable: `
    <div class="table-scroll-wrapper">
      <table class="ge-table">
        <thead>
          <tr>
            <th>DOCTRINE ELEMENT</th>
            <th style="color:#8494ab;">PERMISSIVE SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">0.50x VP</span></th>
            <th style="color:#93c5fd;">BUFFER ZONE<br><span style="font-size:0.52rem;opacity:0.7;">0.75x VP</span></th>
            <th style="color:#38bdf8;">CONTESTED AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">1.00x VP</span></th>
            <th style="color:#67e8f9;">ESCALATED AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">1.25x VP</span></th>
            <th style="color:#00f0ff;">HOSTILE AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">1.50x VP</span></th>
            <th style="color:#bae6fd;">FORWARD COMBAT ZONE<br><span style="font-size:0.52rem;opacity:0.7;">1.75x VP</span></th>
            <th style="color:#ffd700;">HIGH-THREAT SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">2.00x VP</span></th>
            <th style="color:#fde047;">FORTIFIED AIRSPACE<br><span style="font-size:0.52rem;opacity:0.7;">2.30x VP</span></th>
            <th style="color:#c084fc;">AIR DENIAL ZONE<br><span style="font-size:0.52rem;opacity:0.7;">2.60x VP</span></th>
            <th style="color:#ff3366;">EXTREME THREAT SECTOR<br><span style="font-size:0.52rem;opacity:0.7;">3.20x VP</span></th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>Score Multiplier</b></td><td style="color:#94a3b8;font-weight:700;">0.50x</td><td style="color:#93c5fd;font-weight:700;">0.75x</td><td style="color:#38bdf8;font-weight:700;">1.00x</td><td style="color:#67e8f9;font-weight:700;">1.25x</td><td style="color:#38bdf8;font-weight:700;">1.50x</td><td style="color:#bae6fd;font-weight:700;">1.75x</td><td style="color:#f43f5e;font-weight:700;">2.00x</td><td style="color:#fde047;font-weight:700;">2.30x</td><td style="color:#f43f5e;font-weight:700;">2.60x</td><td style="color:#f43f5e;font-weight:700;">3.20x</td></tr>
          <tr><td><b>Estimated Fleet Size</b></td><td style="color:#38bdf8;">3 - 5 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(Patrol Flight)</span></td><td style="color:#38bdf8;">4 - 6 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(Buffer Patrol)</span></td><td style="color:#38bdf8;">5 - 7 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(0-1 Ace Lead)</span></td><td style="color:#38bdf8;">6 - 8 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace Lead)</span></td><td style="color:#38bdf8;">7 - 9 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace Lead)</span></td><td style="color:#38bdf8;">7 - 9 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(1 Ace Lead)</span></td><td style="color:#fbbf24;">8 - 10 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Aces)</span></td><td style="color:#fbbf24;">8 - 11 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2 Aces)</span></td><td style="color:#fbbf24;">9 - 11 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(2-3 Flagship Aces)</span></td><td style="color:#f43f5e;">9 - 12 Aircraft<br><span style="font-size:0.50rem;color:var(--color-moon-mist);">(3 Flagship Aces)</span></td></tr>
          <tr><td><b>Defense Budget Cap</b></td><td style="color:#94a3b8;">150.0M CR</td><td style="color:#93c5fd;">205.0M CR</td><td style="color:#38bdf8;">265.0M CR</td><td style="color:#67e8f9;">315.0M CR</td><td style="color:#fbbf24;">360.0M CR</td><td style="color:#bae6fd;">400.0M CR</td><td style="color:#fbbf24;">445.0M CR</td><td style="color:#fde047;">490.0M CR</td><td style="color:#fbbf24;">540.0M CR</td><td style="color:#f43f5e;">600.0M CR</td></tr>
          <tr><td><b>Reaction Delay</b></td><td style="color:#94a3b8;">6.5s - 7.5s</td><td style="color:#93c5fd;">5.8s - 6.4s</td><td style="color:#38bdf8;">4.5s - 5.5s</td><td style="color:#67e8f9;">4.0s - 4.5s</td><td style="color:#fbbf24;">3.4s - 4.0s</td><td style="color:#bae6fd;">3.0s - 3.4s</td><td style="color:#fbbf24;">2.6s - 3.0s</td><td style="color:#fde047;">2.3s - 2.7s</td><td style="color:#fbbf24;">2.0s - 2.4s</td><td style="color:#f43f5e;">1.6s - 1.9s</td></tr>
          <tr><td><b>Target Focus Slots</b></td><td style="color:#38bdf8;">1 Target</td><td style="color:#38bdf8;">1 Target</td><td style="color:#38bdf8;">1 Target</td><td style="color:#67e8f9;">2 Targets</td><td style="color:#fbbf24;">2 Targets</td><td style="color:#bae6fd;">2 Targets</td><td style="color:#fbbf24;">2 Targets</td><td style="color:#fde047;">3 Targets</td><td style="color:#fbbf24;">2 - 3 Targets</td><td style="color:#f43f5e;">3 Targets</td></tr>
          <tr><td><b>Decoy Drone Defense</b></td><td style="color:#94a3b8;">0%</td><td style="color:#93c5fd;">8% spot rate</td><td style="color:#38bdf8;">15% spot rate</td><td style="color:#67e8f9;">22% spot rate</td><td style="color:#38bdf8;">30% spot rate</td><td style="color:#bae6fd;">38% spot rate</td><td style="color:#38bdf8;">45% spot rate</td><td style="color:#fde047;">50% spot rate</td><td style="color:#38bdf8;">55% spot rate</td><td style="color:#fbbf24;">65% spot rate</td></tr>
          <tr><td><b>Radar Notch (Beam 90&deg;)</b></td><td style="color:#94a3b8;">0%</td><td style="color:#93c5fd;">2%</td><td style="color:#38bdf8;">5%</td><td style="color:#67e8f9;">10%</td><td style="color:#38bdf8;">15%</td><td style="color:#bae6fd;">20%</td><td style="color:#38bdf8;">25%</td><td style="color:#fde047;">32%</td><td style="color:#38bdf8;">40%</td><td style="color:#fbbf24;">55%</td></tr>
          <tr><td><b>Firing Distance</b></td><td style="color:#94a3b8;">Max distance</td><td style="color:#93c5fd;">65% - 90% Max</td><td style="color:#fbbf24;">55% - 85% Max</td><td style="color:#67e8f9;">45% - 80% Max</td><td style="color:#fbbf24;">40% - 75% Max</td><td style="color:#bae6fd;">40% - 70% Max</td><td style="color:#f43f5e;">35% - 70% Max</td><td style="color:#fde047;">30% - 65% Max</td><td style="color:#f43f5e;">Top speed &amp; accuracy</td><td style="color:#f43f5e;">Lethal traps</td></tr>
          <tr><td><b>Missiles per Attack</b></td><td style="color:#38bdf8;">1 Missile</td><td style="color:#38bdf8;">1 Missile</td><td style="color:#38bdf8;">1 Missile</td><td style="color:#67e8f9;">1 - 2 Missiles</td><td style="color:#38bdf8;">1 - 2 Missiles</td><td style="color:#bae6fd;">2-Missile volley</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#fde047;">2 - 3 Missiles</td><td style="color:#fbbf24;">2-Missile volley</td><td style="color:#f43f5e;">2 - 3 Missiles</td></tr>
          <tr><td><b>Mixed Missiles (Radar + Heat)</b></td><td style="color:#94a3b8;">0%</td><td style="color:#93c5fd;">0%</td><td style="color:#94a3b8;">0%</td><td style="color:#94a3b8;">0%</td><td style="color:#94a3b8;">0%</td><td style="color:#bae6fd;">5%</td><td style="color:#38bdf8;">10%</td><td style="color:#fde047;">18%</td><td style="color:#fbbf24;">25%</td><td style="color:#fbbf24;">35%</td></tr>
          <tr><td><b>Speed &amp; Turn Control</b></td><td style="color:#94a3b8;">Flat afterburner</td><td style="color:#93c5fd;">Cruising throttle</td><td style="color:#38bdf8;">Normal cruise</td><td style="color:#67e8f9;">Turn throttle step</td><td style="color:#38bdf8;">Best turn speed</td><td style="color:#bae6fd;">Cornering speed</td><td style="color:#fbbf24;">Corner speed</td><td style="color:#fde047;">Smooth energy steps</td><td style="color:#fbbf24;">Smooth turns</td><td style="color:#fbbf24;">Master energy control</td></tr>
          <tr><td><b>3D Altitude Fighting</b></td><td style="color:#94a3b8;">Level flight</td><td style="color:#93c5fd;">Rare climbs</td><td style="color:#94a3b8;">Occasional climbs</td><td style="color:#67e8f9;">Basic energy climbs</td><td style="color:#38bdf8;">Climbs when needed</td><td style="color:#bae6fd;">Tactical climbing</td><td style="color:#fbbf24;">High perch</td><td style="color:#fde047;">Stratospheric sweep</td><td style="color:#fbbf24;">High &amp; low spread</td><td style="color:#f43f5e;">Aggressive climbs</td></tr>
          <tr><td><b>Formation Teamwork</b></td><td style="color:#94a3b8;">Solo / scattered</td><td style="color:#93c5fd;">Staggered trail</td><td style="color:#38bdf8;">Loose trail follow</td><td style="color:#67e8f9;">Loose tactical pairs</td><td style="color:#fbbf24;">2-Plane pairs</td><td style="color:#bae6fd;">Combat spread</td><td style="color:#fbbf24;">Pairs mutual defense</td><td style="color:#fde047;">Pincer bracket</td><td style="color:#fbbf24;">High-low bracket</td><td style="color:#fbbf24;">Crossfire pairs</td></tr>
          <tr><td><b>Attack Approach Route</b></td><td style="color:#94a3b8;">Direct charge</td><td style="color:#93c5fd;">Direct center route</td><td style="color:#94a3b8;">Straight flight path</td><td style="color:#67e8f9;">Offset approach</td><td style="color:#fbbf24;">High altitude sweep</td><td style="color:#bae6fd;">Flank sweep</td><td style="color:#38bdf8;">Outer edge hold</td><td style="color:#fde047;">Pincer convergence</td><td style="color:#fbbf24;">Flank attack</td><td style="color:#fbbf24;">Multi-angle convergence</td></tr>
          <tr><td><b>Tactical Roles</b></td><td style="color:#94a3b8;">Basic Sweep</td><td style="color:#93c5fd;">Sweep, Intercept</td><td style="color:#38bdf8;">Sweep, Intercept, Dogfight</td><td style="color:#67e8f9;">Sweep, Intercept, Dogfight, SEAD</td><td style="color:#00f0ff;">Intercept, Dogfight, Strike, SEAD, Swarm</td><td style="color:#bae6fd;">Snipers, Strike, SEAD, Swarm</td><td style="color:#ffd700;">Snipers, Ambush, Dogfight, SEAD, Swarm</td><td style="color:#fde047;">Superfighters, Snipers, Ambush, SEAD</td><td style="color:#c084fc;">Superfighters, Snipers, Ambush, SEAD, Swarm</td><td style="color:#ff3366;">Full Superfighter Wing</td></tr>
          <tr><td><b>Missile Ammo Saving</b></td><td style="color:#94a3b8;">Fires immediately</td><td style="color:#93c5fd;">Fires early</td><td style="color:#94a3b8;">Fires long-range quickly</td><td style="color:#67e8f9;">Moderate conservation</td><td style="color:#38bdf8;">Keeps dogfight reserve</td><td style="color:#bae6fd;">Disciplined shots</td><td style="color:#fbbf24;">Disciplined shots</td><td style="color:#fde047;">High-value prioritization</td><td style="color:#fbbf24;">High-value prioritization</td><td style="color:#fbbf24;">Full reserve discipline</td></tr>
          <tr><td><b>Reaction if Flight Lead Dies</b></td><td style="color:#94a3b8;">Panic (6.0s)</td><td style="color:#93c5fd;">Hesitation (5.5s)</td><td style="color:#94a3b8;">Confused (5.0s)</td><td style="color:#67e8f9;">Hesitation (4.5s)</td><td style="color:#38bdf8;">Pause (4.0s)</td><td style="color:#bae6fd;">Pause (3.8s)</td><td style="color:#38bdf8;">Wingman takes lead (3.5s)</td><td style="color:#fde047;">Wingman takes lead (3.0s)</td><td style="color:#38bdf8;">Falls back (2.5s)</td><td style="color:#f43f5e;">Instant defense (1.8s)</td></tr>
        </tbody>
      </table>
    </div>
  `,
  tacticalRolesGrid: `
    <div class="ge-grid-2">
      <div class="ge-card" style="border-left:3px solid #00f0ff;">
        <b style="color:#00f0ff;">STANDOFF SNIPER</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>High-Threat Sector to Extreme Threat Sector:</b> Stratospheric FL420 to FL500 cruise holding 50 to 90 km perimeter separation. Fires ultra-long-range ramjet missiles (PL-21, R-37M, AIM-260) and cranks 65&deg; off boresight at radar gimbal limits to deny return fire.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #38bdf8;">
        <b style="color:#38bdf8;">HIGH-SPEED INTERCEPTOR</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>All Difficulties:</b> Fast supersonic sprinters (MiG-31BM, DARKSTAR, F-15EX, Eurofighter, F-14D) cruising FL340 to FL420. Pushes afterburner thrust to achieve maximum closing velocity against high-value targets, delivering high-Mach BVR volleys.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #f97316;">
        <b style="color:#f97316;">WVR DOGFIGHTER</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>All Difficulties:</b> Agile high-AOA fighters (Su-35S, Mirage-2000, F-16V, Su-37, Rafale-C) operating FL180 to FL220. Drives into visual range (&lt; 20 km), modulating throttle into optimal corner speed (sOpt) for high-G snapshot bursts and gunpod strafes.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #c084fc;">
        <b style="color:#c084fc;">SWARM FLIGHT SCREEN</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>Hostile Airspace through Extreme Threat Sector:</b> High-G autonomous drones (MQ-99, MQ-101, XQ-58A, Kizilelma) holding outer corner positions. Flanks formation boundaries to draw enemy missile fire, deploying saturation micro-missile ripples (MAM) with zero pilot G-LOC constraints.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #00f5a0;">
        <b style="color:#00f5a0;">FORMATION ESCORT</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>All Difficulties:</b> Balanced multirole platforms (Rafale-C, F-18E, KF-21) cruising FL260 to FL300. Maintains protective perimeter coverage around the Flight Lead or strike aircraft, engaging incoming interceptors with datalink-coordinated volleys.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #14b8a6;">
        <b style="color:#2dd4bf;">STEALTH AMBUSH</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>Hostile Airspace through Extreme Threat Sector:</b> Pure stealth airframes (F-22A, YF-23, Su-57, J-20, Su-75) cruising FL360 to FL420 with clean internal bays. Stalks lateral sector boundaries, exploiting player beam-aspect radar spikes to deliver surprise BVR missile traps.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #e11d48;">
        <b style="color:#fb7185;">STRIKE INTERDICTION</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>Contested Airspace through Extreme Threat Sector:</b> Armored ground-attack aircraft and bombers (A-10C, Su-25SM3, Su-34, B-1B, F-15EX). Penetrates low beneath sensor horizons (FL055 to FL140) to deliver precision cruise missiles (JASSM-ER), glide bombs (SDB), or hypersonic Kinzhal strikes.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #a855f7;">
        <b style="color:#d8b4fe;">SEAD ESCORT (AIR DEFENSE SUPPRESSION)</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>All Difficulties:</b> Electronic warfare escorts (EA-18G, J-16D, Tornado ECR, EF-111A) cruising FL300 to FL360. Projects broadband microwave jamming while geolocating and neutralizing surface radar arrays and SAM batteries with AGM-88Gs.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #10b981;">
        <b style="color:#10b981;">AIR DOMINANCE SWEEP</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>All Difficulties:</b> Balanced offensive fighter elements engaging in forward air merges, screening friendly strike wings, and executing 2-plane element crossfire tactics.
        </div>
      </div>
      <div class="ge-card" style="border-left:3px solid #ffd700;">
        <b style="color:#ffd700;">COMMAND FLAGSHIP (ACE CADRE)</b>
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          <b>Contested Airspace through Extreme Threat Sector:</b> Elite formation leaders flying superfighters (ADF-11F, CFA-44, X-02S, ADFX-01, DARKSTAR) or top 5th-gen platforms. Possesses sub-second reaction latencies, directed-energy pulse lasers, EML railguns, and post-stall maneuvers.
        </div>
      </div>
    </div>
  `
};
