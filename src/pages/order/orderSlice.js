import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    tempOrders: [], // Array to store temporary orders
    submissionStatus: null,
    error: null,
    activeTables: [], // Initialize activeTables as an empty array
    activeOffers: [], // Initialize activeOffers as an empty array
    orderDetails: {}, // Object to store complete order details
  },
  reducers: {
    storeOrderTemporarily: (state, action) => {
      console.log("Received action payload:", action.payload); // Debugging
      if (action.payload) {
        state.tempOrders.push(action.payload);
        console.log("Updated tempOrders:", state.tempOrders); // Debugging
        state.error = null; // Clear any previous errors
      } else {
        console.error("Attempted to store an undefined order.");
      }
    },
    clearTempOrders: (state) => {
      state.tempOrders = []; // Clear the array of orders
      console.log("Temporary orders cleared."); // Debugging
    },
    setActiveTables: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.activeTables = action.payload; // Set active tables
      } else {
        console.error("setActiveTables expected an array, but received:", action.payload);
      }
    },
    setActiveOffers: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.activeOffers = action.payload; // Set active offers
      } else {
        console.error("setActiveOffers expected an array, but received:", action.payload);
      }
    },
    setSubmissionStatus: (state, action) => {
      state.submissionStatus = action.payload; // Set submission status
    },
    setOrderError: (state, action) => {
      state.error = action.payload; // Set error state
    },
    restoreOrders: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.tempOrders = action.payload; // Restore orders from persisted state
      } else {
        console.error("restoreOrders expected an array, but received:", action.payload);
      }
    },
    setOrderDetails: (state, action) => {
      if (action.payload) {
        state.orderDetails = action.payload; // Set complete order details
      } else {
        console.error("Attempted to set undefined order details.");
      }
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
  restoreOrders,
  setOrderDetails 
} = orderSlice.actions;

export default orderSlice.reducer;
