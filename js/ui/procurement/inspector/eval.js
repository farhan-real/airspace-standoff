/**
 * AIRSPACE STANDOFF: 5-Tier Color Classification Engine
 * Calibrated against 150km theater weapon ranges, acquisition costs & radar beam spikes.
 */

class StatEvaluator {
  static rate(type, value) {
    const val = (value !== undefined && value !== null && !isNaN(value)) ? Number(value) : 0;

    switch (type) {
      case 'speed':
        if (val >= 1.10) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 1.00) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 0.85) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 0.70) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'agility':
        if (val >= 0.94) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 0.88) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 0.80) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 0.60) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'glimit':
        if (val >= 15.0) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 9.5)  return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 8.5)  return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 6.5)  return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'hp':
        if (val >= 7) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 5) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 4) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 3) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'radar_range':
        if (val >= 95) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 80) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 65) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 50) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'radar_cone':
        if (val >= 135) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 120) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 110) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 95)  return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'clutter':
        if (val >= 0.35) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 0.28) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 0.22) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 0.18) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'rcs':
      case 'missile_rcs':
        if (val <= 0.0005) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 0.01)   return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 0.80)   return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 3.50)   return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'beam_spike':
        if (val <= 1.8) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 2.4) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 3.2) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 3.8) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'ordnance_mass':
      case 'component_mass':
      case 'deadweight':
        if (val <= 250)  return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 600)  return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 1100) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 2200) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'payload_capacity':
        if (val >= 14000) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 8000)  return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 5000)  return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 2500)  return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'pylon_slots':
        if (val >= 12) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 8)  return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 6)  return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 4)  return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'upgrade_sockets':
        if (val >= 4) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 3) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 2) return { tier: 3, colorClass: 'stat-tier-3' };
        return { tier: 4, colorClass: 'stat-tier-4' };

      case 'cost_airframe':
        if (val <= 15.0) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 25.0) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 35.0) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 48.0) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'cost_weapon':
        if (val <= 0.7) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 1.5) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 2.2) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 3.0) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'cost_upgrade':
        if (val <= 0.8) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 1.5) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 2.0) return { tier: 3, colorClass: 'stat-tier-3' };
        return { tier: 4, colorClass: 'stat-tier-4' };

      case 'missile_range':
        if (val >= 110) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 75)  return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 50)  return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 25)  return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'min_arming':
        if (val <= 1.0) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val <= 2.5) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val <= 5.0) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val <= 8.0) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'missile_speed':
        if (val >= 5.0) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 4.0) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 3.0) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 1.0) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'missile_damage':
        if (val >= 6) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 4) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 3) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 2) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'ammo_count':
        if (val >= 8) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 4) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 2) return { tier: 3, colorClass: 'stat-tier-3' };
        return { tier: 4, colorClass: 'stat-tier-4' };

      case 'gun_rpm':
        if (val >= 5000) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 3000) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 1800) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 1400) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      case 'gun_dps':
        if (val >= 3.5) return { tier: 1, colorClass: 'stat-tier-1' };
        if (val >= 2.5) return { tier: 2, colorClass: 'stat-tier-2' };
        if (val >= 2.0) return { tier: 3, colorClass: 'stat-tier-3' };
        if (val >= 1.5) return { tier: 4, colorClass: 'stat-tier-4' };
        return { tier: 5, colorClass: 'stat-tier-5' };

      default:
        return { tier: 3, colorClass: 'stat-tier-3' };
    }
  }
}

window.StatEvaluator = StatEvaluator;