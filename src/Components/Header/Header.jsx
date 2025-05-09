import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';


export default function Header() {

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <NavLink to="/" className={styles.logo}>Home</NavLink>
                <NavLink
                    to="/my-profile"
                    className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
                    }
                >
                    My Profile
                </NavLink>

            </div>
            <div className={styles.right}>
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


            </div>
        </header>
    )
}
