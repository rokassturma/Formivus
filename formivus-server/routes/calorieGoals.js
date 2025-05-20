import express from 'express';
import db from '../db/db.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.get("/", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = `SELECT goal_weight_kg FROM calorie_goals WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(200).json({ goal_weight_kg: null });
        }
    });
});


router.post("/", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { goal_weight_kg } = req.body;

    if (!goal_weight_kg) return res.status(400).json({ message: "Missing goal weight" });

    const checkQuery = `SELECT * FROM calorie_goals WHERE user_id = ?`;

    db.query(checkQuery, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            
            const updateQuery = `UPDATE calorie_goals SET goal_weight_kg = ? WHERE user_id = ?`;
            db.query(updateQuery, [goal_weight_kg, userId], (err) => {
                if (err) return res.status(500).json({ message: "Update error" });
                return res.status(200).json({ message: "Goal updated" });
            });
        } else {
        
            const insertQuery = `INSERT INTO calorie_goals (user_id, goal_weight_kg) VALUES (?, ?)`;
            db.query(insertQuery, [userId, goal_weight_kg], (err) => {
                if (err) return res.status(500).json({ message: "Insert error" });
                return res.status(200).json({ message: "Goal saved" });
            });
        }
    });
});

export default router;