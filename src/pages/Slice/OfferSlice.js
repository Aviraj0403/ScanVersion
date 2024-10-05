// offerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offers: [], // Initial state for offers
    error: null, // To capture any errors
  },
  reducers: {
    setOffers(state, action) {
      state.offers = action.payload; // Set offers
    },
    setOfferError(state, action) {
      state.error = action.payload; // Capture errors related to offers
    },
  },
});

// Export actions and reducer
export const { setOffers, setOfferError } = offerSlice.actions;

export default offerSlice.reducer;
