import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/meals", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = `
    SELECT * FROM meals
    WHERE user_id = ?
    ORDER BY date DESC
  `;

    db.query(query, [userId], (err, data) => {
        if (err) return res.status(500).json({ message: "Database error" });
        return res.status(200).json(data);
    });
});

router.post("/meals", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { meal_number } = req.body;

    if (!meal_number) {
        return res.status(400).json({ message: "Meal number is required" });
    }

    const query = `
    INSERT INTO meals (user_id, date, meal_number)
    VALUES (?, NOW(), ?)
  `;

    db.query(query, [userId, meal_number], (err, result) => {
        if (err) return res.status(500).json({ message: "Insert error" });
        return res.status(200).json({ message: "Meal created", id: result.insertId });
    });
});

router.delete("/meals/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM meals WHERE id = ?`;

    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: "Delete error" });
        return res.status(200).json({ message: "Meal deleted" });
    });
});

export default router;
