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
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h2
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        Notes App
      </h2>
      <ul className="flex space-x-6 font-medium">
        {!token ? (
          <>
            <li
              className="cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >
              Login
            </li>
            <li
              className="cursor-pointer hover:underline"
              onClick={() => navigate('/register')}
            >
              Register
            </li>
          </>
        ) : (
          <>
            {role === 'admin' && (
              <li
                className="cursor-pointer hover:underline"
                onClick={() => navigate('/admin')}
              >
                Admin
              </li>
            )}
            {role === 'user' && (
              <li
                className="cursor-pointer hover:underline"
                onClick={() => navigate('/customer')}
              >
                Customer
              </li>
            )}
            <li
              className="cursor-pointer hover:underline"
              onClick={handleLogout}
            >
              Logout
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
