import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(), // Load initial state from localStorage
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.cart.find(item => item.fooditemId === action.payload.fooditemId);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.cart.push({ ...action.payload, totalPrice: action.payload.price * action.payload.quantity });
      }

      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter(item => item.fooditemId !== action.payload);
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    increaseItem: (state, action) => {
      const item = state.cart.find(item => item.fooditemId === action.payload);
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price;
      }
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    decreaseItem: (state, action) => {
      const item = state.cart.find(item => item.fooditemId === action.payload);
      if (item) {
        item.quantity--;
        item.totalPrice = item.quantity * item.price;

        if (item.quantity === 0) {
          cartSlice.caseReducers.removeItem(state, action);
        }
      }
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
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
