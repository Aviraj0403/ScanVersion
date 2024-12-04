import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setActiveTables,
  setActiveOffers,
  storeOrderTemporarily,
  setOrderDetails,
} from '../pages/order/orderSlice';
import { fetchFoods } from '../pages/Slice/FoodSlice'; // Import the fetchFoods action
import { fetchOffers } from '../pages/Slice/OfferSlice'; // Import the fetchOffers action
import { fetchTables } from '../pages/Slice/TableSlice'; // Import the fetchTables action
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children, restaurantId }) => {
  const dispatch = useDispatch();
  const [activeTables, setActiveTablesState] = useState([]);
  const [activeOffers, setActiveOffersState] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tables, offers, and food data when the restaurantId changes
  useEffect(() => {
    if (!restaurantId) return; // Exit early if no restaurantId is provided

    const fetchData = async () => {
      try {
        setLoading(true);
        // Dispatch actions to fetch tables, offers, and foods based on restaurantId
        dispatch(fetchTables(restaurantId));
        dispatch(fetchOffers(restaurantId));
        dispatch(fetchFoods(restaurantId));

        // Set state for active tables and offers (this can be done via redux)
        dispatch(setActiveTables([])); // Fetch active tables
        dispatch(setActiveOffers([])); // Fetch active offers

        setLoading(false);  // Done with loading
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, restaurantId]);

  // Use socket connection to handle real-time updates
  useSocket((data) => {
    if (data.restaurantId !== restaurantId) return; // Ensure updates are only for the current restaurant

    if (data.type === 'tablesUpdated') {
      dispatch(setActiveTables(data.tables));  // Dispatch updated tables to Redux
      setActiveTablesState(data.tables);
    } else if (data.type === 'offersUpdated') {
      dispatch(setActiveOffers(data.offers));  // Dispatch updated offers to Redux
      setActiveOffersState(data.offers);
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

  // Display loading or error states
  if (loading) {
    return <p>Loading order data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders, foodData }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
