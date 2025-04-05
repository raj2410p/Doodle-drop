import React from 'react';
import { useNavigate } from 'react-router-dom';

 export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav>
      <h2>notes app</h2>
      <ul>
        {!token && (
          <>
            <li onClick={() => navigate('/login')}>Login</li>
            <li onClick={() => navigate('/register')}>Register</li>
          </>
        )}
        {token && (
          <>
            {role === 'admin' && <li onClick={() => navigate('/admin')}>Admin</li>}
            {role === 'user' && <li onClick={() => navigate('/customer')}>Customer</li>}
            <li onClick={handleLogout}>Logout</li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
