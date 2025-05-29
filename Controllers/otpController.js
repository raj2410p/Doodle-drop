import  pool  from '../Database/database.js';
import { generateToken } from '../utils/jwtUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/forgot-password
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

  try {
    // Store OTP
    await pool.query(
      'INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // set in .env
        pass: process.env.EMAIL_PASS, // set in .env
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE email = ? AND otp = ? AND expires_at > NOW()',
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    await pool.query('DELETE FROM password_resets WHERE email = ?', [email]); // Cleanup
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};