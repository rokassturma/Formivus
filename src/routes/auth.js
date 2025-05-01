import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (username.length < 5) {
        return res.status(400).json({
            message: 'Username must be at least 5 characters long',
        });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const root = (str) => str.toLowerCase().substring(0, 5);
    const passwordLower = password.toLowerCase();
    const usernameRoot = root(username);
    const emailRoot = root(email);

    if (
        passwordLower.includes(usernameRoot) ||
        passwordLower.includes(emailRoot) ||
        usernameRoot.includes(passwordLower) ||
        emailRoot.includes(passwordLower)
    ) {
        return res.status(400).json({
            message: 'Password must not contain parts of your username or email',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|lt|org|net|edu|gov)$/i;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Email must end with .com, .lt, .org, .net, .edu or .gov',
        });
    }

    const checkUsername = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsername, [username], async (err, userResults) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (userResults.length > 0) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const checkEmail = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmail, [email], async (err, emailResults) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            if (emailResults.length > 0) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Username or email is already used' });
                    }
                    return res.status(500).json({ message: 'Registration failed' });
                }

                return res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields must be filled' });
    }

    const findUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        return res.status(200).json({
            message: `Welcome back, ${user.username}!`,
            username: user.username
        });
    });
});

export default router;
