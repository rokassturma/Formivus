import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';



export default function Header() {

    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:5000/api/admin-users', { withCredentials: true })
        .then(() => setIsAdmin(true))
        .catch(() => setIsAdmin(false));
    }, []);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
            setCurrentUser(null);
            navigate('/');
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
                            <button className="btn" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
