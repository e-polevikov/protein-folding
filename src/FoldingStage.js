import {Stage, Layer} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS
} from './Constants';

import {
  ParticlesChain
} from './ParticlesChain';

import {
  RotationButton
} from './RotationButton'

import {
  generateParticles
} from './ParticlesGenerator';

function FoldingStage() {
  const numParticles = INITIAL_NUMBER_OF_PARTICLES;
  const particlesRadius = INITIAL_PARTICLE_RADIUS;
  const particles = generateParticles(numParticles, particlesRadius);
  const pivotParticleId = Math.floor(INITIAL_NUMBER_OF_PARTICLES / 2);

  return (
    <>
      <h1 className='title'>Задача "Сворачивание белка" для конкурса КИО</h1>

      <div className='folding-stage-params-panel'>
        <h3>Вращение и перемещение частиц:</h3>

        <RotationButton
          label="&#8635;"
          onRotationStart={() => console.log("onRotationStart")}
          onRotationEnd={() => console.log("onRotationEnd")}
        />

        <RotationButton label="&#8634;"/>
        <RotationButton label="&#8635;"/>
        <RotationButton label="&#8634;"/>
      </div>

      <div className='folding-stage'>
        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer>
            <ParticlesChain
              particles={particles}
              particleRadius={particlesRadius}
              pivotParticleId={pivotParticleId}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default FoldingStage;
