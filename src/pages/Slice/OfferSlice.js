import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch offers using async thunk
export const fetchOffers = createAsyncThunk('offer/fetchOffers', async (restaurantId) => {
  const response = await fetch(`/api/offers?restaurantId=${restaurantId}`); // Update with your actual endpoint
  if (!response.ok) throw new Error('Failed to fetch offers');
  return response.json();
});

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
        state.offers = action.payload;
        state.loading = false;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default offerSlice.reducer;
