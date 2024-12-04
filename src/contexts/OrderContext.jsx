// src/contexts/OrderContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children, restaurantId }) => {
  const dispatch = useDispatch();
  const [activeTables, setActiveTablesState] = useState([]);
  const [activeOffers, setActiveOffersState] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [error, setError] = useState(null); // Error state for fetching data

  useEffect(() => {
    if (!restaurantId) return; // Prevent fetching if no restaurantId is provided

    const fetchData = async () => {
      try {
        const [tables, offers] = await Promise.all([
          fetchActiveDiningTables(restaurantId),
          fetchActiveOffer(restaurantId),
        ]);

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
  }, [dispatch, restaurantId]); // Fetch when restaurantId changes

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

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      // Ensure socket cleanup here if your `useSocket` hook supports cleanup
    };
  }, []);

  if (error) {
    // Handle error state by displaying it to the user or redirecting
    return <div>Error: {error}</div>;
  }

  return (
    <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders, error, restaurantId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
