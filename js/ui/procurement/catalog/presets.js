/**
 * js/ui/procurement/catalog/presets.js - Fleet Presets & Preconfigured Aircraft Toolbar.
 */

class ProcurementPresets {
  static activePreset = 'stealth';

  static getBuiltinPreset(type) {
    const catalog = window.AIRCRAFT_CATALOG || {};
    const presets = {
      stealth: [
        { specId: 'F-22A', chosenGunId: 'M61A2', weapons: ['AIM-260', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3'], upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'] },
        { specId: 'F-22A', chosenGunId: 'M61A2', weapons: ['AIM-260', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3'], upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'] },
        { specId: 'Su-57', chosenGunId: 'GSH-30-1', weapons: ['R-37M', 'R-77M', 'R-74M2'], upgrades: ['THRUST_VECTOR', 'RAM_NANO_COATING'] },
        { specId: 'F-35A', chosenGunId: 'GAU-22', weapons: ['AIM-260', 'AIM-120D-3', 'AIM-9X-B3'], upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'] },
        { specId: 'Su-75', chosenGunId: 'GSH-30-1', weapons: ['R-77M', 'R-74M2'], upgrades: ['RAM_NANO_COATING'] },
        { specId: 'Kizilelma', chosenGunId: 'BK-27', weapons: ['GOKHAN', 'BOZDOGAN'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['SADM-8', 'CACM-6'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['SADM-8', 'CACM-6'], upgrades: ['SWARM_AI_COPROCESSOR'] }
      ],
      strike: [
        { specId: 'F-15EX', chosenGunId: 'M61A2', weapons: ['GBU-28', 'GBU-39', 'AGM-88G', 'AN-AAQ-33', 'AIM-120D', 'AIM-9X-2'], upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'] },
        { specId: 'A-10C', chosenGunId: 'GAU-8', weapons: ['BK-37-POD', 'AGM-65G', 'CBU-105', 'HYDRA-70', 'AN-AAQ-28', 'AIM-9X-2'], upgrades: ['TITANIUM_COCKPIT', 'KEVLAR_BELLY_ARMOR'] },
        { specId: 'MiG-27K', chosenGunId: 'GSH-6-30', weapons: ['GSH-30-2K', 'S-25OFM', 'KH-38ML', 'S-13OF', 'SAPSAN-E'], upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP'] },
        { specId: 'Su-39', chosenGunId: 'GSH-30-2', weapons: ['S-25OFM', 'KH-58USHKE', 'RBK-500', 'S-8KOM', 'SAPSAN-E'], upgrades: ['KEVLAR_BELLY_ARMOR', 'SEAD_HTS_POD'] },
        { specId: 'A-16', chosenGunId: 'GAU-13', weapons: ['GPU-5A', 'CRV7-MPSM', 'AGM-88G', 'GBU-54', 'AN-AAQ-33', 'AIM-9X-2'], upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'] },
        { specId: 'F-16XL', chosenGunId: 'GAU-13', weapons: ['BK-37-POD', 'ZUNI-127', 'CBU-105', 'AGM-158B', 'AN-ASQ-228', 'AIM-120D'], upgrades: ['HEAVY_PYLON_FAIRINGS', 'MITL_DATALINK_TRANSCEIVER'] },
        { specId: 'EA-18G', chosenGunId: 'M61A2', weapons: ['AN-ALQ-249', 'AGM-88G', 'AN-AAQ-28', 'AIM-120D'], upgrades: ['ESM_PASSIVE_SUITE', 'ADAPTIVE_ECCM_SUITE'] },
        { specId: 'F-35A', chosenGunId: 'GAU-22', weapons: ['AGM-154C', 'GBU-53', 'AGM-88G', 'AIM-260'], upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'] },
        { specId: 'F-22A', chosenGunId: 'M61A2', weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'], upgrades: ['RAM_NANO_COATING'] }
      ],
      sead: [
        { specId: 'EA-18G', chosenGunId: 'M61A2', weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-120D', 'ADM-160B'], upgrades: ['GAN_AESA_CORE', 'ESM_PASSIVE_SUITE'] },
        { specId: 'Su-39', chosenGunId: 'GSH-30-2', weapons: ['KH-58USHKE', 'AGM-88G', 'S-13OF', 'S-8KOM', 'AN-ALQ-184', 'R-73'], upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR'] },
        { specId: 'F-15EX', chosenGunId: 'M61A2', weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AIM-120D', 'AN-ALQ-184', 'AIM-9X-2', 'AIM-9X-2'], upgrades: ['MADL_BATTLE_LINK'] },
        { specId: 'A-16', chosenGunId: 'GAU-13', weapons: ['GPU-5A', 'CRV7-MPSM', 'AGM-88G', 'TALD-DECOY', 'AIM-9X-2'], upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP'] },
        { specId: 'Tornado-ECR', chosenGunId: 'BK-27', weapons: ['AGM-88G', 'AIM-120D', 'ALE-55'], upgrades: ['ESM_PASSIVE_SUITE'] }
      ],
      ew: [
        { specId: 'EA-36', chosenGunId: 'DE-PULSE', weapons: ['AN-ALQ-165', 'AIM-260B-HOJ', 'AIM-9X-B3', 'AN-ALQ-249', 'AN-ALQ-218-POD'], upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE', 'SUPERCRUISE_VCE'] },
        { specId: 'EA-18G', chosenGunId: 'GAU-22', weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-120D-HOJ', 'AN-ALQ-218-POD'], upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE'] },
        { specId: 'J-15D', chosenGunId: 'GSH-30-1', weapons: ['SAP-14-POD', 'PL-15-HOJ', 'KH-58USHKE', 'PL-10', 'KHIBINY-L175'], upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK'] },
        { specId: 'J-16D', chosenGunId: 'GSH-30-1', weapons: ['SAP-14-POD', 'KH-58USHKE', 'KH-59MK2', 'SAPSAN-E'], upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE', 'MITL_DATALINK_TRANSCEIVER'] },
        { specId: 'EF-111A', chosenGunId: 'M61A2', weapons: ['AN-ALQ-165', 'ADM-160B', 'AN-ALQ-249', 'TALD-DECOY', 'AN-ALQ-218-POD'], upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE'] },
        { specId: 'Su-24MP', chosenGunId: 'GSH-23L', weapons: ['SAP-14-POD', 'KH-58USHKE', 'R-27EP', 'KHIBINY-L175', 'R-73'], upgrades: ['ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE', 'TFR_TERRAIN_RADAR'] },
        { specId: 'Tornado-ECR', chosenGunId: 'BK-27', weapons: ['ALARM-II', 'AN-ALQ-131', 'TALD-DECOY', 'AN-AAQ-28'], upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE'] },
        { specId: 'J-20S', chosenGunId: 'GSH-30-1', weapons: ['AN-ALQ-165', 'ADM-160B', 'PL-15-HOJ', 'AN-ALQ-249', 'PL-10'], upgrades: ['RAM_NANO_COATING', 'MALD_DECOY_SYSTEM', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK'] }
      ],
      swarm: [
        { specId: 'F-22C-COFFIN', chosenGunId: 'DE-PULSE', weapons: ['ADMM-S', 'CUDA-SAC', 'AIM-260', 'AIM-9X-B3'], upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'] },
        { specId: 'F-15EX', chosenGunId: 'M61A2', weapons: ['AIM-174B', 'AIM-260', 'AIM-120D-3', 'AIM-120D-3', 'FMRAAM', 'AIM-9X-B3'], upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'] },
        { specId: 'S-70', chosenGunId: 'GSH-30-1', weapons: ['R-77M', 'R-77T', 'R-74M2'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['SADM-8', 'CACM-6'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-101', chosenGunId: 'MICRO_GUN', weapons: ['SADM-8', 'CACM-6'], upgrades: ['SWARM_AI_COPROCESSOR'] },
        { specId: 'MQ-99', chosenGunId: 'MICRO_GUN', weapons: ['MAM', 'CACM-6'], upgrades: ['SWARM_AI_COPROCESSOR'] }
      ],
      interceptor: [
        { specId: 'MiG-31BM', chosenGunId: 'GSH-30-1', weapons: ['K-100', 'R-33S', 'R-77M'], upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'] },
        { specId: 'Su-35S', chosenGunId: 'GSH-30-1', weapons: ['KS-172', 'RVV-AE-PD', 'PYTHON-5', 'AN-ALQ-99'], upgrades: ['THRUST_VECTOR'] },
        { specId: 'Eurofighter', chosenGunId: 'BK-27', weapons: ['FMRAAM', 'METEOR', 'IRIS-T-LR'], upgrades: ['EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'] },
        { specId: 'Rafale-C', chosenGunId: 'BK-27', weapons: ['JNAAM', 'METEOR', 'MICA-IR'], upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'] },
        { specId: 'Su-37', chosenGunId: 'GSH-30-1', weapons: ['K-77ME', 'R-74M2', 'R-73'], upgrades: ['THRUST_VECTOR'] }
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
      { id: 'strike', name: 'GROUND STRIKE' },
      { id: 'sead', name: 'SEAD ESCORT' },
      { id: 'ew', name: 'EW SUPPRESSION' },
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
        <button class="preset-btn custom-load-btn ${isAct ? 'active' : ''}" title="Load ${name}">${name}</button>
        <button class="preset-icon-btn btn-rename" title="Rename preset"><img src="icons/edit.svg" width="11" height="11" alt="Rename"></button>
        <button class="preset-icon-btn btn-delete alert" title="Delete preset"><img src="icons/trash.svg" width="11" height="11" alt="Delete"></button>
      `;

      chip.querySelector('.custom-load-btn').onclick = () => {
        ProcurementPresets.activePreset = `custom:${name}`;
        procurementManager.applyCustomPreset(name);
      };

      chip.querySelector('.btn-rename').onclick = (e) => {
        e.stopPropagation();
        procurementManager.showPromptModal('RENAME PRESET', `Enter a new name for "${name}":`, name, (newName) => {
          if (newName && newName.trim() && newName.trim() !== name) {
            if (customManager.rename(name, newName.trim())) {
              if (ProcurementPresets.activePreset === `custom:${name}`) ProcurementPresets.activePreset = `custom:${newName.trim()}`;
              procurementManager.updateUI();
            }
          }
        });
      };

      chip.querySelector('.btn-delete').onclick = (e) => {
        e.stopPropagation();
        procurementManager.showConfirmModal('DELETE PRESET', `Delete preset configuration "${name}"?`, () => {
          customManager.delete(name);
          if (ProcurementPresets.activePreset === `custom:${name}`) {
            ProcurementPresets.activePreset = 'stealth';
            procurementManager.applyBuiltinPreset('stealth');
          } else {
            procurementManager.updateUI();
          }
        });
      };

      container.appendChild(chip);
    });

    const templateBtn = document.createElement('button');
    templateBtn.className = 'preset-btn highlight';
    templateBtn.textContent = 'AIRCRAFT PRESETS';
    templateBtn.onclick = () => procurementManager.openPreconfiguredAircraftModal();
    container.appendChild(templateBtn);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'preset-btn highlight';
    saveBtn.textContent = 'SAVE SQUADRON';
    saveBtn.onclick = () => {
      if (procurementManager.game.procurementSquadron.length === 0) {
        procurementManager.showAlertModal('EMPTY SQUADRON', 'Cannot save an empty squadron. Add aircraft first.');
        return;
      }
      const count = Object.keys(customMap).length + 1;
      procurementManager.showPromptModal('SAVE SQUADRON PRESET', 'Enter a name for this squadron configuration:', `Squadron ${count}`, (name) => {
        if (name && name.trim()) {
          if (customManager.save(name.trim(), procurementManager.game.procurementSquadron)) {
            ProcurementPresets.activePreset = `custom:${name.trim()}`;
            procurementManager.updateUI();
          }
        }
      });
    };
    container.appendChild(saveBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'preset-btn alert';
    clearBtn.textContent = 'CLEAR ALL';
    clearBtn.onclick = () => {
      procurementManager.showConfirmModal('CLEAR SQUADRON', 'Remove all aircraft from the current squadron?', () => {
        ProcurementPresets.activePreset = '';
        procurementManager.clearSquadron();
      });
    };
    container.appendChild(clearBtn);
  }
}

window.ProcurementPresets = ProcurementPresets;
