import express from 'express';
import { loginUser, logoutUser, createUser, adminDashboard, verifyToken } from '../Controllers/userAuthController.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import { updateProfile, getProfile, updateUserRole } from '../Controllers/userController.js';

const router = express.Router();

// Home route

// User authentication routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', createUser);

// User profile routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Update user role route
router.put('/:id/role', verifyToken, verifyRole('Admin'), async (req, res) => {
  const userId = req.params.id;
  const newRole = req.body.role;

  if (!newRole) {
    return res.status(400).json({ message: 'Role is required' });
  }

  if (userId === req.user.id) {
    return res.status(400).json({ message: 'You cannot update your own role' });
  }

  try {
    await updateUserRole(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin dashboard route
router.get('/admin', verifyToken, verifyRole('Admin'), adminDashboard);

export default router;