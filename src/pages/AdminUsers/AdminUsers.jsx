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
                            <h3>{profile.username || 'Unknown User'}</h3>
                            <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
                            <p><strong>Age:</strong> {profile.age ? `${profile.age} yrs` : 'Not provided'}</p>
                            <p><strong>Height:</strong> {profile.height ? `${profile.height} cm` : 'Not provided'}</p>
                            <p><strong>Weight:</strong> {profile.weight ? `${profile.weight} kg` : 'Not provided'}</p>
                            <p><strong>Gender:</strong> {profile.gender || 'Not provided'}</p>
                            <p><strong>Activity:</strong> {profile.activity_level || 'Not provided'}</p>
                        </div>
                    ))
                ) : (
                    !error && <p>No profiles found.</p>
                )}

            </div>
        </main>
    );
}
