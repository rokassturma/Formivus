import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MySubmittedProducts.module.scss';


export default function MySubmittedProducts({ refresh }) {



    const [products, setProducts] = useState([]);

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

    useEffect(() => {
        fetch();
    }, [refresh]);

    const getStatus = (p) => {
        if (p.is_approved === 1) return 'Approved';
        if (p.is_approved === 0) return 'Pending';
        return 'Rejected';
    };

    const handleHide = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/products/hide/${id}`, {}, {
                withCredentials: true
            });
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Hide failed:', err);
        }
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
                            <th>Actions</th>
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
                                <td className={styles[`status${getStatus(p)}`]}>
                                    {getStatus(p)}
                                </td>
                                <td>
                                    {(p.is_approved === 1 || p.is_approved === 2) && (
                                        <button onClick={() => handleHide(p.id)} className={styles['btn-hide']}>
                                            Hide
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
