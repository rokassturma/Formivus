import styles from './Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={styles.spinnerMain}>
        <div className={styles.spinner}></div>
    </div>
  );
}
