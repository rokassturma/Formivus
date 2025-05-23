import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./ProgressChart.module.scss";


Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const measurementOptions = [
  { value: "chest_cm", label: "Chest (cm)" },
  { value: "bicep_cm", label: "Bicep (cm)" },
  { value: "waist_narrow_cm", label: "Waist (narrow) (cm)" },
  { value: "waist_wide_cm", label: "Waist (wide) (cm)" },
  { value: "hips_cm", label: "Hips (cm)" },
  { value: "leg_cm", label: "Leg (cm)" },
  { value: "weight_kg", label: "Weight (kg)" }
];

const ProgressChart = ({ measurements }) => {
  const [selectedField, setSelectedField] = useState("waist_narrow_cm");

  if (!measurements.length) return <p className={styles.noData}>Please enter measurements first to see the progress.</p>;

  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const data = {
    labels: sorted.map((m) =>
      new Date(m.date).toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    ),
    datasets: [
      {
        label: measurementOptions.find(opt => opt.value === selectedField)?.label || "",
        data: sorted.map((m) => m[selectedField]),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        title: { display: true, text: "cm" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return (
    <main className="main-wrapper">
      <section className={styles.chartBox}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Progress Chart</h2>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className={styles.select}
          >
            {measurementOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Line data={data} options={options} />
      </section>
    </main>
  );
};

export default ProgressChart;
