import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600 transition-colors shadow-lg"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
};

export default NotFound;
