/**
 * AIRSPACE STANDOFF // Cyber-Military Custom Dropdown Engine
 * Replaces all native OS <select> boxes with styled, accessible tactical dropdowns.
 */

class CustomDropdown {
  static registry = {};
  static _globalClickInitialized = false;

  static initGlobalDismiss() {
    if (this._globalClickInitialized) return;
    this._globalClickInitialized = true;

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
          dd.classList.remove('open');
        });
      }
    });
  }

  static setup(containerId, config) {
    this.initGlobalDismiss();

    const container = (typeof containerId === 'string') ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    const id = (typeof containerId === 'string') ? containerId : (container.id || `cdd-${Math.random().toString(36).substr(2, 6)}`);
    const label = config.label || '';
    const options = config.options || [];
    const initialValue = config.value !== undefined ? config.value : (options[0] ? options[0].value : '');
    const onChange = config.onChange || null;

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    wrapper.id = `dropdown-wrap-${id}`;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-dropdown-trigger';

    const labelHtml = label ? `<span class="cdd-label">${label}:</span>` : '';
    const initialOpt = options.find(o => String(o.value) === String(initialValue)) || options[0] || { text: initialValue };
    const valText = initialOpt.text || initialValue;

    trigger.innerHTML = `
      ${labelHtml}
      <span class="cdd-val">${valText}</span>
      <span class="cdd-arrow">▾</span>
    `;

    const menu = document.createElement('div');
    menu.className = 'custom-dropdown-menu';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = String(opt.value) === String(initialValue);
      btn.className = `custom-dropdown-opt ${isSelected ? 'active' : ''}`;
      btn.textContent = opt.text;
      btn.dataset.val = opt.value;
      if (opt.disabled) btn.disabled = true;

      btn.onclick = (e) => {
        e.stopPropagation();
        if (btn.disabled) return;

        menu.querySelectorAll('.custom-dropdown-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const valSpan = trigger.querySelector('.cdd-val');
        if (valSpan) valSpan.textContent = opt.text;

        wrapper.classList.remove('open');
        instance.currentValue = opt.value;

        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        if (onChange) onChange(opt.value);
      };

      menu.appendChild(btn);
    });

    trigger.onclick = (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');
      document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
        if (dd !== wrapper) dd.classList.remove('open');
      });
      wrapper.classList.toggle('open', !isOpen);
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
    container.appendChild(wrapper);

    const instance = {
      id: id,
      container: container,
      wrapper: wrapper,
      trigger: trigger,
      menu: menu,
      options: options,
      currentValue: initialValue,
      getValue() {
        return this.currentValue;
      },
      setValue(newVal, triggerChange = false) {
        this.currentValue = newVal;
        const opt = this.options.find(o => String(o.value) === String(newVal));
        if (opt) {
          const valSpan = this.trigger.querySelector('.cdd-val');
          if (valSpan) valSpan.textContent = opt.text;

          this.menu.querySelectorAll('.custom-dropdown-opt').forEach(b => {
            b.classList.toggle('active', String(b.dataset.val) === String(newVal));
          });

          if (triggerChange && onChange) onChange(newVal);
        }
      },
      setOptions(newOptions, selectedVal = null) {
        this.options = newOptions || [];
        this.menu.innerHTML = '';
        const curVal = selectedVal !== null ? selectedVal : (this.options[0] ? this.options[0].value : '');
        this.currentValue = curVal;

        const optData = this.options.find(o => String(o.value) === String(curVal)) || this.options[0] || { text: curVal };
        const valSpan = this.trigger.querySelector('.cdd-val');
        if (valSpan) valSpan.textContent = optData.text || curVal;

        this.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.type = 'button';
          const isSelected = String(opt.value) === String(curVal);
          btn.className = `custom-dropdown-opt ${isSelected ? 'active' : ''}`;
          btn.textContent = opt.text;
          btn.dataset.val = opt.value;
          if (opt.disabled) btn.disabled = true;

          btn.onclick = (e) => {
            e.stopPropagation();
            if (btn.disabled) return;

            this.menu.querySelectorAll('.custom-dropdown-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const vSpan = this.trigger.querySelector('.cdd-val');
            if (vSpan) vSpan.textContent = opt.text;

            this.wrapper.classList.remove('open');
            this.currentValue = opt.value;

            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
            if (onChange) onChange(opt.value);
          };

          this.menu.appendChild(btn);
        });
      }
    };

    this.registry[id] = instance;
    return instance;
  }

  static get(id) {
    return this.registry[id] || null;
  }
}

window.CustomDropdown = CustomDropdown;