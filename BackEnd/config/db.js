// ============================================
// config/db.js
// Koneksi ke MySQL menggunakan mysql2 (pool)
// ============================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASS     || '',
  database:        process.env.DB_NAME     || 'carimakan',
  charset:         'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Test koneksi saat server pertama kali start
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Terhubung ke database MySQL:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
