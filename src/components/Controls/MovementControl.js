import { useState, useEffect } from 'react';

import {
  MOVEMENT_DIRECTIONS,
  MOVE_TIMEOUT
} from '../../constants/MovementControl';

import {
  haveIntersections,
  chainIsOutOfStageBoundaries
} from '../../services/ParticlesValidator';

import { moveParticles } from '../../services/ParticlesMover';
import { calculateTotalEnergy } from '../../services/EnergyCalculator';

import styles from './Control.module.css';

export function MovementControl({
  particles,
  setParticles,
  pivotParticleId,
  particleRadius,
  isSplitted,
  moveAll,
  energies,
  setEnergies,
  powers
}) {
  const [movementStarted, setMovementStarted] = useState(false);
  const [movementDirection, setMovementDirection] = useState(null);

  function handleParticlesMovement() {
    let movedParticles = moveParticles(
      particles, movementDirection,
      pivotParticleId, !moveAll
    );

    if (!haveIntersections(movedParticles, particleRadius, isSplitted) &&
      !chainIsOutOfStageBoundaries(movedParticles, particleRadius)
    ) {
      setParticles(movedParticles);

      let energy = calculateTotalEnergy(movedParticles, powers);

      setEnergies({
        'initial': energies.initial,
        'current': energy,
        'minimal': Math.min(energy, energies.minimal)
      });
    }
  }

  useEffect(() => {
    if (movementStarted) {
      setTimeout(() => {
        handleParticlesMovement();
      }, MOVE_TIMEOUT);
    }
  });

  const buttons = MOVEMENT_DIRECTIONS.map((direction) => (
    <button
      key={direction.key}
      className={styles['button']}
      onMouseDown={() => {
        setMovementDirection(direction.key);
        setMovementStarted(true);
      }}
      onMouseUp={() => setMovementStarted(false)}
    >
      {direction.arrow}
    </button>
  ));

  return (
    <>
      {buttons}
    </>
  );
}
