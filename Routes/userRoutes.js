import express from 'express';
import { loginUser, logoutUser, createUser, adminDashboard, verifyToken } from '../Controllers/userAuthController.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import { updateProfile, getProfile } from '../Controllers/userController.js';

const router = express.Router();

// User authentication routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', createUser);

// User profile routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Admin dashboard route
router.get('/admin', verifyToken, verifyRole('admin'), adminDashboard);

export default router;