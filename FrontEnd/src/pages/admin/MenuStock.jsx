// ============================================
// src/pages/admin/MenuStock.jsx
// DIUBAH: Sekarang ada CRUD lengkap (Tambah/Edit/Hapus)
// + Tambahan field Rating & Reviews
// ============================================

import React, { useContext, useState } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiImage } from 'react-icons/fi';

// ── Form Modal untuk Tambah / Edit Menu ──────────────────────────
const MenuFormModal = ({ mode, initialData, onClose, onSave }) => {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    name:           initialData?.name           || '',
    restaurant:     initialData?.restaurant     || 'Dapur Utama',
    description:    initialData?.description    || '',
    price:          initialData?.price          || '',
    stock:          initialData?.stock          || '',
    estimated_time: initialData?.estimated_time || '15 min',
    category:       initialData?.category       || 'Nasi',
    ingredients:    initialData?.ingredients?.join(', ') || '',
    rating:         initialData?.rating         || '',  // 🔥 TAMBAHKAN
    reviews:        initialData?.reviews        || '',  // 🔥 TAMBAHKAN
  });
  const [imageFile, setImageFile]   = useState(null);
  const [preview,   setPreview]     = useState(null);
  const [loading,   setLoading]     = useState(false);
  const [error,     setError]       = useState('');

  const categories = ['Nasi', 'Mie', 'Sate', 'Ayam', 'Sayur', 'Minuman'];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append('image', imageFile);

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan menu. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Menu</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {preview || initialData?.image ? (
                  <img src={preview || initialData.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <FiImage size={24} className="text-gray-400" />
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                <span>Pilih Gambar</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Contoh: Nasi Goreng Spesial" />
          </div>

          {/* Kategori & Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none bg-white">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) <span className="text-red-500">*</span></label>
              <input name="price" value={form.price} onChange={handleChange} required type="number" min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="35000" />
            </div>
          </div>

          {/* Stok & Estimasi Waktu */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Waktu</label>
              <input name="estimated_time" value={form.estimated_time} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="15 min" />
            </div>
          </div>

          {/* 🔥 TAMBAHKAN INI - Rating & Reviews */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input 
                name="rating" 
                value={form.rating} 
                onChange={handleChange} 
                type="number" 
                min="0" 
                max="5" 
                step="0.1"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="4.5" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Review</label>
              <input 
                name="reviews" 
                value={form.reviews} 
                onChange={handleChange} 
                type="number" 
                min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="100" 
              />
            </div>
          </div>

          {/* Restaurant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Restoran</label>
            <input name="restaurant" value={form.restaurant} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Dapur Utama" />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none resize-none"
              placeholder="Deskripsi singkat menu..." />
          </div>

          {/* Bahan-bahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bahan-bahan <span className="text-gray-400 font-normal">(pisahkan dengan koma)</span>
            </label>
            <input name="ingredients" value={form.ingredients} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Nasi Putih, Telur, Daging Ayam" />
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors disabled:opacity-60">
              {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Menu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Komponen Utama ────────────────────────────────────────────────
const MenuStock = () => {
  const { menuItems, updateStock, addMenu, editMenu, deleteMenu } = useContext(MenuContext);
  const [modalMode,   setModalMode]   = useState(null);   // 'add' | 'edit' | null
  const [editTarget,  setEditTarget]  = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [tempStock,    setTempStock]    = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Stok inline edit ───────────────────────────────────────────
  const handleStockEdit = (item) => {
    setEditingStock(item.id);
    setTempStock(item.stock.toString());
  };

  const handleStockSave = async (id) => {
    const val = parseInt(tempStock);
    if (!isNaN(val) && val >= 0) {
      await updateStock(id, val);
      showToast('Stok berhasil diperbarui');
    }
    setEditingStock(null);
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteMenu(deleteConfirm);
      showToast('Menu berhasil dihapus');
    } catch {
      showToast('Gagal menghapus menu');
    }
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg font-medium">
          {toast}
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {modalMode && (
        <MenuFormModal
          mode={modalMode}
          initialData={editTarget}
          onClose={() => { setModalMode(null); setEditTarget(null); }}
          onSave={async (formData) => {
            if (modalMode === 'add') {
              await addMenu(formData);
              showToast('Menu baru berhasil ditambahkan!');
            } else {
              await editMenu(editTarget.id, formData);
              showToast('Menu berhasil diperbarui!');
            }
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Hapus Menu?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Menu yang dihapus tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Menu</h1>
        <button
          onClick={() => { setEditTarget(null); setModalMode('add'); }}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition-colors shadow-sm"
        >
          <FiPlus size={18} />
          Tambah Menu
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">Menu</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Stok</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-pink-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <span className="font-bold text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-pink-600 font-medium">
                    Rp {item.price?.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4">
                    {editingStock === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number" value={tempStock} min="0"
                          onChange={(e) => setTempStock(e.target.value)}
                          className="w-20 px-2 py-1 border border-pink-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm"
                        />
                        <button onClick={() => handleStockSave(item.id)} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200">
                          <FiCheck size={14} />
                        </button>
                        <button onClick={() => setEditingStock(null)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleStockEdit(item)}
                        className={`font-bold text-sm hover:underline ${item.stock < 10 ? 'text-red-500' : 'text-gray-800'}`}>
                        {item.stock} porsi
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditTarget(item); setModalMode('edit'); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit menu"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus menu"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuStock;