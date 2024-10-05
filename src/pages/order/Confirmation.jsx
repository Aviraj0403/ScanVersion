// Confirmation.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { transactionId } = location.state || {};

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Payment Confirmation</h2>
      {transactionId ? (
        <p>Your transaction ID is: <strong>{transactionId}</strong></p>
      ) : (
        <p>No transaction found.</p>
      )}
    </div>
  );
};

export default Confirmation;
