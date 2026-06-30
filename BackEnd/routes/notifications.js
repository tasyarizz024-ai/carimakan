// routes/notifications.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// ── GET /api/notifications ──────────────────────────────────
router.get('/', async (req, res) => {
  try {
    console.log('🔔 Fetching notifications...');
    
    // 🔥 CEK DULU APAKAH TABEL orders ADA
    const [tables] = await pool.query("SHOW TABLES LIKE 'orders'");
    if (tables.length === 0) {
      return res.json({
        success: true,
        data: [],
        unread_count: 0,
        message: 'Tabel orders belum ada'
      });
    }

    // 🔥 AMBIL SEMUA PESANAN (pakai id langsung, bukan order_id)
    const [orders] = await pool.query(`
      SELECT 
        id,
        table_number,
        status,
        total,
        created_at,
        CASE 
          WHEN status = 'pending' THEN '🆕 Pesanan Diterima'
          WHEN status = 'cooking' THEN '🍳 Pesanan Dimasak'
          WHEN status = 'served' THEN '✅ Pesanan Selesai'
          ELSE '📢 Update Pesanan'
        END as title,
        CONCAT('Meja ', table_number, ' - Rp', FORMAT(total, 0)) as message
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 20
    `);

    console.log('📦 Orders found:', orders.length);

    const notifications = orders.map((order) => ({
      id: order.id,
      type: 'order',
      title: order.title,
      message: order.message,
      time: getTimeAgo(order.created_at),
      read: false,
      link: '/orders',
      status: order.status
    }));

    res.json({
      success: true,
      data: notifications,
      unread_count: notifications.filter(n => !n.read).length
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error.message);
    console.error('📝 Full error:', error);
    
    // 🔥 KALAU ERROR, KEMBALIKAN DATA KOSONG (BUKAN ERROR)
    res.json({
      success: true,
      data: [],
      unread_count: 0,
      message: 'Belum ada notifikasi'
    });
  }
});

// ── Helper: Waktu relatif ──────────────────────────────────────
function getTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

module.exports = router;