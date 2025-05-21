import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MySubmittedProducts.module.scss';
import { AuthContext } from '../../../context/AuthContext';

export default function MySubmittedProducts({ refresh }) {

    const { currentUser } = useContext(AuthContext);

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

    const handleAction = async (id, action) => {
        try {
            await axios.put(
                `http://localhost:5000/api/products/${id}/approve`,
                { action },
                { withCredentials: true }
            );
            fetch();
        } catch (err) {
            console.error('Action failed:', err);
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
                           {/*  {
                                currentUser?.role === 'admin' && (
                                    <>
                                        <th>Action</th>
                                    </>

                                )} */}
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
                               {/*  <td>
                                    {getStatus(p) === 'Pending' && currentUser?.role === 'admin' && (
                                        <>
                                            <button
                                                className="btn-smalll btn-green"
                                                onClick={() => handleAction(p.id, 'approve')}
                                            >
                                                ✅
                                            </button>
                                            <button
                                                className="btn-smalll btn-red"
                                                onClick={() => handleAction(p.id, 'reject')}
                                            >
                                                ❌
                                            </button>
                                        </>
                                    )}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
