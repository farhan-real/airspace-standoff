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
8. [Aircraft Roster (113 Airframes Across 7 Disciplines)](#aircraft-roster-113-airframes-across-7-disciplines)
9. [Weapons, Cannons, Pods & Modular Systems (209 Ordnance & 25 Upgrades)](#weapons-cannons-pods--modular-systems-209-ordnance--25-upgrades)
   * [Air-to-Air Missiles (77 Missiles)](#air-to-air-missiles-77-missiles)
   * [Air-to-Ground Ordnance (78 Weapons)](#air-to-ground-ordnance-78-weapons)
   * [Built-in Cannons, Directed Energy, Gunpods & Utility Pods (54 Systems)](#built-in-cannons-directed-energy-gunpods--utility-pods-54-systems)
   * [Hardpoint Stations, Flight Lead Suites & 25 Modular Upgrades](#hardpoint-stations-flight-lead-suites--25-modular-upgrades)
10. [Mission Editor, Live Inspection Suite & Post-Sortie Analytics](#mission-editor-live-inspection-suite--post-sortie-analytics)
11. [Controls & Platform Support](#controls--platform-support)
    * [Desktop Keybinds (Fully Rebindable in Settings)](#desktop-keybinds-fully-rebindable-in-settings)
    * [Mobile, Tablet & Android Support](#mobile-tablet--android-support)
12. [Technology Stack](#technology-stack)
13. [How to Run](#how-to-run)
14. [License](#license)

---

## At a Glance

| Domain | Scope | Simulation Implementation |
| :--- | :--- | :--- |
| **Game Modes** | 4 Distinct Modes | 1P Skirmish, 2P Versus, 1P Dynamic Theater Waves, 1P Ground Attack |
| **Theater Grid** | 150×100 km & 240×160 km | Altitude flight levels from FL010 (1,000 ft) to FL650 (65,000 ft) |
| **Aircraft Roster** | 113 Airframes + 147 Presets | Stealth/6th-Gen, Superiority, Multirole, Strike/CAS, EW, UCAVs, Experimental & COFFIN |
| **Ordnance & Pods** | 209 Weapons, Guns & Pods | 77 A2A missiles, 78 A2G weapons, 16 built-in guns/DEW, 13 gun/laser pods, 25 ECM/TGP/decoy pods |
| **Systems & Upgrades** | 25 Modular Subsystems | TFR terrain masking, HTS, CCIP, MITL datalink, DIRCM, Kevlar armor, GaN AESA & COFFIN |
| **Ground IADS** | 44 Surface Installation Types | VHF & gap-filler radars, finite-rack LR/MR/SR SAMs, CIWS, hybrid AAA, decoys & 5-seg runways |
| **Doctrines & Tiers** | 14 Doctrines & 20 Difficulty Tiers | 7 Air Combat + 7 Attack Defense Doctrines across 10 Air & 10 Attack threat tiers |
| **Budget Flexibility** | 9 Defense Budget Tiers | $200M Austerity (1.75× VP) to $1,000M Maximum Surge (0.40× VP), up to 16 units |
| **Analysis & Archive** | Inspection, Replay & Manual | Live 6-tab C4ISR inspector with 5 telemetry graphs, sortie replay & 18-section manual |

---

## Game Modes & Operational Theaters

1. **Single Player Skirmish (150 km × 100 km):** Head-to-head tactical air battle between your custom squadron and a procedurally drafted adversary wing shaped by your chosen difficulty tier and Air Combat Doctrine.
2. **Two Player Skirmish (150 km × 100 km):** Competitive hotseat versus mode deploying identical cloned rosters in randomized formation orders for parity, with live Blue and Red command switching and pre-identified contacts.
3. **Single Player Dynamic Theater (150 km × 100 km):** Endurance air-combat scenario where allied and hostile reinforcement waves enter the theater every 80 seconds across escalating waves (up to Wave 4).
4. **Single Player Attack (240 km × 160 km):** Deep strike operations against a layered Integrated Air Defense System (IADS). Neutralize all Primary Strategic Objectives marked `[OBJ]`—underground C2 bunkers, 5-segment military runways, hardened aircraft shelters, logistics bridges, and SAM assembly plants—while countering scrambling airbase QRA interceptors.

---

## Special & Unique Behaviors (Beyond Raw Stats)

Equipment, aircraft, and ground sites in *Airspace Standoff* execute distinct mechanical behaviors inside the physics and AI engines:

### Ground Unit Behaviors
* **VHF Counter-Stealth (`Nebo-M`):** Long-wave radar uses separate fourth-root stealth scaling (`pow(rcs, 0.45) × 2.8`), stripping away VLO stealth invisibility across the sector until neutralized.
* **Gap-Filler Altitude Cueing (`96L6-1` & `Giraffe AMB`):** While alive, low-altitude gap-fillers automatically lower neighboring LR SAM engagement floors (`S-400` drops from `8,000 ft` to `4,800 ft`; `Patriot` drops to `3,600 ft`), defeating terrain-masking approaches until destroyed.
* **Finite SAM Magazines, Ready Racks & Guidance Channels:** Surface SAM batteries hold finite magazines (`6–12` missiles), ready racks (`3–6` cells), acquisition timers (`1.5s–4.5s`), and active channel limits (`1–2` simultaneous missiles). Emptying a ready rack forces a **20s–32s reload cycle** that can be baited with `ITALD` or `MALD` decoys.
* **Independent Fire Control (`Buk-M3` vs. `S-400` / `S-300V4` / `Patriot`):** Long-range strategic SAMs lose **52% range** if sector EW radars and Comms Relays go down; `Buk-M3` carries an organic TELAR radar and keeps firing at full `38 km` reach completely un-cued.
* **True Passive Emitters (`Rapier Optical`, `Strela-10M`, `Avtobaza ELINT`):** Emit zero RF radiation, trigger zero RWR alerts in your cockpit, and cannot be locked by Anti-Radiation Missiles.
* **EMCON Shutdown Traps:** Active emitting SAMs and EW radars detect incoming ARMs at `24–34 km` and shut down emissions for 8–14 seconds. Legacy ARMs (`Shrike`, `AGM-88C`, `Kh-31P`) immediately lose lock (`RADAR EMCON SHUTDOWN`), while Anti-EMCON ARMs (`AGM-88E/G`, `Kh-58UShKE`, `ALARM-II`, `HAROP-AL`, `SPEAR-EW`) remember coordinates and strike anyway.
* **Multi-Role Hybrid Turrets (`Pantsir-S1` & `2K22M Tunguska`):** `Pantsir-S1` intercepts incoming SDBs/cruise missiles while firing twin 30mm guns at low aircraft; `Tunguska` combines `10.5 km` optical SHORAD missiles (`8` total / `4` ready rack), `6.0 km` twin 30mm flak, and `38%` glide-bomb interception.
* **Power & Logistics Dependencies:** Knocking out `Grid Power Substations` drops nearby `Krasukha-4` jammer output by **55%**. Destroying `Fuel Depots` (`6 km` secondary blast) slows QRA launches by `+35%`; destroying `Munition Dumps` (`7.5 km` blast) increases SAM reload times by `+80%` and restricts QRA missile loads; `Logistics Hubs` (`4.5 km` blast) boost QRA launch speed by `18%` while intact.
* **Active Runway Taxi, Takeoff Rolls & Decoy Tiers:** QRA fighters physically **taxi** out of shelters/hangars/open pads and accelerate down contiguous runway slices—cratering their active roll segments destroys launching jets on the ground. Meanwhile, `DECOY_THERMAL` sites emit heat and RF spoofs that fool basic Targeting Pods (`LANTIRN`/`LITENING`), requiring `45 km+` pods (`ATFLIR`, `Damocles`, `Sniper XR`, `Legion`, `TARPS`) or `<15 km` flybys to expose.

### Aircraft Behaviors
* **COFFIN Synthetic Vision (`F-15 S/MT`, `Su-37 [COFFIN]`, `F-22C`, `ADF-11F`):** Bypass aerodynamic corner-speed penalties (**100% turn authority locked at any speed**), accumulate **zero G-stress** (immune to Tunnel Vision and G-LOC blackouts), and apply passive `+24% to +30%` evasive dodge.
* **Unmanned UCAVs & Swarm Immunity:** Immune to biological G-LOC up to **20G**, launch off single **1-segment** runway fragments, and gain total immunity to EW radar jamming when fitted with the `Swarm AI Coprocessor`.
* **Built-In EW & DIRCM Airframes (`TYPHOON-T4`, `J-20S`, `Su-24MP`, `J-15D`, `EA-36`, `Su-39`):** Electronic-attack fighters (`TYPHOON-T4`, `J-20S`, `Su-24MP`, `J-15D`, `EA-36`) project **25%–60% innate broadband jamming** plus passive ESM without sacrificing a weapon pylon; `Su-39` integrates a built-in Sukhogruz IR jammer (`+18%` evasion vs IR seekers, stacking up to `42%` with `DIRCM`).
* **3D Thrust-Vectoring (`Su-35S`, `Su-37`, `Su-57`, `F-22A`, `J-20B`, `X-02S`, `CFA-44`):** Physically unlock the `Pugachev's Cobra` (`+55%` evasion brake) maneuver card—locked out on conventional aircraft—and multiply base turn agility by `1.20×`.
* **Thermal Exhaust Suppression vs. Afterburner Plumes:** Trough-shielded airframes (`B-21` `0.32×`, `RQ-180` `0.35×`, `B-2A` `0.40×`, `F-117A` `0.42×`, `YF-23` `0.45×`) actively mask infrared emissions against IIR/EO missiles, whereas heavy reheat interceptors (`MiG-25PD` `1.55×`, `MiG-31BM` `1.50×`, `Tu-160M` `1.60×`, `B-52H` `1.65×`) amplify enemy IR lock probabilities.
* **Armored CAS Flak Mitigation & STOVL Short-Field:** Heavy CAS platforms (`A-10C`, `Su-25SM3`, `Su-39`) carry **7 HP** hulls with innate **-35% AAA flak damage** (`-20%` to `-25%` on `AV-8B+`, `Jaguar`, `MiG-27K`, `A-16`, `F-16XL`, `Su-34`), stacking up to `-75%` with `Kevlar Belly Armor`. `AV-8B+`, `F-35B`, and `A-29B` operate off single **1-segment (700 m)** runway strips.
* **Hypersonic High-Altitude Cruise (`DARKSTAR`):** Deploys at **58,000 ft** and cruises at **Mach 2.40+**, overflying medium SAM envelopes while demanding wide 5.0G turns.
* **Dynamic Rack Jettison:** External weapons physically contribute parasite speed drag and RCS bloom until expended (`ammoFraction`), restoring clean flight speed as missiles leave the rails.

### Missile, Cannon & Pod Behaviors
* **Dual-Pulse Terminal Surge (`PL-15E`, `PL-15`, `Astra Mk2`, `R-77M`, `K-77ME`, `I-Derby ER`):** Coast after Stage 1 burnout, then fire a **Stage 2 pulse inside 22 km** (`+0.90 Mach` surge and `+16% to +18%` kinetic retention) to defeat late notch/break maneuvers.
* **Zero-Decay Ramjets (`Meteor`, `Gokhan`, `FMRAAM`, `RVV-AE-PD`, `JNAAM`, `Astra Mk3`, `AIM-152`, `PL-21`, `BrahMos-A`):** Sustain peak Mach across maximum reach without aerodynamic drag bleed (`lambda ~ 0.04–0.06`), denying range-bleed escapes.
* **Home-On-Jam A2A (`R-27P`, `R-27EP`, `AIM-120D-HOJ`, `PL-15B HOJ`, `AIM-260B HOJ`):** Lock directly onto enemy EW jammers and high-power radars for `+15% to +18% Pk` and `+30% to +40%` anti-notch resistance.
* **Silent Long-Range IR BVR (`R-27T/ET`, `PL-10E-ER`, `AIM-9X-B3`, `R-77T`, `IRIS-T SLX`, `MICA-IR`):** Deliver 38–64 km passive thermal ambushes with zero RWR alert, total chaff immunity, and immunity to 90° Doppler notching.
* **Hypersonic Stratospheric Lofting (`Kinzhal`, `R-37M`, `K-100`, `Kh-32`):** Climb into the stratosphere during midcourse before diving terminally at **Mach 4.6–6.2**, outrunning CIWS interception (`Mach 5.0+` is 100% CIWS-immune).
* **180° Rearward & Sphere Launches (`Python-5`, `ADMM`, `ADMM-S`):** Full-sphere optical seekers fire backwards over your shoulder at pursuing bandits without requiring you to turn your nose.
* **Area Shockwaves & Runway Heavers (`MPBM`, `MPBM-II`, `CBU`, `RBK-500`, `JP233`, `BLU-107`, `BetAB-500ShP`):** `MPBM` triggers an **8.5 km** (`10.5 km` on `MPBM-II`) thermobaric AOE hitting nearby aircraft; Cluster dispensers splash **4.5–7.0 km** to kill grouped defenses and taxiing jets; `BLU-107 Durandal`, `BetAB-500ShP`, and `JP233` inflict **2.0× structural damage on runways**.
* **Directed Energy vs. Ballistic & CAS Cannons:** `PLSL`, `DE-Pulse`, and `TLS` fire hitscan speed-of-light beams that spike host thermal bloom (`1.3×–1.7×`) and scatter in clouds (`-45%` to `-80%`), while heavy CAS rotary cannons (`GAU-8`, `GSh-6-30`, `GSh-30-2`, `GAU-13`, `GAU-12`) and `BK-37` 37mm tungsten pods deal **1.55×–2.0× ground damage** at **85%–100% armor piercing**.

---

## Core Simulation Mechanics

### 1. Radar Physics, Classification & Rules of Engagement (RoE)

* **Fourth-Root Radar Range Equation:** Detection envelopes update every simulation tick using `R_detect = R_0 × (RCS / 1.0)^0.25 × K_aspect × K_clutter × K_weather × K_jamming`. Cutting RCS by 10,000× shrinks detection reach by 90%.
* **Aspect & Beam Exposure Spikes:** Nose-on silhouettes stay minimal. Banking 90° broadside multiplies radar return by `1.3× to 4.8×`, exposing stealth fighters during careless perpendicular turns.
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

* **5-Segment Runways (3,500 m):** Every airbase operates five `700 m` concrete segments (`7 HP Fortified` each). Contiguous intact length requirements: **4 segments** (Heavy bombers & `MiG-31BM`/`MiG-25PD`/`J-36`/`DARKSTAR`), **3 segments** (Standard fighters), **2 segments** (Light/CAS/STOL jets), **1 segment** (`AV-8B+`, `F-35B`, `A-29B` & `UCAV` drones). Cutting Segment 3 halts 3–4 segment jets; cutting Segments 2 and 4 grounds all manned flight.
* **Ground Armor Classes:** `SOFT` takes **100%** damage from all weapons; `ARMORED` takes **100%** from ATGMs, PGMs, cruise missiles, ARMs, or AP `≥ 0.70` (**65%** from light rockets/clusters); `FORTIFIED` deflects **80%** of light rockets/fragments (`0.20×`) and **50%** of mid-AP (`AP ≥ 0.65`), requiring **Bunker Penetrators** (`1.0×`) or **Anti-Runway** bombs (`2.0× vs Runways`).
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

| Battery | Class | Armor & HP | Magazine / Rack | Reach & Mach | Floor (Uncued / Cued) | Behavior & Countermeasure Profile | VP |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S-300V4 Antey-2500** | LR SAM | ARMORED (9) | 8 / 4 Rack (1 Active) | 74 km (M 5.2) | 9,500 / 6,000 ft | Heavy 4 HP warhead, wide turn radius vulnerable to 90° Doppler notching. | +400 |
| **S-400 Triumf Battery** | LR SAM | ARMORED (8) | 12 / 4 Rack (2 Active) | 66 km (M 4.8) | 8,000 / 4,800 ft | Area-denial 3.5 HP SAM; requires EW cueing for full range (-52% un-cued). | +380 |
| **HQ-9B Long-Range SAM** | LR SAM | ARMORED (8) | 12 / 4 Rack (2 Active) | 60 km (M 4.4) | 7,000 / 4,200 ft | AESA track-via-missile SAM with **+14% anti-notch** guidance resistance. | +370 |
| **MIM-104F Patriot PAC-3** | LR SAM | ARMORED (7) | 12 / 4 Rack (2 Active) | 56 km (M 4.5) | 6,000 / 3,600 ft | Agile hit-to-kill SAM (**+16% anti-notch**) entering 26s reload per 4 shots. | +360 |
| **9K37M3 Buk-M3 TELAR** | MR SAM | ARMORED (6) | 8 / 4 Rack (1 Active) | 38 km (M 3.3) | 3,500 / 2,400 ft | Self-contained fire-control radar; fires independently after EW radars fall. | +280 |
| **NASAMS-3 AMRAAM-ER** | MR SAM | ARMORED (5) | 12 / 6 Rack (2 Active) | 34 km (M 3.2) | 3,200 / 2,200 ft | Rapid-reloading networked launcher firing low-RCS AMRAAM-ER missiles. | +260 |
| **MIM-23 Hawk Phase III** | MR SAM | SOFT (4) | 6 / 3 Rack (1 Active) | 30 km (M 2.7) | 3,400 / 2,400 ft | Upgraded medium SAM defending border outposts and forward airbases. | +230 |
| **2K12 Kub (SA-6 Gainful)** | MR SAM | SOFT (4) | 6 / 3 Rack (1 Active) | 26 km (M 2.6) | 3,600 / 2,600 ft | Legacy semi-active medium SAM vulnerable to chaff clouds and ECM jamming. | +220 |
| **9K332 Tor-M2 SHORAD** | SR SAM | ARMORED (5) | 8 / 4 Rack (1 Active) | 16 km (M 2.6) | 1,000 ft | Point-defense SAM engaging low aircraft and intercepting slow glide bombs (**45%**). | +200 |
| **Rapier Optical SHORAD** | SR SAM | SOFT (4) | 8 / 4 Rack (1 Active) | 14 km (M 2.4 EO) | 1,000 ft | **Passive optical** tracker: zero radar emissions, zero RWR alert, immune to ARMs. | +190 |
| **Strela-10M / Avenger IR** | SR SAM | SOFT (3) | 8 / 4 Rack (1 Active) | 10.5 km (M 2.2 IIR) | 1,000 ft | **Passive IR** seeker: zero RWR warning; countered by Idle throttle & DIRCM. | +160 |

#### 3. Point-Defense CIWS & Low-Altitude AAA Flak

| Battery | Class | Armor & HP | Reach & Ceiling | Intercept & Behavior | VP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SeaRAM / Land Phalanx** | CIWS | ARMORED (5) | 7.5 km PD (14 km) | Rapid-cycling (`2.4s`) **62% base PGM intercept** against SDBs, glide bombs & subsonic cruise. | +220 |
| **Pantsir-S1 Hybrid CIWS** | CIWS | ARMORED (6) | 7.5 km PD / 6.5 km Gun | **55% PGM intercept** plus twin 30mm autocannons below 11,000 ft (`0.8 HP` hit). | +220 |
| **2K22M Tunguska Hybrid** | AAA / SAM | ARMORED (5) | 10.5 km SAM / 6.0 km Gun | Hybrid turret: fires **9M311 EO missiles** out to 10.5 km (`8/4` rack), 30mm flak inside 6.0 km (`13,500 ft`), and intercepts PGMs (**38%**). | +185 |
| **Gepard Twin 35mm SPAAG** | AAA | ARMORED (5) | 8.5 km / 15,000 ft | Twin 35mm armored flak (`0.95 HP` hit) plus **32% slow glide-bomb interception**. | +150 |
| **S-60 / 57mm Proximity Flak** | AAA | SOFT (4) | 11.0 km / 20,000 ft | Heavy medium-ceiling airburst flak (`1.1 HP` hit) threatening medium-alt LGB drops. | +140 |
| **ZSU-23-4M4 Shilka AAA** | AAA | SOFT (4) | 7.0 km / 12,500 ft | Optical quad 23mm gun (`0.7 HP` hit); passive emitter (no ARM lock). | +120 |

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
* **10 Ground Attack Tiers:** `Unprepared Garrison` (`0.50×`, 2 Obj, 1 QRA jet, 60s scramble, 4.5s SAM lock, 0% EMCON) → `Border Outpost` (`0.75×`) → `Forward Garrison` (`1.00×`) → `Fortified Belt` (`1.25×`) → `Integrated Air Defense` (`1.50×`) → `Hardened Command Sector` (`1.75×`) → `Dense Air Defense Sector` (`2.00×`) → `Layered Defense Corridor` (`2.30×`) → `Heavy Integrated Defense` (`2.60×`) → `Strategic Air Denial` (`3.20×`, 5 Obj, 8 QRA jets, 22s scramble, 1.5s SAM lock, 66% EMCON).
* **Scoring & Speed Multiplier:** Aerial kills award `150 + 10 × airframe cost` (drones `80 + 12 × cost`), `1.5×` for Flight Leads, and `+850 VP` Ace bounties. Completing missions under Par Time (`6 min` Air Combat, `9 min` Attack) grants `+2.5 VP` per saved second. Final score multiplies `(Base Combat VP + Time Bonus) × Difficulty Multiplier (0.50×–3.20×) × Budget Multiplier (0.40×–1.75×)`.

---

## Aircraft Roster (113 Airframes Across 7 Disciplines)

Every airframe in the Hangar includes distinct radar apertures, clutter filters, RCS values, thermal bloom coefficients, hardpoint station capacities (`Type S / M / H / X`), and **147 preconfigured combat presets** (plus custom user-saved loadouts).

<details>
<summary><b>Click to expand the Full Airframe Roster (113 Aircraft Across 7 Categories)</b></summary>
<br>

| Discipline | Sub-Groups & Included Airframes | Key Characteristics & Notable Capabilities |
| :--- | :--- | :--- |
| **Stealth & 6th-Gen (20)** | **5th-Gen Core (8):** F-22A Raptor, YF-23 Black Widow II, F-35A Lightning II, Su-57 Felon, J-20 Mighty Dragon, Su-75 Checkmate, FC-31 Gyrfalcon, J-35 Carrier Stealth<br>**5th-Gen Variants & 6th-Gen (12):** F-35B (STOVL), F-35C (Carrier), F-22A+ Super Raptor, J-20B (WS-15 TVC), J-20S Twin-Seat (EW/C2), TAI TF Kaan, KAI KF-21EX Block III, HAL AMCA Mk1, BAE / GCAP Tempest, FCAS NGF, Chengdu J-36 Heavy 6th-Gen, Shenyang J-50 Tailless | Sub-0.01 m² VLO/LO RCS (`0.0001–0.007 m²`), internal weapon bays (up to 8 internal slots on `J-36`), up to `105 km` 140° broadband GaN AESA radars, supercruise (`M 1.50–1.65`), and `F-35B` 1-segment STOVL launch capability. `J-20S` includes built-in 25% jamming + passive ESM. |
| **Air Superiority & Interceptors (20)** | **Heavy Fleet & TVC Core (8):** MiG-31BM Foxhound, F-15EX Eagle II, Su-35S Flanker-E, Su-30SM Flanker-H, Eurofighter Typhoon, Dassault Rafale C, J-16 Red Eagle, F-14D Super Tomcat<br>**Expanded Air Dominance (12):** F-15C Golden Eagle, F-15JSI Super Interceptor, Su-27SM3 Flanker-B Mod, Su-30MKI Flanker-H+, Shenyang J-11BG Flanker, Shenyang J-15T Flying Shark, MiG-25PD Foxbat-E, MiG-35S Fulcrum-F, F-4E Terminator 2020, Super Mirage 4000, F-14B Bombcat, Eurofighter Tranche 4 (ECRS Mk2) | High-altitude `Mach 1.88–2.05` stratospheric sprint (`MiG-31BM`, `MiG-25PD`), 3D TVC post-stall agility (`Su-35S`, `Su-30MKI`, `MiG-35S`), up to 14 Type X pylons (`F-15EX`), centerline `BrahMos-A` (`Su-30MKI`), and built-in 25% ECRS Mk2 EW on `Typhoon T4`. |
| **Multirole Fighters (20)** | **Core Workhorses (8):** Mirage 2000-5, HAL Tejas Mk2 MWF, F-16V Viper, MiG-29K Fulcrum-D, JAS-39E Gripen, F/A-18E Super Hornet, Mitsubishi F-2A Viper Zero, KAI KF-21 Boramae<br>**Expanded Light, Carrier & Modern (12):** JF-17 Block III Thunder, KAI FA-50 Block 20, HAL Tejas Mk1A, JAS-39C Gripen, F-16C Block 52+ Viper, F/A-18C+ Legacy Hornet, F/A-18F Block III Rhino, Chengdu J-10C Vigorous Dragon, Dassault Rafale M (F4), MiG-29SMT Fulcrum-E, Mirage F1EQ, F-5EM Tiger II (AESA) | Agile `9G–9.5G` turn rates, economical `$9.5M–$15M` light fighters (`F-5EM`, `FA-50`, `Tejas Mk1A`, `JF-17 B3`, `Mirage F1EQ`), carrier airframes (`F/A-18F`, `Rafale M`), and semi-stealth conformal bays (`KF-21`). |
| **Close Air Support, Interdictors & Strike (23)** | **Armored & Fast CAS (6):** A-10C Warthog, Su-25SM3 Frogfoot, Su-39 Frogfoot-T, AV-8B+ Harrier II Plus, MiG-27K Flogger-J2, A-16A Viper CAS Tankbuster<br>**Tactical Interdictors (10):** A-29B Super Tucano, SEPECAT Jaguar GR.3A, Mirage 2000D Strike, JH-7A Flying Leopard, Su-24M2 Fencer-D, Tornado GR.4, F-111F Aardvark, F-16XL Strike Falcon, F-117A Nighthawk, F-15E Strike Eagle<br>**Heavy Bombers (7):** Su-34 Fullback, B-52H Stratofortress, B-1B Lancer, Tu-160M White Swan, B-2A Spirit, FB-22 Strike Raptor, B-21 Raider | `A-10C`, `Su-25SM3`, and `Su-39` carry `7 HP` titanium armor (`-35%` AAA flak); `MiG-27K`, `A-16`, and `F-16XL` bring `Mach 1.32–1.48` 30mm rotary/Gatling CAS speed; `B-52H` hauls `31,750 kg` across 16 stations; `B-21` reaches `0.00008 m²` VLO RCS. |
| **Electronic Warfare & SEAD (7)** | Su-24MP Fencer-F, Tornado ECR, EF-111A Raven, EA-18G Growler, J-15D Carrier Growler, J-16D EW Striker, EA-36 Barricader | Broadband jamming umbrellas (up to `125 km`), passive ESM emitter mapping, built-in `40%–60%` EA (`Su-24MP`, `J-15D`, `EA-36`), and heavy Type H SEAD stations. |
| **Swarm & Strike UCAV Drones (9)** | MQ-99 Swarm Drone, MQ-101 Agile Swarm Drone, XQ-58A Valkyrie, Bayraktar Akinci UCAV, MQ-28 Ghost Bat, MQ-20 Avenger, Bayraktar Kizilelma, Sukhoi S-70 Okhotnik, RQ-180 White Bat | High-G limits (`15G–20G`), zero pilot G-LOC risk, 1-segment runway capability, `$4.0M` swarm expendables (`MQ-99`) up to `98 km` stealth sensor hubs (`RQ-180`, `0.0001 m²` RCS) and `2,950 kg` strike UCAVs (`MQ-20`, `S-70`). |
| **Experimental, Superfighters & COFFIN (14)** | **Demonstrators (4):** F-15 S/MTD ACTIVE, Su-47 Berkut, Su-37 Terminator, Grumman X-29A<br>**Superfighters (6):** X-02S Strike Wyvern, ADFX-01 Morgan, CFA-44 Nosferatu, Darkstar Hypersonic Penetrator, X-40 Nightmare, XFA-36B Game<br>**COFFIN Conversions (4):** F-15 S/MT [COFFIN], Su-37 Super Flanker [COFFIN], F-22C Raptor II [COFFIN], ADF-11F Raven [COFFIN] | Forward-swept wings, `Mach 2.40` scramjet cruise (`DARKSTAR`), pulse lasers & EML railguns, and COFFIN enclosed cockpits (`16G–20G` envelope, locked 100% turn efficiency, zero G-LOC, `+24%–30%` passive dodge). |

</details>

---

## Weapons, Cannons, Pods & Modular Systems (209 Ordnance & 25 Upgrades)

### Air-to-Air Missiles (77 Missiles)

<details>
<summary><b>Click to expand All 77 Air-to-Air Missiles Across 6 Functional Families</b></summary>
<br>

| A2A Category | Count | Included Missiles | Key Performance & Special Behaviors |
| :--- | :--- | :--- | :--- |
| **Medium & Long-Range Active BVR** | 18 | `MICA-EM`, `R-77`, `Astra Mk1`, `PL-12`, `AIM-120C-7`, `Gokdogan`, `R-77-1`, `AAM-4`, `I-Derby ER`, `AIM-120D`, `PL-15E`, `TC-2C`, `AAM-4B`, `Astra Mk2`, `AIM-120D-3`, `R-77M`, `PL-15`, `K-77ME` | `56–104 km` active radar (`ARH`) missiles (`Mach 3.3–4.5`). Includes compact 1-slot rails (`MICA-EM`, `Astra Mk1`, `I-Derby ER`), dual-pulse `PL-15E`/`Astra Mk2`/`R-77M`/`K-77ME` (`+0.9M` surge inside 22 km), and anti-notch micro-AESA seekers (`AAM-4B`, `AIM-120D-3`). |
| **Legacy BVR & Silent IR BVR** | 14 | **Legacy (8):** `Aspide Mk1`, `AIM-7M`, `Skyflash`, `AIM-7P`, `Super 530D`, `R-27R`, `R-27ER`, `AIM-54C Phoenix`<br>**Silent IR BVR (6):** `R-27T`, `R-27ET`, `PL-10E-ER`, `AIM-9X Block III`, `R-77T`, `IRIS-T SLX` | Budget `48–80 km` legacy interceptors (`AIM-54C` `108 km` heavy bomber hunter on Tomcats), plus `44–64 km` passive infrared BVR seekers that emit **zero RWR radar warning** and ignore chaff and 90° Doppler notching. |
| **Ramjets & Home-On-Jam** | 13 | **Ramjets (8):** `Gokhan`, `Meteor`, `FMRAAM`, `RVV-AE-PD`, `JNAAM`, `Astra Mk3 Gandiva`, `AIM-152 AAAM`, `PL-21`<br>**Home-On-Jam (5):** `R-27P`, `R-27EP`, `AIM-120D-HOJ`, `PL-15B HOJ`, `AIM-260B HOJ` | Variable-flow ramjets (`80–130 km`, `Mach 4.0–5.0`) sustain cruise speed with zero drag bleed; HOJ seekers gain **+15% to +18% Pk** against EW jammers and high-power radars (`AIM-260B HOJ` combines `0.0005 m²` stealth + HOJ). |
| **Ultra-Long-Range & Hypersonic** | 7 | `R-33S`, `AIM-260 JATM`, `R-37M Axehead`, `AIM-174B (SM-6)`, `PL-17`, `KS-172`, `K-100` | `112–145 km` theater denial interceptors (`Mach 4.2–5.8`). `AIM-260` fits internal stealth bays with `0.0005 m²` RCS; `R-37M` and `K-100` loft into the stratosphere for `5–6 HP` hypersonic bomber kills. |
| **WVR Dogfight (IR & Optical)** | 15 | `R-60M`, `AIM-9M`, `Magic 2`, `Python-4`, `AAM-3`, `R-73`, `Bozdogan`, `PL-10`, `Python-5`, `AIM-9X-2`, `R-74M2`, `AAM-5B`, `IRIS-T`, `ASRAAM`, `MICA-IR` | `14–38 km` snap-turn and `90°` HOBS seekers (`Mach 2.5–3.2`). Includes `Python-5` **180° rearward** launch capability and `IRIS-T`/`AAM-5B`/`MICA-IR` silhouette decoy filtering (`75%–80%`). |
| **Swarm Micro & Area Burst** | 10 | **Swarm/Micro (6):** `MAM`, `ATASK Starstreak`, `CACM-6`, `AIM-260X Peregrine`, `SADM-8`, `CUDA Hit-to-Kill`<br>**Area Burst (4):** `ADMM-S`, `ADMM`, `MPBM`, `MPBM-II` | High-density `6x–12x` racks (`Starstreak` Mach 3.8 optical darts, `CUDA` 8x half-length hit-to-kill, `ADMM` 360° sphere volleys) and `MPBM`/`MPBM-II` **8.5–10.5 km thermobaric shockwaves**. |

</details>

### Air-to-Ground Ordnance (78 Weapons)

<details>
<summary><b>Click to expand All 78 Air-to-Ground Weapons Across 10 Functional Families</b></summary>
<br>

| A2G Category | Count | Included Weapons | Key Performance & Special Behaviors |
| :--- | :--- | :--- | :--- |
| **Unguided Iron Bombs** | 7 | `OFAB-250`, `Mk-82 Snakeye`, `Mk-83`, `FAB-500`, `Mk-84`, `FAB-1500`, `FAB-3000` | `8.5–12.5 km` low-cost ECM-immune blast bombs (`2–22 HP`). `FAB-1500` and centerline `FAB-3000` penetrate Fortified concrete bunkers in direct passes. |
| **Cluster Dispensers** | 6 | `CBU-87 CEM`, `RBK-500 SPBE-D`, `RBK-500U PTAB-1M`, `CBU-97 SFW`, `CBU-105 WCMD`, `AGM-154A JSOW-A` | `15–74 km` area-saturation dispensers (`5.5–7.0 km` splash radius) neutralizing clustered SAMs, AAA, fuel farms, and aircraft taxiing on airfields. |
| **Glide Bombs & SDBs** | 9 | `FAB-500 UMPK`, `GBU-38 JDAM`, `KAB-500S`, `GBU-32 JDAM`, `GBU-39 SDB`, `SPEAR-3`, `GBU-53 StormBreaker`, `GBU-31 BLU-109`, `AGM-154C JSOW-C` | `26–78 km` all-weather GPS/INS and tri-mode MMW/IIR glide munitions (`8x` SDB internal density, `SPEAR-3` 1-slot mini-cruise, `JSOW-C` stealth BROACH penetrator). |
| **Laser & Dual-Mode Bombs** | 7 | `KAB-250L`, `GBU-12`, `KAB-500L`, `Paveway IV`, `GBU-16`, `GBU-54 LJDAM`, `GBU-10` | `18–30 km` precision bombs (`3.5–10 HP`). `Paveway IV` and `GBU-54` combine GPS/INS + laser to defeat heavy overcast cloud decks. |
| **Bunker Penetrators & Anti-Runway** | 8 | `BLU-107 Durandal`, `BetAB-500ShP`, `JP233`, `GBU-24 Paveway III`, `KAB-1500L-Pr`, `GBU-28`, `GBU-57 MOP`, `TAURUS KEPD-350` | `Durandal`, `BetAB-500ShP`, and `JP233` inflict **2.0× structural damage on runways**; `GBU-28` (`18 HP`), `GBU-57 MOP` (`28 HP`), and `TAURUS` (`115 km` stealth cruise) crack subterranean C2 bunkers. |
| **Saturation & Laser Rockets** | 9 | `Hydra-70` (16x), `S-8KOM` (10x), `Zuni 127mm` (8x), `CRV7-MPSM` (12x), `S-13OF` (8x), `S-24B` (4x), `S-25L/OFM` (4x), `APKWS-II` (12x), `CRV7-PG` (10x) | `11–19 km` high-velocity (`Mach 2.0–2.6`) salvo pods immune to radar jamming. `S-25L/OFM` 340mm laser rockets deal `8.5 HP` bunker-cracking damage. |
| **Tactical ATGMs** | 9 | `AGM-114L Longbow Hellfire`, `AGM-179A JAGM`, `Kh-25ML`, `AGM-65E2`, `AGM-65G`, `Spike-NLOS`, `Brimstone II`, `Kh-29TE`, `Kh-38ML` | `14–42 km` anti-armor and shelter killers (`3.5–8.0 HP`). `Longbow`, `JAGM`, and `Brimstone II` cut through smoke/clouds with MMW seekers; `Kh-38ML` strikes at `Mach 2.4`. |
| **Anti-Radiation Missiles (SEAD)** | 9 | **Legacy (5):** `AGM-45B Shrike`, `MAR-1`, `AS.37 Martel`, `Kh-31P`, `AGM-88C HARM`<br>**Anti-EMCON (4):** `AGM-88E AARGM`, `ALARM Mk2`, `Kh-58UShKE`, `AGM-88G AARGM-ER` | `34–95 km` (`Mach 2.0–3.6`) radar killers dealing **3× damage to active emitters**. Anti-EMCON variants retain coordinates through SAM radar shutdowns. |
| **Cruise & Hypersonic Standoff** | 10 | `SOM-J`, `AGM-84H SLAM-ER`, `Kh-59MK2`, `Storm Shadow`, `AGM-158B JASSM-ER`, `AGM-158C LRASM`, `Kh-101`, `BrahMos-A`, `Kh-32`, `Kh-47M2 Kinzhal` | `85–145 km` strategic deep-strike missiles (`6–18 HP`). `SOM-J` packs 4x stealth cruise missiles per bay; `BrahMos-A` (`M 3.0`), `Kh-32` (`M 4.6`), and `Kinzhal` (`M 6.2`) punch past CIWS. |
| **Loitering Munitions** | 4 | `Switchblade 600`, `SPEAR-EW`, `Delilah-AL`, `IAI Harop` | `45–95 km` autonomous loitering hunters (`89%–92%` base accuracy), including internal stealth `SPEAR-EW` and `Harop` anti-EMCON SEAD drones. |

</details>

### Built-in Cannons, Directed Energy, Gunpods & Utility Pods (54 Systems)

<details>
<summary><b>Click to expand All 16 Built-in Cannons, 13 Gun/Laser Pods & 25 Utility/ECM/TGP Pods</b></summary>
<br>

| System Class | Count | Included Hardware | Operational Capabilities |
| :--- | :--- | :--- | :--- |
| **Built-in Ballistic & CAS Cannons** | 11 | `M61A2 Vulcan` (20mm), `GSh-30-1` (30mm), `BK-27` (27mm), `GAU-12/U` (25mm CAS), `GAU-13/A` (30mm CAS), `GSh-30-2` (twin 30mm CAS), `GAU-8/A Avenger` (30mm), `GSh-6-30` (6-barrel 30mm CAS), `GAU-22/A` (25mm stealth), `GSh-23L` (23mm), `UCAV Micro-Gun` (12.7mm) | `3.6–6.0 km` automatic and manual strafe guns (`0.88–2.50 HP/burst`). Dedicated CAS guns carry `36–40` rounds with `1.55×–1.70×` ground damage and `85%–92%` AP. |
| **Built-in Directed Energy & Railguns** | 5 | `PLSL-10`, `PLSL-20`, `PLSL-30`, `Solid-State Laser (80 kW)`, `EML Railgun` | `7.5–18.0 km` instant hitscan beams (`PLSL`/`DE-Pulse`) and `9.5 km` all-weather `EML` kinetic railgun slugs (`1.90 HP/burst`, `90% AP`, `0.40` target energy drain). |
| **External A2A & Energy Pods** | 8 | `CC422 DEFA 30mm`, `SUU-23/A 20mm`, `SPPU-22 Twin 23mm`, `SPPU-6 6-Barrel 23mm`, `GPU-5/A 30mm`, `PLSL Pulse Laser Pod`, `HEL Solid-State Laser Pod`, `TLS High-Energy Laser Pod` | Augment built-in bursts every salvo with extra cannons or hitscan laser fire (`TLS` fires `3.0 HP` 3-pulse thermal beams). |
| **External A2G Strafe Pods** | 5 | `M230LF 30mm`, `UPK-23-250 Twin 23mm`, `GAU-12/U 25mm Pod`, `GSh-30-2K Twin 30mm`, `BK-37 37mm Tungsten AP` | Dedicated anti-armor strafing pods (`1.5×–2.0×` ground damage, `70%–100%` AP; `BK-37` penetrates Fortified bunker roofs). |
| **Targeting, IRST & ELINT Pods** | 11 | `LANTIRN` (32 km), `LITENING` (38 km), `Sapsan-E` (44 km), `ATFLIR` (48 km), `Damocles` (53 km), `Sniper XR` (58 km), `Legion (IRST + Laser, 56 km)`, `Skyward-G IRST` (40 km), `IRST21` (50 km), `AN/ALQ-218 ELINT` (135 km), `RAPTOR / ATARS` (68 km) | Grant `+14% to +28% A2G Pk`, cut cloud laser scatter by up to `55%`, expose RF/Thermal ground decoys, add silent `28 km` anti-stealth IRST tracking, or boost ARM reach `+15%`. |
| **ECM Jammers & Decoy Pods** | 14 | **ECM Jammers (8):** `ALQ-184` (28%), `ALQ-131` (36%), `ALQ-165 Internal` (32%), `Khibiny L175V` (38%), `Sorbtsiya L005` (44%), `ALQ-99` (48%), `SAP-14 Tarantul` (55%), `ALQ-249 NGJ-MB` (60%)<br>**Decoys (6):** `ADM-160B MALD` (2x), `ADM-141C ITALD` (4x), `BOL-518` (6x), `BriteCloud DRFM` (4x INT), `AN/ALE-50` (8x), `AN/ALE-55 FOTD` (10x INT) | Project `65–125 km` broadband radar suppression against fighters and SAMs (`ALQ-165` fits inside VLO bays), launch decoy gliders to drain SAM racks, or deploy up to `10x` RF repeaters. |

</details>

### Hardpoint Stations, Flight Lead Suites & 25 Modular Upgrades

* **3 Hardpoint Stations:** **Internal Weapons Bays** (zero drag, zero extra RCS), **External Wing Pylons** (`Type S / M / H / X` structural ratings), and **Centerline Stations** (`Kinzhal`, `BrahMos-A`, `Kh-32`, `FAB-3000`), with drag-and-drop equipping and station reordering.
* **Flight Lead Suites:** Assigning a Flight Lead unlocks category-tailored hardware buffs (Stealth `-50%` beam spike & `+15 km` radar; Superiority `+2 HP` & `-50%` G-stress; Multirole `+20%` turn & fast RTB; Strike `+3 HP`, `-1` missile dmg, `60%` gun deflection & `-40%` ordnance drag; EW `+25%` jamming; Drones `2x MALD`; Experimental `-40%` thermal bloom & `+0.30/s` tokens).
* **17 Core Avionics, Armor, Engine & Datalink Upgrades:** `ADM-160 MALD Deployer (2x)`, `Adaptive Digital ECCM (-60% Jam)`, `3D Thrust-Vectoring Nozzles`, `Variable-Cycle Supercruise Core`, `High-Bypass Fuel-Conservation Core`, `GaN AESA Radar Core (+20% Reach)`, `Dual-Band Optical IRST`, `Wide-Band ESM Receiver`, `DAS 360° Optical Suite`, `Titanium-Kevlar Cockpit Tub`, `RAM Nano-Coating (-45% RCS)`, `Expanded Countermeasure Dispenser`, `Digital Autonomous Flight Computer`, `COFFIN Synthetic Vision Bus`, `Autonomous Swarm Datalink`, `MADL Battle Link (+0.10 TOK/s)`, and `TACAN Egress Beacon (50% faster RTB)`.
* **8 Strike, SEAD & Survivability Subsystems:** `AN/APQ-174 Terrain-Following Radar` (`+2,500 ft` SAM floor & `-25%` look-down below 10,000 ft), `Digital CCIP / CCRP Strike Computer` (`+16%` bomb/rocket Pk & `+15%` range), `AN/ASQ-213 HARM Targeting System` (`+20%` ARM range, `+14%` ARM Pk, `130 km` emitter ID), `Conformal Ordnance Fairings` (`-40%` external drag & `-20%` weight), `Titanium-Kevlar Belly Flak Shielding` (`+1 HP` & `-45%` AAA/CIWS dmg), `Integrated Gimbaled Laser Designator` (`+15%` A2G Pk & `-35%` cloud scatter), `Two-Way MITL Weapons Datalink` (`+14%` GPS/cruise accuracy & `-50%` jamming), and `DIRCM Infrared Jammer Turret` (`+24%` vs IR seekers + 2 chaff).

---

## Mission Editor, Live Inspection Suite & Post-Sortie Analytics

* **Custom Mission Editor:** Unranked combat laboratory with independent `RANDOM` toggles per field, scenario-adaptive Air vs. Attack difficulty & doctrine menus, independent Blue & Red procedural fleets with custom `10M–2,500M` budgets, cloud density, Ground IADS grid toggles (`Full`, `Light`, `Off`), civilian RoE toggles, and Inspection Mode activation.
* **Live C4ISR Inspection Suite (6 Tabs + Time-Stop):** Analyze physics mid-battle or freeze simulation time completely:
  * **OVERVIEW & AI COGNITION:** Armor pips, corner speed, energy, VSI, active AI Doctrine, Tactical Role, Focus Slot timers, Formation Pairing, Chain-of-Command status, and live **Active AI Control Arrows** above controlled enemy contacts on the radar scope.
  * **SENSORS & WEAPONS:** Radar beam alignment, RCS aspect multipliers, cloud attenuation, real-time Pk gauges, factor breakdowns, and step-by-step inbound defense protocols.
  * **GRAPHS:** Five live telemetry charts—**Dynamic Launch Zone (DLZ & Pk vs Range)**, **360° RCS Polar Radiation Diagram**, **Dynamic Turn Speed Gauge**, **Rolling 60s Speed & Altitude History**, and **Fleet Combat Power Advantage Curve**.
  * **EVENTS & DATA:** Clickable chronological causal log and full raw entity kinematics/AI variables.
* **Sortie Replay, Debrief & Top 10 Leaderboard:** Delta-compressed interactive replay (`0.5×`, `1×`, `2×` speed, timeline scrubbing, key engagement jump chips), Ace Podium Rankings, Fleet Strength Over Time graph, full scoreboard, persistent Top 10 historical dossier archive, and a searchable **18-Section Flight Manual**.

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