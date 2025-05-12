import { useState } from "react";
import axios from 'axios';
import styles from './Register.module.scss';
import { useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
import { validateUsername, validateEmail } from "../../utils/validators";
import { checkPasswordRequirements, getPasswordStrength } from "../../utils/validators";
import classNames from 'classnames';


export default function Register() {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');


  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [confirmError, setConfirmError] = useState('');

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');


  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);





  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      setError('Please fix the email field.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/register',
        { email, username, password },
        { withCredentials: true }
      );

      setSuccessMessage('Registration is successful! Redirecting to Login Page...');
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
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setLoading(false);
        setError('Error. Try again.');
      }
    }
  };


  return (
    <main className={`main-wrapper ${styles.registerContainer}`}>
      <section className={styles.registerBox}>
        <h1>Registration</h1>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}


        {loading ? <Spinner />
          : (
            <form className={styles.registerForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setEmailError(validateEmail(value));
                  }}
                  onBeforeInput={(e) => {
                    const disallowed = /[\\/*;"'()&]/;
                    if (disallowed.test(e.data)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
                {emailError && <p className={styles.error}>{emailError}</p>}
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);
                    setUsernameError(validateUsername(value));
                  }}
                  onBeforeInput={(e) => {
                    const allowed = /^[a-zA-Z0-9]*$/;
                    if (!allowed.test(e.data)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
                {usernameError && <p className={styles.error}>{usernameError}</p>}
              </div>



              <div className={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);

                    const reqs = checkPasswordRequirements(val);
                    setPasswordRequirements(reqs);

                    const strength = getPasswordStrength(reqs);
                    setPasswordStrength(strength);
                  }}
                  required
                />
              </div>

              <ul className={styles.requirementsList}>
                <li className={passwordRequirements.hasMinLength ? styles.valid : ''}>At least 8 characters</li>
                <li className={passwordRequirements.hasUpperCase ? styles.valid : ''}>At least 1 uppercase letter</li>
                <li className={passwordRequirements.hasLowerCase ? styles.valid : ''}>At least 1 lowercase letter</li>
                <li className={passwordRequirements.hasNumber ? styles.valid : ''}>At least 1 number</li>
                <li className={passwordRequirements.hasSpecialChar ? styles.valid : ''}>At least 1 special character</li>
              </ul>

              <p className={`${styles.strength} ${styles[passwordStrength.toLowerCase()]}`}>
                Password strength: {passwordStrength}
              </p>


              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Please confirm password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmPassword(val);
                    setConfirmError(val !== password ? 'Passwords do not match.' : '');
                  }}
                  required
                />
                {confirmError && <p className={styles.error}>{confirmError}</p>}
              </div>

              <button
                type="submit"
                className={`${styles.submitBtn} btn`}
                disabled={passwordStrength === 'Weak' || password.length < 8}
              >Register
              </button>
            </form>
          )}
      </section>
    </main>
  )
}
