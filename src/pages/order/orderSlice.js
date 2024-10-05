import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    tempOrders: [], // Array to store temporary orders
    submissionStatus: null,
    error: null,
    activeTables: [], // Initialize activeTables as an empty array
    activeOffers: [], // Initialize activeOffers as an empty array
  },
  reducers: {
    storeOrderTemporarily: (state, action) => {
      state.tempOrders.push(action.payload);
      state.error = null; // Clear any previous errors
    },
    clearTempOrders: (state) => {
      state.tempOrders = []; // Clear the array of orders
    },
    setActiveTables: (state, action) => {
      state.activeTables = action.payload; // Set active tables
    },
    setActiveOffers: (state, action) => {
      state.activeOffers = action.payload; // Set active offers
    },
    setSubmissionStatus: (state, action) => {
      state.submissionStatus = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
    restoreOrders: (state, action) => {
      state.tempOrders = action.payload; // Restore orders from persisted state
    },
  },
});

// Export actions
export const { 
  storeOrderTemporarily, 
  clearTempOrders, 
  setActiveTables, 
  setActiveOffers, 
  setSubmissionStatus, 
  setOrderError, 
  restoreOrders 
} = orderSlice.actions;

export default orderSlice.reducer;
