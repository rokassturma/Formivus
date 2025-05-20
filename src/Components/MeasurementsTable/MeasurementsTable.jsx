import styles from "./MeasurementsTable.module.scss";
import axios from "axios";

const MeasurementsTable = ({ measurements, onDelete }) => {
    if (!measurements.length) {
        return <p className={styles.noData}>Please enter measurements first to see the progress.</p>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.measurementsTable}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Chest</th>
                        <th>Bicep</th>
                        <th>Waist (narrow)</th>
                        <th>Waist (wide)</th>
                        <th>Hips</th>
                        <th>Leg</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {measurements.map((m) => (
                        <tr key={m.id}>
                            <td>{new Date(m.date).toLocaleDateString()}</td>
                            <td>{m.chest_cm} cm</td>
                            <td>{m.bicep_cm} cm</td>
                            <td>{m.waist_narrow_cm} cm</td>
                            <td>{m.waist_wide_cm} cm</td>
                            <td>{m.hips_cm} cm</td>
                            <td>{m.leg_cm} cm</td>
                            <td>
                                <button
                                    onClick={() => onDelete(m.id)}
                                    className={styles.deleteButton}
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MeasurementsTable;
