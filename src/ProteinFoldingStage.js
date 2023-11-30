import {useState, useRef} from 'react';
import {Stage, Layer, Circle, Line} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  // INTERACTION_POWERS,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
} from './Constants';

import {
  generateParticles,
  haveIntersections,
  rotateParticles
} from './Helpers';

function ProteinFoldingStage() {
  const strokeWidth = 4;

  const [numParticles, setNumParticles] = useState(INITIAL_NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(INITIAL_PARTICLE_RADIUS);

  const [pivotParticleId, setPivotParticleId] = useState(
    Math.floor(INITIAL_NUMBER_OF_PARTICLES / 2)
  );

  // TODO: energy (initial, minimal, current), interaction powers
  //const [interactionPowers, setInteractionPowers] = useState(INTERACTION_POWERS);

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);

  const [particles, setParticles] = useState(generateParticles(
    INITIAL_NUMBER_OF_PARTICLES, INITIAL_PARTICLE_RADIUS
  ));

  function generateNewParticles() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);
    let newPivotParticleId = Math.floor(currentNumParticles / 2);

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setPivotParticleId(newPivotParticleId);

    setParticles(generateParticles(
      currentNumParticles,
      currentParticleRadius,
      newPivotParticleId
    ));
  }

  function getParticlesJoinLine() {
    let particlesJoinLine = []

    particles.forEach(particle => {
      particlesJoinLine.push(particle.x);
      particlesJoinLine.push(particle.y);
    });

    return particlesJoinLine;
  }

  function setPivotParticle(event) {
    let handledParticleId = Number(event.target.id());
    setPivotParticleId(handledParticleId);
  }

  function getStrokeLineColor(particleId) {
    return particleId == pivotParticleId ? 'black' : null;
  }

  function handleParticlesRotation(rotationDirection) {
    let rotatedParticles = rotateParticles(
      particles, pivotParticleId,
      rotationDirection
    );

    if (!haveIntersections(rotatedParticles, particleRadius)) {
      setParticles(rotatedParticles);
    }
  }

  return (
    <>
      <h1>Задача "Сворачвание белка" для конкурса КИО</h1>

      <div className='protein-folding-params'>
        <h2>Параметры эксперимента:</h2>
        
        <label>Число частиц: </label>
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

        <br/>
        <br/>

        <button className='btn' onClick={generateNewParticles}>Новый эксперимент</button>

        <hr/>

        <h2>Вращение частиц:</h2>

        <button className='rotate-btn' onClick={() => handleParticlesRotation(2)}>&#8635;</button>
        <button className='rotate-btn' onClick={() => handleParticlesRotation(3)}>&#8634;</button>
        <button className='rotate-btn' onClick={() => handleParticlesRotation(0)}>&#8635;</button>
        <button className='rotate-btn' onClick={() => handleParticlesRotation(1)}>&#8634;</button>

        <h3>Значение энергии:</h3>

        <p>Начальное: {0.00}</p>
        <p>Текущее: {0.00}</p>
        <p>Минимальное: {0.00}</p>

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
                stroke={getStrokeLineColor(particle.id)}
                strokeWidth={strokeWidth}
                onClick={setPivotParticle}
              />))
            }
            {<Line
                points={getParticlesJoinLine()}
                stroke={'black'}
                strokeWidth={strokeWidth}
              />
            }
            <Circle
              key={particles.length + 1}
              id={particles.length + 1}
              x={particles[0].x}
              y={particles[0].y}
              radius={Math.floor(particleRadius / 9)}
              fill={'black'}>
            </Circle>
            <Circle
              key={particles.length}
              id={particles.length}
              x={particles[particles.length - 1].x}
              y={particles[particles.length - 1].y}
              radius={Math.floor(particleRadius / 5)}
              fill={'black'}>
            </Circle>
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default ProteinFoldingStage;
