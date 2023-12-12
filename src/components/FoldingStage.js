import { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';

import {
  STAGE_WIDTH, STAGE_HEIGHT,
  INITIAL_NUMBER_OF_PARTICLES,
  INITIAL_PARTICLE_RADIUS,
  INTERACTION_POWERS,
  PARTICLES_RERENDERING_TIMEOUT
} from '../Constants';

import {
  ParticlesChain
} from './ParticlesChain';

import {
  RotationButtons,
  MovementButtons
} from './ControlButtons';

import {
  InteractionPowersInput
} from './InteractionPowersInput';

import {
  ParamsInput
} from './ParamsInput';

import {
  generateParticles
} from '../processors/ParticlesGenerator';

import {
  rotateParticles,
  moveParticles,
  haveIntersections,
  chainIsOutOfStageBoundaries
} from '../processors/ParticlesController';

import {
  calculateTotalEnergy
} from '../processors/EnergyCalculator';

function FoldingStage() {
  const [numParticles, setNumParticles] = useState(INITIAL_NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(INITIAL_PARTICLE_RADIUS);

  const [pivotParticleId, setPivotParticleId] = useState(
    Math.floor(INITIAL_NUMBER_OF_PARTICLES / 2)
  );

  const [particles, setParticles] = useState(
    generateParticles(numParticles, particleRadius)
  );

  const [isSplitted, setIsSplitted] = useState(false);

  /* Particles rotation */

  const [rotationStarted, setRotationStarted] = useState(false);
  const [rotationDirection, setRotationDirection] = useState(null);

  function handleParticleRotation() {
    let rotatedParticles = rotateParticles(
      particles, pivotParticleId,
      rotationDirection, isSplitted
    );

    if (!haveIntersections(rotatedParticles, particleRadius, isSplitted) &&
      !chainIsOutOfStageBoundaries(rotatedParticles, particleRadius)
    ) {
      setParticles(rotatedParticles);

      let currEnergy = calculateTotalEnergy(
        rotatedParticles, interactionPowers
      );

      setCurrentEnergy(currEnergy);
      setMinimalEnergy(Math.min(currEnergy, minimalEnergy));

    }
  }

  useEffect(() => {
    if (rotationStarted) {
      setTimeout(() => {
        handleParticleRotation();
      }, PARTICLES_RERENDERING_TIMEOUT);
    }
  });

  /* *** */

  /* Particles movement */

  const [movementStarted, setMovementStarted] = useState(false);
  const [movementDirection, setMovementDirection] = useState(null);

  function handleParticlesMovement() {
    let movedParticles = moveParticles(
      particles, movementDirection,
      pivotParticleId, isSplitted
    );

    if (!haveIntersections(movedParticles, particleRadius, isSplitted) &&
      !chainIsOutOfStageBoundaries(movedParticles, particleRadius)
    ) {
      setParticles(movedParticles);

      let currEnergy = calculateTotalEnergy(
        movedParticles, interactionPowers
      );

      setCurrentEnergy(currEnergy);
      setMinimalEnergy(Math.min(currEnergy, minimalEnergy));
    }
  }

  useEffect(() => {
    if (movementStarted) {
      setTimeout(() => {
        handleParticlesMovement();
      }, PARTICLES_RERENDERING_TIMEOUT);
    }
  });

  /* *** */

  /* Particles energy, colors, and interaction powers */

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

  function updateEnergies(newEnergyValue) {
    setInitialEnergy(newEnergyValue);
    setCurrentEnergy(newEnergyValue);
    setMinimalEnergy(newEnergyValue);
  }

  function updateInteractionPowers(newInteractionPowers) {
    setInteractionPowers(newInteractionPowers);

    let currEnergy = calculateTotalEnergy(particles, newInteractionPowers);
    updateEnergies(currEnergy);
  }

  function changeParticleColor(particleId) {
    let newParticles = particles.map((particle) => {
      if (particle.id != particleId) {
        return particle;
      }

      switch (particle.color) {
        case 'red':
          particle.color = 'blue';
          break;
        case 'blue':
          particle.color = 'green';
          break;
        case 'green':
          particle.color = 'red'
          break;
      }

      return particle;
    });

    setParticles(newParticles);

    let currEnergy = calculateTotalEnergy(
      newParticles, interactionPowers
    );

    updateEnergies(currEnergy);
  }

  /* *** */

  /* Generating new particles */

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);
  const isSplittedRef = useRef(null);

  function generateNewParticles() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);
    let newPivotParticleId = Math.floor(currentNumParticles / 2);

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setPivotParticleId(newPivotParticleId);
    setIsSplitted(isSplittedRef.current.checked);

    let newParticles = generateParticles(
      currentNumParticles,
      currentParticleRadius
    );

    setParticles(newParticles);

    let currEnergy = calculateTotalEnergy(newParticles, interactionPowers);
    updateEnergies(currEnergy);
  }

  /* *** */

  return (
    <>
      <h1 className='title'>Задача «Сворачивание белка»</h1>

      <div className='folding-stage-container'>
        <div className='params-panel'>
          <h3>Значение энергии:</h3>

          Начальное: {initialEnergy.toFixed(3)}
          <br />
          Текущее: {currentEnergy.toFixed(3)}
          <br />
          Минимальное: {minimalEnergy.toFixed(3)}

          <h3>Силы взаимодействия:</h3>

          <InteractionPowersInput
            setInteractionPowers={(newValues) => updateInteractionPowers(newValues)}
          />

          <h3>Параметры эксперимента:</h3>

          <ParamsInput
            numParticlesRef={numParticlesRef}
            particleRadiusRef={particleRadiusRef}
            isSplittedRef={isSplittedRef}
            generateNewParticles={generateNewParticles}
          />
        </div>

        <div className='folding-stage'>
          <div className='control-buttons'>
            <RotationButtons
              setRotationStarted={setRotationStarted}
              setRotationDirection={setRotationDirection}
            />
            <MovementButtons
              setMovementStarted={setMovementStarted}
              setMovementDirection={setMovementDirection}
            />
          </div>

          <div className='stage'>
            <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
              <Layer>
                <ParticlesChain
                  particles={particles}
                  particleRadius={particleRadius}
                  pivotParticleId={pivotParticleId}
                  isSplitted={isSplitted}
                  setPivotParticle={(particleId) => setPivotParticleId(particleId)}
                  changeParticleColor={(particleId) => changeParticleColor(particleId)}
                />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </>
  );
}

export default FoldingStage;
