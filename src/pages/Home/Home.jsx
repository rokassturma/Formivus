import styles from './Home.module.scss';
import aboutImg from '../../assets/images/about.svg';
import user from '../../assets/images/user.svg';
import { useRef, useState, useEffect } from "react";

export default function Home() {
    const sectionRef = useRef(null);
    const [visibleSteps, setVisibleSteps] = useState([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {

                    const delays = [];
                    for (let i = 0; i < 6; i++) {
                        delays.push(setTimeout(() => {
                            setVisibleSteps(prev => [...prev, i]);
                        }, i * 600));
                    }

                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const steps = [
        'Create your account and complete your profile',
        'Add your body measurements to track your physical progress',
        'Choose products from the library and log your meals',
        'Calculate your daily intake of proteins, carbs, fats, and calories',
        'Monitor trends and visualize your health data over time',
        'Stay consistent and reach your fitness goals faster',
    ];


    return (
        <main className={`main-wrapper ${styles.home}`}>


            <section className={styles.heroSection}>
                <h1>Welcome to Formivus</h1>
                <p>Your personalized fitness and nutrition companion.</p>
            </section>


            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <div className={styles.aboutText}>
                        <h2>What is Formivus?</h2>
                        <p>
                            Formivus is your personal health companion. Whether you're tracking calories,
                            building meal plans, or monitoring progress, this platform brings clarity to your wellness journey.
                        </p>
                    </div>
                    <div className={styles.aboutImage}>
                        <img src={aboutImg} alt="Healthy lifestyle illustration" />
                    </div>
                </div>
            </section>


            <section className={styles.featuresSection}>
                <h2>Main Features</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.flipCard}>
                        <div className={styles.flipInner}>
                            <div className={styles.flipFront}>
                                <h3>Calorie Tracker</h3>
                            </div>
                            <div className={styles.flipBack}>
                                <p>Track your daily meals and macronutrient intake easily.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.flipCard}>
                        <div className={styles.flipInner}>
                            <div className={styles.flipFront}>
                                <h3>Progress Analysis</h3>
                            </div>
                            <div className={styles.flipBack}>
                                <p>Visualize your body measurements and see your improvements.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.flipCard}>
                        <div className={styles.flipInner}>
                            <div className={styles.flipFront}>
                                <h3>Product Library</h3>
                            </div>
                            <div className={styles.flipBack}>
                                <p>Choose foods from a rich database and customize your own portions.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.flipCard}>
                        <div className={styles.flipInner}>
                            <div className={styles.flipFront}>
                                <h3>User & Admin Dashboard</h3>
                            </div>
                            <div className={styles.flipBack}>
                                <p>Manage your profile or users if you're an administrator.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sectionRef} className={styles.howItWorksSection}>
                <h2>How It Works?</h2>
                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.step} ${visibleSteps.includes(index) ? styles.visible : ''}`}
                        >
                            {index + 1}. {step}
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.testimonialsSection}>
                <h2>What users are saying...</h2>
                <div className={styles.testimonialsGrid}>
                    {[
                        {
                            name: "John D.",
                            comment: "Formivus helped me keep track of my nutrition effortlessly!",
                            image: { user }
                        },
                        {
                            name: "Emily S.",
                            comment: "Finally, a simple and beautiful app to monitor my health goals.",
                            image: null
                        },
                        {
                            name: "Alex T.",
                            comment: "I love how intuitive the meal logging is!",
                            image: { user }
                        }
                    ].map((testimonial, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.avatar}>
                                {testimonial.image ? (
                                    <img src={user} alt={testimonial.name} />
                                ) : (
                                    <div className={styles.defaultAvatar}></div>
                                )}
                            </div>
                            <p className={styles.comment}>"{testimonial.comment}"</p>
                            <p className={styles.user}>– {testimonial.name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
