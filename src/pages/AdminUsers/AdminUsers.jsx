import styles from './AdminUsers.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationMessage from '../../Components/NotificationMessage/NotificationMessage';



export default function AdminUsers() {

    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ text: '', type: '', fading: false });

    const filteredProfiles = profiles.filter(profile =>
    (profile.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/profiles', {
            withCredentials: true
        })
            .then(res => setProfiles(res.data))
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong.');
            });
    }, []);

    const handleRoleToggle = async (email) => {
        try {
            await axios.put('http://localhost:5000/api/admin/toggle-role', { email }, {
                withCredentials: true
            });

            const res = await axios.get('http://localhost:5000/api/admin/profiles', {
                withCredentials: true
            });

            setProfiles(res.data);

            setNotification({ text: 'Role updated successfully!', type: 'success', fading: false });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, fading: true }));
            }, 2500);

            setTimeout(() => {
                setNotification({ text: '', type: '', fading: false });
            }, 3000);
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };



    return (

        <main className={styles.adminWrapper}>

            <h1>All User Profiles</h1>

            {notification.text && (
                <div className="notificationWrapper">
                    <NotificationMessage
                        message={notification.text}
                        type={notification.type}
                        fading={notification.fading}
                    />
                </div>
            )}

            <input
                type="text"
                placeholder="Search by email or username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />


            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.profileList}>
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile, index) => (
                        <div
                            key={index}
                            className={`${styles.profileCard} ${profile.role === 'admin' ? styles.adminCard : ''}`}
                        >
                            <h3>{profile.username || 'Unknown User'}</h3>
                            <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
                            <p><strong>Age:</strong> {profile.age ? `${profile.age} yrs` : 'Not provided'}</p>
                            <p><strong>Height:</strong> {profile.height ? `${profile.height} cm` : 'Not provided'}</p>
                            <p><strong>Weight:</strong> {profile.weight ? `${profile.weight} kg` : 'Not provided'}</p>
                            <p><strong>Gender:</strong> {profile.gender || 'Not provided'}</p>
                            <p><strong>Activity:</strong> {profile.activity_level || 'Not provided'}</p>
                            <p><strong>Role:</strong> {profile.role || 'Not provided'}</p>

                            <button
                                className='btn-secondary'
                                onClick={() => handleRoleToggle(profile.email)}
                            >
                                Set as {profile.role === 'admin' ? 'user' : 'admin'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No matching profiles.</p>
                )}
            </div>
        </main>
    );
}
