import { useContext, useEffect, useState } from 'react';
import styles from './Products.module.scss';
import axios from 'axios';
import ProductForm from "../../Components/Products/ProductForm/ProductForm";
import MySubmittedProducts from "../../Components/Products/MySubmittedProducts/MySubmittedProducts";
import { AuthContext } from '../../context/AuthContext';
import NotificationMessage from "../../Components/NotificationMessage/NotificationMessage";


export default function Products() {

    const { currentUser } = useContext(AuthContext);

    const [products, setProducts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [refreshSubmitted, setRefreshSubmitted] = useState(false);

    const [notification, setNotification] = useState(null);

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

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                withCredentials: true
            });

            setNotification({
                type: 'success',
                message: 'Product deleted successfully'
            });

            setTimeout(() => setNotification(null), 5000);
            setRefresh(prev => !prev);
        } catch (err) {
            console.error('Delete error:', err);
            setNotification({
                type: 'error',
                message: 'Failed to delete product'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };


    return (

        <>

            {notification && (
                <div className="notificationWrapper">
                    <NotificationMessage type={notification.type} message={notification.message} />
                </div>
            )}


            <div className="main-wrapper">
                <section className={styles.productsBox}>
                    <h1>Available Products</h1>

                    <table className={styles.productsTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Proteins (g)</th>
                                <th>Carbs (g)</th>
                                <th>Fats (g)</th>
                                <th>Calories (kcal)</th>
                                {currentUser?.role === 'admin' && <th>Actions</th>}
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
                                    {currentUser?.role === 'admin' && (
                                        <td>
                                            <button
                                                className="btn-smalll btn-red"
                                                onClick={() => deleteProduct(p.id)}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <ProductForm
                        onSuccess={() => {
                            setRefresh(!refresh);
                            setRefreshSubmitted(!refreshSubmitted);
                        }}
                    />

                    <MySubmittedProducts refresh={refreshSubmitted} />

                </section>
            </div>

        </>

    );
}
