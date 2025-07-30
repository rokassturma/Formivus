import { useState } from "react";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import NotificationMessage from "../NotificationMessage/NotificationMessage";
import styles from "./AddMeasurementsForm.module.scss";

export default function AddMeasurementsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    date: "",
    chest_cm: "",
    bicep_cm: "",
    waist_narrow_cm: "",
    waist_wide_cm: "",
    hips_cm: "",
    leg_cm: "",
    weight_kg: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    text: "",
    type: "",
    fading: false,
  });

  function showMessage(text, type = "error") {
    setNotification({ text, type, fading: false });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, fading: true }));
    }, 4500);

    setTimeout(() => {
      setNotification({ text: "", type: "", fading: false });
    }, 5000);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ text: "", type: "", fading: false });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/measurements`,
        formData,
        { withCredentials: true }
      );

      showMessage(res.data.message, "success");
      onSuccess && onSuccess();

      setFormData({
        date: "",
        chest_cm: "",
        bicep_cm: "",
        waist_narrow_cm: "",
        waist_wide_cm: "",
        hips_cm: "",
        leg_cm: "",
        weight_kg: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Error occurred";
      showMessage(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {notification.text && (
        <div className="notificationWrapper">
          <NotificationMessage
            message={notification.text}
            type={notification.type}
            fading={notification.fading}
          />
        </div>
      )}

      <h2 className={styles.heading}>Add New Measurement</h2>

      {isLoading ? (
        <Spinner />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.gridWrapper}>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            {[
              "chest_cm",
              "bicep_cm",
              "waist_narrow_cm",
              "waist_wide_cm",
              "hips_cm",
              "leg_cm",
            ].map((field) => (
              <div className={styles.formGroup} key={field}>
                <label>{field.replace(/_/g, " ").replace("cm", "(cm)")}</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  step="0.01"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">
            Save Measurements
          </button>
        </form>
      )}
    </div>
  );
}
