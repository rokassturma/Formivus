import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header({ isLoggedIn }) {
    return (
        <nav className={styles.header}>
            <div className={styles.left}>
                <Link to="/">Home</Link>
            </div>

            <div className={styles.right}>
                {!isLoggedIn && (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}

                {isLoggedIn && (
                    <button
                        className={styles.logoutButton}
                        onClick={() => {
                            localStorage.removeItem('username');
                            window.location.reload();
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
