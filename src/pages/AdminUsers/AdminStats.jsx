import styles from './AdminStats.module.scss';

export default function AdminStats({ profiles }) {
    const total = profiles.length;
    const adminCount = profiles.filter(p => p.role === 'admin').length;
    const userCount = total - adminCount;

    return (
        <div className={styles.statsBox}>
            <h3>Statistics</h3>
            <ul>
                <li><strong>Total users:</strong> {total}</li>
                <li><strong>Admins:</strong> {adminCount}</li>
                <li><strong>Regular users:</strong> {userCount}</li>
            </ul>
        </div>
    );
}
