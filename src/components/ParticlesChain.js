import {Circle, Line} from 'react-konva';

import {
  PIVOT_PARTICLE_STROKE_WIDTH,
  JOIN_LINE_STROKE_WIDTH
} from '../Constants';

function particlesJoinLinePoints(particles) {
  let particlesJoinLine = []

  particles.forEach(particle => {
    particlesJoinLine.push(particle.x);
    particlesJoinLine.push(particle.y);
  });

  return particlesJoinLine;
}

export function ParticlesChain({
  particles,
  particleRadius,
  pivotParticleId,
  setPivotParticle,
  changeParticleColor
}) {
  return (
    <>
      {particles.map((particle) => (
        <Circle
          key={particle.id}
          id={particle.id}
          x={particle.x}
          y={particle.y}
          radius={particleRadius}
          fill={particle.color}
          stroke={particle.id == pivotParticleId ? 'black' : null}
          strokeWidth={PIVOT_PARTICLE_STROKE_WIDTH}
          onClick={() => {
            let particleId = Number(particle.id);

            if (particleId == pivotParticleId) {
              changeParticleColor(particleId);
            } else {
              setPivotParticle(particleId)
            }
          }}
        />))
      }
      {
        <Line
          points={particlesJoinLinePoints(particles)}
          stroke={'black'}
          strokeWidth={JOIN_LINE_STROKE_WIDTH}
        />
      }
      <Circle
        key={String(particles.length + 1)}
        id={String(particles.length + 1)}
        x={particles[0].x}
        y={particles[0].y}
        radius={Math.floor(particleRadius / 8)}
        fill={'black'}
      />
      <Circle
        key={String(particles.length)}
        id={String(particles.length)}
        x={particles[particles.length - 1].x}
        y={particles[particles.length - 1].y}
        radius={Math.floor(particleRadius / 5)}
        fill={'black'}
      />
    </>
  );
}
