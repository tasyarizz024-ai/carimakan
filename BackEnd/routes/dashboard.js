// ============================================
// routes/dashboard.js
// GET /api/dashboard → Statistik untuk admin
// ============================================

const express  = require('express');
const router   = express.Router();
const { pool } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, async (req, res) => {
  try {
    // Total pendapatan dari pesanan yang sudah served
    const [[{ total_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status = 'served'"
    );

    // Jumlah pesanan per status
    const [[{ pending_orders }]] = await pool.query(
      "SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'pending'"
    );
    const [[{ cooking_orders }]] = await pool.query(
      "SELECT COUNT(*) AS cooking_orders FROM orders WHERE status = 'cooking'"
    );
    const [[{ total_orders }]] = await pool.query(
      'SELECT COUNT(*) AS total_orders FROM orders'
    );

    // Menu dengan stok menipis
    const [[{ low_stock_items }]] = await pool.query(
      'SELECT COUNT(*) AS low_stock_items FROM menus WHERE stock < 10 AND is_active = 1'
    );

    // Total menu aktif
    const [[{ total_menus }]] = await pool.query(
      'SELECT COUNT(*) AS total_menus FROM menus WHERE is_active = 1'
    );

    // 5 Pesanan terbaru beserta item-nya
    const [recentOrders] = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
    );
    for (const order of recentOrders) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    // Menu stok rendah
    const [lowStockMenus] = await pool.query(
      'SELECT id, name, category, stock FROM menus WHERE stock < 10 AND is_active = 1 ORDER BY stock ASC LIMIT 5'
    );

    res.json({
      success: true,
      data: {
        total_revenue:   parseInt(total_revenue),
        pending_orders:  parseInt(pending_orders),
        cooking_orders:  parseInt(cooking_orders),
        total_orders:    parseInt(total_orders),
        low_stock_items: parseInt(low_stock_items),
        total_menus:     parseInt(total_menus),
        recent_orders:   recentOrders,
        low_stock_menus: lowStockMenus,
      },
    });
  } catch (err) {
    console.error('GET /dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
