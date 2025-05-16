import styles from './Login.module.scss';
import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner/Spinner';
import NotificationMessage from './NotificationMessage';
import PasswordInput from './PasswordInput';
import EmailInput from './EmailInput';


export default function Login() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

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
                        <EmailInput
                            email={email}
                            setEmail={setEmail}
                            error={emailError}
                            setError={(val) => setEmailError(val)}
                            styles={styles}
                        />

                        <PasswordInput
                            password={password}
                            setPassword={setPassword}
                            styles={styles}
                        />

                        <button type='submit' className={`${styles.submitBtn} btn`}>Login</button>

                        <p className={styles.backLink}>
                            <Link to="/">← Return to Home page</Link>
                        </p>
                    </form>
                )}
            </section>
        </main>
    );
}
