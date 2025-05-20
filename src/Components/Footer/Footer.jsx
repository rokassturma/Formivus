import styles from './Footer.module.scss';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {


    return (

        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.logo}>
                    <h2>Formivus</h2>
                    <p>Your health, your control.</p>
                </div>
                <div className={styles.links}>
                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} Formivus. All rights reserved.</p>
            </div>
        </footer>
    )
}
