import {Circle, Line} from 'react-konva';

export function ParticlesChain(props) {
  return (
    <>
      {props.particles.map((particle) => (
        <Circle
          key={particle.id}
          id={particle.id}
          x={particle.x}
          y={particle.y}
          radius={props.particleRadius}
          fill={particle.color}
        />))
      }
    </>
  );
}
