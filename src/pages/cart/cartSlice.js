import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [], // Array to hold cart items
  },
  reducers: {
    addItem: (state, action) => {
      // Check if the item already exists in the cart
      const existingItem = state.cart.find(item => item.fooditemId === action.payload.fooditemId);
      
      if (existingItem) {
        // If the item is already in the cart, increase its quantity
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        // Otherwise, add the new item to the cart
        state.cart.push(action.payload); // payload = newItem
      }
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter(item => item.fooditemId !== action.payload); // payload = fooditemId
    },
    increaseItem: (state, action) => {
      const item = state.cart.find(item => item.fooditemId === action.payload);
      
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price; // Use 'price' instead of 'unitPrice'
      }
    },
    decreaseItem: (state, action) => {
      const item = state.cart.find(item => item.fooditemId === action.payload);

      if (item) {
        item.quantity--;
        item.totalPrice = item.quantity * item.price; // Use 'price' instead of 'unitPrice'

        if (item.quantity === 0) {
          cartSlice.caseReducers.removeItem(state, action);
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addItem, removeItem, increaseItem, decreaseItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.fooditemId === id)?.quantity ?? 0;
