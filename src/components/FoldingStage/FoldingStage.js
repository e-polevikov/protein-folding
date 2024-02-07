import { useState } from 'react';
import { Stage, Layer } from 'react-konva';

import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants/FoldingStage';

import { ParticlesChain } from '../ParticlesChain/ParticlesChain';
import { RotationControl } from '../Controls/RotationControl';
import { MovementControl } from '../Controls/MovementControl';
import { EnergiesTable } from '../EnergiesTable/EnergiesTable';
import { PowersTable } from '../PowersTable/PowersTable';
import { ParamsInput } from '../ParamsInput/ParamsInput';
import { MoveAllCheckbox } from '../MoveAllCheckbox/MoveAllCheckbox';

import { calculateTotalEnergy } from '../../services/EnergyCalculator';

import styles from './FoldingStage.module.css';

export function FoldingStage({ settings, isConstructor }) {
  const [numParticles, setNumParticles] = useState(settings.particles.length);
  const [particleRadius, setParticleRadius] = useState(settings.particleRadius);

  const [pivotParticleId, setPivotParticleId] = useState(
    Math.floor(settings.particles.length / (settings.isSplitted ? 4 : 2))
  );

  const [isSplitted, setIsSplitted] = useState(settings.isSplitted);
  const [moveAll, setMoveAll] = useState(!settings.isSplitted);

  const [particles, setParticles] = useState(settings.particles);

  let energy = calculateTotalEnergy(settings.particles, settings.powers);

  const [energies, setEnergies] = useState({
    'initial': energy,
    'current': energy,
    'minimal': energy
  });

  const [powers, setPowers] = useState(settings.powers);

  return (
    <div className={styles['folding-stage']}>
      <div className={styles['params-panel']}>
        <PowersTable powers={powers}/>
        <EnergiesTable energies={energies}/>
        { isSplitted ?
          <MoveAllCheckbox setMoveAll={setMoveAll} /> :
          <></>
        }
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
            moveAll={moveAll}
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
              setEnergies={setEnergies}
              powers={powers}
              isConstructor={isConstructor}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
