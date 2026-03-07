const pool = require('../config/db');

// Create application
const createApplication = async (req, res) => {
  const { company_name, job_role, location, application_date, application_status, salary, job_link, notes } = req.body;
  if (!company_name || !job_role || !application_date)
    return res.status(400).json({ message: 'Company name, job role, and application date are required.' });

  try {
    const [result] = await pool.query(
      `INSERT INTO applications (user_id, company_name, job_role, location, application_date, application_status, salary, job_link, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, company_name, job_role, location || null, application_date, application_status || 'Applied', salary || null, job_link || null, notes || null]
    );
    const [newApp] = await pool.query('SELECT * FROM applications WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Application created.', application: newApp[0] });
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all applications for a user
const getApplications = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    let query = 'SELECT * FROM applications WHERE user_id = ?';
    const params = [req.user.id];

    if (status && status !== 'All') {
      query += ' AND application_status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (company_name LIKE ? OR job_role LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'company') {
      query += ' ORDER BY company_name ASC';
    } else if (sort === 'date_asc') {
      query += ' ORDER BY application_date ASC';
    } else {
      query += ' ORDER BY application_date DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single application
const getApplicationById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Application not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update application
const updateApplication = async (req, res) => {
  const { company_name, job_role, location, application_date, application_status, salary, job_link, notes } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: 'Application not found.' });

    await pool.query(
      `UPDATE applications SET company_name=?, job_role=?, location=?, application_date=?, application_status=?, salary=?, job_link=?, notes=? WHERE id=? AND user_id=?`,
      [company_name, job_role, location, application_date, application_status, salary, job_link, notes, req.params.id, req.user.id]
    );

    const [updated] = await pool.query('SELECT * FROM applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Application updated.', application: updated[0] });
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: 'Application not found.' });

    await pool.query('DELETE FROM applications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Application deleted.' });
  } catch (err) {
    console.error('Delete application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [statusCounts] = await pool.query(
      `SELECT application_status, COUNT(*) as count FROM applications WHERE user_id = ? GROUP BY application_status`,
      [req.user.id]
    );
    const [monthlyCount] = await pool.query(
      `SELECT DATE_FORMAT(application_date, '%Y-%m') as month, COUNT(*) as count 
       FROM applications WHERE user_id = ? 
       GROUP BY month ORDER BY month ASC LIMIT 12`,
      [req.user.id]
    );
    const [total] = await pool.query(
      'SELECT COUNT(*) as total FROM applications WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ statusCounts, monthlyCount, total: total[0].total });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication, getDashboardStats };
