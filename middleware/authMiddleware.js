import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
}

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Read token from the Authorization header
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
  
    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Decode token
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (error) {
        console.error('Token Verification Error:', error.message); // Debugging log
        res.status(403).json({ message: 'Invalid Token', error: error.message });
    }
};

export default authenticate;