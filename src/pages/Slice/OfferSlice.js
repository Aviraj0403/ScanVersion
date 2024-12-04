import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch offers using an async thunk that accepts restaurantId
export const fetchOffers = createAsyncThunk('offer/fetchOffers', async (restaurantId) => {
  const response = await fetch(`/api/offers?restaurantId=${restaurantId}`); // Include restaurantId in the API request
  if (!response.ok) throw new Error('Failed to fetch offers');
  return response.json();
});

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offers: [], // Stores fetched offers
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload; // Store fetched offers
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.error = action.error.message; // Store error if any
      });
  },
});

export default offerSlice.reducer;
