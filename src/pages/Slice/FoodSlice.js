import { createSlice } from "@reduxjs/toolkit";

const foodSlice = createSlice({
  name: "food",
  initialState: {
    foods: [], // Array to store food items
    loading: false, // To track loading state
    error: null, // To capture any errors
  },
  reducers: {
    startLoading(state) {
      state.loading = true; // Set loading state
      state.error = null; // Clear any previous errors
    },
    setFoods(state, action) {
      state.foods = action.payload; // Set food items
      state.loading = false; // Reset loading state
    },
    setFoodError(state, action) {
      state.error = action.payload; // Capture errors related to foods
      state.loading = false; // Reset loading state
    },
    clearFoods(state) {
      state.foods = []; // Clear food items
    },
  },
});

// Export actions and reducer
export const { setFoods, setFoodError, startLoading, clearFoods } = foodSlice.actions;

export default foodSlice.reducer;
