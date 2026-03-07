const pool = require('../config/db');

// Create note
const createNote = async (req, res) => {
  const { company, role, questions, experience, tips } = req.body;
  if (!company || !role)
    return res.status(400).json({ message: 'Company and role are required.' });

  try {
    const [result] = await pool.query(
      `INSERT INTO interview_notes (user_id, company, role, questions, experience, tips) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, company, role, questions || null, experience || null, tips || null]
    );
    const [note] = await pool.query('SELECT * FROM interview_notes WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Note created.', note: note[0] });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all notes
const getNotes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM interview_notes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update note
const updateNote = async (req, res) => {
  const { company, role, questions, experience, tips } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT id FROM interview_notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: 'Note not found.' });

    await pool.query(
      `UPDATE interview_notes SET company=?, role=?, questions=?, experience=?, tips=? WHERE id=? AND user_id=?`,
      [company, role, questions, experience, tips, req.params.id, req.user.id]
    );
    const [updated] = await pool.query('SELECT * FROM interview_notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Note updated.', note: updated[0] });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM interview_notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: 'Note not found.' });

    await pool.query('DELETE FROM interview_notes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
