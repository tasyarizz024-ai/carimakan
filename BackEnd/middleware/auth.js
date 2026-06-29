// ============================================
// middleware/auth.js
// Middleware untuk proteksi route
// ============================================

// Cek apakah sudah login (ada sesi aktif)
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Silakan login terlebih dahulu.',
    });
  }
  next();
}

// Cek apakah yang login adalah admin
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Silakan login terlebih dahulu.',
    });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Hanya admin yang bisa mengakses ini.',
    });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
