import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from './src/routes/auth.js';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get("/", (req, res) => {
    res.send("Backend works!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is working at http://localhost:${PORT}`);
});