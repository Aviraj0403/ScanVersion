import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';  // For getting `restaurantId` from URL
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Get restaurantId from Redux store
  const restaurantIdFromRedux = useSelector(state => state.restaurant.id);
  
  // Get restaurantId from URL using React Router's useParams or useLocation for query string
  const { restaurantId: restaurantIdFromUrl } = useParams();
  const location = useLocation();  // To access the full URL

  // Extract restaurantId from the query string (e.g., ?restaurantId=...)
  const urlParams = new URLSearchParams(location.search);
  const restaurantIdFromQuery = urlParams.get('restaurantId');
  
  // Use restaurantId from Redux, URL path, or query string (priority: query string > path > Redux)
  const restaurantId = restaurantIdFromQuery || restaurantIdFromUrl || restaurantIdFromRedux;

  console.log("restaurantId:", restaurantId);  // Debug the value of restaurantId
  console.log("restaurantIdFromUrl:", restaurantIdFromUrl);
  console.log("restaurantIdFromQuery:", restaurantIdFromQuery);
  console.log("restaurantId (final):", restaurantId);

  const [activeTables, setActiveTablesState] = useState([]);
  const [activeOffers, setActiveOffersState] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [error, setError] = useState(null);

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
