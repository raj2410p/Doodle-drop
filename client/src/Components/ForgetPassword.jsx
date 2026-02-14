import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://doodle-drop-app-9d8bf42b718b.herokuapp.com/api/forgot-password', { email });
      localStorage.setItem('resetEmail', email);
      alert('OTP sent to your email!');
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent"style={{ minHeight: 'inherit' }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white opacity-80 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Forgot Password</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
