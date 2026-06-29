import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiHelpCircle, FiClock, FiLogOut, FiChevronRight } from 'react-icons/fi';
import BottomNavigation from '../components/BottomNavigation';

const Profile = () => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: FiClock, label: 'Riwayat Pesanan', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: FiSettings, label: 'Pengaturan Akun', color: 'text-gray-600', bg: 'bg-gray-100' },
    { icon: FiHelpCircle, label: 'Pusat Bantuan', color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="bg-white px-4 py-6 shadow-sm mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6 text-center md:text-left md:max-w-4xl md:mx-auto">Profil Saya</h1>
        
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-sm p-1">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Budi Santoso</h2>
            <p className="text-gray-500 text-sm mb-1">+62 812 3456 7890</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-primary text-xs font-semibold rounded-full">
              Member Gold
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <FiChevronRight className="text-gray-400" size={20} />
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (isAdmin) {
              localStorage.removeItem('isAdmin');
              navigate('/login');
            } else {
              navigate('/login');
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-colors"
        >
          <FiLogOut size={20} />
          <span>{localStorage.getItem('isAdmin') ? 'Keluar Mode Admin' : 'Login Admin'}</span>
        </button>
        {localStorage.getItem('isAdmin') && (
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
          >
            <span>Masuk ke Dashboard Admin</span>
          </button>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
