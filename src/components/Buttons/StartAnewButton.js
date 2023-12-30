import styles from './Buttons.module.css';

import { calculateTotalEnergy } from '../../services/EnergyCalculator';

export function StartAnewButton({
  settings,
  setParticles,
  setPivotParticleId,
  setEnergies
}) {
  function startAnew() {
    let start = window.confirm("Вы действительно хотите начать эксперимент заново?");

    if (!start) {
      return;
    }

    setParticles(settings.particles);
    setPivotParticleId(
      Math.floor(settings.particles.length / (settings.isSplitted ? 4 : 2))
    );

    let energy = calculateTotalEnergy(settings.particles, settings.powers);

    setEnergies({
      'initial': energy,
      'current': energy,
      'minimal': energy
    });
  }

  return (
    <>
      <button
        className={styles['button']}
        onClick={startAnew}
      >
        Начать заново
      </button>
    </>
  );
}
