import styles from './MoveAllCheckbox.module.css';

export function MoveAllCheckbox({ setMoveAll }) {
  return (
    <div className={styles['checkbox-container']}>
      <label>Перемещать все частицы: </label>
      <input
        type='checkbox'
        onChange={(event) => setMoveAll(event.target.checked)}
      />
    </div>
  );
}
