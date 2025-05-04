import express from 'express';
import { login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/login', login);

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;