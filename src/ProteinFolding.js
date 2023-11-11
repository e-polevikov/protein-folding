import { useState, useRef, useEffect } from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const stageWidth = window.innerWidth * 0.7;
const stageHeight = window.innerHeight * 0.8;

const initialParticleRadius = 20;
const initialNumberOfParticles = 15;

// Probability to move a particle if total energy
// increases after the particle is moved randomly
const initialP = 0.1;
const maxAttemptsToMoveParticleRandomly = 10;

// Delay between rerendering of protein particles
const iterationDelayMs = 10;


function calculateParticleEnergy(particle1, particle2) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);
  let totalDist = Math.sqrt(xDistance + yDistance);

  let energy = 1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6);
  energy = Math.pow(10, 10) * 4.0 * energy;

  return energy;
}

function calculateTotalEnergy(particles) {
  let totalEnergy = 0.0;

  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      totalEnergy += calculateParticleEnergy(particles[i], particles[j]);
    }
  }

  return totalEnergy;
}

function isValidParticlePosition(particles, randX, randY, particleId, particleRadius) {
  let particleIntersectsExisting = false;

  for (let i = 0; i < particles.length; i++) {
    if (i === particleId) {
      continue;
    }

    let xDistance = Math.pow((particles[i].x - randX), 2);
    let yDistance = Math.pow((particles[i].y - randY), 2);

    if (xDistance + yDistance <= 4.0 * Math.pow(particleRadius, 2)) {
      particleIntersectsExisting = true;
      break;
    }
  }

  let particleIntersectsStageBoudaries = false;

  if (randX - particleRadius < 0.0 || randX + particleRadius > stageWidth) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius > stageHeight) {
    particleIntersectsStageBoudaries = true;
  }

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}

function generateParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  while (numOfGeneratedParticles < numOfParticles) {
    let randX = Math.random() * stageWidth;
    let randY = Math.random() * stageHeight;
    let generatedCircleId = numOfGeneratedParticles + 1;

    if (isValidParticlePosition(particles, randX, randY, generatedCircleId, particleRadius)) {
      particles.push({ 
        id: numOfGeneratedParticles.toString(), 
        x: randX, y: randY, color: 'red'
      });
      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}

function ProteinFolding() {
  const [particleRadius, setParticleRadius] = useState(initialParticleRadius);
  const [particlesCount, setParticlesCount] = useState(initialNumberOfParticles);
  const [particles, setParticles] = useState(generateParticles(particlesCount, particleRadius));
  
  const [p, setP] = useState(initialP);

  const [totalEnergy, setTotalEnergy] = useState(calculateTotalEnergy(particles));
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

  function generateNewParticles() {
    clearInterval(intervalRef.current);

    let currentCircleRadius = document.getElementById('particle-radius').value;
    let currentCirclesCount = document.getElementById('particles-count').value;
    let currentP = document.getElementById('particle-move-probability').value;

    setParticleRadius(currentCircleRadius);
    setParticlesCount(currentCirclesCount);
    setP(currentP);

    setParticles(generateParticles(currentCirclesCount, currentCircleRadius));
    setTotalEnergy(calculateTotalEnergy(particles));
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

      if (calculateTotalEnergy(particlesCopy) > calculateTotalEnergy(particles)
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
    setTotalEnergy(calculateTotalEnergy(particles));
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

  useEffect(() => {
    setTotalEnergy(calculateTotalEnergy(particles));
    
    if (totalEnergy < minTotalEnergy) {
      setMinTotalEnergy(totalEnergy);
    }
  
  }, [particles, totalEnergy, minTotalEnergy]);

  return (
    <>
      <h1>Задача "Сворачивание белка" для конкурса КИО</h1>
      
      <div className='params-container'>
        <label>Радиус частицы: </label>
        <input id='particle-radius' type='number' defaultValue={initialParticleRadius}/>
        <br/><br/>

        <label>Количество частиц: </label>
        <input id='particles-count' type='number' defaultValue={initialNumberOfParticles}/>
        <br/><br/>

        <label>P: </label>
        <input id='particle-move-probability' type='number' defaultValue={initialP}></input>
        <br/><br/>

        <button onClick={generateNewParticles}>Обновить</button>

        <br/>
        <hr></hr>

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
              />
            ))}
          </Layer>
        </Stage>
      </div>

    </>
  );
}

export default ProteinFolding;
