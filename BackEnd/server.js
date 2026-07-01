// ============================================
// server.js — Entry point backend CariMakan
// ============================================

require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const cors           = require('cors');
const path           = require('path');
const fs             = require('fs'); // 🔥 TAMBAHKAN
const { testConnection } = require('./config/db');

// 🔥 Buat folder uploads otomatis (biar gak error di Railway)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Folder uploads dibuat');
}

// Route imports
const authRoutes       = require('./routes/auth');
const menuRoutes       = require('./routes/menus');
const orderRoutes      = require('./routes/orders');
const categoryRoutes   = require('./routes/categories');
const dashboardRoutes  = require('./routes/dashboard');
const registerRoutes   = require('./routes/register');
const notificationRoutes = require('./routes/notifications');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS ────────────────────────────────────────────────────────
// ── CORS ────────────────────────────────────────────────────────
app.use(cors({
  origin: true, // 🔥 IZINKAN SEMUA DOMAIN (buat testing)
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
app.use('/api/register',   registerRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server CariMakan berjalan!', port: PORT });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} tidak ditemukan.` });
});

// 🔥 ERROR HANDLER YANG BENAR
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan server.' });
});

// ── Start ────────────────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, '0.0.0.0', () => { // 🔥 TAMBAHKAN '0.0.0.0'
    console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
    console.log(`📦 API tersedia di http://0.0.0.0:${PORT}/api`);
  });
}

start();