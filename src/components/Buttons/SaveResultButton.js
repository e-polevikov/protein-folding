import styles from './Buttons.module.css';

export function SaveResultButton() {
  return (
    <>
      <button
        className={styles['button']}
      >
        Сохранить результат
      </button>
    </>
  );
}
