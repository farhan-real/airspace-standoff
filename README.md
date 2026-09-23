# Airspace Standoff

A browser-based tactical air combat simulator played entirely from a top-down radar display. Command fighters, bombers, and autonomous drones in beyond-visual-range (BVR) missile duels across a 150×100 km contested battlespace.

---

## Features

- **Radar & Observability:** All contacts begin as unverified `BOGEY [?]` returns. Detection envelopes model microwave radar physics based on Radar Cross-Section (RCS), 90° broadside beam spikes, and ground clutter filtering.
- **Authentic Missile Guidance:** Missiles fly using Proportional Navigation (ProNav) with multi-stage solid boosters, continuous ramjets, and terminal surges. Targets that break outside a missile's turn limit force kinetic overshoots rather than scripted misses.
- **Electronic Warfare:** Break radar locks by beaming 90° (Doppler notching), deploying chaff corridors, trailing towed decoys, or launching autonomous radar-mirroring decoy drones.
- **Energy Fighting & G-Force Physics:** Balance throttle detents, kinetic dives, and corner turn speeds. Push sustained turns too far and pilots suffer tunnel vision or G-LOC blackouts—or deploy unmanned UCAVs and COFFIN cockpits for high-G immunity.
- **Deep Hangar & Loadout Customization:** Build squadrons under credit budgets with extensive tactical freedom:
  - **35+ Aircraft Across 8 Categories:** Field stealth fighters, heavy missile trucks, multirole workhorses, armored tank busters, supersonic electronic attack escorts, swarm drones, and experimental superfighters.
  - **Diverse Ordnance & Weaponry:** Outfit long-range active radar missiles, high-off-boresight heat seekers, hypersonic bunker penetrators, precision glide bombs, thermobaric burst rockets, and standoff jamming pods.
  - **Gunnery, Lasers & Railguns:** Swap standard rotary Gatlings for heavy 30mm cannons, external gunpods, tactical pulse lasers, speed-of-light chemical lasers, or kinetic railguns.
  - **Modular Avionics & Components:** Install 3D thrust-vectoring nozzles, variable-cycle supercruise engines, GaN AESA radar arrays, dual-band IRST optics, digital ECCM processors, and RAM stealth coatings.
  - **Flight Lead Perks & Live Dual-Colored Stats:** Designate a specialized flight lead with formation buffs, and watch real-time dual-colored metrics reveal the exact trade-offs on your radar cross-section, top Mach speed, and turn agility as weapons add carriage weight.
- **Combat Theaters:** Face adversary flight leads, integrated SAM batteries, and command bunkers across Skirmish, multi-wave Dynamic Theater, and 2-Player Local Versus modes. Watch your fire: commercial airliners transit the sector under strict Rules of Engagement.

---

## How to Run

1. **Online:** Play directly at [https://farhan-real.github.io/airspace-standoff/](https://farhan-real.github.io/airspace-standoff/)
2. **Directly (Offline):** Double-click `index.html` to open it in any modern browser (Chrome, Firefox, Safari, Edge).
3. **Local Server (Optional):**
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000`.

*Fully playable on both desktop and mobile/tablet touchscreens.*
