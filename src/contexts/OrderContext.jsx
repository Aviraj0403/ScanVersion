import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children, restaurantId }) => {
  console.log("ordercontext",restaurantId)
    const dispatch = useDispatch();
    const [activeTables, setActiveTablesState] = useState([]);
    const [activeOffers, setActiveOffersState] = useState([]);
    const [tempOrders, setTempOrders] = useState([]);
    const [error, setError] = useState(null); // To handle error state for fetching data

    useEffect(() => {
        // Function to fetch the initial data (tables & offers)
        const fetchData = async () => {
            try {
                // Fetch data for the given restaurantId
                const tables = await fetchActiveDiningTables(restaurantId);
                const offers = await fetchActiveOffer(restaurantId);
                
                // Logging fetched data for debugging
                console.log("Fetched Active Tables:", tables);
                console.log("Fetched Active Offers:", offers);

                // Set state only if valid data is fetched
                setActiveTablesState(tables || []);
                setActiveOffersState(offers || []);
                
                // Dispatch actions to update Redux store
                dispatch(setActiveTables(tables || []));
                dispatch(setActiveOffers(offers || []));
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                setError('Failed to fetch tables and offers. Please try again later.'); // Set error state
            }
        };

        fetchData();
    }, [dispatch, restaurantId]);  // Adding restaurantId to the dependency array

    // Use socket connection to handle real-time updates
    useSocket((data) => {
        if (data.type === 'tablesUpdated') {
            setActiveTablesState(data.tables);
            dispatch(setActiveTables(data.tables));
        } else if (data.type === 'offersUpdated') {
            setActiveOffersState(data.offers);
            dispatch(setActiveOffers(data.offers));
        } else if (data.type === 'orderUpdated') {
            setTempOrders((prevOrders) => {
                const updatedOrders = [...prevOrders];
                const orderIndex = updatedOrders.findIndex(order => order.id === data.order.id);

                if (orderIndex >= 0) {
                    updatedOrders[orderIndex] = data.order; // Update existing order
                } else {
                    updatedOrders.push(data.order); // Add new order
                }

                dispatch(storeOrderTemporarily(data.order)); // Dispatch temporary order
                dispatch(setOrderDetails(data.order)); // Dispatch complete order details
                return updatedOrders;
            });
        }
    });

    // Clean up the socket connection when the component unmounts
    useEffect(() => {
        return () => {
            // Clean up the socket connection here (if your hook supports cleanup)
        };
    }, []);

    return (
        <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders, error }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => useContext(OrderContext);
