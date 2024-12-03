// src/store.js or wherever your root reducer is located
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './pages/user/userSlice';
import cartSlice from './pages/cart/cartSlice';
import orderSlice from './pages/order/orderSlice';
import foodSlice from './pages/Slice/FoodSlice';
import offerSlice from './pages/Slice/OfferSlice';
import tableSlice from './pages/Slice/TableSlice';
import restaurantSlice from './pages/Slice/RestaurantSlice';  // Import the restaurantSlice

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine your reducers into one
const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
  order: orderSlice,
  food: foodSlice,
  offer: offerSlice,
  table: tableSlice,
  restaurant: restaurantSlice,  // Add restaurantSlice to the rootReducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for the serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode
});

// Create a persistor for the store
const persistor = persistStore(store);

// Export store and persistor
export { store, persistor };
