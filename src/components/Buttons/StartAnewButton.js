import styles from './Buttons.module.css';

export function StartAnewButton() {
  return (
    <div>
      <button
        className={styles['button']}
      >
        Начать заново
      </button>
    </div>
  );
}
