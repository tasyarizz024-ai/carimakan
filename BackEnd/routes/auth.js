// ============================================
// routes/auth.js
// POST /api/auth/login   → Login
// POST /api/auth/logout  → Logout
// GET  /api/auth/me      → Cek sesi aktif
// ============================================

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { pool } = require("../config/db");

// ── GET /api/auth/me ─────────────────────────────────────────
// Cek siapa yang sedang login berdasarkan sesi
router.get("/me", (req, res) => {
  console.log("🔍 GET /me - Session:", req.session); // Logging untuk debug

  // 🔥 PERBAIKAN: Cek session dengan cara yang benar
  if (req.session && req.session.userId) {
    return res.json({
      success: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role,
        name: req.session.name,
      },
    });
  }

  // 🔥 KALAU SESSION TIDAK ADA, RETURN 401
  return res.status(401).json({
    success: false,
    message: "Tidak terautentikasi",
  });
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password wajib diisi.",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah.",
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah.",
      });
    }

    // Simpan ke sesi
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.name = user.name;

    // 🔥 SAVE SESSION
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.status(500).json({
          success: false,
          message: "Gagal menyimpan session",
        });
      }

      console.log("✅ Login success untuk:", username);
      res.json({
        success: true,
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      });
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal logout." });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Berhasil logout." });
  });
});

module.exports = router;
