import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiHeart, FiClock, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import { MenuContext } from '../context/MenuContext';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { menuItems } = useContext(MenuContext);
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);

  useEffect(() => {
    // Find food by id
    const foundFood = menuItems.find(f => f.id === parseInt(id));
    if (foundFood) {
      setFood(foundFood);
    } else {
      navigate('*');
    }
    window.scrollTo(0, 0);
  }, [id, menuItems, navigate]);

  if (!food) return null;

  const favorite = isFavorite(food.id);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0 md:bg-gray-50">
      <div className="md:max-w-4xl md:mx-auto md:bg-white md:min-h-screen md:shadow-sm relative">
        {/* Header/Image section */}
        <div className="relative h-72 md:h-96 w-full">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={() => toggleFavorite(food)}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <FiHeart size={24} className={favorite ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-6 -mt-6 bg-white rounded-t-3xl relative z-10 md:mt-0 md:rounded-none">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{food.name}</h1>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg text-primary">
              <FiStar className="fill-primary" size={16} />
              <span className="font-bold">{food.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-500 mb-4">{food.restaurant}</p>
          
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-2 bg-orange-50 text-accent rounded-full">
                <FiClock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Estimasi</span>
                <span className="font-medium text-sm">{food.estimatedTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-2 bg-green-50 text-primary rounded-full">
                <FiStar size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Review</span>
                <span className="font-medium text-sm">{food.reviews}+</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2">Deskripsi</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {food.description}
          </p>

          <h3 className="text-lg font-bold text-gray-800 mb-2">Komposisi</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {food.ingredients?.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed md:absolute bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 flex items-center justify-between z-50 md:rounded-b-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Harga</span>
            <span className="font-bold text-xl text-primary">
              Rp {(food.price * quantity).toLocaleString('id-ID')}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm"
              >
                <FiMinus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm"
              >
                <FiPlus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-green-200 hover:bg-green-600 transition-colors"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
