import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'No login token' });
    }

    jwt.verify(token, 'JWT_SECRET_KEY', (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Wrong or expired token' });

        req.user = decoded;
        next();
    });
};