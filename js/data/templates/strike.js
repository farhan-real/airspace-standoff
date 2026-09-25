/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Dedicated Strike & CAS Bombers
 */

window.TEMPLATES_STRIKE = {
  'A-10C Close Air Support (Anti-Armor)': {
    name: 'A-10C Close Air Support (Anti-Armor)',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GPU-5A', 'GBU-39', 'GBU-39', 'AGM-88G', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXPANDED_CM_DISPENSER'],
    desc: 'Armored bathtub CAS package using 9 of 10 stations (~5,310 kg) combining dual 30mm Gatlings with 16 SDBs and SEAD.'
  },
  'A-10C Battlefield Interdiction': {
    name: 'A-10C Battlefield Interdiction',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GBU-39', 'GBU-39', 'AGM-88G', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Maximum close air support bomb loadout using 8 of 10 stations (~4,840 kg) with 16 SDBs and radar killers.'
  },
  'Su-25SM3 Armored Ground Attack': {
    name: 'Su-25SM3 Armored Ground Attack',
    specId: 'Su-25SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GBU-39', 'GBU-39', 'AGM-88G', 'R-73', 'AN-ALQ-184'],
    upgrades: ['TITANIUM_COCKPIT', 'EXPANDED_CM_DISPENSER'],
    desc: 'Rugged titanium ground attacker using 8 of 10 stations (~5,350 kg) with 16 SDBs, HARM radar killers, and ECM.'
  },
  'Su-25SM3 Low-Altitude SEAD': {
    name: 'Su-25SM3 Low-Altitude SEAD',
    specId: 'Su-25SM3',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-88G', 'AGM-88G', 'GBU-39', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'ESM_PASSIVE_SUITE'],
    desc: 'Low-altitude SAM radar suppression loadout using 7 of 10 stations (~6,140 kg) carrying 8 anti-radiation HARMs.'
  },
  'Su-34 Strike Fighter': {
    name: 'Su-34 Strike Fighter',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AN-ALQ-99', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Armored cockpit with 11 of 12 stations filled (~7,360 kg) mounting stealth cruise missiles, HARMs, and radar jammers.'
  },
  'Su-34 Armored Gunship & SEAD': {
    name: 'Su-34 Armored Gunship & SEAD',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GPU-5A', 'AGM-88G', 'GBU-39', 'AN-ALQ-99', 'AIM-120D', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'All-in-one close support and radar-killing gunship pairing dual 30mm Gatlings with anti-radiation HARMs and glide bombs.'
  },
  'Su-34 Strategic Standoff Strike': {
    name: 'Su-34 Strategic Standoff Strike',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'AIM-120D'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'Strategic strike loadout deploying dual stealth JASSM-ER cruise missiles and 8 glide bombs across 12 of 12 stations.'
  },
  'B-1B Low-Altitude Heavy Bombardment': {
    name: 'B-1B Low-Altitude Heavy Bombardment',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Variable-sweep supersonic bomber utilizing 12 of 14 stations (~8,040 kg) deploying 4 cruise missiles and 16 glide bombs.'
  },
  'B-1B Strategic Standoff Bombardment': {
    name: 'B-1B Strategic Standoff Bombardment',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'GBU-39', 'GBU-39', 'GBU-39', 'AN-ALQ-99'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Maximum standoff saturation bomber using 12 of 14 stations to unleash 24 precision glide bombs and stealth cruise missiles.'
  },
  'Tu-160M Strategic Missile Carrier': {
    name: 'Tu-160M Strategic Missile Carrier',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'KINZHAL', 'R-37M'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT'],
    desc: '9 HP supersonic strategic bomber with 15 of 16 stations fielding dual Mach 5.0 Kh-47M2 Kinzhal aero-ballistic bunker penetrators.'
  },
  'Tu-160M Strategic Standoff Bombardment': {
    name: 'Tu-160M Strategic Standoff Bombardment',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'AGM-158B', 'AGM-158B'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT'],
    desc: 'Heavy strategic package using 14 of 16 stations (~14,000 kg) pairing Kinzhal hypersonic shock with 4 cruise missiles.'
  },
  'B-21 Long-Range Strike Bomber (LRS-B)': {
    name: 'B-21 Long-Range Strike Bomber (LRS-B)',
    specId: 'B-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'VLO flying-wing stealth penetrator using 12 of 16 stations (~8,040 kg) carrying 4 cruise missiles and 16 SDBs.'
  },
  'B-2A Global Strike Penetrator': {
    name: 'B-2A Global Strike Penetrator',
    specId: 'B-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strategic stealth flying wing using 14 of 16 stations (~9,460 kg) carrying 4 cruise missiles and 24 glide bombs.'
  }
};