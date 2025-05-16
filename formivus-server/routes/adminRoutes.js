import express from 'express';
import db from '../db/db.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/admin/profiles', verifyToken, (req, res) => {
    const userId = req.user.id;

    const checkAdminQuery =
        `
    SELECT role FROM users WHERE id = ?
    `;

    db.query(checkAdminQuery, [userId], (err, data) => {
        if (err) return res.status(500).json({ message: 'Database error (admin check)' });

        if (!data.length || data[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const getProfilesQuery = 
        `
        SELECT
        users.email, users.username,
        user_profiles.age, user_profiles.height, user_profiles.weight,
        user_profiles.gender, user_profiles.activity_level
        FROM users
        LEFT JOIN user_profiles ON users.id = user_profiles.user_id
        `;

        db.query(getProfilesQuery, (err2, result) => {
            if (err2) return res.status(500).json({message: 'Failed to retrieve profiles.'});
            return res.status(200).json(result);
        });
    });
});

export default router;