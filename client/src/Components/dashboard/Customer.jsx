import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Customer = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editNoteId, setEditNoteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  const token = localStorage.getItem('token');

  
axios.get('http://localhost:3001/api/users/dashboard', {
  headers: {
    Authorization: `Bearer ${token}`, 
  },
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    navigate('/login');
  });
  // Setup headers once
  // const headers = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/notes', headers);
      setNotes(res.data.reverse()); // reverse to show latest first
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editNoteId) {
        await axios.put(`http://localhost:3001/api/notes/${editNoteId}`, form, headers);
      } else {
        await axios.post('http://localhost:3001/api/notes', form, headers);
      }
      setForm({ title: '', content: '' });
      setEditNoteId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditNoteId(note._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/notes/${id}`, headers);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Pagination
  const indexOfLast = currentPage * notesPerPage;
  const indexOfFirst = indexOfLast - notesPerPage;
  const currentNotes = notes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Dashboard - Notes</h2>
      <button onClick={logout} style={{ marginBottom: '1rem' }}>Logout</button>

      {/* Add or Edit Note Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">{editNoteId ? 'Update' : 'Add'} Note</button>
      </form>

      {/* Notes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {currentNotes.map(note => (
          <div key={note._id} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note._id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            style={{
              margin: '0 0.25rem',
              backgroundColor: currentPage === index + 1 ? '#007BFF' : '#ddd',
              color: currentPage === index + 1 ? '#fff' : '#000',
              padding: '0.5rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Customer;
