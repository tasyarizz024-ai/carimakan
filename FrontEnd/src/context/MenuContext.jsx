// ============================================
// src/context/MenuContext.jsx
// DIUBAH: Sekarang fetch data dari backend PHP
// ============================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { menuAPI, categoryAPI } from '../services/api';
import { initialFoods } from '../data/foods'; // Fallback jika API belum jalan

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ── Fetch menu dari backend ──────────────────────────────────
  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await menuAPI.getAll();
      if (res.data.success) {
        // Jika menu dari DB tidak punya gambar (image_url null),
        // gunakan gambar lokal bawaan berdasarkan ID
        const menus = res.data.data.map((item) => ({
          ...item,
          image: item.image || getLocalImage(item.id),
        }));
        setMenuItems(menus);
      }
    } catch (err) {
      console.warn('Backend belum terhubung, menggunakan data dummy.', err.message);
      // Fallback ke data dummy saat backend belum ready
      setMenuItems(initialFoods);
      setError('Menggunakan data offline');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch kategori dari backend ──────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryAPI.getAll();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch {
      // Fallback ke kategori statis
      setCategories([
        { id: 1, name: 'Semua', icon: '🍽️' },
        { id: 2, name: 'Nasi',  icon: '🍚' },
        { id: 3, name: 'Mie',   icon: '🍜' },
        { id: 4, name: 'Sate',  icon: '🍢' },
        { id: 5, name: 'Ayam',  icon: '🍗' },
        { id: 6, name: 'Sayur', icon: '🍲' },
        { id: 7, name: 'Minuman', icon: '🍹' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, [fetchMenus, fetchCategories]);

  // ── Update stok (Admin: dari UI lokal atau setelah order) ────
  const updateStock = async (id, newStock) => {
    try {
      await menuAPI.updateStock(id, newStock);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
      );
    } catch {
      // Fallback: update lokal saja
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
      );
    }
  };

  // ── Kurangi stok setelah checkout (cart sudah kirim ke backend) ──
  const reduceStock = (cartItems) => {
    setMenuItems((prev) => {
      let updated = [...prev];
      cartItems.forEach((cartItem) => {
        const idx = updated.findIndex((i) => i.id === cartItem.id);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            stock: Math.max(0, updated[idx].stock - cartItem.quantity),
          };
        }
      });
      return updated;
    });
  };

  // ── CRUD untuk Admin ─────────────────────────────────────────

  const addMenu = async (formData) => {
    const res = await menuAPI.create(formData);
    await fetchMenus(); // Reload dari DB
    return res.data;
  };

  const editMenu = async (id, formData) => {
    const res = await menuAPI.update(id, formData);
    await fetchMenus();
    return res.data;
  };

  const deleteMenu = async (id) => {
    const res = await menuAPI.delete(id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    return res.data;
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        loading,
        error,
        updateStock,
        reduceStock,
        addMenu,
        editMenu,
        deleteMenu,
        refetchMenus: fetchMenus,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Map ID menu ke gambar lokal (agar data DB bisa pakai gambar bawaan)
function getLocalImage(id) {
  const imageMap = {
    1:  new URL('../assets/images/nasi_goreng_1782454955738.png', import.meta.url).href,
    2:  new URL('../assets/images/mie_goreng_1782454965613.png',  import.meta.url).href,
    3:  new URL('../assets/images/sate_ayam_1782454976079.png',   import.meta.url).href,
    4:  new URL('../assets/images/gado_gado_1782454986722.png',   import.meta.url).href,
    5:  new URL('../assets/images/ayam_geprek_1782454995690.png', import.meta.url).href,
    6:  new URL('../assets/images/es_campur_1782455012726.png',   import.meta.url).href,
    7:  new URL('../assets/images/soto_ayam_1782455023961.png',   import.meta.url).href,
    8:  new URL('../assets/images/ayam_bakar_1782455036000.png',  import.meta.url).href,
    9:  new URL('../assets/images/jus_alpukat_1782455045669.png', import.meta.url).href,
    10: new URL('../assets/images/nasi_rames_1782455055209.png',  import.meta.url).href,
  };
  return imageMap[id] || null;
}
