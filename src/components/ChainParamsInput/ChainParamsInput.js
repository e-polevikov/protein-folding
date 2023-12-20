import styles from './ChainParamsInput.module.css';

export function ChainParamsInput({
  numParticlesRef,
  particleRadiusRef,
  isSplittedRef,
  settings
}) {
  return (
    <div className={styles['param-inputs']}>
      <label>Число частиц: </label>
      <input
        className={styles['param-input']}
        ref={numParticlesRef}
        type='number'
        defaultValue={settings.NUMBER_OF_PARTICLES}
      />

      <br />

      <label>Радиус частиц: </label>
      <input
        className={styles['param-input']}
        ref={particleRadiusRef}
        type='number'
        defaultValue={settings.PARTICLE_RADIUS}
      />

      <br />

      <label>Две цепи: </label>
      <input
        ref={isSplittedRef}
        type='checkbox'
      />
    </div>
  );
}
