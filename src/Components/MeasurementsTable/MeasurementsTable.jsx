import styles from "./MeasurementsTable.module.scss";

const MeasurementsTable = ({ measurements, onDelete }) => {
    if (!measurements.length) {
        return <p className={styles.noData}>Please enter measurements to see the progress.</p>;
    }

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.heading}>Measurements History</h2>
            <p className={styles.p1}>Please note that all measurements are provided in (cm).</p>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Chest</th>
                        <th>Bicep</th>
                        <th>Waist (N)</th>
                        <th>Waist (W)</th>
                        <th>Hips</th>
                        <th>Leg</th>
                        <th>Weight</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {measurements.map((m) => (
                        <tr key={m.id}>
                            <td>{new Date(m.date).toLocaleDateString("lt-LT")}</td>
                            <td>{m.chest_cm}</td>
                            <td>{m.bicep_cm}</td>
                            <td>{m.waist_narrow_cm}</td>
                            <td>{m.waist_wide_cm}</td>
                            <td>{m.hips_cm}</td>
                            <td>{m.leg_cm}</td>
                            <td>{m.weight_kg}</td>
                            <td>
                                <button
                                    onClick={() => onDelete(m.id)}
                                    className={styles.deleteButton}
                                    title="Delete entry"
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
