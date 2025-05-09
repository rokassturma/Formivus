import styles from './MyProfile.module.scss';

export default function MyProfile() {


    return (
        <main className={`main-wrapper ${styles.myProfile}`}>
            <section className={styles.profileBox}>
                <h1>Welcome to your profile</h1>
                <p>Please login to see all the personal information!</p>
            </section>
        </main>
    )
}