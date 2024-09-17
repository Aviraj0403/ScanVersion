import React, { useState, useEffect } from 'react';
import { getMenu } from '../../services/apiRestaurant.js';

function FoodCategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenu(); // Fetch menu data from your API
        const uniqueCategories = Array.from(new Set(data.map(item => item.category))); // Extract unique categories
        setCategories(['All', ...uniqueCategories]); // Include 'All' to show all items
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category); // Notify parent of the category change
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Food Category Filter</h1>

      <div className="flex space-x-4 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`p-2 rounded-md ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodCategoryFilter;
