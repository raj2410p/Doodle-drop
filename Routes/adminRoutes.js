import express from 'express';
import Authenticate from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import db from '../Database/database.js';
import { createUser } from '../Controllers/userAuthController.js';

const router = express.Router();
// basic admin routes.
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Default role to 'User', or assign 'Admin' if specified
  const userRole = role === 'Admin' ? 'Admin' : 'User';

  try {
    await createUser({ body: { name, email, password, role: userRole } }, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

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
    console.log(`Attempting to delete user with ID: ${id}`); // Add logging for debugging

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log(`User with ID: ${id} not found`); // Add logging for debugging
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User with ID: ${id} deleted successfully`); // Add logging for debugging
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(`Error deleting user with ID: ${id}`, err); // Add logging for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;