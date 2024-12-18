import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
import roles from '../roles/roles.js';

dotenv.config();

const { sign } = pkg;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined');
}

const generateToken = (user) => {
  return sign(
    { id: user.id, roles: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export { generateToken };