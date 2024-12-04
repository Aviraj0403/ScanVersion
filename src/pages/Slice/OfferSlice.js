import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOffer } from '../../services/apiRestaurant';  // Import your custom API function

// Create AsyncThunk to fetch offers for a specific restaurant using dynamic restaurantId
export const fetchOffers = createAsyncThunk(
  'offer/fetchOffers',
  async (restaurantId, { rejectWithValue }) => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required');
    }

    try {
      // Fetch the offers for the given restaurantId using the custom API function
      const data = await getOffer(restaurantId, 'Active'); // Example: Fetch active offers
      return data;  // Return the fetched data to Redux
    } catch (error) {
      // If an error occurs, reject the promise with the error message
      return rejectWithValue(error.message);
    }
  }
);

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;  // Store fetched offers in the state
        state.loading = false;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.error = action.payload || action.error.message;  // Store the error message
        state.loading = false;
      });
  },
});

export default offerSlice.reducer;
