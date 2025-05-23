import styles from './Footer.module.scss';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`main-wrapper ${styles.footerContent}`}>
                <div className={styles.column}>
                    <h2>Formivus</h2>
                    <p>Your health, your control.</p>
                    <div className={styles.social}>
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Help</a></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Contact</h4>
                    <p>Email: support@formivus.com</p>
                    <p>Phone: +370 600 00000</p>
                    <p>Address: Gimtinės g. 12, Dauglaukio k., Tauragės raj.</p>
                </div>


                <div className={styles.bottom}>
                    <p>© {new Date().getFullYear()} Formivus. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
