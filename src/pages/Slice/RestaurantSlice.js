import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  menuData: [], // Menu data state
  filteredMenuData: [], // Filtered menu data state
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // Action to set the restaurantId
    setRestaurantId: (state, action) => {
      state.restaurantId = action.payload;
    },
    // Action to set the menu data
    setMenuData: (state, action) => {
      state.menuData = action.payload;
    },
    // Action to set the filtered menu data
    setFilteredMenuData: (state, action) => {
      state.filteredMenuData = action.payload;
    },
  },
});

export const { setRestaurantId, setMenuData, setFilteredMenuData } = restaurantSlice.actions;

export default restaurantSlice.reducer;
