import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './MyProfile.module.scss';

export default function MyProfile() {
    const { currentUser } = useContext(AuthContext);

    return (
        <main className="main-wrapper">
            <section className={styles.profileCard}>
                <h2>Welcome,<span className={styles.userStyle}>{currentUser?.username}</span>!</h2>
                <p>This is your personal profile panel.</p>

                <div className={styles.profileGrid}>
                    <div className={styles.profileItem}>
                        <h4>Height:</h4>
                        <p>–</p>
                    </div>
                    <div className={styles.profileItem}>
                        <h4>Weight:</h4>
                        <p>–</p>
                    </div>
                    <div className={styles.profileItem}>
                        <h4>Gender:</h4>
                        <p>–</p>
                    </div>
                    <div className={styles.profileItem}>
                        <h4>Activity level:</h4>
                        <p>–</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
