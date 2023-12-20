import { Circle, Line } from 'react-konva';

import { calculateTotalEnergy } from '../../services/EnergyCalculator';

import {
  PIVOT_PARTICLE_STROKE_WIDTH,
  JOIN_LINE_STROKE_WIDTH
} from '../../constants/ParticlesChain';

function joinLinePoints(particles) {
  let points = [];

  particles.forEach(particle => {
    points.push(particle.x);
    points.push(particle.y);
  });

  return points;
}

function JoinLine({ particles, particleRadius }) {
  return (
    <>
      <Line
        points={joinLinePoints(particles)}
        stroke={'black'}
        strokeWidth={JOIN_LINE_STROKE_WIDTH}
      />
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
  setParticles,
  pivotParticleId,
  setPivotParticleId,
  isSplitted,
  particleRadius,
  setEnergies,
  powers,
  isConstructor
}) {
  function changeParticleColor(particleId) {
    let newParticles = particles.map((particle) => {
      if (particle.id != particleId) {
        return particle;
      }

      switch (particle.color) {
        case 'red':
          particle.color = 'blue';
          break;
        case 'blue':
          particle.color = 'green';
          break;
        case 'green':
          particle.color = 'red'
          break;
      }

      return particle;
    });

    setParticles(newParticles);

    let energy = calculateTotalEnergy(newParticles, powers);

    setEnergies({
      'initial': energy,
      'current': energy,
      'minimal': energy
    });
  }

  function handleParticleClick(particleId) {
    particleId == pivotParticleId && isConstructor ?
      changeParticleColor(particleId) :
      setPivotParticleId(Number(particleId));
  }

  const particlesChain = particles.map((particle) => (
    <Circle
      key={particle.id}
      id={particle.id}
      x={particle.x}
      y={particle.y}
      radius={particleRadius}
      fill={particle.color}
      stroke={particle.id == pivotParticleId ? 'black' : null}
      strokeWidth={PIVOT_PARTICLE_STROKE_WIDTH}
      onClick={() => handleParticleClick(particle.id)}
    />)
  );

  let joinLine;

  if (isSplitted) {
    let particles1 = particles.slice(
      0, Math.floor(particles.length / 2)
    );

    let particles2 = particles.slice(
      Math.floor(particles.length / 2), particles.length
    );

    joinLine = <>
      <JoinLine
        particles={particles1}
        particleRadius={particleRadius}
      />
      <JoinLine
        particles={particles2}
        particleRadius={particleRadius}
      />
    </>
  } else {
    joinLine = <JoinLine
      particles={particles}
      particleRadius={particleRadius}
    />
  }

  return (
    <>
      {particlesChain}
      {joinLine}
    </>
  );
}