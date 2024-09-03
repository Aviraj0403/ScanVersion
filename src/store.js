import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./pages/user/userSlice";
import cartSlice from "./pages/cart/cartSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice
  },
});

export default store;
