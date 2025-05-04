import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';


const app = express();
const PORT = 5000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening to http://localhost:${PORT}`);
});

