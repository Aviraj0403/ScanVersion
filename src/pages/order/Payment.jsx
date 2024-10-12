import React, { useEffect, useMemo, useState } from 'react';
import { useOrderContext } from '../../contexts/OrderContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import io from 'socket.io-client';
import { addOrderToHistory } from '../user/userSlice';

// Set up the socket connection
const socket = io('http://localhost:4000');

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tempOrders = useSelector(state => state.order.tempOrders);
    const order = tempOrders[tempOrders.length - 1];
    const { activeTables, activeOffers } = useOrderContext();
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        if (!order) {
            console.log("No order found, redirecting...");
            navigate('/order/create');
            return; // Ensure early return if there's no order
        }

        // Listener for payment confirmation
        const paymentConfirmedListener = (transactionId) => {
            console.log('Payment confirmed:', transactionId);
            navigate('/order/confirmation', { state: { transactionId } });
        };

        socket.on('paymentConfirmed', paymentConfirmedListener);

        // Cleanup listener on component unmount
        return () => {
            socket.off('paymentConfirmed', paymentConfirmedListener);
        };
    }, [order, navigate]);

    // Helper functions
    const getTableName = (tableId) => {
        const table = activeTables.find(t => t._id === tableId);
        return table ? table.name : "Unknown Table";
    };

    const getOfferName = (offerId) => {
        const offer = activeOffers.find(o => o._id === offerId);
        return offer ? offer.name : "No Offer";
    };

    const handlePayment = async (paymentMethod) => {
        if (!order) return;

        const transactionId = Math.random().toString(36).substring(2, 15);
        console.log("Transaction ID:", transactionId);
        setLoading(true); // Start loading

        try {
            const response = await fetch('http://localhost:4000/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...order,
                    paymentMethod,
                    transactionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Payment processing failed');
            }

            const result = await response.json();
            dispatch(clearCart());

            const tableName = getTableName(order.selectedTable);
            console.log("T",tableName)
            const restaurantId = order.restaurantId; // Ensure restaurantId is present

            socket.emit('newOrder', {
                orderId: result.orderId,
                transactionId,
                tableId: order.selectedTable,
                restaurantId, // Include restaurantId
                tableName,
                orderDetails: order,
            });

            socket.emit('paymentConfirmed', {
                transactionId,
                tableId: order.selectedTable,
                restaurantId, // Include restaurantId
                customer: order.customer,
                totalPrice: order.totalPrice,
            });

            socket.emit('paymentProcessed', {
                orderId: result.orderId,
                transactionId,
                paymentStatus: 'Paid',
                tableId: order.selectedTable,
                restaurantId, // Include restaurantId
                tableName,
            });

            dispatch(addOrderToHistory({ ...order, transactionId }));
            navigate('/order/confirmation', { state: { transactionId } });
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    if (!order) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    const totalPrice = useMemo(() => order.totalPrice || 0, [order]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Payment for Your Order</h2>
            <h3 className="text-xl font-medium mb-2">Order Summary</h3>
            <div className="mb-4 border-t border-gray-200 pt-4">
                <p><strong>Customer:</strong> {order.customer}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Table:</strong> {getTableName(order.selectedTable)}</p>
                <p><strong>Offer:</strong> {getOfferName(order.selectedOffer)}</p>
                <p className="text-lg font-bold"><strong>Total Price:</strong> {formatCurrency(totalPrice)}</p>
                <h4 className="text-lg font-medium mt-4">Items:</h4>
                <ul className="list-disc list-inside">
                    {order.cart.map((item, index) => (
                        <li key={index} className="flex justify-between py-1">
                            <span>Food Item: {item.name}</span>
                            <span>Quantity: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <h3 className="text-xl font-medium mb-2">Select Payment Method</h3>
            <div className="flex flex-col gap-2">
                {loading ? (
                    <div className="text-center">Processing payment...</div>
                ) : (
                    <>
                        <button
                            onClick={() => handlePayment('Cash')}
                            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-500 transition duration-200"
                        >
                            Pay with Cash
                        </button>
                        <button
                            onClick={() => handlePayment('PayPal')}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-500 transition duration-200"
                        >
                            Pay with PayPal
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Payment;
