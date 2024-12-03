// Menu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Extract restaurantId
import { getMenu, getDiningTables, getOffer } from '../../services/apiRestaurant'; // API functions
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId } = useParams();  // Extract restaurantId from the URL
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuData = await getMenu(restaurantId);
        setMenu(menuData);
        setFilteredMenu(menuData);  // Initialize with full menu data
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [restaurantId]);  // Dependency array ensures the effect runs when restaurantId changes

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

export default Menu;
