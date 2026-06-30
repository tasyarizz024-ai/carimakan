// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

const SearchBar = ({ onSearch, onFilterClick }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full my-4">
      <div className="absolute left-4 text-gray-400">
        <FiSearch size={20} />
      </div>
      <input
        type="text"
        placeholder="Cari makanan favoritmu..."
        className="w-full bg-white py-3 pl-12 pr-12 rounded-full border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        value={query}
        onChange={handleChange}
      />
      
      {/* 🔥 TOMBOL FILTER - BISA DI KLIK */}
      <button 
        type="button"
        onClick={() => {
          console.log('Filter button clicked!');
          if (onFilterClick) {
            onFilterClick();
          }
        }}
        className="absolute right-2 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-md cursor-pointer"
      >
        <FiSliders size={16} />
      </button>
    </form>
  );
};

export default SearchBar;