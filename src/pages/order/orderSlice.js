import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    tempOrders: [],           // Temporary orders
    submissionStatus: null,   // Order submission status
    error: null,              // Error handling state
    activeTables: [],         // Active tables for the restaurant
    activeOffers: [],         // Active offers for the restaurant
    orderDetails: {},         // Complete details of the order
    ordersHistory: [],        // Historical orders
  },
  reducers: {
    storeOrderTemporarily: (state, action) => {
      const newOrder = action.payload;
      console.log("Received action payload:", newOrder);
      if (newOrder) {
        const existingOrderIndex = state.tempOrders.findIndex(order => order.id === newOrder.id);
        if (existingOrderIndex >= 0) {
          state.tempOrders = [
            ...state.tempOrders.slice(0, existingOrderIndex),
            newOrder,
            ...state.tempOrders.slice(existingOrderIndex + 1),
          ]; // Use spread to create new array
        } else {
          state.tempOrders = [...state.tempOrders, newOrder]; // Add new order using spread
        }
        state.error = null; // Reset error on successful action
        console.log("Updated tempOrders:", state.tempOrders);
      } else {
        console.error("Attempted to store an undefined order.");
        state.error = "Failed to store order: Invalid data.";
      }
    },
    clearTempOrders: (state) => {
      state.tempOrders = [];
      console.log("Temporary orders cleared.");
    },
    setActiveTables: (state, action) => {
      const tables = action.payload;
      if (Array.isArray(tables)) {
        state.activeTables = tables;
      } else {
        console.error("setActiveTables expected an array, but received:", tables);
      }
    },
    setActiveOffers: (state, action) => {
      const offers = action.payload;
      if (Array.isArray(offers)) {
        state.activeOffers = offers;
      } else {
        console.error("setActiveOffers expected an array, but received:", offers);
      }
    },
    setSubmissionStatus: (state, action) => {
      state.submissionStatus = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
    restoreOrders: (state, action) => {
      const orders = action.payload;
      if (Array.isArray(orders)) {
        state.tempOrders = orders;
      } else {
        console.error("restoreOrders expected an array, but received:", orders);
      }
    },
    setOrderDetails: (state, action) => {
      const orderDetails = action.payload;
      if (orderDetails) {
        state.orderDetails = orderDetails;
      } else {
        console.error("Attempted to set undefined order details.");
        state.error = "Failed to set order details.";
      }
    },
    addOrderToHistory: (state, action) => {
      const order = action.payload;
      if (order) {
        state.ordersHistory.push(order); // Save the order to history
      } else {
        console.error("Attempted to add undefined order to history.");
        state.error = "Failed to add order to history.";
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
  setOrderDetails,
  addOrderToHistory 
} = orderSlice.actions;

export default orderSlice.reducer;
