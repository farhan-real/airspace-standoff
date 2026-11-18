/**
 * AIRSPACE STANDOFF: Flight Manual Submodule: Section 09
 * Covers: Air Combat Fleet Doctrines vs. Ground Attack Defense Doctrines and Tactical Counters
 */

window.MANUAL_DOCTRINES = [
  {
    id: 'ch9_doctrines',
    title: 'SECTION 09: AIR COMBAT & GROUND ATTACK DOCTRINES',
    desc: `
      <div class="ge-desc">
        <b>Doctrines</b> govern how the entire opposing squadron or theater defense network operates as a coordinated force. Unlike individual <b>Aircraft Roles</b> (which control whether a single jet acts as a Sniper, Dogfighter, or Strike aircraft), a Doctrine shapes force selection, equipment choices, approach routing, firing thresholds, radar discipline, and retreat habits across the whole enemy command.
      </div>

      <div class="ge-subhead">1. AIR COMBAT DOCTRINES (SKIRMISH &amp; DYNAMIC THEATER)</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>AIR DOCTRINE</th><th>FORCE COMPOSITION</th><th>AI BEHAVIOR &amp; TACTICS</th><th>HOW TO COUNTER</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Balanced</td>
              <td>Standard difficulty mix of fighters, stealth, and EW.</td>
              <td>Uses individual aircraft roles, standard BVR ranges, and balanced missile discipline.</td>
              <td>Use balanced multi-layer tactics and target flight leads first.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Aggressive Rush</td>
              <td>Fast interceptors, agile dogfighters, gunpods, and WVR rails.</td>
              <td>Charges straight in at high throttle (+16% speed push), fires early at lower Pk thresholds, fires heavier salvos, and rarely retreats.</td>
              <td>Hold standoff distance, kite backward while firing long-range BVR, and drain their energy as they chase.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Long-Range Standoff</td>
              <td>Heavy missile carriers, ramjet Meteors, ULR missiles, AESA cores.</td>
              <td>Climbs +6,000 ft higher, fires early at extended range, cranks 60&deg; off boresight, turns away under 44 km, and notches aggressively.</td>
              <td>Use stealth wings, terrain-skimming approaches, or fast supercruisers to close inside 40 km where they try to drag away.</td>
            </tr>
            <tr>
              <td style="color:#a855f7;font-weight:800;">Stealth Ambush</td>
              <td>Stealth airframes with clean internal bays, RAM, and silent IR missiles.</td>
              <td>Routes along north and south edges at low cruise throttle (-8% thermal bloom) and holds fire until high-Pk broadside angles.</td>
              <td>Sweep the outer north and south corridors with high-power GaN AESA radars, IRST pods, and AEW/Uplink eyes.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Drone Swarm</td>
              <td>High ratio of unmanned UCAVs, MAM micro-missiles, and MALD decoys.</td>
              <td>Sends wide drone waves ahead of manned leads, launches MALD decoys at 68 km, fires rapid salvos, and never RTBs.</td>
              <td>Ignore obvious decoys, use high-capacity cannons or A2A gunpods and ADMMs to shred cheap drones, and snipe manned leads.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Electronic Jamming</td>
              <td>Up to 2 EW escorts (Growlers, J-16Ds, EA-36s) with heavy ECM pods.</td>
              <td>Holds EW jammers in a central 36-54 km umbrella while escorts screen ahead; focuses fire on your sensors and deploys extra chaff.</td>
              <td>Mount Adaptive ECCM and IRST pods (immune to jamming), and fire fast BVR volleys directly at EW jammers first.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Defensive Hold</td>
              <td>Durable fighters with extra chaff, Titanium armor, and RTB beacons.</td>
              <td>Orbits near friendly base SAM/jammer cover, holds missiles for high-Pk shots (+10%), notches hard, and RTBs early to rearm.</td>
              <td>Suppress their base radars, isolate fighters away from SAM cover, or coordinate mixed ARH and IR salvos.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">2. GROUND ATTACK DEFENSE DOCTRINES (240x160 IADS THEATER)</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ATTACK DOCTRINE</th><th>EXTRA DEFENSES DEPLOYED</th><th>IADS &amp; AIRBASE BEHAVIOR</th><th>BEST STRIKE COUNTER</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#38bdf8;font-weight:800;">Balanced Defense</td>
              <td>Standard difficulty layout.</td>
              <td>Normal layered SAM engagement range, moderate EMCON shutdowns, and steady QRA launches.</td>
              <td>Mixed SEAD escort + precision strike flight.</td>
            </tr>
            <tr>
              <td style="color:#a855f7;font-weight:800;">Silent Radar Ambush</td>
              <td>+1 Passive Optical or IR SHORAD, +1 Decoy Emitter.</td>
              <td>SAMs hold fire until you fly deeper into kill range (-16% ambush gate); radars shut off fast (+20% EMCON) when ARMs approach; CAP flanks wide.</td>
              <td>Equip Sniper XR or ATFLIR Targeting Pods + Anti-EMCON ARMs (AGM-88G, Kh-58UShKE) + ITALD bait gliders.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">Fast Air Scramble</td>
              <td>+1 Airborne CAP Interceptor at mission start.</td>
              <td>Airfields launch QRA fighters 35% faster, scramble in pairs more often (+25%), and push interceptors aggressively forward.</td>
              <td>Bring A2A escorts and crater the middle runway segments early to trap reserve jets on the ground.</td>
            </tr>
            <tr>
              <td style="color:#00f0ff;font-weight:800;">Heavy SAM Wall</td>
              <td>+1 LR SAM, +1 MR SAM, +1 EW Surveillance Radar.</td>
              <td>SAM batteries reload 22% faster and fire early at full maximum range while keeping radars active.</td>
              <td>Use low-altitude TFR terrain masking beneath SAM floors, standoff cruise missiles, and SEAD HARM waves.</td>
            </tr>
            <tr>
              <td style="color:#c084fc;font-weight:800;">Heavy Jamming Shield</td>
              <td>+1 Ground Broadband Jammer, +1 Power Substation, +1 Decoy.</td>
              <td>Ground jammers emit 25% stronger microwave noise (up to 85% cap), degrading radar locks and guided ordnance.</td>
              <td>Strike Power Substations first (cuts jamming by 55%), or use unguided CCIP bombs, rockets, and laser/IR pods.</td>
            </tr>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">Tight Base Defense</td>
              <td>+1 CIWS Turret and +1 Tor SHORAD around objectives.</td>
              <td>CIWS intercepts incoming bombs and cruise missiles 20% faster and +14% more accurately; CAP orbits directly over objectives.</td>
              <td>Overwhelm CIWS with multi-bomb salvos (SDBs, cluster dispensers) or fire supersonic/hypersonic Mach 3+ strikes.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">Low-Altitude Flak Belt</td>
              <td>+2 AAA Flak Batteries and +1 Gap-Filler Radar.</td>
              <td>AAA fires 28% faster with +15% hit accuracy, while Gap-Filler strips low-altitude horizon masking.</td>
              <td>Equip Kevlar Belly Armor (-45% flak damage), stay above 16,500-22,000 ft AAA ceilings, or clear AA with cluster bombs.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];
