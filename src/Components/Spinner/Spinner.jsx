import styles from './Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={styles.spinnerMain}>
      Loading...
        <div className={styles.spinner}></div>
    </div>
  );
}
