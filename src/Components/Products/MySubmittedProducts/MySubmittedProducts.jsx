import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MySubmittedProducts.module.scss";

export default function MySubmittedProducts({ refresh }) {
  const [products, setProducts] = useState([]);

  const fetch = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/submitted`,
        {
          withCredentials: true,
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch submitted error:", err);
    }
  };

  useEffect(() => {
    fetch();
  }, [refresh]);

  const getStatus = (p) => {
    if (p.is_approved === 1) return "Approved";
    if (p.is_approved === 0) return "Pending";
    return "Rejected";
  };

  const handleHide = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/hide/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Hide failed:", err);
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
            {products.map((p) => (
              <tr key={p.id}>
                <td data-label="Name">{p.name}</td>
                <td data-label="Proteins">{p.proteins}</td>
                <td data-label="Carbs">{p.carbs}</td>
                <td data-label="Fats">{p.fats}</td>
                <td data-label="Calories">{p.calories}</td>
                <td
                  className={styles[`status${getStatus(p)}`]}
                  data-label="Status"
                >
                  {getStatus(p)}
                </td>
                <td data-label="Actions">
                  {(p.is_approved === 1 || p.is_approved === 2) && (
                    <button
                      onClick={() => handleHide(p.id)}
                      className={styles["btn-hide"]}
                    >
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
