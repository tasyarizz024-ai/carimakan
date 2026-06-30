// src/components/UserNotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiClock, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserNotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/notifications', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const getIcon = () => {
    return <FiPackage className="text-green-500" size={18} />;
  };

  // 🔥 TANDAI SEMUA NOTIFIKASI SUDAH DIBACA
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  // 🔥 KLIK NOTIFIKASI -> TANDAI SUDAH DIBACA + BUKA ORDERS
  const handleNotificationClick = () => {
    setShowDropdown(false);
    navigate('/orders');
  };

  return (
    <div className="relative inline-block">
      {/* Tombol Notifikasi */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-50"
        aria-label="Notifikasi"
        type="button"
      >
        <FiBell size={22} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-[9999] overflow-hidden"
          style={{ top: '100%' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Notifikasi Pesanan</h3>
            <div className="flex gap-2 items-center">
              {/* 🔥 TOMBOL TANDAI SEMUA DIBACA */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-pink-500 font-medium hover:underline"
                >
                  <FiCheckCircle size={12} />
                  Tandai semua dibaca
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Daftar Notifikasi */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Memuat...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiBell size={30} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 transition-all ${
                    !notification.read ? 'bg-pink-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FiClock size={12} />
                        {notification.time}
                      </p>
                      {notification.status && (
                        <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                          notification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          notification.status === 'cooking' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {notification.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Tombol Lihat Semua Pesanan */}
          <div 
            onClick={handleNotificationClick}
            className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-pink-50 cursor-pointer transition-colors"
          >
            <span className="text-sm font-medium text-pink-500 hover:text-pink-600">
              📋 Lihat semua pesanan
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotificationBell;