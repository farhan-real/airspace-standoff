# AIRSPACE STANDOFF

[![Platform](https://img.shields.io/badge/PLATFORM-DESKTOP_%7C_MOBILE_%7C_TABLET-10b981?style=for-the-badge)](#platform-support--controls)
[![Dependencies](https://img.shields.io/badge/DEPENDENCIES-ZERO-6366f1?style=for-the-badge)](#technology-stack)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](./LICENSE)

---

**Air superiority isn't achieved with reflexes. It's won through precision.**

Modern air combat has outgrown the cockpit heroics of the past. Battles are decided beyond visual range, hundreds of kilometers away, by sensor fusion, radar physics, and brutal missile energy envelopes.

You don't just fly the jet, you dictate the battle. Stationed at a high-contrast C4ISR tactical radar terminal, you command an entire combat air wing across 15,000 km² of contested sky. Coordinate multi-ship formations, manage aspect-dependent Radar Cross-Sections (RCS), and exploit enemy blind spots while strictly regulating your own emissions.

**Missiles start the fight, but information wins it.** Sift ground truth from electronic deception, sever the enemy's situational awareness, and strike while they are still flying blind. In modern air warfare, whoever commands the data commands the sky.

---

## Overview

| Dimension | Specification | Operational Reality |
| :--- | :--- | :--- |
| **Theater Grid** | 150 km × 100 km (FL000 to FL650) | Full 3D altitude staging and energy combat |
| **Command Scope** | Up to 16 aircraft per squadron | Air superiority, stealth, strike, EW, and UCAV drone swarms |
| **Threat Intelligence** | Two-phase track identification | Contacts enter as `BOGEY [?]`; positive ID required before release |
| **Missile Guidance** | Proportional Navigation (ProNav) | Rocket burnout, drag decay, and dynamic kinetic overshoots |
| **Tactical AI** | Cognitive attention allocation | Finite commander focus slots, formation pairings, and disruption |
| **Inspection Suite** | Real-time C4ISR telemetry | Time-stop analysis, hit factor breakdowns, and live active AI arrows |

---

## Core Operational Pillars

### 1. The Scope is Your Battlespace

```
[BOGEY ?]  ──────────►  [NCTR TRACKING]  ──────────►  [IDENTIFIED HOSTILE]
Unverified Track        Continuous Forward Beam       Cleared for Firing (No Penalty)
```

* **Fourth-Root Microwave Radar Physics:** Detection envelopes are computed dynamically each simulation tick using the Radar Range Equation. Reducing an aircraft's radar cross-section (RCS) by 10,000× cuts detection range by 90%, enabling true Very Low Observable (VLO) penetration.
* **Beam Exposure Spikes:** Banking 90° broadside exposes leading edges and flat fuselage surfaces, multiplying radar returns by up to 3.5× and making beam maneuvers a critical risk calculation.
* **Rules of Engagement (ROE):** Neutral commercial airliners transit civilian flight corridors. Releasing weapons on an unverified bogey incurs an immediate **-600 VP** penalty; shooting down an airliner incurs **-2,000 VP**.
* **Orbital Satellite Uplink:** When the hostile fleet is reduced to 3 or fewer aircraft, orbital surveillance locks onto remaining bandits, transmitting real-time tracking downlinks directly to your radar screen.

---

### 2. Kinetic Missile Kinematics & Multi-Layer Defenses

Missiles in *AIRSPACE STANDOFF* do not use scripted hit rolls or guaranteed tracking dice. Every weapon is simulated as an autonomous kinetic entity governed by aerodynamic drag and proportional pursuit.

#### Seekers & Countermeasures

| Seeker | Guidance Type | Representative Weapons | Primary Countermeasure Protocol |
| :--- | :--- | :--- | :--- |
| **ARH** | Active Radar Homing | AIM-120D, Meteor, PL-15E, AIM-260, R-37M | **Doppler Notch (Beam 90°) + Chaff.** Zeros radial closure to break radar gate. |
| **IIR / EO** | Imaging Infrared / Optical | AIM-9X-2, Python-5, IRIS-T, R-73 | **Throttle to IDLE + Cloud Dive.** Cuts exhaust plume; cloud moisture scatters seeker optics. |
| **INS / Radar** | Aero-Ballistic Hypersonic | Kh-47M2 Kinzhal | **Hard 90° Break + CIWS Intercept.** Exploits wide Mach 5+ turn radius to force overshoot. |
| **Passive RF** | Anti-Radiation (SEAD) | AGM-88G AARGM-ER | **Emitter Deactivation.** Power down radar arrays and jamming pods to starve the seeker. |

#### Propulsion & Staging
* **Solid Boost-Sustain:** Rapid rocket ignition followed by aerodynamic drag decay.
* **Dual-Pulse Surge:** Motor burns out in cruise, then ignites a secondary pulse within 22 km to surge additional speed into terminal evasion.
* **Continuous Ramjets:** Variable-flow ramjet maintains sustained supersonic speeds with zero drag decay across its maximum range.
* **Multi-Missile Salvos:** Consecutive missiles degrade target maneuver agility by **25% per weapon**. Pairing an Active Radar missile with an Infrared missile triggers a **+25% Mixed-Seeker Dilemma** that punishes conflicting defensive moves.

---

### 3. Humanized Cognitive AI & Command Succession

Adversary pilots operate under authentic human-performance constraints rather than artificial stats:

```
[ENEMY COMMANDER]
    ├── Active Focus Slot 1 ──► [Flight Lead] (Active Steering / Missile Trap)
    ├── Active Focus Slot 2 ──► [Wingman]     (Coordinated Cross-Fire)
    └── Unfocused ────────────► [Reserve UCAV] (Autonomous Standby Patrol)
```

* **Finite Attention Allocation:** Commanders control between 1 and 3 aircraft at a time depending on difficulty.
* **Chain of Command Disruption:** Eliminating an enemy flight lead triggers command disruption. Surviving wingmen freeze their offensive pursuit, drop throttle to 40%, and hesitate for up to 6.0 seconds while leadership reorganizes.
* **Enemy Aces:** High-threat sectors deploy designated Aces featuring triple-tier weapon loadouts (ultra-long standoff, ramjet BVR, and all-aspect dogfight), disciplined Doppler notching, and optimal corner-speed throttle control.

---

## Airframe

Squadrons are built under budget constraints ranging from **$200M Austerity** to **$650M Full Readiness** across 16 available hangar slots.

### Airframe Categories

<details>
<summary><b>Click to expand the 8 Airframe Disciplines (35+ Aircraft)</b></summary>
<br>

| Category | Typical Airframes | Key Strengths & Tactics |
| :--- | :--- | :--- |
| **Stealth Air Dominance** | F-22A, YF-23, F-35A, Su-57, J-20, FC-31, J-35, Su-75 | Sub-0.005 m² RCS; internal weapons bays for zero parasite wave drag. |
| **Air Superiority** | MiG-31BM, F-15EX, Su-35S, Eurofighter, Rafale C, Su-30SM, F-14D, J-16 | High-altitude supercruise, heavy radar reach, and 10 to 14 missile stations. |
| **Multirole Fighters** | F-16V, Mirage 2000-5, JAS-39E Gripen, F/A-18E, KF-21, MiG-29K, Tejas Mk2 | Balanced BVR capability, agile dogfighting merges, and rapid base turnaround. |
| **Dedicated Strike** | A-10C, Su-25SM3, Su-34 Fullback, B-1B Lancer, Tu-160M, B-21, B-2A | Welded titanium armor tubs, high structural HP, and heavy bunker penetrators. |
| **Electronic Warfare** | EA-18G Growler, Tornado ECR, EF-111A Raven, J-16D | High-power GaN AESA jamming umbrellas (up to 125 km) and passive ESM geolocation. |
| **Swarm & Drones** | MQ-99, MQ-101, XQ-58A Valkyrie, Kizilelma, S-70 Okhotnik, MQ-28, RQ-180 | High-G structural thresholds (up to 20G) with zero pilot blackout risk. |
| **Experimental Flagships** | ADF-11F Raven, CFA-44 Nosferatu, ADFX-01 Morgan, X-02S, Darkstar | Exotic airframes featuring 3D TVC, pulse lasers, and kinetic railguns. |
| **COFFIN Synthetic Vision** | F-15 S/MT, Su-37, F-22C, ADF-11F COFFIN conversions | Fluid-immersed enclosed cockpits locking turn rate at 100% and granting +25% dodge. |

</details>

### Hardpoint Types
* **Internal Weapons Bays:** Enclosed fuselage bays that produce **zero aerodynamic drag** and **zero added radar cross-section**.
* **External Wing Pylons:** Heavy carriage for universal stores, anti-radiation missiles, and ECM pods at the cost of cruise drag and radar bloom.
* **Centerline Fuselage Stations:** Heavy-duty reinforced rails engineered specifically for hypersonic aero-ballistic weapons like the Mach 6.2 Kh-47M2 Kinzhal.

---

## Live Sortie Inspection Mode

Toggle **Inspection Mode** during any mission to access real-time C4ISR telemetry without pausing flight controls:

- **OVERVIEW:** Fuselage armor pips, corner speed, altitude, and live AI cognition
- **SENSORS:** Instrumented radar reach, scan cones, active locks, and clutter
- **WEAPONS:** Dynamic hit probability (Pk) factor breakdown and threat alerts
- **EVENTS:** Chronological causal log of launches, impacts, and decoys
- **DATA:** Raw telemetry, coordinates, Mach velocity, G-stress, and states

**Simulation Time-Stop:** Freeze simulation physics at any second to evaluate sensor data, line-of-sight aspect angles, and missile kill probability before resuming.

**AI Tactical Cognition Dossier:** Inspect any enemy aircraft to see active attention slots, focus timers, squadron posture, formation pairings, and chain-of-command disruption status.

**Hit Probability (Pk) Math Engine:** Review exact additive factors behind every shot, including energy bleed, aspect multipliers, seeker guidance, and cloud scattering.

---

## Controls & Platform Support

### Desktop

| Category | Input / Action | Tactical Function |
| :--- | :--- | :--- |
| **Flight Steering** | `Left` / `Right` Arrow (or `A` / `D`) | Continuous aerodynamic roll and turn authority |
| **Throttle Quadrant** | `[` / `]` | Step engine power (Idle, Cruise, Mil Power, Afterburner) |
| **Energy Trades** | `X` / `Z` | Kinetic Dive (altitude to speed) / Zoom Climb (speed to altitude) |
| **Squadron Selection** | `Up` / `Down` Arrow | Switch cockpit focus across active operational fighters |
| **Target Acquisition** | `T` (or `Tab`) / `Space` / `Right Click` | Cycle detected contacts / Instant Auto-Lock nearest threat |
| **Autocannon Strafe** | `G` | Boresight autocannon burst |
| **Stores Release** | `1` through `9` | Discharge ordnance from Stations 1 through 9 |
| **Countermeasures** | `F` | Deploy emergency chaff cloud |
| **Turnaround** | `R` | Order aircraft to Return to Base (RTB) for re-arm/repair |
| **Radar Layers** | `V` / `B` | Toggle radar declutter / Toggle ground IADS targets overlay |
| **Camera Viewport** | `C` / `0` (or `Backspace`) | Center & track active fighter / Reset panoramic theater view |
| **Simulation Warp** | `P` (Pause), `J` (1X), `K` (2X), `L` (4X) | Control battle simulation speed |
| **System Menus** | `O` / `M` | Open Settings & Keybinds / Open Tactical Flight Manual |

### Mobile & Tablet Optimizations
* **Dedicated Steering Overlay:** On-screen banking buttons for high-G defensive turns.
* **Touch Radar Pan & Pinch-Zoom:** Fluid two-finger pinch-to-zoom and drag panning across the 150 km grid.
* **Responsive HUD:** Automatic workspace layout adaptation supporting both **Portrait** and **Landscape** orientations.
* **Android APK Support:** Packages directly into a native Android WebView container with full GPU hardware acceleration.

---

## Technology Stack

| Layer | Implementation | Highlights |
| :--- | :--- | :--- |
| **Simulation & Physics** | Pure Vanilla JavaScript (ES6+) | Discrete numerical integration, true ProNav guidance, fourth-root radar equation |
| **Rendering Engine** | HTML5 Canvas 2D | Uncapped 60 FPS rendering and device pixel ratio scaling |
| **Audio Architecture** | Web Audio API | 100% procedural sound synthesis (turbines, cannon bursts, rocket motors, RWR tones) |
| **User Interface** | Modular Vanilla CSS | Pitch-black liquid-glass theme, responsive flex/grid layouts, SVG icons|
| **Data Persistence** | Client-Side Web Storage | Full sortie replays, custom aircraft presets |
| **Dependencies** | None (Zero Dependencies) | Zero third-party runtime frameworks or build steps |

---

## How to Run

### 1. Online
Play directly in your browser:  
**[https://farhan-real.github.io/airspace-standoff/](https://farhan-real.github.io/airspace-standoff/)**

### 2. Directly (Offline)
Clone or download this repository, then double-click `index.html` to open it in any modern browser (Chrome, Firefox, Safari, Edge).

### 3. Local Server (Optional)
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

*Fully playable on both desktop and mobile/tablet touchscreens.*

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.  
See the [LICENSE](./LICENSE) file for the full license text.