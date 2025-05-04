import { useState } from 'react';
import styles from './Login.module.scss';
import axios from 'axios';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await axios.post(
                'http://localhost:5000/api/login',
                { email, password },
                { withCredentials: true }
            )

            console.log('Login is successful', response.data)
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError('Something went wrong. Please try again later.')
            }
        }
    }

    return (
        <main className={styles.loginContainer}>
            <section className={styles.loginBox}>
                <h1>Login</h1>

                {error && <p className={styles.error}>{error}</p>}

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type='submit' className={`${styles.submitBtn} btn`}>Login</button>
                </form>
            </section>
        </main>
    )
}
