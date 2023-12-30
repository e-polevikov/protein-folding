import styles from './Buttons.module.css';

export function SaveResultButton() {
  return (
    <div>
      <button
        className={styles['button']}
      >
        Сохранить результат
      </button>
    </div>
  );
}
