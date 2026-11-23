/**
 * js/ui/procurement/specs/behaviors.js - Extracts rare (<6 items) special behaviors for airframes, guns, upgrades, and ground units.
 */

class BehaviorCodex {
  static getAirframeBehaviors(spec) {
    if (!spec || !spec.id) throw new Error('BehaviorCodex.getAirframeBehaviors requires a valid airframe spec.');
    const items = [];

    if (spec.isCoffin) {
      const dodgePct = Math.round((spec.coffinDodgeBonus || 0.25) * 100);
      items.push({
        color: '#00f0ff',
        short: `COFFIN: 100% turn locked, zero G-LOC, +${dodgePct}% dodge`,
        detail: `Synthetic vision locks turn efficiency at 100% at all speeds, grants immunity to G-stress and G-LOC up to ${spec.G_limit}G, adds +20% combat agility, and gives +${dodgePct}% passive missile evasion.`
      });
    }
    if (spec.jamEfficiency > 0) {
      items.push({
        color: '#c084fc',
        short: `Innate ${Math.round(spec.jamEfficiency * 100)}% ECM Jammer + ESM (no pod needed)`,
        detail: `Built-in ${Math.round(spec.jamEfficiency * 100)}% broadband radar jammer (90 km umbrella) cuts enemy radar reach and RF SAM range up to ${Math.round(Math.min(45, spec.jamEfficiency * 55))}% without using a weapon station, plus passive ESM emitter ID.`
      });
    }
    if (spec.dircmEvasion > 0) {
      items.push({
        color: '#00f5a0',
        short: `Built-in DIRCM (+${Math.round(spec.dircmEvasion * 100)}% evasion vs IR missiles)`,
        detail: `Integrated Sukhogruz IR jammer grants +${Math.round(spec.dircmEvasion * 100)}% passive evasion against IR SHORAD and heat-seeking A2A missiles (stacks up to 42%).`
      });
    }
    if (spec.aaaResistance >= 0.35) {
      items.push({
        color: '#00f5a0',
        short: `Heavy Titanium Tub (-${Math.round(spec.aaaResistance * 100)}% AAA flak dmg)`,
        detail: `Armored cockpit bathtub cuts incoming AAA flak damage by ${Math.round(spec.aaaResistance * 100)}% (stacks additively up to 75% with Kevlar Belly Armor).`
      });
    }
    if (spec.id === 'DARKSTAR') {
      items.push({
        color: '#fbbf24',
        short: 'Hypersonic FL580 Spawn (starts 58,000ft, Mach 2.40)',
        detail: 'Spawns in the stratosphere at 58,000 ft above standard SAM engagement ceilings and sprints at Mach 2.40.'
      });
    }
    if (spec.id === 'AV-8B-PLUS' || spec.id === 'A-29B') {
      items.push({
        color: '#fbbf24',
        short: 'STOVL Short-Field (1-segment 700m runway takeoff)',
        detail: 'Requires only 1 intact 700m runway segment to launch, unlike standard manned fighters (2-4 segments).'
      });
    }

    return items;
  }

  static getGunBehaviors(g) {
    if (!g || !g.id) throw new Error('BehaviorCodex.getGunBehaviors requires a valid gun object.');
    const items = [];
    if (g.cloudScattering > 0) {
      const spdTxt = g.speedPenalty > 0 ? `, -${Math.round(g.speedPenalty * 100)}% speed` : '';
      const rcsTxt = g.rcsPenalty > 0 ? `, +${Math.round(g.rcsPenalty * 100)}% RCS` : '';
      items.push({
        color: '#00f0ff',
        short: `Hitscan DEW Beam (${spdTxt ? spdTxt.slice(2) : '0% spd'}${rcsTxt}, -${Math.round(g.cloudScattering * 100)}% cloud scatter, 3.5s IR spike)`,
        detail: `Instant hitscan beam needs zero lead, but optical aperture & power plant impose +${g.mass} kg weight${spdTxt}${rcsTxt}; clouds scatter ${Math.round(g.cloudScattering * 100)}% damage per cell and firing spikes thermal bloom for 3.5s.`
      });
    } else if (g.id === 'EML_GUN') {
      items.push({
        color: '#00f0ff',
        short: 'All-Weather Railgun (0 cloud loss, 90% AP, drains target energy)',
        detail: 'Ignores cloud scattering, deals 1.40x ground damage at 90% AP, and inflicts 0.40 kinetic shock draining target airspeed and energy.'
      });
    }
    if (g.groundDamageMult >= 1.55) {
      items.push({
        color: '#fbbf24',
        short: `CAS Tank-Buster (${g.groundDamageMult.toFixed(2)}x ground dmg, ${Math.round(g.armorPiercing * 100)}% AP, ${g.defaultAmmo} rds)`,
        detail: `Specialized ground cannon dealing ${g.groundDamageMult.toFixed(2)}x surface damage at ${Math.round(g.armorPiercing * 100)}% armor piercing (50% vs Fortified roofs) with ${g.defaultAmmo} rounds.`
      });
    } else if (g.coneAngleDeg >= 55) {
      items.push({
        color: '#00f5a0',
        short: `Wide ${g.coneAngleDeg} deg Snapshot Cone & Zero Thermal Bloom`,
        detail: `Wide ${g.coneAngleDeg} deg boresight cone eases dogfight snapshots while zero thermal bloom keeps VLO stealth clean.`
      });
    }
    return items;
  }

  static getUpgradeBehaviors(u) {
    if (!u || !u.id) throw new Error('BehaviorCodex.getUpgradeBehaviors requires a valid upgrade object.');
    const rareMap = {
      MALD_DECOY_SYSTEM: { color: '#c084fc', short: 'Spawns 2x flying MALD decoys (baits fighters & SAM racks)', detail: 'Deploys autonomous decoy drones mirroring your airframe RCS to draw enemy BVR volleys and drain Attack Mode SAM ready racks.' },
      TFR_TERRAIN_RADAR: { color: '#00f5a0', short: 'Active <10,000ft only (+2,500ft SAM floor & -25% look-down)', detail: 'Raises enemy SAM minimum altitude floor by +2,500 ft and cuts look-down radar detection by 25% whenever flying below FL100.' },
      CCIP_BALLISTIC_COMP: { color: '#fbbf24', short: 'Cancels >FL260 bomb dispersion & +16% bomb/rocket Pk', detail: 'Eliminates the -18% high-altitude (>26,000 ft) unguided bomb penalty and boosts iron bombs, clusters, and rockets (+16% Pk, +15% range).' },
      KEVLAR_BELLY_ARMOR: { color: '#00f5a0', short: 'Stacks additively up to 75% AAA flak resistance on CAS jets', detail: 'Reduces AAA flak and CIWS gun damage by 45% (stacking with innate A-10C, Su-25SM3, and Su-39 titanium armor up to 75%).' },
      DIRCM_IR_TURRET: { color: '#00f5a0', short: 'Stacks additively up to 42% IR missile evasion on Su-39', detail: 'Adds +24% passive evasion against IR SHORAD and heat-seeking A2A missiles (stacks up to 42% with innate DIRCM) plus +2 chaff.' },
      ZOE_NEURAL_PROCESSOR: { color: '#c084fc', short: 'Drones & COFFIN only (-40% AI latency, +12% Pk)', detail: 'Restricted to autonomous UCAVs and COFFIN frames; boosts missile Pk +12% and cuts AI reaction time by 40%.' },
      COFFIN_OPTICAL_BUS: { color: '#00f0ff', short: 'Converts frame to COFFIN (100% turn, zero G-LOC, +25% dodge)', detail: 'Exp/Drones only: permanently locks turn efficiency at 100%, removes G-LOC blackouts, and adds +25% missile dodge.' },
      SWARM_AI_COPROCESSOR: { color: '#c084fc', short: 'Drones only (100% ECM immunity & +15% dodge)', detail: 'UCAV exclusive: shields datalink from jamming and grants +15% autonomous break-turn evasion.' },
      MADL_BATTLE_LINK: { color: '#38bdf8', short: 'Only system generating +0.10 TOK/s command tokens', detail: 'Generates +0.10 extra squadron command tokens per second while alive.' },
      RTB_HOMING_BEACON: { color: '#00f5a0', short: 'Halves RTB rearm & repair turnaround (3.5s -> 1.8s)', detail: 'Cuts base replenishment duration in half inside the friendly munitions corridor.' },
      HEAVY_PYLON_FAIRINGS: { color: '#38bdf8', short: 'Cuts external air drag -40% & payload weight Wr -20%', detail: 'Streamlines external weapon racks to recover sprint speed and agility on heavy bomb trucks.' }
    };
    return rareMap[u.id] ? [rareMap[u.id]] : [];
  }

  static getSurfaceBehaviors(s) {
    if (!s || !s.type) throw new Error('BehaviorCodex.getSurfaceBehaviors requires a valid surface unit.');
    const items = [];
    if (s.canAttack && s.missileSpec) {
      items.push({
        color: '#fbbf24',
        short: `Finite Rack (${s.maxAmmo} msls, ${s.readyRackSize} ready, ${s.rackReloadSec}s reload, max ${s.maxActiveMissiles} active)`,
        detail: `Holds ${s.maxAmmo} total missiles in a ${s.readyRackSize}-cell ready rack (${s.rackReloadSec}s reload when empty), guides max ${s.maxActiveMissiles} active missile(s), and can be suppressed by ECM pods or baited by ITALD/MALD decoys.`
      });
    }
    if (s.counterStealthMult > 1.2) {
      items.push({ color: '#00f0ff', short: `${s.counterStealthMult.toFixed(1)}x Long-Wave Counter-Stealth Radar`, detail: `Degrades VLO stealth shaping advantages by ${s.counterStealthMult.toFixed(1)}x and cues linked SAM batteries.` });
    }
    if (s.lowAltCueBonus) {
      items.push({ color: '#fb7185', short: 'Gap-Filler Low-Alt Cueing (lowers nearby LR SAM floors)', detail: 'Strips low-altitude horizon masking, lowering nearby S-400, Patriot, and S-300V4 engagement floors.' });
    }
    if (!s.isEmitter && (s.isPassiveElint || s.canAttack)) {
      items.push({ color: '#00f5a0', short: 'Zero RF Emission (Immune to ARMs, silent on RWR)', detail: 'Passive sensor emits zero radar waves, making it immune to Anti-Radiation Missiles.' });
    }
    if (s.canInterceptMissiles) {
      items.push({ color: '#38bdf8', short: `CIWS Intercept Dome (${Math.round(s.interceptAccuracy * 100)}% vs slow PGMs, 0% vs Mach 5+)`, detail: `Intercepts subsonic bombs and cruise missiles inside 7.5-9.5 km; defeated by multi-bomb salvos, supersonic weapons (-55%), and Mach 5+ hypersonics.` });
    }
    if (s.secondaryBlastRadiusKm > 0) {
      items.push({ color: '#f97316', short: `Secondary Blast (${s.secondaryBlastRadiusKm}km radius, ${s.secondaryBlastDamage} HP splash)`, detail: `Detonates on destruction, damaging adjacent structures within ${s.secondaryBlastRadiusKm} km and sabotaging nearby airbase/SAM logistics.` });
    }
    if (s.isGroundDecoy) {
      items.push({ color: '#fbbf24', short: `False Bait Site (spoofs ${s.spoofsType} RF emissions)`, detail: `Draws wasted ARMs until exposed by Targeting Pods (${s.spec && s.spec.requiresHighGradeTgp ? '45+ km TGP required' : 'any TGP'}) or close visual flyby.` });
    }
    if (s.isRunwaySegment) {
      items.push({ color: '#00f0ff', short: '5-Segment Runway (Anti-Runway bombs deal 2.0x damage)', detail: 'Takeoff needs 1-4 contiguous intact segments depending on aircraft class; cutting center segments blocks heavy QRA launches.' });
    }
    if (s.requiresPower) {
      items.push({ color: '#c084fc', short: 'Power Substation Dependent (-55% jam output if power cut)', detail: 'Destroying nearby Grid Power Substations immediately cuts jamming strength by 55%.' });
    }
    if (s.isPowerNode) {
      items.push({ color: '#fbbf24', short: 'Powers Krasukha-4 Jammers (destruction cuts jamming 55%)', detail: 'Supplies high-voltage grid power to ground broadband jammers within 55 km.' });
    }
    if (s.isCommsRelay) {
      items.push({ color: '#38bdf8', short: 'IADS Datalink Relay (extends EW cueing 90km -> 135km)', detail: 'Destroying it severs extended EW radar cueing to SAM batteries.' });
    }
    if (s.isCommandNode) {
      items.push({ color: '#fb7185', short: 'IADS C2 Hub (destruction slows SAM reloads & locks +40%)', detail: 'Neutralizing this command node slows local SAM reaction and reload cycles by 40%.' });
    }
    return items;
  }

  static renderCardSummaryHtml(type, obj) {
    let list;
    if (type === 'airframe') list = this.getAirframeBehaviors(obj);
    else if (type === 'weapon') list = window.WeaponBehaviorCodex.getWeaponBehaviors(obj);
    else if (type === 'gun') list = this.getGunBehaviors(obj);
    else if (type === 'upgrade') list = this.getUpgradeBehaviors(obj);
    else throw new Error(`Invalid behavior summary type "${type}".`);

    if (!list || list.length === 0) return '';

    const primary = list[0];
    const secondary = list[1];
    const sep = secondary ? ` <span class="csb-sep">|</span> <span style="color:${secondary.color};">${secondary.short}</span>` : '';
    const title = list.map(i => i.short).join(' | ');
    return `<div class="card-special-line" title="${title.replace(/"/g, '&quot;')}"><span class="csb-tag">SPECIAL:</span> <span style="color:${primary.color};">${primary.short}</span>${sep}</div>`;
  }

  static renderSpecsDetailHtml(type, obj) {
    let list;
    if (type === 'airframe') list = this.getAirframeBehaviors(obj);
    else if (type === 'weapon') list = window.WeaponBehaviorCodex.getWeaponBehaviors(obj);
    else if (type === 'gun') list = this.getGunBehaviors(obj);
    else if (type === 'upgrade') list = this.getUpgradeBehaviors(obj);
    else if (type === 'surface') list = this.getSurfaceBehaviors(obj);
    else throw new Error(`Invalid specs behavior type "${type}".`);

    if (!list || list.length === 0) return '';

    const rowsHtml = list.map(item => `
      <div class="inspect-special-row">
        <b class="inspect-special-head" style="color:${item.color};">${item.short}</b>
        <span class="inspect-special-desc">${item.detail}</span>
      </div>
    `).join('');

    return `
      <div class="inspect-special-box">
        <div class="inspect-special-title">SPECIAL &amp; UNIQUE COMBAT BEHAVIOURS</div>
        <div class="inspect-special-list">${rowsHtml}</div>
      </div>
    `;
  }
}

window.BehaviorCodex = BehaviorCodex;
