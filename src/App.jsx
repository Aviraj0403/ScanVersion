// src/App.js

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { restoreOrders } from './pages/order/orderSlice'; // Adjust the path as necessary
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx"; 
import Footer from "./components/Footer/footer.jsx"; 
import { OrderProvider } from './contexts/OrderContext.jsx'; // Adjust path as necessary

function App() {
    const dispatch = useDispatch();
    // const restaurantId = useSelector(state => state.restaurant.id);
    // console.log(restaurantId)
    const { restaurantId } = useParams(); // Get restaurantId from URL params
  
    console.log('Restaurant ID from URL:', restaurantId);
    useEffect(() => {
        const persistedData = JSON.parse(localStorage.getItem('persist:root')) || {};
        const orders = persistedData.order ? JSON.parse(persistedData.order).tempOrders : [];
        dispatch(restoreOrders(orders));
    }, [dispatch]);

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
