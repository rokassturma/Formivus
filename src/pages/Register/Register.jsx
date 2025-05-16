import { useState } from "react";
import axios from 'axios';
import styles from './Register.module.scss';
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
import {
  validateUsername, validateEmail, checkPasswordRequirements, getPasswordStrength
} from "../../utils/validators";
import NotificationMessage from '../../Components/NotificationMessage/NotificationMessage';
import EmailInput from './EmailInput';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import ConfirmPasswordInput from './ConfirmPasswordInput';
import PasswordRequirements from './PasswordRequirements';

export default function Register() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({ text: '', type: '', fading: false });

  const navigate = useNavigate();

  function showMessage(text, type = 'error') {
    setNotification({ text, type, fading: false });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, fading: true }));
    }, 4500);

    setTimeout(() => {
      setNotification({ text: '', type: '', fading: false });
    }, 5000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      showMessage('Please fix the email field.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/register',
        { email, username, password },
        { withCredentials: true }
      );

      showMessage('Registration is successful! Redirecting to Login Page...', 'success');

      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 4000);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Error. Try again.';
      showMessage(msg, 'error');
    }
  };

  return (
    <main className={`main-wrapper ${styles.registerContainer}`}>
      {notification.text && (
        <div className="notificationWrapper">
          <NotificationMessage
            message={notification.text}
            type={notification.type}
            fading={notification.fading}
          />
        </div>
      )}

      <section className={styles.registerBox}>
        <h1>Registration</h1>

        {loading ? <Spinner /> : (
          <form className={styles.registerForm} onSubmit={handleSubmit}>

            <EmailInput
              email={email}
              setEmail={setEmail}
              error={emailError}
              setError={(val) => setEmailError(validateEmail(val))}
              styles={styles}
            />

            <UsernameInput
              username={username}
              setUsername={setUsername}
              error={usernameError}
              setError={(val) => setUsernameError(validateUsername(val))}
              styles={styles}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
              setRequirements={setPasswordRequirements}
              setStrength={setPasswordStrength}
              styles={styles}
              checkPasswordRequirements={checkPasswordRequirements}
              getPasswordStrength={getPasswordStrength}
            />

            <PasswordRequirements
              requirements={passwordRequirements}
              strength={passwordStrength}
              styles={styles}
            />

            <ConfirmPasswordInput
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              styles={styles}
            />

            <button
              type="submit"
              className="btn-primary"
              disabled={passwordStrength === 'Weak' || password.length < 8}
              title={
                passwordStrength === 'Weak' || password.length < 8
                  ? 'Password must be at least 8 characters and not weak'
                  : ''
              }
            >
              REGISTER
            </button>


            <Link to="/" className="btn-secondary link-reset">Return</Link>
          </form>
        )}
      </section>
    </main>
  );
}
