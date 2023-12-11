import { useRef } from 'react';

import {
  INTERACTION_POWERS
} from '../Constants';

export function InteractionPowersInput({ setInteractionPowers }) {
  const redInteractionPowerRef = useRef(null);
  const greenInteractionPowerRef = useRef(null);
  const blueInteractionPowerRef = useRef(null);
  const redGreenInteractionPowerRef = useRef(null);
  const redBlueInteractionPowerRef = useRef(null);
  const greenBlueInteractionPowerRef = useRef(null);

  function getCurrentInteractionPowers() {
    return {
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
  }

  function updateInteractionPowers() {
    let currentInteractionPowers = getCurrentInteractionPowers();
    setInteractionPowers(currentInteractionPowers);
  }

  return (
    <>
      <label>
        <span className='red-color-span'>КК </span>
      </label>
      <input
        ref={redInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['red']['red']}
        onChange={updateInteractionPowers}>
      </input>
      <br />

      <label>
        <span className='green-color-span'>ЗЗ </span>
      </label>
      <input
        ref={greenInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['green']['green']}
        onChange={updateInteractionPowers}>
      </input>
      <br />

      <label>
        <span className='blue-color-span'>СС </span>
      </label>
      <input
        ref={blueInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['blue']['blue']}
        onChange={updateInteractionPowers}>
      </input>
      <br />

      <label>
        <span className='red-color-span'>К</span>
        <span className='green-color-span'>З </span>
      </label>
      <input
        ref={redGreenInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['red']['green']}
        onChange={updateInteractionPowers}>
      </input>
      <br />

      <label>
        <span className='blue-color-span'>С</span>
        <span className='green-color-span'>З </span>
      </label>
      <input
        ref={greenBlueInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['blue']['green']}
        onChange={updateInteractionPowers}>
      </input>
      <br />

      <label>
        <span className='red-color-span'>К</span>
        <span className='blue-color-span'>С </span>
      </label>
      <input
        ref={redBlueInteractionPowerRef}
        type='number'
        defaultValue={INTERACTION_POWERS['red']['blue']}
        onChange={updateInteractionPowers}>
      </input>
    </>
  );
}
