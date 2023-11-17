import {useState, useEffect, useRef} from 'react';
import {Stage, Layer, Circle, Line} from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  PARTICLES_MOVE_DELAY_MS,
  INTERACTION_POWERS,
  MOVE_P,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
} from './Constants';

import {
  generateParticles,
  generateParticlesChain,
  moveParticlesRandomly,
  moveParticlesChain,
  calculateTotalEnergy,
  generateParticleColor,
  findIntersectingParticles,
  getParticleColor
} from './Helpers';

function ProteinFoldingStage() {
  const [numParticles, setNumParticles] = useState(INITIAL_NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(INITIAL_PARTICLE_RADIUS);
  const [interactionPowers, setInteractionPowers] = useState(INTERACTION_POWERS);
  const [moveP, setMoveP] = useState(MOVE_P);

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);
  const movePRef = useRef(null);

  const redInteractionPowerRef = useRef(null);
  const greenInteractionPowerRef = useRef(null);
  const blueInteractionPowerRef = useRef(null);
  const redGreenInteractionPowerRef = useRef(null);
  const redBlueInteractionPowerRef = useRef(null);
  const greenBlueInteractionPowerRef = useRef(null);

  const particlesAsChainRef = useRef(null);
  const pivotParticleRef = useRef(null);
  const rotationDirectionRef = useRef(null);

  const [particles, setParticles] = useState(generateParticles(
    numParticles, particleRadius
  ));

  const [energy, setEnergy] = useState(calculateTotalEnergy(
    particles, interactionPowers
  ));

  const [minEnergy, setMinEnergy] = useState(energy);

  const [foldingStarted, setFoldingStarted] = useState(false);

  function startProteinFolding() {
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].isIntersecting) {
        return;
      }
    }

    setFoldingStarted(true);
  }

  function pauseProteinFolding() {
    setFoldingStarted(false);
  }

  function changeParticleColor(event) {
    if (foldingStarted) {
      return;
    }

    let handledParticle = event.target;

    let newParticles = particles.map((particle) => {
      if (particle.id === handledParticle.id()) {
        particle.color = generateParticleColor(particle.color);
      }

      return particle;
    });

    let energy = calculateTotalEnergy(newParticles, interactionPowers);

    setParticles(newParticles);
    setEnergy(energy);
    setMinEnergy(Math.min(energy, minEnergy));
  }

  function handleDragStart(event) {
    let handledParticle = event.target;

    if (foldingStarted) {
      handledParticle.stopDrag();
      return;
    }
  }

  function handleParticleDragMove(event) {
    let handledParticle = event.target;
    
    if (handledParticle.x() + particleRadius >= STAGE_WIDTH) {
      handledParticle.x(STAGE_WIDTH - particleRadius);
    }

    if (handledParticle.x() - particleRadius < 0) {
      handledParticle.x(particleRadius);
    }

    if (handledParticle.y() - particleRadius < 0) {
      handledParticle.y(particleRadius);
    }

    if (handledParticle.y() + particleRadius >= STAGE_HEIGHT) {
      handledParticle.y(STAGE_HEIGHT - particleRadius);
    }

    let newParticles = particles.map((particle) => {
      if (particle.id === handledParticle.id()) {
        particle.x = handledParticle.x();
        particle.y = handledParticle.y();
      }

      particle.isIntersecting = false;

      return particle;
    });

    let intersectingParticlesIds = findIntersectingParticles(newParticles, particleRadius);

    if (intersectingParticlesIds.length === 0) {
      setParticles(newParticles);

      let energy = calculateTotalEnergy(newParticles, interactionPowers);

      setEnergy(energy);
      setMinEnergy(Math.min(energy, minEnergy));
    } else {
      for (let i = 0; i < intersectingParticlesIds.length; i++) {
        newParticles[intersectingParticlesIds[i]].isIntersecting = true;
      }

      setParticles(newParticles);
    }
  }

  function generateNewProtein() {
    if (!foldingStarted) {
      let currentNumParticles = Number(numParticlesRef.current.value);
      let currentParticleRadius = Number(particleRadiusRef.current.value);
      let currentMoveP = Number(movePRef.current.value);

      setNumParticles(currentNumParticles);
      setParticleRadius(currentParticleRadius);
      setMoveP(currentMoveP);

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

      let particlesAsChain = particlesAsChainRef.current.value;
      let newParticles = [];

      if (particlesAsChain) {
        newParticles = generateParticlesChain(
          numParticles,
          currentParticleRadius    
        );
      } else {
        newParticles = generateParticles(
          currentNumParticles,
          currentParticleRadius,
        );
      }

      let energy = calculateTotalEnergy(newParticles, currentInteractionPowers);

      setParticles(newParticles);
      setEnergy(energy);
      setMinEnergy(energy);
    }
  }

  function rotateParticlesChain(event) {
    let pivotParticleId = Number(pivotParticleRef.current.value);
    let rotationDirection = Number(rotationDirectionRef.current.value);

    let movedParticlesChain = moveParticlesChain(
      particles, pivotParticleId, rotationDirection
    );

    let isChain = true;

    let intersectingParticlesIds = findIntersectingParticles(
      movedParticlesChain, particleRadius, isChain
    );
    
    if (intersectingParticlesIds.length == 0) {
      setParticles(movedParticlesChain);

      let energy = calculateTotalEnergy(movedParticlesChain, interactionPowers);

      setEnergy(energy);
      setMinEnergy(Math.min(energy, minEnergy));
    }
  }

  useEffect(() => {
    if (foldingStarted) {
      setTimeout(() => {
        let movedParticles = moveParticlesRandomly(
          particles, particleRadius,
          moveP, interactionPowers,
        );

        let currentEnergy = calculateTotalEnergy(movedParticles, interactionPowers);
  
        setParticles(movedParticles);
        setEnergy(currentEnergy);
        setMinEnergy(Math.min(minEnergy, currentEnergy));
      }, PARTICLES_MOVE_DELAY_MS);
    }
  });

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

        <br/>
        <br/>

        <label>P: </label>
        <input
          ref={movePRef}
          type='number'
          defaultValue={moveP}
        />

        <br/>
        <br/>

        <hr/>

        <label>Белок-цепочка: </label>
        <input
          ref={particlesAsChainRef}
          type='checkbox'
        />

        <br/>
        <br/>

        <label>Опорный элемент: </label>
        <input
          ref={pivotParticleRef}
          type='number'
          defaultValue={0}
        />

        <br/>
        <br/>

        <label>Направление поворота:</label>
        <input
          ref={rotationDirectionRef}
          type='number'
          defaultValue={0}
        />

        <br/>
        <br/>

        <button className='btn' onClick={rotateParticlesChain}>Повернуть цепочку</button>

        <hr/>

        <h2>Силы взаимодействия:</h2>

        <label>
          <span className='red-color-span'>Красные: </span>
        </label>
        <input
          ref={redInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['red']}>
        </input>
        <br/><br/>

        <label>
          <span className='green-color-span'>Зеленые: </span>
        </label>
        <input
          ref={greenInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['green']['green']}>
        </input>
        <br/><br/>

        <label>
          <span className='blue-color-span'>Синие: </span>
        </label>
        <input
          ref={blueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['blue']['blue']}>
        </input>
        <br/><br/>

        <label>
          <span className='red-color-span'>Красные</span> -
          <span className='green-color-span'> Зеленые: </span>
        </label>
        <input
          ref={redGreenInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['green']}>
        </input>
        <br/><br/>

        <label>
          <span className='blue-color-span'>Синие</span> - 
          <span className='green-color-span'> Зеленые: </span>
        </label>
        <input
          ref={greenBlueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['blue']['green']}>
        </input>
        <br/><br/>

        <label>
          <span className='red-color-span'>Красные</span> - 
          <span className='blue-color-span'> Синие: </span>
        </label>
        <input
          ref={redBlueInteractionPowerRef}
          type='number'
          defaultValue={interactionPowers['red']['blue']}>
        </input>
        <br/><br/>

        <hr/>

        <button className='btn' onClick={startProteinFolding}>Старт</button>
        <button className='btn' onClick={pauseProteinFolding}>Пауза</button>
        <button className='btn' onClick={generateNewProtein}>Новый эксперимент</button>

        <br/>

        <p>Текущая энергия взаимодействия: {energy.toFixed(2)}</p>
        <p>Минимальная энергия взаимодействия: {minEnergy.toFixed(2)}</p>

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
                fill={getParticleColor(particle)}
                onClick={changeParticleColor}
                draggable
                onDragStart={handleDragStart}
                onDragMove={handleParticleDragMove}
              />
            ))}
            <Line
              points={getParticlesJoinLine()}
              stroke={'black'}
              strokeWidth={4}
            />
          </Layer>
        </Stage>
      </div>
      
    </>
  );
}

export default ProteinFoldingStage;
