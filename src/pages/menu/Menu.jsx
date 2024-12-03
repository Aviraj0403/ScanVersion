import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import { useDispatch, useSelector } from 'react-redux';  // For Redux state management
import { setRestaurantId } from '../Slice/RestaurantSlice';  // Redux action to set restaurantId
import { getMenu } from '../../services/apiRestaurant';  // API call to fetch menu data
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId: urlRestaurantId } = useParams();  // Get restaurantId from the URL params
  const dispatch = useDispatch();
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);  // Redux state for restaurantId
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // For redirection

  // UseEffect to handle restaurantId from URL and update Redux state
  useEffect(() => {
    // Check if the URL restaurantId is valid and not null
    if (urlRestaurantId && urlRestaurantId !== storedRestaurantId) {
      dispatch(setRestaurantId(urlRestaurantId));  // Update Redux state
    } else if (!urlRestaurantId && storedRestaurantId) {
      // If restaurantId is missing in the URL, redirect to the stored one (if available)
      navigate(`/menu/${storedRestaurantId}`);
    }
  }, [urlRestaurantId, storedRestaurantId, dispatch, navigate]);

  // Fetch menu data based on restaurantId from Redux
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuData = await getMenu(storedRestaurantId);  // Fetch menu data using Redux state restaurantId
        setMenu(menuData);
        setFilteredMenu(menuData);  // Initialize filtered menu
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
      setLoading(false);
    };

    if (storedRestaurantId) {
      fetchData();  // Fetch menu data if restaurantId exists in Redux
    }
  }, [storedRestaurantId]);

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

    setFilteredMenu(filtered);  // Update filtered menu
  }, [selectedCategory, foodType, searchQuery, menu]);

  if (loading) {
    return <p>Loading menu...</p>;  // Show loading message while fetching the menu
  }

  return (
    <div className="menu-page">
      <Header setSearchQuery={setSearchQuery} />  {/* Header with search input */}
      <FoodCategoryFilter onCategoryChange={setSelectedCategory} />  {/* Category filter */}
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
