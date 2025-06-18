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
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete any previous OTPs for this email
    await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

    // Store OTP
    await pool.query(
      'INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"DoodleDrop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'DoodleDrop: Your OTP for Password Reset',
       html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Notes Application</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing DoodleDrop. Use the following OTP to complete your Password Recovery Procedure. Your Otp is here:</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />DoodleDrop</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>DoodleDrop .co</p>
      <p>26029 Lucknow ,Uttar Pradesh</p>
      <p>India</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
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

    // Delete OTP after successful verification to prevent reuse
    await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

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
    console.error(error); // <-- Add this to log the exact issue
    res.status(500).json({ message: 'Error resetting password' });
  }
};
