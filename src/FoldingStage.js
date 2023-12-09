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
  generateParticles
} from './ParticlesGenerator';

function FoldingStage() {
  const numParticles = INITIAL_NUMBER_OF_PARTICLES;
  const particlesRadius = INITIAL_PARTICLE_RADIUS;
  const particles = generateParticles(numParticles, particlesRadius);

  return (
    <div className='folding-stage'>
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          <ParticlesChain
            particles={particles}
            particleRadius={particlesRadius}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default FoldingStage;
