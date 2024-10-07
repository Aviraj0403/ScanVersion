import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOffers = createAsyncThunk('offer/fetchOffers', async () => {
  const response = await fetch('/api/offers'); // Update with your actual endpoint
  if (!response.ok) throw new Error('Failed to fetch offers');
  return response.json();
});

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offers: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export default offerSlice.reducer;
