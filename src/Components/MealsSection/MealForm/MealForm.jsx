import styles from './MealForm.module.scss';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function MealForm({ mealId, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
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
        if (selectedProduct && amount) {
            const factor = Number(amount) / 100;

            setCalculated({
                proteins: (selectedProduct.proteins * factor).toFixed(2),
                carbs: (selectedProduct.carbs * factor).toFixed(2),
                fats: (selectedProduct.fats * factor).toFixed(2),
                calories: (selectedProduct.calories * factor).toFixed(2),
            });
        } else {
            setCalculated(null);
        }
    }, [selectedProduct, amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !amount || !mealId) return;

        try {
            await axios.post('http://localhost:5000/api/meal-items', {
                product_id: selectedProduct.id,
                amount: Number(amount),
                meal_id: mealId
            }, {
                withCredentials: true
            });

            setSelectedProduct(null);
            setAmount('');
            setCalculated(null);
            onSuccess && onSuccess();
        } catch (err) {
            console.error('Error while adding a product:', err);
        }
    };

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name,
        ...product,
    }));

    return (
        <>
            <tr className={styles.formRow}>
                <td data-label=""></td>

                <td data-label="Product:">
                    <Select
                        className={styles.reactSelect}
                        classNamePrefix="select"
                        options={productOptions}
                        value={selectedProduct}
                        onChange={(selected) => setSelectedProduct(selected)}
                        placeholder="Select product"
                        isClearable
                    />
                </td>

                <td data-label="Amount:">
                    <input
                        className={styles.tableInput}
                        type="number"
                        placeholder="g / ml"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </td>

                <td data-label="Proteins:" className={styles.previewValue}>{calculated?.proteins || ''}g</td>
                <td data-label="Carbs:" className={styles.previewValue}>{calculated?.carbs || ''}g</td>
                <td data-label="Fats:" className={styles.previewValue}>{calculated?.fats || ''}g</td>
                <td data-label="Calories:" className={styles.previewValue}>{calculated?.calories || ''} kcal</td>

                <td>
                    <button type="submit" className="btn-primary" onClick={handleSubmit}>Add</button>
                </td>
            </tr>
        </>
    );
}
