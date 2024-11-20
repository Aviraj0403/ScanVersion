import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTables, setActiveOffers, storeOrderTemporarily, setOrderDetails } from '../pages/order/orderSlice';
import { fetchActiveDiningTables, fetchActiveOffer } from '../services/apiRestaurant';
import useSocket from '../hooks/useSocket';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [activeTables, setActiveTablesState] = useState([]);
    const [activeOffers, setActiveOffersState] = useState([]);
    const [tempOrders, setTempOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tables = await fetchActiveDiningTables();
                const offers = await fetchActiveOffer();
                
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
            }
        };

        fetchData();
    }, [dispatch]);

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

    return (
        <OrderContext.Provider value={{ activeTables, activeOffers, tempOrders }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => useContext(OrderContext);
