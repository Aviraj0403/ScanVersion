import React, { useState, useEffect } from 'react';
import { getMenu } from '../../services/apiRestaurant';  // API call to fetch menu data

function FoodCategoryFilter({ onCategoryChange, restaurantId }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories from the API based on restaurantId
  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMenu(restaurantId); // Fetch data for restaurantId
        const uniqueCategories = Array.from(new Set(data.map(item => item.category))); // Get unique categories
        setCategories(['All', ...uniqueCategories]);
        setFilteredCategories(['All', ...uniqueCategories]); // Initially show all categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]); // Re-run when restaurantId changes

  // Fetch categories based on the selected food type
  useEffect(() => {
    const fetchFilteredCategories = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is required');
        return;
      }

      try {
        if (foodType === 'All') {
          setFilteredCategories(categories); // Show all categories if food type is All
        } else {
          const data = await getMenu(restaurantId); // Fetch data for restaurantId
          const filtered = data.filter(item => item.itemType === foodType).map(item => item.category);
          const uniqueFilteredCategories = Array.from(new Set(filtered)); // Get unique categories
          setFilteredCategories(['All', ...uniqueFilteredCategories]);
        }
      } catch (error) {
        console.error('Error fetching filtered categories:', error);
        setError('Failed to filter categories');
      }
    };

    fetchFilteredCategories();
  }, [foodType, categories, restaurantId]); // Re-run when foodType or restaurantId changes

  // Handle category click event
  const handleCategoryClick = async (category) => {
    if (category === 'All') {
      setSelectedCategory('All');
      setFoodType('All');
      try {
        await onCategoryChange('All', 'All'); // Reset both category and food type
      } catch (error) {
        console.error('Error resetting category and food type:', error);
      }
    } else {
      setSelectedCategory(category);
      try {
        await onCategoryChange(category, foodType); // Update category without changing food type
      } catch (error) {
        console.error('Error changing category:', error);
      }
    }
  };

  // Handle food type change
  const handleFoodTypeClick = async (type) => {
    setFoodType(type);
    setSelectedCategory('All'); // Reset category when changing food type
    try {
      await onCategoryChange('All', type); // Update category and food type
    } catch (error) {
      console.error('Error changing food type:', error);
    }
  };

  // Loading and error handling
  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-div mb-7">
      {/* Food type buttons */}
      <div className="background-div flex flex-wrap gap-3 w-full mb-5 py-4 veg-navs border-b border-gray-200 pb-3 shadow-lg rounded-lg bg-gradient-to-r from-blue-300 via-white to-purple-200">
        <button
          className={`flex items-center gap-5 w-fit pl-3 pr-4 py-2 rounded-full transition transform hover:scale-105 hover:shadow-lg ${foodType === 'Veg' ? 'bg-green-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Veg')}
          aria-pressed={foodType === 'Veg'}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/non-veg.png" alt="veg" className="w-6 h-6" />
          Veg
        </button>
        <button
          className={`flex items-center gap-5 w-fit pl-3 pr-4 py-2 rounded-full transition transform hover:scale-105 hover:shadow-lg ${foodType === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Non-Veg')}
          aria-pressed={foodType === 'Non-Veg'}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/non-veg.png" alt="non-veg" className="w-6 h-6" />
          Non-Veg
        </button>
      </div>

      {/* Category buttons */}
      <div className="categories-container flex flex-wrap gap-3 justify-center mb-5">
        {filteredCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={`category-button ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodCategoryFilter;
