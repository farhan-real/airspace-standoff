/**
 * js/data/manual/attack.js - Flight Manual Submodule: Section 11
 * Covers: Ground Attack Theater Rules, Objectives, Armor Classes, Secondary Blasts & A2G Ordnance
 */

window.MANUAL_ATTACK = [
  {
    id: 'ch11_ground_objectives',
    title: 'SECTION 11: GROUND OBJECTIVES, ARMOR CLASSES & A2G ORDNANCE',
    desc: `
      <div class="ge-desc">
        <b>SINGLE PLAYER ATTACK</b> shifts operations to an expanded <b>240 km &times; 160 km</b> ground combat theater defended by interconnected surface radar networks, layered SAM belts, CIWS point defense, low-altitude AAA flak, and active multi-segment airbases.
      </div>

      <div class="ge-subhead">1. VICTORY OBJECTIVES &amp; STRATEGIC VALUE</div>
      <div class="ge-grid-2">
        <div class="ge-card" style="border-left:3px solid #ffd700;">
          <b style="color:#ffd700;">PRIMARY OBJECTIVES [OBJ]</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Strategic targets marked with gold <b>[OBJ]</b> brackets (C2 Bunkers, Multi-Segment Runways, Hardened Aircraft Shelters, Supply Bridges, SAM Assembly Plants) must all be destroyed or neutralized to win the sortie.
          </div>
        </div>
        <div class="ge-card" style="border-left:3px solid #38bdf8;">
          <b style="color:#38bdf8;">SUPPORTING IADS &amp; LOGISTICS NODES</b>
          <div style="font-size:0.72rem;color:#cbd5e1;line-height:1.45;">
            Secondary sites (EW Radars, Power Substations, Comms Towers, Fuel Depots, Munition Dumps, Logistics Hubs) are optional to win, but knocking them out cripples enemy SAM accuracy, cuts jamming power, slows scrambles, and triggers secondary explosions!
          </div>
        </div>
      </div>

      <div class="ge-subhead">2. GROUND ARMOR CLASSES &amp; EXACT DAMAGE MULTIPLIERS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ARMOR CLASS</th><th>TYPICAL INSTALLATIONS</th><th>WEAPON PENETRATION &amp; DAMAGE MULTIPLIERS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style="color:#00f5a0;font-weight:800;">SOFT</td>
              <td>EW Radars, Mobile Vans, Strela/Rapier/Kub, Shilka, 57mm Flak, Fuel Depots, Open Pads, Comms, Power Nodes, Decoys</td>
              <td>Takes <b>100% full damage</b> from every A2G weapon, unguided rocket, cluster submunition, and autocannon burst.</td>
            </tr>
            <tr>
              <td style="color:#fbbf24;font-weight:800;">ARMORED</td>
              <td>S-400, Patriot, S-300V4, HQ-9B, Buk-M3, NASAMS, Tor-M2, CIWS, Gepard, Tunguska, Hangars, Munition Dumps, Logistics Hubs</td>
              <td><b>100% damage</b> from ATGMs, Precision Bombs, Cruise Missiles, ARMs, heavy CAS cannons (GAU-8, GSh-6-30, GSh-30-2, GAU-13, BK-37), or AP &ge; 0.70 weapons. Takes <b>65% damage</b> from light rockets and basic cluster fragments.</td>
            </tr>
            <tr>
              <td style="color:#f43f5e;font-weight:800;">FORTIFIED</td>
              <td>Command Bunkers (18 HP), Runways (7 HP/seg), Hardened Shelters (10 HP), Radomes (13 HP), Supply Bridges (9 HP)</td>
              <td>Deflects <b>80%</b> of light rockets and fragments (0.20x damage), or <b>50%</b> for mid-AP weapons and heavy 30mm rotary cannons. Use <b>Bunker Penetrators</b> (1.0x full damage) or <b>Anti-Runway</b> bombs (<b>2.0x vs Runways</b>)!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">3. SECONDARY EXPLOSIONS &amp; NETWORK SABOTAGE EFFECTS</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>SUPPORT FACILITY</th><th>BLAST RADIUS &amp; DAMAGE</th><th>NETWORK SABOTAGE ON DESTRUCTION</th></tr>
          </thead>
          <tbody>
            <tr><td><b>Strategic Fuel Depot</b></td><td>6.0 km Blast (-5 HP nearby)</td><td>Slows nearby airbase QRA launch cadence by <b>+35%</b> delay.</td></tr>
            <tr><td><b>Forward Munition Depot</b></td><td>7.5 km Blast (-6 HP nearby)</td><td>Increases nearby SAM reload and rack-replenish times by <b>+80%</b> and cuts new QRA missile loadouts!</td></tr>
            <tr><td><b>Airbase Logistics Hub</b></td><td>4.5 km Blast (-4 HP nearby)</td><td>Eliminates the 18% airfield QRA launch speedup bonus.</td></tr>
            <tr><td><b>Grid Power Substation</b></td><td>None</td><td>Cuts nearby Krasukha-4 ground jammer strength by <b>55%</b>.</td></tr>
            <tr><td><b>C4I Comms Relay &amp; C2 Bunker</b></td><td>None</td><td>Breaks long-range EW radar cueing to SAMs (135 km to 90 km) and slows SAM reactions by <b>+40%</b>.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="ge-subhead">4. AIR-TO-GROUND ORDNANCE CLASSES &amp; DELIVERY RULES</div>
      <div class="table-scroll-wrapper">
        <table class="ge-table">
          <thead>
            <tr><th>ORDNANCE CLASS</th><th>EXAMPLES</th><th>RANGE &amp; STRENGTHS</th><th>TACTICAL LIMITATIONS &amp; COUNTERS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><b style="color:#f97316;">Unguided Iron &amp; Rockets</b></td>
              <td>OFAB-250, Mk-82/83/84, FAB-500/1500/3000, Hydra-70, S-8, CRV7-MPSM, Zuni, S-13/24, S-25OFM</td>
              <td>11 - 18 km rocket reach; immune to ECM jamming and chaff; high blast per credit and fast salvo clearing.</td>
              <td>Dropping unguided bombs above <b>26,000 ft</b> without a CCIP computer or TGP lowers hit accuracy by <b>-18%</b>. Requires low-to-mid ingress inside SAM rings.</td>
            </tr>
            <tr>
              <td><b style="color:#fbbf24;">Cluster Dispensers</b></td>
              <td>CBU-87, CBU-97, CBU-105, RBK-500, PTAB, JSOW-A</td>
              <td>15 - 74 km reach. <b>5.5 - 7.0 km splash radius</b> wipes out clustered SAMs, AAA, and jets taxiing on ground!</td>
              <td>Submunitions deal reduced 25% damage against Fortified concrete bunker roofs.</td>
            </tr>
            <tr>
              <td><b style="color:#38bdf8;">Glide Bombs &amp; SDBs</b></td>
              <td>UMPK, JDAM (GBU-31/32/38), GBU-39, StormBreaker, SPEAR-3, JSOW-C</td>
              <td>26 - 78 km standoff. Compact internal bay saturation (up to 8x per pylon) and all-weather GPS/MMW precision.</td>
              <td>Subsonic glide speed (Mach 0.78 - 0.90) allows <b>SeaRAM, Pantsir &amp; Tor-M2</b> to intercept single drops; launch in multi-bomb salvos!</td>
            </tr>
            <tr>
              <td><b style="color:#00f5a0;">Laser, Runway &amp; Bunker Bombs</b></td>
              <td>GBU-10/12/16/24/28, KAB-250/500/1500L, Paveway IV, GBU-54/57, Durandal, JP233, TAURUS</td>
              <td>13 - 115 km. Pinpoint concrete penetration (up to 28 HP) and <b>2.0x damage to Runways</b> on Durandal, BetAB, and JP233.</td>
              <td>Pure laser bombs lose <b>-20% Pk per cloud cell</b> unless mitigated by a Targeting Pod or dual-mode GPS (Paveway IV, GBU-54).</td>
            </tr>
            <tr>
              <td><b style="color:#c084fc;">Heavy CAS Guns, Pods &amp; ATGMs</b></td>
              <td>GAU-8, GSh-6-30, GSh-30-2, GAU-13, GAU-12, BK-37, GSh-30-2K, Hellfire, JAGM, Maverick, Brimstone II, Kh-38ML</td>
              <td>4.4 - 6.0 km AP cannons (1.55x - 2.0x ground damage) and 14 - 42 km ATGMs. Fast CAS jets (MiG-27K, A-16, F-16XL, Su-39) and A-10C shred armored SAMs and AAA!</td>
              <td>Requires closing inside AAA/SHORAD envelopes; pair with high speed, Kevlar Belly Armor, and ECM/TFR masking.</td>
            </tr>
            <tr>
              <td><b style="color:#00f0ff;">ARMs, Cruise &amp; Loitering</b></td>
              <td>Shrike, MAR-1, Martel, Kh-31P, HARM, AARGM-ER, ALARM-II, Kh-58UShKE, JASSM-ER, LRASM, BrahMos, Kinzhal, Harop</td>
              <td>34 - 145 km reach. ARMs deal <b>3x damage</b> to active radars; Mach 3 - 6.2 cruise strikes outrun CIWS; Anti-EMCON ARMs kill shut-down radars.</td>
              <td>Legacy ARMs lose track on EMCON shutdowns. Subsonic stealth cruise missiles can still be intercepted by CIWS if fired solo.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];
