import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './MyProfile.module.scss';
import axios from 'axios';
import ProfileForm from '../../Components/ProfileForm/ProfileForm';


export default function MyProfile() {

    const { currentUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    const getProfile = () => {
        axios.get('http://localhost:5000/api/profile', { withCredentials: true })
            .then(res => setProfile(res.data))
            .catch(err => setError(err.response?.data?.message || 'Failed to load profile.'));
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <main className={styles.profileWrapper}>
            <section className={styles.left}>
                <div className={styles.profileCard}>
                    <h2>
                        Welcome, <span className={styles.userStyle}>{currentUser?.username}</span>!
                    </h2>
                    <p>This is your personal profile panel.</p>

                    {error && <p className={styles.error}>{error}</p>}

                    {profile ? (
                        <div className={styles.profileGrid}>
                            <div className={styles.profileItem}>
                                <h4>Age:</h4>
                                <p>{profile.age} yrs</p>
                            </div>
                            <div className={styles.profileItem}>
                                <h4>Height:</h4>
                                <p>{profile.height}</p>
                            </div>
                            <div className={styles.profileItem}>
                                <h4>Weight:</h4>
                                <p>{profile.weight}</p>
                            </div>
                            <div className={styles.profileItem}>
                                <h4>Gender:</h4>
                                <p>{profile.gender}</p>
                            </div>
                            <div className={styles.profileItem}>
                                <h4>Activity level:</h4>
                                <p>{profile.activity_level}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Profile not yet created.</p>
                    )}
                </div>
            </section>

            <section className={styles.right}>
                {!profile && <ProfileForm onProfileSaved={getProfile} />}
            </section>
        </main>
    );
}
