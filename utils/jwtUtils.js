import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { sign } = pkg;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
}

const generateToken = (user) => {
    if (!user || !user.id || !user.role) {
        throw new Error('User object must have id and role properties');
    }
    return sign(
        { id: user.id, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
};

export { generateToken };