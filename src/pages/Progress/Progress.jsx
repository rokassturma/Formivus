import { useEffect, useState } from "react";
import axios from 'axios';
import AddMeasurementsForm from "../../Components/AddMeasurementsForm/AddMeasurementsForm";
import MeasurementsTable from "../../Components/MeasurementsTable/MeasurementsTable";
import ProgressChart from '../../Components/ProgressChart/ProgressChart';
import styles from './Progress.module.scss';

export default function ProgressSection() {

    const [measurements, setMeasurements] = useState([]);

    const fetchMeasurements = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/measurements", {
                withCredentials: true,
            });
            setMeasurements(res.data);
        } catch (err) {
            console.error("Failed to fetch measurements", err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/measurements/${id}`, {
                withCredentials: true,
            });
            setMeasurements((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Delete failed", err.message);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);



    return (
        <div className={styles.progressWrapper}>
            <h1>My Progress</h1>
            <p className={styles.description}>Track your body measurements and visualize your progress over time.</p>

            <div className={styles.formAndTableWrapper}>
                <AddMeasurementsForm onSuccess={fetchMeasurements} />
                <MeasurementsTable measurements={measurements} onDelete={handleDelete} />
            </div>

            <ProgressChart measurements={measurements} />
        </div>
    )
}
