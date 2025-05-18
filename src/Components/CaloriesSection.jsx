import { useState, useEffect } from 'react';
import styles from '../pages/HealthPanel/CaloriesSection.module.scss';
import axios from 'axios';
import NotificationMessage from './NotificationMessage/NotificationMessage';


export default function CaloriesSection() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    amount: '',
    calories: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ text: "", type: "", fading: false });

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/calories', {
        withCredentials: true
      });
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching calories:', err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ text: "", type: "", fading: false });

    try {
      const now = new Date();

      const selectedDate = new Date(formData.date);

      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const fullDateTime = selectedDate.getFullYear() + '-' +
        String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(selectedDate.getDate()).padStart(2, '0') + ' ' +
        String(selectedDate.getHours()).padStart(2, '0') + ':' +
        String(selectedDate.getMinutes()).padStart(2, '0') + ':' +
        String(selectedDate.getSeconds()).padStart(2, '0');

      const payload = {
        ...formData,
        date: fullDateTime
      };

      await axios.post("http://localhost:5000/api/calories", payload, {
        withCredentials: true
      });

      await fetchEntries();

      showMessage("Entry saved", "success");

      setFormData({
        date: "",
        name: "",
        amount: "",
        calories: ""
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Error occurred";
      showMessage(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  function showMessage(text, type = 'error') {
    setNotification({ text, type, fading: false });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, fading: true }));
    }, 4500);

    setTimeout(() => {
      setNotification({ text: '', type: '', fading: false });
    }, 5000);
  }


  const today = new Date().toLocaleDateString('lt-LT');

  const totalCaloriesToday = entries
    .filter(entry => {
      const entryDate = new Date(entry.date).toLocaleDateString('lt-LT');
      return entryDate === today;
    })
    .reduce((sum, e) => sum + Number(e.calories), 0);

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <section className={styles.caloriesSection}>

      {notification.text && (
        <div className="notificationWrapper">
          <NotificationMessage
            message={notification.text}
            type={notification.type}
            fading={notification.fading}
          />
        </div>
      )}

      <h2>Calories Tracker</h2>

      <form onSubmit={handleSubmit} className={styles.caloriesForm}>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount (g/ml)" value={formData.amount} onChange={handleChange} required />
        <input type="number" name="calories" placeholder="Calories" value={formData.calories} onChange={handleChange} required />
        <button type="submit" className="btn-primary">Save</button>
      </form>

      <p className={styles.total}>Total calories today: {totalCaloriesToday} kcal</p>

      <table className={styles.caloriesTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>
                {new Date(entry.date).toLocaleString('lt-LT', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </td>
              <td>{entry.name}</td>
              <td>{entry.amount}</td>
              <td>{entry.calories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
