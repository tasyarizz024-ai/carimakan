// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pool } = require('../config/db');

// ── POST /api/register ──────────────────────────────────────────
router.post('/', async (req, res) => {
  const { username, password, name, registration_token } = req.body;

  // Validasi input
  if (!username || !password || !registration_token) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, dan registration token wajib diisi.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password minimal 6 karakter.'
    });
  }

  try {
    // 1. Cek apakah token valid (dari admin yang sudah ada)
    const [tokenCheck] = await pool.query(
      'SELECT id, username FROM users WHERE registration_token = ? AND role = "admin"',
      [registration_token]
    );

    if (tokenCheck.length === 0) {
      return res.status(401).json({
        success: false,
        message: '❌ Token registrasi tidak valid!'
      });
    }

    // 2. Cek apakah username sudah digunakan
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username sudah digunakan. Silakan pilih username lain.'
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan user baru
    const [result] = await pool.query(
      `INSERT INTO users (username, password, name, role, created_at) 
       VALUES (?, ?, ?, 'admin', NOW())`,
      [
        username,
        hashedPassword,
        name || username
      ]
    );

    res.status(201).json({
      success: true,
      message: `✅ Admin "${username}" berhasil didaftarkan!`,
      data: {
        id: result.insertId,
        username: username,
        name: name || username
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server.'
    });
  }
});

module.exports = router;