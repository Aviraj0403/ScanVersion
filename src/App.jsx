import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreOrders } from './pages/order/orderSlice'; // Adjust the path as necessary
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import Footer from "./components/Footer/footer.jsx"; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const persistedData = JSON.parse(localStorage.getItem('persist:root')) || {};
    const orders = persistedData.order ? JSON.parse(persistedData.order).tempOrders : [];
    dispatch(restoreOrders(orders));
  }, [dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      <Footer />
    </PersistGate>
  );
}

export default App;
