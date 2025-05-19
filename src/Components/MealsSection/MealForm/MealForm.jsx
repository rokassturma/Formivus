import styles from './MealForm.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealForm({ mealId, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [amount, setAmount] = useState('');
    const [calculated, setCalculated] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

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
        if (!selectedProductId || !amount || !mealId) return;

        try {
            await axios.post('http://localhost:5000/api/meal-items', {
                product_id: selectedProductId,
                amount: Number(amount),
                meal_id: mealId
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
        <>
            <tr className={styles.formRow}>
                <td></td>
                <td colSpan={2}>
                    <div className={styles.inputGroup}>
                        <select
                            className={`${styles.select} ${isExpanded ? styles.expanded : ''}`}
                            value={selectedProductId}
                            onFocus={() => setIsExpanded(true)}
                            onBlur={() => setIsExpanded(false)}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            required
                        >
                            <option value="">Select product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                </td>
                <td colSpan={4}></td>
                <td>
                    <button type="submit" className="btn-primary" onClick={handleSubmit}>Add</button>
                </td>
            </tr>

            {calculated && (
                <tr className={styles.previewRow}>
                    <td colSpan={8}>
                        <span className={styles.macroPreview}>
                            {calculated.proteins}g / {calculated.carbs}g / {calculated.fats}g / {calculated.calories} kcal
                        </span>
                    </td>
                </tr>
            )}
        </>
    );
}
