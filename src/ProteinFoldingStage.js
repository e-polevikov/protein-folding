import {useState, useEffect, useRef} from 'react';
import {Stage, Layer, Circle, Line} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  INTERACTION_POWERS,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
} from './Constants';

import {
  generateParticles
} from './Helpers';

function ProteinFoldingStage() {
  const [numParticles, setNumParticles] = useState(INITIAL_NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(INITIAL_PARTICLE_RADIUS);
  const [interactionPowers, setInteractionPowers] = useState(INTERACTION_POWERS);

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);

  const [particles, setParticles] = useState(generateParticles(
    INITIAL_NUMBER_OF_PARTICLES, INITIAL_PARTICLE_RADIUS
  ));

  function generateNewParticles() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setParticles(generateParticles(currentNumParticles, currentParticleRadius));
  }

  function getParticlesJoinLine() {
    let particlesJoinLine = []

    particles.forEach(particle => {
      particlesJoinLine.push(particle.x);
      particlesJoinLine.push(particle.y);
    });

    return particlesJoinLine;
  }

  return (
    <>
      <h1>Задача "Сворачвание белка" для конкурса КИО</h1>

      <div className='protein-folding-params'>
        <h2>Параметры эксперимента:</h2>
        
        <label>Количество частиц: </label>
        <input
          ref={numParticlesRef}
          type='number'
          defaultValue={INITIAL_NUMBER_OF_PARTICLES}
        />

        <br/>
        <br/>

        <label>Радиус частицы: </label>
        <input
          ref={particleRadiusRef}
          type='number'
          defaultValue={INITIAL_PARTICLE_RADIUS}
        />

        <hr/>

        <button className='btn' onClick={generateNewParticles}>Новый эксперимент</button>

        <br/>

        <p>Текущая энергия взаимодействия: {0.00}</p>
        <p>Минимальная энергия взаимодействия: {0.00}</p>

      </div>

      <div className='protein-folding-stage'>
        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer>
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
            {<Line
                points={getParticlesJoinLine()}
                stroke={'black'}
                strokeWidth={4}
              />
            }
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default ProteinFoldingStage;
