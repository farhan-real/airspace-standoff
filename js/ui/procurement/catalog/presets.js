/**
 * AIRSPACE STANDOFF // Fleet Presets & Preconfigured Aircraft Toolbar
 * Clean military operational designations.
 */

class ProcurementPresets {
  static activePreset = 'stealth';

  static getBuiltinPreset(type) {
    const catalog = window.AIRCRAFT_CATALOG || {};
    const presets = {
      stealth: [
        { specId: 'F-22A', chosenGunId: 'M61A2', weapons: ['AIM-120D', 'AIM-120D', 'METEOR', 'AIM-9X-2'], upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'] },
        { specId: 'F-22A', chosenGunId: 'M61A2', weapons: ['AIM-120D', 'AIM-120D', 'METEOR', 'AIM-9X-2'], upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'] },
        { specId: 'Su-57', chosenGunId: 'GSH-30-1', weapons: ['R-37M', 'PL-15E', 'R-73'], upgrades: ['THRUST_VECTOR', 'RAM_NANO_COATING'] },
        { specId: 'F-35A', chosenGunId: 'GAU-22', weapons: ['AIM-260', 'AIM-260', 'AIM-9X-2'], upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'] },
        { specId: 'Su-75', chosenGunId: 'GSH-30-1', weapons: ['AIM-120D', 'R-73'], upgrades: ['RAM_NANO_COATING'] },
        { specId: 'Kizilelma', chosenGunId: 'BK-27', weapons: ['AIM-120D', 'AIM-9X-2'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['MAM'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['MAM'], upgrades: ['SWARM_AI_COPROCESSOR'] }
      ],
      sead: [
        { specId: 'EA-18G', chosenGunId: 'M61A2', weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-120D', 'ALE-55'], upgrades: ['GAN_AESA_CORE', 'ESM_PASSIVE_SUITE'] },
        { specId: 'Su-34', chosenGunId: 'GAU-8', weapons: ['AGM-158B', 'AGM-88G', 'AIM-9X-2', 'AN-ALQ-99'], upgrades: ['TITANIUM_COCKPIT'] },
        { specId: 'F-15EX', chosenGunId: 'M61A2', weapons: ['AGM-88G', 'AIM-260', 'AIM-120D', 'AIM-9X-2', 'ALE-55'], upgrades: ['MADL_BATTLE_LINK'] },
        { specId: 'A-10C', chosenGunId: 'GAU-8', weapons: ['GPU-5A', 'GBU-39', 'AIM-9X-2', 'AN-ALQ-184'], upgrades: ['TITANIUM_COCKPIT'] },
        { specId: 'Tornado-ECR', chosenGunId: 'BK-27', weapons: ['AGM-88G', 'AIM-120D', 'ALE-55'], upgrades: ['ESM_PASSIVE_SUITE'] }
      ],
      swarm: [
        { specId: 'F-22C-COFFIN', chosenGunId: 'DE-PULSE', weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2'], upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'] },
        { specId: 'F-15EX', chosenGunId: 'M61A2', weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2', 'ADM-160B'], upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'] },
        { specId: 'S-70', chosenGunId: 'GSH-30-1', weapons: ['PL-15E', 'AIM-120D'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['MAM'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['MAM'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-99', chosenGunId: 'MICRO_GUN', weapons: ['MAM'], upgrades: ['SWARM_AI_COPROCESSOR'] }
      ],
      interceptor: [
        { specId: 'MiG-31BM', chosenGunId: 'GSH-30-1', weapons: ['R-37M', 'R-37M', 'PL-21'], upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'] },
        { specId: 'Su-35S', chosenGunId: 'GSH-30-1', weapons: ['R-37M', 'PL-15E', 'PYTHON-5', 'AN-ALQ-99'], upgrades: ['THRUST_VECTOR'] },
        { specId: 'Eurofighter', chosenGunId: 'BK-27', weapons: ['METEOR', 'METEOR', 'IRIS-T'], upgrades: ['EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'] },
        { specId: 'Rafale-C', chosenGunId: 'BK-27', weapons: ['METEOR', 'METEOR', 'PYTHON-5'], upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'] },
        { specId: 'Su-37', chosenGunId: 'GSH-30-1', weapons: ['PL-15E', 'R-73'], upgrades: ['THRUST_VECTOR'] }
      ]
    };

    const list = presets[type] || [];
    return list.filter(item => catalog[item.specId] !== undefined);
  }

  static renderDoctrineBar(container, procurementManager) {
    if (!container) return;
    container.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'preset-label';
    label.textContent = 'PRESETS:';
    container.appendChild(label);

    const builtins = [
      { id: 'stealth', name: 'STEALTH SWEEP' },
      { id: 'sead', name: 'SEAD ESCORT' },
      { id: 'swarm', name: 'UAV FLIGHT' },
      { id: 'interceptor', name: 'BVR INTERCEPT' }
    ];

    builtins.forEach(b => {
      const btn = document.createElement('button');
      const isActive = ProcurementPresets.activePreset === b.id;
      btn.className = `preset-btn ${isActive ? 'active' : ''}`;
      btn.textContent = b.name;
      btn.onclick = () => {
        ProcurementPresets.activePreset = b.id;
        procurementManager.applyBuiltinPreset(b.id);
      };
      container.appendChild(btn);
    });

    const customManager = procurementManager.customLoadouts;
    const customMap = customManager ? customManager.getAll() : {};

    Object.keys(customMap).forEach(name => {
      const isAct = ProcurementPresets.activePreset === `custom:${name}`;
      const chip = document.createElement('div');
      chip.className = `custom-preset-chip ${isAct ? 'active' : ''}`;

      chip.innerHTML = `
        <button class="preset-btn custom-load-btn ${isAct ? 'active' : ''}" title="Load ${name}">
          ${name}
        </button>
        <button class="preset-icon-btn btn-rename" title="Rename preset">[R]</button>
        <button class="preset-icon-btn btn-delete alert" title="Delete preset">[X]</button>
      `;

      chip.querySelector('.custom-load-btn').onclick = () => {
        ProcurementPresets.activePreset = `custom:${name}`;
        procurementManager.applyCustomPreset(name);
      };

      chip.querySelector('.btn-rename').onclick = (e) => {
        e.stopPropagation();
        procurementManager.showPromptModal(
          'RENAME PRESET',
          `Enter a new name for "${name}":`,
          name,
          (newName) => {
            if (newName && newName.trim() && newName.trim() !== name) {
              if (customManager.rename(name, newName.trim())) {
                if (ProcurementPresets.activePreset === `custom:${name}`) {
                  ProcurementPresets.activePreset = `custom:${newName.trim()}`;
                }
                procurementManager.updateUI();
              }
            }
          }
        );
      };

      chip.querySelector('.btn-delete').onclick = (e) => {
        e.stopPropagation();
        procurementManager.showConfirmModal(
          'DELETE PRESET',
          `Delete preset configuration "${name}"?`,
          () => {
            customManager.delete(name);
            if (ProcurementPresets.activePreset === `custom:${name}`) {
              ProcurementPresets.activePreset = 'stealth';
              procurementManager.applyBuiltinPreset('stealth');
            } else {
              procurementManager.updateUI();
            }
          }
        );
      };

      container.appendChild(chip);
    });

    const templateBtn = document.createElement('button');
    templateBtn.className = 'preset-btn highlight';
    templateBtn.textContent = '+ AIRCRAFT PRESETS';
    templateBtn.onclick = () => {
      procurementManager.openPreconfiguredAircraftModal();
    };
    container.appendChild(templateBtn);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'preset-btn highlight';
    saveBtn.textContent = '+ SAVE SQUADRON';
    saveBtn.onclick = () => {
      if (procurementManager.game.procurementSquadron.length === 0) {
        procurementManager.showAlertModal('EMPTY SQUADRON', 'Cannot save an empty squadron. Add aircraft first.');
        return;
      }
      const count = Object.keys(customMap).length + 1;
      const defName = `Squadron ${count}`;

      procurementManager.showPromptModal(
        'SAVE SQUADRON PRESET',
        'Enter a name for this squadron configuration:',
        defName,
        (name) => {
          if (name && name.trim()) {
            if (customManager.save(name.trim(), procurementManager.game.procurementSquadron)) {
              ProcurementPresets.activePreset = `custom:${name.trim()}`;
              procurementManager.updateUI();
            }
          }
        }
      );
    };
    container.appendChild(saveBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'preset-btn alert';
    clearBtn.textContent = 'CLEAR ALL';
    clearBtn.onclick = () => {
      procurementManager.showConfirmModal(
        'CLEAR SQUADRON',
        'Remove all aircraft from the current squadron?',
        () => {
          ProcurementPresets.activePreset = '';
          procurementManager.clearSquadron();
        }
      );
    };
    container.appendChild(clearBtn);
  }
}

window.ProcurementPresets = ProcurementPresets;
