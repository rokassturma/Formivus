import styles from './MealsSection.module.scss';
import MealForm from './MealForm/MealForm';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealsSection() {
    const [meals, setMeals] = useState([]);
    const [mealItems, setMealItems] = useState([]);

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
            console.error('Error while fetching meals:', err);
        }
    };

    const fetchMealItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/meal-items', {
                withCredentials: true
            });
            setMealItems(res.data);
        } catch (err) {
            console.error('Error while fetching meal items:', err);
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

    useEffect(() => {
        handleRefresh();
    }, []);

    const getItemsForMeal = (mealId) => {
        return mealItems.filter(item => item.meal_id === mealId);
    };

    return (
        <section className={styles.mealsSection}>
            <h1>My Meals</h1>
            <button onClick={handleAddMeal} className="btn-primary">➕ Add new meal</button>

            <div className={styles.mealsWrapper}>
                {meals.map(meal => (
                    <div key={meal.id} className={styles.mealBlock}>
                        <div className={styles.mealHeader}>
                            <h2>Meal {meal.meal_number}</h2>
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
                                        <td>{new Date(item.date).toLocaleString('lt-LT')}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.amount} g</td>
                                        <td>{item.proteins}</td>
                                        <td>{item.carbs}</td>
                                        <td>{item.fats}</td>
                                        <td>{item.calories}</td>
                                        <td>
                                            <button onClick={() => handleDeleteItem(item.id)} className={styles.deleteBtn}>✖</button>
                                        </td>
                                    </tr>
                                ))}
                                <MealForm mealId={meal.id} onSuccess={handleRefresh} />
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </section>

    );
}
