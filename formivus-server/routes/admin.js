import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/admin-users', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({message: 'Welcome, admin'});
});

export default router;