// ============================================
// src/services/api.js
// Konfigurasi axios ke backend Node.js/Express
// + Auto redirect ke login jika session expired
// ============================================

import axios from "axios";

// 🔥 PAKAI ENVIRONMENT VARIABLE
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🔥 INTERCEPTOR RESPONSE - Auto redirect ke login jika 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("🔒 Session expired, redirecting to login...");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
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

// ── NOTIFICATION API ────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/api/notifications'),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
};

export default api;