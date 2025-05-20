import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT weight_kg, date
        FROM user_measurements
        WHERE user_id = ?
        ORDER BY date ASC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        return res.status(200).json(results);
    });
});



export default router;
