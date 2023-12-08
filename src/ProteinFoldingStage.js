import {useState, useEffect, useRef} from 'react';
import {Stage, Layer, Circle, Line} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  INTERACTION_POWERS,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
  MOVE_DISTANCE,
} from './Constants';

import {
  generateParticles,
  haveIntersections,
  rotateParticles,
  calculateTotalEnergy
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

  const [interactionPowers, setInteractionPowers] = useState(INTERACTION_POWERS);

  const redInteractionPowerRef = useRef(null);
  const greenInteractionPowerRef = useRef(null);
  const blueInteractionPowerRef = useRef(null);
  const redGreenInteractionPowerRef = useRef(null);
  const redBlueInteractionPowerRef = useRef(null);
  const greenBlueInteractionPowerRef = useRef(null);

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

    let currentInteractionPowers = {
      'red': {
        'red': Number(redInteractionPowerRef.current.value),
        'green': Number(redGreenInteractionPowerRef.current.value),
        'blue': Number(redBlueInteractionPowerRef.current.value),
      },
      'green': {
        'red': Number(redGreenInteractionPowerRef.current.value),
        'green': Number(greenInteractionPowerRef.current.value),
        'blue': Number(greenBlueInteractionPowerRef.current.value),
      },
      'blue': {
        'red': Number(redBlueInteractionPowerRef.current.value),
        'green': Number(greenBlueInteractionPowerRef.current.value),
        'blue': Number(blueInteractionPowerRef.current.value),
      }
    };

    setInteractionPowers(currentInteractionPowers);

    let currEnergy = calculateTotalEnergy(newParticles, currentInteractionPowers);

    setInitialEnergy(currEnergy);
    setCurrentEnergy(currEnergy);
    setMinimalEnergy(currEnergy);
  }

  function setPivotParticleOrChangeParticleColor(event) {
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

  /* Helper functions for drawing particles */

  function getParticlesJoinLine() {
    let particlesJoinLine = []

    particles.forEach(particle => {
      particlesJoinLine.push(particle.x);
      particlesJoinLine.push(particle.y);
    });

    return particlesJoinLine;
  }

  function getStrokeLineColor(particleId) {
    return particleId == pivotParticleId ? 'black' : null;
  }

  /* *** */

  /* Particles rotation */

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

  function updateInteractionPowers() {
    let currentInteractionPowers = {
      'red': {
        'red': Number(redInteractionPowerRef.current.value),
        'green': Number(redGreenInteractionPowerRef.current.value),
        'blue': Number(redBlueInteractionPowerRef.current.value),
      },
      'green': {
        'red': Number(redGreenInteractionPowerRef.current.value),
        'green': Number(greenInteractionPowerRef.current.value),
        'blue': Number(greenBlueInteractionPowerRef.current.value),
      },
      'blue': {
        'red': Number(redBlueInteractionPowerRef.current.value),
        'green': Number(greenBlueInteractionPowerRef.current.value),
        'blue': Number(blueInteractionPowerRef.current.value),
      }
    };

    setInteractionPowers(currentInteractionPowers);

    let currEnergy = calculateTotalEnergy(particles, currentInteractionPowers);

    setInitialEnergy(currEnergy);
    setCurrentEnergy(currEnergy);
    setMinimalEnergy(currEnergy);    
  }

  useEffect(() => {
    if (rotationStarted) {
      setTimeout(() => {
        handleParticlesRotation();
      }, 10);
    }
  });

  /* *** */

  /* Particles movement */

  const [movementStarted, setMovementStarted] = useState(false);
  const [movementDirection, setMovementDirection] = useState(null);

  function handleMovementButtonMouseDown(buttonMovementDirection) {
    setMovementDirection(buttonMovementDirection);
    setMovementStarted(true);
  }

  function handleMovementButtonMouseUp() {
    setMovementStarted(false);
  }

  function handleParticlesMovement() {
    let movedParticles = particles.map((particle) => {
      if (movementDirection == 0) {
        particle.x -= MOVE_DISTANCE;
      } else if (movementDirection == 1) {
        particle.x += MOVE_DISTANCE;
      } else if (movementDirection == 2) {
        particle.y -= MOVE_DISTANCE;
      } else if (movementDirection == 3) {
        particle.y += MOVE_DISTANCE;
      }
  
      return particle;
    });
  
    setParticles(movedParticles);
  }

  useEffect(() => {
    if (movementStarted) {
      setTimeout(() => {
        handleParticlesMovement();
      }, 10);
    }
  });

  /* *** */

  return (
    <>
      <h1 className='title'>Задача "Сворачвание белка" для конкурса КИО</h1>

      <div className='protein-folding-params'>
      <h3>Вращение и перемещение частиц:</h3>

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
        
        <br/>

        <button className='rotate-btn'
          onMouseDown={() => handleMovementButtonMouseDown(0)}
          onMouseUp={handleMovementButtonMouseUp}
        >
          &#8592;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleMovementButtonMouseDown(1)}
          onMouseUp={handleMovementButtonMouseUp}
        >
          &#8594;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleMovementButtonMouseDown(2)}
          onMouseUp={handleMovementButtonMouseUp}
        >
          &#8593;
        </button>

        <button className='rotate-btn'
          onMouseDown={() => handleMovementButtonMouseDown(3)}
          onMouseUp={handleMovementButtonMouseUp}
        >
          &#8595;
        </button>

        <h3>Значение энергии:</h3>

        <p>Начальное: {initialEnergy.toFixed(3)}</p>
        <p>Текущее: {currentEnergy.toFixed(3)}</p>
        <p>Минимальное: {minimalEnergy.toFixed(3)}</p>

        <hr/>

        <h3>Параметры эксперимента:</h3>
        
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

        <h3>Силы взаимодействия:</h3>

        <label>
          <span className='red-color-span'>КК </span> 
        </label>
        <input
          ref={redInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['red']}
          onChange={updateInteractionPowers}>
        </input>
        <br/>

        <label>
          <span className='green-color-span'>ЗЗ </span>
        </label>
        <input
          ref={greenInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['green']['green']}
          onChange={updateInteractionPowers}>
        </input>
        <br/>

        <label>
          <span className='blue-color-span'>СС </span>
        </label>
        <input
          ref={blueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['blue']['blue']}
          onChange={updateInteractionPowers}>
        </input>
        <br/>

        <label>
          <span className='red-color-span'>К</span>
          <span className='green-color-span'>З </span>
        </label>
        <input
          ref={redGreenInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['green']}
          onChange={updateInteractionPowers}>
        </input>
        <br/>

        <label>
          <span className='blue-color-span'>С</span>
          <span className='green-color-span'>З </span>
        </label>
        <input
          ref={greenBlueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['blue']['green']}
          onChange={updateInteractionPowers}>
        </input>
        <br/>

        <label>
          <span className='red-color-span'>К</span>
          <span className='blue-color-span'>С </span>
        </label>
        <input
          ref={redBlueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['blue']}
          onChange={updateInteractionPowers}>
        </input>

        <br/>
        <br/>

        <button className='btn' onClick={generateNewParticles}>Новый эксперимент</button>

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
                onClick={setPivotParticleOrChangeParticleColor}
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
