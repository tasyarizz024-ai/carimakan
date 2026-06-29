import React from 'react';
import { categories } from '../data/foods';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2 my-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all shadow-sm ${
            selectedCategory === category.name
              ? 'bg-primary text-white font-medium'
              : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-100'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
