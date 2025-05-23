import styles from './MealsPrintView.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MealsPrintView() {
    const [meals, setMeals] = useState([]);
    const [mealItems, setMealItems] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const resMeals = await axios.get('http://localhost:5000/api/meals', { withCredentials: true });
            const resItems = await axios.get('http://localhost:5000/api/meal-items', { withCredentials: true });
            setMeals(resMeals.data);
            setMealItems(resItems.data);
        };
        fetchAll();
    }, []);

    const getItemsForMeal = (mealId) => mealItems.filter(item => item.meal_id === mealId);

    return (
        <div className={styles.printPage}>
            <h1>My Meals Overview</h1>

            {meals.map(meal => (
                <div key={meal.id} className={styles.mealBlock}>
                    <h2>{meal.name || `Meal ${meal.meal_number}`}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Proteins</th>
                                <th>Carbs</th>
                                <th>Fats</th>
                                <th>Calories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemsForMeal(meal.id).map(item => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date).toLocaleDateString('lt-LT')}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.amount} g</td>
                                    <td>{item.proteins}</td>
                                    <td>{item.carbs}</td>
                                    <td>{item.fats}</td>
                                    <td>{item.calories}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
