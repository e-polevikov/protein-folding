import {Circle, Line} from 'react-konva';

function particlesJoinLinePoints(particles) {
  let particlesJoinLine = []

  particles.forEach(particle => {
    particlesJoinLine.push(particle.x);
    particlesJoinLine.push(particle.y);
  });

  return particlesJoinLine;
}

export function ParticlesChain(props) {
  const strokeWidth = 5;
  const particles = props.particles;
  const particleRadius = props.particleRadius;
  const joinLinePoints = particlesJoinLinePoints(particles);

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
        />))
      }
      {
        <Line
          points={joinLinePoints}
          stroke={'black'}
          strokeWidth={strokeWidth}
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
