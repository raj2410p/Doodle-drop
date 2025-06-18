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
  const [showNotes, setShowNotes] = useState(true); // new toggle state

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
      alert('No token found. Please log in again.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/notes/${noteId}`, headers);
      fetchNotes();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const indexOfLast = currentPage * notesPerPage;
  const indexOfFirst = indexOfLast - notesPerPage;
  const currentNotes = notes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 className="text-2xl font-bold">User Dashboard - Notes</h2>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form className={`flex-1 transition-all duration-300  ${ showNotes ? "h-fit":"h-70 grid grid-cols-1  place-items-center justify-center overflow-y-auto "
} space-y-4 rounded-xl `} onSubmit={handleSubmit} style={{ marginBottom: '2rem',

       }}>
        <input
          className={`bg-white border-sky-900 bg-opacity-50 border-4 rounded-lg p-2 mb-2 min-w-9  ${ showNotes ? "h-fit":" h-20 w-7/12 place-items-center justify-center overflow-y-auto "}`}
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className={`bg-white border-sky-900 bg-opacity-50 border-4 rounded-lg p-2 mb-2 min-w-9 ${ showNotes ? "h-fit":"h-40 w-7/12 place-items-center justify-center overflow-y-auto"}`}
          name="body"
          placeholder="Body"
          value={form.body}
          onChange={handleChange}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-transparent text-white border-sky-900 border-2 hover:bg-white hover:text-gray-700 py-1 px-2 rounded"
          disabled={loading}
        >
          {editNoteId ? 'Update' : 'Add'} Note
        </button>
      </form>

      {/* Toggle button for notes grid */}
      <div className="text-center mb-4 w-fit h-fit ">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className=" flex  text-3xl bg-transparent p-1  border border-gray-900 focus:outline-none hover:bg-white hover:text-teal-800"
          title={showNotes ? 'Hide Notes' : 'Show Notes'}
        >
          <span className="material-symbols-outlined ">
            {showNotes ? 'expand_circle_up' : 'expand_circle_down'}
          </span>
          <p className="text-sm font-bold mb-2">
            Saved Notes
          </p>
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div>No notes available.</div>
      ) : (
        showNotes && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              paddingTop: '2rem'
            }}
          >
            {currentNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff1cc',
                  borderColor: '#655f4c',
                  borderWidth: '4px',
                }}
              >
                <h4>{note.title}</h4>
                <p>{note.body}</p>
                <button
                  className="bg-amber-700 text-white  hover:bg-amber-400 opacity-90 py-1 px-2 rounded"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className=" bg-red-500 text-white px-3 py-1 rounded hover:bg-rose-300 hover:text-white"
                  onClick={() => handleDelete(note.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Pagination */}
      <div className={`${showNotes ? '' : 'hidden'}`} style={{ marginTop: '1rem', textAlign: 'center' }}>
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
