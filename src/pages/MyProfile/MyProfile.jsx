import styles from './MyProfile.module.scss';

export default function MyProfile() {


    return (
        <main className={styles.myProfile}>
            <section className={styles.profileBox}>
                <h1>Welcome to your personal page</h1>
                <p>Here you can fill your personal data and watch the progress!</p>
            </section>
        </main>
    )
}