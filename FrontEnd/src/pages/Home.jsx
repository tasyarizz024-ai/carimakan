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

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setFilteredFoods(menuItems);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [menuItems]);

  useEffect(() => {
    let result = menuItems;
    
    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter(food => food.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        food => 
          food.name.toLowerCase().includes(lowerCaseQuery) || 
          food.restaurant.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    setFilteredFoods(result);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-4">
        <SearchBar onSearch={setSearchQuery} />
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
    </div>
  );
};

export default Home;
