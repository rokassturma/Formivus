import { useState } from "react";
import axios from 'axios';
import styles from './Register.module.scss';
import { useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";


export default function Register() {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Please confirm password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`${styles.submitBtn} btn`}>Register</button>
        </form>
        )}
      </section>
    </main>
  )
}
