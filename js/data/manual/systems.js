/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 08
 * Covers: Operational Importance of External Pods, Sensors, Strike Subsystems & Airframe Upgrades
 */

window.MANUAL_SYSTEMS = [
  {
    id: 'ch8_pods_systems',
    title: 'SECTION 08: IMPORTANCE OF EXTERNAL PODS, SENSORS & SYSTEMS',
    desc: `
      <div class="ge-desc">
        Modern airframes rely on specialized external <b>Pods</b> and internal <b>Subsystem Upgrades</b> to survive integrated air defenses, uncover hidden traps, and maintain lock through heavy jamming and cloud cover. Flying stripped aircraft without sensors or countermeasures leaves even high-end fighters blind to stealth jets and decoy traps.
      </div>

      <div class="ge-subhead">1. TARGETING PODS (TGP): PRECISION, CLOUD MITIGATION &amp; DECOY EXPOSURE</div>
      <div class="ge-desc">
        Mounting a Targeting Pod occupies 1 external station with minimal RCS penalty (+0.04 to +0.06 m&sup2;) while delivering three critical combat advantages:
      </div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>TARGETING POD</th><th>RECON RANGE</th><th>A2G ACCURACY</th><th>CLOUD MITIGATION</th><th>SPECIAL ROLE</th></tr>
          </thead>
          <tbody>
            <tr><td><b>AN/AAQ-14 LANTIRN</b></td><td>34 km</td><td style="color:#00f5a0;">+16% Pk</td><td>20%</td><td>Budget night FLIR pod for early strike fighters.</td></tr>
            <tr><td><b>AN/AAQ-28 LITENING</b></td><td>36 km</td><td style="color:#00f5a0;">+18% Pk</td><td>25%</td><td>Standard laser designator and decoy spotter.</td></tr>
            <tr><td><b>Sapsan-E Optical Pod</b></td><td>42 km</td><td style="color:#00f5a0;">+20% Pk</td><td>30%</td><td>All-weather Flanker and Fullback optical targeter.</td></tr>
            <tr><td><b>AN/ASQ-228 ATFLIR</b></td><td>45 km</td><td style="color:#00f5a0;">+22% Pk</td><td>35%</td><td>Exposes both Radar Decoys and Thermal Mockups.</td></tr>
            <tr><td><b>Thales Damocles Pod</b></td><td>52 km</td><td style="color:#00f5a0;">+24% Pk</td><td>42%</td><td>Long-standoff European designator for Rafale and Tornado.</td></tr>
            <tr><td><b>AN/AAQ-33 Sniper XR</b></td><td>55 km</td><td style="color:#00f5a0;">+26% Pk</td><td>50%</td><td>Top precision boost and halves cloud laser scatter.</td></tr>
            <tr><td><b>AN/ASG-34 Legion Pod</b></td><td>58 km</td><td style="color:#00f5a0;">+20% Pk</td><td>35%</td><td>Combines passive A2A IRST stealth tracking + ground laser.</td></tr>
            <tr><td><b>RAPTOR / ATARS Recon</b></td><td>65 km</td><td style="color:#38bdf8;">+14% Pk</td><td>30%</td><td>Longest 65 km ground decoy and silent SHORAD scanner.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. PASSIVE AIR IRST, ELINT RECEIVERS &amp; ECM JAMMING PODS</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #00f0ff;">
          <b style="color:#00f0ff;">PASSIVE IRST &amp; ELINT PODS</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            &bull; <b>Skyward-G &amp; IRST21 Pods:</b> Give non-stealth fighters passive infrared air-to-air tracking (28 km stealth burn-through) that ignores RF jamming and cuts through 90&deg; Doppler notching.<br>
            &bull; <b>AN/ALQ-218 ELINT Pod:</b> Immediately maps radiating ground SAMs and radars out to <b>135 km</b> and extends Anti-Radiation Missile reach by <b>+15%</b>.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #c084fc;">
          <b style="color:#c084fc;">ECM JAMMING PODS (30% TO 60%)</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            &bull; <b>AN/ALQ-165 ASPJ (32%):</b> Internal 1-slot stealth jammer keeping VLO clean.<br>
            &bull; <b>ALQ-184 (30%), ALQ-131 (35%), Khibiny (38%), Sorbtsiya (42%):</b> Compact external self-protection pods (70 to 90 km).<br>
            &bull; <b>ALQ-99 (45%), SAP-14 (55%), ALQ-249 NGJ (60%):</b> Wide-area escort jammers blinding S-400s and enemy radars across 95 to 125 km.
          </div>
        </div>
      </div>

      <div class="ge-subhead">3. DECOYS, REPEATERS &amp; SAM BAIT SYSTEMS</div>
      <div class="ge-card" style="border-left:3px solid #fbbf24;">
        <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
          &bull; <b>ADM-160B MALD (2x) &amp; ADM-141C ITALD (4x):</b> Air-launched decoy gliders that mirror your aircraft radar signature ahead of your wing. Enemy pilots fall for decoys 35% to 100% of the time depending on difficulty, and Attack Mode SAMs waste missiles on ITALD gliders while exposing hidden battery positions.<br>
          &bull; <b>BriteCloud DRFM (4x), AN/ALE-55 FOTD (4x), AN/ALE-50 (6x), BOL-518 (8x):</b> Expendable and towed active RF repeaters expanding your onboard countermeasure pool to break active radar locks in multi-SAM killboxes.
        </div>
      </div>

      <div class="ge-subhead">4. CRITICAL STRIKE, SEAD &amp; SURVIVABILITY SUBSYSTEMS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SYSTEM UPGRADE</th><th>CATEGORY</th><th>TACTICAL IMPORTANCE</th></tr>
          </thead>
          <tbody>
            <tr><td><b>AN/APQ-174 Terrain Radar (TFR)</b></td><td>STRIKE</td><td>Below 10,000 ft, raises enemy SAM floor by +2,500 ft and cuts look-down detection by 25%. Vital for low-deck penetrators.</td></tr>
            <tr><td><b>AN/ASQ-213 HARM Targeting (HTS)</b></td><td>SEAD</td><td>+20% ARM range, +14% ARM Pk, and detects and classifies enemy ground emitters out to 130 km.</td></tr>
            <tr><td><b>Digital CCIP Strike Computer</b></td><td>STRIKE</td><td>+16% accuracy and +15% range for iron bombs, clusters, and rockets; cancels high-altitude dispersion penalty.</td></tr>
            <tr><td><b>Two-Way Weapons Datalink (MITL)</b></td><td>DATALINK</td><td>+14% accuracy for GPS glide bombs, cruise missiles, and INS standoff weapons; cuts jamming interference by 50%.</td></tr>
            <tr><td><b>DIRCM Infrared Jammer Turret</b></td><td>STEALTH</td><td>Blinds heat seekers: +24% evasion vs IR SHORAD and A2A IR missiles, plus +2 extra chaff charges.</td></tr>
            <tr><td><b>Titanium-Kevlar Belly Armor</b></td><td>ARMOR</td><td>+1 Max HP and reduces AAA flak and CIWS gun damage by 45% during low-altitude strafe passes.</td></tr>
            <tr><td><b>Conformal Ordnance Fairings</b></td><td>STRIKE</td><td>Cuts external pylon air-drag speed loss by 40% and reduces payload weight penalty by 20% for bomb trucks.</td></tr>
            <tr><td><b>Integrated Laser Spot</b></td><td>STRIKE</td><td>Built-in +15% A2G Pk and 35% cloud mitigation without spending an external weapon pylon.</td></tr>
            <tr><td><b>GaN AESA &amp; Adaptive ECCM</b></td><td>AVIONICS</td><td>+20% radar reach, halved track identification delay, and 60% resistance to enemy ECM jamming.</td></tr>
            <tr><td><b>RAM Coating &amp; DAS 360&deg;</b></td><td>STEALTH</td><td>-45% clean airframe RCS (RAM) and +10% passive all-aspect missile evasion (DAS).</td></tr>
            <tr><td><b>MADL Link &amp; TACAN Beacon</b></td><td>DATALINK</td><td>+0.10 Token/sec command regen per jet (MADL) and 50% faster RTB reload turnaround (TACAN).</td></tr>
          </tbody>
        </table>
      </div>
    `
  }
];
