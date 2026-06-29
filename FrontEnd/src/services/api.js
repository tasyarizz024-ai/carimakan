// ============================================
// src/services/api.js
// Konfigurasi axios ke backend Node.js/Express
// + Auto redirect ke login jika session expired
// ============================================

import axios from "axios";

// Backend Node.js berjalan di port 5000
const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Wajib agar session cookie bisa dikirim bolak-balik
});

// 🔥 INTERCEPTOR RESPONSE - Auto redirect ke login jika 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika error 401 (Unauthorized) = session expired
    if (error.response && error.response.status === 401) {
      console.log("🔒 Session expired, redirecting to login...");

      // Hapus data user dari localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");

      // Redirect ke halaman login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// ── MENU API ────────────────────────────────────────────────────

export const menuAPI = {
  getAll: (params = {}) => api.get("/api/menus", { params }),

  getById: (id) => api.get(`/api/menus/${id}`),

  create: (formData) =>
    api.post("/api/menus", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    api.put(`/api/menus/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => api.delete(`/api/menus/${id}`),

  updateStock: (id, stock) => api.patch(`/api/menus/${id}/stock`, { stock }),
};

// ── ORDER API ───────────────────────────────────────────────────

export const orderAPI = {
  getAll: (params = {}) => api.get("/api/orders", { params }),

  getById: (id) => api.get(`/api/orders/${id}`),

  create: (orderData) => api.post("/api/orders", orderData),

  updateStatus: (id, status) => api.patch(`/api/orders/${id}`, { status }),

  delete: (id) => api.delete(`/api/orders/${id}`),
};

// ── AUTH API ────────────────────────────────────────────────────

export const authAPI = {
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),

  logout: () => api.post("/api/auth/logout"),

  me: () => api.get("/api/auth/me"),
};

// ── KATEGORI API ────────────────────────────────────────────────

export const categoryAPI = {
  getAll: () => api.get("/api/categories"),
};

// ── DASHBOARD API (Admin) ───────────────────────────────────────

export const dashboardAPI = {
  getStats: () => api.get("/api/dashboard"),
};

export default api;
