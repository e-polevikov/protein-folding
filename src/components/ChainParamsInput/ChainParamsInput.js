import styles from './ChainParamsInput.module.css';

export function ChainParamsInput({
  numParticlesRef,
  particleRadiusRef,
  isSplittedRef,
  zigzagChainRef,
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

      <br />

      <label>Цепь-зигзаг: </label>
      <input
        ref={zigzagChainRef}
        type='checkbox'
      />
    </div>
  );
}
