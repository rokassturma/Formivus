import styles from './MealsSection.module.scss';
import MealForm from './MealForm/MealForm';
import MealList from './MealList/MealList';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealsSection() {
    const [mealItems, setMealItems] = useState([]);

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

    useEffect(() => {
        fetchMealItems();
    }, []);

    return (
        <section className={styles.mealsSection}>
            <h1>My Meals</h1>

            <MealForm onSuccess={fetchMealItems} />

            <MealList items={mealItems} onUpdate={fetchMealItems} />
        </section>
    );
}
