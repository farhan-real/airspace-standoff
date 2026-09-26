/**
 * AIRSPACE STANDOFF: Inspection Events & Signature Submodule
 */

class InspectionEventSystem {
  static recordEvent(controller, type, title, source, target, details = {}) {
    if (!controller.enabled) return;
    const sim = controller.game && controller.game.simulation;
    const event = {
      id: `EV_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: sim && sim.getElapsedTimeString ? sim.getElapsedTimeString() : '00:00',
      type: String(type || 'TACTICAL EVENT'),
      title: String(title || type),
      sourceName: controller.getName(source),
      targetName: controller.getName(target),
      details
    };
    controller.events.unshift(event);
    if (controller.events.length > 500) controller.events.pop();
    if (controller.isOpen && controller.activeTab === 'TRACE' && !controller.focusedEvent) {
      controller.render();
    }
  }

  static computeStructureSignature(controller) {
    const e = controller.selectedEntity;
    if (!e) return `${controller.activeTab}:none`;
    const eid = controller.getEntityId(e);
    const tid = controller.getEntityId(controller.game.selectedTarget);

    if (controller.activeTab === 'WEAPONS') {
      const inbounds = (controller.game.missiles || []).filter(m => m.active && m.target && m.target.id === e.id).map(m => m.id).join(',');
      const firingUnit = e.spec ? e : controller.game.activeUnit;
      const wpns = firingUnit ? (firingUnit.equippedWeapons || []).map(it => `${it.weapon ? it.weapon.id : ''}:${it.ammo}`).join(',') : '';
      return `${controller.activeTab}:${eid}:${tid}:${inbounds}:${wpns}`;
    }
    if (controller.activeTab === 'SENSORS') {
      const isBlue = e.team === (controller.game.currentPvpCommander || 'friendly');
      const sensors = isBlue ? (controller.game.hostileAircraft || []) : (controller.game.alliedAircraft || []);
      const sIds = sensors.filter(s => s.hp > 0).map(s => s.id).join(',');
      return `${controller.activeTab}:${eid}:${sIds}`;
    }
    if (controller.activeTab === 'OVERVIEW') {
      const equipLen = (e.equippedWeapons || []).length;
      return `${controller.activeTab}:${eid}:${e.maxHp || 0}:${equipLen}`;
    }
    if (controller.activeTab === 'TRACE') {
      return `${controller.activeTab}:${controller.focusedEvent ? controller.focusedEvent.id : `list:${controller.events.length}`}`;
    }
    return `${controller.activeTab}:${eid}`;
  }

  static bindInteractions(controller, content) {
    content.querySelectorAll('.inspection-accordion').forEach(acc => {
      const accId = acc.dataset.accordionId;
      if (accId) {
        if (controller.accordionStates.has(accId)) acc.open = controller.accordionStates.get(accId);
        else controller.accordionStates.set(accId, acc.open);
        acc.addEventListener('toggle', () => controller.accordionStates.set(accId, acc.open));
      }
    });

    content.querySelectorAll('[data-insp-action="fly"]').forEach(btn => {
      btn.onclick = () => {
        controller.game.activeUnit = controller.selectedEntity;
        if (controller.game.avionics) {
          controller.game.avionics.renderFlightRoster();
          controller.game.avionics.updateActiveUnitMFD();
        }
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        controller.render(true);
      };
    });

    content.querySelectorAll('[data-insp-action="target"]').forEach(btn => {
      btn.onclick = () => {
        controller.game.selectedTarget = controller.selectedEntity;
        if (controller.game.avionics) controller.game.avionics.updateActiveUnitMFD();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        controller.render(true);
      };
    });

    const backBtn = content.querySelector('#btn-trace-back-to-list');
    if (backBtn) {
      backBtn.onclick = () => {
        controller.focusedEvent = null;
        controller.render(true);
      };
    }

    content.querySelectorAll('.inspection-content .inspection-event-row').forEach(row => {
      row.onclick = () => {
        const id = row.getAttribute('data-ev-id');
        controller.focusedEvent = controller.events.find(e => e.id === id) || null;
        controller.render(true);
      };
    });
  }
}

window.InspectionEventSystem = InspectionEventSystem;