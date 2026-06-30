import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import BottomNavigation from '../components/BottomNavigation';
import SearchBar from '../components/SearchBar';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import FoodCard from '../components/FoodCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import { MenuContext } from '../context/MenuContext';

const Home = () => {
  const { menuItems } = useContext(MenuContext);
  const [loading, setLoading] = useState(true);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredFoods(menuItems);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [menuItems]);

  useEffect(() => {
    let result = menuItems;
    
    if (selectedCategory !== 'Semua') {
      result = result.filter(food => food.category === selectedCategory);
    }
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        food => 
          food.name.toLowerCase().includes(lowerCaseQuery) || 
          food.restaurant.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    setFilteredFoods(result);
  }, [selectedCategory, searchQuery, menuItems]);

  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilter = () => {
    setShowFilterModal(false);
  };

  const categories = ['Semua', 'Nasi', 'Mie', 'Sate', 'Ayam', 'Sayur', 'Minuman'];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-4">
        <SearchBar onSearch={setSearchQuery} onFilterClick={handleFilterClick} />
        <HeroBanner />
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Kategori Menu</h2>
          <CategoryList 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
        
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {searchQuery ? 'Hasil Pencarian' : 'Makanan Populer'}
            </h2>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : filteredFoods.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredFoods.map(food => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Makanan tidak ditemukan" 
              description="Maaf, kami tidak dapat menemukan makanan yang Anda cari."
              buttonText="Lihat Semua Menu"
              onButtonClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
            />
          )}
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />

      {/* 🔥 MODAL FILTER */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Filter Menu</h3>
              <button 
                onClick={handleCloseFilter} 
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Pilih Kategori
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        handleCloseFilter();
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                  handleCloseFilter();
                }}
                className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;