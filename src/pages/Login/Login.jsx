import { useContext, useState } from 'react';
import styles from './Login.module.scss';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner/Spinner';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setCurrentUser } = useContext(AuthContext);

    const navigate = useNavigate();




    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(
                'http://localhost:5000/api/login',
                { email, password },
                { withCredentials: true }
            );

            const res = await axios.get(
                'http://localhost:5000/api/me',
                { withCredentials: true }
            );

            setTimeout(() => {
                setLoading(false);
                setCurrentUser(res.data.user);
                navigate('/');
            }, 1000);

        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setLoading(false);
                setError(err.response.data.message)
            } else {
                setLoading(false);
                setError('Something went wrong. Please try again later.')
            }
        }
    };

    return (
        <main className={`main-wrapper ${styles.loginContainer}`}>
            <section className={styles.loginBox}>
                <h1>Login</h1>

                {error && <p className={styles.error}>{error}</p>}


                {loading ? <Spinner />
                    : (
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

                    )}
            </section>
        </main>
    )
}
