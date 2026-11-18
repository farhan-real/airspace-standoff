# Airspace Standoff

[![Platform](https://img.shields.io/badge/PLATFORM-DESKTOP_%7C_MOBILE_%7C_TABLET_%7C_ANDROID-10b981?style=for-the-badge)](#controls--platform-support)
[![Dependencies](https://img.shields.io/badge/DEPENDENCIES-ZERO-6366f1?style=for-the-badge)](#technology-stack)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](./LICENSE)

---

**Air superiority and deep strike dominance are won through sensor geometry, energy management, and tactical doctrine.**

Modern air warfare is decided long before visual contact. Across contested skies and multi-layered ground defense belts, battles turn on microwave radar physics, aspect exposure, proportional-navigation missile kinematics, electronic countermeasures, and coordinated wing execution.

Stationed at a high-contrast C4ISR tactical radar terminal, you command a custom air wing of up to 16 aircraft across **150 km × 100 km** air-combat theaters and **240 km × 160 km** integrated air-defense strike zones. Manage payload drag, optimal corner speeds, radar emissions, external targeting pods, and doctrinal counters while every projectile, radar beam, SAM battery, runway strip, and AI focus slot runs on transparent, inspectable physics.

Play online at [airspace-standoff.pages.dev](https://airspace-standoff.pages.dev/) or [farhan-real.github.io/airspace-standoff](https://farhan-real.github.io/airspace-standoff/)

---

## Table of Contents

1. [At a Glance](#at-a-glance)
2. [Game Modes & Operational Theaters](#game-modes--operational-theaters)
3. [Special & Unique Behaviors (Beyond Raw Stats)](#special--unique-behaviors-beyond-raw-stats)
   * [Ground Unit Behaviors](#ground-unit-behaviors)
   * [Aircraft Behaviors](#aircraft-behaviors)
   * [Missile, Cannon & Pod Behaviors](#missile-cannon--pod-behaviors)
4. [Core Simulation Mechanics](#core-simulation-mechanics)
   * [1. Radar Physics, Classification & Rules of Engagement (RoE)](#1-radar-physics-classification--rules-of-engagement-roe)
   * [2. Flight Kinematics & Energy Management](#2-flight-kinematics--energy-management)
   * [3. Proportional Navigation, Salvos & Maneuver Deck](#3-proportional-navigation-salvos--maneuver-deck)
5. [AI Behavior, Cognitive Limits & Doctrines](#ai-behavior-cognitive-limits--doctrines)
   * [Cognitive & Tactical AI Behaviors](#cognitive--tactical-ai-behaviors)
   * [Separated Fleet & Defense Doctrines](#separated-fleet--defense-doctrines)
6. [Ground Attack Mode & Complete Ground Units Catalog](#ground-attack-mode--complete-ground-units-catalog)
   * [Runways, Armor Classes & Airbase Mechanics](#runways-armor-classes--airbase-mechanics)
   * [Complete Ground Units Catalog (44 Installation Types)](#complete-ground-units-catalog-44-installation-types)
7. [Difficulty Scaling & Scoring](#difficulty-scaling--scoring)
8. [Hangar Procurement, Airframes, Pods & Subsystems](#hangar-procurement-airframes-pods--subsystems)
   * [73 Airframes Across 8 Disciplines](#73-airframes-across-8-disciplines)
   * [Hardpoints, External Pods & Modular Systems](#hardpoints-external-pods--modular-systems)
9. [Mission Editor, Live Inspection Suite & Post-Sortie Analytics](#mission-editor-live-inspection-suite--post-sortie-analytics)
10. [Controls & Platform Support](#controls--platform-support)
    * [Desktop Keybinds (Fully Rebindable in Settings)](#desktop-keybinds-fully-rebindable-in-settings)
    * [Mobile, Tablet & Android Support](#mobile-tablet--android-support)
11. [Technology Stack](#technology-stack)
12. [How to Run](#how-to-run)
13. [License](#license)

---

## At a Glance

| Domain | Scope | Simulation Implementation |
| :--- | :--- | :--- |
| **Game Modes** | 4 Distinct Modes | 1P Skirmish, 2P Versus, 1P Dynamic Theater Waves, 1P Ground Attack |
| **Theater Grid** | 150×100 km & 240×160 km | Altitude flight levels from FL010 (1,000 ft) to FL650 (65,000 ft) |
| **Aircraft Roster** | 73 Airframes + 80+ Presets | Stealth, Superiority, Multirole, Strike, EW, UCAV Drones, Experimental & COFFIN |
| **Ordnance & Pods** | 95+ Weapons, Guns & Pods | ProNav missiles, A2G bombs, rockets, ARMs, cruise, DEW lasers, railguns & TGPs |
| **Ground IADS** | 44 Surface Installation Types | VHF & gap-filler radars, LR/MR/SR SAMs, CIWS, hybrid AAA, decoys & 5-seg runways |
| **Doctrines & Tiers** | 14 Doctrines & 20 Difficulty Tiers | 7 Air Combat + 7 Attack Defense Doctrines across 10 Air & 10 Attack threat tiers |
| **Budget Flexibility** | 9 Defense Budget Tiers | $200M Austerity (1.75× VP) to $1,000M Maximum Surge (0.40× VP), up to 16 units |
| **Analysis & Archive** | Inspection, Replay & Manual | Live 6-tab C4ISR inspector with 5 telemetry graphs, sortie replay & 17-chapter manual |

---

## Game Modes & Operational Theaters

1. **Single Player Skirmish (150 km × 100 km):** Head-to-head tactical air battle between your custom squadron and a procedurally drafted adversary wing shaped by your chosen difficulty tier and Air Combat Doctrine.
2. **Two Player Skirmish (150 km × 100 km):** Competitive hotseat versus mode deploying identical cloned rosters in randomized formation orders for parity, with live Blue and Red command switching and pre-identified contacts.
3. **Single Player Dynamic Theater (150 km × 100 km):** Endurance air-combat scenario where allied and hostile reinforcement waves enter the theater every 80 seconds across escalating waves (up to Wave 4).
4. **Single Player Attack (240 km × 160 km):** Deep strike operations against a layered Integrated Air Defense System (IADS). Neutralize all Primary Strategic Objectives marked `[OBJ]`—underground C2 bunkers, 5-segment military runways, hardened aircraft shelters, logistics bridges, and SAM assembly plants—while countering scrambling airbase QRA interceptors.

---

## Special & Unique Behaviors (Beyond Raw Stats)

Equipment, aircraft, and ground sites in *Airspace Standoff* do not just shift spreadsheet numbers—they execute distinct mechanical behaviors inside the physics and AI engines:

### Ground Unit Behaviors
* **VHF Counter-Stealth (`Nebo-M`):** Long-wave radar uses separate fourth-root stealth scaling (`pow(rcs, 0.45) × 2.8`), stripping away VLO stealth invisibility across the sector until neutralized.
* **Gap-Filler Altitude Cueing (`96L6-1` & `Giraffe AMB`):** While alive, low-altitude gap-fillers automatically lower neighboring LR SAM engagement floors (`S-400` drops from `6,500 ft` to `3,500 ft`; `Patriot` drops to `2,500 ft`), defeating terrain-masking approaches until destroyed.
* **Independent Fire Control (`Buk-M3` vs. `S-400` / `S-300V4` / `Patriot`):** Long-range strategic SAMs lose **52% range** if sector EW radars and Comms Relays go down; `Buk-M3` carries an organic TELAR radar and keeps firing at full `46 km` reach completely un-cued.
* **True Passive Emitters (`Rapier Optical`, `Strela-10M`, `Avtobaza ELINT`):** Emit zero RF radiation, trigger zero RWR alerts in your cockpit, and cannot be locked by Anti-Radiation Missiles.
* **EMCON Shutdown Traps:** Active emitting SAMs and EW radars detect incoming ARMs at `24–34 km` and shut down emissions for 8–14 seconds. Legacy ARMs (`Shrike`, `AGM-88C`, `Kh-31P`) immediately lose lock (`RADAR EMCON SHUTDOWN`), while Anti-EMCON ARMs (`AGM-88E/G`, `Kh-58UShKE`, `ALARM-II`, `HAROP-AL`) remember coordinates and strike anyway.
* **Multi-Role Hybrid Turrets (`Pantsir-S1` & `2K22M Tunguska`):** `Pantsir-S1` intercepts incoming SDBs/cruise missiles while firing twin 30mm guns at low aircraft; `Tunguska` combines `11.5 km` optical SHORAD missiles, `6.5 km` twin 30mm flak, and `45%` glide-bomb interception.
* **Power & Logistics Dependencies:** Knocking out `Grid Power Substations` drops nearby `Krasukha-4` jammer output by **55%**. Destroying `Fuel Depots` (`6 km` secondary blast) slows QRA launches by `+35%`; destroying `Munition Dumps` (`7.5 km` blast) increases SAM reload times by `+80%` and restricts QRA missile loads; `Logistics Hubs` (`4.5 km` blast) boost QRA launch speed by `18%` while intact.
* **Active Runway Taxi, Takeoff Rolls & Decoy Tiers:** QRA fighters physically **taxi** out of shelters/hangars/open pads and accelerate down contiguous runway slices—cratering their active roll segments destroys launching jets on the ground! Meanwhile, `DECOY_THERMAL` sites emit heat and RF spoofs that fool standard Targeting Pods (`LITENING`/`LANTIRN`), requiring `45 km+` pods (`ATFLIR`, `Damocles`, `Sniper XR`, `Legion`, `TARPS`) or `<15 km` flybys to expose.

### Aircraft Behaviors
* **COFFIN Synthetic Vision (`F-15 S/MT`, `Su-37 [COFFIN]`, `F-22C`, `ADF-11F`):** Bypass aerodynamic corner-speed penalties (**100% turn authority locked at any speed**), accumulate **zero G-stress** (immune to Tunnel Vision and G-LOC blackouts), and apply passive `+24% to +30%` evasive dodge.
* **Unmanned UCAVs & Swarm Immunity:** Immune to biological G-LOC up to **20G**, launch off single **1-segment** runway fragments, and gain total immunity to EW radar jamming when fitted with the `Swarm AI Coprocessor`.
* **3D Thrust-Vectoring (`Su-35S`, `Su-37`, `Su-57`, `F-22A`, `X-02S`, `CFA-44`):** Physically unlock the `Pugachev's Cobra` (`+55%` evasion brake) maneuver card—locked out on conventional aircraft—and multiply base turn agility by `1.20×`.
* **Thermal Exhaust Suppression vs. Afterburner Plumes:** Trough-shielded airframes (`B-21` `0.35×`, `B-2A` `0.38×`, `F-117A` `0.42×`, `YF-23` `0.45×`) actively mask infrared emissions against IIR/EO missiles, whereas twin-reheat interceptors (`MiG-31BM` `1.50×`, `Tu-160M` `1.60×`) amplify enemy IR lock probabilities.
* **Armor & Cannon Deflection (`Strike` & `Flight Lead`):** Dedicated `Strike` aircraft (`A-10C`, `Su-25SM3`, `Su-34`) deflect `40%–50%` of autocannon fire and `35%` of AAA flak damage; `Flight Leads` unlock category-tailored suites (e.g., Stealth `-50%` beam spike, Multirole rapid RTB, Strike `-1` missile damage).
* **Hypersonic High-Altitude Cruise (`DARKSTAR`):** Deploys at **58,000 ft** and cruises at **Mach 2.40+**, overflying medium SAM envelopes while demanding wide 5.0G turns.
* **Dynamic Rack Jettison:** External weapons physically contribute parasite speed drag and RCS bloom until expended (`ammoFraction`), restoring clean flight speed as missiles leave the rails.

### Missile, Cannon & Pod Behaviors
* **Dual-Pulse Terminal Surge (`PL-15E`, `Astra Mk2`, `R-77M`, `I-Derby ER`):** Coast after Stage 1 burnout, then fire a **Stage 2 pulse inside 22 km** (`+0.90 Mach` surge and `+18%` kinetic retention) to defeat late notch/break maneuvers.
* **Zero-Decay Ramjets (`Meteor`, `Astra Mk3`, `AIM-152`, `BrahMos-A`):** Sustain peak Mach across maximum reach without aerodynamic drag bleed (`lambda ~ 0.04`), denying range-bleed escapes.
* **Hypersonic Stratospheric Lofting (`Kinzhal`, `R-37M`, `Kh-32`):** Climb toward `alt = 0.95` during midcourse before diving terminally at **Mach 4.6–6.2**, outrunning CIWS interception (`Mach 5.0+` cannot be intercepted by CIWS).
* **180° Rearward & Sphere Launches (`Python-5`, `ADMM`):** Full-sphere optical seekers fire backwards over your shoulder at pursuing bandits without requiring you to turn your nose.
* **Area Shockwaves & Runway Heavers (`MPBM`, `CBU`, `JP233`, `Durandal`):** `MPBM` triggers an **8.5 km thermobaric AOE** hitting nearby aircraft; Cluster dispensers splash **4.5–7.0 km** to kill grouped defenses AND taxiing jets; `BLU-107`, `BetAB-500ShP`, and `JP233` inflict **2.0× structural damage on runways**.
* **Concealed Stealth & Passive RF Trajectories:** Low-RCS missiles (`AIM-260`, `JASSM-ER`, `LRASM`, `JSOW-C`) halve AI defensive reaction distances and reduce CIWS intercept rates by 45%; Passive ARMs remain stealth-concealed on radar for their first **3.2 seconds**.
* **Directed Energy vs. Ballistic Cannons:** `PLSL`, `DE-Pulse`, and `TLS` fire hitscan speed-of-light beams that spike host thermal bloom (`1.4×–1.7×`) and lose power in clouds (`-45%` to `-80%`), while ballistic cannons apply kinetic pilot concussion stress and punch through overcast.

---

## Core Simulation Mechanics

### 1. Radar Physics, Classification & Rules of Engagement (RoE)

* **Fourth-Root Radar Range Equation:** Detection envelopes update every simulation tick using `R_detect = R_0 × (RCS / 1.0)^0.25 × K_aspect × K_clutter × K_weather × K_jamming`. Cutting RCS by 10,000× shrinks detection reach by 90%.
* **Aspect & Beam Exposure Spikes:** Nose-on silhouettes stay minimal. Banking 90° broadside multiplies radar return by `1.8× to 4.8×`, exposing stealth fighters during careless perpendicular turns.
* **Weather Clouds & False Ghost Echoes:** Drifting cloud cells attenuate radar by **-4% per cell**, scatter unmitigated laser bombs (`-20% Pk` per cell) and optical seekers (`-12% Pk`), and create temporary **Ghost Contacts** (`BOGEY [?]`) that dissolve under scanning.
* **Two-Phase Identification & Strict RoE:** Contacts appear as unverified `BOGEY [?]` tracks until scanned for **5.5s** (**11.0s** for stealth) or burned through inside **18 km** (**28 km** with IRST). Firing on an unverified bogey costs **-600 VP**; hitting a civilian airliner costs **-500 VP**, and destroying one costs **-2,000 VP**.
* **Orbital Satellite Radar Uplink:** In air-combat modes, when 3 or fewer hostile aircraft survive, orbital tracking pinpoints remaining targets directly onto radar regardless of stealth or clouds.

### 2. Flight Kinematics & Energy Management

* **Optimal Corner Velocity (`sOpt`):** Flying within ±12% of `sOpt` delivers **100% turn authority**. Overspeeding widens turns; underspeeding starves lift down toward 40%.
* **Four Throttle Detents:** Step across **IDLE** (`0.70×` thermal bloom), **CRUISE** (`1.0×` standard), **MIL POWER** (dry thrust climb), and **AFTERBURNER** (`1.45×` thermal plume).
* **Pilot G-Load vs. COFFIN:** Exceeding `0.65` stress causes **Tunnel Vision** (`-30%` turn efficiency, `-25%` maneuver defense); reaching `0.95` triggers a **2.8-second G-LOC Blackout**.
* **RTB & Turnaround:** Ordering Return to Base (`[R]`) returns friendly aircraft to `x ≤ 32 km` for full HP repair and full ammo/chaff/decoy replenishment in `3.5s` (`1.8s` with TACAN Beacon).

### 3. Proportional Navigation, Salvos & Maneuver Deck

* **True ProNav Guidance:** Missiles steer via `a_n = N · V_c · λ_dot` with realistic turn-rate caps (`1.4–3.8 rad/s`), kinetic drag decay, and overshoot loss (`KINETIC OVERSHOOT`).
* **Salvo & Mixed-Seeker Synergy:** Multi-missile salvos boost Pk (`+12%` per extra missile, up to `+30%`) and saturate CIWS cooldowns. Mixing Radar (`ARH`) + Infrared (`IIR/EO`) seekers triggers a **+25% Mixed-Seeker Dilemma** cutting target evasion by 45%.
* **Command Token Maneuver Deck:** Regenerates at `2.5 + 0.25 × live aircraft + MADL bonuses` up to `8.0`. Trigger `Doppler Notch & Chaff (+48%)`, `High-G Barrel Roll (+45%)`, `Pugachev's Cobra (+55%)`, `Split-S Dive (+45%)`, `Emergency Chaff Salvo (+42%)`, and `Zoom Climb (+38%)`.

---

## AI Behavior, Cognitive Limits & Doctrines

### Cognitive & Tactical AI Behaviors

* **Finite Attention Slots:** Enemy commanders allocate **1 slot** (Permissive to Contested), **2 slots** (Escalated to High-Threat), or **3 slots** (Fortified to Extreme Threat), prioritizing inbound threats, damaged jets, locks, and Aces. Unfocused aircraft fly standby patrol (`0.55×` steering authority, `0.60–0.82×` reaction distance).
* **Chain-of-Command Disruption:** Eliminating the enemy Flight Lead triggers **1.8s to 6.0s of hesitation** across surviving wingmen (weapons hold, 40% throttle) until succession completes.
* **2-Ship Element Pairing & Retreat Posture:** High-tier squads fly `PINCER_BRACKET`, `HIGH_LOW_BRACKET`, and `CROSSFIRE_PAIRS` (`4.5–7.0 km` offsets), fall back into `DEFENSIVE_HOLD` under friendly SAM/jammer cover when depleted (`25%–55%` survival), and execute tier-scaled RTB preservation (`15%–90%`).
* **10 Individual Tactical Roles:** `Standoff Sniper`, `High-Speed Interceptor`, `WVR Dogfighter`, `Swarm Flight Screen`, `Formation Escort`, `Stealth Ambush`, `Strike Interdiction`, `SEAD Escort`, `Air Dominance Sweep`, and `Command Flagship (Ace Cadre)`.

### Separated Fleet & Defense Doctrines

Doctrines are separated between **Air Combat** and **Ground Attack** and govern the entire opposing force:

<details>
<summary><b>Click to expand All 7 Air Combat Doctrines & 7 Attack Defense Doctrines</b></summary>
<br>

#### Air Combat Doctrines (Skirmish & Dynamic Theater)
| Doctrine | Force Selection & Loadouts | Live Tactical Behavior |
| :--- | :--- | :--- |
| **Balanced** | Standard difficulty mix of airframes & weapons. | Standard BVR range, role-driven positioning, normal Pk thresholds & RTB pacing. |
| **Aggressive Rush** | Fast interceptors, agile dogfighters, WVR & gunpods. | High throttle push (`+16%`), closes to `12 km`, lowers Pk gate (`-6%`), larger salvos, low RTB. |
| **Long-Range Standoff** | Heavy BVR carriers, ULR missiles, Meteors & AESA. | Climbs `+6,000 ft`, cranks 60° at `44–68 km`, kites away under `44 km`, high notching. |
| **Stealth Ambush** | High stealth ratio, clean internal bays, RAM & IR missiles. | Routes along north/south map edges at cool cruise (`-8%` heat), holds for high-Pk (`+6%`) shots. |
| **Drone Swarm** | Massed UCAV waves, MAM micro-missiles & MALD decoys. | Pushes wide drone screens ahead of manned leads, deploys MALDs at `68 km`, ignores RTB. |
| **Electronic Jamming** | Up to 2 EW aircraft with heavy ECM pods & ARMs. | Holds jammers in a `36–54 km` umbrella while fighters screen ahead; targets enemy sensors & EW. |
| **Defensive Hold** | Durable fighters, extra chaff, Titanium armor & RTB beacons. | Orbits inside home base cover until attackers cross mid-map, demands `+10%` Pk, RTBs early. |

#### Ground Attack Defense Doctrines (240×160 km IADS)
| Doctrine | Extra Ground & Air Deployments | Live IADS & Airbase Behavior |
| :--- | :--- | :--- |
| **Balanced Defense** | Standard tier defense layout. | Normal SAM envelopes, moderate EMCON shutdown discipline, steady QRA scramble cadence. |
| **Silent Radar Ambush** | +1 Passive Optical/IR SHORAD, +1 Decoy site. | Holds SAM fire deeper inside envelope (`-16%`), `+20%` EMCON shutdown chance at `34 km`, flanking CAP. |
| **Fast Air Scramble** | +1 Airborne CAP Fighter at mission start. | `35%` faster airbase scramble timers, `+25%` pair-launch chance, aggressive forward CAP intercepts. |
| **Heavy SAM Wall** | +1 LR SAM, +1 MR SAM, +1 EW Surveillance Radar. | `22%` faster SAM reload cycles, fires early at maximum range, keeps guidance radars active. |
| **Heavy Jamming Shield** | +1 Ground Broadband Jammer, +1 Substation, +1 Decoy. | Boosts ground jammer suppression by `+25%` (up to `85%` cap), blinding radars and guided bombs. |
| **Tight Base Defense** | +1 CIWS Turret & +1 Tor SHORAD around objectives. | `+14%` CIWS intercept accuracy and `20%` faster CIWS cycles; CAP orbits tightly over objectives. |
| **Low-Altitude Flak Belt** | +2 AAA Flak Guns & +1 Gap-Filler Radar. | AAA fires `28%` faster with `+15%` hit accuracy while Gap-Filler strips low-altitude horizon masking. |

</details>

---

## Ground Attack Mode & Complete Ground Units Catalog

### Runways, Armor Classes & Airbase Mechanics

* **5-Segment Runways (3,500 m):** Every airbase operates five `700 m` concrete segments (`7 HP Fortified` each). Contiguous intact length requirements: **4 segments** (Heavy bombers & `MiG-31BM`), **3 segments** (Standard fighters), **2 segments** (STOL/light jets), **1 segment** (`UCAV` drones). Cutting Segment 3 halts 3–4 segment jets; cutting Segments 2 and 4 grounds all manned flight.
* **Ground Armor Classes:** `SOFT` takes **100%** damage from all weapons; `ARMORED` takes **100%** from ATGMs, PGMs, cruise missiles, ARMs, or AP `≥ 0.70` (**65%** from light rockets/clusters); `FORTIFIED` deflects **80%** of light rockets/fragments (`0.20×`) and **50%** of mid-AP, requiring **Bunker Penetrators** (`1.0×`) or **Anti-Runway** bombs (`2.0× vs Runways`).
* **Unguided Dispersion & Cloud Scatter:** Dropping unguided iron bombs above `26,000 ft` without a `CCIP` computer or Targeting Pod lowers accuracy by `-18%`. Pure laser bombs lose `-20% Pk` per cloud cell without Targeting Pod mitigation.

### Complete Ground Units Catalog (44 Installation Types)

<details>
<summary><b>Click to expand the Full Ground Units Catalog (44 Installation Types)</b></summary>
<br>

#### 1. Surveillance, VHF, Gap-Filler & Hardened Radars

| Installation | Armor & HP | Range | Floor | Behavior & Tactical Role | VP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nebo-M VHF Surveillance Radar** | SOFT (6 HP) | 135 km | 3,500 ft | Long-wave emitter degrading VLO stealth RCS shaping by **2.8×**; feeds LR SAMs. | +300 |
| **Hardened Strategic Radome** | FORTIFIED (13 HP) | 122 km | 2,400 ft | Concrete-shielded EW radar dome (`1.5×` counter-stealth); resists light rockets/frag. | +420 |
| **91N6E Big Bird 3D Radar** | ARMORED (7 HP) | 110 km | 2,800 ft | High-power 3D phased-array radar rapidly classifying tracks for S-400/Patriot/HQ-9B. | +320 |
| **96L6-1 Mast Gap-Filler Radar** | SOFT (5 HP) | 78 km | 900 ft | Mast-mounted low-alt radar stripping terrain masking and dropping LR SAM floors. | +260 |
| **Giraffe AMB Mobile Gap-Filler** | SOFT (4 HP) | 64 km | 850 ft | Agile mobile 3D gap-filler tracking deck-skimming strike jets down to 850 ft. | +220 |
| **Early Warning Radar** | SOFT (5 HP) | 65 km | 2,500 ft | Sector surveillance radar providing tracking telemetry to long-range SAM rings. | +250 |
| **Mobile Radar Van** | SOFT (4 HP) | 42 km | 1,000 ft | Forward tactical sensor truck concealed until active; covers border approaches. | +150 |

#### 2. Long, Medium & Short-Range SAM Batteries

| Battery | Class | Armor & HP | Reach & Mach | Floor (Uncued / Cued) | Behavior & Countermeasure Profile | VP |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S-300V4 Antey-2500** | LR SAM | ARMORED (9) | 92 km (M 6.0) | 8,000 / 4,500 ft | Heavy 5 HP warhead, wide turn radius vulnerable to 90° Doppler notching. | +400 |
| **S-400 Triumf Battery** | LR SAM | ARMORED (8) | 82 km (M 5.4) | 6,500 / 3,500 ft | Area-denial 4 HP SAM; requires EW cueing for full range (-52% un-cued). | +380 |
| **HQ-9B Long-Range SAM** | LR SAM | ARMORED (8) | 76 km (M 4.8) | 5,500 / 3,000 ft | AESA track-via-missile SAM with **+20% anti-notch** guidance resistance. | +370 |
| **MIM-104F Patriot PAC-3** | LR SAM | ARMORED (7) | 68 km (M 4.9) | 4,500 / 2,500 ft | Agile hit-to-kill Dual-Pulse SAM (**+25% anti-notch**) dangerous inside 28 km. | +360 |
| **9K37M3 Buk-M3 TELAR** | MR SAM | ARMORED (6) | 46 km (M 3.6) | 2,500 / 1,500 ft | Self-contained fire-control radar; fires independently after EW radars fall. | +280 |
| **NASAMS-3 AMRAAM-ER** | MR SAM | ARMORED (5) | 40 km (M 3.5) | 2,200 / 1,500 ft | Rapid-reloading networked launcher firing low-RCS AMRAAM-ER missiles. | +260 |
| **MIM-23 Hawk Phase III** | MR SAM | SOFT (4) | 36 km (M 2.9) | 2,400 / 1,600 ft | Upgraded medium SAM defending border outposts and forward airbases. | +230 |
| **2K12 Kub (SA-6 Gainful)** | MR SAM | SOFT (4) | 32 km (M 2.8) | 2,800 / 2,000 ft | Legacy semi-active medium SAM vulnerable to chaff clouds and ECM jamming. | +220 |
| **9K332 Tor-M2 SHORAD** | SR SAM | ARMORED (5) | 18 km (M 2.8) | 1,000 ft | Point-defense SAM engaging low aircraft and intercepting incoming PGMs (**55%**). | +200 |
| **Rapier Optical SHORAD** | SR SAM | SOFT (4) | 15 km (M 2.5 EO) | 1,000 ft | **Passive optical** tracker: zero radar emissions, zero RWR alert, immune to ARMs. | +190 |
| **Strela-10M / Avenger IR** | SR SAM | SOFT (3) | 11 km (M 2.3 IIR) | 1,000 ft | **Passive IR** seeker: zero RWR warning; countered by Idle throttle & DIRCM. | +160 |

#### 3. Point-Defense CIWS & Low-Altitude AAA Flak

| Battery | Class | Armor & HP | Reach & Ceiling | Intercept & Behavior | VP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SeaRAM / Land Phalanx** | CIWS | ARMORED (5) | 7.5 km PD (14 km) | Rapid-cycling (`1.5s`) **72% base PGM intercept** against SDBs, glide bombs & subsonic cruise. | +220 |
| **Pantsir-S1 Hybrid CIWS** | CIWS | ARMORED (6) | 7.5 km PD / 7 km Gun | **65% PGM intercept** plus twin 30mm autocannons below 12,000 ft (`1.0 HP` hit). | +220 |
| **2K22M Tunguska Hybrid** | AAA / SAM | ARMORED (5) | 11.5 km SAM / 6.5 km Gun | Hybrid turret: fires **9M311 EO missiles** out to 11.5 km, 30mm flak inside 6.5 km (`14,500 ft`), and intercepts PGMs (**45%**). | +185 |
| **Gepard Twin 35mm SPAAG** | AAA | ARMORED (5) | 9.5 km / 16,500 ft | Twin 35mm armored flak (`1.2 HP` hit) plus **40% slow glide-bomb interception**. | +150 |
| **S-60 / 57mm Proximity Flak** | AAA | SOFT (4) | 12.0 km / 22,000 ft | Heavy medium-ceiling airburst flak (`1.4 HP` hit) threatening medium-alt LGB drops. | +140 |
| **ZSU-23-4M4 Shilka AAA** | AAA | SOFT (4) | 7.5 km / 14,000 ft | Optical quad 23mm gun (`0.9 HP` hit); passive emitter (no ARM lock). | +120 |

#### 4. Electronic Warfare, C4I Relays, Decoys, Airbases & Logistics

| Installation | Category | Armor & HP | Range / Blast | Operational Behavior & Strategic Effect | VP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Krasukha-4 Ground Jammer** | EW_JAMMER | ARMORED (7) | 52 km umbrella | Outputs **65% broadband jamming** against airborne locks & seekers; loses 55% output without Power Substation. | +280 |
| **EW Jammer Station** | EW_JAMMER | ARMORED (6) | 36 km umbrella | Emits **50% microwave noise** across sector umbrella; targetable via ARMs. | +250 |
| **Avtobaza-M Passive ELINT** | EW_ELINT | SOFT (5) | 95 km reach | **Zero RF emissions** (immune to ARMs); silently tracks active attacker radars. | +260 |
| **C4I Microwave Relay Tower** | COMMS | SOFT (5) | 55 km link | Links EW radars to SAMs (`90 -> 135 km` cueing); destroying isolates local SAMs. | +240 |
| **SAM Radar Decoy Emitter** | DECOY | SOFT (2) | 48 km spoof | Broadcasts fake S-400 RF sweeps to waste ARMs; exposed by any TGP or 22 km flyby. | 0 |
| **Thermal & Visual Mockup** | DECOY | SOFT (2) | 42 km spoof | Adds diesel heat generators to RF spoof; requires **45 km+ high-grade TGP** or 15 km flyby. | 0 |
| **Command Bunker** | C2_BUNKER | FORTIFIED (18) | Primary `[OBJ]` | Subterranean HQ; destroying slows local SAM reactions by **+40%**. | +800 |
| **Mobile Sector Command Post** | C2_STATION | ARMORED (10) | 55 km link | Armored C2 synchronizing tracks with nearby SAM batteries; concealed until active. | +350 |
| **Runway Strip Segment** | AIRBASE | FORTIFIED (7) | 700m (5x strip) | 5 contiguous sections; cutting center or quarters grounds QRA launches (`+450 VP` base neutralize). | +220 |
| **Military Airbase Runway** | AIRBASE | FORTIFIED (14) | Single strip | Single-block runway installation scrambles QRA jets until cratered. | +650 |
| **Hardened Aircraft Shelter** | AIRBASE | FORTIFIED (10) | Primary `[OBJ]` | Concrete bunker storing QRA fighters; destroying kills parked jets inside (`+140 VP` each). | +420 |
| **Aircraft Readiness Hangar** | AIRBASE | ARMORED (8) | Storage | Armored maintenance hangar holding standby fighters; bombing kills stored jets. | +280 |
| **Open Aircraft Dispersal Pad** | AIRBASE | SOFT (3) | Storage | Unprotected ramp triggering fast dispersal launches (`0.50×` timer) when threats near. | +180 |
| **Strategic Fuel Depot** | LOGISTICS | SOFT (8) | 6.0 km (-5 HP) | Volatile tanks; destruction triggers secondary blast and slows QRA launches by **+35%**. | +200 |
| **Forward Munition Depot** | LOGISTICS | ARMORED (10) | 7.5 km (-6 HP) | Triggers huge secondary blast, **+80% SAM reload delay**, and restricts new QRA ammo. | +300 |
| **Airbase Logistics Hub** | LOGISTICS | ARMORED (8) | 4.5 km (-4 HP) | Accelerates local QRA launches by **18%** while intact; explodes on destruction. | +260 |
| **Allied Munitions Center** | LOGISTICS | FORTIFIED (∞) | Safe Zone | Indestructible forward friendly depot powering automated RTB repairs and rearming. | 0 |
| **Grid Power Substation** | INFRASTRUCTURE | SOFT (7) | 55 km grid | Supplies ground jammers; destroying cuts local Krasukha jamming output by **55%**. | +200 |
| **Strategic Supply Bridge** | INFRASTRUCTURE | FORTIFIED (9) | Primary `[OBJ]` | Reinforced rail logistics span supplying airfields and heavy SAM reloads. | +450 |
| **Air Defense Assembly Plant** | INFRASTRUCTURE | ARMORED (12) | Primary `[OBJ]` | Strategic industrial plant producing SAM interceptors and guidance electronics. | +550 |

</details>

---

## Difficulty Scaling & Scoring

* **10 Air Combat Tiers:** `Permissive Sector` (`0.50×`, $150M, 7.0s reaction, 0% notch, 0 aces) → `Buffer Zone` (`0.75×`) → `Contested Airspace` (`1.00×`) → `Escalated Airspace` (`1.25×`) → `Hostile Airspace` (`1.50×`) → `Forward Combat Zone` (`1.75×`) → `High-Threat Sector` (`2.00×`) → `Fortified Airspace` (`2.30×`) → `Air Denial Zone` (`2.60×`) → `Extreme Threat Sector` (`3.20×`, $600M, 1.7s reaction, 55% notch, 3 aces).
* **10 Ground Attack Tiers:** `Unprepared Garrison` (`0.50×`, 2 Obj, 1 QRA jet, 60s scramble, 0% EMCON) → `Border Outpost` (`0.75×`) → `Forward Garrison` (`1.00×`) → `Fortified Belt` (`1.25×`) → `Integrated Air Defense` (`1.50×`) → `Hardened Command Sector` (`1.75×`) → `Dense Air Defense Sector` (`2.00×`) → `Layered Defense Corridor` (`2.30×`) → `Heavy Integrated Defense` (`2.60×`) → `Strategic Air Denial` (`3.20×`, 5 Obj, 8 QRA jets, 22s scramble, 66% EMCON).
* **Scoring & Speed Multiplier:** Aerial kills award `150 + 10 × airframe cost` (drones `80 + 12 × cost`), `1.5×` for Flight Leads, and `+850 VP` Ace bounties. Completing missions under Par Time (`6 min` Air Combat, `9 min` Attack) grants `+2.5 VP` per saved second. Final score multiplies `(Base Combat VP + Time Bonus) × Difficulty Multiplier (0.50×–3.20×) × Budget Multiplier (0.40×–1.75×)`.

---

## Hangar Procurement, Airframes, Pods & Subsystems

### 73 Airframes Across 8 Disciplines

<details>
<summary><b>Click to expand the Full Airframe Roster (73 Aircraft)</b></summary>
<br>

| Discipline | Included Airframes | Key Characteristics |
| :--- | :--- | :--- |
| **Stealth (8)** | F-22A, YF-23, F-35A, Su-57, J-20, Su-75, FC-31, J-35 | Sub-0.01 m² RCS, internal VLO bays with zero drag/RCS penalty, supercruise & sensor fusion. |
| **Air Superiority (8)** | MiG-31BM, F-15EX, Su-35S, Su-30SM, Eurofighter, Rafale C, J-16, F-14D | High-altitude Mach 1.88+ sprint, 3D TVC dogfighting, and 10 to 14 heavy weapon stations. |
| **Multirole (8)** | Mirage 2000-5, Tejas Mk2, F-16V, MiG-29K, JAS-39E Gripen, F/A-18E, F-2A, KF-21 | Agile 9G turn rates, compact AESA arrays, and carrier/networked versatility. |
| **Strike & Interdictors (17)** | A-10C, Su-25SM3, Su-34, B-52H, B-1B, Tu-160M, B-2A, FB-22, B-21, A-29B, Mirage 2000D, Su-24M2, Tornado GR.4, JH-7A, F-111F, F-117A, F-15E | Titanium armor, up to 31,750 kg payload capacity, Type X centerline rails, and VLO deep penetration. |
| **Electronic Warfare (7)** | Su-24MP, Tornado ECR, EF-111A, EA-18G Growler, J-15D, J-16D, EA-36 Barricader | High-power microwave jamming umbrellas (up to 125 km), passive ESM, and heavy SEAD rails. |
| **Swarm & UCAV Drones (9)** | MQ-99, MQ-101, XQ-58A Valkyrie, Bayraktar Akinci, MQ-28 Ghost Bat, MQ-20 Avenger, Kizilelma, S-70 Okhotnik, RQ-180 White Bat | High-G structural limits (up to 20G), zero pilot blackout risk, and ultra-low acquisition cost. |
| **Experimental & Superfighters (10)** | F-15 S/MTD, Su-47 Berkut, Su-37, X-29A, X-02S Strike Wyvern, ADFX-01 Morgan, CFA-44 Nosferatu, Darkstar, X-40 Nightmare, XFA-36B Game | Forward-swept wings, Mach 2.4+ scramjet cruise, pulse lasers, chemical lasers, and EML railguns. |
| **COFFIN Conversions (4)** | F-15 S/MT, Su-37, F-22C Raptor II, ADF-11F Raven | Enclosed armored optical cockpits locking turn efficiency at 100%, zero G-stress, and +24%–30% dodge. |

</details>

### Hardpoints, External Pods & Modular Systems

* **3 Hardpoint Stations:** **Internal Weapons Bays** (zero drag, zero extra RCS), **External Wing Pylons** (`Type S / M / H / X` structural ratings), and **Centerline Stations** (`Kinzhal`, `BrahMos-A`, `Kh-32`, `FAB-3000`), with drag-and-drop equipping and station reordering.
* **Flight Lead Suites:** Assigning a Flight Lead unlocks category-tailored hardware buffs (Stealth `-50%` beam spike & `+15 km` radar; Superiority `+2 HP` & `-50%` G-stress; Multirole `+20%` turn & fast RTB; Strike `+3 HP`, `-1` missile dmg, `60%` gun deflection & `-40%` ordnance drag; EW `+25%` jamming; Drones `2x MALD`; Experimental `-40%` thermal bloom & `+0.30/s` tokens).
* **Targeting & Recon Pods:** `LANTIRN` (34 km), `LITENING` (36 km), `Sapsan-E` (42 km), `ATFLIR` (45 km), `Damocles` (52 km), `Sniper XR` (55 km), `Legion` (58 km + IRST), and `RAPTOR/ATARS` (65 km) deliver **+14% to +26% A2G Pk**, cut cloud laser scatter by up to **50%**, and expose ground decoys and passive SHORAD.
* **Passive IRST, ELINT, ECM & Decoy Pods:** `Skyward-G` & `IRST21` break stealth and Doppler notches; `AN/ALQ-218` maps ground radars at `135 km` (`+15%` ARM reach); `ALQ-165/184/131/99/249`, `Khibiny`, `Sorbtsiya`, and `SAP-14` suppress enemy radar by **30% to 60%**; `ADM-160B MALD`, `ADM-141C ITALD`, `BriteCloud`, `ALE-55`, `ALE-50`, and `BOL-518` decoy missiles and SAMs.
* **Strike & Airframe Upgrades:** `TFR Terrain-Following Radar` (`+2,500 ft` SAM floor below 10,000 ft), `HTS` (`+20%` ARM reach, `+14%` Pk, `130 km` emitter ID), `CCIP Strike Computer` (`+16%` unguided accuracy), `MITL Datalink` (`+14%` glide/cruise accuracy, `-50%` jamming), `DIRCM Turret` (`+24%` vs IR), `Kevlar Belly Armor` (`-45%` flak dmg), `Conformal Fairings` (`-40%` drag), `GaN AESA`, `Adaptive ECCM`, `RAM Coating`, `3D TVC`, `Supercruise VCE`, `DAS 360°`, `MADL`, `ZOE Flight Computer`, and `TACAN RTB`.

---

## Mission Editor, Live Inspection Suite & Post-Sortie Analytics

* **Custom Mission Editor:** Unranked combat laboratory with independent `RANDOM` toggles per field, scenario-adaptive Air vs. Attack difficulty & doctrine menus, independent Blue & Red procedural fleets with custom `10M–2,500M` budgets, cloud density, Ground IADS grid toggles (`Full`, `Light`, `Off`), civilian RoE toggles, and Inspection Mode activation.
* **Live C4ISR Inspection Suite (6 Tabs + Time-Stop):** Analyze physics mid-battle or freeze simulation time completely:
  * **OVERVIEW & AI COGNITION:** Armor pips, corner speed, energy, VSI, active AI Doctrine, Tactical Role, Focus Slot timers, Formation Pairing, Chain-of-Command status, and live **Active AI Control Arrows** above controlled enemy contacts on the radar scope.
  * **SENSORS & WEAPONS:** Radar beam alignment, RCS aspect multipliers, cloud attenuation, real-time Pk gauges, factor breakdowns, and step-by-step inbound defense protocols.
  * **GRAPHS:** Five live telemetry charts—**Dynamic Launch Zone (DLZ & Pk vs Range)**, **360° RCS Polar Radiation Diagram**, **Dynamic Turn Speed Gauge**, **Rolling 60s Speed & Altitude History**, and **Fleet Combat Power Advantage Curve**.
  * **EVENTS & DATA:** Clickable chronological causal log and full raw entity kinematics/AI variables.
* **Sortie Replay, Debrief & Top 10 Leaderboard:** Delta-compressed interactive replay (`0.5×`, `1×`, `2×` speed, timeline scrubbing, key engagement jump chips), Ace Podium Rankings, Fleet Strength Over Time graph, full scoreboard, persistent Top 10 historical dossier archive, and a searchable **17-Chapter Flight Manual**.

---

## Controls & Platform Support

### Desktop Keybinds (Fully Rebindable in Settings)

| Category | Input / Key | Tactical Function |
| :--- | :--- | :--- |
| **Flight Steering** | `Left` / `Right` Arrow (or `A` / `D`) | Continuous aerodynamic roll and bank turn |
| **Throttle Control** | `[` / `]` | Step engine thrust (Idle, Cruise, Mil Power, Afterburner) |
| **Energy Trades** | `X` / `Z` | Kinetic Dive (altitude to speed) / Zoom Climb (speed to altitude) |
| **Squadron Focus** | `Up` / `Down` Arrow | Cycle active operational aircraft in squadron |
| **Target Selection** | `T` (or `Tab`) / `Space` / Click Contact | Cycle detected tracks / Instant Auto-Lock nearest threat |
| **Autocannon Fire** | `G` | Fire manual boresight autocannon and gunpod burst |
| **Stores Release** | `1` through `9` | Launch weapon from Hardpoint Stations 1 through 9 |
| **Countermeasures** | `F` | Deploy emergency chaff decoys |
| **Return to Base** | `R` | Order / Cancel high-speed Return to Base (RTB) for rearming |
| **Radar Layers** | `V` / `B` | Toggle radar declutter labels / Toggle ground targets overlay |
| **Camera Controls** | `C` / `0` (or `Backspace`) / Drag / Wheel | Track active aircraft / Reset theater view / Pan & zoom |
| **Simulation Speed** | `P` (Pause), `J` (1X), `K` (2X), `L` (4X) | Pause or adjust simulation time warp |
| **Analysis & Menus** | `I` / `O` / `M` | Toggle Inspection Pane / Settings & Audio / Flight Manual |

### Mobile, Tablet & Android Support
* **Touch Radar Navigation:** Drag to pan, two-finger pinch to zoom, and tap any radar blip to select aircraft, lock targets, or inspect telemetry.
* **Portrait & Landscape Responsive Layout:** Automatically adapts HUD panels, compact MFD weapon cards, and collapsible fleet drawers to mobile and tablet orientations.
* **Mobile Steering Overlay & Safe-Zone Padding:** Dedicated on-screen `TURN LEFT` / `TURN RIGHT` banking buttons plus toggleable camera-cutout safe-zone padding in Settings.
* **Android APK Ready:** Runs inside a native Android WebView container with GPU hardware acceleration and native exit bridge support.

---

## Technology Stack

| Layer | Implementation | Highlights |
| :--- | :--- | :--- |
| **Simulation & Physics** | Pure Vanilla JavaScript (ES6+) | Discrete integration, ProNav guidance, 4th-root radar physics, seeded `Xoshiro128**` PRNG |
| **Rendering Engine** | HTML5 Canvas 2D | High-DPI 200+ FPS radar viewport, 5 live graphs, and sortie replay map |
| **Audio Architecture** | Web Audio API | 100% procedural synthesizer with dynamics compressor and Master / RWR / SFX buses |
| **User Interface** | Modular Vanilla CSS | Pitch-black glass HUD, responsive grids, vector SVG icons, zero framework bloat |
| **Data Persistence** | Client-Side Web Storage | Delta-compressed sortie replays, Top 10 dossiers, custom squadrons & keybinds |
| **Dependencies** | None | Zero external runtime libraries, npm packages, or build pipelines required |

---

## How to Run

### 1. Play Online
Open directly in any modern browser:  
**[https://farhan-real.github.io/airspace-standoff/](https://farhan-real.github.io/airspace-standoff/)** or **[https://airspace-standoff.pages.dev/](https://airspace-standoff.pages.dev/)**

### 2. Run Locally (Offline)
Clone or download this repository, then double-click `index.html` in Chrome, Firefox, Safari, or Edge.

### 3. Local HTTP Server (Optional)
Run `python3 -m http.server 8000` inside the repository folder and visit `http://localhost:8000`.

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.  
See the [LICENSE](./LICENSE) file for the full license text.