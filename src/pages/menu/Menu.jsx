import React, { useState, useEffect } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';  // To extract restaurantId and tableId from URL
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';
import { getMenu } from '../../services/apiRestaurant.js';

// Menu component that will render the restaurant's menu
const Menu = () => {
  const { restaurantId } = useParams(); // Extract restaurantId from URL
  const menuData = useLoaderData();  // Get the menu data loaded by the loader
  const [menu, setMenu] = useState(menuData || []);
  const [filteredMenu, setFilteredMenu] = useState(menuData || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMenu(menuData); // Set the loaded menu data
    setFilteredMenu(menuData);
  }, [menuData]);

  useEffect(() => {
    let filtered = menu;

    // Apply filters
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (foodType !== 'All') {
      filtered = filtered.filter(item => item.itemType === foodType);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [selectedCategory, foodType, searchQuery, menu]);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div className="menu-page">
      <Header setSearchQuery={setSearchQuery} />
      <FoodCategoryFilter onCategoryChange={setSelectedCategory} />
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

// Loader function to fetch the menu dynamically based on restaurantId
export async function loader({ params }) {
  const { restaurantId } = params;
  try {
    const menuData = await getMenu(restaurantId);  // Fetch menu based on restaurantId
    return menuData;
  } catch (error) {
    console.error('Error loading menu data:', error);
    return [];
  }
}

export default Menu;
