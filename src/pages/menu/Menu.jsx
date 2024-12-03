import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // To extract restaurantId and tableId from URL
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import { getMenu } from '../../services/apiRestaurant.js';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId, tableId } = useParams();  // Extract restaurantId and tableId from URL
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch menu data for the restaurant using the restaurantId
    const fetchRestaurantMenu = async () => {
      try {
        const menuData = await getMenu(restaurantId); // Use restaurantId in the API call
        setMenu(menuData);
        setFilteredMenu(menuData);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setMenu([]);
        setFilteredMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantMenu();
  }, [restaurantId]);

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

// Export loader to fetch data
export async function loader({ params }) {
  const { restaurantId } = params;
  try {
    const menuData = await getMenu(restaurantId);
    return menuData;
  } catch (error) {
    console.error('Error loading menu data:', error);
    return [];
  }
}

export default Menu;
