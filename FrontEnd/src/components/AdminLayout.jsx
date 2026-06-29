import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiBox, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/orders', icon: FiList, label: 'Pesanan Masuk' },
    { path: '/admin/menu', icon: FiBox, label: 'Manajemen Stok' },
  ];

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <div className="bg-white md:w-64 md:min-h-screen shadow-md flex md:flex-col justify-between p-4 z-50">
        <div>
          <div className="text-2xl font-bold text-pink-600 mb-8 hidden md:block px-4">
            Admin Panel
          </div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible w-full pb-2 md:pb-0">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-pink-100 text-pink-700 font-semibold' 
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-auto"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
