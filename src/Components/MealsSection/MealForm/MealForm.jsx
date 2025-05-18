import styles from './MealForm.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealForm({ onSuccess }) {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [amount, setAmount] = useState('');
    const [calculated, setCalculated] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products', {
                    withCredentials: true
                });
                setProducts(res.data);
            } catch (err) {
                console.error('Error while getting products:', err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProductId && amount) {
            const product = products.find(p => p.id === Number(selectedProductId));
            const factor = Number(amount) / 100;

            setCalculated({
                proteins: (product.proteins * factor).toFixed(2),
                carbs: (product.carbs * factor).toFixed(2),
                fats: (product.fats * factor).toFixed(2),
                calories: (product.calories * factor).toFixed(2),
            });
        } else {
            setCalculated(null);
        }
    }, [selectedProductId, amount, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProductId || !amount) return;

        try {
            await axios.post('http://localhost:5000/api/meal-items', {
                product_id: selectedProductId,
                amount: Number(amount)
            }, {
                withCredentials: true
            });

            setSelectedProductId('');
            setAmount('');
            setCalculated(null);
            onSuccess && onSuccess();
        } catch (err) {
            console.error('Error while adding a product:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                >
                    <option value="">Select product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Amount (g/ml)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>

            {calculated && (
                <div className={styles.preview}>
                    <p><strong>Proteins:</strong> {calculated.proteins} g</p>
                    <p><strong>Carbs:</strong> {calculated.carbs} g</p>
                    <p><strong>Fats:</strong> {calculated.fats} g</p>
                    <p><strong>Calories:</strong> {calculated.calories} kcal</p>
                </div>
            )}

            <button type="submit" className="btn-primary">Add</button>
        </form>
    );
}
