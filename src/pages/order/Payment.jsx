import React, { useEffect, useMemo } from 'react';
import { useOrderContext } from '../../contexts/OrderContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import io from 'socket.io-client';
import { addOrderToHistory } from '../user/userSlice';

const socket = io('http://localhost:4000'); // Connect to your WebSocket server

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tempOrders = useSelector((state) => {
        console.log("Current Redux state:", state); // Debugging
        return state.order.tempOrders;
    });
    console.log("Current tempOrders in Payment component:", tempOrders); // Debugging

    const order = tempOrders[tempOrders.length - 1]; // Get the latest order
    console.log("Current order before payment:", order); // Debugging

    const { activeTables, activeOffers } = useOrderContext();

    useEffect(() => {
        if (!order) {
            console.log("No order found, redirecting..."); // Debugging
            navigate('/order/create'); // Redirect if no order found
        }

        // Socket listener for payment confirmation
        socket.on('paymentConfirmed', (transactionId) => {
            console.log('Payment confirmed:', transactionId);
            navigate('/order/confirmation', { state: { transactionId } });
        });

        return () => {
            socket.off('paymentConfirmed'); // Clean up the listener on unmount
        };
    }, [order, navigate]);

    const getTableName = (tableId) => {
        const table = activeTables.find(t => t._id === tableId);
        return table ? table.name : "Unknown Table";
    };

    const getOfferName = (offerId) => {
        const offer = activeOffers.find(o => o._id === offerId);
        return offer ? offer.name : "No Offer";
    };
    const handlePayment = async (paymentMethod) => {
        console.log("Handling payment for method:", paymentMethod);
        if (!order) return; // Prevent proceeding if order is not available

        const transactionId = Math.random().toString(36).substring(2, 15); // Simulated transaction ID
        console.log("Transaction ID:", transactionId); // Debugging

        try {
            console.log("Sending payment request...");
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
            console.log("Payment response:", result); // Debugging
            dispatch(clearCart());

            const tableName = getTableName(order.selectedTable);

            // Emit the newOrder event for notification
            socket.emit('newOrder', {
                orderId: result.orderId, // Order ID returned from the server
                transactionId,
                tableId: order.selectedTable,
                tableName,
                orderDetails: order,
            });

            // Emit payment confirmation for notifications
            socket.emit('paymentConfirmed', {
                transactionId,
                tableId: order.selectedTable,
                customer: order.customer,
                totalPrice: order.totalPrice,
            });

            socket.emit('paymentProcessed', {
                orderId: result.orderId,
                transactionId,
                tableId: order.selectedTable,
                tableName,
            });

            console.log("Emitted newOrder and paymentConfirmed:", {
                orderId: result.orderId,
                transactionId,
                tableId: order.selectedTable,
                tableName,
                orderDetails: order,
            }); // Debugging

            dispatch(addOrderToHistory({ ...order, transactionId })); // Add order to history
            console.log("Order added to history:", { ...order, transactionId }); // Debugging
            navigate('/order/confirmation', { state: { transactionId } });

        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed. Please try again.');
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
            </div>
        </div>
    );
};

export default Payment;
