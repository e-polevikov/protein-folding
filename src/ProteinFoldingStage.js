import {useState, useEffect, useRef} from 'react';
import {Stage, Layer, Circle} from 'react-konva';

import {
  stageWidth, stageHeight,
  particlesMoveDelayMs,
  initialInteractionPowers,
  initialMoveP,
  initialNumberOfParticles,
  initialParticleRadius,
} from './Constants';

import {
  generateParticles,
  moveParticlesRandomly,
  calculateTotalEnergy,
  generateParticleColor
} from './Helpers';

function ProteinFoldingStage() {
  const [numParticles, setNumParticles] = useState(initialNumberOfParticles);
  const [particleRadius, setParticleRadius] = useState(initialParticleRadius);
  const [interactionPowers, setInteractionPowers] = useState(initialInteractionPowers);
  const [moveP, setMoveP] = useState(initialMoveP);

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);
  const movePRef = useRef(null);

  const redInteractionPowerRef = useRef(null);
  const greenInteractionPowerRef = useRef(null);
  const blueInteractionPowerRef = useRef(null);
  const redGreenInteractionPowerRef = useRef(null);
  const redBlueInteractionPowerRef = useRef(null);
  const greenBlueInteractionPowerRef = useRef(null);

  const [particles, setParticles] = useState(generateParticles(
    numParticles, particleRadius
  ));

  const [energy, setEnergy] = useState(calculateTotalEnergy(
    particles, interactionPowers
  ));

  const [minEnergy, setMinEnergy] = useState(energy);

  const [foldingStarted, setFoldingStarted] = useState(false);

  function startProteinFolding() {
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

  function handleParticleDragMove(event) {
    let handledParticle = event.target;

    let newParticles = particles.map((particle) => {
      if (particle.id === handledParticle.id()) {
        particle.x = handledParticle.x();
        particle.y = handledParticle.y();
      }

      return particle;
    });

    let energy = calculateTotalEnergy(newParticles, interactionPowers);

    setParticles(newParticles);
    setEnergy(energy);
    setMinEnergy(Math.min(energy, minEnergy));
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

      let newParticles = generateParticles(currentNumParticles, currentParticleRadius);
      let energy = calculateTotalEnergy(newParticles, currentInteractionPowers);

      setParticles(newParticles);
      setEnergy(energy);
      setMinEnergy(energy);
    }
  }

  useEffect(() => {
    if (foldingStarted) {
      setTimeout(() => {
        let movedParticles = moveParticlesRandomly(
          particles, particleRadius,
          moveP, interactionPowers
        );

        let currentEnergy = calculateTotalEnergy(movedParticles, interactionPowers);
  
        setParticles(movedParticles);
        setEnergy(currentEnergy);
        setMinEnergy(Math.min(minEnergy, currentEnergy));
      }, particlesMoveDelayMs);
    }
  });

  return (
    <>
      <h1>Задача "Сворачвание белка" для конкурса КИО</h1>

      <div className='protein-folding-params'>
        <h2>Параметры эксперимента:</h2>
        
        <label>Количество частиц: </label>
        <input
          ref={numParticlesRef}
          type='number'
          defaultValue={initialNumberOfParticles}
        />

        <br/>
        <br/>

        <label>Радиус частицы: </label>
        <input
          ref={particleRadiusRef}
          type='number'
          defaultValue={initialParticleRadius}
        />

        <br/>
        <br/>

        <label>P: </label>
        <input
          ref={movePRef}
          type='number'
          defaultValue={moveP}
        />

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
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {particles.map((particle) => (
              <Circle
                key={particle.id}
                id={particle.id}
                x={particle.x}
                y={particle.y}
                radius={particleRadius}
                fill={particle.color}
                onClick={changeParticleColor}
                draggable
                onDragMove={handleParticleDragMove}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      
    </>
  );
}

export default ProteinFoldingStage;