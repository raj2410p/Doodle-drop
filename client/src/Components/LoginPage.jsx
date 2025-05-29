import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/users/login', form);
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else navigate('/Customer');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <select name="role" value={form.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Login</button>

      {/* Forgot Password Link */}
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </form>
  );
};

export default LoginPage;
