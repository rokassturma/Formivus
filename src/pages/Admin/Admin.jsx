import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.scss';
import axios from 'axios';

export default function Admin() {

  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin-users', { withCredentials: true })
      .then(() => setAuthorized(true))
      .catch(() => {
        navigate('/');
      });
  }, []);

  if (!authorized) {
    return <p style={{ textAlign: 'center' }}>Checking admin access...</p>
  }

  return (
    <main className="main-wrapper">
      <section>
        <h1>Admin Panel</h1>
        <p>Welcome, administrator! This content is protected by backend.</p>
      </section>
    </main>
  )
}
