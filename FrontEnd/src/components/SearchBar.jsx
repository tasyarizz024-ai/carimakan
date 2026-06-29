// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Langsung kirim ke parent saat mengetik
    if (onSearch) onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tetap support submit
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full my-4">
      <div className="absolute left-4 text-gray-400">
        <FiSearch size={20} />
      </div>
      <input
        type="text"
        placeholder="Cari makanan favoritmu..."
        className="w-full bg-white py-3 pl-12 pr-12 rounded-full border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        value={query}
        onChange={handleChange}
      />
      <button 
        type="button"
        className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-green-600 transition-colors"
      >
        <FiSliders size={16} />
      </button>
    </form>
  );
};

export default SearchBar;