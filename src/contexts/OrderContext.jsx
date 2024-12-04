import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const dispatch = useDispatch();
  const restaurantId = useSelector(state => state.restaurant.id); // Assuming restaurantId is in Redux
  const [activeTables, setActiveTablesState] = useState([]);
  const [activeOffers, setActiveOffersState] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        const [tables, offers] = await Promise.all([
          fetchActiveDiningTables(restaurantId),
          fetchActiveOffer(restaurantId),
        ]);

        setActiveTablesState(tables || []);
        setActiveOffersState(offers || []);
        dispatch(setActiveTables(tables || []));
        dispatch(setActiveOffers(offers || []));
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to fetch tables and offers. Please try again later.');
      }
    };

    fetchData();
  }, [dispatch, restaurantId]);

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
            updatedOrders[orderIndex] = data.order;
          } else {
            updatedOrders.push(data.order);
          }

          dispatch(storeOrderTemporarily(data.order));
          dispatch(setOrderDetails(data.order));
          return updatedOrders;
        });
        break;
      default:
        console.log("Unknown socket event type:", data.type);
    }
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders, error, restaurantId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
