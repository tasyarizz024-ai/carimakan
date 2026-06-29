import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiHeart } from 'react-icons/fi';
import { FavoriteContext } from '../context/FavoriteContext';
import FoodCard from '../components/FoodCard';
import EmptyState from '../components/EmptyState';
import BottomNavigation from '../components/BottomNavigation';

const Favorite = () => {
  const navigate = useNavigate();
  const { favorites } = useContext(FavoriteContext);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Menu Favorit</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="pt-20">
            <EmptyState 
              icon={FiHeart}
              title="Belum ada favorit"
              description="Simpan makanan yang kamu suka di sini agar mudah dicari nanti."
              buttonText="Cari Makanan"
              onButtonClick={() => navigate('/')}
            />
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Favorite;
