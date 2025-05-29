// necessary imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import notesRoutes from './Routes/noteRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import otpRoutes from './Routes/otpRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173', // front url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Necessary routes for the application
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the Notes API 😊');
});


app.get('/api/users/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome, User!' });
});




// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!', message: err.message });
});
// Serve frontend
// Serve frontend
app.use(express.static(path.join(__dirname, "client/dist"))); // For Vite

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});