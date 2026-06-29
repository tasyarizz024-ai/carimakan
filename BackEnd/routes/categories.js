// ============================================
// routes/categories.js
// GET /api/categories → Daftar semua kategori
// ============================================

const express  = require('express');
const router   = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /categories error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
