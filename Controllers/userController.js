import db from '../Database/database.js';
import bcrypt from 'bcrypt';

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({ user });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) {
      // Check if the new email is already in use
      const [emailRows] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (emailRows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      updatedFields.email = email;
    }
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    await db.query('UPDATE users SET ? WHERE id = ?', [updatedFields, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user role (for admin only)
const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error('Error updating user role:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export { getProfile, updateProfile, updateUserRole };