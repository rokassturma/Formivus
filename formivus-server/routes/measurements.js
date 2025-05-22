import db from "../db/db.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/measurements", verifyToken, (req, res) => {
    const {
        date,
        chest_cm,
        bicep_cm,
        waist_narrow_cm,
        waist_wide_cm,
        hips_cm,
        leg_cm,
        weight_kg
    } = req.body;
    const userId = req.user.id;

    const query = `
    INSERT INTO user_measurements (user_id, date, chest_cm, bicep_cm, waist_narrow_cm, waist_wide_cm, hips_cm, leg_cm, weight_kg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    
    db.query(
        query,
        [userId, date, chest_cm, bicep_cm, waist_narrow_cm, waist_wide_cm, hips_cm, leg_cm, weight_kg],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            return res.status(200).json({ message: "Measurements saved" });
        }
    );
});

router.get("/measurements", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT *
        FROM user_measurements
        WHERE user_id = ?
        ORDER BY date DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        return res.status(200).json(results);
    });
});

router.delete("/measurements/:id", verifyToken, (req, res) => {
    const measurementId = req.params.id;
    const userId = req.user.id;

    const query =
        `
    DELETE FROM user_measurements
    WHERE id = ? AND user_id = ?
    `;

    db.query(query, [measurementId, userId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Measurement not found" });

        return res.status(200).json({ message: 'Measurement deleted' });
    });
});

export default router;
