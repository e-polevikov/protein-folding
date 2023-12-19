import { useState, useRef } from 'react';
import { Stage, Layer } from 'react-konva';

import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  NUMBER_OF_PARTICLES,
  PARTICLE_RADIUS,
  IS_SPLITTED,
  INTERACTION_POWERS
} from '../../constants/FoldingStage';

import { ParticlesChain } from '../ParticlesChain/ParticlesChain';
import { RotationControl } from '../Controls/RotationControl';
import { MovementControl } from '../Controls/MovementControl';
import { EnergiesTable } from '../EnergiesTable/EnergiesTable';
import { PowersTable } from '../PowersTable/PowersTable';
import { PowersInput } from '../PowersInput/PowersInput';
import { ChainParamsInput } from '../ChainParamsInput/ChainParamsInput';

import { generateParticles } from '../../services/ParticlesGenerator';
import { calculateTotalEnergy } from '../../services/EnergyCalculator';

import styles from './FoldingStage.module.css';


export function FoldingStage() {
  const [numParticles, setNumParticles] = useState(NUMBER_OF_PARTICLES);
  const [particleRadius, setParticleRadius] = useState(PARTICLE_RADIUS);

  const [pivotParticleId, setPivotParticleId] = useState(
    Math.floor(NUMBER_OF_PARTICLES / (IS_SPLITTED ? 4 : 2))
  );

  const [isSplitted, setIsSplitted] = useState(IS_SPLITTED);

  const [particles, setParticles] = useState(generateParticles(
    numParticles, particleRadius, isSplitted
  ));

  let energy = calculateTotalEnergy(particles, INTERACTION_POWERS);
  const [energies, setEnergies] = useState({
    'initial': energy,
    'current': energy,
    'minimal': energy
  });

  const [powers, setPowers] = useState(INTERACTION_POWERS);

  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);
  const isSplittedRef = useRef(null);

  function generateNewParticlesChain() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);
    let currentIsSplitted = isSplittedRef.current.checked;
    let newPivotParticleId = Math.floor(currentNumParticles / (currentIsSplitted ? 4 : 2));

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setIsSplitted(currentIsSplitted);
    setPivotParticleId(newPivotParticleId);

    let newParticles = generateParticles(
      currentNumParticles,
      currentParticleRadius,
      currentIsSplitted
    );

    setParticles(newParticles);

    let energy = calculateTotalEnergy(newParticles, powers);  

    setEnergies({
      'initial': energy,
      'current': energy,
      'minimal': energy
    });
  }

  function displayParams() {
    let particlesColors = particles.map(particle => {
      return {
        'id': particle.id,
        'color': particle.color
      };
    });

    let params = {
      'particlesColors': particlesColors,
      'particleRadius': particleRadius,
      'isSplitted': isSplitted,
      'powers': powers
    }

    let paramsJSON = JSON.stringify(params);
    alert(paramsJSON);
  }

  return (
    <div className={styles['folding-stage']}>
      <div className={styles['params-panel']}>
        <PowersTable powers={powers}/>
        <EnergiesTable energies={energies}/>

        <h3 style={{textAlign: "center"}}>Параметры эксперимента</h3>
        <PowersInput
          setPowers={setPowers}
          setEnergies={setEnergies}
          particles={particles}
        />
        <ChainParamsInput
          numParticlesRef={numParticlesRef}
          particleRadiusRef={particleRadiusRef}
          isSplittedRef={isSplittedRef}
        />
        <button
          className={styles['new-chain-btn']}
          onClick={generateNewParticlesChain}
        >
          Сгенерировать новую цепь
        </button>
        <button
          className={styles['save-config-btn']}
          onClick={displayParams}
        >
          Показать параметры в виде JSON
        </button>
      </div>

      <div className={styles['stage']}>
        <div className={styles['controls-panel']}>
          <RotationControl
            particles={particles}
            setParticles={setParticles}
            pivotParticleId={pivotParticleId}
            particleRadius={particleRadius}
            isSplitted={isSplitted}
            energies={energies}
            setEnergies={setEnergies}
            powers={powers}
          />
          <MovementControl
            particles={particles}
            setParticles={setParticles}
            pivotParticleId={pivotParticleId}
            particleRadius={particleRadius}
            isSplitted={isSplitted}
            energies={energies}
            setEnergies={setEnergies}
            powers={powers}
          />
        </div>

        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer>
            <ParticlesChain
              particles={particles}
              setParticles={setParticles}
              pivotParticleId={pivotParticleId}
              setPivotParticleId={setPivotParticleId}
              isSplitted={isSplitted}
              particleRadius={particleRadius}
              energies={energies}
              setEnergies={setEnergies}
              powers={powers}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
