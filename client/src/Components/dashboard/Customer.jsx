import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Customer = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [editNoteId, setEditNoteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const notesPerPage = 10;

  const token = localStorage.getItem('token');
  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/notes', headers);
      setNotes(res.data.reverse());
    } catch (err) {
      console.error(err);
      navigate('/login');
    } finally {
      setLoading(false);
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
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and Body are required.');
      return;
    }

    try {
      setLoading(true);
      if (editNoteId) {
        await axios.put(`http://localhost:3001/api/notes/${editNoteId}`, form, headers);
      } else {
        await axios.post('http://localhost:3001/api/notes', form, headers);
      }
      setForm({ title: '', body: '' });
      setEditNoteId(null);
      setError('');
      await fetchNotes();
    } catch (err) {
      console.error(err);
      setError('Failed to save the note. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, body: note.body });
    setEditNoteId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (noteId) => {
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/notes/${noteId}`, headers);
      fetchNotes(); // Refresh list after deletion
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const indexOfLast = currentPage * notesPerPage;
  const indexOfFirst = indexOfLast - notesPerPage;
  const currentNotes = notes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notes.length / notesPerPage);
  

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Dashboard - Notes</h2>
      <button onClick={logout} style={{ marginBottom: '1rem' }}>Logout</button>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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
          name="body"
          placeholder="Body"
          value={form.body}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {editNoteId ? 'Update' : 'Add'} Note
        </button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {notes.length === 0 ? (
            <div>No notes available.</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem'
            }}>
              {currentNotes.map((note) => (
                <div key={note.id} style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}>
                  <h4>{note.title}</h4>
                  <p>{note.body}</p>
                  <button onClick={() => handleEdit(note)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

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
