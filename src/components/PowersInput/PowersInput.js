import { useRef } from 'react';

import styles from './PowersInput.module.css';
import { calculateTotalEnergy } from '../../services/EnergyCalculator';

export function PowersInput({
  setPowers,
  setEnergies,
  particles,
  settings
}) {
  const redRedPowerRef = useRef(null);
  const greenGreenPowerRef = useRef(null);
  const blueBluePowerRef = useRef(null);
  const redGreenPowerRef = useRef(null);
  const redBluePowerRef = useRef(null);
  const greenBluePowerRef = useRef(null);

  function getCurrentPowers() {
    return {
      'red': {
        'red': Number(redRedPowerRef.current.value),
        'green': Number(redGreenPowerRef.current.value),
        'blue': Number(redBluePowerRef.current.value),
      },
      'green': {
        'red': Number(redGreenPowerRef.current.value),
        'green': Number(greenGreenPowerRef.current.value),
        'blue': Number(greenBluePowerRef.current.value),
      },
      'blue': {
        'red': Number(redBluePowerRef.current.value),
        'green': Number(greenBluePowerRef.current.value),
        'blue': Number(blueBluePowerRef.current.value),
      }
    };
  }

  function updatePowers() {
    let currentPowers = getCurrentPowers();
    let energy = calculateTotalEnergy(particles, currentPowers);

    setPowers(currentPowers);
    setEnergies({
      'initial': energy,
      'current': energy,
      'minimal': energy
    });
  }

  return (
    <div className={styles['power-inputs']}>
      <label>
        <span className={styles['red-color-span']}>КК </span>
      </label>
      <input
        className={styles['power-input']}
        ref={redRedPowerRef}
        type='number'
        defaultValue={settings.POWERS['red']['red']}
        onChange={updatePowers}>
      </input>

      <label>
        <span className={styles['green-color-span']}>ЗЗ </span>
      </label>
      <input
        className={styles['power-input']}
        ref={greenGreenPowerRef}
        type='number'
        defaultValue={settings.POWERS['green']['green']}
        onChange={updatePowers}>
      </input>

      <label>
        <span className={styles['blue-color-span']}>СС </span>
      </label>
      <input
        className={styles['power-input']}
        ref={blueBluePowerRef}
        type='number'
        defaultValue={settings.POWERS['blue']['blue']}
        onChange={updatePowers}>
      </input>

      <label>
        <span className={styles['red-color-span']}>К</span>
        <span className={styles['green-color-span']}>З </span>
      </label>
      <input
        className={styles['power-input']}
        ref={redGreenPowerRef}
        type='number'
        defaultValue={settings.POWERS['red']['green']}
        onChange={updatePowers}>
      </input>

      <label>
        <span className={styles['blue-color-span']}>С</span>
        <span className={styles['green-color-span']}>З </span>
      </label>
      <input
        className={styles['power-input']}
        ref={greenBluePowerRef}
        type='number'
        defaultValue={settings.POWERS['blue']['green']}
        onChange={updatePowers}>
      </input>

      <label>
        <span className={styles['red-color-span']}>К</span>
        <span className={styles['blue-color-span']}>С </span>
      </label>
      <input
        className={styles['power-input']}
        ref={redBluePowerRef}
        type='number'
        defaultValue={settings.POWERS['red']['blue']}
        onChange={updatePowers}>
      </input>
    </div>
  );
}
