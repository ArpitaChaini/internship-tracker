const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload resume
const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  try {
    const [result] = await pool.query(
      'INSERT INTO resumes (user_id, file_name, file_path) VALUES (?, ?, ?)',
      [req.user.id, req.file.originalname, req.file.filename]
    );
    const [resume] = await pool.query('SELECT * FROM resumes WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Resume uploaded.', resume: resume[0] });
  } catch (err) {
    console.error('Upload resume error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all resumes
const getResumes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Resume not found.' });

    const filePath = path.join(__dirname, '..', 'uploads', rows[0].file_path);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: 'File not found on server.' });

    res.download(filePath, rows[0].file_name);
  } catch (err) {
    console.error('Download resume error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Resume not found.' });

    const filePath = path.join(__dirname, '..', 'uploads', rows[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM resumes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Resume deleted.' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { uploadResume, getResumes, downloadResume, deleteResume };
