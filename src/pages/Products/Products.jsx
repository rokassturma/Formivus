import { useEffect, useState } from 'react';
import styles from './Products.module.scss';
import axios from 'axios';

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products', {
                    withCredentials: true
                });
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };
        fetch();
    }, []);

    return (
        <div className="main-wrapper">
            <section className={styles.productsBox}>
                <h1>Available Products</h1>

                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <table className={styles.productsTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Proteins (g)</th>
                                <th>Carbs (g)</th>
                                <th>Fats (g)</th>
                                <th>Calories (kcal)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.proteins}</td>
                                    <td>{p.carbs}</td>
                                    <td>{p.fats}</td>
                                    <td>{p.calories}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
