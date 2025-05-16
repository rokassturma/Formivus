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
        users.email, users.username, users.role,
        user_profiles.age, user_profiles.height, user_profiles.weight,
        user_profiles.gender, user_profiles.activity_level
        FROM users
        LEFT JOIN user_profiles ON users.id = user_profiles.user_id
        `;

        db.query(getProfilesQuery, (err2, result) => {
            if (err2) return res.status(500).json({ message: 'Failed to retrieve profiles.' });
            return res.status(200).json(result);
        });
    });
});

router.put('/admin/toggle-role', verifyToken, (req, res) => {
    const adminId = req.user.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }


    const checkAdminQuery = 'SELECT role, email FROM users WHERE id = ?';

    db.query(checkAdminQuery, [adminId], (err, adminResult) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const admin = adminResult[0];
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (admin.email === email) {
            return res.status(403).json({ message: 'You cannot change your own role.' });
        }


        const getUserQuery = 'SELECT role FROM users WHERE email = ?';

        db.query(getUserQuery, [email], (err2, userResult) => {
            if (err2) return res.status(500).json({ message: 'Database error (user)' });

            if (!userResult.length) {
                return res.status(404).json({ message: 'User not found' });
            }

            const currentRole = userResult[0].role;
            const newRole = currentRole === 'admin' ? 'user' : 'admin';

            const updateQuery = 'UPDATE users SET role = ? WHERE email = ?';

            db.query(updateQuery, [newRole, email], (err3) => {
                if (err3) return res.status(500).json({ message: 'Failed to update role' });

                return res.status(200).json({ message: `Role updated to ${newRole}` });
            });
        });
    });
});

router.delete('/admin/delete-user', verifyToken, (req, res) => {
    const adminId = req.user.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const getAdminQuery = 'SELECT email, role FROM users WHERE id = ?';

    db.query(getAdminQuery, [adminId], (err, adminResult) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const admin = adminResult[0];
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete users' });
        }

        if (admin.email === email) {
            return res.status(403).json({ message: 'You cannot delete your own account' });
        }

        const deleteUserQuery = 'DELETE FROM users WHERE email = ?';
        db.query(deleteUserQuery, [email], (err2) => {
            if (err2) return res.status(500).json({ message: 'Failed to delete user' });

            return res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});



export default router;