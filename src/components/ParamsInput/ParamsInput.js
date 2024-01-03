import { useRef } from 'react';

import { PowersInput } from '../PowersInput/PowersInput';
import { ChainParamsInput } from '../ChainParamsInput/ChainParamsInput';

import { calculateTotalEnergy } from '../../services/EnergyCalculator';
import { generateParticles } from '../../services/ParticlesGenerator';

import styles from '../ParamsInput/ParamsInput.module.css';

export function ParamsInput({
  powers,
  setPowers,
  setEnergies,
  particles,
  setParticles,
  setNumParticles,
  setParticleRadius,
  setIsSplitted,
  setPivotParticleId,
  particleRadius,
  isSplitted,
  settings
}) {
  const numParticlesRef = useRef(null);
  const particleRadiusRef = useRef(null);
  const isSplittedRef = useRef(null);
  const zigzagChainRef = useRef(null);

  function generateNewParticlesChain() {
    let currentNumParticles = Number(numParticlesRef.current.value);
    let currentParticleRadius = Number(particleRadiusRef.current.value);
    let currentIsSplitted = isSplittedRef.current.checked;
    let zigzagChain = zigzagChainRef.current.checked;
    let newPivotParticleId = Math.floor(currentNumParticles / (currentIsSplitted ? 4 : 2));

    setNumParticles(currentNumParticles);
    setParticleRadius(currentParticleRadius);
    setIsSplitted(currentIsSplitted);
    setPivotParticleId(newPivotParticleId);

    let newParticles = generateParticles(
      currentNumParticles,
      currentParticleRadius,
      currentIsSplitted,
      0.5, zigzagChain
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
    let params = {
      'particles': particles,
      'particleRadius': particleRadius,
      'isSplitted': isSplitted,
      'powers': powers
    }

    let paramsJSON = JSON.stringify(params);
    alert(paramsJSON);
  }

  return (
    <>
      <h3 style={{textAlign: "center"}}>Параметры эксперимента</h3>
      <PowersInput
        setPowers={setPowers}
        setEnergies={setEnergies}
        particles={particles}
        settings={settings}
      />
      <ChainParamsInput
        numParticlesRef={numParticlesRef}
        particleRadiusRef={particleRadiusRef}
        isSplittedRef={isSplittedRef}
        zigzagChainRef={zigzagChainRef}
        settings={settings}
      />
      <button
        className={styles['button']}
        onClick={generateNewParticlesChain}
      >
        Сгенерировать новую цепь
      </button>
      <button
        className={styles['button']}
        onClick={displayParams}
      >
        Показать параметры в виде JSON
      </button>
    </>
  );
}
