import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './MyProfile.module.scss';
import axios from 'axios';
import ProfileForm from '../../Components/ProfileForm/ProfileForm';
import NotificationMessage from '../../Components/NotificationMessage/NotificationMessage';


export default function MyProfile() {

    const { currentUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({ text: '', type: '' });

    const getProfile = () => {
        axios.get('http://localhost:5000/api/profile', { withCredentials: true })
            .then(res => {
                setProfile(res.data);
            })
            .catch(err => {
                setProfile(null);
                const msg = err.response?.data?.message || 'Failed to load a profile.';

                setNotification({ text: msg, type: 'error' });
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, fading: true }));
                }, 2500);
                setTimeout(() => {
                    setNotification({ text: '', type: '' });
                }, 3000);
            });
    };


    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            {notification.text && (
                <div className="notificationWrapper">
                    <NotificationMessage
                        message={notification.text}
                        type={notification.type}
                        fading={notification.fading}
                    />
                </div>
            )}

            < main className={styles.profileWrapper} >
                <section className={styles.left}>
                    <div className={styles.profileCard}>
                        <h2>
                            Welcome, <span className={styles.userStyle}>{currentUser?.username}</span>!
                        </h2>
                        <p>This is your personal profile panel.</p>

                        {profile ? (
                            <>
                                <div className={styles.profileGrid}>
                                    <div className={styles.profileItem}>
                                        <h4>Age:</h4>
                                        <p>{profile.age} yrs</p>
                                    </div>
                                    <div className={styles.profileItem}>
                                        <h4>Height:</h4>
                                        <p>{profile.height} cm</p>
                                    </div>
                                    <div className={styles.profileItem}>
                                        <h4>Weight:</h4>
                                        <p>{profile.weight} kg</p>
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
                                <button onClick={() => setIsEditing(true)} className="btn-secondary">
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <p>Profile not yet created.</p>
                        )}
                    </div>
                </section>

                <section className={styles.right}>

                    {(!profile || isEditing) && (
                        <ProfileForm
                            profileData={profile}
                            onProfileSaved={() => {
                                getProfile();
                                setIsEditing(false);
                            }}
                            showMessage={(text, type = 'success') => {
                                setNotification({ text, type });

                                setTimeout(() => {
                                    setNotification((prev) => ({ ...prev, fading: true }));
                                }, 2500);

                                setTimeout(() => {
                                    setNotification({ text: '', type: '' });
                                }, 3000);
                            }}
                        />
                    )}
                </section>
            </main >
        </>
    );
}
