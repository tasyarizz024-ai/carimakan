import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="hidden md:block bg-white mt-12 py-8 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CariMakan. All rights reserved.</p>
        
        <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
          <a href="#" className="hover:text-primary transition-colors">Tentang Kami</a>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
          
          {/* 🔥 TAMBAHKAN INI - Login Admin */}
          <Link 
            to="/login" 
            className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
          >
            Login Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;