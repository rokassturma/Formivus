import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.scss";
import axios from "axios";
import AdminProductsSuggestions from "./AdminProductsSuggestions/AdminProductsSuggestions";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin-users`, {
        withCredentials: true,
      })
      .then(() => setAuthorized(true))
      .catch(() => {
        navigate("/");
      });
  }, []);

  if (!authorized) {
    return <p style={{ textAlign: "center" }}>Checking admin access...</p>;
  }

  return (
    <main className={`${styles.adminWrapper} main-wrapper`}>
      <section className={styles.adminSection}>
        <h1>Welcome, Administrator,</h1>
        <h3>
          Here you can review food product suggestions submitted by users.
        </h3>
        <p>
          After checking the information, you can choose to approve or reject
          each item. Users will receive feedback based on your decision.
        </p>
        <AdminProductsSuggestions />
      </section>
    </main>
  );
}
