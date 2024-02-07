import { useState, useEffect } from 'react';

import {
  ROTATION_DIRECTIONS,
  ROTATION_TIMEOUT
} from '../../constants/RotationControl';

import {
  haveIntersections,
  chainIsOutOfStageBoundaries
} from '../../services/ParticlesValidator';

import { rotateParticles } from '../../services/ParticlesRotator';
import { calculateTotalEnergy } from '../../services/EnergyCalculator';

import styles from './Control.module.css';

export function RotationControl({
  particles,
  setParticles,
  pivotParticleId,
  particleRadius,
  isSplitted,
  energies,
  setEnergies,
  powers
}) {
  const [rotationStarted, setRotationStarted] = useState(false);
  const [rotationDirection, setRotationDirection] = useState(null);

  function handleParticlesRotation() {
    let rotatedParticles = rotateParticles(
      particles, pivotParticleId,
      rotationDirection, isSplitted
    );

    if (!haveIntersections(rotatedParticles, particleRadius, isSplitted) &&
      !chainIsOutOfStageBoundaries(rotatedParticles, particleRadius)
    ) {
      setParticles(rotatedParticles);

      let energy = calculateTotalEnergy(rotatedParticles, powers);

      setEnergies({
        initial: energy, current: energy, minimal: energy
      });
    }
  }

  useEffect(() => {
    if (rotationStarted) {
      setTimeout(() => {
        handleParticlesRotation();
      }, ROTATION_TIMEOUT);
    }
  });

  const buttons = ROTATION_DIRECTIONS.map((direction) => (
    <button
      key={direction.key}
      className={styles['button']}
      onMouseDown={() => {
        setRotationDirection(direction.key);
        setRotationStarted(true);
      }}
      onMouseUp={() => setRotationStarted(false)}
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
