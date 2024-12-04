// src/App.jsx

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreOrders } from './pages/order/orderSlice'; // Adjust the path as necessary
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import Footer from './components/Footer/footer.jsx'; 
import { OrderProvider } from './contexts/OrderContext.jsx'; // Adjust path as necessary
import { useLocation } from 'react-router-dom'; // Import useLocation

function App() {
    const dispatch = useDispatch();
    const location = useLocation(); // UseLocation hook to access the current route

    // Extract restaurantId from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const restaurantId = queryParams.get('restaurantId'); // Get restaurantId from query string

    useEffect(() => {
        const persistedData = JSON.parse(localStorage.getItem('persist:root')) || {};
        const orders = persistedData.order ? JSON.parse(persistedData.order).tempOrders : [];
        dispatch(restoreOrders(orders));
    }, [dispatch]);

    return (
        <PersistGate loading={null} persistor={persistor}>
            <OrderProvider restaurantId={restaurantId}>
                {/* Other components */}
                <Footer />
            </OrderProvider>
        </PersistGate>
    );
}

export default App;
