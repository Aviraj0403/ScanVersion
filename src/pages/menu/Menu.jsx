import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // For URL params and redirection
import { useDispatch, useSelector } from 'react-redux';  // For Redux state management
import { setRestaurantId } from '../Slice/RestaurantSlice';  // Redux action for setting restaurantId
import { fetchFoods } from '../Slice/FoodSlice';  // Fetch food items action from Redux
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId: urlRestaurantId } = useParams();  // Get restaurantId from URL
  const dispatch = useDispatch();
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);  // Get restaurantId from Redux
  const { foods, loading, error } = useSelector((state) => state.food);  // Get food state from Redux
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();  // For redirection

  // Update Redux state with restaurantId from URL or redirect if missing
  useEffect(() => {
    if (urlRestaurantId) {
      if (urlRestaurantId !== storedRestaurantId) {
        // Update Redux state with restaurantId from URL
        dispatch(setRestaurantId(urlRestaurantId));
      }
    } else if (!urlRestaurantId && storedRestaurantId) {
      // If restaurantId is missing from URL, redirect to stored restaurantId in Redux
      navigate(`/menu/${storedRestaurantId}`);
    }
  }, [urlRestaurantId, storedRestaurantId, dispatch, navigate]);

  // Fetch food items based on restaurantId from Redux
  useEffect(() => {
    if (storedRestaurantId) {
      dispatch(fetchFoods(storedRestaurantId));  // Dispatch the action to fetch foods
    }
  }, [storedRestaurantId, dispatch]);

  // Apply filters and search query
  useEffect(() => {
    let filtered = foods;

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
  }, [selectedCategory, foodType, searchQuery, foods]);

  // If loading, show a loading message
  if (loading) {
    return <p>Loading menu...</p>;
  }

  // If there's an error, show an error message
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="menu-page">
      <Header setSearchQuery={setSearchQuery} />  {/* Header with search input */}
      
      {/* Pass restaurantId to FoodCategoryFilter */}
      <FoodCategoryFilter 
        onCategoryChange={(category, type) => {
          setSelectedCategory(category);
          setFoodType(type);
        }}
        restaurantId={storedRestaurantId}  // Pass the restaurantId here
      />
      
      {/* Render filtered menu items */}
      <div className="card-div mt-2 mb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t border-gray-300 pt-2 pb-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItem key={item._id} fooditem={item} />  // Render menu items
          ))
        ) : (
          <p>No items found</p>  // Show message if no items match the filters
        )}
      </div>
    </div>
  );
};

export default Menu;
