// ============================================
// src/pages/admin/Dashboard.jsx
// DIUBAH: Data dari backend PHP via dashboardAPI
// ============================================

import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { useContext } from 'react';
import { OrderContext } from '../../context/OrderContext';
import { MenuContext } from '../../context/MenuContext';
import { FiTrendingUp, FiShoppingBag, FiArchive, FiRefreshCw } from 'react-icons/fi';

const Dashboard = () => {
  const { orders } = useContext(OrderContext);
  const { menuItems } = useContext(MenuContext);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch {
      // Fallback ke data lokal dari context
      const totalRevenue  = orders.reduce((s, o) => s + o.total, 0);
      const pendingOrders = orders.filter((o) => o.status === 'pending').length;
      const lowStock      = menuItems.filter((m) => m.stock < 10).length;
      setStats({
        total_revenue:   totalRevenue,
        pending_orders:  pendingOrders,
        low_stock_items: lowStock,
        total_orders:    orders.length,
        recent_orders:   orders.slice(0, 5),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = stats ? [
    {
      title: 'Total Pendapatan',
      value: `Rp ${stats.total_revenue.toLocaleString('id-ID')}`,
      icon: FiTrendingUp,
      color: 'text-pink-500',
      bg: 'bg-pink-100',
    },
    {
      title: 'Pesanan Menunggu',
      value: stats.pending_orders,
      icon: FiShoppingBag,
      color: 'text-orange-500',
      bg: 'bg-orange-100',
    },
    {
      title: 'Stok Menipis',
      value: stats.low_stock_items,
      icon: FiArchive,
      color: 'text-red-500',
      bg: 'bg-red-100',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-3">⏳</div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ringkasan Hari Ini</h1>
        <button onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-pink-600 hover:bg-pink-50 px-3 py-2 rounded-xl transition-colors">
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Pesanan Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pesanan Terbaru</h2>
        {(!stats?.recent_orders || stats.recent_orders.length === 0) ? (
          <p className="text-gray-500 text-center py-8">Belum ada pesanan hari ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Meja</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-pink-50/50 transition-colors">
                    <td className="py-4 text-sm font-mono">#{order.id?.slice(-6)}</td>
                    <td className="py-4 font-medium">{order.table_number || order.table}</td>
                    <td className="py-4 font-medium text-pink-600">
                      Rp {order.total?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                          order.status === 'cooking' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'}`}>
                        {order.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
