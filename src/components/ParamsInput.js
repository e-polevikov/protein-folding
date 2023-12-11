import {
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS
} from '../Constants';

export function ParamsInput({
  numParticlesRef,
  particleRadiusRef,
  generateNewParticles
}) {
  return (
    <>
      <label>Число частиц: </label>
      <input
        ref={numParticlesRef}
        type='number'
        defaultValue={INITIAL_NUMBER_OF_PARTICLES}
      />

      <br />

      <label>Радиус частицы: </label>
      <input
        ref={particleRadiusRef}
        type='number'
        defaultValue={INITIAL_PARTICLE_RADIUS}
      />

      <br />

      <button
        className='btn'
        onClick={generateNewParticles}
      >
        Новый эксперимент
      </button>
    </>
  );
}
