import pool from '../Database/database.js';

export async function getNotes() {
    try {
        const [rows] = await pool.query('SELECT * FROM notes');
        return rows;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}

export async function getNote(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null; // Note not found
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
    }
}

export async function createNote(title, body) {
    try {
        const [result] = await pool.query('INSERT INTO notes (title, body) VALUES (?, ?)', [title, body]);
        const id = result.insertId;
        return await getNote(id);
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}

export async function updateNote(id, title, body) {
    try {
        const [result] = await pool.query('UPDATE notes SET title = ?, body = ? WHERE id = ?', [title, body, id]);
        if (result.affectedRows === 0) {
            return null; // No rows updated, note not found
        }
        return await getNote(id);
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}

export async function deleteNote(id) {
    try {
        const note = await getNote(id);
        if (!note) {
            return null; // Note not found
        }
        await pool.query('DELETE FROM notes WHERE id = ?', [id]);
        return note;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}