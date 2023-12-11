import {
  ROTATION_DIRECTIONS,
  MOVEMENT_DIRECTIONS
} from '../Constants';

export function RotationButtons({
  setRotationStarted,
  setRotationDirection
}) {
  return (
    <>{ROTATION_DIRECTIONS.map((direction) => (
        <button
          className='control-btn'
          onMouseDown={() => {
            setRotationDirection(direction.direction);
            setRotationStarted(true);
          }}
          onMouseUp={() => {
            setRotationStarted(false);
          }}
        >
          {direction.unicodeSymbol}
        </button>
    ))}
    </>
  );
}

export function MovementButtons({
  setMovementStarted,
  setMovementDirection
}) {
  return (
    <>{MOVEMENT_DIRECTIONS.map((direction) => (
      <button
        className='control-btn'
        onMouseDown={() => {
          setMovementDirection(direction.direction);
          setMovementStarted(true);
        }}
        onMouseUp={() => {
          setMovementStarted(false);
        }}
      >
        {direction.unicodeSymbol}
      </button>
    ))}
    </>
  );
}
