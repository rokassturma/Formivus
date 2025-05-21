import { useEffect, useState } from 'react';
import styles from './Products.module.scss';
import axios from 'axios';
import ProductForm from "../../Components/Products/ProductForm/ProductForm";
import MySubmittedProducts from "../../Components/Products/MySubmittedProducts/MySubmittedProducts";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [refreshSubmitted, setRefreshSubmitted] = useState(false);


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
    }, [refresh]);

    return (
        <div className="main-wrapper">
            <section className={styles.productsBox}>
                <h1>Available Products</h1>


                <ProductForm
                    onSuccess={() => {
                        setRefresh(!refresh);
                        setRefreshSubmitted(!refreshSubmitted);
                    }}
                />

                <MySubmittedProducts refresh={refreshSubmitted} />


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
            </section>
        </div>
    );
}
