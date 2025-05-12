import styles from './Register.module.scss';

export default function NotificationMessage({ message, type }) {
    if (!message) return null;

    return (
        <div className={`${styles.message} ${styles[type]}`}>
            {message}
        </div>
    );
}