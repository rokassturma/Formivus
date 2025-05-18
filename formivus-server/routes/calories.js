import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/calories", verifyToken, (req, res) => {
    const { date, name, amount, calories } = req.body;
    const userId = req.user.id;

    const query = `
        INSERT INTO calories (user_id, date, name, amount, calories)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, date, name, amount, calories], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        return res.status(200).json({ message: "Entry saved" });
    });
});


router.get("/calories", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT * FROM calories
        WHERE user_id = ?
        ORDER BY date DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        return res.status(200).json(results);
    });
});

export default router;
