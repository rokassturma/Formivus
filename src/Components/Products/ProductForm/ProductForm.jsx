import { useState } from 'react';
import axios from 'axios';
import styles from './ProductForm.module.scss';
import NotificationMessage from '../../NotificationMessage/NotificationMessage';

export default function ProductForm({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        proteins: '',
        carbs: '',
        fats: '',
        calories: ''
    });

    const [notification, setNotification] = useState(null);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const { name, proteins, carbs, fats, calories } = form;

        if (!name || proteins < 0 || carbs < 0 || fats < 0 || calories < 0) {
            setNotification({
                type: 'error',
                message: 'Values cannot be negative'
            });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/products', form, {
                withCredentials: true
            });
            setForm({
                name: '',
                proteins: '',
                carbs: '',
                fats: '',
                calories: ''
            });

            setNotification({
                type: 'success',
                message: 'Product submitted successfully'
            });

            setTimeout(() => setNotification(null), 5000);

            onSuccess && onSuccess();
        } catch (err) {
            console.error('Submit error:', err);
            setNotification({
                type: 'error',
                message: 'Failed to submit product'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    return (
        <>
            {notification && (
                <div className="notificationWrapper">
                    <NotificationMessage type={notification.type} message={notification.message} />
                </div>
            )}

            <form className={styles.productForm} onSubmit={handleSubmit}>
                <h3>Suggest a New Product</h3>

                <input type="text" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
                <input type="number" name="proteins" placeholder="Proteins (g)" value={form.proteins} onChange={handleChange} required />
                <input type="number" name="carbs" placeholder="Carbs (g)" value={form.carbs} onChange={handleChange} required />
                <input type="number" name="fats" placeholder="Fats (g)" value={form.fats} onChange={handleChange} required />
                <input type="number" name="calories" placeholder="Calories (kcal)" value={form.calories} onChange={handleChange} required />

                <button
                    type="submit"
                    className={`${styles['btn-submit-product']} ${styles['btn-submit-size']}`}
                >
                    Submit Product
                </button>

            </form>
        </>
    );
}
