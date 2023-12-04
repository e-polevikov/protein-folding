import {useState, useEffect, useRef} from 'react';
import {Stage, Layer, Circle, Line} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  INTERACTION_POWERS,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
} from './Constants';

import {
  generateParticles,
  haveIntersections,
  rotateParticles,
  calculateTotalEnergy,
  generateParticleColor
} from './Helpers';

function ProteinFoldingStage() {
  const strokeWidth = 4;

  const [numParticles, setNumParticles] = useState(INITIAL_NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(INITIAL_PARTICLE_RADIUS);

  const [pivotParticleId, setPivotParticleId] = useState(
    Math.floor(INITIAL_NUMBER_OF_PARTICLES / 2)
  );

  const [particles, setParticles] = useState(generateParticles(
    INITIAL_NUMBER_OF_PARTICLES, INITIAL_PARTICLE_RADIUS
  ));

  // TODO:
  // - allow for changing interaction powers

  const [interactionPowers, setInteractionPowers] = useState(INTERACTION_POWERS);

  const [initialEnergy, setInitialEnergy] = useState(
    calculateTotalEnergy(particles, interactionPowers)
  );

  const [currentEnergy, setCurrentEnergy] = useState(
    calculateTotalEnergy(particles, interactionPowers)
  );

  const [minimalEnergy, setMinimalEnergy] = useState(
    calculateTotalEnergy(particles, interactionPowers)
  );

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);

  function generateNewParticles() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);
    let newPivotParticleId = Math.floor(currentNumParticles / 2);

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setPivotParticleId(newPivotParticleId);

    let newParticles = generateParticles(
      currentNumParticles,
      currentParticleRadius,
      newPivotParticleId
    );

    setParticles(newParticles);

    let currEnergy = calculateTotalEnergy(newParticles, interactionPowers);

    setInitialEnergy(currEnergy);
    setCurrentEnergy(currEnergy);
    setMinimalEnergy(currEnergy);
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

    if (pivotParticleId != handledParticleId) {
      setPivotParticleId(handledParticleId);
    } else { // Change particle color
      let newParticles = particles.map((particle) => {
        if (particle.id == pivotParticleId) {
          if (particle.color == 'red') {
            particle.color = 'blue';
          } else if (particle.color == 'blue') {
            particle.color = 'green';
          } else if (particle.color == 'green') {
            particle.color = 'red';
          }
        }

        return particle;
      });

      setParticles(newParticles);

      let currEnergy = calculateTotalEnergy(newParticles, interactionPowers);

      setInitialEnergy(currEnergy);
      setCurrentEnergy(currEnergy);
      setMinimalEnergy(currEnergy);
    }
  }

  function getStrokeLineColor(particleId) {
    return particleId == pivotParticleId ? 'black' : null;
  }

  const [rotationStarted, setRotationStarted] = useState(false);
  const [rotationDirection, setRotationDirection] = useState(null);

  function handleParticlesRotation() {
    let rotatedParticles = rotateParticles(
      particles, pivotParticleId,
      rotationDirection
    );

    if (!haveIntersections(rotatedParticles, particleRadius)) {
      let currEnergy = calculateTotalEnergy(rotatedParticles, interactionPowers);

      setCurrentEnergy(currEnergy);

      if (currEnergy < minimalEnergy) {
        setMinimalEnergy(currEnergy);
      }

      setParticles(rotatedParticles);
    }
  }

  function handleRotationButtonMouseDown(buttonRotationDirection) {
    setRotationDirection(buttonRotationDirection);
    setRotationStarted(true);
  }

  function handleRotationButtonMouseUp() {
    setRotationStarted(false);
  }

  useEffect(() => {
    if (rotationStarted) {
      setTimeout(() => {
        handleParticlesRotation();
      }, 10);
    }
  });

  return (
    <>
      <h1>Задача "Сворачвание белка" для конкурса КИО</h1>

      <div className='protein-folding-params'>
        <h2>Вращение частиц:</h2>

        <button className='rotate-btn'
          onMouseDown={() => handleRotationButtonMouseDown(2)}
          onMouseUp={handleRotationButtonMouseUp}
        >
          &#8635;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleRotationButtonMouseDown(3)}
          onMouseUp={handleRotationButtonMouseUp}
        >
          &#8634;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleRotationButtonMouseDown(0)}
          onMouseUp={handleRotationButtonMouseUp}
        >
          &#8635;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleRotationButtonMouseDown(1)}
          onMouseUp={handleRotationButtonMouseUp}
        >
          &#8634;
        </button>

        <h3>Значение энергии:</h3>

        <p>Начальное: {initialEnergy.toFixed(3)}</p>
        <p>Текущее: {currentEnergy.toFixed(3)}</p>
        <p>Минимальное: {minimalEnergy.toFixed(3)}</p>

        <hr/>

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

      </div>

      <div className='protein-folding-stage'>
        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer draggable={true}>
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
              key={String(particles.length + 1)}
              id={String(particles.length + 1)}
              x={particles[0].x}
              y={particles[0].y}
              radius={Math.floor(particleRadius / 9)}
              fill={'black'}>
            </Circle>
            <Circle
              key={String(particles.length)}
              id={String(particles.length)}
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
