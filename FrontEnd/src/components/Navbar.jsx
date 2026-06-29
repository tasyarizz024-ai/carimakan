import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiMapPin, FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <>
      {!localStorage.getItem('isAdmin') && (
        <div className="bg-pink-50 w-full py-1.5 px-4 text-center cursor-pointer hover:bg-pink-100 transition-colors" onClick={() => navigate('/login')}>
          <span className="text-xs font-semibold text-pink-600">Admin Restaurant? Login di sini</span>
        </div>
      )}
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <FiMapPin className="text-accent" /> Menu Digital
          </span>
          <span className="font-semibold text-sm">Meja 01</span>
        </div>
        
        <Link to="/" className="text-xl font-bold text-primary">
          CariMakan
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-primary transition-colors">
            <FiBell size={24} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          
          {/* Desktop Cart Icon (Hidden on mobile) */}
          <button 
            onClick={() => navigate('/cart')}
            className="hidden md:flex relative text-gray-600 hover:text-primary transition-colors"
          >
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
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
