/**
 * AIRSPACE STANDOFF // Aircraft Lead Buffs Submodule
 * Modular application of category flight lead enhancements.
 */

class AircraftLeadBuffs {
  static apply(aircraft) {
    const cat = (aircraft.spec && aircraft.spec.category) || 'MULTIROLE';
    aircraft.leadExtraCm = 2;
    aircraft.leadEvasionBonus = 0.15;

    switch (cat) {
      case 'STEALTH':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 1;
        if (aircraft.spec.sigma_0) aircraft.spec.sigma_0 *= 0.65;
        aircraft.beamSpikeReduction = 0.50;
        if (aircraft.spec.R_0) aircraft.spec.R_0 += 15.0;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.25;
        aircraft.radarIdentifySpeed = 1.6;
        aircraft.leadEvasionBonus = 0.15;
        break;
      case 'SUPERIORITY':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        if (aircraft.spec.sigma_0) aircraft.spec.sigma_0 *= 0.60;
        if (aircraft.spec.S_0) aircraft.spec.S_0 *= 1.10;
        aircraft.pkBonus = (aircraft.pkBonus || 0) + 0.12;
        aircraft.leadStressMitigation = 0.50;
        aircraft.leadEvasionBonus = 0.18;
        break;
      case 'MULTIROLE':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.turnBonus = (aircraft.turnBonus || 0) + 0.20;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.20;
        aircraft.hasFastRTB = true;
        aircraft.leadExtraCm = 3;
        aircraft.leadEvasionBonus = 0.18;
        break;
      case 'STRIKE':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 3;
        aircraft.heavyLeadDragMitigation = 0.40;
        aircraft.autocannonResistance = 0.60;
        aircraft.missileDamageReduction = 1;
        aircraft.leadEvasionBonus = 0.12;
        break;
      case 'EW':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.jamEfficiency = Math.min(0.95, (aircraft.jamEfficiency || 0.45) + 0.25);
        aircraft.hasESM = true;
        aircraft.leadExtraCm = 3;
        aircraft.leadEvasionBonus = 0.20;
        break;
      case 'DRONES':
        aircraft.spec.hp = (aircraft.spec.hp || 2) + 2;
        aircraft.droneDodgeBonus = (aircraft.droneDodgeBonus || 0) + 0.15;
        aircraft.hasMaldDecoy = true;
        aircraft.maldDecoyCharges = (aircraft.maldDecoyCharges || 0) + 2;
        aircraft.pkBonus = (aircraft.pkBonus || 0) + 0.12;
        aircraft.leadEvasionBonus = 0.20;
        break;
      case 'EXPERIMENTAL':
      default:
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.30;
        aircraft.thermalBloom = 0.60;
        aircraft.leadEvasionBonus = 0.15;
        break;
    }
  }
}

window.AircraftLeadBuffs = AircraftLeadBuffs;