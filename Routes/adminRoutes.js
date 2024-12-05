import express from 'express';
import Authenticate from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import * as adminController from '../Controllers/adminController.js';
import db from '../Database/database.js';

const router = express.Router();

// Admin dashboard: List all users
router.get('/dashboard', Authenticate, verifyRole('admin'), async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update user by ID
router.put('/users/:id', Authenticate, verifyRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name && !email && !role) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;

    const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [updatedFields, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete user by ID
router.delete('/users/:id', Authenticate, verifyRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;