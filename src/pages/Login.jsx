import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './pagesStyles/Login.module.scss';

export default function Login({ setIsLoggedIn }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/login', loginData);
        setMessage(res.data.message);
        setStatus('success');
        localStorage.setItem('username', res.data.username);
        setIsLoggedIn(true);
        navigate('/');
      } catch (err) {
        if (err.response) {
          setMessage(err.response.data.message);
        } else {
          setMessage('Something went wrong');
        }
        setStatus('error');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {message && (
        <div className={
          status === 'success'
            ? styles.successMessage
            : styles.errorMessage
        }>
          {message}
        </div>
      )}


      {loading ? (
        <div className={styles.loadingContainer}>
          <span>Loading...</span>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}