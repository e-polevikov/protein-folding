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
        defaultValue={settings.particles.length}
      />

      <br />

      <label>Радиус частиц: </label>
      <input
        className={styles['param-input']}
        ref={particleRadiusRef}
        type='number'
        defaultValue={settings.particleRadius}
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
