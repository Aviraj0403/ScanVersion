import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { getMenu } from '../../services/apiRestaurant.js';

function FoodCategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All'); // New state for Veg/Non-Veg

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenu();
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category, foodType); // Pass foodType as well
  };

  const handleFoodTypeClick = (type) => {
    setFoodType(type);
    onCategoryChange(selectedCategory, type); // Pass selectedCategory and foodType
  };

  return (
    <div className="mb-7">
      <div className="flex flex-wrap gap-3 w-full mb-5 veg-navs">
        <button
          className={`flex items-center gap-3 w-fit pl-3 pr-4 py-1.5 rounded-3xl transition hover:shadow-filter hover:bg-white ${foodType === 'Non-Veg' ? 'bg-blue-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Non-Veg')}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/non-veg.png" alt="Non-Veg" className="h-6" />
          <span className="capitalize text-sm font-medium">Non-Veg</span>
        </button>
        
        <button
          className={`flex items-center gap-3 w-fit pl-3 pr-4 py-1.5 rounded-3xl transition hover:shadow-filter hover:bg-white ${foodType === 'Veg' ? 'bg-blue-500 text-white' : 'bg-[#EFF0F6] text-heading'}`}
          type="button"
          onClick={() => handleFoodTypeClick('Veg')}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/veg.png" alt="Veg" className="h-6" />
          <span className="capitalize text-sm font-medium">Veg</span>
        </button>
      </div>
      
      <Swiper
        direction="horizontal"
        slidesPerView="auto"
        spaceBetween={12}
        className="menu-swiper"
        style={{ direction: 'ltr' }} // Apply LTR styling
      >
        {categories.map((category) => (
          <SwiperSlide key={category} className="!w-fit">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`w-28 flex flex-col items-center text-center gap-1 p-3 rounded-md border transition duration-200 ease-in-out 
                ${selectedCategory === category ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-[#F7F7FC] hover:bg-gray-200'}`}
            >
              <img 
                className="h-10 drop-shadow-category mb-1"
                src={`https://example.com/icons/${category.toLowerCase().replace(/\s+/g, '-')}.png`} // Example image URL; replace as needed
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
