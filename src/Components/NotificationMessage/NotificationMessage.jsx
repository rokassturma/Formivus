import styles from './NotificationMessage.module.scss';

export default function NotificationMessage({ message, type, fading }) {
  if (!message) return null;

  const baseClass = type === 'success'
    ? styles.successMessage
    : styles.errorMessage;

  const fadeClass = fading ? styles.fadeOut : '';

  return (
    <div className={`${baseClass} ${fadeClass}`}>
      {message}
    </div>
  );
}
