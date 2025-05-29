import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../Database/database.js';
import dotenv from 'dotenv';
import { generateToken } from '../utils/jwtUtils.js';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
}

const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// controller to  Login user

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email, password);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User:', user);

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//middleware to verify token
 export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        const verified = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: verified.id,
            email: verified.email,
            roles: verified.role,
        };

        next();
    } catch (err) {
        console.error('Error verifying token:', err.message);
        res.status(400).json({ message: 'Invalid token' });
    }
};

 export const adminDashboard = (req, res) => {
    try {
        const adminData = {
            dashboardStats: {
                totalUsers: 1200,
                activeSessions: 350,
                totalNotes: 5000,
            },
            message: 'Welcome to the Admin Dashboard!',
        };

        res.status(200).json({
            message: 'Admin dashboard data fetched successfully',
            data: adminData,
        });
    } catch (error) {
        console.error('Error fetching admin dashboard:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

 export  const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const [emailRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (emailRows.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(sql, [name, email, hashedPassword]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 export const logoutUser = (req, res) => {
    res.clearCookie(token);
    res.status(200).json({ message: 'Logout successful' });
};

export  default{ loginUser, verifyToken, adminDashboard, createUser, logoutUser };