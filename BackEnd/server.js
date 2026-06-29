// ============================================
// server.js — Entry point backend CariMakan
// ============================================

require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const cors           = require('cors');
const path           = require('path');
const { testConnection } = require('./config/db');

// Route imports
const authRoutes       = require('./routes/auth');
const menuRoutes       = require('./routes/menus');
const orderRoutes      = require('./routes/orders');
const categoryRoutes   = require('./routes/categories');
const dashboardRoutes  = require('./routes/dashboard');
const registerRoutes   = require('./routes/register');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS ────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan folder uploads secara publik
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Session ─────────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'carimakan_secret',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   false,
    maxAge:   24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
}));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/menus',      menuRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/register',   registerRoutes); // 🔥 INI YANG DITAMBAHKAN

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server CariMakan berjalan!', port: PORT });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} tidak ditemukan.` });
});

// Error handler global
app.use((req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Server error.' });
});

// ── Start ────────────────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📦 API tersedia di http://localhost:${PORT}/api`);
  });
}

start();