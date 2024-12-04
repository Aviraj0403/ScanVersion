import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMenu } from '../../services/apiRestaurant';  // Import your custom API function

// Create AsyncThunk to fetch foods for a specific restaurant using dynamic restaurantId
export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async (restaurantId, { rejectWithValue }) => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required');
    }

    try {
      // Fetch the food menu for the given restaurantId using the custom API function
      const data = await getMenu(restaurantId);
      return data;  // Return the fetched data to Redux
    } catch (error) {
      // If an error occurs, reject the promise with the error message
      return rejectWithValue(error.message);
    }
  }
);

const foodSlice = createSlice({
  name: "food",
  initialState: {
    foods: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFoods(state) {
      state.foods = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error state
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.foods = action.payload;  // Store fetched foods in the state
        state.loading = false;         // Stop loading
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.error = action.payload || action.error.message;  // Store the error message
        state.loading = false;  // Stop loading
      });
  },
});

// Export actions and reducer
export const { clearFoods } = foodSlice.actions;
export default foodSlice.reducer;
