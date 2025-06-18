import pool from '../Database/database.js';

// ✅ Get all notes for a specific user
export async function getNotesByUser(userId) {
    try {
        const [rows] = await pool.query('SELECT * FROM notes WHERE user_id = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching notes by user:', error);
        throw error;
    }
}

// ✅ Get a single note by its ID
export async function getNote(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
    }
}

// ✅ Create a note with user association
export async function createNote(title, body, userId) {
    try {
        const [result] = await pool.query(
            'INSERT INTO notes (title, body, user_id) VALUES (?, ?, ?)',
            [title, body, userId]
        );
        return await getNote(result.insertId);
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}

// ✅ Update a note
export async function updateNote(id, title, body) {
    try {
        const [result] = await pool.query(
            'UPDATE notes SET title = ?, body = ? WHERE id = ?',
            [title, body, id]
        );
        if (result.affectedRows === 0) {
            return null;
        }
        return await getNote(id);
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}

// ✅ Delete a note
export async function deleteNote(id) {
    try {
        const note = await getNote(id);
        if (!note) {
            return null;
        }
        await pool.query('DELETE FROM notes WHERE id = ?', [id]);
        return note;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}
