import styles from "./MealsPrintView.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MealsPrintView() {
  const [meals, setMeals] = useState([]);
  const [mealItems, setMealItems] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const resMeals = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/meals`,
        { withCredentials: true }
      );
      const resItems = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/meal-items`,
        {
          withCredentials: true,
        }
      );
      setMeals(resMeals.data);
      setMealItems(resItems.data);
    };
    fetchAll();
  }, []);

  const getItemsForMeal = (mealId) =>
    mealItems.filter((item) => item.meal_id === mealId);

  const calculateTotals = () => {
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalCalories = 0;

    mealItems.forEach((item) => {
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

  const totals = calculateTotals();

  return (
    <div className={styles.printWrapper}>
      <h1 className={styles.title}>Meals Tracker Overview</h1>

      {meals.map((meal) => (
        <div key={meal.id} className={styles.mealBlock}>
          <h2 className={styles.mealName}>
            {meal.name || `Meal ${meal.meal_number}`}
          </h2>
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
              </tr>
            </thead>
            <tbody>
              {getItemsForMeal(meal.id).map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.date).toLocaleDateString("lt-LT")}</td>
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

      <div className={styles.summaryBox}>
        <p>
          <strong>Total today:</strong>
          &nbsp;&nbsp;🔹 Proteins: {totals.proteins}g &nbsp;&nbsp;🔹 Carbs:{" "}
          {totals.carbs}g &nbsp;&nbsp;🔹 Fats: {totals.fats}g &nbsp;&nbsp;🔹
          Calories: {totals.calories} kcal
        </p>
      </div>
    </div>
  );
}
