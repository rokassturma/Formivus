import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import logo from '../../assets/images/logo.svg';


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
                    <NavLink to="/" className={styles.logo}>
                        <img src={logo} alt="formivus logo" />
                    </NavLink>

                    {isAdmin &&
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                            }
                        >
                            Admin Panel
                        </NavLink>
                    }

                    {isAdmin && (
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                            }
                        >
                            All Users
                        </NavLink>
                    )}
                </div>


                <div className={styles.right}>
                    {!currentUser ? (
                        <>
                            <NavLink to="/login" className="btn-primary">
                                Login
                            </NavLink>

                            <NavLink to="/register" className="btn-primary">
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <div className={styles.dropdown}>
                                <span className={styles.dropdownTitle}>Health Panel ▾</span>
                                <div className={styles.dropdownContent}>
                                    <Link to="/progress">Progress</Link>
                                    <Link to="/calories">My Calories</Link>
                                    <Link to="/products">Products</Link>
                                    <Link to="/meals">Meals Tracker</Link>
                                </div>
                            </div>

                            <NavLink
                                to="/my-profile"
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                                }
                            >
                                <span className={styles.usernameInline}>{currentUser.username}</span>
                                <span className={styles.profileText}> Profile</span>
                            </NavLink>



                            {loggingOut ? (
                                <Spinner />
                            ) : (
                                <button onClick={handleLogout} className="btn-primary">Logout</button>
                            )}

                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
