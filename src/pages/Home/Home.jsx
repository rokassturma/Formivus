import styles from './Home.module.scss';


export default function Home() {

    return (
        <main className={styles.homeContainer}>
            <section className={styles.homeBox}>
                <h1>Welcome to Formivus</h1>
                <p>Please Login or Create your own personal account to start!</p>
            </section>
        </main>
    );
}