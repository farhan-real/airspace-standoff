/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Dedicated Strike & CAS Bombers
 */

window.TEMPLATES_STRIKE = {
  'A-10C Close Air Support (Anti-Armor)': {
    name: 'A-10C Close Air Support (Anti-Armor)',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GPU-5A', 'GBU-39', 'AIM-9X-2', 'AN-ALQ-184'],
    upgrades: ['TITANIUM_COCKPIT', 'EXPANDED_CM_DISPENSER'],
    desc: 'Armored titanium bathtub cockpit (7 HP). 1,174 rounds of 30mm GAU-8 Avenger (4.8 DPS) and secondary 30mm gunpod.'
  },
  'A-10C Battlefield Interdiction': {
    name: 'A-10C Battlefield Interdiction',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GBU-39', 'GBU-39', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Maximum close air support bomb loadout with 16 GBU-39 SDB penetrators to level enemy forward positions.'
  },
  'Su-25SM3 Armored Ground Attack': {
    name: 'Su-25SM3 Armored Ground Attack',
    specId: 'Su-25SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['GBU-39', 'R-73', 'AN-ALQ-184'],
    upgrades: ['TITANIUM_COCKPIT', 'EXPANDED_CM_DISPENSER'],
    desc: 'Rugged titanium ground attacker with 7 HP durability and 10 stations for close-range ordnance dispersal.'
  },
  'Su-25SM3 Low-Altitude SEAD': {
    name: 'Su-25SM3 Low-Altitude SEAD',
    specId: 'Su-25SM3',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-88G', 'GBU-39', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'ESM_PASSIVE_SUITE'],
    desc: 'Low-altitude SAM radar suppression loadout carrying anti-radiation missiles under an armored titanium tub.'
  },
  'Su-34 Tactical Strike Bomber': {
    name: 'Su-34 Tactical Strike Bomber',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['AGM-158B', 'AGM-88G', 'R-73', 'AN-ALQ-99'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Armored cockpit with rearward radar and 12 weapon stations carrying heavy standoff cruise missiles and radar jammers.'
  },
  'Su-34 Strategic Standoff Strike': {
    name: 'Su-34 Strategic Standoff Strike',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'Massive strategic strike loadout carrying dual stealth JASSM-ER cruise missiles and 8 glide bombs.'
  },
  'B-1B Low-Altitude Heavy Bombardment': {
    name: 'B-1B Low-Altitude Heavy Bombardment',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Variable-sweep supersonic bomber carrying 18,000kg of ordnance across terrain-following flight profiles.'
  },
  'Tu-160M Strategic Missile Carrier': {
    name: 'Tu-160M Strategic Missile Carrier',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'KINZHAL', 'R-37M'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT'],
    desc: '9 HP supersonic strategic bomber with 16 stations fielding dual Mach 5.0 Kh-47M2 Kinzhal aero-ballistic bunker penetrators.'
  },
  'B-21 Long-Range Strike Bomber (LRS-B)': {
    name: 'B-21 Long-Range Strike Bomber (LRS-B)',
    specId: 'B-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'VLO flying-wing stealth penetrator (0.0002m2 RCS). 16 internal stations dedicated to cracking subterranean command bunkers.'
  },
  'B-2A Global Strike Penetrator': {
    name: 'B-2A Global Strike Penetrator',
    specId: 'B-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strategic stealth flying wing carrying up to 18,000kg of precision standoff ordnance.'
  }
};