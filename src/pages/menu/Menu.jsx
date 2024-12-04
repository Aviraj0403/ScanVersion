import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurantId } from '../Slice/RestaurantSlice';
import { getMenu } from '../../services/apiRestaurant';
import MenuItem from './MenuItem.jsx';
import FoodCategoryFilter from './FilterFood.jsx';
import Header from '../../components/Header/Header.jsx';

const Menu = () => {
  const { restaurantId: urlRestaurantId } = useParams();
  const dispatch = useDispatch();
  const storedRestaurantId = useSelector((state) => state.restaurant.restaurantId);
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlRestaurantId) {
      if (urlRestaurantId !== storedRestaurantId) {
        dispatch(setRestaurantId(urlRestaurantId));
      }
    } else if (!urlRestaurantId && storedRestaurantId) {
      navigate(`/menu/${storedRestaurantId}`);
    }
  }, [urlRestaurantId, storedRestaurantId, dispatch, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!storedRestaurantId) {
        setError('Restaurant ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const menuData = await getMenu(storedRestaurantId);
        setMenu(menuData);
        setFilteredMenu(menuData); // Initialize filtered menu with the full menu
      } catch (error) {
        console.error('Error fetching menu data:', error);
        setError('Failed to load menu');
      }
      setLoading(false);
    };

    if (storedRestaurantId) {
      fetchData();
    }
  }, [storedRestaurantId]);

  useEffect(() => {
    let filtered = menu;

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
