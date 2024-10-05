import React, { useEffect } from 'react';
import io from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../cart/cartSlice';

const socket = io('http://localhost:4000'); // Connect to your WebSocket server

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.order.tempOrders[state.order.tempOrders.length - 1]);
  const activeTables = useSelector((state) => state.order.activeTables) || [];
  const activeOffers = useSelector((state) => state.order.activeOffers) || [];

  useEffect(() => {
    socket.on('paymentConfirmed', (transactionId) => {
      console.log('Payment confirmed:', transactionId);
      navigate('/order/confirmation', { state: { transactionId } });
    });

    return () => {
      socket.off('paymentConfirmed');
    };
  }, [navigate]);

  if (!order) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const getTableName = (tableId) => {
    const table = activeTables.find((table) => table._id === tableId);
    return table ? table.name : "Unknown";
  };

  const getOfferName = (offerId) => {
    const offer = activeOffers.find((offer) => offer._id === offerId);
    return offer ? offer.name : "None";
  };

  const handlePayment = async (paymentMethod) => {
    const transactionId = Math.random().toString(36).substring(2, 15);
    
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
      socket.emit('paymentProcessed', { transactionId, orderId: result.orderId, tableId: order.selectedTable });
      navigate('/order/confirmation', { state: { transactionId } });

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const totalPrice = order.totalPrice || 0;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Payment for Your Order</h2>
      <h3 className="text-xl font-medium mb-2">Order Summary</h3>
      <div className="mb-4 border-t border-gray-200 pt-4">
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Table:</strong> {getTableName(order.selectedTable)}</p>
        <p><strong>Offer:</strong> {getOfferName(order.selectedOffer)}</p>
        <p className="text-lg font-bold"><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
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
        <button onClick={() => handlePayment('Cash')} className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-500 transition duration-200">
          Pay with Cash
        </button>
        <button onClick={() => handlePayment('PayPal')} className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-500 transition duration-200">
          Pay with PayPal
        </button>
      </div>
    </div>
  );
};

export default Payment;
