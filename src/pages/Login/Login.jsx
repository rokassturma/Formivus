import { useContext, useState } from 'react';
import styles from './Login.module.scss';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner/Spinner';
import NotificationMessage from './NotificationMessage';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const { setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function showMessage(text, type = 'error') {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
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
                showMessage('Login successful! Redirecting...', 'success');
                navigate('/');
            }, 1000);
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.message) {
                showMessage(err.response.data.message, 'error');
            } else {
                showMessage('Something went wrong. Please try again.', 'error');
            }
        }
    };

    return (
        <main className={`main-wrapper ${styles.loginContainer}`}>
            <section className={styles.loginBox}>
                <h1>Login</h1>

                <NotificationMessage message={message.text} type={message.type} />

                {loading ? <Spinner /> : (
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
    );
}
