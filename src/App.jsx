import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreOrders } from './pages/order/orderSlice'; // Adjust the path as necessary
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { RouterProvider } from 'react-router-dom';
import router from './Router/Router.jsx'; 
import Footer from './components/Footer/footer.jsx'; 
import { OrderProvider } from './contexts/OrderContext.jsx'; // Adjust path as necessary

function App() {
  const dispatch = useDispatch();

  // Get restaurantId from URL params using useParams()
  const { restaurantId: urlRestaurantId } = useParams();
  
  // Get restaurantId from Redux store using useSelector
  const storedRestaurantId = useSelector((state) => state.restaurant.id);

  // Fallback logic: use URL if available, otherwise fallback to Redux
  const restaurantId = urlRestaurantId || storedRestaurantId;

  console.log('Restaurant ID from URL:', urlRestaurantId); // Debugging URL restaurantId
  console.log('Restaurant ID from Redux:', storedRestaurantId); // Debugging Redux restaurantId
  console.log('Final Restaurant ID:', restaurantId); // Final used restaurantId

  useEffect(() => {
    const persistedData = JSON.parse(localStorage.getItem('persist:root')) || {};
    const orders = persistedData.order ? JSON.parse(persistedData.order).tempOrders : [];
    dispatch(restoreOrders(orders)); // Restore orders if any
  }, [dispatch]);

  if (!restaurantId) {
    return <p>Loading...</p>; // Show a loading state if restaurantId is not available
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <OrderProvider restaurantId={restaurantId}>
        <RouterProvider router={router} />
        <Footer />
      </OrderProvider>
    </PersistGate>
  );
}

export default App;
