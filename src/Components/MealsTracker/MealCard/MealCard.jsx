import styles from './MealCard.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealCard({ meal, items, products, onAddProduct, onDeleteItem, onDeleteMeal, onSuccess }) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [amount, setAmount] = useState('');
    const [calculated, setCalculated] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(meal.name || '');

    useEffect(() => {
        setNameInput(meal.name || '');
    }, [meal.name]);

    useEffect(() => {
        if (selectedProductId && amount) {
            const product = products.find(p => p.id === Number(selectedProductId));
            if (!product) return;

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

    const handleNameSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/meals/${meal.id}`, {
                name: nameInput,
            }, { withCredentials: true });

            setEditing(false);
            onSuccess();
        } catch (err) {
            console.error("Error updating meal name:", err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProductId || !amount) return;

        onAddProduct(meal.id, selectedProductId, amount);
        setSelectedProductId('');
        setAmount('');
        setCalculated(null);
    };

    return (
        <div className={styles.mealCard}>
            <div className={styles.mealHeader}>
                {editing ? (
                    <form onSubmit={handleNameSave} className={styles.nameEditForm}>
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className={styles.nameInput}
                            placeholder={`Meal ${meal.meal_number}`}
                        />
                        <button type="submit" className={styles.saveBtn}>💾</button>
                    </form>
                ) : (
                    <div className={styles.titleRow}>
                        <h2>{meal.name || `Meal ${meal.meal_number}`}</h2>
                        <button className={styles.editBtn} onClick={() => setEditing(true)} title="Edit meal name">✏️</button>
                    </div>
                )}
                <button className={styles.deleteMealBtn} onClick={() => onDeleteMeal(meal.id)}>🗑</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Proteins</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                            <th>Calories</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{new Date(item.date).toLocaleString('lt-LT')}</td>
                                <td>{item.product_name}</td>
                                <td>{item.amount} g</td>
                                <td>{item.proteins}</td>
                                <td>{item.carbs}</td>
                                <td>{item.fats}</td>
                                <td>{item.calories}</td>
                                <td>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => onDeleteItem(item.id)}
                                    >
                                        ✖
                                    </button>
                                </td>
                            </tr>
                        ))}

                        <tr className={styles.formRow}>
                            <td></td>
                            <td>
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
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="g or ml"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={styles.tableInput}
                                    required
                                />
                            </td>
                            <td className={styles.previewValue}>{calculated?.proteins || ''}g</td>
                            <td className={styles.previewValue}>{calculated?.carbs || ''}g</td>
                            <td className={styles.previewValue}>{calculated?.fats || ''}g</td>
                            <td className={styles.previewValue}>{calculated?.calories || ''} kcal</td>
                            <td>
                                <button type="submit" className="btn-primary" onClick={handleSubmit}>Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
