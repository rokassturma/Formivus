import styles from './Home.module.scss';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <main className={`main-wrapper ${styles.home}`}>


            <section className={styles.heroSection}>
                <h1>Welcome to Formivus</h1>
                <p>Your personalized fitness and nutrition companion.</p>
            </section>


            <section className={styles.aboutSection}>
                <h2>What is Formivus?</h2>
                <p>
                    Formivus is an all-in-one platform designed to help you take control of your health.
                    Track your meals, monitor your physical progress, and build a personal profile that grows with you.
                </p>
            </section>


            <section className={styles.featuresSection}>
                <h2>Main Features</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <h3>Calorie Tracker</h3>
                        <p>Easily track your daily meals and calculate macronutrients.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <h3>Progress Analysis</h3>
                        <p>Monitor your body measurements and visualize your progress over time.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <h3>Product Library</h3>
                        <p>Choose from a wide range of foods and customize your intake.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <h3>User & Admin Dashboard</h3>
                        <p>Manage your profile or view users and data as an administrator.</p>
                    </div>
                </div>
            </section>


            <section className={styles.howItWorksSection}>
                <h2>How it works</h2>
                <ol>
                    <li>Register and create your profile</li>
                    <li>Track meals using the calorie tracker</li>
                    <li>Monitor your progress with graphs</li>
                    <li>Adjust your habits based on analytics</li>
                </ol>
            </section>


            <section className={styles.testimonialsSection}>
                <h2>What our users say</h2>
                <div className={styles.testimonialGrid}>
                    <blockquote>“Formivus helped me stay consistent with my goals!” — Lina</blockquote>
                    <blockquote>“Now I finally understand what I eat every day.” — Tomas</blockquote>
                </div>
            </section>








            <section className={styles.footerPreview}>
                <h3>Your journey starts today.</h3>
                <p>Whether you're gaining strength, losing weight, or staying balanced – Formivus is here for you.</p>
            </section>
        </main>
    );
}
