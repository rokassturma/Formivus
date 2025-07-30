import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import adminRoute from "./routes/admin.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import measurementsRoutes from "./routes/measurements.js";
import mealItemsRoutes from "./routes/mealItems.js";
import mealsRoutes from "./routes/meals.js";
import productsRoutes from "./routes/products.js";
import progressRoutes from "./routes/progress.js";
import calorieGoalsRoutes from "./routes/calorieGoals.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://formivus.heyrokas.tech/",
    credentials: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", adminRoute);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", measurementsRoutes);
app.use("/api", mealItemsRoutes);
app.use("/api", mealsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/calorie-goals", calorieGoalsRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});
