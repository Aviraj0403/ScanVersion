import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch foods using async thunk
export const fetchFoods = createAsyncThunk('food/fetchFoods', async (restaurantId) => {
  if (!restaurantId) {
    console.error('Restaurant ID is missing');
    throw new Error('Restaurant ID is missing');
  }

  console.log('Fetching foods for restaurant ID:', restaurantId); // Debugging log

  const response = await fetch(`/api/foods?restaurantId=${restaurantId}`); // Update with your actual endpoint
  if (!response.ok) {
    console.error('Failed to fetch foods', response.statusText); // Debugging log
    throw new Error('Failed to fetch foods');
  }

  const data = await response.json();
  console.log('Fetched foods:', data); // Debugging log

  return data;
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

export const { clearFoods } = foodSlice.actions;
export default foodSlice.reducer;
