import { useContext, useEffect, useState } from "react";
import styles from "./Products.module.scss";
import axios from "axios";
import ProductForm from "../../Components/Products/ProductForm/ProductForm";
import MySubmittedProducts from "../../Components/Products/MySubmittedProducts/MySubmittedProducts";
import { AuthContext } from "../../context/AuthContext";
import NotificationMessage from "../../Components/NotificationMessage/NotificationMessage";

export default function Products() {
  const { currentUser } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshSubmitted, setRefreshSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    proteins: "",
    carbs: "",
    fats: "",
    calories: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            withCredentials: true,
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetch();
  }, [refresh]);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        withCredentials: true,
      });

      setNotification({
        type: "success",
        message: "Product deleted successfully",
      });

      setTimeout(() => setNotification(null), 5000);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Delete error:", err);
      setNotification({
        type: "error",
        message: "Failed to delete product",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const startEditing = (product) => {
    setEditProductId(product.id);
    setEditForm({
      name: product.name,
      proteins: product.proteins,
      carbs: product.carbs,
      fats: product.fats,
      calories: product.calories,
    });
  };

  const cancelEditing = () => {
    setEditProductId(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${editProductId}`,
        editForm,
        {
          withCredentials: true,
        }
      );
      setNotification({
        type: "success",
        message: "Product updated successfully",
      });
      setTimeout(() => setNotification(null), 5000);
      setEditProductId(null);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Edit error:", err);
      setNotification({
        type: "error",
        message: "Failed to update product",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <>
      {notification && (
        <div className="notificationWrapper">
          <NotificationMessage
            type={notification.type}
            message={notification.message}
          />
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
          <p>
            The macronutrient values in the product table are based on{" "}
            <strong>100g / 100 ml</strong> of the product.
          </p>
          <p>
            For example: 100g of avocado contains{" "}
            <strong>2g protein, 6g carbs, and 24g fats.</strong>
          </p>
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
                {currentUser?.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id}>
                    <td data-label="Name">
                      {editProductId === p.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td data-label="Proteins (g)">
                      {editProductId === p.id ? (
                        <input
                          type="number"
                          value={editForm.proteins}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              proteins: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.proteins
                      )}
                    </td>
                    <td data-label="Carbs (g)">
                      {editProductId === p.id ? (
                        <input
                          type="number"
                          value={editForm.carbs}
                          onChange={(e) =>
                            setEditForm({ ...editForm, carbs: e.target.value })
                          }
                        />
                      ) : (
                        p.carbs
                      )}
                    </td>
                    <td data-label="Fats (g)">
                      {editProductId === p.id ? (
                        <input
                          type="number"
                          value={editForm.fats}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fats: e.target.value })
                          }
                        />
                      ) : (
                        p.fats
                      )}
                    </td>
                    <td data-label="Calories (kcal)">
                      {editProductId === p.id ? (
                        <input
                          type="number"
                          value={editForm.calories}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              calories: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.calories
                      )}
                    </td>
                    {currentUser?.role === "admin" && (
                      <td data-label="Actions">
                        {editProductId === p.id ? (
                          <>
                            <button
                              className="btn-smalll btn-green"
                              onClick={saveEdit}
                            >
                              💾
                            </button>
                            <button
                              className="btn-smalll btn-red"
                              onClick={cancelEditing}
                            >
                              ❌
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-smalll btn-blue"
                              onClick={() => startEditing(p)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-smalll btn-red"
                              onClick={() => deleteProduct(p.id)}
                            >
                              ❌
                            </button>
                          </>
                        )}
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
