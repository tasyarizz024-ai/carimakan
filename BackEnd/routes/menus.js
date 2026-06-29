// ============================================
// routes/menus.js
// GET    /api/menus           → Semua menu (+ filter)
// GET    /api/menus/:id       → Detail 1 menu
// POST   /api/menus           → Tambah menu baru (Admin)
// PUT    /api/menus/:id       → Edit menu (Admin)
// DELETE /api/menus/:id       → Hapus menu (Admin)
// PATCH  /api/menus/:id/stock → Update stok saja
// ============================================

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const router   = express.Router();
const { pool } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const upload   = require('../middleware/upload');

// Helper: bangun URL gambar
function buildImageUrl(req, imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${imageUrl}`;
}

// Helper: simpan ingredients ke DB
async function saveIngredients(conn, menuId, ingredients) {
  if (!ingredients || ingredients.length === 0) return;
  const values = ingredients
    .filter((i) => i.trim() !== '')
    .map((name) => [menuId, name.trim()]);
  if (values.length > 0) {
    await conn.query('INSERT INTO ingredients (menu_id, name) VALUES ?', [values]);
  }
}

// Helper: parse ingredients (bisa array atau string koma)
function parseIngredients(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// ── GET /api/menus ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql    = 'SELECT * FROM menus WHERE is_active = 1';
    const params = [];

    if (category && category !== 'Semua') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR restaurant LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY id ASC';

    const [menus] = await pool.query(sql, params);

    // Attach ingredients + image URL
    for (const menu of menus) {
      const [ings] = await pool.query(
        'SELECT name FROM ingredients WHERE menu_id = ?',
        [menu.id]
      );
      menu.ingredients = ings.map((r) => r.name);
      menu.image       = buildImageUrl(req, menu.image_url);
    }

    res.json({ success: true, data: menus });
  } catch (err) {
    console.error('GET /menus error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── GET /api/menus/:id ────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM menus WHERE id = ? AND is_active = 1',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }

    const menu = rows[0];
    const [ings] = await pool.query(
      'SELECT name FROM ingredients WHERE menu_id = ?',
      [menu.id]
    );
    menu.ingredients = ings.map((r) => r.name);
    menu.image       = buildImageUrl(req, menu.image_url);

    res.json({ success: true, data: menu });
  } catch (err) {
    console.error('GET /menus/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── POST /api/menus ───────────────────────────────────────────
// Admin only — bisa upload gambar
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, restaurant, description, price, stock, rating, reviews, estimated_time, category, ingredients } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Field name, price, dan category wajib diisi.' });
  }

  const imageUrl = req.file ? req.file.filename : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO menus (name, restaurant, description, price, stock, rating, reviews, estimated_time, category, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        restaurant     || 'Dapur Utama',
        description    || '',
        parseInt(price),
        parseInt(stock || 0),
        parseFloat(rating || 0),
        parseInt(reviews || 0),
        estimated_time || '15 min',
        category,
        imageUrl,
      ]
    );

    const newId = result.insertId;
    const parsedIngredients = parseIngredients(ingredients);
    await saveIngredients(pool, newId, parsedIngredients);

    res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan.', data: { id: newId } });
  } catch (err) {
    console.error('POST /menus error:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan menu.' });
  }
});

// ── PUT /api/menus/:id ────────────────────────────────────────
// Admin only — edit menu, opsional ganti gambar
router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const menuId = req.params.id;

  try {
    const [rows] = await pool.query('SELECT * FROM menus WHERE id = ?', [menuId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }

    const existing = rows[0];
    const body     = req.body;

    // Gambar baru? Hapus yang lama
    let imageUrl = existing.image_url;
    if (req.file) {
      if (imageUrl) {
        const oldPath = path.join(__dirname, '..', 'uploads', imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = req.file.filename;
    }

    await pool.query(
      `UPDATE menus SET
        name           = ?,
        restaurant     = ?,
        description    = ?,
        price          = ?,
        stock          = ?,
        rating         = ?,
        reviews        = ?,
        estimated_time = ?,
        category       = ?,
        image_url      = ?
       WHERE id = ?`,
      [
        body.name           ?? existing.name,
        body.restaurant     ?? existing.restaurant,
        body.description    ?? existing.description,
        body.price          ? parseInt(body.price)          : existing.price,
        body.stock          ? parseInt(body.stock)          : existing.stock,
        body.rating         ? parseFloat(body.rating)       : existing.rating,
        body.reviews        ? parseInt(body.reviews)        : existing.reviews,
        body.estimated_time ?? existing.estimated_time,
        body.category       ?? existing.category,
        imageUrl,
        menuId,
      ]
    );

    // Update ingredients jika dikirim
    if (body.ingredients !== undefined) {
      await pool.query('DELETE FROM ingredients WHERE menu_id = ?', [menuId]);
      const parsedIngredients = parseIngredients(body.ingredients);
      await saveIngredients(pool, menuId, parsedIngredients);
    }

    res.json({ success: true, message: 'Menu berhasil diperbarui.' });
  } catch (err) {
    console.error('PUT /menus/:id error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui menu.' });
  }
});

// ── DELETE /api/menus/:id ─────────────────────────────────────
// Admin only — soft delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM menus WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }

    // Soft delete agar histori pesanan tetap ada
    await pool.query('UPDATE menus SET is_active = 0 WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Menu berhasil dihapus.' });
  } catch (err) {
    console.error('DELETE /menus/:id error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus menu.' });
  }
});

// ── PATCH /api/menus/:id/stock ────────────────────────────────
// Update stok saja (tidak perlu admin, bisa dari proses checkout)
router.patch('/:id/stock', async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
    return res.status(400).json({ success: false, message: 'Nilai stok tidak valid.' });
  }

  try {
    await pool.query('UPDATE menus SET stock = ? WHERE id = ?', [parseInt(stock), req.params.id]);
    res.json({ success: true, message: 'Stok berhasil diperbarui.' });
  } catch (err) {
    console.error('PATCH /menus/:id/stock error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui stok.' });
  }
});

module.exports = router;
