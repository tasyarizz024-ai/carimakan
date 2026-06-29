// ============================================
// src/context/OrderContext.jsx
// DIUBAH: Pesanan sekarang disimpan ke database
// + Perbaikan placeOrder dengan async/await
// ============================================

import React, { createContext, useState, useEffect, useCallback } from "react";
import { orderAPI } from "../services/api";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getAll();
      if (res.data.success) {
        // Normalisasi agar kompatibel dengan format lama
        const normalized = res.data.data.map((o) => ({
          id: o.id,
          date: o.created_at,
          table: o.table_number,
          total: o.total,
          status: o.status,
          items: (o.items || []).map((item) => ({
            id: item.menu_id,
            name: item.menu_name,
            price: item.price,
            quantity: item.quantity,
          })),
        }));
        setOrders(normalized);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Sesi login habis. Silakan login ulang.");
        window.location.href = "/login";
      } else {
        setError("Gagal memuat pesanan");
        // Fallback ke localStorage
        const saved = localStorage.getItem("orders");
        if (saved) setOrders(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── PLACE ORDER ── PERBAIKI INI
  const placeOrder = async (
    cartItems,
    total,
    tableNumber = "Meja 01",
    promoCode = null,
    discount = 0,
    tax = 0,
  ) => {
    console.log("📤 placeOrder dipanggil:", {
      cartItems,
      total,
      tableNumber,
      promoCode,
      discount,
      tax,
    });

    // Validasi cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("❌ Cart kosong!");
      throw new Error("Keranjang belanja kosong");
    }

    try {
      // Format data untuk backend
      const orderData = {
        table_number: tableNumber || "Meja 01",
        total: Math.round(total || 0),
        discount: Math.round(discount || 0),
        tax: Math.round(tax || 0),
        promo_code: promoCode || null,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      console.log(
        "📤 Mengirim ke backend:",
        JSON.stringify(orderData, null, 2),
      );

      // Panggil API
      const res = await orderAPI.create(orderData);
      console.log("✅ Response dari server:", res.data);

      // Cek response
      if (res.data && res.data.success) {
        // Tambahkan ke state lokal
        const newOrder = {
          id: res.data.order_id,
          date: new Date().toISOString(),
          table: tableNumber || "Meja 01",
          total: total || 0,
          status: "pending",
          items: cartItems,
        };
        setOrders((prev) => [newOrder, ...prev]);

        // Kembalikan order_id
        return res.data.order_id;
      } else {
        console.error(
          "❌ Server response error:",
          res.data?.message || "Unknown error",
        );
        throw new Error(res.data?.message || "Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("❌ placeOrder error:", error);

      // Cek apakah session expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Sesi login habis. Silakan login ulang.");
        window.location.href = "/login";
        throw new Error("Session expired");
      }

      // Throw error agar bisa ditangkap di komponen
      throw error;
    }
  };

  // ── UPDATE ORDER STATUS ──
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await orderAPI.updateStatus(orderId, newStatus);

      // Update state lokal
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      return true;
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Sesi login habis. Silakan login ulang.");
        window.location.href = "/login";
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE ORDER ──
  const deleteOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("🗑️ Deleting order:", orderId);
      const response = await orderAPI.delete(orderId);
      console.log("📦 Delete response:", response.data);

      if (response.data.success) {
        // Hapus dari state lokal
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        return true;
      } else {
        setError(response.data.message || "Gagal menghapus pesanan");
        return false;
      }
    } catch (err) {
      console.error("❌ Error deleting order:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("⚠️ Sesi login habis. Silakan login ulang!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return false;
      }

      setError(err.response?.data?.message || "Gagal menghapus pesanan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        placeOrder, // <-- EXPORT INI
        updateOrderStatus, // <-- EXPORT INI
        deleteOrder, // <-- EXPORT INI
        refetchOrders: fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
