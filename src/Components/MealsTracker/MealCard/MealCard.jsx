import styles from './MealCard.module.scss';
import MealList from './MealList';
import { useState } from 'react';

export default function MealCard({ meal, items, products, onAddProduct, onDeleteItem, onDeleteMeal }) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProductId || !amount) return;

        onAddProduct(meal.id, selectedProductId, amount);
        setSelectedProductId('');
        setAmount('');
    };

    return (
        <div className={styles.mealCard}>
            <div className={styles.mealHeader}>
                <h2>{meal.meal_number} meal</h2>
                <button className={styles.deleteMealBtn} onClick={() => onDeleteMeal(meal.id)}>✖</button>
            </div>

            <MealList items={items} onDeleteItem={onDeleteItem} />

            <form className={styles.inlineForm} onSubmit={handleSubmit}>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required>
                    <option value="">Select product</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Amount (g/ml)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <button type="submit" className="btn-primary">Add</button>
            </form>
        </div>
    );
}
