import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : []; // Ensure fallback to empty array
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return []; // Fallback if parsing fails
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(), // Load initial state from localStorage
  },
  reducers: {
    addItem: (state, action) => {
      const { fooditemId, quantity, price } = action.payload;
      const existingItem = state.cart.find(item => item.fooditemId === fooditemId);

      if (existingItem) {
        // Update existing item quantity and totalPrice
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * price;
      } else {
        // Add new item to cart
        state.cart.push({
          ...action.payload,
          totalPrice: price * quantity, // Calculate initial totalPrice
        });
      }

      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeItem: (state, action) => {
      const fooditemId = action.payload;
      state.cart = state.cart.filter(item => item.fooditemId !== fooditemId);

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

        // If quantity becomes 0, remove the item from the cart
        if (item.quantity === 0) {
          cartSlice.caseReducers.removeItem(state, action); // Call removeItem directly
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

// Get total quantity in the cart (safe reduce operation)
export const getTotalCartQuantity = (state) =>
  Array.isArray(state.cart.cart) ? state.cart.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

// Get total price in the cart (safe reduce operation)
export const getTotalCartPrice = (state) =>
  Array.isArray(state.cart.cart) ? state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0) : 0;

// Get the current quantity of an item by its fooditemId
export const getCurrentQuantityById = (id) => (state) =>
  Array.isArray(state.cart.cart)
    ? state.cart.cart.find((item) => item.fooditemId === id)?.quantity ?? 0
    : 0;
