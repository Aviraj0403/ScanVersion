import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    tempOrders: [],
    submissionStatus: null,
    error: null,
    activeTables: [],
    activeOffers: [],
    orderDetails: {},
    ordersHistory: [],
  },
  reducers: {
    storeOrderTemporarily: (state, action) => {
      console.log("Received action payload:", action.payload);
      if (action.payload) {
        // Check for duplicate orders
        const existingOrderIndex = state.tempOrders.findIndex(order => order.id === action.payload.id);
        if (existingOrderIndex >= 0) {
          state.tempOrders[existingOrderIndex] = action.payload; // Update existing order
        } else {
          state.tempOrders.push(action.payload); // Add new order
        }
        console.log("Updated tempOrders:", state.tempOrders);
        state.error = null;
      } else {
        console.error("Attempted to store an undefined order.");
      }
    },
    clearTempOrders: (state) => {
      state.tempOrders = [];
      console.log("Temporary orders cleared.");
    },
    setActiveTables: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.activeTables = action.payload;
      } else {
        console.error("setActiveTables expected an array, but received:", action.payload);
      }
    },
    setActiveOffers: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.activeOffers = action.payload;
      } else {
        console.error("setActiveOffers expected an array, but received:", action.payload);
      }
    },
    setSubmissionStatus: (state, action) => {
      state.submissionStatus = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
    restoreOrders: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.tempOrders = action.payload;
      } else {
        console.error("restoreOrders expected an array, but received:", action.payload);
      }
    },
    setOrderDetails: (state, action) => {
      if (action.payload) {
        state.orderDetails = action.payload;
      } else {
        console.error("Attempted to set undefined order details.");
      }
    },
    addOrderToHistory: (state, action) => {
      // Save the order to history
      state.ordersHistory.push(action.payload);
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
  setOrderDetails ,
  addOrderToHistory 
} = orderSlice.actions;

export default orderSlice.reducer;
