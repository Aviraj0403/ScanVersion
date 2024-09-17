
import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx'; // Ensure the correct path
import { getMenu } from '../../services/apiRestaurant.js';


const Menu = () => {
  const initialMenuData = useLoaderData(); // Fetch data from loader
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Initialize menu state
  useEffect(() => {
    if (Array.isArray(initialMenuData) && initialMenuData.length > 0) {
      setMenu(initialMenuData);
      setFilteredMenu(initialMenuData);
    } else {
      console.error('Invalid menu data:', initialMenuData);
    }
  }, [initialMenuData]);

  // Filter menu items based on the selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredMenu(menu);
    } else {
      const filtered = menu.filter(item => item.category === selectedCategory);
      setFilteredMenu(filtered);
    }
  }, [selectedCategory, menu]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <FoodCategoryFilter onCategoryChange={handleCategoryChange} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
    return menu; // Ensure loader returns menu data
  } catch (error) {
    console.error('Error loading menu:', error);
    return []; // Return an empty array in case of an error
  }
}

export default Menu;