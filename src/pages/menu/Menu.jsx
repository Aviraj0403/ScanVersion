import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import { getMenu } from '../../services/apiRestaurant.js';

const Menu = () => {
  const initialMenuData = useLoaderData();
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(initialMenuData) && initialMenuData.length > 0) {
      setMenu(initialMenuData);
      setFilteredMenu(initialMenuData);
      setLoading(false); // Set loading to false once data is set
    } else {
      console.error('Invalid menu data:', initialMenuData);
      setLoading(false);
    }
  }, [initialMenuData]);

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

  if (loading) {
    return <p>Loading menu...</p>; // Loading state
  }

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
    return menu;
  } catch (error) {
    console.error('Error loading menu:', error);
    return [];
  }
}

export default Menu;
