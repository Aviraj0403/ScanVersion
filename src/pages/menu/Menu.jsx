import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Extract restaurantId
import { useDispatch, useSelector } from 'react-redux';  // To interact with Redux
import { setRestaurantId, setMenuData, setFilteredMenuData } from '../Slice/RestaurantSlice';  // Correct import of actions
import { getMenu } from '../../services/apiRestaurant';  // API function
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId } = useParams();  // Extract restaurantId from the URL
  const dispatch = useDispatch();
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);  // Get restaurantId from Redux state
  const [menu, setMenu] = useState([]);  // State for storing the full menu
  const [filteredMenu, setFilteredMenu] = useState([]);  // State for filtered menu based on user input
  const [selectedCategory, setSelectedCategory] = useState('All');  // Selected category for filtering
  const [foodType, setFoodType] = useState('All');  // Selected food type for filtering
  const [searchQuery, setSearchQuery] = useState('');  // Search query for filtering
  const [loading, setLoading] = useState(true);  // Loading state for menu data

  // Synchronize the restaurantId from URL with Redux
  useEffect(() => {
    if (restaurantId && restaurantId !== storedRestaurantId) {
      dispatch(setRestaurantId(restaurantId));  // Update Redux state if the restaurantId in URL changes
    }
  }, [restaurantId, storedRestaurantId, dispatch]);

  // Fetch menu data when restaurantId is available in Redux
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuData = await getMenu(storedRestaurantId);  // Fetch menu using restaurantId from Redux
        dispatch(setMenuData(menuData));  // Dispatch action to set menu data in Redux store
        setMenu(menuData);
        setFilteredMenu(menuData);  // Initialize filtered menu with full menu
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
      setLoading(false);
    };

    if (storedRestaurantId) {
      fetchData();  // Fetch menu data only if storedRestaurantId is available
    }
  }, [storedRestaurantId, dispatch]);  // Re-fetch menu if storedRestaurantId changes

  // Apply filters and search query
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

    dispatch(setFilteredMenuData(filtered));  // Dispatch filtered menu data to Redux
    setFilteredMenu(filtered);  // Update filtered menu state
  }, [selectedCategory, foodType, searchQuery, menu, dispatch]);  // Reapply filters when any filter or menu changes

  if (loading) {
    return <p>Loading menu...</p>;  // Show loading message while fetching the menu
  }

  return (
    <div className="menu-page">
      <Header setSearchQuery={setSearchQuery} />  {/* Header with search input */}
      <FoodCategoryFilter onCategoryChange={setSelectedCategory} />  {/* Food category filter */}
      <div className="card-div mt-2 mb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t border-gray-300 pt-2 pb-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItem key={item._id} fooditem={item} />  
          ))
        ) : (
          <p>No items found</p>  // Show message if no items match the filters
        )}
      </div>
    </div>
  );
};

export default Menu;
