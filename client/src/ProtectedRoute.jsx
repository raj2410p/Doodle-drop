import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;

  // Case-insensitive check (optional, safer)
  if (roleRequired && role?.toLowerCase() == roleRequired.toLowerCase()) {
    return <Navigate to="/customer" />;
  }

  return children;
};

export default ProtectedRoute;
