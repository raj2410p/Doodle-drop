import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
}

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization Header:", token); // Debug log to verify the token

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Ensure `SECRET_KEY` is correctly set
    console.log("Decoded Token:", decoded); // Debug log to verify the decoded token
    req.user = decoded; // Attach the decoded user to `req.user`
    next();
  } catch (err) {
    console.error("Token Verification Error:", err);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

export default authenticate;