import React, { useState } from 'react';

// Sample food data
const foodItems = [
  { id: 1, name: 'Pancakes', category: 'Breakfast' },
  { id: 2, name: 'Omelette', category: 'Breakfast' },
  { id: 3, name: 'Sandwich', category: 'Lunch' },
  { id: 4, name: 'Salad', category: 'Lunch' },
  { id: 5, name: 'Steak', category: 'Dinner' },
  { id: 6, name: 'Pasta', category: 'Dinner' },
];

function FoodCategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter the food items based on the selected category
  const filteredFoodItems =
    selectedCategory === 'All'
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <h1>Food Category Filter</h1>

      {/* Category Filter Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedCategory('All')}
          className="bg-gray-200 p-2 rounded-md"
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory('Breakfast')}
          className="bg-yellow-200 p-2 rounded-md"
        >
          Breakfast
        </button>
        <button
          onClick={() => setSelectedCategory('Lunch')}
          className="bg-green-200 p-2 rounded-md"
        >
          Lunch
        </button>
        <button
          onClick={() => setSelectedCategory('Dinner')}
          className="bg-blue-200 p-2 rounded-md"
        >
          Dinner
        </button>
      </div>

      {/* Display Filtered Food Items */}
      <ul>
        {filteredFoodItems.map((food) => (
          <li key={food.id} className="mb-2 p-2 border rounded-md">
            {food.name} - {food.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FoodCategoryFilter;
