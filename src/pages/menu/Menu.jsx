import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // For URL params and redirection
import { useDispatch, useSelector } from 'react-redux';  // For Redux state management
import { setRestaurantId } from '../Slice/RestaurantSlice';  // Redux action for setting restaurantId
import { getMenu } from '../../services/apiRestaurant';  // API call to fetch menu data
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId: urlRestaurantId } = useParams();  // Get restaurantId from URL
  const dispatch = useDispatch();
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);  // Get restaurantId from Redux
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // State for error handling
  const navigate = useNavigate();  // For redirection

  // Log for debugging
  console.log("URL restaurantId:", urlRestaurantId);
  console.log("Stored restaurantId from Redux:", storedRestaurantId);

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

  // Fetch menu data based on restaurantId from Redux
  useEffect(() => {
    const fetchData = async () => {
      if (!storedRestaurantId) {
        setError('Restaurant ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const menuData = await getMenu(storedRestaurantId);  // Fetch menu data using restaurantId
        setMenu(menuData);
        setFilteredMenu(menuData);  // Initialize filtered menu
      } catch (error) {
        console.error('Error fetching menu data:', error);
        setError('Failed to load menu');
      }
      setLoading(false);
    };

    if (storedRestaurantId) {
      fetchData();  // Fetch menu data if restaurantId exists
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
      <FoodCategoryFilter onCategoryChange={(category, type) => {
        setSelectedCategory(category);
        setFoodType(type);
      }} />  {/* Category filter */}
      
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
