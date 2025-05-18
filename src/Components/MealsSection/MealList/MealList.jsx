import styles from './MealList.module.scss';
import axios from 'axios';

export default function MealList({ items, onUpdate }) {
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/meal-items/${id}`, {
                withCredentials: true
            });
            onUpdate && onUpdate();
        } catch (err) {
            console.error('Error while deleting an entry:', err);
        }
    };

    if (!items.length) {
        return <p className={styles.noItems}>No meals added today.</p>;
    }

    return (
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
                                    onClick={() => handleDelete(item.id)}
                                >
                                    ✖
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
