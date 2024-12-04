// src/App.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persistor } from './store'; // Redux store and persistor
import { restoreOrders } from './pages/order/orderSlice'; // Action to restore orders
import { setRestaurantId } from './pages/Slice/RestaurantSlice.js'; // Redux action to set restaurantId
import router from './Router/Router.jsx';
import Footer from './components/Footer/Footer';
import { OrderProvider } from './contexts/OrderContext.jsx'; // Custom context for orders

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract restaurantId from the URL query params
    const queryParams = new URLSearchParams(location.search);
    const restaurantIdFromURL = queryParams.get('restaurantId');

    if (restaurantIdFromURL) {
      dispatch(setRestaurantId(restaurantIdFromURL)); // Dispatch to Redux
    } else {
      navigate('/'); // Redirect to error page if restaurantId is missing
    }
  }, [location, dispatch, navigate]);

  useEffect(() => {
    // Restore orders from localStorage
    const persistedData = JSON.parse(localStorage.getItem('persist:root')) || {};
    const orders = persistedData.order ? JSON.parse(persistedData.order).tempOrders : [];
    dispatch(restoreOrders(orders));
  }, [dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <OrderProvider>
        <RouterProvider router={router} />
        <Footer />
      </OrderProvider>
    </PersistGate>
  );
};

export default App;
