import styles from './MealsSection.module.scss';
import MealForm from './MealForm/MealForm';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function MealsSection() {
    const [meals, setMeals] = useState([]);
    const [mealItems, setMealItems] = useState([]);
    const [editingMealId, setEditingMealId] = useState(null);
    const [nameInputs, setNameInputs] = useState({});

    const handleDeleteMeal = async (mealId) => {
        try {
            await axios.delete(`http://localhost:5000/api/meals/${mealId}`, {
                withCredentials: true
            });
            handleRefresh();
        } catch (err) {
            console.error('Error deleting meal:', err);
        }
    };

    const handleSaveMealName = async (mealId) => {
        try {
            await axios.put(`http://localhost:5000/api/meals/${mealId}`, {
                name: nameInputs[mealId],
            }, { withCredentials: true });

            setEditingMealId(null);
            handleRefresh();
        } catch (err) {
            console.error("Error updating meal name:", err);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/meal-items/${itemId}`, {
                withCredentials: true
            });
            handleRefresh();
        } catch (err) {
            console.error('Error deleting meal item:', err);
        }
    };

    const fetchMeals = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/meals', {
                withCredentials: true
            });
            setMeals(res.data);
        } catch (err) {
            console.error('Error fetching meals:', err);
        }
    };

    const fetchMealItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/meal-items', {
                withCredentials: true
            });
            setMealItems(res.data);
        } catch (err) {
            console.error('Error fetching meal items:', err);
        }
    };

    const handleRefresh = () => {
        fetchMeals();
        fetchMealItems();
    };

    const handleAddMeal = async () => {
        try {
            await axios.post('http://localhost:5000/api/meals', {}, {
                withCredentials: true
            });
            handleRefresh();
        } catch (err) {
            console.error("Error creating meal:", err);
        }
    };

    const getItemsForMeal = (mealId) => {
        return mealItems.filter(item => item.meal_id === mealId);
    };

    const calculateTotals = () => {
        let totalProteins = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let totalCalories = 0;

        mealItems.forEach(item => {
            totalProteins += Number(item.proteins);
            totalCarbs += Number(item.carbs);
            totalFats += Number(item.fats);
            totalCalories += Number(item.calories);
        });

        return {
            proteins: totalProteins.toFixed(1),
            carbs: totalCarbs.toFixed(1),
            fats: totalFats.toFixed(1),
            calories: totalCalories.toFixed(1),
        };
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    const totals = calculateTotals();

    return (
        <section className={styles.mealsSection}>
            <h1>My Meals</h1>
            <Link to="/meals/print" className="btn-secondary smallButton" target="_blank">
                Print-view
            </Link>

            <div className={styles.mealsWrapper}>
                {meals.map(meal => (
                    <div key={meal.id} className={styles.mealBlock}>
                        <div className={styles.mealHeader}>
                            {editingMealId === meal.id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSaveMealName(meal.id);
                                    }}
                                    className={styles.nameEditForm}
                                >
                                    <input
                                        type="text"
                                        value={nameInputs[meal.id] || ''}
                                        onChange={(e) =>
                                            setNameInputs((prev) => ({ ...prev, [meal.id]: e.target.value }))
                                        }
                                        placeholder={`Meal ${meal.meal_number}`}
                                        className={styles.nameInput}
                                    />
                                    <button type="submit" className={styles.saveBtn}>💾</button>
                                </form>
                            ) : (
                                <div className={styles.titleRow}>
                                    <h2>{meal.name || `Meal ${meal.meal_number}`}</h2>
                                    <button
                                        onClick={() => {
                                            setEditingMealId(meal.id);
                                            setNameInputs((prev) => ({
                                                ...prev,
                                                [meal.id]: meal.name || `Meal ${meal.meal_number}`,
                                            }));
                                        }}
                                        className={styles.editBtn}
                                        title="Edit name"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            )}
                            <button onClick={() => handleDeleteMeal(meal.id)} className={styles.deleteMealBtn}>🗑</button>
                        </div>

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
                                {getItemsForMeal(meal.id).map(item => (
                                    <tr key={item.id}>
                                        <td data-label="Date">{new Date(item.date).toLocaleString('lt-LT')}</td>
                                        <td data-label="Product">{item.product_name}</td>
                                        <td data-label="Amount">{item.amount} g</td>
                                        <td data-label="Proteins">{item.proteins}</td>
                                        <td data-label="Carbs">{item.carbs}</td>
                                        <td data-label="Fats">{item.fats}</td>
                                        <td data-label="Calories">{item.calories}</td>
                                        <td data-label="Actions">
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className={styles.deleteBtn}
                                                title="Delete"
                                            >
                                                ✖
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <MealForm mealId={meal.id} onSuccess={handleRefresh} />
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <button onClick={handleAddMeal} className="btn-primary">➕ Add new meal</button>

            <div className={styles.summaryBox}>
                <p>
                    <strong>Total today:</strong>
                    &nbsp;&nbsp;🔹 Proteins: {totals.proteins}g
                    &nbsp;&nbsp;🔹 Carbs: {totals.carbs}g
                    &nbsp;&nbsp;🔹 Fats: {totals.fats}g
                    &nbsp;&nbsp;🔹 Calories: {totals.calories} kcal
                </p>
            </div>
        </section>
    );
}
