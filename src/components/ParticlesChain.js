import {Circle, Line} from 'react-konva';

import {
  PIVOT_PARTICLE_STROKE_WIDTH,
  JOIN_LINE_STROKE_WIDTH
} from '../Constants';

function joinLinePoints(particles) {
  let particlesJoinLine = []

  particles.forEach(particle => {
    particlesJoinLine.push(particle.x);
    particlesJoinLine.push(particle.y);
  });

  return particlesJoinLine;
}

function JoinLine({ particles, particleRadius }) {
  return (
    <>
      {
        <Line
          points={joinLinePoints(particles)}
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

export function ParticlesChain({
  particles,
  particleRadius,
  pivotParticleId,
  isSplitted,
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
            particleId == pivotParticleId ?
              changeParticleColor(particleId) :
              setPivotParticle(particleId);
          }}
        />))
      }
      {
        isSplitted ?
        <>
          <JoinLine
            particles={particles.slice(0, Math.floor(particles.length / 2))}
            particleRadius={particleRadius}
          />
          <JoinLine
            particles={particles.slice(Math.floor(particles.length / 2), particles.length)}
            particleRadius={particleRadius}
          />
        </> :
        <JoinLine
          particles={particles}
          particleRadius={particleRadius}
        />
      }
    </>
  );
}
