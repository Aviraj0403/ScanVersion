import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

// Create context for orders
const OrderContext = createContext();

export const OrderProvider = ({ children, restaurantId }) => {
  const dispatch = useDispatch();
  const [activeTables, setActiveTablesState] = useState([]);
  const [activeOffers, setActiveOffersState] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [error, setError] = useState(null); // To handle error state for fetching data

  // Fetch the initial data (tables and offers) for the given restaurant
  useEffect(() => {
    if (!restaurantId) return; // Prevent fetching if no restaurantId is provided

    const fetchData = async () => {
      try {
        const [tables, offers] = await Promise.all([
          fetchActiveDiningTables(restaurantId),
          fetchActiveOffer(restaurantId),
        ]);

        // Log fetched data for debugging
        console.log("Fetched Active Tables:", tables);
        console.log("Fetched Active Offers:", offers);

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
  }, [dispatch, restaurantId]); // Adding restaurantId to the dependency array ensures fetchData runs when restaurantId changes

  // Use socket connection to handle real-time updates
  useSocket((data) => {
    switch (data.type) {
      case 'tablesUpdated':
        setActiveTablesState(data.tables);
        dispatch(setActiveTables(data.tables));
        break;
      case 'offersUpdated':
        setActiveOffersState(data.offers);
        dispatch(setActiveOffers(data.offers));
        break;
      case 'orderUpdated':
        setTempOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          const orderIndex = updatedOrders.findIndex((order) => order.id === data.order.id);

          if (orderIndex >= 0) {
            updatedOrders[orderIndex] = data.order; // Update existing order
          } else {
            updatedOrders.push(data.order); // Add new order
          }

          dispatch(storeOrderTemporarily(data.order)); // Dispatch temporary order
          dispatch(setOrderDetails(data.order)); // Dispatch complete order details
          return updatedOrders;
        });
        break;
      default:
        console.log("Unknown socket event type:", data.type);
    }
  });

  // Clean up the socket connection when the component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any socket listeners here if needed (depending on your useSocket hook)
      console.log("Cleanup socket connection");
    };
  }, []);

  if (error) {
    // Handle error state by displaying it to the user or redirecting
    return <div>Error: {error}</div>;
  }

  return (
    <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders, error }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
