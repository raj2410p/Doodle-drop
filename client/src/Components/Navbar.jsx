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
    <nav className="bg-white opacity-60 rounded-xl  text-gray-800 px-6 py-3 flex flex-wrap  justify-between items-center shadow-md mb-4">
      <h2
        className="text-xl font-bold cursor-pointer  hover:bg-gray-300 px-2 py-1 rounded"
        onClick={() => navigate('/')}
      >
        <img src="./src/assets/favicon.ico" alt="DoodleDrop" className="inline-block mr-2 h-5" />
        DoodleDrop
      </h2>

      <ul className="flex space-x-6 font-medium sm:text-sm sm:items-center sm:justify-center  sm:flex-wrap sm:align-center">
        {!token ? (
          <>
            <li
              className="cursor-pointer  hover:bg-gray-300 px-2 py-1 rounded"
              onClick={() => navigate('/login')}
            >
              Login
            </li>
            <li
              className="cursor-pointer hover:bg-gray-300 px-2 py-1 rounded"
              onClick={() => navigate('/register')}
            >
              Register
            </li>
          </>
        ) : (
          <>
            {role === 'admin' && (
              <li
                className="cursor-pointer   hover:bg-gray-300 px-2 py-1 rounded"
                onClick={() => navigate('/admin')}
              >
                Admin
              </li>
            )}
            {role === 'user' && (
              <li
                className="cursor-pointer hover:bg-gray-300 px-2 py-1 rounded"
                onClick={() => navigate('/customer')}
              >
                Customer
              </li>
            )}
            <li
              className="cursor-pointer hover:bg-gray-300 px-2 py-1 rounded"
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
