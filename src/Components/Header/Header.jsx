import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';



export default function Header() {

    const { currentUser, setCurrentUser, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);


    useEffect(() => {

        if (loading || !currentUser) return;

        axios.get('http://localhost:5000/api/admin-users', { withCredentials: true })
            .then(() => setIsAdmin(true))
            .catch(() => setIsAdmin(false));
    }, [loading, currentUser]);

    const navigate = useNavigate();



    const handleLogout = async () => {

        setLoggingOut(true);

        try {
            await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });

            setTimeout(() => {
                setCurrentUser(null);
                setIsAdmin(false);
                setLoggingOut(false)
                navigate('/');
            }, 1000);
        }
        catch (err) {
            console.error('Logout error', err);
        }
    }

    return (
        <header className={styles.header}>
            <div className={`main-wrapper ${styles.headerInner}`}>
                <div className={styles.left}>
                    <NavLink to="/" className={styles.logo}>Home</NavLink>


                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                            }
                        >
                            Admin Panel
                        </NavLink>
                    )}
                </div>


                <div className={styles.right}>
                    {!currentUser ? (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                                }
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/my-profile"
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                                }
                            >
                                My Profile
                            </NavLink>
                            <span className={styles.username}>{currentUser.username}</span>

                            {loggingOut ? (
                                <Spinner />
                            ) : (
                                <button onClick={handleLogout} className="btn">Logout</button>
                            )}

                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
