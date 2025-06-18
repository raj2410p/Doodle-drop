import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/dashboard', headers);
      setUsers(res.data);
    } catch (err) {
      setError('Unauthorized or Server Error');
      console.error(err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
    setFormError('');
  };

  const handleUpdate = async (id) => {
    const { name, email, role } = form;
    if (!name || !email || !role) {
      setFormError('All fields are required.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/admin/users/${id}`, form, headers);
      setEditingUser(null);
      fetchUsers();
      setFormError('');
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${id}`, headers);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className=" bg-white bg-opacity-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-center font-bold text-blue-700">Admin Panel</h2>
       
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {formError && <p className="text-yellow-500 mb-2">{formError}</p>}

      <div className="overflow-x-auto ">
        <table className="min-w-full bg-white bg-opacity-50 rounded shadow">
          <thead className="bg-transparent ">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUser === user.id ? (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="email"
                      className="border rounded px-2 py-1 w-full"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser(null);
                        setFormError('');
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-transparent text-black border border-black px-3 py-1 rounded hover:bg-white hover:text-teal-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-white text-red-500 px-3 py-1 rounded hover:bg-rose-300 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
