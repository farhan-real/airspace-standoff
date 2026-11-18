/**
 * AIRSPACE STANDOFF: Inspection UI Component Views & Trace Coordinator
 */

class InspectionViews {
  static renderOverviewTab(controller, entity) {
    return InspectionOverviewRenderer.renderOverviewTab(controller, entity);
  }

  static renderEventTraceTab(controller, event) {
    if (!event) {
      const events = controller.events || [];
      if (events.length === 0) {
        return `
          <section class="inspection-card">
            <h3>CAUSAL EVENT LOG</h3>
            <p class="inspection-muted" style="margin-top:6px; line-height:1.5;">Waiting for combat events (launches, EMCON shutdowns, QRA scrambles, intercepts, kills)...</p>
          </section>`;
      }
      return `
        <section class="inspection-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0;">CAUSAL EVENT LOG</h3>
            <span class="factor-chip neutral">${events.length} RECORDED</span>
          </div>
          <p class="inspection-muted" style="margin-top:4px;">Tap any event to inspect detailed kinematics, probabilities, and IADS telemetry.</p>
          <div class="inspection-event-list" style="max-height:360px; overflow-y:auto; margin-top:8px;">
            ${events.map(ev => `
              <button type="button" class="inspection-event-row" data-ev-id="${ev.id}">
                <span>[${ev.time}] ${ev.type}</span>
                <b>${controller.escape(ev.title)}</b>
              </button>`).join('')}
          </div>
        </section>`;
    }

    const d = event.details || {};
    const formatValue = (v) => {
      if (v === null || v === undefined) return 'None';
      if (typeof v === 'boolean') return v ? 'ACTIVE' : 'INACTIVE';
      if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
      if (Array.isArray(v)) return v.length === 0 ? 'None' : (typeof v[0] === 'object' ? `${v.length} recorded items` : v.join(', '));
      if (typeof v === 'object') return Object.entries(v).map(([sk, sv]) => `${sk}: ${typeof sv === 'number' ? sv.toFixed(2) : sv}`).join(' | ');
      return String(v);
    };

    return `
      <section class="inspection-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <button type="button" class="hud-btn small" id="btn-trace-back-to-list">&larr; ALL EVENTS</button>
          <span class="factor-chip neutral">[${event.time}]</span>
        </div>
        <h3 style="margin:0;">${controller.escape(event.type)}</h3>
        <p style="color:var(--color-ice-highlight); font:600 0.72rem var(--font-dotdigital); margin-top:5px; line-height:1.4;">${controller.escape(event.title)}</p>
        <div style="display:flex; justify-content:space-between; font:600 0.64rem var(--font-dotdigital); margin-top:8px; padding-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.06);">
          <span>SOURCE: <b style="color:var(--theme-accent);">${controller.escape(event.sourceName || 'Unknown')}</b></span>
          <span>TARGET: <b style="color:var(--color-red);">${controller.escape(event.targetName || 'None')}</b></span>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px; margin-top:8px;">
          ${Object.entries(d).map(([k, v]) => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding:3px 0; font:0.64rem var(--font-dotdigital);">
              <span style="color:var(--color-moon-mist); text-transform:uppercase;">${k.replace(/([A-Z])/g, ' $1')}:</span>
              <b style="color:var(--color-pure-white); text-align:right; max-width:65%; word-break:break-all;">${formatValue(v)}</b>
            </div>`).join('')}
        </div>
      </section>`;
  }

  static renderRawDataTab(controller, entity) {
    return InspectionRawDataRenderer.render(controller, entity);
  }

  static updateLive(controller, entity, content) {
    InspectionOverviewRenderer.updateLiveOverview(controller, entity, content);
  }

  static updateRawLive(controller, entity, content) {
    InspectionRawDataRenderer.updateLive(controller, entity, content);
  }
}

window.InspectionViews = InspectionViews;
