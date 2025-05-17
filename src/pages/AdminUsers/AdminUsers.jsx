import styles from './AdminUsers.module.scss';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import NotificationMessage from '../../Components/NotificationMessage/NotificationMessage';
import { AuthContext } from '../../context/AuthContext';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import AdminStats from './AdminStats';

export default function AdminUsers() {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ text: '', type: '', fading: false });
    const [showConfirm, setShowConfirm] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');

    const { currentUser } = useContext(AuthContext);

    const filteredProfiles = profiles
        .filter(profile =>
        (profile.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter(profile =>
            roleFilter === 'all' ? true : profile.role === roleFilter
        );

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/profiles', { withCredentials: true })
            .then(res => setProfiles(res.data))
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong.');
            });
    }, []);

    const handleRoleToggle = async (email) => {
        try {
            await axios.put('http://localhost:5000/api/admin/toggle-role', { email }, { withCredentials: true });
            const res = await axios.get('http://localhost:5000/api/admin/profiles', { withCredentials: true });
            setProfiles(res.data);
            setNotification({ text: 'Role updated successfully!', type: 'success', fading: false });
            setTimeout(() => setNotification(prev => ({ ...prev, fading: true })), 2500);
            setTimeout(() => setNotification({ text: '', type: '', fading: false }), 3000);
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    const confirmDelete = (email) => {
        setEmailToDelete(email);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete('http://localhost:5000/api/admin/delete-user', {
                data: { email: emailToDelete },
                withCredentials: true
            });
            const res = await axios.get('http://localhost:5000/api/admin/profiles', { withCredentials: true });
            setProfiles(res.data);
            setNotification({ text: 'User deleted successfully', type: 'success', fading: false });
            setTimeout(() => setNotification(prev => ({ ...prev, fading: true })), 2500);
            setTimeout(() => setNotification({ text: '', type: '', fading: false }), 3000);
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setShowConfirm(false);
            setEmailToDelete(null);
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

            <AdminStats profiles={profiles} />

            <div className={styles.controlsRow}>
                <input
                    type="text"
                    placeholder="Search by email or username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className={styles.selectRole}
                >
                    <option value="all">All roles</option>
                    <option value="admin">Admins</option>
                    <option value="user">Users</option>
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>Gender</th>
                        <th>Activity</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProfiles.map((profile, index) => (
                        <tr
                            key={index}
                            className={`${profile.role === 'admin' ? styles.adminRow : ''} ${currentUser?.email === profile.email ? styles.youRow : ''}`}
                        >
                            <td>{profile.username || 'Unknown'}{currentUser?.email === profile.email && ' (you)'}</td>
                            <td>{profile.email || 'Not provided'}</td>
                            <td>{profile.age ? `${profile.age} yrs` : '–'}</td>
                            <td>{profile.height ? `${profile.height} cm` : '–'}</td>
                            <td>{profile.weight ? `${profile.weight} kg` : '–'}</td>
                            <td>{profile.gender || '–'}</td>
                            <td>{profile.activity_level || '–'}</td>
                            <td>{profile.role}</td>
                            <td className={styles.actions}>
                                <button className="btn-secondary" onClick={() => handleRoleToggle(profile.email)}>
                                    Set as {profile.role === 'admin' ? 'user' : 'admin'}
                                </button>
                                {currentUser?.email !== profile.email && (
                                    <button className="btn-secondary" onClick={() => confirmDelete(profile.email)}>
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showConfirm && (
                <ConfirmDialog
                    message={`Are you sure you want to delete ${emailToDelete}?`}
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => {
                        setShowConfirm(false);
                        setEmailToDelete(null);
                    }}
                />
            )}
        </main>
    );
}
