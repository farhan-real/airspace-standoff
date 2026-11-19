/**
 * js/systems/combat/formation.js - Fleet Formation & Spatial Slots Planner.
 * Places flight leads in the center and arranges large wings into multi-echelon columns.
 */

class FormationPlanner {
  static getFormationRank(spec, isLead, isAce) {
    if (!spec) throw new Error('FormationPlanner.getFormationRank requires a valid aircraft spec.');
    if (isLead || isAce) return 0;
    if (spec.isDrone || spec.category === 'DRONES') return 4;
    const cheaperOlder = [
      'Mirage-2000', 'Mirage-F1EQ', 'Tejas-MK2', 'Tejas-MK1A', 'JF-17-B3', 'FA-50-B20',
      'F-16V', 'F-16C-B52', 'F-18C-PLUS', 'F-5E-TIGER', 'F-4E-2020', 'JAS-39C',
      'MiG-29K', 'MiG-29SMT', 'Tornado-ECR', 'X-29A', 'EF-111A', 'F-14D', 'F-14B'
    ];
    if (cheaperOlder.includes(spec.id) || (spec.cost <= 18.0 && spec.category !== 'STRIKE')) return 3;
    const heavySpecs = [
      'B-1B', 'Tu-160M', 'B-21', 'B-2A', 'Su-34', 'A-10C', 'Su-25SM3', 'MiG-31BM', 'MiG-25PD',
      'F-15EX', 'F-15J-JSI', 'J-36', 'CFA-44', 'DARKSTAR', 'F-15-SMT-COFFIN', 'X-40', 'XFA-36B', 'EA-36'
    ];
    if (heavySpecs.includes(spec.id) || spec.category === 'STRIKE' || (spec.M_max >= 8000) || (spec.hp >= 6)) return 1;
    return 2;
  }

  static calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rngInstance) {
    if (!Array.isArray(fleetItems)) throw new Error('FormationPlanner.calculateFormationSpawns requires fleetItems array.');
    if (!window.AIRCRAFT_CATALOG) throw new Error('AIRCRAFT_CATALOG is not loaded.');
    const rng = rngInstance || window.PRNG;
    if (!rng || typeof rng.range !== 'function') throw new Error('FormationPlanner requires a valid PRNG instance.');
    if (typeof theaterWidth !== 'number' || typeof theaterHeight !== 'number') {
      throw new Error(`Invalid theater dimensions (${theaterWidth}, ${theaterHeight}) in FormationPlanner.`);
    }

    const isBlue = (team === 'friendly');
    const total = fleetItems.length;
    if (total === 0) return [];

    const sorted = [...fleetItems].map((item, originalIndex) => {
      const spec = window.AIRCRAFT_CATALOG[item.specId];
      if (!spec) throw new Error(`Airframe spec "${item.specId}" not found during formation planning.`);
      const rank = this.getFormationRank(spec, item.isLead, item.isAce);
      return { item, spec, rank, originalIndex };
    }).sort((a, b) => a.rank - b.rank);

    const midY = theaterHeight / 2.0;
    const maxPerCol = 16;
    const baseSpawnX = isBlue ? (13.0 + rng.range(0, 2.0)) : (theaterWidth - 14.0 - rng.range(0, 2.0));
    const plans = new Array(total);

    for (let k = 0; k < total; k++) {
      const colIdx = Math.floor(k / maxPerCol);
      const idxInCol = k % maxPerCol;
      const itemsInCol = Math.min(maxPerCol, total - colIdx * maxPerCol);
      const colSpanY = Math.min(theaterHeight - 20.0, Math.max(22.0, (itemsInCol - 1) * 6.0));
      const colStartY = midY - (colSpanY / 2.0);
      const colStepY = itemsInCol > 1 ? (colSpanY / (itemsInCol - 1)) : 0;

      const slotOrder = [];
      const middleSlot = Math.floor(itemsInCol / 2);
      slotOrder.push(middleSlot);
      let l = middleSlot - 1;
      let r = middleSlot + 1;
      while (l >= 0 || r < itemsInCol) {
        if (l >= 0) slotOrder.push(l--);
        if (r < itemsInCol) slotOrder.push(r++);
      }

      const slotIndex = slotOrder[idxInCol];
      const assigned = sorted[k];
      const nominalY = (itemsInCol === 1) ? midY : (colStartY + slotIndex * colStepY);
      const randomizedY = Math.max(8.0, Math.min(theaterHeight - 8.0, nominalY + rng.range(-1.3, 1.3)));
      const colOffsetX = isBlue ? (-colIdx * 4.5) : (colIdx * 4.5);
      const tightX = Math.max(4.0, Math.min(theaterWidth - 4.0, baseSpawnX + colOffsetX + rng.range(-1.0, 1.0)));

      plans[assigned.originalIndex] = {
        item: assigned.item,
        spec: assigned.spec,
        x: tightX,
        y: randomizedY,
        isLead: Boolean(assigned.item.isLead),
        isAce: Boolean(assigned.item.isAce)
      };
    }
    return plans;
  }
}

window.FormationPlanner = FormationPlanner;
