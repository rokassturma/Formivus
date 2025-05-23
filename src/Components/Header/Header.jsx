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
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 950);
        handleResize(); // paleidžiam iškart
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (loading || !currentUser) return;
        axios.get('http://localhost:5000/api/admin-users', { withCredentials: true })
            .then(() => setIsAdmin(true))
            .catch(() => setIsAdmin(false));
    }, [loading, currentUser]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
            setTimeout(() => {
                setCurrentUser(null);
                setIsAdmin(false);
                setLoggingOut(false);
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error('Logout error', err);
        }
    };

    return (
        <header className={styles.header}>
            <div className={`main-wrapper ${styles.headerInner}`}>
                <div className={styles.left}>
                    <NavLink to="/" className={styles.logo}>
                        <img src={logo} alt="formivus logo" />
                    </NavLink>

                    {!isMobile && currentUser && isAdmin && (
                        <div className={styles.navLeft}>
                            <NavLink to="/admin" className={styles.navLink}>Admin Panel</NavLink>
                            <NavLink to="/admin/users" className={styles.navLink}>All Users</NavLink>
                        </div>
                    )}

                    {isMobile && (
                        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                            ☰
                        </button>
                    )}
                </div>

                {!isMobile && currentUser && (
                    <div className={styles.right}>
                        <div className={styles.dropdown}>
                            <span className={styles.dropdownTitle}>Health Panel ▾</span>
                            <div className={styles.dropdownContent}>
                                <Link to="/progress">Progress</Link>
                                <Link to="/calories">My Calories</Link>
                                <Link to="/products">Products</Link>
                                <Link to="/meals">Meals Tracker</Link>
                            </div>
                        </div>

                        <NavLink to="/my-profile" className={styles.navLink}>
                            <span className={styles.usernameInline}>{currentUser.username}</span>
                            <span className={styles.profileText}> Profile</span>
                        </NavLink>

                        <div className={styles.logout}>
                            {loggingOut ? <Spinner /> : (
                                <button onClick={handleLogout} className="btn-primary">Logout</button>
                            )}
                        </div>
                    </div>
                )}
            </div>



            {isMobile && menuOpen && (
                <div className={styles.mobileMenu}>
                    {isAdmin && (
                        <>
                            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
                            <NavLink to="/admin/users" onClick={() => setMenuOpen(false)}>All Users</NavLink>
                        </>
                    )}
                    <Link to="/progress" onClick={() => setMenuOpen(false)}>Progress</Link>
                    <Link to="/calories" onClick={() => setMenuOpen(false)}>My Calories</Link>
                    <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                    <Link to="/meals" onClick={() => setMenuOpen(false)}>Meals Tracker</Link>
                    <NavLink to="/my-profile" onClick={() => setMenuOpen(false)}>
                        {currentUser?.username} Profile
                    </NavLink>
                </div>
            )}
        </header>
    );
}
