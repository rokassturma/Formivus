import styles from "./AdminProductsSuggestions.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import NotificationMessage from "../../../Components/NotificationMessage/NotificationMessage";

export default function AdminProductsSuggestions() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchPending = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/pending`, {
        withCredentials: true,
      })
      .then((res) => setPending(res.data))
      .catch((err) => console.error("Fetch pending error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/approve`,
        { action },
        {
          withCredentials: true,
        }
      );

      setNotification({
        type: "success",
        message:
          action === "approve"
            ? "Product approved successfully"
            : "Product rejected",
      });

      setTimeout(() => setNotification(null), 5000);
      fetchPending();
    } catch (err) {
      console.error("Action error:", err);
      setNotification({
        type: "error",
        message: "Action failed",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) return <p>Loading suggestions...</p>;
  if (pending.length === 0) return <p>No suggestions pending.</p>;

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

      <div className={styles.suggestionsBox}>
        <h3>Pending Product Suggestions</h3>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Proteins</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Calories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.proteins}</td>
                  <td>{p.carbs}</td>
                  <td>{p.fats}</td>
                  <td>{p.calories}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles["btn-approve"]}
                        onClick={() => handleAction(p.id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className={styles["btn-reject"]}
                        onClick={() => handleAction(p.id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.cardsMobile}>
            {pending.map((p) => (
              <div className={styles.card} key={p.id}>
                <p>
                  <strong>Name:</strong> {p.name}
                </p>
                <p>
                  <strong>Proteins:</strong> {p.proteins}
                </p>
                <p>
                  <strong>Carbs:</strong> {p.carbs}
                </p>
                <p>
                  <strong>Fats:</strong> {p.fats}
                </p>
                <p>
                  <strong>Calories:</strong> {p.calories}
                </p>
                <div className={styles.actionButtons}>
                  <button
                    className={styles["btn-approve"]}
                    onClick={() => handleAction(p.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className={styles["btn-reject"]}
                    onClick={() => handleAction(p.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
