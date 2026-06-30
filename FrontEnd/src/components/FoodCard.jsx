import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiPlus } from 'react-icons/fi';
import Rating from './Rating';
import { FavoriteContext } from '../context/FavoriteContext';
import { CartContext } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);
  const { addToCart } = useContext(CartContext);
  
  const favorite = isFavorite(food.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(food);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      <div className="relative h-40 overflow-hidden">
        <Link to={`/detail/${food.id}`} className="block w-full h-full">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <FiHeart size={18} className={favorite ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/detail/${food.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-gray-800 line-clamp-1">{food.name}</h3>
          </Link>
        </div>
        <p className="text-xs text-gray-500 mb-2">{food.restaurant}</p>
        
        <div className="flex items-center gap-3 mb-4">
          <Rating value={food.rating} reviews={food.reviews} />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={12} />
            <span>{food.estimatedTime}</span>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-primary">
            Rp {food.price.toLocaleString('id-ID')}
          </span>
          {food.stock > 0 ? (
            <button 
              onClick={handleAddToCart}
              className="bg-pink-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-sm z-10"
            >
              <FiPlus size={20} />
            </button>
          ) : (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Habis</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
