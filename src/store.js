import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import userSlice from "./pages/user/userSlice";
import cartSlice from "./pages/cart/cartSlice.js";
import orderSlice from "./pages/order/orderSlice";
import FoodSlice from "./pages/Slice/FoodSlice.js";
import OfferSlice from "./pages/Slice/OfferSlice.js";
import TableSlice from "./pages/Slice/TableSlice.js";

const persistConfig = {
  key: 'root',
  storage,
};

// Combine your reducers into one
const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
  order: orderSlice,
  food: FoodSlice, // Add food reducer
  offer: OfferSlice, // Add offer reducer
  table: TableSlice, // Add table reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Customize the middleware to allow non-serializable values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
