import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const BottomNavigation = () => {
  const { totalItems } = useContext(CartContext);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/favorite', icon: FiHeart, label: 'Favorite' },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: totalItems },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full space-y-1 relative
              ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
            }
          >
            <div className="relative">
              <item.icon size={22} />
              {item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
