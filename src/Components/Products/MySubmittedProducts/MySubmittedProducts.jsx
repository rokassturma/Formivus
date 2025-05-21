import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MySubmittedProducts.module.scss';

export default function MySubmittedProducts({ refresh }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/submitted', {
                    withCredentials: true
                });
                setProducts(res.data);
            } catch (err) {
                console.error('Fetch submitted error:', err);
            }
        };
        fetch();
    }, [refresh]);


    const getStatus = (p) => {
        if (p.is_approved === 1) return 'Approved';
        if (p.is_approved === 0) return 'Pending';
        return 'Rejected';
    };

    return (
        <div className={styles.submittedBox}>
            <h3>Your Submitted Products</h3>
            {products.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <table className={styles.submittedTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Proteins</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                            <th>Calories</th>
                            <th>Status</th>
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
                                <td>{getStatus(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
