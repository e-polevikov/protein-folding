

export function RotationButton({
  label,
  onRotationStart,
  onRotationEnd
}) {
  return (
    <button
      className='rotate-btn'
      onMouseDown={onRotationStart}
      onMouseUp={onRotationEnd}
    >
      {label}
    </button>
  );
}