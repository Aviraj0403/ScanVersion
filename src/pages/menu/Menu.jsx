import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import { getMenu } from '../../services/apiRestaurant.js';
import Header from '../../components/Header/Header.jsx'; // Adjust the import based on your structure

const Menu = () => {
  const initialMenuData = useLoaderData();
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(initialMenuData) && initialMenuData.length > 0) {
      setMenu(initialMenuData);
      setFilteredMenu(initialMenuData);
      setLoading(false);
    } else {
      console.error('Invalid menu data:', initialMenuData);
      setLoading(false);
    }
  }, [initialMenuData]);

  useEffect(() => {
    let filtered = menu;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by food type
    if (foodType !== 'All') {
      filtered = filtered.filter(item => item.itemType === foodType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [selectedCategory, foodType, searchQuery, menu]);

  const handleCategoryChange = (category, type) => {
    setSelectedCategory(category);
    setFoodType(type); // Update food type when category changes
  };

  if (loading) {
    return <p>Loading menu...</p>; // Loading state
  }

  return (
    <div className='menu-page'>
      <Header setSearchQuery={setSearchQuery} /> {/* Pass the setSearchQuery to Header */}
      <FoodCategoryFilter onCategoryChange={handleCategoryChange} />
      <div className="card-div mt-2 mb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t border-gray-300 pt-2 pb-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItem key={item._id} fooditem={item} />
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export async function loader() {
  try {
    const menu = await getMenu();
    return menu;
  } catch (error) {
    console.error('Error loading menu:', error);
    return [];
  }
}

export default Menu;
