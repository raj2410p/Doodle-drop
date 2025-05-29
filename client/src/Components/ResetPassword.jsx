import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/reset-password', { email, newPassword });
      alert('Password reset successful!');
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Failed to reset password');
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Reset Password</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button type="submit">Reset</button>
    </form>
  );
};

export default ResetPassword;
