// ============================================
// routes/orders.js
// GET   /api/orders         → Semua pesanan (Admin)
// GET   /api/orders/:id     → Detail 1 pesanan
// POST  /api/orders         → Buat pesanan baru
// PATCH /api/orders/:id     → Update status (Admin)
// DELETE /api/orders/:id    → Hapus pesanan permanen (Admin) <-- TAMBAHKAN
// ============================================

const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { requireAdmin } = require("../middleware/auth");

// Helper: generate Order ID unik
function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD${ts}${rand}`;
}

// ── GET /api/orders ───────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let sql = "SELECT * FROM orders";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }
    sql += " ORDER BY created_at DESC";

    const [orders] = await pool.query(sql, params);

    // Attach items ke setiap order
    for (const order of orders) {
      const [items] = await pool.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id],
      );
      order.items = items;
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("GET /orders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/orders/:id ───────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    const order = rows[0];
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [order.id],
    );
    order.items = items;

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("GET /orders/:id error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── POST /api/orders ──────────────────────────────────────────
router.post("/", async (req, res) => {
  const { items, table_number, total, discount, tax, promo_code } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Item pesanan tidak boleh kosong." });
  }

  const orderId = generateOrderId();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Simpan order header
    await conn.query(
      `INSERT INTO orders (id, table_number, total, discount, tax, promo_code, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        orderId,
        table_number || "Meja 01",
        Math.round(total || 0),
        Math.round(discount || 0),
        Math.round(tax || 0),
        promo_code || null,
      ],
    );

    // Simpan setiap item & kurangi stok
    for (const item of items) {
      const qty = parseInt(item.quantity);
      const price = parseInt(item.price);
      const subtotal = price * qty;

      await conn.query(
        `INSERT INTO order_items (order_id, menu_id, menu_name, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, price, qty, subtotal],
      );

      // Kurangi stok (tidak boleh minus)
      await conn.query(
        "UPDATE menus SET stock = GREATEST(0, stock - ?) WHERE id = ?",
        [qty, item.id],
      );
    }

    await conn.commit();
    res
      .status(201)
      .json({
        success: true,
        message: "Pesanan berhasil dibuat.",
        order_id: orderId,
      });
  } catch (err) {
    await conn.rollback();
    console.error("POST /orders error:", err);
    res.status(500).json({ success: false, message: "Gagal membuat pesanan." });
  } finally {
    conn.release();
  }
});

// ── PATCH /api/orders/:id ─────────────────────────────────────
// Admin only — update status pesanan
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "cooking", "served"];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status tidak valid. Gunakan: ${allowed.join(", ")}`,
    });
  }

  try {
    const [rows] = await pool.query("SELECT id FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({
      success: true,
      message: `Status pesanan diubah ke '${status}'.`,
    });
  } catch (err) {
    console.error("PATCH /orders/:id error:", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal memperbarui status." });
  }
});

// ── DELETE /api/orders/:id ────────────────────────────────────
// HAPUS PERMANEN - Admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Cek apakah pesanan ada
    const [orders] = await connection.query(
      "SELECT * FROM orders WHERE id = ?",
      [id],
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    // Ambil order items untuk mengembalikan stok
    const [items] = await connection.query(
      "SELECT menu_id, quantity FROM order_items WHERE order_id = ?",
      [id],
    );

    // Kembalikan stok ke menu
    for (const item of items) {
      await connection.query(
        "UPDATE menus SET stock = stock + ? WHERE id = ?",
        [item.quantity, item.menu_id],
      );
    }

    // Hapus order items
    await connection.query("DELETE FROM order_items WHERE order_id = ?", [id]);

    // Hapus order
    await connection.query("DELETE FROM orders WHERE id = ?", [id]);

    await connection.commit();

    res.json({
      success: true,
      message: "Pesanan berhasil dihapus permanen",
    });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus pesanan",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
