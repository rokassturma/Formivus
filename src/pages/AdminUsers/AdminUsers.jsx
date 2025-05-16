import styles from './AdminUsers.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/profiles', {
            withCredentials: true
        })
            .then(res => setProfiles(res.data))
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong.');
            });
    }, []);

    return (
        <main className={styles.adminWrapper}>
            <h1>All User Profiles</h1>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.profileList}>
                {profiles.length > 0 ? (
                    profiles.map((profile, index) => (
                        <div key={index} className={styles.profileCard}>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Age:</strong> {profile.age} yrs</p>
                            <p><strong>Height:</strong> {profile.height} cm</p>
                            <p><strong>Weight:</strong> {profile.weight} kg</p>
                            <p><strong>Gender:</strong> {profile.gender}</p>
                            <p><strong>Activity:</strong> {profile.activity_level}</p>
                        </div>
                    ))
                ) : (
                    !error && <p>No profiles found.</p>
                )}
            </div>
        </main>
    );
}
