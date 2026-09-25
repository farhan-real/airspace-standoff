/* AIRSPACE STANDOFF: Custom Liquid Glass Dropdown Engine */

class CustomDropdown {
  static registry = {};
  static _globalDismissInitialized = false;

  static initGlobalDismiss() {
    if (this._globalDismissInitialized) return;
    this._globalDismissInitialized = true;

    const handleDismiss = (e) => {
      const activeDropdown = e.target.closest('.custom-dropdown');
      CustomDropdown.closeAll(activeDropdown);
    };

    window.addEventListener('pointerdown', handleDismiss, { passive: true, capture: true });
    window.addEventListener('click', handleDismiss, { capture: true });
  }

  static closeAll(exceptWrapper = null) {
    Object.values(this.registry).forEach(instance => {
      if (instance && instance.wrapper !== exceptWrapper && instance.isOpen()) {
        instance.close();
      }
    });
    document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
      if (dd !== exceptWrapper && (!exceptWrapper || !exceptWrapper.contains(dd))) {
        dd.classList.remove('open');
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
      <span class="cdd-arrow"><img src="icons/chevron.svg" width="9" height="9" alt="v" style="pointer-events:none;"></span>
    `;

    const menu = document.createElement('div');
    menu.className = 'custom-dropdown-menu';

    const instance = {
      id: id,
      container: container,
      wrapper: wrapper,
      trigger: trigger,
      menu: menu,
      options: options,
      currentValue: initialValue,
      disabled: false,
      _pendingOptions: null,

      isOpen() {
        return this.wrapper.classList.contains('open');
      },

      close() {
        if (!this.isOpen()) return;
        this.wrapper.classList.remove('open');
        if (this._pendingOptions) {
          const { newOptions, selectedVal } = this._pendingOptions;
          this._pendingOptions = null;
          this.setOptions(newOptions, selectedVal);
        }
      },

      open() {
        if (this.disabled || this.trigger.disabled) return;
        CustomDropdown.closeAll(this.wrapper);
        this.wrapper.classList.add('open');
        this.positionMenu();
      },

      toggle() {
        if (this.isOpen()) {
          this.close();
        } else {
          this.open();
        }
      },

      positionMenu() {
        const rect = this.trigger.getBoundingClientRect();
        const screenW = window.innerWidth || document.documentElement.clientWidth || 360;
        const screenH = window.innerHeight || document.documentElement.clientHeight || 600;
        const estimatedWidth = Math.min(this.menu.offsetWidth || 160, 260);

        if (rect.left + estimatedWidth > screenW - 10) {
          this.menu.style.left = 'auto';
          this.menu.style.right = '0';
        } else {
          this.menu.style.left = '0';
          this.menu.style.right = 'auto';
        }

        const spaceBelow = screenH - rect.bottom;
        const estimatedHeight = Math.min(this.menu.scrollHeight || 160, 240);
        if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
          this.menu.style.top = 'auto';
          this.menu.style.bottom = 'calc(100% + 5px)';
        } else {
          this.menu.style.top = 'calc(100% + 5px)';
          this.menu.style.bottom = 'auto';
        }
      },

      getValue() {
        return this.currentValue;
      },

      setValue(newVal, triggerChange = false) {
        this.currentValue = newVal;
        const opt = this.options.find(o => String(o.value) === String(newVal));
        if (opt) {
          const valSpan = this.trigger.querySelector('.cdd-val');
          if (valSpan && valSpan.textContent !== opt.text) {
            valSpan.textContent = opt.text;
          }

          this.menu.querySelectorAll('.custom-dropdown-opt').forEach(b => {
            b.classList.toggle('active', String(b.dataset.val) === String(newVal));
          });

          if (triggerChange && onChange) onChange(newVal);
        }
      },

      setDisabled(isDisabled) {
        this.disabled = Boolean(isDisabled);
        this.trigger.disabled = this.disabled;
        this.wrapper.classList.toggle('disabled', this.disabled);
        if (this.disabled) this.close();
      },

      setOptions(newOptions, selectedVal = null) {
        const nextOpts = newOptions || [];
        const curVal = selectedVal !== null ? selectedVal : this.currentValue;

        const isIdentical = this.options.length === nextOpts.length &&
          nextOpts.every((opt, i) => opt.value === this.options[i].value && opt.text === this.options[i].text);

        if (isIdentical) {
          if (curVal !== this.currentValue) {
            this.setValue(curVal, false);
          }
          return;
        }

        if (this.isOpen()) {
          this._pendingOptions = { newOptions: nextOpts, selectedVal: curVal };
          return;
        }

        this.options = nextOpts;
        this.currentValue = curVal;
        this.menu.innerHTML = '';

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

            this.currentValue = opt.value;
            this.close();

            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
            if (onChange) onChange(opt.value);
          };

          this.menu.appendChild(btn);
        });
      }
    };

    trigger.onclick = (e) => {
      e.stopPropagation();
      instance.toggle();
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };

    instance.setOptions(options, initialValue);

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
    container.appendChild(wrapper);

    this.registry[id] = instance;
    return instance;
  }

  static get(id) {
    return this.registry[id] || null;
  }
}

window.CustomDropdown = CustomDropdown;