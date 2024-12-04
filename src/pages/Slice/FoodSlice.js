import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create an async action to fetch food items based on restaurantId
export const fetchFoods = createAsyncThunk('food/fetchFoods', async (restaurantId) => {
  const response = await fetch(`/api/foods?restaurantId=${restaurantId}`);  // Pass the restaurantId in the API call
  if (!response.ok) throw new Error('Failed to fetch foods');
  return response.json();
});

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
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.foods = action.payload;
        state.loading = false;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const { clearFoods } = foodSlice.actions;
export default foodSlice.reducer;
