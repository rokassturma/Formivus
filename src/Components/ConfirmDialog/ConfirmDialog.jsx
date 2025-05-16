import styles from './ConfirmDialog.module.scss';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button className={styles.confirmBtn} onClick={onConfirm}>Yes</button>
                    <button className={styles.confirmBtn} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
