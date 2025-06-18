import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
    getNote,
    getNotesByUser,
    createNote,
    updateNote,
    deleteNote
} from '../Controllers/noteController.js';

const router = express.Router();

// Get all notes of the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const notes = await getNotesByUser(req.user.id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
    }
});

// Get a single note, only if it belongs to the user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const note = await getNote(req.params.id);
        if (!note || note.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch note', error: error.message });
    }
});

// Create a new note for the logged-in user
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }
        const id = await createNote(title, body, req.user.id);
        res.status(201).json({ id, title, body, user_id: req.user.id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
});

// Update a note only if it belongs to the user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title && !body) {
            return res.status(400).json({ message: 'At least one of title or body is required' });
        }
        const note = await getNote(req.params.id);
        if (!note || note.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        const updatedTitle = title !== undefined ? title : note.title;
        const updatedBody = body !== undefined ? body : note.body;
        const updatedNote = await updateNote(req.params.id, updatedTitle, updatedBody);
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

// Delete a note only if it belongs to the user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const note = await getNote(req.params.id);
        if (!note || note.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        await deleteNote(req.params.id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

export default router;
