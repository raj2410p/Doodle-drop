import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/verify-otp', { email, otp });
      alert('OTP verified!');
      navigate('/reset-password');
    } catch (err) {
      console.error(err);
      alert('Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verify OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default VerifyOtp;
