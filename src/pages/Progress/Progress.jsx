import { useEffect, useState } from "react";
import AddMeasurementsForm from "../../Components/AddMeasurementsForm/AddMeasurementsForm";
import MeasurementsTable from "../../Components/MeasurementsTable/MeasurementsTable";
import ProgressChart from "../../Components/ProgressChart/ProgressChart";
import styles from "./Progress.module.scss";
import axios from "axios";

const Progress = () => {
    const [measurements, setMeasurements] = useState([]);

    const fetchMeasurements = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/measurements", {
                withCredentials: true,
            });
            setMeasurements(res.data.reverse());
        } catch (err) {
            console.error("Error fetching measurements:", err.message);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/measurements/${id}`, {
                withCredentials: true,
            });
            setMeasurements((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Delete failed:", err.message);
        }
    };


    return (
        <div className={styles.progressWrapper}>
            <h1>Progress Tracking</h1>
            <p className={styles.description}>
                Track your body measurements over time. Add new data and monitor your progress.
            </p>
            <div className={styles.formAndTableWrapper}>
                <AddMeasurementsForm onSuccess={fetchMeasurements} />
                <MeasurementsTable measurements={measurements} onDelete={handleDelete} />
            </div>
            <ProgressChart measurements={measurements} />
        </div>
    );
};

export default Progress;
