
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { getMenu } from '../../services/apiRestaurant.js';
import { Navigation, Pagination } from 'swiper/modules'; // Import modules if needed
import './menuItem.css';

function FoodCategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getMenu();
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
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
  }, []);

  useEffect(() => {
    const fetchFilteredCategories = async () => {
      if (foodType === 'All') {
        setFilteredCategories(categories);
      } else {
        try {
          const data = await getMenu();
          const filtered = data.filter(item => item.itemType === foodType).map(item => item.category);
          const uniqueFilteredCategories = Array.from(new Set(filtered));
          setFilteredCategories(['All', ...uniqueFilteredCategories]);
        } catch (error) {
          console.error('Error fetching filtered categories:', error);
          setError('Failed to filter categories');
        }
      }
    };
    fetchFilteredCategories();
  }, [foodType, categories]);

  const handleCategoryClick = async (category) => {
    if (category === 'All') {
      // Immediately reset both foodType and category to 'All'
      setSelectedCategory('All');
      setFoodType('All');

      // Immediately trigger onCategoryChange with 'All' values
      try {
        await onCategoryChange('All', 'All');
      } catch (error) {
        console.error('Error resetting category and food type:', error);
      }
    } else {
      // If not 'All', set the selected category only
      setSelectedCategory(category);
      try {
        await onCategoryChange(category, foodType);
      } catch (error) {
        console.error('Error changing category:', error);
      }
    }
  };

  const handleFoodTypeClick = async (type) => {
    setFoodType(type);
    setSelectedCategory('All'); // Reset category when changing food type
    try {
      await onCategoryChange('All', type);
    } catch (error) {
      console.error('Error changing food type:', error);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-div mb-7">
      <div className="background-div flex flex-wrap gap-3 w-full mb-5 py-4 veg-navs border-b border-gray-200 pb-3 shadow-lg rounded-lg bg-gradient-to-r from-blue-300 via-white to-purple-200">

        <button
          className={`flex items-center gap-5 w-fit pl-3 pr-4 py-2 rounded-full transition transform hover:scale-105 hover:shadow-lg ${foodType === 'Veg' ? 'bg-green-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Veg')}
          aria-pressed={foodType === 'Veg'}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/non-veg.png" alt="Veg" className="h-6" />
          <span className="capitalize text-sm font-medium">Veg</span>
        </button>

        <button
          className={`flex items-center gap-3 w-fit pl-3 pr-4 py-2 rounded-full transition transform hover:scale-105 hover:shadow-lg ${foodType === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Non-Veg')}
          aria-pressed={foodType === 'Non-Veg'}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/veg.png" alt="Non-Veg" className="h-6" />
          <span className="capitalize text-sm font-medium">Non-Veg</span>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]} // Enable navigation and pagination if needed
        direction="horizontal"
        slidesPerView="auto"
        spaceBetween={12}
        className="menu-swiper"
        style={{ direction: 'ltr', padding: 4 }} // Apply LTR styling
        pagination={{ clickable: true }} // Enable pagination
        navigation // Enable navigation arrows
      >
        {filteredCategories.map((category) => (
          <SwiperSlide key={category} className="!w-fit">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`w-28 flex flex-col items-center text-center gap-1 p-3 rounded-md border transition duration-200 ease-in-out 
                ${selectedCategory === category ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-[#F7F7FC] hover:bg-gray-200'}`}
              aria-pressed={selectedCategory === category}
            >
              <img 
                className="h-10 drop-shadow-category mb-1"
                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB8N27tkV9kQ8toUQMw26UkRiHaL8W_81Bng&s`} // Ensure this URL is correct
                alt={category}
              />
              <h3 className="text-xs leading-4 whitespace-nowrap overflow-hidden text-ellipsis font-medium font-rubik">
                {category}
              </h3>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default FoodCategoryFilter;  