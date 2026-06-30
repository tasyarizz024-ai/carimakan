// src/pages/UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiClock, FiCheckCircle, FiPackage, FiCoffee } from 'react-icons/fi';
import axios from 'axios';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cooking': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'served': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" size={16} />;
      case 'cooking': return <FiCoffee className="text-blue-500" size={16} />;
      case 'served': return <FiCheckCircle className="text-green-500" size={16} />;
      default: return <FiPackage className="text-gray-500" size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'cooking': return 'Sedang Dimasak';
      case 'served': return 'Selesai Disajikan';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Riwayat Pesanan</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Memuat pesanan...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-pink-50">
            <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Belum Ada Pesanan</h3>
            <p className="text-gray-500 text-sm mt-2">Yuk, pesan makanan favoritmu sekarang!</p>
            <Link 
              to="/"
              className="inline-block mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              Mulai Pesan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">Order #{order.order_id || order.id}</p>
                    <p className="text-sm font-semibold text-gray-800">{order.table_number}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusLabel(order.status)}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs font-medium w-6">{item.quantity}x</span>
                          <span className="text-gray-800">{item.menu_name || item.name}</span>
                        </div>
                        <span className="text-gray-600 font-medium">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada item</p>
                  )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Pembayaran</span>
                  <span className="text-lg font-bold text-pink-600">
                    Rp {order.total?.toLocaleString('id-ID') || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;