import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { getNote, getNotes, createNote, updateNote, deleteNote } from '../Controllers/noteController.js';

const router = express.Router();
// Routes for notes
router.get('/', authenticateToken, async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const note = await getNote(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch note', error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }
        const id = await createNote(title, body);
        res.status(201).json({ id, title, body });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }
        const updatedNote = await updateNote(req.params.id, title, body);
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await deleteNote(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

export default router;