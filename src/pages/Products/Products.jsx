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
    const [search, setSearch] = useState('');


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

                    <ProductForm
                        onSuccess={() => {
                            setRefresh(!refresh);
                            setRefreshSubmitted(!refreshSubmitted);
                        }}
                    />

                    <MySubmittedProducts refresh={refreshSubmitted} />

                    <h1>Available Products</h1>
                    <p>The macronutrient values in the product table are based on <strong>100g / 100 ml</strong> of the product.</p>
                    <p>For example: 100g of avocado contains <strong>2g protein, 6g carbs, and 24g fats.</strong></p>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Search for a product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

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
                            {products
                                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                                .map(p => (
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
                </section>
            </div>

        </>

    );
}
