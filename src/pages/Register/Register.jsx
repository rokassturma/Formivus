import { useState } from "react";
import axios from 'axios';
import styles from './Register.module.scss';
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
import {
  validateUsername, validateEmail, checkPasswordRequirements, getPasswordStrength
} from "../../utils/validators";

import NotificationMessage from './NotificationMessage';
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

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function showMessage(text, type = 'error') {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
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

    setMessage({ text: '', type: '' });
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
    }

    catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        showMessage(err.response.data.message, 'error');
      } else {
        showMessage('Error. Try again.', 'error');
      }
    }
  };

  return (
    <main className={`main-wrapper ${styles.registerContainer}`}>
      <section className={styles.registerBox}>
        <h1>Registration</h1>

        <NotificationMessage message={message.text} type={message.type} />

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
              className={`${styles.submitBtn} btn`}
              disabled={passwordStrength === 'Weak' || password.length < 8}
            >
              Register
            </button>

            <p className={styles.backLink}>
              <Link to="/">← Return to Home page</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
