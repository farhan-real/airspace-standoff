/**
 * AIRSPACE STANDOFF: Fleet Formation & Spatial Slots Planner
 * Places flight leads in the center and assigns flank and wing coordinates.
 */

class FormationPlanner {
  static getFormationRank(spec, isLead, isAce) {
    if (isLead || isAce) return 0;
    if (spec.isDrone || spec.category === 'DRONES') return 4;
    const cheaperOlder = ['Mirage-2000', 'Tejas-MK2', 'F-16V', 'MiG-29K', 'Tornado-ECR', 'X-29A', 'EF-111A'];
    if (cheaperOlder.includes(spec.id) || (spec.cost <= 15.0 && spec.category !== 'STRIKE')) return 3;
    const heavySpecs = ['B-1B', 'Tu-160M', 'B-21', 'B-2A', 'Su-34', 'A-10C', 'Su-25SM3', 'MiG-31BM', 'F-15EX', 'CFA-44', 'DARKSTAR', 'F-15-SMT-COFFIN', 'X-40', 'XFA-36B', 'EA-36'];
    if (heavySpecs.includes(spec.id) || spec.category === 'STRIKE' || (spec.M_max >= 8000) || (spec.hp >= 6)) return 1;
    return 2;
  }

  static calculateFormationSpawns(fleetItems, team, theaterWidth, theaterHeight, rngFn) {
    const rng = rngFn || Math.random;
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
    const totalSpanY = Math.min(theaterHeight - 20.0, Math.max(22.0, (total - 1) * 6.0));
    const startY = midY - (totalSpanY / 2.0);
    const stepY = total > 1 ? (totalSpanY / (total - 1)) : 0;

    const slotOrder = [];
    const middleSlot = Math.floor(total / 2);
    slotOrder.push(middleSlot);
    let l = middleSlot - 1;
    let r = middleSlot + 1;
    while (l >= 0 || r < total) {
      if (l >= 0) slotOrder.push(l--);
      if (r < total) slotOrder.push(r++);
    }

    const baseSpawnX = isBlue ? (13.0 + rng() * 2.0) : (theaterWidth - 14.0 - rng() * 2.0);
    const plans = new Array(total);
    for (let k = 0; k < total; k++) {
      const slotIndex = slotOrder[k];
      const assigned = sorted[k];
      const nominalY = (total === 1) ? midY : (startY + slotIndex * stepY);
      const randomizedY = Math.max(8.0, Math.min(theaterHeight - 8.0, nominalY + (rng() * 2.6 - 1.3)));
      const tightX = baseSpawnX + (rng() * 2.4 - 1.2);

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