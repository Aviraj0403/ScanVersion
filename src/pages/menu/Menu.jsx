import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurantId } from '../Slice/RestaurantSlice';
import { fetchFoods } from '../../Slice/foodSlice';  // Import your fetchFoods action
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId: urlRestaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);
  const { foods, loading, error } = useSelector((state) => state.food); // Access Redux state for menu
  
  const [filteredMenu, setFilteredMenu] = useState(foods);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Update the restaurant ID in Redux and handle menu fetching
  useEffect(() => {
    if (urlRestaurantId) {
      if (urlRestaurantId !== storedRestaurantId) {
        dispatch(setRestaurantId(urlRestaurantId)); // Set restaurant ID in Redux
      }
    } else if (!urlRestaurantId && storedRestaurantId) {
      navigate(`/menu/${storedRestaurantId}`); // Redirect if no URL restaurant ID is found
    }
  }, [urlRestaurantId, storedRestaurantId, dispatch, navigate]);

  // Fetch menu data from Redux store when the restaurantId is set
  useEffect(() => {
    if (storedRestaurantId) {
      dispatch(fetchFoods(storedRestaurantId)); // Dispatch fetchFoods action
    }
  }, [storedRestaurantId, dispatch]);

  // Filter menu based on selected filters (memoized for performance)
  const filterMenu = useCallback(() => {
    let filtered = foods;

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

    setFilteredMenu(filtered); // Set the filtered menu
  }, [foods, selectedCategory, foodType, searchQuery]);

  // Apply filters when state changes
  useEffect(() => {
    filterMenu();
  }, [selectedCategory, foodType, searchQuery, foods, filterMenu]);

  // Display loading or error states
  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="menu-page">
      <Header setSearchQuery={setSearchQuery} />
      <FoodCategoryFilter
        onCategoryChange={(category, type) => {
          setSelectedCategory(category);
          setFoodType(type);
        }}
        restaurantId={storedRestaurantId}
      />

      <div className="card-div mt-2 mb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t border-gray-300 pt-2 pb-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItem key={item._id} fooditem={item} />
          ))
        ) : (
          <p>No items found matching the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
