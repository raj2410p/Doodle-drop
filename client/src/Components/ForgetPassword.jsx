import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/forgot-password', { email });
      localStorage.setItem('resetEmail', email);
      alert('OTP sent to your email!');
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit">Send OTP</button>
    </form>
  );
};

export default ForgotPassword;
