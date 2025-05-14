import db from "../db/db.js";
import express from 'express';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/profile', verifyToken, (req, res) => {
    const { gender, age, height, weight, activity_level } = req.body;
    const userId = req.user.id;

    const checkQuery =
        `
    SELECT * 
    FROM user_profiles
    WHERE user_id = ?
    `;
    db.query(checkQuery, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (result.length > 0) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        const insertQuery =
            `
        INSERTO INTO user_profiles
        (user_id, gender, age, height, weight, activity_level)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [userId, gender, age, height, weight, activity_level], (err2) => {
            if (err2) return res.status(500).json({ message: 'Failed to save profile' });
            return res.status(201).json({ message: 'Profile created successfully' });
        });
    });
});

router.get('/profile', verifyToken, (req, res) => {
    const userId = req.user.id;

    const q = 'SELECT gender, age, height, weight, activity_level FROM user_profiles WHERE user_id = ?';

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (data.length === 0) return res.status(404).json({ message: 'Profile not found' });

        res.status(200).json(data[0]);
    });
});

export default router;
