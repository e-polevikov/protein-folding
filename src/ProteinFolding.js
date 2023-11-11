import {useState, useRef, useEffect} from 'react';
import {Stage, Layer, Circle} from 'react-konva';

import {
  stageWidth, stageHeight,
  initialParticleRadius,
  initialNumberOfParticles,
  initialP,
  maxAttemptsToMoveParticleRandomly,
  iterationDelayMs,
  initialInteractionPowers
} from './Constants.js';

import {
  calculateTotalEnergy,
  isValidParticlePosition,
  generateParticles,
  getRandomColor
} from './Helpers.js';


function ProteinFolding() {
  const [particleRadius, setParticleRadius] = useState(initialParticleRadius);
  const [particlesCount, setParticlesCount] = useState(initialNumberOfParticles);
  const [particles, setParticles] = useState(generateParticles(particlesCount, particleRadius));
  const [interactionPowers, setInteractionPowers] = useState(initialInteractionPowers);
  
  const [p, setP] = useState(initialP);

  const [totalEnergy, setTotalEnergy] = useState(calculateTotalEnergy(particles, interactionPowers));
  const [minTotalEnergy, setMinTotalEnergy] = useState(0.0);
  const intervalRef = useRef(null);

  function startProteinFolding() {
    intervalRef.current = setInterval(() => {
      moveParticlesRandomly();
    }, iterationDelayMs);
  }

  function pauseProteinFolding() {
    clearInterval(intervalRef.current);
  }

  // Generates new experiment configuration randomly
  // taking parameter values into account
  function updateParticles() {
    clearInterval(intervalRef.current);

    let currentCircleRadius = Number(document.getElementById('particle-radius').value);
    let currentCirclesCount = Number(document.getElementById('particles-count').value);
    let currentP = Number(document.getElementById('particle-move-probability').value);

    setParticleRadius(currentCircleRadius);
    setParticlesCount(currentCirclesCount);
    setP(currentP);

    let redGreenInteractionPower = Number(document.getElementById('red-green').value);
    let blueGreenInteractionPower = Number(document.getElementById('blue-green').value);
    let redBlueInteractionPower = Number(document.getElementById('red-blue').value);

    let currentInteractionPowers = {
      'red': {
        'red': 1,
        'green': redGreenInteractionPower,
        'blue': redBlueInteractionPower},
      'green': {
        'red': redGreenInteractionPower,
        'green': 1,
        'blue': blueGreenInteractionPower},
      'blue': {
        'red': redBlueInteractionPower,
        'green': blueGreenInteractionPower,
        'blue': 1
      }
    };

    setInteractionPowers(currentInteractionPowers);
    setParticles(generateParticles(currentCirclesCount, currentCircleRadius));
    setTotalEnergy(calculateTotalEnergy(particles, currentInteractionPowers));
    setMinTotalEnergy(0.0);
  }

  function moveParticlesRandomly() {
    let particlesCopy = JSON.parse(JSON.stringify(particles));

    particlesCopy.map((particle) => {
      let particleIsMoved = false;
      let numAttempsToMove = 0;
      let currentX = particle.x;
      let currentY = particle.y;

      while (!particleIsMoved && numAttempsToMove < maxAttemptsToMoveParticleRandomly) {
        let randX = particle.x + (Math.random() - 0.5) * 10;
        let randY = particle.y + (Math.random() - 0.5) * 10;
        let currentParticleId = Number(particle.id);

        if (isValidParticlePosition(particlesCopy, randX, randY, currentParticleId, particleRadius)) {
          particle.x = randX;
          particle.y = randY;
          particleIsMoved = true;
        }

        numAttempsToMove += 1;
      }
      
      // If total energy increases after a particle is moved, the particle
      // remains on its position with the probability equal to 'p'. Therefore,
      // 1 - p is the probability that the particle will be 'moved back' to its
      // initial position.

      if (calculateTotalEnergy(particlesCopy, interactionPowers) > calculateTotalEnergy(particles, interactionPowers)
          && Math.random() < 1 - p
      ) {
        particle.x = currentX;
        particle.y = currentY;
      }
      
      return particle;
    });

    for (let i = 0; i < particles.length; i++) {
      particles[i] = particlesCopy[i];
    }

    setParticles(particles);
    setTotalEnergy(calculateTotalEnergy(particles, interactionPowers));
  };

  function handleParticleDragStart(event) {
    /*
    let handledParticle = event.target;

    setParticles(
      particles.map((particle) => {
        if (particle.id === handledParticle.id()) {
          particle.xOnDragStart = particle.x;
          particle.yOnDragStart = particle.y;
        }

        return particle;
      })
    );
    */
  }

  function handleParticleDragEnd(event) {
    let handledParticle = event.target;

    setParticles(
      particles.map((particle) => {
        if (particle.id === handledParticle.id()) {
          if (isValidParticlePosition(
              particles,
              handledParticle.x(),
              handledParticle.y(),
              particle.id,
              particleRadius
            )
          ) {
            particle.x = handledParticle.x();
            particle.y = handledParticle.y();
          } else {
            // particle.x = handledParticle.xOnDragStart();
            // particle.y = handledParticle.yOnDragStart();
          }
        }

        return particle;
      })
    ); 
  }

  function changeParticleColor(event) {
    let handledParticle = event.target;

    setParticles(
      particles.map((particle) => {
        if (particle.id === handledParticle.id()) {
          particle.color = getRandomColor(particle.color);
        }

        return particle;
      })
    );
  }

  useEffect(() => {
    setTotalEnergy(calculateTotalEnergy(particles, interactionPowers));
    
    if (totalEnergy < minTotalEnergy) {
      setMinTotalEnergy(totalEnergy);
    }
  
  }, [particles, totalEnergy, minTotalEnergy, interactionPowers]);

  return (
    <>
      <h1>Задача "Сворачивание белка" для конкурса КИО</h1>
      
      <div className='params-container'>
        <p>Параметры эксперимента:</p>

        <label>Радиус частицы: </label>
        <input id='particle-radius' type='number' defaultValue={initialParticleRadius}/>
        <br/><br/>

        <label>Количество частиц: </label>
        <input id='particles-count' type='number' defaultValue={initialNumberOfParticles}/>
        <br/><br/>

        <label>P: </label>
        <input id='particle-move-probability' type='number' defaultValue={initialP}></input>
        <br/><br/>

        <hr/>

        <p>Силы взаимодействия: </p>

        <label>Красная - Зеленая: </label>
        <input id='red-green' type='number' defaultValue={1.0}></input>
        <br/><br/>

        <label>Синяя - Зеленая: </label>
        <input id='blue-green' type='number' defaultValue={1.0}></input>
        <br/><br/>

        <label>Красная - Синяя: </label>
        <input id='red-blue' type='number' defaultValue={1.0}></input>
        <br/><br/>

        <hr/>

        <button onClick={updateParticles}>Обновить</button>
        <button onClick={startProteinFolding}>Старт</button>
        <button onClick={pauseProteinFolding}>Пауза</button>

        <br/>

        <p>Минимальная энергия взаимодействия: {minTotalEnergy.toFixed(2)}</p>
        <p>Текущая энергия взаимодействия: {totalEnergy.toFixed(2)}</p>
      </div> 

      <div className='protein-stage'>
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
                draggable
                onDragStart={handleParticleDragStart}
                onDragEnd={handleParticleDragEnd}
                onClick={changeParticleColor}
              />
            ))}
          </Layer>
        </Stage>
      </div>

    </>
  );
}

export default ProteinFolding;
