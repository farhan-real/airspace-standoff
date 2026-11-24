/**
 * js/ui/procurement/specs/weaponbehaviors.js - Extracts rare (<6 items) special and unique behaviors for weapons and pods.
 */

class WeaponBehaviorCodex {
  static getWeaponBehaviors(w) {
    if (!w || !w.id) throw new Error('WeaponBehaviorCodex.getWeaponBehaviors requires a valid weapon object.');
    const items = [];

    if (w.isJammerPod && w.slotType === 'INTERNAL') {
      items.push({
        color: '#00f0ff',
        short: 'Internal Stealth Jammer (only ECM pod usable inside VLO bays)',
        detail: 'Mounts inside concealed stealth weapon bays with zero drag or radar bloom while projecting a 75 km 32% jamming field.'
      });
    }

    if (w.isTargetingPod) {
      if (w.grantsESM) {
        items.push({ color: '#fbbf24', short: 'Passive ELINT Pod (135km emitter ID & +15% ARM reach)', detail: 'Exposes active enemy ground radars and SAMs out to 135 km and boosts Anti-Radiation Missile reach by +15%.' });
      }
      if (w.grantsIRST) {
        const irstKm = w.irstRangeKm || 28;
        const a2aStr = w.a2aPkBonus ? ` +${Math.round(w.a2aPkBonus * 100)}% A2A Pk` : '';
        items.push({ color: '#00f0ff', short: `Passive Air IRST (${irstKm}km stealth burn${a2aStr})`, detail: `Enables silent optical air-to-air stealth detection inside ${irstKm} km, speeds bogey/stale classification by +${Math.round(((w.airTrackSpeedMult || 1) - 1) * 100)}%, and resists Doppler notching.` });
      }
      if (w.slotType === 'INTERNAL') {
        items.push({ color: '#00f5a0', short: 'Internal VLO Sensor Bay (mounts flush inside stealth bays)', detail: 'Fits inside internal stealth bays without external pylon drag or large RCS bloom.' });
      }
      if (w.grantsDatalinkRelay) {
        items.push({ color: '#c084fc', short: 'Optical Datalink Relay (+0.20 TOK/s & anti-jam ECCM)', detail: 'Projects a high-bandwidth optical crosslink boosting command token regeneration and mid-course track stability.' });
      }
      if (w.cloudMitigation >= 0.40) {
        items.push({ color: '#00f5a0', short: `Heavy Cloud Cut (-${Math.round(w.cloudMitigation * 100)}% laser scatter & 50+km Thermal decoy ID)`, detail: `Cuts cloud laser attenuation by ${Math.round(w.cloudMitigation * 100)}% and exposes Thermal & Visual SAM mockups out to ${w.spotRangeKm} km.` });
      }
      return items;
    }

    if (w.isDecoyDrone) {
      items.push({ color: '#c084fc', short: 'Flying Bait Drone (mirrors RCS to waste enemy & SAM missiles)', detail: 'Launches autonomous gliders for 55s that mirror your radar signature, deceiving enemy fighters and baiting Attack Mode SAM ready racks.' });
      return items;
    }

    if (w.isDecoy) {
      items.push({ color: '#c084fc', short: `RF Repeater (${w.ammoCount}x expendable or towed decoy charges)`, detail: `Expands your active RF countermeasure charges by ${w.ammoCount} to pull radar-guided missiles off your aircraft.` });
      return items;
    }

    if (w.isGunpod) {
      if (w.isLaser) {
        items.push({ color: '#00f0ff', short: 'Hitscan Laser Pod (0 lead needed, -45% dmg per cloud cell)', detail: 'Speed-of-light beam hits instantly without lead prediction, but intersecting clouds scatter 45% of beam energy per cell.' });
      } else if (w.isBunkerCracker) {
        items.push({ color: '#fbbf24', short: '37mm Bunker-Piercing Pod (2.0x ground dmg & 100% AP)', detail: 'Tungsten-core shells deal 2.0x ground damage at 100% armor piercing and penetrate Fortified bunker and shelter roofs.' });
      } else if (w.isA2GGunpod) {
        items.push({ color: '#fbbf24', short: `Ground Strafe Pod (${w.groundDamageMult}x ground dmg, ${Math.round(w.armorPiercing * 100)}% AP)`, detail: `Fires alongside built-in guns on every burst, multiplying ground damage by ${w.groundDamageMult}x with ${Math.round(w.armorPiercing * 100)}% armor piercing.` });
      }
      return items;
    }

    if (w.trait === 'RAMJET_SUSTAINED') {
      items.push({ color: '#00f0ff', short: `Sustained Ramjet (Mach ${w.speedMach} with near-zero decay)`, detail: `Variable-flow ramjet holds Mach ${w.speedMach} thrust all the way to ${w.rangeKm} km with minimal drag loss (lambda ${w.lambda}).` });
    } else if (w.trait === 'DUAL_PULSE_SURGE') {
      items.push({ color: '#00f5a0', short: 'Dual-Pulse (+0.9M surge & +18% Pk inside 22km)', detail: 'Second rocket motor ignites inside 22 km, surging +0.90 Mach and adding +16% to +18% terminal kill probability.' });
    } else if (w.trait === 'STEALTH_SEEKER') {
      items.push({ color: '#00f0ff', short: `VLO Missile (0.0005m2 RCS) & +${Math.round((w.antiNotchBonus || 0.35) * 100)}% notch resistance`, detail: 'Very low observable missile delays enemy radar and RWR warning while resisting Doppler notch maneuvers.' });
    } else if (w.trait === 'AESA_ANTI_NOTCH') {
      items.push({ color: '#00f0ff', short: `Micro-AESA (+${Math.round((w.antiNotchBonus || 0.30) * 100)}% notch & ${Math.round((w.decoyResistance || 0.50) * 100)}% chaff resistance)`, detail: 'Active phased-array seeker resists Doppler notching and rejects chaff interference.' });
    } else if (w.trait === 'SHOCKWAVE_DETONATION') {
      const rKm = w.aoeRadiusKm || 8.5, sDmg = w.aoeDamage || 5;
      items.push({ color: '#fb7185', short: `${rKm}km Thermobaric Blast (up to ${sDmg} HP splash damage)`, detail: `Detonates a ${rKm} km shockwave on hit, inflicting up to ${sDmg} HP splash damage to all nearby aircraft and ground targets.` });
    } else if (w.trait === 'REAR_ENGAGE') {
      items.push({ color: '#c084fc', short: '180 deg Rear Launch (fires backwards without turning)', detail: 'Full-sphere optical lock lets you shoot directly behind your aircraft at pursuing bandits.' });
    } else if (w.trait === 'ALL_ASPECT_BURST') {
      items.push({ color: '#c084fc', short: '360 deg Omni-Volley (zero boresight cone restriction)', detail: 'Launches micro-missiles across a full 360 deg sphere regardless of aircraft heading.' });
    } else if (w.trait === 'IMAGE_RECOGNITION') {
      items.push({ color: '#00f5a0', short: `${w.rangeKm >= 38 ? `Silent ${w.rangeKm}km IR ambush & ` : ''}${Math.round((w.decoyResistance || 0.75) * 100)}% decoy reject`, detail: `Optical silhouette matching rejects ${Math.round((w.decoyResistance || 0.75) * 100)}% of thermal flares.${w.rangeKm >= 38 ? ` Silent ${w.rangeKm} km BVR IR seeker triggers zero RWR alert.` : ''}` });
    } else if (w.trait === 'HOBS_VANE' && w.category === 'A2A' && w.a2aGroup !== 'WVR') {
      items.push({ color: '#38bdf8', short: `${w.rangeKm}km Wide-Cone BVR (90 deg off-boresight launch)`, detail: 'Thrust-vectored compact missile capable of 90 deg off-boresight launches.' });
    } else if (w.a2aGroup === 'SWARM_MICRO') {
      items.push({ color: '#38bdf8', short: `${w.isHitToKill ? 'Hit-to-Kill ' : ''}Micro-Saturation (${w.ammoCount}x compact volley rounds)`, detail: `High-density ${w.ammoCount}-round rack designed to overwhelm point defenses and saturate targets.` });
    }

    if (w.hojBonus > 0) {
      items.push({ color: '#c084fc', short: `Home-On-Jam (+${Math.round(w.hojBonus * 100)}% Pk vs ECM/EW & High-Power Radars)`, detail: `Locks directly onto enemy jamming emissions and high-power radars for +${Math.round(w.hojBonus * 100)}% Pk and strong anti-notch tracking.` });
    }
    if (w.category === 'A2A' && w.seeker === 'IIR' && w.rangeKm >= 40) {
      items.push({ color: '#00f5a0', short: `Silent ${w.rangeKm}km IR BVR (zero RWR alert, notch/chaff immune)`, detail: 'Passive thermal homing gives targets zero radar warning and ignores chaff and 90-degree Doppler notching.' });
    } else if (w.category === 'A2A' && w.seeker === 'PASSIVE_RADAR' && !w.hojBonus) {
      items.push({ color: '#fbbf24', short: 'Passive Anti-Radar A2A (homes on enemy radar emissions)', detail: 'Stealthy passive RF homing locks onto active enemy aircraft radars without emitting.' });
    }
    if (w.heavyTargetBonus) {
      items.push({ color: '#fbbf24', short: 'Heavy-Target Bonus (up to +25% Pk vs loaded jets)', detail: 'Gains up to +25% Pk against high-payload-ratio (Wr) bombers and heavily loaded fighters.' });
    }

    if (w.trait === 'LOFTED_HYPERSONIC' || w.trait === 'HYPERSONIC_IMPACT') {
      items.push({
        color: w.speedMach >= 5.0 ? '#fb7185' : '#38bdf8',
        short: w.speedMach >= 5.0 ? `Hypersonic Mach ${w.speedMach} Loft-Dive (100% CIWS Immune)` : `Stratospheric Loft-Dive (Mach ${w.speedMach})`,
        detail: w.speedMach >= 5.0 ? `Lofts high and dives at Mach ${w.speedMach}, completely bypassing all CIWS point-defense interception.` : `Climbs into the stratosphere before plunging toward target at Mach ${w.speedMach}.`
      });
    } else if (w.a2gGroup === 'CRUISE' && w.speedMach >= 3.0) {
      items.push({ color: '#38bdf8', short: `Mach ${w.speedMach} Ramjet Cruise (-55% CIWS intercept rate)`, detail: `Supersonic Mach ${w.speedMach} sea-skimming cruise cuts CIWS interception accuracy by 55%.` });
    }

    if (w.isAntiRunway) {
      items.push({ color: '#00f5a0', short: `2.0x Runway Cratering${w.isCluster ? ' + 4.5km runway cluster' : ''}`, detail: `Deals double structural damage (2.0x) to airbase runway segments.${w.isCluster ? ' Also scatters 4.5 km mine submunitions hitting taxiing jets.' : ''}` });
    }
    if (w.isCluster && w.slotType === 'INTERNAL') {
      items.push({ color: '#00f5a0', short: 'Internal-Bay Cluster Glide (6.5km AOE from VLO bays)', detail: 'Fits inside stealth internal weapon bays while saturating a 6.5 km surface footprint.' });
    }
    if (w.id === 'GBU-57') {
      items.push({ color: '#fbbf24', short: '28 HP MOP (destroys 18 HP C2 Bunkers in 1 hit)', detail: '30,000 lb Massive Ordnance Penetrator destroys Fortified C2 Bunkers in a single direct hit.' });
    } else if (w.id === 'FAB-3000') {
      items.push({ color: '#fbbf24', short: '22 HP Super-Heavy Bomb (1-hit C2 Bunker kill)', detail: '3,000 kg demolition bomb obliterates Fortified C2 Bunkers in one direct flyover.' });
    } else if (w.id === 'SOM-J') {
      items.push({ color: '#00f5a0', short: '4x Internal Stealth Cruise (high-volume CIWS saturation)', detail: 'Fits 4 stealth cruise missiles per internal bay station to overwhelm CIWS point defenses.' });
    }

    if (w.seeker === 'MMW_IIR') {
      items.push({ color: '#c084fc', short: 'Tri-Mode MMW+IIR (ignores cloud & tracks mobile SAMs)', detail: 'Multi-mode radar and infrared seeker cuts through overcast clouds and ground jamming.' });
    } else if (w.trait === 'DUAL_GPS_LASER') {
      items.push({ color: '#00f5a0', short: 'Dual GPS+Laser (keeps precision through heavy clouds)', detail: 'Retains full GPS/INS accuracy through overcast clouds while keeping Targeting Pod bonuses.' });
    } else if (w.seeker === 'MMW') {
      items.push({ color: '#c084fc', short: 'All-Weather MMW Radar (ignores clouds & optical smoke)', detail: 'Millimeter-wave active homing penetrates heavy clouds without laser scatter penalties.' });
    }

    if (w.isRocketPod && w.seeker === 'LASER') {
      items.push({ color: w.id === 'S-25OFM' ? '#fbbf24' : '#00f5a0', short: `${w.id === 'S-25OFM' ? '340mm 8.5 HP Laser Bunker Rocket' : 'Guided Laser Rockets (TGP boosted)'}`, detail: `Combines rocket pod salvo speed with semi-active laser guidance.${w.id === 'S-25OFM' ? ' Punches through Fortified concrete shelters and SAMs at 18 km.' : ''}` });
    } else if (w.id === 'CRV7-MPSM') {
      items.push({ color: '#38bdf8', short: 'Mach 2.6 Tungsten Flechettes (85% AP, ECM immune)', detail: 'High-velocity Mach 2.6 unguided rockets penetrate 85% of armored SAM plating.' });
    }

    if (w.isAntiRadiation && w.slotType === 'INTERNAL') {
      items.push({ color: '#00f5a0', short: 'Internal-Bay Anti-EMCON ARM (3x emitter dmg, VLO bay)', detail: 'Mounts inside stealth internal bays, deals 3x damage to emitters, and retains MMW/INS lock through EMCON shutdowns.' });
    } else if (w.isAntiRadiation && !w.antiEmcon) {
      items.push({ color: '#fb7185', short: 'Legacy ARM: breaks lock if SAM enters EMCON shutdown', detail: 'Passive RF seeker loses target track if the enemy radar shuts off into EMCON before impact.' });
    }
    if (w.a2gGroup === 'LOITERING') {
      items.push({ color: '#fbbf24', short: 'Loitering Suicide Drone (high-precision standoff hunter)', detail: `Autonomous loitering munition with ${Math.round(w.T_0 * 100)}% terminal accuracy across ${w.rangeKm} km.` });
    }

    return items;
  }
}

window.WeaponBehaviorCodex = WeaponBehaviorCodex;
