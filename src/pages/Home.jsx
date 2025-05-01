import styles from './pagesStyles/Home.module.scss';

export default function Home({ isLoggedIn, username }) {
    return (
        <div className={styles.homeContainer}>
            {isLoggedIn ? (
                <>
                    <h1>Welcome back, {username}!</h1>
                    <p>This is your personalized fitness dashboard.</p>
                </>
            ) : (
                <>
                    <h1>Welcome to Formivus</h1>
                    <p>Please login or register to access your fitness tools.</p>
                </>
            )}
        </div>
    );
}
