import { useState } from 'react';
import axios from 'axios';
import styles from './ProductForm.module.scss';

export default function ProductForm({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        proteins: '',
        carbs: '',
        fats: '',
        calories: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
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
            onSuccess && onSuccess();
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    return (
        <form className={styles.productForm} onSubmit={handleSubmit}>
            <h3>Suggest a New Product</h3>

            <input type="text" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
            <input type="number" name="proteins" placeholder="Proteins (g)" value={form.proteins} onChange={handleChange} required />
            <input type="number" name="carbs" placeholder="Carbs (g)" value={form.carbs} onChange={handleChange} required />
            <input type="number" name="fats" placeholder="Fats (g)" value={form.fats} onChange={handleChange} required />
            <input type="number" name="calories" placeholder="Calories (kcal)" value={form.calories} onChange={handleChange} required />

            <button type="submit" className="btn-primary">Submit</button>
        </form>
    );
}
