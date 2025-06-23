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
const FRONTEND_URL = 'https://doodle-drop-app-9d8bf42b718b.herokuapp.com/';
app.use(cors({
    origin: process.env.FRONTEND_URL || FRONTEND_URL, // front url
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
app.use('/api', otpRoutes);


// app.get('/', (req, res) => {
//     res.send('Doodle drop server is running');
// });


app.get('/api/users/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome, User!' });
});




// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!', message: err.message });
});
// Serve frontend
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});