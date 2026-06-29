// ============================================
// src/pages/admin/Orders.jsx
// DIUBAH: Update status pesanan tersimpan ke DB
// + TAMBAH: Fitur hapus pesanan
// ============================================

import React, { useContext, useState } from "react";
import { OrderContext } from "../../context/OrderContext";
import { FiCheck, FiCoffee, FiRefreshCw, FiTrash2 } from "react-icons/fi";

const Orders = () => {
  const { orders, updateOrderStatus, refetchOrders, deleteOrder } =
    useContext(OrderContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "cooking":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "served":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;

    setDeleting(true);
    const success = await deleteOrder(selectedOrder.id);
    setDeleting(false);

    if (success) {
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Pesanan</h1>
        <button
          onClick={refetchOrders}
          className="flex items-center gap-2 text-sm text-pink-600 hover:bg-pink-50 px-3 py-2 rounded-xl transition-colors"
        >
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-50 p-12 text-center">
          <p className="text-gray-500">Belum ada pesanan masuk.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {order.table}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Order ID: #{order.id}
                  </p>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}
                >
                  {order.status?.toUpperCase()}
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3 mb-6">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-800">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-gray-500">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                  <span className="font-bold text-gray-800">
                    Total Pembayaran
                  </span>
                  <span className="text-xl font-bold text-pink-600">
                    Rp {order.total?.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex gap-3 justify-end">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "cooking")}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <FiCoffee /> Proses Masak
                    </button>
                  )}
                  {order.status === "cooking" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "served")}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <FiCheck /> Selesai & Sajikan
                    </button>
                  )}
                  {order.status === "served" && (
                    <div className="flex gap-2">
                      <span className="text-green-600 font-semibold text-sm flex items-center">
                        ✅ Sudah disajikan
                      </span>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm"
                      >
                        <FiTrash2 size={14} /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <FiTrash2 className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-2">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Apakah Anda yakin ingin menghapus pesanan ini secara permanen?
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium">
                Order ID: #{selectedOrder?.id}
              </p>
              <p className="text-sm text-gray-600">{selectedOrder?.table}</p>
              <p className="text-sm font-bold text-gray-800">
                Total: Rp {selectedOrder?.total?.toLocaleString("id-ID")}
              </p>
            </div>

            <p className="text-xs text-red-500 text-center mb-4">
              ⚠️ Tindakan ini tidak dapat dibatalkan! Stok akan dikembalikan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={deleting}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
