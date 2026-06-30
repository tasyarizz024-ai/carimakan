// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiShoppingCart, FiClipboard } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import UserNotificationBell from './UserNotificationBell';

const Navbar = () => {
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isAdmin') === 'true';

  return (
    <>
      {/* Banner Admin Login */}
      {!isLoggedIn && (
        <div 
          className="bg-pink-50 w-full py-1.5 px-4 text-center cursor-pointer hover:bg-pink-100 transition-colors" 
          onClick={() => navigate('/login')}
        >
          <span className="text-xs font-semibold text-pink-600">Admin Restaurant? Login di sini</span>
        </div>
      )}

      {/* Navbar Utama */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Left Section */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FiMapPin className="text-pink-500" /> Menu Digital
            </span>
            <span className="font-semibold text-sm">Meja 01</span>
          </div>
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-pink-500">
            CariMakan
          </Link>
          
          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* 🔥 TOMBOL PESANAN USER */}
            <button 
              onClick={() => navigate('/orders')}
              className="relative text-gray-600 hover:text-pink-500 transition-colors"
              title="Riwayat Pesanan"
            >
              <FiClipboard size={22} />
            </button>

            {/* 🔔 Notifikasi */}
            <UserNotificationBell />
            
            {/* 🛒 Cart Icon */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FiShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;